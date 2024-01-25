import React, { Fragment, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, CustomInput, Modal, ModalBody, Row, Col, UncontrolledAlert
} from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { NavLink } from 'react-router-dom'
import qs from 'query-string'
import moment from 'moment'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import viewIcon from '../../../assets/images/view-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import statistics from '../../../assets/images/statistics-com.svg'
import { deletePromocode } from '../../../actions/promocode'
import SkeletonTable from '../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const PromocodeManagement = forwardRef((props, ref) => {
  const { getList, promocodeList, updatePromo, startDate, endDate } = props
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [promoType, setPromoType] = useQueryState('type', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'des')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [deleteId, setDeleteId] = useState('')

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.promocode.resStatus)
  const resMessage = useSelector(state => state.promocode.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const searchProp = props.search
  const previousProps = useRef({ promocodeList, searchProp, resMessage, startDate, endDate, promoType, start, offset }).current
  const obj = qs.parse(props.location.search)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (props.location.state) {
      setModalMessage(true)
      setMessage(props.location.state.message)
      setStatus(true)
      props.history.replace()
    }
    let page = 1
    let limit = offset
    let order = 'desc'
    let searchText = ''
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
        order = obj.order
        setOrder(order)
      }
      if (obj.search) {
        searchText = obj.search
        setSearch(obj.search)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, order, searchText, promoType, dateFrom, dateTo)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search, promoType, dateFrom, dateTo)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search, promoType, dateFrom, dateTo)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(activePageNo)
          }
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
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
    if (previousProps.promoType !== promoType) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, promoType, dateFrom, dateTo)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.promoType = promoType
    }
  }, [promoType])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        PromoCodeManagement: props.location.search
      }
      : data.PromoCodeManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.promocodeList !== promocodeList) {
      if (promocodeList) {
        if (promocodeList.results) {
          const userArrLength = promocodeList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(promocodeList.results)
        setIndex(activePageNo)
        setTotal(promocodeList.total ? promocodeList.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.promocodeList = promocodeList
    }
  }, [promocodeList])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, promoType, dateFrom, dateTo)
      setSearch(searchProp.trim())
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
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, props.search, promoType, props.startDate, props.endDate)
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
        getList(startFrom, limit, sort, order, props.search, promoType, props.startDate, props.endDate)
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
      getList(start, offset, sort, order, search, promoType, dateFrom, dateTo)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onFiltering (event) {
    setPromoType(event.target.value)
  }

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deletePromocode(deleteId, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedPromoData = {
      promoType: selectedData.eType,
      selectedMatches: selectedData.aMatches,
      selectedLeagues: selectedData.aLeagues,
      expiryDays: selectedData.nBonusExpireDays,
      Name: selectedData.sName,
      CouponCode: selectedData.sCode,
      description: selectedData.sInfo,
      amount: selectedData.nAmount,
      minAmount: selectedData.nMinAmount,
      maxAmount: selectedData.nMaxAmount,
      maxAllow: selectedData.nMaxAllow,
      startingDate: selectedData.dStartTime,
      endingDate: selectedData.dExpireTime,
      Percentage: selectedData.bIsPercent,
      maxAllowPerUser: selectedData.nPerUserUsage,
      promocodeStatus: statuss,
      token,
      promocodeId: selectedData._id
    }
    updatePromo(updatedPromoData, selectedData._id)
    setLoading(true)
    toggleWarning()
  }

  function onSorting (sortingBy) {
    setSort(sortingBy)
    if (order === 'desc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, promoType, dateFrom, dateTo)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, promoType, dateFrom, dateTo)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  const processExcelExportData = data => data.map((PromoCodeList) => {
    let dStartTime = moment(PromoCodeList.dStartTime).local().format('lll')
    let dExpireTime = moment(PromoCodeList.dExpireTime).local().format('lll')
    let eStatus = PromoCodeList.eStatus
    let nBonusExpireDays = PromoCodeList.nBonusExpireDays
    const nAmount = PromoCodeList.bIsPercent ? `Rs. ${PromoCodeList.nAmount}` : `${PromoCodeList.nAmount}%`
    const nMinAmount = PromoCodeList.nMinAmount ? PromoCodeList.nMinAmount : 0
    const nMaxAmount = PromoCodeList.nMaxAmount ? PromoCodeList.nMaxAmount : 0
    dStartTime = dStartTime === 'Invalid date' ? ' - ' : dStartTime
    dExpireTime = dExpireTime === 'Invalid date' ? ' - ' : dExpireTime
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    nBonusExpireDays = nBonusExpireDays || '--'

    return {
      ...PromoCodeList,
      dStartTime,
      dExpireTime,
      nAmount,
      nMinAmount,
      nMaxAmount,
      nBonusExpireDays,
      eStatus
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'Promocode.xlsx' }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
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
        fileName="Promocode.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="eType" title="Promocode Type" />
        <ExcelExportColumn field="sCode" title="Promocode" />
        <ExcelExportColumn field="nAmount" title="Amount" />
        <ExcelExportColumn field="nMinAmount" title="MinAmount" />
        <ExcelExportColumn field="nMaxAmount" title="MaxAmount" />
        <ExcelExportColumn field="nMaxAllow" title="MaxAllow" />
        <ExcelExportColumn field="dStartTime" title="StartDate" />
        <ExcelExportColumn field="dExpireTime" title="EndDate" />
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="sInfo" title="Info" />
        <ExcelExportColumn field="nBonusExpireDays" title="Bonus Expire Days" />
      </ExcelExport>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>
                <div>Type</div>
                <CustomInput
                  type="select"
                  name="promoType"
                  id="promoType"
                  value={promoType}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-100'}`}
                  onChange={(event) => onFiltering(event)}
                >
                  <option value="">All</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="MATCH">Match</option>
                </CustomInput>
              </th>
              <th>Coupon Code</th>
              <th>
                <span className="d-inline-block align-middle">Amount/Percentage</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('nAmount')}><img src={sortIcon} className="m-0" alt="sorting" /></Button></th>
              <th>
                <span className="d-inline-block align-middle">Min Amount</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('nMinAmount')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>
                <span className="d-inline-block align-middle">Max Amount</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('nMaxAmount')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>
                <span className="d-inline-block align-middle">Max Allow</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('nMaxAllow')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Statistics</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={12} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.eType ? data.eType : '--'}</td>
                        <td>{data.sCode}</td>
                        <td>{data.nAmount ? data.nAmount : '--'}</td>
                        <td>{data.nMinAmount ? `₹${data.nMinAmount}` : '--'}</td>
                        <td>{data.nMaxAmount ? `₹${data.nMaxAmount}` : '--'}</td>
                        <td>{data.nMaxAllow}</td>
                        <td>{moment(data.dStartTime).format('lll')}</td>
                        <td>{moment(data.dExpireTime).format('lll')}</td>
                        <td>
                          <CustomInput
                            type='switch'
                            id={`${data._id}`}
                            name={`${data._id}`}
                            onChange={() =>
                              warningWithConfirmMessage(
                                data,
                                data.eStatus === 'Y' ? 'Inactivate' : 'activate'
                              )
                            }
                            checked={data.eStatus === 'Y'}
                            disabled={adminPermission?.PROMO === 'R'
                            }
                          />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink to={`/settings/promocode-statistics/${data._id}`} className="view">
                                <img src={statistics} alt="View" style={{ height: '40px', width: '40px' }} />
                              </NavLink>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink to={`/settings/promocode-details/${data._id}`} className="view">
                                <img src={viewIcon} alt="View" />
                                <span>View</span>
                              </NavLink>
                            </li>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')) &&
                              (
                                <Fragment>
                                  <li onClick={() => warningWithDeleteMessage(data._id, 'delete')}>
                                    <Button color="link" className="delete">
                                      <img src={deleteIcon} alt="Delete" />
                                      <span>Delete</span>
                                    </Button>
                                  </li>
                                </Fragment>
                              )
                            }
                          </ul>
                        </td>
                      </tr>
                    ))}
                </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {
       !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Promo Codes available</h3>
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

      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className='text-center'>
            <img className='info-icon' src={warningIcon} alt='check' />
            <h2>{`Are you sure you want to ${type} it?`}</h2>
            <Row className='row-12'>
              <Col>
                <Button
                  type='submit'
                  className='theme-btn outline-btn full-btn'
                  onClick={deleteId ? onCancel : toggleWarning}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button
                  type='submit'
                  className='theme-btn danger-btn full-btn'
                  onClick={deleteId ? onDelete : onStatusUpdate}
                >
                  {' '}
                  {deleteId ? 'Yes, Delete It' : `Yes, ${type} it`}
                </Button>
              </Col>
            </Row>
          </ModalBody>
      </Modal>
    </Fragment>
  )
})

PromocodeManagement.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  promocodeList: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  openDatePicker: PropTypes.bool,
  updatePromo: PropTypes.func
}

PromocodeManagement.displayName = PromocodeManagement

export default connect(null, null, null, { forwardRef: true })(PromocodeManagement)
