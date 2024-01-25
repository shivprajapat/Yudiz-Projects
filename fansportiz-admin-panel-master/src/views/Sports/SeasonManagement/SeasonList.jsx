import React, {
  useState, Fragment, useEffect, useRef, useImperativeHandle, forwardRef
} from 'react'
import { useSelector, connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FormGroup, Input, UncontrolledAlert } from 'reactstrap'
import moment from 'moment'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import viewIcon from '../../../assets/images/view-icon.svg'
import PropTypes from 'prop-types'
import PaginationComponent from '../../../components/PaginationComponent'
import SkeletonTable from '../../../components/SkeletonTable'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import right from '../../../assets/images/right-icon.svg'

const SeasonList = forwardRef((props, ref) => {
  const {
    getList, flag, seasonList, sportsType, startDate, endDate, updateSeasonFunc
  } = props
  const searchProp = props.search
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [search, setSearch] = useQueryState('search', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [seasonName, setSeasonName] = useState('')
  const [isEditableField, setIsEditableField] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const resStatus = useSelector(state => state.season.resStatus)
  const resMessage = useSelector(state => state.season.resMessage)
  const obj = qs.parse(props.location.search)
  const previousProps = useRef({
    start, offset, seasonList, searchProp, resMessage, resStatus, startDate, endDate
  }).current
  const paginationFlag = useRef(false)
  const toggle = (data, type) => {
    setIsEditableField(true)
    setSelectedData(data)
    if (type === 'SeasonName') {
      setSeasonName(data.sName)
    }
  }

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
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, search, startDate, endDate)
      }
    }
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        SeasonList: props.location.search
      }
      : data.SeasonList = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.seasonList !== seasonList) {
      if (seasonList) {
        if (seasonList.results) {
          const userArrLength = seasonList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(seasonList.results ? seasonList.results : [])
        setIndex(activePageNo)
        setTotal(seasonList.total ? seasonList.total : 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.seasonList = seasonList
    }
  }, [seasonList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, search, startDate, endDate)
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
      getList(startFrom, limit, props.search, startDate, endDate)
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
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = (obj && obj.datefrom && obj.dateto && obj.page) ? (obj.page - 1) * offset : 0
        const limit = offset
        getList(startFrom, limit, search, props.startDate, props.endDate)
        setStart(startFrom)
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
        getList(startFrom, limit, search, props.startDate, props.endDate)
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

  function onRefresh () {
    const startFrom = 0
    const limit = offset
    getList(startFrom, limit, search, startDate, endDate)
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, search, startDate, endDate)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function handleInputChange (event) {
    setSeasonName(event.target.value)
  }

  function onStatusUpdate (e, field) {
    e.preventDefault()
    if (field === 'SeasonName') {
      updateSeasonFunc(
        seasonName || selectedData.sName,
        selectedData._id
      )
      setSeasonName('')
      setIsEditableField(false)
    }
    setLoading(true)
  }

  return (
    < >
      <div className="table-responsive">
        {
          modalMessage && message && (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Key </th>
              <th>Provider</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={7} />
              : <Fragment>
                {list && list.length !== 0 && list.map((data, i) => {
                  return (
                    <tr key={data._id}>
                      <td>{(((index - 1) * offset) + (i + 1))}</td>
                      <td className='editable-field'>
                      {isEditableField && data._id === selectedData._id
                        ? <FormGroup>
                          <div className='d-flex justify-content-start'>
                            <Input className='editable-inside-field custom-season-field' type='text' onChange={(e) => handleInputChange(e)} value={seasonName}></Input>
                            <img src={right} onClick={(e) => onStatusUpdate(e, 'SeasonName')} hidden={!seasonName}></img>
                          </div>
                        </FormGroup>
                        : <div onClick={() => toggle(data, 'SeasonName')}>{data.sName || '--'}</div>}
                      </td>
                      <td>{data.sKey ? data.sKey : '-'}</td>
                      <td>{data.eProvider ? data.eProvider : '--'}</td>
                      <td>{moment(data.dStartDate).format('DD/MM/YYYY hh:mm A')}</td>
                      <td>{moment(data.dEndDate).format('DD/MM/YYYY hh:mm A')}</td>
                      <td>
                        <ul className='action-list mb-0 d-flex'>
                          <li>
                            <Link color='link' className='view' to={`${props.userListView}/${data._id}`}>
                              <img src={viewIcon} alt='View' />
                              User List
                            </Link>
                          </li>
                        </ul>
                      </td>
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
            <h3>Seasons not available</h3>
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
    </>
  )
})

SeasonList.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  seasonList: PropTypes.object,
  flag: PropTypes.bool,
  location: PropTypes.object,
  search: PropTypes.string,
  history: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  userListView: PropTypes.string,
  updateSeasonFunc: PropTypes.func
}

SeasonList.displayName = SeasonList

export default connect(null, null, null, { forwardRef: true })(SeasonList)
