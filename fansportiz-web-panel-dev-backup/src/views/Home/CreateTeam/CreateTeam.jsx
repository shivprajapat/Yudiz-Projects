import React, { useState, useEffect, Fragment, useRef } from 'react'
import { Button, Nav, NavItem, NavLink, TabContent, Table, TabPane, Alert, Input, Card, CardHeader, CardBody, CardFooter, FormGroup, Label, Modal, ModalBody } from 'reactstrap'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import PlayerList from '../components/PlayerList'
import PlayerInfo from '../components/PlayerInfo'
import { allSportsRoles, verifySpecialCharacter, verifyLength, defaultPlayerRoleImages } from '../../../utils/helper'
import PlayerLeagueInfo from '../components/PlayerLeagueInfo'
import TipsImage from '../../../assests/images/ic_crickT_tips.svg'
import rightGreenArrow from '../../../assests/images/right-green-arrow.svg'
import { useSelector } from 'react-redux'
import Loading from '../../../component/Loading'
import MyTeam from '../components/MyTeam'
import PromocodeLoading from '../../../component/PromocodeLoading'
import { compose } from 'redux'
import { createTeam, joinTeam } from '../../../utils/Analytics'
import close from '../../../assests/images/close.svg'
import qs from 'query-string'
import TeamPlayerList from '../../../HOC/SportsLeagueList/TeamPlayerList'
import CreateTeam from '../../../HOC/SportsLeagueList/CreateTeam'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const classNames = require('classnames')

