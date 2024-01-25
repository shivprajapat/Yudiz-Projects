import React, {
  Fragment, useState, useEffect, useRef
} from 'react'
import moment from 'moment'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Button, Card, CardFooter, CardHeader, CardBody, Alert
} from 'reactstrap'
import yotubeIcon from '../../../assests/images/ic_live.svg'
import walletIcon from '../../../assests/images/ic_wallet.svg'
import infoIconBlue from '../../../assests/images/info-icon-blue.svg'
import homeIcon from '../../../assests/images/homeIconWhite.svg'
import notificationIcon from '../../../assests/images/notificationIcon.svg'
import { defaultPlayerRoleImages, maxValue } from '../../../utils/helper'
import Match from './Match'
import close from '../../../assests/images/close.svg'
import MatchDetails from '../../../HOC/SportsLeagueList/MatchDetails'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function LeagueHeader (props) {
  const {
    data,
    search,
    token,
    onGetMatchDetails,
    setPaymentSlide,
    teamPlayerList,
    uniquePlayerList,
    uniquePlayerLeagueList,
    completed, goToBack, backTab, setVideoStream, nextStep, setNextStep, VideoStream, notShowing, insideLeagueDetails, onMatchPlayer, onUniquePlayer, onUniquePlayerLeague
  } = props
  const [time, setTime] = useState('')
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [intervalRef, setIntervalRef] = useState(null)
  const [goHome, serGoHome] = useState(false)
  const [lineups, setLineups] = useState(false)
  const [teamHome, setTeamHome] = useState([])
  const [teamAway, setTeamAway] = useState([])
  const previousProps = useRef({ data }).current
  const { activeSport } = useActiveSports()
  const { sMediaUrl } = useGetUrl()

  const { sMatchId, sLeagueId, sportsType } = useParams()
  const { pathname, state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (sMatchId && token) {
      onGetMatchDetails(sMatchId)
    }
  }, [token])

  useEffect(() => {
    if (lineups && sMatchId) {
      if (insideLeagueDetails && sLeagueId) {
        onUniquePlayerLeague(sLeagueId)
      } else {
        token && onUniquePlayer(sMatchId)
      }
      (teamPlayerList?.length === 0 || !teamPlayerList) && onMatchPlayer(sMatchId)
    }
  }, [lineups])

  useEffect(() => {
    if (teamPlayerList?.length > 0 && lineups) {
      const home = []
      const away = []
      teamPlayerList.map((player) => {
        if ((player?.oTeam?.iTeamId === data?.oHomeTeam?.iTeamId) && player.bShow) {
          home.push(player)
        } else if ((player?.oTeam?.iTeamId === data?.oAwayTeam?.iTeamId) && player.bShow) {
          away.push(player)
        }
        return player
      })
      setTeamHome(home.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => {
        const nameA = a.eRole.toUpperCase() // ignore upper and lowercase
        const nameB = b.eRole.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        // names must be equal
        return 0
      }))
      setTeamAway(away.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => {
        const nameA = a.eRole.toUpperCase() // ignore upper and lowercase
        const nameB = b.eRole.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        // names must be equal
        return 0
      }))
    }
  }, [teamPlayerList, lineups])

  useEffect(() => {
    if (previousProps.data !== data) {
      if (data && data.dStartDate) {
        if ((new Date(data.dStartDate) > Date.now() + 86400000) || (new Date(data.dStartDate) < new Date(Date.now()))) {
          setTime(moment(data.dStartDate).format('lll'))
        } else {
          setIntervalRef(setInterval(() => {
            const duration = moment.duration(moment(data.dStartDate).diff(moment(new Date())))
            if ((duration?.seconds() < 0) || (duration?.minutes() < 0) || (duration?.hours() < 0)) {
              serGoHome(true)
            } else {
              setTime(`${duration.hours()}h ${duration.minutes()}m  ${duration.seconds()}s left `)
            }
          }, 0))
        }
      }
      return () => {
        clearInterval(intervalRef)
      }
    }
    return () => {
      previousProps.data = data
    }
  }, [data])

  useEffect(() => {
    if (goHome) {
      navigate(`/home/${sportsType}`)
    }
  }, [goHome])

  return (
    <>
      {alert && alertMessage ? <Alert className="select-all" color="primary" isOpen={alert}>{alertMessage}</Alert> : ''}
      <div className="league-header">
        <div className="d-flex align-items-center header-i justify-content-between">
          <div className="d-flex align-items-center">
            {
              goToBack
                ? (
                  <Fragment>
                    <Button
                    // tag={Link}
                    // to={{ pathname: goToBack, search: search || '', state: { tab: backTab || '1' } }}
                      className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'}
                      onClick={() => {
                        if (!nextStep && (pathname?.includes('/create-team/') || pathname?.includes('/copy-team/') || pathname.includes('/edit-team/'))) {
                          setNextStep(true)
                        } else {
                          navigate(goToBack, { search: search || '', state: { tab: backTab || '1' } })
                        }
                      }}
                    />
                  </Fragment>
                  )
                : (
                  <Fragment>
                    <Button className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'}
                      onClick={() => {
                        if (state && state.referUrl) {
                          navigate(state.referUrl, { tab: state.tab })
                          // } else if (!nextStep && setNextStep) {
                          //   setNextStep && setNextStep(true)
                        } else {
                          navigate(-1)
                        }
                      }}
                    />
                  </Fragment>
                  )
            }
            <Button className="button-link bg-transparent py-2" tag={Link} to={pathname === '/upcoming-match/leagues/:sportsType/:id/v1' ? `/home/${activeSport}/v1` : `/home/${activeSport}`}><img src={homeIcon} /></Button>
            <div>
              <h1>
                {data && data.sName ? data.sName : ''}
                {' '}
                {data && data.eStatus === 'I' ? <FormattedMessage id="In_Review" /> : ''}
                {' '}
                {data?.bLineupsOut && data?.eStatus === 'U' && (
                  <Button className="btn-lineups-league" onClick={() => setLineups(true)}>
                    <FormattedMessage id="Lineups_Out" />
                    <>
                      <img className={`icon-info i-button ${document.dir === 'rtl' ? 'me-1' : 'ms-1'}`} id="info-icon" src={infoIconBlue} type="button" />
                    </>
                  </Button>
                )}
                {' '}

              </h1>
              {!completed
                ? <p className={document.dir === 'rtl' ? 'text-end' : 'text-start'}>{time || (data && data.dStartDate ? moment(data && data.dStartDate).format('lll') : '')}</p>
                : data && data.eStatus && data.eStatus === 'L'
                  ? (
                    <p>
                      <span className="green-dot" />
                      <FormattedMessage id="Live" />
                    </p>
                    )
                  : data && data.eStatus === 'CMP' && <p><FormattedMessage id="Completed" /></p>}
            </div>
          </div>
          <ul className="d-flex m-0 ht-link">
            {props.showLinks
              ? (
                <>
                  <li><Link className="icon-message" to="/chats" /></li>
                  <li>
                    <Link to="/notifications">
                      <img alt={<FormattedMessage id="Notification" />} src={notificationIcon} width={20} />
                    </Link>
                  </li>
                </>
                )
              : ''}
            {
              props.showBalance && token && (
                <li className="me-2 mt-1" role="button">
                  {' '}
                  <img onClick={() => setPaymentSlide(true)} src={walletIcon} />
                  {' '}
                </li>
              )
            }
            {data && data.sStreamUrl && !notShowing
              ? (
                <li>
                  <img
                    onClick={() => {
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
                    }}
                    src={yotubeIcon}
                  />
                </li>
                )
              : ''}
          </ul>
        </div>
      </div>
      {VideoStream
        ? (
          <div className="player-info videoStream">
            <div className="league-header u-header">
              <div className="d-flex align-items-center header-i">
                <button className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'} onClick={() => setVideoStream(false)} />
                <Button className="button-link bg-transparent py-2" tag={Link} to={pathname.includes('/v1') ? `/home/${activeSport}/v1` : `/home/${activeSport}`}><img src={homeIcon} /></Button>
                <div className={document.dir === 'rtl' ? 'text-end' : ''}>
                  <h1>
                    {data && data.sName ? data.sName : ''}
                    {' '}
                    {data && data.eStatus === 'I' ? <FormattedMessage id="In_Review" /> : ''}
                  </h1>
                  {!completed ? <p>{time || (data && data.dStartDate ? moment(data && data.dStartDate).format('lll') : '')}</p> : data && data.eStatus && data.eStatus === 'L' ? <p><FormattedMessage id="Live" /></p> : data && data.eStatus === 'CMP' && <p><FormattedMessage id="Completed" /></p>}
                </div>
              </div>
            </div>
            <div className="videoShowing">
              <iframe
                allow="autoplay; encrypted-media"
                frameBorder="0"
                src={data && data.sStreamUrl}
                title="video"
              />
            </div>
          </div>
          )
        : ''}
      {lineups
        ? (
          <>
            <div className="s-team-bg" onClick={() => setLineups(false)} />
            <Card className="filter-card lineupsCard">
              <CardHeader className="d-flex align-items-center justify-content-between">
                <button><FormattedMessage id="Announced_Lineups" /></button>
                <button onClick={() => setLineups(false)}><img src={close} /></button>
              </CardHeader>
              <CardBody className="filter-box">
                <Match {...props} key={1} data={data} onlyInsideFeild upcoming />
                {
                  Array(maxValue(teamHome?.length, teamAway?.length)).fill().map((item, index) => {
                    const teamHomeName = teamHome[index]?.sName.split(' ')
                    const teamAwayName = teamAway[index]?.sName.split(' ')
                    return (
                      <Fragment key={index}>
                        <div className="compare-player bg-white">
                          <div className="p-c-box d-flex align-items-center justify-content-between">
                            <div className={`p-box d-flex align-items-center ${uniquePlayerList?.length > 0 && uniquePlayerList.includes(teamHome[index]?._id) && !insideLeagueDetails ? 'active' : ''} ${uniquePlayerLeagueList?.length > 0 && uniquePlayerLeagueList.includes(teamHome[index]?._id) && insideLeagueDetails ? 'active' : ''}`}>
                              <div className="img">
                                <img alt="" src={teamHome[index]?.sImage && sMediaUrl ? `${sMediaUrl}${teamHome[index]?.sImage}` : defaultPlayerRoleImages(sportsType, teamHome[index]?.eRole)} />
                              </div>
                              <div className="p-name">
                                <h3 className="p-0">{teamHome[index]?.sName && `${teamHomeName && teamHomeName.length >= 2 ? teamHome[index]?.sName[0] : teamHomeName[0]} ${teamHomeName && teamHomeName.length === 2 ? teamHomeName[1] : teamHomeName && teamHomeName.length === 3 ? `${teamHomeName[2]}` : ''}`}</h3>
                                <p>{teamHome[index]?.eRole}</p>
                              </div>
                            </div>
                            <div className={`p-box d-flex align-items-center ${uniquePlayerList?.length > 0 && uniquePlayerList.includes(teamAway[index]?._id) && !insideLeagueDetails ? 'active' : ''} ${uniquePlayerLeagueList?.length > 0 && uniquePlayerLeagueList.includes(teamAway[index]?._id) && insideLeagueDetails ? 'active' : ''}`}>
                              <div className="p-name text-end">
                                <h3 className="p-0">{teamAway[index]?.sName && `${teamAwayName && teamAwayName.length >= 2 ? teamAway[index]?.sName[0] : teamAwayName[0]} ${teamAwayName && teamAwayName.length === 2 ? teamAwayName[1] : teamAwayName && teamAwayName.length === 3 ? `${teamAwayName[1]} ${teamAwayName[2]}` : ''}`}</h3>
                                <p>{teamAway[index]?.eRole}</p>
                              </div>
                              <div className="img">
                                <img alt="" src={teamAway[index]?.sImage && sMediaUrl ? `${sMediaUrl}${teamAway[index]?.sImage}` : defaultPlayerRoleImages(sportsType, teamAway[index]?.eRole)} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    )
                  })
                }
              </CardBody>
              <CardFooter className="bg-trnsparent">
                <p><FormattedMessage id="Lineups_data_may_not_be_accurate" /></p>
                <span className="spanColor">
                  {' '}
                  <FormattedMessage id="Players_are_in_your_team" />
                </span>
              </CardFooter>
            </Card>
          </>
          )
        : ''}
    </>
  )
}

