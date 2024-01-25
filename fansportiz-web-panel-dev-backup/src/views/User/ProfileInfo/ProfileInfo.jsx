/* eslint-disable no-case-declarations */
/* eslint-disable array-callback-return */
import React, { useEffect, useState, useRef, Fragment } from 'react'
import { Form, Label, Input, Alert } from 'reactstrap'
import UserProfile from '../../../HOC/User/UserProfile'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import PropTypes from 'prop-types'
import { countries, states, cities } from '../../../utils/country'
import Loading from '../../../component/Loading'
import RightIcon from '../../../assests/images/right_icon_2.svg'
import WarningIcon from '../../../assests/images/wrong-icon-profile.svg'
import { validPinCode, verifySpecCharWithSpace, isNumber } from '../../../utils/helper'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'

function ProfileInfoPage (props) {
  const [sUsername, setsUsername] = useState('')
  const [sName, setsName] = useState('')
  const [sEmail, setsEmail] = useState('')
  const [sMobNum, setsMobNum] = useState('')
  const [dDob, setsDOB] = useState('')
  const [eGender, seteGender] = useState('')
  const [iCountryId, setiCountryId] = useState('')
  const [iStateId, setiStateId] = useState('')
  const [iCityId, setiCityId] = useState('')
  const [sAddress, setsAddress] = useState('')
  const [errsAddress, setErrsAddress] = useState('')
  const [nPinCode, setnPinCode] = useState('')
  const [cityList, setCityList] = useState([])
  const [stateList, setStatesList] = useState([])
  const [errName, setErrName] = useState('')
  const [errPinCode, setErrPinCode] = useState('')
  const [errDOB, setErrDOB] = useState('')
  const [stateErr, setStateErr] = useState('')
  // const [message, setMessage] = useState('')
  // const [shawMessage, setShawMessage] = useState(false)
  const { updateProfile, resMessage, loading, modalMessage, getUserProfile, userInfo, setLoading, token, isUpdatedProfile } = props
  const previousProps = useRef({ userInfo, isUpdatedProfile }).current
  const maxDate = new Date()
  const submitDisable = previousProps?.userInfo !== userInfo && userInfo?.sName === (sName || undefined) && ((userInfo?.dDob ? moment(userInfo?.dDob).format('YYYY-MM-DD') : '') === dDob) && (userInfo?.iCountryId === (iCountryId ? parseInt(iCountryId) : undefined)) && (userInfo?.iStateId === (iStateId ? parseInt(iStateId) : undefined)) && (userInfo?.iCityId === (iCityId ? parseInt(iCityId) : undefined)) && userInfo?.eGender === eGender && userInfo?.sAddress === (sAddress || undefined) && (userInfo?.nPinCode === (nPinCode !== '' ? parseInt(nPinCode) : undefined))
  // const submitDisable = previousProps?.userInfo !== userInfo && userInfo?.sName === sName && ((userInfo?.dDob ? moment(userInfo?.dDob).format('YYYY-MM-DD') : '') === dDob) && (userInfo?.iCountryId === (iCountryId && parseInt(iCountryId))) && (userInfo?.iStateId === (iStateId && parseInt(iStateId))) && (userInfo?.iCityId === (iCityId && parseInt(iCityId))) && (userInfo?.nPinCode === (nPinCode && parseInt(nPinCode))) && userInfo?.eGender === eGender && userInfo?.sAddress === sAddress

  const navigate = useNavigate()

  maxDate.setFullYear(maxDate.getFullYear() - 18)
  useEffect(() => { // handle the response
    getUserProfile()
    const FilterStateData = states.filter(states => states?.nCountryId === parseInt(1))
    const FilterCityData = cities.filter(states => states?.state_id === parseInt(1))
    setCityList(FilterCityData)
    setStatesList(FilterStateData)
  }, [token])

  useEffect(() => { // handle the response
    if (iStateId) {
      const FilterData = cities.filter(city => city?.state_id === parseInt(iStateId))
      setCityList(FilterData)
    }
  }, [iStateId])

  useEffect(() => { // handle the response
    if (iCountryId) {
      const FilterData = states.filter(states => states?.nCountryId === parseInt(iCountryId))
      setStatesList(FilterData)
    }
  }, [iCountryId])

  useEffect(() => { // handle the response
    if (previousProps.userInfo !== userInfo) {
      if (userInfo) {
        setsUsername(userInfo.sUsername)
        setsName(userInfo.sName)
        setsEmail(userInfo.sEmail)
        setsMobNum(userInfo.sMobNum)
        seteGender(userInfo.eGender)
        setsAddress(userInfo.sAddress)
        setiCityId(userInfo.iCityId)
        setnPinCode(userInfo.nPinCode || '')
        setsDOB(userInfo.dDob ? moment(userInfo.dDob).format('YYYY-MM-DD') : '')
        setiStateId(userInfo.iStateId)
        setiCountryId(userInfo.iCountryId)
        setLoading(false)
      }
    }
    return () => {
      previousProps.userInfo = userInfo
    }
  }, [userInfo])

  useEffect(() => { // handle the response
    if (previousProps.isUpdatedProfile !== isUpdatedProfile) {
      if (isUpdatedProfile) {
        navigate('profile', { state: { message: resMessage } })
      }
    }
    return () => {
      previousProps.isUpdatedProfile = isUpdatedProfile
    }
  }, [isUpdatedProfile])

  function handleOnChange (event, type) {
    switch (type) {
      // case 'Name':
      //   if (!verifySpecCharWithSpace(event.target.value)) {
      //     setErrName(<FormattedMessage id="Username_must_be_alphanumeric" />)
      //   } else {
      //     setErrName('')
      //   }
      //   setsName(event.target.value)
      //   break
      case 'Name':
        // if ((verifyLength(event.target.value, 2) && event.target.value.length <= 30) && verifySpecCharWithSpace(event.target.value)) {
        setErrName('')
        // } else {
        //   if (!verifyLength(event.target.value, 2) || !(event.target.value.length > 30)) {
        //     setErrName(<FormattedMessage id="Full_name_must_be_2_to_30_characters" />)
        //   } else if (!verifySpecCharWithSpace(event.target.value)) {
        //     setErrName(<FormattedMessage id="Full_name_must_be_alpha_numeric" />)
        //   }
        // }
        verifySpecCharWithSpace(event.target.value)
        setsName(event.target.value)
        break
      case 'DOB':
        // if (moment().subtract('years', 80).isAfter(event.target.value)) {
        //   setErrDOB(<FormattedMessage id="Enter_proper_birth_date" />)
        // } else if (moment(event.target.value).isAfter(moment())) {
        //   setErrDOB(<FormattedMessage id="Date_should_not_be_future_date" />)
        // } else if (moment().subtract('years', 18).isBefore(event.target.value)) {
        //   setErrDOB(<FormattedMessage id="Age_must_be_greater_than_18" />)
        // } else {
        setErrDOB('')
        // }
        setsDOB(event.target.value)
        break
      case 'Gender':
        seteGender(event.target.value)
        break
      case 'Country':
        if (event.target.value === '') {
          setiStateId('')
          setiCityId('')
        }
        setiCountryId(event.target.value && parseInt(event.target.value))
        break
      case 'State':
        // const stateStatus = stateList?.find(data => data?.id === parseInt(event.target.value))
        // if (stateStatus?.eStatus === 'N') {
        //   setStateErr(<FormattedMessage id="Selected_state_is_restricted" />)
        // } else {
        setStateErr('')
        // }
        // if (parseInt(event.target.value) !== iStateId) {
        setiCityId('')
        // }
        setiStateId(event.target.value && parseInt(event.target.value))
        break
      case 'City':
        setiCityId(event.target.value && parseInt(event.target.value))
        break
      case 'PinCode':
        // if (!isNaN(event.target.value) || (!event.target.value)) {
        //   if (validPinCode(event.target.value)) {
        //     setErrPinCode(<FormattedMessage id="Pin_code_is_invalid" />)
        //   } else {
        setErrPinCode('')
        // }

        if (isNumber(event.target.value) || (!event.target.value)) {
          setnPinCode(event.target.value && parseInt(event.target.value))
        }

        // }
        break
      case 'Address':
        setErrsAddress('')
        setsAddress(event.target.value)
        break
      default:
        break
    }
  }
  const handleSubmit = (e) => {
    const sNameLength = sName?.length
    e.preventDefault()
    if ((dDob ? !((moment().subtract('years', 80).isAfter(dDob) || moment(dDob).isAfter(moment()) || moment().subtract('years', 18).isBefore(dDob))) : true) && (sName ? (sNameLength >= 2 && sNameLength <= 30) && verifySpecCharWithSpace(sName) : true) && !stateErr && (sAddress ? (sAddress?.length >= 5 && sAddress?.length <= 50) : true) && (eGender || true)) {
      const userData = {
        sUsername, sName, sEmail, sMobNum, eGender, sAddress, iCountryId: iCountryId && parseInt(iCountryId), iCityId: iCityId && parseInt(iCityId), nPinCode: nPinCode && parseInt(nPinCode), dDob, iStateId: iStateId && parseInt(iStateId)
      }
      updateProfile('w', 'data', userData)
    } else {
      // if (!(dDob < moment(maxDate).format('YYYY-MM-DD'))) {
      //   setMessage(<FormattedMessage id="Age_must_be_greater_than_18" />)
      // } else if (sName !== '' && !verifySpecCharWithSpace(sName)) {
      //   setMessage(<FormattedMessage id="Username_must_be_alphanumeric" />)
      // } else if (stateErr) {
      //   setMessage(<FormattedMessage id="Selected_state_is_restricted" />)
      // } else if (moment().subtract('years', 80).isAfter(dDob)) {
      //   setMessage(<FormattedMessage id="Enter_proper_birth_date" />)
      // }
      if (sNameLength !== 0) {
        if ((sNameLength < 2) || (sNameLength > 30)) {
          setErrName(<FormattedMessage id="Full_name_must_be_2_to_30_characters" />)
        } else if (!verifySpecCharWithSpace(sName)) {
          setErrName(<FormattedMessage id="Full_name_must_be_alpha_numeric" />)
        }
      }
      if (moment().subtract('years', 80).isAfter(dDob)) {
        setErrDOB(<FormattedMessage id="Enter_proper_birth_date" />)
      } else if (moment(dDob).isAfter(moment())) {
        setErrDOB(<FormattedMessage id="Date_should_not_be_future_date" />)
      } else if (moment().subtract('years', 18).isBefore(dDob)) {
        setErrDOB(<FormattedMessage id="Age_must_be_greater_than_18" />)
      }
      const stateStatus = stateList?.find(data => data?.id === parseInt(iStateId))
      if (stateStatus?.eStatus === 'N') {
        setStateErr(<FormattedMessage id="Selected_state_is_restricted" />)
      }
      if (!isNaN(nPinCode) || (!nPinCode)) {
        if (nPinCode !== '') {
          if (validPinCode(nPinCode)) {
            setErrPinCode(<FormattedMessage id="Pin_code_is_invalid" />)
          }
        }
      }
      if (sAddress?.length !== 0) {
        if (sAddress?.length < 5 || sAddress?.length > 50) {
          setErrsAddress(<FormattedMessage id="Address_must_be_5_to_50_characters" />)
        }
      }

      // setShawMessage(true)
      // setTimeout(() => {
      // setShawMessage(false)
      // }, 2000)
    }
  }
  return (
    <>
      {loading && <Loading />}
      {modalMessage && resMessage ? <Alert color="primary" isOpen={modalMessage}>{resMessage}</Alert> : ''}
      {/* {shawMessage && message ? <Alert isOpen={shawMessage} color="primary">{message}</Alert> : ''} */}
      <div className="user-container bg-white">
        <Form className="form sign-up pb-0">
          <div className="c-input">
            <Input autoComplete='off' className={`bg-white ${sUsername ? 'hash-contain' : ' '}`} disabled id="Username" name="sUsername" type="text" value={sUsername} />
            <Label className="no-change label m-0" for="Username"><FormattedMessage id="Username" /></Label>
          </div>
          <div className="c-input">
            <Input autoComplete='off' className={classNames('bg-white', sName ? 'hash-contain' : ' ', { error: errName })} id="FullName" maxLength={100} name="sName" onChange={(event) => handleOnChange(event, 'Name')} type="text" value={sName} />
            <Label className="no-change label m-0" for="FullName"><FormattedMessage id="Full_Name" /></Label>
            <p className="error-text">{errName}</p>
          </div>
          <div className="c-input">
            <div className="fake-input-profile" >
              <Input autoComplete='off' className={`bg-white ${sEmail ? 'hash-contain' : ' '}`} defaultValue={sEmail} disabled id="Email" name="sEmail" onClick={() => navigate('/change/email')} type="email" />
              <img onClick={() => !userInfo.bIsEmailVerified && navigate('/verify/email')} src={userInfo && userInfo.bIsEmailVerified ? RightIcon : userInfo && !userInfo.bIsEmailVerified && WarningIcon} width="25" />
              <Label className="no-change label m-0" for="Email"><FormattedMessage id="Email" /></Label>
            </div>
          </div>
          <div className="c-input">
            <div className="fake-input-profile" >
              <Input autoComplete='off' className={`bg-white hidden-border ${sMobNum ? 'hash-contain' : ' '}`} defaultValue={sMobNum} disabled id="MobileNumber" maxLength={10} name="sMobNum" onClick={() => navigate('/change/mobile-number')} type="text" />
              <img onClick={() => !userInfo.bIsMobVerified && navigate('/verify/mobile-number')} src={userInfo && userInfo.bIsMobVerified ? RightIcon : userInfo && !userInfo.bIsMobVerified && WarningIcon} width="25"/>
              <Label className="no-change label m-0" for="MobileNumber"><FormattedMessage id="Mobile_Number" /></Label>
            </div>
          </div>
          <div className="c-input m-0">
            <Input autoComplete='off' className={classNames('bg-white hash-contain', { error: errDOB })} name="DateofBirth" onChange={(event) => handleOnChange(event, 'DOB')} type="date" value={dDob} />
            <Label className="no-change label m-0" for="DateofBirth"><FormattedMessage id="Date_of_Birth" /></Label>
            <p className="error-text">{errDOB}</p>
          </div>
          <div className="c-input m-0">
            <Label className="no-change label m-0 position-static" for="DateofBirth"><FormattedMessage id="Gender" /></Label>
            <ul className="d-flex radio-icon">
              <li>
                <input checked={eGender === 'M'} className={`d-none ${eGender === 'M' ? 'checked' : ''}`} id="male" name="eGender" onClick={(event) => handleOnChange(event, 'Gender')} type="radio" value='M' />
                <label htmlFor="male">
                  <i className="icon-male" />
                  <FormattedMessage id="Male" />
                </label>
              </li>
              <li>
                <input checked={eGender === 'F'} className={`d-none ${eGender === 'F' ? 'checked' : ''}`} id="female" name="eGender" onClick={(event) => handleOnChange(event, 'Gender')} type="radio" value='F' />
                <label htmlFor="female">
                  <i className="icon-female" />
                  <FormattedMessage id="Female" />
                </label>
              </li>
              <li>
                <input checked={eGender === 'O'} className={`d-none ${eGender === 'O' ? 'checked' : ''}`} id="other" name="eGender" onClick={(event) => handleOnChange(event, 'Gender')} type="radio" value='O' />
                <label htmlFor="other"><FormattedMessage id="Other" /></label>
              </li>
            </ul>
          </div>
          <div className="c-input m-0">
            <Input autoComplete='off' className="bg-white hash-contain" onChange={(event) => handleOnChange(event, 'Country')} required type="select" value={iCountryId} >
              <FormattedMessage id='Select_Country'>
                {country => (
                  <option key='' value=''>
                    {country}
                  </option>
                )}
              </FormattedMessage>
              {
              countries && countries.length !== 0 && countries.map((data, i) => {
                return (
                  <option key={data.country_name} id={data.id} value={data.id}>{data.country_name}</option>
                )
              })
            }
            </Input>
            <Label className="no-change label m-0" for="City"><FormattedMessage id="Country" /></Label>
          </div>
          <div className="c-input m-0">
            <Input autoComplete='off' className={classNames('bg-white hash-contain', { error: stateErr })} onChange={(event) => handleOnChange(event, 'State')} required type="select" value={iStateId}>
              <FormattedMessage id='Select_State'>
                {state => (
                  <option key='' value=''>
                    {state}
                  </option>
                )}
              </FormattedMessage>
              {
              stateList && stateList.length !== 0 && stateList.map((data, i) => {
                return (
                  <option key={data.sName} id={data.id} value={data.id}>{data.sName}</option>
                )
              })
            }
            </Input>
            <p className="error-text">{stateErr}</p>
            <Label className="no-change label m-0" for="State"><FormattedMessage id="State" /></Label>
          </div>
          <div className="c-input">
            <Input autoComplete='off' className='bg-white hash-contain' disabled={!iStateId} id="City" onChange={(event) => handleOnChange(event, 'City')} required type="select" value={iCityId} >
              <Fragment>
                <FormattedMessage id='Select_City'>
                  {city => (
                    <option key='' value=''>
                      {city}
                    </option>
                  )}
                </FormattedMessage>
                {
                cityList && cityList.length !== 0 && cityList.map((data, i) => {
                  return (
                    <option key={data.city_name} value={data.id}>{data.city_name}</option>
                  )
                })
              }
              </Fragment>
            </Input>
            <Label className="no-change label m-0" for="City"><FormattedMessage id="City" /></Label>
          </div>
          <div className="c-input">
            <Input autoComplete='off' className={classNames('bg-white', nPinCode ? 'hash-contain' : ' ', { error: errPinCode })} id="PinCode" onChange={(event) => handleOnChange(event, 'PinCode')} type="text" value={nPinCode} />
            <Label className="no-change label m-0" for="PinCode"><FormattedMessage id="Pin_Code" /></Label>
            <p className="error-text">{errPinCode}</p>
          </div>
          <div className="c-input">
            <Input autoComplete='off' className={`bg-white ${sAddress ? 'hash-contain' : ' '}`} id="Address" maxLength={256} onChange={(event) => handleOnChange(event, 'Address')} required type="text" value={sAddress} />
            <Label className="no-change label m-0" for="Address"><FormattedMessage id="Address" /></Label>
            <p className="error-text">{errsAddress}</p>
          </div>
          <div className="f-bottom text-center"><button className="btn btn-primary-two btn-block" disabled={submitDisable} onClick={handleSubmit} type="submit"><FormattedMessage id="Save" /></button></div>
        </Form>
      </div>
    </>
  )
}
ProfileInfoPage.propTypes = {
  UpdateProfile: PropTypes.func,
  resMessage: PropTypes.string,
  token: PropTypes.string,
  resStatus: PropTypes.bool,
  isUpdatedProfile: PropTypes.bool,
  userInfo: PropTypes.shape({
    bIsEmailVerified: PropTypes.bool,
    bIsMobVerified: PropTypes.bool,
    sEmail: PropTypes.string,
    sMobNum: PropTypes.string,
    eGender: PropTypes.string,
    sUsername: PropTypes.string,
    sName: PropTypes.string,
    sAddress: PropTypes.string,
    iCityId: PropTypes.string,
    nPinCode: PropTypes.number,
    dDob: PropTypes.date,
    iStateId: PropTypes.string,
    iCountryId: PropTypes.number
  }),
  intl: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  loading: PropTypes.bool,
  modalMessage: PropTypes.func,
  setUserData: PropTypes.func,
  stateList: PropTypes.array,
  cityList: PropTypes.array,
  getUserProfile: PropTypes.func,
  updateProfile: PropTypes.func,
  isCheckExist: PropTypes.func,
  setLoading: PropTypes.func,
  onGetCityList: PropTypes.func
}
export default UserProfile(ProfileInfoPage)
