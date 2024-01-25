import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createContest, createContestAndTeam, feeCalculate, genPrizeBreakup, jointAndCreateContest, resetContest } from '../../redux/actions/contest'
import { GetUserProfile } from '../../redux/actions/profile'
import { getMyTeamList, privateLeagueValidationList, getMyTeamPlayerList } from '../../redux/actions/team'

export const Contest = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [newTeamLoader, setNewTeamLoader] = useState(false)
    const [url, setUrl] = useState('')
    const [joinLoader, setJoinLoader] = useState(false)
    const [message, setMessage] = useState('')
    const [calFee, setCalFee] = useState({})
    const [modalMessage, setModalMessage] = useState(false)
    const [isNavigate, setIsNavigate] = useState(false)
    const [isTeamList, setIsTeamList] = useState(null)

    const resStatus = useSelector(state => state.contest.resStatus)
    const resMessage = useSelector(state => state.contest.resMessage)
    const teamPlayerList = useSelector(state => state.team.teamPlayerList)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const calculateFee = useSelector(state => state.contest.calculateFee)
    const contestDetails = useSelector(state => state.contest.contestDetails)
    const resContestStatus = useSelector(state => state.contest.resContestStatus)
    const resContestMessage = useSelector(state => state.contest.resContestMessage)
    const isCreatedContest = useSelector(state => state.contest.isCreatedContest)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const IsCreateContestAndTeam = useSelector(state => state.contest.IsCreateContestAndTeam)
    const joinedContest = useSelector(state => state.contest.joinedContest)
    const userInfo = useSelector(state => state.profile.userInfo)

    const sucessFeeCalculate = useSelector(state => state.contest.sucessFeeCalculate)
    const teamList = useSelector(state => state.team.teamList)
    const privateLeagueValidation = useSelector(state => state.team.privateLeagueValidation)
    const generatePrizeBreakup = useSelector(state => state.contest.generatePrizeBreakup)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const previousProps = useRef({ calculateFee, getUrlLink, resMessage, resStatus, generatePrizeBreakup, teamList, sucessFeeCalculate, resContestMessage, resContestStatus }).current

    useEffect(() => {
      onPrivateLeagueValidation('PrivateLeague')
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
      if (sucessFeeCalculate !== previousProps.sucessFeeCalculate) {
        if (sucessFeeCalculate !== null) {
          setLoading(false)
          setLoading2(false)
          setJoinLoader(false)
          setNewTeamLoader(false)
          if (!sucessFeeCalculate) {
            setMessage(resMessage)
            setCalFee({})
          } else {
            setLoading(false)
            setJoinLoader(false)
            setLoading2(false)
            setNewTeamLoader(false)
            if (calculateFee) { setCalFee(calculateFee) }
          }
        }
      }
      return () => {
        previousProps.sucessFeeCalculate = sucessFeeCalculate
        previousProps.calculateFee = calculateFee
      }
    }, [sucessFeeCalculate])

    useEffect(() => {
      if (generatePrizeBreakup && generatePrizeBreakup.length >= 0) {
        setLoading(false)
        setLoading2(false)
        setJoinLoader(false)
        setNewTeamLoader(false)
        setModalMessage(true)
      } else {
        setLoading(false)
        setLoading2(false)
        setJoinLoader(false)
        setNewTeamLoader(false)
        setMessage(resMessage)
        setModalMessage(false)
      }
    }, [generatePrizeBreakup])

    useEffect(() => {
      if (previousProps.resContestMessage !== resContestMessage) {
        if (resContestStatus !== null) {
          if (resContestMessage && resContestStatus) {
            setIsNavigate(true)
            setMessage(resContestMessage)
          } else {
            setMessage(resContestMessage)
          }
          setLoading(false)
          setLoading2(false)
          setJoinLoader(false)
          setNewTeamLoader(false)
        }
      }
      return () => {
        previousProps.resContestMessage = resContestMessage
      }
    }, [resContestStatus, resContestMessage])

    useEffect(() => {
      if (previousProps.teamList !== teamList) {
        if (teamList) {
          setIsTeamList(null)
          if (teamList.length > 0) {
            setIsTeamList(true)
          } else {
            setIsTeamList(false)
          }
          setLoading(false)
          setLoading2(false)
          setJoinLoader(false)
          setNewTeamLoader(false)
        }
      }
      return () => {
        previousProps.teamList = teamList
      }
    }, [teamList])

    function createContestFUN (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup) {
      setLoading(true)
      token && dispatch(createContest(nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, token))
    }
    function onCreateContestAndTeam (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup) {
      setLoading(true)
      setNewTeamLoader(true)
      token && dispatch(createContestAndTeam(nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, token))
    }

    function jointAndcreateContestFun (nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, userTeams) {
      setLoading(true)
      setJoinLoader(true)
      token && dispatch(jointAndCreateContest(nMax, iMatchId, sName, bMultipleEntry, bPoolPrize, nTotalPayout, nPrizeBreakup, userTeams, token))
    }
    function calculateFeeFun (nMax, nTotalPayout) {
      token && dispatch(feeCalculate(parseInt(nMax), parseInt(nTotalPayout), token))
    }
    function onPrivateLeagueValidation (Type) {
      token && dispatch(privateLeagueValidationList(Type, token))
    }
    function generatePrizeBreakupFun (nMax, bPoolPrize) {
      setLoading(true)
      dispatch(genPrizeBreakup(nMax, bPoolPrize, token))
    }
    function getMyTeamListFun (ID) {
      token && dispatch(getMyTeamList(ID, token))
      setLoading(true)
      setLoading2(true)
    }
    function onFetchMatchPlayer (id) {
      token && dispatch(getMyTeamPlayerList(id, token))
    }

    function reset () {
      dispatch(resetContest())
    }

    function onGetUserProfile () {
      if (token) {
        dispatch(GetUserProfile(token))
      }
    }

    return (
      <Component
        {...props}
        IsCreateContestAndTeam={IsCreateContestAndTeam}
        calFee={calFee}
        calculateFee={calculateFeeFun}
        contestDetails={contestDetails}
        createContest={createContestFUN}
        currencyLogo={currencyLogo}
        gPrizeBreakup={generatePrizeBreakup}
        generatePrizeBreakup={generatePrizeBreakupFun}
        getMyTeamList={getMyTeamListFun}
        isCreatedContest={isCreatedContest}
        isNavigate={isNavigate}
        isTeamList={isTeamList}
        joinLoader={joinLoader}
        joinedContest={joinedContest}
        jointAndCreateContest={jointAndcreateContestFun}
        loading={loading}
        loading2={loading2}
        message={message}
        modalMessage={modalMessage}
        newTeamLoader={newTeamLoader}
        onCreateContestAndTeam={onCreateContestAndTeam}
        onFetchMatchPlayer={onFetchMatchPlayer}
        onGetUserProfile={onGetUserProfile}
        onPrivateLeagueValidation={onPrivateLeagueValidation}
        privateLeagueValidation={privateLeagueValidation}
        resContestMessage={resContestMessage}
        resContestStatus={resContestStatus}
        resMessage={resMessage}
        reset={reset}
        setIsTeamList={setIsTeamList}
        setJoinLoader={setJoinLoader}
        setLoading={setLoading}
        setLoading2={setLoading2}
        setModalMessage={setModalMessage}
        setNewTeamLoader={setNewTeamLoader}
        sucessFeeCalculate={sucessFeeCalculate}
        teamList={teamList}
        teamPlayerList={teamPlayerList}
        token={token}
        url={url}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default Contest
