import React, { forwardRef, Fragment, useEffect, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { FormGroup, Input, Label, CustomInput, Button, UncontrolledAlert, Modal, ModalBody, ModalHeader, Row, Col } from 'reactstrap'
import { alertClass, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import moment from 'moment'
import { AddPushNotification, automatedPushNotificationList, updatePushNotification } from '../../../../actions/pushnotification'
import Loading from '../../../../components/Loading'
import SkeletonTable from '../../../../components/SkeletonTable'
import { Link } from 'react-router-dom'
import viewIcon from '../../../../assets/images/view-icon.svg'
import warningIcon from '../../../../assets/images/warning-icon.svg'
import PropTypes from 'prop-types'
import DatePicker from 'react-datepicker'

function AutomatedNotification (props) {
  const { modalOpen, setModalOpen } = props
  const [list, setList] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [Type, setType] = useState('All')
  const [scheduleTime, setScheduleTime] = useState('')
  const [errTitle, setErrTitle] = useState('')
  const [errDescription, setErrDescription] = useState('')
  const [errType, setErrType] = useState('')
  const [errExpDate, setErrExpDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [statusType, setStatusType] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [close, setClose] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const notificationList = useSelector(state => state.pushNotification.automatedPushNotificationList)
  const resStatus = useSelector(state => state.pushNotification.resStatus)
  const resMessage = useSelector(state => state.pushNotification.resMessage)
  const isUpdateNotification = useSelector(state => state.pushNotification.isUpdateNotification)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const toggleModal = () => setModalOpen(!modalOpen)

  const previousProps = useRef({
    resStatus, resMessage, notificationList, isUpdateNotification
  }).current
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(automatedPushNotificationList(token))
    setLoading(true)
  }, [])

  useEffect(() => {
    if (notificationList && notificationList.length > 0) {
      setList(notificationList)
    }
    return () => {
      previousProps.notificationList = notificationList
    }
  }, [notificationList])

  useEffect(() => {
    if (previousProps.isUpdateNotification !== isUpdateNotification) {
      if (isUpdateNotification) {
        dispatch(automatedPushNotificationList(token))
      }
    }
    return () => {
      previousProps.isUpdateNotification = isUpdateNotification
    }
  }, [isUpdateNotification])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  function handleChange (event, type) {
    switch (type) {
      case 'title':
        if (verifyLength(event.target.value, 1)) {
          setErrTitle('')
        } else {
          setErrTitle('Required field')
        }
        setTitle(event.target.value)
        break
      case 'description':
        if (verifyLength(event.target.value, 1)) {
          setErrDescription('')
        } else {
          setErrDescription('Required field')
        }
        setDescription(event.target.value)
        break
      case 'Type':
        if (verifyLength(event.target.value, 1)) {
          setErrType('')
        } else {
          setErrType('Required field')
        }
        setType(event.target.value)
        break
      case 'scheduleTime':
        if (verifyLength(moment(event).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setErrExpDate('')
        } else {
          setErrExpDate('Required field')
        }
        if (moment(event._d).isBefore(moment())) {
          setErrExpDate('Date should be future date')
        }
        setScheduleTime(event)
        break
      default:
        break
    }
  }

  function onAdd (e) {
    e.preventDefault()
    if (verifyLength(title, 1) && verifyLength(description, 1) && verifyLength(Type, 1) && scheduleTime && !errTitle && !errDescription && !errType && !errExpDate) {
      const date = new Date(moment(scheduleTime).format())
      const hour = moment(scheduleTime).hours()
      const minutes = moment(scheduleTime).minutes()
      const seconds = moment(scheduleTime).seconds()
      const pushNotificationData = {
        title, description, Type, date: new Date(date).toISOString(), hour, minutes, seconds, token
      }
      dispatch(AddPushNotification(pushNotificationData))
      setTitle('')
      setDescription('')
      setScheduleTime('')
      setType('All')
      setLoading(true)
      setModalOpen(!modalOpen)
    } else {
      if (!verifyLength(title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(description, 1)) {
        setErrDescription('Required field')
      }
      if (!verifyLength(Type, 1)) {
        setErrType('Required field')
      }
      if (!scheduleTime) {
        setErrExpDate('Required field')
      }
    }
  }

  function warningWithConfirmMessage (data, eType) {
    setStatusType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onStatusUpdate () {
    const statuss = selectedData.bEnableNotifications ? 'N' : 'Y'
    const data = {
      heading: selectedData.sHeading,
      platform: selectedData.ePlatform,
      description: selectedData.sDescription,
      key: selectedData.eKey,
      notificationStatus: statuss,
      token,
      notificationId: selectedData._id
    }
    dispatch(updatePushNotification(data))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

  function filterPassedTime (time) {
    const currentDate = new Date()
    const date = new Date(time)
    return currentDate.getTime() < date.getTime()
  }

  function checkDate (date) {
    return moment(date).isBefore(new Date(), 'h:mm aa')
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input value={value} placeholder='Schedule Date & Time' type="text" ref={ref} readOnly />
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
      <Modal isOpen={modalOpen} className='custom-modal'>
      <ModalHeader toggle={toggleModal}>Push Notification</ModalHeader>
      <ModalBody>
        <div>
           <FormGroup>
            <Label for="NotificationTitle">Title <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.PUSHNOTIFICATION === 'R'} type="text" placeholder="Enter Notification Title" value={title} onChange={event => handleChange(event, 'title')} />
            <p className="error-text">{errTitle}</p>
          </FormGroup>
          <FormGroup>
            <Label for="startDate">Schedule Date & Time <span className="required-field">*</span></Label>
            <DatePicker
              selected={scheduleTime}
              value={scheduleTime}
              dateFormat="dd-MM-yyyy h:mm aa"
              minDate={new Date()}
              filterTime={filterPassedTime}
              onChange={(date) => {
                if (checkDate(date)) {
                  handleChange(new Date(moment().add(30, 'minute').format()), 'scheduleTime')
                } else {
                  handleChange(date, 'scheduleTime')
                }
              }}
              showTimeSelect
              timeIntervals={1}
              customInput={<ExampleCustomInput />}
              disabled={adminPermission?.PUSHNOTIFICATION === 'R' }
            />
            <p className="error-text">{errExpDate}</p>
          </FormGroup>
          <FormGroup>
            <Label for="notificationDescription">Description <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.PUSHNOTIFICATION === 'R'} type="textarea" placeholder="Enter Notification Description" value={description} onChange={event => handleChange(event, 'description')} />
            <p className="error-text">{errDescription}</p>
          </FormGroup>
          <FormGroup>
            <Label for="typeSelect">Notification Type</Label>
            <CustomInput disabled={adminPermission?.PUSHNOTIFICATION === 'R'} type="select" name="typeSelect" id="typeSelect" className="form-control" value={Type} onChange={event => handleChange(event, 'Type')}>
              <option>All</option>
              <option>Web</option>
              <option>IOS</option>
              <option>Android</option>
            </CustomInput>
            <p className="error-text">{errType}</p>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')) &&
              (
                <Fragment>
                  <Button type="submit" className="theme-btn full-btn" onClick={onAdd}>Send</Button>
                </Fragment>
              )
            }
        </div>
        </ModalBody>
      </Modal>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Heading</th>
                <th>Key</th>
                <th>Platform</th>
                <th>Description</th>
                <th>Updated At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? <SkeletonTable numberOfColumns={8} />
                : (
                  <Fragment>
                    {list.length !== 0 && list.map((data, i) => (
                        <tr key={data._id}>
                          <td>{(i + 1)}</td>
                          <td>{data.sHeading ? data.sHeading : '--'}</td>
                          <td>{data.eKey ? data.eKey : '-- '}</td>
                          <td>{data.ePlatform}</td>
                          <td>{data.sDescription ? data.sDescription : '--'}</td>
                          <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : '--'}</td>
                          <td>
                            <CustomInput
                              type='switch'
                              id={`${data._id}`}
                              key={`${data._id}`}
                              name={`${data._id}`}
                              onClick={() =>
                                warningWithConfirmMessage(
                                  data,
                                  data.bEnableNotifications ? 'Inactivate' : 'activate'
                                )
                              }
                              checked={data.bEnableNotifications}
                              disabled={adminPermission?.PUSHNOTIFICATION === 'R'
                              }
                            />
                          </td>
                          <td>
                            <ul className="action-list mb-0 d-flex">
                              <li>
                                <Link className="view" to={`/users/push-notification-details/${data._id}`}>
                                  <img src={viewIcon} alt="View" />
                                  <span>View</span></Link>
                              </li>
                            </ul>
                          </td>
                        </tr>))
                    }
                  </Fragment>)}
            </tbody>
          </table>
        </div>
        {
          !loading && list.length === 0 && (
            <div className="text-center">
              <h6>Push notifications not available</h6>
            </div>
          )
        }

        <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className='text-center'>
          <img className='info-icon' src={warningIcon} alt='check' />
          <h2>{`Are you sure you want to ${statusType} it?`}</h2>
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
                {`Yes, ${statusType} it`}
              </Button>
            </Col>
          </Row>
      </ModalBody>
      </Modal>

    </Fragment>
  )
}

AutomatedNotification.propTypes = {
  modalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func,
  value: PropTypes.string,
  onClick: PropTypes.func
}

export default connect()(AutomatedNotification)
