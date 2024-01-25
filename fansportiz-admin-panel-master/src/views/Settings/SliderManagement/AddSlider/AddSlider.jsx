import React, { useState, useEffect, useRef, Fragment } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  Button, UncontrolledAlert, Form, FormGroup, Label, Input, CustomInput, InputGroupText
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loading from '../../../../components/Loading'
import DecoupledEditor from 'ckeditor5-custom-build/build/ckeditor'
import CKEditor from '@ckeditor/ckeditor5-react'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { addBanner, getBannerDetails, updateBanner } from '../../../../actions/banner'
import { alertClass, isNumber, modalMessageFunc, verifyLength, verifyUrl } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getSportsList } from '../../../../actions/sports'
import { getMatchList } from '../../../../actions/match'
import { getBannerMatchLeagueList } from '../../../../actions/matchleague'

function AddSliderForm (props) {
  const { match } = props
  const [place, setPlace] = useState('')
  const [placeErr, setPlaceErr] = useState('')
  const [Link, setLink] = useState('')
  const [Description, setDescription] = useState('')
  const [bannerType, setBannerType] = useState('')
  const [screen, setScreen] = useState('')
  const [screenErr, setScreenErr] = useState('')
  const [bannerErr, setBannerErr] = useState('')
  const [errLink, setErrLink] = useState('')
  const [errDescription, setErrDescription] = useState('')
  const [bannerImage, setbannerImage] = useState('')
  const [errImage, setErrImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [bannerId, setbannerId] = useState('')
  const [sportsType, setSportsType] = useState('')
  const [MatchList, setMatchList] = useState([])
  const [Match, setMatch] = useState('')
  const [LeagueList, setLeagueList] = useState([])
  const [League, setLeague] = useState('')
  const [position, setPosition] = useState(0)
  const [errSportsType, setErrSportsType] = useState('')
  const [errMatch, setErrMatch] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [close, setClose] = useState(false)
  const [bannerStatus, setBannerStatus] = useState('N')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const bannerDetails = useSelector(state => state.banner.bannerDetails)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.banner.resStatus)
  const resMessage = useSelector(state => state.banner.resMessage)
  const sportsList = useSelector(state => state.sports.sportsList)
  const matchList = useSelector(state => state.match.matchList)
  const MatchLeagueList = useSelector(state => state.matchleague.bannerMatchLeagueList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, bannerDetails, bannerType, screen, sportsType, Match, matchList, League, LeagueList }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = bannerDetails && previousProps.bannerDetails !== bannerDetails && bannerDetails.sLink === Link && bannerDetails.eType === bannerType && bannerDetails?.nPosition === parseInt(position) && bannerDetails.sDescription === Description && (bannerDetails.iMatchId ? bannerDetails.iMatchId : Match === '') && (bannerDetails.iMatchLeagueId ? bannerDetails.iMatchLeagueId : League === '') && bannerDetails.eStatus === bannerStatus && bannerDetails.eScreen === screen && bannerDetails.sImage === bannerImage && bannerDetails.ePlace === place

  useEffect(() => {
    if (match.params.id) {
      dispatch(getBannerDetails(match.params.id, token))
      setbannerId(match.params.id)
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
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          props.history.push('/settings/slider-management', { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
            dispatch(getBannerDetails(match.params.id, token))
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
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.screen !== screen) {
      if (screen === 'CR') {
        dispatch(getSportsList(token))
        setLoading(true)
      }
    }
    if (sportsList) {
      setLoading(false)
    }
    return () => {
      previousProps.screen = screen
    }
  }, [screen, sportsList])

  useEffect(() => {
    if (sportsType && previousProps.sportsType !== sportsType) {
      const data = { start: 0, limit: 10, sort: 'dCreatedAt', order: 'desc', search: '', filter: 'U', startDate: '', endDate: '', sportsType, provider: '', season: '', format: '', token }
      dispatch(getMatchList(data))
      setLoading(true)
    }
    if (matchList) {
      setLoading(false)
    }
    return () => {
      previousProps.sportsType = sportsType
      previousProps.matchList = matchList
    }
  }, [sportsType, matchList])

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
    if (previousProps.bannerDetails !== bannerDetails) {
      if (bannerDetails) {
        setPlace(bannerDetails.ePlace)
        setBannerType(bannerDetails.eType)
        setLink(bannerDetails.sLink)
        setScreen(bannerDetails.eScreen)
        setbannerImage(bannerDetails.sImage)
        setDescription(bannerDetails.sDescription)
        setBannerStatus(bannerDetails.eStatus)
        setSportsType(bannerDetails.eCategory ? bannerDetails.eCategory : '')
        setMatch(bannerDetails.iMatchId ? bannerDetails.iMatchId : '')
        setLeague(bannerDetails.iMatchLeagueId ? bannerDetails.iMatchLeagueId : '')
        setPosition(bannerDetails.nPosition ? bannerDetails.nPosition : 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.bannerDetails = bannerDetails
    }
  }, [bannerDetails])

  function handleChange (event, type) {
    switch (type) {
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
      case 'Description':
        if (verifyLength(event.target.value, 1)) {
          setErrDescription('')
        } else {
          setErrDescription('Required field')
        }
        setDescription(event.target.value)
        break
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setbannerImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Status':
        setBannerStatus(event.target.value)
        break
      case 'Place':
        if (!event.target.value) {
          setPlaceErr('Required field')
        } else {
          setPlaceErr('')
        }
        setPlace(event.target.value)
        break
      case 'Type':
        if (event.target.value === 'S') {
          setScreen('D')
          setLink('')
          setBannerErr('')
          if (errImage || errDescription) {
            setErrImage('')
            setErrDescription('')
          }
        } else if (event.target.value === 'L') {
          setBannerErr('')
          setScreen('')
          if (errImage || errDescription) {
            setErrImage('')
            setErrDescription('')
            setErrLink('')
          }
        } else {
          setBannerErr('Required field')
          setLink('')
          setScreen('')
        }
        setBannerType(event.target.value)
        break
      case 'Screen':
        if (!event.target.value) {
          setScreenErr('Required field')
        } else {
          setScreenErr('')
        }
        setScreen(event.target.value)
        break
      case 'SportsType':
        if (verifyLength(event.target.value, 1)) {
          setErrSportsType('')
        } else {
          setErrSportsType('Required field')
        }
        setSportsType(event.target.value)
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
      case 'Position':
        if (isNumber(event.target.value) || !event.target.value) {
          setPosition(event.target.value)
        }
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
    if (bannerType === 'L') {
      verify = (verifyLength(place, 1) && verifyLength(Link, 1) && verifyLength(Description, 1) && bannerImage && !errLink && !errDescription)
    } else if (bannerType === 'S' && screen === 'CR') {
      verify = verifyLength(place, 1) && verifyLength(Description, 1) && bannerImage && sportsType && Match
    } else {
      verify = (verifyLength(place, 1) && verifyLength(Description, 1) && bannerImage && !errDescription)
    }

    if (verify) {
      if (isCreate) {
        const addBannerData = {
          place, Link, bannerType, Description, bannerStatus, screen, bannerImage, sportsType, Match, League, position, token
        }
        dispatch(addBanner(addBannerData))
      } else {
        const updateBannerData = {
          place, bannerId, Link, bannerType, Description, bannerStatus, screen, bannerImage, sportsType, Match, League, position, token
        }
        dispatch(updateBanner(updateBannerData))
      }
      setLoading(true)
    } else {
      if (!bannerType) {
        setBannerErr('Required field')
      }
      if (!place) {
        setPlaceErr('Required field')
      }
      if (bannerType === 'L' && !verifyLength(Link, 1)) {
        setErrLink('Required field')
      }
      if (!verifyLength(Description, 1)) {
        setErrDescription('Required field')
      }
      if (!bannerImage) {
        setErrImage('Required field')
      }
      if (sportsType === '') {
        setErrSportsType('Required field')
      }
      if (MatchList.length !== 0 && Match === '') {
        setErrMatch('Required field')
      }
    }
  }

  function onEditorChange (evt, editor) {
    if (verifyLength(editor.getData(), 1)) {
      setErrDescription('')
    } else {
      setErrDescription('Required field')
    }
    setDescription(editor.getData())
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
          {isCreate ? 'Add Slider' : !isEdit ? 'Edit Slider' : 'View Details'}
        </h2>
        <Form>
          <FormGroup>
          <div className="theme-image text-center">
            <div className="d-flex theme-photo">
              <div className="theme-img">
                <img className='custom-img' src={bannerImage ? bannerImage.imageURL ? bannerImage.imageURL : url + bannerImage : documentPlaceholder} alt="themeImage" onError={onImageError} />
              </div>
            </div>
           {((Auth && Auth === 'SUPER') || (adminPermission?.BANNER === 'W')) &&
            <div>
              <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" label="Add Theme image" onChange={event => handleChange(event, 'Image')} />
              <span className="required-field">*</span>
            </div>}
           <p className="error-text">{errImage}</p>
           <p>Note : Please upload an image of 16:9 resolution</p>
          </div>
          </FormGroup>
          <FormGroup>
            <Label for="place">Place <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.BANNER === 'R'} type="select" name="place" className="form-control" value={place} onChange={event => handleChange(event, 'Place')}>
              <option value=''>Select place</option>
              <option value="H">Home</option>
              <option value="D">Deposit</option>
            </CustomInput>
           <p className="error-text">{placeErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="type">Type <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.BANNER === 'R'} type="select" name="type" className="form-control" value={bannerType} onChange={event => handleChange(event, 'Type')}>
              <option value=''>Select type</option>
              <option value="L">Link</option>
              <option value="S">Screen</option>
            </CustomInput>
           <p className="error-text">{bannerErr}</p>
          </FormGroup>
          {bannerType === 'L'
            ? <FormGroup>
            <Label for="Name">Link <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.BANNER === 'R'} name="Link" placeholder="Enter Link" value={Link} onChange={event => handleChange(event, 'Link')} />
            <p className="error-text">{errLink}</p>
          </FormGroup>
            : <FormGroup>
            <Label for="type">Screen <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.BANNER === 'R'} type="select" name="screen" className="form-control" value={screen} onChange={event => handleChange(event, 'Screen')}>
              <option value=''>Select Screen</option>
              <option value="D">Deposit</option>
              <option value="S">Share</option>
              <option value='CR'>Contest Redirect</option>
            </CustomInput>
            <p className="error-text">{screenErr}</p>
          </FormGroup>}

          { screen === 'CR' &&
          <FormGroup>
            <Label>Sports <span className="required-field">*</span></Label>
            <CustomInput disabled={adminPermission?.BANNER === 'R'} type="select" name="sportsType" className="form-control" value={sportsType} onChange={event => handleChange(event, 'SportsType')}>
              <option value=''>Select Sports</option>
              {sportsList && sportsList.length !== 0 && sportsList.map(sport =>
                <option key={sport._id} value={sport.sName}>{sport.sName}</option>)}
            </CustomInput>
            <p className="error-text">{errSportsType}</p>
          </FormGroup>}

        {screen === 'CR' && sportsType && <FormGroup>
          <Label>Match List <span className="required-field">*</span></Label>
          {MatchList && MatchList.length === 0
            ? <InputGroupText>No Upcoming Match Available</InputGroupText>
            : MatchList && MatchList.length !== 0
              ? <CustomInput disabled={adminPermission?.BANNER === 'R'} type="select" name="match" className="form-control" value={Match} onChange={event => handleChange(event, 'Match')}>
            <option value=''>Select Match</option>
            {MatchList.map(data =>
              <option key={data._id} value={data._id}>{data.sName}</option>)}
          </CustomInput>
              : ''}
          <p className="error-text">{errMatch}</p>
        </FormGroup>}

        {screen === 'CR' && sportsType && Match && MatchList.length !== 0 && <FormGroup>
          <Label>League List</Label>
          {LeagueList && LeagueList.length === 0
            ? <InputGroupText>No League Available</InputGroupText>
            : LeagueList && LeagueList.length !== 0
              ? <CustomInput disabled={adminPermission?.BANNER === 'R'} type="select" name="league" className="form-control" value={League} onChange={event => handleChange(event, 'League')}>
            <option value=''>Select League</option>
            {LeagueList.map(league =>
              <option key={league._id} value={league._id}>{league.sName}</option>)}
          </CustomInput>
              : ''}
        </FormGroup>}

        <FormGroup>
            <Label for="position">Position</Label>
            <Input disabled={adminPermission?.BANNER === 'R'} name="position" placeholder="Position" value={position} onChange={event => handleChange(event, 'Position')} />
          </FormGroup>

          <FormGroup>
            <Label for="Info">Description <span className="required-field">*</span></Label>
            <CKEditor
              onInit={(editor) => {
                editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement())
              }}
              config={{
                placeholder: 'Enter Description',
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
              data={Description}
              onChange={onEditorChange}
              disabled={adminPermission?.BANNER === 'R'}
            />
            {/* <Input disabled={adminPermission?.BANNER === 'R'} type="textarea" name="Description" placeholder="Enter Description" value={Description} onChange={event => handleChange(event, 'Description')} /> */}
            <p className="error-text">{errDescription}</p>
          </FormGroup>
          <FormGroup>
          <Label>Status</Label>
          <div className="d-flex inline-input">
            <CustomInput disabled={adminPermission?.BANNER === 'R'} type="radio" id="bannerRadio1" name="bannerRadio" label="Active" onClick={event => handleChange(event, 'Status')} value="Y" checked={bannerStatus === 'Y'} />
            <CustomInput disabled={adminPermission?.BANNER === 'R'} type="radio" id="bannerRadio2" name="bannerRadio" label="InActive" onClick={event => handleChange(event, 'Status')} value="N" checked={bannerStatus !== 'Y'} />
          </div>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.BANNER !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onSubmit}>{isCreate ? 'Add Slider' : 'Save Changes'}</Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/slider-management${page?.SliderManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddSliderForm.defaultProps = {
  history: {}
}

AddSliderForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object
}
export default connect()(AddSliderForm)
