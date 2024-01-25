import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import CommentForm from '../comment-form'
import CommentList from '../comment-list'
import { getComments } from 'modules/comments/redux/service'

const CommentSection = ({ communityId }) => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10, communityAssetId: id })
  const [requestParamsChild, setRequestParamsChild] = useState()
  const [comments, setComments] = useState()

  const commentStore = useSelector((state) => state.comments.getComments)

  useEffect(() => {
    if (requestParams) dispatch(getComments(requestParams))
  }, [requestParams])

  useEffect(() => {
    if (commentStore?.communityAssetComment) {
      setComments(commentStore?.communityAssetComment)
    }
  }, [commentStore])

  useEffect(() => {
    if (requestParamsChild) {
      dispatch(
        getComments({ ...requestParamsChild, parent: null, page: requestParamsChild?.parent?.[requestParamsChild?.parentId]?.page || 1 })
      )
    }
  }, [requestParamsChild])

  const handleLoadMore = (parentId) => {
    if (parentId) {
      setRequestParamsChild({
        ...requestParamsChild,
        parentId,
        parent: {
          ...requestParamsChild?.parent,
          [parentId]: {
            page: requestParamsChild?.parent[parentId]?.page ? requestParamsChild?.parent[parentId]?.page + 1 : 1
          }
        },
        perPage: requestParamsChild?.perPage || 10
      })
    } else setRequestParams({ ...requestParams, page: requestParams.page + 1 })
  }

  return (
    <>
      <CommentForm communityAssetId={id} communityId={communityId} parentId={null} />
      {comments && (
        <CommentList
          comments={comments}
          communityAssetId={id}
          communityId={communityId}
          parentId={null}
          hasMore={requestParams?.page < commentStore?.metaData?.totalPages && commentStore?.metaData?.totalItems > 10}
          handleLoadMore={handleLoadMore}
        />
      )}
    </>
  )
}
CommentSection.propTypes = {
  communityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}
export default CommentSection
