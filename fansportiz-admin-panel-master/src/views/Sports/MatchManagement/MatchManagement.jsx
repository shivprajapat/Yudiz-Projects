import React, {
  useState, Fragment, useEffect, useRef, useImperativeHandle, forwardRef
} from 'react'
import { useSelector, useDispatch, connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, CustomInput, Modal, ModalBody, Row, Col, ModalHeader, Input, UncontrolledAlert, FormGroup, Label
} from 'reactstrap'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import moment from 'moment'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../../components/SkeletonTable'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import viewIcon from '../../../assets/images/view-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import { getFormatsList } from '../../../actions/pointSystem'

const animatedComponents = makeAnimated()

const MatchManagement = forwardRef((props, ref) => {
  const {
    sportsType, getList, flag, openPicker, AddMatch, clearMatchMsg, startDate, endDate, setProviderFunc, provider, getMatchesTotalCountFunc, seasonList
  } = props
  const searchProp = props.search
  const searchDateProp = props.searchDate
  const [start, setStart] = useState(0)
  const [filterMatchStatus, setfilterMatchStatus] = useQueryState('filter', '')
  const [sProvider, setsProvider] = useQueryState('provider', '')
  const [season, setSeason] = useQueryState('iSeasonId', '')
  const [sFormat, setsFormat] = useQueryState('format', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [listOfSeasons, setListOfSeasons] = useState([])
  const [activePageSeason, setActivePageSeason] = useState(1)
  const [seasonInput, setSeasonInput] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  // eslint-disable-next-line no-unused-vars
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [selectedSeason, setSelectedSeason] = useState([])
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [selectDate, setselectDate] = useState(null)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const dispatch = useDispatch()

  const obj = qs.parse(props.location.search)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const matchList = useSelector(state => state.match.matchList)
  const getFormatList = useSelector(state => state.pointSystem.getFormatsList)
  const matchesTotalCount = useSelector(state => state.match.matchesTotalCount)
  const resStatus = useSelector(state => state.match.resStatus)
  const resMessage = useSelector(state => state.match.resMessage)
  const seasonResponseList = useSelector(state => state?.season?.seasonList)
  const previousProps = useRef({
    start, offset, matchList, searchProp, resMessage, resStatus, searchDateProp, filterMatchStatus, startDate, endDate, sProvider, season, sFormat, matchesTotalCount, seasonResponseList, sportsType
  }).current
  const paginationFlag = useRef(false)

  function onClose () {
    props.handleDatePicker(false)
  }

  useEffect(() => {
    if (previousProps.seasonResponseList !== seasonResponseList) {
      if (seasonResponseList) {
        const arr = [...listOfSeasons]
        if (seasonResponseList.length !== 0) {
          seasonResponseList.results.map((seasonData) => {
            const obj = {
              value: seasonData._id,
              label: seasonData.sName
            }
            if (seasonData.sName) {
              arr.push(obj)
            }
            return arr
          })
          setListOfSeasons(arr)
        }
      }
    }
    return () => {
      previousProps.seasonResponseList = seasonResponseList
    }
  }, [seasonResponseList])

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
    let order = 'desc'
    let searchValue = ''
    const sortbyvalue = 'dCreatedAt'
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
      if (obj.search) {
        searchValue = obj.search
        setSearch(obj.search)
      }
      if (!(obj.datefrom && obj.dateto)) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, sortbyvalue, order, searchValue, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
        getMatchesTotalCountFunc(searchValue, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      }
    }
    token && dispatch(getFormatsList(sportsType.toUpperCase(), token))
    setLoading(true)
    setListOfSeasons([])
    seasonList(0, 10, '', sportsType)
    setSelectedSeason([])
    setActivePageSeason(1)

    return () => {
      previousProps.sportsType = sportsType
    }
  }, [sportsType])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    localStorage.setItem('AppView', false)
  }, [props.location])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        MatchManagement: props.location.search
      }
      : data.MatchManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.matchList !== matchList) {
      if (matchList) {
        if (matchList.results) {
          const userArrLength = matchList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(matchList.results ? matchList.results : [])
        setIndex(activePageNo)
        setLoading(false)
      }
    }
    if (previousProps.matchesTotalCount !== matchesTotalCount) {
      setTotal(matchesTotalCount?.count ? matchesTotalCount.count : 0)
      setLoading(false)
    }
    return () => {
      previousProps.matchList = matchList
      previousProps.matchesTotalCount = matchesTotalCount
    }
  }, [matchList, matchesTotalCount])

  useEffect(() => {
    if (previousProps.filterMatchStatus !== filterMatchStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.filterMatchStatus = filterMatchStatus
    }
  }, [filterMatchStatus])

  useEffect(() => {
    if (previousProps.sProvider !== sProvider) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.sProvider = sProvider
    }
  }, [sProvider])

  useEffect(() => {
    if (previousProps.season !== season) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.season = season
    }
  }, [season])

  useEffect(() => {
    if (previousProps.sFormat !== sFormat) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.sFormat = sFormat
    }
  }, [sFormat])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
          getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          setPageNo(1)
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
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(props.search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
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
        getList(startFrom, limit, sort, order, search, filterMatchStatus, props.startDate, props.endDate, sProvider, season, sFormat)
        getMatchesTotalCountFunc(search, filterMatchStatus, props.startDate, props.endDate, sProvider, season, sFormat)
        props.startDate && setDateFrom(moment(props.startDate).format('YYYY-MM-DD'))
        props.endDate && setDateTo(moment(props.endDate).format('YYYY-MM-DD'))
        if ((obj && obj.datefrom && obj.dateto && obj.page)) {
          setPageNo(obj.page)
        } else {
          setPageNo(1)
        }
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, filterMatchStatus, props.startDate, props.endDate, sProvider, season, sFormat)
        getMatchesTotalCountFunc(search, filterMatchStatus, props.startDate, props.endDate, sProvider, season, sFormat)
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
    clearMatchMsg()
    getList(startFrom, limit, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
    getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      getMatchesTotalCountFunc(search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
    } else if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(0, offset, sort, order, search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  useEffect(() => {
    setListOfSeasons([])
    const callSearchService = () => {
      seasonList(0, 10, seasonInput, sportsType)
    }
    if (seasonInput) {
      if (previousProps.seasonInput !== seasonInput) {
        const debouncer = setTimeout(() => {
          callSearchService()
        }, 1000)
        return () => {
          clearTimeout(debouncer)
          previousProps.seasonInput = seasonInput
        }
      }
    }
    if (!seasonInput) {
      seasonList(0, 10, seasonInput, sportsType)
    }
    return () => {
      previousProps.seasonInput = seasonInput
    }
  }, [seasonInput])

  function onSorting (sortingBy) {
    const Order = sortingBy === 'dStartTime' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dStartTime') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, filterMatchStatus, startDate, endDate, sProvider, season, sFormat)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'dStartTime') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function onFiltering (event, type) {
    if (type === 'status') {
      setfilterMatchStatus(event.target.value)
    } else if (type === 'provider') {
      setsProvider(event.target.value)
    } else if (type === 'format') {
      setsFormat(event.target.value)
    } else if (type === 'season') {
      setSeason(event ? event.value : '')
      setSelectedSeason(event)
    }
  }

  function handleInputChange (value) {
    setSeasonInput(value)
  }

  function handleSelect (e) {
    setselectDate(e)
  }

  function addMatch () {
    AddMatch(moment(selectDate).format('YYYY-MM-DD'))
    props.handleDatePicker(false)
    setLoading(true)
  }

  function onSeasonPagination () {
    const length = Math.ceil(seasonResponseList?.total / 10)
    if (activePageSeason < length) {
      const start = activePageSeason * 10
      const limit = 10
      // setSeasonStart(start)
      seasonList(start, limit, seasonInput, sportsType)
      setActivePageSeason(activePageSeason + 1)
    }
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input value={value} placeholder='Select Date' ref={ref} readOnly />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

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
              <th> Name </th>
              <th>
                <div>Format</div>
                <CustomInput
                  type="select"
                  name="format"
                  id="format"
                  value={sFormat}
                  className='mt-2'
                  onChange={(event) => onFiltering(event, 'format')}
                >
                  <option value="">All</option>
                  {
                    getFormatList?.length > 0 && getFormatList.map((format, i) => {
                      return (
                        <Fragment key={i}>
                          <option value={format}>{format}</option>
                        </Fragment>
                      )
                    })
                  }
                </CustomInput>
              </th>
              <th>
                <div>Provider</div>
                <CustomInput
                  type="select"
                  name="provider"
                  id="provider"
                  value={sProvider}
                  className='mt-2'
                  onChange={(event) => onFiltering(event, 'provider')}
                >
                  <option value="">All</option>
                  <option value="ENTITYSPORT">ENTITYSPORT</option>
                  <option value="SPORTSRADAR">SPORTSRADAR</option>
                  <option value='CUSTOM'>CUSTOM</option>
                </CustomInput>
              </th>
              <th> Match Key </th>
              <th>
                <FormGroup>
                  <Label for="LeagueName">Season Name</Label>
                  <Select
                    menuPlacement="auto"
                    menuPosition="fixed"
                    isClearable={true}
                    captureMenuScroll={true}
                    components={animatedComponents}
                    options={listOfSeasons}
                    onMenuScrollToBottom={onSeasonPagination}
                    id="LeagueName"
                    name="LeagueName"
                    placeholder="Select Season"
                    value={selectedSeason}
                    onChange={selectedOption => onFiltering(selectedOption, 'season')}
                    onInputChange={(value) => handleInputChange(value)}
                  />
                </FormGroup>
              </th>
              <th>
                <span className="d-inline-block align-middle">Match Date</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('dStartDate')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>
                <div>Status</div>
                <CustomInput
                  type="select"
                  name="MatchStatus"
                  id="MatchStatus"
                  value={filterMatchStatus}
                  className='mt-2'
                  onChange={(event) => onFiltering(event, 'status')}
                >
                  <option value="">All</option>
                  <option value="P">Pending</option>
                  <option value="U">Upcoming </option>
                  <option value="L">Live </option>
                  <option value="I">In-Review </option>
                  <option value="CMP">Completed </option>
                  <option value="CNCL">Cancel</option>
                </CustomInput>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={9} />
              : <Fragment>
                {list && list.length !== 0 && list.map((data, i) => {
                  return (
                        <tr key={data._id}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>{data.sName ? data.sName : '-'}</td>
                          <td>{data.eFormat ? data.eFormat : '-'}</td>
                          <td>{data.eProvider ? data.eProvider : '--'}</td>
                          <td>{data.sKey ? data.sKey : '-'}</td>
                          <td>{data.sSeasonName ? data.sSeasonName : '-'}</td>
                          <td>{moment(data.dStartDate).format('DD/MM/YYYY hh:mm A')}</td>
                          <td>
                            {data.eStatus === 'I' ? 'In-Review' : data.eStatus === 'P' ? 'Pending' : data.eStatus === 'U' ? 'Upcoming' : data.eStatus === 'L' ? 'Live' : data.eStatus === 'CMP' ? 'Completed' : data.eStatus === 'CNCL' ? 'Cancel' : '-'}
                          </td>
                          <td>
                            <ul className='action-list mb-0 d-flex'>
                              <li>
                                <Link color='link' className='view' to={`${props.viewLink}/${data._id}`}>
                                  <img src={viewIcon} alt='View' />
                                  View
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
      {
        !loading && list.length === 0 && (
          <div className="text-center">
            <h3>No Match available</h3>
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

      <Modal isOpen={openPicker} className='fetchMatchModal'>
        <ModalHeader>Fetch Match From Date</ModalHeader>
        <ModalBody>
          <Row>
          {sportsType === 'kabaddi' && <Col md='3' />}
            <Col md='6'>
              <CustomInput type="select" name="sportsType" id="sportsType" className="form-control mb-3" value={provider} onChange={event => setProviderFunc(event)}>
                <option value='ENTITYSPORT'>ENTITYSPORT</option>
                {sportsType !== 'kabaddi' && <option value='SPORTSRADAR'>SPORTSRADAR</option>}
              </CustomInput>
            </Col>
            {sportsType === 'kabaddi' && <Col md='3' />}
            {sportsType !== 'kabaddi' && <Col md='6'>
              <FormGroup>
                <DatePicker
                  selected={selectDate}
                  value={selectDate}
                  dateFormat="dd-MM-yyyy"
                  onChange={handleSelect}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  customInput={<ExampleCustomInput />}
                  disabled={adminPermission?.MATCH === 'R'}
                />
            </FormGroup>
            </Col>}
            <Col md='6'>
              <Button
                className="theme-btn danger-btn full-btn"
                data-dismiss="modal"
                type="button"
                onClick={onClose}
              >
                Close
              </Button>
            </Col>
            <Col md='6' className='mb-3'>
              <Button className="theme-btn success-btn full-btn" data-dismiss="modal" type="button" onClick={addMatch} disabled={sportsType !== 'kabaddi' && !selectDate}>Confirm</Button>
            </Col>
            </Row>
        </ModalBody>
      </Modal>
      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className="text-center">
          <img className="info-icon" src={warningIcon} alt="check" />
          <h2>Are you sure you want to delete it?</h2>
          <Row className="row-12">
            <Col>
              <Button type="submit" className="theme-btn outline-btn full-btn" onClick={toggleWarning}>Cancel</Button>
            </Col>
            <Col>
              <Button type="submit" className="theme-btn danger-btn full-btn">Yes, Delete it</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
})

MatchManagement.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  openPicker: PropTypes.bool,
  AddMatch: PropTypes.func,
  clearMatchMsg: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setProviderFunc: PropTypes.func,
  provider: PropTypes.string,
  location: PropTypes.object,
  viewLink: PropTypes.string,
  handleDatePicker: PropTypes.func,
  openDatePicker: PropTypes.bool,
  search: PropTypes.string,
  searchDate: PropTypes.string,
  history: PropTypes.object,
  getMatchesTotalCountFunc: PropTypes.func,
  value: PropTypes.string,
  onClick: PropTypes.func,
  seasonList: PropTypes.func
}

MatchManagement.displayName = MatchManagement

export default connect(null, null, null, { forwardRef: true })(MatchManagement)
