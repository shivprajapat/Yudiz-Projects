import React, {
  Fragment, useState, useEffect, useRef
} from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import { getKYCList, getPendingKycCount } from '../../../actions/kyc'
import UserHeader from '../Component/UsersListHeader'
import { getRecommendedList } from '../../../actions/users'
import KYCVerificationContent from './KYCVerification'
import PropTypes from 'prop-types'
import { isNumber } from '../../../helpers/helper'
import moment from 'moment'
import { useQueryState } from 'react-router-use-location-state'

function KYCVerification (props) {
  const [searchText, setSearchText] = useQueryState('search', '')
  const [initialFlag, setinitialFlag] = useState(false)
  const [IsNumber, setIsNumber] = useState(false)
  const [kycSearch, setKycSearch] = useState('')
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state.auth.token)
  const kycList = useSelector(state => state.kyc.kycList)
  const pendingKycCount = useSelector(state => state.kyc.pendingKycCount)
  const recommendedList = useSelector(state => state.users.recommendedList)
  const content = useRef()
  const previousProps = useRef({ kycSearch }).current
  const dateFlag = useRef(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
      setKycSearch(obj.search)
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
      onGetRecommendedList(kycSearch.trim(), false)
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
  }, [kycSearch])

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  function getPendingKycCountFunc (panStatus, aadharStatus) {
    dispatch(getPendingKycCount(panStatus, aadharStatus, token))
  }

  function getList (start, limit, search, dateFrom, dateTo, PanStatus, AadhaarStatus, isFullResponse) {
    let searchData = ''
    if (search) {
      if (IsNumber) {
        const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sMobNum === search)
        searchData = data._id
      } else {
        const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sEmail === search)
        searchData = data._id
      }
    }
    const StartDate = dateFrom ? new Date(moment(dateFrom).startOf('day').format()) : ''
    const EndDate = dateTo ? new Date(moment(dateTo).endOf('day').format()) : ''
    const KYCList = {
      token, start, limit, search: (searchData || search), startDate: StartDate ? new Date(StartDate).toISOString() : '', endDate: EndDate ? new Date(EndDate).toISOString() : '', PanStatus, AadhaarStatus, isFullResponse
    }
    dispatch(getKYCList(KYCList))
  }

  function onExport () {
    content.current.onExport()
  }

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
      setKycSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setKycSearch(value)
      setIsNumber(false)
    }
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <UserHeader
            heading="KYC Verification"
            searchComplaint
            handleChangeSearch={handleChangeSearch}
            handleRecommendedSearch={onHandleRecommendedSearch}
            search={searchText}
            isOpenDateModal
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            kycSearch={kycSearch}
            isDateRangeSelect={false}
            onExport={onExport}
            list={kycList}
            recommendedList={recommendedList}
            dateFlag={dateFlag}
            refresh
            onRefresh={onRefreshFun}
          />
          <KYCVerificationContent
            {...props}
            ref={content}
            getList={getList}
            kycList={kycList}
            pendingKycCount={pendingKycCount}
            viewUser="/users/user-management/user-details"
            search={searchText}
            flag={initialFlag}
            startDate={startDate}
            endDate={endDate}
            recommendedList={recommendedList}
            getPendingKycCountFunc={getPendingKycCountFunc}
            dateFlag={dateFlag}
          />
        </section>
      </main>
    </Fragment>
  )
}

KYCVerification.propTypes = {
  location: PropTypes.object
}

export default KYCVerification
