import React, { useState, useEffect, useRef, Fragment } from 'react'
import {
  FormGroup,
  Input,
  Label,
  Button,
  Form,
  UncontrolledAlert,
  InputGroupText,
  CustomInput
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { alertClass, modalMessageFunc, verifyLength, verifyUrl } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import { getVersionDetails, updateVersion } from '../../../../actions/version'
import moment from 'moment'

function AddVersion (props) {
  const history = useHistory()
  const [urlError, setUrlError] = useState('')
  const [versionErr, setVersionErr] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [versionId, setVersionId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')
  const [version, setVersion] = useState('')
  const [urlofversion, setUrlofversion] = useState('')
  const [createdAt, setCreatedAt] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [inAppUpdate, setInAppUpdate] = useState('N')
  const [forceVersion, setForceVersion] = useState('')
  const [errName, setErrName] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const versionDetails = useSelector((state) => state.version.versionDetails)
  const resStatus = useSelector((state) => state.version.resStatus)
  const resMessage = useSelector((state) => state.version.resMessage)
  const Auth = useSelector(
    (state) => state.auth.adminData && state.auth.adminData.eType
  )
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const previousProps = useRef({
    resStatus,
    resMessage,
    versionDetails
  }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const conditionUrl = !props.match.path.includes('add-version')
  const submitDisable = versionDetails && previousProps.versionDetails !== versionDetails && versionDetails.sVersion === version && versionDetails.sName === name && versionDetails.sDescription === description && versionDetails.eType === type && versionDetails.sUrl === urlofversion && (versionDetails.bInAppUpdate === (inAppUpdate === 'Y')) && versionDetails.sForceVersion === forceVersion

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getVersionDetails(match.params.id, token))
      setVersionId(match.params.id)
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
          history.push(`/settings/versions${page?.VersionManagement || ''}`, {
            message: resMessage
          })
        } else {
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
    if (previousProps.versionDetails !== versionDetails) {
      if (versionDetails) {
        setName(versionDetails.sName)
        setDescription(versionDetails.sDescription)
        setType(versionDetails.eType)
        setVersion(versionDetails.sVersion)
        setUrlofversion(versionDetails.sUrl)
        setInAppUpdate(versionDetails.bInAppUpdate ? 'Y' : 'N')
        setForceVersion(versionDetails.sForceVersion ? versionDetails.sForceVersion : '')
        setCreatedAt(versionDetails.dCreatedAt)
        setUpdatedAt(versionDetails.dUpdatedAt)
        setLoading(false)
      }
    }
    return () => {
      previousProps.versionDetails = versionDetails
    }
  }, [versionDetails])

  function handleChange (event, field) {
    switch (field) {
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'Description':
        setDescription(event.target.value)
        break
      case 'Type':
        if (verifyLength(event.target.value, 1)) {
          setTypeErr('')
        } else {
          setTypeErr('Required field')
        }
        setType(event.target.value)
        break
      case 'Version':
        if (!event.target.value) {
          setVersionErr('Required field')
        } else {
          setVersionErr('')
        }
        setVersion(event.target.value)
        break
      case 'Url':
        if (event.target.value && !verifyUrl(event.target.value)) {
          setUrlError('Invalid link ')
        } else {
          setUrlError('')
        }
        setUrlofversion(event.target.value)
        break
      case 'InAppUpdate':
        setInAppUpdate(event.target.value)
        break
      case 'ForceVersion':
        setForceVersion(event.target.value)
        break
      default:
        break
    }
  }

  function onSubmit (e) {
    e.preventDefault()

    if (verifyLength(name, 1) && version && verifyLength(type, 1) && !errName && !versionErr && !typeErr) {
      const updateVersionData = {
        versionId,
        name,
        description,
        type,
        version,
        urlofversion,
        token,
        conditionUrl,
        inAppUpdate,
        forceVersion
      }
      dispatch(updateVersion(updateVersionData))
      setLoading(true)
    } else {
      if (!verifyLength(name, 1)) {
        setErrName('Required field')
      }
      if (!version) {
        setVersionErr('Required field')
      }
      if (!verifyLength(type, 1)) {
        setTypeErr('Required field')
      }
    }
  }

  return (
    <main className='main-content'>
      {loading && <Loading />}
      {modalMessage && message && (
        <UncontrolledAlert
          color='primary'
          className={alertClass(status, close)}>
          {message}
        </UncontrolledAlert>
      )}
      <section className='common-form-block'>
        {conditionUrl ? <h2>Edit Version</h2> : <h2>Add Version</h2>}
        <Form>
          <FormGroup>
            <Label for='name'>Version Name <span className="required-field">*</span></Label>
            <Input
              disabled={adminPermission?.VERSION === 'R'}
              type='text'
              id='name'
              placeholder='Enter Version Name'
              value={name}
              onChange={(event) => handleChange(event, 'Name')}
            />
            <p className='error-text'>{errName}</p>
          </FormGroup>
          <FormGroup>
            <Label for='name'>Description</Label>
            <Input
              disabled={adminPermission?.VERSION === 'R'}
              type='text'
              id='Description'
              placeholder='Enter Version Description'
              value={description}
              onChange={(event) => handleChange(event, 'Description')}
            />
          </FormGroup>

          <FormGroup>
            <Label for='type'>Type <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.VERSION === 'R'} type="select" name="type" className="form-control" value={type} onChange={event => handleChange(event, 'Type')}>
              <option value=''>Select type</option>
              <option value="I">iOS</option>
              <option value="A">Android</option>
            </CustomInput>
            <p className='error-text'>{typeErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for='name'>Version <span className="required-field">*</span></Label>
            <Input
              disabled={adminPermission?.VERSION === 'R'}
              type='text'
              id='Version'
              placeholder='Enter Version Number'
              value={version}
              onChange={(event) => handleChange(event, 'Version')}
            />
            <p className='error-text'>{versionErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for='name'>Url</Label>
            <Input
              disabled={adminPermission?.VERSION === 'R'}
              type='text'
              id='Url'
              placeholder='Enter Version Url'
              value={urlofversion}
              onChange={(event) => handleChange(event, 'Url')}
            />
            <p className='error-text'>{urlError}</p>
          </FormGroup>
          <FormGroup>
            <Label for="ActiveOffer">In App Update</Label>
            <div className="d-flex inline-input">
              <CustomInput
                type="radio"
                disabled={adminPermission?.VERSION === 'R'}
                id="themeRadio1"
                name="themeRadio"
                label="True"
                onClick={event => handleChange(event, 'InAppUpdate')}
                checked={inAppUpdate === 'Y'}
                value="Y"
              />
              <CustomInput
                type="radio"
                disabled={adminPermission?.VERSION === 'R'}
                id="themeRadio2"
                name="themeRadio"
                label="False"
                onClick={event => handleChange(event, 'InAppUpdate')}
                checked={inAppUpdate !== 'Y'}
                value="N"
              />
            </div>
          </FormGroup>
          <FormGroup>
            <Label for='forceVersion'>Force Version</Label>
            <Input
              disabled={adminPermission?.VERSION === 'R'}
              type='text'
              id='forceVersion'
              placeholder='Force Version'
              value={forceVersion}
              onChange={(event) => handleChange(event, 'ForceVersion')}
            />
          </FormGroup>
          {conditionUrl && (
            <>
              <FormGroup>
                <Label for='name'>Created Date</Label>
                <InputGroupText>
                  {moment(createdAt).format('DD/MM/YYYY hh:mm A')}
                </InputGroupText>
              </FormGroup>
              <FormGroup>
                <Label for='name'>Last Updated Date</Label>
                <InputGroupText>
                  {moment(updatedAt).format('DD/MM/YYYY hh:mm A')}
                </InputGroupText>
              </FormGroup>
            </>
          )}

          {((Auth && Auth === 'SUPER') ||
            (adminPermission?.VERSION !== 'R')) && (
            <Fragment>
              <Button className='theme-btn full-btn' disabled={submitDisable} onClick={onSubmit}>
                {conditionUrl ? ' Save Changes' : 'add version'}
              </Button>
            </Fragment>
          )}
        </Form>
        <div className='form-footer text-center small-text'>
          <NavLink to={`/settings/versions${page?.VersionManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddVersion.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default AddVersion
