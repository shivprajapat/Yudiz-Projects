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
import { updatePayout } from '../../../actions/payout'
import SkeletonTable from '../../../components/SkeletonTable'
import { getUrl } from '../../../actions/url'
import warningIcon from '../../../assets/images/warning-icon.svg'
import PropTypes from 'prop-types'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const PayoutComponent = forwardRef((props, ref) => {
  const { getList, payoutList } = props
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
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.payout.resStatus)
  const resMessage = useSelector(state => state.payout.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const searchProp = props.search
  const previousProps = useRef({ payoutList, resStatus, resMessage, searchProp, start, offset }).current
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
    let orderBy = 'asc'
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
        orderBy = obj.order
        setOrder(orderBy)
      }
    }
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, orderBy, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.payoutList !== payoutList) {
      if (payoutList) {
        if (payoutList.results) {
          const userArrLength = payoutList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(payoutList.results ? payoutList.results : [])
        setIndex(activePageNo)
        setTotal(payoutList.total ? payoutList.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.payoutList = payoutList
    }
  }, [payoutList])

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
        PayoutManagement: props.location.search
      }
      : data.PayoutManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search)
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
      title: selectedData.sTitle,
      type: selectedData.eType,
      key: selectedData.eKey,
      withdrawFee: selectedData.nWithdrawFee,
      minAmount: selectedData.nMinAmount,
      maxAmount: selectedData.nMaxAmount,
      payoutImage: selectedData.sImage,
      payoutStatus: statuss,
      info: selectedData.sInfo,
      token,
      payoutId: selectedData._id
    }
    dispatch(updatePayout(updatedPaymentData))
    setLoading(true)
    toggleWarning()
  }

  const processExcelExportData = data => data.map((payoutMethods) => {
    let bEnable = payoutMethods.bEnable
    const nMinAmount = payoutMethods.nMinAmount || 0
    const nMaxAmount = payoutMethods.nMaxAmount || 0
    const nWithdrawFee = payoutMethods.nWithdrawFee || 0
    bEnable = bEnable ? 'Active' : 'InActive'
    return {
      ...payoutMethods,
      nWithdrawFee,
      nMinAmount,
      nMaxAmount,
      bEnable
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'PayoutList.xlsx' }
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
        fileName="PayoutList.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="eKey" title="Key" />
        <ExcelExportColumn field="nMinAmount" title="Min" />
        <ExcelExportColumn field="nMaxAmount" title="Max" />
        <ExcelExportColumn field="nWithdrawFee" title="Withdraw Fee" />
        <ExcelExportColumn field="sInfo" title="Info" />
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
              <th>Title</th>
              <th>Key</th>
              <th>Type</th>
              <th>Min</th>
              <th>Max</th>
              <th>Withdraw Fee</th>
              <th>Info</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={11} />
              : (
                <Fragment>
                  {
                  list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sTitle ? data.sTitle : '-'}</td>
                        <td>{data.eKey ? data.eKey : '-'}</td>
                        <td>{data.eType ? data.eType : '-'}</td>
                        <td>{data.nMinAmount || '--'}</td>
                        <td>{data.nMaxAmount || '--'}</td>
                        <td>{data.nWithdrawFee || '--'}</td>
                        <td>{data.sInfo ? data.sInfo : '-'}</td>
                        <td>
                          {data.sImage
                            ? <img src={url + data.sImage} className="theme-image" alt="payout" />
                            : 'No Image'}
                        </td>
                        <td>
                          <CustomInput type="switch" id={`switch${i + 1}`} name={`switch${i + 1}`}
                            onClick={() =>
                              warningWithConfirmMessage(
                                data,
                                data.bEnable ? 'inactivate' : 'activate'
                              )}
                              checked={data.bEnable}
                              disabled={adminPermission?.PAYOUT_OPTION === 'R'
                              }
                            />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink color="link" className="view" to={`/settings/payout-details/${data._id}`}>
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
            <h3>No Payout Method List available</h3>
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

PayoutComponent.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  getList: PropTypes.func,
  payoutList: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool
}

PayoutComponent.displayName = PayoutComponent

export default connect(null, null, null, { forwardRef: true })(PayoutComponent)
