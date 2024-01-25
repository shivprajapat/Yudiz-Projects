import React, { Fragment, useState, useEffect, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import PromocodeContent from './PromocodeManagement'
import PropTypes from 'prop-types'
import { getPromocodeList, updatePromocode } from '../../../actions/promocode'
import moment from 'moment'

function Promocode (props) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const content = useRef()
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const promocodeList = useSelector(state => state.promocode.promocodeList)

  function onExport () {
    content.current.onExport()
  }
  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function getPromoCodeList (start, limit, sort, order, search, promoType, StartDate, EndDate) {
    const dateFrom = StartDate ? new Date(moment(StartDate).startOf('day').format()) : ''
    const dateTo = EndDate ? new Date(moment(EndDate).endOf('day').format()) : ''
    const promoCodeListData = {
      start, limit, sort, order, search: search.trim(), promoType, dateFrom: dateFrom ? new Date(dateFrom).toISOString() : '', dateTo: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    dispatch(getPromocodeList(promoCodeListData))
  }

  function updatePromoFunc (data) {
    dispatch(updatePromocode(data))
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            {...props}
            info
            list={promocodeList}
            heading="Promo Codes"
            buttonText="Add Promocode"
            setUrl="/settings/add-promocode"
            SearchPlaceholder="Search Promocode"
            handleSearch={onHandleSearch}
            search={searchText}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
            promocode
            onExport={onExport}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')}
          />
          <PromocodeContent
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            startDate={startDate}
            endDate={endDate}
            getList={getPromoCodeList}
            promocodeList={promocodeList}
            updatePromo={updatePromoFunc}
          />
        </section>
      </main>
    </Fragment>
  )
}

Promocode.propTypes = {
  location: PropTypes.object
}

export default Promocode
