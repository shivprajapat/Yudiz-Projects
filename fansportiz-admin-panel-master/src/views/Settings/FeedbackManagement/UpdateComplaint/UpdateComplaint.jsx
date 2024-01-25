import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FormGroup, Input, Label, Button, UncontrolledAlert, InputGroupText, CustomInput
} from 'reactstrap'
import moment from 'moment'
import { alertClass, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import PropTypes from 'prop-types'
import { getFeedbackDetails, updateFeedbackStatus } from '../../../../actions/feedback'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { getUrl } from '../../../../actions/url'
import { NavLink } from 'react-router-dom'

function UpdateComplaint (props) {
  const [username, setUsername] = useState('')
  const [title, setTitle] = useState('')
  const [complainStatus, setComplainStatus] = useState('')
  const [type, setType] = useState('')
  const [comment, setComment] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [errComment, setErrComment] = useState('')
  const [loading, setLoading] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [id, setId] = useState('')
  const [close, setClose] = useState(false)
  const [url, setUrl] = useState('')

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const feedbackDetails = useSelector(state => state.feedback.feedbackDetails)
  const resMessage = useSelector(state => state.feedback.resMessage)
  const resStatus = useSelector(state => state.feedback.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resMessage, feedbackDetails, resStatus }).current
  const [modalMessage, setModalMessage] = useState(false)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const submitDisable = feedbackDetails && previousProps.feedbackDetails !== feedbackDetails && feedbackDetails.eStatus === complainStatus && feedbackDetails.sComment === comment

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getFeedbackDetails(match.params.id, token))
      setId(match.params.id)
      setLoading(true)
      dispatch(getUrl('media'))
    }
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
        setLoading(false)
        if (resStatus) {
          props.history.push('/settings/feedback-complaint-management', { message: resMessage })
        }
        setModalMessage(true)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage])

  useEffect(() => {
    if (previousProps.feedbackDetails !== feedbackDetails) {
      if (feedbackDetails) {
        setUsername(feedbackDetails.iUserId && feedbackDetails.iUserId.sUsername ? feedbackDetails.iUserId.sUsername : '--')
        setTitle(feedbackDetails.sTitle)
        setDescription(feedbackDetails.sDescription)
        setComplainStatus(feedbackDetails.eStatus)
        setType(feedbackDetails.eType)
        setComment(feedbackDetails.sComment)
        setImage(feedbackDetails.sImage)
        setDate(moment(feedbackDetails.dCreatedAt).format('DD/MM/YYYY hh:mm A'))
        setLoading(false)
      }
    }
    return () => {
      previousProps.feedbackDetails = feedbackDetails
    }
  }, [feedbackDetails])

  function handleChange (event, Type) {
    switch (Type) {
      case 'Comment':
        if (verifyLength(event.target.value, 1)) {
          setErrComment('')
        } else {
          setErrComment('Required field')
        }
        setComment(event.target.value)
        break
      case 'Status':
        setComplainStatus(event.target.value)
        break
      default:
        break
    }
  }

  function onEdit (e) {
    e.preventDefault()
    let verify
    if (complainStatus === 'D') {
      verify = complainStatus && comment
    } else {
      verify = complainStatus
    }
    if (verify) {
      const data = {
        complainStatus, comment, type, id, token
      }
      dispatch(updateFeedbackStatus(data))
    } else {
      if (complainStatus === 'D' && !comment) {
        setErrComment('Required field')
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
        <h2>{type === 'C' ? 'Update Complaint Status' : 'Update Feedback Status'}</h2>
        <FormGroup>
          <div className="theme-image text-center">
            <div className="d-flex theme-photo">
              <div className="theme-img">
                <img className='custom-img' src={image && url ? url + image : documentPlaceholder} alt="themeImage" />
              </div>
            </div>
          </div>
          </FormGroup>
            <FormGroup>
              <Label for="Name">Username</Label>
              <InputGroupText>{username}</InputGroupText>
            </FormGroup>

            <FormGroup>
              <Label for="title">Title</Label>
              <InputGroupText>{title}</InputGroupText>
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" className='read-only-class' disabled value={description}></Input>
            </FormGroup>

            <FormGroup>
              <Label for="date">Date</Label>
              <InputGroupText>{date}</InputGroupText>
            </FormGroup>

            <FormGroup>
              <Label for="status">Status</Label>
              <CustomInput disabled={adminPermission?.COMPLAINT === 'R'} type="select" name="status" className="form-control" value={complainStatus} onChange={event => handleChange(event, 'Status')}>
                <option value='P'>Pending</option>
                <option value='I'>In-Progress</option>
                <option value='D'>Declined</option>
                <option value='R'>Resolved</option>
              </CustomInput>
            </FormGroup>

            {complainStatus === 'D' && <FormGroup>
              <Label for="comment">Comment <span className="required-field">*</span></Label>
              <Input name='comment' value={comment} onChange={(e) => handleChange(e, 'Comment')}></Input>
              <p className='error-text'>{errComment}</p>
            </FormGroup>}

            {
              ((Auth && Auth === 'SUPER') || (adminPermission?.COMPLAINT !== 'R')) &&
              (
                <Fragment>
                  <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onEdit}>Save Changes</Button>
                </Fragment>
              )
            }

          <div className="form-footer text-center small-text">
            <NavLink to={`/settings/feedback-complaint-management${page?.FeedbackManagement || ''}`}>Cancel</NavLink>
          </div>
      </section>
    </main>
  )
}

UpdateComplaint.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object
}

export default UpdateComplaint
