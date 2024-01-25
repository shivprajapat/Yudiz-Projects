import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyTeamList, switchTeam, getMyJoinDetails, getMyTeamPlayerList } from '../../redux/actions/team'
import { getMatchDetails } from '../../redux/actions/match'
import { getMatchLeagueDetails } from '../../redux/actions/league'
import { getMyTeamLeaderBoardList, getAllTeamLeaderBoardList } from '../../redux/actions/leaderBoard'
import { GetUserProfile } from '../../redux/actions/profile'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

export const ContestDetails = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const userData = useSelector(state => state.auth.userData) || JSON.parse(localStorage.getItem('userData'))
    const matchLeagueDetails = useSelector(state => state.league.matchLeagueDetails)
    const contestJoinList = useSelector(state => state.team.contestJoinList)
    const resStatus = useSelector(state => state.team.resStatus)
    const resMessage = useSelector(state => state.team.resMessage)
    const myTeamsLeaderBoardList = useSelector(state => state.leaderBoard.myTeamsLeaderBoardList)
    const allLeaderBoardList = useSelector(state => state.leaderBoard.allLeaderBoardList)
    const resLeaderboardStatus = useSelector(state => state.leaderBoard.resStatus)
    const nPutTime = useSelector(state => state.leaderBoard.nPutTime)
    const matchDetails = useSelector(state => state.match.matchDetails)
    const teamList = useSelector(state => state.team.teamList)
    const joinDetails = useSelector(state => state.team.joinDetails)
    const switchTeamSuccess = useSelector(state => state.team.switchTeamSuccess)
    const userInfo = useSelector(state => state.profile.userInfo)
    const teamPlayerList = useSelector(state => state.team.teamPlayerList)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const resjoinMessage = useSelector(state => state.league.resjoinMessage)
    const resJoinLeagueStatus = useSelector(state => state.league.resStatus)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const [activeTab, setActiveTab] = useState(2)

    const previousProps = useRef({
      matchLeagueDetails,
      contestJoinList,
      resLeaderboardStatus,
      myTeamsLeaderBoardList,
      allLeaderBoardList,
      teamList,
      switchTeamSuccess,
      resjoinMessage,
      getUrlLink,
      activeTab,
      joinDetails
    }).current
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [leaderboardLoading, setLeaderboardLoading] = useState(false)
    const [switchTeamModal, setSwitchTeamModal] = useState(false)
    const [callTeamApi, setCallTeamApi] = useState(false)
    const [allleaderboard, setAllLeaderboard] = useState([])
    const [SwitchTeamList, setSwitchTeamList] = useState([])
    const [message, setMessage] = useState('')
    const [limit] = useState(50)
    const [offset, setOffset] = useState(0)
    function onTabChange (tab) {
      setActiveTab(tab)
    }

    const { sMatchId, sLeagueId, sportsType } = useParams()

    useEffect(() => {
      if (getUrlLink && token) {
        setUrl(getUrlLink)
      }
      if (sLeagueId && token) {
        leagueDetailsApicall()
        if (activeTab === 2 && token) {
          const leagueId = sLeagueId
          if (leagueId) {
            dispatch(getMyTeamLeaderBoardList(leagueId, token))
            dispatch(getAllTeamLeaderBoardList(limit, offset, leagueId, token, nPutTime))
            myJoinleagueApicall()
            setLeaderboardLoading(true)
          }
        }
      }
      if ((!matchDetails || (matchDetails && matchDetails._id && sMatchId !== matchDetails._id)) && token) {
        dispatch(getMatchDetails(sMatchId, sportsType, token))
      }
      if (!teamPlayerList && token && sMatchId) {
        dispatch(getMyTeamPlayerList(sMatchId, token))
      }
      token && getTeamList()
    }, [token])

    useEffect(() => {
      if (previousProps.getUrlLink !== getUrlLink) {
        if (getUrlLink && getUrlLink.length !== 0) {
          setUrl(getUrlLink)
        }
      }
      return () => {
        previousProps.getUrlLink = getUrlLink
      }
    }, [getUrlLink])

    useEffect(() => {
      if (previousProps.joinDetails !== joinDetails) {
        if (joinDetails && joinDetails.iMatchLeagueId) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.joinDetails = joinDetails
      }
    }, [joinDetails])

    function leagueDetailsApicall () {
      const leagueId = sLeagueId
      if (leagueId && token) {
        dispatch(getMatchLeagueDetails(leagueId, token))
        setLoading(true)
      }
    }

    function getTeamList () {
      if (sMatchId && token) {
        dispatch(getMyTeamList(sMatchId, token))
        setLeaderboardLoading(true)
      }
    }

    function myJoinleagueApicall () {
      const matchLeagueId = sLeagueId
      if (matchLeagueId && token) {
        dispatch(getMyJoinDetails(matchLeagueId, token))
      }
    }

    useEffect(() => {
      if (previousProps.resjoinMessage !== resjoinMessage) {
        if (resjoinMessage) {
          if (resJoinLeagueStatus) {
            leagueDetailsApicall()
            setLoading(true)
          } else {
            setLoading(false)
          }
          if (resStatus) {
            onGetmyTeamsList()
            myAllTeamPagination(50, 0)
            setAllLeaderboard([])
          }
        }
      }
      return () => {
        previousProps.resjoinMessage = resjoinMessage
      }
    }, [resjoinMessage, resStatus])

    useEffect(() => {
      if (previousProps.activeTab !== activeTab) {
        if (activeTab === 2 && token) {
          const leagueId = sLeagueId
          if (leagueId) {
            dispatch(getMyTeamLeaderBoardList(leagueId, token))
            dispatch(getAllTeamLeaderBoardList(limit, offset, leagueId, token, nPutTime))
            setLeaderboardLoading(true)
          }
          if (!matchLeagueDetails || (matchLeagueDetails && matchLeagueDetails._id && matchLeagueDetails._id !== sLeagueId)) {
            leagueDetailsApicall()
          }
        }
        if (activeTab) {
          setAllLeaderboard([])
          setOffset(0)
        }
      }
      return () => {
        previousProps.activeTab = activeTab
      }
    }, [activeTab])

    useEffect(() => {
      if (matchLeagueDetails !== previousProps.matchLeagueDetails) {
        if (resStatus !== null) {
          myJoinleagueApicall()
        }
      }
      return () => {
        previousProps.matchLeagueDetails = matchLeagueDetails
      }
    }, [matchLeagueDetails])

    useEffect(() => {
      if (contestJoinList !== previousProps.contestJoinList) {
        if (resStatus !== null) {
          if (callTeamApi && token) {
            dispatch(getMyTeamList(sMatchId, token))
          } else {
            setLoading(false)
          }
        }
      }
      return () => {
        previousProps.contestJoinList = contestJoinList
      }
    }, [contestJoinList])

    useEffect(() => {
      if (myTeamsLeaderBoardList !== previousProps.myTeamsLeaderBoardList) {
        if (resLeaderboardStatus !== null) {
          if (!resLeaderboardStatus) {
            setLeaderboardLoading(false)
          }
        }
      }
      return () => {
        previousProps.myTeamsLeaderBoardList = myTeamsLeaderBoardList
      }
    }, [myTeamsLeaderBoardList])

    useEffect(() => {
      if (allLeaderBoardList !== previousProps.allLeaderBoardList) {
        if (resLeaderboardStatus !== null) {
          if (allLeaderBoardList && allLeaderBoardList.length > 0) {
            const data = allLeaderBoardList.filter((data) => data.iUserId !== userData?._id)
            setAllLeaderboard(AllLeaderBoardList => [...AllLeaderBoardList, ...data])
          }
          setLeaderboardLoading(false)
        }
      }
      return () => {
        previousProps.allLeaderBoardList = allLeaderBoardList
      }
    }, [allLeaderBoardList])
    useEffect(() => {
      if (teamList !== previousProps.teamList) {
        if (resStatus !== null) {
          if (resStatus) {
            if (teamList && teamList.length !== 0) {
              const leagueId = sLeagueId
              const joinContest = contestJoinList && contestJoinList.length !== 0 && contestJoinList.find(joinContest => joinContest.iMatchLeagueId === leagueId)
              if (joinContest && teamList && teamList.length !== 0) {
                const switchTeamList = joinContest.aUserTeams && teamList.filter(team => !joinContest.aUserTeams.includes(team._id))
                setSwitchTeamList(switchTeamList)
              }
            }
          }
          setLeaderboardLoading(false)
          setLoading(false)
        }
      }
      return () => {
        previousProps.teamList = teamList
      }
    }, [teamList])

    useEffect(() => {
      if (switchTeamSuccess !== previousProps.switchTeamSuccess) {
        if (resStatus !== null) {
          if (switchTeamSuccess && token) {
            setAllLeaderboard([])
            const leagueId = sLeagueId
            dispatch(getMyTeamLeaderBoardList(leagueId, token))
            dispatch(getAllTeamLeaderBoardList(limit, offset, leagueId, token, nPutTime))
            myJoinleagueApicall()
            setLeaderboardLoading(true)
          }
        }
        setSwitchTeamModal(false)
        setMessage(resMessage)
      }
      return () => {
        previousProps.switchTeamSuccess = switchTeamSuccess
      }
    }, [switchTeamSuccess])

    useEffect(() => {
      if (offset) {
        myAllTeamPagination(limit, offset)
      }
    }, [offset])
    function onClickSwitchTeam () {
      setCallTeamApi(true)
      myJoinleagueApicall()
    }

    function onSwitchTeam (userLeagueId, selectedTeam) {
      if (token) {
        setLeaderboardLoading(true)
        dispatch(switchTeam(userLeagueId, selectedTeam, token))
      }
    }

    function myAllTeamPagination (limit, offset) {
      if (token) {
        const leagueId = sLeagueId
        dispatch(getAllTeamLeaderBoardList(limit, offset, leagueId, token, nPutTime))
        // setLeaderboardLoading(true)
      }
    }

    function onGetmyTeamsList () {
      if (token) {
        const leagueId = sLeagueId
        dispatch(getMyTeamLeaderBoardList(leagueId, token))
        setLeaderboardLoading(true)
      }
    }

    function onGetUserProfile () {
      token && dispatch(GetUserProfile(token))
    }

    function onFetchMatchPlayer (id) {
      token && dispatch(getMyTeamPlayerList(id, token))
    }

    return (
      <Component
        {...props}
        SwitchTeamList={SwitchTeamList}
        activeTab={activeTab}
        allLeaderBoardList={allleaderboard}
        contestJoinList={contestJoinList}
        currencyLogo={currencyLogo}
        getMyTeamList={getTeamList}
        joinDetails={joinDetails}
        leaderboardLoading={leaderboardLoading}
        leagueDetailsApicall={leagueDetailsApicall}
        loading={loading}
        matchId={sMatchId}
        matchLeagueDetails={matchLeagueDetails}
        message={message}
        myAllTeamPagination={myAllTeamPagination}
        myTeamsLeaderBoardList={myTeamsLeaderBoardList}
        offset={offset}
        onFetchMatchPlayer={onFetchMatchPlayer}
        onGetUserProfile={onGetUserProfile}
        onGetmyTeamsList={onGetmyTeamsList}
        onSwitchTeam={onSwitchTeam}
        onTabChange={onTabChange}
        otherTeamJoinList={allLeaderBoardList}
        resStatus={resStatus}
        resjoinMessage={resjoinMessage}
        setOffset={setOffset}
        setSwitchTeamModal={setSwitchTeamModal}
        switchTeam={onClickSwitchTeam}
        switchTeamModal={switchTeamModal}
        switchTeamSuccess={switchTeamSuccess}
        teamList={teamList}
        teamPlayerList={teamPlayerList}
        url={url}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default ContestDetails
