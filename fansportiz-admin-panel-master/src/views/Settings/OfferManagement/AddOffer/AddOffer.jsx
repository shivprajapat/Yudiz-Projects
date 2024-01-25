import React, { useState, useEffect, useRef, Fragment } from 'react'
import {
  FormGroup, Input, Label, Button, CustomInput, Form, UncontrolledAlert
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import DecoupledEditor from 'ckeditor5-custom-build/build/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { alertClass, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import { addOffer, getOfferDetails, updateOffer } from '../../../../actions/offers'
import { getUrl } from '../../../../actions/url'
import PropTypes from 'prop-types'
import removeImg from '../../../../assets/images/remove_img.svg'

function AddOffer (props) {
  const { match } = props
  const [Title, setTitle] = useState('')
  const [Description, setDescription] = useState('')
  const [Details, setDetails] = useState('')
  const [offerImage, setOfferImage] = useState('')
  const [Active, setActive] = useState('N')
  const [url, setUrl] = useState('')
  const [errTitle, setErrTitle] = useState('')
  const [errDescription, seterrDescription] = useState('')
  const [errDetails, seterrDetails] = useState('')
  const [errImage, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [offerId, setofferId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [close, setClose] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const offerDetails = useSelector(state => state.offers.offerDetails)
  const resStatus = useSelector(state => state.offers.resStatus)
  const resMessage = useSelector(state => state.offers.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, offerDetails }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = offerDetails && previousProps.offerDetails !== offerDetails && offerDetails.sTitle === Title && offerDetails.sDetail === Details && offerDetails.sImage === offerImage && offerDetails.sDescription === Description && offerDetails.eStatus === Active

  useEffect(() => {
    if (match.params.id) {
      dispatch(getOfferDetails(match.params.id, token))
      setofferId(match.params.id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          props.history.push('/settings/offer-management', { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
            dispatch(getOfferDetails(match.params.id, token))
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
    if (previousProps.offerDetails !== offerDetails) {
      if (offerDetails) {
        setTitle(offerDetails.sTitle)
        setDetails(offerDetails.sDetail)
        setOfferImage(offerDetails.sImage)
        setDescription(offerDetails.sDescription)
        setActive(offerDetails.eStatus)
        setLoading(false)
      }
    }
    return () => {
      previousProps.offerDetails = offerDetails
    }
  }, [offerDetails])

  // to handle image error occurred during add time
  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setOfferImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Status':
        setActive(event.target.value)
        break
      case 'Title':
        if (verifyLength(event.target.value, 1)) {
          setErrTitle('')
        } else {
          setErrTitle('Required field')
        }
        setTitle(event.target.value)
        break
      case 'Description':
        if (verifyLength(event.target.value, 1)) {
          seterrDescription('')
        } else {
          seterrDescription('Required field')
        }
        setDescription(event.target.value)
        break
      case 'RemoveImage':
        setOfferImage('')
        break
      default:
        break
    }
  }

  function onEditorChange (evt, editor) {
    if (verifyLength(editor.getData(), 1)) {
      seterrDetails('')
    } else {
      seterrDetails('Required field')
    }
    setDetails(editor.getData())
  }

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(Title, 1) && verifyLength(Description, 1) && Details && !errDescription && !errTitle && !errDetails) {
      if (isCreate) {
        const addOfferData = {
          Title, Details, Description, Active, offerImage, token
        }
        dispatch(addOffer(addOfferData))
      } else {
        const updateOfferData = {
          Title, Details, Description, Active, offerImage
        }
        dispatch(updateOffer(updateOfferData, offerId, token))
      }
      setLoading(true)
    } else {
      if (!verifyLength(Title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(Description, 1)) {
        seterrDescription('Required field')
      }
      if (!Details) {
        seterrDetails('Required field')
      }
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
        <h2>{isCreate ? 'Add Offer' : 'Edit Offer'}</h2>
        <Form>
          <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                  <img className='custom-img' src={offerImage ? offerImage.imageURL ? offerImage.imageURL : url + offerImage : documentPlaceholder} alt="themeImage" onError={onImageError} />
                  {offerImage && ((Auth && Auth === 'SUPER') || (adminPermission?.OFFER === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                </div>
              </div>
              {((Auth && Auth === 'SUPER') || (adminPermission?.OFFER === 'W')) && <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" label="Add offer image" onChange={event => handleChange(event, 'Image')} />}
              <p className="error-text">{errImage}</p>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="titleName">Title <span className="required-field">*</span></Label>
            <Input
              disabled={adminPermission?.OFFER === 'R'}
              type="text"
              id="titleName"
              placeholder="Enter Title"
              value={Title}
              onChange={event => handleChange(event, 'Title')}
            />
            <p className="error-text">{errTitle}</p>
          </FormGroup>
          <FormGroup>
            <Label for="shortDescription">Short Description <span className="required-field">*</span></Label>
            <Input
              type="text"
              disabled={adminPermission?.OFFER === 'R'}
              id="shortDescription"
              placeholder="Enter Description"
              value={Description}
              onChange={event => handleChange(event, 'Description')}
            />
            <p className="error-text">{errDescription}</p>
          </FormGroup>
          <FormGroup>
            <Label for="ActiveOffer">Status</Label>
            <div className="d-flex inline-input">
              <CustomInput
                type="radio"
                disabled={adminPermission?.OFFER === 'R'}
                id="themeRadio1"
                name="themeRadio"
                label="Active"
                onClick={event => handleChange(event, 'Status')}
                checked={Active === 'Y'}
                value="Y"
              />
              <CustomInput
                type="radio"
                disabled={adminPermission?.OFFER === 'R'}
                id="themeRadio2"
                name="themeRadio"
                label="InActive"
                onClick={event => handleChange(event, 'Status')}
                checked={Active !== 'Y'}
                value="N"
              />
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="OfferDetails">Details <span className="required-field">*</span></Label>
            <CKEditor
              onInit={(editor) => {
                editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement())
              }}
              config={{
                placeholder: 'Enter Details',
                toolbar: {
                  items: [
                    'heading',
                    '|',
                    'fontSize',
                    'fontFamily',
                    '|',
                    'fontColor',
                    'fontBackgroundColor',
                    '|',
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    '|',
                    'alignment',
                    '|',
                    'numberedList',
                    'bulletedList',
                    '|',
                    'outdent',
                    'indent',
                    '|',
                    'todoList',
                    'imageUpload',
                    'link',
                    'blockQuote',
                    'insertTable',
                    'mediaEmbed',
                    '|',
                    'undo',
                    'redo',
                    'imageInsert',
                    '|'
                  ]
                }
              }}
              editor={DecoupledEditor}
              data={Details}
              onChange={onEditorChange}
              disabled={adminPermission?.OFFER === 'R'}
            />
            <p className="error-text">{errDetails}</p>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.OFFER !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" onClick={onSubmit} disabled={(!Title || !Details || !Description) || submitDisable}>
                  {isCreate ? 'Add Offer' : !isEdit ? 'Save Changes' : 'Edit Offer'}
                </Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/offer-management${page?.OfferManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddOffer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object
}

export default AddOffer
