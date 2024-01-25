import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { Button, Col, Modal, ModalBody, Row, UncontrolledAlert } from 'reactstrap'
import qs from 'query-string'
import { Link } from 'react-router-dom'
import viewIcon from '../../../assets/images/view-icon.svg'
import PropTypes from 'prop-types'
import SkeletonTable from '../../../components/SkeletonTable'
import moment from 'moment'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import { deleteVersion } from '../../../actions/version'
import Loading from '../../../components/Loading'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'

const Version = forwardRef((props, ref) => {
  const { editVersionLink, versionList, getList, modalMessage, setModalMessage, message, setMessage, status, setStatus } = props
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [loader, setLoader] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector((state) => state.auth.token)
  const resStatus = useSelector((state) => state.version.resStatus)
  const resMessage = useSelector((state) => state.version.resMessage)
  const previousProps = useRef({
    versionList,
    resMessage,
    resStatus,
    start,
    offset
  }).current
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setModalMessage(true)
        setStatus(true)
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
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit)
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    data === {}
      ? (data = {
          ValidationManagement: props.location.search
        })
      : (data.VersionManagement = props.location.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.versionList !== versionList) {
      if (versionList) {
        if (versionList.results) {
          const userArrLength = versionList && versionList.results.length
          const startFrom = (activePageNo - 1) * offset + 1
          const end = startFrom - 1 + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(versionList && versionList.results)
        setIndex(activePageNo)
        setTotal(versionList.total ? versionList.total : 0)
        setLoader(false)
      } else {
        setList([])
      }
      setLoading(false)
    }
    return () => {
      previousProps.versionList = versionList
    }
  }, [versionList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit)
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  const processExcelExportData = data => data.map((VersionList) => {
    let eType = VersionList.eType
    const bInAppUpdate = VersionList.bInAppUpdate ? 'true' : 'false'
    let dCreatedAt = moment(VersionList.dCreatedAt).local().format('lll')
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
    eType = eType === 'I' ? 'iOS' : VersionList.eType === 'A' ? 'Android' : '--'
    return {
      ...VersionList,
      eType,
      bInAppUpdate,
      dCreatedAt
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'Versions.xlsx' }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    dispatch(deleteVersion(deleteId, token))
    setModalWarning(false)
    setLoader(true)
  }

  return (
    <Fragment>
      {modalMessage && message && (
        <UncontrolledAlert
          color='primary'
          className={alertClass(status, close)}>
          {message}
        </UncontrolledAlert>
      )}
      <ExcelExport
        data={list}
        fileName="Versions.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sVersion" title="Version" />
        <ExcelExportColumn field="sName" title="Name" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="sUrl" title="URL" />
        <ExcelExportColumn field="sForceVersion" title="Force Version" />
        <ExcelExportColumn field="bInAppUpdate" title="In app update" />
        <ExcelExportColumn field="dCreatedAt" title="Creation Date" />
      </ExcelExport>
      {loader && <Loading />}
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>URL</th>
              <th>Version</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
              <SkeletonTable numberOfColumns={8} />
                )
              : (
              <Fragment>
                {list &&
                  list.length !== 0 &&
                  list.map((data, i) => (
                    <tr key={data._id}>
                      <td>{(index - 1) * offset + (i + 1)}</td>
                      <td>{data.sName ? data.sName : '-'}</td>
                      <td>{data.sDescription ? data.sDescription : '-'}</td>
                      <td>{data.eType && data.eType === 'I' ? 'iOS' : data.eType === 'A' ? 'Android' : '-'}</td>
                      <td>{data.sUrl ? data.sUrl : '-'}</td>

                      <td>{data.sVersion ? data.sVersion : '-'}</td>
                      <td>
                        {data.dCreatedAt
                          ? moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')
                          : '-'}
                      </td>

                      <td>
                        <ul className='action-list mb-0 d-flex'>
                          <li>
                            <Button
                              color='link'
                              className='view'
                              tag={Link}
                              to={`${editVersionLink}/${data._id}`}
                            >
                              <img src={viewIcon} alt='View' />
                              View
                            </Button>
                          </li>
                          {((Auth && Auth === 'SUPER') || (adminPermission?.VERSION !== 'R')) &&
                            (
                              <Fragment>
                                <li>
                                  <Button color="link" className="delete" onClick={() => warningWithDeleteMessage(data._id)}>
                                    <img src={deleteIcon} alt="Delete" />
                                    Delete
                                  </Button>
                                </li>
                              </Fragment>
                            )}
                        </ul>
                      </td>
                    </tr>
                  ))}
              </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {!loading && !list && (
        <div className='text-center'>
          <h3>No Version List Available</h3>
        </div>
      )}
      <Modal
        isOpen={modalWarning}
        toggle={toggleWarning}
        className='modal-confirm'
      >
        <ModalBody className='text-center'>
          <img className='info-icon' src={warningIcon} alt='check' />
          <h2>Are you sure you want to Delete it?</h2>
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
                onClick={deleteId && onDelete}
              >Yes, Delete It</Button>
            </Col>
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

Version.propTypes = {
  editVersionLink: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  versionList: PropTypes.object,
  getList: PropTypes.func,
  modalMessage: PropTypes.bool,
  setModalMessage: PropTypes.func,
  message: PropTypes.bool,
  setMessage: PropTypes.func,
  status: PropTypes.bool,
  setStatus: PropTypes.func
}

Version.displayName = Version

export default Version
