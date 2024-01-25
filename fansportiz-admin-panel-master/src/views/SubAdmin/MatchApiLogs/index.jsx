import React, { Fragment, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Navbar from '../../../components/Navbar'
import SubAdminHeader from '../components/SubAdminHeader'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchAPILogs } from '../../../actions/subadmin'
import MatchApiLogsList from './MatchApiLogs'

const MatchApiLogs = props => {
  const { match } = props
  const dispatch = useDispatch()
  const content = useRef()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state.auth.token)
  const matchApiLogsList = useSelector(state => state.subadmin.matchAPILogs)
  const dateFlag = useRef(false)

  function getList (start, limit, order, filter) {
    dispatch(getMatchAPILogs(match.params.id, start, limit, order, filter, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SubAdminHeader
            {...props}
            List={matchApiLogsList}
            header="Match API Logs"
            matchApiLogs
            refresh
            isMatchLog={match.params.id}
            onRefresh={onRefreshFun}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            dateFlag={dateFlag}
          />
          <MatchApiLogsList
            {...props}
            ref={content}
            List={matchApiLogsList}
            getList={getList}
            startDate={startDate}
            endDate={endDate}
            dateFlag={dateFlag}
          />
        </section>
      </main>
    </Fragment>
  )
}

MatchApiLogs.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default MatchApiLogs
