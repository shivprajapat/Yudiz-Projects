import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import { userProfileIcon } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import { convertDateToLocaleString } from 'shared/utils'
import CommentList from '../comment-list'
import CommentForm from '../comment-form'
import PermissionProvider from 'shared/components/permission-provider'

const Comment = ({ comment, communityAssetId, communityId, parentId, handleLoadMore, handleDeleteComment }) => {
  const [areChildrenHidden, setAreChildrenHidden] = useState(true)
  const [isReplying, setIsReplying] = useState(false)

  return (
    <div className="single-comment">
      <div className="single-comment-item">
        <div className="single-comment-item-img">
          <img src={comment?.creator?.profilePicUrl || userProfileIcon} className="emoji" alt="" />
        </div>
        <div className="single-comment-info">
          <Link to={allRoutes.creatorCollected(comment?.creator?.id)}>
            {`${comment?.creator?.firstName} ${comment?.creator?.lastName}`}
          </Link>
          <span>{convertDateToLocaleString(comment?.updatedAt)}</span>
          <p>{comment?.text}</p>

          {!comment?.parentId && (
            <Button type="button" className="reply-btn" onClick={() => setIsReplying((prev) => !prev)}>
              reply
            </Button>
          )}

          {comment?.replies?.length > 0 && (
            <Button type="button" className="reply-btn m-2" onClick={() => setAreChildrenHidden((prev) => !prev)}>
              {areChildrenHidden ? 'show replies' : 'hide replies'}
            </Button>
          )}
          <PermissionProvider>
            <Button type="button" className="reply-btn m-2" onClick={() => handleDeleteComment(comment.id)}>
              delete
            </Button>
          </PermissionProvider>

          {isReplying && (
            <CommentForm
              autoFocus
              communityAssetId={communityAssetId}
              communityId={communityId}
              parentId={comment?.id}
              closeCommentForm={() => setIsReplying(false)}
            />
          )}
        </div>
      </div>
      {comment?.replies?.length > 0 && !areChildrenHidden && (
        <div className="reply-section">
          <CommentList
            comments={comment?.replies}
            communityAssetId={communityAssetId}
            communityId={communityId}
            parentId={comment?.id}
            hasMore={!comment?.replyCount ? false : comment?.replyCount > comment?.replies?.length}
            handleLoadMore={handleLoadMore}
          />
        </div>
      )}
    </div>
  )
}
Comment.propTypes = {
  comment: PropTypes.object,
  communityAssetId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  communityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleLoadMore: PropTypes.func,
  handleDeleteComment: PropTypes.func
}
export default Comment
