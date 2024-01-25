import React, { useState, useEffect, useRef } from 'react'
import {
  Button, Form, FormGroup, Label, Input, CustomInput, UncontrolledAlert
} from 'reactstrap'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { alertClass, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { getUrl } from '../../../../actions/url'
import Loading from '../../../../components/Loading'

function AddCategoryTemp (props) {
  const {
    AddNewCategoryTemp, cancelLink
  } = props
  const [loading, setLoading] = useState(false)
  const [Image, setImage] = useState('')
  const [Name, setName] = useState('')
  const [Type, setType] = useState('CONTEST_JOIN')
  const [Info, setInfo] = useState('')
  const [ColumnText, setColumnText] = useState('')
  const [url, setUrl] = useState('')
  const [errImage, setErrImage] = useState('')
  const [errName, setErrName] = useState('')
  const [errInfo, setErrInfo] = useState('')
  const [errColumnText, setErrColumnText] = useState('')
  const dispatch = useDispatch()
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)

  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage }).current

  useEffect(() => {
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
        setLoading(false)
        if (resStatus) {
          props.history.push(`${cancelLink}`, { message: resMessage })
        } else {
          setModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function handleChange (event, type) {
    switch (type) {
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'Type':
        setType(event.target.value)
        break
      case 'Info':
        if (verifyLength(event.target.value, 1)) {
          setErrInfo('')
        } else {
          setErrInfo('Required field')
        }
        setInfo(event.target.value)
        break
      case 'ColumnText':
        if (verifyLength(event.target.value, 1)) {
          setErrColumnText('')
        } else {
          setErrColumnText('Required field')
        }
        setColumnText(event.target.value)
        break
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      default:
        break
    }
  }

  function Submit (e) {
    e.preventDefault()
    if (verifyLength(Name, 1) && verifyLength(Type, 1) && verifyLength(Info, 1) && verifyLength(ColumnText, 1) && !errName && !errInfo && !errColumnText) {
      AddNewCategoryTemp(Name, Type, Info, Image, ColumnText)
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        setErrName('Required field')
      }
      if (!verifyLength(Info, 1)) {
        setErrInfo('Required field')
      }
      if (!verifyLength(ColumnText, 1)) {
        setErrColumnText('Required field')
      }
    }
  }

  function onImageError (e) {
    e.target.src = documentPlaceholder
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
        <h2>
          Create Category Template
        </h2>
        <Form>
          <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                  <img src={Image ? Image.imageURL ? Image.imageURL : url + Image : documentPlaceholder} alt="themeImage" onError={onImageError} />
                </div>
              </div>
              <CustomInput disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="TamImage" label="Add Team image" onChange={event => handleChange(event, 'Image')} />
              <p className="error-text">{errImage}</p>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="Name">Name</Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Name" placeholder="Name" value={Name} onChange={event => handleChange(event, 'Name')} />
            <p className="error-text">{errName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Info">Info</Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Info" placeholder="Info" value={Info} onChange={event => handleChange(event, 'Info')} />
            <p className="error-text">{errInfo}</p>
          </FormGroup>
          <FormGroup>
            <Label for="ColumnText">Column Text</Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="ColumnText" placeholder="ColumnText" value={ColumnText} onChange={event => handleChange(event, 'ColumnText')} />
            <p className="error-text">{errColumnText}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Type">Type</Label>
            <CustomInput disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} type="select" name="Type" placeholder="Type" value={Type} onChange={event => handleChange(event, 'Type')}>
              <option value="CONTEST_JOIN">CONTEST_JOIN</option>
              <option value="PRIZE_WON">PRIZE_WON</option>
              <option value="LOYALTY_POINTS">LOYALTY_POINTS</option>
            </CustomInput>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')) &&
            (
              <Button className="theme-btn full-btn" onClick={Submit}>
                Create Category Template
              </Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={cancelLink}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}
AddCategoryTemp.defaultProps = {
  history: {},
  AddNewCategoryTemp: {},
  cancelLink: ''
}

AddCategoryTemp.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.object
  }),
  AddNewCategoryTemp: PropTypes.func,
  cancelLink: PropTypes.string
}

export default AddCategoryTemp
