import React, { useState, useEffect, useRef } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, CustomInput, UncontrolledAlert, InputGroupText } from 'reactstrap'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { alertClass, modalMessageFunc, verifyLength, withoutSpace } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { getUrl } from '../../../../actions/url'
import removeImg from '../../../../assets/images/remove_img.svg'

function AddTeamForm (props) {
  const {
    AddNewTeam, cancelLink, TeamDetails, UpdateTeam
  } = props
  const [teamStatus, setTeamStatus] = useState('Y')
  const [Name, setName] = useState('')
  const [ShortName, setShortName] = useState('')
  const [Image, setImage] = useState('')
  const [Key, setKey] = useState('')
  const [provider, setProvider] = useState('')
  const [errName, seterrName] = useState('')
  const [errShortName, seterrShortName] = useState('')
  const [errImage, seterrImage] = useState('')
  const [url, setUrl] = useState('')
  const [errKey, seterrKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const dispatch = useDispatch()
  const resStatus = useSelector(state => state.team.resStatus)
  const resMessage = useSelector(state => state.team.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ TeamDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)
  const [teamId, setteamId] = useState('')
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const submitDisable = TeamDetails && previousProps.TeamDetails !== TeamDetails && TeamDetails.sName === Name && TeamDetails.sKey === Key && TeamDetails.sShortName === ShortName && TeamDetails.sImage === Image && TeamDetails.eStatus === teamStatus

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      setteamId(match.params.id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
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

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.TeamDetails !== TeamDetails) {
      if (TeamDetails) {
        setName(TeamDetails.sName)
        setImage(TeamDetails.sImage)
        setKey(TeamDetails.sKey)
        setShortName(TeamDetails.sShortName)
        setProvider(TeamDetails.eProvider ? TeamDetails.eProvider : '--')
        setTeamStatus(TeamDetails.eStatus)
        setLoading(false)
      }
    }
    return () => {
      previousProps.TeamDetails = TeamDetails
    }
  }, [TeamDetails])

  function Submit (e) {
    e.preventDefault()
    if (verifyLength(Name, 1) && verifyLength(ShortName, 1) && verifyLength(Key, 1) && !errName && !errShortName && !errKey) {
      if (isCreate) {
        AddNewTeam(Key, Name, Image, ShortName, teamStatus)
      } else {
        UpdateTeam(teamId, Key, Name, Image, ShortName, teamStatus)
      }
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        seterrName('Required field')
      }
      if (!verifyLength(ShortName, 1)) {
        seterrShortName('Required field')
      }
      if (!verifyLength(Key, 1)) {
        seterrKey('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          seterrName('')
        } else {
          seterrName('Required field')
        }
        setName(event.target.value)
        break
      case 'ShortName':
        if (verifyLength(event.target.value, 1)) {
          seterrShortName('')
        } else {
          seterrShortName('Required field')
        }
        setShortName(event.target.value)
        break
      case 'Key':
        if (verifyLength(event.target.value, 1)) {
          if (withoutSpace(event.target.value)) {
            seterrKey('No space')
          } else {
            seterrKey('')
          }
        } else {
          seterrKey('Required field')
        }
        setKey(event.target.value)
        break
      case 'Image':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          seterrImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          seterrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          seterrImage('')
        }
        break
      case 'RemoveImage':
        setImage('')
        break
      case 'TeamStatus':
        setTeamStatus(event.target.value)
        break
      default:
        break
    }
  }

  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  function heading () {
    if (isCreate) {
      return 'Add Team'
    }
    return !isEdit ? 'Edit Team' : 'Team Details'
  }

  function button () {
    if (isCreate) {
      return 'Add Team'
    }
    return !isEdit ? 'Save Changes' : 'Edit Team'
  }

  return (
    <main className="main-content">
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{ message }</UncontrolledAlert>
        )
      }
      {loading && <Loading />}
      <section className="common-form-block">
        <h2>
          {heading()}
        </h2>
        <Form>
          <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                  <img className='custom-img' src={Image ? Image.imageURL ? Image.imageURL : url + Image : documentPlaceholder} alt="themeImage" onError={onImageError} />
                  {Image && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                </div>
              </div>
              {((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="TamImage" label="Add Team image" onChange={event => handleChange(event, 'Image')} />}
              <p className="error-text">{errImage}</p>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="Name">Team <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.TEAM === 'R'} name="Name" placeholder="Team Name" value={Name} onChange={event => handleChange(event, 'Name')} />
            <p className="error-text">{errName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="ShortName">Short Name <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.TEAM === 'R'} name="ShortName" placeholder="Short Name" value={ShortName} onChange={event => handleChange(event, 'ShortName')} />
            <p className="error-text">{errShortName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Key">Key <span className="required-field">*</span></Label>
            <Input
              type="text"
              disabled={adminPermission?.TEAM === 'R'}
              name="Key"
              placeholder="Key"
              value={Key}
              onChange={event => handleChange(event, 'Key')}
            />
            <p className="error-text">{errKey}</p>
          </FormGroup>
          {!isCreate && <FormGroup>
            <Label for="provider">Provider</Label>
            <InputGroupText>{provider}</InputGroupText>
          </FormGroup>}
          <FormGroup>
            <Label>Status</Label>
            <div className="d-flex inline-input">
              <CustomInput disabled={(adminPermission?.TEAM === 'R')} type="radio" id="teamRadio1" name="teamRadio" label="Active" onClick={event => handleChange(event, 'TeamStatus')} value="Y" checked={teamStatus === 'Y'} />
              <CustomInput disabled={(adminPermission?.TEAM === 'R')} type="radio" id="teamRadio2" name="teamRadio" label="InActive" onClick={event => handleChange(event, 'TeamStatus')} value="N" checked={teamStatus !== 'Y'} />
            </div>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'R')) &&
            (
              <Button className="theme-btn full-btn" onClick={Submit} disabled={(!Name || !ShortName || !Key) || submitDisable}>
                {button()}
              </Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`${cancelLink}${page?.TeamManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddTeamForm.defaultProps = {
  history: {}
}

AddTeamForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  AddNewTeam: PropTypes.func,
  TeamDetails: PropTypes.object,
  cancelLink: PropTypes.string,
  UpdateTeam: PropTypes.func,
  match: PropTypes.object
}
export default connect()(AddTeamForm)
