import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
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
import deleteIcon from '../../../assets/images/delete-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import { getUrl } from '../../../actions/url'
import PropTypes from 'prop-types'
import { deletePopUpAd, updatePopupAd } from '../../../actions/popup'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const PopUpAdsList = forwardRef((props, ref) => {
  const { getList, popUpAdsList } = props
  const searchProp = props.search
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [type, setType] = useQueryState('type', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [url, setUrl] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [actionType, setActionType] = useState('')
  const [search, setSearch] = useQueryState('search', '')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resMessage = useSelector(state => state.popup.resMessage)
  const resStatus = useSelector(state => state.popup.resStatus)
  const previousProps = useRef({ popUpAdsList, type, resMessage, resStatus }).current
  const paginationFlag = useRef(false)

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
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, type, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.popUpAdsList !== popUpAdsList) {
      if (popUpAdsList) {
        if (popUpAdsList.results) {
          const userArrLength = popUpAdsList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(popUpAdsList.results ? popUpAdsList.results : [])
        setIndex(activePageNo)
        setLoading(false)
        setTotal(popUpAdsList.total ? popUpAdsList.total : 0)
      }
    }
    return () => {
      previousProps.popUpAdsList = popUpAdsList
    }
  }, [popUpAdsList])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, type, props.search)
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
    if (previousProps.type !== type) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, type, search)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.type = type
    }
  }, [type])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, type, search)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setPageNo(1)
            setModalMessage(true)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, type, search)
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
        PopupAdsManagement: props.location.search
      }
      : data.PopupAdsManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  function warningWithConfirmMessage (data, eType) {
    setActionType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function warningWithDeleteMessage (Id, eType) {
    setActionType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deletePopUpAd(deleteId, token))
    setModalWarning(false)
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedPromoData = {
      title: selectedData.sTitle,
      adImage: selectedData.sImage,
      type: selectedData.eType,
      Link: selectedData.sLink,
      category: selectedData.eCategory,
      Match: selectedData.iMatchId,
      League: selectedData.iMatchLeagueId,
      platform: selectedData.ePlatform,
      adStatus: statuss,
      token,
      popupAdId: selectedData._id
    }
    dispatch(updatePopupAd(updatedPromoData, selectedData._id))
    setLoading(true)
    toggleWarning()
  }

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, type, search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])
  function onFiltering (event) {
    setType(event.target.value)
  }

  const processExcelExportData = data => data.map((popupAdsList) => {
    const eType = popupAdsList.eType === 'I' ? 'Internal' : 'External'
    const ePlatform = popupAdsList.ePlatform && popupAdsList.ePlatform === 'ALL' ? 'All' : popupAdsList.ePlatform === 'W' ? 'Web' : popupAdsList.ePlatform === 'A' ? 'Android' : popupAdsList.ePlatform === 'I' ? 'iOS' : '--'
    const sTitle = popupAdsList.sTitle ? popupAdsList.sTitle : '--'
    const sLink = popupAdsList.sLink ? popupAdsList.sLink : '--'
    const eCategory = popupAdsList.eCategory ? popupAdsList.eCategory : '--'
    const eStatus = popupAdsList.eStatus === 'Y' ? 'Active' : 'InActive'

    return {
      ...popupAdsList,
      eType,
      ePlatform,
      sTitle,
      sLink,
      eCategory,
      eStatus
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'PopupAds.xlsx' }
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
        fileName="PopupAds.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="eCategory" title="Category" />
        <ExcelExportColumn field="sLink" title="Link" />
        <ExcelExportColumn field="ePlatform" title="Platform" />
        <ExcelExportColumn field="eStatus" title="Status" />
      </ExcelExport>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Title</th>
              <th>
                <div>Type</div>
                <CustomInput
                  type="select"
                  name="type"
                  id="type"
                  value={type}
                  className='mt-2'
                  onChange={(event) => onFiltering(event)}
                >
                  <option value="">All</option>
                  <option value="I">Internal</option>
                  <option value="E">External</option>
                </CustomInput>
              </th>
              <th>Category</th>
              <th>Link</th>
              <th>Platform</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={9} />
              : (
                <Fragment>
                  {
                  list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sTitle ? data.sTitle : '--' }</td>
                        <td>{data.eType === 'I' ? 'Internal' : 'External'}</td>
                        <td>{data.eCategory ? data.eCategory : '--' }</td>
                        <td>{data.sLink ? data.sLink : '--' }</td>
                        <td>{data.ePlatform && data.ePlatform === 'ALL' ? 'All' : data.ePlatform === 'W' ? 'Web' : data.ePlatform === 'A' ? 'Android' : data.ePlatform === 'I' ? 'iOS' : '--'}</td>
                        <td>{data.sImage
                          ? <img src={url + data.sImage} className="theme-image" alt="popup" />
                          : 'No Image'}
                        </td>
                        <td>
                          <CustomInput
                            type='switch'
                            id={`${data._id}`}
                            name={`${data._id}`}
                            onClick={() =>
                              warningWithConfirmMessage(
                                data,
                                data.eStatus === 'Y' ? 'Inactivate' : 'activate'
                              )
                            }
                            checked={data.eStatus === 'Y'}
                            disabled={adminPermission?.POPUP_ADS === 'R'
                            }
                          />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink color="link" className="view" to={`/settings/update-popup-ad/${data._id}`}>
                                <img src={viewIcon} alt="View" />
                                <span>View</span>
                              </NavLink>
                            </li>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.POPUP_ADS !== 'R')) &&
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
            <h3>No Popup Ads available</h3>
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
          <h2>{`Are you sure you want to ${actionType} it?`}</h2>
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
                {deleteId ? 'Yes, Delete It' : `Yes, ${actionType} it`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

    </Fragment>
  )
})

PopUpAdsList.propTypes = {
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  popUpAdsList: PropTypes.object
}

PopUpAdsList.displayName = PopUpAdsList

export default connect(null, null, null, { forwardRef: true })(PopUpAdsList)
