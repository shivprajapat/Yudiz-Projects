import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'

import { userImg } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import { followCommunity, unFollowCommunity } from 'modules/follower/redux/service'

const SingleCommunityList = ({ community, type }) => {
  const communityUpdated = !type || type === 'regular' ? community.community : community
  const communityId = community.id
  const navigate = useNavigate()
  const followRef = useRef()
  const followerCountRef = useRef()
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
      followRef.current.classList.add('black-btn')
    } else if (type === 'popular') {
      followRef.current.innerHTML = labels.follow
      followRef.current.classList.add('black-btn')
    } else {
      followRef.current.innerHTML = labels.unFollow
      followRef.current.classList.add('grey-btn')
    }
  }, [])

  const handleCommunityChange = () => {
    if (type === 'own') {
      navigate(allRoutes.editViewCommunity(communityId))
    } else if (type === 'popular' || type === 'regular' || !type) {
      if (followRef.current.innerHTML === labels.follow) {
        followerCountRef.current = followerCountRef.current + 1
        followRef.current.innerHTML = labels.unFollow
        followRef.current.classList.replace('black-btn', 'grey-btn')
        dispatch(followCommunity({ userId: userId, communityId: communityId }))
      } else if (followRef.current.innerHTML === labels.unFollow) {
        followerCountRef.current = followerCountRef.current - 1
        followRef.current.innerHTML = labels.follow
        followRef.current.classList.replace('grey-btn', 'black-btn')
        dispatch(unFollowCommunity(communityId))
      }
    }
  }

  return (
    <div className="item_box">
      <Link className="item-user-img" to={allRoutes.editViewCommunity(communityUpdated?.id)}>
        <img src={communityUpdated?.photo || userImg} alt="user-img" className="img-fluid" />
        <div className="d-flex flex-column">
          <span className="user-id">{communityUpdated?.name}</span>
          <span className="follower">{followerCountRef.current || 0} Followers</span>
        </div>
      </Link>

      <Button className="btn" onClick={handleCommunityChange} ref={followRef}></Button>
    </div>
  )
}

SingleCommunityList.propTypes = {
  community: PropTypes.object,
  id: PropTypes.string,
  type: PropTypes.string
}

export default SingleCommunityList
