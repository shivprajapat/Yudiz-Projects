import React, { useState, useEffect, useRef, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, UncontrolledAlert, Form, FormGroup, Label, Input, CustomInput, InputGroupText
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loading from '../../../../components/Loading'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { alertClass, modalMessageFunc, verifyLength, verifyUrl } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getSportsList } from '../../../../actions/sports'
import { getMatchList } from '../../../../actions/match'
import { getBannerMatchLeagueList } from '../../../../actions/matchleague'
import { addPopupAd, getPopupAdDetails, updatePopupAd } from '../../../../actions/popup'

function AddPopupAd (props) {
  const [title, setTitle] = useState('')
  const [Link, setLink] = useState('')
  const [type, setType] = useState('')
  const [adImage, setAdImage] = useState('')
  const [popupAdId, setPopupAdId] = useState('')
  const [platform, setPlatform] = useState('')
  const [errType, setErrType] = useState('')
  const [errPlatform, setErrPlatform] = useState('')
  const [category, setCategory] = useState('')
  const [MatchList, setMatchList] = useState([])
  const [Match, setMatch] = useState('')
  const [LeagueList, setLeagueList] = useState([])
  const [League, setLeague] = useState('')
  const [errCategory, setErrCategory] = useState('')
  const [errMatch, setErrMatch] = useState('')
  const [errLink, setErrLink] = useState('')
  const [errImage, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [close, setClose] = useState(false)
  const [adStatus, setAdStatus] = useState('N')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const popupAdDetails = useSelector(state => state.popup.popupAdDetails)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.popup.resStatus)
  const resMessage = useSelector(state => state.popup.resMessage)
  const sportsList = useSelector(state => state.sports.sportsList)
  const matchList = useSelector(state => state.match.matchList)
  const MatchLeagueList = useSelector(state => state.matchleague.bannerMatchLeagueList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, popupAdDetails, type, category, Match, matchList, League, LeagueList }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = popupAdDetails && previousProps.popupAdDetails !== popupAdDetails && popupAdDetails.sTitle === title && popupAdDetails.eType === type && popupAdDetails.sLink === Link && popupAdDetails.eStatus === adStatus && popupAdDetails.ePlatform === platform && ((popupAdDetails.iMatchId ? popupAdDetails.iMatchId : '') === Match) && ((popupAdDetails.iMatchLeagueId ? popupAdDetails.iMatchLeagueId : '') === League) && ((popupAdDetails.eCategory ? popupAdDetails.eCategory : '') === category) && popupAdDetails.sImage === adImage

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getPopupAdDetails(match.params.id, token))
      setPopupAdId(match.params.id)
      setIsCreate(false)
      setLoading(true)
    }
    dispatch(getUrl('media'))
  }, [])

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
          props.history.push(`/settings/popup-ads-management${page?.PopupAdsManagement || ''}`, { message: resMessage })
        }
        setModalMessage(true)
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.type !== type) {
      if (type === 'I') {
        dispatch(getSportsList(token))
        setLoading(true)
      }
    }
    if (sportsList) {
      setLoading(false)
    }
    return () => {
      previousProps.type = type
    }
  }, [type, sportsList])

  useEffect(() => {
    if (category && previousProps.category !== category) {
      const data = { start: 0, limit: 10, sort: 'dCreatedAt', order: 'desc', search: '', filter: 'U', startDate: '', endDate: '', sportsType: category, provider: '', season: '', format: '', token }
      dispatch(getMatchList(data))
      setLoading(true)
    }
    if (matchList) {
      setLoading(false)
    }
    return () => {
      previousProps.category = category
      previousProps.matchList = matchList
    }
  }, [category, matchList])

  useEffect(() => {
    if (Match && previousProps.Match !== Match) {
      dispatch(getBannerMatchLeagueList(Match, token))
      setLoading(true)
    }
    if (MatchLeagueList) {
      setLoading(false)
    }
    return () => {
      previousProps.Match = Match
    }
  }, [Match, MatchLeagueList])

  useEffect(() => {
    if (previousProps.matchList !== matchList) {
      if (matchList) {
        setMatchList(matchList.results ? matchList.results : [])
        !matchList.results && setErrMatch('')
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchList = matchList
    }
  }, [matchList])

  useEffect(() => {
    if (previousProps.MatchLeagueList !== MatchLeagueList) {
      if (MatchLeagueList) {
        setLeagueList(MatchLeagueList)
      }
      setLoading(false)
    }
    return () => {
      previousProps.MatchLeagueList = MatchLeagueList
    }
  }, [MatchLeagueList])

  useEffect(() => {
    if (previousProps.popupAdDetails !== popupAdDetails) {
      if (popupAdDetails) {
        setType(popupAdDetails.eType ? popupAdDetails.eType : '')
        setLink(popupAdDetails.sLink ? popupAdDetails.sLink : '')
        setAdImage(popupAdDetails.sImage ? popupAdDetails.sImage : '')
        setAdStatus(popupAdDetails.eStatus ? popupAdDetails.eStatus : '')
        setCategory(popupAdDetails.eCategory ? popupAdDetails.eCategory : '')
        setMatch(popupAdDetails.iMatchId ? popupAdDetails.iMatchId : '')
        setLeague(popupAdDetails.iMatchLeagueId ? popupAdDetails.iMatchLeagueId : '')
        setPlatform(popupAdDetails.ePlatform ? popupAdDetails.ePlatform : '')
        setTitle(popupAdDetails.sTitle ? popupAdDetails.sTitle : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.popupAdDetails = popupAdDetails
    }
  }, [popupAdDetails])

  function handleChange (event, field) {
    switch (field) {
      case 'Title':
        setTitle(event.target.value)
        break
      case 'Link':
        if (verifyLength(event.target.value, 1)) {
          if (!verifyUrl(event.target.value)) {
            setErrLink('Invalid link')
          } else {
            setErrLink('')
          }
        } else {
          setErrLink('Required field')
        }
        setLink(event.target.value)
        break
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setAdImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Status':
        setAdStatus(event.target.value)
        break
      case 'Type':
        if (verifyLength(event.target.value, 1)) {
          setErrType('')
        } else {
          setErrType('Required field')
        }
        setType(event.target.value)
        break
      case 'SportsType':
        if (verifyLength(event.target.value, 1)) {
          setErrCategory('')
        } else {
          setErrCategory('Required field')
        }
        setCategory(event.target.value)
        setMatch('')
        setLeague('')
        break
      case 'Match':
        if (verifyLength(event.target.value, 1)) {
          setErrMatch('')
        } else {
          setErrMatch('Required field')
        }
        setMatch(event.target.value)
        setLeague('')
        break
      case 'League':
        setLeague(event.target.value)
        break
      case 'Platform':
        if (event.target.value) {
          setErrPlatform('')
        } else {
          setErrPlatform('Required field')
        }
        setPlatform(event.target.value)
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
    let verify = false
    if (type === 'I') {
      verify = (adImage && category && Match && platform)
    } else if (type === 'E') {
      verify = (verifyLength(Link, 1) && adImage && platform && !errLink)
    }

    if (verify) {
      if (isCreate) {
        const addPopupAdData = {
          title, adImage, type, Link, category, Match, League, platform, adStatus, token
        }
        dispatch(addPopupAd(addPopupAdData))
      } else {
        const updatePopupAdData = {
          popupAdId, title, adImage, type, Link, category, Match, League, platform, adStatus, token
        }
        dispatch(updatePopupAd(updatePopupAdData))
      }
      setLoading(true)
    } else {
      if (type === 'E' && !verifyLength(Link, 1)) {
        setErrLink('Required field')
      }
      if (!type) {
        setErrType('Required field')
      }
      if (!adImage) {
        setErrImage('Required field')
      }
      if (type === 'I' && category === '') {
        setErrCategory('Required field')
      }
      if (MatchList.length !== 0 && Match === '') {
        setErrMatch('Required field')
      }
      if (!platform) {
        setErrPlatform('Required field')
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
        <h2>
          {isCreate ? 'Add Popup Ad' : 'Edit Popup Ad'}
        </h2>
        <Form>
          <FormGroup>
          <div className="theme-image text-center">
            <div className="d-flex theme-photo">
              <div className="theme-img">
                <img className='custom-img' src={adImage ? adImage.imageURL ? adImage.imageURL : url + adImage : documentPlaceholder} alt="themeImage" onError={onImageError} />
              </div>
            </div>
           <CustomInput hidden={adminPermission?.POPUP_ADS === 'R'} disabled={adminPermission?.POPUP_ADS === 'R'} accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" label="Add Theme image" onChange={event => handleChange(event, 'Image')} />{adminPermission?.POPUP_ADS === 'R' ? '' : <span className="required-field">*</span>}
           <p className="error-text">{errImage}</p>
          </div>
          </FormGroup>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input disabled={adminPermission?.POPUP_ADS === 'R'} name="title" placeholder="Enter Title" value={title} onChange={event => handleChange(event, 'Title')} />
          </FormGroup>
          <FormGroup>
            <Label for="type">Type <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.POPUP_ADS === 'R'} type="select" name="type" className="form-control" value={type} onChange={event => handleChange(event, 'Type')}>
              <option value=''>Select type</option>
              <option value="I">Internal</option>
              <option value="E">External</option>
            </CustomInput>
            <p className="error-text">{errType}</p>
          </FormGroup>
          {type === 'E'
            ? <FormGroup>
            <Label for="Name">Link <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.POPUP_ADS === 'R'} name="Link" placeholder="Enter Link" value={Link} onChange={event => handleChange(event, 'Link')} />
            <p className="error-text">{errLink}</p>
          </FormGroup>
            : ''}
          {type === 'I'
            ? <FormGroup>
            <Label>Sports <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.POPUP_ADS === 'R'} type="select" name="category" className="form-control" value={category} onChange={event => handleChange(event, 'SportsType')}>
              <option value=''>Select Sports</option>
              {sportsList && sportsList.length !== 0 && sportsList.map(sport =>
                <option key={sport._id} value={sport.sName}>{sport.sName}</option>)}
            </CustomInput>
            <p className="error-text">{errCategory}</p>
          </FormGroup>
            : ''}

        {type === 'I' && category && <FormGroup>
          <Label>Match List <span className="required-field">*</span></Label>
          {MatchList && MatchList.length === 0
            ? <InputGroupText>No Upcoming Match Available</InputGroupText>
            : MatchList && MatchList.length !== 0
              ? <CustomInput disabled={adminPermission?.POPUP_ADS === 'R'} type="select" name="match" className="form-control" value={Match} onChange={event => handleChange(event, 'Match')}>
            <option value=''>Select Match</option>
            {MatchList.map(match =>
              <option key={match._id} value={match._id}>{match.sName}</option>)}
          </CustomInput>
              : ''}
          <p className="error-text">{errMatch}</p>
        </FormGroup>}

        {type === 'I' && category && Match && MatchList.length !== 0 && <FormGroup>
          <Label>League List</Label>
          {LeagueList && LeagueList.length === 0
            ? <InputGroupText>No League Available</InputGroupText>
            : LeagueList && LeagueList.length !== 0
              ? <CustomInput disabled={adminPermission?.POPUP_ADS === 'R'} type="select" name="league" className="form-control" value={League} onChange={event => handleChange(event, 'League')}>
            <option value=''>Select League</option>
            {LeagueList.map(league =>
              <option key={league._id} value={league._id}>{league.sName}</option>)}
          </CustomInput>
              : ''}
        </FormGroup>}
        <FormGroup>
          <Label for="platform">Platform <span className="required-field">*</span></Label>
          <CustomInput disabled={adminPermission?.POPUP_ADS === 'R'} type="select" name="type" className="form-control" value={platform} onChange={event => handleChange(event, 'Platform')}>
            <option value=''>Select Platform</option>
            <option value="ALL">All</option>
            <option value="W">Web</option>
            <option value="A">Android</option>
            <option value="I">iOS</option>
          </CustomInput>
          <p className="error-text">{errPlatform}</p>
          </FormGroup>
          <FormGroup>
          <Label>Status</Label>
          <div className="d-flex inline-input">
            <CustomInput disabled={adminPermission?.POPUP_ADS === 'R'} type="radio" id="bannerRadio1" name="bannerRadio" label="Active" onClick={event => handleChange(event, 'Status')} value="Y" checked={adStatus === 'Y'} />
            <CustomInput disabled={adminPermission?.POPUP_ADS === 'R'} type="radio" id="bannerRadio2" name="bannerRadio" label="InActive" onClick={event => handleChange(event, 'Status')} value="N" checked={adStatus !== 'Y'} />
          </div>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.POPUP_ADS !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onSubmit}>{isCreate ? 'Add Pop Up Ad' : 'Save Changes'}</Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/popup-ads-management${page?.PopupAdsManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddPopupAd.defaultProps = {
  history: {}
}

AddPopupAd.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object
}
export default connect()(AddPopupAd)
