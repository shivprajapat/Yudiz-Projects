import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUrl } from '../../../../actions/url'
import { addAdminDeposit, addAdminWithdraw, getBalanceDetails, getStates, updateUserDetails } from '../../../../actions/users'
import { alertClass, isNumber, isPositive, modalMessageFunc, verifyEmail, verifyLength, verifyMobileNumber } from '../../../../helpers/helper'
import { Button, Col, CustomInput, FormGroup, Input, InputGroupText, Label, Row, UncontrolledAlert } from 'reactstrap'
import Loading from '../../../../components/Loading'
import Select from 'react-select'
import moment from 'moment'
import profilePicture from '../../../../assets/images/profile_pic.png'
import { getSystemUserDetails } from '../../../../actions/systemusers'
import backIcon from '../../../../assets/images/left-theme-arrow.svg'
import refreshIcon from '../../../../assets/images/refresh.svg'
import { states, cities } from '../../../../helpers/country'

const SystemUserDetails = props => {
  const { match } = props
  const history = useHistory()
  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [userName, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [ErrFullName, setErrFullName] = useState('')
  const [email, setEmail] = useState('')
  const [State, setState] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState(0)
  const [MobNum, setMobNum] = useState(0)
  const [errEmail, setErrEmail] = useState('')
  const [errMobNum, setErrMobNum] = useState('')
  const [bankInformation, setBankInformation] = useState('')
  const [cash, setCash] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [MobNumVerified, setMobNumVerified] = useState(false)
  const [emailVerified, setemailVerified] = useState(false)
  const [Cancel, setCancel] = useState(false)
  const [status, setStatus] = useState(false)
  const [birthdate, setBirthdate] = useState('')
  const [birthDateErr, setBirthDateErr] = useState('')
  const [gender, setGender] = useState('')
  const [propic, setproPic] = useState('')
  const [userStatus, setUserStatus] = useState('')
  const [balance, setBalance] = useState('deposit')
  const [balanceType, setBalanceType] = useState('cash')
  const [DepositPassword, setDepositPassword] = useState('')
  const [ErrDepositPassword, setErrDepositPassword] = useState('')
  const [close, setClose] = useState(false)
  const [url, setUrl] = useState('')
  const [isEditUserDetails, setEditUserDetails] = useState(false)
  const [isEditAdminDeposit, setEditAdminDeposit] = useState(false)
  const [isEditAdminWithdraw, setEditAdminWithdraw] = useState(false)
  const [errCash, setErrCash] = useState('')
  const [errBonus, setErrBonus] = useState('')
  const [errImage, setErrImage] = useState('')
  const [withdrawType, setWithdrawType] = useState('withdraw')
  const [amount, setAmount] = useState(0)
  const [WithDrawPassword, setWithDrawPassword] = useState('')
  const [ErrWithdrawPassword, setErrWithdrawPassword] = useState('')
  const [errAmount, setErrAmount] = useState('')

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const systemUserResStatus = useSelector(state => state.systemusers.resStatus)
  const systemUseResMessage = useSelector(state => state.systemusers.resMessage)
  const resStatus = useSelector(state => state.users.resStatus)
  const resMessage = useSelector(state => state.users.resMessage)
  const actionType = useSelector(state => state.users.type)
  const systemUserDetails = useSelector(state => state.systemusers.systemUserDetails)
  const BalanceDetails = useSelector(state => state.users.balanceDetails)
  const stateList = useSelector(state => state.users.stateList)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const [modalMessage, setModalMessage] = useState(false)
  const depositPermission = adminPermission?.DEPOSIT
  const withdrawPermission = adminPermission?.WITHDRAW
  const balancePermission = adminPermission?.BALANCE
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const previousProps = useRef({
    resStatus, resMessage, systemUserDetails, BalanceDetails, stateList, State, systemUseResMessage, systemUserResStatus
  }).current

  useEffect(() => {
    if (match && match.params && match.params.id) {
      if ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) {
        dispatch(getSystemUserDetails(match.params.id, token))
        dispatch(getStates(token))
      }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE !== 'N')) {
        dispatch(getBalanceDetails(match.params.id, token))
      }
    }
    dispatch(getUrl('media'))
    setLoading(true)
  }, [])

  // set states list
  useEffect(() => {
    if (states) {
      const arr = []
      states.forEach(data => {
        const obj = {
          label: data.state_name,
          value: data.id
        }
        arr.push(obj)
      })
      setStateOptions(arr)
    }
  }, [states])

  useEffect(() => {
    if (previousProps.State !== State) {
      const arr = cities.filter(data => State.value === data.state_id)
      const cityOps = []
      arr.forEach(data => {
        const obj = {
          label: data.city_name,
          value: data.id
        }
        cityOps.push(obj)
      })
      setCityOptions(cityOps)
    }
    return () => {
      previousProps.State = State
    }
  }, [State])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.systemUserDetails !== systemUserDetails && previousProps.BalanceDetails !== BalanceDetails) {
      setLoading(false)
    } else if ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE === 'N') || (Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'N')) {
      setLoading(false)
    }
  }, [systemUserDetails, BalanceDetails])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setStatus(resStatus)
          if (actionType === 'UPDATE_USER_DETAILS') {
            setEditUserDetails(false)
          } else if (actionType === 'ADD_USER_DEPOSIT') {
            setEditAdminDeposit(false)
          } else if (actionType === 'ADD_USER_WITHDRAW') {
            setEditAdminWithdraw(false)
          }
        }
        setMessage(resMessage)
        setModalMessage(true)
        setLoading(false)
        dispatch(getBalanceDetails(match.params.id, token))
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.systemUserDetails !== systemUserDetails || (!systemUserResStatus && systemUseResMessage) || Cancel) {
      if (systemUserDetails) {
        setEmail(systemUserDetails.sEmail)
        setUsername(systemUserDetails.sUsername)
        setFullname(systemUserDetails.sName)
        setMobNum(systemUserDetails.sMobNum)
        setMobNumVerified(systemUserDetails.bIsMobVerified)
        setemailVerified(systemUserDetails.bIsEmailVerified)
        setproPic(systemUserDetails.sProPic)
        setGender(systemUserDetails.eGender)
        setBirthdate(systemUserDetails.dDob)
        setAddress(systemUserDetails.sAddress)
        setCity(systemUserDetails.iCityId ? { label: systemUserDetails.iCityId, value: '' } : '')
        setPincode(systemUserDetails.nPinCode)
        setState(systemUserDetails.iStateId ? { label: systemUserDetails.iStateId, value: '' } : '')
        setUserStatus(systemUserDetails.eStatus)
        setCancel(false)
      }
    }
    return () => {
      previousProps.systemUserDetails = systemUserDetails
    }
  }, [systemUserDetails, systemUseResMessage, systemUserResStatus, Cancel])

  useEffect(() => {
    if (previousProps.BalanceDetails !== BalanceDetails) {
      if (BalanceDetails) {
        setBankInformation({
          ...bankInformation,
          nTotalBonus: BalanceDetails.nTotalBonusEarned ? BalanceDetails.nTotalBonusEarned.toFixed(2) : 0,
          nTotalWin: BalanceDetails.nTotalWinningAmount ? BalanceDetails.nTotalWinningAmount.toFixed(2) : 0,
          nTotalCashPlay: BalanceDetails.nTotalPlayCash ? BalanceDetails.nTotalPlayCash.toFixed(2) : 0,
          nTotalDeposit: BalanceDetails.nTotalDepositAmount ? BalanceDetails.nTotalDepositAmount.toFixed(2) : 0,
          nCurrentBonus: BalanceDetails.nCurrentBonus ? BalanceDetails.nCurrentBonus.toFixed(2) : 0,
          nCurrentCash: BalanceDetails.nCurrentTotalBalance ? BalanceDetails.nCurrentTotalBalance.toFixed(2) : 0,
          nDeposit: BalanceDetails.nCurrentDepositBalance ? BalanceDetails.nCurrentDepositBalance.toFixed(2) : 0,
          nWinnings: BalanceDetails.nCurrentWinningBalance ? BalanceDetails.nCurrentWinningBalance.toFixed(2) : 0
        })
      }
    }
    return () => {
      previousProps.BalanceDetails = BalanceDetails
    }
  }, [BalanceDetails])

  function handleChange (event, eType) {
    switch (eType) {
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrFullName('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrFullName('Required field')
        }
        setFullname(event.target.value)
        break
      case 'Email':
        if (verifyLength(event.target.value, 1) && verifyEmail(event.target.value)) {
          setErrEmail('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrEmail('Required field')
        } else {
          setErrEmail('Enter a valid Email')
        }
        setEmail(event.target.value)
        break
      case 'MobNum':
        if (!event.target.value) {
          setErrMobNum('Required field')
        } else if (verifyMobileNumber(event.target.value)) {
          setErrMobNum('')
        } else if (!isNumber(event.target.value)) {
          setErrMobNum('Must be numbers')
        } else if (!verifyMobileNumber(event.target.value)) {
          setErrMobNum('Must be 10 digits')
        }
        setMobNum(event.target.value)
        break
      case 'Address':
        setAddress(event.target.value)
        break
      case 'City':
        setCity(event)
        break
      case 'Pincode':
        if (isNumber(event.target.value) || (!event.target.value)) {
          setPincode(event.target.value)
        }
        break
      case 'State':
        setState(event)
        setCity('')
        break
      case 'Gender':
        setGender(event.target.value)
        break
      case 'UserStatus':
        setUserStatus(event.target.value)
        break
      case 'Birthdate':
        if (moment(event.target.value).isAfter(moment())) {
          setBirthDateErr('Date should not be future date')
        } else if (moment().subtract('years', 18).isBefore(event.target.value)) {
          setBirthDateErr('User must be greater or equal to 18 years old')
        } else if (!verifyLength(moment(event.target.value).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setBirthDateErr('Required field')
        } else {
          setBirthDateErr('')
        }
        setBirthdate(event.target.value)
        break
      case 'Status':
        setStatus(event.target.value === 'true')
        break
      case 'Balance':
        setBalance(event.target.value)
        break
      case 'Deposit_Type':
        setBalanceType(event.target.value)
        break
      case 'ProPic':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0]) {
          setproPic({ imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Cash':
        if (isNumber(event.target.value) && isPositive(event.target.value)) {
          setErrCash('')
        } else {
          setErrCash('Required field')
        }
        setCash(event.target.value)
        break
      case 'Bonus':
        if (isNumber(event.target.value) && isPositive(event.target.value)) {
          setErrBonus('')
        } else {
          setErrBonus('Required field')
        }
        setBonus(event.target.value)
        break
      case 'DepositPassword':
        if (verifyLength(event.target.value, 1)) {
          setErrDepositPassword('')
        } else {
          setErrDepositPassword('Required field')
        }
        setDepositPassword(event.target.value)
        break
      case 'WithdrawType':
        setWithdrawType(event.target.value)
        break
      case 'Amount':
        if (isNumber(event.target.value) && isPositive(event.target.value)) {
          setErrAmount('')
        } else {
          setErrAmount('Required field')
        }
        setAmount(event.target.value)
        break
      case 'WithdrawPassword':
        if (verifyLength(event.target.value, 1)) {
          setErrWithdrawPassword('')
        } else {
          setErrWithdrawPassword('Required field')
        }
        setWithDrawPassword(event.target.value)
        break
      default:
        break
    }
  }

  function changeProfileData () {
    if (verifyEmail(email) && isNumber(MobNum) && !birthDateErr) {
      const updateUserData = {
        fullname, ID: match.params.id, propic, email, MobNum, gender, birthdate, address, city: city.value, pincode, State: State.value, userStatus, token
      }
      dispatch(updateUserDetails(updateUserData))
      setLoading(true)
    } else {
      if (!email) {
        setErrEmail('Required field')
      } else if (!verifyEmail(email)) {
        setErrEmail('Enter Proper Email')
      }
      if (MobNum.length !== 10) {
        setErrMobNum('Number must be 10 digits')
      }
      if (!MobNum) {
        setErrMobNum('Required field')
      } else if (!isNumber(MobNum)) {
        setErrMobNum('Enter only numbers')
      }
    }
  }

  function addAdminDepo () {
    if (isNumber(cash) && isNumber(bonus) && verifyLength(DepositPassword, 1)) {
      dispatch(addAdminDeposit(match.params.id, balance, balanceType, cash, bonus, DepositPassword, token))
      setBalance('deposit')
      setBalanceType('cash')
      setCash(0)
      setBonus(0)
      setDepositPassword('')
      setLoading(true)
    } else {
      if (!isNumber(cash)) {
        setErrCash('Required field')
      }
      if (!isNumber(bonus)) {
        setErrBonus('Required field')
      }
      if (!verifyLength(DepositPassword, 1)) {
        setErrDepositPassword('Required field')
      }
    }
  }

  function funcAddAdminWithdraw () {
    if (isNumber(amount) && verifyLength(WithDrawPassword, 1)) {
      dispatch(addAdminWithdraw(match.params.id, withdrawType, amount, WithDrawPassword, token))
      setWithdrawType('withdraw')
      setAmount(0)
      setWithDrawPassword('')
      setLoading(true)
    } else {
      if (!isNumber(amount)) {
        setErrAmount('Required field')
      }
      if (!verifyLength(WithDrawPassword, 1)) {
        setErrWithdrawPassword('Required field')
      }
    }
  }

  function onEditUserDetails () {
    if (!isEditUserDetails) {
      setEditUserDetails(true)
    }
  }

  function onEditAdminDeposit () {
    if (!isEditAdminDeposit) {
      setEditAdminDeposit(true)
    }
  }

  function onEditAdminWithdraw () {
    if (!isEditAdminWithdraw) {
      setEditAdminWithdraw(true)
    }
  }

  function cancelFunc (type) {
    if (type === 'profile') {
      setEditUserDetails(false)
      setErrEmail('')
      setErrMobNum('')
      setErrFullName('')
      setErrImage('')
    } else if (type === 'admin_deposit') {
      setEditAdminDeposit(false)
      setCash('')
      setBonus('')
      setDepositPassword('')
      setErrCash('')
      setErrBonus('')
      setErrDepositPassword('')
    } else if (type === 'admin_withdraw') {
      setEditAdminWithdraw(false)
      setAmount('')
      setWithDrawPassword('')
      setErrAmount('')
      setErrWithdrawPassword('')
    }
    setCancel(true)
  }

  function onRefresh () {
    dispatch(getSystemUserDetails(match.params.id, token))
    dispatch(getBalanceDetails(match.params.id, token))
    dispatch(getUrl('media'))
    setLoading(true)
  }

  return (
        <>
        {loading && <Loading />}
        <main className="main-content d-flex">
          {
            modalMessage && message &&
            (
              <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
            )
          }
          <section className="user-section">
            <Row className='mb-3 mr-2'>
              <Col lg={depositPermission === 'N' && withdrawPermission === 'N' && balancePermission === 'N' ? 3 : 1}></Col>
              <Col lg={depositPermission === 'N' && withdrawPermission === 'N' && balancePermission === 'N' ? 4 : 5}>
                <img src={backIcon} className='custom-go-back' onClick={() => (props.location.state && props.location.state.systemUserList) ? history.push(`/users/system-users${page?.SystemUser || ''}`) : history.goBack()} />
              </Col>
              <Col lg={5} className='text-right'>
              <Link className='btn-link' to={{ pathname: '/users/system-user/system-user-debugger-page/' + match.params.id, state: { goBack: 'yes' } }}>Go To System User Debugger</Link>
                <Button color="link" className='ml-3' onClick={onRefresh}>
                  <img src={refreshIcon} alt="Users" height="20px" width="20px" />
                </Button>
              </Col>
              <Col lg='1'></Col>
            </Row>
            <Row>
              <Col lg={depositPermission === 'N' && withdrawPermission === 'N' && balancePermission === 'N' ? 3 : 1}></Col>
              <Col lg="5">
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) &&
                  (
                    <Fragment>
                      <div className="common-box">
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'R')) &&
                            (
                              <Row className='mb-4'>
                                <Col md='11'><Button className="text-left" onClick={() => cancelFunc('profile')} color="link">{isEditUserDetails ? 'Cancel' : ''}</Button></Col>
                                <Col md="1"><Button onClick={isEditUserDetails ? changeProfileData : onEditUserDetails} color="link">{isEditUserDetails ? 'Save' : 'Edit'}</Button></Col>
                              </Row>
                            )
                          }
                        <Row className="profile-block">
                          <Col md='1'></Col>
                          <Col className="profile-image" md='3'>
                            <img className="profile-pic-systemuser" src={propic ? propic.imageUrl ? propic.imageUrl : url + propic : profilePicture} alt="userPic" />
                            <div className="file-btn2"><Input accept="image/png, image/jpg, image/jpeg" type="file" disabled={!isEditUserDetails} onChange={event => handleChange(event, 'ProPic')} /></div>
                            <p className="error-text mr-5">{errImage}</p>
                          </Col>
                          <Col md='1'></Col>
                        <Col>
                          <div className="float-center table-responsive">
                            <table className='table'>
                              <tbody>
                                <tr>
                                  <td className='text-left'>Team Name</td>
                                  <td className='text-right'><b>{userName}</b></td>
                                </tr>
                                <tr>
                                  <td className='text-left'>Mobile Verified?</td>
                                  <td className='text-right'><b>{MobNumVerified ? 'Yes' : 'No'}</b></td>
                                </tr>
                                <tr>
                                  <td className='text-left'>Email Verified?</td>
                                  <td className='text-right'><b>{emailVerified ? 'Yes' : 'No'}</b></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          </Col>
                        </Row>
                        <FormGroup>
                          <Label for="fullName">Full Name</Label>
                          <Input disabled={!isEditUserDetails} type="text" id="fullName" placeholder="Enter Full Name" value={fullname} onChange={event => handleChange(event, 'Name')} />
                          <p className="error-text">{ErrFullName}</p>
                        </FormGroup>

                        <FormGroup>
                          <Label for="email">Email</Label>
                          <Input disabled={!isEditUserDetails} type="text" id="email" placeholder="Enter Email" value={email} onChange={event => handleChange(event, 'Email')} />
                          <p className="error-text">{errEmail}</p>
                        </FormGroup>
                        <FormGroup>
                          <Label for="phoneNumber">Mobile Number</Label>
                          <Input disabled={!isEditUserDetails} type="text" id="mobnum" placeholder="Enter Mobile Number" value={MobNum} onChange={event => handleChange(event, 'MobNum')} />
                          <p className="error-text">{errMobNum}</p>
                        </FormGroup>
                    <FormGroup>
                      <Label for="birthdate">Birthdate</Label>
                      <Input disabled={!isEditUserDetails} type="date" id="birthdate" placeholder="Enter Birthdate" value={moment(birthdate).format('YYYY-MM-DD')} onChange={event => handleChange(event, 'Birthdate')} />
                      <p className='error-text'>{birthDateErr}</p>
                  </FormGroup>
                    <FormGroup>
                      <Label for="phoneNumber">Gender</Label>
                      <div className="d-flex inline-input">
                        <CustomInput disabled={!isEditUserDetails} type="radio" id="genderRadio1" name="genderRadio" label="Male" onClick={event => handleChange(event, 'Gender')} value="M" checked={gender !== 'F'} />
                        <CustomInput disabled={!isEditUserDetails} type="radio" id="genderRadio2" name="genderRadio" label="Female" onClick={event => handleChange(event, 'Gender')} value="F" checked={gender === 'F'} />
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label for="status">User Status</Label>
                    <div className="d-flex inline-input">
                      <CustomInput disabled={!isEditUserDetails} type="radio" id="statusRadio1" name="statusRadio" label="Yes" onChange={event => handleChange(event, 'UserStatus')} value="Y" checked={userStatus === 'Y'} />
                      <CustomInput disabled={!isEditUserDetails} type="radio" id="statusRadio2" name="statusRadio" label="No" onChange={event => handleChange(event, 'UserStatus')} value="N" checked={userStatus === 'N'} />
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label for="state">State</Label>
                    <Select
                      options={stateOptions}
                      id="state"
                      name="state"
                      placeholder="Select State"
                      value={State}
                      onChange={selectedOption => handleChange(selectedOption, 'State')}
                      isDisabled={!isEditUserDetails}
                    />
                  </FormGroup>
                  <FormGroup>
                  <Label for="city">City</Label>
                    <Select
                      options={cityOptions}
                      id="city"
                      name="city"
                      placeholder="Select City"
                      value={city}
                      onChange={selectedOption => handleChange(selectedOption, 'City')}
                      isDisabled={!isEditUserDetails || !State}
                      controlShouldRenderValue={cityOptions}
                    />
                </FormGroup>
                  <FormGroup>
                    <Label for="address">Address</Label>
                    <Input disabled={!isEditUserDetails} type="text" id="address" placeholder="Enter Address" value={address} onChange={event => handleChange(event, 'Address')} />
                  </FormGroup>

                  <FormGroup>
                    <Label for="pincode">Pincode</Label>
                    <Input disabled={!isEditUserDetails} type="tel" id="pincode" placeholder="Enter Pincode" value={pincode} onChange={event => handleChange(event, 'Pincode')} />
                  </FormGroup>
                  </div>
                  </Fragment>
                  )
                }
              </Col>

              <Col lg='5'>
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE !== 'N')) &&
                (
                  <Fragment>
                    <div className="common-box">
                      <div className="d-flex justify-content-between align-items-start">
                        <h3>Cash/ Bonus Information</h3>
                        <Link className='mr-3 btn-link' to={{ pathname: '/users/passbook', search: `?searchValue=${match.params.id}`, state: { systemUserToPassbook: true, id: match.params.id } }}>Show Users Transactions</Link>
                      </div>
                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="CurrentBonus">Available Bonus</Label>
                            <InputGroupText>{bankInformation.nCurrentBonus}</InputGroupText>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="totalWon">Total Bonus</Label>
                            <InputGroupText>{bankInformation.nTotalBonus}</InputGroupText>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="winnings">Available Winnings</Label>
                            <InputGroupText>{bankInformation.nWinnings}</InputGroupText>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="totalWin">Total Winnings</Label>
                            <InputGroupText>{bankInformation.nTotalWin}</InputGroupText>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="Deposit">Available Deposit </Label>
                            <InputGroupText>{bankInformation.nDeposit}</InputGroupText>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="totalDeposit">Total Deposit</Label>
                            <InputGroupText>{bankInformation.nTotalDeposit}</InputGroupText>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="CurrentWin">Available Cash</Label>
                            <InputGroupText>{bankInformation.nCurrentCash}</InputGroupText>
                          </FormGroup>
                        </Col>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="totalWon">Total Play(Cash)</Label>
                            <InputGroupText>{bankInformation.nTotalCashPlay}</InputGroupText>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Fragment>
                )
              }
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT !== 'N')) &&
                (
                  <Fragment>
                    <div className="common-box">
                      <div className="d-flex justify-content-between align-items-start">
                        <h3>Admin Deposit</h3>
                        {((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT !== 'R')) &&
                        <div><Button color="link" onClick={isEditAdminDeposit ? addAdminDepo : onEditAdminDeposit}>{isEditAdminDeposit ? 'Save' : 'Edit'}</Button>
                            {isEditAdminDeposit && <Button className="ml-3" onClick={() => cancelFunc('admin_deposit')} color="link">Cancel</Button>}
                        </div>}
                      </div>
                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="adminDeposit">Type</Label>
                            <div className="d-flex inline-input">
                              <CustomInput disabled={!isEditAdminDeposit} type="radio" id="cash" name="balanceType" label="Cash" value="cash" checked={balanceType === 'cash'} onChange={event => handleChange(event, 'Deposit_Type')} />
                              <CustomInput disabled={!isEditAdminDeposit} type="radio" id="bonus" name="balanceType" label="Bonus" value="bonus" checked={balanceType === 'bonus'} onChange={event => handleChange(event, 'Deposit_Type')} />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="Type">To Balance</Label>
                            <CustomInput className="form-control" type="select" id="balance" name="balance" value={balance} disabled={!isEditAdminDeposit || balanceType === 'bonus'} onChange={event => handleChange(event, 'Balance')}>
                              <option value="deposit">Deposit</option>
                              <option value="winning">Winning</option>
                            </CustomInput>
                          </FormGroup>
                        </Col>
                        {
                          balanceType === 'cash'
                            ? (
                            <Col xs={6}>
                              <FormGroup>
                                <Label for="Cash">Cash</Label>
                                <Input type="number" id="Cash" placeholder="Enter Cash" value={cash} disabled={!isEditAdminDeposit} onChange={event => handleChange(event, 'Cash')} />
                                <p className="error-text">{errCash}</p>
                              </FormGroup>
                            </Col>
                              )
                            : balanceType === 'bonus'
                              ? (
                              <Col xs={6}>
                                <FormGroup>
                                  <Label for="Bonus">Bonus</Label>
                                  <Input type="number" id="Bonus" placeholder="Enter Bonus" value={bonus} disabled={!isEditAdminDeposit} onChange={event => handleChange(event, 'Bonus')} />
                                  <p className="error-text">{errBonus}</p>
                                </FormGroup>
                              </Col>
                                )
                              : ''
                        }
                        <br />
                        <Col xs={6}>
                          <FormGroup>
                            <Label for="DPassword">Password</Label>
                            <Input type="password" id="DPassword" placeholder="Enter Password" value={DepositPassword} disabled={!isEditAdminDeposit} onChange={event => handleChange(event, 'DepositPassword')} />
                            <p className="error-text">{ErrDepositPassword}</p>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Fragment>
                )
              }
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW !== 'N')) &&
                (
                  <Fragment>
                    <div className="common-box">
                      <div className="d-flex justify-content-between align-items-start">
                        <h3>Admin Withdraw</h3>
                        {((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW !== 'R')) &&
                        <div><Button color="link" onClick={isEditAdminWithdraw ? funcAddAdminWithdraw : onEditAdminWithdraw}>{isEditAdminWithdraw ? 'Save' : 'Edit'}</Button>
                          {isEditAdminWithdraw && <Button className="ml-3" onClick={() => cancelFunc('admin_withdraw')} color="link">Cancel</Button>}
                        </div>}
                      </div>
                      <Row>
                        <Col xs={6}>
                          <FormGroup>
                          <Label for="adminWithdraw">From Balance</Label>
                            <div className="d-flex inline-input">
                              <CustomInput disabled={!isEditAdminWithdraw} type="radio" id="withdraw" name="withdrawType" label="Deposit" value="withdraw" checked={withdrawType === 'withdraw'} onChange={event => handleChange(event, 'WithdrawType')} />
                              <CustomInput disabled={!isEditAdminWithdraw} type="radio" id="winningWithdraw" name="withdrawType" label="Winning" value="winning" checked={withdrawType === 'winning'} onChange={event => handleChange(event, 'WithdrawType')} />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                            <Col xs={6}>
                              <FormGroup>
                                <Label for="Amount">Amount</Label>
                                <Input type="number" id="Amount" placeholder="Enter Amount" value={amount} disabled={!isEditAdminWithdraw} onChange={event => handleChange(event, 'Amount')} />
                                <p className="error-text">{errAmount}</p>
                              </FormGroup>
                            </Col>

                        <Col xs={6}>
                          <FormGroup>
                            <Label for="WPassword">Password</Label>
                            <Input type="password" id="WPassword" placeholder="Enter Password" value={WithDrawPassword} disabled={!isEditAdminWithdraw} onChange={event => handleChange(event, 'WithdrawPassword')} />
                            <p className="error-text">{ErrWithdrawPassword}</p>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Fragment>
                )
              }
              </Col>

              <Col lg='1'></Col>
            </Row>
          </section>
        </main>
        </>
  )
}

SystemUserDetails.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default SystemUserDetails
