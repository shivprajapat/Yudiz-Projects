import React, { useState, Fragment, useEffect, useRef, forwardRef } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import qs from 'query-string'
import { UncontrolledAlert, Button, Modal, ModalBody, Row, Col, CustomInput } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import SkeletonTable from '../../../components/SkeletonTable'
import viewIcon from '../../../assets/images/view-icon.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import { deleteSeries } from '../../../actions/seriesLeaderBoard'
import warningIcon from '../../../assets/images/warning-icon.svg'
import deleteIcon from '../../../assets/images/delete-icon.svg'

const SeriesLeaderBoard = forwardRef((props, ref) => {
  const { List, getList, updateSeries, getGameCategory } = props
  const dispatch = useDispatch()
  const SelectGame = props?.selectGame || ''
  const searchProp = props?.search || ''
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'des')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
  const [listLength, setListLength] = useState('10 entries')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(1)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState('')
  const [seriesStatus, setSeriesStatus] = useQueryState('status', '')
  const [modalMessage, setModalMessage] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const token = useSelector((state) => state.auth.token)
  const Auth = useSelector((state) => state?.auth?.adminData?.eType)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const resMessage = useSelector((state) => state.seriesLeaderBoard.resMessage)
  const resStatus = useSelector((state) => state.seriesLeaderBoard.resStatus)
  const previousProps = useRef({
    List,
    SelectGame,
    start,
    offset,
    searchProp,
    seriesStatus,
    resMessage,
    resStatus
  }).current
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (props.location?.state) {
      if (props.location?.state?.message) {
        setMessage(props.location?.state?.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    let page = 0
    let limit = offset
    let order = 'dsc'
    const obj = qs.parse(props.location?.search)
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(obj?.page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(obj?.pageSize)
        setListLength(`${obj?.pageSize} users`)
      }
      if (obj.order) {
        order = obj.order
        setOrder(obj?.order)
      }
    }
    const startFrom = ((obj?.page - 1) * offset) || page
    setStart(startFrom)
    getList(startFrom, limit, sort, order, searchProp, seriesStatus, SelectGame)
    if (adminPermission?.MATCH !== 'N') {
      getGameCategory()
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, searchProp, seriesStatus, SelectGame)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setModalWarning(false)
          setLoading(false)
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
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props?.search, seriesStatus, SelectGame)
      setPageNo(1)
      setStart(startFrom)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && props.flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 3000)
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
    if (previousProps.seriesStatus !== seriesStatus) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, searchProp, seriesStatus, SelectGame)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.seriesStatus = seriesStatus
    }
  }, [seriesStatus])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        if (List.results) {
          const userArrLength = List.results.length
          const startFrom = (activePageNo - 1) * offset + 1
          const end = startFrom - 1 + userArrLength
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
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    data === {}
      ? (data = {
          SeriesLeaderBoard: props?.location?.search
        })
      : (data.SeriesLeaderBoard = props?.location?.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props?.location?.search])

  useEffect(() => {
    if (previousProps.SelectGame !== SelectGame) {
      if (SelectGame) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, searchProp, seriesStatus, SelectGame)
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.SelectGame = SelectGame
    }
  }, [SelectGame])

  useEffect(() => {
    if (
      (previousProps.start !== start || previousProps.offset !== offset) &&
      paginationFlag.current
    ) {
      getList(start, offset, sort, order, searchProp, seriesStatus, SelectGame)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    dispatch(deleteSeries(deleteId, token))
    setLoading(true)
  }

  function onFiltering (event) {
    setSeriesStatus(event.target.value)
  }

  function eStatusTernary (data) {
    if (data.eStatus === 'P') {
      return 'Pending'
    } else if (data.eStatus === 'L') {
      return 'Live'
    }
    return data.eStatus === 'CMP' ? 'Completed' : ''
  }

  return (
    <Fragment>
      {modalMessage && message && (
        <UncontrolledAlert color="primary" className={alertClass(status, close)}>
          {message}
        </UncontrolledAlert>
      )}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Name</th>
              <th>Info</th>
              <th>
                <div>Status</div>
                <CustomInput
                  type="select"
                  name="status"
                  id="status"
                  value={seriesStatus}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-75'}`}
                  onChange={(event) => onFiltering(event)}
                >
                  <option value="">All</option>
                  <option value="P">Pending</option>
                  <option value="L">Live</option>
                  <option value="CMP">Completed</option>
                </CustomInput>
              </th>
              <th>Actions </th>
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
                  list.map((data, i) => (
                    <tr key={data._id}>
                      <td>{(index - 1) * offset + (i + 1)}</td>
                      <td>{data.sName}</td>
                      <td>{data.sInfo ? data.sInfo : '--'}</td>
                      <td>{eStatusTernary(data)}</td>
                      <td>
                        <ul className="action-list mb-0 d-flex">
                          <li>
                            <Button
                              color="link"
                              className="view"
                              tag={Link}
                              to={`${updateSeries}/${data._id}`}
                            >
                              <img src={viewIcon} alt="View" />
                              View
                            </Button>
                          </li>
                          {((Auth && Auth === 'SUPER') ||
                            adminPermission?.SERIES_LEADERBOARD !== 'R') && (
                            <li>
                              <Button
                                color="link"
                                className="delete"
                                onClick={() => warningWithDeleteMessage(data._id)}
                              >
                                <img src={deleteIcon} alt="Delete" />
                                Delete
                              </Button>
                            </li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  ))}
              </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {!loading && list && list.length === 0 && (
        <div className="text-center">
          <h3>No SeriesLeaderBoard List available</h3>
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
        <ModalBody className="text-center">
          <img className="info-icon" src={warningIcon} alt="check" />
          <h2>Are you sure you want to Delete it?</h2>
          <Row>
            <Col>
              <Button type="submit" className="theme-btn outline-btn full-btn" onClick={onCancel}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type="submit"
                className="theme-btn danger-btn full-btn"
                onClick={deleteId && onDelete}
              >
                Yes, Delete It
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

SeriesLeaderBoard.propTypes = {
  List: PropTypes.array,
  getList: PropTypes.func,
  updateSeries: PropTypes.string,
  hello: PropTypes.string,
  handleSearch: PropTypes.func,
  getGameCategory: PropTypes.func,
  selectGame: PropTypes.string,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  paginationFlag: PropTypes.bool
}

SeriesLeaderBoard.displayName = SeriesLeaderBoard

export default SeriesLeaderBoard
