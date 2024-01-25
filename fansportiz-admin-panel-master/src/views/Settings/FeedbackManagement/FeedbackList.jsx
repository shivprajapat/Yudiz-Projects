import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import {
  UncontrolledAlert, Button, CustomInput
} from 'reactstrap'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import viewIcon from '../../../assets/images/view-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import { getUrl } from '../../../actions/url'
import PropTypes from 'prop-types'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import moment from 'moment'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const FeedbackList = forwardRef((props, ref) => {
  const exporter = useRef(null)
  const { getList, feedbackList, startDate, endDate, recommendedList, dateFlag } = props
  const [start, setStart] = useState(0)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [type, setType] = useQueryState('type', '')
  const [complainStatus, setComplainStatus] = useQueryState('complainStatus', 'P')
  const [nameOrder, setNameOrder] = useState('desc')
  const [createdOrder, setCreatedOrder] = useState('desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [url, setUrl] = useState('')
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const isSendId = useSelector(state => state.users.isSendId)

  const dispatch = useDispatch()
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resMessage = useSelector(state => state.feedback.resMessage)
  const resStatus = useSelector(state => state.feedback.resStatus)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const searchProp = props.search
  const obj = qs.parse(props.location.search)
  const previousProps = useRef({ start, offset, feedbackList, searchProp, resMessage, resStatus, type, complainStatus, startDate, endDate }).current
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    let page = 1
    let limit = offset
    let orderBy = 'desc'
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
      if (obj.order) {
        orderBy = obj.order
        setOrder(orderBy)
      }
      if (!obj.search) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, orderBy, searchProp, type, complainStatus, obj.datefrom ? new Date(obj.datefrom) : dateFrom, obj.dateto ? new Date(obj.dateto) : dateTo)
      }
    }
    dispatch(getUrl('media'))
    setLoading(true)
  }, [])

  useEffect(() => {
    if (isSendId && recommendedList && recommendedList.length > 0 && searchProp) {
      getList(start, offset, sort, order, searchProp, type, complainStatus, dateFrom, dateTo)
      setLoading(true)
    }
  }, [isSendId, searchProp])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.feedbackList !== feedbackList) {
      if (feedbackList) {
        if (feedbackList.aData) {
          const userArrLength = feedbackList.aData.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(feedbackList.aData ? feedbackList.aData : [])
        setIndex(activePageNo)
        setTotal(feedbackList.nTotal ? feedbackList.nTotal : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.feedbackList = feedbackList
    }
  }, [feedbackList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, searchProp, type, complainStatus, dateFrom, dateTo)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        FeedbackManagement: props.location.search
      }
      : data.FeedbackManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, type, complainStatus, dateFrom, dateTo)
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && props.flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchProp = searchProp
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate && dateFlag.current) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, searchProp, type, complainStatus, props.startDate, props.endDate)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, searchProp, type, complainStatus, props.startDate, props.endDate)
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
    if (previousProps.type !== type) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchProp, type, complainStatus, props.startDate, props.endDate)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.type = type
    }
  }, [type])

  useEffect(() => {
    if (previousProps.complainStatus !== complainStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchProp, type, complainStatus, props.startDate, props.endDate)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.complainStatus = complainStatus
    }
  }, [complainStatus])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, searchProp, type, complainStatus, dateFrom, dateTo)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onSorting (sortingBy) {
    const Order = sortingBy === 'dCreatedAt' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', searchProp, type, complainStatus, dateFrom, dateTo)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dCreatedAt') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', searchProp, type, complainStatus, dateFrom, dateTo)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dCreatedAt') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function onFiltering (event, Type) {
    if (Type === 'type') {
      setType(event.target.value)
    } else {
      setComplainStatus(event.target.value)
    }
  }

  const processExcelExportData = data => data.map((listOfFeedbacks) => {
    let dCreatedAt = moment(listOfFeedbacks.dCreatedAt).local().format('lll')
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
    const sUsername = listOfFeedbacks?.iUserId?.sUsername || '--'
    const eType = listOfFeedbacks.eType === 'F' ? 'Feedback' : listOfFeedbacks.eType === 'C' ? 'Complaint' : '--'
    const eStatus = listOfFeedbacks.eStatus === 'P' ? 'Pending' : listOfFeedbacks.eStatus === 'R' ? 'Resolved' : listOfFeedbacks.eStatus === 'I' ? 'In-Progress' : listOfFeedbacks.eStatus === 'D' ? 'Declined' : '--'
    const sComment = listOfFeedbacks.sComment ? listOfFeedbacks.sComment : '--'

    return {
      ...listOfFeedbacks,
      sUsername,
      dCreatedAt,
      eType,
      eStatus,
      sComment
    }
  })

  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, sort, order, searchProp, type, complainStatus, dateFrom, dateTo)
    setLoading(true)
    setPageNo(1)
  }

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'Feedback.xlsx' }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  return (
    <Fragment>
    {
      modalMessage && message &&
      (
      <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
      )
    }
      <ExcelExport
        data={list}
        fileName="Feedback.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="dCreatedAt" title="Time" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="sComment" title="Comment" />
      </ExcelExport>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              <th>
                <div>Type</div>
                <CustomInput
                  type="select"
                  name="promoType"
                  id="promoType"
                  value={type}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-75'}`}
                  onChange={(event) => onFiltering(event, 'type')}
                >
                  <option value="">All</option>
                  <option value="F">Feedback</option>
                  <option value="C">Complaint</option>
                </CustomInput>
              </th>
              <th>Title</th>
              <th>
                <div>Status</div>
                <CustomInput
                  type="select"
                  name="promoType"
                  id="promoType"
                  value={complainStatus}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-75'}`}
                  onChange={(event) => onFiltering(event, 'complainStatus')}
                >
                  <option value="">All</option>
                  <option value="P">Pending</option>
                  <option value="I">In-Progress</option>
                  <option value='D'>Declined</option>
                  <option value='R'>Resolved</option>
                </CustomInput>
              </th>
              <th>Image</th>
              <th>
                Date
                <Button color="link" className="sort-btn" onClick={() => onSorting('dCreatedAt')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={8} />
              : (
                <Fragment>
                  {
                  list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{(adminPermission?.USERS !== 'N') && data?.iUserId?._id
                          ? <Button tag={Link} color="link" className="view" to={`/users/user-management/user-details/${data.iUserId._id}`}>
                          {data?.iUserId?.sUsername || '-'}</Button>
                          : data?.iUserId?.sUsername || '--'}
                        </td>
                        <td>{data.eType === 'F' ? 'Feedback' : data.eType === 'C' ? 'Complaint' : ''}</td>
                        <td>{data.sTitle ? data.sTitle : '--'}</td>
                        <td>{data.eStatus === 'P' ? 'Pending' : data.eStatus === 'R' ? 'Resolved' : data.eStatus === 'I' ? 'In-Progress' : data.eStatus === 'D' ? 'Declined' : '--'}</td>
                        <td>{data.sImage
                          ? <img src={url + data.sImage} className="theme-image" alt="No Image" />
                          : 'No Image'}
                        </td>
                        <td>{data.dCreatedAt ? moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink color="link" className="view" to={`/settings/update-complaint-status/${data._id}`}>
                                <img src={viewIcon} alt="View" />
                                <span>View</span>
                              </NavLink>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {
       !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Feedback/Complaint List available</h3>
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

FeedbackList.propTypes = {
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  getList: PropTypes.func,
  feedbackList: PropTypes.object,
  recommendedList: PropTypes.object,
  dateFlag: PropTypes.bool
}

FeedbackList.displayName = FeedbackList

export default FeedbackList
