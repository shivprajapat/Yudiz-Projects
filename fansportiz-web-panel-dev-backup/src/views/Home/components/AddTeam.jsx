import React, { useEffect, useRef, Fragment, useState, Suspense } from 'react'
import CreateTeam from 'Common/src/components/SportsLeagueList/CreateTeam'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import {
  Button, Card, CardBody, CardFooter, CardHeader, FormGroup, Input, Label, Table
} from 'reactstrap'
import Loading from '../../../component/Loading'
import { joinTeam, createTeam } from '../../../Analytics.js'
import MyTeam from './MyTeam'
import PromocodeLoading from '../../../component/PromocodeLoading'
import classNames from 'classnames'
import close from '../../../assests/images/close.svg'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function AddTeam (props) {
  const { onGetUserProfile, matchLeagueDetails, getLeagueDetails, matchPromoCodeList, promocodeLoading, applyPromo, onGetPromocodeList, currencyLogo, appliedPromocode, userInfo, applyPromocodeData, Name, errorName, setModalMessage2, isCreateTeam, isEditTeam, setAlertMsg, TeamCreate, resjoinLeagueStatus, resjoinMessage, Tab, SelectedPlayer, captionId, viceCaptionId, ID, resStatus, resMessage, TeamEdit, name, loading, createTeamAndJoinContest } = props
  const amountData = useSelector(state => state.league.amountData)
  const previousProps = useRef({
    resMessage, resStatus, resjoinLeagueStatus, resjoinMessage, isCreateTeam, isEditTeam, amountData, applyPromocodeData, userInfo
  }).current
  const [createAndjoin, setCreateAndjoin] = useState(false)
  const [teams, setTeams] = useState([])
  const [paymentModal, setPaymentModal] = useState(false)
  const [PromoCodes, setPromoCodes] = useState(false)
  const [finalPromocode, setFinalPromocode] = useState('')
  const [applied, setApplied] = useState(false)
  const [totalPay, setTotalPay] = useState(0)
  const [promoData, setPromoData] = useState('')
  const [teamPlayers, setTeamPlayers] = useState([])
  const [fromWallet, setFromWallet] = useState(0)
  const [fromBonus, setFromBonus] = useState(0)
  const [discount, setDiscount] = useState(0)

  const { sMatchId, sportsType, sLeagueId, sTeamId, sShareCode } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const d = SelectedPlayer?.length > 0 && SelectedPlayer.map(d => d.iMatchPlayerId)
    setTeams(d)
  }, [])

  useEffect(() => {
    if (SelectedPlayer && captionId && viceCaptionId) {
      setTeamPlayers({
        ...teamPlayers,
        iCaptainId: captionId,
        iViceCaptainId: viceCaptionId,
        aPlayers: SelectedPlayer.map(d => d.iMatchPlayerId)
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
            sLeagueId && navigate(`/upcoming-match/leagues/${sportsType}/${sMatchId}`, { state: { tab: Tab || 2, referUrl: `/home/${sportsType}`, message: resjoinMessage } })
          } else {
            if (!resjoinLeagueStatus && createAndjoin) {
              sLeagueId && navigate(`/upcoming-match/leagues/${sportsType}/${sMatchId}`, { state: { tab: Tab || 2, referUrl: `/home/${sportsType}`, message: resjoinMessage } })
              setCreateAndjoin(false)
            }
          }
        }
      }
    }
    return () => {
      previousProps.resjoinMessage = resjoinMessage
    }
  }, [resjoinLeagueStatus, resjoinMessage])

  useEffect(() => {
    // if (userInfo !== previousProps.userInfo) {
    //   if (userInfo && userInfo.nCurrentTotalBalance) {
    //     const promocodeData = applyPromocodeData && applyPromocodeData.nDiscount ? applyPromocodeData.nDiscount : 0
    //     const value = matchLeagueDetails && (matchLeagueDetails.nPrice - promocodeData - (userInfo && userInfo.nCurrentTotalBalance))
    //     setTotalPay(value > 0 ? value.toFixed(2) : 0)
    //   }
    // }
    if (userInfo) {
      const nPromoDiscount = applyPromocodeData?.nDiscount || 0
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
    }
    return () => {
      previousProps.userInfo = userInfo
    }
  }, [userInfo])

  function AddTeams () {
    if (sLeagueId && location.pathname === `/create-team/${sportsType}/${sMatchId}/join/${sLeagueId}/private/${sShareCode}`) {
      setPaymentModal(true)
      getLeagueDetails()
      onGetUserProfile()
    } else if (sLeagueId) {
      setPaymentModal(true)
      getLeagueDetails()
      onGetUserProfile()
    } else if (sTeamId && location.pathname === `/edit-team/${sportsType}/${sMatchId}/${sTeamId}`) {
      TeamEdit(ID, sTeamId, captionId, viceCaptionId, teams, Name || name)
    } else {
      TeamCreate(ID, captionId, viceCaptionId, teams, Name)
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
          createTeamAndJoinContest(ID, captionId, viceCaptionId, teams, sLeagueId, false, '', Name || name, finalPromocode)
        } else {
          createTeamAndJoinContest(ID, captionId, viceCaptionId, teams, sLeagueId, false, '', Name || name, '')
        }
      } else if (sLeagueId && location.pathname === `/create-team/${sportsType}/${sMatchId}/join/${sLeagueId}/private/${sShareCode}`) {
        createTeamAndJoinContest(ID, captionId, viceCaptionId, teams, sLeagueId, true, sShareCode, Name || name)
      }
      setCreateAndjoin(true)
      callCreateTeamEvent()
      callJoinTeamEvent()
    }
  }

  const applePromoCode = (promo) => {
    if (matchLeagueDetails && matchLeagueDetails._id && teams && promo) {
      applyPromo({ iMatchLeagueId: matchLeagueDetails._id, nTeamCount: teams.length, sPromo: promo })
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
    //     const value = matchLeagueDetails && (matchLeagueDetails.nPrice - promocodeData - (userInfo && userInfo.nCurrentTotalBalance))
    //     setTotalPay(value > 0 ? value.toFixed(2) : 0)
    //   }
    // }
    if (applyPromocodeData !== previousProps.applyPromocodeData) {
      if ((applyPromocodeData && applyPromocodeData.nDiscount && appliedPromocode) || !applyPromocodeData) {
        setFinalPromocode(applyPromocodeData && applyPromocodeData.sCode)
        const nPromoDiscount = applyPromocodeData?.nDiscount || 0
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
      }
    }
    return () => {
      previousProps.applyPromocodeData = applyPromocodeData
    }
  }, [applyPromocodeData])

  useEffect(() => {
    if (previousProps.appliedPromocode !== appliedPromocode) {
      setApplied(appliedPromocode)
    }
    return () => {
      previousProps.appliedPromocode = appliedPromocode
    }
  }, [appliedPromocode])

  function callJoinTeamEvent () {
    if (ID && sMatchId && location.pathname) {
      joinTeam(ID, sMatchId, location.pathname)
    } else {
      ID && sMatchId && joinTeam(ID, sMatchId, '')
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

  return (
    <>
      {loading && <Loading />}
      {!paymentModal && <Button color="primary" disabled={(!captionId || !viceCaptionId || errorName)} onClick={AddTeams}><FormattedMessage id="Save_Team" /></Button>}
      {paymentModal && (
        <div className="leagues-card">
          <div className="s-team-bg" onClick={() => setPaymentModal(false)} />
          <Card className="filter-card select-team promo-card">
            <CardHeader className='d-flex align-items-center justify-content-between m-0'>
              <button><FormattedMessage id="Payment" /></button>
              <button onClick={() => { setPaymentModal(false) }} ><img src={close} /></button>
            </CardHeader>
            <CardBody className="p-0 teamXShawing">
              <div className='teamJoin'>
                <h3>
                  1
                  <FormattedMessage id="Teams_Selected" />
                </h3>
              </div>
              <div className='selectedTeamList'>
                <Suspense fallback={<Loading />}>
                  <MyTeam {...props}
                    UserTeamChoice
                    allTeams={teams}
                    index='1'
                    leagueData={matchLeagueDetails}
                    params={sMatchId}
                    teamDetails={teamPlayers}
                    upcoming
                    viewOnly
                  />
                </Suspense>
              </div>
              <Table className="m-0 bg-white promocode">
                <thead>
                  <tr>
                    <th><FormattedMessage id="Total_Entry" /></th>
                    <th className='rightAlign'>
                      {currencyLogo}
                      {matchLeagueDetails && teams && matchLeagueDetails.nPrice}
                      {' '}
                      (
                      {matchLeagueDetails && teams && `${matchLeagueDetails.nPrice} X 1`}
                      {' '}
                      )
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!(matchLeagueDetails && matchLeagueDetails.bPrivateLeague) && (
                  <tr>
                    <td className='green' colSpan='2'>
                      <FormGroup className="c-input mt-2 mb-0">
                        <Input autoComplete='off' className={classNames({ 'hash-contain': finalPromocode }) } id="Promocode" onChange={(e) => setPromoData(e.target.value)} onClick={() => getPromocodeList()} required type="text" value={finalPromocode} />
                        <Label className="no-change label m-0" for="Promocode"><FormattedMessage id="Promocode" /></Label>
                        {applied && finalPromocode
                          ? <button className="i-icon" onClick={clearPromo}><img src={close} /></button>
                          : <button className="i-icon" onClick={() => applePromoCode(promoData)}><FormattedMessage id="Apply" /></button>}
                      </FormGroup>
                    </td>
                  </tr>
                  )}
                  <tr>
                    <td><FormattedMessage id="Discount" /></td>
                    <td className='rightAlign'>
                      {currencyLogo}
                      {discount}
                    </td>
                  </tr>
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
                {
                totalPay && currencyLogo
                  ? (
                    <tfoot>
                      <tr>
                        <td><h1><FormattedMessage id="To_Pay" /></h1></td>
                        <td className='rightAlign'>
                          {currencyLogo}
                          {totalPay}
                        </td>
                      </tr>
                    </tfoot>
                    )
                  : ''
              }
              </Table>
            </CardBody>
            <CardFooter className='p-0 border-0 bg-transparent m-0 d-flex justify-content-between'>
              <Button className="w-100"
                color='primary'
                disabled={teams && teams.length === 0}
                onClick={() => LeagueJoin()}
                type="submit"
              >
                {
                totalPay > 0
                  ? <FormattedMessage id="Add_Money" />
                  : <FormattedMessage id="Join" />
              }
              </Button>
            </CardFooter>
          </Card>
        </div>
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
                {promocodeLoading && <PromocodeLoading />}
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
                    )}
              </CardBody>
              <CardFooter className='p-0 border-0 bg-transparent m-0 d-flex justify-content-between' />
            </Card>
          </>
          )
        : ''}
    </>
  )
}

AddTeam.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func,
    push: PropTypes.func,
    goBack: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id2: PropTypes.string,
      id: PropTypes.string,
      sportsType: PropTypes.string,
      sLeagueId: PropTypes.string,
      sShareCode: PropTypes.string
    }),
    path: PropTypes.string
  }),
  TeamCreate: PropTypes.func,
  TeamEdit: PropTypes.func,
  setAlertMsg: PropTypes.func,
  setModalMessage2: PropTypes.func,
  SelectedPlayer: PropTypes.array,
  captionId: PropTypes.string,
  Tab: PropTypes.string,
  Name: PropTypes.string,
  errorName: PropTypes.string,
  viceCaptionId: PropTypes.string,
  ID: PropTypes.string,
  resMessage: PropTypes.string,
  resStatus: PropTypes.bool,
  isCreateTeam: PropTypes.bool,
  isEditTeam: PropTypes.bool,
  resjoinMessage: PropTypes.string,
  resjoinLeagueStatus: PropTypes.bool,
  name: PropTypes.string,
  createTeamAndJoinContest: PropTypes.func,
  loading: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
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
  onGetUserProfile: PropTypes.func
}

export default CreateTeam(AddTeam)
