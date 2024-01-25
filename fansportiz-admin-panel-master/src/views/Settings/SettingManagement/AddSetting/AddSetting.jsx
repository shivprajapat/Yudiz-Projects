import React, { useState, useEffect, useRef, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, UncontrolledAlert, Form, FormGroup, Label, Input, CustomInput, InputGroupText
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loading from '../../../../components/Loading'
import { getCurrencyData, getSettingDetails, getSideBackgroundImage, submitSiteSideBackgroundImage, updateCurrencyDetails, updateSetting } from '../../../../actions/setting'
import { verifyLength, isPositive, isNumber, modalMessageFunc, alertClass, isFloat } from '../../../../helpers/helper'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { getUrl } from '../../../../actions/url'

function AddSetting (props) {
  const [creatorBonusType, setCreatorBonusType] = useState('')
  const [valueErr, setValueErr] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [backgroundImage, setBackgroundImage] = useState('')
  const [sideImage, setSideImage] = useState('')
  const [errImage, setErrImage] = useState('')
  const [url, setUrl] = useState('')
  const [shortName, setShortName] = useState('')
  const [logo, setLogo] = useState('')
  const [description, setDescription] = useState('')
  const [errShortname, setErrShortname] = useState('')
  const [errLogo, setErrLogo] = useState('')
  const [Title, setTitle] = useState('')
  const [Key, setKey] = useState('')
  const [Max, setMax] = useState(0)
  const [Min, setMin] = useState(0)
  const [errTitle, setErrTitle] = useState('')
  const [errKey, setErrKey] = useState('')
  const [errMax, setErrMax] = useState('')
  const [errMin, setErrMin] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [settingId, setSettingId] = useState('')
  const [close, setClose] = useState(false)
  const [settingStatus, setSettingStatus] = useState('N')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const settingDetails = useSelector(state => state.setting.settingDetails)
  const sideBgImage = useSelector(state => state.setting.sideBgImage)
  const resStatus = useSelector(state => state.setting.resStatus)
  const resMessage = useSelector(state => state.setting.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const currencyDetails = useSelector(state => state.setting.currencyDetails)
  const previousProps = useRef({ resStatus, resMessage, settingDetails, currencyDetails, Key }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = settingDetails && previousProps.settingDetails !== settingDetails && settingDetails.sTitle === Title && settingDetails.nMax === parseInt(Max) && settingDetails.nMin === parseInt(Min) && settingDetails.eStatus === settingStatus
  const TDSDisable = settingDetails && previousProps.settingDetails !== settingDetails && settingDetails.sTitle === Title && settingDetails.nMax === parseFloat(Max) && settingDetails.nMin === parseFloat(Min) && settingDetails.eStatus === settingStatus
  const bgImageDisable = settingDetails && previousProps.settingDetails !== settingDetails && settingDetails.sImage === backgroundImage
  const sideImgDisable = settingDetails && previousProps.settingDetails !== settingDetails && settingDetails.sImage === sideImage
  const currencyDisable = settingDetails && previousProps.settingDetails !== settingDetails && settingDetails.sShortName === shortName && settingDetails.sLogo === logo
  const streamDisable = settingDetails && previousProps.settingDetails !== settingDetails && settingDetails.eStatus === settingStatus && settingDetails.sTitle === Title
  const creatorBonusDisable = settingDetails && settingDetails?.sValue === creatorBonusType && settingDetails.eStatus === settingStatus
  const buttonDisable = Key === 'BG' ? bgImageDisable : '' || Key === 'IMG' ? sideImgDisable : '' || Key === 'STREAM_BUTTON' ? streamDisable : '' || Key === 'CURRENCY' ? currencyDisable : Key === 'TDS' ? TDSDisable : Key === 'CREATOR_BONUS' ? creatorBonusDisable : submitDisable

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getSettingDetails(match.params.id, token))
      setSettingId(match.params.id)
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
          props.history.push(`/settings/setting-management${page?.SettingManagement || ''}`, { message: resMessage })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage, resStatus])

  useEffect(() => {
    if (previousProps.currencyDetails !== currencyDetails) {
      if (currencyDetails) {
        setTitle(currencyDetails.sTitle)
        setKey(currencyDetails.sKey)
        setShortName(currencyDetails.sShortName)
        setLogo(currencyDetails.sLogo)
        setDescription(currencyDetails.sDescription || '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.currencyDetails = currencyDetails
    }
  }, [currencyDetails])

  useEffect(() => {
    if (previousProps.settingDetails !== settingDetails) {
      if (settingDetails) {
        setTitle(settingDetails.sTitle)
        setKey(settingDetails.sKey)
        setMax(settingDetails.nMax)
        setMin(settingDetails.nMin)
        setSettingStatus(settingDetails.eStatus)
        setDescription(settingDetails.sDescription)
        setCreatorBonusType(settingDetails.sValue || '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.settingDetails = settingDetails
    }
  }, [settingDetails])

  useEffect(() => {
    if (previousProps.Key !== Key) {
      if (Key === 'BG' || Key === 'IMG') {
        dispatch(getSideBackgroundImage(Key, token))
        if (!getUrlLink) {
          dispatch(getUrl('media'))
        }
      } else if (Key === 'CURRENCY') {
        dispatch(getCurrencyData(token))
      }
    }
    return () => {
      previousProps.Key = Key
    }
  }, [Key])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (sideBgImage) {
      sideBgImage.sKey === 'BG' ? setBackgroundImage(sideBgImage.sImage) : setSideImage(sideBgImage.sImage)
    }
  }, [sideBgImage])

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
      case 'Key':
        if (verifyLength(event.target.value, 1)) {
          setErrKey('')
        } else {
          setErrKey('Required field')
        }
        setKey(event.target.value)
        break
      case 'Value':
        if (settingDetails?.sKey === 'TDS') {
          if (isFloat(event.target.value) || !event.target.value) {
            if (event.target.value) {
              setErrMax('')
            } else {
              setErrMax('Required field')
            }
            setMax(event.target.value)
          }
        } else if (isNumber(event.target.value) || (!event.target.value)) {
          if (event.target.value) {
            setValueErr('')
          } else {
            setValueErr('Required field')
          }
          setMax(event.target.value)
          setMin(event.target.value)
        }
        break
      case 'Max':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value) {
            setErrMax('')
          } else {
            setErrMax('Required field')
          }
          setMax(event.target.value)
          if (parseInt(Min) && (parseInt(Min) > parseInt(event.target.value))) {
            setErrMax('Maximum amount should be greater than Minimum amount!')
          } else {
            setErrMax('')
            setErrMin('')
          }
        }
        break
      case 'Min':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value) {
            setErrMin('')
          } else {
            setErrMin('Required field')
          }
          setMin(event.target.value)
          if (parseInt(Max) && (parseInt(event.target.value) > parseInt(Max))) {
            setErrMin('Minimum amount should be less than Maximum amount!')
          } else {
            setErrMin('')
            setErrMax('')
          }
        }
        break
      case 'Status':
        setSettingStatus(event.target.value)
        break
      case 'Background':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setBackgroundImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'SideImage':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setSideImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'ShortName':
        if (verifyLength(event.target.value, 1)) {
          setErrShortname('')
        } else {
          setErrShortname('Required field')
        }
        setShortName(event.target.value)
        break
      case 'Logo':
        if (verifyLength(event.target.value, 1)) {
          setErrLogo('')
        } else {
          setErrLogo('Required field')
        }
        setLogo(event.target.value)
        break
      case 'CreatorBonusType':
        if (verifyLength(event.target.value, 1)) {
          setTypeErr('')
        } else {
          setTypeErr('Required field')
        }
        setCreatorBonusType(event.target.value)
        break
      default:
        break
    }
  }

  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  function onSubmit (e) {
    e.preventDefault()
    const streamButton = verifyLength(Title, 1) && verifyLength(Key, 1)
    const TDSButton = parseFloat(Max) && !valueErr
    const creatorBonusTypeButton = verifyLength(creatorBonusType, 1) && verifyLength(Title, 1)
    const other = isPositive(Max) && isNumber(Min) && (parseInt(Min) <= parseInt(Max)) && !errTitle && !errKey && !errMax && !errMin
    const validate = Key === 'STREAM_BUTTON' ? streamButton : Key === 'TDS' ? TDSButton : Key === 'CREATOR_BONUS' ? creatorBonusTypeButton : streamButton && other
    if (validate) {
      const updateSettingData = {
        settingId, Title, Key, Max, Min, settingStatus, creatorBonusType, token
      }
      dispatch(updateSetting(updateSettingData))
      setLoading(true)
    } else {
      if (Key === 'CREATOR_BONUS') {
        if (verifyLength(creatorBonusType, 1)) {
          setTypeErr('Required field')
        }
      }
      if (!verifyLength(Title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(Key, 1)) {
        setErrKey('Required field')
      }
      if (parseInt(Max) < parseInt(Min)) {
        setErrMax('Maximum amount should be greater than Minimum Amount')
      }
      if (!isPositive(Max)) {
        setErrMax('Required field')
      }
      if (Min < 0) {
        setErrMin('Required field')
      }
    }
  }

  function imageSubmit (type) {
    if (backgroundImage && type === 'BG') {
      dispatch(submitSiteSideBackgroundImage(backgroundImage, type, token))
    } else if (sideImage && type === 'IMG') {
      dispatch(submitSiteSideBackgroundImage(sideImage, type, token))
    }
    setLoading(true)
  }

  function updateCurrencyData () {
    if (shortName && logo && !errShortname && !errLogo) {
      const data = { Title, Key, shortName, logo, token }
      dispatch(updateCurrencyDetails(data))
    } else {
      if (!shortName) {
        setErrShortname('Required field')
      }
      if (!logo) {
        setErrLogo('Required field')
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
        <h2>Edit Setting</h2>
        <Form>
          <FormGroup>
            <Label for="Title">Title </Label>
            <InputGroupText>{Title}</InputGroupText>
            <p className="error-text">{errTitle}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Key">Key</Label>
            <InputGroupText>{Key}</InputGroupText>
          </FormGroup>
          {Key === 'CREATOR_BONUS' && <FormGroup>
            <Label for='CreatorBonusType'>Type <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.SETTING === 'R'} type="select" name="CreatorBonusType" className="form-control" value={creatorBonusType} onChange={event => handleChange(event, 'CreatorBonusType')}>
              <option value=''>Select type</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WIN">Win</option>
              <option value="BONUS">Bonus</option>
            </CustomInput>
           <p className="error-text">{typeErr}</p>
          </FormGroup>}
          {Key === 'CURRENCY' && <FormGroup>
            <Label for="Title">Shortname <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SETTING === 'R'} name="Shortname" placeholder="Enter Shortname" value={shortName} onChange={event => handleChange(event, 'ShortName')} />
            <p className="error-text">{errShortname}</p>
          </FormGroup>}
          {Key === 'CURRENCY' && <FormGroup>
            <Label for="Title">Logo <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SETTING === 'R'} name="Logo" placeholder="Enter Logo" value={logo} onChange={event => handleChange(event, 'Logo')} />
            <p className="error-text">{errLogo}</p>
          </FormGroup>}
          {(Key === 'Deposit' || Key === 'PCF' || Key === 'PCS' || Key === 'PUBC' || Key === 'Withdraw') && <FormGroup>
            <Label for="Min">Min <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SETTING === 'R'} type='number' name="Min" placeholder="Enter Min" value={Min} onChange={event => handleChange(event, 'Min')} />
            <p className="error-text">{errMin}</p>
          </FormGroup>}
          {(Key === 'Deposit' || Key === 'PCF' || Key === 'PCS' || Key === 'PUBC' || Key === 'Withdraw') && <FormGroup>
            <Label for="Max">Max <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SETTING === 'R'} type='number' name="Max" placeholder="Enter Max" value={Max} onChange={event => handleChange(event, 'Max')} />
            <p className="error-text">{errMax}</p>
          </FormGroup>}
          {((Key === 'BonusExpireDays') || (Key === 'UserDepositRateLimit') || (Key === 'UserDepositRateLimitTimeFrame') || (Key === 'TDS') || (Key === 'UserWithdrawRateLimit') || (Key === 'UserWithdrawRateLimitTimeFrame')) && <FormGroup>
            <Label for="Value">Value <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SETTING === 'R'} type='number' name="Value" placeholder="Enter Value" value={Max} onChange={event => handleChange(event, 'Value')} />
            <p className="error-text">{valueErr}</p>
          </FormGroup>}
          {Key === 'BG' && <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                    <img className='custom-img' src={backgroundImage ? backgroundImage.imageURL ? backgroundImage.imageURL : url + backgroundImage : documentPlaceholder} alt="themeImage" onError={onImageError} />
                    <div className="side-label">Background</div>
                  </div>
                </div>
                {((Auth && Auth === 'SUPER') || (adminPermission?.SETTING === 'W')) &&
                <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" onChange={event => handleChange(event, 'Background')} />}
                <p className="error-text">{errImage}</p>
            </div>
          </FormGroup>}
          {Key === 'IMG' && <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                    <img className='custom-img' src={sideImage ? sideImage.imageURL ? sideImage.imageURL : url + sideImage : documentPlaceholder} alt="themeImage" onError={onImageError} />
                    <div className="side-label">Side Image</div>
                  </div>
                </div>
            {((Auth && Auth === 'SUPER') || (adminPermission?.SETTING === 'W')) &&
              <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" onChange={event => handleChange(event, 'SideImage')} />}
              <p className="error-text">{errImage}</p>
          </div>
        </FormGroup>}
        {description && <FormGroup>
          <Label for="Description">Description</Label>
          <Input type='textarea' value={description} readOnly className='read-only-class'></Input>
        </FormGroup>}
        {(Key !== 'BG' && Key !== 'IMG' && Key !== 'CURRENCY') && <FormGroup>
            <Label>Status</Label>
            <div className="d-flex inline-input">
              <CustomInput disabled={(adminPermission?.SETTING === 'R') || (Key === 'PUBC' || Key === 'PCS' || Key === 'PCF')} type="radio" id="bannerRadio1" name="bannerRadio" label="Active" onClick={event => handleChange(event, 'Status')} value="Y" checked={settingStatus === 'Y'} />
              <CustomInput disabled={(adminPermission?.SETTING === 'R') || (Key === 'PUBC' || Key === 'PCS' || Key === 'PCF')} type="radio" id="bannerRadio2" name="bannerRadio" label="InActive" onClick={event => handleChange(event, 'Status')} value="N" checked={settingStatus !== 'Y'} />
            </div>
          </FormGroup>}
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.SETTING !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" disabled={buttonDisable} onClick={(e) => (Key === 'BG' || Key === 'IMG') ? imageSubmit(Key) : Key === 'CURRENCY' ? updateCurrencyData() : onSubmit(e)}>Save Changes</Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/setting-management${page?.SettingManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddSetting.defaultProps = {
  history: {}
}

AddSetting.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object
}
export default connect()(AddSetting)
