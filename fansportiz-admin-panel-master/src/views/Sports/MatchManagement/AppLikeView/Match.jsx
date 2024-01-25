import React, { forwardRef, Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, PopoverBody, UncontrolledPopover } from 'reactstrap'
import { Link } from 'react-router-dom'
import Bat from '../../../../assets/images/cricket-bat.svg'
import Dollar from '../../../../assets/images/dollar.svg'
import Ball from '../../../../assets/images/ball.svg'
import BEP from '../../../../assets/images/bep.jpg'
import HUT from '../../../../assets/images/hut.jpg'
import infoIcon from '../../../../assets/images/info2.svg'
import moment from 'moment'
import classNames from 'classnames'

const Match = forwardRef((props, ref) => {
  const { data, url, sportsType } = props

  const [time, setTime] = useState('')
  const [intervalRef, setIntervalRef] = useState(null)

  useEffect(() => {
    if (data && data.dStartDate) {
      if ((new Date(data.dStartDate) > Date.now() + 86400000) || (new Date(data.dStartDate) < new Date(Date.now()))) {
        setTime(moment(data.dStartDate).format('lll'))
      } else {
        setIntervalRef(setInterval(() => {
          const duration = moment.duration(moment(data.dStartDate).diff(moment(new Date())))
          setTime(`${duration.hours()}h ${duration.minutes()}m  ${duration.seconds()}s left `)
        }, 1000))
      }
    }
    return () => {
      clearInterval(intervalRef)
    }
  }, [])

  return (
    <div className={classNames('match-box', { disabled: data && data.bDisabled })}>
    {
      data && data.sInfo && (
        <Fragment>
            <img className='i-button' src={infoIcon} id={`p${data._id}`} alt='Info Image'></img>
              <UncontrolledPopover trigger="legacy" placement="bottom" target={`p${data._id}`}>
            <PopoverBody>{data && data.sInfo}</PopoverBody>
          </UncontrolledPopover>
        </Fragment>
      )
    }
    <Link to={`/${sportsType}/match-management/view-match/${data?._id}`} className='match-i'>
      <div className="m-name">
        <strong>{data && data.sSeasonName ? data.sSeasonName : ' '}</strong>
        {data && data.sSponsoredText ? <p>{data.sSponsoredText}</p> : ''}
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="team d-flex align-items-center">
          <div className="t-img"><img src={data && data.oHomeTeam && data.oHomeTeam.sImage ? `${url}${data.oHomeTeam.sImage}` : HUT} alt='Home team image'/></div>
          <div className="name">
            <h3>{data && data.oHomeTeam && data.oHomeTeam.sShortName ? data.oHomeTeam.sShortName : data?.oHomeTeam?.sName && data.oHomeTeam.sName.substr(0, 3)}</h3>
            <div className="d-flex">
              {data && data.iTossWinnerId && data.iTossWinnerId === data.oHomeTeam.iTeamId
                ? data.eTossWinnerAction === 'BAT'
                  ? <Fragment>
                    <img src={Dollar} alt="dollar" width="18px" />
                    <img src={Bat} alt="Bat" width="18px" />
                  </Fragment>
                  : <Fragment>
                    <img src={Dollar} alt="dollar" width="18px" />
                    <img src={Ball} alt="Bat" width="18px" />
                  </Fragment>
                : data && data.iTossWinnerId && data.oAwayTeam && data.iTossWinnerId === data.oAwayTeam.iTeamId
                  ? data.eTossWinnerAction === 'BAT'
                    ? <img src={Ball} alt="Ball" width="18px" />
                    : <img src={Bat} alt="Bat" width="18px" />
                  : ''
              }
            </div>
          </div>
        </div>
        <div className="time">{time} </div>
        <div className="team d-flex align-items-center">
          <div className="name">
            <h3>{data && data.oAwayTeam && data.oAwayTeam.sShortName ? data.oAwayTeam.sShortName : data?.oAwayTeam?.sName.substr(0, 3)}</h3>
            <div className="d-flex justify-content-end">
              {data && data.iTossWinnerId && data.iTossWinnerId === data.oAwayTeam.iTeamId
                ? data.eTossWinnerAction === 'BAT'
                  ? <Fragment>
                    <img src={Dollar} alt="dollar" width="18px" />
                    <img src={Bat} alt="Bat" width="18px" />
                  </Fragment>
                  : <Fragment>
                    <img src={Dollar} alt="dollar" width="18px" />
                    <img src={Ball} alt="Ball" width="18px" />
                  </Fragment>
                : data && data.iTossWinnerId && data.oHomeTeam && data.iTossWinnerId === data.oHomeTeam.iTeamId
                  ? data.eTossWinnerAction === 'BAT'
                    ? <img src={Ball} alt="Ball" width="18px" />
                    : <img src={Bat} alt="Bat" width="18px" />
                  : ''
              }
            </div>
            {props.icons
              ? <div className="d-flex justify-content-end">
                <img src={Ball} alt="Ball" width="18px" />
              </div>
              : ''
            }
          </div>
          <div className="t-img"><img src={data && data.oAwayTeam && data.oAwayTeam.sImage ? `${url}${data.oAwayTeam.sImage}` : BEP} alt='Away team image' /></div>
        </div>
      </div>
      <div className={
        `footer-m d-flex align-items-center ${((data?.nTeams && data?.bLineupsOut && data?.eStatus === 'U') || data?.nWinnings) ? 'justify-content-between' : ''} ${(data?.nTeams && data.bLineupsOut && data.eStatus !== 'U') ? 'justify-content-center' : ''}${(data?.nTeams && !data.bLineupsOut) ? 'justify-content-center' : ''} ${(!data?.nTeams && data?.bLineupsOut) ? 'justify-content-center' : ''}
`}>
        {data?.nTeams
          ? <ul className="d-flex align-items-center m-0">
            <li><i className="icon-group"></i>{`${data.nTeams} `}</li>
            <li><i className="icon-security-star-symbol"></i>{`${data.nJoinedLeague ? data.nJoinedLeague : '0'}  `}</li>
          </ul>
          : ''
        }
        {data && data.bLineupsOut && data.eStatus === 'U' && <Button color="success" >Lineups Out</Button>}
        {
          data && data.nWinnings && (data.eStatus === 'CMP' || data.eStatus === 'I')
            ? <b className="text-success">{data && data.nWinnings}</b>
            : ''
        }
      </div>
    </Link>
  </div>
  )
})

Match.propTypes = {
  data: PropTypes.object,
  icons: PropTypes.any,
  url: PropTypes.string,
  sportsType: PropTypes.string
}

Match.displayName = Match

export default Match
