import React, { useState, Fragment, lazy, useRef, Suspense, useEffect } from 'react'
import { Card, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Scorecard from '../components/Scorecard'
// import ScoreCards from '../components/ScoreCard/ScoreCards'
import PlayerInfo2 from '../components/PlayerInfo2'
import SkeletonTeam from '../../../component/SkeletonTeam'
import SkeletonLeague from '../../../component/SkeletonLeague'
import Loading from '../../../component/Loading'
import { isUpperCase } from '../../../utils/helper'
import LeagueCompletedComponent from '../../../HOC/SportsLeagueList/LeagueCompleted'
import Trophy from '../../../assests/images/trophy.svg'
import arrow from '../../../assests/images/right-arrow-yellow.svg'
import fantasyIcon from '../../../assests/images/Dream_Team_Icon.svg'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useGetUrl from '../../../api/url/queries/useGetUrl'
const PlayerStats = lazy(() => import('../components/PlayerStats'))
const League = lazy(() => import('../components/League'))
const MyTeam = lazy(() => import('../components/MyTeam'))
const classNames = require('classnames')

function LeaguesCompletedPage (props) {
  const { setActiveState, joinedLoading, matchDetails, loadingScorecard, currencyLogo, teamList, joinedLeagueList, matchPlayerList, playerScorePoints, loading, participate, activeTab, toggle, uniquePlayerList } = props
  const [playerId, setPlayerId] = useState('')
  const [matchType, setMatchType] = useState('')
  const [playerInfo, setPlayerInfo] = useState(false)
  const [finalData, setFinalData] = useState(false)
  const [winCount, setWinCount] = useState([])
  const previousProps = useRef({
    joinedLeagueList
  }).current
  const { sMediaUrl } = useGetUrl()

  const location = useLocation()
  const navigate = useNavigate()
  const { sMatchId, sportsType } = useParams()

  useEffect(() => {
    setWinCount([])
    if (sportsType) {
      const sport = sportsType
      if (isUpperCase(sport)) {
        if (location.pathname === `/completed-match/leagues/${sportsType}/${sMatchId}`) {
          setMatchType('completed')
          navigate(`/completed-match/leagues/${sport.toLowerCase()}/${sMatchId}`)
        } else {
          setMatchType('live')
          navigate(`/live-match/leagues/${sport.toLowerCase()}/${sMatchId}`)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (previousProps.joinedLeagueList !== joinedLeagueList) {
      if (joinedLeagueList && joinedLeagueList.length > 0) {
        const count = joinedLeagueList && joinedLeagueList.filter(data => data.bWinningZone)
        setWinCount(count)
        count && count.length > 0 && count.map(data => {
          let finaldata1 = 0
          finaldata1 = finaldata1 + data.nTotalWinningInContest
          return setFinalData(finaldata1)
        })
      }
    }
    return () => {
      previousProps.joinedLeagueList = joinedLeagueList
    }
  }, [joinedLeagueList])

  function goToDreamTeam () {
    navigate(`/dream-team-preview/${sportsType}/${matchDetails._id}`)
  }

  return (
    <>
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
      <Nav className="live-tabs justify-content-between bg-white b-bottom">
        <NavItem className={`text-center ${matchDetails?.bScorecardShow ? 'scorecards' : ''}`}>
          <NavLink className={classnames({ active: activeTab === '1' })}
            onClick={() => {
              setActiveState('1')
              toggle('1')
            }}
          >
            <FormattedMessage id="My_Contest" />

          </NavLink>
        </NavItem>
        <NavItem className={`text-center ${matchDetails?.bScorecardShow ? 'scorecards' : ''}`}>
          <NavLink className={classnames({ active: activeTab === '2' })}
            onClick={() => {
              setActiveState('2')
              toggle('2')
            }}
          >
            <FormattedMessage id="My_Teams" />

          </NavLink>
        </NavItem>
        <NavItem className={`text-center ${matchDetails?.bScorecardShow ? 'scorecards' : ''}`}>
          <NavLink className={classnames({ active: activeTab === '3' })}
            onClick={() => {
              setActiveState('3')
              toggle('3')
            }}
          >
            <FormattedMessage id="Player_stats" />

          </NavLink>
        </NavItem>
        {/* {
          matchDetails && matchDetails.bScorecardShow && (
            <NavItem className={`text-center ${matchDetails?.bScorecardShow ? 'scorecards' : ''}`}>
              <NavLink className={classnames({ active: activeTab === '4' })} onClick={() => {
                setActiveState('4')
                toggle('4')
              }} ><FormattedMessage id="Scorecard" /></NavLink>
            </NavItem>
          )
        } */}
      </Nav>
      {
        winCount && winCount.length && finalData && matchDetails && matchDetails.eStatus === 'CMP'
          ? (
            <div>
              <div className="mt-footer win-balance d-flex align-items-center justify-content-around">
                <span className='greenText'>
                  {' '}
                  <b>
                    {' '}
                    <FormattedMessage id="Congratulations_you_have_won_in" />
                    {' '}
                    {winCount && winCount.length}
                    {' '}
                    <FormattedMessage id="contest" />
                    {' '}
                  </b>
                  <br/>
                  <b className='blackText'>
                    {' '}
                    <img src={Trophy} />
                    {' '}
                    {currencyLogo}
                    {' '}
                    {finalData || '-'}
                    {' '}
                  </b>
                </span>
              </div>
            </div>
            )
          : ' '
      }
      {
        !playerInfo && (
        <div className={classNames('league-container', { 'league-completed': (!props.showScored) }, { 'shaw-won': (winCount && winCount.length && finalData && matchDetails && matchDetails.eStatus === 'CMP') })}>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              {loading || joinedLoading
                ? <SkeletonLeague leagueDetails length={4} />
                : (
                  <Card className="leagues-card border-0 bg-transparent">
                    {
                      joinedLeagueList && joinedLeagueList.length > 0
                        ? joinedLeagueList.map(LeagueData => {
                          return (
                            <Fragment key={`${LeagueData._id}`}>
                              <Suspense fallback={<Loading />}>
                                <League {...props} key={LeagueData._id} data={LeagueData} matchType='completed' participated={participate} />
                              </Suspense>
                            </Fragment>
                          )
                        }
                        )
                        : (
                          <div className="text-center">
                            <h3 className='mt-5'>
                              <FormattedMessage id="No_contests_are_available" />
                            </h3>
                          </div>
                          )
                    }
                  </Card>
                  )}
            </TabPane>
            <TabPane tabId="2">
              {loading
                ? <SkeletonTeam length={3} />
                : teamList && teamList.length > 0
                  ? teamList.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((teamDetailsData, index) => {
                    return (
                      <Suspense key={teamDetailsData._id} fallback={<Loading />}>
                        <MyTeam matchType={matchType} {...props} key={teamDetailsData._id} allTeams={teamList} index={index} name="Cricket" onPreviewTeam playerScorePoints={(id) => playerScorePoints(id)} points={true} teamDetails={teamDetailsData} />
                      </Suspense>
                    )
                  })
                  : (
                    <div className="text-center">
                      <h3 className='mt-5'>
                        <FormattedMessage id="No_Team" />
                      </h3>
                    </div>
                    )
              }
            </TabPane>
            <TabPane tabId="3">
              <Suspense fallback={<Loading />}>
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
                  uniqueList={uniquePlayerList}
                />
              </Suspense>
            </TabPane>
            {/* <TabPane tabId="4">
              <Suspense fallback={<Loading />}>
                {activeTab === 4 && <ScoreCards {...props} />}
              </Suspense>
            </TabPane> */}
          </TabContent>
        </div>
        )
      }
      {playerInfo
        ? (
          <Fragment>
            <PlayerInfo2 {...props}
              matchPlayerList={matchPlayerList}
              onBackClick={() => setPlayerInfo(false)}
              pId={playerId}
              setPlayerId={setPlayerId}
            />
          </Fragment>
          )
        : '' }
    </>
  )
}

LeaguesCompletedPage.propTypes = {
  matchDetails: PropTypes.object,
  teamList: PropTypes.array,
  joinedLeagueList: PropTypes.array,
  matchPlayerList: PropTypes.array,
  uniquePlayerList: PropTypes.array,
  playerScorePoints: PropTypes.func,
  showScored: PropTypes.bool,
  loading: PropTypes.bool,
  participate: PropTypes.bool,
  joinedLoading: PropTypes.bool,
  loadingScorecard: PropTypes.bool,
  activeTab: PropTypes.string,
  toggle: PropTypes.func,
  onUniquePlayers: PropTypes.func,
  setActiveState: PropTypes.func,
  currencyLogo: PropTypes.string
}

export default LeagueCompletedComponent(LeaguesCompletedPage)
