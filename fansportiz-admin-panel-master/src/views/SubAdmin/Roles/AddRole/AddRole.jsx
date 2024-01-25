import React, { useState, useEffect, useRef, Fragment } from 'react'
import {
  Button, FormGroup, Label, Input, CustomInput, UncontrolledAlert, Row, Col, Card, CardTitle, UncontrolledPopover, PopoverBody
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { alertClass, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import { getYStatusPermissionList } from '../../../../actions/permission'
import infoIcon from '../../../../assets/images/info2.svg'

function AddRole (props) {
  const {
    addRoleFunc, updateRoleFunc, roleDetails, cancelLink
  } = props
  const history = useHistory()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [matchPermissions, setMatchPermissions] = useState([])
  const [usersPermissions, setUsersPermissions] = useState([])
  const [settingsPermissions, setSettingsPermissions] = useState([])
  const [subAdminPermissions, setSubAdminPermissions] = useState([])
  const [leaguePermission, setLeaguePermission] = useState([])
  const [otherPermissions, setOtherPermissions] = useState([])
  const [roleStatus, setRoleStatus] = useState('Y')
  const [ErrName, setErrName] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [roleId, setRoleId] = useState('')

  const permissionStatusList = useSelector(state => state.permission.permissionStatusList)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.role.resStatus)
  const resMessage = useSelector(state => state.role.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const previousProps = useRef({
    resStatus, resMessage, roleDetails
  }).current
  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    const { match } = props
    dispatch(getYStatusPermissionList(token))
    if (match.params.id) {
      setRoleId(match.params.id)
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
          history.push('/sub-admin/roles', { message: resMessage })
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
    if (previousProps.roleDetails !== roleDetails) {
      if (roleDetails) {
        setName(roleDetails.sName)
        setRoleStatus(roleDetails.eStatus)
        const matchArr = []
        const settingsArr = []
        const usersArr = []
        const subAdminArr = []
        const leagueArr = []
        const othersArr = []
        if (roleDetails?.aPermissions?.length !== 0) {
          roleDetails?.aPermissions?.map((data) => {
            if ((data.sKey === 'MATCH') || (data.sKey === 'MATCHLEAGUE') || (data.sKey === 'SCORE_POINT') || (data.sKey === 'USERLEAGUE') || (data.sKey === 'USERTEAM') || (data.sKey === 'SEASON') || (data.sKey === 'TEAM') || (data.sKey === 'PLAYER') || (data.sKey === 'BOT_LOG') || (data.sKey === 'MATCHPLAYER') || (data.sKey === 'ROLES')) {
              const obj = {
                sKey: data.sKey,
                eName: data.sName,
                eType: data.eType
              }
              matchArr.push(obj)
            }
            if ((data.sKey === 'SPORT') || (data.sKey === 'PROMO') || (data.sKey === 'RULE') || (data.sKey === 'OFFER') || (data.sKey === 'BANNER') || (data.sKey === 'PAYOUT_OPTION') || (data.sKey === 'EMAIL_TEMPLATES') || (data.sKey === 'POPUP_ADS') || (data.sKey === 'SETTING') || (data.sKey === 'VERSION') || (data.sKey === 'LEADERSHIP_BOARD') || (data.sKey === 'MAINTENANCE') || (data.sKey === 'NOTIFICATION') || (data.sKey === 'PAYMENT_OPTION') || (data.sKey === 'PAYMENT_OPTION') || (data.sKey === 'CMS') || (data.sKey === 'REPORT') || (data.sKey === 'COMPLAINT')) {
              const obj = {
                sKey: data.sKey,
                eName: data.sName,
                eType: data.eType
              }
              settingsArr.push(obj)
            }
            if ((data.sKey === 'BANKDETAILS') || (data.sKey === 'DEPOSIT') || (data.sKey === 'PUSHNOTIFICATION') || (data.sKey === 'KYC') || (data.sKey === 'PASSBOOK') || (data.sKey === 'PREFERENCES') || (data.sKey === 'WITHDRAW') || (data.sKey === 'USERS') || (data.sKey === 'SYSTEM_USERS') || (data.sKey === 'STATISTICS') || (data.sKey === 'TDS') || (data.sKey === 'BALANCE')) {
              const obj = {
                sKey: data.sKey,
                eName: data.sName,
                eType: data.eType
              }
              usersArr.push(obj)
            }
            if ((data.sKey === 'SUBADMIN') || (data.sKey === 'ADMIN_ROLE')) {
              const obj = {
                sKey: data.sKey,
                eName: data.sName,
                eType: data.eType
              }
              subAdminArr.push(obj)
            }
            if ((data.sKey === 'SERIES_LEADERBOARD') || (data.sKey === 'LEAGUE')) {
              const obj = {
                sKey: data.sKey,
                eName: data.sName,
                eType: data.eType
              }
              leagueArr.push(obj)
            }
            if ((data.sKey === 'DASHBOARD') || (data.sKey === 'PERMISSION')) {
              const obj = {
                sKey: data.sKey,
                eName: data.sName,
                eType: data.eType
              }
              othersArr.push(obj)
            }
            return null
          })
          setMatchPermissions(matchArr)
          setSettingsPermissions(settingsArr)
          setUsersPermissions(usersArr)
          setSubAdminPermissions(subAdminArr)
          setLeaguePermission(leagueArr)
          setOtherPermissions(othersArr)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.roleDetails = roleDetails
    }
  }, [roleDetails])

  useEffect(() => {
    if (permissionStatusList) {
      const matchArr = []
      const settingsArr = []
      const usersArr = []
      const subAdminArr = []
      const leagueArr = []
      const othersArr = []
      if (permissionStatusList.length !== 0 && isCreate) {
        permissionStatusList.map((data) => {
          if ((data.sKey === 'MATCH') || (data.sKey === 'MATCHLEAGUE') || (data.sKey === 'SCORE_POINT') || (data.sKey === 'USERLEAGUE') || (data.sKey === 'USERTEAM') || (data.sKey === 'SEASON') || (data.sKey === 'TEAM') || (data.sKey === 'PLAYER') || (data.sKey === 'BOT_LOG') || (data.sKey === 'MATCHPLAYER') || (data.sKey === 'ROLES')) {
            const obj = {
              sKey: data.sKey,
              eName: data.sName,
              eType: 'N'
            }
            matchArr.push(obj)
          }
          if ((data.sKey === 'SPORT') || (data.sKey === 'PROMO') || (data.sKey === 'RULE') || (data.sKey === 'OFFER') || (data.sKey === 'BANNER') || (data.sKey === 'PAYOUT_OPTION') || (data.sKey === 'EMAIL_TEMPLATES') || (data.sKey === 'POPUP_ADS') || (data.sKey === 'SETTING') || (data.sKey === 'VERSION') || (data.sKey === 'LEADERSHIP_BOARD') || (data.sKey === 'MAINTENANCE') || (data.sKey === 'NOTIFICATION') || (data.sKey === 'PAYMENT_OPTION') || (data.sKey === 'PAYMENT_OPTION') || (data.sKey === 'CMS') || (data.sKey === 'REPORT') || (data.sKey === 'COMPLAINT')) {
            const obj = {
              sKey: data.sKey,
              eName: data.sName,
              eType: 'N'
            }
            settingsArr.push(obj)
          }
          if ((data.sKey === 'BANKDETAILS') || (data.sKey === 'DEPOSIT') || (data.sKey === 'PUSHNOTIFICATION') || (data.sKey === 'KYC') || (data.sKey === 'PASSBOOK') || (data.sKey === 'PREFERENCES') || (data.sKey === 'WITHDRAW') || (data.sKey === 'USERS') || (data.sKey === 'SYSTEM_USERS') || (data.sKey === 'STATISTICS') || (data.sKey === 'TDS') || (data.sKey === 'BALANCE')) {
            const obj = {
              sKey: data.sKey,
              eName: data.sName,
              eType: 'N'
            }
            usersArr.push(obj)
          }
          if ((data.sKey === 'SUBADMIN') || (data.sKey === 'ADMIN_ROLE')) {
            const obj = {
              sKey: data.sKey,
              eName: data.sName,
              eType: 'N'
            }
            subAdminArr.push(obj)
          }
          if ((data.sKey === 'SERIES_LEADERBOARD') || (data.sKey === 'LEAGUE')) {
            const obj = {
              sKey: data.sKey,
              eName: data.sName,
              eType: 'N'
            }
            leagueArr.push(obj)
          }
          if ((data.sKey === 'DASHBOARD') || (data.sKey === 'PERMISSION')) {
            const obj = {
              sKey: data.sKey,
              eName: data.sName,
              eType: 'N'
            }
            othersArr.push(obj)
          }
          return null
        })
        setMatchPermissions(matchArr)
        setSettingsPermissions(settingsArr)
        setUsersPermissions(usersArr)
        setSubAdminPermissions(subAdminArr)
        setLeaguePermission(leagueArr)
        setOtherPermissions(othersArr)
      }
    }
    return () => {
      previousProps.permissionStatusList = permissionStatusList
    }
  }, [permissionStatusList])

  function onChangePermission (event, ID, type) {
    if (type === 'MATCH') {
      const arr = [...matchPermissions]
      const index = matchPermissions.findIndex(data => data.sKey === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], eType: event.target.value }
        setMatchPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setMatchPermissions(arr)
      }
    } else if (type === 'SETTING') {
      const arr = [...settingsPermissions]
      const index = settingsPermissions.findIndex(data => data.sKey === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], eType: event.target.value }
        setSettingsPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setSettingsPermissions(arr)
      }
    } else if (type === 'USER') {
      const arr = [...usersPermissions]
      const index = usersPermissions.findIndex(data => data.sKey === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], eType: event.target.value }
        setUsersPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setUsersPermissions(arr)
      }
    } else if (type === 'LEAGUE') {
      const arr = [...leaguePermission]
      const index = leaguePermission.findIndex(data => data.sKey === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], eType: event.target.value }
        setLeaguePermission(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setLeaguePermission(arr)
      }
    } else if (type === 'SUBADMIN') {
      const arr = [...subAdminPermissions]
      const index = subAdminPermissions.findIndex(data => data.sKey === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], eType: event.target.value }
        setSubAdminPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setSubAdminPermissions(arr)
      }
    } else if (type === 'OTHER') {
      const arr = [...otherPermissions]
      const index = otherPermissions.findIndex(data => data.sKey === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], eType: event.target.value }
        setOtherPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setOtherPermissions(arr)
      }
    }
  }

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
      case 'Status':
        setRoleStatus(event.target.value)
        break
      default:
        break
    }
  }

  function onSubmit (e) {
    e.preventDefault()

    const permissions = []
    matchPermissions.map((data) => {
      const obj = {
        sKey: data.sKey,
        eType: data.eType
      }
      permissions.push(obj)
      return permissions
    })
    usersPermissions.map((data) => {
      const obj = {
        sKey: data.sKey,
        eType: data.eType
      }
      permissions.push(obj)
      return permissions
    })
    settingsPermissions.map((data) => {
      const obj = {
        sKey: data.sKey,
        eType: data.eType
      }
      permissions.push(obj)
      return permissions
    })
    subAdminPermissions.map((data) => {
      const obj = {
        sKey: data.sKey,
        eType: data.eType
      }
      permissions.push(obj)
      return permissions
    })
    leaguePermission.map((data) => {
      const obj = {
        sKey: data.sKey,
        eType: data.eType
      }
      permissions.push(obj)
      return permissions
    })
    otherPermissions.map((data) => {
      const obj = {
        sKey: data.sKey,
        eType: data.eType
      }
      permissions.push(obj)
      return permissions
    })

    const verify = name && permissions && permissions.length !== 0
    if (verify) {
      if (isCreate) {
        addRoleFunc(name, permissions, roleStatus)
      } else {
        updateRoleFunc(name, permissions, roleStatus, roleId)
      }
      setLoading(true)
    } else {
      if (!verifyLength(name, 1)) {
        setErrName('Required field')
      }
    }
  }

  function heading () {
    if (isCreate) {
      return 'Add Role'
    }
    return !isEdit ? 'Edit Role' : 'Role Details'
  }

  function button () {
    if (isCreate) {
      return 'Add Role'
    }
    return !isEdit ? 'Save Changes' : 'Edit Role'
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
      <section className="common-box common-detail">
        <h2>
          {heading()}
        </h2>
        <Row className="row-12">
            <Col xl={3} lg={4} md={6}>
              <FormGroup>
                <Label for="Name">Role <span className="required-field">*</span></Label>
                <Input disabled={adminPermission?.ADMIN_ROLE === 'R'} type="text" id="Name" placeholder="Enter Name" value={name} onChange={event => handleChange(event, 'Name')} />
                <p className="error-text">{ErrName}</p>
              </FormGroup>
            </Col>
            <Col xl={3} lg={4} md={6}>
              <FormGroup>
                <Label for="status">Status</Label>
                <div className="d-flex inline-input">
                  <CustomInput
                    type="radio"
                    disabled={adminPermission?.ADMIN_ROLE === 'R'}
                    id="roleStatus1"
                    name="roleStatus"
                    label="Active"
                    onClick={event => handleChange(event, 'Status')}
                    checked={roleStatus === 'Y'}
                    value="Y"
                  />
                  <CustomInput
                    type="radio"
                    disabled={adminPermission?.ADMIN_ROLE === 'R'}
                    id="roleStatus2"
                    name="roleStatus"
                    label="InActive"
                    onClick={event => handleChange(event, 'Status')}
                    checked={roleStatus !== 'Y'}
                    value="N"
                  />
              </div>
              </FormGroup>
            </Col>
          </Row>
          <div className="common-item">
          <h2 className='mt-4'>Permissions</h2>
          <h3 className='mt-5 text-center'>Match Related Permissions
            <img className='custom-info' src={infoIcon} id='match'></img>
            <UncontrolledPopover trigger="legacy" placement="bottom" target='match'>
              <PopoverBody>
                <p>To access sports(Cricket, football,..) tab need to give permissions of {matchPermissions && matchPermissions.length !== 0 && matchPermissions.map(data => data.sKey).toString()},REPORT,SYSTEM_USERS</p>
              </PopoverBody>
            </UncontrolledPopover>
          </h3>
          <Row>
            {
              matchPermissions && matchPermissions.length !== 0 && matchPermissions.map((data) => {
                return (
                  <Col xl={3} lg={4} md={6} key={data.sKey}>
                    <Card body className='mt-2'>
                      <CardTitle tag="h5">{data.sKey ? data.sKey : ''}</CardTitle>
                      <div className="d-flex inline-input">
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}None`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'MATCH')} label="None" value="N" checked={`${data.eType}` === 'N'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Read`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'MATCH')} label="Read" value="R" checked={`${data.eType}` === 'R'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Write`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'MATCH')} label="Write" value="W" checked={`${data.eType}` === 'W'} />
                      </div>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>

          <h3 className='mt-5 text-center'>User Related Permissions
            <img className='custom-info' src={infoIcon} id='user'></img>
            <UncontrolledPopover trigger="legacy" placement="bottom" target='user'>
              <PopoverBody>
                <p>To access users tab need to give permissions of {usersPermissions && usersPermissions.length !== 0 && usersPermissions.map(data => data.sKey).toString()}</p>
              </PopoverBody>
            </UncontrolledPopover>
          </h3>
          <Row>
            {
              usersPermissions && usersPermissions.length !== 0 && usersPermissions.map((data) => {
                return (
                  <Col xl={3} lg={4} md={6} key={data.sKey}>
                    <Card body className='mt-2'>
                      <CardTitle tag="h5">{data.sKey ? data.sKey : ''}</CardTitle>
                      <div className="d-flex inline-input">
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}None`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'USER')} label="None" value="N" checked={`${data.eType}` === 'N'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Read`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'USER')} label="Read" value="R" checked={`${data.eType}` === 'R'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Write`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'USER')} label="Write" value="W" checked={`${data.eType}` === 'W'} />
                      </div>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>

          <h3 className='mt-5 text-center'>Settings Related Permissions
            <img className='custom-info' src={infoIcon} id='settings'></img>
            <UncontrolledPopover trigger="legacy" placement="bottom" target='settings'>
              <PopoverBody>
                <p>To access settings tab need to give permissions of {settingsPermissions && settingsPermissions.length !== 0 && settingsPermissions.map(data => data.sKey).toString()}</p>
                <p>Note: For Reports need to give SPORT permission also</p>
              </PopoverBody>
            </UncontrolledPopover>
          </h3>
          <Row>
            {
              settingsPermissions && settingsPermissions.length !== 0 && settingsPermissions.map((data) => {
                return (
                  <Col xl={3} lg={4} md={6} key={data.sKey}>
                    <Card body className='mt-2'>
                      <CardTitle tag="h5">{data.sKey ? data.sKey : ''}</CardTitle>
                      <div className="d-flex inline-input">
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}None`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'SETTING')} label="None" value="N" checked={`${data.eType}` === 'N'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Read`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'SETTING')} label="Read" value="R" checked={`${data.eType}` === 'R'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Write`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'SETTING')} label="Write" value="W" checked={`${data.eType}` === 'W'} />
                      </div>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>

          <h3 className='mt-5 text-center'>SubAdmin Related Permissions
            <img className='custom-info' src={infoIcon} id='subadmin'></img>
            <UncontrolledPopover trigger="legacy" placement="bottom" target='subadmin'>
              <PopoverBody>
                <p>To access SubAdmin tab need to give permissions of {subAdminPermissions && subAdminPermissions.length !== 0 && subAdminPermissions.map(data => data.sKey).toString()}</p>
              </PopoverBody>
            </UncontrolledPopover>
          </h3>
          <Row>
            {
              subAdminPermissions && subAdminPermissions.length !== 0 && subAdminPermissions.map((data) => {
                return (
                  <Col xl={3} lg={4} md={6} key={data.sKey}>
                    <Card body className='mt-2'>
                      <CardTitle tag="h5">{data.sKey ? data.sKey : ''}</CardTitle>
                      <div className="d-flex inline-input">
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}None`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'SUBADMIN')} label="None" value="N" checked={`${data.eType}` === 'N'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Read`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'SUBADMIN')} label="Read" value="R" checked={`${data.eType}` === 'R'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Write`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'SUBADMIN')} label="Write" value="W" checked={`${data.eType}` === 'W'} />
                      </div>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>

          <h3 className='mt-5 text-center'>League and Series Related Permissions
            <img className='custom-info' src={infoIcon} id='league'></img>
            <UncontrolledPopover trigger="legacy" placement="bottom" target='league'>
              <PopoverBody>
                <p>To access League and Series LeaderBoard tab need to give permissions of {leaguePermission && leaguePermission.length !== 0 && leaguePermission.map(data => data.sKey).toString()}</p>
              </PopoverBody>
            </UncontrolledPopover>
          </h3>
          <Row>
            {
              leaguePermission && leaguePermission.length !== 0 && leaguePermission.map((data) => {
                return (
                  <Col xl={3} lg={4} md={6} key={data.sKey}>
                    <Card body className='mt-2'>
                      <CardTitle tag="h5">{data.sKey ? data.sKey : ''}</CardTitle>
                      <div className="d-flex inline-input">
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}None`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'LEAGUE')} label="None" value="N" checked={`${data.eType}` === 'N'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Read`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'LEAGUE')} label="Read" value="R" checked={`${data.eType}` === 'R'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Write`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'LEAGUE')} label="Write" value="W" checked={`${data.eType}` === 'W'} />
                      </div>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>

          <h3 className='mt-5 text-center'>Other
            {/* <img className='custom-info' src={infoIcon} id='other'></img>
            <UncontrolledPopover trigger="legacy" placement="bottom" target='other'>
              <PopoverBody>
                <p></p>
              </PopoverBody>
          </UncontrolledPopover> */}
          </h3>
          <Row>
            {
              otherPermissions && otherPermissions.length !== 0 && otherPermissions.map((data) => {
                return (
                  <Col xl={3} lg={4} md={6} key={data.sKey}>
                    <Card body className='mt-2'>
                      <CardTitle tag="h5">{data.sKey ? data.sKey : ''}</CardTitle>
                      <div className="d-flex inline-input">
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}None`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'OTHER')} label="None" value="N" checked={`${data.eType}` === 'N'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Read`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'OTHER')} label="Read" value="R" checked={`${data.eType}` === 'R'} />
                        <CustomInput type="radio" disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data.sKey}Write`} name={`${data.sKey}`} onClick={event => onChangePermission(event, data.sKey, 'OTHER')} label="Write" value="W" checked={`${data.eType}` === 'W'} />
                      </div>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </div>
        <div className="footer-btn text-center">
          <Button className="theme-btn outline-btn outline-theme" tag={Link} to={`${cancelLink}${page?.RolesManagement || ''}`}>Cancel</Button>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.ADMIN_ROLE !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn" onClick={onSubmit} disabled={!name}>
                  {button()}
                </Button>
              </Fragment>
            )
          }
        </div>
      </section>
      </main>
    </div>
  )
}

AddRole.propTypes = {
  addRoleFunc: PropTypes.func,
  updateRoleFunc: PropTypes.func,
  roleDetails: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  cancelLink: PropTypes.string
}

export default AddRole