function CreateTeams (props) {
  const {
    setLoading,
    playerRolesList,
    teamId,
    setLoader,
    teamSeven,
    captionId,
    viceCaptionId,
    setCaptionId,
    setViceCaptionId,
    teamDetails,
    eleven,
    alertMsg,
    addPlayer,
    creditLeft,
    SelectedPlayer,
    data,
    playerData,
    teamData,
    teamKeys,
    clearTeam,
    nextStep,
    setNextStep,
    matchDetails,
    teamList,
    onGetUserTeam,
    totalPlayer,
    totalTeamPlayer, teamPlayerList,
    matchLeagueDetails, getLeagueDetails, matchPromoCodeList, promocodeLoading, applyPromo, onGetPromocodeList, currencyLogo, appliedPromocode, userInfo, applyPromocodeData, isCreateTeam, isEditTeam, setAlertMsg, TeamCreate, resjoinLeagueStatus, resjoinMessage, resStatus, resMessage, TeamEdit, name, loading, createTeamData, joinLeagueFunc,
    onGetAutoPickTeam,
    setConfirmationForAutoPick,
    confirmationForAutoPick
  } = props
  const { sMediaUrl } = useGetUrl()

  const [activeTab, setActiveTab] = useState(1)
  const [teamIDS, setTeamIDS] = useState([])
  const [Tab, setTab] = useState('')
  const [hide, setHide] = useState(true)
  const [valid, setValid] = useState(false)
  const [changes, setChanges] = useState(false)
  const [modalMessage2, setModalMessage2] = useState(false)
  const [playerId, setPlayerId] = useState('')
  const [playerInfo, setPlayerInfo] = useState(false)
  const [playerLeagueInfo, setPlayerLeagueInfo] = useState(false)
  const [Name, setName] = useState('')
  const [errorName, setErrorName] = useState('')
  const [createAndjoin, setCreateAndjoin] = useState(false)
  const [teams, setTeams] = useState([])
  const [paymentModal, setPaymentModal] = useState(false)
  const [PromoCodes, setPromoCodes] = useState(false)
  const [finalPromocode, setFinalPromocode] = useState('')
  const [applied, setApplied] = useState(false)
  const [totalPay, setTotalPay] = useState(0)
  // const [totalPayFinal, setTotalPayFinal] = useState(0)
  const [promoData, setPromoData] = useState('')
  const [teamPlayers, setTeamPlayers] = useState([])
  const [discount, setDiscount] = useState(0)
  const [resMsgModal, setResMsgModal] = useState(false)
  const [ressMsg, setRessMsg] = useState('')
  const [fromWallet, setFromWallet] = useState(0)
  const [fromBonus, setFromBonus] = useState(0)
  const amountData = useSelector(state => state.league.amountData)
  const resMsg = useSelector(state => state.team.resMessage)
  const resSta = useSelector(state => state.team.resStatus)
  const previousProps = useRef({
    resMessage, resStatus, resjoinLeagueStatus, resjoinMessage, isCreateTeam, isEditTeam, amountData, applyPromocodeData, userInfo, appliedPromocode
  }).current
  const { sMatchId, sTeamId, sLeagueId, sportsType, sShareCode, content } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!resSta && resMsg) {
      clearTeam()
      setLoading(false)
      setNextStep(true)
      setResMsgModal(true)
      setRessMsg(resMsg)
      setActiveTab(1)
    }
  }, [resSta])

  useEffect(() => {
    if (SelectedPlayer) {
      const d = SelectedPlayer?.length > 0 && SelectedPlayer.map(d => d._id)
      setTeams(d)
    }
    if (SelectedPlayer && captionId && viceCaptionId) {
      setTeamPlayers({
        ...teamPlayers,
        iCaptainId: captionId,
        iViceCaptainId: viceCaptionId,
        aPlayers: SelectedPlayer.map(d => d._id)
      })
    }
  }, [SelectedPlayer, captionId, viceCaptionId])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (amountData && amountData?.oValue?.nAmount > 0) {
            // const matchLeagueDetails = JSON.parse(localStorage.getItem('LeagueData'))
            navigate('/deposit',
              {
                state: {
                  amountData: amountData?.oValue,
                  message: 'Insufficient Balance'
                }
              })
          } else {
            !sLeagueId && navigate(`/upcoming-match/leagues/${sportsType}/${sMatchId}?activeTab=3`)
          }
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.isCreateTeam !== isCreateTeam) {
      if (isCreateTeam !== null && resMessage) {
        setModalMessage2(true)
        setAlertMsg(resMessage)
        if (isCreateTeam && sLeagueId) {
          LeagueJoin()
        }
      }
    }
    return () => {
      previousProps.isCreateTeam = isCreateTeam
    }
  }, [isCreateTeam])

  useEffect(() => {
    if (previousProps.isEditTeam !== isEditTeam) {
      if (isEditTeam !== null && resMessage) {
        setModalMessage2(true)
        setAlertMsg(resMessage)
      }
    }
    return () => {
      previousProps.isEditTeam = isEditTeam
    }
  }, [isEditTeam])

  useEffect(() => {
    if (previousProps.resjoinMessage !== resjoinMessage) {
      if (resjoinMessage) {
        if (amountData && amountData?.oValue?.nAmount > 0) {
          // const matchLeagueDetails = JSON.parse(localStorage.getItem('LeagueData'))
          navigate('/deposit',
            {
              state: {
                amountData: amountData?.oValue,
                message: 'Insufficient Balance'
              }
            })
        } else {
          if (resjoinLeagueStatus) {
            sLeagueId && navigate(`/upcoming-match/leagues/${sportsType}/${sMatchId}`, { tab: Tab || 2, referUrl: `/home/${sportsType}`, message: resjoinMessage })
          } else {
            if (!resjoinLeagueStatus && createAndjoin) {
              sLeagueId && navigate(`/upcoming-match/leagues/${sportsType}/${sMatchId}`, { tab: Tab || 2, referUrl: `/home/${sportsType}`, message: resjoinMessage })
              setCreateAndjoin(false)
            }
          }
        }
      }
    }
    return () => {
      previousProps.resjoinMessage = resjoinMessage
      previousProps.resjoinLeagueStatus = resjoinLeagueStatus
    }
  }, [resjoinLeagueStatus, resjoinMessage])

  useEffect(() => {
    // if (userInfo !== previousProps.userInfo) {
    //   if (userInfo && matchLeagueDetails) {
    //     const promocodeData = applyPromocodeData && applyPromocodeData.nDiscount ? applyPromocodeData.nDiscount : 0
    //     setDiscount(promocodeData)
    //     const value = matchLeagueDetails && (matchLeagueDetails.nPrice - promocodeData - (userInfo && userInfo.nCurrentTotalBalance))
    //     setTotalPay(value > 0 ? value.toFixed(2) : 0)
    //     const value2 = matchLeagueDetails?.nPrice - promocodeData
    //     setTotalPayFinal(value2)
    //   }
    // }
    if (userInfo) {
      // const nPromoDiscount = applyPromocodeData?.nDiscount || 0
      // setDiscount(nPromoDiscount)
      const nPrice = matchLeagueDetails?.nPrice
      // nPrice = (nPromoDiscount) ? nPrice - nPromoDiscount : nPrice
      const nBonus = (matchLeagueDetails?.nBonusUtil * nPrice) / 100
      let value = 0
      let nActualBonus = 0
      let nActualCash = 0
      if (nPrice === 0) {
        setFromWallet(0)
        setFromBonus(0)
      } else if (nPrice > 0 && matchLeagueDetails?.nBonusUtil > 0) {
        if (userInfo?.nCurrentBonus - nBonus >= 0) {
          nActualBonus = nBonus
          if (userInfo?.nCurrentTotalBalance < nPrice - nBonus) {
            value = nPrice - nBonus - userInfo?.nCurrentTotalBalance
            nActualCash = userInfo?.nCurrentTotalBalance
          } else {
            nActualCash = nPrice - nBonus
          }
        } else {
          nActualBonus = userInfo?.nCurrentBonus
          if (userInfo?.nCurrentTotalBalance < nPrice - userInfo?.nCurrentBonus) {
            value = nPrice - userInfo?.nCurrentBonus - userInfo?.nCurrentTotalBalance
            nActualCash = userInfo?.nCurrentTotalBalance
          } else {
            nActualCash = nPrice - nActualBonus
          }
        }
      } else {
        if (userInfo.nCurrentTotalBalance <= nPrice) {
          value = nPrice - userInfo.nCurrentTotalBalance
          nActualCash = userInfo?.nCurrentTotalBalance
        } else {
          nActualCash = nPrice
        }
      }
      setFromWallet(Math.abs(nActualCash).toFixed(2))
      setFromBonus(Math.abs(nActualBonus).toFixed(2))
      setTotalPay(Math.abs(value).toFixed(2))
    }
    return () => {
      previousProps.userInfo = userInfo
    }
  }, [userInfo, matchLeagueDetails])

  function AddTeams () {
    if (sLeagueId && location.pathname === `/create-team/${sportsType}/${sMatchId}/join/${sLeagueId}/private/${sShareCode}`) {
      // setPaymentModal(true)
      getLeagueDetails()
      // onGetUserProfile()
      TeamCreate(sMatchId, captionId, viceCaptionId, teams, Name)
    } else if (sLeagueId) {
      // setPaymentModal(true)
      getLeagueDetails()
      // onGetUserProfile()
      TeamCreate(sMatchId, captionId, viceCaptionId, teams, Name)
    } else if (sTeamId && location.pathname === `/edit-team/${sportsType}/${sMatchId}/${sTeamId}`) {
      setLoading(true)
      TeamEdit(sMatchId, sTeamId, captionId, viceCaptionId, teams, Name || name)
    } else {
      setLoading(true)
      TeamCreate(sMatchId, captionId, viceCaptionId, teams, Name)
      callCreateTeamEvent()
    }
  }

  function LeagueJoin () {
    setPaymentModal(false)
    if (totalPay > 0) {
      navigate('/deposit',
        {
          state: {
            amountData: { nAmount: Number(totalPay) },
            message: 'Insufficient Balance'
          }
        })
    } else {
      if (sLeagueId) {
        if (applied && finalPromocode) {
          joinLeagueFunc(sLeagueId, createTeamData._id, false, '', finalPromocode)
        } else {
          joinLeagueFunc(sLeagueId, createTeamData._id, false, '', '')
        }
      } else if (sLeagueId && location.pathname === `/create-team/${sportsType}/${sMatchId}/join/${sLeagueId}/private/${sShareCode}`) {
        joinLeagueFunc(sLeagueId, createTeamData._id, true, sShareCode)
      }
      setCreateAndjoin(true)
      // callCreateTeamEvent()
      callJoinTeamEvent()
    }
  }

  const applePromoCode = (promo) => {
    if (matchLeagueDetails && matchLeagueDetails._id && promo) {
      applyPromo({ iMatchLeagueId: matchLeagueDetails._id, nTeamCount: 1, sPromo: promo })
      setPromoCodes(false)
      setPromoData('')
      setPaymentModal(true)
      setFinalPromocode('')
    }
  }

  useEffect(() => {
    // if (applyPromocodeData !== previousProps.applyPromocodeData) {
    //   if ((applyPromocodeData && applyPromocodeData.nDiscount && appliedPromocode) || !applyPromocodeData) {
    //     setFinalPromocode(applyPromocodeData && applyPromocodeData.sCode)
    //     const promocodeData = applyPromocodeData && applyPromocodeData.nDiscount ? applyPromocodeData.nDiscount : 0
    //     setDiscount(promocodeData)
    //     const value = matchLeagueDetails && (matchLeagueDetails.nPrice - promocodeData - (userInfo && userInfo.nCurrentTotalBalance))
    //     setTotalPay(value > 0 ? value.toFixed(2) : 0)
    //     const value2 = matchLeagueDetails?.nPrice - promocodeData
    //     setTotalPayFinal(value2)
    //   }
    // }
    if (applyPromocodeData !== previousProps.applyPromocodeData) {
      if ((applyPromocodeData?.nDiscount) || !applyPromocodeData) {
        setFinalPromocode(applyPromocodeData?.sCode)
        const nPromoDiscount = appliedPromocode && applyPromocodeData?.nDiscount ? applyPromocodeData?.nDiscount : 0
        setDiscount(nPromoDiscount)
        let nPrice = matchLeagueDetails?.nPrice
        nPrice = (nPromoDiscount) ? nPrice - nPromoDiscount : nPrice
        const nBonus = (matchLeagueDetails?.nBonusUtil * nPrice) / 100
        let value = 0
        let nActualBonus = 0
        let nActualCash = 0
        if (nPrice === 0) {
          setFromWallet(0)
          setFromBonus(0)
        } else if (nPrice > 0 && matchLeagueDetails?.nBonusUtil > 0) {
          if (userInfo?.nCurrentBonus - nBonus >= 0) {
            nActualBonus = nBonus
            if (userInfo?.nCurrentTotalBalance < nPrice - nBonus) {
              value = nPrice - nBonus - userInfo?.nCurrentTotalBalance
              nActualCash = userInfo?.nCurrentTotalBalance
            } else {
              nActualCash = nPrice - nBonus
            }
          } else {
            nActualBonus = userInfo?.nCurrentBonus
            if (userInfo?.nCurrentTotalBalance < nPrice - userInfo?.nCurrentBonus) {
              value = nPrice - userInfo?.nCurrentBonus - userInfo?.nCurrentTotalBalance
              nActualCash = userInfo?.nCurrentTotalBalance
            } else {
              nActualCash = nPrice - nActualBonus
            }
          }
        } else {
          if (userInfo.nCurrentTotalBalance <= nPrice) {
            value = nPrice - userInfo.nCurrentTotalBalance
            nActualCash = userInfo?.nCurrentTotalBalance
          } else {
            nActualCash = nPrice
          }
        }
        setFromWallet(Math.abs(nActualCash).toFixed(2))
        setFromBonus(Math.abs(nActualBonus).toFixed(2))
        setTotalPay(Math.abs(value).toFixed(2))

        // const promocodeData = applyPromocodeData && applyPromocodeData.nDiscount ? applyPromocodeData.nDiscount : 0
        // const updatedFilterDataFinal = updatedFilterData?.length === 0 ? 1 : updatedFilterData?.length
        // const value = data && updatedFilterData && ((data.nPrice * updatedFilterDataFinal) - promocodeData - (userInfo && userInfo.nCurrentTotalBalance))
        // setTotalPay(value > 0 ? value.toFixed(2) : 0)
        // const value2 = (data?.nPrice * updatedFilterDataFinal) - promocodeData
        // setTotalPayFinal(value2)
      }
    }
    return () => {
      previousProps.applyPromocodeData = applyPromocodeData
    }
  }, [applyPromocodeData])

  useEffect(() => {
    if (previousProps.appliedPromocode !== appliedPromocode) {
      setApplied(appliedPromocode)
      if (!appliedPromocode && appliedPromocode !== null) {
        setModalMessage2(true)
      }
    }
    return () => {
      previousProps.appliedPromocode = appliedPromocode
    }
  }, [appliedPromocode])

  function callJoinTeamEvent () {
    if (sMatchId && sMatchId && location.pathname) {
      joinTeam(sMatchId, sMatchId, location.pathname)
    } else {
      sMatchId && sMatchId && joinTeam(sMatchId, sMatchId, '')
    }
  }

  function callCreateTeamEvent () {
    if (SelectedPlayer && sMatchId && location.pathname) {
      createTeam(SelectedPlayer, sMatchId, location.pathname)
    } else {
      SelectedPlayer && sMatchId && createTeam(SelectedPlayer, sMatchId, '')
    }
  }

  function getPromocodeList () {
    setPromoCodes(true)
    setPaymentModal(false)
    matchLeagueDetails && matchLeagueDetails._id && onGetPromocodeList(matchLeagueDetails._id)
  }

  function clearPromo () {
    if (totalPay > 0) {
      setTotalPay(parseInt(totalPay) + parseInt(applyPromocodeData?.nDiscount))
    } else if (matchLeagueDetails?.nBonusUtil === 100) {
      setFromBonus(parseInt(fromBonus) + parseInt(applyPromocodeData?.nDiscount))
    } else {
      setFromWallet(parseInt(fromWallet) + parseInt(applyPromocodeData?.nDiscount))
    }
    setDiscount(0)
    setApplied(false)
    setFinalPromocode('')
  }

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab)
  }
  useEffect(() => { // handle the response
    if (location && location.state && location.state.activeTab) {
      setTab(location.state.activeTab)
    }
    if (sMatchId) {
      onGetUserTeam(sMatchId)
    }
    // if (sportsType) {
    //   const sport = sportsType
    //   if (isUpperCase(sport)) {
    //     if (match.path === '/create-team/:sportsType/:sMatchId') {
    //       navigate(`/create-team/${sport.toLowerCase()}/${sMatchId}`)
    //     } else if (match.path === '/create-team/:sportsType/:sMatchId/join/:sLeagueId') {
    //       navigate(`/create-team/${sport.toLowerCase()}/${sMatchId}/join/${sLeagueId}`)
    //     } else if (match.path === '/create-team/:sportsType/:sMatchId/join/:sLeagueId/private/:sShareCode') {
    //       navigate(`/create-team/${sport.toLowerCase()}/${sMatchId}/join/${sLeagueId}/private/${sShareCode}`)
    //     } else if (match.path === '/edit-team/:sportsType/:sMatchId/:sTeamId') {
    //       navigate(`/edit-team/${sport.toLowerCase()}/${sMatchId}/${sTeamId}`)
    //     } else {
    //       navigate(`/copy-team/${sport.toLowerCase()}/${sMatchId}/${sTeamId}/${content}`)
    //     }
    //   }
    // }
    setName('')
    if (location?.state?.captainViceCaptainPage === 'yes') {
      setNextStep(false)
    }
  }, [])

  useEffect(() => { // handle the responsec
    if (teamDetails && teamDetails.sName && !content) {
      setName(teamDetails.sName)
    } else {
      if (teamList?.length > 0) {
        setName(`T${teamList?.length + 1}`)
      } else {
        setName('T1')
      }
    }
  }, [teamDetails, teamList])
  useEffect(() => { // handle the response
    if (teamId && teamId.length) {
      setTeamIDS(teamId)
    }
  }, [teamId])

  useEffect(() => {
    if (modalMessage2) {
      setTimeout(() => {
        setModalMessage2(false)
      }, 2000)
    }
  }, [modalMessage2])

  useEffect(() => {
    if (resMsgModal) {
      setTimeout(() => {
        setResMsgModal(false)
      }, 2000)
    }
  }, [resMsgModal])

  useEffect(() => {
    if (SelectedPlayer && totalTeamPlayer && SelectedPlayer.length === totalPlayer) {
      setHide(false)
    } else {
      setHide(true)
    }
    setLoader(false)
  }, [SelectedPlayer])

  useEffect(() => {
    if (alertMsg && alertMsg.length) {
      setHide(true)
    }
  }, [alertMsg])
  useEffect(() => { // handle the response
    if (playerData) {
      setChanges(false)
      playerRolesList && playerRolesList.length >= 1 && playerRolesList.forEach(a => {
        const Name = a.sName
        if (playerData && playerData[Name] && playerData[Name].length !== 0 && a.nMin > playerData[Name].length) {
          setValid(true)
          if (SelectedPlayer && SelectedPlayer.length === totalPlayer) {
            setAlertMsg(
              <Fragment>
                {Name}
                {' '}
                <FormattedMessage id="Should_be_min" />
                {' '}
                {a.nMin}
              </Fragment>)
            setModalMessage2(true)
            setChanges(true)
            SelectedPlayer && SelectedPlayer.length === totalPlayer && setModalMessage2(true)
          }
        } else if (playerData && playerData[Name] && playerData[Name].length === 0) {
          setValid(true)
          if (SelectedPlayer && SelectedPlayer.length === totalPlayer) {
            setAlertMsg(
              <Fragment>
                {Name}
                {' '}
                <FormattedMessage id="is_required" />
              </Fragment>)
            setModalMessage2(true)
            setChanges(true)
            SelectedPlayer && SelectedPlayer.length === totalPlayer && setModalMessage2(true)
          }
        } else if (playerData && playerData[Name] && playerData[Name].length && a.nMin <= playerData[Name].length && valid) {
          setValid(false)
        } else if (playerData && !playerData[Name] && valid) {
          setValid(false)
        }
      })
    }
  }, [playerData])

  function PlayerInfoFun (playerId) {
    setPlayerId(playerId)
    navigate(`/create-team/view-player-league-info/${sportsType}/${sMatchId}/${playerId}`,
      {
        search: `?${qs.stringify({
          homePage: homePage ? 'yes' : undefined
        })}`,
        state: { ...location.state, teamCreationPage: true, allTeams: [{ aPlayers: SelectedPlayer?.map(data => data._id), iCaptainId: captionId || '', iViceCaptainId: viceCaptionId || '' }] }
      })
    // setPlayerLeagueInfo(true)
  }

  const playerRoleClass = classNames({ 'five-tabs': playerRolesList && playerRolesList.length === 5, 'four-tabs': playerRolesList && playerRolesList.length === 4 })
  return (
    <>
      {
        modalMessage2
          ? (
            <Fragment>
              <Alert color="primary" isOpen={modalMessage2}>{alertMsg}</Alert>
            </Fragment>
            )
          : ''
      }
      {
        resMsgModal
          ? (
            <Fragment>
              <Alert color="primary" isOpen={resMsgModal}>{ressMsg}</Alert>
            </Fragment>
            )
          : ''
      }
      {loading && <Loading />}
      <div className="c-team-info-2">
        <button className='icon-cricket-ground p-btn'
          onClick={() => {
            if (location.pathname === `/edit-team/${sportsType}/${sMatchId}/${sTeamId}` || location.pathname === `/copy-team/${sportsType}/${sMatchId}/${sTeamId}/${content}`) {
              navigate(`/my-teams-preview/${(sportsType).toLowerCase()}/${sMatchId}/${sTeamId}`,
                {
                  search: `?${qs.stringify({
                    homePage: homePage ? 'yes' : undefined
                  })}`,
                  state: {
                    allTeams: [{ aPlayers: SelectedPlayer?.map(data => data._id), iCaptainId: captionId || '', iViceCaptainId: viceCaptionId || '' }],
                    data: { teamDetails }
                    // match
                  }
                })
            } else {
              navigate(`/create-team/team-preview/${sportsType}/${sMatchId}`,
                {
                  search: `?${qs.stringify({
                    homePage: homePage ? 'yes' : undefined
                  })}`,
                  state: {
                    ...location.state,
                    teamCreationPage: true,
                    allTeams: [{ aPlayers: SelectedPlayer?.map(data => data._id), iCaptainId: captionId || '', iViceCaptainId: viceCaptionId || '' }],
                    captainViceCaptainPage: !nextStep
                  }
                })
            }
          }}
        />
      </div>
      {nextStep
        ? (
          <>
            <div className="c-team-info">
              <button className='icon-cricket-ground p-btn'
                onClick={() => {
                  if (location.pathname === `/edit-team/${sportsType}/${sMatchId}/${sTeamId}` || location.pathname === `/copy-team/${sportsType}/${sMatchId}/${sTeamId}/${content}`) {
                    navigate(`/my-teams-preview/${(sportsType).toLowerCase()}/${sMatchId}/${sTeamId}`,
                      {
                        search: `?${qs.stringify({
                          homePage: homePage ? 'yes' : undefined
                        })}`,
                        state: {
                          allTeams: [{ aPlayers: SelectedPlayer?.map(data => data._id), iCaptainId: captionId || '', iViceCaptainId: viceCaptionId || '' }],
                          data: { teamDetails }
                          // match
                        }
                      })
                  } else {
                    navigate(`/create-team/team-preview/${sportsType}/${sMatchId}`,
                      {
                        search: `?${qs.stringify({
                          homePage: homePage ? 'yes' : undefined
                        })}`,
                        state: { ...location.state, teamCreationPage: true, allTeams: [{ aPlayers: SelectedPlayer?.map(data => data._id), iCaptainId: captionId || '', iViceCaptainId: viceCaptionId || '' }] }
                      })
                  }
                }}
              />
              <h4 className='align-items-center textCenter'>
                <FormattedMessage id="Maximum" />
                {' '}
                {totalTeamPlayer}
                {' '}
                <FormattedMessage id="players_from_a_team" />
              </h4>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span><FormattedMessage id="Players" /></span>
                  <p>
                    {SelectedPlayer.length === 0 ? '0' : SelectedPlayer.length}
                    /
                    {totalPlayer}
                  </p>
                </div>
                <div>
                  <span>{matchDetails && matchDetails.oHomeTeam && matchDetails.oHomeTeam.sName && (matchDetails.oHomeTeam.sName === teamKeys[0]) ? matchDetails.oHomeTeam.sShortName : matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.sName && (matchDetails.oAwayTeam.sName === teamKeys[0]) ? matchDetails.oAwayTeam.sShortName : matchDetails && matchDetails.oHomeTeam && matchDetails.oHomeTeam.sShortName}</span>
                  <p>
                    {
                teamData[teamKeys && teamKeys.length && teamKeys[0]] && teamData[teamKeys && teamKeys.length && teamKeys[0]].length
                  ? teamData[teamKeys && teamKeys.length && teamKeys[0]].length
                  : <FormattedMessage id="Zero" />
                }
                  </p>
                </div>
                <div>
                  <span>{matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.sName && (matchDetails.oAwayTeam.sName === teamKeys[1]) ? matchDetails.oAwayTeam.sShortName : matchDetails && matchDetails.oHomeTeam && matchDetails.oHomeTeam.sName && (matchDetails.oHomeTeam.sName === teamKeys[1]) ? matchDetails.oHomeTeam.sShortName : matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.sShortName}</span>
                  <p>{teamData[teamKeys && teamKeys.length && teamKeys[1]] && teamData[teamKeys && teamKeys.length && teamKeys[1]].length ? teamData[teamKeys && teamKeys.length && teamKeys[1]].length : <FormattedMessage id="Zero" />}</p>
                </div>
                <div className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                  <span><FormattedMessage id="Credits_Left" /></span>
                  <p className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>{creditLeft}</p>
                </div>
              </div>
              <div className="p-block d-flex align-items-center">
                <div className="progress-bar w-100">
                  <span style={{ width: (SelectedPlayer.length * 100) / totalPlayer + '%' }} />
                </div>
                <button className="icon-remove" hidden={SelectedPlayer && !SelectedPlayer.length} onClick={() => clearTeam()} />
              </div>
              <div className='text-center mt-2'>
                <button className='auto-pick-team-btn'
                  onClick={() => {
                    if (SelectedPlayer?.length > 0) setConfirmationForAutoPick(true)
                    else onGetAutoPickTeam(matchDetails?._id)
                  }}
                >
                  <FormattedMessage id='Auto_Pick_Team' />
                </button>
              </div>
            </div>
            {
            matchDetails && matchDetails.sFantasyPost && (
              <Fragment>
                <div className="player-outer brownBack" onClick={() => navigate(`/tips/${matchDetails && matchDetails.sFantasyPost && matchDetails.sFantasyPost}`)}>
                  <p className="pick-info powerTips">
                    {' '}
                    <img className='me-2' src={TipsImage} />
                    {' '}
                    <FormattedMessage id="Match_Tips_powered_by_Crictracker" />
                    {' '}
                  </p>
                </div>
              </Fragment>
            )
          }
            {sportsType !== 'csgo' && (
            <Nav className={`${playerRoleClass} live-tabs justify-content-between` }>
              {
              playerRolesList && playerRolesList.length > 0
                ? playerRolesList.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a?.nPosition?.toString().localeCompare(b?.nPosition?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((Role, index) => {
                  const Name = Role.sName
                  return (
                    <Fragment key={Role._id}>
                      <NavItem className="text-center">
                        <NavLink className={classnames({ active: activeTab === (index + 1) })} onClick={() => { toggle(index + 1) }} >
                          {' '}
                          {Name}
                          (
                          {playerData && playerData[Name] ? playerData[Name].length : 0}
                          )
                        </NavLink>
                      </NavItem>
                    </Fragment>
                  )
                })
                : (
                  <Fragment>
                    <p className="text-center fullWidthCenter">
                      <FormattedMessage id="Player_roles_are_not_exist" />
                    </p>
                  </Fragment>
                  )
            }
            </Nav>
            )}
            <div className={`league-container ct-container ${matchDetails?.sFantasyPost ? 'matchtips' : ''}`}>
              <TabContent activeTab={activeTab}>
                {
                playerRolesList && playerRolesList.length >= 1
                  ? playerRolesList.map((a, i) => (
                    <TabPane key={a._id} tabId={i + 1}>
                      <div className="player-outer">
                        <Fragment key={a._id}>
                          <p className="pick-info sticky-position gray">
                            <FormattedMessage id="Select" />
                            {' '}
                            { `${a.nMin}-${a.nMax}`}
                            {' '}
                            {a.sFullName}
                          </p>
                          {
                            playerData && playerData[a.sName] && (playerData[a.sName].length >= a.nMax)
                              ? <PlayerList {...props} SelectedTeamPlayer={SelectedPlayer} addPlayerFun={addPlayer} cancel data={data && data[a.sName]} isEleven={eleven} isTeamSeven={teamSeven} matchDetails={matchDetails} onPlayerInfo={PlayerInfoFun} teamId={teamIDS} />
                              : <PlayerList {...props} SelectedTeamPlayer={SelectedPlayer} addPlayerFun={addPlayer} data={data && data[a.sName]} isEleven={eleven} isTeamSeven={teamSeven} matchDetails={matchDetails} onPlayerInfo={PlayerInfoFun} teamId={teamIDS} />
                          }
                        </Fragment>
                      </div>
                    </TabPane>
                  )
                  )
                  : (
                    <div className="no-team d-flex align-items-center justify-content-center">
                      <div className="">
                        <i className="icon-trophy" />
                        <h6 className="m-3"><FormattedMessage id="Match_players_are_not_exist" /></h6>
                      </div>
                    </div>
                    )
              }
              </TabContent>
            </div>
            <div className="btn-bottom text-center p-0">
              <Button className="w-100"
                color="primary-two"
                disabled={hide || changes}
                onClick={() => {
                  getLeagueDetails()
                  setNextStep(false)
                }}
              >
                <FormattedMessage id="Continue" />
              </Button>
            </div>
          </>
          )
        : (
          <>
            <div className='league-top-input'>
              {/* <Input
              type='text'
              value={Name}
              placeholder='Enter Team Name'
              onChange={e => {
                setName(e.target.value)
                if (!verifySpecialCharacter(e.target.value)) {
                  setErrorName('Team name must be alpha-numeric')
                } else {
                  setErrorName('')
                }
              }}
            >
            </Input> */}
              <FormGroup className="c-input mt-4 me-3 ms-3 mb-2">
                <Input
                  autoComplete="off"
                  className={classNames({ 'hash-contain': Name, error: errorName })}
                  id="team_naame"
                  onChange={e => {
                    setName(e.target.value)
                    if (e.target.value) {
                      if (!verifySpecialCharacter(e.target.value)) {
                        setErrorName(<FormattedMessage id='Team_name_alpha_numeric' />)
                      } else if (verifyLength(e.target.value, 11)) {
                        setErrorName(<FormattedMessage id='Team_name_10_characters' />)
                      } else {
                        setErrorName('')
                      }
                    } else {
                      setErrorName(<FormattedMessage id='Required_field' />)
                    }
                  }}
                  required
                  type='text'
                  value={Name}
                />
                <Label className="label m-0" for="team_name"><FormattedMessage id='Enter_Team_Name' /></Label>
                <p className="error-text">{errorName}</p>
              </FormGroup>
            </div>
            <div className="choose-txt text-center">
              <FormattedMessage id="Choose_Captain_and_Vice_Captain" />
              <span className="d-block"><FormattedMessage id="Captain_get_2x_and_Vice_Captain_gets_OnePointFivex_Points" /></span>
            </div>
            <div className="league-container">
              {
              Object.entries(playerData).map(([key, value]) => {
                return (
                  <div key={value._id} className="player-cat bg-white">
                    <div className="player-header d-flex justify-content-between">
                      <div>{allSportsRoles(key)}</div>
                      {' '}
                      <div>
                        <span><FormattedMessage id="Percentage_C_By" /></span>
                        <span><FormattedMessage id="Percentage_VC_By" /></span>
                      </div>
                    </div>
                    <Table className="bg-white player-list m-0">
                      <tbody>
                        {
                          value && value.length !== 0 && value.map((data) => {
                            return (
                              <tr key={data._id}>
                                <td key={`first${data._id}`}>
                                  <div className="l-img" onClick={() => { setPlayerLeagueInfo(true) }}>
                                    <img alt="" src={data && data.sImage ? `${sMediaUrl}${data.sImage}` : defaultPlayerRoleImages(sportsType, data?.eRole)} />
                                  </div>
                                </td>
                                <td key={`second${data._id}`} className='wordBreak'>
                                  <h4 className="p-name">{data && data.sName ? data.sName : ''}</h4>
                                  <p className="c-name">{data && data.sTeamName ? data.sTeamName : ''}</p>
                                </td>
                                <td key={`third${data._id}`} className='align_right'>
                                  <div className="i-select">
                                    <input checked={captionId === data._id} className="d-none" disabled={viceCaptionId === data._id} id={`Caption${data._id}`} name="Captain" type="radio" />
                                    <label htmlFor={`Caption${data._id}`} onClick={() => setCaptionId(data._id)}>
                                      <span className="n"><FormattedMessage id="C" /></span>
                                      <span className="p"><FormattedMessage id="Two_x" /></span>
                                    </label>
                                    <div className="pp">
                                      {data && data.nCaptainBy}
                                      %
                                    </div>
                                  </div>
                                  <div className="i-select">
                                    <input checked={viceCaptionId === data._id} className="d-none" disabled={captionId === data._id} id={`viceCaption${data._id}`} name="vc" type="radio" />
                                    <label htmlFor={`viceCaption${data._id}`} onClick={() => setViceCaptionId(data._id)}>
                                      <span className="n"><FormattedMessage id="VC" /></span>
                                      <span className="p"><FormattedMessage id="OnePointFive_x" /></span>
                                    </label>
                                    <div className="pp">
                                      {data && data.nViceCaptainBy}
                                      <FormattedMessage id="Percentage" />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                  </div>
                )
              })
            }
            </div>
            <div className="btn-bottom p-0">
              <div>
                {
                errorName && (
                  <p>{errorName}</p>
                )
              }
              </div>
              <Button className="w-100" color="primary-two" disabled={(!captionId || !viceCaptionId || errorName)} onClick={AddTeams}>
                {sLeagueId
                  ? (
                    <>
                      <FormattedMessage id='Join' />
                      (
                      <FormattedMessage id='Pay' />
                      {' '}
                      {' '}
                      {' '}
                      {currencyLogo}
                      {matchLeagueDetails?.nPrice}
                      )
                    </>
                    )
                  : <FormattedMessage id="Save_Team" />}
              </Button>
            </div>
          </>
          )
      }
      {paymentModal && (
        <>
          <div className="s-team-bg"
            onClick={() => {
              setPaymentModal(false)
              setLoading(false)
            }}
          />
          <Card className="filter-card select-team promo-card">
            <CardHeader className='d-flex align-items-center justify-content-between m-0'>
              <button><FormattedMessage id="Payment" /></button>
              <button onClick={() => {
                setPaymentModal(false)
                setLoading(false)
              }}
              >
                <img src={close} />
              </button>
            </CardHeader>
            <CardBody className="p-0 teamXShawing">
              <div className='teamJoin'>
                <h3>
                  1
                  <FormattedMessage id="Teams_Selected" />
                </h3>
              </div>
              <div className='selectedTeamList'>
                <MyTeam {...props}
                  UserTeamChoice
                  allTeams={teams}
                  index='0'
                  leagueData={matchLeagueDetails}
                  params={sMatchId}
                  teamDetails={teamPlayers}
                  teamPlayerList={teamPlayerList}
                  upcoming
                  viewOnly
                />
              </div>
              <Table className="m-0 bg-white promocode">
                <thead>
                  <tr>
                    <th><FormattedMessage id="Total_Entry" /></th>
                    <th className='rightAlign'>
                      {currencyLogo}
                      {matchLeagueDetails && matchLeagueDetails.nPrice}
                      {' '}
                      (
                      {matchLeagueDetails && `${matchLeagueDetails.nPrice} X 1`}
                      {' '}
                      )
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!(matchLeagueDetails && matchLeagueDetails.bPrivateLeague) && (
                  <Fragment>
                    <tr>
                      <td className='green' colSpan='2'>
                        {finalPromocode
                          ? (
                            <div className='d-flex align-items-center'>
                              <h3 className='promocode-text m-0'>
                                {finalPromocode}
                                {' '}
                                <FormattedMessage id='Applied' />
                              </h3>
                              <button className="ms-2" onClick={clearPromo}><img src={close} /></button>
                            </div>
                            )
                          : (
                            <Button className='p-0 d-flex align-items-center' color='link' onClick={() => getPromocodeList()}>
                              <h3 className='promocode-text m-0'><FormattedMessage id="Apply_Promocode" /></h3>
                              <img className='ms-1' src={rightGreenArrow} />
                            </Button>
                            )}
                      </td>
                    </tr>
                    <tr>
                      <td><FormattedMessage id="Discount" /></td>
                      <td className='rightAlign'>
                        {currencyLogo}
                        {discount}
                      </td>
                    </tr>
                  </Fragment>
                  )}
                  <tr>
                    <td><FormattedMessage id="From_wallet" /></td>
                    <td className='rightAlign'>
                      {currencyLogo}
                      {fromWallet}
                    </td>
                  </tr>
                  {fromBonus > 0 && (
                  <tr>
                    <td><FormattedMessage id="From_bonus" /></td>
                    <td className='rightAlign'>
                      {currencyLogo}
                      {fromBonus}
                    </td>
                  </tr>
                  )}
                </tbody>
                {/* {
                totalPay && currencyLogo
                  ? (
                  <tfoot>
                    <tr>
                      <td><h1><FormattedMessage id="To_Pay" /></h1></td>
                      <td className='rightAlign'>{currencyLogo}
                        {totalPay}</td>
                    </tr>
                  </tfoot>
                    )
                  : ''
              } */}
              </Table>
            </CardBody>
            <CardFooter className='p-0 border-0 bg-transparent m-0 d-flex justify-content-between'>
              <Button className="w-100"
                color='primary-two'
                disabled={teams && teams.length === 0}
                onClick={() => LeagueJoin()}
                type="submit"
              >
                {
                totalPay > 0
                  ? (
                    <>
                      <FormattedMessage id="Join" />
                      {' '}
                      (
                      <FormattedMessage id='Add'/>
                      {' '}
                      {' ' + currencyLogo}
                      {totalPay}
                      )
                    </>
                    )
                  : <><FormattedMessage id="Join" /></>
              }
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
      {PromoCodes
        ? (
          <>
            <div className="s-team-bg" onClick={() => setPromoCodes(false)} />
            <Card className="filter-card show select-team promo-card">
              <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                <button><FormattedMessage id="Select_Promocode" /></button>
                <button onClick={() => {
                  setPromoCodes(false)
                  setPaymentModal(true)
                }}
                >
                  <img src={close} />
                </button>
              </CardHeader>
              <CardBody className='p-10'>
                {promocodeLoading && <PromocodeLoading/>}
                <FormGroup className="c-input mt-2 mb-0">
                  <Input autoComplete='off' className={classNames({ 'hash-contain': finalPromocode }) } id="Promocode" onChange={(e) => e.target.value ? setPromoData(e.target.value) : setPromoData('')} placeholder='Enter Promocode' required type="text" value={promoData} />
                  {applied && finalPromocode
                    ? <button className="i-icon" onClick={clearPromo}>Remove</button>
                    : <button className="i-icon" onClick={() => applePromoCode(promoData)}><FormattedMessage id="Apply" /></button>}
                </FormGroup>
                <div className="p-title"><FormattedMessage id="Promocodes_For_You" /></div>
                {matchPromoCodeList !== {} && matchPromoCodeList && matchPromoCodeList.length > 0
                  ? matchPromoCodeList.map(matchPromo => {
                    return (
                      <div key={matchPromo._id} className="d-flex align-items-center justify-content-between promo-box">
                        <div>
                          <b>{matchPromo.sCode}</b>
                          <p>{matchPromo.sInfo}</p>
                        </div>
                        <Button color="white" onClick={() => applePromoCode(matchPromo.sCode)}><FormattedMessage id="Apply" /></Button>
                      </div>
                    )
                  })
                  : (
                    <Fragment>
                      <center>
                        <h2>
                          {' '}
                          <FormattedMessage id="No_Promocode_available_for_this_contest" />
                          {' '}
                        </h2>
                      </center>
                    </Fragment>
                    )
              }
              </CardBody>
              <CardFooter className='p-0 border-0 bg-transparent m-0 d-flex justify-content-between' />
            </Card>
          </>
          )
        : ''
      }
      <Modal className='payment-modal' isOpen={confirmationForAutoPick}>
        <ModalBody className='payment-modal-body '>
          <div className="first">
            <h2><FormattedMessage id='Confirmation' /></h2>
            <p><FormattedMessage id='Current_selection_will_be_overwritten'/></p>
            <div className='container'>
              <div className='row'>
                <div className='col dlt-div border-left-0 border-bottom-0'>
                  <button className='cncl-btn' onClick={() => onGetAutoPickTeam(matchDetails?._id)}><FormattedMessage id='Proceed' /></button>
                </div>
                <div className='col dlt-div border-right-0 border-bottom-0'>
                  <button className='dlt-btn' onClick={() => setConfirmationForAutoPick(false)}><FormattedMessage id='Cancel' /></button>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {playerLeagueInfo
        ? <PlayerLeagueInfo {...props} isSeasonPoint={true} onBackClick={() => setPlayerLeagueInfo(false)} onPlayerInfoClick={() => setPlayerInfo(true)} pId={playerId} />
        : ''
      }
      {playerInfo
        ? <PlayerInfo {...props} onBackClick={() => setPlayerInfo(false)} pId={playerId} />
        : ''
      }
    </>
  )
}

CreateTeams.propTypes = {
  data: PropTypes.shape({
    _id: PropTypes.string,
    sTeamName: PropTypes.string,
    sName: PropTypes.string,
    sImage: PropTypes.string,
    eRole: PropTypes.string,
    nCaptainBy: PropTypes.number,
    nViceCaptainBy: PropTypes.number
  }),
  playerRolesList: PropTypes.array,
  SelectedPlayer: PropTypes.array,
  teamKeys: PropTypes.array,
  mainIndex: PropTypes.number,
  teamPlayerList: PropTypes.array,
  teamList: PropTypes.array,
  teamSeven: PropTypes.bool,
  eleven: PropTypes.bool,
  aPlayers: PropTypes.array,
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  addPlayer: PropTypes.func,
  onGetUserTeam: PropTypes.func,
  playerData: PropTypes.object,
  teamData: PropTypes.object,
  creditLeft: PropTypes.number,
  teamId: PropTypes.array,
  teamDetails: PropTypes.shape({
    activeTab: PropTypes.number,
    sName: PropTypes.string
  }),
  matchDetails: PropTypes.shape({
    _id: PropTypes.string,
    sFantasyPost: PropTypes.string,
    oHomeTeam: PropTypes.shape({
      sName: PropTypes.string,
      sShortName: PropTypes.string
    }),
    oAwayTeam: PropTypes.shape({
      sName: PropTypes.string,
      sShortName: PropTypes.string
    })
  }),
  setLoader: PropTypes.bool,
  setSelectedPlayer: PropTypes.func,
  captionId: PropTypes.string,
  viceCaptionId: PropTypes.string,
  setCaptionId: PropTypes.func,
  setViceCaptionId: PropTypes.func,
  clearTeam: PropTypes.func,
  nextStep: PropTypes.string,
  setNextStep: PropTypes.func,
  totalPlayer: PropTypes.number,
  totalTeamPlayer: PropTypes.number,
  TeamCreate: PropTypes.func,
  TeamEdit: PropTypes.func,
  setAlertMsg: PropTypes.func,
  setModalMessage2: PropTypes.func,
  isCreateTeam: PropTypes.bool,
  isEditTeam: PropTypes.bool,
  resjoinMessage: PropTypes.string,
  resjoinLeagueStatus: PropTypes.bool,
  name: PropTypes.string,
  createTeamAndJoinContest: PropTypes.func,
  loading: PropTypes.bool,
  applyPromocodeData: PropTypes.shape({
    nDiscount: PropTypes.string,
    sCode: PropTypes.string
  }),
  userInfo: PropTypes.shape({
    nCurrentTotalBalance: PropTypes.number,
    nCurrentBonus: PropTypes.number
  }),
  appliedPromocode: PropTypes.bool,
  matchLeagueDetails: PropTypes.shape({
    aLeaguePrize: PropTypes.array,
    userJoined: PropTypes.shape([{
      nRank: PropTypes.number,
      nPrice: PropTypes.number,
      nTotalPoints: PropTypes.number,
      bTeamWinningZone: PropTypes.bool,
      sTeamName: PropTypes.string
    }]),
    sName: PropTypes.string,
    eMatchStatus: PropTypes.string,
    bPoolPrize: PropTypes.bool,
    nBonusUtil: PropTypes.number,
    nWinnersCount: PropTypes.number,
    nMax: PropTypes.number,
    nMin: PropTypes.number,
    nPrice: PropTypes.number,
    nLoyaltyPoint: PropTypes.number,
    nJoined: PropTypes.number,
    nTotalPayout: PropTypes.number,
    nTeamJoinLimit: PropTypes.number,
    _id: PropTypes.string,
    bConfirmLeague: PropTypes.bool,
    bMultipleEntry: PropTypes.bool,
    nJoinedCount: PropTypes.bool,
    bPrivateLeague: PropTypes.bool,
    iMatchId: PropTypes.string,
    sShareCode: PropTypes.string,
    eCashbackType: PropTypes.string,
    bUnlimitedJoin: PropTypes.bool,
    nCashbackAmount: PropTypes.number,
    nMinCashbackTeam: PropTypes.number,
    nDeductPercent: PropTypes.number
  }),
  currencyLogo: PropTypes.string,
  onGetPromocodeList: PropTypes.func,
  applyPromo: PropTypes.func,
  promocodeLoading: PropTypes.bool,
  matchPromoCodeList: PropTypes.shape([{
    sCode: PropTypes.string,
    sInfo: PropTypes.string,
    _id: PropTypes.string
  }]),
  getLeagueDetails: PropTypes.func,
  onGetUserProfile: PropTypes.func,
  alertMsg: PropTypes.string,
  setLoading: PropTypes.func,
  createTeamData: PropTypes.object,
  joinLeagueFunc: PropTypes.func,
  onGetAutoPickTeam: PropTypes.func,
  setConfirmationForAutoPick: PropTypes.func,
  confirmationForAutoPick: PropTypes.bool
}

export default compose(TeamPlayerList, CreateTeam)(CreateTeams)
