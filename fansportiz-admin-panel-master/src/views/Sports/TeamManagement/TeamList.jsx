import React, {
  Fragment, useState, useEffect, useRef
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Button, Modal, ModalBody, Row, Col, UncontrolledAlert, CustomInput
} from 'reactstrap'
import qs from 'query-string'
import { Link } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import viewIcon from '../../../assets/images/view-icon.svg'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { getUrl } from '../../../actions/url'
import SkeletonTable from '../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import { updateTeam } from '../../../actions/team'

function TeamList (props) {
  const {
    sportsType, getList, flag, EditPlayerLink, getTeamsTotalCountFunc, token
  } = props
  const [start, setStart] = useState(0)
  const [provider, setProvider] = useQueryState('provider', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const searchProp = props.search
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const teamsTotalCount = useSelector(state => state.team.teamsTotalCount)
  const teamList = useSelector(state => state.team.teamList)
  const resStatus = useSelector(state => state.team.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resMessage = useSelector(state => state.team.resMessage)
  const previousProps = useRef({ teamList, resMessage, resStatus, getUrlLink, provider, start, offset, teamsTotalCount }).current
  const [close, setClose] = useState(false)
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
    dispatch(getUrl('media'))
    let page = 1
    let limit = offset
    let orderBy = 'desc'
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
        orderBy = obj.order
        setOrder(orderBy)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, orderBy, search, provider)
    getTeamsTotalCountFunc(search, provider)
    setLoading(true)
  }, [sportsType])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (modalMessage) {
      setTimeout(() => {
        setModalMessage(false)
      }, 2000)
    }
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        TeamManagement: props.location.search
      }
      : data.TeamManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.teamList !== teamList) {
      if (teamList) {
        if (teamList.results) {
          const userArrLength = teamList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(teamList.results ? teamList.results : [])
        setIndex(activePageNo)
        setLoading(false)
      }
    }
    if (previousProps.teamsTotalCount !== teamsTotalCount && teamsTotalCount) {
      setTotal(teamsTotalCount?.count ? teamsTotalCount?.count : 0)
      setLoading(false)
    }
    return () => {
      previousProps.teamList = teamList
      previousProps.teamsTotalCount = teamsTotalCount
    }
  }, [teamList, teamsTotalCount])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search, provider)
          getTeamsTotalCountFunc(search, provider)
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
      getList(startFrom, limit, sort, order, props.search, provider)
      getTeamsTotalCountFunc(props.search, provider)
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
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.provider !== provider) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, provider)
      getTeamsTotalCountFunc(search, provider)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.provider = provider
    }
  }, [provider])

  useEffect(() => {
    if (((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) && start) {
      getList(start, offset, sort, order, search, provider)
      setLoading(true)
    } else if (previousProps.offset !== offset) {
      getList(start, offset, sort, order, search, provider)
      getTeamsTotalCountFunc(search, provider)
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

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updateTeamData = {
      Id: selectedData._id,
      sportsType,
      sKey: selectedData.sKey,
      sName: selectedData.sName,
      sImage: selectedData.sImage,
      sShortName: selectedData.sShortName,
      teamStatus: statuss,
      token
    }
    dispatch(updateTeam(updateTeamData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  return (
    <Fragment>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>
                <span className="d-inline-block align-middle">Team</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('sName')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Short Name</th>
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
              <th>Key</th>
              <th>Image</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={8} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.sName ? data.sName : '-'}</td>
                        <td>{data.sShortName ? data.sShortName : '-'}</td>
                        <td>{data.eProvider ? data.eProvider : '--'}</td>
                        <td>{data.sKey ? data.sKey : '-'}</td>
                        <td>{data.sImage ? <img src={url + data.sImage} className="theme-image" alt="No Image" /> : ' No Image '}</td>
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
                            disabled={adminPermission?.TEAM === 'R'}
                          />
                        </td>
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
                    ))
                  }
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
            <h3>No Team available</h3>
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
}

TeamList.propTypes = {
  sportsType: PropTypes.string,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  EditPlayerLink: PropTypes.string,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  getTeamsTotalCountFunc: PropTypes.func,
  token: PropTypes.string
}

export default TeamList
