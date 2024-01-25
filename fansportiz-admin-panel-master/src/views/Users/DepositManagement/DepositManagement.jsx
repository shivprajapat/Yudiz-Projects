import React, {
  Fragment, useState, useRef, useEffect, forwardRef, useImperativeHandle
} from 'react'
import {
  Button, FormGroup, UncontrolledAlert, Modal, ModalBody, Row, Col, Form, Label, CustomInput, ModalHeader
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import rightIcon from '../../../assets/images/right-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import wrongIcon from '../../../assets/images/wrong-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import viewIcon from '../../../assets/images/view-icon.svg'
import { updatePaymentStatus } from '../../../actions/deposit'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import Loading from '../../../components/Loading'
import { apiLogsTransaction } from '../../../actions/apilogs'
import ReactJson from 'react-json-view'

const DepositManagement = forwardRef((props, ref) => {
  const {
    getList,
    List,
    flag,
    startDate,
    endDate,
    getDepositsTotalCountFunc
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
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order] = useQueryState('order', 'desc')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [searchValue, setSearchValue] = useQueryState('searchValue', '')
  const [paymentStatus, setPaymentStatus] = useQueryState('status', '')
  const [depositPaymentMethod, setDepositPaymentMethod] = useQueryState('method', '')
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalMessage2, setModalMessage2] = useState(false)
  const [logModal, setLogModal] = useState(false)
  const [depositPaymentStatus, setDepositPaymentStatus] = useState('')
  const [UserID, setUserID] = useState('')
  const dispatch = useDispatch('')
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const toggleLogModal = () => setLogModal(!logModal)
  const depositsTotalCount = useSelector(state => state.deposit.depositsTotalCount)
  const resStatus = useSelector(state => state.deposit.resStatus)
  const resMessage = useSelector(state => state.deposit.resMessage)
  const isFullList = useSelector(state => state.deposit.isFullResponse)
  const logsData = useSelector(state => state.apilogs.logs)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const obj = qs.parse(props.location.search)
  const previousProps = useRef({
    resStatus, resMessage, List, paymentStatus, depositPaymentMethod, search, startDate, endDate, start, offset, depositsTotalCount
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
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
        getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      getDepositsTotalCountFunc(props.search, paymentStatus, depositPaymentMethod, startDate, endDate)
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
      } else if (depositsTotalCount?.count === List?.rows?.length && isFullList) {
        setFullList(List.rows ? List.rows : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.rows ? List.rows : []),
          fileName: 'Deposits.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
      setLoading(false)
    }
    if (previousProps.depositsTotalCount !== depositsTotalCount && depositsTotalCount) {
      setTotal(depositsTotalCount?.count ? depositsTotalCount?.count : 0)
    }
    return () => {
      previousProps.List = List
      previousProps.depositsTotalCount = depositsTotalCount
    }
  }, [List, depositsTotalCount])

  useEffect(() => {
    if (previousProps.depositPaymentMethod !== depositPaymentMethod) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate)
      setPageNo(1)
    }
    return () => {
      previousProps.depositPaymentMethod = depositPaymentMethod
    }
  }, [depositPaymentMethod])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
          getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate)
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
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, props.startDate, props.endDate, isFullResponse)
        getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, props.startDate, props.endDate)
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
        getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, props.startDate, props.endDate, isFullResponse)
        getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, props.startDate, props.endDate)
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
      getList(startFrom, limit, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate)
      setPageNo(1)
    }
    return () => {
      previousProps.paymentStatus = paymentStatus
    }
  }, [paymentStatus])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
      getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function Completed () {
    setModalMessage2(false)
  }

  function onStatusChange (event) {
    setPaymentStatus(event.target.value)
  }
  function onMethodChange (event) {
    setDepositPaymentMethod(event.target.value)
  }
  function warningWithConfirmMessage (PaymentStatus, id) {
    setDepositPaymentStatus(PaymentStatus)
    setUserID(id)
    setModalWarning(true)
  }

  function onStatusUpdate () {
    const Status = depositPaymentStatus === 'Approve' ? 'S' : depositPaymentStatus === 'Reject' ? 'C' : ''
    dispatch(updatePaymentStatus(Status, UserID, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
  }

  const processExcelExportData = data => data.map((depositsList) => {
    const sEmail = depositsList.sEmail || '--'
    const iTransactionId = depositsList.iTransactionId || '--'
    let ePaymentStatus = depositsList.ePaymentStatus
    let sInfo = depositsList.sInfo
    let sPromocode = depositsList.sPromocode
    let depositDate = moment(depositsList.dUpdatedAt).local().format('ll')
    depositDate = depositDate === 'Invalid date' ? ' - ' : depositDate
    let depositTime = moment(depositsList.dUpdatedAt).local().format('LT')
    depositTime = depositTime === 'Invalid date' ? ' - ' : depositTime
    ePaymentStatus = ePaymentStatus === 'C' ? 'Cancelled' : ePaymentStatus === 'P' ? 'Pending' : ePaymentStatus === 'R' ? 'Refunded' : ePaymentStatus === 'S' ? 'Success' : '--'
    sInfo = sInfo || '--'
    sPromocode = sPromocode || '--'
    return {
      ...depositsList,
      sEmail,
      iTransactionId,
      depositDate,
      depositTime,
      ePaymentStatus,
      sInfo,
      sPromocode
    }
  })

  async function onExport () {
    if (startDate && endDate) {
      await getList(start, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, true)
      getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate)
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, sort, order, searchValue, paymentStatus, depositPaymentMethod, startDate, endDate, isFullResponse)
    getDepositsTotalCountFunc(searchValue, paymentStatus, depositPaymentMethod, startDate, endDate)
    setLoading(true)
    setPageNo(1)
  }

  function setModalOpenFunc (data) {
    setLogModal(true)
    dispatch(apiLogsTransaction(data?.id, 'D', token))
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
        fileName={(startDate && endDate) ? `Deposits (${moment(startDate).format('MMMM Do YYYY, h-mm-ss a')} - ${moment(endDate).format('MMMM Do YYYY, h-mm-ss a')}).xlsx` : 'Deposits.xlsx'}
        ref={exporter}
      >
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile No" />
        <ExcelExportColumn field="id" title="Transaction Id" />
        <ExcelExportColumn field="iTransactionId" title="Reference Id" />
        <ExcelExportColumn field="nAmount" title="Amount" />
        <ExcelExportColumn field="nBonus" title="Bonus" />
        <ExcelExportColumn field="nCash" title="Cash" />
        <ExcelExportColumn field="depositDate" title="Deposit Date" />
        <ExcelExportColumn field="depositTime" title="Deposit Time" />
        <ExcelExportColumn field="ePaymentStatus" title="Payment Status" />
        <ExcelExportColumn field="ePaymentGateway" title="Payment Gateway" />
        <ExcelExportColumn field="sPromocode" title="Promocode" />
        <ExcelExportColumn field="sInfo" title="Info" />
      </ExcelExport>
      {loader && <Loading />}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Username</th>
              <th>Mobile No.</th>
              <th>Amount<br></br>(Cash + Bonus)</th>
              <th>Promo Code</th>
              <th>Deposit Date</th>
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
                </CustomInput>
              </th>
              <th>
                <div>Gateway Info</div>
                <CustomInput
                  type="select"
                  name="GatewayInfo"
                  id="GatewayInfo"
                  value={depositPaymentMethod}
                  className="mt-2"
                  onChange={(event) => onMethodChange(event)}
                >
                  <option value="">All</option>
                  <option value="ADMIN">ADMIN </option>
                  <option value="CASHFREE">CASHFREE </option>
                </CustomInput>
              </th>
              <th>Info</th>
              <th>Logs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={11} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={i}>
                        <td>{data.id}</td>

                          {(adminPermission && adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS === 'N' && data.eUserType === 'U')
                            ? <td><Button color="link" className="view" tag={Link} to={`/users/user-management/user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                            : (adminPermission && adminPermission.USERS === 'N' && adminPermission.SYSTEM_USERS !== 'N' && data.eUserType !== 'U')
                                ? <td><Button color="link" className="view" tag={Link} to={`/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                                : (adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                                    ? <td><Button color="link" className="view" tag={Link} to={data.eUserType === 'U' ? `/users/user-management/user-details/${data.iUserId}` : `/users/system-user/system-user-details/${data.iUserId}`}>{data.sUsername || '--'}</Button></td>
                                    : <td>{data.sUsername || '--'}</td>}

                        <td>{data.sMobNum || '--'}</td>
                        <td>{data.nAmount ? data.nAmount : '--'}<br></br>({data.nCash ? data.nCash : 0} + {data.nBonus ? data.nBonus : 0})</td>
                        <td>{data.sPromocode || '--'}</td>
                        <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD-MM-YYYY') : '--'}</td>
                        <td>{data.ePaymentStatus === 'C' ? 'Cancelled' : data.ePaymentStatus === 'P' ? 'Pending' : data.ePaymentStatus === 'R' ? 'Refunded' : data.ePaymentStatus === 'S' ? 'Success' : '--'}</td>
                        <td>{data.ePaymentGateway ? data.ePaymentGateway : '--'}</td>
                        <td>{data.ePaymentGateway === 'CASHFREE' ? `Deposit from CASHFREE TransactionId : ${data.iTransactionId ? data.iTransactionId : 'NA'}` : data.sInfo ? data.sInfo : '--'}{data.iOrderId && <p className='mb-0'>{data.iOrderId ? `Order Id : ${data.iOrderId}` : '--'}</p>}</td>
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
                        {data.ePaymentStatus === 'P'
                          ? (<td className='action-list'><Button color="link" className="success-btn" disabled={adminPermission?.DEPOSIT === 'R'} onClick={() => warningWithConfirmMessage('Approve', data.id)}><img src={rightIcon} alt="Approve" /><span>Approve</span></Button>
                          <Button color="link" className="danger-btn" disabled={adminPermission?.DEPOSIT === 'R'} onClick={() => warningWithConfirmMessage('Reject', data.id)}><img src={wrongIcon} alt="Reject" /><span>Reject</span></Button>
                          </td>)
                          : data.ePaymentStatus === 'S' ? <td style={{ color: 'green' }}>Approved</td> : data.ePaymentStatus === 'C' ? <td style={{ color: 'red' }}>Cancelled</td> : data.ePaymentStatus === 'R' ? <td style={{ color: 'blue' }}>Refunded</td> : ''}
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
            <h3>No Deposit List available</h3>
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
          <h2>{`Are you sure you want to ${depositPaymentStatus} it?`}</h2>
          <Row className="row-12">
            <Col>
              <Button type="submit" className="theme-btn outline-btn full-btn" onClick={onCancel}>Cancel</Button>
            </Col>
            {
                <Col>
                  <Button type="submit" className="theme-btn danger-btn full-btn" onClick={onStatusUpdate}>{`Yes, ${depositPaymentStatus} it`}</Button>
                </Col>
            }
          </Row>
        </ModalBody>
      </Modal>

      <Modal isOpen={logModal} toggle={toggleLogModal}>
        <ModalHeader toggle={toggleLogModal}>Transaction Log Details</ModalHeader>
        <ModalBody>
          <ReactJson src={logsData} displayDataTypes={false} collapsed={3} displayObjectSize={false} name='data' />
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

DepositManagement.propTypes = {
  getList: PropTypes.func,
  List: PropTypes.object,
  flag: PropTypes.bool,
  search: PropTypes.string,
  searchBox: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  handle: PropTypes.func,
  getDepositsTotalCountFunc: PropTypes.func
}

DepositManagement.displayName = DepositManagement

export default DepositManagement
