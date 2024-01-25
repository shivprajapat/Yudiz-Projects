import React, { useState, useEffect } from 'react'
import { Alert, Form, FormGroup, Nav, NavItem, NavLink, TabContent, TabPane, Input, Label, Button } from 'reactstrap'
import { panCardNumber, verifyAadhaar, verifyLength, verifyOnlyAlphabets } from '../../../utils/helper'
import { FormattedMessage } from 'react-intl'
import Loading from '../../../component/Loading'
import rejected from '../../../assests/images/rejected.svg'
import verified from '../../../assests/images/verified.svg'
import pending from '../../../assests/images/pending.svg'
import classNames from 'classnames'
import useGetKycDetails from '../../../api/user/queries/useGetKycDetails'
import useSendKycOtp from '../../../api/user/mutations/useSendKycOtp'
import useAddKycDetails from '../../../api/user/mutations/useAddKyc'
import useUpdateKycDetails from '../../../api/user/mutations/useUpdateKyc'

function KycVerificationPage () {
  const [pan, setPan] = useState('')
  const [panErr, setPanErr] = useState('')
  const [panCardName, setPanCardName] = useState()
  const [panCardNameErr, setPanCardNameErr] = useState()
  // const [panImage, setPanImage] = useState({ image: '' })
  // const [panImageErr, setPanImageErr] = useState('')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [aadhaarNumberErr, setAadhaarNumberErr] = useState('')
  // const [aadhaarFrontImg, setAadhaarFrontImg] = useState({ image: '' })
  // const [aadhaarBackImg, setAadhaarBackImg] = useState({ image: '' })
  // const [aadhaarImgErr, setAadhaarImgErr] = useState('')
  const [otp, setOtp] = useState('')
  const [otpErr, setOtpErr] = useState('')
  const [isSendedOtp, setSendedOTP] = useState(false)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [submitAgain, setSubmitAgain] = useState(false)
  const [activeTab, setActiveTab] = useState('1')
  const [message, setMessage] = useState('')
  const [alert, setAlert] = useState(false)

  const { data: kycDetails, refetch: refetchKycDetails, isLoading: kycDetailsLoading } = useGetKycDetails()
  const { mutate: SendKycOtp, isLoading: sendKycOtpLoading, variables } = useSendKycOtp()
  const { mutate: AddKyc, isLoading: AddKycLoading } = useAddKycDetails({ setMessage, setAlert, refetchKycDetails })
  const { mutate: UpdateKyc, isLoading: UpdateKycLoading } = useUpdateKycDetails({ setMessage, setAlert, refetchKycDetails })

  const toggle = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
      setSubmitAgain(false)
    }
  }

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval)
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  }, [minutes, seconds])

  useEffect(() => {
    if (kycDetails) {
      if (kycDetails?.oPan) {
        setPan(kycDetails?.oPan?.sNo || '')
        setPanCardName(kycDetails?.oPan?.sName || '')
        // kycDetails?.oPan?.sImage && setPanImage({ image: kycDetails?.oPan?.sImage })
      }
      if (kycDetails?.oAadhaar) {
        setAadhaarNumber(kycDetails?.oAadhaar?.nNo || '')
        // kycDetails?.oAadhaar?.sFrontImage && setAadhaarFrontImg({ image: kycDetails?.oAadhaar?.sFrontImage })
        // kycDetails?.oAadhaar?.sBackImage && setAadhaarBackImg({ image: kycDetails?.oAadhaar?.sBackImage })
      }
    }
  }, [kycDetails])

  useEffect(() => {
    if (variables) {
      setAadhaarNumber(variables?.nAadhaarNo)
    }
  }, [variables])

  // Will handle onChange event for input fields(PAN and Aadhaar both)
  const handleChange = (e, type) => {
    switch (type) {
      case 'PAN':
        setPanErr('')
        setPan((e.target.value).toUpperCase())
        break
      case 'PAN_NAME':
        setPanCardNameErr('')
        setPanCardName(e.target.value)
        break
      case 'AADHAAR':
        setAadhaarNumberErr('')
        setAadhaarNumber(e.target.value)
        break
      case 'OTP':
        setOtpErr('')
        setOtp(e.target.value)
        break
      default:
        break
    }
  }

  // const handlePanImg = (e) => { // Handle pan card img
  //   if (e.target.files[0]?.type.includes('image')) {
  //     setPanImage({ image: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
  //     setPanImageErr('')
  //   }
  // }

  // const handleAadhaarImg = (e, type) => {
  //   switch (type) {
  //     case 'front':
  //       if (e.target.files[0]?.type.includes('image')) {
  //         setAadhaarFrontImg({ image: URL.createObjectURL(e.target.files[0]), frontFile: e.target.files[0] })
  //         if (aadhaarBackImg?.image === '') setAadhaarImgErr(<FormattedMessage id="Aadhaar_Card_Image_is_required" />)
  //         else setAadhaarImgErr('')
  //       }
  //       break
  //     case 'back':
  //       if (e.target.files[0]?.type.includes('image')) {
  //         setAadhaarBackImg({ image: URL.createObjectURL(e.target.files[0]), backFile: e.target.files[0] })
  //         if (aadhaarFrontImg?.image === '') setAadhaarImgErr(<FormattedMessage id="Aadhaar_Card_Image_is_required" />)
  //         else setAadhaarImgErr('')
  //       }
  //       break
  //     default:
  //       break
  //   }
  // }

  function sendOTP (e) {
    e.preventDefault()
    if (verifyAadhaar(aadhaarNumber)) {
      SendKycOtp({ nAadhaarNo: aadhaarNumber })
      setMinutes(0)
      setSeconds(60)
    } else {
      if (!verifyAadhaar(aadhaarNumber)) {
        setAadhaarNumberErr(<FormattedMessage id="Aadhaar_number_is_invalid" />)
      }
    }
  }

  const submitAadhaarCard = (e) => {
    e.preventDefault()
    if (isSendedOtp) {
      if (otp?.length === 0) setOtpErr(<FormattedMessage id='Required_field' />)
      else if (otp?.length < 4 || otp?.length > 6) setOtpErr(<FormattedMessage id='Invalid_otp' />)
      else {
        if (kycDetails?.oAadhaar?.eStatus === 'R') UpdateKyc({ kycType: 'AADHAAR', sPanNumber: '', sPanName: '', nAadhaarNo: aadhaarNumber })
        else AddKyc({ kycType: 'AADHAAR', sPanNumber: '', sPanName: '', nAadhaarNo: aadhaarNumber })
        setSubmitAgain(false)
      }
    } else {
      if (verifyAadhaar(aadhaarNumber)) {
        SendKycOtp({ nAadhaarNo: aadhaarNumber })
        setSendedOTP(true)
        setSeconds(60)
      } else setAadhaarNumberErr(<FormattedMessage id="Aadhaar_number_is_invalid" />)
      // if (!aadhaarFrontImg.image || !aadhaarBackImg.image) setAadhaarImgErr(<FormattedMessage id="Aadhaar_Card_Image_is_required" />)
    }
  }

  const submitPanCard = (e) => {
    e.preventDefault()
    if (!panCardNumber(pan) && (verifyOnlyAlphabets(panCardName?.trim())) && verifyLength(panCardName?.trim(), 4)) {
      if (kycDetails?.oPan?.eStatus === 'R') UpdateKyc({ kycType: 'PAN', sPanNumber: pan, sPanName: panCardName?.trim(), nAadhaarNo: '' })
      else {
        AddKyc({ kycType: 'PAN', sPanNumber: pan, sPanName: panCardName?.trim(), nAadhaarNo: '' })
      }
      setSubmitAgain(false)
    } else {
      if (panCardNumber(pan)) setPanErr(<FormattedMessage id="PAN_number_is_invalid" />)
      // if (panImage.image === '') setPanImageErr(<FormattedMessage id="Please_add_your_Pan_Card_image" />)
      if (!verifyOnlyAlphabets(panCardName?.trim())) setPanCardNameErr(<FormattedMessage id='Only_alphabets_allowed' />)
      if (!verifyLength(panCardName?.trim(), 4)) setPanCardNameErr(<FormattedMessage id="Required_field" />)
      if (!pan) setPanErr(<FormattedMessage id="Please_enter_PAN_card_number" />)
      // setPanImageErr(<FormattedMessage id="Please_add_your_Pan_Card_image" />)
    }
  }

  return (
    <>
      {(kycDetailsLoading || sendKycOtpLoading || AddKycLoading || UpdateKycLoading) && <Loading />}
      <div className="user-container bg-white no-footer leaderboard">
        {alert && message ? <Alert color="primary" isOpen={alert}>{message}</Alert> : ''}
        <Nav className="live-tabs two-tabs justify-content-between bg-white">
          <NavItem className="text-center">
            <NavLink className={classNames({ active: activeTab === '1' })} onClick={() => { toggle('1') }} ><FormattedMessage id="Pan_Card" /></NavLink>
          </NavItem>
          <NavItem className="text-center">
            <NavLink className={classNames({ active: activeTab === '2' })} onClick={() => { toggle('2') }} ><FormattedMessage id="Aadhaar_Card" /></NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {(['P', 'A', 'R'].includes(kycDetails?.oPan?.eStatus) && !submitAgain)
              ? (
                <div className="btn-bottom position-static mt-4 mb-2">
                  {kycDetails?.oPan?.eStatus === 'P'
                    ? (
                      <div className="info text-center pt-4">
                        <img src={pending} />
                        <div className='pt-3'>
                          <FormattedMessage id='Your_PAN_detail' />
                          {kycDetails?.oPan?.sNo}
                        </div>
                        <div><FormattedMessage id='verification_is_pending' /></div>
                      </div>
                      )
                    : ''}
                  {kycDetails?.oPan?.eStatus === 'A'
                    ? (
                      <div className="info text-center pt-4">
                        <img src={verified} />
                        <div className='pt-3'>
                          <FormattedMessage id='Your_PAN_detail' />
                          {kycDetails?.oPan?.sNo}
                        </div>
                        <div><FormattedMessage id='has_been_successfully_verified' /></div>
                      </div>
                      )
                    : ''}
                  {kycDetails?.oPan?.eStatus === 'R'
                    ? (
                      <div className='info pt-4'>
                        <div className='text-center pb-4'>
                          <img src={rejected} />
                          <div><FormattedMessage id='Your_PAN_detail' /></div>
                          <div><FormattedMessage id='KYC_reject_msg' /></div>
                        </div>
                        <hr />
                        <div className='reject'>
                          <div className='reject-reason-title'><FormattedMessage id="Reason_for_rejection"/></div>
                          <div className='reject-reason'>{kycDetails?.oPan?.sRejectReason}</div>
                        </div>
                        <Form className='form'><Button className="w-100 d-block" color="primary" onClick={() => setSubmitAgain(true)}><FormattedMessage id="Submit_again" /></Button></Form>
                      </div>
                      )
                    : ''}
                </div>
                )
              : (kycDetails?.oPan?.eStatus === 'N' || submitAgain)
                  ? (
                    <Form className="form">
                      <FormGroup className="c-input">
                        <Input className={classNames(`bg-white ${panCardName ? 'hash-contain' : ' '}`, { error: panCardNameErr })} disabled={['P', 'A'].includes(kycDetails?.oPan?.eStatus)} id="PANCard_Name" onChange={(e) => { handleChange(e, 'PAN_NAME') }} required type="text" value={panCardName} />
                        <Label className="no-change label m-0" for="PANCard_Name"><FormattedMessage id="PAN_Card_Name" /></Label>
                        {panCardNameErr ? <p className="error-text">{panCardNameErr}</p> : ''}
                      </FormGroup>
                      <FormGroup className="c-input">
                        <Input autoComplete='off' className={classNames(`bg-white ${pan ? 'hash-contain' : ' '}`, { error: panErr })} disabled={['P', 'A'].includes(kycDetails?.oPan?.eStatus)} id="PANCard" maxLength={10} onChange={(e) => { handleChange(e, 'PAN') }} required type="text" value={pan} />
                        <Label className="no-change label m-0" for="PANCard"><FormattedMessage id="PAN_Card_Number" /></Label>
                        {panErr ? <p className="error-text">{panErr}</p> : ''}
                      </FormGroup>
                      <div className='disclaimer'><FormattedMessage id="Note_Please_enter_the_pan_details_as_per_your_Pan_Card" /></div>
                      {!['P', 'A'].includes(kycDetails?.oPan?.eStatus) && (
                      <Button
                        className="w-100 d-block"
                        color="primary"
                        disabled={(!pan || panCardName.trim()?.length < 4)}
                        onClick={submitPanCard}
                        type="submit"
                      >
                        <FormattedMessage id="Submit" />
                      </Button>
                      )}
                    </Form>
                    )
                  : ''}
          </TabPane>

          <TabPane tabId="2">
            {(['P', 'A', 'R'].includes(kycDetails?.oAadhaar?.eStatus) && !submitAgain)
              ? (
                <div className="btn-bottom position-static mt-4 mb-2">
                  {kycDetails?.oAadhaar?.eStatus === 'P'
                    ? (
                      <div className="info text-center pt-4">
                        <img src={pending} />
                        <div className='pt-3'>
                          <FormattedMessage id='Your_Aadhaar_number' />
                          {kycDetails?.oAadhaar?.nNo}
                        </div>
                        <div><FormattedMessage id="verification_is_pending" /></div>
                      </div>
                      )
                    : ''}
                  {kycDetails?.oAadhaar?.eStatus === 'A'
                    ? (
                      <div className="info text-center pt-4">
                        <img src={verified} />
                        <div className='pt-3'>
                          <FormattedMessage id='Your_Aadhaar_number' />
                          {kycDetails?.oAadhaar?.nNo}
                        </div>
                        <div><FormattedMessage id="has_been_successfully_verified" /></div>
                      </div>
                      )
                    : ''}
                  {kycDetails?.oAadhaar?.eStatus === 'R'
                    ? (
                      <div className='info pt-4'>
                        <div className='text-center pb-4'>
                          <img src={rejected} />
                          <div><FormattedMessage id='Your_Aadhaar_number' /></div>
                          <div><FormattedMessage id='KYC_reject_msg' /></div>
                        </div>
                        <hr />
                        <div className='reject'>
                          <div className='reject-reason-title'><FormattedMessage id="Reason_for_rejection"/></div>
                          <div className='reject-reason'>{kycDetails && kycDetails.oAadhaar && kycDetails.oAadhaar.sRejectReason}</div>
                        </div>
                        <Form className='form'><Button className="w-100 d-block" color="primary" onClick={() => setSubmitAgain(true)}><FormattedMessage id="Submit_again" /></Button></Form>
                      </div>
                      )
                    : ''}
                </div>
                )
              : (kycDetails?.oAadhaar?.eStatus === 'N' || submitAgain)
                  ? (
                    <Form className="form pt-4">
                      <FormGroup className="c-input">
                        <Input className={classNames(`bg-white ${aadhaarNumber ? 'hash-contain' : ' '}`, { error: aadhaarNumberErr })} disabled={isSendedOtp} id="aadharCard" onChange={(e) => { handleChange(e, 'AADHAAR') }} required type="number" value={aadhaarNumber} />
                        <Label className="no-change label m-0" for="aadharCard"><FormattedMessage id="Aadhaar_Card_Number" /></Label>
                        {aadhaarNumberErr ? <p className="error-text">{aadhaarNumberErr}</p> : ''}
                      </FormGroup>
                      {isSendedOtp && (
                      <div>
                        <div className='disclaimer'><FormattedMessage id='Note_Please_enter_the_OTP_sent_to_your_number' /></div>
                        <FormGroup className="c-input">
                          <div className="fake-input" >
                            <Input autoComplete='off' autoFocus className={classNames({ 'hash-contain': otp, error: otpErr }, 'mt-3')} id="otp" onChange={(e) => { handleChange(e, 'OTP') }} type='number' value={otp} />
                            <Label className="label m-0" for="otp"><FormattedMessage id="OTP" /></Label>
                          </div>
                          <p className="error-text">{otpErr}</p>
                        </FormGroup>
                      </div>
                      )}
                      {!['P', 'A'].includes(kycDetails?.oAadhaar?.eStatus) && (
                      <Button
                        className="w-100 d-block"
                        color="primary"
                        disabled={(!aadhaarNumber)}
                        onClick={submitAadhaarCard}
                        type="submit"
                      >
                        <FormattedMessage id="Submit" />
                      </Button>
                      )}
                      {isSendedOtp && (
                      <div className="b-link">
                        { minutes === 0 && seconds === 0
                          ? <Button className='signup-text' color='link' onClick={sendOTP} title="Resend OTP"><FormattedMessage id="Resend_OTP" /></Button>
                          : (
                            <p className='timer'>
                              {minutes < 10 ? `0${minutes}` : minutes}
                              :
                              {seconds < 10 ? `0${seconds}` : seconds}
                            </p>
                            )
              }
                      </div>
                      )}
                    </Form>
                    )
                  : ''}
          </TabPane>
        </TabContent>
      </div>
    </>
  )
}

export default KycVerificationPage