LeagueHeader.propTypes = {
  data: PropTypes.shape({
    sName: PropTypes.string,
    bLineupsOut: PropTypes.bool,
    sStreamUrl: PropTypes.string,
    dStartDate: PropTypes.oneOfType([
      PropTypes.Date,
      PropTypes.string
    ]),
    eStatus: PropTypes.string,
    oHomeTeam: PropTypes.shape({
      iTeamId: PropTypes.string
    }),
    oAwayTeam: PropTypes.shape({
      iTeamId: PropTypes.string
    })
  }),
  teamPlayerList: PropTypes.arrayOf(PropTypes.shape({
    length: PropTypes.number
  })),
  uniquePlayerList: PropTypes.array,
  uniquePlayerLeagueList: PropTypes.array,
  completed: PropTypes.bool,
  showLinks: PropTypes.bool,
  showBalance: PropTypes.bool,
  backTab: PropTypes.number,
  goToBack: PropTypes.string,
  setNextStep: PropTypes.func,
  onMatchPlayer: PropTypes.func,
  onUniquePlayer: PropTypes.func,
  onUniquePlayerLeague: PropTypes.func,
  insideLeagueDetails: PropTypes.bool,
  nextStep: PropTypes.string,
  setVideoStream: PropTypes.func,
  setPaymentSlide: PropTypes.func,
  VideoStream: PropTypes.bool,
  notShowing: PropTypes.bool,
  onGetMatchDetails: PropTypes.func,
  token: PropTypes.string,
  search: PropTypes.string
}

export default MatchDetails(LeagueHeader)
