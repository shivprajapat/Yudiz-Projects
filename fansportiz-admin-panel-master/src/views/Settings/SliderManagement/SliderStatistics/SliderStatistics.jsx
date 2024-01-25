import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import { Button, FormGroup, Input } from 'reactstrap'
import SkeletonTable from '../../../../components/SkeletonTable'
import moment from 'moment'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import calendarIcon from '../../../../assets/images/calendar-icon.svg'
import PaginationComponent from '../../../../components/PaginationComponent'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'

const SliderStatistics = forwardRef((props, ref) => {
  const { bannerStatisticsList, dateRange, setDateRange, getList, startDate, endDate } = props
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 entries')
  const [Loading, setLoading] = useState(false)
  const [sliderStatistics, setSliderStatistics] = useState([])
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ bannerStatisticsList, startDate, endDate, start, offset }).current
  const paginationFlag = useRef(false)

  useEffect(() => {
    let page = 1
    let limit = offset
    const obj = qs.parse(props.location.search)
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} entries`)
      }
    }
    const startFrom = (page - 1) * offset
    getList(startFrom, limit, dateFrom, dateTo)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (bannerStatisticsList && previousProps.bannerStatisticsList !== bannerStatisticsList) {
      if (bannerStatisticsList.data) {
        const userArrLength = bannerStatisticsList.data.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
      }
      setSliderStatistics(bannerStatisticsList.data)
      setIndex(activePageNo)
      setTotal(bannerStatisticsList.total ? bannerStatisticsList.total : 0)
      setLoading(false)
    }
    return () => {
      previousProps.bannerStatisticsList = bannerStatisticsList
    }
  }, [bannerStatisticsList])

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, props.startDate, props.endDate)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        setPageNo(1)
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, props.startDate, props.endDate)
        setDateFrom('')
        setDateTo('')
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.startDate = startDate
      previousProps.endDate = endDate
    }
  }, [startDate, endDate])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, dateFrom, dateTo)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input className='mx-2' value={value} placeholder='Select Date Range' ref={ref} readOnly />
      <img src={calendarIcon} alt="calendar" />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  const processExcelExportData = data => data.map((sliderStatisticsList) => {
    let dCreatedAt = moment(sliderStatisticsList.dCreatedAt).format('DD/MM/YYYY')
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt

    return {
      ...sliderStatisticsList,
      dCreatedAt
    }
  })

  function onExport () {
    const { length } = sliderStatistics
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(sliderStatistics), fileName: 'Slider.xlsx' }
      exporter.current.save()
    }
  }

  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, dateFrom, dateTo)
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  return (
    <Fragment>
      <ExcelExport
        data={sliderStatistics}
        fileName="Slider.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="dCreatedAt" title="Creation Time" />
        <ExcelExportColumn field="userCount" title="User Count" />
      </ExcelExport>
      <div className="table-responsive">
        <div className='d-flex justify-content-between fdc-480'>
          <FormGroup>
            <DatePicker
              value={dateRange}
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update)
              }}
              isClearable={true}
              placeholderText='Select Date Range'
              customInput={<ExampleCustomInput />}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
            >
            </DatePicker>
          </FormGroup>
          <div className='d-flex align-items-center success-text'><b>Total Click Count: {bannerStatisticsList?.nTotalBannerClick || 0}</b></div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {Loading
              ? <SkeletonTable numberOfColumns={3} />
              : (
                <Fragment>
                  {
                    sliderStatistics && sliderStatistics.length !== 0 &&
                    sliderStatistics.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                          ? <Button color="link" className="view" tag={Link} to={(data.iUserId && data.iUserId.eType === 'U') ? `/users/user-management/user-details/${data.iUserId._id}` : `/users/system-user/system-user-details/${data?.iUserId?._id}`}>{data?.iUserId?.sUsername || '--'}</Button>
                          : data?.iUserId?.sUsername || '--'}</td>
                        <td>{moment(data.dCreatedAt).format('DD/MM/YYYY')}</td>
                      </tr>
                    ))}
                </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {
       !Loading && !sliderStatistics &&
        (
          <div className="text-center">
            <h3>No Slider statistics list available</h3>
          </div>
        )
      }
      <PaginationComponent
        activePageNo={activePageNo}
        startingNo={startingNo}
        endingNo={endingNo}
        total={total}
        listLength={listLength}
        setOffset={setOffset}
        setStart={setStart}
        setLoading={setLoading}
        setListLength={setListLength}
        setPageNo={setPageNo}
        offset={offset}
        paginationFlag={paginationFlag}
      />
    </Fragment>
  )
})

SliderStatistics.propTypes = {
  location: PropTypes.object,
  bannerStatisticsList: PropTypes.object,
  getList: PropTypes.func,
  handle: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  setDateRange: PropTypes.func,
  dateRange: PropTypes.array
}

SliderStatistics.displayName = SliderStatistics

export default SliderStatistics
