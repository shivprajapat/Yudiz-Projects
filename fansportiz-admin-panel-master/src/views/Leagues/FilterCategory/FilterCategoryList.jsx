import React, {
  Fragment, useEffect, useState, useRef
} from 'react'
import {
  Button, UncontrolledAlert, Modal, ModalBody, Row, Col
} from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import qs from 'query-string'
import { deleteFilterCategory } from '../../../actions/leaguecategory'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../../components/SkeletonTable'
import viewIcon from '../../../assets/images/view-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import PropTypes from 'prop-types'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

function FilterCategoryList (props) {
  const {
    List, getList
  } = props

  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'des')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [type, setType] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [index, setIndex] = useState(1)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const Auth = useSelector(
    (state) => state.auth.adminData && state.auth.adminData.eType
  )
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const searchProp = props.search
  const resStatus = useSelector(state => state.leaguecategory.resStatus)
  const resMessage = useSelector(state => state.leaguecategory.resMessage)
  const isDeleted = useSelector(state => state.leaguecategory.isDeleted)
  const token = useSelector((state) => state.auth.token)
  const previousProps = useRef({ List, resMessage, resStatus, start, offset, isDeleted }).current
  const paginationFlag = useRef(false)

  const [modalMessage, setModalMessage] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setSort('dCreatedAt')
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
    let orders = 'dsc'
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
        orders = obj.order
        setOrder(orders)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search)
    setLoading(true)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        FilterCategory: props.location.search
      }
      : data.FilterCategory = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

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

  // to handle response
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, sort, order, search)
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
    if (previousProps.isDeleted !== isDeleted) {
      if (isDeleted) {
        toggleWarning()
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search)
      }
    }
    return () => {
      previousProps.isDeleted = isDeleted
    }
  }, [isDeleted])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search)
      setSearch(searchProp.trim())
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

  // will be called when page changes occurred
  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, props.search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    dispatch(deleteFilterCategory(deleteId, token))
    setLoading(true)
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
              <th> Sr No. </th>
              <th> Title </th>
              <th> Remark </th>
              <th> Actions  </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={4} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={data._id}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td> {data.sTitle} </td>
                          <td>{data.sRemark ? data.sRemark : ' - '} </td>
                          <td>
                            <ul className="action-list mb-0 d-flex">
                              <li>
                                <Button color="link" className="view" tag={Link} to={`${props.updateLeague}/${data._id}`}>
                                  <img src={viewIcon} alt="View" />
                                  View
                                </Button>
                              </li>
                              {((Auth && Auth === 'SUPER') ||
                                (adminPermission?.LEAGUE !== 'R')) && (
                                <li>
                                  <Button
                                    color='link'
                                    className='delete'
                                    onClick={() =>
                                      warningWithDeleteMessage(data._id, 'delete')
                                    }
                                  >
                                    <img src={deleteIcon} alt='Delete' />
                                    Delete
                                  </Button>
                                </li>
                              )}
                            </ul>
                          </td>
                        </tr>
                      )
                    })
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
            <h3>No Filter Category available</h3>
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
      <Modal
        isOpen={modalWarning}
        toggle={toggleWarning}
        className='modal-confirm'
      >
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
                onClick={deleteId && onDelete}
              >
                {' '}
                {deleteId ? 'Yes, Delete It' : `Yes, ${type} it`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

FilterCategoryList.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.arrayOf(PropTypes.object),
  flag: PropTypes.bool,
  updateLeague: PropTypes.string
}

export default FilterCategoryList
