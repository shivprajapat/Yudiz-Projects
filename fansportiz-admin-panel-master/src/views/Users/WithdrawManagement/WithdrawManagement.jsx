import React, {
  Fragment, useState, useRef, useEffect, forwardRef, useImperativeHandle
} from 'react'
import {
  Button, FormGroup, UncontrolledAlert, Form, Label, CustomInput, Modal, ModalBody, Row, Col, ModalHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import rightIcon from '../../../assets/images/right-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import wrongIcon from '../../../assets/images/wrong-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import viewIcon from '../../../assets/images/view-icon.svg'
import { updatePaymentStatus } from '../../../actions/withdraw'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import Loading from '../../../components/Loading'
import ReactJson from 'react-json-view'
import { apiLogsTransaction } from '../../../actions/apilogs'

const WithdrawManagement = forwardRef((props, ref) => {
  const {
    getList,
    List,
    flag,
    startDate,
    endDate,
    getWithdrawalsTotalCountFunc
  } = props
  const exporter = useRef(null)
  const search = props.search
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
  const [list, setList] = useState([])
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [rejectMsg, setRejectMsg] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort, setSort] = useQueryState('sort', 'dCreatedAt')
  const [searchValue, setSearchValue] = useQueryState('searchValue', '')
  const [paymentStatus, setPaymentStatus] = useQueryState('status', '')
  const [withdrawPaymentMethod, setWithdrawPaymentMethod] = useQueryState('method', '')
  const [reversedInfo, setReversedInfo] = useQueryState('reversedInfo', 'all')
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [withdrawPaymentStatus, setWithdrawPaymentStatus] = useState('')
  const [UserID, setUserID] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [modalMessage2, setModalMessage2] = useState(false)
  const [logModal, setLogModal] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')

  const dispatch = useDispatch('')
  const withdrawalsTotalCount = useSelector(state => state.withdraw.withdrawalsTotalCount)
  const resStatus = useSelector(state => state.withdraw.resStatus)
  const resMessage = useSelector(state => state.withdraw.resMessage)
  const token = useSelector(state => state.auth.token)
  const isFullList = useSelector(state => state.withdraw.isFullResponse)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const logsData = useSelector(state => state.apilogs.logs)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const toggleLogModal = () => setLogModal(!logModal)
  const obj = qs.parse(props.location.search)
  const previousProps = useRef({
    resStatus, resMessage, List, paymentStatus, withdrawPaymentMethod, reversedInfo, search, startDate, endDate, start, offset, withdrawalsTotalCount
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
    let searchData = searchValue
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
      if (obj.searchValue) {
        searchData = obj.searchValue
        setSearchValue(searchData)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
        getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
      getWithdrawalsTotalCountFunc(props.search, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate)
      setSearchValue(search.trim())
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.search !== search && flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.search = search
      }
    }
    return () => {
      previousProps.search = search
    }
  }, [search])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List && List.rows && !isFullList) {
        const userArrLength = List.rows.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List.rows)
      } else if (withdrawalsTotalCount?.count === List?.rows?.length && isFullList) {
        setFullList(List.rows ? List.rows : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.rows ? List.rows : []),
          fileName: 'Withdrawals.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
      setLoading(false)
    }
    if (previousProps.withdrawalsTotalCount !== withdrawalsTotalCount && withdrawalsTotalCount) {
      setTotal(withdrawalsTotalCount?.count ? withdrawalsTotalCount?.count : 0)
      // setLoading(false)
    }
    return () => {
      previousProps.List = List
      previousProps.withdrawalsTotalCount = withdrawalsTotalCount
    }
  }, [List, withdrawalsTotalCount])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
          getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, props.startDate, props.endDate, isFullResponse)
        getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, props.startDate, props.endDate)
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
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, props.startDate, props.endDate, isFullResponse)
        getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, props.startDate, props.endDate)
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
    if (previousProps.paymentStatus !== paymentStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
      getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate)
      setPageNo(1)
    }
    return () => {
      previousProps.paymentStatus = paymentStatus
    }
  }, [paymentStatus])

  useEffect(() => {
    if (previousProps.withdrawPaymentMethod !== withdrawPaymentMethod) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
      getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate)
      setPageNo(1)
    }
    return () => {
      previousProps.withdrawPaymentMethod = withdrawPaymentMethod
    }
  }, [withdrawPaymentMethod])

  useEffect(() => {
    if (previousProps.reversedInfo !== reversedInfo) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
      getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate)
      setPageNo(1)
    }
    return () => {
      previousProps.reversedInfo = reversedInfo
    }
  }, [reversedInfo])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
      getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onSorting (sortingBy) {
    const Order = sortingBy === 'dCreatedAt' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, 'desc', searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
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
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, 'asc', searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
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

  function Completed () {
    setModalMessage2(false)
  }

  function onMethodChange (event) {
    setWithdrawPaymentMethod(event.target.value)
  }

  function onReversedChange (event) {
    setReversedInfo(event.target.value)
  }

  function onStatusChange (event) {
    setPaymentStatus(event.target.value)
  }

  function warningWithConfirmMessage (PaymentStatus, id, msg) {
    setWithdrawPaymentStatus(PaymentStatus)
    setUserID(id)
    setRejectMsg(msg)
    setModalWarning(true)
  }

  function onStatusUpdate () {
    const Status = withdrawPaymentStatus === 'Approve' ? 'S' : withdrawPaymentStatus === 'Reject' ? 'C' : ''
    dispatch(updatePaymentStatus(Status, UserID, rejectMsg, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
  }

  const processExcelExportData = data => data.map((withdrawalList) => {
    let sUsername = withdrawalList.sUsername
    const sEmail = withdrawalList.sEmail || '--'
    const sMobNum = withdrawalList.sMobNum || '--'
    let ePaymentStatus = withdrawalList.ePaymentStatus
    let sName = withdrawalList.sName
    let sInfo = withdrawalList.sInfo
    let ePlatform = withdrawalList.ePlatform
    let dWithdrawalTime = moment(withdrawalList.dWithdrawalTime).local().format('lll')
    const ePaymentGateway = withdrawalList.ePaymentGateway ? withdrawalList.ePaymentGateway : '--'
    const transactionId = withdrawalList.iTransactionId || '--'
    sUsername = sUsername || '--'
    dWithdrawalTime = dWithdrawalTime === 'Invalid date' ? ' - ' : dWithdrawalTime
    ePaymentStatus = ePaymentStatus === 'C' ? 'Cancelled' : ePaymentStatus === 'P' ? 'Pending' : ePaymentStatus === 'R' ? 'Refunded' : ePaymentStatus === 'S' ? 'Success' : ePaymentStatus === 'I' ? 'Initiated' : '--'
    sName = sName || '--'
    sInfo = sInfo || '--'
    ePlatform = ePlatform === 'O' ? 'Other' : ePlatform === 'A' ? 'Android' : ePlatform === 'I' ? 'iOS' : '--'
    return {
      ...withdrawalList,
      sUsername,
      sEmail,
      sMobNum,
      dWithdrawalTime,
      ePaymentStatus,
      sName,
      sInfo,
      ePlatform,
      ePaymentGateway,
      transactionId
    }
  })

  async function onExport () {
    if (startDate && endDate) {
      getList(start, offset, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, true)
      getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, props.startDate, props.endDate)
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, sort, order, searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, startDate, endDate, isFullResponse)
    getWithdrawalsTotalCountFunc(searchValue, paymentStatus, withdrawPaymentMethod, reversedInfo, props.startDate, props.endDate)
    setLoading(true)
    setPageNo(1)
  }

  function setModalOpenFunc (data) {
    setLogModal(true)
    dispatch(apiLogsTransaction(data?.id, 'W', token))
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
        data={fullList && fullList.count > 0 ? fullList : list}
        fileName={(startDate && endDate) ? `Withdrawals (${moment(startDate).format('MMMM Do YYYY, h-mm-ss a')} - ${moment(endDate).format('MMMM Do YYYY, h-mm-ss a')}).xlsx` : 'Withdrawals.xlsx'}
        ref={exporter}
      >
        <ExcelExportColumn field="id" title="ID" />
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile No" />
        <ExcelExportColumn field="sName" title="Withdrawal Done By" />
        <ExcelExportColumn field="transactionId" title="Transaction Id" />
        <ExcelExportColumn field="nAmount" title="Amount" />
        <ExcelExportColumn field="dWithdrawalTime" title="Withdrawal Time" />
        <ExcelExportColumn field="ePaymentStatus" title="Payment Status" />
        <ExcelExportColumn field="ePaymentGateway" title="Payment Gateway" />
        <ExcelExportColumn field="sInfo" title="Info" />
        <ExcelExportColumn field="ePlatform" title="Platform" />
      </ExcelExport>
      {loader && <Loading />}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Withdraw ID</th>
              <th>Username</th>
              <th>Mobile No.</th>
              <th>Amount</th>
              <th>Withdrawal Done By</th>
              <th>Transaction Id</th>
              <th>
                Request Date & Time
                <Button color="link" className="sort-btn" onClick={() => onSorting('dWithdrawalTime')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>
                Approval Date & Time
                <Button color="link" className="sort-btn" onClick={() => onSorting('dProcessedDate')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>
                <div>Status</div>
                <CustomInput
                  type="select"
                  name="Status"
                  id="Status"
                  value={paymentStatus}
                  className="mt-2"
                  onChange={(event) => onStatusChange(event)}
                >
                  <option value="">All</option>
                  <option value="P">Pending</option>
                  <option value="S">Success </option>
                  <option value="C">Cancelled </option>
                  <option value="R">Refunded </option>
                  <option value="I">Initiated </option>
                </CustomInput>
              </th>
              <th>
                <div>Gateway Info</div>
                <CustomInput
                  type="select"
                  name="GatewayInfo"
                  id="GatewayInfo"
                  value={withdrawPaymentMethod}
                  className="mt-2"
                  onChange={(event) => onMethodChange(event)}
                >
                  <option value="">All</option>
                  <option value="CASHFREE">CASHFREE </option>
                  <option value="ADMIN">ADMIN </option>
                </CustomInput>
              </th>
              <th>
                <div>Reversed</div>
                <CustomInput
                  type="select"
                  name="ReversedInfo"
                  id="ReversedInfo"
                  value={reversedInfo}
                  className="mt-2"
                  onChange={(event) => onReversedChange(event)}
                >
                  <option value="all">All</option>
                  <option value="y">Yes </option>
                  <option value="n">No </option>
                </CustomInput>
              </th>
              <th>Info</th>
              <th>Logs</th>
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
                        <td>{data.id ? data.id : '--'}</td>

                        {(adminPermission && adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS === 'N' && data.eUserType === 'U')
                          ? <td><Button color="link" className="view" tag={Link} to={`/users/user-management/user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                          : (adminPermission && adminPermission.USERS === 'N' && adminPermission.SYSTEM_USERS !== 'N' && data.eUserType !== 'U')
                              ? <td><Button color="link" className="view" tag={Link} to={`/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                              : (adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                                  ? <td><Button color="link" className="view" tag={Link} to={data.eUserType === 'U' ? `/users/user-management/user-details/${data.iUserId}` : `/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                                  : <td>{data.sUsername || '--'}</td>}

                        <td>{data.sMobNum || '--'}</td>
                        <td>{data.nAmount ? data.nAmount : '--'}</td>
                        <td>{data.sName ? data.sName : '--'}</td>
                        <td>{data.iTransactionId || '--'}</td>
                        <td>{data.dWithdrawalTime ? moment(data.dWithdrawalTime).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>{data.dProcessedDate ? moment(data.dProcessedDate).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>{data.ePaymentStatus === 'C' ? 'Cancelled' : data.ePaymentStatus === 'P' ? 'Pending' : data.ePaymentStatus === 'R' ? 'Refunded' : data.ePaymentStatus === 'S' ? 'Success' : data.ePaymentStatus === 'I' ? 'Initiated' : '--'}</td>
                        <td>{data.ePaymentGateway ? data.ePaymentGateway : '--'}</td>
                        <td>{data.bReversed ? 'Yes' : 'No'}</td>
                        <td><div className={data.sInfo && 'table-column-break'}>{data.sInfo ? data.sInfo : '--'}</div></td>
                        <td>
                          <ul className='action-list mb-0 d-flex'>
                            <li>
                              <Button color='link' onClick={() => setModalOpenFunc(data)}>
                                <img src={viewIcon} alt='View' />
                                View
                              </Button>
                            </li>
                          </ul>
                        </td>
                        {(data.ePaymentStatus === 'P' || data.ePaymentStatus === 'I')
                          ? (<td className='action-list'><Button color="link" className="success-btn mr-2" disabled={adminPermission?.WITHDRAW === 'R'} onClick={() => warningWithConfirmMessage('Approve', data.id)}><img src={rightIcon} alt="Approve" /><span>Approve</span></Button>
                          {/* <Button
                            color="link"
                            className="danger-btn"
                            disabled={adminPermission?.WITHDRAW === 'R'}
                            onClick={() => warningWithConfirmMessage('Reject', data.id)}
                          >
                            <img src={wrongIcon} alt="Reject" /><span>Reject</span>
                          </Button> */}
                            <UncontrolledDropdown disabled={adminPermission?.WITHDRAW === 'R'} className='d-inline-block'>
                              <DropdownToggle nav className='match-league-dropdown'>
                                <img src={wrongIcon} alt="Reject" /><span className='text-danger'>Reject</span>
                              </DropdownToggle>
                              <DropdownMenu container='body'>
                                <DropdownItem onClick={() => warningWithConfirmMessage('Reject', data.id, 'Incorrect bank details')}>Incorrect bank details</DropdownItem>
                                <DropdownItem onClick={() => warningWithConfirmMessage('Reject', data.id, 'Incomplete KYC')}>Incomplete KYC</DropdownItem>
                                <DropdownItem onClick={() => warningWithConfirmMessage('Reject', data.id, 'Non-linking of UAN with Aadhaar')}>Non-linking of UAN with Aadhaar</DropdownItem>
                                <DropdownItem onClick={() => warningWithConfirmMessage('Reject', data.id, 'Non-completion of conditions')}>Non-completion of conditions</DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>)
                          : data.ePaymentStatus === 'S' ? <td style={{ color: 'green' }}>Approved</td> : data.ePaymentStatus === 'C' ? <td style={{ color: 'red' }}>Cancelled</td> : data.ePaymentStatus === 'R' ? <td style={{ color: 'blue' }}>Refunded</td> : data.ePaymentStatus === 'I' ? <td style={{ color: '#8B8000' }}>Initiated</td> : ''}
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
            <h3>No WithdrawList available</h3>
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

      <Modal isOpen={modalMessage2}>
        <ModalBody>
          <Row>
            <Col>
              <Form>
                <FormGroup row>
                  <Label for="exampleEmail" sm={2}>Email</Label>
                  <CustomInput type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                </FormGroup>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button className="theme-btn success-btn full-btn" data-dismiss="modal" type="button" onClick={Completed}>Confirm</Button>
            </Col>
            <Col>
              <Button
                className="theme-btn danger-btn full-btn"
                data-dismiss="modal"
                type="button"
                onClick={() => setModalMessage2(false)}
              >
                Close
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className="text-center">
          <img className="info-icon" src={warningIcon} alt="check" />
          <h2>{`Are you sure you want to ${withdrawPaymentStatus} it?`}</h2>
          <Row className="row-12">
            <Col>
              <Button type="submit" className="theme-btn outline-btn full-btn" onClick={onCancel}>Cancel</Button>
            </Col>
            {
              <Col>
                <Button type="submit" className="theme-btn danger-btn full-btn" onClick={onStatusUpdate}>{`Yes, ${withdrawPaymentStatus} it`}</Button>
              </Col>
            }
          </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={logModal} toggle={toggleLogModal}>
        <ModalHeader toggle={toggleLogModal}>Withdrawals Log Details</ModalHeader>
        <ModalBody>
          <ReactJson src={logsData} displayDataTypes={false} collapsed={3} displayObjectSize={false} name='data' />
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

WithdrawManagement.propTypes = {
  getList: PropTypes.func,
  flag: PropTypes.bool,
  List: PropTypes.object,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  handleSearchDate: PropTypes.func,
  searchDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  getWithdrawalsTotalCountFunc: PropTypes.func
}

WithdrawManagement.displayName = WithdrawManagement

export default WithdrawManagement
