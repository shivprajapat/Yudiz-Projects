import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLeagueList } from '../../redux/actions/league'
import { getMyContestList, getMyTeamList, getMyJoinList, switchTeam } from '../../redux/actions/team'
// import { getMatchDetails } from '../../redux/actions/match'
import { getMatchTips } from '../../redux/actions/more'
import { GetUserProfile } from '../../redux/actions/profile'
import { getMyTeamLeaderBoardList, getAllTeamLeaderBoardList } from '../../redux/actions/leaderBoard'
import storage from '../../localStorage/localStorage'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

export const LeaguesList = (Component) => {
  const MyComponent = (props) => {
    const { VideoStream } = props
    const [data, setData] = useState([])
    const [contestList, setContastList] = useState([])
    const [switchTeamList, setSwitchTeamList] = useState([])
    const [showingTeamList] = useState([])
    const [allTeam, setAllTeam] = useState([])
    const [Details, setDetails] = useState({})
    const [filterSlide, setFilterSlide] = useState(false)
    const [sortSlide, setSortSlide] = useState(false)
    const [Sort, setSort] = useState('Popularity')
    const [url, setUrl] = useState('')
    const [limit] = useState(50)
    const [offset] = useState(0)
    const [Filter, setFilter] = useState([])
    const [FilterEntry, setFilterEntry] = useState([])
    const [FilterNoOfTeam, setFilterNoOfTeam] = useState([])
    const [FilterPrizePool, setFilterPrizePool] = useState([])
    const [FilterCategory, setFilterCategory] = useState([])
    const [Filterd, setFilterd] = useState([])
    const [FilterdEntry, setFilterdEntry] = useState([])
    const [FilterdNoOfTeam, setFilterdNoOfTeam] = useState([])
    const [FilterdPrizePool, setFilterdPrizePool] = useState([])
    const [FilterdCategory, setFilterdCategory] = useState([])
    const [sorted, setSorted] = useState('Popularity')
    const [type, setType] = useState(false)
    const [listed, setListed] = useState([])
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')
    const [iconIsActive, setIconIsActive] = useState(false)
    const [modalMessage, setModalMessage] = useState(false)
    const toggleMessage = () => setModalMessage(!modalMessage)
    const [loading, setLoading] = useState(false)
    const [loadingDetails, setLoadingDetails] = useState(false)
    const matchLeagueList = useSelector(state => state.league.matchLeagueList)
    const contastJoinList = useSelector(state => state.team.contestJoinList)
    const contastList = useSelector(state => state.team.contestList)
    const matchLeagueDetails = useSelector(state => state.league.matchLeagueDetails)
    const teamResStatus = useSelector(state => state.team.resStatus)
    const teamResMessage = useSelector(state => state.team.resMessage)
    const profileResStatus = useSelector(state => state.profile.resStatus)
    const profileResMessage = useSelector(state => state.profile.resMessage)
    const resStatus = useSelector(state => state.league.resStatus)
    const joinedLeague = useSelector(state => state.league.joinedLeague)
    const resMessage = useSelector(state => state.league.resMessage)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const matchTipsDetails = useSelector(state => state.more.matchTipsDetails)
    const matchDetails = useSelector(state => state.match.matchDetails)
    const nPutTime = useSelector(state => state.leaderBoard.nPutTime)
    const leaderBoardResStatus = useSelector(state => state.leaderBoard.resStatus)
    const leaderBoardResMessage = useSelector(state => state.leaderBoard.resMessage)
    const userInfo = useSelector(state => state.profile.userInfo)
    const amountData = useSelector(state => state.league.amountData)
    const myTeamsLeaderBoardList = useSelector(state => state.leaderBoard.myTeamsLeaderBoardList)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const userData = useSelector(state => state.auth.userData) || JSON.parse(localStorage.getItem('userData'))
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const teamList = useSelector(state => state.team.teamList)
    const resjoinMessage = useSelector(state => state.league.resjoinMessage)

    const [activeTab, setActiveTab] = useState(1)
    const previousProps = useRef({
      leaderBoardResStatus,
      teamList,
      contastJoinList,
      leaderBoardResMessage,
      matchLeagueList,
      matchLeagueDetails,
      contastList,
      resMessage,
      resStatus,
      teamResStatus,
      teamResMessage,
      activeTab,
      resjoinMessage,
      joinedLeague,
      matchTipsDetails,
      profileResStatus,
      profileResMessage,
      getUrlLink,
      sorted
    }).current

    const { sMatchId, sportsType, sLeagueId } = useParams()

    useEffect(() => {
      storage.removeItem('teamTab')
    }, [token])

    useEffect(() => {
      if (activeTab === 2 && token && sMatchId) {
        dispatch(getMyContestList(sMatchId, token))
        dispatch(getMyJoinList(sMatchId, token))
        setLoading(true)
      } else if (activeTab === 3 && token && sMatchId) {
        dispatch(getMyTeamList(sMatchId, token))
        setLoading(true)
      } else if (activeTab === 4 && matchDetails && matchDetails.sFantasyPost && token) {
        dispatch(getMatchTips(matchDetails.sFantasyPost, token))
        setLoading(true)
      } else if (activeTab === 1 && token) {
        if (sMatchId && sportsType) {
          dispatch(getLeagueList(sMatchId, sportsType, token))
          dispatch(getMyTeamList(sMatchId, token))
          dispatch(getMyJoinList(sMatchId, token))
          setLoading(true)
        }
      }
      // (!matchDetails || (matchDetails && matchDetails._id && sMatchId !== matchDetails._id)) && token && dispatch(getMatchDetails(sMatchId, sportsType, token))
      setLoadingDetails(true)
      // }
      return () => {
        previousProps.activeTab = activeTab
        previousProps.VideoStream = VideoStream
      }
    }, [activeTab, VideoStream, token])

    useEffect(() => {
      if (previousProps.matchDetails !== matchDetails) {
        if (activeTab === 4 && matchDetails && matchDetails.sFantasyPost && token) {
          dispatch(getMatchTips(matchDetails.sFantasyPost, token))
          setLoading(true)
        }
      }
      return () => {
        previousProps.matchDetails = matchDetails
      }
    }, [matchDetails])

    useEffect(() => {
      if (previousProps.teamResMessage !== teamResMessage) {
        if (teamResMessage) {
          setMessage(teamResMessage)
          toggleMessage()
        }
      }
      return () => {
        previousProps.teamResMessage = teamResMessage
      }
    }, [teamResStatus, teamResMessage])

    useEffect(() => {
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

    useEffect(() => {
      if (previousProps.profileResMessage !== profileResMessage) {
        if (profileResStatus !== null) {
          if (profileResMessage) {
            setMessage(profileResMessage)
            toggleMessage()
          }
        }
      }
      return () => {
        previousProps.profileResMessage = profileResMessage
      }
    }, [profileResStatus, profileResMessage])

    useEffect(() => {
      if (previousProps.matchTipsDetails !== matchTipsDetails) {
        if (matchTipsDetails) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.matchTipsDetails = matchTipsDetails
      }
    }, [matchTipsDetails])

    useEffect(() => {
      if (previousProps.leaderBoardResMessage !== leaderBoardResMessage) {
        if (leaderBoardResMessage) {
          setLoadingDetails(false)
        }
      }
      return () => {
        previousProps.leaderBoardResMessage = leaderBoardResMessage
      }
    }, [leaderBoardResStatus, leaderBoardResMessage])

    useEffect(() => {
      if (previousProps.joinedLeague !== joinedLeague) {
        if (joinedLeague && sMatchId && token) {
          dispatch(getMyContestList(sMatchId, token))
        }
      }
      return () => {
        previousProps.joinedLeague = joinedLeague
      }
    }, [joinedLeague])

    useEffect(() => {
      if (previousProps.matchLeagueList !== matchLeagueList) {
        if (resStatus !== null) {
          if (matchLeagueList) {
            if (matchLeagueList && matchLeagueList.length !== 0) {
              setData(matchLeagueList.sort((first, second) => first.nPosition - second.nPosition))
            } else {
              setData(matchLeagueList)
            }
            setLoading(false)
          }
        }
      }
      return () => {
        previousProps.matchLeagueList = matchLeagueList
      }
    }, [matchLeagueList])

    useEffect(() => {
      if (previousProps.matchLeagueDetails !== matchLeagueDetails) {
        if (matchLeagueDetails) {
          setDetails(matchLeagueDetails)
        }
      }
      return () => {
        previousProps.matchLeagueDetails = matchLeagueDetails
      }
    }, [matchLeagueDetails])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          setMessage(resMessage)
          toggleMessage()
          setTimeout(() => {
            setModalMessage(false)
          }, 3000)
          token && dispatch(getMyContestList(sMatchId, token))
          setLoading(true)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    useEffect(() => {
      if (message) {
        setTimeout(() => setModalMessage(false), 5000)
      }
    }, [message])

    useEffect(() => {
      if (previousProps.contastList !== contastList) {
        if (contastList) {
          setContastList(contastList)
          setLoading(false)
        }
      }
      return () => {
        previousProps.contastList = contastList
      }
    }, [contastList])

    useEffect(() => {
      if (previousProps.teamList !== teamList) {
        if (resStatus !== null) {
          if (teamList) {
            setLoading(false)
          }
        }
      }
      return () => {
        previousProps.teamList = teamList
      }
    }, [teamList])

    useEffect(() => {
      if (contastJoinList) {
        if (sLeagueId && teamList && teamList.length !== 0) {
          const dataOfContest = contastJoinList && contastJoinList.length !== 0 && contastJoinList.find(joinContest => joinContest.iMatchLeagueId === sLeagueId)
          if (dataOfContest && teamList && teamList.length !== 0) {
            const switchedTeamList = dataOfContest && dataOfContest.aUserTeams && teamList.filter(team => !dataOfContest.aUserTeams.includes(team._id))
            setSwitchTeamList(switchedTeamList)
          }
        }
      }
    }, [contastJoinList])

    useEffect(() => {
      if (Filterd || FilterdEntry || FilterdNoOfTeam || FilterdPrizePool || FilterdCategory) {
        const listedData = data.filter((league) => {
          if (Filterd && Filterd.length > 0) {
            return Filterd.includes(league.sFilterCategory) ? league : ''
          } else {
            return league
          }
        })
        const filterEntry = listedData.filter((data) => {
          if (FilterdEntry && FilterdEntry.length > 0) {
            let first, second, third, forth
            if (FilterdEntry.includes('1-50')) {
              first = (data.nPrice >= 1 && data.nPrice <= 50) ? data : ''
            }
            if (FilterdEntry.includes('51-100')) {
              second = (data.nPrice >= 51 && data.nPrice <= 100) ? data : ''
            }
            if (FilterdEntry.includes('101-1000')) {
              third = (data.nPrice >= 101 && data.nPrice <= 1000) ? data : ''
            }
            if (FilterdEntry.includes('1001-above')) {
              forth = (data.nPrice >= 1001) ? data : ''
            }
            return first || second || third || forth
          } else {
            return data
          }
        })

        const noOfTeam = filterEntry.filter((data) => {
          if (FilterNoOfTeam && FilterNoOfTeam.length > 0) {
            let first, second, third, forth, fifth
            // ((FilterNoOfTeam.includes('2')) && (data.nTeamJoinLimit <= 2) ? data : '') ||
            // ((FilterNoOfTeam.includes('3-10')) && (data.nTeamJoinLimit >= 3 && data.nTeamJoinLimit <= 10) ? data : '') ||
            // ((FilterNoOfTeam.includes('11-100')) && (data.nTeamJoinLimit >= 11 && data.nTeamJoinLimit <= 100) ? data : '') ||
            // ((FilterNoOfTeam.includes('101-1000')) && (data.nTeamJoinLimit >= 101 && data.nTeamJoinLimit <= 1000) ? data : '') ||
            // ((FilterNoOfTeam.includes('1001-above')) && (data.nTeamJoinLimit >= 1001) ? data : '')
            if (FilterNoOfTeam.includes('2')) {
              first = (data.nTeamJoinLimit === 2) ? data : ''
            }
            if (FilterNoOfTeam.includes('3-10')) {
              second = data.nTeamJoinLimit >= 3 && data.nTeamJoinLimit <= 10 ? data : ''
              // return (data.nTeamJoinLimit >= 3 && data.nTeamJoinLimit <= 10) ? data : ''
            }
            if (FilterNoOfTeam.includes('11-100')) {
              third = (data.nTeamJoinLimit >= 11 && data.nTeamJoinLimit <= 100) ? data : ''
              // return (data.nTeamJoinLimit >= 11 && data.nTeamJoinLimit <= 100) ? data : ''
            }
            if (FilterNoOfTeam.includes('101-1000')) {
              forth = (data.nTeamJoinLimit >= 101 && data.nTeamJoinLimit <= 1000) ? data : ''
              // return (data.nTeamJoinLimit >= 101 && data.nTeamJoinLimit <= 1000) ? data : ''
            }
            if (FilterNoOfTeam.includes('1001-above')) {
              fifth = (data.nTeamJoinLimit >= 1001) ? data : ''
              // return (data.nTeamJoinLimit >= 1001) ? data : ''
            }
            return first || second || third || forth || fifth
          } else {
            return data
          }
        })

        const PrizePoolFiltered = noOfTeam.filter((data) => {
          if (FilterPrizePool && FilterPrizePool.length > 0) {
            let first, second, third, forth
            if (FilterPrizePool.includes('1-10000')) {
              first = (data.nTotalPayout >= 1 && data.nTotalPayout <= 10000) ? data : ''
            }
            if (FilterPrizePool.includes('10000-100000')) {
              second = (data.nTotalPayout >= 100001 && data.nTotalPayout <= 100000) ? data : ''
            }
            if (FilterPrizePool.includes('100000-1000000')) {
              third = (data.nTotalPayout >= 100001 && data.nTotalPayout <= 1000000) ? data : ''
            }
            if (FilterPrizePool.includes('1000000-2500000')) {
              forth = (data.nTotalPayout >= 1000001 && data.nTotalPayout <= 2500000) ? data : ''
            }
            if (FilterPrizePool.includes('2500000')) {
              forth = (data.nTotalPayout >= 2500001) ? data : ''
            }
            return first || second || third || forth
          } else {
            return data
          }
        })
        const FinalFilteredData = PrizePoolFiltered.filter((data) => {
          if (FilterCategory && FilterCategory.length > 0) {
            let first, second, third, forth, fifth
            if (FilterCategory.includes('SingleEntry')) {
              first = (data.nTeamJoinLimit === 1) ? data : ''
            }
            if (FilterCategory.includes('MultiEntry')) {
              second = (data.bMultipleEntry) ? data : ''
            }
            if (FilterCategory.includes('SingleWinner')) {
              third = (data.aLeaguePrize && data.aLeaguePrize.length === 1 && data.aLeaguePrize[0].nRankFrom >= 1 && data.aLeaguePrize[0].nRankTo >= 1 && data.aLeaguePrize[0].nRankFrom === data.aLeaguePrize[0].nRankTo) ? data : ''
            }
            if (FilterCategory.includes('MultiWinner')) {
              forth = ((data.aLeaguePrize && data.aLeaguePrize.length >= 1) || (data.aLeaguePrize.length === 1 && data.aLeaguePrize[0].nRankFrom >= 1 && data.aLeaguePrize[0].nRankTo >= 1 && data.aLeaguePrize[0].nRankFrom !== data.aLeaguePrize[0].nRankTo)) ? data : ''
            }
            if (FilterCategory.includes('Guranteed')) {
              fifth = (data.bConfirmLeague) ? data : ''
            }
            return first || second || third || forth || fifth
          } else {
            return data
          }
        })
        setListed(FinalFilteredData)
      }
      // else {
      //   let listedItem
      //   if (type) {
      //     if (sorted === 'Prize-Pool') {
      //       listedItem = data.sort((a, b) => a.nTotalPayout > b.nTotalPayout ? -1 : 1)
      //       // setListed(listedItem)
      //     } else if (sorted === 'Entry') {
      //       listedItem = data.sort((a, b) => {
      //         if (a.nPrice > b.nPrice) {
      //           return -1
      //         } else {
      //           return 1
      //         }
      //       })
      //       // setListed(listedItem)
      //     } else if (sorted === 'Winner') {
      //       listedItem = data.sort((a, b) => a.nWinnersCount > b.nWinnersCount ? -1 : 1)
      //       // setListed(listedItem)
      //     } else if (sorted === 'Spots') {
      //       listedItem = data.sort((a, b) => a.nMax > b.nMax ? -1 : 1)
      //       // setListed(listedItem)
      //     }
      //     setListed(listedItem)
      //   } else {
      //     if (sorted === 'Prize-Pool') {
      //       listedItem = data.sort((a, b) => a.nTotalPayout > b.nTotalPayout ? 1 : -1)
      //       // setListed(listedItem)
      //     } else if (sorted === 'Entry') {
      //       listedItem = data.sort((a, b) => {
      //         if (b.nPrice > a.nPrice) {
      //           return -1
      //         } else {
      //           return 1
      //         }
      //       })
      //       // setListed(listedItem)
      //     } else if (sorted === 'Winner') {
      //       listedItem = data.sort((a, b) => a.nWinnersCount > b.nWinnersCount ? 1 : -1)
      //       // setListed(listedItem)
      //     } else if (sorted === 'Spots') {
      //       listedItem = data.sort((a, b) => a.nMax > b.nMax ? 1 : -1)
      //       // setListed(listedItem)
      //     }
      //     setListed(listedItem)
      //   }
      // }
    }, [Filterd, FilterdEntry, FilterdNoOfTeam, FilterdPrizePool, FilterdCategory, sorted, type])

    useEffect(() => {
      if (modalMessage) {
        setTimeout(() => {
          setModalMessage(false)
        }, 2000)
      }
    }, [modalMessage])

    useEffect(() => {
      if (previousProps.resjoinMessage !== resjoinMessage) {
        if (resjoinMessage) {
          if (resStatus && token) {
            const MatchId = amountData && amountData.iMatchId
            if (MatchId) {
              dispatch(getMyJoinList(MatchId, token))
              dispatch(getLeagueList(MatchId, sportsType, token))
            } else {
              dispatch(getMyJoinList(sMatchId, token))
              dispatch(getLeagueList(sMatchId, sportsType, token))
            }
            setLoading(true)
          }
        }
      }
      return () => {
        previousProps.resjoinMessage = resjoinMessage
      }
    }, [resjoinMessage, resStatus])

    function leagueListFun () {
      token && dispatch(getLeagueList(sMatchId, sportsType, token))
      setLoading(true)
    }
    function getMyContestListFun () {
      token && dispatch(getMyContestList(sMatchId, token))
      setLoading(true)
    }
    function getMyTeamListFun () {
      token && dispatch(getMyTeamList(sMatchId, token))
      setLoading(true)
    }
    function onGetUserProfile () {
      token && dispatch(GetUserProfile(token))
    }
    function getMyJoinContest () {
      token && dispatch(getMyJoinList(sMatchId, token))
      setLoading(true)
    }

    const changeType = (value) => {
      if (previousProps.sorted !== value) {
        setType(!type)
      } else {
        setType(true)
      }
      setSorted(value)
    }

    useEffect(() => {
      if (previousProps.sorted === sorted) {
        setType(!type)
      } else {
        setType(true)
      }

      return () => {
        previousProps.sorted = sorted
      }
    }, [sorted])

    useEffect(() => {
    // const close = (value) => { // sorted the data
      // setListed([])
      // setType(!type)
      // setSortSlide(false)
      if (sorted) {
        if (sorted === 'Prize-Pool') {
          const listed1 = type ? data.sort((a, b) => a.sName.toString().localeCompare(b.sName.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => b.nTotalPayout.toString().localeCompare(a.nTotalPayout.toString(), 'en', { numeric: true, sensitivity: 'base' })) : data.sort((a, b) => a.sName.toString().localeCompare(b.sName.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a.nTotalPayout.toString().localeCompare(b.nTotalPayout.toString(), 'en', { numeric: true, sensitivity: 'base' }))
          setListed(JSON.parse(JSON.stringify(listed1)))
        } else if (sorted === 'Entry') {
          const listed2 = type ? data.sort((a, b) => a.sName.toString().localeCompare(b.sName.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => b.nPrice.toString().localeCompare(a.nPrice.toString(), 'en', { numeric: true, sensitivity: 'base' })) : data.sort((a, b) => a.sName.toString().localeCompare(b.sName.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a.nPrice.toString().localeCompare(b.nPrice.toString(), 'en', { numeric: true, sensitivity: 'base' }))
          setListed(JSON.parse(JSON.stringify(listed2)))
        } else if (sorted === 'Winner') {
          const listed3 = type ? data.sort((a, b) => a.sName.toString().localeCompare(b.sName.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => b.nWinnersCount.toString().localeCompare(a.nWinnersCount.toString(), 'en', { numeric: true, sensitivity: 'base' })) : data.sort((a, b) => a.sName.toString().localeCompare(b.sName.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a.nWinnersCount.toString().localeCompare(b.nWinnersCount.toString(), 'en', { numeric: true, sensitivity: 'base' }))
          setListed(JSON.parse(JSON.stringify(listed3)))
        } else if (sorted === 'Spots') {
          const listed4 = type ? data.sort((a, b) => a.sName.toString().localeCompare(b.sName.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => b.nMax.toString().localeCompare(a.nMax.toString(), 'en', { numeric: true, sensitivity: 'base' })) : data.sort((a, b) => a.sName.toString().localeCompare(b.sName.toString(), 'en', { numeric: true, sensitivity: 'base' })).sort((a, b) => a.nMax.toString().localeCompare(b.nMax.toString(), 'en', { numeric: true, sensitivity: 'base' }))
          setListed(JSON.parse(JSON.stringify(listed4)))
        }
      }
    }, [type, sorted])

    function switchTeamFun (iUserLeagueId, iUserTeamId) {
      if (token) {
        dispatch(switchTeam(iUserLeagueId, iUserTeamId, token))
        dispatch(getMyTeamList(sMatchId, token))
        dispatch(getMyTeamLeaderBoardList(sLeagueId, token))
        dispatch(getAllTeamLeaderBoardList(limit, offset, sLeagueId, token, nPutTime))
      }
      setAllTeam([])
      setLoadingDetails(true)
    }

    const ApplyFilter = (value, filterEntry, filterNoOfTeam, filterPrizePool, FilterCategory) => {
      // setListed([])
      setIconIsActive(filterEntry.length > 0 || filterNoOfTeam.length > 0 || filterPrizePool.length > 0 || FilterCategory.length > 0)
      setFilterSlide(false)
      setFilterd(value)
      setFilterdEntry(filterEntry)
      setFilterdNoOfTeam(filterNoOfTeam)
      setFilterdPrizePool(filterPrizePool)
      setFilterdCategory(FilterCategory)
    }

    const toggle = tab => {
      if (activeTab !== tab) setActiveTab(tab)
    }

    return (
      <Component
        {...props}
        ApplyFilter={ApplyFilter}
        Filter={Filter}
        FilterCategory={FilterCategory}
        FilterEntry={FilterEntry}
        FilterNoOfTeam={FilterNoOfTeam}
        FilterPrizePool={FilterPrizePool}
        Filterd={Filterd}
        FilterdCategory={FilterdCategory}
        FilterdEntry={FilterdEntry}
        FilterdNoOfTeam={FilterdNoOfTeam}
        FilterdPrizePool={FilterdPrizePool}
        Sort={Sort}
        activeTab={activeTab}
        allLeaderBoardList={allTeam}
        amountData={amountData}
        changeType={changeType}
        close={close}
        contestJoinList={contastJoinList}
        contestList={contestList}
        currencyLogo={currencyLogo}
        filterSlide={filterSlide}
        getMyContestsList={getMyContestListFun}
        getMyJoinContest={getMyJoinContest}
        getMyTeamList={getMyTeamListFun}
        iconIsActive={iconIsActive}
        leagueDetails={Details}
        leagueList={leagueListFun}
        list={data}
        listed={listed}
        loading={loading}
        loadingDetails={loadingDetails}
        matchDetails={matchDetails}
        matchTipsDetails={matchTipsDetails}
        message={message}
        modalMessage={modalMessage}
        myTeamsLeaderBoardList={myTeamsLeaderBoardList}
        onGetUserProfile={onGetUserProfile}
        resMessage={resMessage}
        resStatus={resStatus}
        resjoinMessage={resjoinMessage}
        setFilter={setFilter}
        setFilterCategory={setFilterCategory}
        setFilterEntry={setFilterEntry}
        setFilterNoOfTeam={setFilterNoOfTeam}
        setFilterPrizePool={setFilterPrizePool}
        setFilterSlide={setFilterSlide}
        setLoadingDetails={setLoadingDetails}
        setMessage={setMessage}
        setSort={setSort}
        setSortSlide={setSortSlide}
        showingTeamList={showingTeamList}
        sortSlide={sortSlide}
        sorted={sorted}
        switchTeamFun={switchTeamFun}
        switchTeamList={switchTeamList}
        teamList={teamList}
        teamResMessage={teamResMessage}
        teamResStatus={teamResStatus}
        toggle={toggle}
        token={token}
        type={type}
        url={url}
        userData={userData}
        userInfo={userInfo}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object,
    VideoStream: PropTypes.any
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default LeaguesList
