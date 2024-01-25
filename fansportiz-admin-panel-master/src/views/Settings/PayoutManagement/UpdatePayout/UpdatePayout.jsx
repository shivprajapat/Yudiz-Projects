import React, { useState, useEffect, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, UncontrolledAlert, Form, FormGroup, Label, Input, CustomInput, InputGroupText
} from 'reactstrap'
import { NavLink, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loading from '../../../../components/Loading'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { alertClass, isNumber, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getPayoutDetails, updatePayout } from '../../../../actions/payout'

function UpdatePayoutComponent (props) {
  const [title, setTitle] = useState('')
  const [withdrawFee, setWithdrawFee] = useState(0)
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [minAmountErr, setMinAmountErr] = useState('')
  const [maxAmountErr, setMaxAmountErr] = useState('')
  const [key, setKey] = useState('')
  const [type, setType] = useState('')
  const [info, setInfo] = useState('')
  const [titleErr, setTitleErr] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [payoutImage, setPayoutImage] = useState('')
  const [imageErr, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState(false)
  const [payoutId, setPayoutId] = useState('')
  const [close, setClose] = useState(false)
  const [payoutStatus, setPayoutStatus] = useState('N')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const payoutDetails = useSelector(state => state.payout.payoutDetails)
  const resStatus = useSelector(state => state.payout.resStatus)
  const resMessage = useSelector(state => state.payout.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, payoutDetails }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const history = useHistory()
  const submitDisable = payoutDetails && previousProps.payoutDetails !== payoutDetails && payoutDetails.sImage === payoutImage && payoutDetails.eType === type && payoutDetails.sTitle === title && (payoutDetails.bEnable === (payoutStatus === 'Y')) && payoutDetails.sInfo === info && (payoutDetails.nWithdrawFee === parseInt(withdrawFee)) && (payoutDetails.nMinAmount === parseInt(minAmount)) && (payoutDetails.nMaxAmount === parseInt(maxAmount))

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getPayoutDetails(match.params.id, token))
      setPayoutId(match.params.id)
      setLoading(true)
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          history.push(`${props.cancelLink}${page?.PayoutManagement || ''}`, { message: resMessage })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage, resStatus])

  useEffect(() => {
    if (previousProps.payoutDetails !== payoutDetails) {
      if (payoutDetails) {
        setTitle(payoutDetails.sTitle)
        setType(payoutDetails.eType)
        setKey(payoutDetails.eKey)
        setWithdrawFee(payoutDetails.nWithdrawFee || 0)
        setMinAmount(payoutDetails.nMinAmount || 0)
        setMaxAmount(payoutDetails.nMaxAmount || 0)
        setPayoutImage(payoutDetails.sImage)
        setInfo(payoutDetails.sInfo)
        setPayoutStatus(payoutDetails.bEnable ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.payoutDetails = payoutDetails
    }
  }, [payoutDetails])

  function handleChange (event, field) {
    switch (field) {
      case 'Title':
        if (verifyLength(event.target.value, 1)) {
          setTitleErr('')
        } else {
          setTitleErr('Required field')
        }
        setTitle(event.target.value)
        break
      case 'Type':
        if (verifyLength(event.target.value, 1)) {
          setTypeErr('')
        } else {
          setTypeErr('Required field')
        }
        setType(event.target.value)
        break
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPayoutImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Info':
        setInfo(event.target.value)
        break
      case 'Status':
        setPayoutStatus(event.target.value)
        break
      case 'MinAmount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (parseInt(maxAmount) && parseInt(event.target.value) > parseInt(maxAmount)) {
            setMinAmountErr('Rank From value should be less than Rank To value')
          } else {
            setMaxAmountErr('')
            setMinAmountErr('')
          }
          setMinAmount(event.target.value)
        }
        break
      case 'MaxAmount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (parseInt(minAmount) > parseInt(event.target.value)) {
            setMaxAmountErr('Max value must be greater than Min value')
          } else {
            setMaxAmountErr('')
            setMinAmountErr('')
          }
          setMaxAmount(event.target.value)
        }
        break
      case 'WithdrawFee':
        if (isNumber(event.target.value) || !event.target.value) {
          setWithdrawFee(event.target.value)
        }
        break
      default:
        break
    }
  }

  function onImageError (ev) {
    ev.target.src = documentPlaceholder
  }

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(title, 1) && (withdrawFee >= 0) && (minAmount >= 0) && (maxAmount >= 0) && type && !titleErr && !typeErr) {
      const updatePayoutData = {
        type, key, minAmount: parseInt(minAmount), maxAmount: parseInt(maxAmount), withdrawFee: parseInt(withdrawFee), payoutStatus: payoutStatus === 'Y', title, info, payoutImage, payoutId, token
      }
      dispatch(updatePayout(updatePayoutData))
      setLoading(true)
    } else {
      if (!type) {
        setTypeErr('Required field')
      }
      if (!verifyLength(title, 1)) {
        setTitleErr('Required field')
      }
    }
  }

  return (
    <main className="main-content">
      {
        modalMessage && message &&
        (
        <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      {loading && <Loading />}
      <section className="common-form-block">
        <h2>Edit Payout</h2>
        <Form>
          <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                  <img className='custom-img' src={payoutImage ? payoutImage.imageURL ? payoutImage.imageURL : url + payoutImage : documentPlaceholder} alt="themeImage" onError={onImageError} />
                </div>
              </div>
              {((Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION === 'W')) &&
              <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" label="Add Theme image" onChange={event => handleChange(event, 'Image')} />}
              <p className="error-text">{imageErr}</p>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="Type">Type <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.PAYOUT_OPTION === 'R'} type="select" name="type" className="form-control" value={type} onChange={event => handleChange(event, 'Type')}>
              <option value="">Select type</option>
              <option value="STD">STD</option>
              <option value='INSTANT'>INSTANT</option>
            </CustomInput>
            <p className="error-text">{typeErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="title">Title <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.PAYOUT_OPTION === 'R'} name="title" placeholder="Enter Title" value={title} onChange={event => handleChange(event, 'Title')} />
            <p className="error-text">{titleErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Key">Key</Label>
            <InputGroupText>{key}</InputGroupText>
          </FormGroup>
          <FormGroup>
            <Label for="WithdrawFee">Withdraw Fee</Label>
            <Input disabled={adminPermission?.PAYOUT_OPTION === 'R'} type='number' name="WithdrawFee" placeholder="Enter Withdraw Fee" value={withdrawFee} onChange={event => handleChange(event, 'WithdrawFee')} />
          </FormGroup>
          <FormGroup>
            <Label for="MinAmount">Min Amount</Label>
            <Input disabled={adminPermission?.PAYOUT_OPTION === 'R'} type='number' name="MinAmount" placeholder="Enter Min Amount" value={minAmount} onChange={event => handleChange(event, 'MinAmount')} />
            <p className="error-text">{minAmountErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="MaxAmount">Max Amount</Label>
            <Input disabled={adminPermission?.PAYOUT_OPTION === 'R'} type='number' name="MaxAmount" placeholder="Enter Max Amount" value={maxAmount} onChange={event => handleChange(event, 'MaxAmount')} />
            <p className="error-text">{maxAmountErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Info">Info</Label>
            <Input disabled={adminPermission?.PAYOUT_OPTION === 'R'} name="Info" placeholder="Enter Info" value={info} onChange={event => handleChange(event, 'Info')} />
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <div className="d-flex inline-input">
              <CustomInput disabled={adminPermission?.PAYOUT_OPTION === 'R'} type="radio" id="payoutRadio1" name="payoutRadio" label="Active" onClick={event => handleChange(event, 'Status')} value="Y" checked={payoutStatus === 'Y'} />
              <CustomInput disabled={adminPermission?.PAYOUT_OPTION === 'R'} type="radio" id="payoutRadio2" name="payoutRadio" label="InActive" onClick={event => handleChange(event, 'Status')} value="N" checked={payoutStatus !== 'Y'} />
            </div>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION !== 'R')) &&
            (
              <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onSubmit}>Save Changes</Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/payout-management${page?.PayoutManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

UpdatePayoutComponent.propTypes = {
  match: PropTypes.object,
  cancelLink: PropTypes.string
}
export default connect()(UpdatePayoutComponent)
