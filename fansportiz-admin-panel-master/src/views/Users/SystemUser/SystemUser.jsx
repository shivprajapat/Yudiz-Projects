import React, {
  Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle
} from 'react'
import {
  UncontrolledAlert, Button
} from 'reactstrap'
import moment from 'moment'
import { Link, useHistory } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import viewIcon from '../../../assets/images/view-icon.svg'
import debugging from '../../../assets/images/debugger.png'
import check from '../../../assets/images/checked-icon.svg'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import Loading from '../../../components/Loading'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { useSelector } from 'react-redux'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const SystemUser = forwardRef((props, ref) => {
  const exporter = useRef(null)
  const {
    List, resStatus, resMessage, getList, flag, startDate, endDate, filter, getSystemUsersTotalCountFunc, systemUsersTotalCount
  } = props
  const history = useHistory()
  const searchProp = props.search
  const [isFullResponse] = useState(false)
  const [fullList, setFullList] = useState([])
  const [start, setStart] = useState(0)
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [index, setIndex] = useState(1)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  // eslint-disable-next-line no-unused-vars
  const [filterBy, setFilterBy] = useQueryState('filterBy', '')
  const [order, setOrder] = useQueryState('order', 'desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [search, setSearch] = useQueryState('searchvalue', '')
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const isFullList = useSelector(state => state.systemusers.isFullResponse)
  const obj = qs.parse(props.location.search)

  const previousProps = useRef({
    List, resStatus, resMessage, startDate, endDate, start, offset, filter, systemUsersTotalCount
  }).current
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
      if ((!obj.search) && (!obj.datefrom) && (!obj.filterBy)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, order, search, filterBy, startDate, endDate, isFullResponse)
        getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, filterBy, startDate, endDate, isFullResponse)
      getSystemUsersTotalCountFunc(props.search, filterBy, startDate, endDate)
      setStart(startFrom)
      setSearch(searchProp.trim())
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
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
    if (previousProps.filter !== filter) {
      if (filter === 'EMAIL_VERIFIED' || filter === 'MOBILE_VERIFIED' || filter === 'INTERNAL_ACCOUNT' || filter === '') {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props.search, filter, startDate, endDate, isFullResponse)
        getSystemUsersTotalCountFunc(search, filter, startDate, endDate)
        setSearch(searchProp.trim())
        setStart(startFrom)
        setPageNo(1)
        setLoading(true)
      }
      setFilterBy(filter)
    }
    return () => {
      previousProps.filter = filter
    }
  }, [filter])

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
        getSystemUsersTotalCountFunc(search, filterBy, props.startDate, props.endDate)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const start = 0
        const limit = offset
        getList(start, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
        getSystemUsersTotalCountFunc(search, filterBy, props.startDate, props.endDate)
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
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List && List.results && !isFullList) {
        const userArrLength = List.results.length
        const start = ((activePageNo - 1) * offset) + 1
        const end = (start - 1) + userArrLength
        setStartingNo(start)
        setEndingNo(end)
        setList(List.results ? List.results : [])
        setIndex(activePageNo)
        setLoading(false)
      } else if (systemUsersTotalCount?.count === List?.results?.length && isFullList) {
        setFullList(List.results ? List.results : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.results ? List.results : []),
          fileName: 'SystemUsers.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
    }
    if (previousProps.systemUsersTotalCount !== systemUsersTotalCount && systemUsersTotalCount) {
      setTotal(systemUsersTotalCount?.count ? systemUsersTotalCount?.count : 0)
    }
    return () => {
      previousProps.List = List
      previousProps.systemUsersTotalCount = systemUsersTotalCount
    }
  }, [List, systemUsersTotalCount])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const start = 0
          const limit = offset
          getList(start, limit, sort, order, search, filterBy, startDate, endDate, isFullResponse)
          getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
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
        SystemUser: props.location.search
      }
      : data.SystemUser = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) && start) {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      setLoading(true)
    }
    getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onSorting (sortingBy) {
    const Order = sortingBy === 'dStartTime' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const start = 0
      const limit = offset

      getList(start, limit, sortingBy, 'desc', search, filterBy, startDate, endDate, isFullResponse)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dStartTime') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, 'asc', search, filterBy, startDate, endDate, isFullResponse)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dStartTime') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function onRefresh () {
    const start = 0
    const limit = offset
    getList(start, limit, sort, order, search, filterBy, startDate, endDate, isFullResponse)
    getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
    setPageNo(1)
    setLoading(true)
  }

  const processExcelExportData = data => data.map((userList) => {
    let dCreatedAt = moment(userList.dCreatedAt).local().format('lll')
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt

    return {
      ...userList,
      dCreatedAt
    }
  })

  async function onExport () {
    if (startDate && endDate) {
      await getList(start, offset, sort, order, search, filterBy, startDate, endDate, true)
      await getSystemUsersTotalCountFunc(search, filterBy, startDate, endDate)
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
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
        data={fullList && fullList.length > 0 ? fullList : list}
        fileName="SystemUsers.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sName" title="Name" />
        <ExcelExportColumn field="sUsername" title="Team Name" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile No." />
        <ExcelExportColumn field="dCreatedAt" title="Registration Date" />
      </ExcelExport>
      {loader && <Loading />}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Team Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>
                Registration Date
                <Button color="link" className="sort-btn" onClick={() => onSorting('dStartDate')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Actions</th>
              <th>User Debugger</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={7} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data && data.sUsername}</td>
                        <td>{(data && data.sEmail) || '--'}{data && data.bIsEmailVerified ? <img src={check} className='mx-2'></img> : ''}</td>
                        <td>{data && data.sMobNum}{data && data.bIsMobVerified ? <img src={check} className="mx-2"></img> : ''}</td>
                        <td>{moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button color="link" className="view" onClick={() => history.push(`${props.viewLink}/${data._id}`, { systemUserList: true })}>
                                <img src={viewIcon} alt="View" />
                                View
                              </Button>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Link color="link" className="view" to={`/users/system-user/system-user-debugger-page/${data._id}`}>
                                <img src={debugging} alt="View" />
                              </Link>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No System-User List available</h3>
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

SystemUser.propTypes = {
  location: PropTypes.object,
  openPicker: PropTypes.bool,
  search: PropTypes.string,
  List: PropTypes.object,
  getList: PropTypes.func,
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  flag: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  filter: PropTypes.string,
  viewLink: PropTypes.string,
  history: PropTypes.object,
  getSystemUsersTotalCountFunc: PropTypes.func,
  systemUsersTotalCount: PropTypes.object
}

SystemUser.displayName = SystemUser

export default SystemUser
