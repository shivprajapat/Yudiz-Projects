import React, { useEffect, useState, Fragment } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Alert, Input } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import qs from 'query-string'
import PlayerInfo from './PlayerInfo'
import PlayerLeagueInfo from './PlayerLeagueInfo'
import edit from '../../../assests/images/edit.svg'
import copy from '../../../assests/images/copyTeam.svg'
import { defaultPlayerRoleImages } from '../../../utils/helper'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const classNames = require('classnames')

function MyTeam (props) {
  const {
    teamDetails, allTeams, index, match, setUserTeamId, userTeamId, onLinesUp,
    setUserTeams, userTeams, teamPlayerList, noOfJoin,
    onPreviewTeam, viewOnly, leagueData, join, disabledRadio, teamId,
    disabledRadioFlag
  } = props
  const [data, setData] = useState([])
  const [playerPoints, setPlayerPoints] = useState()
  const [inLinesUp, setInLinesUp] = useState(0)
  const [captainName, setCaptainName] = useState('')
  const [captainData, setCaptainData] = useState({})
  const [viceCaptainData, setViceCaptainData] = useState({})
  const [viceCaptainName, setViceCaptainName] = useState('')
  const [playerInfo, setPlayerInfo] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [Message, setMessage] = useState('')
  const [playerLeagueInfo, setPlayerLeagueInfo] = useState(false)
  const [disabledTeam, setDisabledTeam] = useState(false)
  const { data: activeSports } = useActiveSports()
  const { sMediaUrl } = useGetUrl()

  const navigate = useNavigate()
  const { sportsType, sMatchId } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')

  const playerRoles = activeSports &&
  activeSports.find((sport) => sport.sKey === ((sportsType).toUpperCase()))
    ?.aPlayerRoles

  useEffect(() => {
    if (!disabledRadioFlag) {
      setDisabledTeam(false)
    } else if (disabledRadio === teamId) {
      setDisabledTeam(false)
    } else {
      setDisabledTeam(true)
    }
  }, [disabledRadio, teamId, disabledRadioFlag])

  useEffect(() => {
    if (setUserTeams) { setUserTeams([]) }
    setInLinesUp(1)
    setMessage('')
    if (teamDetails && teamDetails?.aPlayers?.length !== 0 && teamPlayerList) {
      const playerRole = playerRoles?.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a?.nPosition?.toString().localeCompare(b?.nPosition?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((Role) => Role.sName)
      const players = playerRole && Object.assign({}, ...playerRole.map((key) => ({ [key]: [] })))
      let count = 0
      let points = 0
      if (teamDetails.aPlayers && teamDetails.aPlayers.length !== 0) {
        teamDetails.aPlayers.map((playerData) => {
          const PlayerDetails = teamPlayerList && teamPlayerList.length !== 0 &&
        teamPlayerList.find((player) => player._id === playerData)
          Object.entries(players).map(([key]) => (key === PlayerDetails?.eRole) &&
        players[PlayerDetails?.eRole].push(PlayerDetails))
          if (teamPlayerList && teamPlayerList.length !== 0 &&
          teamPlayerList.some((data2) => data2._id === playerData && !data2.bShow)) {
            count += 1
          }
          if (playerData === teamDetails.iCaptainId) {
            const playerName = PlayerDetails?.sName.split(' ')
            setCaptainName(PlayerDetails?.sName && `${playerName && playerName.length >= 2 ? PlayerDetails?.sName[0] : playerName[0]} ${playerName && playerName.length === 2 ? playerName[1] : playerName && playerName.length === 3 ? `${playerName[2]}` : ''}`)
            setCaptainData(PlayerDetails)
          } else if (playerData === teamDetails.iViceCaptainId) {
            const playerName = PlayerDetails?.sName.split(' ')
            setViceCaptainName(PlayerDetails?.sName && `${playerName && playerName.length >= 2 ? PlayerDetails?.sName[0] : playerName[0]} ${playerName && playerName.length === 2 ? playerName[1] : playerName && playerName.length === 3 ? `${playerName[2]}` : ''}`)
            setViceCaptainData(PlayerDetails)
          }
          if (PlayerDetails && PlayerDetails.nScoredPoints) {
            if (playerData === teamDetails.iCaptainId) {
              const newPoints = (Number(PlayerDetails.nScoredPoints) * 2)
              points += newPoints
            } else if (playerData === teamDetails.iViceCaptainId) {
              const newPoints = (Number(PlayerDetails.nScoredPoints) * 1.5)
              points += newPoints
            } else { points += Number(PlayerDetails.nScoredPoints) }
          }
          return players
        })
      }
      setPlayerPoints(points)
      setInLinesUp(count)
      setData(players)
    }
  }, [teamDetails, teamPlayerList])

  useEffect(() => {
    if (modalMessage) {
      setTimeout(() => {
        setModalMessage(false)
      }, 2000)
    }
  }, [modalMessage])

  function OnSubmitting (id) {
    if (userTeams.includes(id)) {
      const newData = userTeams.filter((x) => x !== id)
      setUserTeams(newData)
    } else if (noOfJoin === 1) {
      setUserTeams([id])
    } else if (leagueData && leagueData.bUnlimitedJoin) {
      setUserTeams([...userTeams, id])
    } else if ((userTeams.length + 1) <= noOfJoin) {
      setUserTeams([...userTeams, id])
    } else {
      setMessage(<FormattedMessage id="Reached_the_limit_to_join_the_Contest" />)
      setModalMessage(true)
    }
  }

  return (
    <>
      {
        modalMessage
          ? (
            <Alert color="primary" isOpen={modalMessage}>{Message}</Alert>
            )
          : ''
      }
      <div className={classNames('my-team', disabledTeam && 'pointer-none', join && 'team-custom-width', { selectTeamPreview: viewOnly })}>
        <button
          className="w-100 p-0 m-0 d-block bg-transparent"
          onClick={() => (!viewOnly ? setUserTeams ? OnSubmitting(teamDetails._id) : setUserTeamId ? setUserTeamId(teamDetails._id) : '' : '')}
          type="button"
        >
          {
              !props.points && (setUserTeams || setUserTeamId)
                ? <div className={classNames('mt-header d-flex align-items-center justify-content-between', { 'no-background': sportsType === 'csgo' })}><span className="team-name">{teamDetails && teamDetails.sName}</span></div>
                : !viewOnly && !props.points
                    ? (
                      <div className={classNames('mt-header d-flex align-items-center justify-content-between', { 'no-background': sportsType === 'csgo' })}>
                        <span className="team-name">{teamDetails && teamDetails.sName}</span>
                        <div>
                          <Link to={{
                            pathname: `/edit-team/${(sportsType).toLowerCase()}/${sMatchId}/${teamDetails._id}`,
                            search: `?${qs.stringify({
                            homePage: homePage ? 'yes' : undefined
                          })}`
                          }}
                          >
                            <img src={edit} />
                          </Link>
                          <Link to={{
                            pathname: `/copy-team/${(sportsType).toLowerCase()}/${sMatchId}/${teamDetails._id}/copy`,
                            search: `?${qs.stringify({
                            homePage: homePage ? 'yes' : undefined
                          })}`
                          }}
                          >
                            <img src={copy} />
                          </Link>
                        </div>
                      </div>
                      )
                    : props.points
                      ? (
                        <div className={classNames('mt-header d-flex align-items-center justify-content-between', { 'no-background': sportsType === 'csgo' })}>
                          <span className="team-name">{teamDetails && teamDetails.sName}</span>
                          <span className="points">
                            <FormattedMessage id="Points" />
                            :
                            {' '}
                            <span className="p-points">{teamDetails && teamDetails.nTotalPoints ? parseFloat(Number((teamDetails.nTotalPoints)).toFixed(2)) : (playerPoints || 0)}</span>
                          </span>
                        </div>
                        )
                      : <div />
            }
          <div onClick={() => (setUserTeams
            ? OnSubmitting(teamDetails._id)
            : setUserTeamId
              ? setUserTeamId(teamDetails._id)
              : onPreviewTeam
                ? navigate(`/my-teams-preview/${(sportsType).toLowerCase()}/${sMatchId}/${teamDetails._id}`,
                  {
                    search: `?${qs.stringify({
                      homePage: homePage ? 'yes' : undefined
                    })}`,
                    state: {
                      allTeams: allTeams.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })),
                      index,
                      data: { teamDetails },
                      match
                    }
                  })
                : '')}
          >
            <div>
              <div className={classNames('team-p d-flex justify-content-center', { 'csgo-background': sportsType === 'csgo' })}>
                <div className="player">
                  <div className="img">
                    <img alt="Player" className="rounded-circle" src={captainData?.sImage && sMediaUrl ? `${sMediaUrl}${captainData?.sImage}` : defaultPlayerRoleImages(sportsType, captainData?.eRole)} style={{ height: '66px', width: '66px' }} />
                    <div className={classNames('position', { 'csgo-captain': sportsType === 'csgo' })}><FormattedMessage id="C" /></div>
                  </div>
                  <h3>{captainName}</h3>
                </div>
                <div className="player">
                  <div className="img">
                    <img alt="Player" className="rounded-circle" src={viceCaptainData?.sImage && sMediaUrl ? `${sMediaUrl}${viceCaptainData?.sImage}` : defaultPlayerRoleImages(sportsType, viceCaptainData?.eRole)} style={{ height: '66px', width: '66px' }} />
                    <div className={classNames('position', { 'csgo-vise-captain': sportsType === 'csgo' })}><FormattedMessage id="VC" /></div>
                  </div>
                  <h3>{viceCaptainName}</h3>
                </div>
              </div>
            </div>
            {sportsType !== 'csgo' && (
              <div className="mt-footer d-flex align-items-center justify-content-around">
                {
                      Object.entries(data).map(([key, value]) => (
                        <span key={value._id} className="player-role-class">
                          {key}
                          <b>
                            {
                            value && value.length ? value.length : <FormattedMessage id="Zero" />
                          }
                          </b>

                        </span>
                      ))
                    }
              </div>
            )}
            {
                onLinesUp && inLinesUp > 0 &&
                (
                <div className="mt-footer d-flex backRed ps-2">
                  <span className="lineups-class">
                    {' '}
                    {'>'}
                    {' '}
                    {inLinesUp}
                    {' '}
                    <FormattedMessage id="Players_are_not_announced_in_Lineups" />
                  </span>
                </div>
                )
              }
          </div>
        </button>
      </div>
      {join && (
      <div className={classNames('d-flex align-items-center', disabledTeam && 'pointer-none')} onClick={() => (!viewOnly ? setUserTeams ? OnSubmitting(teamDetails._id) : setUserTeamId ? setUserTeamId(teamDetails._id) : '' : '')}>
        {!props.points
          ? setUserTeams
            ? (
              <div className="Radio-MyTeam">
                <Input
                  checked={userTeams.includes(teamDetails._id)}
                  disabled={disabledTeam}
                  id={`teamDetails${teamDetails._id}`}
                  name="gender"
                  type="checkbox"
                  value={teamDetails._id}
                />
                <label htmlFor={`teamDetails${teamDetails._id}`} />
              </div>
              )
            : setUserTeamId
              ? (
                <div className="Radio-MyTeam">
                  <Input
                    checked={teamDetails._id === userTeamId}
                    disabled={disabledTeam}
                    id={`teamDetails${teamDetails._id}`}
                    name="gender"
                    type="radio"
                    value={teamDetails._id}
                  />
                  <label htmlFor={`teamDetails${teamDetails._id}`} />
                </div>
                )
              : ''
          : ''}
      </div>
      )}
      {playerLeagueInfo ? <PlayerLeagueInfo {...props} isSeasonPoint onBackClick={() => setPlayerLeagueInfo(false)} onPlayerInfoClick={() => setPlayerInfo(true)} /> : ''}
      {playerInfo ? <PlayerInfo onBackClick={() => setPlayerInfo(false)} /> : ''}
    </>
  )
}

