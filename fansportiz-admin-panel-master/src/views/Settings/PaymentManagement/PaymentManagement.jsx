import React, {
  Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle
} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import {
  CustomInput, UncontrolledAlert, Modal, ModalBody, Row, Col, Button
} from 'reactstrap'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import viewIcon from '../../../assets/images/view-icon.svg'
import { updatePayment } from '../../../actions/payment'
import SkeletonTable from '../../../components/SkeletonTable'
import { getUrl } from '../../../actions/url'
import warningIcon from '../../../assets/images/warning-icon.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import PropTypes from 'prop-types'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const PaymentManagementComponent = forwardRef((props, ref) => {
  const { getList, paymentList } = props
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'asc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [type, setType] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const resStatus = useSelector(state => state.payment.resStatus)
  const resMessage = useSelector(state => state.payment.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const searchProp = props.search
  const previousProps = useRef({ paymentList, resStatus, resMessage, searchProp, start, offset }).current
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
    let order = 'desc'
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
      if (obj.order) {
        order = obj.order
        setOrder(order)
      }
    }
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.paymentList !== paymentList) {
      if (paymentList) {
        if (paymentList.results) {
          const userArrLength = paymentList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(paymentList.results ? paymentList.results : [])
        setIndex(activePageNo)
        setTotal(paymentList.total ? paymentList.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.paymentList = paymentList
    }
  }, [paymentList])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, sort, order, search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(activePageNo)
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
        PaymentManagement: props.location.search
      }
      : data.PaymentManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search)
      setSearch(searchProp.trim())
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

  function onSorting (sortingBy) {
    if (order === 'desc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onCancel () {
    toggleWarning()
  }

  function onStatusUpdate () {
    const statuss = !selectedData.bEnable
    const updatedPaymentData = {
      Offer: selectedData.sOffer,
      Name: selectedData.sName,
      Key: selectedData.eKey,
      PaymentImage: selectedData.sImage,
      Order: selectedData.nOrder,
      PaymentStatus: statuss,
      token,
      PaymentId: selectedData._id
    }
    dispatch(updatePayment(updatedPaymentData))
    setLoading(true)
    toggleWarning()
  }

  const processExcelExportData = data => data.map((listOfPayments) => {
    let bEnable = listOfPayments.bEnable
    bEnable = bEnable ? 'Active' : 'InActive'
    return {
      ...listOfPayments,
      bEnable
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'PaymentMethods.xlsx' }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <ExcelExport
        data={list}
        fileName="PaymentMethods.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sName" title="Name" />
        <ExcelExportColumn field="eKey" title="Key" />
        <ExcelExportColumn field="sOffer" title="Offer" />
        <ExcelExportColumn field="nOrder" title="Order" />
        <ExcelExportColumn field="bEnable" title="Status" />
      </ExcelExport>
      <div className="table-responsive">
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Name</th>
              <th>Key</th>
              <th>Offer</th>
              <th>
                <span className="d-inline-block align-middle">Order</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('nOrder')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Image</th>
              <th>Status</th>
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
                        <td>{data.sName ? data.sName : '-'}</td>
                        <td>{data.eKey ? data.eKey : '-'}</td>
                        <td>{data.sOffer ? data.sOffer : '-'}</td>
                        <td>{data.nOrder ? data.nOrder : '-'}</td>
                        <td>{data.sImage
                          ? <img src={url + data.sImage} className="theme-image" alt="payment" />
                          : 'No Image' }
                        </td>
                        <td>
                          <CustomInput type="switch" id={`switch${i + 1}`} name={`switch${i + 1}`}
                            onClick={() =>
                              warningWithConfirmMessage(
                                data,
                                data.bEnable ? 'inactivate' : 'activate'
                              )}
                              checked={data.bEnable}
                              disabled={adminPermission?.PAYMENT_OPTION === 'R'}
                              />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink color="link" className="view" to={`/settings/payment-details/${data._id}`}>
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
            <h3>No Payment Method List available</h3>
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
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type='submit'
                className='theme-btn danger-btn full-btn'
                onClick={onStatusUpdate}
              >
                {`Yes, ${type} it`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

PaymentManagementComponent.propTypes = {
  getList: PropTypes.func,
  paymentList: PropTypes.object,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool
}

PaymentManagementComponent.displayName = PaymentManagementComponent

export default connect(null, null, null, { forwardRef: true })(PaymentManagementComponent)
