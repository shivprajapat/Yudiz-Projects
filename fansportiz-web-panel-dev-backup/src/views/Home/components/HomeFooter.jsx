import React from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import home from '../../../assests/images/home.svg'
import homeFill from '../../../assests/images/homeIconFill.svg'
import mymatches from '../../../assests/images/mymatches.svg'
import mymatchesFill from '../../../assests/images/mymatchesFill.svg'
import profile from '../../../assests/images/profileFooter.svg'
import profileFill from '../../../assests/images/profileFooterFill.svg'
import leaderboard from '../../../assests/images/leaderboard.svg'
import leaderboardFill from '../../../assests/images/leaderboardFill.svg'
import more from '../../../assests/images/more.svg'
import moreFill from '../../../assests/images/moreFill.svg'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
const classNames = require('classnames')

function HomeFooter (props) {
  const { isPublic } = props
  const { sportsType, type } = useParams()
  const { pathname } = useLocation()

  const homeClass = classNames({ active: (pathname === `/home/${sportsType}` || pathname === `/live-stream/${type}`) })
  const matchClass = classNames({ active: pathname === `/matches/${sportsType}` })

  const { data: activeSports } = useActiveSports()

  const activeSport = activeSports && activeSports.length > 0 &&
  activeSports.sort((a, b) => (a.sName > b.sName ? -1 : 1))
    .sort((a, b) => ((a.nPosition > b.nPosition) ? 1 : -1)).map((data) => data)
  const Key = activeSport && (activeSport[0]?.sKey)

  function footerLinkFunc (type) {
    if (sportsType) {
      if (isPublic) {
        return `/${type}/${sportsType}/v1`
      }
      return `/${type}/${sportsType}`
    }
    if (isPublic) {
      return `/${type}/${Key?.toLowerCase()}/v1`
    }
    return `/${type}/${Key?.toLowerCase()}`
  }

  return (
    <ul className="d-flex align-items-center home-footer m-0">
      <li>
        <NavLink className={homeClass} exact={false} to={footerLinkFunc('home')}>
          {pathname?.includes('/home') || pathname?.includes('/live-stream') ? <img alt="" src={homeFill} /> : <img alt="" src={home} />}
          <div><FormattedMessage id="Home" /></div>
        </NavLink>
      </li>
      <li>
        <NavLink className={matchClass} to={footerLinkFunc('matches')}>
          {pathname?.includes('/matches') ? <img alt="" src={mymatchesFill} /> : <img alt="" src={mymatches} />}
          <div><FormattedMessage id="My_Matches" /></div>
        </NavLink>
      </li>
      <li>
        <NavLink to={isPublic ? '/profile/v1' : '/profile'}>
          {pathname?.includes('/profile') ? <img alt="" src={profileFill} /> : <img alt="" src={profile} />}
          <div><FormattedMessage id="Profile" /></div>
        </NavLink>
      </li>
      <li>
        <NavLink to={isPublic ? '/game/leader-board/v1' : '/game/leader-board'}>
          {(pathname.includes('/game/leader-board') || pathname === '/game/leader-board/v1') ? <img alt="" src={leaderboardFill} /> : <img alt="" src={leaderboard} />}
          <div><FormattedMessage id="Leaderboard" /></div>
        </NavLink>
      </li>
      <li>
        <NavLink to={isPublic ? '/more/v1' : '/more'}>
          {pathname.includes('/more') ? <img alt="" src={moreFill} /> : <img alt="" src={more} />}
          <div><FormattedMessage id="More" /></div>
        </NavLink>
      </li>
    </ul>
  )
}

HomeFooter.propTypes = {
  isPublic: PropTypes.bool
}

export default HomeFooter
