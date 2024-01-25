import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, UncontrolledAlert, CustomInput, InputGroupText
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import Loading from '../../../../components/Loading'
import PropTypes from 'prop-types'
import { getPushNotificationDetails, updatePushNotification } from '../../../../actions/pushnotification'
import { alertClass, modalMessageFunc } from '../../../../helpers/helper'

function UpdatePushNotification (props) {
  const { match } = props
  const [heading, setHeading] = useState('')
  const [key, setKey] = useState('')
  const [platform, setPlatform] = useState('')
  const [description, setDescription] = useState('')
  const [notificationStatus, setNotificationStatus] = useState('N')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const pushNotificationDetails = useSelector(state => state.pushNotification.pushNotificationDetails)
  const resStatus = useSelector(state => state.pushNotification.resStatus)
  const resMessage = useSelector(state => state.pushNotification.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, pushNotificationDetails }).current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = pushNotificationDetails && previousProps.pushNotificationDetails !== pushNotificationDetails && pushNotificationDetails.sHeading === heading && pushNotificationDetails.ePlatform === platform && pushNotificationDetails.sDescription === description && (pushNotificationDetails.bEnableNotifications === (notificationStatus === 'Y'))

  useEffect(() => {
    dispatch(getPushNotificationDetails(match.params.id, token))
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          props.history.push('/users/push-notification', { message: resMessage })
        }

        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.pushNotificationDetails !== pushNotificationDetails) {
      if (pushNotificationDetails) {
        setHeading(pushNotificationDetails.sHeading || '')
        setKey(pushNotificationDetails.eKey || '')
        setPlatform(pushNotificationDetails.ePlatform || '')
        setDescription(pushNotificationDetails.sDescription || '')
        setNotificationStatus(pushNotificationDetails.bEnableNotifications ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.pushNotificationDetails = pushNotificationDetails
    }
  }, [pushNotificationDetails])

  function onSubmit (e) {
    e.preventDefault()
    const updateSportData = {
      heading, key, description, platform, notificationStatus, notificationId: match.params.id, token
    }
    dispatch(updatePushNotification(updateSportData))
    setLoading(true)
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Heading':
        setHeading(event.target.value)
        break
      case 'Description':
        setDescription(event.target.value)
        break
      case 'Platform':
        setPlatform(event.target.value)
        break
      case 'Status':
        setNotificationStatus(event.target.value)
        break
      default:
        break
    }
  }
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
        <h2>Edit Push Notification</h2>
        <Form>
          <FormGroup>
            <Label for="heading">Heading</Label>
            <Input disabled={adminPermission?.PUSHNOTIFICATION === 'R'} name="heading" placeholder="Enter Heading" value={heading} onChange={event => handleChange(event, 'Heading')} />
          </FormGroup>
          <FormGroup>
            <Label for="key">Key</Label>
            <InputGroupText>{key}</InputGroupText>
          </FormGroup>
          <FormGroup>
            <Label for="platform">Platform <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.PUSHNOTIFICATION === 'R'} type="select" name="typeSelect" id="typeSelect" className="form-control" value={platform} onChange={event => handleChange(event, 'Platform')}>
              <option value='ALL'>All</option>
              <option value='W'>Web</option>
              <option value='I'>iOS</option>
              <option value='A'>Android</option>
            </CustomInput>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input disabled={adminPermission?.PUSHNOTIFICATION === 'R'} name="Description" placeholder="Enter Description" value={description} onChange={event => handleChange(event, 'Description')} />
          </FormGroup>
          <FormGroup>
            <Label for="status">Status</Label>
            <div className="d-flex inline-input">
              <CustomInput
                  type="radio"
                  disabled={adminPermission?.PUSHNOTIFICATION === 'R'}
                  id="themeRadio1"
                  name="themeRadio"
                  label="Active"
                  onChange={event => handleChange(event, 'Status')}
                  checked={notificationStatus === 'Y'}
                  value="Y"
              />
              <CustomInput
                  type="radio"
                  disabled={adminPermission?.PUSHNOTIFICATION === 'R'}
                  id="themeRadio2"
                  name="themeRadio"
                  label="InActive"
                  onChange={event => handleChange(event, 'Status')}
                  checked={notificationStatus !== 'Y'}
                  value="N"
              />
            </div>
          </FormGroup>
          {
              ((Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')) &&
              (
              <Fragment>
                  <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onSubmit}>
                  Save Changes
                  </Button>
              </Fragment>
              )
          }
        </Form>
        <div className="form-footer text-center small-text">
            <NavLink to="/users/push-notification/automated-notification">Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

UpdatePushNotification.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default UpdatePushNotification
