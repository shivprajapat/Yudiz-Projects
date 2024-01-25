import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import moment from 'moment'
import {
  Button,
  PopoverBody, UncontrolledPopover,
  Badge, Alert
} from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import qs from 'query-string'
import SkeletonUpcoming from '../../../component/SkeletonUpcoming'
import HomeTeam from '../../../assests/images/Team1.png'
import AwayTeam from '../../../assests/images/Team2.png'
import Ball from '../../../assests/images/ball.svg'
import Dollar from '../../../assests/images/dollar.svg'
import Bat from '../../../assests/images/cricket-bat.svg'
import Trophy from '../../../assests/images/trophy.svg'
import contest from '../../../assests/images/Contest.svg'
import teams from '../../../assests/images/Teams.svg'
import { viewMatch, viewLiveMatch } from '../../../utils/Analytics'
import infoIcon from '../../../assests/images/info-icon-gray.svg'
import home from '../../../assests/images/homeIconWhite.svg'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import useGetUrl from '../../../api/url/queries/useGetUrl'

const classNames = require('classnames')

function Match (props) {
  const {
    data, loading, subIndex, noRedirect, onlyInsideFeild
  } = props
  const [time, setTime] = useState([])
  // const [dataMatch, setDataMatch] = useState({})
  const [intervalRef, setIntervalRef] = useState(null)
  const [VideoStream, setVideoStream] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const { activeSport } = useActiveSports()

  const { sportsType } = useParams()
  const location = useLocation()
  const { sMediaUrl } = useGetUrl()

  useEffect(() => {
    // if (myMatches) {
    //   if (data?._id && matchDetailsList?.length > 0) {
    //     const filterData = matchDetailsList.filter(match => match._id === data.iMatchId)
    //     setDataMatch(filterData[0])
    //     if (filterData?.length > 0 && filterData[0].dStartDate) {
    //       if ((new Date(filterData[0].dStartDate) > Date.now() + 86400000) || (new Date(filterData[0].dStartDate) < new Date(Date.now()))) {
    //         setTime(moment(filterData[0].dStartDate).format('lll'))
    //       } else {
    //         setIntervalRef(setInterval(() => {
    //           const duration = moment.duration(moment(filterData[0].dStartDate).diff(moment(new Date())))
    //           setTime(`${duration.hours()}h ${duration.minutes()}m  ${duration.seconds()}s left `)
    //         }, 1000))
    //       }
    //     }
    //   }
    //   return () => {
    //     clearInterval(intervalRef)
    //   }
    // } else {
    if (data && data.dStartDate) {
      if ((new Date(data.dStartDate) > Date.now() + 86400000) || (new Date(data.dStartDate) < new Date(Date.now()))) {
        setTime(moment(data.dStartDate).format('MMMM Do YYYY, h:mm:ss A'))
      } else {
        setIntervalRef(setInterval(() => {
          if (data && (data.eStatus === 'U') && moment(data.dStartDate) < moment(new Date())) {
            setTime(moment(data.dStartDate).format('MMMM Do YYYY, h:mm:ss A'))
          } else {
            const duration = moment.duration(moment(data.dStartDate).diff(moment(new Date())))
            setTime(`${duration.hours()}h ${duration.minutes()}m  ${duration.seconds()}s left `)
          }
        }, 0))
      }
    }
    return () => {
      clearInterval(intervalRef)
    }
    // }
  }, [])

  function callViewEvent () {
    // if (myMatches) {
    //   if (dataMatch && dataMatch.eStatus === 'L') {
    //     if (dataMatch && dataMatch.sName && dataMatch._id && location.pathname) {
    //       viewLiveMatch(dataMatch.sName, dataMatch._id, location.pathname)
    //     } else {
    //       dataMatch && dataMatch.sName && dataMatch._id && viewLiveMatch(dataMatch.sName, dataMatch._id, '')
    //     }
    //   } else {
    //     if (dataMatch && dataMatch.sName && dataMatch._id && location.pathname) {
    //       viewMatch(dataMatch.sName, dataMatch._id, location.pathname)
    //     } else {
    //       dataMatch && dataMatch.sName && dataMatch._id && viewMatch(dataMatch.sName, dataMatch._id, '')
    //     }
    //   }
    // } else {
    if (data && data.eStatus === 'L') {
      if (data && data.sName && data._id && location.pathname) {
        viewLiveMatch(data.sName, data._id, location.pathname)
      } else {
        data && data.sName && data._id && viewLiveMatch(data.sName, data._id, '')
      }
    } else if (data && data.sName && data._id && location.pathname) {
      viewMatch(data.sName, data._id, location.pathname)
    } else {
      data && data.sName && data._id && viewMatch(data.sName, data._id, '')
    }
    // }
  }
  return (
    <>
      {alert && alertMessage ? <Alert className="select-all" color="primary" isOpen={alert}>{alertMessage}</Alert> : ''}
      <div
        className={classNames('match-box', { disabled: (data && data.bDisabled) || (data && (data.eStatus === 'U') && moment(data.dStartDate) < moment(new Date())) })}
        onClick={() => {
          if (data && data.bDisabled) {
            setAlert(true)
            setTimeout(() => {
              setAlert(false)
            }, 3000)
            setAlertMessage(<FormattedMessage id="Contest_for_this_match_will_open_soon" />)
          } else if (data && (data.eStatus === 'U') && moment(data.dStartDate) < moment(new Date())) {
            setAlert(true)
            setTimeout(() => {
              setAlert(false)
            }, 3000)
            setAlertMessage(<FormattedMessage id="Times_up" />)
          } else {
            callViewEvent()
          }
        }}
      >
        {
          loading
            ? <SkeletonUpcoming numberOfColumns={7} />
            : (
              <>
                {
                  // myMatches
                  //   ? <Fragment>
                  //     {
                  //       onlyInsideFeild
                  //         ? (
                  //           <Fragment>
                  //             <Link className="match-i">
                  //               <div className="d-flex align-items-center justify-content-between only">
                  //                 <div className="team d-flex align-items-center">
                  //                   <div className="t-img"><img src={dataMatch && dataMatch.oHomeTeam && dataMatch.oHomeTeam.sImage ? `${url}${dataMatch.oHomeTeam.sImage}` : HomeTeam} alt={<FormattedMessage id="Home" />} /></div>
                  //                   <div className="name">
                  //                     <h3>{dataMatch && dataMatch.oHomeTeam && dataMatch.oHomeTeam.sShortName ? dataMatch.oHomeTeam.sShortName : dataMatch?.oHomeTeam?.sName && dataMatch.oHomeTeam.sName.substr(0, 3)}</h3>
                  //                     <div className="d-flex">
                  //                       {dataMatch && dataMatch.iTossWinnerId && dataMatch.iTossWinnerId === dataMatch.oHomeTeam.iTeamId
                  //                         ? dataMatch.eTossWinnerAction === 'BAT'
                  //                           ? <Fragment>
                  //                             <img src={Dollar} alt="dollar" width="18px" />
                  //                             <img src={Bat} alt="Bat" width="18px" />
                  //                           </Fragment>
                  //                           : <Fragment>
                  //                             <img src={Dollar} alt="dollar" width="18px" />
                  //                             <img src={Ball} alt="Bat" width="18px" />
                  //                           </Fragment>
                  //                         : dataMatch && dataMatch.iTossWinnerId && dataMatch.oAwayTeam && dataMatch.iTossWinnerId === dataMatch.oAwayTeam.iTeamId
                  //                           ? dataMatch.eTossWinnerAction === 'BAT'
                  //                             ? <img src={Ball} alt="Ball" width="18px" />
                  //                             : <img src={Bat} alt="Bat" width="18px" />
                  //                           : ''
                  //                       }
                  //                     </div>
                  //                   </div>
                  //                 </div>
                  //                 <div className="time">{time} </div>
                  //                 <div className="team d-flex align-items-center">
                  //                   <div className="name">
                  //                     <h3>{dataMatch && dataMatch.oAwayTeam && dataMatch.oAwayTeam.sShortName ? dataMatch.oAwayTeam.sShortName : dataMatch?.oAwayTeam?.sName.substr(0, 3)}</h3>
                  //                     <div className="d-flex justify-content-end">
                  //                       {dataMatch && dataMatch.iTossWinnerId && dataMatch.iTossWinnerId === dataMatch.oAwayTeam.iTeamId
                  //                         ? dataMatch.eTossWinnerAction === 'BAT'
                  //                           ? <Fragment>
                  //                             <img src={Dollar} alt="dollar" width="18px" />
                  //                             <img src={Bat} alt="Bat" width="18px" />
                  //                           </Fragment>
                  //                           : <Fragment>
                  //                             <img src={Dollar} alt="dollar" width="18px" />
                  //                             <img src={Ball} alt="Bat" width="18px" />
                  //                           </Fragment>
                  //                         : dataMatch && dataMatch.iTossWinnerId && dataMatch.oHomeTeam && dataMatch.iTossWinnerId === dataMatch.oHomeTeam.iTeamId
                  //                           ? dataMatch.eTossWinnerAction === 'BAT'
                  //                             ? <img src={Ball} alt="Bat" width="18px" />
                  //                             : <img src={Bat} alt="Bat" width="18px" />
                  //                           : ''
                  //                       }
                  //                     </div>
                  //                     {props.icons
                  //                       ? <div className="d-flex justify-content-end">
                  //                         <img src={Ball} alt="Ball" width="18px" />
                  //                       </div>
                  //                       : ''
                  //                     }
                  //                   </div>
                  //                   <div className="t-img"><img src={dataMatch && dataMatch.oAwayTeam && dataMatch.oAwayTeam.sImage ? `${url}${dataMatch.oAwayTeam.sImage}` : AwayTeam} alt={<FormattedMessage id="Away" />} /></div>
                  //                 </div>
                  //               </div>
                  //             </Link>
                  //           </Fragment>
                  //           )
                  //         : (
                  //           <Fragment>
                  //             {
                  //               dataMatch && dataMatch.sInfo && (
                  //                 <Fragment>
                  //                   <Button className="icon-info i-button" type="button" id={`p${dataMatch._id}`}></Button>
                  //                   <UncontrolledPopover trigger="legacy" placement="bottom" target={`p${dataMatch._id}`}>
                  //                     <PopoverBody>{dataMatch && dataMatch.sInfo}</PopoverBody>
                  //                   </UncontrolledPopover>
                  //                 </Fragment>
                  //               )
                  //             }
                  //             <Link style={noRedirect ? { pointerEvents: 'none' } : null} to={props.live ? { pathname: `/liveleague/${data.iMatchId}/${dataMatch?.eCategory?.toLowerCase()}`, state: { tab: subIndex, referUrl: `/matches/${match && match.params && sportsType}` } } : props.upcoming ? { pathname: `/upcoming-match/leagues/${dataMatch?.eCategory?.toLowerCase()}/${dataMatch._id}`, state: { tab: 1, referUrl: `/home/${match && match.params && sportsType}` } } : props.completed ? { pathname: `/completed-match/leagues/${dataMatch?.eCategory?.toLowerCase()}/${data.iMatchId}`, state: { tab: subIndex, referUrl: `/matches/${match && match.params && sportsType}` } } : { pathname: `/upcoming-match/leagues/${dataMatch?.eCategory?.toLowerCase()}/${data.iMatchId}`, state: { tab: subIndex, referUrl: `/matches/${match && match.params && sportsType}` } }} className="match-i">
                  //               <div className="m-name">
                  //                 <strong>{dataMatch && dataMatch.sSeasonName ? dataMatch.sSeasonName : ' '}</strong>
                  //                 {dataMatch?.sSponsoredText ? <p>{dataMatch.sSponsoredText}</p> : ''}
                  //               </div>
                  //               <div className="d-flex align-items-center justify-content-between">
                  //                 <div className="team d-flex align-items-center">
                  //                   <div className="t-img"><img src={dataMatch && dataMatch.oHomeTeam && dataMatch.oHomeTeam.sImage ? `${url}${dataMatch.oHomeTeam.sImage}` : HomeTeam} alt={<FormattedMessage id="Home" />} /></div>
                  //                   <div className="name">
                  //                     <h3>{dataMatch && dataMatch.oHomeTeam && dataMatch.oHomeTeam.sShortName ? dataMatch.oHomeTeam.sShortName : dataMatch?.oHomeTeam?.sName && dataMatch.oHomeTeam.sName.substr(0, 3)}</h3>
                  //                     <div className="d-flex">
                  //                       {dataMatch && dataMatch.iTossWinnerId && dataMatch.iTossWinnerId === dataMatch.oHomeTeam.iTeamId
                  //                         ? dataMatch.eTossWinnerAction === 'BAT'
                  //                           ? <Fragment>
                  //                             <img src={Dollar} alt="dollar" width="18px" />
                  //                             <img src={Bat} alt="Bat" width="18px" />
                  //                           </Fragment>
                  //                           : <Fragment>
                  //                             <img src={Dollar} alt="dollar" width="18px" />
                  //                             <img src={Ball} alt="Bat" width="18px" />
                  //                           </Fragment>
                  //                         : dataMatch && dataMatch.iTossWinnerId && dataMatch.oAwayTeam && dataMatch.iTossWinnerId === dataMatch.oAwayTeam.iTeamId
                  //                           ? dataMatch.eTossWinnerAction === 'BAT'
                  //                             ? <img src={Ball} alt="Ball" width="18px" />
                  //                             : <img src={Bat} alt="Bat" width="18px" />
                  //                           : ''
                  //                       }
                  //                     </div>
                  //                   </div>
                  //                 </div>
                  //                 <div className="time">{time} </div>
                  //                 <div className="team d-flex align-items-center">
                  //                   <div className="name">
                  //                     <h3>{dataMatch && dataMatch.oAwayTeam && dataMatch.oAwayTeam.sShortName ? dataMatch.oAwayTeam.sShortName : dataMatch?.oAwayTeam?.sName.substr(0, 3)}</h3>
                  //                     <div className="d-flex justify-content-end">
                  //                       {dataMatch && dataMatch.iTossWinnerId && dataMatch.iTossWinnerId === dataMatch.oAwayTeam.iTeamId
                  //                         ? dataMatch.eTossWinnerAction === 'BAT'
                  //                           ? <Fragment>
                  //                             <img src={Dollar} alt="dollar" width="18px" />
                  //                             <img src={Bat} alt="Bat" width="18px" />
                  //                           </Fragment>
                  //                           : <Fragment>
                  //                             <img src={Dollar} alt="dollar" width="18px" />
                  //                             <img src={Ball} alt="Bat" width="18px" />
                  //                           </Fragment>
                  //                         : dataMatch && dataMatch.iTossWinnerId && dataMatch.oHomeTeam && dataMatch.iTossWinnerId === dataMatch.oHomeTeam.iTeamId
                  //                           ? dataMatch.eTossWinnerAction === 'BAT'
                  //                             ? <img src={Ball} alt="Bat" width="18px" />
                  //                             : <img src={Bat} alt="Bat" width="18px" />
                  //                           : ''
                  //                       }
                  //                     </div>
                  //                     {props.icons
                  //                       ? <div className="d-flex justify-content-end">
                  //                         <img src={Ball} alt="Ball" width="18px" />
                  //                       </div>
                  //                       : ''
                  //                     }
                  //                   </div>
                  //                   <div className="t-img"><img src={dataMatch && dataMatch.oAwayTeam && dataMatch.oAwayTeam.sImage ? `${url}${dataMatch.oAwayTeam.sImage}` : AwayTeam} alt={<FormattedMessage id="Away" />} /></div>
                  //                 </div>
                  //               </div>
                  //               <div className={
                  //                 `footer-m d-flex align-items-center ${((dataMatch?.nTeams && dataMatch?.bLineupsOut && dataMatch?.eStatus === 'U') || dataMatch?.nWinnings) ? 'justify-content-between' : ''} ${(dataMatch?.nTeams && dataMatch?.bLineupsOut && dataMatch?.eStatus !== 'U') ? 'justify-content-center' : ''}${(dataMatch?.nTeams && !dataMatch?.bLineupsOut) ? 'justify-content-center' : ''} ${(!dataMatch?.nTeams && dataMatch?.bLineupsOut) ? 'justify-content-center' : ''}
                  //                 `}>
                  //                 {dataMatch?.nTeams
                  //                   ? <ul className="d-flex align-items-center m-0">
                  //                     <li><i className="icon-group"></i>{`${dataMatch.nTeams} `}<FormattedMessage id="Team" /></li>
                  //                     <li><i className="icon-security-star-symbol"></i>{`${dataMatch.nJoinedLeague}  `}<FormattedMessage id="Contest" /></li>
                  //                   </ul>
                  //                   : ''
                  //                 }
                  //                 {dataMatch && dataMatch?.bLineupsOut && dataMatch?.eStatus === 'U' && <Button color="success" ><FormattedMessage id="Lineups_Out" /></Button>}
                  //                 {
                  //                   dataMatch && dataMatch?.nWinnings && (dataMatch?.eStatus === 'CMP' || dataMatch?.eStatus === 'I')
                  //                     ? <b className="text-success">{dataMatch?.nWinnings && (<Fragment> <FormattedMessage id="WON_RUPEE" /> {parseFloat(dataMatch?.nWinnings.toFixed(2))} </Fragment>)}</b>
                  //                     : ''
                  //                 }
                  //               </div>
                  //               {
                  //                 dataMatch && dataMatch.bWinningZone && dataMatch.eStatus === 'L' &&
                  //                 <div className="bg-white d-flex align-items-center justify-content-center">
                  //                   <Badge color="info" className='winning-zone' pill>
                  //                     <img src={Trophy}></img>
                  //                     <span className='mt-2 winning-text'>
                  //                       <FormattedMessage id="You_are_in_winning_zone" />
                  //                     </span>
                  //                   </Badge>
                  //                 </div>
                  //               }
                  //             </Link>
                  //           </Fragment>
                  //           )
                  //     }
                  //   </Fragment>
                  //   :
                  <>
                    {
                        onlyInsideFeild
                          ? (
                            <div className="match-i">
                              <div className="d-flex align-items-center justify-content-between only">
                                <div className="team d-flex align-items-center">
                                  <div className="t-img"><img alt={<FormattedMessage id="Home" />} src={data && data.oHomeTeam && data.oHomeTeam.sImage ? `${sMediaUrl}${data.oHomeTeam.sImage}` : HomeTeam} /></div>
                                  <div className="name">
                                    <h3>{data && data.oHomeTeam && data.oHomeTeam.sShortName ? data.oHomeTeam.sShortName : data?.oHomeTeam?.sName && data.oHomeTeam.sName.substr(0, 3)}</h3>
                                    <div className="d-flex">
                                      {data && data.iTossWinnerId && data.iTossWinnerId === data.oHomeTeam.iTeamId
                                        ? data.eTossWinnerAction === 'BAT'
                                          ? (
                                            <>
                                              <img alt={<FormattedMessage id="Dollar" />} src={Dollar} width="18px" />
                                              <img alt={<FormattedMessage id="Bat" />} src={Bat} width="18px" />
                                            </>
                                            )
                                          : (
                                            <>
                                              <img alt={<FormattedMessage id="Dollar" />} src={Dollar} width="18px" />
                                              <img alt={<FormattedMessage id="Bat" />} src={Ball} width="18px" />
                                            </>
                                            )
                                        : data && data.iTossWinnerId && data.oAwayTeam && data.iTossWinnerId === data.oAwayTeam.iTeamId
                                          ? data.eTossWinnerAction === 'BAT'
                                            ? <img alt={<FormattedMessage id="Ball" />} src={Ball} width="18px" />
                                            : <img alt={<FormattedMessage id="Bat" />} src={Bat} width="18px" />
                                          : ''}
                                    </div>
                                  </div>
                                </div>
                                <div className="time">
                                  {time}
                                  {' '}
                                </div>
                                <div className="team d-flex align-items-center">
                                  <div className="name">
                                    <h3>{data && data.oAwayTeam && data.oAwayTeam.sShortName ? data.oAwayTeam.sShortName : data?.oAwayTeam?.sName.substr(0, 3)}</h3>
                                    <div className="d-flex justify-content-end">
                                      {data && data.iTossWinnerId && data.iTossWinnerId === data.oAwayTeam.iTeamId
                                        ? data.eTossWinnerAction === 'BAT'
                                          ? (
                                            <>
                                              <img alt={<FormattedMessage id="Dollar" />} src={Dollar} width="18px" />
                                              <img alt={<FormattedMessage id="Bat" />} src={Bat} width="18px" />
                                            </>
                                            )
                                          : (
                                            <>
                                              <img alt={<FormattedMessage id="Dollar" />} src={Dollar} width="18px" />
                                              <img alt={<FormattedMessage id="Bat" />} src={Ball} width="18px" />
                                            </>
                                            )
                                        : data && data.iTossWinnerId && data.oHomeTeam && data.iTossWinnerId === data.oHomeTeam.iTeamId
                                          ? data.eTossWinnerAction === 'BAT'
                                            ? <img alt={<FormattedMessage id="Bat" />} src={Ball} width="18px" />
                                            : <img alt={<FormattedMessage id="Bat" />} src={Bat} width="18px" />
                                          : ''}
                                    </div>
                                    {props.icons
                                      ? (
                                        <div className="d-flex justify-content-end">
                                          <img alt={<FormattedMessage id="Ball" />} src={Ball} width="18px" />
                                        </div>
                                        )
                                      : ''}
                                  </div>
                                  <div className="t-img"><img alt={<FormattedMessage id="Away" />} src={data && data.oAwayTeam && data.oAwayTeam.sImage ? `${sMediaUrl}${data.oAwayTeam.sImage}` : AwayTeam} /></div>
                                </div>
                              </div>
                              {
                                  props.liveStream && (
                                    <div className={
                                      `footer-m d-flex align-items-center ${((data.nTeams && data.bLineupsOut && data.eStatus === 'U') || (data.nWinnings || data.nBonusWin || data.aExtraWin?.length >= 1)) ? 'justify-content-between' : ''} ${(props.liveStream) ? 'justify-content-center' : ''} ${(data.nTeams && data.bLineupsOut && data.eStatus !== 'U') ? 'justify-content-center' : ''}${(data.nTeams && !data.bLineupsOut) ? 'justify-content-center' : ''} ${(!data.nTeams && data.bLineupsOut) ? 'justify-content-center' : ''}
                                      `
}
                                    >
                                      {data && data.sStreamUrl && props.liveStream && !props.completed && (
                                      <Button
                                        className="live-stream-btn-live"
                                        onClick={() => {
                                          if (props.liveStream) {
                                            if (data.sStreamUrl.includes('https://www.youtube.com/')) {
                                              setVideoStream(true)
                                            } else {
                                              setVideoStream(true)
                                              setAlert(true)
                                              setTimeout(() => {
                                                setVideoStream(false)
                                                setAlert(false)
                                              }, 1000)
                                              setAlertMessage('something went wrong.')
                                            }
                                          }
                                        }}
                                      >
                                        <FormattedMessage id="Watch_Live" />
                                      </Button>
                                      )}
                                      {data && data.sStreamUrl && props.liveStream && props.completed && (
                                      <Button
                                        className="live-stream-btn-cmp"
                                        onClick={() => {
                                          if (props.liveStream) {
                                            if (data.sStreamUrl.includes('https://www.youtube.com/')) {
                                              setVideoStream(true)
                                            } else {
                                              setVideoStream(true)
                                              setAlert(true)
                                              setTimeout(() => {
                                                setVideoStream(false)
                                                setAlert(false)
                                              }, 1000)
                                              setAlertMessage('something went wrong.')
                                            }
                                          }
                                        }}
                                      >
                                        <FormattedMessage id="Watch_Now" />
                                      </Button>
                                      )}
                                    </div>
                                  )
                                }
                            </div>
                            )
                          : (
                            <>
                              {
                                data && data.sInfo && (
                                  <>
                                    <img className="match-info" id={`p${data._id}`} src={infoIcon} />
                                    <UncontrolledPopover placement="bottom" target={`p${data._id}`} trigger="legacy">
                                      <PopoverBody>{data && data.sInfo}</PopoverBody>
                                    </UncontrolledPopover>
                                  </>
                                )
                              }
                              <Link
                                className="match-i"
                                state={(location.pathname === `/home/${sportsType}/v1` || location.pathname === `/matches/${sportsType}/v1`)
                                  ? { data }
                                  : props.live
                                    ? { tab: subIndex, referUrl: `/matches/${sportsType}` }
                                    : props.upcoming
                                      ? { tab: 1, referUrl: `/home/${sportsType}` }
                                      : props.completed
                                        ? { tab: subIndex, referUrl: `/matches/${sportsType}` }
                                        : { tab: subIndex, referUrl: `/matches/${sportsType}` }
                                }
                                style={(noRedirect || (data && data.bDisabled)) || (data && (data.eStatus === 'U') && moment(data.dStartDate) < moment(new Date())) ? { pointerEvents: 'none' } : null}
                                to={(location.pathname === `/home/${sportsType}/v1` || location.pathname === `/matches/${sportsType}/v1`)
                                  ? {
                                      pathname: `/upcoming-match/leagues/${sportsType}/${data._id}/v1`
                                    }
                                  : props.live
                                    ? { pathname: `/live-match/leagues/${data?.eCategory?.toLowerCase()}/${data.iMatchId}` }
                                    : props.upcoming
                                      ? {
                                          pathname: `/upcoming-match/leagues/${data?.eCategory?.toLowerCase()}/${data._id}`,
                                          search: `?${qs.stringify({
                                            homePage: (location.pathname.includes('/home')) ? 'yes' : undefined
                                          })}`
                                        }
                                      : props.completed
                                        ? { pathname: `/completed-match/leagues/${data?.eCategory?.toLowerCase()}/${data.iMatchId}` }
                                        : { pathname: `/upcoming-match/leagues/${data?.eCategory?.toLowerCase()}/${data.iMatchId}` } }
                              >
                                <div className="m-name">
                                  <strong>{data && data.sSeasonName ? data.sSeasonName : ' '}</strong>
                                  {data.sSponsoredText ? <p>{data.sSponsoredText}</p> : ''}
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="team d-flex align-items-center">
                                    <div className="t-img"><img alt={<FormattedMessage id="Home" />} src={data && data.oHomeTeam && data.oHomeTeam.sImage ? `${sMediaUrl}${data.oHomeTeam.sImage}` : HomeTeam} /></div>
                                    <div className="name">
                                      <h3>{data && data.oHomeTeam && data.oHomeTeam.sShortName ? data.oHomeTeam.sShortName : data?.oHomeTeam?.sName && data.oHomeTeam.sName.substr(0, 3)}</h3>
                                      <div className="d-flex">
                                        {data && data.iTossWinnerId && data.iTossWinnerId === data.oHomeTeam.iTeamId
                                          ? data.eTossWinnerAction === 'BAT'
                                            ? (
                                              <>
                                                <img alt={<FormattedMessage id="Dollar" />} src={Dollar} width="18px" />
                                                <img alt={<FormattedMessage id="Bat" />} src={Bat} width="18px" />
                                              </>
                                              )
                                            : (
                                              <>
                                                <img alt={<FormattedMessage id="Dollar" />} src={Dollar} width="18px" />
                                                <img alt={<FormattedMessage id="Bat" />} src={Ball} width="18px" />
                                              </>
                                              )
                                          : data && data.iTossWinnerId && data.oAwayTeam && data.iTossWinnerId === data.oAwayTeam.iTeamId
                                            ? data.eTossWinnerAction === 'BAT'
                                              ? <img alt={<FormattedMessage id="Ball" />} src={Ball} width="18px" />
                                              : <img alt={<FormattedMessage id="Bat" />} src={Bat} width="18px" />
                                            : ''}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={(new Date(data.dStartDate) > Date.now() + 86400000) || (new Date(data.dStartDate) < new Date(Date.now())) ? 'fixTime' : 'time'}>
                                    {time}
                                    {' '}
                                  </div>
                                  <div className="team d-flex align-items-center">
                                    <div className="name">
                                      <h3>{data && data.oAwayTeam && data.oAwayTeam.sShortName ? data.oAwayTeam.sShortName : data?.oAwayTeam?.sName.substr(0, 3)}</h3>
                                      <div className="d-flex justify-content-end">
                                        {data && data.iTossWinnerId && data.iTossWinnerId === data.oAwayTeam.iTeamId
                                          ? data.eTossWinnerAction === 'BAT'
                                            ? (
                                              <>
                                                <img alt={<FormattedMessage id="Dollar" />} src={Dollar} width="18px" />
                                                <img alt={<FormattedMessage id="Bat" />} src={Bat} width="18px" />
                                              </>
                                              )
                                            : (
                                              <>
                                                <img alt={<FormattedMessage id="Dollar" />} src={Dollar} width="18px" />
                                                <img alt={<FormattedMessage id="Bat" />} src={Ball} width="18px" />
                                              </>
                                              )
                                          : data && data.iTossWinnerId && data.oHomeTeam && data.iTossWinnerId === data.oHomeTeam.iTeamId
                                            ? data.eTossWinnerAction === 'BAT'
                                              ? <img alt={<FormattedMessage id="Ball" />} src={Ball} width="18px" />
                                              : <img alt={<FormattedMessage id="Bat" />} src={Bat} width="18px" />
                                            : ''}
                                      </div>
                                      {props.icons
                                        ? (
                                          <div className="d-flex justify-content-end">
                                            <img alt={<FormattedMessage id="Ball" />} src={Ball} width="18px" />
                                          </div>
                                          )
                                        : ''}
                                    </div>
                                    <div className="t-img"><img alt={<FormattedMessage id="Away" />} src={data && data.oAwayTeam && data.oAwayTeam.sImage ? `${sMediaUrl}${data.oAwayTeam.sImage}` : AwayTeam} /></div>
                                  </div>
                                </div>
                                <div className={
                                  `footer-m d-flex align-items-center ${((data.nTeams && data.bLineupsOut && data.eStatus === 'U') || (data.eStatus === 'CMP' && (data.nWinnings || data.nBonusWin || data.aExtraWin?.length))) ? 'justify-content-between' : ''} ${(data.nTeams && data.bLineupsOut && data.eStatus !== 'U') ? 'justify-content-center' : ''}${(data.nTeams && !data.bLineupsOut) ? 'justify-content-center' : ''} ${(!data.nTeams && data.bLineupsOut) ? 'justify-content-center' : ''}`}
                                >
                                  {data.nTeams
                                    ? (
                                      <ul className="d-flex align-items-center justify-content-center m-0">
                                        <li>
                                          <img src={teams} />
                                          <span className={document.dir === 'rtl' ? 'pe-1' : 'ps-1'}>
                                            {`${data.nTeams} `}
                                            <FormattedMessage id="Team" />
                                          </span>
                                        </li>
                                        <li>
                                          <img src={contest} />
                                          <span className={document.dir === 'rtl' ? 'pe-1' : 'ps-1'}>{`${data.nJoinedLeague ? data.nJoinedLeague : '0'}  `}</span>
                                          <FormattedMessage id="Contest" />
                                        </li>
                                      </ul>
                                      )
                                    : ''}
                                  {data && data.bLineupsOut && data.eStatus === 'U' && <Button className="lineups-btn"><FormattedMessage id="Lineups_Out" /></Button>}
                                  {
                                    data && (data.eStatus === 'CMP')
                                      ? (
                                        <b className="text-success">
                                          {
                                            data && data.nWinnings >= 1 && !data.nBonusWin >= 1 && data.aExtraWin?.length === 0
                                              ? (
                                                <>
                                                  {' '}
                                                  <FormattedMessage id="WON_RUPEE" />
                                                  {' '}
                                                  {parseFloat(data.nWinnings.toFixed(2))}
                                                  {' '}
                                                </>
                                                )
                                              : data && !data.nWinnings >= 1 && data.nBonusWin >= 1 && data.aExtraWin?.length === 0
                                                ? (
                                                  <>
                                                    {' '}
                                                    <FormattedMessage id="WON_RUPEE" />
                                                    {' '}
                                                    {parseFloat(data.nBonusWin.toFixed(2))}
                                                    {' '}
                                                    Bonus
                                                    {' '}
                                                  </>
                                                  )
                                                : data && !data.nWinnings >= 1 && !data.nBonusWin >= 1 && data.aExtraWin?.length === 1
                                                  ? (
                                                    <>
                                                      {' '}
                                                      <FormattedMessage id="WON" />
                                                      {' '}
                                                      {data.aExtraWin[0]?.sInfo}
                                                      {' '}
                                                    </>
                                                    )
                                                  : data && !data.nWinnings >= 1 && !data.nBonusWin >= 1 && data.aExtraWin?.length >= 2
                                                    ? (
                                                      <>
                                                        {' '}
                                                        <FormattedMessage id="Won_Gadgets" />
                                                        {' '}
                                                      </>
                                                      )
                                                    : data && !data.nWinnings >= 1 && !data.nBonusWin >= 1 && data.aExtraWin?.length === 0
                                                      ? ''
                                                      : (
                                                        <>
                                                          {' '}
                                                          <FormattedMessage id="Won_Multiple_Prizes" />
                                                          {' '}
                                                        </>
                                                        )
                                          }
                                        </b>
                                        )
                                      : ''
                                  }
                                </div>
                                {
                                  data && data.bWinningZone && data.eStatus === 'L' &&
                                  (
                                  <div className="bg-white d-flex align-items-center justify-content-center">
                                    <Badge className="winning-zone" color="info" pill>
                                      <img src={Trophy} />
                                      <span className="mt-2 winning-text">
                                        <FormattedMessage id="You_are_in_winning_zone" />
                                      </span>
                                    </Badge>
                                  </div>
                                  )
                                }
                                {data && data.sStreamUrl && props.liveStream && !props.completed && (
                                <Button
                                  className="live-stream-btn-live"
                                  onClick={() => {
                                    if (props.liveStream) {
                                      if (data.sStreamUrl.includes('https://www.youtube.com/')) {
                                        setVideoStream(true)
                                      } else {
                                        setVideoStream(true)
                                        setAlert(true)
                                        setTimeout(() => {
                                          setVideoStream(false)
                                          setAlert(false)
                                        }, 1000)
                                        setAlertMessage('something went wrong.')
                                      }
                                    }
                                  }}
                                >
                                  <FormattedMessage id="Watch_Live" />
                                </Button>
                                )}
                                {data && data.sStreamUrl && props.liveStream && props.completed && (
                                <Button
                                  className="live-stream-btn-cmp"
                                  onClick={() => {
                                    if (props.liveStream) {
                                      if (data.sStreamUrl.includes('https://www.youtube.com/')) {
                                        setVideoStream(true)
                                      } else {
                                        setVideoStream(true)
                                        setAlert(true)
                                        setTimeout(() => {
                                          setVideoStream(false)
                                          setAlert(false)
                                        }, 1000)
                                        setAlertMessage('something went wrong.')
                                      }
                                    }
                                  }}
                                >
                                  <FormattedMessage id="Watch_Now" />
                                </Button>
                                )}
                              </Link>
                            </>
                            )
                      }

                  </>
                }
              </>
              )
        }
      </div>
      {VideoStream
        ? (
          <div className="player-info videoStream">
            <div className="league-header u-header">
              <div className="d-flex align-items-center header-i">
                <button
                  className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'}
                  onClick={(e) => {
                    e.preventDefault()
                    setVideoStream(false)
                  }}
                />
                <Button className="button-link bg-transparent py-2" tag={Link} to={`/home/${activeSport}`}><img src={home} /></Button>
                <div className={document.dir === 'rtl' ? 'text-end' : ''}>
                  <h1>
                    {data && data.sName ? data.sName : ''}
                    {' '}
                    {data && data.eStatus === 'I' ? <FormattedMessage id="In_Review" /> : ''}
                  </h1>
                  {!props.completed ? <p>{time || (data && data.dStartDate ? moment(data && data.dStartDate).format('MMMM Do YYYY, h:mm:ss a') : '')}</p> : data && data.eStatus && data.eStatus === 'L' ? <p><FormattedMessage id="Live" /></p> : data && data.eStatus === 'CMP' && <p><FormattedMessage id="Completed" /></p>}
                </div>
              </div>
            </div>
            <div className="videoShowing">
              <iframe
                allow="autoplay; encrypted-media"
                allowFullScreen
                frameBorder="0"
                src={data && data.sStreamUrl}
                title="video"
              />
            </div>
          </div>
          )
        : ''}
    </>
  )
}

