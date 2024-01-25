import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import {
  profileBannerImg,
  linkIcon,
  mediumIcon,
  facebookIcon,
  twitterIcon,
  instagramIcon,
  gridListUserIcon,
  checkStarIcon
} from 'assets/images'
import './style.scss'
import { localStorageUserId } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'

const ProfileDetail = ({ user }) => {
  const { id } = useParams()
  const userId = useSelector((state) => state.auth.userId) || localStorageUserId
  const socialLinks = user?.socialLinks && JSON.parse(user?.socialLinks)

  return (
    <>
      <div className="profile-banner">
        <img src={profileBannerImg} alt="banner-img" className="img-fluid profile-ban-img" />
        <div className="profile-banner-content d-flex">
          <div className={`banner-left-image flex-shrink-0 ${user?.kycStatus === 'Approved' && 'checkStar'}`}>
            <img src={user?.profilePicUrl || gridListUserIcon} alt="profile-img" className="img-fluid user-img" />
            <img src={checkStarIcon} alt="verified" className="img-fluid tick-img" />
          </div>
          <div className="banner-right-content flex-shrink-0">
            <h4>{`${user?.firstName} ${user?.lastName}`}</h4>
            <span>{user?.userName}</span>
            <p>{user?.description}</p>
            <ul className="d-flex">
              {userId !== user?.id && (
                <li>
                  <a href={window.location.href} target="_blank" rel="noreferrer">
                    <img src={linkIcon} alt="social-icons" className="img-fluid" />
                  </a>
                </li>
              )}
              {userId !== user?.id && (
                <li>
                  <a href={`mailto:${socialLinks?.email}`} target="_blank" rel="noreferrer">
                    <img src={mediumIcon} alt="social-icons" className="img-fluid" />
                  </a>
                </li>
              )}
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
            </ul>
            <div className="profile-banner-btn">
              {!id && (
                <Button className="white-btn" as={Link} to={allRoutes.editProfile}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
ProfileDetail.propTypes = {
  user: PropTypes.object
}
export default memo(ProfileDetail)
