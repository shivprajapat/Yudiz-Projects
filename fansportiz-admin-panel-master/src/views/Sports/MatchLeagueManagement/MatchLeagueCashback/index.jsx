import React, { useState, useEffect, useRef, Fragment } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Navbar from '../../../../components/Navbar'
import SportsHeader from '../../SportsHeader'
import { getMatchLeagueDetails, getUsersCashbackList } from '../../../../actions/matchleague'
import MatchLeagueCashbackList from './MatchLeagueCashbackList'
import { getMatchDetails } from '../../../../actions/match'
import { getRecommendedList } from '../../../../actions/users'
import { isNumber } from '../../../../helpers/helper'

function MatchLeagueCashback (props) {
  const {
    match
  } = props
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [matchName, setMatchName] = useState('')
  const [IsNumber, setIsNumber] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const [matchLeagueName, setMatchLeagueName] = useState('')
  const [initialFlag, setInitialFlag] = useState(false)

  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const usersCashbackList = useSelector(state => state.matchleague.usersCashbackList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const recommendedList = useSelector(state => state.users.recommendedList)
  const matchLeagueDetails = useSelector(state => state.matchleague.matchLeagueDetails)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''
  const previousProps = useRef({ userSearch }).current
  const dispatch = useDispatch()

  useEffect(() => {
    if (match.params.id1) {
      dispatch(getMatchDetails(match.params.id1, token))
    }
    if (match.params.id2) {
      dispatch(getMatchLeagueDetails(match.params.id2, token))
    }
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
      setUserSearch(obj.search)
      onGetRecommendedList(obj.search, true)
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
  }, [])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
    }
  }, [MatchDetails])

  useEffect(() => {
    const callSearchService = () => {
      onGetRecommendedList(userSearch, false)
    }
    if (initialFlag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchText = searchText
      }
    }
  }, [userSearch])

  useEffect(() => {
    if (matchLeagueDetails) {
      setMatchLeagueName(matchLeagueDetails.sName)
    }
  }, [matchLeagueDetails])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setInitialFlag(true)
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function handleChangeSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    } else {
      setSearchText(value)
      setInitialFlag(true)
    }
  }

  function onHandleRecommendedSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    if (isNumber(value)) {
      setUserSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setUserSearch(value)
      setIsNumber(false)
    }
  }

  function getList (start, limit, search) {
    if (match.params.id2) {
      let searchData
      if (searchText) {
        if (IsNumber) {
          const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sMobNum === search)
          searchData = data._id
        } else {
          const data2 = recommendedList?.length > 0 && recommendedList.find(rec => rec.sEmail === search)
          searchData = data2._id
        }
      }
      const cashbackData = {
        start, limit, search: (searchData || search), matchId: match.params.id1, matchLeagueID: match.params.id2, token
      }
      dispatch(getUsersCashbackList(cashbackData))
    }
  }

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  function heading () {
    const title = sportsType.charAt(0).toUpperCase() + sportsType.slice(1) + ' Match League Cashback List'
    if (matchName) {
      if (window.innerWidth <= 480) {
        return <div>{title}<p>{`(${matchName})`}</p></div>
      } else {
        return <div>{title} {`(${matchName})`}</div>
      }
    } else {
      return <div>{title}</div>
    }
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            // heading={matchName ? `${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Match League Cashback List ( ${matchName} )` : `${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Match League Cashback List`}
            heading={heading()}
            onRefresh={onRefreshFun}
            matchLeaguePage={`/${sportsType}/match-management/match-league-management/${match.params.id1}`}
            refresh
            hidden
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'R')}
           />
          <MatchLeagueCashbackList
            {...props}
            List={usersCashbackList}
            getList={getList}
            flag={initialFlag}
            ref={content}
            handleSearch={onHandleSearch}
            search={searchText}
            matchLeagueName={matchLeagueName}
            userSearch={userSearch}
            isUserSearch
            handleChangeSearch={handleChangeSearch}
            handleRecommendedSearch={onHandleRecommendedSearch}
            recommendedList={recommendedList}
            userDebuggerPage={'/users/user-management/user-debugger-page/'}
            systemUserDebuggerPage={'/settings/system-user/system-user-debugger-page/'}
          />
        </section>
      </main>
    </Fragment>
  )
}

MatchLeagueCashback.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default MatchLeagueCashback
