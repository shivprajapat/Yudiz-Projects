import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../../../../components/Navbar'
import PromoCodeStatisticsComponent from './PromocodeStatistics'
import qs from 'query-string'
import PropTypes from 'prop-types'
import Heading from '../../component/Heading'
import { getPromocodeStatisticsDetails } from '../../../../actions/promocode'
import { getRecommendedList } from '../../../../actions/users'
import { isNumber } from '../../../../helpers/helper'

function PromocodeStatistics (props) {
  const { match } = props
  const content = useRef()
  const dispatch = useDispatch('')
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [Promocode, setPromocode] = useState('')
  const [IsNumber, setIsNumber] = useState(false)
  const [userSearch, setUserSearch] = useState('')
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const promocodeStatisticsDetails = useSelector(state => state.promocode.promocodeStatisticsDetails)
  const recommendedList = useSelector(state => state.users.recommendedList)
  const previousProps = useRef({ userSearch }).current

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
      setUserSearch(obj.search)
      onGetRecommendedList(obj.search, true)
    } else if (recommendedList?.length === 0 || !recommendedList) {
      onGetRecommendedList('', false)
    }
  }, [])

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

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
    if (promocodeStatisticsDetails) {
      setPromocode(promocodeStatisticsDetails.sCode ? promocodeStatisticsDetails.sCode : '')
    }
  }, [promocodeStatisticsDetails])

  function onHandleSearch (e, value) {
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
      setUserSearch(parseInt(value))
      setIsNumber(true)
    } else {
      setUserSearch(value)
      setIsNumber(false)
    }
  }

  function getList (start, limit, sort, order, search) {
    if (match && match.params && match.params.id) {
      let searchData
      if (searchText) {
        if (IsNumber) {
          const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sMobNum === search)
          searchData = data._id
        } else {
          const data = recommendedList?.length > 0 && recommendedList.find(rec => rec.sEmail === search)
          searchData = data._id
        }
      }
      const Search = (searchData || search)
      dispatch(getPromocodeStatisticsDetails(start, limit, sort, order, Search, match.params.id, token))
    }
  }

  function onGetRecommendedList (data, sendId) {
    dispatch(getRecommendedList(data, sendId, token))
  }

  return (
    <div>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            {...props}
            heading={`Promocode Usage Statistics ${Promocode && '(' + Promocode + ')'}`}
            promocodeStatistics
            onExport={onExport}
            refresh
            onRefresh={onRefresh}
            list={promocodeStatisticsDetails}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')}
          />
          <PromoCodeStatisticsComponent
            {...props}
            ref={content}
            getList={getList}
            promocodeStatisticsDetails={promocodeStatisticsDetails}
            search={searchText}
            flag={initialFlag}
            userSearch={userSearch}
            isComplainSearch
            handleChangeSearch={onHandleSearch}
            handleRecommendedSearch={onHandleRecommendedSearch}
            recommendedList={recommendedList}
          />
        </section>
      </main>
    </div>
  )
}

PromocodeStatistics.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default PromocodeStatistics
