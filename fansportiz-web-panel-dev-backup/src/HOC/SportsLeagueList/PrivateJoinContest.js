import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { verifyContest, joinContest, resetVerifyContest } from '../../redux/actions/contest'
import { GetUserProfile } from '../../redux/actions/profile'
import { getMyTeamList, getMyJoinList, getMyTeamPlayerList } from '../../redux/actions/team'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

export const Contest = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [isTeamList, setIsTeamList] = useState(null)
    const [url, setUrl] = useState('')
    const [verifiedId, setVerifiedId] = useState('')
    const [updatedTeamList, setUpdatedTeamList] = useState([])
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const resStatus = useSelector(state => state.contest.resStatus)
    const resMessage = useSelector(state => state.contest.resMessage)
    const joinedContest = useSelector(state => state.contest.joinedContest)
    const amountData = useSelector(state => state.contest.amountData)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const sucessFullyJoin = useSelector(state => state.contest.sucessFullyJoin)
    const verifyContestDetails = useSelector(state => state.contest.verifyContest)
    const teamPlayerList = useSelector(state => state.team.teamPlayerList)
    const teamList = useSelector(state => state.team.teamList)
    const contestJoinList = useSelector(state => state.team.contestJoinList)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const userInfo = useSelector(state => state.profile.userInfo)
    const previousProps = useRef({ getUrlLink, resMessage, resStatus, contestJoinList, joinedContest, sucessFullyJoin, verifyContestDetails }).current

    const { sMatchId } = useParams()

    useEffect(() => {
      if (sMatchId) {
        getMyTeamListFun(sMatchId)
      }
      if (getUrlLink && token) {
        setUrl(getUrlLink)
      }
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
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          setLoading(false)
        }
        if (!resStatus) {
          setModalOpen(true)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resMessage, resStatus])

    useEffect(() => {
      if (previousProps.teamList !== teamList) {
        if (teamList) {
          if (teamList.length > 0) {
            setIsTeamList(true)
          } else {
            setIsTeamList(false)
          }
          setLoading(false)
        }
      }
      return () => {
        previousProps.teamList = teamList
      }
    }, [teamList])

    useEffect(() => {
      if (previousProps.contestJoinList !== contestJoinList) {
        if (contestJoinList && contestJoinList.length > 0 && teamList && teamList.length > 0 && verifyContestDetails && verifyContestDetails._id) {
          const Data = contestJoinList.find(contest => contest.iMatchLeagueId === verifyContestDetails._id)
          const Teams = Data && Data.aUserTeams && teamList.filter(team =>
            !Data.aUserTeams.includes(team._id)
          )
          if (Teams && Teams.length > 0) {
            setUpdatedTeamList(Teams)
          } else {
            if (Data && Data.aUserTeams && Data.aUserTeams.length > 0) {
              setUpdatedTeamList(Teams)
            } else {
              setUpdatedTeamList(teamList)
            }
          }
        } else {
          if (contestJoinList && contestJoinList.length === 0) {
            setUpdatedTeamList(teamList)
          }
        }
        setLoading(false)
      }
      return () => {
        previousProps.contestJoinList = contestJoinList
      }
    }, [contestJoinList])

    useEffect(() => {
      if (previousProps.verifyContestDetails !== verifyContestDetails) {
        if (verifyContestDetails && verifyContestDetails._id) {
          setVerifiedId(verifyContestDetails._id)
          onMyJoinList(sMatchId)
        }
      }
      return () => {
        previousProps.verifyContestDetails = verifyContestDetails
      }
    }, [verifyContestDetails])

    useEffect(() => {
      if (modalOpen) {
        setTimeout(() => {
          setModalOpen(false)
        }, 3000)
      }
    }, [modalOpen])
    function joinContestFun (userTeamId, matchId, code) {
      token && dispatch(joinContest(userTeamId, matchId, code, token))
      setLoading(true)
    }
    function verifyContestFun (matchId, code) {
      token && dispatch(verifyContest(matchId, code, token))
      setLoading(true)
    }
    function getMyTeamListFun (ID) {
      token && dispatch(getMyTeamList(ID, token))
      setLoading(true)
    }
    function onMyJoinList (ID) {
      token && dispatch(getMyJoinList(ID, token))
      setLoading(true)
    }
    function onResetVerifyContest () {
      dispatch(resetVerifyContest())
    }
    function onFetchMatchPlayer (sMatchId) {
      token && dispatch(getMyTeamPlayerList(sMatchId, token))
    }

    function onGetUserProfile () {
      if (token) {
        dispatch(GetUserProfile(token))
      }
    }

    return (
      <Component
        {...props}
        amountData={amountData}
        currencyLogo={currencyLogo}
        getMyTeamList={getMyTeamListFun}
        isTeamList={isTeamList}
        joinedContest={joinedContest}
        joiningContest={joinContestFun}
        loading={loading}
        modalOpen={modalOpen}
        onFetchMatchPlayer={onFetchMatchPlayer}
        onGetUserProfile={onGetUserProfile}
        onMyJoinList={onMyJoinList}
        onResetVerifyContest={onResetVerifyContest}
        resMessage={resMessage}
        setModalOpen={setModalOpen}
        sucessFullyJoin={sucessFullyJoin}
        teamPlayerList={teamPlayerList}
        token={token}
        updatedTeamList={updatedTeamList}
        url={url}
        userInfo={userInfo}
        verifiedId={verifiedId}
        verifyContestDetails={verifyContestDetails}
        verifyingContest={verifyContestFun}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default Contest
