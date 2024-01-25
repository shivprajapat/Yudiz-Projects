import React, { Fragment, useEffect, useState, useRef } from 'react'
import Loading from '../../../component/SkeletonTable'
import { Link, createSearchParams, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Table, Button } from 'reactstrap'
import PropTypes from 'prop-types'
import { defaultPlayerRoleImages } from '../../../utils/helper'
import { FormattedMessage } from 'react-intl'
import HomeImage from '../../../assests/images/homeIconWhite.svg'
import left from '../../../assests/images/left-arrow-white.svg'
import right from '../../../assests/images/right-arrow-white.svg'
import { compose } from 'redux'
import qs from 'query-string'
import TeamList from '../../../HOC/SportsLeagueList/TeamList'
import PlayerDetails from '../../../HOC/SportsLeagueList/PlayerDetails'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import classNames from 'classnames'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function PlayerInfo (props) {
  const { seasonMatch, playerRoles, teamPlayerList, getMatchPlayerList, teamList, getUserTeam, userTeam, playerSeasonNames, matchPlayer, nScoredPoints, playerData, pointBreakUp, token, loading, playerScorePoints } = props
  const { activeSport } = useActiveSports()
  const { sMediaUrl } = useGetUrl()

  const [index, setIndex] = useState('')
  const [team, setTeam] = useState([])
  const previousProps = useRef({ userTeam, teamList }).current

  const { sportsType, sUserTeamId, sMatchId, sPlayerId, sortBy, sort, playerLeagueInfo } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (sMatchId && token) {
      getMatchPlayerList(sMatchId)
    }
    if (sUserTeamId && token) {
      getUserTeam(sUserTeamId)
    }
    if (sPlayerId && token) {
      playerSeasonNames(sPlayerId)
    }
  }, [token])

  useEffect(() => {
    if (location && location.state && location.state.matchPlayerId) {
      playerScorePoints(location.state.matchPlayerId)
    }
  }, [location.state])

  useEffect(() => {
    if (sortBy !== 'undefined') {
      const value = sortBy
      const sorted = sort
      let listedItem
      if (matchPlayer?.length > 0) {
        if (sorted === 'true') {
          if (value === 'players') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1)
            setTeam(listedItem)
          } else if (value === 'points') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => Number(a.nScoredPoints) > Number(b.nScoredPoints) ? -1 : 1)
            setTeam(listedItem)
          } else if (value === 'selBy') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nSetBy > b.nSetBy ? -1 : 1)
            setTeam(listedItem)
          } else if (value === 'C') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nCaptainBy > b.nCaptainBy ? -1 : 1)
            setTeam(listedItem)
          } else if (value === 'VC') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nViceCaptainBy > b.nViceCaptainBy ? -1 : 1)
            setTeam(listedItem)
          } else {
            listedItem = matchPlayer
            setTeam(listedItem)
          }
        } else {
          if (value === 'players') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? -1 : 1)
            setTeam(listedItem)
          } else if (value === 'points') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => Number(a.nScoredPoints) > Number(b.nScoredPoints) ? 1 : -1)
            setTeam(listedItem)
          } else if (value === 'selBy') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nSetBy > b.nSetBy ? 1 : -1)
            setTeam(listedItem)
          } else if (value === 'C') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nCaptainBy > b.nCaptainBy ? 1 : -1)
            setTeam(listedItem)
          } else if (value === 'VC') {
            listedItem = matchPlayer.sort((a, b) => a.sName > b.sName ? 1 : -1).sort((a, b) => a.nViceCaptainBy > b.nViceCaptainBy ? 1 : -1)
            setTeam(listedItem)
          } else {
            listedItem = matchPlayer
            setTeam(listedItem)
          }
        }
      }
      listedItem?.map((player, index) => {
        if (player._id === sPlayerId) {
          setIndex(parseInt(index))
        }
        return index
      })
    }
  }, [matchPlayer, sPlayerId])

  useEffect(() => {
    team?.length > 0 && team?.filter((player, index) => {
      if (location?.state?.matchPlayerId) {
        if (player._id === location?.state?.matchPlayerId) {
          setIndex(parseInt(index))
        }
      } else {
        if (player._id === sPlayerId) {
          setIndex(parseInt(index))
        }
      }
      return player._id === sPlayerId
    })
  }, [team])

  useEffect(() => {
    if (playerLeagueInfo || location?.state?.teamCreationPage) {
      setTeam(seasonMatch)
    } else {
      if ((previousProps.userTeam !== userTeam) || teamPlayerList?.length !== 0) {
        if (sUserTeamId && userTeam && userTeam.length !== 0 && teamPlayerList) {
          const playerRole = playerRoles?.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a?.nPosition?.toString().localeCompare(b?.nPosition?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map(Role => Role.sName)
          const players = Object.assign({}, ...playerRole?.map(key => ({ [key]: [] })))
          userTeam && userTeam.length !== 0 && userTeam?.aPlayers?.length !== 0 && userTeam?.aPlayers?.map((Player) => {
            const PlayerDetails = teamPlayerList && teamPlayerList.length !== 0 && teamPlayerList.find(player => player._id === Player.iMatchPlayerId)
            Object.entries(players).map(([key, value]) => {
              return (key === PlayerDetails?.eRole) && players[PlayerDetails?.eRole].push(PlayerDetails)
            })
            return players
          })
          const tempData = []
          Object.entries(players).map(([key, value]) => value && value.length > 0 && value.sort((a, b) => a.sName > b.sName ? 1 : -1).map(playerInfo => tempData.push(playerInfo)))
          setTeam(tempData)
        }
      }
    }
    return () => {
      previousProps.userTeam = userTeam
    }
  }, [userTeam, teamPlayerList, seasonMatch])

  const previous = () => {
    const nextIndex = index === 0 ? team.length - 1 : index - 1
    const matchPlayerId = team[nextIndex]?._id
    if (location?.state?.playerStat) {
      navigate(`/view-player-stats-info/${sportsType.toLowerCase()}/${sMatchId}/${matchPlayerId}`,
        {
          search: createSearchParams({
            sortBy: sortBy || undefined,
            sort: sort || undefined,
            playerStat: true || undefined
          }).toString(),
          state: {
            playerStat: true
          },
          replace: true
        })
    } else if (location?.state?.teamCreationPage) {
      navigate(`/create-team/view-player-info/${sportsType.toLowerCase()}/${sMatchId}/${matchPlayerId}`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined,
            playerLeagueInfo: playerLeagueInfo ? 'y' : undefined
          })}`,
          state: { teamCreationPage: true, matchPlayerId },
          replace: true
        })
    } else {
      navigate(`/view-player-info/${sportsType.toLowerCase()}/${sMatchId}/${sUserTeamId}/${matchPlayerId}`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined,
            playerLeagueInfo: playerLeagueInfo ? 'y' : undefined
          })}`,
          state: { matchPlayerId },
          replace: true
        })
    }
  }

  const next = () => {
    const nextIndex = index === team.length - 1 ? 0 : index + 1
    const matchPlayerId = team[nextIndex]?._id
    if (location?.state?.playerStat) {
      navigate(`/view-player-stats-info/${sportsType.toLowerCase()}/${sMatchId}/${matchPlayerId}`,
        {
          search: createSearchParams({
            sortBy: sortBy || undefined,
            sort: sort || undefined,
            playerStat: true || undefined
          }).toString(),
          state: {
            playerStat: true
          },
          replace: true
        })
    } else if (location?.state?.teamCreationPage) {
      navigate(`/create-team/view-player-info/${sportsType.toLowerCase()}/${sMatchId}/${matchPlayerId}`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined,
            playerLeagueInfo: playerLeagueInfo ? 'y' : undefined
          })}`,
          state: { teamCreationPage: true, matchPlayerId },
          replace: true
        })
    } else {
      navigate(`/view-player-info/${sportsType.toLowerCase()}/${sMatchId}/${sUserTeamId}/${matchPlayerId}`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined,
            playerLeagueInfo: playerLeagueInfo ? 'y' : undefined
          })}`,
          state: { matchPlayerId },
          replace: true
        })
    }
  }

  return (
    <>
      {loading && <Loading Lines={7} series/>}
      <div className="player-info">
        <div className="league-header u-header">
          <div className="d-flex align-items-center header-i">
            <button className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'}
              onClick={() => {
                navigate(-1)
              // if (modalOpen) {
              //   onBackClick()
              // } else if (obj?.playerLeagueInfo) {
              //   navigate(`/view-player-league-info/${(sportsType).toLowerCase()}/${sMatchId}/${userTeamID}/${sPlayerId}`,
              //     {
              //      search: `?${qs.stringify({
              //       homePage: obj?.homePage ? 'yes' : undefined,
              //       playerLeagueInfo: obj?.playerLeagueInfo ? 'y' : undefined
              //      })}`
              //     })
              // } else if (obj?.userLeague && obj?.index) {
              //   navigate(`/team-preview/${sportsType.toLowerCase()}/${sMatchId}/${obj?.userLeague}/${userTeamID}/${obj?.index}`)
              // } else if (obj?.playerStat && matchDetails?.eStatus === 'L') {
              //   navigate(`/live-match/leagues/${sportsType.toLowerCase()}/${sMatchId}`)
              // } else if (obj?.playerStat && (matchDetails?.eStatus === 'CMP' || matchDetails?.eStatus === 'I')) {
              //   navigate(`/completed-match/leagues/${sportsType.toLowerCase()}/${sMatchId}?activeState=3`)
              // } else {
              //   navigate(`/my-teams-preview/${sportsType.toLowerCase()}/${sMatchId}/${userTeamID}`)
              // }
              }}
            />
            <Button className='button-link bg-transparent py-2' tag={Link} to={`/home/${activeSport}`}><img src={HomeImage} /></Button>
            <div>
              <h1 className="text-uppercase">{team && team[index]?.sName}</h1>
              {/* <p>{team && team[index]?.oMatch?.sName}</p> */}
              <p>
                {team && team[index]?.sTeamName}
                {', '}
                {playerData?.eRole}
              </p>
            </div>
          </div>
        </div>
        <div className='height-118'>
          <div className="player-detail d-flex align-items-center">
            <div className="p-i">
              <img alt="" className='h-100 v-100 fullBorderRadius' src={playerData?.sImage && sMediaUrl ? `${sMediaUrl}${playerData?.sImage}` : defaultPlayerRoleImages(sportsType, playerData?.eRole)} />
            </div>
            <div className="player-d-i d-flex flex-wrap">
              <div className={classNames('item', { 'text-end': document.dir === 'rtl' })}>
                <p><FormattedMessage id="Selected_by" /></p>
                <b>
                  {team && team[index]?.nSetBy ? team[index].nSetBy : 0}
                  <FormattedMessage id="Percentage" />
                </b>
              </div>
              <div className="item text-center">
                <p><FormattedMessage id="Points" /></p>
                <b>{nScoredPoints}</b>
              </div>
              <div className={classNames('item', { 'text-end': document.dir !== 'rtl', 'text-start': document.dir === 'rtl' })}>
                <p><FormattedMessage id="Credits" /></p>
                <b>{team && team[index]?.nFantasyCredit ? team[index].nFantasyCredit : 0}</b>
              </div>
              <div className={classNames('item', { 'text-end': document.dir === 'rtl' })}>
                <p><FormattedMessage id="C_by" /></p>
                <b>
                  {team && team[index]?.nCaptainBy ? team[index].nCaptainBy : 0}
                  <FormattedMessage id="Percentage" />
                </b>
              </div>
              <div className="item text-center">
                <p><FormattedMessage id="VC_by" /></p>
                <b>
                  {team && team[index]?.nViceCaptainBy ? team[index].nViceCaptainBy : 0}
                  <FormattedMessage id="Percentage" />
                </b>
              </div>
            </div>
          </div>
          <Table className="player-d-t">
            <thead>
              <tr>
                <th><FormattedMessage id="Events" /></th>
                <th><FormattedMessage id="Actions" /></th>
                <th><FormattedMessage id="Points" /></th>
              </tr>
            </thead>
            <tbody>
              {
              loading
                ? <Loading Lines={7} series/>
                : pointBreakUp && pointBreakUp.length && pointBreakUp.length !== 0
                  ? pointBreakUp.map(points => {
                    return (
                      <tr key={points._id}>
                        <td>{points && points.sName && points.sName}</td>
                        <td>{points && points.nPoint && points.nScoredPoints ? parseFloat(Number((points.nScoredPoints / points.nPoint)).toFixed(2)) : !points.nPoint ? (points?.nScoredPoints !== 0 ? 'Yes' : 'No') : 0}</td>
                        <td>
                          {points && points.nScoredPoints && points.nScoredPoints}
                          {' '}
                        </td>
                      </tr>
                    )
                  })
                  : (
                    <Fragment>
                      <tr>
                        <td colSpan='3'>
                          <FormattedMessage id="No_pointBreakup_Available" />
                        </td>
                      </tr>
                    </Fragment>
                    )
}
              <tr>
                <td colSpan="2"><FormattedMessage id="Total" /></td>
                <td className={classNames({ 'text-end': document.dir !== 'rtl', 'text-start': document.dir === 'rtl' })}>{nScoredPoints}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="np-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <div className='custom-btn ps-2'
              disabled={index === 0}
              onClick={() => previous()}
            >
              <img className='pe-2' src={left} />
              <FormattedMessage id="Previous" />

            </div>
            <div className='team-data'>{team && index + 1 + '/' + team?.length}</div>
            <div className='custom-btn pe-2 text-end'
              disabled={team?.length ? index === team.length - 1 : index === matchPlayer?.length - 1}
              onClick={() => next()}
            >
              <FormattedMessage id="Next" />
              <img className='ps-2' src={right} />

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

PlayerInfo.propTypes = {
  onBackClick: PropTypes.func,
  playerScorePoints: PropTypes.func,
  playerData: PropTypes.shape({
    nFantasyCredit: PropTypes.number,
    nSetBy: PropTypes.number,
    nScoredPoints: PropTypes.number,
    nCaptainBy: PropTypes.number,
    nViceCaptainBy: PropTypes.number,
    eRole: PropTypes.string,
    sName: PropTypes.string,
    sImage: PropTypes.string
  }),
  match: PropTypes.object,
  history: PropTypes.object,
  pointBreakUp: PropTypes.array,
  nScoredPoints: PropTypes.number,
  loading: PropTypes.bool,
  token: PropTypes.string,
  matchPlayer: PropTypes.array,
  location: PropTypes.object,
  playerSeasonNames: PropTypes.func,
  userTeam: PropTypes.object,
  getUserTeam: PropTypes.func,
  getMatchPlayerList: PropTypes.func,
  teamList: PropTypes.array,
  teamPlayerList: PropTypes.object,
  matchDetails: PropTypes.object,
  playerRoles: PropTypes.object,
  seasonMatch: PropTypes.object,
  modalOpen: PropTypes.bool,
  pId: PropTypes.string
}
export default compose(TeamList, PlayerDetails)(PlayerInfo)
