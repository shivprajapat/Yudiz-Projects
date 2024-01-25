import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Button, Col, CustomInput, Modal, ModalBody, Row, UncontrolledAlert } from 'reactstrap'
import { Link } from 'react-router-dom'
import viewIcon from '../../../assets/images/view-icon.svg'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import warningIcon from '../../../assets/images/warning-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import { deleteRole, updateRole } from '../../../actions/role'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import deleteIcon from '../../../assets/images/delete-icon.svg'

const RolesList = forwardRef((props, ref) => {
  const { rolesList, getList, editRoleLink } = props
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const searchProp = props.search
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [index, setIndex] = useState(1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [search, setSearch] = useQueryState('search', '')
  const [listLength, setListLength] = useState('10 entries')
  const [deleteId, setDeleteId] = useState('')
  const toggleWarning = () => setModalWarning(!modalWarning)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector((state) => state.role.resStatus)
  const resMessage = useSelector((state) => state.role.resMessage)
  const paginationFlag = useRef(false)
  const previousProps = useRef({
    rolesList,
    resStatus,
    resMessage,
    start,
    offset
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
    getList(startFrom, limit, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (rolesList && previousProps.rolesList !== rolesList) {
      if (rolesList) {
        if (rolesList.results) {
          const userArrLength = rolesList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(rolesList.results ? rolesList.results : [])
        setIndex(activePageNo)
        setTotal(rolesList.total ? rolesList.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.rolesList = rolesList
    }
  }, [rolesList])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, props.search)
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
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        RolesManagement: props.location.search
      }
      : data.RolesManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setModalWarning(false)
          setPageNo(activePageNo)
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, search)
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

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updateRoleData = {
      name: selectedData.sName,
      permissions: selectedData.aPermissions,
      roleStatus: statuss,
      token,
      roleId: selectedData._id
    }
    dispatch(updateRole(updateRoleData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    dispatch(deleteRole(deleteId, token))
    setLoading(true)
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
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'RolesList.xlsx' }
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
          fileName="RolesList.xlsx"
          ref={exporter}
        >
          <ExcelExportColumn field="sName" title="Name" />
          <ExcelExportColumn field="eStatus" title="Status" />
        </ExcelExport>
        <table className='table'>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
              <SkeletonTable numberOfColumns={4} />
                )
              : (
              <Fragment>
                {list &&
                  list.length !== 0 &&
                  list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sName}</td>
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
                            disabled={adminPermission?.ADMIN_ROLE === 'R'}
                          />
                        </td>
                        <td>
                          <ul className='action-list mb-0 d-flex'>
                            <li>
                              <Button
                                color='link'
                                className='view'
                                tag={Link}
                                to={`${editRoleLink}/${data._id}`}
                              >
                                <img src={viewIcon} alt='View' />
                                View
                              </Button>
                            </li>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.ADMIN_ROLE !== 'R')) &&
                              (
                                <Fragment>
                                  <li>
                                    <Button color="link" className="delete" onClick={() => warningWithDeleteMessage(data._id)}>
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
                  ))}
              </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {!loading && list.length === 0 && (
        <div className='text-center'>
          <h3>No data Found.</h3>
        </div>
      )}

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
                {deleteId ? 'Yes, Delete It' : `Yes, ${type} it`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

RolesList.propTypes = {
  rolesList: PropTypes.object,
  getList: PropTypes.func,
  editRoleLink: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool
}

RolesList.displayName = RolesList

export default connect(null, null, null, { forwardRef: true })(RolesList)
