import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import { UncontrolledAlert, Button, CustomInput, Modal, ModalBody, Row, Col } from 'reactstrap'
import moment from 'moment'
import { Link, useHistory } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'
import Loading from '../../../components/Loading'
import SkeletonTable from '../../../components/SkeletonTable'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import viewIcon from '../../../assets/images/view-icon.svg'
import debugging from '../../../assets/images/debugger.png'
import check from '../../../assets/images/checked-icon.svg'
import {
  ExcelExport,
  ExcelExportColumn
} from '@progress/kendo-react-excel-export'
import PaginationComponent from '../../../components/PaginationComponent'
import { useDispatch, useSelector } from 'react-redux'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { updateUserDetails } from '../../../actions/users'

const UserList = forwardRef((props, ref) => {
  const exporter = useRef(null)
  const { List, resStatus, resMessage, getList, flag, startDate, endDate, filter, getUsersTotalCountFunc, usersTotalCount } =
    props
  const dispatch = useDispatch()
  const searchProp = props.search
  const [isFullResponse] = useState(false)
  const [fullList, setFullList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [index, setIndex] = useState(1)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [filterBy, setFilterBy] = useQueryState('filterBy', '')
  const [order, setOrder] = useQueryState('order', 'desc')
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [search, setSearch] = useQueryState('searchvalue', '')
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const isFullList = useSelector(state => state.users.isFullResponse)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const obj = qs.parse(props.location.search)
  const previousProps = useRef({
    List,
    resStatus,
    resMessage,
    startDate,
    endDate,
    activePageNo,
    start,
    offset,
    filter
  }).current
  const paginationFlag = useRef(false)
  const history = useHistory()

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
    let searchText = ''
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
      if (obj.searchvalue) {
        searchText = obj.searchvalue
        setSearch(obj.searchvalue)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sort, order, searchText, filterBy, startDate, endDate, isFullResponse)
        getUsersTotalCountFunc(searchText, filterBy, startDate, endDate)
      }
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, filterBy, startDate, endDate, isFullResponse)
      getUsersTotalCountFunc(props.search, filterBy, startDate, endDate)
      setSearch(searchProp.trim())
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
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
    if (previousProps.filter !== filter) {
      if (filter === 'EMAIL_VERIFIED' || filter === 'MOBILE_VERIFIED' || filter === 'INTERNAL_ACCOUNT' || filter === '') {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props.search, props.filter, startDate, endDate, isFullResponse)
        getUsersTotalCountFunc(search, props.filter, startDate, endDate)
        setFilterBy(props.filter)
        setStart(startFrom)
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.filter = filter
    }
  }, [filter])

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
        getUsersTotalCountFunc(search, filterBy, startDate, endDate)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, filterBy, props.startDate, props.endDate, isFullResponse)
        getUsersTotalCountFunc(search, filterBy, startDate, endDate)
        setDateFrom('')
        setDateTo('')
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.startDate = startDate
      previousProps.endDate = endDate
    }
  }, [startDate, endDate])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List && List.results && !isFullList) {
        const userArrLength = List.results.length
        const startFrom = (activePageNo - 1) * offset + 1
        const end = startFrom - 1 + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List.results)
        setIndex(activePageNo)
        setLoading(false)
      } else if (usersTotalCount?.count === List?.results?.length && isFullList) {
        setFullList(List.results ? List.results : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.results ? List.results : []),
          fileName: 'Users.xlsx'
        }
        exporter.current.save()
        setLoader(false)
      }
    }
    if (previousProps.usersTotalCount !== usersTotalCount && usersTotalCount) {
      setTotal(usersTotalCount?.count ? usersTotalCount.count : 0)
      // setLoading(false)
    }
    return () => {
      previousProps.List = List
      previousProps.usersTotalCount = usersTotalCount
    }
  }, [List, usersTotalCount])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search, filterBy, startDate, endDate, isFullResponse)
          getUsersTotalCountFunc(search, filterBy, startDate, endDate)
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
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    data === {}
      ? (data = {
          UserManagement: props.location.search
        })
      : (data.UserManagement = props.location.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      getUsersTotalCountFunc(search, filterBy, startDate, endDate)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onSorting (sortingBy) {
    if (order === 'desc') {
      const start = 0
      const limit = offset

      getList(
        start,
        limit,
        sortingBy,
        'asc',
        search,
        filterBy,
        startDate,
        endDate,
        isFullResponse
      )
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const start = 0
      const limit = offset
      getList(
        start,
        limit,
        sortingBy,
        'desc',
        search,
        filterBy,
        startDate,
        endDate,
        isFullResponse
      )
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedUsersData = {
      userAccount: selectedData.bIsInternalAccount,
      fullname: selectedData.sName,
      email: selectedData.sEmail,
      MobNum: selectedData.sMobNum,
      userName: selectedData.sUsername,
      ID: selectedData._id,
      userStatus: statuss,
      token
    }
    dispatch(updateUserDetails(updatedUsersData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  const processExcelExportData = (data) =>
    data.map((userList) => {
      const sName = userList.sName ? userList.sName : '-'
      let dCreatedAt = moment(userList.dCreatedAt).local().format('lll')
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt

      return {
        ...userList,
        dCreatedAt,
        sName
      }
    })

  async function onExport () {
    if (startDate && endDate) {
      await getList(start, offset, sort, order, search, filterBy, startDate, endDate, true)
      await getUsersTotalCountFunc(search, filterBy, startDate, endDate)
      setLoader(true)
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, sort, order, search, filterBy, startDate, endDate, isFullResponse)
    getUsersTotalCountFunc(search, filterBy, startDate, endDate)
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onExport,
    onRefresh
  }))

  return (
    <Fragment>
      {modalMessage && message && (
        <UncontrolledAlert color='primary' className={alertClass(status, close)}>
          {message}
        </UncontrolledAlert>
      )}
      <ExcelExport data={fullList && fullList.length > 0 ? fullList : list} fileName='Users.xlsx' ref={exporter}>
        <ExcelExportColumn field='sName' title='Name' />
        <ExcelExportColumn field='sUsername' title='Team Name' />
        <ExcelExportColumn field='sEmail' title='Email' />
        <ExcelExportColumn field='sMobNum' title='Mobile No.' />
        <ExcelExportColumn field='dCreatedAt' title='Registration Date' />
      </ExcelExport>
      {loader && <Loading />}
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Team Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Platform</th>
              <th>
                Registration Date
                <Button
                  color='link'
                  className='sort-btn'
                  onClick={() => onSorting('dCreatedAt')}
                >
                  <img src={sortIcon} className='m-0' alt='sorting' />
                </Button>
              </th>
              <th>Status</th>
              <th>Actions</th>
              <th>User Debugger</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={9} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data && data.sUsername}{data.bIsInternalAccount ? <b className='account-text'>(Internal)</b> : ''}</td>
                        <td>{data.sEmail || '--'}{data && data.sEmail && data.bIsEmailVerified ? <img src={check} className='mx-2'></img> : ''}</td>
                        <td>{data && data.sMobNum}{data && data.bIsMobVerified ? <img src={check} className="mx-2"></img> : ''}</td>
                        <td>{data?.ePlatform === 'A' ? 'Android' : data?.ePlatform === 'I' ? 'iOS' : data?.ePlatform === 'W' ? 'Web' : '--'}</td>
                        <td>{moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
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
                            disabled={adminPermission.USERS === 'R'
                            }
                          />
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button color="link" className="view" onClick={() => history.push(`${props.viewLink}/${data._id}`, { userList: true })}>
                                <img src={viewIcon} alt="View" />
                                View
                              </Button>
                            </li>
                            </ul>
                          </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Link color="link" className="view" to={`/users/user-management/user-debugger-page/${data._id}`}>
                                <img src={debugging} alt="View" />
                              </Link>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {!loading && list.length === 0 && (
        <div className='text-center'>
          <h3>No User List available</h3>
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

UserList.propTypes = {
  location: PropTypes.object,
  openPicker: PropTypes.bool,
  search: PropTypes.string,
  List: PropTypes.object,
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  viewLink: PropTypes.string,
  searchBox: PropTypes.string,
  history: PropTypes.object,
  filter: PropTypes.string,
  getUsersTotalCountFunc: PropTypes.func,
  usersTotalCount: PropTypes.object,
  onRefresh: PropTypes.func
}

UserList.displayName = UserList

export default UserList