Match.propTypes = {
  data: PropTypes.shape({
    length: PropTypes.number,
    bDisabled: PropTypes.bool,
    sAwayTeamShortName: PropTypes.string,
    map: PropTypes.func,
    sInfo: PropTypes.string,
    sSeasonName: PropTypes.string,
    eCategory: PropTypes.string,
    sSponsoredText: PropTypes.string,
    sName: PropTypes.string,
    oHomeTeam: PropTypes.object,
    oAwayTeam: PropTypes.object,
    sHomeTeamShortName: PropTypes.string,
    dStartDate: PropTypes.string,
    iTossWinnerId: PropTypes.string,
    sStreamUrl: PropTypes.string,
    eTossWinnerAction: PropTypes.string,
    nTeams: PropTypes.number,
    bLineupsOut: PropTypes.bool,
    nJoinedLeague: PropTypes.number,
    nBonusWin: PropTypes.number,
    aExtraWin: PropTypes.array,
    _id: PropTypes.string,
    iMatchId: PropTypes.string,
    eStatus: PropTypes.string,
    nWinnings: PropTypes.number,
    bWinningZone: PropTypes.bool
  }),
  match: PropTypes.object,
  icons: PropTypes.bool,
  completed: PropTypes.bool,
  loading: PropTypes.bool,
  upcoming: PropTypes.bool,
  liveStream: PropTypes.bool,
  noRedirect: PropTypes.bool,
  onlyInsideFeild: PropTypes.bool,
  live: PropTypes.bool,
  matchDetailsList: PropTypes.array,
  subIndex: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
}

export default Match
