import React, {
  Fragment, useState, useEffect, useRef, forwardRef
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, CustomInput, UncontrolledAlert, Modal, ModalHeader, ModalBody, Row, Col
} from 'reactstrap'
import PropTypes from 'prop-types'
import { alertClass, modalMessageFunc, verifyLength } from '../../../helpers/helper'
import Loading from '../../../components/Loading'
import { AddTimeNoti, deleteNotification, TypeList } from '../../../actions/notification'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Link } from 'react-router-dom'
import viewIcon from '../../../assets/images/view-icon.svg'
import SkeletonTable from '../../../components/SkeletonTable'
import warningIcon from '../../../assets/images/warning-icon.svg'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import sortIcon from '../../../assets/images/sorting-icon.svg'

function NotificationContent (props) {
  const { modalOpen, setModalOpen, getList, startDate, endDate } = props
  const dispatch = useDispatch()
  const searchProp = props.search
  const [list, setList] = useState([])
  const [notificationTypeList, setNotificationTypeList] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [Title, setTitle] = useState('')
  const [titleErr, setTitleErr] = useState('')
  const [Message, setmessage] = useState('')
  const [Type, setType] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [messageErr, setMessageErr] = useState('')
  const [expireDate, setExpireDate] = useState('')
  const [expireDateErr, setExpireDateErr] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [start, setStart] = useState(0)
  const [dateFrom, setDateFrom] = useQueryState('datefrom', '')
  const [dateTo, setDateTo] = useQueryState('dateto', '')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [search, setSearch] = useQueryState('search', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 entries')
  const [notificationType, setNotificationType] = useQueryState('notificationtype', '')
  const [order, setOrder] = useQueryState('order', 'des')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const typesList = useSelector(state => state.notification.typeList)
  const notificationList = useSelector(state => state.notification.notificationsList)
  const resStatus = useSelector(state => state.notification.resStatus)
  const resMessage = useSelector(state => state.notification.resMessage)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, notificationList, notificationType, startDate, endDate, searchProp, start, offset }).current
  const toggleModal = () => setModalOpen(!modalOpen)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (props.location.state) {
      setModalMessage(true)
      setMessage(props.location.state.message)
      setStatus(true)
      props.history.replace()
    }
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
        setListLength(`${limit} entries`)
      }
      if (obj.order) {
        orderBy = obj.order
        setOrder(orderBy)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, notificationType, dateFrom, dateTo, token)
    dispatch(TypeList(token))
    setLoading(true)
  }, [])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        NotificationManagement: props.location.search
      }
      : data.NotificationManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.notificationList !== notificationList) {
      if (notificationList && notificationList.results) {
        if (notificationList.results) {
          const userArrLength = notificationList.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(notificationList.results || [])
        setIndex(activePageNo)
        setTotal(notificationList.total ? notificationList.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.notificationList = notificationList
    }
  }, [notificationList])

  useEffect(() => {
    if (typesList) {
      setNotificationTypeList(typesList)
    }
  }, [typesList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search, notificationType, dateFrom, dateTo, token)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search, notificationType, dateFrom, dateTo, token)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(activePageNo)
          }
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
    if (previousProps.notificationType !== notificationType) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, notificationType, dateFrom, dateTo, token)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.notificationType = notificationType
    }
  }, [notificationType])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, notificationType, dateFrom, dateTo, token)
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

  useEffect(() => {
    if (previousProps.startDate !== startDate || previousProps.endDate !== endDate) {
      if (props.startDate && props.endDate) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props.search, notificationType, props.startDate, props.endDate, token)
        setDateFrom(moment(props.startDate).format('MM-DD-YYYY'))
        setDateTo(moment(props.endDate).format('MM-DD-YYYY'))
        setPageNo(1)
        setLoading(true)
      } else if ((!props.startDate) && (!props.endDate)) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, props.search, notificationType, props.startDate, props.endDate, token)
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, search, notificationType, dateFrom, dateTo, token)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onFiltering (event) {
    setNotificationType(event.target.value)
  }

  function onSorting (sortingBy) {
    setSort(sortingBy)
    if (order === 'desc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, notificationType, dateFrom, dateTo, token)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, notificationType, dateFrom, dateTo, token)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Title':
        if (verifyLength(event.target.value, 3)) {
          setTitleErr('')
        } else {
          setTitleErr('length Should be atleast 3')
        }
        setTitle(event.target.value)
        break
      case 'Message':
        if (verifyLength(event.target.value, 3)) {
          setMessageErr('')
        } else {
          setMessageErr('length Should be atleast 3')
        }
        setmessage(event.target.value)
        break
      case 'Type':
        if (!event.target.value) {
          setTypeErr('Required field')
        } else {
          setTypeErr('')
        }
        setType(event.target.value)
        break
      case 'ExpiryDate':
        if (verifyLength(moment(event).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setExpireDateErr('')
        } else {
          setExpireDateErr('Required field')
        }
        setExpireDate(event)
        break
      default:
        break
    }
  }

  function AddNotification () {
    if (verifyLength(Title, 1) && verifyLength(Message, 1) && Type && expireDate && !expireDateErr && !titleErr && !messageErr) {
      dispatch(AddTimeNoti(Title, Message, Type, expireDate, token))
      toggleModal()
      setLoading(true)
      setTitle('')
      setmessage('')
      setExpireDate('')
      setType('')
    } else {
      if (!verifyLength(Type, 1)) {
        setTypeErr('Required field')
      }
      if (!verifyLength(Title, 1)) {
        setTitleErr('Required field')
      }
      if (!verifyLength(Message, 1)) {
        setMessageErr('Required field')
      }
      if (!expireDate) {
        setExpireDateErr('Required field')
      }
    }
  }

  // to check and disable past date
  function filterPassedTime (time) {
    const currentDate = new Date()
    const date = new Date(time)
    return currentDate.getTime() < date.getTime()
  }

  function checkDate (date) {
    return moment(date).isBefore(new Date(), 'h:mm aa')
  }

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deleteNotification(deleteId, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input value={value} placeholder='Select Expiry Date' ref={ref} readOnly />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <Fragment>
    {loading && <Loading />}
    {
      modalMessage && message &&
      (
        <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
      )
    }

    <Modal isOpen={modalOpen} toggle={toggleModal} className='custom-modal'>
      <ModalHeader toggle={toggleModal}>Notification</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">Title <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.NOTIFICATION === 'R'} name="title" placeholder="Title" value={Title} onChange={event => handleChange(event, 'Title')} />
              <p className="error-text">{titleErr}</p>
            </FormGroup>
            <FormGroup>
              <Label for="message">Message <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.NOTIFICATION === 'R'} type='textarea' name="message" placeholder="Message" value={Message} onChange={event => handleChange(event, 'Message')} />
              <p className="error-text">{messageErr}</p>
            </FormGroup>
            <FormGroup>
              <Label for="expireDate">Expiry Date & Time<span className="required-field">*</span></Label>
              <DatePicker
                selected={expireDate}
                value={expireDate}
                dateFormat="dd-MM-yyyy h:mm aa"
                minDate={new Date()}
                filterTime={filterPassedTime}
                onChange={(date) => {
                  if (checkDate(date)) {
                    handleChange(new Date(moment().add(30, 'minute').format()), 'ExpiryDate')
                  } else {
                    handleChange(date, 'ExpiryDate')
                  }
                }}
                showTimeSelect
                timeIntervals={15}
                customInput={<ExampleCustomInput />}
              />
              <p className="error-text">{expireDateErr}</p>
            </FormGroup>
            <FormGroup>
              <Label for="type">Type <span className="required-field">*</span></Label>
              <CustomInput disabled={adminPermission?.NOTIFICATION === 'R'} type="select" name="type" className="form-control" value={Type} onChange={event => handleChange(event, 'Type')}>
                <option value=''>Select notification type</option>
                {
                  notificationTypeList && notificationTypeList.length !== 0 && notificationTypeList.map((data) => {
                    return (
                      <option value={data._id} key={data._id}>{data.sHeading}</option>
                    )
                  })
                }
              </CustomInput>
              <p className="error-text">{typeErr}</p>
            </FormGroup>
            {
            ((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'R')) &&
              (<Fragment>
                <Button className="theme-btn full-btn" onClick={AddNotification}>
                  Send Notification
                </Button>
              </Fragment>)
            }
        </Form>
      </ModalBody>
    </Modal>
      <div className="table-responsive">
      <table className="common-rule-table">
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Title</th>
            <th>Message</th>
            <th>
              <div>Type</div>
              <CustomInput
                type="select"
                name="notificationType"
                id="notificationType"
                value={notificationType}
                className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-75'}`}
                onChange={(event) => onFiltering(event)}
              >
                <option value="">All</option>
                {typesList && typesList.length !== 0 && typesList.map((data, i) => {
                  return (
                    <option key={data._id} value={data._id}>{data.sHeading}</option>
                  )
                })}
              </CustomInput>
            </th>
            <th>
              <span className="d-inline-block align-middle">Expiry Date & Time</span>
              <Button color="link" className="sort-btn" onClick={() => onSorting('dExpTime')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? <SkeletonTable numberOfColumns={6} />
            : (
              <Fragment>
                {list.length !== 0 && list.map((data, i) => {
                  const type = (typesList?.length > 0 && data?.iType) && typesList.find(d => d._id === data.iType)
                  return (
                    <tr key={data._id}>
                      <td>{(((index - 1) * offset) + (i + 1))}</td>
                      <td>{data.sTitle ? data.sTitle : '--'}</td>
                      <td>{data.sMessage ? data.sMessage : '-- '}</td>
                      <td>{type?.sHeading || '--'}</td>
                      <td>{data.dExpTime ? moment(data.dExpTime).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                      <td>
                        <ul className="action-list mb-0 d-flex">
                          <li>
                            <Link className="view" to={`/settings/notification-details/${data._id}`}>
                              <img src={viewIcon} alt="View" />
                              <span>View</span></Link>
                            </li>
                            {((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'R')) &&
                            (<Fragment>
                            <li>
                              <Button color="link" className="delete" onClick={() => warningWithDeleteMessage(data._id, 'delete')}>
                                <img src={deleteIcon} alt="Delete" />
                                Delete
                              </Button>
                            </li>
                          </Fragment>)}
                        </ul>
                      </td>
                    </tr>)
                })
                }
              </Fragment>)}
        </tbody>
      </table>
    </div>
    {
      !loading && list.length === 0 && (
        <div className="text-center">
          <h6>Notifications not available</h6>
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
        <h2>Are you sure you want to delete it?</h2>
        <Row className='row-12'>
          <Col>
            <Button
              type='submit'
              className='theme-btn outline-btn full-btn'
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type='submit'
              className='theme-btn danger-btn full-btn'
              onClick={onDelete}
            >
              Yes, Delete It
            </Button>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  </Fragment>)
}

NotificationContent.propTypes = {
  list: PropTypes.array,
  viewLink: PropTypes.string,
  resStatus: PropTypes.bool,
  resMessage: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  modalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func,
  getList: PropTypes.func,
  location: PropTypes.object,
  search: PropTypes.string,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool
}

export default NotificationContent
