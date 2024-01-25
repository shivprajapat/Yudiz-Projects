import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

import Comment from '../comment'
import { deleteComment } from 'modules/comments/redux/service'
import { useDispatch } from 'react-redux'
import ConfirmationModal from 'shared/components/confirmation-modal'

const CommentList = ({ comments, communityAssetId, communityId, parentId, hasMore, handleLoadMore }) => {
  const dispatch = useDispatch()
  const [deleteCommentId, setDeleteComment] = useState(null)
  const [show, setShow] = useState(false)

  const handleConfirmation = () => {
    dispatch(
      deleteComment(
        !!parentId, deleteCommentId, parentId,
        () => {
          setDeleteComment(null)
          setShow(false)
        }
      )
    )
  }

  const loadMorePagination = () => {
    if (parentId) {
      handleLoadMore(parentId)
    } else handleLoadMore()
  }
  const handleDeleteComment = (id) => {
    setDeleteComment(id)
    setShow(true)
  }

  const hideConfirmation = () => {
    setShow(false)
    setDeleteComment(null)
  }

  return (
    <>
      {comments?.length > 0 &&
        comments?.map((comment) => (
          <div key={comment.id}>
            <Comment
              comment={comment}
              communityAssetId={communityAssetId}
              communityId={communityId}
              parentId={parentId}
              handleLoadMore={handleLoadMore}
              handleDeleteComment={handleDeleteComment}
            />
          </div>
        ))}
      {hasMore && (
        <div className={`${parentId ? 'replied-load-more' : 'load-more'}`}>
          <Button className="white-btn" onClick={loadMorePagination}>
            Load more
          </Button>
        </div>
      )}

      {show && (
        <ConfirmationModal
          show={show}
          handleConfirmation={handleConfirmation}
          handleClose={hideConfirmation}
        />
      )}

    </>
  )
}
CommentList.propTypes = {
  comments: PropTypes.array,
  communityAssetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  communityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hasMore: PropTypes.bool,
  handleLoadMore: PropTypes.func
}
export default CommentList
