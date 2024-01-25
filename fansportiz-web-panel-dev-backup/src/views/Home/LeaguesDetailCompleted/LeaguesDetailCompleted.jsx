import React, { useState, Fragment, useEffect, useRef } from 'react'
import { Button, Nav, NavItem, NavLink, TabContent, Table, TabPane, Card, CardBody, CardHeader, CardFooter, Alert } from 'reactstrap'
import classnames from 'classnames'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Scorecard from '../components/Scorecard'
import { isUpperCase } from '../../../utils/helper'
import PlayerStats from '../components/PlayerStats'
// import PlayerInfo from '../components/PlayerInfo'
import PlayerInfo2 from '../components/PlayerInfo2'
import PlayerImage from '../../../assests/images/PlayerImage.png'
import TrophyImg from '../../../assests/images/trophy.svg'
import Cash from '../../../assests/images/cash.svg'
import Bonus from '../../../assests/images/Bonus.svg'
import { getRandomColor, createImageFromInitials } from '../components/LetterImage'
import SkeletonTable from '../../../component/SkeletonTable'
import LeagueCompletedComponent from '../../../HOC/SportsLeagueList/LeagueCompleted'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import arrow from '../../../assests/images/right-arrow-yellow.svg'
import fantasyIcon from '../../../assests/images/Dream_Team_Icon.svg'
import useGetUrl from '../../../api/url/queries/useGetUrl'

