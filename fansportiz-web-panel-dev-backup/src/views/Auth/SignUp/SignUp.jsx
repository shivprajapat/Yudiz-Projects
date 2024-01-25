import React, { useState, useEffect } from 'react'
import {
  Input, Form, FormGroup, Label, Button, Alert
} from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  verifyEmail, verifyLength, verifyMobileNumber, withoutSpace, verifySpecialCharacter
} from '../../../utils/helper'
import useCheckExist from '../../../api/auth/mutations/useCheckFieldExist'
import useGetPolicies from '../../../api/auth/queries/useGetPolicies'
const classNames = require('classnames')

function SignUpForm () {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [policyIds, setPolicyIds] = useState([])
  const [errEmail, setErrEmail] = useState('')
  const [errUserName, setErrUserName] = useState('')
  const [errNumber, setErrNumber] = useState('')
  const [checked, setChecked] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [message] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const { shareCode } = useParams()

  const { data: policies } = useGetPolicies()

  useEffect(() => {
    if (state?.socialRegisterData) {
      // setName(state.socialRegisterData.sName)
      setEmail(state.socialRegisterData.sEmail)
      // setSocialToken(state.token)
    }
    if (shareCode) {
      if (shareCode) {
        setReferralCode(shareCode)
      }
    }
    if (state) {
      setUserName(state?.userName)
      // setName(state?.name)
      setEmail(state?.email)
      setMobileNumber(state?.mobileNumber)
      setReferralCode(state?.referralCode)
      setChecked(state?.checked)
      setChecked2(state?.checked2)
      setPolicyIds(state?.policyIds)
    }
  }, [])

  window.history.replaceState({}, document.title)

  const { mutate: CheckExistMutation } = useCheckExist({ setErrUserName, setErrEmail, setErrNumber })

  function handleChange (event, type) {
    setModalMessage(false)
    switch (type) {
      case 'Email':
        setErrEmail('')
        setEmail(event.target.value)
        break
      case 'UserName':
        setErrUserName('')
        setUserName(event.target.value)
        break
      case 'PhoneNumber':
        setErrNumber('')
        setMobileNumber(event.target.value)
        break
      case 'ReferralCode':
        setReferralCode(event.target.value)
        break
      default:
        break
    }
  }

  function signUpFunc (e) {
    e.preventDefault()

    if (verifyLength(email, 1) && verifyEmail(email) && verifyLength(userName, 3) &&
    userName.length <= 16 && !withoutSpace(userName) && verifySpecialCharacter(userName) &&
    verifyMobileNumber(mobileNumber)) {
      navigate('/confirm-password', {
        state: { ...state, userName, email, mobileNumber, referralCode, policyIds }
      })
    } else {
      if (!verifyLength(email, 1) || !verifyEmail(email)) setErrEmail(<FormattedMessage id="Invalid_email" />)

      if (withoutSpace(userName) || !verifySpecialCharacter(userName)) {
        setErrUserName(<FormattedMessage id="Username_must_be_alphanumeric" />)
      } else if (!verifyLength(userName, 3)) {
        setErrUserName(<FormattedMessage id="Username_must_be_3_to_15_characters_and_alpha_numeric" />)
      } else if (userName.length > 16) {
        setErrUserName(<FormattedMessage id="User_name_must_be_maximum_of_16_characters" />)
      }
      if (!verifyMobileNumber(mobileNumber)) setErrNumber(<FormattedMessage id="Invalid_mobile_number" />)
    }
  }

  function BlurFunction (event, type) {
    switch (type) {
      case 'Email':
        if (verifyLength(event.target.value, 1) && verifyEmail(event.target.value)) {
          CheckExistMutation({ sType: 'E', sValue: email })
        }
        break
      case 'UserName':
        if (verifyLength(event.target.value, 5) && verifySpecialCharacter(event.target.value) &&
        !withoutSpace(event.target.value)) {
          CheckExistMutation({ sType: 'U', sValue: userName })
        }
        break
      case 'PhoneNumber':
        if (verifyMobileNumber(event.target.value)) {
          CheckExistMutation({ sType: 'M', sValue: mobileNumber })
        }
        break
      default:
        break
    }
  }

  const handleonKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault()
    }
  }

  function isDisableFunc () {
    return errEmail || errNumber || errUserName ||
    !email || !mobileNumber || !userName || !checked || !checked2
  }

  return (
    <>
      {modalMessage
        ? <Alert color="primary" isOpen={modalMessage}>{message}</Alert>
        : ''}
      <Form className="form sign-up">
        <FormGroup className="c-input">
          <Input autoComplete="off" className={classNames({ 'hash-contain': userName })} id="username" maxLength={16} onBlur={(e) => { BlurFunction(e, 'UserName') }} onChange={(e) => { handleChange(e, 'UserName') }} required value={userName} />
          <Label className="label m-0" for="username"><FormattedMessage id="Username" /></Label>
          <p className="error-text">{errUserName}</p>
        </FormGroup>
        <FormGroup className="c-input">
          <Input autoComplete="off" className={classNames({ 'hash-contain': email, error: errEmail })} id="email" onBlur={(e) => { BlurFunction(e, 'Email') }} onChange={(e) => { handleChange(e, 'Email') }} required value={email} />
          <Label className="label m-0" for="email"><FormattedMessage id="Email" /></Label>
          <p className="error-text">{errEmail}</p>
        </FormGroup>
        <FormGroup className="c-input">
          <div className="fake-input">
            <div className="data-num" data-num="+91">
              <Input autoComplete="off" className={classNames({ 'hash-contain': mobileNumber, error: errNumber }, 'data-nums')} data-nums="+91" id="mobile-number" onBlur={(e) => { BlurFunction(e, 'PhoneNumber') }} onChange={(e) => { handleChange(e, 'PhoneNumber') }} onKeyPress={handleonKeyPress} required type="number" value={mobileNumber} />
              <Label className="label m-0" for="mobile-number"><FormattedMessage id="Mobile_Number" /></Label>
              <span className="mobile-no-prefix" dir='ltr'>+91</span>
            </div>
          </div>
          <p className="error-text">{errNumber}</p>
        </FormGroup>
        <FormGroup className="c-input">
          <Input autoComplete="off" className={classNames({ 'hash-contain': referralCode })} id="ReferralCode" maxLength={6} onChange={(e) => { handleChange(e, 'ReferralCode') }} value={referralCode} />
          <Label className="label m-0" for="ReferralCode"><FormattedMessage id="Referral_Code_Optional" /></Label>
        </FormGroup>

        <FormGroup check className={`mb-2 checkbox-input-top ${document.dir === 'rtl' && 'text-end'}`}>
          <Label check>
            <Input checked={checked2} className="CheckBox" onClick={() => setChecked2(!checked2)} type="checkbox" />
            <div>
              <FormattedMessage id="I_confirm_I_am_above_18_years" />
            </div>
          </Label>
        </FormGroup>
        <FormGroup check className={`mb-4 checkbox-input-top ${document.dir === 'rtl' && 'text-end'}`}>
          <Label check>
            <Input checked={checked}
              className="CheckBox"
              onClick={() => {
                setPolicyIds(policies?.map(policy => policy._id))
                setChecked(!checked)
              }}
              type="checkbox"
            />
            <div>
              <FormattedMessage id="I_am_not_a_resident_of" />
              <span className="state1"><FormattedMessage id="Telangana_Assam_Odisha_Sikkim" /></span>
              <FormattedMessage id="and" />
              <span className="state1"><FormattedMessage id="Meghalaya" /></span>
              <FormattedMessage id="and_agree_to_all_the" />
              <Link state={{ ...state, userName, email, mobileNumber, referralCode, checked, checked2, policyIds }}
                to={{
                  pathname: '/more-details/terms-condition'
                }}
              >
                <FormattedMessage id="Terms_and_Conditions" />
              </Link>
              <FormattedMessage id="and" />
              <Link state={ { ...state, userName, email, mobileNumber, referralCode, checked, checked2, policyIds }}
                to={{
                  pathname: '/more-details/privacy-policy'
                }}
              >
                <FormattedMessage id="Privacy_Policy" />
              </Link>
            </div>
          </Label>
        </FormGroup>
        <Button
          block
          color="primary"
          disabled={isDisableFunc()}
          onClick={(e) => signUpFunc(e)}
          type="submit"
        >
          <FormattedMessage id="Sign_up" />
        </Button>
      </Form>
    </>
  )
}

export default SignUpForm
