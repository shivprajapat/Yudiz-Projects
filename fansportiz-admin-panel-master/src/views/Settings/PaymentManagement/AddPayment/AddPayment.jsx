import React, { useState, useEffect, useRef } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, UncontrolledAlert, Form, FormGroup, Label, Input, CustomInput, InputGroupText
} from 'reactstrap'
import { NavLink, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loading from '../../../../components/Loading'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { getPaymentDetails, updatePayment } from '../../../../actions/payment'
import { verifyLength, isNumber, modalMessageFunc, alertClass } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'

function AddPayment (props) {
  const [Offer, setOffer] = useState('')
  const [Name, setName] = useState('')
  const [Key, setKey] = useState('')
  const [Order, setOrder] = useState('')
  const [errOffer] = useState('')
  const [errName, setErrName] = useState('')
  const [errOrder, setErrOrder] = useState('')
  const [PaymentImage, setPaymentImage] = useState('')
  const [errImage, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState(false)
  const [PaymentId, setPaymentId] = useState('')
  const [close, setClose] = useState(false)
  const [PaymentStatus, setPaymentStatus] = useState('N')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const PaymentDetails = useSelector(state => state.payment.PaymentDetails)
  const resStatus = useSelector(state => state.payment.resStatus)
  const resMessage = useSelector(state => state.payment.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, PaymentDetails }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const history = useHistory()
  const submitDisable = PaymentDetails && previousProps.PaymentDetails !== PaymentDetails && PaymentDetails.sImage === PaymentImage && PaymentDetails.sOffer === Offer && PaymentDetails.sName === Name && PaymentDetails.eKey === Key && PaymentDetails.nOrder === parseInt(Order) && (PaymentDetails.bEnable === (PaymentStatus === 'Y'))

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getPaymentDetails(match.params.id, token))
      setPaymentId(match.params.id)
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
          history.push(`${props.cancelLink}${page?.PaymentManagement || ''}`, { message: resMessage })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage, resStatus])

  useEffect(() => {
    if (previousProps.PaymentDetails !== PaymentDetails) {
      if (PaymentDetails) {
        setName(PaymentDetails.sName)
        setKey(PaymentDetails.eKey)
        setOffer(PaymentDetails.sOffer)
        setPaymentImage(PaymentDetails.sImage)
        setOrder(PaymentDetails.nOrder)
        setPaymentStatus(PaymentDetails.bEnable ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.PaymentDetails = PaymentDetails
    }
  }, [PaymentDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'Offer':
        setOffer(event.target.value)
        break
      case 'Order':
        if (event.target.value && !isNumber(event.target.value)) {
          setErrOrder('Should be a Number')
        } else {
          setErrOrder('')
        }
        setOrder(event.target.value)
        break
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPaymentImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Status':
        setPaymentStatus(event.target.value)
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
    if (verifyLength(Name, 1) && verifyLength(Key, 1) && !errOffer && !errName && !errOrder) {
      const updatePaymentData = {
        PaymentId, Offer, Name, Key, PaymentStatus: PaymentStatus === 'Y', Order, PaymentImage, token
      }
      dispatch(updatePayment(updatePaymentData))
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        setErrName('Required field')
      }
      if (!isNumber(Order)) {
        setErrOrder('Should be a Number')
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
        <h2>Edit Payment</h2>
        <Form>
          <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                  <img className='custom-img' src={PaymentImage ? PaymentImage.imageURL ? PaymentImage.imageURL : url + PaymentImage : documentPlaceholder} alt="themeImage" onError={onImageError} />
                </div>
              </div>
              {((Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION === 'W')) &&
              <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" label="Add Theme image" onChange={event => handleChange(event, 'Image')} />}
              <p className="error-text">{errImage}</p>
            </div>
          </FormGroup>
          <FormGroup>
          <Label for="Name">Name <span className="required-field">*</span></Label>
          <Input disabled={adminPermission?.PAYMENT_OPTION === 'R'} name="Link" placeholder="Enter Name" value={Name} onChange={event => handleChange(event, 'Name')} />
          <p className="error-text">{errName}</p>
          </FormGroup>
          <FormGroup>
          <Label for="Key">Key <span className="required-field">*</span></Label>
          <InputGroupText>{Key}</InputGroupText>
          </FormGroup>
          <FormGroup>
            <Label for="Offer">Offer</Label>
            <Input disabled={adminPermission?.PAYMENT_OPTION === 'R'} name="Offer" placeholder="Enter Offer" value={Offer} onChange={event => handleChange(event, 'Offer')} />
            <p className="error-text">{errOffer}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Order">Order</Label>
            <Input disabled={adminPermission?.PAYMENT_OPTION === 'R'} name="Order" placeholder="Enter Order" value={Order} onChange={event => handleChange(event, 'Order')} />
            <p className="error-text">{errOrder}</p>
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <div className="d-flex inline-input">
              <CustomInput disabled={adminPermission?.PAYMENT_OPTION === 'R'} type="radio" id="bannerRadio1" name="bannerRadio" label="Active" onClick={event => handleChange(event, 'Status')} value="Y" checked={PaymentStatus === 'Y'} />
              <CustomInput disabled={adminPermission?.PAYMENT_OPTION === 'R'} type="radio" id="bannerRadio2" name="bannerRadio" label="InActive" onClick={event => handleChange(event, 'Status')} value="N" checked={PaymentStatus !== 'Y'} />
            </div>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION !== 'R')) &&
            (
              <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onSubmit}>Save Changes</Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/payment-management${page?.PaymentManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddPayment.defaultProps = {
  history: {}
}

AddPayment.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object,
  cancelLink: PropTypes.string
}
export default connect()(AddPayment)
