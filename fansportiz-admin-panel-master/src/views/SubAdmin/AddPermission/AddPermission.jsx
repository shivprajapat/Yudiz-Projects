import React, { useState, useEffect, useRef, Fragment } from 'react'
import {
  Button, Form, FormGroup, Label, Input, CustomInput, UncontrolledAlert
} from 'reactstrap'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import {
  alertClass,
  modalMessageFunc,
  verifyLength
} from '../../../helpers/helper'
import Loading from '../../../components/Loading'
import PropTypes from 'prop-types'

function AddPermission (props) {
  const {
    AddPermissionFunc, UpdatePermission, PermissionDetails
  } = props
  const [loading, setLoading] = useState(false)
  const [Name, setName] = useState('')
  const [PermissionStatus, setPermissionStatus] = useState('Y')
  const [ErrName, setErrName] = useState('')
  const [ErrKey, setErrKey] = useState('')
  const [Key, setKey] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [PermissionId, setPermissionId] = useState('')

  const resStatus = useSelector(state => state.permission.resStatus)
  const resMessage = useSelector(state => state.permission.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    resStatus, resMessage, PermissionDetails
  }).current
  const submitDisable = PermissionDetails && previousProps.PermissionDetails !== PermissionDetails && PermissionDetails.sName === Name && PermissionDetails.sKey === Key && PermissionDetails.eStatus === PermissionStatus
  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      setPermissionId(match.params.id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          props.history.push('/sub-admin/permission', { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
          }
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
    if (previousProps.PermissionDetails !== PermissionDetails) {
      if (PermissionDetails) {
        setName(PermissionDetails.sName)
        setKey(PermissionDetails.sKey)
        setPermissionStatus(PermissionDetails.eStatus)
        setLoading(false)
      }
    }
    return () => {
      previousProps.PermissionDetails = PermissionDetails
    }
  }, [PermissionDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'PermissionManagement':
        if (verifyLength(event.target.value, 1)) {
          setErrKey('')
        } else {
          setErrKey('Required field')
        }
        setKey(event.target.value)
        break
      case 'PermissionStatus':
        setPermissionStatus(event.target.value)
        break
      default:
        break
    }
  }

  function Submit (e) {
    e.preventDefault()
    if (verifyLength(Name, 1) && verifyLength(Key, 1) && !ErrName && PermissionStatus) {
      if (isCreate) {
        AddPermissionFunc(Name, Key, PermissionStatus)
      } else {
        UpdatePermission(Name, Key, PermissionStatus, PermissionId)
      }
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        setErrName('Required field')
      }
      if (!verifyLength(Key, 1)) {
        setErrKey('Required field')
      }
    }
  }

  function heading () {
    if (isCreate) {
      return 'Create Permission'
    }
    return !isEdit ? 'Edit Permission' : 'Permission Details'
  }

  function button () {
    if (isCreate) {
      return 'Create Permission'
    }
    return !isEdit ? 'Save Changes' : 'Edit Permission'
  }

  return (
    <div>
      <main className="main-content">
        {
          modalMessage && message &&
          (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
       {loading && <Loading />}
      <section className="common-form-block">
        <h2>
          {heading()}
        </h2>
        <Form>
          <FormGroup>
              <Label for="Name">Permission Name <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.PERMISSION === 'R'} name="Name" placeholder="Name" value={Name} onChange={event => handleChange(event, 'Name')} />
              <p className="error-text">{ErrName}</p>
          </FormGroup>
          <FormGroup>
              <Label for="Key">Permission Key <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.PERMISSION === 'R'} name="PermissionNone" placeholder="Permission key" value={Key} onChange={event => handleChange(event, 'PermissionManagement')} />
              <p className="error-text">{ErrKey}</p>
          </FormGroup>
          <FormGroup>
              <Label for="Status">Permission Status</Label>
              <div className="d-flex inline-input">
                <CustomInput disabled={adminPermission?.PERMISSION === 'R'} type="radio" id="PermissionStatus1" name="PermissionStatus" onClick={event => handleChange(event, 'PermissionStatus')} label="Active" value="Y" checked={PermissionStatus === 'Y'} />
                <CustomInput disabled={adminPermission?.PERMISSION === 'R'} type="radio" id="PermissionStatus2" name="PermissionStatus" onClick={event => handleChange(event, 'PermissionStatus')} label="InActive" value="N" checked={PermissionStatus === 'N'} />
              </div>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PERMISSION !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" onClick={Submit} disabled={submitDisable || (!Name || !Key)}>
                  {button()}
                </Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={props.cancelLink}>Cancel</NavLink>
        </div>
      </section>
      </main>
    </div>
  )
}

AddPermission.propTypes = {
  AddPermissionFunc: PropTypes.func,
  UpdatePermission: PropTypes.func,
  PermissionDetails: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  cancelLink: PropTypes.string
}

export default AddPermission
