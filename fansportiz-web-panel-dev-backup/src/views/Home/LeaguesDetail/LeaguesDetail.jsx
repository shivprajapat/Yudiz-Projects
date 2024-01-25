import React, { useState, Fragment, useEffect, useRef } from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, Table, Alert, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { isUpperCase, maxValue } from '../../../utils/helper'
import League from '../../Home/components/League'
import { getRandomColor, createImageFromInitials } from '../components/LetterImage'
import SkeletonLeague from '../../../component/SkeletonLeague'
import SkeletonTable from '../../../component/SkeletonTable'
import ContestDetails from '../../../HOC/SportsLeagueList/ContestDetails'
import MyTeam from '../components/MyTeam'
import Cash from '../../../assests/images/cash.svg'
import Bonus from '../../../assests/images/Bonus.svg'
import close from '../../../assests/images/close.svg'
import prizebreakupTrophy from '../../../assests/images/prizebreakupTrophy.svg'
import noDataTrophy from '../../../assests/images/noDataTrophy.svg'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const classNames = require('classnames')

function LeaguesDetailPage (props) {
  const {
    activeTab,
    onTabChange,
    paymentSlide, setPaymentSlide,
    onGetUserProfile,
    loading,
    teamList,
    contestJoinList,
    allLeaderBoardList,
    myTeamsLeaderBoardList,
    matchLeagueDetails,
    leaderboardLoading,
    setSwitchTeamModal,
    switchTeamModal,
    onSwitchTeam,
    userInfo,
    resjoinMessage,
    resStatus,
    switchTeamSuccess,
    otherTeamJoinList,
    message,
    setOffset,
    currencyLogo,
    teamPlayerList,
    onFetchMatchPlayer,
    joinDetails
  } = props
  const [userTeamId, setUserTeamId] = useState('')
  const [switchAlert, setSwitchAlert] = useState(false)
  const [userLeagueId, setUserLeagueId] = useState('')
  const [alertMessage, setMessage] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [poolPrize, setPoolPrize] = useState('')
  const [SwitchTeamList, setSwitchTeamList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [activeState, setActiveState] = useQueryState('activePage', 2)
  const [UpdatedTeamList, setUpdatedTeamList] = useState([])
  const [alertShawing, setAlertShawing] = useState(false)
  const [limit] = React.useState(50)
  const amountData = useSelector(state => state.league.amountData)
  const previousProps = useRef({
    amountData, allLeaderBoardList, resjoinMessage, resStatus, switchTeamSuccess, contestJoinList, teamList
  }).current

  const { sMediaUrl } = useGetUrl()

  const { sportsType, sMatchId, sLeagueId, activePage } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const navigate = useNavigate()

  const componentRef = useRef()
  function errorImage () {
    componentRef.current.src = Cash
  }
  useEffect(() => { // handle the response
    if (activePage) {
      if (activePage) {
        const active = activePage
        setActiveState(parseInt(active))
        onTabChange(parseInt(active))
      }
    }
    setSwitchTeamModal(false)
    if (!teamPlayerList) {
      onFetchMatchPlayer(sMatchId)
    }
    if (sportsType) {
      const sport = sportsType
      isUpperCase(sport) && navigate(`/upcoming-match/league-details/${sport.toLowerCase()}/${sMatchId}/${sLeagueId}`)
    }
  }, [])

  useEffect(() => { // handle the response
    if (previousProps.resjoinMessage !== resjoinMessage) {
      if (resjoinMessage && resStatus) {
        setAlertShawing(true)
        setMessage(resjoinMessage)
      }
    }
    return () => {
      previousProps.resjoinMessage = resjoinMessage
    }
  }, [resjoinMessage, resStatus])

  useEffect(() => { // handle the response
    if (previousProps.matchLeagueDetails !== matchLeagueDetails) {
      let fPrize = ''
      if (matchLeagueDetails && matchLeagueDetails._id) {
        if (matchLeagueDetails && matchLeagueDetails.bPoolPrize && matchLeagueDetails.nDeductPercent !== null && matchLeagueDetails.eMatchStatus === 'U' && (!matchLeagueDetails.bPrivateLeague)) {
          fPrize = parseFloat(Number(((matchLeagueDetails.nPrice * maxValue(matchLeagueDetails.nMin, matchLeagueDetails.nJoined) * 100) / (((matchLeagueDetails && matchLeagueDetails.nDeductPercent) || 0) + 100))).toFixed(1))
          setPoolPrize(fPrize)
        } else if (matchLeagueDetails && matchLeagueDetails.bPoolPrize && matchLeagueDetails.nDeductPercent !== null && matchLeagueDetails.eMatchStatus !== 'U' && (!matchLeagueDetails.bPrivateLeague)) {
          fPrize = parseFloat(Number(((matchLeagueDetails.nPrice * matchLeagueDetails.nJoined * 100) / (((matchLeagueDetails.nDeductPercent) || 0) + 100))).toFixed(1))
          setPoolPrize(fPrize)
        }
      }
    }
    return () => {
      previousProps.matchLeagueDetails = matchLeagueDetails
    }
  }, [matchLeagueDetails])

  // when user have unSoficient balance
  useEffect(() => {
    if (previousProps.amountData !== amountData) {
      if (amountData && amountData?.oValue?.nAmount > 0) {
        // const data = JSON.parse(localStorage.getItem('LeagueData'))
        navigate('/deposit',
          {
            state: {
              amountData: amountData?.oValue,
              message: 'Insufficient Balance'
            // joinData: {
            //   userTeams: data.userTeams, verifiedId: data.id, finalPromocode: data.finalPromocode
            // }
            }
          })
      }
    }
    return () => {
      previousProps.amountData = amountData
    }
  }, [amountData])

  useEffect(() => { // handle the response
    if (previousProps.switchTeamSuccess !== switchTeamSuccess) {
      if (switchTeamSuccess) {
        setSwitchAlert(true)
        setTimeout(() => {
          setSwitchAlert(false)
        }, 2500)
      }
    }
    return () => {
      previousProps.switchTeamSuccess = switchTeamSuccess
    }
  }, [switchTeamSuccess])

  function OtherTeamClick () {
    setAlertShawing(true)
    setMessage(<FormattedMessage id="Match_is_not_started" />)
  }
  function handleScroll (e) {
    const element = e.target
    if (((element.scrollHeight - element.scrollTop) === element.clientHeight) && activeTab === 2) {
      if (otherTeamJoinList && !(otherTeamJoinList.length < limit)) {
        setOffset(value => value + limit)
      }
    }
  }

  useEffect(() => {
    if (alertShawing) {
      setTimeout(() => {
        setAlertShawing(false)
      }, 2000)
    }
  }, [alertShawing])

  function onSwitchedTeam () {
    const contestData = joinDetails && joinDetails.iMatchLeagueId ? joinDetails : contestJoinList && contestJoinList.length !== 0 && matchLeagueDetails && contestJoinList.find(contest => contest && contest.iMatchLeagueId === matchLeagueDetails._id)
    if (contestData) {
      const FilterTeam = contestData && contestData.aUserTeams && teamList && teamList.length !== 0 && teamList.filter(team => contestData && contestData.aUserTeams && !contestData.aUserTeams.includes(team._id))
      if (FilterTeam && FilterTeam.length !== 0) {
        setUpdatedTeamList(FilterTeam)
        setSwitchTeamList(teamList)
        setSwitchTeamModal(true)
      } else {
        setAlertShawing(true)
        setMessage(<FormattedMessage id="No_Teams_Available_to_Switch" />)
      }
    } else {
      if (teamList && teamList.length !== 0) {
        setSwitchTeamModal(true)
      } else {
        setAlertShawing(true)
        setMessage(<FormattedMessage id="No_Teams_Available_to_Switch" />)
      }
    }
  }

  function onSwitch (myTeam) {
    onSwitchedTeam()
    setUserLeagueId(myTeam._id)
    setUserTeamId('')
  }

  useEffect(() => {
    if (paymentSlide) {
      onGetUserProfile()
    }
  }, [paymentSlide])

  return (
    <Fragment>
      {
        switchAlert
          ? (
            <Fragment>
              <Alert color="primary" isOpen={switchAlert}>{message}</Alert>
            </Fragment>
            )
          : ''
      }
      {
        alertShawing
          ? (
            <Fragment>
              <Alert color="primary" isOpen={alertShawing}>{alertMessage}</Alert>
            </Fragment>
            )
          : ''
      }
      <div className={`league-container no-tabs league-detail ${matchLeagueDetails && matchLeagueDetails.nCashbackAmount && matchLeagueDetails.nMinCashbackTeam ? 'no-Scroll' : ''}`}>
        <Card className="leagues-card border-0 bg-transparent my-3">
          {
            loading
              ? <SkeletonLeague leagueDetails />
              : <League contestJoinList={contestJoinList} data={matchLeagueDetails} matchType='upcoming' {...props} insideleagueDetailsPage showInformation/>
          }
        </Card>
        <Nav className="live-tabs bg-white two-tabs justify-content-between">
          <NavItem className="text-center">
            <NavLink className={classnames({ active: activeTab === 1 })}
              onClick={() => {
                onTabChange(1)
                setActiveState(parseInt(1))
              }}
            >
              <FormattedMessage id="Prize_breakup" />

            </NavLink>
          </NavItem>
          <NavItem className="text-center">
            <NavLink className={classnames({ active: activeTab === 2 })}
              onClick={() => {
                onTabChange(2)
                setActiveState(parseInt(2))
              }}
            >
              <FormattedMessage id="Leaderboard" />

            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}
          className={`league-detail-container bg-white ${(
          (matchLeagueDetails && matchLeagueDetails.aLeaguePrize && matchLeagueDetails.aLeaguePrize.length <= 1 && activeTab === 1)
          // (myTeamsLeaderBoardList && myTeamsLeaderBoardList.length === 0 && allLeaderBoardList && allLeaderBoardList.length === 0 && activeTab === 2)
          )
          ? 'inCenterContain'
          : ''} ${matchLeagueDetails && matchLeagueDetails.bPrivateLeague && 'isPrivate'} ${matchLeagueDetails?.nCashbackAmount > 0 ? 'cashback-include' : ''}`}
          onScroll={handleScroll}
        >
          <TabPane tabId={1}>
            {
              matchLeagueDetails && matchLeagueDetails.aLeaguePrize && matchLeagueDetails.aLeaguePrize.length <= 1
                ? (
                  <div className="no-team d-flex align-items-center justify-content-center">
                    <div className="">
                      <h6 className="m-3">
                        <span className='textt-black'>
                          <FormattedMessage id="Rank">{txt => txt}</FormattedMessage>
                          {' '}
                          {matchLeagueDetails && matchLeagueDetails.aLeaguePrize[0] && matchLeagueDetails.aLeaguePrize[0].nRankFrom ? matchLeagueDetails.aLeaguePrize[0].nRankFrom : '1'}
                          {' '}
                          -
                          {' '}
                          {matchLeagueDetails && matchLeagueDetails.aLeaguePrize[0] && matchLeagueDetails.aLeaguePrize[0].nRankTo ? matchLeagueDetails.aLeaguePrize[0].nRankTo : <FormattedMessage id="Ten" />}
                          {' '}
                        </span>
                      </h6>
                      {
                      matchLeagueDetails && matchLeagueDetails.aLeaguePrize[0] && matchLeagueDetails.aLeaguePrize[0].eRankType === 'E'
                        ? <img ref={componentRef} alt="" className='me-3 image' onError={errorImage} src={matchLeagueDetails && matchLeagueDetails.aLeaguePrize[0].eRankType === 'E' && matchLeagueDetails.aLeaguePrize[0].sImage ? sMediaUrl + matchLeagueDetails.aLeaguePrize[0].sImage : matchLeagueDetails && matchLeagueDetails.aLeaguePrize[0].eRankType === 'R' ? Cash : Bonus} />
                        : <img src={prizebreakupTrophy} />
                    }
                      <h6 className="mt-3 mb-1">
                        <FormattedMessage id="Wins" />
                        {' '}
                        <span className='textt-black'>
                          {/* {matchLeagueDetails && matchLeagueDetails.aLeaguePrize[0] && (matchLeagueDetails.aLeaguePrize[0].eRankType === 'E' ? ` ${matchLeagueDetails.aLeaguePrize[0].sInfo}` : ` ${matchLeagueDetails && matchLeagueDetails.bPoolPrize && matchLeagueDetails.nDeductPercent !== null ? matchLeagueDetails.aLeaguePrize[0] && matchLeagueDetails.aLeaguePrize[0].nPrize && `${Math.floor(Number(((matchLeagueDetails.aLeaguePrize[0].nPrize * poolPrize) / 100)))}` : matchLeagueDetails.aLeaguePrize[0].nPrize}`)} */}
                          <b>
                            {currencyLogo}
                            {matchLeagueDetails && matchLeagueDetails.aLeaguePrize[0] && (matchLeagueDetails.aLeaguePrize[0].eRankType === 'E' ? matchLeagueDetails.aLeaguePrize[0].sInfo : matchLeagueDetails.aLeaguePrize[0].nPrize)}
                            {
                          matchLeagueDetails && matchLeagueDetails.aLeaguePrize[0].eRankType === 'B' && (
                            <span className='light-gray'> Bonus</span>
                          )
                        }
                          </b>
                        </span>
                      </h6>

                    </div>
                  </div>
                  )
                : (
                  <Table className="m-0 player-list player-list2 price-table bg-white">
                    <thead>
                      <tr>
                        <td><FormattedMessage id="Prize" /></td>
                        <td><FormattedMessage id="Rank" /></td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        loading
                          ? (
                            <SkeletonTable />
                            )
                          : (
                            <Fragment>
                              {
                                matchLeagueDetails && matchLeagueDetails.aLeaguePrize && matchLeagueDetails.aLeaguePrize.sort((a, b) => a.nRankFrom > b.nRankFrom ? 1 : -1).map(data => {
                                  return (
                                    <tr key={data._id}>
                                      <td>
                                        <div className="m-0 d-flex align-items-center">
                                          <img className='m-0 p-img eImage flex-shrink-0' src={data.eRankType === 'E' && data.sImage ? sMediaUrl + data.sImage : data.eRankType === 'B' ? Bonus : Cash } />
                                          {
                                              data && data.eRankType === 'E'
                                                ? (
                                                  <span className={classNames('textt-black', { 'ms-2': document.dir !== 'rtl', 'me-2': document.dir === 'rtl' })}>
                                                    {' '}
                                                    {data && data.sInfo ? data.sInfo : ''}
                                                    {' '}
                                                  </span>
                                                  )
                                                : (
                                                  <Fragment>
                                                    <span className={classNames('textt-black', { 'ms-2': document.dir !== 'rtl', 'me-2': document.dir === 'rtl' })}>
                                                      {currencyLogo}
                                                      {' '}
                                                      {data && data.nPrize ? data.nPrize : 0}
                                                      {
                                                      data && data.eRankType === 'B' ? ' Bonus' : data.eRankType === 'R' ? ' Cash' : ''
                                                    }
                                                      {/* {currencyLogo} {matchLeagueDetails && matchLeagueDetails.bPoolPrize && matchLeagueDetails.nDeductPercent !== null && matchLeagueDetails.eMatchStatus === 'U' && (!matchLeagueDetails.bPrivateLeague)
                                                      ? data && data.nPrize && `${parseFloat(Number(((data.nPrize * poolPrize) / 100))).toFixed(1)}`
                                                      : matchLeagueDetails && matchLeagueDetails.bPoolPrize && matchLeagueDetails.nDeductPercent !== null && matchLeagueDetails.eMatchStatus !== 'U' && (!matchLeagueDetails.bPrivateLeague)
                                                        ? `${parseFloat(Number(((data.nPrize * poolPrize) / 100))).toFixed(1)}`
                                                        : matchLeagueDetails && matchLeagueDetails.bPoolPrize && matchLeagueDetails.bPrivateLeague
                                                          ? `${((data.nPrize * matchLeagueDetails.nTotalPayout) / 100).toFixed(2)}`
                                                          : data && data.nPrize ? data.nPrize : 0}{
                                                      data && data.eRankType === 'B' ? ' Bonus' : ''
                                                    } */}
                                                    </span>
                                                  </Fragment>
                                                  )
                                            }
                                        </div>
                                      </td>
                                      <td dir='ltr'>
                                        <b>#</b>
                                        <span className='textt-black'>{data && data.nRankFrom && data.nRankTo && data.nRankFrom === data.nRankTo ? `${data.nRankFrom}` : `${data.nRankFrom} - ${data.nRankTo}`}</span>
                                      </td>
                                    </tr>
                                  )
                                })
                              }
                            </Fragment>
                            )
                      }
                    </tbody>
                  </Table>
                  )
            }
          </TabPane>
          <TabPane className={`${activeTab === 2 ? 'full-width' : ''}`} tabId={2}>
            <Table className="bg-white player-list price-table" id='leaderboard'>
              {
                leaderboardLoading
                  ? (
                    <SkeletonTable />
                    )
                  : (
                    <Fragment>
                      {
                        myTeamsLeaderBoardList && myTeamsLeaderBoardList.length >= 0 && allLeaderBoardList && allLeaderBoardList.length >= 0
                          ? (
                            <Fragment>
                              <thead>
                                <tr>
                                  <td colSpan="2">
                                    <FormattedMessage id="All_Teams" />
                                    {' '}
                                    (
                                    {matchLeagueDetails && matchLeagueDetails?.nJoined}
                                    )
                                  </td>
                                  <td colSpan="2"><FormattedMessage id="Action" /></td>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  myTeamsLeaderBoardList && myTeamsLeaderBoardList.length !== 0 && myTeamsLeaderBoardList.map((myTeam, index) => {
                                    return (
                                      <tr key={index} style={{ backgroundColor: 'rgb(238 246 255)' }}>
                                        <td>
                                          <div className="l-img m-0">
                                            <img alt={myTeam && myTeam.sUserName} src={myTeam && myTeam.sProPic && sMediaUrl ? `${sMediaUrl}thumb/${myTeam.sProPic}` : createImageFromInitials(500, myTeam.sUserName, getRandomColor())} />
                                          </div>
                                        </td>
                                        <td onClick={() => navigate(homePage ? `/team-preview/${(sportsType).toLowerCase()}/${sMatchId}/${sLeagueId}/${myTeam.iUserTeamId}/${index}?homePage=yes` : `/team-preview/${(sportsType).toLowerCase()}/${sMatchId}/${sLeagueId}/${myTeam.iUserTeamId}/${index}`,
                                          {
                                            state: {
                                              allUserLeagues: myTeamsLeaderBoardList?.length
                                            }
                                          })}
                                        >
                                          {myTeam && myTeam.sUserName}
                                          {' '}
                                          (
                                          {myTeam && myTeam.sTeamName}
                                          )

                                        </td>
                                        <td className='switch-class' onClick={() => onSwitch(myTeam)}><FormattedMessage id="Switch" /></td>
                                      </tr>
                                    )
                                  })
                                }
                                {
                                  allLeaderBoardList && allLeaderBoardList.length !== 0 && allLeaderBoardList.map((allOtherTeam, index) => {
                                    return (
                                      <tr key={index} onClick={OtherTeamClick}>
                                        <td>
                                          <div className="l-img m-0">
                                            <img alt={allOtherTeam && allOtherTeam.sTeamName} src={allOtherTeam && allOtherTeam.sProPic && sMediaUrl ? `${sMediaUrl}thumb/${allOtherTeam.sProPic}` : createImageFromInitials(500, allOtherTeam.sUserName, getRandomColor())} />
                                          </div>
                                        </td>
                                        <td>
                                          {allOtherTeam && allOtherTeam.sUserName}
                                          {' '}
                                          (
                                          {allOtherTeam && allOtherTeam.sTeamName}
                                          )
                                        </td>
                                        <td />
                                      </tr>
                                    )
                                  }
                                  )
                                }
                                {
                                  myTeamsLeaderBoardList && myTeamsLeaderBoardList.length === 0 && allLeaderBoardList && allLeaderBoardList.length === 0 && (
                                    <tr>
                                      <td className='border-bottom-none' colSpan='3'>
                                        <div className="no-team d-flex align-items-center justify-content-center">
                                          <div className="">
                                            <img src={noDataTrophy} />
                                            <h6 className="m-3"><FormattedMessage id="No_Player_Joined_Yet" /></h6>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </Fragment>
                            )
                          : (
                            <tr>
                              <td colSpan='3'>
                                <div className="no-team d-flex align-items-center justify-content-center">
                                  <div className="">
                                    <img src={noDataTrophy} />
                                    <h6 className="m-3"><FormattedMessage id="No_Player_Joined_Yet" /></h6>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            )
                      }
                    </Fragment>
                    )
              }
            </Table>
          </TabPane>
        </TabContent>
      </div>
      {
        switchTeamModal
          ? (
            <>
              <div className="s-team-bg" onClick={() => setSwitchTeamModal(false)} />
              <Card className="filter-card select-team promo-card">
                <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                  <button><FormattedMessage id="Select_Team" /></button>
                  <button onClick={() => { setSwitchTeamModal(false) }} ><img src={close} /></button>
                </CardHeader>
                <CardBody className="p-0">
                  {(
                  SwitchTeamList && SwitchTeamList.length !== 0 && SwitchTeamList.sort((a, b) => a.sName > b.sName ? 1 : -1).map((data, index) => {
                    return (
                      <div key={data._id} className='d-flex' >
                        <MyTeam {...props}
                          UserTeamChoice
                          allTeams={teamList}
                          disabledRadio={UpdatedTeamList?.find((item) => item._id === data._id)?._id}
                          disabledRadioFlag={UpdatedTeamList?.length !== 0}
                          index={index}
                          join
                          params={sMatchId}
                          setUserTeamId={(Id) => setUserTeamId(Id)}
                          teamDetails={data}
                          teamId={data._id}
                          upcoming
                          userTeamId={userTeamId}
                        />
                      </div>
                    )
                  })
                )
                }
                </CardBody>
                <CardFooter className='p-0 border-0 bg-trnsparent m-0 d-flex justify-content-between'>
                  <Button className="w-100" color='primary' disabled={!userTeamId} onClick={() => onSwitchTeam(userLeagueId, userTeamId)} type="submit"><FormattedMessage id="Switch" /></Button>
                </CardFooter>
              </Card>
            </>
            )
          : ''
      }
      {paymentSlide
        ? (
          <>
            <div className="s-team-bg" onClick={() => setPaymentSlide(false)} />
            <Card className={classNames('filter-card', { show: paymentSlide })}>
              <CardHeader className='d-flex align-items-center justify-content-between'>
                <button onClick={() => { setPaymentSlide(false) }}><FormattedMessage id='Wallet_Details' /></button>
                <button className='red-close-btn' onClick={() => setPaymentSlide(false)}><FormattedMessage id='Close' /></button>
              </CardHeader>
              <CardBody className='payment-box'>

                <Table className="m-0 bg-white payment">
                  <thead>
                    <tr className='text-center'>
                      {' '}
                      <th colSpan='2'><FormattedMessage id="Total_Balance" /></th>
                      {' '}
                    </tr>
                    <tr className='text-center'>
                      {' '}
                      <th colSpan='2'>
                        {currencyLogo}
                        {userInfo && userInfo.nCurrentTotalBalance ? userInfo && userInfo.nCurrentTotalBalance : 0}
                        {' '}

                      </th>
                      {' '}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Deposit_Balance" /></td>
                      <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                        {currencyLogo}
                        {userInfo && userInfo.nCurrentDepositBalance ? userInfo && userInfo.nCurrentDepositBalance : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Win_Balance" /></td>
                      <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                        {currencyLogo}
                        {userInfo && userInfo.nCurrentWinningBalance ? userInfo && userInfo.nCurrentWinningBalance : 0}
                      </td>
                    </tr>
                    <tr>
                      <td className={document.dir === 'rtl' ? 'text-end' : 'text-start'}><FormattedMessage id="Cash_Bonus" /></td>
                      <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}>
                        {currencyLogo}
                        {userInfo && userInfo.nCurrentBonus ? userInfo && userInfo.nCurrentBonus : 0}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter className='p-0 border-0 bg-white'>
                <Button className='w-100' color='primary-two' onClick={() => navigate('/deposit')}><FormattedMessage id="Add_Cash" /></Button>
              </CardFooter>
            </Card>
          </>
          )
        : ''
        }
    </Fragment >
  )
}

