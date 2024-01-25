import React, { Fragment, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  Button, CustomInput, Modal, ModalBody, Row, Col, UncontrolledAlert
} from 'reactstrap'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import viewIcon from '../../../assets/images/view-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { deleteOffer } from '../../../actions/offers'
import { getUrl } from '../../../actions/url'
import SkeletonTable from '../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const OfferManagementContent = forwardRef((props, ref) => {
  const { offerList, getList, updateOfferFunc } = props
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [list, setList] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [url, setUrl] = useState('')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')

  const dispatch = useDispatch()
  const resStatus = useSelector(state => state.offers.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const resMessage = useSelector(state => state.offers.resMessage)
  const searchProp = props.search
  const previousProps = useRef({ offerList, searchProp, resMessage, resStatus, start, offset }).current
  const paginationFlag = useRef(false)

  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    dispatch(getUrl('media'))
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
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.offerList !== offerList) {
      if (offerList) {
        if (offerList.results) {
          const userArrLength = offerList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(offerList.results ? offerList.results : [])
        setIndex(activePageNo)
        setTotal(offerList.total ? offerList.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.offerList = offerList
    }
  }, [offerList])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search)
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
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        OfferManagement: props.location.search
      }
      : data.OfferManagement = props.location.search
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

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deleteOffer(deleteId, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedOfferData = {
      Title: selectedData.sTitle,
      offerImage: selectedData.sImage,
      Details: selectedData.sDetail,
      Description: selectedData.sDescription,
      Active: statuss
    }
    updateOfferFunc(updatedOfferData, selectedData._id)
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  const processExcelExportData = data => data.map((offersList) => {
    let eStatus = offersList.eStatus
    let sDetail = document.createElement('div')
    sDetail.innerHTML = offersList.sDetail
    sDetail = sDetail.innerText
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    return {
      ...offersList,
      eStatus,
      sDetail
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'Offers.xlsx' }
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
        fileName="Offer.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="sDetail" title="Details" />
        <ExcelExportColumn field="eStatus" title="Status" />
      </ExcelExport>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Title</th>
              <th> Short Description</th>
              <th>Image</th>
              <th> Status </th>
              <th> Actions </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={6} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 &&
                    list.map((data, i) => {
                      return (
                      <tr key={data._id} className={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sTitle}</td>
                        <td>{data.sDescription}</td>
                        <td>{data.sImage ? <img src={url + data.sImage} alt="Offer Image" height={50} width={70} /> : ' No Image '}</td>
                        <td className="success-text">
                          <CustomInput
                            type='switch'
                            id={`${data._id}`}
                            key={`${data._id}`}
                            name={`${data._id}`}
                            onClick={() =>
                              warningWithConfirmMessage(
                                data,
                                data.eStatus === 'Y' ? 'Inactivate' : 'activate'
                              )
                            }
                            checked={data.eStatus === 'Y'}
                            disabled={adminPermission?.OFFER === 'R'}
                          />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink color="link" to={`/settings/offer-details/${data._id}`} className="view">
                                <img src={viewIcon} alt="View" />
                                View
                              </NavLink>
                            </li>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.OFFER !== 'R')) &&
                              (
                                <Fragment>
                                  <li>
                                    <Button color="link" className="delete" onClick={() => warningWithDeleteMessage(data._id, 'delete')}>
                                      <img src={deleteIcon} alt="Delete" />
                                      Delete
                                    </Button>
                                  </li>
                                </Fragment>
                              )
                            }
                          </ul>
                        </td>
                      </tr>
                      )
                    })}
                </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Offers available</h3>
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

OfferManagementContent.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  offerList: PropTypes.arrayOf(PropTypes.object),
  updateOfferFunc: PropTypes.func
}

OfferManagementContent.displayName = OfferManagementContent

export default connect(null, null, null, { forwardRef: true })(OfferManagementContent)
