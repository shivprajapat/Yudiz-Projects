import React, {
  useState, Fragment, useEffect, useRef, useImperativeHandle, forwardRef
} from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { Button, UncontrolledAlert } from 'reactstrap'
import moment from 'moment'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import PropTypes from 'prop-types'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'
import { getUrl } from '../../../../actions/url'
import { Link } from 'react-router-dom'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { alertClass, modalMessageFunc } from '../../../../helpers/helper'

const UsersList = forwardRef((props, ref) => {
  const {
    getList, usersList, sportsType, getSeasonDetailsFunc, fullSeasonList, getSeasonDataFunc
  } = props
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [url, setUrl] = useState('')
  const resStatus = useSelector(state => state.season.resStatus)
  const resMessage = useSelector(state => state.season.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    start, offset, usersList, resMessage, resStatus
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
    getSeasonDetailsFunc()
    getSeasonDataFunc()
    dispatch(getUrl('media'))
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        UsersList: props.location.search
      }
      : data.UsersList = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.usersList !== usersList) {
      if (usersList) {
        if (usersList.results) {
          const userArrLength = usersList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(usersList.results ? usersList.results : [])
        setIndex(activePageNo)
        setTotal(usersList.total ? usersList.total : 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.usersList = usersList
    }
  }, [usersList])

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
        getSeasonDetailsFunc()
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function onRefresh () {
    const startFrom = 0
    const limit = offset
    getList(startFrom, limit)
    getSeasonDetailsFunc()
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onRefresh,
    onExport
  }))

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

  const processExcelExportData = (data) =>
    data.map((userList) => {
      const sUserName = userList.sUserName ? userList.sUserName : '-'
      const eType = userList.eType ? (userList.eType === 'B' ? 'Bot' : 'Normal') : '--'

      return {
        ...userList,
        sUserName,
        eType
      }
    })

  function onExport () {
    if (fullSeasonList?.length) {
      setLoading(false)
      exporter.current.props = {
        ...exporter.current.props,
        data: processExcelExportData(fullSeasonList),
        fileName: 'SeasonsUsersList.xlsx'
      }
      exporter.current.save()
    }
  }

  return (
    <Fragment>
      <div className="table-responsive">
        {
          modalMessage && message && (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        <ExcelExport data={(fullSeasonList && fullSeasonList.length > 0) ? fullSeasonList : []} fileName='SeasonsUsersList.xlsx' ref={exporter}>
          <ExcelExportColumn field='sUserName' title='Username' />
          <ExcelExportColumn field='eType' title='Type' />
        </ExcelExport>
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Profile Pic</th>
              <th>Username</th>
              <th>Type</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={5} />
              : <Fragment>
                {list && list.length !== 0 && list.map((data, i) => {
                  return (
                    <tr key={data._id}>
                      <td>{(((index - 1) * offset) + (i + 1))}</td>
                      <td>{data.sProPic ? <img src={url + data.sProPic} alt="NA" height={50} width={70} /> : ' No Image '}</td>
                      <td>{(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N'))
                        ? <Button color="link" className="view" tag={Link} to={`${data.eType === 'B' ? props.systemUserDetailsPage : props.userDetailsPage}/${data.iUserId}`}>{data.sUserName || '--'}</Button>
                        : data.sUserName || '--'}</td>
                      <td>{data.eType ? (data.eType === 'B' ? 'Bot' : 'Normal') : '-'}</td>
                      <td>{moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')}</td>
                    </tr>
                  )
                })
              }
              </Fragment>
            }
          </tbody>
        </table>
      </div>
      {!loading && list.length === 0 && (
          <div className="text-center">
            <h3>Users not available</h3>
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
    </Fragment>
  )
})

UsersList.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  usersList: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  userDetailsPage: PropTypes.string,
  systemUserDetailsPage: PropTypes.string,
  getSeasonDetailsFunc: PropTypes.func,
  fullSeasonList: PropTypes.object,
  getSeasonDataFunc: PropTypes.object
}

UsersList.displayName = UsersList

export default connect(null, null, null, { forwardRef: true })(UsersList)
