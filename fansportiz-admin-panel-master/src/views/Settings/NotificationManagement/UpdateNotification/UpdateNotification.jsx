import React, {
  Fragment, useState, useEffect, useRef, forwardRef
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, UncontrolledAlert, CustomInput
} from 'reactstrap'
import PropTypes from 'prop-types'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { getNotificationDetails, TypeList, updateNotification } from '../../../../actions/notification'
import { NavLink, useHistory } from 'react-router-dom'
import Loading from '../../../../components/Loading'
import { alertClass, modalMessageFunc, verifyLength } from '../../../../helpers/helper'

function UpdateNotification (props) {
  const { match } = props
  const history = useHistory()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [titleErr, setTitleErr] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationMessageErr, setNotificationMessageErr] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [expireTime, setExpireTime] = useState('')
  const [expireTimeErr, setExpireTimeErr] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const notificationDetails = useSelector(state => state.notification.notificationDetails)
  const notificationTypeList = useSelector(state => state.notification.typeList)
  const resStatus = useSelector(state => state.notification.resStatus)
  const resMessage = useSelector(state => state.notification.resMessage)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ notificationDetails, resStatus, resMessage }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))

  useEffect(() => {
    if (match.params.id) {
      dispatch(getNotificationDetails(match.params.id, token))
      dispatch(TypeList(token))
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.notificationDetails !== notificationDetails && notificationDetails) {
      setTitle(notificationDetails.sTitle)
      setNotificationMessage(notificationDetails.sMessage)
      setNotificationType(notificationDetails.iType)
      setExpireTime(new Date(moment(notificationDetails.dExpTime).format()))
      setLoading(false)
    }
    return () => {
      previousProps.notificationDetails = notificationDetails
    }
  }, [notificationDetails])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          history.push(`/settings/notification-management${page?.NotificationManagement || ''}`, { message: resMessage })
        }

        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function handleChange (event, type) {
    switch (type) {
      case 'Title':
        if (verifyLength(event.target.value, 3)) {
          setTitleErr('')
        } else {
          setTitleErr('Length should be at least 3')
        }
        setTitle(event.target.value)
        break
      case 'Message':
        if (verifyLength(event.target.value, 3)) {
          setNotificationMessageErr('')
        } else {
          setNotificationMessageErr('Length should be at least 3')
        }
        setNotificationMessage(event.target.value)
        break
      case 'NotificationType':
        if (!event.target.value) {
          setTypeErr('Required field')
        } else {
          setTypeErr('')
        }
        setNotificationType(event.target.value)
        break
      case 'ExpireTime':
        if (verifyLength(moment(event).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setExpireTimeErr('')
        } else {
          setExpireTimeErr('Required field')
        }
        setExpireTime(event)
        break
      default:
        break
    }
  }

  function onSubmit () {
    if (verifyLength(title, 1) && verifyLength(notificationMessage, 1) && notificationType && expireTime && !expireTimeErr && !titleErr && !notificationMessageErr) {
      const date = new Date(expireTime).toISOString()
      const data = {
        title, notificationMessage, notificationType, expireTime: date, token, notificationId: match.params.id
      }
      dispatch(updateNotification(data))
    } else {
      if (!verifyLength(notificationType, 1)) {
        setTypeErr('Required field')
      }
      if (!verifyLength(title, 1)) {
        setTitleErr('Required field')
      }
      if (!verifyLength(notificationMessage, 1)) {
        setNotificationMessageErr('Required field')
      }
      if (!expireTime) {
        setExpireTimeErr('Required field')
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

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input value={value} placeholder='Select Expiry Date' ref={ref} readOnly />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <main className="main-content">
      {loading && <Loading />}
      {
          modalMessage && message &&
          (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
      }
      <section className="common-form-block">
        <h2>Edit Notification</h2>
        <Form>
          <FormGroup>
            <Label for="title">Title <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.NOTFICATION === 'R'} name="title" placeholder="Enter Title" value={title} onChange={event => handleChange(event, 'Title')} />
            <p className='error-text'>{titleErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="notificationMessage">Message <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.NOTFICATION === 'R'} type='textarea' name="notificationMessage" placeholder="Enter Message" value={notificationMessage} onChange={event => handleChange(event, 'Message')} />
            <p className='error-text'>{notificationMessageErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="expireTime">Expiry Date & Time <span className="required-field">*</span></Label>
            <DatePicker
              selected={expireTime}
              value={expireTime}
              dateFormat="dd-MM-yyyy h:mm aa"
              minDate={new Date()}
              filterTime={filterPassedTime}
              onChange={(date) => {
                if (checkDate(date)) {
                  handleChange(new Date(moment().add(30, 'minute').format()), 'ExpireTime')
                } else {
                  handleChange(date, 'ExpireTime')
                }
              }}
              showTimeSelect
              timeIntervals={15}
              customInput={<ExampleCustomInput />}
            />
          </FormGroup>
          <FormGroup>
            <Label for="notificationType">Notification Type <span className="required-field">*</span></Label>
            <CustomInput type='select' disabled={adminPermission?.NOTIFICATION === 'R'} notificationType="select" name="notificationType" className="form-control" value={notificationType} onChange={event => handleChange(event, 'NotificationType')}>
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
              ((Auth && Auth === 'SUPER') || (adminPermission?.NOTFICATION !== 'R')) &&
              (
              <Fragment>
                  <Button className="theme-btn full-btn" onClick={onSubmit}>
                  Save Changes
                  </Button>
              </Fragment>
              )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/notification-management${page?.NotificationManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

UpdateNotification.propTypes = {
  match: PropTypes.object,
  list: PropTypes.array,
  viewLink: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func
}

export default UpdateNotification
