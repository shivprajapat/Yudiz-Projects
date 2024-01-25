import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, UncontrolledAlert
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import {
  alertClass,
  modalMessageFunc,
  verifyLength
} from '../../../helpers/helper'
import Loading from '../../../components/Loading'
import PropTypes from 'prop-types'

function AddFilterCategory (props) {
  const {
    cancelLink, AddNewLeagueCategory, UpdateLeagueCategory, FilterCategoryDetails
  } = props

  const [Title, setTitle] = useState('')
  const [Remark, setRemark] = useState('')
  const [errTitle, seterrTitle] = useState('')
  const [errRemark, seterrRemark] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const resStatus = useSelector(state => state.leaguecategory.resStatus)
  const resMessage = useSelector(state => state.leaguecategory.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const previousProps = useRef({ resStatus, resMessage, FilterCategoryDetails }).current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = FilterCategoryDetails && previousProps.FilterCategoryDetails !== FilterCategoryDetails && FilterCategoryDetails.sTitle === Title && FilterCategoryDetails.sRemark === Remark

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
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
        if (resStatus && isCreate) {
          props.history.push(`${props.cancelLink}`, { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
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

  // use effect to set filter category details
  useEffect(() => {
    if (previousProps.FilterCategoryDetails !== FilterCategoryDetails) {
      if (FilterCategoryDetails) {
        setTitle(FilterCategoryDetails.sTitle ? FilterCategoryDetails.sTitle : '')
        setRemark(FilterCategoryDetails.sRemark ? FilterCategoryDetails.sRemark : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.FilterCategoryDetails = FilterCategoryDetails
    }
  }, [FilterCategoryDetails])

  // handleChange function to handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Remark':
        if (verifyLength(event.target.value, 1)) {
          seterrRemark('')
        } else {
          seterrRemark('Required field')
        }
        setRemark(event.target.value)
        break
      case 'Title':
        if (verifyLength(event.target.value, 1)) {
          seterrTitle('')
        } else {
          seterrTitle('Required field')
        }
        setTitle(event.target.value)
        break
      default:
        break
    }
  }

  // onSubmit function for validate the fields and to dispatch action
  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(Title, 1) && verifyLength(Remark, 1) && !errTitle && !errRemark) {
      if (isCreate) {
        AddNewLeagueCategory(Title, Remark)
      } else {
        UpdateLeagueCategory(Title, Remark)
      }
      setLoading(true)
    } else {
      if (!verifyLength(Remark, 1)) {
        seterrRemark('Required field')
      }
      if (!verifyLength(Title, 1)) {
        seterrTitle('Required field')
      }
    }
  }

  // function to display heading text
  function heading () {
    if (isCreate) {
      return 'Create Filter Category'
    }
    return !isEdit ? 'Edit Filter Category' : ' Filter Category Details'
  }

  // function to display submit button text
  function button () {
    if (isCreate) {
      return 'Create Filter Category'
    }
    return !isEdit ? 'Save Changes' : 'Edit Filter Category'
  }

  return (
    <main className="main-content">
      {
        modalMessage && message && (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      {loading && <Loading />}
      <section className="common-form-block">
        <h2>
          {heading()}
        </h2>
        <Form>
          <FormGroup>
            <Label for="Title">Title <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.LEAGUE === 'R'} type="text" name="Title" placeholder="Enter Title" value={Title} onChange={event => handleChange(event, 'Title')} />
            <p className="error-text">{errTitle}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Remark">Remark <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.LEAGUE === 'R'} type="text" name="Remark" placeholder="Enter Remark" value={Remark} onChange={event => handleChange(event, 'Remark')} />
            <p className="error-text">{errRemark}</p>
          </FormGroup>
          {
            ((Auth && Auth.length === 'SUPER') || (adminPermission?.LEAGUE !== 'R')) && (
              <Button className="theme-btn full-btn" onClick={onSubmit} disabled={submitDisable || (!Title || !Remark)}>
                {button()}
              </Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`${cancelLink}${page?.FilterCategory || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddFilterCategory.propTypes = {
  cancelLink: PropTypes.string,
  AddNewLeagueCategory: PropTypes.string,
  UpdateLeagueCategory: PropTypes.string,
  FilterCategoryDetails: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object

}

export default AddFilterCategory
