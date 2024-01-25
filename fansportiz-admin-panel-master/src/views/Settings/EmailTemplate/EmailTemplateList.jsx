import React, { Fragment, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  Button,
  Col,
  CustomInput,
  Modal,
  ModalBody,
  Row,
  UncontrolledAlert
} from 'reactstrap'
import viewIcon from '../../../assets/images/view-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import { getSportsList } from '../../../actions/sports'
import PropTypes from 'prop-types'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { updateEmailTemplate } from '../../../actions/users'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const EmailTemplateList = forwardRef((props, ref) => {
  const { templatesList, getList } = props
  const exporter = useRef(null)

  const [list, setList] = useState([])
  const [offset] = useQueryState('pageSize', 10)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [index] = useState(1)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const resStatus = useSelector(state => state.users.resStatus)
  const resMessage = useSelector(state => state.users.resMessage)
  const previousProps = useRef({ templatesList, resMessage, resStatus }).current

  useEffect(() => {
    if (props?.location?.state?.message) {
      setMessage(props.location.state.message)
      setStatus(true)
      setModalMessage(true)
    }
    setLoading(true)
    getList()
    props.history.replace()
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.templatesList !== templatesList) {
      if (templatesList) {
        setList(templatesList)
      }
      setLoading(false)
    }
    return () => {
      previousProps.templatesList = templatesList
    }
  }, [templatesList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          dispatch(getSportsList(token))
          getList()
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
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

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedOfferData = {
      Title: selectedData.sTitle,
      Slug: selectedData.sSlug,
      Description: selectedData.sDescription,
      Subject: selectedData.sSubject,
      Content: selectedData.sContent,
      EmailStatus: statuss,
      token,
      ID: selectedData._id
    }
    dispatch(updateEmailTemplate(updatedOfferData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  const processExcelExportData = data => data.map((emailTemplateList) => {
    let eStatus = emailTemplateList.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    let sContent = document.createElement('div')
    sContent.innerHTML = emailTemplateList.sContent
    sContent = sContent.innerText

    return {
      ...emailTemplateList,
      eStatus,
      sContent
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'EmailTemplates.xlsx' }
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
        fileName="EmailTemplates.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="sSlug" title="Slug" />
        <ExcelExportColumn field="sSubject" title="Subject" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="sContent" title="Content" />
        <ExcelExportColumn field="eStatus" title="Status" />
      </ExcelExport>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Title</th>
              <th>Slug</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={7} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 &&
                    list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sTitle ? data.sTitle : '--'}</td>
                        <td>{data.sSlug ? data.sSlug : '--'}</td>
                        <td>{data.sSubject ? data.sSubject : '--'}</td>
                        <td>{data.sDescription ? data.sDescription : '--'}</td>
                        <td>
                          <CustomInput
                            type='switch'
                            id={`${data._id}`}
                            key={`${data._id}`}
                            name={`${data._id}`}
                            onChange={() =>
                              warningWithConfirmMessage(
                                data,
                                data.eStatus === 'Y' ? 'Inactivate' : 'activate'
                              )
                            }
                            checked={data.eStatus === 'Y'}
                            disabled={adminPermission?.EMAIL_TEMPLATES === 'R'}
                          /></td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                            <NavLink color="link" to={`/settings/template-details/${data.sSlug}`} className="view">
                                <img src={viewIcon} alt="View" />
                                View
                              </NavLink>
                            </li>
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
            <h3>No Email Templates available</h3>
          </div>
        )
      }

      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className='text-center'>
          <img className='info-icon' src={warningIcon} alt='check' />
          <h2>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button
                type='submit'
                className='theme-btn outline-btn full-btn'
                onClick={toggleWarning}
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

EmailTemplateList.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  templatesList: PropTypes.arrayOf(PropTypes.object),
  getList: PropTypes.func
}

EmailTemplateList.displayName = EmailTemplateList

export default connect(null, null, null, { forwardRef: true })(EmailTemplateList)