LeaguesDetailPage.propTypes = {
  mainIndex: PropTypes.number,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      id2: PropTypes.string,
      sportsType: PropTypes.string
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  location: PropTypes.shape({
    search: PropTypes.string
  }),
  contestJoinList: PropTypes.array,
  teamList: PropTypes.array,
  SwitchTeamList: PropTypes.array,
  otherTeamJoinList: PropTypes.array,
  onSwitchTeam: PropTypes.func,
  loading: PropTypes.bool,
  leaderboardLoading: PropTypes.bool,
  alertShawing: PropTypes.bool,
  userInfo: PropTypes.object,
  joinDetails: PropTypes.object,
  toggleMessage: PropTypes.string,
  modalMessage: PropTypes.string,
  setModalMessage: PropTypes.func,
  onTabChange: PropTypes.func,
  activeTab: PropTypes.string,
  allLeaderBoardList: PropTypes.array,
  myTeamsLeaderBoardList: PropTypes.array,
  setAlertShawing: PropTypes.func,
  switchTeam: PropTypes.func,
  matchLeagueDetails: PropTypes.shape({
    aLeaguePrize: PropTypes.shape([
      { eRankType: PropTypes.string }
    ]),
    _id: PropTypes.string,
    bPrivateLeague: PropTypes.bool,
    nMinCashbackTeam: PropTypes.Number,
    nCashbackAmount: PropTypes.Number,
    nJoined: PropTypes.Number,
    nPrice: PropTypes.Number,
    nMin: PropTypes.Number,
    bPoolPrize: PropTypes.bool,
    nDeductPercent: PropTypes.Number,
    nTotalPayout: PropTypes.number,
    eMatchStatus: PropTypes.string
  }),
  setSwitchTeamModal: PropTypes.func,
  switchTeamModal: PropTypes.bool,
  resStatus: PropTypes.bool,
  paymentSlide: PropTypes.bool,
  setPaymentSlide: PropTypes.func,
  onGetUserProfile: PropTypes.func,
  resjoinMessage: PropTypes.string,
  message: PropTypes.string,
  switchTeamLoader: PropTypes.bool,
  switchTeamSuccess: PropTypes.bool,
  switchAlert: PropTypes.bool,
  teamPlayerList: PropTypes.array,
  onFetchMatchPlayer: PropTypes.func,
  currencyLogo: PropTypes.string,
  setOffset: PropTypes.func
}

export default ContestDetails(LeaguesDetailPage)
