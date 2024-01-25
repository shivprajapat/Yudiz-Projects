import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import './style.scss'
import { shareIcon, userImg } from 'assets/images'
import { LikeIcon, MessageIcon, EyeIcon } from 'assets/images/icon-components/icons'
import ShareSocialMedia from 'shared/components/share-social-media'
import { convertDateToLocaleString } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'
import { likePost, unLikePost } from 'modules/likePosts/redux/service'

const SingleCommunityPost = ({ post }) => {
  const userId = localStorage.getItem('userId')
  const dispatch = useDispatch()
  const [share, setShare] = useState(false)
  const likeRef = useRef()
  const likeCountDataRef = useRef({ isLiked: !!post?.likedByLoggedInUser, count: Number(post?.likeCount) })

  useEffect(() => {
    if (post?.likedByLoggedInUser) {
      likeRef.current.classList.add('active')
    }
  }, [])

  const handleShare = () => {
    setShare(!share)
  }

  const handleLike = () => {
    if (!userId) return
    if (likeCountDataRef?.current?.isLiked) {
      likeRef.current.classList.remove('active')
      likeCountDataRef.current = { isLiked: false, count: likeCountDataRef.current.count - 1 }
      dispatch(unLikePost({ communityAssetId: post.id }))
    } else {
      likeRef.current.classList.add('active')
      likeCountDataRef.current = { isLiked: true, count: likeCountDataRef.current.count + 1 }
      dispatch(
        likePost({
          communityAssetId: post?.id,
          communityId: post?.communityId,
          userId: userId
        })
      )
    }
  }
  return (
    <>
      {share && (
        <ShareSocialMedia
          show={share}
          handleClose={handleShare}
          url={`${window.location.origin}${allRoutes.postDetails(post?.id)}`}
          asset={post?.thumbNailUrl}
        />
      )}

      <Col xxl={4} lg={6} md={12} className="card-space">
        <div className="single-item">
          <Card>
            <div className="card-images">
              <Card.Img variant="top" src={post?.thumbNailUrl} />
            </div>
            <OverlayTrigger placement="top" delay={{ show: 250, hide: 250 }} overlay={<Tooltip id="button-tooltip">Share</Tooltip>}>
              <button className="share-btn" onClick={handleShare}>
                <img src={shareIcon} alt="" />
              </button>
            </OverlayTrigger>

            <Card.Body className="user-link">
              <div className="user-txt">
                <Link to={allRoutes.creatorCollected(post?.creator?.id)} className="user-creator-box">
                  <img src={post?.creator?.profilePicUrl || userImg} />
                  <span className="user-creator">{post?.creator?.userName}</span>
                </Link>
                <div className="d-community">
                  <div>in</div>
                  <Link to={allRoutes.editViewCommunity(post?.community?.id)}>{post?.community?.name}</Link>
                </div>
              </div>
              <span className="days">{convertDateToLocaleString(post?.updatedAt)}</span>
            </Card.Body>
            <Card.Body>
              <Card.Title>
                <Link to={allRoutes.postDetails(post?.id)}>{post?.title}</Link>
              </Card.Title>
              <div className="post-description">
                <p>{post?.description}</p>
              </div>
            </Card.Body>
            <Card.Body className="social-link">
              <Card.Link ref={likeRef} onClick={handleLike} disabled={!userId}>
                <LikeIcon /> <p>{likeCountDataRef?.current?.count || 0}</p>
              </Card.Link>
              <Card.Link as={Link} to={allRoutes.postDetails(post?.id)}>
                <MessageIcon />
                <p>{post?.commentCount || 0}</p>
              </Card.Link>
              <Card.Link>
                <EyeIcon />
                <p>{post?.viewCount || 0}</p>
              </Card.Link>
            </Card.Body>
            <Link to={allRoutes.postDetails(post?.id)} className="overlay-link" />
          </Card>
        </div>
      </Col>
    </>
  )
}
SingleCommunityPost.propTypes = {
  post: PropTypes.object
}
export default SingleCommunityPost
