import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'

import './style.scss'
import { userImg } from 'assets/images'
import { allRoutes } from 'shared/constants/allRoutes'
import { deleteComuunity, getCommunityDetails } from 'modules/communities/redux/service'
import AddEditCommunityModal from 'shared/components/add-edit-community-modal'
import { followCommunity, getCommunityFollower, unFollowCommunity } from 'modules/follower/redux/service'
import PermissionProvider from 'shared/components/permission-provider'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { useNavigate } from 'react-router-dom'

const ViewCommunity = ({ id, handleCommunityCreationForVerifiedUsers }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const communityRef = useRef()
  const unFollowRef = useRef()
  const followCountRef = useRef()
  const userId = localStorage.getItem('userId')

  const labels = {
    follow: useIntl().formatMessage({ id: 'follow' }),
    unFollow: useIntl().formatMessage({ id: 'unFollow' }),
    edit: useIntl().formatMessage({ id: 'edit' })
  }

  const [communityDetails, setCommunityDetails] = useState()
  const [show, setShow] = useState(false)
  const [delShow, setDelShow] = useState(false)

  const communityDetailsStore = useSelector((state) => state.communities.communityDetails)
  const followerStore = useSelector((state) => state.follower.getCommunityFollower)
  const followCommunityStore = useSelector((state) => state.follower.followCommunity)

  useEffect(() => {
    if (communityDetailsStore?.community) {
      setCommunityDetails(communityDetailsStore?.community)
      followCountRef.current = Number(communityDetailsStore?.community?.followerCount) || 0
    }
  }, [communityDetailsStore])

  useEffect(() => {
    if (id) {
      dispatch(getCommunityDetails(id))
      userId && dispatch(getCommunityFollower({ userId: userId, communityId: id }))
    }
  }, [id])

  useEffect(() => {
    if (followCommunityStore?.communityFollower) {
      unFollowRef.current = followCommunityStore.communityFollower.id
    }
  }, [followCommunityStore])

  useEffect(() => {
    if (communityDetails && communityDetails?.creator?.id !== userId && followerStore?.communityFollower) {
      if (followerStore?.communityFollower?.[0]?.id) {
        unFollowRef.current = followerStore?.communityFollower?.[0]?.id
        communityRef.current.innerHTML = labels.unFollow
      } else if (followerStore?.communityFollower?.length === 0) {
        communityRef.current.innerHTML = labels.follow
      }
    }
  }, [followerStore, communityDetails])

  useEffect(() => {
    if (communityDetails) {
      if (communityDetails?.creator?.id === userId || communityDetails?.createdBy === userId) {
        communityRef.current.innerHTML = labels.edit
      }
    }
  }, [communityDetails])

  const handleChangeCommunity = () => {
    if (communityDetails?.creator?.id === userId || communityDetails?.createdBy === userId) {
      setShow(!show)
    } else if (communityRef.current.innerHTML === labels.follow) {
      followCountRef.current = followCountRef.current + 1
      communityRef.current.innerHTML = labels.unFollow
      dispatch(followCommunity({ userId: userId, communityId: id }, true))
    } else if (communityRef.current.innerHTML === labels.unFollow) {
      followCountRef.current = followCountRef.current - 1
      communityRef.current.innerHTML = labels.follow
      dispatch(unFollowCommunity(unFollowRef.current, true))
      unFollowRef.current = ''
    }
  }

  const handleDeleteCommunity = async () => {
    dispatch(deleteComuunity(id, () => { navigate(allRoutes.community + '?deleted=true') }))
  }

  const toggleConfirmationModal = () => {
    setDelShow((prev) => !prev)
  }

  return (
    <>
      {show && <AddEditCommunityModal handleClose={handleChangeCommunity} show={show} defaultValue={communityDetails} id={id} />}

      <div className="create-community">
        <div className="create-community-box">
          <div className="create-community-box-img">
            <img src={communityDetails?.photo || userImg} alt="" className="img-fluid" />
          </div>
          <div className="content">
            <div className="content-head">
              <h6>{communityDetails?.name}</h6>
              <div className="content-follower">
                <span className="count">{followCountRef.current}</span>
                <span className="follower">Followers</span>
              </div>
            </div>
            <p>{communityDetails?.description}</p>
            <Button className="white-btn" onClick={handleChangeCommunity} ref={communityRef}></Button>
            <PermissionProvider>
              <Button className="white-btn m-2" onClick={toggleConfirmationModal}>
                Delete
              </Button>
            </PermissionProvider>
          </div>
        </div>
        {
          (communityDetails?.creator?.id === userId || communityDetails?.createdBy === userId) ? <div className="create-community-right">
            <Button className="white-btn" onClick={() => handleCommunityCreationForVerifiedUsers()} to={allRoutes.createPost}>
              Create Blog/Vlog
            </Button>
          </div> : null
        }
      </div>
      <ConfirmationModal
        show={delShow}
        handleConfirmation={handleDeleteCommunity}
        handleClose={toggleConfirmationModal}
      />

    </>
  )
}
ViewCommunity.propTypes = {
  id: PropTypes.string,
  handleCommunityCreationForVerifiedUsers: PropTypes.func
}
export default ViewCommunity
