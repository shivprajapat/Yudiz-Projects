import React, { useState, useEffect, useRef, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, CustomInput, UncontrolledAlert
} from 'reactstrap'
import { NavLink, useHistory } from 'react-router-dom'
import DecoupledEditor from 'ckeditor5-custom-build/build/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react'
import { alertClass, isNumber, modalMessageFunc, verifyLength, withoutSpace } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import { addCMS, getCMSDetails, getCMSList, updateCMS } from '../../../../actions/cms'
import PropTypes from 'prop-types'

function AddContentForm (props) {
  const { match } = props
  const history = useHistory()
  const [Slug, setSlug] = useState('')
  const [Title, setTitle] = useState('')
  const [Description, setDescription] = useState('')
  const [priority, setPriority] = useState(1)
  const [Details, setDetails] = useState('')
  const [Category, setCategory] = useState('')
  const [contentStatus, setContentStatus] = useState('N')
  const [errTitle, seterrTitle] = useState('')
  const [errSlug, seterrSlug] = useState('')
  const [errDetails, seterrDetails] = useState('')
  const [errPriority, setErrPriority] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [cmsId, setcmsId] = useState('')
  const [close, setClose] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const dispatch = useDispatch()
  const cmsList = useSelector(state => state.cms.cmsList)
  const token = useSelector(state => state.auth.token)
  const cmsDetails = useSelector(state => state.cms.cmsDetails)
  const resStatus = useSelector(state => state.cms.resStatus)
  const resMessage = useSelector(state => state.cms.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const previousProps = useRef({ resStatus, resMessage, cmsDetails }).current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = cmsDetails && previousProps.cmsDetails !== cmsDetails && cmsDetails.sTitle === Title && cmsDetails.sContent === Details && cmsDetails.sSlug === Slug && cmsDetails.sDescription === Description && cmsDetails.eStatus === contentStatus && cmsDetails.nPriority === parseInt(priority) && cmsDetails.sCategory === Category

  useEffect(() => {
    if (match.params.slug) {
      dispatch(getCMSDetails(match.params.slug, token))
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getCMSList('', token))
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
          history.push('/settings/content-management', { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
            setLoading(true)
          }
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.cmsDetails !== cmsDetails) {
      if (cmsDetails && Object.keys(cmsDetails).length !== 0) {
        setcmsId(cmsDetails._id)
        setSlug(cmsDetails.sSlug)
        setTitle(cmsDetails.sTitle)
        setDescription(cmsDetails.sDescription)
        setPriority(cmsDetails.nPriority)
        setDetails(cmsDetails.sContent)
        setCategory(cmsDetails.sCategory)
        setContentStatus(cmsDetails.eStatus)
        setLoading(false)
        if (previousProps?.cmsDetails?.sSlug !== cmsDetails?.sSlug) {
          history.replace(`/settings/content-details/${cmsDetails?.sSlug}`)
        }
      }
    }
    return () => {
      previousProps.cmsDetails = cmsDetails
    }
  }, [cmsDetails])

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(Slug, 1) && verifyLength(Title, 1) && verifyLength(Details, 1) && !errPriority && !errDetails && !errSlug && !errTitle) {
      if (isCreate) {
        const addDataCMS = {
          Category, Slug, Title, Description, priority, contentStatus, Details, token
        }
        dispatch(addCMS(addDataCMS))
      } else {
        const updateDataCMS = {
          Category, cmsId, Slug, Title, Description, priority, contentStatus, Details, token
        }
        dispatch(updateCMS(updateDataCMS))
      }
      setLoading(true)
    } else {
      if (!verifyLength(Slug, 1)) {
        seterrSlug('Required field')
      }
      if (!verifyLength(Title, 1)) {
        seterrTitle('Required field')
      }
      if (!verifyLength(Details, 1)) {
        seterrDetails('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Slug':
        if (verifyLength(event.target.value, 1)) {
          if (withoutSpace(event.target.value)) {
            seterrSlug('No space')
          } else {
            seterrSlug('')
          }
        } else {
          seterrSlug('Required field')
        }
        setSlug(event.target.value)
        break
      case 'Title':
        if (verifyLength(event.target.value, 1)) {
          seterrTitle('')
        } else {
          seterrTitle('Required field')
        }
        setTitle(event.target.value)
        break
      case 'Category':
        setCategory(event.target.value)
        break
      case 'description':
        setDescription(event.target.value)
        break
      case 'Priority':
        if (isNumber(event.target.value) || (!event.target.value)) {
          if (isNumber(event.target.value)) {
            setErrPriority('')
          } else if (!event.target.value) {
            setErrPriority('Required field')
          }
          cmsList && cmsList.map((list) => (list.nPriority === parseInt(event.target.value) && list.sSlug !== Slug) ? setErrPriority('Priority is already exist') : setPriority(event.target.value))
        }
        break
      case 'Status':
        setContentStatus(event.target.value)
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
        <h2>
          {isCreate ? 'Add Content' : !isEdit ? 'Edit Content' : 'View Details'}
        </h2>
        <Form>
         <FormGroup>
            <Label for="slug">Slug <span className="required-field">*</span></Label>
            <Input autoComplete='off' disabled={adminPermission?.CMS === 'R'} name="slug" placeholder="Slug" value={Slug} onChange={event => handleChange(event, 'Slug')} />
            <p className="error-text">{errSlug}</p>
         </FormGroup>
         <FormGroup>
            <Label for="category">Category</Label>
            <Input autoComplete='off' disabled={adminPermission?.CMS === 'R'} name="category" placeholder="Category" value={Category} onChange={event => handleChange(event, 'Category')} />
         </FormGroup>
          <FormGroup>
            <Label for="title">Title <span className="required-field">*</span></Label>
            <Input autoComplete='off' disabled={adminPermission?.CMS === 'R'} name="title" placeholder="Title" value={Title} onChange={event => handleChange(event, 'Title')} />
            <p className="error-text">{errTitle}</p>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input autoComplete='off' disabled={adminPermission?.CMS === 'R'} name="description" placeholder="Description" value={Description} onChange={event => handleChange(event, 'description')} />
          </FormGroup>
          <FormGroup>
              <Label for="priority">Priority <span className="required-field">*</span></Label>
              <Input autoComplete='off' type='number' disabled={adminPermission?.CMS === 'R'} name="title" placeholder="Priority" value={priority} onChange={event => handleChange(event, 'Priority')} />
              <p className="error-text">{errPriority}</p>
          </FormGroup>
          <FormGroup>
                <Label for="status">Status</Label>
                <div className="d-flex inline-input">
                  <CustomInput disabled={adminPermission?.CMS === 'R'} type="radio" id="contentRadio1" name="contentRadio" label="Active" onClick={event => handleChange(event, 'Status')} value="Y" checked={contentStatus === 'Y'} />
                  <CustomInput disabled={adminPermission?.CMS === 'R'} type="radio" id="contentRadio2" name="contentRadio" label="InActive" onClick={event => handleChange(event, 'Status')} value="N" checked={contentStatus !== 'Y'} />
                </div>
          </FormGroup>
          <FormGroup>
          <Label for="status">Content <span className="required-field">*</span></Label>
          <CKEditor
            onInit={(editor) => {
              editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement())
            }}
            config={{
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
            disabled={adminPermission?.CMS === 'R'}
          />
          <p className="error-text">{errDetails}</p>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.CMS !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" onClick={onSubmit} disabled={submitDisable}>
                  {isCreate ? 'Add Content' : !isEdit ? 'Save Changes' : 'Edit Content'}
                </Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/content-management${page?.ContentManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddContentForm.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object
}

export default connect()(AddContentForm)
