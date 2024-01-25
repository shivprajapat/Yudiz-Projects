import React, {
  Fragment, useEffect, useState, useRef
} from 'react'
import {
  Button, Modal, ModalBody, Row, Col, UncontrolledAlert, CustomInput
} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import qs from 'query-string'
import { Link } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../../components/SkeletonTable'
import viewIcon from '../../../assets/images/view-icon.svg'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { getUrl } from '../../../actions/url'
import PropTypes from 'prop-types'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

function PlayerList (props) {
  const {
    sportsType, getList, EditPlayerLink, getPlayersTotalCountFunc
  } = props
  const [start, setStart] = useState(0)
  const [provider, setProvider] = useQueryState('provider', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'dsc')
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [url, setUrl] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const searchProp = props.search

  const dispatch = useDispatch()
  const playerList = useSelector(state => state.player.playersList)
  const playersTotalCount = useSelector(state => state.player.playersTotalCount)
  const resStatus = useSelector(state => state.team.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resMessage = useSelector(state => state.team.resMessage)
  const previousProps = useRef({ playerList, resMessage, resStatus, provider, start, offset, playersTotalCount }).current
  const paginationFlag = useRef(false)

  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
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
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, provider)
    getPlayersTotalCountFunc(search, provider)
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.playerList !== playerList) {
      if (playerList) {
        if (playerList.results) {
          const userArrLength = playerList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(playerList.results ? playerList.results : [])
        setIndex(activePageNo)
        setLoading(false)
      }
    }
    if (previousProps.playersTotalCount !== playersTotalCount && playersTotalCount) {
      setTotal(playersTotalCount?.count ? playersTotalCount?.count : 0)
    }
    return () => {
      previousProps.playerList = playerList
      previousProps.playersTotalCount = playersTotalCount
    }
  }, [playerList, playersTotalCount])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : []
    data === {}
      ? data = {
        PlayerManagement: props.location.search
      }
      : data.PlayerManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search, provider)
          getPlayersTotalCountFunc(search, provider)
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
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.provider !== provider) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, provider)
      getPlayersTotalCountFunc(search, provider)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.provider = provider
    }
  }, [provider])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, provider)
      getPlayersTotalCountFunc(props.search, provider)
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current && start) {
      getList(start, offset, sort, order, search, provider)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, provider)
      getPlayersTotalCountFunc(search, provider)
      setLoading(true)
    } else if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current)) {
      getList(0, offset, sort, order, search, provider)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onSorting (sortingBy) {
    const Order = sortingBy === 'sName' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, provider)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'sName') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, provider)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'sName') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function onFiltering (event) {
    setProvider(event.target.value)
  }

  return (
    <Fragment>
      <div className="table-responsive">
        {
          modalMessage && message &&
          (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>
                <span className="d-inline-block align-middle">Player Name</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('sName')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Player Key</th>
              <th>
                <div>Provider</div>
                <CustomInput
                  type="select"
                  name="provider"
                  id="provider"
                  value={provider}
                  className='mt-2'
                  onChange={onFiltering}
                >
                  <option value="">All</option>
                  <option value="ENTITYSPORT">ENTITYSPORT</option>
                  <option value="SPORTSRADAR">SPORTSRADAR</option>
                  <option value="CUSTOM">CUSTOM</option>
                </CustomInput>
              </th>
              <th>Credits</th>
              <th>Player Role</th>
              <th>Player Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={8} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <Fragment key={data._id}>
                          <tr key={data._id}>
                            <td>{(((index - 1) * offset) + (i + 1))}</td>
                            <td>{data.sName}</td>
                            <td>{data.sKey}</td>
                            <td>{data.eProvider ? data.eProvider : '--'}</td>
                            <td>{data.nFantasyCredit ? data.nFantasyCredit : ' - '}</td>
                            <td>{data.eRole}</td>
                            <td>{data.sImage ? <img src={url + data.sImage} className="theme-image" alt="No Image" /> : ' No Image '}</td>
                            <td>
                              <ul className="action-list mb-0 d-flex">
                                <li>
                                  <Button color="link" className="view" tag={Link} to={`${EditPlayerLink}/${data._id}`}>
                                    <img src={viewIcon} alt="View" />
                                    View
                                  </Button>
                                </li>
                              </ul>
                            </td>
                          </tr>
                        </Fragment>
                      )
                    })}
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>Players not available</h3>
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
    </Fragment>
  )
}

PlayerList.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  EditPlayerLink: PropTypes.string,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  getPlayersTotalCountFunc: PropTypes.func
}

export default PlayerList
