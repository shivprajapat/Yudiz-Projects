import React, { useState, Fragment, useEffect, useRef, lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import Diamond from '../../../assests/images/diamond.svg'
import DiamondDisable from '../../../assests/images/diamond_disable.svg'
import Multi from '../../../assests/images/multi.svg'
import MultiDisable from '../../../assests/images/multi_disable.svg'
import Copy from '../../../assests/images/copy.svg'
import CopyDisable from '../../../assests/images/copy_disable.svg'
import Loyalty from '../../../assests/images/ic_Loyaly_colored.svg'
import LoyaltyDisable from '../../../assests/images/ic_Loyaly_colored_disable.svg'
import Trophy from '../../../assests/images/trophy.svg'
import Medal from '../../../assests/images/medal.svg'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Badge, Table, Alert } from 'reactstrap'
import offerIcon from '../../../assests/images/cashback.svg'
import Loading from '../../../component/Loading'
import PromocodeLoading from '../../../component/PromocodeLoading'
import { viewContest, joinTeam } from '../../../utils/Analytics.js'
import createteam from '../../../assests/images/createTeamWhite.svg'
import createContest from '../../../assests/images/createContestWhite.svg'
import close from '../../../assests/images/close.svg'
import rightGreenArrow from '../../../assests/images/right-green-arrow.svg'
import qs from 'query-string'
import JoinContest from '../../../HOC/SportsLeagueList/JoinContest'
import useGetCurrency from '../../../api/settings/queries/useGetCurrency'
import classNames from 'classnames'
const MyTeam = lazy(() => import('./MyTeam'))

