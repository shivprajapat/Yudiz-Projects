import React, {
  Fragment, useRef, useState, useEffect, useImperativeHandle, forwardRef
} from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, CustomInput, UncontrolledAlert, Modal, ModalBody, Row, Col
} from 'reactstrap'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../components/SkeletonTable'
import viewIcon from '../../assets/images/view-icon.svg'
import sortIcon from '../../assets/images/sorting-icon.svg'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import warningIcon from '../../assets/images/warning-icon.svg'
import { updateSubadmin } from '../../actions/subadmin'
import PropTypes from 'prop-types'
import PaginationComponent from '../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../helpers/helper'

const SubAdminContent = forwardRef((props, ref) => {
  const {
    editLink, getList, List
  } = props
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [close, setClose] = useState(false)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 entries')
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const searchProp = props.search

  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const resStatus = useSelector(state => state.subadmin.resStatus)
  const resMessage = useSelector(state => state.subadmin.resMessage)
  const previousProps = useRef({
    resMessage, resStatus, List, start, offset
  }).current
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
    let order = 'dsc'
    const obj = qs.parse(props.location.search)
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} users`)
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
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        SubAdminManagement: props.location.search
      }
      : data.SubAdminManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        if (List.results) {
          const userArrLength = List.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List.results ? List.results : [])
        setIndex(activePageNo)
        setTotal(List.total ? List.total : 0)
      }
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

  function onSorting (sortingBy) {
    if (order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search)
      setOrder('asc')
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

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'B' : 'Y'
    const updatedSubAdminData = {
      fullname: selectedData.sName,
      username: selectedData.sUsername,
      email: selectedData.sEmail,
      MobNum: selectedData.sMobNum,
      roleId: selectedData.iRoleId,
      subAdminStatus: statuss,
      token,
      ID: selectedData._id
    }
    dispatch(updateSubadmin(updatedSubAdminData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  const processExcelExportData = data => data.map((subAdminList) => {
    let eStatus = subAdminList.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'

    return {
      ...subAdminList,
      eStatus
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter.current.props, data: processExcelExportData(list), fileName: 'SubAdmins.xlsx' }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <div className="table-responsive">
        {
          modalMessage && message && (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }

      <ExcelExport
        data={list}
        fileName="SubAdmins.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="sUsername" title="Username" />
        <ExcelExportColumn field="sEmail" title="Email" />
        <ExcelExportColumn field="sMobNum" title="Mobile No" />
        <ExcelExportColumn field="sName" title="Name" />
        <ExcelExportColumn field="eStatus" title="Status" />
      </ExcelExport>

        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              <th>
                <span className="d-inline-block align-middle">Full Name</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('sName')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {loading
            ? <SkeletonTable numberOfColumns={7} />
            : <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sUsername || '--'}</td>
                        <td>{data.sName || '--'}</td>
                        <td>{data.sEmail || '--'}</td>
                        <td>{data.sMobNum || '--'}</td>
                        <td>
                          <CustomInput
                            type='switch'
                            id={`${data._id}`}
                            key={`${data._id}`}
                            name={`${data._id}`}
                            onClick={() =>
                              warningWithConfirmMessage(
                                data,
                                data.eStatus === 'Y' ? 'block' : 'activate'
                              )
                            }
                            checked={data.eStatus === 'Y'}
                            disabled={adminPermission?.SUBADMIN === 'R'}
                          />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button color="link" className="view" tag={Link} to={`${editLink}/${data._id}`}>
                                <img src={viewIcon} alt="View" />
                                View
                              </Button>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 && (
          <div className="text-center">
            <h3>No data Found.</h3>
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

SubAdminContent.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  List: PropTypes.object,
  editLink: PropTypes.string
}

SubAdminContent.displayName = SubAdminContent

export default connect(null, null, null, { forwardRef: true })(SubAdminContent)
