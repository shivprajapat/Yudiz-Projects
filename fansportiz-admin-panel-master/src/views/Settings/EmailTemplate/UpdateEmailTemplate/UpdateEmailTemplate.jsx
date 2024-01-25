import React, { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getEmailTemplateDetails, imageUpload, updateEmailTemplate } from '../../../../actions/users'
import { NavLink } from 'react-router-dom'
import { Button, CustomInput, Form, FormGroup, Input, InputGroupText, Label, UncontrolledAlert } from 'reactstrap'
import { alertClass, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react'

function UpdateEmailTemplate (props) {
  const { match } = props
  const [Slug, setSlug] = useState('')
  const [Title, setTitle] = useState('')
  const [Content, setContent] = useState('')
  const [Subject, setSubject] = useState('')
  const [Description, setDescription] = useState('')
  const [EmailStatus, setEmailStatus] = useState('Y')
  const [errTitle, setErrTitle] = useState('')
  const [errContent, setErrContent] = useState('')
  const [errSubject, setErrSubject] = useState('')
  const [errDescription, setErrDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [emailTemplateID, setEmailTemplateID] = useState('')
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const EmailTemplateDetails = useSelector(state => state.users.EmailTemplateDetails)
  const resStatus = useSelector(state => state.users.resStatus)
  const resMessage = useSelector(state => state.users.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, EmailTemplateDetails }).current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = EmailTemplateDetails && previousProps.EmailTemplateDetails !== EmailTemplateDetails && EmailTemplateDetails.sTitle === Title && EmailTemplateDetails.sSubject === Subject && EmailTemplateDetails.sDescription === Description && EmailTemplateDetails.eStatus === EmailStatus && EmailTemplateDetails.sContent === Content

  useEffect(() => {
    if (match?.params?.slug) {
      dispatch(getEmailTemplateDetails(match.params.slug, token))
      setLoading(true)
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
        if (resStatus) {
          props.history.push('/settings/email-template', { message: resMessage })
        }
        setModalMessage(resMessage)
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
      previousProps.resStatus = resStatus
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.EmailTemplateDetails !== EmailTemplateDetails || (!resStatus && resMessage)) {
      if (EmailTemplateDetails || (!resStatus && resMessage)) {
        setEmailTemplateID(EmailTemplateDetails._id)
        setSlug(EmailTemplateDetails.sSlug)
        setTitle(EmailTemplateDetails.sTitle)
        setSubject(EmailTemplateDetails.sSubject)
        setDescription(EmailTemplateDetails.sDescription)
        setContent(EmailTemplateDetails.sContent)
        setEmailStatus(EmailTemplateDetails.eStatus)
        setLoading(false)
      }
    }
    return () => {
      previousProps.EmailTemplateDetails = EmailTemplateDetails
    }
  }, [EmailTemplateDetails, resStatus, resMessage])

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(Title, 1) && verifyLength(Content, 1) && verifyLength(Subject, 1) && verifyLength(Description, 1) && !errDescription && !errSubject && !errContent && !errTitle) {
      const updateEmailTemplateData = {
        Slug, Title, Description, Content: changeTag(Content), Subject, EmailStatus, ID: emailTemplateID, token
      }
      dispatch(updateEmailTemplate(updateEmailTemplateData))
      setLoading(true)
    } else {
      if (!verifyLength(Title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(Content, 1)) {
        setErrContent('Required field')
      }
      if (!verifyLength(Subject, 1)) {
        setErrSubject('Required field')
      }
      if (!verifyLength(Description, 1)) {
        setErrDescription('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Title':
        if (verifyLength(event.target.value, 1)) {
          setErrTitle('')
        } else {
          setErrTitle('Required field')
        }
        setTitle(event.target.value)
        break
      case 'Subject':
        if (verifyLength(event.target.value, 1)) {
          setErrSubject('')
        } else {
          setErrSubject('Required field')
        }
        setSubject(event.target.value)
        break
      case 'Description':
        if (verifyLength(event.target.value, 1)) {
          setErrDescription('')
        } else {
          setErrDescription('Required field')
        }
        setDescription(event.target.value)
        break
      case 'Status':
        setEmailStatus(event.target.value)
        break
      default:
        break
    }
  }

  function onEditorChange (evt, editor) {
    if (verifyLength(editor.getData(), 1)) {
      setErrContent('')
    } else {
      setErrContent('Required field')
    }
    setContent(editor.getData())
  }

  // below 3 functions are to add image in CKEditor
  function uploadAdapter (loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then(async (file) => {
            const data = await dispatch(imageUpload(file, token))
            resolve({ default: 'https://yudiz-fantasy-media.s3.ap-south-1.amazonaws.com/' + data })
          })
        })
      }
    }
  }

  function uploadPlugin (editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader)
    }
  }

  function changeTag (html) {
    const div = document.createElement('div')
    div.innerHTML = html
    const figure = div.getElementsByTagName('figure')
    const firstImage = div.getElementsByTagName('img')
    const otp = div.getElementsByTagName('span')[0]
    otp && (otp.style = 'text-align: center; padding: 10px; border-radius: 10%;')
    for (let index = 0; index < figure.length; index++) {
      const figureWidth = figure[index].style.width
      firstImage[index].style.width = figureWidth
      if (figure[index].classList.contains('image-style-align-left')) {
        figure[index].style = 'width:95%; text-align: left;'
      } else if (figure[index].classList.contains('image-style-align-center')) {
        figure[index].style = 'width:95%; text-align: center;'
      } else if (figure[index].classList.contains('image-style-align-right')) {
        figure[index].style = 'width:95%; text-align: right;'
      } else {
        figure[index].style = 'width:95%'
      }
    }
    return div.innerHTML
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
        <h2>Edit Email Template</h2>
        <Form>
          <FormGroup>
            <h3 style={{ color: 'red' }}>Notes: </h3>
            <p><b>{'{{username}}'}</b> will be replaced with Users Username</p>
            <p><b>{'{{firstName}}'}</b> will be replaced with Users Firstname</p>
            <p><b>{'{{lastName}}'}</b> will be replaced with Users Lastname</p>
            <p><b>{'{{otp}}'}</b> will be replaced with actual OTP</p>
            <p><b>{'{{email}}'}</b> will be replaced with Users Email ID</p>

          </FormGroup>
        </Form>
        <Form>
          <FormGroup>
            <Label for='slug'>Slug</Label>
            <InputGroupText>{Slug}</InputGroupText>
          </FormGroup>
          <FormGroup>
            <Label for="title">Title <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} name="title" placeholder="Title" value={Title} onChange={event => handleChange(event, 'Title')} />
            <p className="error-text">{errTitle}</p>
          </FormGroup>
          <FormGroup>
            <Label for="subject">Subject <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} name="subject" placeholder="Subject" value={Subject} onChange={event => handleChange(event, 'Subject')} />
            <p className="error-text">{errSubject}</p>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} name="description" placeholder="Description" value={Description} onChange={event => handleChange(event, 'Description')} />
            <p className="error-text">{errDescription}</p>
          </FormGroup>
          <FormGroup>
          <Label for="content">Content <span className="required-field">*</span></Label>
           <CKEditor
            onInit={(editor) => {
              editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement())
            }}
            editor={Editor}
            data={Content}
            config={{
              extraPlugins: [uploadPlugin],
              image: {
                resizeUnit: 'px',
                resize: true,
                toolbar: [
                  {
                    name: 'imageStyle:customDropdown',
                    title: 'Custom drop-down title',
                    items: ['imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight'],
                    defaultItem: 'imageStyle:alignLeft'
                  }
                ]
              },
              placeholder: 'Enter content',
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
                  'imageResize',
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
            onChange={onEditorChange}
            disabled={adminPermission?.EMAIL_TEMPLATES === 'R'}
          />
          <p className="error-text">{errContent}</p>
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <div className="d-flex inline-input">
              <CustomInput disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} type="radio" id="Radio1" name="Radio" label="Active" onChange={event => handleChange(event, 'Status')} value="Y" checked={EmailStatus === 'Y'} />
              <CustomInput disabled={adminPermission?.EMAIL_TEMPLATES === 'R'} type="radio" id="Radio2" name="Radio" label="InActive" onChange={event => handleChange(event, 'Status')} value="N" checked={EmailStatus !== 'Y'} />
            </div>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.EMAIL_TEMPLATES !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onSubmit}>
                 Save Changes
                </Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={'/settings/email-template'}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

UpdateEmailTemplate.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default UpdateEmailTemplate