function League (props) {
  const {
    data,
    joinContest,
    teamList,
    contestJoinList,
    participated,
    toggleMessage,
    modalMessage,
    applyPromocodeData,
    onGetUserProfile,
    setModalMessage,
    joined,
    applyPromo,
    userInfo,
    loading,
    matchID,
    tab,
    firstPrize,
    firstRankType,
    getMyTeamList,
    matchType,
    activeTab,
    appliedPromocode,
    onGetPromocodeList,
    matchPromoCodeList,
    promocodeLoading,
    // currencyLogo,
    showInformation,
    amountData,
    MatchLeagueId,
    joinDetails,
    insideleagueDetailsPage,
    // setLoading,
    getMatchPlayersFunc,
    token
  } = props
  const [noOfJoin, setNoOfJoin] = useState('')
  const [userTeams, setUserTeams] = useState([])
  const [alert, setAlert] = useState(false)
  const [applied, setApplied] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [finalPromocode, setFinalPromocode] = useState('')
  const [PromoCodes, setPromoCodes] = useState(false)
  const [selectedAll, setSelectedAll] = useState(false)
  const [userTeamId, setUserTeamId] = useState([])
  const [updatedFilterData, setUpdatedFilterData] = useState([])
  const [IsJoinLeague, setIsJoinLeague] = useState(false)
  const [modalMessage2, setModalMessage2] = useState(false)
  const [totalPay, setTotalPay] = useState(0)
  const [fromWallet, setFromWallet] = useState(0)
  const [fromBonus, setFromBonus] = useState(0)
  const [discount, setDiscount] = useState(0)
  // const [totalPayFinal, setTotalPayFinal] = useState(0)
  const [UpdatedTeamList, setUpdatedTeamList] = useState([])
  const matchDetails = useSelector(state => state.match.matchDetails)
  const previousProps = useRef({
    userInfo, applyPromocodeData, amountData, IsJoinLeague
  }).current

  const { sMatchId, sportsType } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const navigate = useNavigate()
  const location = useLocation()
  const { data: currencyLogo } = useGetCurrency()

  useEffect(() => {
    setSelectedAll(false)
  }, [])

  useEffect(() => {
    // if (previousProps.teamList !== teamList) {
    if (IsJoinLeague && teamList?.length > 0) {
      data?._id && joint(data._id)
    }
    // }
    return () => {
      // previousProps.teamList = teamList
      previousProps.IsJoinLeague = IsJoinLeague
    }
  }, [teamList, IsJoinLeague])

  useEffect(() => {
    if (IsJoinLeague) {
      if (!teamList) {
        getMyTeamList()
      } else {
        data?._id && joint(data._id)
      }
    }
  }, [IsJoinLeague])

  useEffect(() => {
    // if (JSON.stringify(previousProps.userInfo) !== JSON.stringify(userInfo)) {
    if (userInfo && updatedFilterData?.length > 0) {
      const nPromoDiscount = applyPromocodeData?.nDiscount || 0
      const updatedFilterDataFinal = updatedFilterData?.length === 0 ? 1 : updatedFilterData?.length
      let nPrice = data?.nPrice * updatedFilterDataFinal
      nPrice = (nPromoDiscount) ? nPrice - nPromoDiscount : nPrice
      const nBonus = (data?.nBonusUtil * nPrice) / 100
      let value = 0
      let nActualBonus = 0
      let nActualCash = 0
      if (nPrice === 0) {
        setFromWallet(0)
        setFromBonus(0)
      } else if (nPrice > 0 && data?.nBonusUtil > 0) {
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
  }, [userInfo, updatedFilterData])

  useEffect(() => {
    if (selectedAll) {
      let updatedSelectedTeam = []
      if (UpdatedTeamList && UpdatedTeamList.length > 0) {
        updatedSelectedTeam = UpdatedTeamList.map(data => data._id)
        setUserTeams(updatedSelectedTeam)
      } else if (teamList && teamList.length > 0) {
        updatedSelectedTeam = teamList.map(data => data._id)
        setUserTeams(updatedSelectedTeam)
      }
    } else {
      if (userTeamId?.length > 0) {
        setUserTeams(userTeams.filter((item) => item.id !== userTeamId))
      } else {
        setUserTeams([])
      }
    }
  }, [selectedAll, userTeamId])

  useEffect(() => {
    if (applyPromocodeData !== previousProps.applyPromocodeData) {
      if ((applyPromocodeData && applyPromocodeData.nDiscount && appliedPromocode) || !applyPromocodeData) {
        setFinalPromocode(applyPromocodeData && applyPromocodeData.sCode)
        const nPromoDiscount = applyPromocodeData?.nDiscount || 0
        setDiscount(nPromoDiscount)
        const updatedFilterDataFinal = updatedFilterData?.length === 0 ? 1 : updatedFilterData?.length
        let nPrice = data?.nPrice * updatedFilterDataFinal
        nPrice = (nPromoDiscount) ? nPrice - nPromoDiscount : nPrice
        const nBonus = (data?.nBonusUtil * nPrice) / 100
        let value = 0
        let nActualBonus = 0
        let nActualCash = 0
        if (nPrice === 0) {
          setFromWallet(0)
          setFromBonus(0)
        } else if (nPrice > 0 && data?.nBonusUtil > 0) {
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
    if (previousProps.appliedPromocode !== appliedPromocode) { // handle the loader
      setApplied(appliedPromocode)
    }
    return () => {
      previousProps.appliedPromocode = appliedPromocode
    }
  }, [appliedPromocode])

  function joint (sLeagueId) {
    const contestData = insideleagueDetailsPage
      ? joinDetails
      : contestJoinList?.length > 0 && contestJoinList.find(contest => contest?.iMatchLeagueId === data._id)
    if (contestData) {
      const FilterTeam = contestData && contestData.aUserTeams && contestData.aUserTeams.length > 0
        ? teamList && teamList.length !== 0 && teamList.filter(team => contestData && contestData.aUserTeams && !contestData.aUserTeams.includes(team._id))
        : teamList
      if (FilterTeam && FilterTeam.length !== 0) {
        setUpdatedTeamList(FilterTeam)
        getMatchPlayersFunc(sMatchId, token)
        toggleMessage()
        setNoOfJoin(data.bPrivateLeague && data.bMultipleEntry ? data.nMax - data.nJoined : contestData && contestData.nJoinedCount ? (data.nTeamJoinLimit - contestData.nJoinedCount) : data.nTeamJoinLimit)
      } else {
        if (data && data.bPrivateLeague && data.sShareCode) {
          navigate(`/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${sLeagueId}/private/${data.sShareCode}`,
            {
              state: { activeTab: activeTab },
              search: `?${qs.stringify({
                homePage: homePage ? 'yes' : undefined
              })}`
            })
        } else {
          navigate(`/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${sLeagueId}`,
            {
              state: { activeTab: activeTab },
              search: `?${qs.stringify({
                homePage: homePage ? 'yes' : undefined
              })}`
            })
        }
      }
    } else {
      if (teamList?.length > 0) {
        toggleMessage()
        getMatchPlayersFunc(sMatchId, token)
        setNoOfJoin(data.bPrivateLeague && data.bMultipleEntry ? data.nMax - data.nJoined : data.nTeamJoinLimit)
      } else {
        if (data && data.bPrivateLeague && data.sShareCode) {
          navigate(`/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${sLeagueId}/private/${data.sShareCode}`,
            {
              state: { activeTab: activeTab },
              search: `?${qs.stringify({
                homePage: homePage ? 'yes' : undefined
              })}`
            })
        } else {
          navigate(`/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${sLeagueId}`,
            {
              state: { activeTab: activeTab },
              search: `?${qs.stringify({
                homePage: homePage ? 'yes' : undefined
              })}`
            })
        }
      }
    }
    setIsJoinLeague(false)
  }

  function LeagueJoin (userTeams) {
    setModalMessage2(false)
    if (totalPay > 0) {
      navigate('/deposit',
        {
          state: {
            amountData: { nAmount: Number(totalPay) },
            message: 'Insufficient Balance'
          }
        })
    } else {
      applied && finalPromocode ? joinContest(userTeams, finalPromocode) : joinContest(userTeams, '')
      callJoinTeamEvent()
    }
  }

  const applePromoCode = (promo) => {
    if (data && data._id && updatedFilterData && updatedFilterData.length > 0 && promo) {
      applyPromo({ iMatchLeagueId: data._id, nTeamCount: updatedFilterData.length, sPromo: promo })
      setPromoCodes(false)
      setModalMessage2(true)
      setFinalPromocode('')
    }
  }
  function callViewContestEvent () {
    if (data && data.sName && data._id && location.pathname) {
      viewContest(data.sName, data._id, location.pathname)
    } else {
      data && data.sName && data._id && viewContest(data.sName, data._id, '')
    }
    if (PromoCodes) setPromoCodes(false)
  }

  function callJoinTeamEvent () {
    if (userTeams && sMatchId && location.pathname) {
      joinTeam(userTeams, sMatchId, location.pathname)
    } else {
      userTeams && sMatchId && joinTeam(userTeams, sMatchId, '')
    }
  }

  function getPromocodeList () {
    setPromoCodes(true)
    setModalMessage(false)
    setModalMessage2(false)
    data && data._id && onGetPromocodeList(data._id)
  }

  function clearPromo () {
    if (totalPay > 0) {
      setTotalPay(parseInt(totalPay) + parseInt(applyPromocodeData?.nDiscount))
    } else if (data?.nBonusUtil === 100) {
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
      {alert && alertMessage ? <Alert className='select-all' color="primary" isOpen={alert}>{alertMessage}</Alert> : ''}
      <Fragment>
        {
          data && data.bPrivateLeague && (
            <CardHeader className="border-0 mt-3 d-flex justify-content-between">
              {data && data.sName}
              {
                matchType === 'upcoming' && ((data.nJoined < data.nMax) || data.bUnlimitedJoin) && (
                  <button className="bg-transparent icon-share"
                    onClick={() => navigate(`/create-contest/${(sportsType).toLowerCase()}/${data.iMatchId}/${data._id}/invite`,
                      {
                        state: { matchDetails: matchDetails, matchLeagueDetails: data },
                        search: `?${qs.stringify({
                          homePage: homePage ? 'yes' : undefined
                        })}`
                      })}
                  />
                )
              }
            </CardHeader>
          )
        }
        <div className="card border-0 bg-transparent" onClick={() => callViewContestEvent()}>
          <CardBody className="bg-white">
            <Link state={{ tab: tab, referUrl: `/upcoming-match/leagues/${(sportsType).toLowerCase()}/${matchID}`, teamList }}
              to={!participated
                ? {
                    pathname: `/upcoming-match/league-details/${(sportsType).toLowerCase()}/${matchID}/${data && data._id}`,
                    search: `?${qs.stringify({
                      homePage: homePage ? 'yes' : undefined
                    })}`
                  }
                : `/live-completed-match/league-details/${(sportsType).toLowerCase()}/${sMatchId}/${data && data._id}`}
            >
              <ul className="m-0 d-flex align-items-center flex-wrap">
                <li className={document.dir === 'rtl' ? 'd-flex' : ''} >
                  <FormattedMessage id="Prize_Pool" />
                  <strong>
                    {' '}
                    {currencyLogo}
                    {data && data.nTotalPayout && data.nTotalPayout
                  // data && data.bUnlimitedJoin ? (Number(((data.nTotalPayout / data.nMax) * data.nJoined) - (((data.nJoined * data.nPrice) * (data.nBonusUtil || 0)) / 100)).toFixed(2)) : data && data.nTotalPayout ? data.nTotalPayout : ''
                }
                    {/* data && data.bPoolPrize && data.nDeductPercent !== null && (!data.bPrivateLeague) && data.eMatchStatus === 'U'
                    ? Math.floor(Number(((data.nPrice * maxValue(data.nMin, data.nJoined) * 100) / (((data && data.nDeductPercent) || 0) + 100))))
                    : data && data.bPoolPrize && data.nDeductPercent !== null && (!data.bPrivateLeague) && data.eMatchStatus !== 'U'
                      ? Math.floor(Number(((data.nPrice * data.nJoined * 100) / (((data && data.nDeductPercent) || 0) + 100))))
                      : data && data.nTotalPayout && data.nTotalPayout */}
                  </strong>

                </li>
                <li className={document.dir === 'rtl' ? 'd-flex justify-content-end' : ''}>
                  {
                    data && data.nLoyaltyPoint && data.nLoyaltyPoint >= 1
                      ? (
                        <Fragment>
                          <i className="icon-ic_Loyalty_grey" />
                          <span className={document.dir === 'rtl' ? 'ms-2' : 'me-2'}>
                            {' '}
                            {data && data.nLoyaltyPoint && data.nLoyaltyPoint >= 1 ? data.nLoyaltyPoint : '0'}
                            {' '}
                            <FormattedMessage id="Points" />
                            {' '}
                          </span>
                        </Fragment>
                        )
                      : ''
                  }
                  {
                    data && !data.bPrivateLeague && (
                      <Fragment>
                        <i className={`icon-tickets ${document.dir === 'rtl' ? 'ms-1' : ''}`} />
                        {data && data.nTeamJoinLimit
                          ? data.nTeamJoinLimit === 1
                            ? <FormattedMessage id="Single_Entry" />
                            : (document.dir === 'rtl'
                                ? (
                                  <div className='d-flex flex-row-reverse'>
                                    <FormattedMessage id="Upto" />
                                    {' '}
                                    {data.nTeamJoinLimit}
                                    {' '}
                                    <FormattedMessage id="Entries" />
                                  </div>
                                  )
                                : (
                                  <Fragment>
                                    <FormattedMessage id="Upto" />
                                    {data.nTeamJoinLimit}
                                    <FormattedMessage id="Entries" />
                                  </Fragment>
                                  )
                              )
                          : ''}
                      </Fragment>
                    )
                  }
                </li>
                <li className={document.dir === 'rtl' ? 'd-flex' : ''}>
                  <img alt={<FormattedMessage id='Medal' />} src={Medal} />
                  <FormattedMessage id="First_Prize" />
                  :
                  {' '}
                  <b className={classNames({ 'd-flex flex-row-reverse': document.dir === 'rtl' })}>
                    <span>{firstRankType !== 'E' && currencyLogo}</span>
                    {' '}
                    {firstRankType !== 'E' ? parseFloat(Number((firstPrize)).toFixed(2)) : firstPrize}
                    {' '}
                    {firstRankType === 'B' && 'Bonus'}
                    {' '}
                  </b>
                </li>
                <li className={document.dir === 'rtl' ? 'd-flex justify-content-end' : ''}>
                  <img alt={<FormattedMessage id='Trophy' />} src={Trophy}/>
                  <FormattedMessage id="Winners" />
                  :
                  {' '}
                  <b>
                    {data && data.nMax && data.nWinnersCount ? (parseInt((data.nWinnersCount || 0) / data.nMax * 100)) : 0}
                    <FormattedMessage id="Percentage" />
                  </b>
                </li>
              </ul>
              {
                data && data.nJoined >= 0
                  ? (
                    <Fragment>
                      {(data && data.bUnlimitedJoin)
                        ? <div className="ul-p-bar" />
                        : <div className="p-bar"><span style={{ width: data && data.nMax >= 0 && data.nJoined >= 0 && `${((100 * data.nJoined) / data.nMax)}%` }} /></div>}
                      <div className={`t-info d-flex align-items-center justify-content-between ${document.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span>
                          {
                          (data?.nJoined > data.nMax) && (!data && data.bUnlimitedJoin)
                            ? (
                              <Fragment>
                                0
                                {' '}
                                <FormattedMessage id="Left" />
                              </Fragment>
                              )
                            : (
                              <Fragment>
                                {data && data.bUnlimitedJoin ? 'ထ ' : amountData && amountData.sKey === 'SUCCESS' && data._id === MatchLeagueId ? (data.nMax - (amountData?.oValue?.nJoined)) : data && data.nJoined >= 0 && data.nMax >= 0 && (data.nMax - data.nJoined) >= 0 ? (data.nMax - data.nJoined) : 0}
                                {' '}
                                <FormattedMessage id="Left" />
                              </Fragment>
                              )
                        }
                        </span>
                        <span className='blackColor'>
                          {
                          (data?.nJoined > data.nMax)
                            ? (
                              <Fragment>
                                {data && data.bUnlimitedJoin ? data?.nJoined + '/ထ' : data && data.nJoined === 0 ? 0 : data.nJoined}
                                {' '}
                                <span className='blackColor'><FormattedMessage id="Joined" /></span>
                              </Fragment>
                              )
                            : (
                              <Fragment>
                                {
                                data && data.nJoined === 0 ? 0 : data.nJoined
}
                                /
                                {data && data.bUnlimitedJoin ? 'ထ' : data && (data.nMax > data.nJoined) ? data.nMax : data.nJoined}
                                {' '}
                                <span className='blackColor'><FormattedMessage id="Joined" /></span>
                              </Fragment>
                              )
                        }
                        </span>
                      </div>
                    </Fragment>
                    )
                  : (
                    <Fragment>
                      <div className="p-bar">
                        <span style={{ width: data && data.nMax >= 0 && data.nJoined >= 0 ? ((100 * data.nJoined) / data.nMax) : '' }}> </span>
                        {' '}
                      </div>
                      <div className={`t-info d-flex align-items-center justify-content-between ${document.dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <span>
                          {' '}
                          <FormattedMessage id="Left" />
                          {' '}
                        </span>
                        <span>
                          {' '}
                          <FormattedMessage id="Teams" />
                          {' '}
                        </span>
                      </div>
                    </Fragment>
                    )
              }
            </Link>
            <CardFooter className="bg-white d-flex align-items-center justify-content-between">
              <div className="f-w">
                <Fragment>
                  {data && data.nBonusUtil && (!data.bPrivateLeague) ? <img alt={<FormattedMessage id='Diamond' />} src={Diamond} /> : <img alt={<FormattedMessage id='Diamond_Disable' />} src={DiamondDisable} />}
                  {data && data.bMultipleEntry ? <img alt={<FormattedMessage id='Multi' />} src={Multi} /> : <img alt={<FormattedMessage id='Multi_Disable' />} src={MultiDisable} />}
                  {data && data.bConfirmLeague && (!data.bPrivateLeague) ? <img alt={<FormattedMessage id='Copy' />} src={Copy} /> : <img alt={<FormattedMessage id='Copy_Disable' />} src={CopyDisable} />}
                  {data && data.nLoyaltyPoint && (!data.bPrivateLeague) ? <img alt={<FormattedMessage id='Loyalty' />} src={Loyalty} /> : <img alt={<FormattedMessage id='Loyalty_Disable' />} src={LoyaltyDisable} />}
                </Fragment>
              </div>
              {
                data && data.nBonusUtil
                  ? (
                    <div className="f-w text-center">
                      <FormattedMessage id="Bonus" />
                      {' '}
                      :
                      {' '}
                      <b dir='ltr'>
                        {' '}
                        {data && data.nBonusUtil ? data.nBonusUtil : <FormattedMessage id="Zero" />}
                        {' '}
                        <FormattedMessage id="Percentage" />
                      </b>
                    </div>
                    )
                  : ''
              }
              <div className="f-w text-end">
                <FormattedMessage id="Entry" />
                <Button className='price-btn' color="primary" disabled={participated || (Object.keys(joined).length > 0 && data && data.bPrivateLeague && !data.bMultipleEntry) || (joined && data && !data.bPrivateLeague && (joined.nJoinedCount === data.nTeamJoinLimit)) || (data && data.nJoined && data.nMax && !data.bUnlimitedJoin && data.nJoined === data.nMax) || (data && joinDetails && !data.bPrivateLeague && (joinDetails.nJoinedCount === data.nTeamJoinLimit))} onClick={() => setIsJoinLeague(true)}>
                  <span>{currencyLogo}</span>
                  {' '}
                  {data && data.nPrice ? data.nPrice : <FormattedMessage id="Zero" />}
                </Button>
              </div>
            </CardFooter>
            {
              data && data.nCashbackAmount && data.nMinCashbackTeam
                ? (
                  <div className="bg-white d-flex">
                    <Badge className='cashback' color="info" pill >
                      <img className='img' src={offerIcon} />
                      <span dir='ltr'>
                        {currencyLogo}
                        {' '}
                        {data && data.nCashbackAmount}
                        {' '}
                        {data && data.eCashbackType === 'B' ? <FormattedMessage id="Bonus" /> : <FormattedMessage id="Cashback" /> }
                        {
                      data && data.nMinCashbackTeam >= 1
                        ? (
                          <Fragment>
                            { data && ` ${data.nMinCashbackTeam}` }
                            {' '}
                            { data && data.nMinCashbackTeam > 1 ? <FormattedMessage id="Entries" /> : <FormattedMessage id="Entry" />}
                          </Fragment>
                          )
                        : ' '
                    }
                      </span>
                    </Badge>
                  </div>
                  )
                : ''
            }
            {
              showInformation && (
                <>
                  <hr className='league-hr' />
                  <div className="mt-footer ft-12 d-flex align-items-center justify-content-around">
                    <span className='gray'>
                      <img alt={<FormattedMessage id='Diamond' />} src={Diamond} />
                      <FormattedMessage id="Bonus" />
                    </span>
                    <span className='gray'>
                      <img alt={<FormattedMessage id='Multi' />} src={Multi} />
                      <FormattedMessage id="Multiple_Teams" />
                    </span>
                    <span className='gray'>
                      <img alt={<FormattedMessage id='Copy' />} src={Copy} />
                      <FormattedMessage id="Confirmed" />
                    </span>
                    <span className='gray'>
                      <img alt={<FormattedMessage id='Loyalty' />} src={Loyalty} />
                      <FormattedMessage id="Loyalty_Points" />
                    </span>
                  </div>
                </>
              )
            }
            {
              data && data.userJoined && (matchDetails?.eStatus === 'L' || matchDetails?.eStatus === 'I' || matchDetails?.eStatus === 'CMP')
                ? data?.userJoined?.sort((a, b) => a.nRank - b.nRank).map((team, index) => {
                  return (
                    index <= 2
                      ? (
                        <Fragment key={index}>
                          <div>
                            <div className={`mt-footer footerPrizeBreakup ${team.bTeamWinningZone || team.nPrice || team.nBonusWin || team.aExtraWin?.length > 0 ? 'backGreen' : 'backRed'}`}>
                              <div className='d-flex align-items-center justify-content-around'>
                                <span>
                                  <b>
                                    {' '}
                                    {team.sTeamName ? team.sTeamName : ''}
                                    {' '}
                                  </b>
                                </span>
                                <span>
                                  <b>
                                    {' '}
                                    {team.nTotalPoints > 0 ? team.nTotalPoints : '0'}
                                    {' '}
                                  </b>
                                </span>
                                <span>
                                  <b>
                                    {' '}
                                    #
                                    {team.nRank ? team.nRank : '-'}
                                    {' '}
                                  </b>
                                </span>
                              </div>
                              <div>
                                {
                              team.bTeamWinningZone && (
                                <Fragment>
                                  <div className='greenText green-color'>
                                    <img className={document.dir === 'rtl' ? 'ms-1' : 'me-1'} src={Trophy} />
                                    <span className='mt-2 winning-text'>
                                      <FormattedMessage id="You_are_in_winning_zone" />
                                    </span>
                                  </div>
                                    {/* {
                                    team?.nPrice >= 1 && !team.nBonusWin >= 1 && team.aExtraWin?.length === 0 && (
                                      <b className='greenText green-color'>
                                          <img src={Trophy} className='me-1'></img>
                                          <span className='mt-2 winning-text'>
                                            <FormattedMessage id="You_are_in_winning_zone" />
                                          </span>
                                      </b>
                                    )
                                    }
                                    {
                                    team && !team.nPrice >= 1 && team.nBonusWin >= 1 && team.aExtraWin?.length === 0 &&
                                      (
                                      <b className='greenText green-color'>
                                          <img src={Trophy} className='me-1'></img>
                                          <span className='mt-2 winning-text'>
                                            <FormattedMessage id="You_are_in_winning_zone" />
                                          </span>
                                      </b>
                                      )
                                    }
                                    {
                                    team && team.nPrice === 0 && team.nBonusWin === 0 && team.aExtraWin && team.aExtraWin?.length === 1 &&
                                      (
                                      <b className='greenText green-color'>
                                          <img src={Trophy} className='me-1'></img>
                                          <span className='mt-2 winning-text'>
                                            <FormattedMessage id="You_are_in_winning_zone" />
                                          </span>
                                      </b>
                                      )
                                    }
                                    {
                                    team && !team.nPrice >= 1 && !team.nBonusWin >= 1 && team.aExtraWin?.length >= 2 &&
                                      (
                                      <b className='greenText green-color'>
                                          <img src={Trophy} className='me-1'></img>
                                          <span className='mt-2 winning-text'>
                                            <FormattedMessage id="You_are_in_winning_zone" />
                                          </span>
                                      </b>
                                      )
                                    }
                                    {
                                    team && ((team.nPrice >= 1 && team.nBonusWin >= 1) || (team.nPrice >= 1 && team.aExtraWin?.length >= 1) || (team.aExtraWin?.length >= 1 && team.nBonusWin >= 1) || (team.aExtraWin?.length >= 1 && team.nBonusWin >= 1 && team.nPrice >= 1)) &&
                                      (
                                      <b className='greenText green-color'>
                                          <img src={Trophy} className='me-1'></img>
                                          <span className='mt-2 winning-text'>
                                            <FormattedMessage id="You_are_in_winning_zone" />
                                          </span>
                                      </b>
                                      )
                                    } */}
                                </Fragment>
                              )
                            }
                                {matchDetails?.eStatus === 'CMP' && (
                                <Fragment>
                                  {team && team.nPrice >= 1 && !team.nBonusWin >= 1 && team.aExtraWin?.length === 0
                                    ? (
                                      <p className='greenText green-color'>
                                        <FormattedMessage id="YOU_WON_RUPEE"/>
                                        {' '}
                                        {parseFloat(team.nPrice.toFixed(2))}
                                      </p>
                                      )
                                    : team && !team.nPrice >= 1 && team.nBonusWin >= 1 && team.aExtraWin?.length === 0
                                      ? (
                                        <p className='greenText green-color'>
                                          <FormattedMessage id="YOU_WON_RUPEE"/>
                                          {' '}
                                          {parseFloat(team.nBonusWin.toFixed(2))}
                                          {' '}
                                          Bonus
                                          {' '}
                                        </p>
                                        )
                                      : team && !team.nPrice >= 1 && !team.nBonusWin >= 1 && team.aExtraWin?.length === 1
                                        ? (
                                          <p className='greenText green-color'>
                                            <FormattedMessage id="YOU_WON_RUPEE"/>
                                            {' '}
                                            {team.aExtraWin[0]?.sInfo}
                                            {' '}
                                          </p>
                                          )
                                        : team && !team.nPrice >= 1 && !team.nBonusWin >= 1 && team.aExtraWin?.length >= 2
                                          ? (
                                            <p className='greenText green-color'>
                                              {' '}
                                              <FormattedMessage id="Won_Gadgets"/>
                                              {' '}
                                            </p>
                                            )
                                          : team && !team.nPrice >= 1 && !team.nBonusWin >= 1 && team.aExtraWin?.length === 0
                                            ? ''
                                            : (
                                              <p className='greenText green-color'>
                                                <FormattedMessage id="Won_Multiple_Prizes"/>
                                                {' '}
                                              </p>
                                              )}
                                </Fragment>
                                )}
                              </div>
                            </div>
                          </div>
                        </Fragment>
                        )
                      : index === 3 && (
                        <Fragment key={index}>
                          <Link state={ { tab: tab, referUrl: `/upcoming-match/leagues/${(sportsType).toLowerCase()}/${matchID}`, teamList }}
                            to={!participated
                              ? {
                                  pathname: `/upcoming-match/league-details/${(sportsType).toLowerCase()}/${matchID}/${data && data._id}`,
                                  search: `?${qs.stringify({
                                    homePage: homePage ? 'yes' : undefined
                                  })}`
                                }
                              : `/live-completed-match/league-details/${(sportsType).toLowerCase()}/${sMatchId}/${data && data._id}`}
                          >
                            <div className="mt-footer footerPrizeBreakup d-flex align-items-center justify-content-around">
                              <span>
                                +
                                {' '}
                                {data.userJoined?.length - 3}
                                {' '}
                                more
                              </span>
                            </div>
                          </Link>
                        </Fragment>
                      )
                  )
                })
                : ''
            }
          </CardBody>
        </div>
        {
          modalMessage && teamList
            ? (
              <>
                <div className="s-team-bg"
                  onClick={() => {
                    setModalMessage(false)
                    setSelectedAll(false)
                  }}
                />
                <Card className="filter-card select-team promo-card">
                  <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                    <button><FormattedMessage id="Select_Team" /></button>
                    <button onClick={() => {
                      setSelectedAll(false)
                      setModalMessage(false)
                    }}
                    >
                      <img src={close} />
                    </button>
                  </CardHeader>
                  <CardBody className="p-0">
                    <div className="two-button border-0 bg-white m-0 d-flex justify-content-between card-footer">
                      <Button className='create-team-button'
                        onClick={() => navigate(data && data.bPrivateLeague && data.sShareCode ? `/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${data._id}/private/${data.sShareCode}` : `/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${data._id}`,
                          {
                            state: { activeTab: activeTab },
                            search: `?${qs.stringify({
                              homePage: homePage ? 'yes' : undefined
                            })}`
                          })}
                        type="submit"
                      >
                        <img alt={<FormattedMessage id='Create_Team' />} className={document.dir === 'rtl' ? 'ms-2' : 'me-2'} src={createteam} width={20} />
                        <FormattedMessage id="Create_Team" />
                      </Button>
                      <Button className='create-contest-button'
                        onClick={() => navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}`,
                          {
                            search: `?${qs.stringify({
                              homePage: homePage ? 'yes' : undefined
                            })}`
                          })}
                        type="submit"
                      >
                        <img alt={<FormattedMessage id='Create_Contest' />} className={document.dir === 'rtl' ? 'ms-2' : 'me-2'} src={createContest} width={20} />
                        <FormattedMessage id="Create_Contest" />
                      </Button>
                    </div>
                    {data && data.bMultipleEntry && ((UpdatedTeamList && UpdatedTeamList.length !== 1) && (teamList && teamList.length !== 1)) && (
                    <div className='SelectAll d-flex align-items-center'>
                      <input checked={selectedAll}
                        id='name'
                        name="gender"
                        onClick={() => setSelectedAll(!selectedAll)}
                        type="radio"
                      />
                      <label htmlFor='name'>
                        <FormattedMessage id="Select_All" />
                        {' '}
                      </label>
                    </div>
                    )}
                    {
                    teamList?.length > 0 &&
                      teamList.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data1, index) => {
                        return (
                          <Suspense key={data1._id} fallback={<Loading />}>
                            <div className='d-flex'>
                              <MyTeam {...props}
                                key={data1._id}
                                UserTeamChoice
                                allTeams={teamList}
                                disabledRadio={UpdatedTeamList?.find((item) => item._id === data1._id)?._id}
                                disabledRadioFlag={UpdatedTeamList?.length !== 0}
                                index={index}
                                join
                                leagueData={data}
                                noOfJoin={noOfJoin}
                                params={sMatchId}
                                setUserTeams={(Id) => {
                                  setUserTeams(Id)
                                  setUserTeamId(Id)
                                  setSelectedAll(false)
                                }}
                                teamDetails={data1}
                                teamId={data1._id}
                                upcoming
                                userTeams={userTeams}
                              />
                            </div>
                          </Suspense>
                        )
                      })
                  }
                  </CardBody>
                  <CardFooter className='p-0 border-0 bg-trnsparent m-0 d-flex justify-content-between'>
                    <Button className="w-100"
                      color='primary-two'
                      disabled={userTeams && userTeams.length === 0}
                      onClick={() => {
                        if (userTeams.length > (data.nMax - data.nJoined) && (!data.bUnlimitedJoin)) {
                          setAlert(true)
                          setAlertMessage(
                            <p>
                              <FormattedMessage id="You_can_select_max " />
                              {' '}
                              {data.nMax - data.nJoined || '-'}
                              {' '}
                              <FormattedMessage id="Teams_for_this_contest" />
                            </p>
                          )
                          setTimeout(() => {
                            setAlertMessage('')
                            setAlert(false)
                          }, 2000)
                        } else if (noOfJoin >= userTeams.length) {
                          if (data.bPrivateLeague) {
                            LeagueJoin(userTeams)
                          } else {
                            const filterData = teamList.filter(data => userTeams.includes(data._id))
                            onGetUserProfile()
                            setUpdatedFilterData(filterData)
                            setModalMessage2(true)
                            setModalMessage(false)
                            setFinalPromocode('')
                          }
                        } else {
                          setAlert(true)
                          setAlertMessage(
                            <p>
                              <FormattedMessage id="You_can_select_max " />
                              {' '}
                              {noOfJoin || '-'}
                              {' '}
                              <FormattedMessage id="Teams_for_this_contest" />
                            </p>)
                          setTimeout(() => {
                            setAlertMessage('')
                            setAlert(false)
                          }, 2000)
                        }
                        setSelectedAll(false)
                        // }}><FormattedMessage id="Join" /> (<FormattedMessage id='Pay'/> <FormattedMessage id='Rupee'/>0)</Button>
                      }}
                      type="submit"
                    >
                      {data.bPrivateLeague
                        ? (
                          <>
                            <FormattedMessage id="Join" />
                            (
                            <FormattedMessage id='Pay' />
                            {' '}
                            {currencyLogo}
                            {' '}
                            {userTeams?.length * data.nPrice}
                            )
                          </>
                          )
                        : <FormattedMessage id='Next' />}
                    </Button>
                  </CardFooter>
                </Card>
              </>
              )
            : modalMessage2
              ? (
                <>
                  {loading && <Loading />}
                  <div className="s-team-bg" onClick={() => setModalMessage2(false)} />
                  <Card className="filter-card select-team promo-card">
                    <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                      <button><FormattedMessage id="Payment" /></button>
                      <button onClick={() => {
                        setModalMessage2(false)
                        setModalMessage(true)
                      }}
                      >
                        <img src={close} />
                      </button>
                    </CardHeader>
                    <CardBody className="p-0 teamXShawing">
                      <div className='teamJoin'>
                        {
                        updatedFilterData && updatedFilterData.length && (
                          <h3>
                            {updatedFilterData.length}
                            {' '}
                            <FormattedMessage id="Teams_Selected" />
                          </h3>
                        )
                      }
                      </div>
                      <div className='selectedTeamList'>
                        {
                        updatedFilterData && updatedFilterData.length !== 0
                          ? updatedFilterData.sort((a, b) => a?.sTeamName?.toString().localeCompare(b?.sTeamName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data1, index) => {
                            return (
                              <Suspense key={data1._id} fallback={<Loading />}>
                                <MyTeam {...props}
                                  key={data1._id}
                                  UserTeamChoice
                                  allTeams={updatedFilterData}
                                  index={index}
                                  leagueData={data}
                                  noOfJoin={noOfJoin}
                                  params={sMatchId}
                                  teamDetails={data1}
                                  upcoming
                                  viewOnly
                                />
                              </Suspense>
                            )
                          })
                          : ''
                      }
                      </div>
                      <Table className="m-0 bg-white promocode">
                        <thead>
                          <tr>
                            <th className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Total_Entry" /></th>
                            <th className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                              {currencyLogo}
                              {data && updatedFilterData && data.nPrice * updatedFilterData.length}
                              {' '}
                              (
                              {data && updatedFilterData && `${data.nPrice} X ${updatedFilterData.length}`}
                              {' '}
                              )
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(!data.bPrivateLeague) && (
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
                                      <Button className="ms-2" color='link' onClick={clearPromo}><img src={close} /></Button>
                                    </div>
                                    )
                                  : (
                                    <Button className='p-0 d-flex align-items-center' color='link' onClick={() => getPromocodeList()}>
                                      <h3 className='promocode-text m-0'><FormattedMessage id="Apply_Promocode" /></h3>
                                      <img className={classNames({ 'ms-1': true, 'apply-promo-arrow': document.dir === 'rtl' })} src={rightGreenArrow} />
                                    </Button>
                                    )}
                              </td>
                            </tr>
                            {/* <tr>
                          <td colSpan='2' className='green'>
                            <FormGroup className="c-input mt-2 mb-0">
                              <Input onClick={() => getPromocodeList()} type="text" className={classNames({ 'hash-contain': finalPromocode }) } id="Promocode" value={finalPromocode} autoComplete='off' required onChange={(e) => setPromoData(e.target.value)} />
                              <Label className="no-change label m-0" for="Promocode"><FormattedMessage id="Promocode" /></Label>
                              {applied && finalPromocode
                                ? <button className="i-icon" onClick={clearPromo}>Remove</button>
                                : <button className="i-icon" onClick={() => applePromoCode(promoData)}><FormattedMessage id="Apply" /></button>}
                            </FormGroup>
                          </td>
                        </tr> */}
                            {finalPromocode && (
                            <tr>
                              <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'} ><FormattedMessage id="Discount" /></td>
                              <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'} >
                                {currencyLogo}
                                {discount}
                              </td>
                            </tr>
                            )}
                          </Fragment>
                          )}
                          <tr>
                            <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'} ><FormattedMessage id="From_wallet" /></td>
                            <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'} >
                              {currencyLogo}
                              {fromWallet}
                            </td>
                          </tr>
                          {fromBonus > 0 && (
                          <tr>
                            <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'} ><FormattedMessage id="From_bonus" /></td>
                            <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'} >
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
                    <CardFooter className='p-0 border-0 bg-trnsparent m-0 d-flex justify-content-between'>
                      <Button className="w-100"
                        color='primary-two'
                        disabled={userTeams && userTeams.length === 0}
                        onClick={() => LeagueJoin(userTeams)}
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
                )
              : ''
        }
        {PromoCodes
          ? (
            <>
              <div className="s-team-bg" onClick={() => setPromoCodes(false)} />
              <Card className="filter-card show select-team promo-card">
                <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                  <button><FormattedMessage id="Select_Promocode" /></button>
                  <button onClick={() => {
                    setPromoCodes(false)
                    setModalMessage2(true)
                  }}
                  >
                    <img src={close} />
                  </button>
                </CardHeader>
                <CardBody className='p-10'>
                  {promocodeLoading && <PromocodeLoading />}
                  <div className="p-title-2"><FormattedMessage id="Promocodes_For_You" /></div>
                  {matchPromoCodeList !== {} && matchPromoCodeList && matchPromoCodeList.length > 0
                    ? matchPromoCodeList.map(matchPromo => {
                      return (
                        <div key={matchPromo._id} className="d-flex align-items-center justify-content-between promo-box">
                          <div className={document.dir === 'rtl' ? 'text-end' : ''}>
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
      </Fragment>
    </>
  )
}

League.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      sportsType: PropTypes.string
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func
  }),
  data: PropTypes.shape({
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
  applyPromocodeData: PropTypes.shape({
    nDiscount: PropTypes.string,
    sCode: PropTypes.string
  }),
  userInfo: PropTypes.shape({
    nCurrentTotalBalance: PropTypes.number,
    nCurrentBonus: PropTypes.number,
    nBonusUtil: PropTypes.number,
    nPrice: PropTypes.number
  }),
  home: PropTypes.bool,
  joinContest: PropTypes.func,
  firstPrize: PropTypes.string,
  firstRankType: PropTypes.string,
  lastPrize: PropTypes.string,
  MatchLeagueId: PropTypes.string,
  amountData: PropTypes.object,
  contestList: PropTypes.object,
  participated: PropTypes.bool,
  teamList: PropTypes.shape([{
    iMatchId: PropTypes.string
  }]),
  matchType: PropTypes.string,
  activeTab: PropTypes.string,
  contestJoinList: PropTypes.array,
  joinDetails: PropTypes.object,
  insideleagueDetailsPage: PropTypes.bool,
  toggleMessage: PropTypes.func,
  applyPromo: PropTypes.func,
  onGetUserProfile: PropTypes.func,
  modalMessage: PropTypes.string,
  setModalMessage: PropTypes.func,
  joined: PropTypes.bool,
  getMyTeamList: PropTypes.func,
  onGetPromocodeList: PropTypes.func,
  loading: PropTypes.bool,
  promocodeLoading: PropTypes.bool,
  appliedPromocode: PropTypes.bool,
  upComing: PropTypes.bool,
  showInformation: PropTypes.bool,
  matchID: PropTypes.string,
  currencyLogo: PropTypes.string,
  matchPromoCodeList: PropTypes.shape([{
    sCode: PropTypes.string,
    sInfo: PropTypes.string,
    _id: PropTypes.string
  }]),
  tab: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }),
  homePage: PropTypes.string,
  setLoading: PropTypes.func,
  getMatchPlayersFunc: PropTypes.func,
  token: PropTypes.string
}

export default JoinContest(League)
