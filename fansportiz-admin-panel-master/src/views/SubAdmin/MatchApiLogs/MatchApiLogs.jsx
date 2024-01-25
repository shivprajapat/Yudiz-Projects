import React, {
  Fragment, useRef, useState, useEffect, forwardRef, useImperativeHandle
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, CustomInput, Modal, ModalBody, ModalHeader } from 'reactstrap'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import ReactJson from 'react-json-view'
import PropTypes from 'prop-types'
import PaginationComponent from '../../../components/PaginationComponent'
import SkeletonTable from '../../../components/SkeletonTable'
import viewIcon from '../../../assets/images/view-icon.svg'
import moment from 'moment'
import { getUrl } from '../../../actions/url'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import { getMatchAPIDetails } from '../../../actions/subadmin'

const MatchApiLogsList = forwardRef((props, ref) => {
  const {
    getList, List, startDate, endDate, match
  } = props
  const dispatch = useDispatch()
  const [isModalOpen, setModalOpen] = useState(false)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [filter, setFilter] = useQueryState('eType', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 entries')
  const toggleModal = () => setModalOpen(!isModalOpen)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.subadmin.resStatus)
  const resMessage = useSelector(state => state.subadmin.resMessage)
  const matchAPIDetails = useSelector(state => state.subadmin.matchAPIDetails)
  const obj = qs.parse(props.location.search)
  const previousProps = useRef({
    resMessage, resStatus, List, start, offset, startDate, endDate, filter
  }).current
  const paginationFlag = useRef(false)

  useEffect(() => {
    let page = 1
    let limit = offset
    let orderBy = 'desc'
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
      setLoading(true)
      if (match.params.id) {
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        // getMatchLogsFunc(startFrom, limit)
      } else if (!obj.user) {
        dispatch(getUrl('media'))
        const startFrom = (page - 1) * offset
        setStart(startFrom)
        getList(startFrom, limit, orderBy, filter)
      }
    }
    const startFrom = (page - 1) * offset
    getList(startFrom, offset, order, filter)
  }, [])

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
          getList(startFrom, limit, order, filter)
          setPageNo(activePageNo)
        } else {
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.filter !== filter) {
      if (filter === 'SCOREPOINT' || filter === 'SCORECARD' || filter === 'LINEUP' || filter === 'MATCHES' || filter === '') {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, order, filter)
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.filter = filter
    }
  }, [filter])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, order, filter)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function setModalOpenFunc (data) {
    setModalOpen(true)
    dispatch(getMatchAPIDetails(data?._id, token))
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  function onRefresh () {
    const startFrom = 0
    getList(startFrom, offset, order, filter)
    dispatch(getUrl('media'))
    setLoading(true)
    setPageNo(1)
  }

  function onSorting () {
    if (order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, 'desc', filter)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, 'asc', filter)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    }
  }

  function onFilter (e) {
    setFilter(e.target.value)
  }

  return (
    <Fragment>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Provider</th>
              <th>Category</th>
              <th>
                <div>Type</div>
                <CustomInput
                  type="select"
                  name="filter"
                  id="filter"
                  value={filter}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-100'}`}
                  onChange={(e) => onFilter(e)}
                >
                  <option value="">All</option>
                  <option value="LINEUP">LINEUP</option>
                  <option value="MATCHES">MATCHES</option>
                  <option value="SCOREPOINT">SCOREPOINT</option>
                  <option value="SCORECARD">SCORECARD</option>
                </CustomInput>
              </th>
              <th>
                <span className="d-inline-block align-middle">Operation Time</span>
                <Button color="link" className="sort-btn" onClick={onSorting}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={6} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{data.eProvider ? data.eProvider : '--'}</td>
                        <td>{data.eCategory ? data.eCategory : '--'}</td>
                        <td>{data.eType ? data.eType : '--'}</td>
                        <td>{data.dCreatedAt ? moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                        <td>
                          <ul className='action-list mb-0 d-flex'>
                            <li>
                              <Button color='link' onClick={() => setModalOpenFunc(data)}>
                                <img src={viewIcon} alt='View' />
                                View
                              </Button>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>)
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 && (
          <div className="text-center">
            <h3>Match API Logs not available</h3>
          </div>
        )
      }

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Match API Details</ModalHeader>
        <ModalBody>
          <ReactJson
            src={{ sUrl: matchAPIDetails?.sUrl }}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={(copy) => {
              const container = document.createElement('textarea')
              const val = copy.src
              container.innerHTML = typeof (val) === 'string'
                ? val
                : JSON.stringify(
                  val,
                  null,
                  '  '
                )
              document.body.appendChild(container)
              container.select()
              document.execCommand('copy')
              document.body.removeChild(container)
            }}
            name='sUrl'
          />
          <ReactJson src={matchAPIDetails?.oData} displayDataTypes={false} collapsed={1} displayObjectSize={false} name='oData' />
        </ModalBody>
      </Modal>

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

MatchApiLogsList.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  List: PropTypes.object,
  viewLink: PropTypes.string,
  getAdminIds: PropTypes.func,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  adminSearch: PropTypes.string,
  recommendedList: PropTypes.object,
  dateFlag: PropTypes.bool
}

MatchApiLogsList.displayName = MatchApiLogsList

export default MatchApiLogsList
