import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import axios from 'shared/libs/axios'
import {
  profileBannerImg,
  linkIcon,
  mediumIcon,
  facebookIcon,
  twitterIcon,
  instagramIcon,
  userProfileIcon,
  checkStarIcon,
  twitchIcon
} from 'assets/images'
import './style.scss'
import { allRoutes } from 'shared/constants/allRoutes'
import { kycStatus, TOAST_TYPE } from 'shared/constants'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { FormattedMessage } from 'react-intl'
import useHeader from 'shared/components/header/use-header'
import TruliooKyc from 'modules/truliooKyc'
import KycModal from 'shared/components/kyc-modal'

const ProfileDetail = ({ user }) => {
  const { truliooKyc, kyc, onConfirm, onClose, handleKyc } = useHeader()
  const { id } = useParams()
  const dispatch = useDispatch()
  const socialLinks = user?.socialLinks && JSON.parse(user?.socialLinks)
  const userId = useSelector((state) => state.auth.userId) || localStorage.getItem('userId')
  const followerId = user?.id
  const isThisUserLoggedInUser = userId === followerId
  const follow = 'follow'
  const unFollow = 'unfollow'
  const userStore = useSelector((state) => state.user.user)

  const [followButtonText, setFollowButtonText] = useState(null)
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: 'Copied url',
        type: TOAST_TYPE.Success
      }
    })
  }

  const followUnfollowHandler = async () => {
    if (followButtonText === follow) {
      const payload = { followerId }
      try {
        const response = await axios.post(apiPaths.userFollow, payload)
        if (response.data) {
          dispatch({
            type: SHOW_TOAST,
            payload: {
              message: response.data.message,
              type: TOAST_TYPE.Success
            }
          })
          if (response.data?.result?.id) {
            setFollowButtonText(unFollow)
          }
        }
      } catch (error) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: error.message,
            type: TOAST_TYPE.Error
          }
        })
      }
    }

    if (followButtonText === unFollow) {
      try {
        const response = await axios.delete(`${apiPaths.userFollow}/${followerId}`)
        if (response.data) {
          dispatch({
            type: SHOW_TOAST,
            payload: {
              message: response.data.message,
              type: TOAST_TYPE.Success
            }
          })
          if (response.data?.result?.userFollower) {
            setFollowButtonText(follow)
          }
        }
      } catch (error) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: error.message,
            type: TOAST_TYPE.Error
          }
        })
      }
    }
  }

  useEffect(() => {
    const fetchUserFollow = async () => {
      const params = { userId, followerId }
      try {
        const response = await axios.get(`${apiPaths.userFollow}${setParamsForGetRequest(params)}`)
        if (response.data) {
          if (response.data?.result?.userFollower?.length === 0) {
            setFollowButtonText(follow)
          }

          if (response.data?.result?.userFollower?.length > 0) {
            setFollowButtonText(unFollow)
          }
        }
      } catch (error) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: error.message,
            type: TOAST_TYPE.Error
          }
        })
      }
    }

    followerId && userId && !isThisUserLoggedInUser && fetchUserFollow()
  }, [followerId, userId])

  return (
    <>
      <div className="profile-banner">
        <img src={user?.coverPicUrl || profileBannerImg} alt="banner-img" className="img-fluid profile-ban-img" />
        <div className="profile-banner-content d-flex">
          <div className={`banner-left-image flex-shrink-0 ${user?.kycStatus === 'Approved' && 'checkStar'}`}>
            <img src={user?.profilePicUrl || userProfileIcon} alt="profile-img" className="img-fluid user-img" />
            <img src={checkStarIcon} alt="verified" className="img-fluid tick-img" />
          </div>
          <div className="banner-right-content flex-shrink-0">
            <h4>{`${user?.firstName} ${user?.lastName}`}</h4>
            <span>{user?.userName}</span>
            <p>{user?.description}</p>
            <ul className="d-flex">
              <li>
                <button onClick={handleCopy}>
                  <img src={linkIcon} alt="social-icons" className="img-fluid" />
                </button>
              </li>
              <li>
                <a href={`mailto:${userId !== user?.id ? user?.email : ''}`} target="_blank" rel="noreferrer">
                  <img src={mediumIcon} alt="social-icons" className="img-fluid" />
                </a>
              </li>
              <li>
                <a href={socialLinks?.facebook} target="_blank" rel="noreferrer">
                  <img src={facebookIcon} alt="social-icons" className="img-fluid" />
                </a>
              </li>
              <li>
                <a href={socialLinks?.twitter} target="_blank" rel="noreferrer">
                  <img src={twitterIcon} alt="social-icons" className="img-fluid" />
                </a>
              </li>
              <li>
                <a href={socialLinks?.instagram} target="_blank" rel="noreferrer">
                  <img src={instagramIcon} alt="social-icons" className="img-fluid" />
                </a>
              </li>
              <li>
                <a href={socialLinks?.twitch} target="_blank" rel="noreferrer">
                  <img src={twitchIcon} alt="social-icons" className="img-fluid" />
                </a>
              </li>
            </ul>
            <div className="profile-banner-btn">
              {!id && (
                <Button className="white-btn" as={Link} to={allRoutes.editProfile}>
                  Edit Profile
                </Button>
              )}
              {userStore?.kycStatus && !kycStatus.includes(userStore?.kycStatus) && (
                <Button type="button" className="white-btn m-2" onClick={() => handleKyc(true)}>
                  <FormattedMessage id="kyc" />
                </Button>
              )}
            </div>
          </div>
          <div className="follow-btn-container flex-fill d-flex justify-content-center">
            {!isThisUserLoggedInUser && followButtonText && (
              <Button className="white-btn align-self-center" onClick={followUnfollowHandler}>
                {followButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>
      {kyc && <KycModal show={kyc} onConfirm={onConfirm} onClose={onClose} />}
      {truliooKyc && <TruliooKyc />}
    </>
  )
}
ProfileDetail.propTypes = {
  user: PropTypes.object
}
export default memo(ProfileDetail)