MyTeam.propTypes = {
  params: PropTypes.string,
  history: PropTypes.shape({
    replace: PropTypes.func,
    push: PropTypes.func
  }),
  points: PropTypes.string,
  teamDetails: PropTypes.shape({
    aPlayers: PropTypes.shape([{
      aPlayers: PropTypes.func,
      push: PropTypes.func
    }]),
    _id: PropTypes.string,
    sName: PropTypes.string,
    length: PropTypes.string,
    iViceCaptainId: PropTypes.string,
    iCaptainId: PropTypes.string,
    nTotalPoints: PropTypes.number
    // _id: PropTypes.string
  }),
  leagueData: PropTypes.shape({
    _id: PropTypes.string,
    bUnlimitedJoin: PropTypes.string
  }),
  match: PropTypes.object,
  allTeams: PropTypes.array,
  index: PropTypes.number,
  noOfJoin: PropTypes.number,
  setUserTeamId: PropTypes.func,
  userTeamId: PropTypes.string,
  matchType: PropTypes.string,
  playerScorePoints: PropTypes.func,
  setUserTeams: PropTypes.func,
  userTeams: PropTypes.array,
  teamPlayerList: PropTypes.shape([{
    _id: PropTypes.string
  }]),
  onLinesUp: PropTypes.bool,
  onPreviewTeam: PropTypes.bool,
  viewOnly: PropTypes.bool,
  join: PropTypes.bool,
  homePage: PropTypes.string,
  disabledRadio: PropTypes.object,
  teamId: PropTypes.id,
  disabledRadioFlag: PropTypes.bool,
  playerRoles: PropTypes.object,
  location: PropTypes.object
}

export default MyTeam
