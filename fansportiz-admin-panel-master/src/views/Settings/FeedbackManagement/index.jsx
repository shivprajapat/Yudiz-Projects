import React, { Fragment, useEffect, useState, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Navbar from '../../../components/Navbar'
import Heading from '../component/Heading'
import FeedbackList from './FeedbackList'
import moment from 'moment'
import { getFeedbackList } from '../../../actions/feedback'
import { getRecommendedList } from '../../../actions/users'
import { isNumber } from '../../../helpers/helper'
import { useQueryState } from 'react-router-use-location-state'

function FeedbackManagement (props) {
  const dispatch = useDispatch('')
  const content = useRef()
  const [IsNumber, setIsNumber] = useState(false)
  const [searchText, setSearchText] = useQueryState('search', '')
  const [complaintSearch, setComplaintSearch] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const feedbackList = useSelector(state => state.feedback.feedbackList)
  const token = useSelector(state => state.auth.token)
  const recommendedList = useSelector(state => state.users.recommendedList)
  const previousProps = useRef({ complaintSearch }).current
  const dateFlag = useRef(false)

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
      setComplaintSearch(obj.search)
      onGetRecommendedList(obj.search, true)
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  useEffect(() => {
    const callSearchService = () => {
      onGetRecommendedList(complaintSearch.trim(), false)
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
  }, [complaintSearch])

  function handleChangeSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    } else {
      setSearchText(value)
      setinitialFlag(true)
    }
  }

  function onHandleRecommendedSearch (e, value) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    if (isNumber(value)) {
      setComplaintSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setComplaintSearch(value)
      setIsNumber(false)
    }
  }

  function getList (start, limit, sort, order, search, type, status, StartDate, EndDate) {
    let searchData = ''
    if (search) {
      if (IsNumber) {
        const mobNum = recommendedList?.length > 0 && recommendedList.find(rec => rec.sMobNum === search)
        searchData = mobNum._id
      } else {
        const email = recommendedList?.length > 0 && recommendedList.find(rec => rec.sEmail === search)
        searchData = email._id
      }
    }
    const dateFrom = StartDate ? new Date(moment(StartDate).startOf('day').format()) : ''
    const dateTo = EndDate ? new Date(moment(EndDate).endOf('day').format()) : ''
    const data = {
      start, limit, sort, order, search: (searchData || search), type, status, dateFrom: dateFrom ? new Date(dateFrom).toISOString() : '', dateTo: dateFrom ? new Date(dateTo).toISOString() : '', token
    }
    dispatch(getFeedbackList(data))
  }

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            heading="Feedbacks/Complaints"
            handleChangeSearch={handleChangeSearch}
            handleRecommendedSearch={onHandleRecommendedSearch}
            search={searchText}
            complaintSearch={complaintSearch}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            list={feedbackList}
            feedback
            onExport={onExport}
            recommendedList={recommendedList}
            dateFlag={dateFlag}
            refresh
            onRefresh={onRefresh}
          />
          <FeedbackList
            {...props}
            getList={getList}
            feedbackList={feedbackList}
            startDate={startDate}
            endDate={endDate}
            search={searchText}
            flag={initialFlag}
            ref={content}
            onExport={onExport}
            recommendedList={recommendedList}
            dateFlag={dateFlag}
          />
        </section>
      </main>
    </Fragment>
  )
}

FeedbackManagement.propTypes = {
  location: PropTypes.object
}

export default FeedbackManagement
