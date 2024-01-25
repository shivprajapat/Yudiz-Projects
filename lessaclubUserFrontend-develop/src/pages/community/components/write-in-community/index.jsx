import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import './style.scss'
import { galleryIcon, videoPlayIcon, gifIcon, userProfileIcon } from 'assets/images'
import useHeader from 'shared/components/header/use-header'
import TruliooKyc from 'modules/truliooKyc'
import KycModal from 'shared/components/kyc-modal'
import { Button } from 'react-bootstrap'
import { kycStatus } from 'shared/constants'

const WriteInCommunity = ({ handleCommunityCreationForVerifiedUsers }) => {
  const userStore = useSelector((state) => state.user.user)
  const { truliooKyc, kyc, onConfirm, onClose, handleKyc } = useHeader()

  return (
    <>
      {userStore?.kycVerified ? (
        <div className="community" onClick={() => handleCommunityCreationForVerifiedUsers()}>
          <div className="community_box">
            <div className="community_user_img">
              <img src={userStore?.profilePicUrl || userProfileIcon} alt="user-img" className="img-fluid" />
            </div>
            <div className="content">
              <h6>Write something that is on your mind</h6>
              <ul>
                <li>
                  <img src={galleryIcon} alt="" className="icon" />
                  <span>Photo</span>
                </li>
                <li>
                  <img src={videoPlayIcon} alt="" className="icon" />
                  <span>Videos</span>
                </li>
                <li>
                  <img src={gifIcon} alt="" className="icon" />
                  <span>GIF</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="community_box">
            <div className="content">
              {userStore?.kycStatus && !kycStatus.includes(userStore?.kycStatus) && (
                <Button type="button" className="kyc-btn white-btn ms-3" onClick={() => handleKyc(true)}>
                  Please complete your KYC process to create a post
                </Button>
              )}
            </div>
          </div>
          {kyc && <KycModal show={kyc} onConfirm={onConfirm} onClose={onClose} />}
          {truliooKyc && <TruliooKyc />}
        </>
      )}
    </>
  )
}

WriteInCommunity.propTypes = {
  handleCommunityCreationForVerifiedUsers: PropTypes.func
}

export default WriteInCommunity
