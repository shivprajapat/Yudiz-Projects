import React, { useEffect } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Logo from '../../../assests/images/fansportiz_header.svg'
import walletIcon from '../../../assests/images/ic_wallet.svg'
import notificationIcon from '../../../assests/images/notificationIcon.svg'
import UserNotification from '../../../HOC/User/UserNotification'
import { getSportImgFunc } from '../../../utils/helper'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'

function HomeHeader (props) {
  const {
    sportsRequired, setPaymentSlide, nCount, token,
    onGetActiveSports, setMainIndex,
    active, isPublic, home, showBalance
  } = props

  const { data: activeSports } = useActiveSports()

  const { sportsType } = useParams()

  // const previousProps = useRef({
  //   match
  // }).current

  useEffect(() => {
    if (activeSports?.length === 0 && sportsRequired) {
      onGetActiveSports()
    }
  }, [])

  useEffect(() => {
    if (activeSports?.length > 0) {
      activeSports?.map((data, index) => {
        const name = data?.sKey.toLowerCase()
        if (sportsType === name && setMainIndex) {
          setMainIndex(index + 1)
        }
        return null
      })
    }
  }, [activeSports])

  useEffect(() => {
    // if (previousProps.match !== match) {
    if (activeSports?.length > 0) {
      activeSports.map((data, index) => {
        const name = data?.sKey?.toLowerCase()
        if (sportsType === name && setMainIndex) setMainIndex(index + 1)
        return null
      })
    }
    // }
    // return () => {
    // previousProps.match = match
    // }
  }, [sportsType])

  function pathFunc (data) {
    if (isPublic) {
      return home ? `/home/${data?.sKey.toLowerCase()}/v1` : `/matches/${data?.sKey.toLowerCase()}/v1`
    }
    return home ? `/home/${data?.sKey.toLowerCase()}` : `/matches/${data?.sKey.toLowerCase()}`
  }

  return (
    <div className="home-header">
      <div className="header-i d-flex align-items-center justify-content-between">
        <img alt={<FormattedMessage id="Fansportiz" />} src={Logo} width="122" />
        {token && (
        <ul className="d-flex m-0 ht-link">
          <li>
            <Link to="/notifications">
              <img alt={<FormattedMessage id="Notifications" />} src={notificationIcon} width={20} />
              {nCount && nCount.nUnreadCount > 0 ? <span className="count">{nCount && nCount.nUnreadCount}</span> : '' }
            </Link>
          </li>
          {showBalance && (
            <li className="me-2 mt-2 ms-2">
              <img
                alt=""
                onClick={() => setPaymentSlide(true)}
                onKeyDown={(e) => e.preventDefault}
                role="none"
                src={walletIcon}
              />
            </li>
          )}
        </ul>
        )}
      </div>
      {!active
        ? (
          <ul className="d-flex justify-content-around align-items-center match-links sports m-0 fixHeight">
            {
            activeSports && activeSports.length > 0 &&
              activeSports.sort((a, b) => (a.sName > b.sName ? -1 : 1))
                .sort((a, b) => ((a.nPosition > b.nPosition) ? 1 : -1)).map((data) => (
                  <li key={data.sKey}>
                    <NavLink activeClassName="active" to={pathFunc(data)}>
                      <img
                        alt={data.sName}
                        src={getSportImgFunc(data.sKey)}
                      />
                      <div
                        className="sportsText"
                      >
                        {data.sName.charAt(0).toUpperCase()}
                        {data.sName.slice(1).toLowerCase()}
                      </div>
                    </NavLink>
                  </li>
                ))
          }
          </ul>
          )
        : ''}
    </div>
  )
}

HomeHeader.propTypes = {
  active: PropTypes.bool.isRequired,
  sportsRequired: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      sportsType: PropTypes.string.isRequired
    }).isRequired,
    path: PropTypes.string.isRequired
  }).isRequired,
  home: PropTypes.bool.isRequired,
  setMainIndex: PropTypes.func.isRequired,
  setPaymentSlide: PropTypes.func.isRequired,
  showBalance: PropTypes.bool.isRequired,
  onGetActiveSports: PropTypes.func.isRequired,
  nCount: PropTypes.shape({
    nUnreadCount: PropTypes.number.isRequired
  }).isRequired,
  activeSports: PropTypes.shape.isRequired,
  token: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired
}

export default UserNotification(HomeHeader)
