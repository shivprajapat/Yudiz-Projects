import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getMatchLeagueDetails, joinLeague } from '../../redux/actions/league'
import { ApplyMatchPromoCode, GetMatchPromoCode, GetUserProfile } from '../../redux/actions/profile'
import { createTeam, editTeam, createTeamJoinLeague } from '../../redux/actions/team'
import { useParams } from 'react-router-dom'

function CreateTeam (Component) {
  function MyComponent (props) {
    const dispatch = useDispatch()
    const [promocodeLoading, setPromocodeLoading] = useState(false)
    const resStatus = useSelector((state) => state.team.resStatus)
    const resMessage = useSelector((state) => state.team.resMessage)
    const isCreateTeam = useSelector((state) => state.team.isCreateTeam)
    const isEditTeam = useSelector((state) => state.team.isEditTeam)
    const resjoinMessage = useSelector((state) => state.league.resjoinMessage)
    const leagueResMessage = useSelector((state) => state.league.resMessage)
    const resjoinLeagueStatus = useSelector((state) => state.league.resStatus)
    const createAndJoin = useSelector((state) => state.team.createAndJoin)
    const createTeamData = useSelector((state) => state.team.createTeamData)
    const applyPromocodeData = useSelector((state) => state.profile.applyPromocodeData)
    const appliedPromocode = useSelector((state) => state.profile.appliedPromocode)
    const promoResMessage = useSelector((state) => state.profile.resMessage)
    const promoResStatus = useSelector((state) => state.profile.resStatus)
    const matchPromoCodeList = useSelector((state) => state.profile.matchPromoCodeList)
    const userInfo = useSelector((state) => state.profile.userInfo)
    const currencyLogo = useSelector((state) => state.settings.currencyLogo)
    const matchLeagueDetails = useSelector((state) => state.league.matchLeagueDetails)
    const token = useSelector((state) => state.auth.token) || localStorage.getItem('Token')
    const [loading, setLoading] = useState(false)
    const [createAndjoin, setCreateAndjoin] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')
    const previousProps = useRef({
      resStatus, resMessage, leagueResMessage
    }).current

    const { sLeagueId } = useParams()

    useEffect(() => { // handle the message
      if (previousProps.resMessage !== resMessage) {
        if (resStatus !== null && !createAndjoin) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resMessage, resStatus])

    useEffect(() => {
      if (previousProps.promoResMessage !== promoResMessage) {
        if (promoResStatus !== null) {
          if (promoResMessage) {
            setLoading(false)
            setAlertMsg(promoResMessage)
          }
        }
      }
      return () => {
        previousProps.promoResMessage = promoResMessage
      }
    }, [promoResMessage, promoResStatus])

    useEffect(() => {
      if (previousProps.resjoinMessage !== resjoinMessage) {
        if (resjoinLeagueStatus !== null && createAndjoin) {
          setLoading(false)
          setCreateAndjoin(false)
        }
      }
      return () => {
        previousProps.resjoinMessage = resjoinMessage
      }
    }, [resjoinMessage, resjoinLeagueStatus])

    useEffect(() => {
      if (previousProps.leagueResMessage !== leagueResMessage) {
        if (resjoinLeagueStatus !== null) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.leagueResMessage = leagueResMessage
      }
    }, [leagueResMessage, resjoinLeagueStatus])

    useEffect(() => {
      if (previousProps.applyPromocodeData !== applyPromocodeData) { // handle the loader
        if (applyPromocodeData) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.applyPromocodeData = applyPromocodeData
      }
    }, [applyPromocodeData])

    useEffect(() => {
      if (matchPromoCodeList !== previousProps.matchPromoCodeList) {
        if ((matchPromoCodeList && matchPromoCodeList.length > 0) || matchPromoCodeList) {
          setPromocodeLoading(false)
        }
      }
      return () => {
        previousProps.matchPromoCodeList = matchPromoCodeList
      }
    }, [matchPromoCodeList])

    function TeamCreate (ID, captionId, viceCaptionId, SelectedPlayer, name) {
      token && dispatch(createTeam(ID, captionId, viceCaptionId, SelectedPlayer, name, token))
      setLoading(true)
    }

    function TeamEdit (ID, teamId, captionId, viceCaptionId, SelectedPlayer, Name) {
      token && dispatch(editTeam(ID, teamId, captionId, viceCaptionId, SelectedPlayer, Name, token))
      setLoading(true)
    }

    function createTeamAndJoinContest (ID, captionId, viceCaptionId, SelectedPlayer, iMatchLeagueId, bPrivateLeague, sShareCode, Name, sPromoCode) {
      setLoading(true)
      setCreateAndjoin(true)
      token && dispatch(createTeamJoinLeague(ID, captionId, viceCaptionId, SelectedPlayer, iMatchLeagueId, bPrivateLeague, sShareCode, Name, sPromoCode, token))
    }

    function onApplyPromo (data) {
      if (token) {
        dispatch(ApplyMatchPromoCode(data, token))
        setLoading(true)
      }
    }

    function onGetUserProfile () {
      if (token) {
        dispatch(GetUserProfile(token))
      }
    }
    function onGetPromocodeList (Id) {
      if (token) {
        dispatch(GetMatchPromoCode(Id, token))
        setPromocodeLoading(true)
      }
    }

    function getLeagueDetails () {
      const leagueId = sLeagueId
      if (leagueId && token) {
        dispatch(getMatchLeagueDetails(leagueId, token))
        setLoading(true)
      }
    }

    function joinLeagueFunc (matchLeagueId, userTeamId, privateLeague, sharecode, promo) {
      dispatch(joinLeague(matchLeagueId, userTeamId, privateLeague, token, sharecode, promo))
    }

    return (
      <Component
        {...props}
        TeamCreate={TeamCreate}
        TeamEdit={TeamEdit}
        alertMsg={alertMsg}
        appliedPromocode={appliedPromocode}
        applyPromo={onApplyPromo}
        applyPromocodeData={applyPromocodeData}
        createAndJoin={createAndJoin}
        createTeamAndJoinContest={createTeamAndJoinContest}
        createTeamData={createTeamData}
        currencyLogo={currencyLogo}
        getLeagueDetails={getLeagueDetails}
        isCreateTeam={isCreateTeam}
        isEditTeam={isEditTeam}
        joinLeagueFunc={joinLeagueFunc}
        loading={loading}
        matchLeagueDetails={matchLeagueDetails}
        matchPromoCodeList={matchPromoCodeList}
        onGetPromocodeList={onGetPromocodeList}
        onGetUserProfile={onGetUserProfile}
        promocodeLoading={promocodeLoading}
        resMessage={resMessage}
        resStatus={resStatus}
        resjoinLeagueStatus={resjoinLeagueStatus}
        resjoinMessage={resjoinMessage}
        setAlertMsg={setAlertMsg}
        setLoading={setLoading}
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

export default CreateTeam