function LeaguesDetailCompletedPage (props) {
  const {
    matchDetails,
    firstTeam,
    secondTeam,
    addCompare,
    loading,
    clearTeamSelected,
    selectedTeamCompare,
    // playerScorePoints,
    matchPlayerList,
    leagueDetails,
    activeTab,
    toggle,
    allLeaderBoardList,
    setLoading,
    myTeamsLeaderBoardList,
    myAllTeamPagination,
    uniquePlayerList,
    setActiveState,
    // url,
    otherTeamJoinList,
    currencyLogo,
    bCached,
    bFullResponse,
    getMyTeamLeaderBoardListFunc,
    loadingScorecard
  } = props
  const [players, setPlayers] = useState([])
  // const [teamView, setTeamView] = useState(0)
  const [value, setValue] = useState(0)
  const [playerId, setPlayerId] = useState('')
  const [userTeamId, setUserTeamId] = useState('')
  const [data, setData] = useState('')
  const [loadingJoined, setJoinedLeague] = useState(true)
  const [refresh, setRefresh] = useState(true)
  const [playerInfo, setPlayerInfo] = useState(false)
  const [downloadRecord, setDownloadRecord] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [selectedTeamCompareOn, setSelectedTeamCompareOn] = useState(false)
  const [AllLeaderBoardList, setAllLeaderBoardList] = React.useState([])
  const [myTeams, setMyTeams] = React.useState([])
  const [limit] = React.useState(50)
  const myTeamIds = myTeams && myTeams.map(data => data._id)
  const allUserLeagues = [...myTeams.sort((a, b) => b.nTotalPoints - a.nTotalPoints), ...AllLeaderBoardList.sort((a, b) => b.nTotalPoints - a.nTotalPoints)]
  const previousProps = useRef({
    activeTab, allLeaderBoardList, playerInfo
  }).current

  const { sportsType, sMatchId, sLeagueId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { sMediaUrl } = useGetUrl()

  useEffect(() => {
    if (sportsType) {
      const sport = sportsType
      isUpperCase(sport) && navigate(`/live-completed-match/league-details/${sport.toLowerCase()}/${sMatchId}/${sLeagueId}`)
    }
  }, [])

  useEffect(() => {
    if (previousProps.activeTab !== activeTab) {
      if (activeTab) {
        setValue(0)
        if (activeTab === '2') {
          setRefresh(true)
          setJoinedLeague(true)
        } else {
          setAllLeaderBoardList([])
          setRefresh(false)
        }
      }
    }
    return () => {
      previousProps.activeTab = activeTab
    }
  }, [activeTab])

  // useEffect(() => {
  //   if (leagueDetails) {
  //     if (leagueDetails && leagueDetails.aLeaguePrize && leagueDetails.aLeaguePrize.length !== 0) {
  //       setLoading1(false)
  //     }
  //     let fPrize = ''
  //     if (leagueDetails && leagueDetails._id) {
  //       if (leagueDetails && leagueDetails.bPoolPrize && leagueDetails.nDeductPercent !== null && (!leagueDetails.bPrivateLeague)) {
  //         fPrize = Math.floor(Number(((leagueDetails.nPrice * leagueDetails.nJoined * 100) / (((leagueDetails && leagueDetails.nDeductPercent) || 0) + 100))))
  //         setPoolPrize(fPrize)
  //       }
  //     }
  //   }
  // }, [leagueDetails])

  function handleScroll (e) {
    const element = e.target
    if (((element.scrollHeight - element.scrollTop) <= (element.clientHeight + 150)) && activeTab === '2') {
      if (otherTeamJoinList && !(otherTeamJoinList.length < limit)) {
        setValue(value => value + limit)
      }
    }
  }
  useEffect(() => {
    if (selectedTeamCompare && selectedTeamCompare.length === 2) {
      navigate(`/team-compare/${(sportsType).toLowerCase()}/${firstTeam._id}/${secondTeam._id}`, { state: { path: location.pathname, firstRank: firstTeam.nRank, secondRank: secondTeam.nRank } })
      setAllLeaderBoardList([])
    }
  }, [selectedTeamCompare])

  useEffect(() => {
    if (previousProps.value !== value) {
      if (value) {
        myAllTeamPagination(limit, value)
        getMyTeamLeaderBoardListFunc()
      }
    }
    return () => {
      previousProps.value = value
    }
  }, [value])

  useEffect(() => {
    if ((!(_.isEqual(previousProps.allLeaderBoardList, allLeaderBoardList))) || (refresh && allLeaderBoardList?.length >= 1)) {
      if (allLeaderBoardList && allLeaderBoardList.length !== 0 && bFullResponse) {
        setAllLeaderBoardList(() => [...allLeaderBoardList])
        setJoinedLeague(false)
      } else if (allLeaderBoardList && allLeaderBoardList.length !== 0) {
        setAllLeaderBoardList(AllLeaderBoardList => [...AllLeaderBoardList, ...allLeaderBoardList])
        setJoinedLeague(false)
      }
    }
    return () => {
      previousProps.allLeaderBoardList = allLeaderBoardList
    }
  }, [allLeaderBoardList])

  useEffect(() => {
    if (leagueDetails && leagueDetails.sFairPlay) {
      setData(leagueDetails.sFairPlay)
    }
  }, [leagueDetails])

  useEffect(() => {
    if (myTeamsLeaderBoardList && myTeamsLeaderBoardList.length >= 0) {
      setMyTeams(myTeamsLeaderBoardList)
      setJoinedLeague(false)
    }
  }, [myTeamsLeaderBoardList])
  const componentRef = useRef()
  function errorImage () {
    componentRef.current.src = Cash
  }

  function goToDreamTeam () {
    navigate(`/dream-team-preview/${sportsType}/${matchDetails._id}`)
  }

  return (
    <>
      {alert && alertMessage && alertMessage.length ? <Alert color="primary" isOpen={alert}>{alertMessage}</Alert> : ''}
      {matchDetails && matchDetails.bScorecardShow
        ? (
          <Fragment>
            <Link to={`/web-score-card/${sMatchId}`}>
              <h4 className='scorecard-title d-flex justify-content-center'>
                <FormattedMessage id="Scorecard" />
                <img src={arrow} />
              </h4>
            </Link>
          </Fragment>
          )
        : <h4 className='score-card-title'><FormattedMessage id="Scorecard" /></h4>
        }
      <Scorecard loadingScorecard={loadingScorecard} matchDetails={matchDetails} matchSport={matchDetails?.eCategory} url={sMediaUrl} />
      <Nav className="d-flex live-tabs justify-content-around bg-white b-bottom">
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              toggle('1')
              setActiveState('1')
            }}
          >
            <FormattedMessage id="Prize_breakup" />

          </NavLink>
        </NavItem>
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              toggle('2')
              setActiveState('2')
            }}
          >
            <FormattedMessage id="Leaderboard" />

          </NavLink>
        </NavItem>
        <NavItem className="text-center">
          <NavLink className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              toggle('3')
              setActiveState('3')
            }}
          >
            <FormattedMessage id="Player_stats" />

          </NavLink>
        </NavItem>
      </Nav>
      <div className={`league-container league-completed ${((AllLeaderBoardList && AllLeaderBoardList.length === 0 && myTeams && myTeams.length === 0 && activeTab === 2)) ? 'inCenterContain' : ''}`} onScroll={handleScroll}>
        <TabContent activeTab={activeTab} >
          <TabPane tabId="1">
            {
              leagueDetails && leagueDetails.aLeaguePrize && leagueDetails.aLeaguePrize.length <= 1
                ? (
                  <div className="no-team d-flex align-items-center justify-content-center">
                    <div className="">
                      <h6 className="m-3">
                        <span>
                          <FormattedMessage id="Rank" />
                          {' '}
                          {leagueDetails && leagueDetails.aLeaguePrize[0] && leagueDetails.aLeaguePrize[0].nRankFrom ? leagueDetails.aLeaguePrize[0].nRankFrom : '1'}
                          {' '}
                          -
                          {' '}
                          {leagueDetails && leagueDetails.aLeaguePrize[0] && leagueDetails.aLeaguePrize[0].nRankTo ? leagueDetails.aLeaguePrize[0].nRankTo : <FormattedMessage id="Ten" />}
                          {' '}
                        </span>
                      </h6>
                      {
                    leagueDetails && leagueDetails.aLeaguePrize[0] && leagueDetails.aLeaguePrize[0].eRankType === 'E'
                      ? <img ref={componentRef} alt="" className='me-3 image' onError={errorImage} src={leagueDetails && leagueDetails.aLeaguePrize[0].eRankType === 'E' && leagueDetails.aLeaguePrize[0].sImage ? sMediaUrl + leagueDetails.aLeaguePrize[0].sImage : leagueDetails && leagueDetails.aLeaguePrize[0].eRankType === 'R' ? Cash : Bonus} />
                      : <i className="icon-trophy yellow" />
                  }
                      <h6 className="mt-3 mb-1">
                        <FormattedMessage id="Wins" />
                        <span>
                          {/* {leagueDetails && leagueDetails.aLeaguePrize[0] && leagueDetails.aLeaguePrize[0].eRankType === 'E' ? ` ${leagueDetails.aLeaguePrize[0].sInfo}` : leagueDetails.aLeaguePrize[0].nPrize} */}
                          {leagueDetails && leagueDetails.aLeaguePrize[0] && leagueDetails.aLeaguePrize[0].eRankType === 'E' ? ` ${leagueDetails.aLeaguePrize[0].sInfo}` : leagueDetails.aLeaguePrize[0].nPrize}
                          {
                        leagueDetails && leagueDetails.aLeaguePrize[0].eRankType === 'B' && (
                          <span className='light-gray'>
                            {' '}
                            <FormattedMessage id='Bonus' />
                          </span>
                        )
                      }
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
                        <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'}><FormattedMessage id="Rank" /></td>
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? <SkeletonTable Lines={7} />
                        : leagueDetails && leagueDetails.aLeaguePrize && leagueDetails.aLeaguePrize.sort((a, b) => a.nRankFrom > b.nRankFrom ? 1 : -1).map(data => {
                          return (
                            <tr key={data._id}>
                              <td>
                                <div className="m-0 d-flex align-items-center">
                                  <div className='p-img inside-img'>
                                    <img alt="" src={data.eRankType === 'E' && data.sImage ? sMediaUrl + data.sImage : data.eRankType === 'R' ? Cash : Bonus} />
                                  </div>
                                  {
                                  data && data.eRankType === 'E'
                                    ? (
                                      <span className={`textt-black ${document.dir === 'rtl' ? 'me-2' : 'ms-2'}`}>
                                        {' '}
                                        {data && data.sInfo ? data.sInfo : ''}
                                        {' '}
                                      </span>
                                      )
                                    : (
                                      <Fragment>
                                        <span className={`textt-black ${document.dir === 'rtl' ? 'me-2' : 'ms-2'}`}>
                                          {/* {leagueDetails && leagueDetails.bPoolPrize && leagueDetails.nDeductPercent !== null && (!leagueDetails.bPrivateLeague)
                                          ? data && data.nPrize && `${parseFloat(Number(((data.nPrize * poolPrize) / 100)).toFixed(2))}`
                                          : (leagueDetails && leagueDetails.bPoolPrize && leagueDetails.bPrivateLeague)
                                              ? `${parseFloat(Number(((data.nPrize * leagueDetails.nTotalPayout) / 100)).toFixed(2))}`
                                              : data && data.nPrize
                                                ? data.nPrize
                                                : 0} */}
                                          {currencyLogo}
                                          {' '}
                                          {data && data.nPrize ? data.nPrize : 0}
                                        </span>
                                        <span className={`textt-black ${document.dir === 'rtl' ? 'me-2' : 'ms-2'}`}>
                                          {
                                          data && data.eRankType === 'B' ? <FormattedMessage id='Bonus' /> : <FormattedMessage id='Cash' />
                                        }
                                        </span>
                                      </Fragment>
                                      )
                                }
                                </div>
                              </td>
                              <td className={document.dir === 'rtl' ? 'text-start' : 'text-end'} dir='ltr'>
                                <span className={`textt-black ${document.dir === 'rtl' ? 'me-2' : 'ms-2'}`}>
                                  <b>
                                    #
                                    {' '}
                                  </b>
                                  {data && data.nRankFrom && data.nRankTo && data.nRankFrom === data.nRankTo ? `${data.nRankFrom}` : `${data.nRankFrom} - ${data.nRankTo}`}

                                </span>
                              </td>
                            </tr>
                          )
                        })
                    }
                    </tbody>
                  </Table>
                  )
            }
          </TabPane>
          <TabPane tabId="2">
            {alert && alertMessage && alertMessage.length ? <Alert color="primary" isOpen={alert}>{alertMessage}</Alert> : ''}
            <div className="team-com d-flex align-items-center justify-content-between">
              <p>
                {' '}
                <FormattedMessage id="Team_Comparison" />
              </p>
              <button className="bg-transparent">
                <i className="icon-compare" onClick={() => setSelectedTeamCompareOn(true)} title='Compare Team' />
                {
                  leagueDetails.sFairPlay && (
                    <i className="icon-down-arrow" onClick={() => setDownloadRecord(true)} title='Fair-Play' />
                  )
                }
                {' '}

              </button>
            </div>
            <Table
              className="bg-white
                  player-list
                  price-table
                  participated-playerlist
                  team-com-on
                  "
            >
              {
                loading || loadingJoined
                  ? (
                    <SkeletonTable Lines={7} />
                    )
                  : (
                    <Fragment>
                      <thead>
                        <tr>
                          <td>
                            <FormattedMessage id="All_Teams" />
                            {' '}
                            (
                            {(AllLeaderBoardList && myTeamsLeaderBoardList && AllLeaderBoardList.length + myTeamsLeaderBoardList.length)}
                            )
                          </td>
                          <td className={document.dir === 'rtl' ? 'text-center' : ''}><FormattedMessage id="Points" /></td>
                          <td><FormattedMessage id="Rank" /></td>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          allUserLeagues && allUserLeagues.length > 0 && allUserLeagues.map((team, index) => {
                            let finalRank, i
                            if (index >= 1 && bCached) {
                              for (i = index; i >= 1; i--) {
                                if (allUserLeagues[i - 1].nTotalPoints === team.nTotalPoints) {
                                  finalRank = allUserLeagues[i - 1].nRank
                                }
                              }
                            }
                            return (
                              <tr
                                key={index}
                                className={selectedTeamCompare.includes(team._id) && selectedTeamCompareOn ? 'selected' : ''}
                                onClick={() => {
                                  if (selectedTeamCompareOn) {
                                    addCompare(team)
                                  } else {
                                    navigate(`/team-preview/${(sportsType).toLowerCase()}/${sMatchId}/${sLeagueId}/${team.iUserTeamId}/${index}`,
                                      {
                                        state: { allUserLeagues: allUserLeagues?.length }
                                      })
                                    setUserTeamId(team.iUserTeamId)
                                    setLoading(true)
                                  }
                                }
                                }
                                style={{ backgroundColor: myTeamIds.includes(team._id) && '#EBFBFF' }}
                              >
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="l-img">
                                      <img alt="" src={team && team.sProPic ? sMediaUrl + 'thumb/' + team.sProPic : createImageFromInitials(500, team.sUserName, getRandomColor())} />
                                      {
                                        selectedTeamCompare.includes(team._id) && selectedTeamCompareOn &&
                                        <i className="icon-verified i-check text-success" />
                                      }
                                    </div>
                                    <div>
                                      <span className="p-name">{team && team.sUserName + ` (${team.sTeamName})`}</span>
                                      {
                                          matchDetails && (matchDetails.eStatus === 'CMP') &&
                                            (
                                              <Fragment>
                                                {
                                                  team && team.nPrice > 0 && team && !team?.nBonusWin > 0 && team && team.aExtraWin && team.aExtraWin.length === 0
                                                    ? (
                                                      <p className="won-txt">
                                                        {' '}
                                                        <img className='me-1' src={TrophyImg} />
                                                        <FormattedMessage id="Won" />
                                                        :
                                                        {' '}
                                                        {currencyLogo}
                                                        {' '}
                                                        {parseFloat(Number(team.nPrice).toFixed(2))}
                                                        {' '}
                                                      </p>
                                                      )
                                                    : team && !team.nPrice > 0 && team && team?.nBonusWin > 0 && team && team.aExtraWin && team.aExtraWin.length === 0
                                                      ? (
                                                        <p className="won-txt">
                                                          {' '}
                                                          <img className='me-1' src={TrophyImg} />
                                                          <FormattedMessage id="Won" />
                                                          :
                                                          {' '}
                                                          {currencyLogo}
                                                          {' '}
                                                          {parseFloat(Number(team.nBonusWin).toFixed(2))}
                                                          {' '}
                                                          <FormattedMessage id="Bonus" />
                                                          {' '}
                                                        </p>
                                                        )
                                                      : team && !team.nPrice > 0 && team && !team?.nBonusWin > 0 && team && team.aExtraWin && team.aExtraWin.length === 1
                                                        ? (
                                                          <p className="won-txt">
                                                            {' '}
                                                            <img className='me-1' src={TrophyImg} />
                                                            <FormattedMessage id="Won" />
                                                            :
                                                            {' '}
                                                            {team.aExtraWin[0]?.sInfo}
                                                            {' '}
                                                          </p>
                                                          )
                                                        : team && !team.nPrice > 0 && team && !team?.nBonusWin > 0 && team && team.aExtraWin && team.aExtraWin.length === 0
                                                          ? ''
                                                          : (
                                                            <Fragment>
                                                              {/* <Tooltip placement="top" isOpen={tooltipOpen} target="TooltipExample" toggle={toggleToolTip}>
                                                                {
                                                                  team && team.nPrice > 0 && (<span><FormattedMessage id="Won" /> {currencyLogo} {parseFloat(Number(team.nPrice).toFixed(2))}</span>)
                                                                }
                                                                {
                                                                  team && team.nBonusWin > 0 && (<Fragment>
                                                                    <br />
                                                                    <span><FormattedMessage id="Won" /> {currencyLogo} {parseFloat(Number(team.nBonusWin).toFixed(2))} <FormattedMessage id="Bonus" /></span>
                                                                  </Fragment>
                                                                  )
                                                                }
                                                                {
                                                                  team && team.aExtraWin && team.aExtraWin.length >= 1 && (
                                                                    <Fragment>
                                                                      <br />
                                                                      <span><FormattedMessage id="Won" /> {
                                                                        team.aExtraWin.map((data, index) => { return (`${data.sInfo}${(index > 1 || team.aExtraWin.length < index) ? ', ' : ''}`) })
                                                                      }</span>
                                                                    </Fragment>
                                                                  )
                                                                }
                                                              </Tooltip> */}
                                                              <p className="won-txt toolPTag" id="TooltipExample">
                                                                {' '}
                                                                <i className="icon-trophy" />
                                                                <FormattedMessage id="Won_Multiple_Prizes_GreaterthanSign" />
                                                                {' '}
                                                              </p>
                                                              <p className='toolShaw'>
                                                                {
                                                                  team && team.nPrice > 0 && (
                                                                  <span>
                                                                    <FormattedMessage id="Won" />
                                                                    {' '}
                                                                    {currencyLogo}
                                                                    {' '}
                                                                    {parseFloat(Number(team.nPrice).toFixed(2))}
                                                                  </span>
                                                                  )
                                                                }
                                                                {
                                                                  team && team.nBonusWin > 0 && (
                                                                  <Fragment>
                                                                    <br />
                                                                    <span>
                                                                      <FormattedMessage id="Won" />
                                                                      {' '}
                                                                      {currencyLogo}
                                                                      {' '}
                                                                      {parseFloat(Number(team.nBonusWin).toFixed(2))}
                                                                      {' '}
                                                                      <FormattedMessage id="Bonus" />
                                                                    </span>
                                                                  </Fragment>
                                                                  )
                                                                }
                                                                {
                                                                  team && team.aExtraWin && team.aExtraWin.length >= 1 && (
                                                                    <Fragment>
                                                                      <br />
                                                                      <span>
                                                                        <FormattedMessage id="Won" />
                                                                        {' '}
                                                                        {
                                                                        team.aExtraWin.map((data, index) => { return (`${data.sInfo}${(index > 1 || team.aExtraWin.length < index) ? ', ' : ''}`) })
                                                                      }

                                                                      </span>
                                                                    </Fragment>
                                                                  )
                                                                }
                                                              </p>
                                                            </Fragment>
                                                            )
                                                }
                                              </Fragment>
                                            )
                                      }
                                    </div>
                                  </div>
                                </td>
                                <td className={document.dir === 'rtl' ? 'text-center' : ''}>{team && team.nTotalPoints ? team.nTotalPoints : '0'}</td>
                                <td>{(finalRank && `#${finalRank}`) || (team && team.nRank ? `#${team.nRank}` : '-')}</td>
                              </tr>
                            )
                          })
                        }
                        {
                          // AllLeaderBoardList && AllLeaderBoardList.length > 0 && AllLeaderBoardList.map((allTeam, index) => {
                          //   let finalRank, i
                          //   if (index >= 1 && bCached && AllLeaderBoardList[index - 1].nTotalPoints === allTeam.nTotalPoints) {
                          //     for (i = index; i >= 1; i--) {
                          //       if (AllLeaderBoardList[i - 1].nTotalPoints === allTeam.nTotalPoints) {
                          //         finalRank = AllLeaderBoardList[i - 1].nRank
                          //       }
                          //     }
                          //   }
                          //   return (
                          //     <tr
                          //       className={selectedTeamCompare.includes(allTeam._id) && selectedTeamCompareOn ? 'selected' : ''}
                          //       onClick={() => {
                          //         if (selectedTeamCompareOn) {
                          //           addCompare(allTeam)
                          //         } else {
                          //           setPreviewCricket(true)
                          //           setUserTeamId(allTeam.iUserTeamId)
                          //           setSelectTeam([allTeam])
                          //           setLoading(true)
                          //         }
                          //       }
                          //       }
                          //       key={index}>
                          //       <td>
                          //         <div className="d-flex align-items-center">
                          //           <div className="p-img">
                          //             <img src={allTeam && allTeam.sProPic ? url + allTeam.sProPic : createImageFromInitials(500, allTeam.sUserName, getRandomColor())} alt="" />
                          //             {
                          //               selectedTeamCompare.includes(allTeam._id) && selectedTeamCompareOn &&
                          //               <i className="icon-verified i-check text-success"></i>
                          //             }
                          //           </div>
                          //           <div>
                          //             <span className="p-name">{allTeam && allTeam.sUserName + ` (${allTeam.sTeamName})`}</span>
                          //             {
                          //               matchDetails && (matchDetails.eStatus === 'CMP') && (
                          //                 <Fragment>
                          //                   {
                          //                     allTeam && allTeam.nPrice > 0 && allTeam && !allTeam?.nBonusWin > 0 && allTeam && allTeam.aExtraWin && allTeam.aExtraWin.length === 0
                          //                       ? (<p className="won-txt"> <i className="icon-trophy"></i><FormattedMessage id="Won" /> {currencyLogo} {parseFloat(Number(allTeam.nPrice).toFixed(2))} </p>)
                          //                       : allTeam && !allTeam.nPrice > 0 && allTeam && allTeam?.nBonusWin > 0 && allTeam && allTeam.aExtraWin && allTeam.aExtraWin.length === 0
                          //                         ? (<p className="won-txt"> <i className="icon-trophy"></i><FormattedMessage id="Won" /> {currencyLogo} {parseFloat(Number(allTeam.nBonusWin).toFixed(2))} <FormattedMessage id="Bonus" /> </p>)
                          //                         : allTeam && !allTeam.nPrice > 0 && allTeam && !allTeam?.nBonusWin > 0 && allTeam && allTeam.aExtraWin && allTeam.aExtraWin.length === 1
                          //                           ? (<p className="won-txt"> <i className="icon-trophy"></i><FormattedMessage id="Won" /> {allTeam.aExtraWin[0].sInfo} </p>)
                          //                           : allTeam && !allTeam.nPrice > 0 && allTeam && !allTeam?.nBonusWin > 0 && allTeam && allTeam.aExtraWin && allTeam.aExtraWin.length === 0
                          //                             ? ''
                          //                             : (
                          //                             <Fragment>
                          //                               {/* <Tooltip placement="top" isOpen={tooltipOpen2} target="TooltipExampleAllTeam" toggle={toggleToolTip2}>
                          //                                 {
                          //                                   allTeam && allTeam.nPrice > 0 && (<span><FormattedMessage id="Won" /> {currencyLogo} {parseFloat(Number(allTeam.nPrice).toFixed(2))}</span>)
                          //                                 }
                          //                                 {
                          //                                   allTeam && allTeam.nBonusWin > 0 && (
                          //                                   <Fragment>
                          //                                     <br /><span><FormattedMessage id="Won" /> {currencyLogo} {parseFloat(Number(allTeam.nBonusWin).toFixed(2))} <FormattedMessage id="Bonus" /></span>
                          //                                   </Fragment>)
                          //                                 }
                          //                                 {
                          //                                   allTeam && allTeam.aExtraWin && allTeam.aExtraWin.length >= 1 && (
                          //                                     <Fragment>
                          //                                       <br />
                          //                                       <span><FormattedMessage id="Won" /> {
                          //                                         allTeam.aExtraWin.map((data, index) => { return (`${data.sInfo}${(index > 1 || allTeam.aExtraWin.length < index) ? ', ' : ''}`) })
                          //                                       }</span>
                          //                                     </Fragment>
                          //                                   )
                          //                                 }
                          //                               </Tooltip> */}
                          //                               <p className="won-txt toolPTag" id='TooltipExampleAllTeam'><i className="icon-trophy"></i><FormattedMessage id="Won_Multiple_Prizes_GreaterthanSign" /> </p>
                          //                               <p className='toolShaw'>
                          //                                 {
                          //                                   allTeam && allTeam.nPrice > 0 && (<span><FormattedMessage id="Won" /> {currencyLogo} {parseFloat(Number(allTeam.nPrice).toFixed(2))}</span>)
                          //                                 }
                          //                                 {
                          //                                   allTeam && allTeam.nBonusWin > 0 && (
                          //                                   <Fragment>
                          //                                     <br /><span><FormattedMessage id="Won" /> {currencyLogo} {parseFloat(Number(allTeam.nBonusWin).toFixed(2))} <FormattedMessage id="Bonus" /></span>
                          //                                   </Fragment>)
                          //                                 }
                          //                                 {
                          //                                   allTeam && allTeam.aExtraWin && allTeam.aExtraWin.length >= 1 && (
                          //                                     <Fragment>
                          //                                       <br />
                          //                                       <span><FormattedMessage id="Won" /> {
                          //                                         allTeam.aExtraWin.map((data, index2) => { return (`${data.sInfo}${(index2 >= 1 && allTeam.aExtraWin.length !== index2 + 1) ? ', ' : ' '}`) })
                          //                                       }</span>
                          //                                     </Fragment>
                          //                                   )
                          //                                 }
                          //                               </p>
                          //                             </Fragment>
                          //                               )
                          //                   }
                          //                 </Fragment>
                          //               )
                          //             }
                          //           </div>
                          //         </div>
                          //       </td>
                          //       <td>{allTeam && allTeam.nTotalPoints ? allTeam.nTotalPoints : '0'}</td>
                          //       <td>{(finalRank && `#${finalRank}`) || (allTeam && allTeam.nRank ? `#${allTeam.nRank}` : '-')}</td>
                          //     </tr>
                          //   )
                          // })
                        }
                        {allUserLeagues && allUserLeagues.length === 0 && (
                        <tr>
                          <td colSpan='3'>
                            <center>
                              <div className="no-team d-flex align-items-center justify-content-center">
                                <div className='marLeft50'>
                                  <i className="icon-trophy" />
                                  <h6 className="m-3"><FormattedMessage id="No_Player_Joined_Yet" /></h6>
                                </div>
                              </div>
                            </center>
                          </td>
                        </tr>
                        )}
                      </tbody>
                    </Fragment>
                    )
              }
            </Table>
            {downloadRecord
              ? (
                <Card className={`filter-card select-team ${downloadRecord ? 'show' : ''}`}>
                  <CardHeader className='d-flex align-items-center justify-content-between'>
                    <h1><FormattedMessage id="Download_Teams" /></h1>
                  </CardHeader>
                  <CardBody>
                    <ul className='m-0 d-flex align-item-center flex-wrap' />
                    <h3 className={`pt-2 ${document.dir === 'rtl' ? 'text-end pe-3' : 'text-start ps-3'} `}>
                      <FormattedMessage id="Teams_Locked_Download_and_track_Your_Competition" />
                    </h3>
                  </CardBody>

                  <CardFooter className='two-button border-0 bg-white m-0 d-flex justify-content-between'>
                    <Button color='border'
                      onClick={() => {
                        if (data) {
                          setDownloadRecord(false)
                          window.open(`${sMediaUrl}${data}`)
                        } else {
                          setDownloadRecord(false)
                          setAlert(true)
                          setAlertMessage('Fair Play is not available')
                          setTimeout(() => {
                            setAlert(false)
                          }, 2000)
                        }
                      }}
                      type="submit"
                    >
                      <i className="icon-down-arrow me-2" />
                      <FormattedMessage id="Download" />
                    </Button>
                    <Button color='primary' onClick={() => setDownloadRecord(false)} type="submit"><FormattedMessage id="Cancel" /></Button>
                  </CardFooter>
                </Card>
                )
              : ''
            }
            {
              selectedTeamCompareOn && (
                <div className="selected-t">
                  <p className="st-title"><FormattedMessage id="Selected_Teams" /></p>
                  <div className="d-flex align-items-center">
                    {
                      ((firstTeam && firstTeam.sTeamName) || (secondTeam && secondTeam.sTeamName)) && (
                        <Fragment>
                          <div className="team-box d-flex align-items-center">
                            <div className="img">
                              <img alt="" src={firstTeam && firstTeam.sImage ? firstTeam.sImage : firstTeam.sUserName ? createImageFromInitials(500, firstTeam.sUserName, getRandomColor()) : PlayerImage} />
                              <button className="bg-transparent icon-remove" />
                            </div>
                            <div>
                              {
                                firstTeam && firstTeam.sUserName && firstTeam.sTeamName && (
                                  <Fragment>
                                    <p>
                                      {firstTeam && firstTeam.sUserName}
                                      {' '}
                                      (
                                      {firstTeam && firstTeam.sTeamName}
                                      )
                                    </p>
                                    <p>
                                      <FormattedMessage id="Hash" />
                                      {firstTeam && firstTeam.nRank ? firstTeam.nRank : ''}
                                    </p>
                                  </Fragment>
                                )
                              }
                            </div>
                          </div>
                          <div className="vs"><FormattedMessage id="VS" /></div>
                          <div className="team-box d-flex align-items-center justify-content-end">
                            <div>
                              {
                                secondTeam && secondTeam.sUserName && secondTeam.sTeamName && (
                                  <Fragment>
                                    <p>
                                      {secondTeam && secondTeam.sUserName}
                                      {' '}
                                      (
                                      {secondTeam && secondTeam.sTeamName}
                                      )
                                    </p>
                                    <p>
                                      <FormattedMessage id="Hash" />
                                      {secondTeam && secondTeam.nRank ? secondTeam.nRank : ''}
                                    </p>
                                  </Fragment>
                                )
                              }
                            </div>
                            <div className="img">
                              <img alt='' src={secondTeam && secondTeam.sImage ? secondTeam.sImage : secondTeam.sUserName ? createImageFromInitials(500, secondTeam.sUserName, getRandomColor()) : PlayerImage} />
                              <button className="bg-transparent icon-remove" />
                            </div>
                          </div>
                        </Fragment>
                      )
                    }
                  </div>
                  <div className="st-bottom d-flex align-items-center">
                    <Button color="gray fullWidth"
                      onClick={() => {
                        setSelectedTeamCompareOn(false)
                        clearTeamSelected()
                      }}
                    >
                      <FormattedMessage id="Clear" />

                    </Button>
                  </div>
                </div>
              )
            }
          </TabPane>
          <TabPane tabId="3">
            {matchDetails && (matchDetails.eStatus === 'CMP' || matchDetails.eStatus === 'I') && matchDetails?.bDreamTeam && (
              <div className='dream_team'>
                <p><FormattedMessage id='Dream_team_available' /></p>
                <button onClick={() => goToDreamTeam()}>
                  <img src={fantasyIcon} />
                  <span>Fantasy 11</span>
                </button>
              </div>
            )}
            <PlayerStats {...props}
              completed
              matchPlayerList={matchPlayerList}
              onPlayerInfoClick={(id) => {
                // playerScorePoints(id)
                setPlayerId(id)
                setPlayerInfo(true)
              }}
              setPlayers={setPlayers}
              uniqueList={uniquePlayerList}
            />
          </TabPane>
        </TabContent>
      </div>
      {playerInfo
        ? (
          <PlayerInfo2
            {...props}
            matchPlayerList={matchPlayerList}
            onBackClick={() => {
              setPlayerInfo(false)
            }}
            pId={playerId}
            setPlayerId={setPlayerId}
            tempPlayers={players}
            url={sMediaUrl}
            userTeamId={userTeamId}
          />
          )
        : ''}
    </>
  )
}

