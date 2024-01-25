import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import { useDispatch, useSelector } from 'react-redux'
import qs from 'query-string'
import PaginationComponent from '../../../components/PaginationComponent'
import SkeletonTable from '../../../components/SkeletonTable'
import moment from 'moment'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import { Button, Col, CustomInput, Modal, ModalBody, ModalHeader, Row, UncontrolledAlert } from 'reactstrap'
import Loading from '../../../components/Loading'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import { Link } from 'react-router-dom'
import viewIcon from '../../../assets/images/view-icon.svg'
import { getKycDetails } from '../../../actions/kyc'
import documentPlaceholder from '../../../assets/images/doc-placeholder.jpg'
import rightIcon from '../../../assets/images/right-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'

const TDSManagement = forwardRef((props, ref) => {
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const { List, getList, startDate, endDate, flag, getTDSTotalCountFunc, updateTdsFunc, getLeagueTds, isLeagueLog, getLeagueTdsCount } = props
  const searchProp = props.search
  const [tdsStatus, setTdsStatus] = useState('')
  const [filter, setFilter] = useQueryState('status', 'P')
  const [isFullResponse] = useState(false)
  const [fullList, setFullList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [order, setOrder] = useQueryState('order', 'desc')
  const [userType, setUserType] = useQueryState('eUserType', '')
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [search, setSearch] = useQueryState('search', '')
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [panStatus, setPanStatus] = useState('')
  const [pan, setPan] = useState('')
  const [panImage, setPanImage] = useState('')
  const [userId, setUserId] = useState('')
  const toggleModal = () => setModalOpen(!isModalOpen)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const isFullList = useSelector(state => state.users.isFullResponse)
  const resMessage = useSelector(state => state.users.resMessage)
  const resStatus = useSelector(state => state.users.resStatus)
  const kycDetails = useSelector(state => state.kyc.kycDetails)
  const kycResMessage = useSelector(state => state.kyc.resMessage)
  const kycResStatus = useSelector(state => state.kyc.resStatus)
  const token = useSelector((state) => state.auth.token)
  const tdsTotalCount = useSelector(state => state.users.tdsTotalCount)
  const obj = qs.parse(props.location.search)
  const previousProps = useRef({
    List,
    startDate,
    endDate,
    activePageNo,
    start,
    offset,
    filter,
    tdsTotalCount,
    kycDetails,
    kycResMessage,
    kycResStatus,
    userType
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
    let search = ''
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
      if (obj.search) {
        search = obj.search
        setSearch(obj.search)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        if (isLeagueLog) {
          getLeagueTds(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
          getLeagueTdsCount(search, filter, userType, startDate, endDate)
        } else {
          getList(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
          getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
        }
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps.kycDetails !== kycDetails) {
      if (kycDetails && kycDetails.oPan) {
        setPanImage(kycDetails.oPan.sImage)
        setPanStatus(kycDetails.oPan.eStatus)
        setPan(kycDetails.oPan.sNo)
        setModalOpen(true)
      }
      setLoader(false)
    }
    return () => {
      previousProps.kycDetails = kycDetails
    }
  }, [kycDetails])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      if (isLeagueLog) {
        getLeagueTds(startFrom, limit, sort, order, userType, props.search, filter, startDate, endDate, isFullResponse)
        getLeagueTdsCount(props.search, filter, userType, startDate, endDate)
      } else {
        getList(startFrom, limit, sort, order, userType, props.search, filter, startDate, endDate, isFullResponse)
        getTDSTotalCountFunc(props.search, filter, userType, startDate, endDate)
      }
      setSearch(searchProp.trim())
      setStart(startFrom)
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
    if (previousProps.userType !== userType) {
      const startFrom = 0
      const limit = offset
      if (isLeagueLog) {
        getLeagueTds(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
        getLeagueTdsCount(search, filter, userType, startDate, endDate)
      } else {
        getList(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
        getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
      }
      setPageNo(1)
      setLoading(true)
    }
    return () => {
      previousProps.userType = userType
    }
  }, [userType])

  useEffect(() => {
    if (previousProps.filter !== filter) {
      if (filter === 'P' || filter === 'A' || filter === '') {
        const startFrom = 0
        const limit = offset
        if (isLeagueLog) {
          getLeagueTds(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
          getLeagueTdsCount(search, filter, userType, startDate, endDate)
        } else {
          getList(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
          getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
        }
        setPageNo(1)
        setLoading(true)
      }
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
        if (isLeagueLog) {
          getLeagueTds(startFrom, limit, sort, order, userType, search, filter, props.startDate, props.endDate, isFullResponse)
          getLeagueTdsCount(search, filter, userType, props.startDate, props.endDate)
        } else {
          getList(startFrom, limit, sort, order, userType, search, filter, props.startDate, props.endDate, isFullResponse)
          getTDSTotalCountFunc(search, filter, userType, props.startDate, props.endDate)
        }
        props.startDate && setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        props.endDate && setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        if (isLeagueLog) {
          getLeagueTds(startFrom, limit, sort, order, userType, search, filter, props.startDate, props.endDate, isFullResponse)
          getLeagueTdsCount(search, filter, userType, props.startDate, props.endDate)
        } else {
          getList(startFrom, limit, sort, order, userType, search, filter, props.startDate, props.endDate, isFullResponse)
          getTDSTotalCountFunc(search, filter, userType, props.startDate, props.endDate)
        }
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
      if (List && !isFullList) {
        const userArrLength = List.length
        const startFrom = (activePageNo - 1) * offset + 1
        const end = startFrom - 1 + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List)
        setLoading(false)
      } else if (tdsTotalCount?.count === List?.length && isFullList) {
        setFullList(List)
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List),
          fileName: 'TDSList.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
    }
    if (previousProps.tdsTotalCount !== tdsTotalCount && tdsTotalCount) {
      setTotal(tdsTotalCount?.count ? tdsTotalCount.count : 0)
    }
    return () => {
      previousProps.List = List
      previousProps.tdsTotalCount = tdsTotalCount
    }
  }, [List, tdsTotalCount])

  useEffect(() => {
    if (previousProps.kycResMessage !== kycResMessage) {
      if (kycResMessage) {
        setMessage(kycResMessage)
        setStatus(kycResStatus)
        setModalMessage(true)
        setLoader(false)
      }
    }
    return () => {
      previousProps.kycResMessage = kycResMessage
    }
  }, [kycResStatus, kycResMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          if (isLeagueLog) {
            getLeagueTds(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
            getLeagueTdsCount(search, filter, userType, startDate, endDate)
          } else {
            getList(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
            getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
          }
          setModalWarning(false)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          const startFrom = 0
          const limit = offset
          if (isLeagueLog) {
            getLeagueTds(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
            getLeagueTdsCount(search, filter, userType, startDate, endDate)
          } else {
            getList(startFrom, limit, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
            getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
          }
          setLoader(false)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    data === {}
      ? (data = {
          TDSManagement: props.location.search
        })
      : (data.TDSManagement = props.location.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      if (isLeagueLog) {
        getLeagueTds(start, offset, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
      } else {
        getList(start, offset, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
      }
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      if (isLeagueLog) {
        getLeagueTds(start, offset, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
        getLeagueTdsCount(search, filter, userType, startDate, endDate)
      } else {
        getList(start, offset, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
        getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
      }
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      if (isLeagueLog) {
        getLeagueTds(0, offset, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
        getLeagueTdsCount(search, filter, userType, startDate, endDate)
      } else {
        getList(0, offset, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
        getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
      }
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onSorting (sortingBy) {
    if (order === 'desc') {
      const startFrom = 0
      const limit = offset
      if (isLeagueLog) {
        getLeagueTds(startFrom, limit, sortingBy, 'asc', userType, search, filter, startDate, endDate, isFullResponse)
      } else {
        getList(startFrom, limit, sortingBy, 'asc', userType, search, filter, startDate, endDate, isFullResponse)
      }
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      if (isLeagueLog) {
        getLeagueTds(startFrom, limit, sortingBy, 'desc', userType, search, filter, startDate, endDate, isFullResponse)
      } else {
        getList(startFrom, limit, sortingBy, 'desc', userType, search, filter, startDate, endDate, isFullResponse)
      }
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  const processExcelExportData = (data) =>
    data.map((tdsList) => {
      const sEmail = tdsList.sEmail ? tdsList.sEmail : '-'
      const sName = tdsList?.oPan?.sName ? tdsList?.oPan?.sName : '-'
      const nAmount = tdsList.nAmount ? Number(tdsList.nAmount).toFixed(2) : 0
      const nActualAmount = tdsList.nActualAmount ? Number(tdsList.nActualAmount).toFixed(2) : 0
      const nPercentage = tdsList.nPercentage ? Number(tdsList.nPercentage).toFixed(2) : '-'
      const winningAmountBeforeTDS = Number(tdsList.nOriginalAmount).toFixed(2) - Number(tdsList.nEntryFee).toFixed(2)
      const actualAmountPaid = tdsList.nActualAmount + tdsList.nEntryFee
      let dCreatedAt = moment(tdsList.dCreatedAt).local().format('DD-MM-YYYY')
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
      const pan = tdsList?.oPan?.sNo ? tdsList?.oPan?.sNo : '--'
      const sMatch = tdsList?.oMatch?.sName ? tdsList?.oMatch?.sName : '--'
      const iPassbookId = tdsList?.iPassbookId ? tdsList?.iPassbookId : '--'

      return {
        ...tdsList,
        sEmail,
        sName,
        nAmount,
        nActualAmount,
        nPercentage,
        winningAmountBeforeTDS,
        actualAmountPaid,
        dCreatedAt,
        pan,
        sMatch,
        iPassbookId
      }
    })

  async function onExport () {
    if (isLeagueLog) {
      await getLeagueTds(start, offset, sort, order, userType, search, filter, startDate, endDate, true)
      getLeagueTdsCount(search, filter, userType, startDate, endDate)
    } else {
      await getList(start, offset, sort, order, userType, search, filter, startDate, endDate, true)
      getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
    }
    setLoader(true)
  }

  function onRefresh () {
    const startFrom = 0
    if (isLeagueLog) {
      getLeagueTds(startFrom, offset, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
      getLeagueTdsCount(search, filter, userType, startDate, endDate)
    } else {
      getList(startFrom, offset, sort, order, userType, search, filter, startDate, endDate, isFullResponse)
      getTDSTotalCountFunc(search, filter, userType, startDate, endDate)
    }
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  function onFilter (e) {
    setFilter(e.target.value)
  }

  function handleUserType (e) {
    setUserType(e.target.value)
  }

  function warningWithConfirmMessage (PaymentStatus, id) {
    setTdsStatus(PaymentStatus)
    setUserId(id)
    setModalWarning(true)
  }

  function onStatusUpdate (e) {
    e.preventDefault()
    updateTdsFunc(tdsStatus, userId)
    setTdsStatus('')
    setLoading(true)
  }

  function setModalOpenFunc (userId) {
    dispatch(getKycDetails(userId, token, 'tds'))
    setLoader(true)
  }

  return (
    <Fragment>
      {modalMessage && message && (
        <UncontrolledAlert color='primary' className={alertClass(status, close)}>
          {message}
        </UncontrolledAlert>
      )}
      <ExcelExport data={fullList && fullList.length > 0 ? fullList : list} fileName={(startDate && endDate) ? `TDSList (${moment(startDate).format('MMMM Do YYYY, h-mm-ss a')} - ${moment(endDate).format('MMMM Do YYYY, h-mm-ss a')}).xlsx` : 'TDSList.xlsx'} ref={exporter}>
        <ExcelExportColumn field='dCreatedAt' title='Date' />
        <ExcelExportColumn field='sEmail' title='Email' />
        <ExcelExportColumn field='pan' title='PAN' />
        <ExcelExportColumn field='sName' title='Name as per PAN' />
        <ExcelExportColumn field='sMobNum' title='Mobile No.' />
        <ExcelExportColumn field='nOriginalAmount' title='Winning Amount' />
        <ExcelExportColumn field='nEntryFee' title='Entry Fees' />
        <ExcelExportColumn field='winningAmountBeforeTDS' title='Winning Amount Before TDS' />
        <ExcelExportColumn field='nPercentage' title='TDS%' />
        <ExcelExportColumn field='nAmount' title='TDS Amount' />
        <ExcelExportColumn field='nActualAmount' title='Actual Amount Paid' />
        <ExcelExportColumn field='sMatch' title='Match' />
        <ExcelExportColumn field='iPassbookId' title='Passbook ID' />
      </ExcelExport>
      {loader && <Loading />}
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Original Amount</th>
              <th>Entry Fees</th>
              <th>TDS Amount</th>
              <th>Actual Amount Paid</th>
              <th>Percentage</th>
              <th>Passbook ID</th>
              <th>Match</th>
              <th>
                <div>User Type</div>
                <CustomInput
                  type="select"
                  name="type"
                  id="type"
                  value={userType}
                  className="mt-1"
                  onChange={handleUserType}
                >
                  <option value=''>All</option>
                  <option key='U' value='U'>User</option>
                  <option key='B' value='B'>Bot</option>
                </CustomInput>
              </th>
              <th>
                <div>Status</div>
                <CustomInput
                  type="select"
                  name="filter"
                  id="filter"
                  value={filter}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-100'}`}
                  onChange={(e) => onFilter(e)}
                >
                  <option value="">All</option>
                  <option value="P">Pending</option>
                  <option value="A">Accepted</option>
                </CustomInput>
              </th>
              <th>
                Date & Time
                <Button
                  color='link'
                  className='sort-btn'
                  onClick={() => onSorting('dCreatedAt')}
                >
                  <img src={sortIcon} className='m-0' alt='sorting' />
                </Button>
              </th>
              <th>PAN Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={14} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{data.id || '--'}</td>

                        {(adminPermission && adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS === 'N' && data.eUserType === 'U')
                          ? <td><Button color="link" className="view" tag={Link} to={`/users/user-management/user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                          : (adminPermission && adminPermission.USERS === 'N' && adminPermission.SYSTEM_USERS !== 'N' && data.eUserType !== 'U')
                              ? <td><Button color="link" className="view" tag={Link} to={`/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                              : (adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                                  ? <td><Button color="link" className="view" tag={Link} to={data.eUserType === 'U' ? `/users/user-management/user-details/${data.iUserId}` : `/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                                  : <td>{data.sUsername || '--'}</td>}

                        <td>{Number(data.nOriginalAmount).toFixed(2) || '--'}</td>
                        <td>{Number(data.nEntryFee).toFixed(2) || '--'}</td>
                        <td>{Number(data.nAmount).toFixed(2) || '--'}</td>
                        <td>{Number(data.nActualAmount).toFixed(2) || '--'}</td>
                        <td>{Number(data.nPercentage).toFixed(2) || '--'}</td>
                        <td>
                          {adminPermission?.SYSTEM_USERS !== 'N'
                            ? <Button
                            color="link"
                            className="view"
                            tag={Link}
                            // to={`/users/passbook?searchType=PASSBOOK&searchValue=${data.iPassbookId}`}>{data.iPassbookId || '--'}</Button>
                            // : data.iPassbookId || '--'}
                            to={{ pathname: '/users/passbook', search: `?searchType=PASSBOOK&searchValue=${data.iPassbookId}`, state: { tdsToPassbook: true, passbookId: data.iPassbookId } }}>{data.iPassbookId || '--'}</Button>
                            : data.iPassbookId || '--'}
                        </td>
                        <td>
                        {adminPermission?.USERLEAGUE !== 'N'
                          ? <Button
                          color="link"
                          className="view"
                          tag={Link}
                          to={{ pathname: `/cricket/match-management/match-league-management/user-league/${data?.oMatch?._id}/${data?.iMatchLeagueId}`, state: { goBack: true } }}>{data?.oMatch?.sName || '--'}</Button>
                          : data?.oMatch?.sName || '--'}
                        </td>
                        <td>{data.eUserType ? data.eUserType === 'U' ? 'User' : 'Bot' : '--'}</td>
                        <td>{data.eStatus === 'P' ? 'Pending' : 'Accepted'}</td>
                        <td>{moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button color="link" className="view" onClick={() => setModalOpenFunc(data.iUserId)}>
                                <img src={viewIcon} alt="View" />
                                View
                              </Button>
                            </li>
                          </ul>
                        </td>
                        <td className='action-list'>
                          {data.eStatus === 'P'
                            ? (<Button color="link" className="success-btn mr-4" disabled={adminPermission?.TDS === 'R'} onClick={() => warningWithConfirmMessage('A', data.id)}><img src={rightIcon} alt="Accept" />Accept</Button>)
                            : <span className='total-text'>Accepted</span>}
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
      {!loading && list.length === 0 && (
        <div className='text-center'>
          <h3>No TDS List available</h3>
        </div>
      )}

      <Modal isOpen={isModalOpen} toggle={toggleModal} className='modal-reject'>
        <ModalHeader toggle={toggleModal}>PAN Details</ModalHeader>
        <ModalBody className='text-center'>
          <div className='d-flex justify-content-between'>
            <p><b>PAN: <span className='total-text'>{pan}</span></b></p>
            <p><b>Status: <span className='total-text'>{panStatus === 'A' ? 'Verified' : panStatus === 'R' ? 'Rejected' : panStatus === 'P' ? 'Pending' : 'Not Added'}</span></b></p>
          </div>
          <div className='doc-img2'>
            {panImage ? <img className='kyc-img' src={panImage} alt='PAN Image' /> : <img src={documentPlaceholder} alt='PAN Image'/>}
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className="text-center">
          <img className="info-icon" src={warningIcon} alt="check" />
          <h2>Are you sure you want to accept it?</h2>
          <Row className="row-12">
            <Col>
              <Button type="submit" className="theme-btn outline-btn full-btn" onClick={toggleWarning}>Cancel</Button>
            </Col>
            {
              <Col>
                <Button type="submit" className="theme-btn danger-btn full-btn" onClick={onStatusUpdate}>Yes, accept it</Button>
              </Col>
            }
          </Row>
        </ModalBody>
      </Modal>

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

TDSManagement.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  List: PropTypes.object,
  getList: PropTypes.func,
  search: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  flag: PropTypes.bool,
  getTDSTotalCountFunc: PropTypes.func,
  updateTdsFunc: PropTypes.func,
  getLeagueTds: PropTypes.func,
  isLeagueLog: PropTypes.string,
  getLeagueTdsCount: PropTypes.func
}

TDSManagement.displayName = TDSManagement

export default TDSManagement
