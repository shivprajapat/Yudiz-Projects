import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import { userProfileIcon, nuuCoinsIcon } from 'assets/images'

const UserInfo = ({ name, isOwner, isDark, balance, link, coinCount, profileImage, isArtist }) => {
  return (
    <>
      <div className={`owner owner-artist-inner d-flex align-items-center ${isDark ? 'dark' : 'white'}`}>
        <img src={profileImage || userProfileIcon} className="img-fluid flex-shrink-0" alt="owner-img" />
        <div className="owner-artist-desc">
          {isOwner && <h6>Owner</h6>}
          {isArtist && <h6>Artist</h6>}
          {name && <p>{name}</p>}
          {balance && (
            <div className="d-flex balance align-items-center">
              <p>
                <FormattedMessage id="yourBalance" />
              </p>
              <span>
                {coinCount || 0} <img src={nuuCoinsIcon} className="img-fluid" alt="balance-icon" />
              </span>
            </div>
          )}
        </div>
        {link && <Link to={link}></Link>}
      </div>
    </>
  )
}
UserInfo.propTypes = {
  name: PropTypes.string,
  isOwner: PropTypes.bool,
  isDark: PropTypes.bool,
  balance: PropTypes.bool,
  link: PropTypes.string,
  coinCount: PropTypes.number,
  profileImage: PropTypes.string,
  isArtist: PropTypes.bool
}
export default UserInfo
