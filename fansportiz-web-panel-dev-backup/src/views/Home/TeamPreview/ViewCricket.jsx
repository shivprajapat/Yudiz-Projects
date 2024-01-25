/* eslint-disable react/jsx-key */
import React, { useEffect, useState, Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import {
  Button, Card, CardBody, CardFooter, CardHeader, Carousel, CarouselControl, CarouselItem
} from 'reactstrap'
import {
  TelegramShareButton, LinkedinShareButton, LinkedinIcon, TelegramIcon, WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon, FacebookMessengerShareButton, FacebookMessengerIcon, TwitterShareButton, TwitterIcon
} from 'react-share'
import config from '../../../config/config'
import TransparentLogo from '../../../assests/images/transparent_logo.svg'
import { allSportsRoles, defaultPlayerRoleImages } from '../../../utils/helper'
import Loading from '../../../component/Loading'
import qs from 'query-string'
import close from '../../../assests/images/close.svg'
import TeamList from '../../../HOC/SportsLeagueList/TeamList'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const classNames = require('classnames')

function PreviewCricket (props) {
  const { allLeaderBoardList, myTeamsLeaderBoardList, getMyTeamLeaderBoardListFunc, myAllTeamPagination, completed, getMatchPlayerList, loading, refreshContent, teamPreview, getUserTeam, userTeam, matchDetails, playerRoles, teamPlayerList, token } = props
  const [allTeams, setAllTeams] = useState([])
  const [team, setTeams] = useState([])
  const [AllLeaderBoardList, setAllLeaderBoardList] = useState([])
  const [matchType, setMatchType] = useState('')
  const [TeamName, setTeamName] = useState('')
  const [ShareTeam, setShareTeam] = useState(false)
  const { index } = useParams()
  const [teamView, setTeamView] = useState(index || 0)
  // const [viewTeam, setViewTeam] = useState([])
  const [teamDetails, setTeamDetails] = useState([])
  const [totalCredit, setTotalCredit] = useState(0)
  const [totalScorePoints, setTotalScorePoints] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [value] = useState(0)
  const { sMediaUrl } = useGetUrl()

  const { sUserLeagueId, sMatchId, sUserTeamId, sportsType } = useParams()
  const [searchParms] = useSearchParams()
  const homePage = searchParms.get('homePage')
  const navigate = useNavigate()
  const location = useLocation()

  const limit = location?.state?.allUserLeagues
  const previousProps = useRef({ userTeam, team, allTeams, allLeaderBoardList, myTeamsLeaderBoardList }).current

  // useEffect(() => {
  //   if (myTeamPreViewUpcoming && userTeamId) {
  //     getUserTeam(userTeamId)
  //     setLoading(true)
  //   } else {
  //     changeTeam(teamView)
  //   }
  // }, [myTeamPreViewUpcoming, userTeamId])

  useEffect(() => {
    if (token && sUserLeagueId) {
      myAllTeamPagination(limit, value, sUserLeagueId)
      getMyTeamLeaderBoardListFunc(sUserLeagueId)
    }
    if (token && sMatchId) {
      getMatchPlayerList(sMatchId)
    }
  }, [token, sUserLeagueId])

  useEffect(() => {
    if (token && sUserTeamId) {
      getUserTeam(sUserTeamId)
    }
    if (token && index) {
      setTeamView(parseInt(index))
    }
  }, [token, sUserTeamId])

  useEffect(() => {
    if (previousProps.allLeaderBoardList !== allLeaderBoardList) {
      if (allLeaderBoardList && allLeaderBoardList.length !== 0 && myTeamsLeaderBoardList) {
        const myTeams = myTeamsLeaderBoardList.map(data => data._id)
        const allUsers = allLeaderBoardList?.filter(data => !myTeams.includes(data._id))
        setAllLeaderBoardList(AllLeaderBoardList => [...AllLeaderBoardList, ...allUsers])
      }
    }
    return () => {
      previousProps.allLeaderBoardList = allLeaderBoardList
      previousProps.myTeamsLeaderBoardList = myTeamsLeaderBoardList
    }
  }, [allLeaderBoardList, myTeamsLeaderBoardList])

  useEffect(() => {
    if (matchType === 'U' && myTeamsLeaderBoardList && myTeamsLeaderBoardList.length !== 0) {
      const allUserLeagues = [...myTeamsLeaderBoardList.sort((a, b) => b.nTotalPoints - a.nTotalPoints)]
      setAllTeams(allUserLeagues)
    } else if (matchType !== 'U' && myTeamsLeaderBoardList && myTeamsLeaderBoardList.length !== 0 && AllLeaderBoardList && AllLeaderBoardList.length !== 0) {
      const allUserLeagues = [...myTeamsLeaderBoardList.sort((a, b) => b.nTotalPoints - a.nTotalPoints), ...AllLeaderBoardList.sort((a, b) => b.nTotalPoints - a.nTotalPoints)]
      setAllTeams(allUserLeagues)
    }
  }, [AllLeaderBoardList, myTeamsLeaderBoardList, matchType])

  useEffect(() => { // handle the response
    if (previousProps.value !== value) {
      if (value) {
        myAllTeamPagination(limit, value, sUserLeagueId)
        getMyTeamLeaderBoardListFunc(sUserLeagueId)
      }
    }
    return () => {
      previousProps.value = value
    }
  }, [value])

  // useEffect(() => {
  //   const Team = []
  //   if (matchPlayer && matchPlayer.length > 0 && userTeam) {
  //     matchPlayer.forEach(player => {
  //       if (userTeam && userTeam.aPlayers?.length > 0 && userTeam.aPlayers.some(player2 => player._id === player2.iMatchPlayerId)) {
  //         Team.push(player)
  //       }
  //     })
  //   }
  //   setViewTeam(Team)
  // }, [matchPlayer, userTeam])

  const next = () => {
    if (animating) return
    const nextIndex = teamView === allTeams?.length - 1 ? 0 : teamView + 1
    // setTeamView(parseInt(nextIndex))
    // changeTeam(nextIndex)
    // if (nextIndex > limit) {
    //   setValue(value => value + limit)
    // }
    const userTeamId = allTeams[nextIndex]?.iUserTeamId
    navigate(`/team-preview/${sportsType.toLowerCase()}/${sMatchId}/${sUserLeagueId}/${userTeamId}/${nextIndex}`,
      {
        search: `?${qs.stringify({
          homePage: homePage ? 'yes' : undefined
        })}`,
        replace: true
      })
  }

  const previous = () => {
    if (animating) return
    const nextIndex = teamView === 0 ? allTeams.length - 1 : teamView - 1
    // setTeamView(parseInt(nextIndex))
    // changeTeam(nextIndex)
    const userTeamId = allTeams[nextIndex]?.iUserTeamId
    navigate(`/team-preview/${sportsType.toLowerCase()}/${sMatchId}/${sUserLeagueId}/${userTeamId}/${nextIndex}`,
      {
        search: `?${qs.stringify({
          homePage: homePage ? 'yes' : undefined
        })}`,
        replace: true
      })
  }

  useEffect(() => {
    if (teamPlayerList) {
      let TotalCredits = 0
      let TotalScorePoints = 0
      if (userTeam && userTeam.length !== 0 && playerRoles) {
        const playerRole = playerRoles?.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a?.nPosition?.toString().localeCompare(b?.nPosition?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map(Role => Role.sName)
        const players = Object.assign({}, ...playerRole?.map(key => ({ [key]: [] })))
        userTeam?.aPlayers?.map((Player) => {
          const PlayerDetails = teamPlayerList?.length > 0 && teamPlayerList?.find(player => player._id === Player.iMatchPlayerId)
          Object.entries(players).map(([key, value]) => {
            return (key === PlayerDetails?.eRole) && players[PlayerDetails?.eRole].push(PlayerDetails)
          })
          TotalCredits = TotalCredits + Player.nFantasyCredit
          setTotalCredit(TotalCredits)
          if (Player && Player.iMatchPlayerId && (Player.iMatchPlayerId ? Player.iMatchPlayerId === userTeam.iCaptainId : Player === userTeam.iCaptainId)) {
            const newPoints = (Number(Player.nScoredPoints) * 2)
            TotalScorePoints = TotalScorePoints + newPoints
          } else if (Player && Player.iMatchPlayerId && (Player.iMatchPlayerId ? Player.iMatchPlayerId === userTeam.iViceCaptainId : Player === userTeam.iViceCaptainId)) {
            const newPoints = (Number(Player.nScoredPoints) * 1.5)
            TotalScorePoints = TotalScorePoints + newPoints
          } else { TotalScorePoints = TotalScorePoints + Number(Player.nScoredPoints) }
          setTotalScorePoints(TotalScorePoints)
          return players
        })
        setTeamDetails(userTeam)
        // if (matchType !== 'U') {
        const tempData = []
        // eslint-disable-next-line array-callback-return
        Object.entries(players).map(([key, value]) => {
          value && value.length > 0 && value.sort((a, b) => a.sName > b.sName ? 1 : -1).map(playerInfo => tempData.push(playerInfo))
        })
        // }
        setTeams(players)
      }
    }
    return () => {
      previousProps.userTeam = userTeam
    }
  }, [allTeams, userTeam, teamPlayerList, playerRoles])

  useEffect(() => {
    if (matchDetails) {
      matchDetails.oHomeTeam && matchDetails.oHomeTeam.sName && setTeamName(matchDetails.oHomeTeam.sName)
      setMatchType(matchDetails.eStatus)
    }
  }, [matchDetails])

  function PlayerInfoFun (playerId) {
    if (matchType === 'U') {
      navigate(`/view-player-league-info/${(sportsType).toLowerCase()}/${sMatchId}/${sUserTeamId}/${playerId}`,
        {
          search: `?${qs.stringify({
            index: index || undefined,
            userLeague: sUserLeagueId,
            homePage: homePage ? 'yes' : undefined,
            playerLeagueInfo: 'y'
          })}`
        })
    } else {
      navigate(`/view-player-info/${(sportsType).toLowerCase()}/${sMatchId}/${sUserTeamId}/${playerId}`,
        {
          search: `?${qs.stringify({
            index: index || undefined,
            userLeague: sUserLeagueId,
            homePage: homePage ? 'yes' : undefined
          })}`
        })
    }
  }

  const slides = allTeams && allTeams.length > 0 && allTeams?.map((item) => {
    return (
      <CarouselItem
        key={item._id}
        className="custom-tag"
        onExited={() => setAnimating(false)}
        onExiting={() => setAnimating(true)}
        tag="div"
      >
        <div className="ground w-100">
          {
            Object.entries(team).map(([key, value]) => {
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
                              <img key={`inside${playerInfo._id}`} alt="Kohli" src={playerInfo?.sImage && sMediaUrl ? `${sMediaUrl}${playerInfo?.sImage}` : defaultPlayerRoleImages(sportsType, playerInfo?.eRole)} />
                              { playerInfo?.bShow && matchType === 'U' &&
                                <span className="tag2" />
                              }
                              {
                                (playerInfo.iMatchPlayerId === userTeam.iCaptainId) || (playerInfo?._id === userTeam.iCaptainId)
                                  ? <span className="tag"><FormattedMessage id="C" /></span>
                                  : (playerInfo.iMatchPlayerId === userTeam.iViceCaptainId) || (playerInfo?._id === userTeam.iViceCaptainId)
                                      ? <span className="tag"><FormattedMessage id="VC" /></span>
                                      : ''
                              }
                            </div>
                            <p className={classNames({ backWhitePlayer: TeamName === playerInfo.sTeamName, backDarkBlue: TeamName !== playerInfo.sTeamName })}>
                              {playerInfo?.sName?.indexOf(' ') >= 0 ? playerName[0][0] + ' ' + playerName[playerName.length - 1] : playerName}
                            </p>
                            {
                              !teamPreview
                                ? (
                                  <span>
                                    {matchType === 'U'
                                      ? playerInfo && playerInfo.nFantasyCredit > 0
                                        ? playerInfo.nFantasyCredit + ' Cr '
                                        : (<FormattedMessage id="Zero_CR" />)
                                      : (playerInfo?._id === allTeams[teamView]?.iCaptainId) || (playerInfo?._id === teamDetails?.iCaptainId)
                                          ? (Number(playerInfo.nScoredPoints) * 2) + ' Pts '
                                          : (playerInfo?._id === allTeams[teamView]?.iViceCaptainId) || (playerInfo?._id === teamDetails?.iViceCaptainId)
                                              ? (Number(playerInfo.nScoredPoints) * 1.5) + ' Pts '
                                              : parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts '
                                      }
                                  </span>
                                  )
                                : (
                                  <span>
                                    {
                                    playerInfo && playerInfo.nFantasyCredit > 0
                                      ? playerInfo.nFantasyCredit + ' Cr '
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
                                      <img key={`inside${playerInfo._id}`} alt="Kohli" src={playerInfo?.sImage && sMediaUrl ? `${sMediaUrl}${playerInfo?.sImage}` : defaultPlayerRoleImages(sportsType, playerInfo?.eRole)} />
                                      { playerInfo?.bShow && matchType === 'U' &&
                                      <span className="tag2" />
                                    }
                                      {
                                      (playerInfo.iMatchPlayerId === userTeam.iCaptainId) || (playerInfo?._id === userTeam.iCaptainId)
                                        ? <span className="tag"><FormattedMessage id="C" /></span>
                                        : (playerInfo.iMatchPlayerId === userTeam.iViceCaptainId) || (playerInfo?._id === userTeam.iViceCaptainId)
                                            ? <span className="tag"><FormattedMessage id="VC" /></span>
                                            : ''
                                    }
                                    </div>
                                    <p className={classNames({ backWhitePlayer: TeamName === playerInfo.sTeamName, backWhiteOrange: TeamName !== playerInfo.sTeamName })}>
                                      {playerInfo?.sName?.indexOf(' ') >= 0 ? playerName[0][0] + ' ' + playerName[playerName.length - 1] : playerName}
                                    </p>
                                    {
                                    !teamPreview
                                      ? (
                                        <span>
                                          {matchType === 'U'
                                            ? playerInfo && playerInfo.nFantasyCredit > 0
                                              ? playerInfo.nFantasyCredit + ' Cr '
                                              : (<FormattedMessage id="Zero_CR" />)
                                            : (playerInfo?._id === allTeams[teamView]?.iCaptainId) || (playerInfo?._id === teamDetails?.iCaptainId)
                                                ? (Number(playerInfo.nScoredPoints) * 2) + ' Pts '
                                                : (playerInfo?._id === allTeams[teamView]?.iViceCaptainId) || (playerInfo?._id === teamDetails?.iViceCaptainId)
                                                    ? (Number(playerInfo.nScoredPoints) * 1.5) + ' Pts '
                                                    : parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts '
                                            }
                                        </span>
                                        )
                                      : (
                                        <span>
                                          {
                                          playerInfo && playerInfo.nFantasyCredit > 0
                                            ? playerInfo.nFantasyCredit + ' Cr '
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
                                      <img key={`inside${playerInfo._id}`} alt="Kohli" src={playerInfo?.sImage && sMediaUrl ? `${sMediaUrl}${playerInfo?.sImage}` : defaultPlayerRoleImages(sportsType, playerInfo?.eRole)} />
                                      { playerInfo?.bShow && matchType === 'U' &&
                                      <span className="tag2" />
                                    }
                                      {
                                      (playerInfo.iMatchPlayerId === userTeam.iCaptainId) || (playerInfo?._id === userTeam.iCaptainId)
                                        ? <span className="tag"><FormattedMessage id="C" /></span>
                                        : (playerInfo.iMatchPlayerId === userTeam.iViceCaptainId) || (playerInfo?._id === userTeam.iViceCaptainId)
                                            ? <span className="tag"><FormattedMessage id="VC" /></span>
                                            : ''
                                    }
                                    </div>
                                    <p className={classNames({ backWhitePlayer: TeamName === playerInfo.sTeamName, backWhiteOrange: TeamName !== playerInfo.sTeamName })}>
                                      {playerInfo?.sName?.indexOf(' ') >= 0 ? playerName[0][0] + ' ' + playerName[playerName.length - 1] : playerName}
                                    </p>
                                    {
                                    !teamPreview
                                      ? (
                                        <span>
                                          {matchType === 'U'
                                            ? playerInfo && playerInfo.nFantasyCredit > 0
                                              ? playerInfo.nFantasyCredit + ' Cr '
                                              : (<FormattedMessage id="Zero_CR" />)
                                            : (playerInfo?._id === allTeams[teamView]?.iCaptainId) || (playerInfo?._id === teamDetails?.iCaptainId)
                                                ? (Number(playerInfo.nScoredPoints) * 2) + ' Pts '
                                                : (playerInfo?._id === allTeams[teamView]?.iViceCaptainId) || (playerInfo?._id === teamDetails?.iViceCaptainId)
                                                    ? (Number(playerInfo.nScoredPoints) * 1.5) + ' Pts '
                                                    : parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts '
                                            }
                                        </span>
                                        )
                                      : (
                                        <span>
                                          {
                                          playerInfo && playerInfo.nFantasyCredit > 0
                                            ? playerInfo.nFantasyCredit + ' Cr '
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
                                      <img key={`inside${playerInfo._id}`} alt="Kohli" src={playerInfo?.sImage && sMediaUrl ? `${sMediaUrl}${playerInfo?.sImage}` : defaultPlayerRoleImages(sportsType, playerInfo?.eRole)} />
                                      { playerInfo?.bShow && matchType === 'U' &&
                                      <span className="tag2" />
                                    }
                                      {
                                      (playerInfo.iMatchPlayerId === userTeam.iCaptainId) || (playerInfo?._id === userTeam.iCaptainId)
                                        ? <span className="tag"><FormattedMessage id="C" /></span>
                                        : (playerInfo.iMatchPlayerId === userTeam.iViceCaptainId) || (playerInfo?._id === userTeam.iViceCaptainId)
                                            ? <span className="tag"><FormattedMessage id="VC" /></span>
                                            : ''
                                    }
                                    </div>
                                    <p className={classNames({ backWhitePlayer: TeamName === playerInfo.sTeamName, backWhiteOrange: TeamName !== playerInfo.sTeamName })}>
                                      {playerInfo?.sName?.indexOf(' ') >= 0 ? playerName[0][0] + ' ' + playerName[playerName.length - 1] : playerName}
                                    </p>
                                    {
                                    !teamPreview
                                      ? (
                                        <span>
                                          {matchType === 'U'
                                            ? playerInfo && playerInfo.nFantasyCredit > 0
                                              ? playerInfo.nFantasyCredit + ' Cr '
                                              : (<FormattedMessage id="Zero_CR" />)
                                            : (playerInfo?._id === allTeams[teamView]?.iCaptainId) || (playerInfo?._id === teamDetails?.iCaptainId)
                                                ? (Number(playerInfo.nScoredPoints) * 2) + ' Pts '
                                                : (playerInfo?._id === allTeams[teamView]?.iViceCaptainId) || (playerInfo?._id === teamDetails?.iViceCaptainId)
                                                    ? (Number(playerInfo.nScoredPoints) * 1.5) + ' Pts '
                                                    : parseFloat(Number((playerInfo.nScoredPoints)).toFixed(2)) + ' Pts '
                                            }
                                        </span>
                                        )
                                      : (
                                        <span>
                                          {
                                          playerInfo && playerInfo.nFantasyCredit > 0
                                            ? playerInfo.nFantasyCredit + ' Cr '
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
        </div>
      </CarouselItem>
    )
  })

  return (
    <>
      <div className="p-logo">
        <img alt={<FormattedMessage id='Transparent_Logo' />} src={TransparentLogo} />
      </div>
      {loading && <Loading />}
      <div className={classNames('preview d-flex align-items-center justify-content-center', { 'p-cricket': sportsType === 'cricket', 'p-football': sportsType === 'football', 'p-basketball': sportsType === 'basketball', 'p-baseball': sportsType === 'baseball', 'p-kabaddi': sportsType === 'kabaddi', 'p-hockey': sportsType === 'hockey', 'p-csgo': sportsType === 'csgo' })}>
        <div className="preview d-flex align-items-center justify-content-center" >
          <div className="p-header d-flex align-items-center justify-content-between zIndex">
            <button className={document.dir === 'rtl' ? 'bg-transparent icon-right-arrow' : 'bg-transparent icon-left-arrow'}
              onClick={() => {
                if (matchDetails?.eStatus === 'U') {
                  if (homePage) {
                    navigate(`/upcoming-match/league-details/${sportsType}/${sMatchId}/${sUserLeagueId}?homePage=yes`)
                  } else {
                    navigate(`/upcoming-match/league-details/${sportsType}/${sMatchId}/${sUserLeagueId}`)
                  }
                } else if (matchDetails?.eStatus === 'L' || matchDetails?.eStatus === 'I' || matchDetails?.eStatus === 'CMP') {
                  navigate(`/live-completed-match/league-details/${sportsType}/${sMatchId}/${sUserLeagueId}`)
                }
              }}
            />
            <div>

              {
              !(matchType === 'U') && !completed
                ? <button className="bg-transparent me-3 icon-refresh" onClick={(e) => refreshContent(e)} />
                : ''
            }
            </div>
          </div>
          <Fragment>
            <Carousel
              activeIndex={parseInt(teamView)}
              className="w-100"
              interval={false}
              next={next}
              previous={previous}
              slide={false}
            >
              {slides}
              {
              allTeams && allTeams.length >= 2 && (
                <Fragment>
                  <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                  <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                </Fragment>
              )
            }
            </Carousel>
          </Fragment>
          {allTeams && allTeams?.length > 0 && teamView >= 0 && (
          <div className="np-bottom" >
            <div className="d-flex align-items-center justify-content-between">
              <p className="txt">
                {allTeams[teamView]?.sUserName}
                {' '}
                {allTeams[teamView]?.sUserName ? <br /> : ''}
                {' '}
                {allTeams && teamView >= 0 && allTeams[teamView] && (allTeams[teamView]?.sTeamName || allTeams[teamView].sName)}
              </p>
              {matchType === 'U'
                ? <p className="txt">{(parseInt(teamView) + 1) + '/' + myTeamsLeaderBoardList?.length}</p>
                : <p className="txt">{(parseInt(teamView) + 1) + '/' + allTeams?.length}</p>}
              <p className="txt">
                {matchType === 'U' ? <FormattedMessage id="Total_Credits" /> : <FormattedMessage id="Total_Points" />}
                :
                {' '}
                {matchType === 'U' ? totalCredit : totalScorePoints}
              </p>
              {/* <p className="txt">{matchType === 'upcoming' ? <FormattedMessage id="Total_Credits" /> : <FormattedMessage id="Total_Points" />}: {matchType === 'upcoming' ? totalCredit : allTeams && teamView >= 0 && allTeams[teamView] && allTeams[teamView].nTotalPoints ? allTeams && teamView >= 0 && allTeams[teamView] && allTeams[teamView].nTotalPoints : <FormattedMessage id="Zero" />}</p> */}
            </div>
          </div>
          )}
          {
          ShareTeam
            ? (
              <>
                <div className="s-team-bg" onClick={() => setShareTeam(false)} />
                <Card className="filter-card select-team promo-card">
                  <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                    <button><FormattedMessage id="Share_Team" /></button>
                    <button onClick={() => { setShareTeam(false) }} ><img src={close} /></button>
                  </CardHeader>
                  <CardBody className="p-0">
                    <FacebookShareButton
                      className="Demo__some-network__share-button"
                      quote={<FormattedMessage id="Facebook" />}
                      url={config.facebook}
                    >
                      <FacebookIcon round size={40} />
                    </FacebookShareButton>
                    <FacebookMessengerShareButton
                      appId={config.facebookAppID}
                      className="Demo__some-network__share-button"
                      url={config.facebook}
                    >
                      <FacebookMessengerIcon round size={40} />
                    </FacebookMessengerShareButton>
                    <TwitterShareButton
                      className="Demo__some-network__share-button"
                      title={<FormattedMessage id="Twitter" />}
                      url={config.elevenWicket}
                    >
                      <TwitterIcon round size={40} />
                    </TwitterShareButton>
                    <TelegramShareButton
                      className="Demo__some-network__share-button"
                      title={<FormattedMessage id="Telegram" />}
                      url={config.elevenWicket}
                    >
                      <TelegramIcon round size={40} />
                    </TelegramShareButton>
                    <WhatsappShareButton
                      className="Demo__some-network__share-button"
                      separator=":"
                      title={<FormattedMessage id="Check_out_my_team" />}
                      url={config.elevenWicket}
                    >
                      <WhatsappIcon round size={40} />
                    </WhatsappShareButton>
                    <LinkedinShareButton className="Demo__some-network__share-button" url={config.elevenWicket}>
                      <LinkedinIcon round size={40} />
                    </LinkedinShareButton>
                  </CardBody>
                  <CardFooter className='p-0 border-0 bg-trnsparent m-0 d-flex justify-content-between'>
                    <Button className="w-100" color='primary' type="submit"><FormattedMessage id="Join" /></Button>
                  </CardFooter>
                </Card>
              </>
              )
            : ''
        }
        </div>
      </div>
    </>
  )
}
PreviewCricket.propTypes = {
  data: PropTypes.shape({
    aPlayers: PropTypes.func,
    sTeamName: PropTypes.string
  }),
  allTeams: PropTypes.shape([{
    iCaptainId: PropTypes.string,
    iViceCaptainId: PropTypes.string,
    sTeamName: PropTypes.string,
    nTotalPoints: PropTypes.Number,
    aPlayers: PropTypes.shape([{
      eRole: PropTypes.string
    }])
  }]),
  index: PropTypes.number,
  teamView: PropTypes.number,
  onBackClick: PropTypes.func,
  token: PropTypes.string,
  userTeamId: PropTypes.string,
  sportsType: PropTypes.string,
  userTeam: PropTypes.object,
  matchDetails: PropTypes.object,
  onPlayerInfoClick: PropTypes.func,
  refreshContent: PropTypes.func,
  getMatchPlayerList: PropTypes.func,
  getUserTeam: PropTypes.func,
  teamPreview: PropTypes.bool,
  setLoading: PropTypes.bool,
  url: PropTypes.string,
  loading: PropTypes.bool,
  completed: PropTypes.bool,
  myTeamPreViewUpcoming: PropTypes.bool,
  matchPlayer: PropTypes.array,
  teamPlayerList: PropTypes.array,
  userName: PropTypes.string,
  isPlayerInfo: PropTypes.bool,
  playerId: PropTypes.string,
  setPlayerId: PropTypes.func,
  setPlayerInfo: PropTypes.func,
  setPlayers: PropTypes.func,
  setUserTeamId: PropTypes.func,
  history: PropTypes.object,
  allLeaderBoardList: PropTypes.object,
  myTeamsLeaderBoardList: PropTypes.object,
  getMyTeamLeaderBoardListFunc: PropTypes.func,
  myAllTeamPagination: PropTypes.func,
  playerRoles: PropTypes.object
}
export default TeamList(PreviewCricket)
