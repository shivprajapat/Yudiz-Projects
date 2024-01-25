import React, { useEffect, useState, Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, CarouselControl, Carousel, CarouselItem } from 'reactstrap'
import { isUpperCase, allSportsRoles, defaultPlayerRoleImages } from '../../../utils/helper'
// import { useQueryState } from 'react-router-use-location-state'
import Loading from '../../../component/Loading'
import qs from 'query-string'
import homeIcon from '../../../assests/images/homeIconWhite.svg'
import TransparentLogo from '../../../assests/images/transparent_logo.svg'
import TeamList from '../../../HOC/SportsLeagueList/TeamList'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const classNames = require('classnames')

function MyTeamsPreview (props) {
  const { playerRoles, token, teamList, teamPlayerList, teamPreview, userTeam, loading, getUserTeam, setLoading, matchDetails, getDreamTeamFunc, dreamTeam } = props
  const [allTeams, setAllTeams] = useState([])
  const [team, setTeam] = useState({})
  // const [viewTeam, setViewTeam] = useState([])
  const [totalCredit, setTotalCredit] = useState(0)
  const [totalScorePoints, setTotalScorePoints] = useState(0)
  const [teamView, setTeamView] = useState(0)
  const [TeamName, setTeamName] = useState('')
  const [matchType, setMatchType] = useState('')
  const [animating, setAnimating] = useState(false)
  // const [userTeamId, setUserTeamId] = useState('')
  const { activeSport } = useActiveSports()
  const previousProps = useRef({
    userTeam, team, teamList, allTeams
  }).current
  const { sMediaUrl } = useGetUrl()

  const { sportsType, sMatchId, sUserTeamId, sUserLeagueId, index } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const navigate = useNavigate()
  const location = useLocation()

  // useEffect(() => {
  //   if (isDreamTeam) {
  //     getDreamTeamFunc()
  //   }
  // }, [])

  useEffect(() => {
    if (location.pathname.includes('/dream-team-preview/') && sMatchId) {
      getDreamTeamFunc(sMatchId, token)
      setTeamView(0)
    } else {
      if (index) {
        // setCurrentIndex(parseInt(obj.index))
        setTeamView(parseInt(index))
      }
      if (sportsType) {
        const sport = sportsType
        isUpperCase(sport) && navigate(`/my-teams-preview/${sport.toLowerCase()}/${sMatchId}/${sUserTeamId}`)
      }
      if (sUserTeamId && token) {
        // setUserTeamId(sUserTeamId)
        getUserTeam(sUserTeamId)
        setLoading(true)
      }
      // if (sMatchId && !matchPlayer) {
      //   getMatchPlayerList(sMatchId)
      // }
    }
  }, [token])

  useEffect(() => {
    if (location.pathname.includes('/dream-team-preview') && dreamTeam) {
      setAllTeams(dreamTeam)
    } else if (location?.state?.teamCreationPage) {
      setAllTeams(location?.state?.allTeams)
    } else if (teamList && teamList.length > 0 && (!location.pathname.includes('/dream-team-preview'))) {
      setAllTeams(teamList)
      setTeamView(teamList?.findIndex(data => data._id === sUserTeamId))
    }
  }, [teamList, location.state, dreamTeam])

  useEffect(() => {
    if (dreamTeam && Object.keys(dreamTeam)?.length > 0) {
      const allteams = []
      setAllTeams([...allteams, dreamTeam])
    }
  }, [dreamTeam])

  const next = () => {
    if (animating) return
    const nextIndex = teamView === allTeams?.length - 1 ? 0 : teamView + 1
    setTeamView(nextIndex)
    // setCurrentIndex(nextIndex)
    // changeTeam(nextIndex)
    const userTeamId = allTeams[nextIndex]?._id
    navigate(`/my-teams-preview/${sportsType.toLowerCase()}/${sMatchId}/${userTeamId}`,
      {
        search: `?${qs.stringify({
          homePage: homePage ? 'yes' : undefined
        })}`,
        replace: true
      })
  }

  const previous = () => {
    if (animating) return
    const nextIndex = teamView === 0 ? allTeams?.length - 1 : teamView - 1
    setTeamView(nextIndex)
    // setCurrentIndex(nextIndex)
    // changeTeam(nextIndex)
    const userTeamId = allTeams[nextIndex]?._id
    navigate(`/my-teams-preview/${sportsType.toLowerCase()}/${sMatchId}/${userTeamId}`,
      {
        search: `?${qs.stringify({
          homePage: homePage ? 'yes' : undefined
        })}`,
        replace: true
      })
  }

  useEffect(() => {
    if (allTeams && teamPlayerList?.length > 0 && playerRoles) {
      let TotalCredit = 0
      let TotalScorePoints = 0
      if (allTeams && allTeams.length > 0 && teamPlayerList) {
        const playerRole = playerRoles?.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a?.nPosition?.toString().localeCompare(b?.nPosition?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map(Role => Role.sName)
        const players = Object.assign({}, ...playerRole?.map(key => ({ [key]: [] })))
        allTeams?.length > 0 && allTeams[teamView]?.aPlayers?.length > 0 && allTeams[teamView]?.aPlayers?.map((Player) => {
          let PlayerDetails
          if (dreamTeam && Object.keys(dreamTeam).length > 0) {
            PlayerDetails = teamPlayerList && teamPlayerList.length > 0 && teamPlayerList.find(player => player._id === Player?.iMatchPlayerId)
          } else {
            PlayerDetails = teamPlayerList && teamPlayerList.length > 0 && teamPlayerList.find(player => player._id === Player)
          }
          Object.entries(players).map(([key, value]) => {
            return (key === PlayerDetails?.eRole) && players[PlayerDetails?.eRole].push(PlayerDetails)
          })
          TotalCredit = TotalCredit + PlayerDetails?.nFantasyCredit
          setTotalCredit(TotalCredit)
          if (PlayerDetails && PlayerDetails.nScoredPoints) {
            if ((Player?.iMatchPlayerId || Player) === allTeams[teamView].iCaptainId) {
              const newPoints = (Number(PlayerDetails.nScoredPoints) * 2)
              TotalScorePoints = TotalScorePoints + newPoints
            } else if ((Player?.iMatchPlayerId || Player) === allTeams[teamView].iViceCaptainId) {
              const newPoints = (Number(PlayerDetails.nScoredPoints) * 1.5)
              TotalScorePoints = TotalScorePoints + newPoints
            } else { TotalScorePoints = TotalScorePoints + Number(PlayerDetails.nScoredPoints) }
          }
          setTotalScorePoints(TotalScorePoints)
          return players
        })
        const tempData = []
        players && Object.entries(players).map(([key, value]) => value && value.length > 0 && value.sort((a, b) => a.sName > b.sName ? 1 : -1).map(playerInfo => tempData.push(playerInfo)))
        setTeam(players)
      }
    }
    return () => {
      previousProps.allTeams = allTeams
    }
  }, [allTeams, userTeam, teamPlayerList, playerRoles, dreamTeam])

  // useEffect(() => {
  //   if (teamView >= 0) {
  //     let TotalCredits = 0
  //     let TotalScorePoints = 0

  //     if (allTeams && allTeams.length !== 0) {
  //       const playerRole = playerRoles?.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a?.nPosition?.toString().localeCompare(b?.nPosition?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map(Role => Role.sName)
  //       const players = Object.assign(...playerRole?.map(key => ({ [key]: [] })))
  //       allTeams && allTeams.length !== 0 && allTeams.map((Player) => {
  //         const PlayerDetails = teamPlayerList && teamPlayerList.length !== 0 && teamPlayerList.find(player => player._id === Player)
  //         Object.entries(players).map(([key, value]) => {
  //           return key === PlayerDetails?.eRole && players[PlayerDetails?.eRole].push(PlayerDetails)
  //         })
  //         TotalCredits = TotalCredits + PlayerDetails?.nFantasyCredit
  //         setTotalCredit(TotalCredits)
  //         if (PlayerDetails && PlayerDetails.nScoredPoints) {
  //           if (Player === allTeams[teamView].iCaptainId) {
  //             const newPoints = (Number(PlayerDetails.nScoredPoints) * 2)
  //             TotalScorePoints = TotalScorePoints + newPoints
  //           } else if (Player === allTeams[teamView].iViceCaptainId) {
  //             const newPoints = (Number(PlayerDetails.nScoredPoints) * 1.5)
  //             TotalScorePoints = TotalScorePoints + newPoints
  //           } else { TotalScorePoints = TotalScorePoints + Number(PlayerDetails.nScoredPoints) }
  //         }
  //         setTotalScorePoints(TotalScorePoints)
  //         return TotalCredits
  //       })
  //       setTeam(players)
  //     }
  //   }
  // }, [teamView])

  function PlayerInfoFun (playerId) {
    // setPlayerId(playerId)
    if (location?.state?.teamCreationPage) {
      navigate(`/create-team/view-player-league-info/${sportsType}/${sMatchId}/${playerId}`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined
          })}`,
          state: { teamCreationPage: true }
        })
    } else if (matchDetails && matchDetails.eStatus === 'U') {
      navigate(`/view-player-league-info/${(sportsType).toLowerCase()}/${sMatchId}/${sUserTeamId}/${playerId}`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined,
            playerLeagueInfo: 'y'
          })}`
        })
    } else {
      navigate(`/view-player-info/${(sportsType).toLowerCase()}/${sMatchId}/${sUserTeamId}/${playerId}`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined,
            userLeague: sUserLeagueId || undefined
          })}`
        })
    }
  }

  useEffect(() => {
    if (matchDetails) {
      matchDetails.oHomeTeam && matchDetails.oHomeTeam.sName && setTeamName(matchDetails.oHomeTeam.sName)
      matchDetails.eStatus === 'U' && setMatchType('upcoming')
    }
  }, [matchDetails])

  const slides = allTeams && allTeams.length > 0 && allTeams.map((item) => {
    return (
      <CarouselItem
        key={item._id}
        className="custom-tag"
        onExited={() => setAnimating(false)}
        onExiting={() => setAnimating(true)}
        tag="div"
      >
        <div className="ground w-100">
          <Fragment>
            {Object.entries(team).map(([key, value]) => {
              return (
                sportsType !== 'csgo'
                  ? (
                    <div key={value._id || value.iMatchPlayerId} className="ground-c w-100">
                      <h3>
                        {allSportsRoles(key)}
                      </h3>
                      <div className="player-list d-flex align-items-center w-100 justify-content-center">
                        {
                              value && value.length !== 0 && value.map((playerInfo) => {
                                const playerName = playerInfo?.sName?.split(' ')
                                return (
                                  <div key={playerInfo._id || playerInfo.iMatchPlayerId} className="pbg" onClick={() => { PlayerInfoFun(playerInfo._id || playerInfo?.iMatchPlayerId) }}>
                                    <div className="pg-img">
                                      <img key={`inside${playerInfo?.eRole}`} alt="" src={playerInfo?.sImage && sMediaUrl ? `${sMediaUrl}${playerInfo?.sImage}` : defaultPlayerRoleImages(sportsType, playerInfo?.eRole)} />
                                      { playerInfo?.bShow && matchType === 'upcoming' &&
                                        <span className="tag2" />
                                      }
                                      {
                                        (playerInfo?._id === userTeam?.iCaptainId)
                                          ? <span className="tag"><FormattedMessage id="C" /></span>
                                          : (playerInfo?._id === userTeam?.iViceCaptainId)
                                              ? <span className="tag"><FormattedMessage id="VC" /></span>
                                              : ''
                                      }
                                    </div>
                                    <p className={classNames({ backDarkBlue: TeamName === playerInfo.sTeamName, backWhitePlayer: TeamName !== playerInfo.sTeamName })}>
                                      {playerInfo?.sName?.indexOf(' ') >= 0 ? playerName[0][0] + ' ' + playerName[playerName.length - 1] : playerName}
                                    </p>
                                    {
                                      !teamPreview
                                        ? (
                                          <span>
                                            {matchType === 'upcoming'
                                              ? playerInfo && playerInfo.nFantasyCredit > 0
                                                ? <FormattedMessage id="Cr">{msg => playerInfo.nFantasyCredit + ' ' + msg}</FormattedMessage>
                                                : (<FormattedMessage id="Zero_CR" />)
                                              : (playerInfo?.iMatchPlayerId === allTeams[teamView]?.iCaptainId) || (playerInfo?._id === allTeams[teamView]?.iCaptainId)
                                                  ? (Number(playerInfo.nScoredPoints) * 2) + ' Pts '
                                                  : (playerInfo?.iMatchPlayerId === allTeams[teamView]?.iViceCaptainId) || (playerInfo?._id === allTeams[teamView]?.iViceCaptainId)
                                                      ? (Number(playerInfo.nScoredPoints) * 1.5) + ' Pts '
                                                      : parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts '
                                              }
                                          </span>
                                          )
                                          // (
                                          // <span>{matchType === 'upcoming' ? playerInfo && playerInfo.nFantasyCredit ? playerInfo.nFantasyCredit + ' Cr ' : (<FormattedMessage id="Zero_CR" />) : playerInfo && playerInfo.nScoredPoints ? parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts ' : (<FormattedMessage id="Zero_Pts" />)}</span>
                                          // )
                                        : (
                                          <span>
                                            {
                                            playerInfo && playerInfo.nFantasyCredit > 0
                                              ? <FormattedMessage id="Cr">{msg => playerInfo.nFantasyCredit + ' ' + msg}</FormattedMessage>
                                              : (<FormattedMessage id="Zero_CR" />)
                                            }
                                          </span>
                                          )
                                    }
                                  </div>
                                )
                              })
                            }
                      </div>
                    </div>
                    )
                  : (
                    <>
                      <div key={value._id || value.iMatchPlayerId} className="ground-c w-100">
                        <div className="player-list d-flex align-items-center w-100 justify-content-around">
                          {
                              value && value.length !== 0 && value.map((playerInfo, index) => {
                                const playerName = playerInfo?.sName?.split(' ')
                                return (
                                  <>
                                    {index < 2 && (
                                      <div key={playerInfo._id || playerInfo.iMatchPlayerId} className="pbg" onClick={() => { PlayerInfoFun(playerInfo._id || playerInfo?.iMatchPlayerId) }}>
                                        <div className="pg-img">
                                          <img key={`inside${playerInfo?.eRole}`} alt="" src={playerInfo?.sImage && sMediaUrl ? `${sMediaUrl}${playerInfo?.sImage}` : defaultPlayerRoleImages(sportsType, playerInfo?.eRole)} />
                                          { playerInfo?.bShow && matchType === 'upcoming' &&
                                          <span className="tag2" />
                                        }
                                          {
                                          (playerInfo?._id === userTeam?.iCaptainId)
                                            ? <span className="tag"><FormattedMessage id="C" /></span>
                                            : (playerInfo?._id === userTeam?.iViceCaptainId)
                                                ? <span className="tag"><FormattedMessage id="VC" /></span>
                                                : ''
                                        }
                                        </div>
                                        <p className={classNames({ backWhiteOrange: TeamName === playerInfo.sTeamName, backWhitePlayer: TeamName !== playerInfo.sTeamName })}>
                                          {playerInfo?.sName?.indexOf(' ') >= 0 ? playerName[0][0] + ' ' + playerName[playerName.length - 1] : playerName}
                                        </p>
                                        {
                                        !teamPreview
                                          ? (
                                            <span>
                                              {matchType === 'upcoming'
                                                ? playerInfo && playerInfo.nFantasyCredit > 0
                                                  ? <FormattedMessage id="Cr">{msg => playerInfo.nFantasyCredit + ' ' + msg}</FormattedMessage>
                                                  : (<FormattedMessage id="Zero_CR" />)
                                                : (playerInfo?.iMatchPlayerId === allTeams[teamView]?.iCaptainId) || (playerInfo?._id === allTeams[teamView]?.iCaptainId)
                                                    ? (Number(playerInfo.nScoredPoints) * 2) + ' Pts '
                                                    : (playerInfo?.iMatchPlayerId === allTeams[teamView]?.iViceCaptainId) || (playerInfo?._id === allTeams[teamView]?.iViceCaptainId)
                                                        ? (Number(playerInfo.nScoredPoints) * 1.5) + ' Pts '
                                                        : parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts '
                                                }
                                            </span>
                                            )
                                            // (
                                            // <span>{matchType === 'upcoming' ? playerInfo && playerInfo.nFantasyCredit ? playerInfo.nFantasyCredit + ' Cr ' : (<FormattedMessage id="Zero_CR" />) : playerInfo && playerInfo.nScoredPoints ? parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts ' : (<FormattedMessage id="Zero_Pts" />)}</span>
                                            // )
                                          : (
                                            <span>
                                              {
                                              playerInfo && playerInfo.nFantasyCredit > 0
                                                ? <FormattedMessage id="Cr">{msg => playerInfo.nFantasyCredit + ' ' + msg}</FormattedMessage>
                                                : (<FormattedMessage id="Zero_CR" />)
                                              }
                                            </span>
                                            )
                                      }
                                      </div>
                                    )}
                                  </>
                                )
                              })
                            }
                        </div>
                      </div>
                      <div key={value._id || value.iMatchPlayerId} className="ground-c w-100">
                        <div className="player-list d-flex align-items-center w-100 justify-content-center">
                          {
                              value && value.length !== 0 && value.map((playerInfo, index) => {
                                const playerName = playerInfo?.sName?.split(' ')
                                return (
                                  <>
                                    {index === 2 && (
                                      <div key={playerInfo._id || playerInfo.iMatchPlayerId} className="pbg" onClick={() => { PlayerInfoFun(playerInfo._id || playerInfo?.iMatchPlayerId) }}>
                                        <div className="pg-img">
                                          <img key={`inside${playerInfo?.eRole}`} alt="" src={playerInfo?.sImage && sMediaUrl ? `${sMediaUrl}${playerInfo?.sImage}` : defaultPlayerRoleImages(sportsType, playerInfo?.eRole)} />
                                          { playerInfo?.bShow && matchType === 'upcoming' &&
                                          <span className="tag2" />
                                        }
                                          {
                                          (playerInfo?._id === userTeam?.iCaptainId)
                                            ? <span className="tag"><FormattedMessage id="C" /></span>
                                            : (playerInfo?._id === userTeam?.iViceCaptainId)
                                                ? <span className="tag"><FormattedMessage id="VC" /></span>
                                                : ''
                                        }
                                        </div>
                                        <p className={classNames({ backWhiteOrange: TeamName === playerInfo.sTeamName, backWhitePlayer: TeamName !== playerInfo.sTeamName })}>
                                          {playerInfo?.sName?.indexOf(' ') >= 0 ? playerName[0][0] + ' ' + playerName[playerName.length - 1] : playerName}
                                        </p>
                                        {
                                        !teamPreview
                                          ? (
                                            <span>
                                              {matchType === 'upcoming'
                                                ? playerInfo && playerInfo.nFantasyCredit > 0
                                                  ? <FormattedMessage id="Cr">{msg => playerInfo.nFantasyCredit + ' ' + msg}</FormattedMessage>
                                                  : (<FormattedMessage id="Zero_CR" />)
                                                : (playerInfo?.iMatchPlayerId === allTeams[teamView]?.iCaptainId) || (playerInfo?._id === allTeams[teamView]?.iCaptainId)
                                                    ? (Number(playerInfo.nScoredPoints) * 2) + ' Pts '
                                                    : (playerInfo?.iMatchPlayerId === allTeams[teamView]?.iViceCaptainId) || (playerInfo?._id === allTeams[teamView]?.iViceCaptainId)
                                                        ? (Number(playerInfo.nScoredPoints) * 1.5) + ' Pts '
                                                        : parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts '
                                                }
                                            </span>
                                            )
                                            // (
                                            // <span>{matchType === 'upcoming' ? playerInfo && playerInfo.nFantasyCredit ? playerInfo.nFantasyCredit + ' Cr ' : (<FormattedMessage id="Zero_CR" />) : playerInfo && playerInfo.nScoredPoints ? parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts ' : (<FormattedMessage id="Zero_Pts" />)}</span>
                                            // )
                                          : (
                                            <span>
                                              {
                                              playerInfo && playerInfo.nFantasyCredit > 0
                                                ? <FormattedMessage id="Cr">{msg => playerInfo.nFantasyCredit + ' ' + msg}</FormattedMessage>
                                                : (<FormattedMessage id="Zero_CR" />)
                                              }
                                            </span>
                                            )
                                      }
                                      </div>
                                    )}
                                  </>
                                )
                              })
                            }
                        </div>
                      </div>
                      <div key={value._id || value.iMatchPlayerId} className="ground-c w-100">
                        <div className="player-list d-flex align-items-center w-100 justify-content-around">
                          {
                              value && value.length !== 0 && value.map((playerInfo, index) => {
                                const playerName = playerInfo?.sName?.split(' ')
                                return (
                                  <>
                                    {index > 2 && (
                                      <div key={playerInfo._id || playerInfo.iMatchPlayerId} className="pbg" onClick={() => { PlayerInfoFun(playerInfo._id || playerInfo?.iMatchPlayerId) }}>
                                        <div className="pg-img">
                                          <img key={`inside${playerInfo?.eRole}`} alt="" src={playerInfo?.sImage && sMediaUrl ? `${sMediaUrl}${playerInfo?.sImage}` : defaultPlayerRoleImages(sportsType, playerInfo?.eRole)} />
                                          { playerInfo?.bShow && matchType === 'upcoming' &&
                                          <span className="tag2" />
                                        }
                                          {
                                          (playerInfo?._id === userTeam?.iCaptainId)
                                            ? <span className="tag"><FormattedMessage id="C" /></span>
                                            : (playerInfo?._id === userTeam?.iViceCaptainId)
                                                ? <span className="tag"><FormattedMessage id="VC" /></span>
                                                : ''
                                        }
                                        </div>
                                        <p className={classNames({ backWhiteOrange: TeamName === playerInfo.sTeamName, backWhitePlayer: TeamName !== playerInfo.sTeamName })}>
                                          {playerInfo?.sName?.indexOf(' ') >= 0 ? playerName[0][0] + ' ' + playerName[playerName.length - 1] : playerName}
                                        </p>
                                        {
                                        !teamPreview
                                          ? (
                                            <span>
                                              {matchType === 'upcoming'
                                                ? playerInfo && playerInfo.nFantasyCredit > 0
                                                  ? <FormattedMessage id="Cr">{msg => playerInfo.nFantasyCredit + ' ' + msg}</FormattedMessage>
                                                  : (<FormattedMessage id="Zero_CR" />)
                                                : (playerInfo?.iMatchPlayerId === allTeams[teamView]?.iCaptainId) || (playerInfo?._id === allTeams[teamView]?.iCaptainId)
                                                    ? (Number(playerInfo.nScoredPoints) * 2) + ' Pts '
                                                    : (playerInfo?.iMatchPlayerId === allTeams[teamView]?.iViceCaptainId) || (playerInfo?._id === allTeams[teamView]?.iViceCaptainId)
                                                        ? (Number(playerInfo.nScoredPoints) * 1.5) + ' Pts '
                                                        : parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts '
                                                }
                                            </span>
                                            )
                                            // (
                                            // <span>{matchType === 'upcoming' ? playerInfo && playerInfo.nFantasyCredit ? playerInfo.nFantasyCredit + ' Cr ' : (<FormattedMessage id="Zero_CR" />) : playerInfo && playerInfo.nScoredPoints ? parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts ' : (<FormattedMessage id="Zero_Pts" />)}</span>
                                            // )
                                          : (
                                            <span>
                                              {
                                              playerInfo && playerInfo.nFantasyCredit > 0
                                                ? <FormattedMessage id="Cr">{msg => playerInfo.nFantasyCredit + ' ' + msg}</FormattedMessage>
                                                : (<FormattedMessage id="Zero_CR" />)
                                              }
                                            </span>
                                            )
                                      }
                                      </div>
                                    )}
                                  </>
                                )
                              })
                            }
                        </div>
                      </div>
                    </>
                    )
              )
            })
                  }
          </Fragment>
        </div>
      </CarouselItem>
    )
  })

  // function changeTeam (index) {
  //   const playerRoles = playerRoles?.aPlayerRole?.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a?.nPosition?.toString().localeCompare(b?.nPosition?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map(Role => Role.sName)
  //   const players = Object.assign(...playerRoles?.map(key => ({ [key]: [] })))
  //   allTeams[index].aPlayers && allTeams[index].aPlayers.length !== 0 && allTeams[index].aPlayers.map((Player) => {
  //     const PlayerDetails = teamPlayerList && teamPlayerList.length !== 0 && teamPlayerList.find(player => player._id === Player)
  //     Object.entries(players).map(([key, value]) => {
  //       return key === PlayerDetails?.eRole && players[PlayerDetails?.eRole].push(PlayerDetails)
  //     })
  //     return players
  //   })
  //   setTeam(players)
  // }

  return (
    <>
      <div className="p-logo">
        <img alt={<FormattedMessage id='Transparent_Logo' />} src={TransparentLogo} />
      </div>
      {loading
        ? <Loading />
        : (
          <Fragment>
            <div className={classNames('preview d-flex align-items-center justify-content-center', { 'p-cricket': sportsType === 'cricket', 'p-football': sportsType === 'football', 'p-basketball': sportsType === 'basketball', 'p-baseball': sportsType === 'baseball', 'p-kabaddi': sportsType === 'kabaddi', 'p-hockey': sportsType === 'hockey', 'p-csgo': sportsType === 'csgo' })}>
              <div className="p-header d-flex align-items-center justify-content-between zIndex">
                <div className="d-flex align-items-center header-i">
                  <button className={document.dir === 'rtl' ? 'bg-transparent icon-right-arrow' : 'bg-transparent icon-left-arrow'}
                    onClick={() => {
                      if (location?.state?.teamCreationPage) {
                        navigate(`/create-team/${sportsType}/${sMatchId}`,
                          {
                            search: `?${qs.stringify({
                              homePage: homePage ? 'yes' : undefined
                            })}`,
                            state: { ...location.state, allTeams, captainViceCaptainPage: location?.state?.captainViceCaptainPage ? 'yes' : '' }
                          })
                      } else if (matchDetails) {
                        if (matchDetails.eStatus === 'U') {
                          navigate(`/upcoming-match/leagues/${sportsType}/${sMatchId}`,
                            {
                              search: `?${qs.stringify({
                                homePage: homePage ? 'yes' : undefined
                              })}`
                            })
                        } else if (matchDetails.eStatus === 'L') {
                          navigate(`/live-match/leagues/${sportsType}/${sMatchId}`)
                        } else if (matchDetails.eStatus === 'I' || matchDetails.eStatus === 'CMP') {
                          navigate(`/completed-match/leagues/${sportsType}/${sMatchId}?activeState=2`)
                        }
                      }
                    }}
                  />
                  <Button className='button-link bg-transparent py-2' tag={Link} to={`/home/${activeSport}`}><img src={homeIcon} /></Button>
                </div>
                {/* <div>
                  {
                    !(matchType === 'upcoming') && locationMatch.path !== '/completed-match/leagues/:sportsType/:id'
                      ? <button className="bg-transparent mr-3 icon-refresh"
                        onClick={(e) => refreshContent(e)}
                        ></button>
                      : ''
                  }
                </div> */}
              </div>
              <Fragment>
                <Carousel
                  activeIndex={teamView}
                  className="w-100"
                  interval={false}
                  next={next}
                  previous={previous}
                  slide={false}
                >
                  {slides}
                  {
                    allTeams?.length > 1 && (
                      <Fragment>
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={() => previous()} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={() => next()} />
                      </Fragment>
                    )
                  }
                </Carousel>
              </Fragment>
              {allTeams.length >= 1 && (
              <div className="np-bottom">
                <div className="d-flex align-items-center justify-content-between">
                  <p className="txt">{allTeams && allTeams.length > 0 && allTeams[teamView]?.sName}</p>
                  {allTeams && allTeams.length > 1 && <p className="txt">{(teamView + 1) + '/' + allTeams?.length}</p>}
                  <p className="txt">
                    {matchType === 'upcoming' ? <FormattedMessage id="Total_Credits" /> : <FormattedMessage id="Total_Points" />}
                    :
                    {' '}
                    {matchType === 'upcoming' ? totalCredit : totalScorePoints}
                  </p>
                </div>
              </div>
              )}
            </div>
          </Fragment>
          )
      }
    </>
  )
}

MyTeamsPreview.propTypes = {
  data: PropTypes.shape({
    aPlayers: PropTypes.func,
    sName: PropTypes.string
  }),
  token: PropTypes.string,
  onBackClick: PropTypes.func,
  userTeam: PropTypes.object,
  matchDetails: PropTypes.shape({
    eStatus: PropTypes.string,
    oHomeTeam: PropTypes.shape({
      sName: PropTypes.string
    })
  }),
  getMatchPlayerList: PropTypes.func,
  getUserTeam: PropTypes.func,
  teamPreview: PropTypes.bool,
  setLoading: PropTypes.bool,
  loading: PropTypes.bool,
  teamList: PropTypes.array,
  teamPlayerList: PropTypes.array,
  playerRoles: PropTypes.object,
  getDreamTeamFunc: PropTypes.func,
  dreamTeam: PropTypes.object
}

export default TeamList(MyTeamsPreview)
