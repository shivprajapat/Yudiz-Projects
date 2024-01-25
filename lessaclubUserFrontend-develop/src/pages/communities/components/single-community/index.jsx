import React, { useEffect, useRef } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'

import { userImg } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import { followCommunity, unFollowCommunity } from 'modules/follower/redux/service'

const SingleCommunity = ({ community, type }) => {
  const communityUpdated = !type || type === 'regular' ? community.community : community
  const communityId = community.id
  const followRef = useRef()
  const followerCountRef = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')

  const labels = {
    follow: useIntl().formatMessage({ id: 'follow' }),
    unFollow: useIntl().formatMessage({ id: 'unFollow' }),
    view: useIntl().formatMessage({ id: 'view' })
  }

  useEffect(() => {
    followerCountRef.current = Number(communityUpdated?.followerCount) || 0
    if (type === 'own') {
      followRef.current.innerHTML = labels.view
    } else if (type === 'popular') {
      followRef.current.innerHTML = labels.follow
    } else {
      followRef.current.innerHTML = labels.unFollow
    }
  }, [])

  const handleCommunityChange = () => {
    if (type === 'own') {
      navigate(allRoutes.editViewCommunity(communityId))
    } else if (type === 'popular' || type === 'regular' || !type) {
      if (followRef.current.innerHTML === labels.follow) {
        followerCountRef.current = followerCountRef.current + 1
        followRef.current.innerHTML = labels.unFollow
        dispatch(followCommunity({ userId: userId, communityId: communityId }))
      } else if (followRef.current.innerHTML === labels.unFollow) {
        followerCountRef.current = followerCountRef.current - 1
        followRef.current.innerHTML = labels.follow
        dispatch(unFollowCommunity(communityId))
      }
    }
  }
  return (
    <>
      <div className="single-community">
        <div className="single-community-box">
          <div className="single-community-box-img">
            <img src={communityUpdated?.photo || userImg} alt="userImg" className="img-fluid" />
          </div>
        </div>
        <div className="single-community-right">
          <div className="content">
            <div className="content-head">
              <h6>{communityUpdated?.name}</h6>
              <div className="content-follower">
                <span className="count">{followerCountRef.current || 0} Followers</span>
                <span>{communityUpdated?.postCount || 0} Posts</span>
              </div>
            </div>
            <p>{communityUpdated?.description}</p>
          </div>
          <Button type="submit" className="white-btn" ref={followRef} onClick={handleCommunityChange}></Button>
        </div>
        <Link to={allRoutes.editViewCommunity(communityUpdated.id)} className="overlay-link" />
      </div>
    </>
  )
}
SingleCommunity.propTypes = {
  community: PropTypes.object,
  type: PropTypes.string
}
export default SingleCommunity
