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
import { deleteBanner, updateBanner } from '../../../actions/banner'
import SkeletonTable from '../../../components/SkeletonTable'
import { getUrl } from '../../../actions/url'
import PropTypes from 'prop-types'
import statistics from '../../../assets/images/statistics-com.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const SliderManagementContent = forwardRef((props, ref) => {
  const { getList, bannerList } = props
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
  const [deleteId, setDeleteId] = useState('')
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resMessage = useSelector(state => state.banner.resMessage)
  const resStatus = useSelector(state => state.banner.resStatus)
  const searchProp = props.search
  const previousProps = useRef({ bannerList, searchProp, resMessage, resStatus, start, offset }).current
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
    let order = 'asc'
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
    if (previousProps.bannerList !== bannerList) {
      if (bannerList) {
        if (bannerList.results) {
          const userArrLength = bannerList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(bannerList.results ? bannerList.results : [])
        setIndex(activePageNo)
        setTotal(bannerList.total ? bannerList.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.bannerList = bannerList
    }
  }, [bannerList])

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
        SliderManagement: props.location.search
      }
      : data.SliderManagement = props.location.search
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
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

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
    dispatch(deleteBanner(deleteId, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedSliderData = {
      place: selectedData.ePlace,
      Link: selectedData.sLink,
      bannerImage: selectedData.sImage,
      Description: selectedData.sDescription,
      position: selectedData.nPosition,
      League: selectedData.iMatchLeagueId,
      Match: selectedData.iMatchId,
      bannerType: selectedData.eType,
      screen: selectedData.eScreen,
      sportsType: selectedData.eCategory,
      bannerStatus: statuss,
      token,
      bannerId: selectedData._id
    }
    dispatch(updateBanner(updatedSliderData))
    setLoading(true)
    toggleWarning()
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

  const processExcelExportData = data => data.map((SliderList) => {
    let ePlace = SliderList.ePlace
    let eType = SliderList.eType
    let eScreen = SliderList.eScreen
    let eStatus = SliderList.eStatus
    let sLink = SliderList.sLink
    let eCategory = SliderList.eCategory
    let nPosition = SliderList.nPosition
    ePlace = ePlace === 'H' ? 'Home Page' : 'Deposit Page'
    eType = eType === 'S' ? 'Screen' : eType === 'L' ? 'Link' : eType === 'CR' ? 'Contest Redirect' : '--'
    eScreen = eScreen === 'D' ? 'Deposit' : eScreen === 'S' ? 'Share' : '--'
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    sLink = sLink || '--'
    eCategory = eCategory || '--'
    nPosition = nPosition || '--'
    let sDescription = document.createElement('div')
    sDescription.innerHTML = SliderList.sDescription
    sDescription = sDescription.innerText

    return {
      ...SliderList,
      ePlace,
      eType,
      eScreen,
      eStatus,
      sDescription,
      sLink,
      eCategory,
      nPosition
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'Slider.xlsx' }
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
        fileName="Slider.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="ePlace" title="Place" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="sLink" title="Link" />
        <ExcelExportColumn field="eScreen" title="Screen" />
        <ExcelExportColumn field="nPosition" title="Position" />
        <ExcelExportColumn field="eCategory" title="Category" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="eStatus" title="Status" />
      </ExcelExport>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Place</th>
              <th>Type</th>
              <th>Link</th>
              <th>Screen</th>
              <th>Position</th>
              <th>Image</th>
              <th>Status</th>
              <th>Statistics</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={10} />
              : (
                <Fragment>
                  {
                  list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.ePlace && data.ePlace === 'H' ? 'Home Page' : data.ePlace === 'D' ? 'Deposit Page' : '--'}</td>
                        <td>{data.eType === 'S' ? 'Screen' : data.eType === 'L' ? 'Link' : data.eType === 'CR' ? 'Contest Redirect' : ''}</td>
                        <td>{data.sLink ? data.sLink : '--'}</td>
                        <td>{data.eScreen === 'D' ? 'Deposit' : data.eScreen === 'S' ? 'Share' : data.eScreen === 'CR' ? 'Contest Redirect' : '--'}</td>
                        <td>{data.nPosition ? data.nPosition : '--'}</td>
                        <td>{data.sImage
                          ? <img src={url + data.sImage} className="theme-image" alt="banner" />
                          : 'No Image' }
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
                            disabled={adminPermission?.BANNER === 'R'
                            }
                          />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink to={`/settings/slider-statistics/${data._id}`} className="view">
                                <img src={statistics} alt="View" style={{ height: '40px', width: '40px' }} />
                              </NavLink>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink color="link" className="view" to={`/settings/slider-details/${data._id}`}>
                                <img src={viewIcon} alt="View" />
                                <span>View</span>
                              </NavLink>
                            </li>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.BANNER !== 'R')) &&
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
            <h3>No Slider available</h3>
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

SliderManagementContent.propTypes = {
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  bannerList: PropTypes.arrayOf(PropTypes.object)
}

SliderManagementContent.displayName = SliderManagementContent

export default connect(null, null, null, { forwardRef: true })(SliderManagementContent)
