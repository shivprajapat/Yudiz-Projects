import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'

import './style.scss'
import AddEditCommunityModal from 'shared/components/add-edit-community-modal'
import { getMyCommunities, getPopularCommunities } from 'modules/communities/redux/service'
import SingleCommunityList from '../single-community-list'
import { allRoutes } from 'shared/constants/allRoutes'
import { getFollowedCommunity } from 'modules/follower/redux/service'

const CommunitiesList = ({ title, btnTxt, btnCls, type }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  const [show, setShow] = useState(false)
  const [communities, setCommunities] = useState()

  const myCommunitiesStore = useSelector((state) => state.communities.myCommunities)
  const popularCommunitiesStore = useSelector((state) => state.communities.popularCommunities)
  const getFollowedCommunityStore = useSelector((state) => state.follower.getFollowedCommunity)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (type === 'own') {
      dispatch(getMyCommunities({ createdBy: userId, page: 1, perPage: 5 }))
    } else if (type === 'popular') {
      dispatch(getPopularCommunities({ page: 1, perPage: 5, sortColumn: 'followerCount', sortOrder: -1 }))
    } else {
      dispatch(getFollowedCommunity({ page: 1, perPage: 5, userId: userId }))
    }
  }, [searchParams])

  useEffect(() => {
    if (myCommunitiesStore?.community && type === 'own') {
      setCommunities(myCommunitiesStore?.community)
    }
  }, [JSON.stringify(myCommunitiesStore)])

  useEffect(() => {
    if (popularCommunitiesStore?.community && type === 'popular') {
      setCommunities(popularCommunitiesStore?.community)
    }
  }, [JSON.stringify(popularCommunitiesStore)])

  useEffect(() => {
    if (getFollowedCommunityStore?.communityFollower && (!type || type === 'regular')) {
      setCommunities(getFollowedCommunityStore?.communityFollower)
    }
  }, [getFollowedCommunityStore])

  const handleClose = () => setShow(!show)

  const handleCommunities = () => {
    if (type === 'own') {
      setShow(true)
    } else if (type === 'popular') {
      navigate({
        pathname: allRoutes.communities,
        search: createSearchParams({
          type: type
        }).toString()
      })
    } else {
      navigate(allRoutes.communities)
    }
  }

  return (
    <>
      {show && <AddEditCommunityModal handleClose={handleClose} show={show} />}

      <div className="item">
        <div className="item-head">
          <h6>{title}</h6>
          <Button className={`${btnCls} btn ${type !== 'own' && communities?.length === 0 ? 'd-none' : ''}`} onClick={handleCommunities}>
            {btnTxt}
          </Button>
        </div>
        {/* scroll class name create-community */}
        <div className="items-box">
          {communities?.length ? (
            communities.map(
              (community, index) => index <= 4 && <SingleCommunityList key={community.id} community={community} type={type} />
            )
          ) : (
            <div className="no-community">No Community</div>
          )}
        </div>
      </div>
    </>
  )
}

CommunitiesList.propTypes = {
  handleCommunities: PropTypes.func,
  title: PropTypes.string,
  btnTxt: PropTypes.string,
  btnCls: PropTypes.string,
  type: PropTypes.string,
  community: PropTypes.object
}
export default CommunitiesList
