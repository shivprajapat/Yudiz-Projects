import React, { Fragment, forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, CustomInput, Modal, ModalBody, Row, Col, UncontrolledAlert
} from 'reactstrap'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import viewIcon from '../../../assets/images/view-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import { deleteCMS, updateCMS } from '../../../actions/cms'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const ContentManagementContent = forwardRef((props, ref) => {
  const { getList, cmsList } = props
  const exporter = useRef(null)
  const searchProp = props.search
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [search, setSearch] = useQueryState('search', '')

  const dispatch = useDispatch()
  const resStatus = useSelector(state => state.cms.resStatus)
  const resMessage = useSelector(state => state.cms.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const previousProps = useRef({ cmsList, resStatus, resMessage, searchProp }).current

  const [close, setClose] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
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
    setLoading(true)
    getList(search)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.cmsList !== cmsList) {
      if (cmsList) {
        setList(cmsList)
      }
      setLoading(false)
    }
    return () => {
      previousProps.cmsList = cmsList
    }
  }, [cmsList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          getList(search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
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
        ContentManagement: props.location.search
      }
      : data.ContentManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    const callSearchService = () => {
      getList(props.search)
      setSearch(searchProp.trim())
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
    dispatch(deleteCMS(deleteId, token))
    setDeleteId('')
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
      Slug: selectedData.sSlug,
      Details: selectedData.sContent,
      Description: selectedData.sDescription,
      Category: selectedData.sCategory,
      priority: selectedData.nPriority,
      contentStatus: statuss,
      token,
      cmsId: selectedData._id
    }
    dispatch(updateCMS(updatedOfferData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  const processExcelExportData = data => data.map((CMSList) => {
    let eStatus = CMSList.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    let sContent = document.createElement('div')
    sContent.innerHTML = CMSList.sContent
    sContent = sContent.innerText
    return {
      ...CMSList,
      eStatus,
      sContent
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'CmsList.xlsx' }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      {
        modalMessage && message && (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <ExcelExport
        data={list}
        fileName="CMS.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="sSlug" title="Slug" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="nPriority" title="Priority" />
        <ExcelExportColumn field="sContent" title="Content" />
        <ExcelExportColumn field="eStatus" title="Status" />
      </ExcelExport>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Title</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={8} />
              : (
                <Fragment>
                  {list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(i + 1)}</td>
                        <td>{data.sTitle}</td>
                        <td>{data.sCategory ? data.sCategory : '-- '}</td>
                        <td>{data.sSlug}</td>
                        <td>{data.sDescription ? data.sDescription : '--'}</td>
                        <td>{data.nPriority}</td>
                        <td>
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
                            disabled={adminPermission?.CMS === 'R'}
                          />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Link className="view" to={`/settings/content-details/${data.sSlug}`}>
                                <img src={viewIcon} alt="View" />
                                <span>View</span></Link>
                            </li>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.CMS !== 'R')) && (
                                <Fragment>
                                  <li onClick={() => warningWithDeleteMessage(data._id, 'delete')}>
                                    <Button color="link" className="delete">
                                      <img src={deleteIcon} alt="Delete" />
                                      Delete
                                    </Button>
                                  </li>
                                </Fragment>
                              )
                            }
                          </ul>
                        </td>
                      </tr>))
                  }
                </Fragment>)}
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 && (
          <div className="text-center">
            <h6>Contents not available</h6>
          </div>
        )
      }

      { /* Modal for ask confirmation to delete/update-status content */ }
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

ContentManagementContent.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  getList: PropTypes.func,
  cmsList: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool
}

ContentManagementContent.displayName = ContentManagementContent

export default connect(null, null, null, { forwardRef: true })(ContentManagementContent)
