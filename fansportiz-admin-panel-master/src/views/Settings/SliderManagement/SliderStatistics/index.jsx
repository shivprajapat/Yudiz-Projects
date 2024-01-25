import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../../../../components/Navbar'
import qs from 'query-string'
import PropTypes from 'prop-types'
import Heading from '../../component/Heading'
import SliderStatisticsComponent from './SliderStatistics'
import { getBannerStatisticsList } from '../../../../actions/banner'
import moment from 'moment'

function SliderStatistics (props) {
  const content = useRef()
  const { match } = props
  const dispatch = useDispatch('')
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const token = useSelector(state => state.auth.token)
  const bannerStatisticsList = useSelector(state => state.banner.bannerStatisticsList)

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
  }, [])

  function onExport () {
    content.current.onExport()
  }

  function onRefresh () {
    content.current.onRefresh()
  }

  function getList (start, limit, datefrom, dateto) {
    if (match && match.params && match.params.id) {
      const StartDate = datefrom ? new Date(moment(datefrom).startOf('day').format()) : ''
      const EndDate = dateto ? new Date(moment(dateto).endOf('day').format()) : ''
      const data = {
        start, limit, startDate: (StartDate ? new Date(StartDate).toISOString() : ''), endDate: (EndDate ? new Date(EndDate).toISOString() : ''), bannerId: match.params.id, token
      }
      dispatch(getBannerStatisticsList(data))
    }
  }

  return (
    <div>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            {...props}
            onExport={onExport}
            list={bannerStatisticsList}
            heading={'Slider Statistics'}
            sliderStatistics
            refresh
            onRefresh={onRefresh}
          />
          <SliderStatisticsComponent
            {...props}
            ref={content}
            bannerStatisticsList={bannerStatisticsList}
            getList={getList}
            startDate={startDate}
            endDate={endDate}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
        </section>
      </main>
    </div>
  )
}

SliderStatistics.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default SliderStatistics
