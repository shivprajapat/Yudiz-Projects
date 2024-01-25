import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Button, Col, CustomInput, Modal, ModalBody, Row, UncontrolledAlert } from 'reactstrap'
import { Link } from 'react-router-dom'
import viewIcon from '../../../assets/images/view-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import { updatePermission } from '../../../actions/permission'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import warningIcon from '../../../assets/images/warning-icon.svg'
import PropTypes from 'prop-types'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const Permission = forwardRef((props, ref) => {
  const { List, getList } = props

  const exporter = useRef(null)
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const resStatus = useSelector((state) => state.permission.resStatus)
  const resMessage = useSelector((state) => state.permission.resMessage)
  const previousProps = useRef({
    resStatus,
    resMessage
  }).current

  const [close, setClose] = useState(false)

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    getList()
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (List && previousProps.List !== List) {
      setList(List)
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          getList()
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
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
    const updatedPermissionData = {
      Name: selectedData.sName,
      Key: selectedData.sKey,
      permissionStatus: statuss,
      token,
      ID: selectedData._id
    }
    dispatch(updatePermission(updatedPermissionData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  const processExcelExportData = data => data.map((permissionsList) => {
    let eStatus = permissionsList.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    return {
      ...permissionsList,
      eStatus
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'Permissions.xlsx' }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <div className='table-responsive'>
        {modalMessage && message && (
          <UncontrolledAlert color='primary' className={alertClass(status, close)}>
            {message}
          </UncontrolledAlert>
        )}
        <ExcelExport
          data={list}
          fileName="Permissions.xlsx"
          ref={exporter}
        >
          <ExcelExportColumn field="sName" title="Name" />
          <ExcelExportColumn field="sKey" title="Key" />
          <ExcelExportColumn field="eStatus" title="Status" />
      </ExcelExport>
        <table className='table'>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Permission Name</th>
              <th>Permission Key</th>
              <th>Permission Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
              <SkeletonTable numberOfColumns={5} />
                )
              : (
              <Fragment>
                {list &&
                  list.length !== 0 &&
                  list
                    .sort((a, b) => a.sName.localeCompare(b.sName))
                    .map((data, i) => (
                      <tr key={data._id}>
                        <td>{i + 1}</td>
                        <td>{data.sName}</td>
                        <td>{data.sKey}</td>
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
                            disabled={adminPermission?.PERMISSION === 'R'}
                          />
                        </td>
                        <td>
                          <ul className='action-list mb-0 d-flex'>
                            <li>
                              <Button
                                color='link'
                                className='view'
                                tag={Link}
                                to={`${props.EditPermissionLink}/${data._id}`}
                              >
                                <img src={viewIcon} alt='View' />
                                View
                              </Button>
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
      {!loading && list.length === 0 && (
        <div className='text-center'>
          <h3>No Permission available</h3>
        </div>
      )}
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

Permission.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
  EditPermissionLink: PropTypes.string
}

Permission.displayName = Permission

export default connect(null, null, null, { forwardRef: true })(Permission)
