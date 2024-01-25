import React, { useEffect, useRef } from 'react'
import { Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { EyeIcon, LikeIcon, MessageIcon } from 'assets/images/icon-components/icons'
import { likePost, unLikePost } from 'modules/likePosts/redux/service'

const PostFooter = ({ postDetails }) => {
  const userId = localStorage.getItem('userId')
  const dispatch = useDispatch()
  const likeRef = useRef()
  const likeCountDataRef = useRef({ isLiked: !!postDetails?.likedByLoggedInUser, count: Number(postDetails?.likeCount) })

  useEffect(() => {
    if (postDetails?.likedByLoggedInUser) {
      likeRef.current.classList.add('active')
    }
  }, [])

  const handleLike = () => {
    if (!userId) return
    if (likeCountDataRef?.current?.isLiked) {
      likeRef.current.classList.remove('active')
      likeCountDataRef.current = { isLiked: false, count: likeCountDataRef.current.count - 1 }
      dispatch(unLikePost({ communityAssetId: postDetails.id }))
    } else {
      likeRef.current.classList.add('active')
      likeCountDataRef.current = { isLiked: true, count: likeCountDataRef.current.count + 1 }
      dispatch(
        likePost({
          communityAssetId: postDetails?.id,
          communityId: postDetails?.communityId,
          userId: userId
        })
      )
    }
  }

  return (
    <div className="post-inner">
      <Col lg={4} md={4}>
        <div className="social-link">
          <button ref={likeRef} onClick={handleLike} disabled={!userId}>
            <LikeIcon /> <p>{likeCountDataRef?.current?.count || 0}</p>
          </button>
          <button disabled>
            <MessageIcon />
            <p>{postDetails?.commentCount || 0}</p>
          </button>
          <button disabled>
            <EyeIcon />
            <p>{postDetails?.viewCount || 0}</p>
          </button>
        </div>
      </Col>
    </div>
  )
}
PostFooter.propTypes = {
  postDetails: PropTypes.object
}
export default PostFooter
