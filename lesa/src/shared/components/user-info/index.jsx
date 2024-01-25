import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import './style.scss'
import { gridListUserIcon, balanceIcon } from 'assets/images'

const UserInfo = ({ name, isOwner, isDark, balance, link }) => {
  return (
    <>
      <div className={`owner owner-artist-inner d-flex align-items-center ${isDark ? 'dark' : 'white'}`}>
        <img src={gridListUserIcon} className="img-fluid flex-shrink-0" alt="owner-img" />
        <div className="owner-artist-desc">
          <h6>{isOwner ? 'Owner' : 'Artist'}</h6>
          {name && <p>{name}</p>}
          {balance && (
            <div className="d-flex balance align-items-center">
              <p>Your Balance</p>
              <span>
                1250 <img src={balanceIcon} className="img-fluid" alt="balance-icon" />
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
  link: PropTypes.string
}
export default UserInfo
