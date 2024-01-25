import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCompareUserTeam } from '../../redux/actions/team'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

export const CompareTeam = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [myTeam, setMyTeam] = useState({})
    const [opponentTeam, setOpponentTeam] = useState({})
    const [team1, setTeam1] = useState({})
    const [team2, setTeam2] = useState({})
    const [team1ScorePoint, setTeam1ScorePoint] = useState(0)
    const [team2ScorePoint, setTeam2ScorePoint] = useState(0)
    const [teamA, setTeamA] = useState([])
    const [teamB, setTeamB] = useState([])
    const [loading, setLoading] = useState(false)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const userCompareTeam = useSelector(state => state.team.userCompareTeam)
    const previousProps = useRef({
      getUrlLink
    }).current

    const { sFirstTeamId, sSecondTeamId } = useParams()

    useEffect(() => {
      if (sFirstTeamId && sSecondTeamId) {
        getUserCompareTeam(sFirstTeamId)
        getUserCompareTeam(sSecondTeamId)
      }
    }, [token])

    useEffect(() => {
      if (previousProps.userCompareTeam !== userCompareTeam) {
        if (userCompareTeam && userCompareTeam.iUserLeagueId === sFirstTeamId) {
          setTeam1(userCompareTeam)
          setTeamA(userCompareTeam.aPlayers)
          let TotalScorePoints1 = 0
          userCompareTeam.aPlayers.map(team => {
            if (team && team.nScoredPoints) {
              if (team.iMatchPlayerId === userCompareTeam.iCaptainId) {
                const newPoints = (Number(team.nScoredPoints) * 2)
                TotalScorePoints1 = TotalScorePoints1 + newPoints
              } else if (team.iMatchPlayerId === userCompareTeam.iViceCaptainId) {
                const newPoints = (Number(team.nScoredPoints) * 1.5)
                TotalScorePoints1 = TotalScorePoints1 + newPoints
              } else { TotalScorePoints1 = TotalScorePoints1 + Number(team.nScoredPoints) }
            }
            return team
          })
          setTeam1ScorePoint(TotalScorePoints1)
        } else if (userCompareTeam && userCompareTeam.iUserLeagueId === sSecondTeamId) {
          setTeam2(userCompareTeam)
          setTeamB(userCompareTeam.aPlayers)
          let TotalScorePoints2 = 0
          userCompareTeam.aPlayers.map(team => {
            if (team && team.nScoredPoints) {
              if (team.iMatchPlayerId === userCompareTeam.iCaptainId) {
                const newPoints = (Number(team.nScoredPoints) * 2)
                TotalScorePoints2 = TotalScorePoints2 + newPoints
              } else if (team.iMatchPlayerId === userCompareTeam.iViceCaptainId) {
                const newPoints = (Number(team.nScoredPoints) * 1.5)
                TotalScorePoints2 = TotalScorePoints2 + newPoints
              } else { TotalScorePoints2 = TotalScorePoints2 + Number(team.nScoredPoints) }
            }
            return team
          })
          setTeam2ScorePoint(TotalScorePoints2)
        }
      }
      return () => {
        previousProps.userCompareTeam = userCompareTeam
      }
    }, [userCompareTeam])

    useEffect(() => {
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

    function compareTeam (teamFirst, teamSecond, teamF, teamS) {
      const team = {
        nCapPoints: 0,
        nCommonPoints: 0,
        nDifferentPoints: 0,
        captain: {},
        viceCaptain: {},
        notCommon: [],
        common: []
      }
      teamFirst && teamFirst.length !== 0 && teamFirst.forEach(player => {
        if (teamF.iCaptainId === player.iMatchPlayerId) {
          team.captain = player
          team.nCapPoints += player.nScoredPoints * 2
        } else if (teamF.iViceCaptainId === player.iMatchPlayerId) {
          team.viceCaptain = player
          team.nCapPoints += player.nScoredPoints * 1.5
        } else if (teamSecond && teamSecond.length !== 0 && teamSecond.some(player2 => player.iMatchPlayerId === player2.iMatchPlayerId && player.iMatchPlayerId !== teamS.iViceCaptainId && player.iMatchPlayerId !== teamS.iCaptainId)) {
          team.common.push(player)
          team.nCommonPoints += player.nScoredPoints
        } else if (
          (teamSecond && teamSecond.length !== 0 && teamSecond.some(player2 => player.iMatchPlayerId !== player2.iMatchPlayerId && player.iMatchPlayerId !== teamS.iViceCaptainId && player.iMatchPlayerId !== teamS.iCaptainId)) ||
            (teamSecond && teamSecond.length !== 0 && teamSecond.some(player2 => ((player.iMatchPlayerId === player2.iMatchPlayerId) && (player.iMatchPlayerId === teamS.iViceCaptainId)) || ((player.iMatchPlayerId === player2.iMatchPlayerId) && (player.iMatchPlayerId === teamS.iCaptainId)))) ||
            (teamSecond && teamSecond.length !== 0 && teamSecond.some(player2 => player.iMatchPlayerId !== player2.iMatchPlayerId && player.iMatchPlayerId === teamS.iViceCaptainId && player.iMatchPlayerId === teamS.iCaptainId))
        ) {
          team.notCommon.push(player)
          team.nDifferentPoints += player.nScoredPoints
        }
      })
      return team
    }

    useEffect(() => { // compareTeam with 2 time
      if (teamA && teamB && teamA.length !== 0 && teamB.length !== 0) {
        const SortingTeam1 = compareTeam(teamA, teamB, team1, team2)
        const SortingTeam2 = compareTeam(teamB, teamA, team2, team1)
        setMyTeam(SortingTeam1)
        setOpponentTeam(SortingTeam2)
        setLoading(false)
      }
    }, [teamA, teamB])

    function getUserCompareTeam (userTeamId) {
      token && dispatch(getCompareUserTeam(userTeamId, token))
      setLoading(true)
    }

    return (
      <Component
        {...props}
        loading={loading}
        myTeam={myTeam}
        opponentTeam={opponentTeam}
        team1={team1}
        team1ScorePoint={team1ScorePoint}
        team2={team2}
        team2ScorePoint={team2ScorePoint}
        url={url}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default CompareTeam
