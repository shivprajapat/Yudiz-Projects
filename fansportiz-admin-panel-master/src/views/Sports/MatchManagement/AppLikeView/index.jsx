import React, { Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../../../../components/Navbar'
import SportsHeader from '../../SportsHeader'
import AppLikeView from './AppLikeView'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { getMatchesTotalCount, getMatchList } from '../../../../actions/match'
import { getUrl } from '../../../../actions/url'

function IndexAppViewMatch (props) {
  const content = useRef()
  const dispatch = useDispatch()
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const matchList = useSelector(state => state.match.matchList)
  const matchStatus = useSelector(state => state.match.matchStatus)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function getList (start, limit, sort, order, searchText, filterMatchStatus, startDate, endDate, provider, season, format) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const matchListData = {
      start, limit, sort, order, search: searchText, filter: filterMatchStatus, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', sportsType, provider, season, format, token
    }
    dispatch(getMatchList(matchListData))
  }

  function getMatchesTotalCountFunc (filter, search, startDate, endDate, provider, season, format) {
    const upcoming = {
      filter, search, startDate, endDate, provider, season, format, sportsType, token
    }
    dispatch(getMatchesTotalCount(upcoming))
  }

  function getMediaUrlFunc () {
    dispatch(getUrl('media'))
  }

  return (
    <Fragment>
    <Navbar {...props} />
    <main className="main-content">
      <section className="management-section common-box">
        <Fragment>
          <SportsHeader
            heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Matches`}
            onRefresh={onRefreshFun}
            hidden
            refresh
            appView
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'R')}
          />
          <AppLikeView
            {...props}
            ref={content}
            sportsType={sportsType}
            viewLink={`/${sportsType}/match-management/view-match`}
            getList={getList}
            List={matchList}
            matchStatus={matchStatus}
            getMediaUrlFunc={getMediaUrlFunc}
            getMatchesTotalCountFunc={getMatchesTotalCountFunc}
          />
        </Fragment>
      </section>
    </main>
  </Fragment>
  )
}

IndexAppViewMatch.propTypes = {
  location: PropTypes.object
}

export default IndexAppViewMatch
