import React, { Fragment, useEffect } from 'react'
import { Link, NavLink, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Row } from 'reactstrap'
import Logo from '../../../assests/images/logo.svg'
import Cricket from '../../../assests/images/cricket.svg'
import Kabaddi from '../../../assests/images/kabaddi.svg'
import Basketball from '../../../assests/images/Basketball.svg'
import Hockey from '../../../assests/images/hockey.svg'
import Baseball from '../../../assests/images/baseball.svg'
import walletIcon from '../../../assests/images/ic_wallet.svg'
import Football from '../../../assests/images/football.svg'
import notificationIcon from '../../../assests/images/notification-icon.svg'
import UserNotification from '../../../HOC/User/UserNotification'

function HomeHeader (props) {
  const { sportsRequired, setPaymentSlide, nCount, token, activeSports, onGetActiveSports, setMainIndex, active } = props

  const { sportsType } = useParams()

  useEffect(() => {
    (!activeSports || activeSports.length === 0) && token && sportsRequired && onGetActiveSports()
  }, [token])

  useEffect(() => {
    activeSports && activeSports.length !== 0 && activeSports.map((data, index) => {
      const name = data?.sName.toLowerCase()
      sportsType === name && setMainIndex(index + 1)
      return null
    })
  }, [activeSports])
  useEffect(() => {
    if (sportsType) {
      activeSports && activeSports.length !== 0 && activeSports.map((data, index) => {
        const name = data?.sName.toLowerCase()
        sportsType === name && setMainIndex(index + 1)
        return null
      })
    }
  }, [sportsType])

  return (
    <div className="home-header">
      <div className="header-i d-flex align-items-center justify-content-between">
        <img alt={<FormattedMessage id='Fansportiz' />} src={Logo} />
        <ul className="d-flex m-0 ht-link">
          <li>
            <Link to='/notifications'>
              <img alt='Notification' src={notificationIcon} width={20} />
              {nCount && nCount.nUnreadCount > 0 ? <span className="count">{nCount && nCount.nUnreadCount}</span> : '' }
            </Link>
          </li>
          {
            props.showBalance && (
              <li className='me-2 mt-2 ms-2' role='button'>
                {' '}
                <img onClick={() => setPaymentSlide(true)} src={walletIcon} />
                {' '}
              </li>
            )
          }
        </ul>
      </div>
      {!active
        ? (
          <ul className="d-flex justify-content-around align-items-center match-links sports m-0 fixHeight">
            {
            activeSports && activeSports.length
              ? activeSports.sort((a, b) => (a.nPosition > b.nPosition) ? 1 : -1).map(data => {
                return (
                  <li key={data.sKey}>
                    <NavLink activeClassName='active' className='d-flex' to={props.home ? `/home/${data?.sKey.toLowerCase()}` : `/matches/${data?.sKey.toLowerCase()}`} >
                      <img
                        alt={data.sName}
                        src={ data.sKey === 'CRICKET' ? Cricket : data.sKey === 'FOOTBALL' ? Football : data.sKey === 'KABADDI' ? Kabaddi : data.sKey === 'BASKETBALL' ? Basketball : data.sKey === 'Baseball  ' ? Baseball : data.sKey === 'HOCKEY' ? Hockey : Cricket}
                      />
                      <span className='sportsText'>
                        {data.sName}
                      </span>
                    </NavLink>
                  </li>
                )
              })
              : (
                <Fragment>
                  <li>
                    <NavLink activeClassName='active' to={props.home ? '/home/cricket' : '/matches/cricket'} >
                      <Row>
                        <img
                          alt={<FormattedMessage id="Cricket" />}
                          src={Cricket}
                        />
                        <FormattedMessage id="Cricket" />
                      </Row>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink activeClassName='active' to={props.home ? '/home/football' : '/matches/football'} >
                      <Row>
                        <img
                          alt={<FormattedMessage id="Football" />}
                          src={Football}
                        />
                        <FormattedMessage id="Football" />
                      </Row>
                    </NavLink>
                  </li>
                </Fragment>
                )
          }
          </ul>
          )
        : ''
      }
    </div>
  )
}

HomeHeader.propTypes = {
  active: PropTypes.bool,
  sportsRequired: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      sportsType: PropTypes.string
    }),
    path: PropTypes.string
  }),
  home: PropTypes.bool,
  GetCount: PropTypes.func,
  setMainIndex: PropTypes.func,
  setPaymentSlide: PropTypes.func,
  showBalance: PropTypes.bool,
  onGetActiveSports: PropTypes.func,
  nCount: PropTypes.shape({
    nUnreadCount: PropTypes.number
  }),
  activeSports: PropTypes.array,
  token: PropTypes.string
}

export default UserNotification(HomeHeader)
