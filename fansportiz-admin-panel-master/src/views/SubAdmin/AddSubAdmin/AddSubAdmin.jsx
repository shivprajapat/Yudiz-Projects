import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  FormGroup, Input, Label, Button, CustomInput, UncontrolledAlert, Form
} from 'reactstrap'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import {
  verifyEmail, verifyPassword, verifyLength, verifyMobileNumber, isNumber, alertClass, modalMessageFunc
} from '../../../helpers/helper'
import Loading from '../../../components/Loading'
import { geActiveRolesList } from '../../../actions/role'
import backIcon from '../../../assets/images/left-theme-arrow.svg'

const animatedComponents = makeAnimated()
function AddSubAdminForm (props) {
  const {
    SubAdminDetails, match, addSubAdmin, updateSubAdmin
  } = props
  const history = useHistory()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [MobNum, setMobNum] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState([])
  const [options, setOptions] = useState([])
  const [selectedRole, setSelectedRole] = useState([])
  const [subAdminStatus, setSubAdminStatus] = useState('Y')
  const [errUsername, setErrUsername] = useState('')
  const [errFullname, setErrFullname] = useState('')
  const [roleErr, setRoleErr] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [errEmail, setErrEmail] = useState('')
  const [errMobNum, setErrMobNum] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [close, setClose] = useState(false)
  const [SubAdminId, setSubAdminId] = useState('')

  const activeRolesList = useSelector(state => state.role.activeRolesList)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.subadmin.resStatus)
  const resMessage = useSelector(state => state.subadmin.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)

  const previousProps = useRef({
    resStatus, resMessage, SubAdminDetails
  }).current
  const updateDisable = SubAdminDetails && previousProps.SubAdminDetails !== SubAdminDetails && SubAdminDetails.sName === fullname && SubAdminDetails.sUsername === username && SubAdminDetails.sEmail === email && SubAdminDetails.sMobNum === MobNum && SubAdminDetails.eStatus === subAdminStatus && SubAdminDetails.aRole === role && SubAdminDetails.sPassword === password
  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    if (match.params.id) {
      setSubAdminId(match.params.id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(geActiveRolesList(token))
  }, [])

  useEffect(() => {
    if (activeRolesList) {
      const arr = []
      if (activeRolesList?.length !== 0) {
        activeRolesList?.map((data) => {
          const obj = {
            value: data?._id,
            label: data?.sName
          }
          arr.push(obj)
          return arr
        })
        setOptions(arr)
      }
    }
  }, [activeRolesList])

  useEffect(() => {
    if (previousProps.SubAdminDetails !== SubAdminDetails) {
      if (SubAdminDetails) {
        const arr = [...role]
        SubAdminDetails?.aRole?.map((item) => {
          const obj = {
            value: item._id,
            label: item.sName
          }
          arr.push(obj)
          return arr
        })
        setUsername(SubAdminDetails.sUsername ? SubAdminDetails.sUsername : '')
        setFullname(SubAdminDetails.sName ? SubAdminDetails.sName : '')
        setEmail(SubAdminDetails.sEmail ? SubAdminDetails.sEmail : '')
        setMobNum(SubAdminDetails.sMobNum ? SubAdminDetails.sMobNum : '')
        setRole(arr)
        setSubAdminStatus(SubAdminDetails.eStatus ? SubAdminDetails.eStatus : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.SubAdminDetails = SubAdminDetails
    }
  }, [SubAdminDetails])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          props.history.push('/sub-admin', { message: resMessage })
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

  function handleChange (event, type) {
    switch (type) {
      case 'Username':
        if (verifyLength(event.target.value, 1)) {
          setErrUsername('')
        } else {
          setErrUsername('Required field')
        }
        setUsername(event.target.value)
        break
      case 'Fullname':
        if (verifyLength(event.target.value, 1)) {
          setErrFullname('')
        } else {
          setErrFullname('Required field')
        }
        if (isNumber(event.target.value)) {
          setErrFullname('Name must be alphanumeric')
        }
        setFullname(event.target.value)
        break
      case 'Email':
        if (verifyLength(event.target.value, 1) && verifyEmail(event.target.value)) {
          setErrEmail('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrEmail('Required field')
        } else {
          setErrEmail('Invalid email')
        }
        setEmail(event.target.value)
        break
      case 'MobileNum':
        if (isNumber(event.target.value) || !event.target.value) {
          if (verifyMobileNumber(event.target.value)) {
            setErrMobNum('')
          } else {
            setErrMobNum('Must contain 10 digits')
          }
          setMobNum(event.target.value)
        }
        break
      case 'Password':
        if (verifyPassword(event.target.value)) {
          setErrPassword('')
        } else {
          setErrPassword('Must contain minimum 5 characters and maximum 14 characters')
        }
        setPassword(event.target.value)
        break
      // case 'Role':
      //   if (!verifyLength(event.target.value, 1)) {
      //     setRoleErr('Required field')
      //   } else {
      //     setRoleErr('')
      //   }
      //   setRole(event.target.value)
      //   break
      case 'Status':
        setSubAdminStatus(event.target.value)
        break
      default:
        break
    }
  }

  function onHandleChange (selected) {
    if (selected) {
      setSelectedRole(selected)
      if (selected.length >= 1) {
        setRoleErr('')
      } else {
        setRoleErr('Required field')
      }
      setRole(selected)
    } else {
      setRole([])
    }
  }

  function onSubmit (e) {
    e.preventDefault()

    const addValidation = verifyLength(username, 1) && verifyLength(password, 1) && verifyLength(fullname, 1) && verifyLength(email, 1) && verifyLength(MobNum, 1) && verifyLength(role, 1) && !errUsername && !errFullname && !errEmail && !roleErr && !errPassword
    const updateValidation = verifyLength(username, 1) && verifyLength(fullname, 1) && verifyLength(email, 1) && verifyLength(MobNum, 1) && verifyLength(role, 1) && !errUsername && !errFullname && !errEmail && !roleErr
    const validate = isCreate ? addValidation : updateValidation

    if (validate) {
      setLoading(true)
      const selected = []
      selectedRole.map((data) => {
        selected.push(data.value)
        return selected
      })
      if (isCreate) {
        addSubAdmin(fullname, username, email, MobNum, password, selected, subAdminStatus)
      } else {
        updateSubAdmin(fullname, username, email, MobNum, password, selected, SubAdminId, subAdminStatus)
      }
      setLoading(true)
    } else {
      if (!verifyLength(username, 1)) {
        setErrUsername('Required field')
      }
      if (!verifyLength(fullname, 1)) {
        setErrFullname('Required field')
      }
      if (!verifyLength(email, 1)) {
        setErrEmail('Required field')
      }
      if (!verifyLength(MobNum, 1)) {
        setErrMobNum('Required field')
      }
      if (isCreate && (!verifyLength(password, 1))) {
        setErrPassword('Required field')
      }
      if (!verifyLength(role, 1)) {
        setRoleErr('Required field')
      }
    }
  }

  function button () {
    if (isCreate) {
      return 'Create SubAdmin'
    }
    return !isEdit ? 'Save Changes' : 'Edit SubAdmin'
  }

  return (
    <main className="main-content">
      <section className="common-box common-detail">
        {
          modalMessage && message && (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        {loading && <Loading />}
        <section className="common-form-block">
          <div className='d-flex inline-input'>
            <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.goBack()}></img>
              <h2>{isCreate ? 'Add Sub Admin' : 'Edit Sub Admin'}</h2>
          </div>
        <Form>
          <FormGroup>
            <Label for="Username">Username <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SUBADMIN === 'R'} type="text" id="Username" placeholder="Enter Username" value={username} onChange={event => handleChange(event, 'Username')} />
            <p className="error-text">{errUsername}</p>
          </FormGroup>
          <FormGroup>
            <Label for="fullName">Full Name <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SUBADMIN === 'R'} type="text" id="fullName" placeholder="Enter Full Name" value={fullname} onChange={event => handleChange(event, 'Fullname')} />
            <p className="error-text">{errFullname}</p>
          </FormGroup>
          <FormGroup>
            <Label for="emailAddress">Email Address <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SUBADMIN === 'R'} type="email" id="emailAddress" placeholder="Enter Email Address" value={email} onChange={event => handleChange(event, 'Email')} />
            <p className="error-text">{errEmail}</p>
          </FormGroup>
          <FormGroup>
            <Label for="phoneNumber">Mobile Number <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SUBADMIN === 'R'} type="tel" id="phoneNumber" placeholder="Enter Mobile Number" value={MobNum} onChange={event => handleChange(event, 'MobileNum')} />
            <p className="error-text">{errMobNum}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Password">Password {isCreate ? <span className="required-field">*</span> : ''}</Label>
            <Input disabled={adminPermission?.SUBADMIN === 'R'} type="password" id="Password" placeholder="Enter Password" value={password} onChange={event => handleChange(event, 'Password')} />
            <p className="error-text">{errPassword}</p>
          </FormGroup>
          <FormGroup>
              <Label>Role <span className="required-field">*</span></Label>
              {/* <CustomInput disabled={adminPermission?.SUBADMIN === 'R'} type="select" name="Role" className="form-control" value={role} onChange={event => handleChange(event, 'Role')}>
                <option value=''>Select Role</option>
                {activeRolesList && activeRolesList.length !== 0 && activeRolesList.map(data =>
                  <option key={data._id} value={data._id}>{data.sName}</option>)}
              </CustomInput> */}
              <Select
                    menuPlacement="auto"
                    menuPosition="fixed"
                    captureMenuScroll={true}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti={true}
                    options={options}
                    id="SportsType"
                    name="SportsType"
                    placeholder="Select Roles"
                    value={role}
                    onChange={selected => onHandleChange(selected)}
                  />
              <p className="error-text">{roleErr}</p>
            </FormGroup>
          <FormGroup>
            <Label for="status">Status</Label>
              <div className="d-flex inline-input">
                <CustomInput
                  type="radio"
                  disabled={adminPermission?.SUBADMIN === 'R'}
                  id="subAdminStatus1"
                  name="subAdminStatus"
                  label="Active"
                  onClick={event => handleChange(event, 'Status')}
                  checked={subAdminStatus === 'Y'}
                  value="Y"
                />
                <CustomInput
                  type="radio"
                  disabled={adminPermission?.SUBADMIN === 'R'}
                  id="subAdminStatus3"
                  name="subAdminStatus"
                  label="Block"
                  onClick={event => handleChange(event, 'Status')}
                  checked={subAdminStatus !== 'Y'}
                  value="B"
                />
              </div>
            </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'R')) && (
              <Fragment>
                <Button className="theme-btn full-btn" onClick={onSubmit} disabled={updateDisable}>
                  {button()}
                </Button>
              </Fragment>
            )
          }
        </Form>
        </section>
      </section>
    </main>
  )
}

AddSubAdminForm.propTypes = {
  cancelLink: PropTypes.string,
  SubAdminDetails: PropTypes.object,
  match: PropTypes.object,
  addSubAdmin: PropTypes.func,
  updateSubAdmin: PropTypes.func,
  history: PropTypes.object
}

export default connect()(AddSubAdminForm)