LeaguesDetailCompletedPage.propTypes = {
  matchDetails: PropTypes.shape({
    id: PropTypes.string,
    eStatus: PropTypes.string,
    sportsType: PropTypes.string,
    bScorecardShow: PropTypes.bool,
    eCategory: PropTypes.string,
    _id: PropTypes.string,
    bDreamTeam: PropTypes.bool
  }),
  teamList: PropTypes.array,
  joinedLeagueList: PropTypes.array,
  matchPlayerList: PropTypes.array,
  leagueDetails: PropTypes.object,
  userData: PropTypes.object,
  activeTab: PropTypes.string,
  toggle: PropTypes.func,
  selectedTeamCompare: PropTypes.array,
  firstTeam: PropTypes.object,
  secondTeam: PropTypes.object,
  setActiveState: PropTypes.object,
  addCompare: PropTypes.func,
  currencyLogo: PropTypes.string,
  clearTeamSelected: PropTypes.func,
  myAllTeamPagination: PropTypes.func,
  allLeaderBoardList: PropTypes.array,
  myTeamsLeaderBoardList: PropTypes.array,
  uniquePlayerList: PropTypes.array,
  otherTeamJoinList: PropTypes.array,
  loadingDetails: PropTypes.bool,
  loading: PropTypes.bool,
  bCached: PropTypes.bool,
  bFullResponse: PropTypes.bool,
  token: PropTypes.string,
  setLoading: PropTypes.bool,
  getMyTeamLeaderBoardListFunc: PropTypes.func,
  loadingScorecard: PropTypes.bool
}

export default LeagueCompletedComponent(LeaguesDetailCompletedPage)
