import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Form, FormGroup, Label, Input, CustomInput, UncontrolledAlert, UncontrolledPopover, PopoverBody } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { isNumber, isPositive, verifyLength, isFloat, alertClass, modalMessageFunc } from '../../../helpers/helper'
import Loading from '../../../components/Loading'
import documentPlaceholder from '../../../assets/images/doc-placeholder.jpg'
import { getUrl } from '../../../actions/url'
import PropTypes from 'prop-types'
import infoIcon from '../../../assets/images/info2.svg'

function AddPrizeBreakUp (props) {
  const {
    AddNewLeaguePrice, UpdateLeaguePrice, LeaguePriceDetails, cancelLink, LeagueDetails, getLeaguePriceBreakupDetails, getLeagueDetailsFunc
  } = props
  const [Price, setPrice] = useState(0)
  const [RankFrom, setRankFrom] = useState(0)
  const [RankTo, setRankTo] = useState(0)
  const [RankType, setRankType] = useState('R')
  const [PrizeBreakupImage, setPrizeBreakupImage] = useState('')
  const [Extra, setExtra] = useState('')
  const [errPrice, seterrPrice] = useState('')
  const [errExtra, seterrExtra] = useState('')
  const [errImage, setErrImage] = useState('')
  const [errRankFrom, seterrRankFrom] = useState('')
  const [errRankTo, seterrRankTo] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const dispatch = useDispatch()

  const resStatus = useSelector(state => state.league.resStatus)
  const resMessage = useSelector(state => state.league.resMessage)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const previousProps = useRef({ LeaguePriceDetails, resStatus, resMessage }).current
  const updateDisable = LeaguePriceDetails && previousProps.LeaguePriceDetails !== LeaguePriceDetails && LeaguePriceDetails.aLeaguePrize[0] &&
          LeaguePriceDetails.aLeaguePrize[0].nPrize === parseInt(Price) && LeaguePriceDetails.aLeaguePrize[0].nRankFrom === parseInt(RankFrom) &&
          LeaguePriceDetails.aLeaguePrize[0].nRankTo === parseInt(RankTo) && LeaguePriceDetails.aLeaguePrize[0].eRankType === RankType &&
          LeaguePriceDetails.aLeaguePrize[0].sInfo === Extra && LeaguePriceDetails.aLeaguePrize[0].sImage === PrizeBreakupImage
  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    const { match } = props
    if (match.params.id1 && match.params.id2) {
      setLoading(true)
      setIsCreate(false)
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
            getLeaguePriceBreakupDetails()
            getLeagueDetailsFunc()
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
    if (previousProps.LeaguePriceDetails !== LeaguePriceDetails) {
      if (LeaguePriceDetails && LeaguePriceDetails.aLeaguePrize[0]) {
        setPrizeBreakupImage(LeaguePriceDetails.aLeaguePrize[0].sImage)
        setRankType(LeaguePriceDetails.aLeaguePrize[0].eRankType)
        setExtra(LeaguePriceDetails.aLeaguePrize[0].sInfo)
        setPrice(LeaguePriceDetails.aLeaguePrize[0].nPrize)
        setRankFrom(LeaguePriceDetails.aLeaguePrize[0].nRankFrom)
        setRankTo(LeaguePriceDetails.aLeaguePrize[0].nRankTo)
        setLoading(false)
      }
    }
    return () => {
      previousProps.LeaguePriceDetails = LeaguePriceDetails
    }
  }, [LeaguePriceDetails])

  function Submit (e) {
    e.preventDefault()
    const addValidation = isFloat(Price) && isNumber(RankFrom) && isNumber(RankTo) && isPositive(RankTo) && (parseInt(RankFrom) <= parseInt(RankTo)) && isPositive(RankFrom) && RankType && !errPrice && !errRankFrom && !errRankTo
    const validate = RankType === 'E' ? (addValidation && verifyLength(Extra, 1)) : (addValidation && (Price > 0))
    if (validate) {
      if (isCreate) {
        AddNewLeaguePrice(Price, RankFrom, RankTo, RankType, Extra, PrizeBreakupImage)
      } else {
        UpdateLeaguePrice(Price, RankFrom, RankTo, RankType, Extra, PrizeBreakupImage)
      }
    } else {
      if (RankType !== 'E' && isNaN(Price)) {
        seterrPrice('Enter number only')
      } else if (RankType !== 'E' && (!isFloat(Price) || Price <= 1)) {
        seterrPrice('Required field')
      }
      if (parseInt(RankTo) < parseInt(RankFrom)) {
        seterrRankTo('Rank To value should be greater than Rank From value')
      }
      if (!isPositive(RankFrom)) {
        seterrRankFrom('Required field')
      }
      if (!isPositive(RankTo)) {
        seterrRankTo('Required field')
      }
      if (!verifyLength(Extra, 1)) {
        seterrExtra('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'ImagePrizeBreakup':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPrizeBreakupImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Price':
        if (!event.target.value) {
          seterrPrice('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            seterrPrice('Enter number only')
          } else {
            seterrPrice('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          if (LeagueDetails?.bPoolPrize && event.target.value > 100) {
            seterrPrice('Value must be less than 100')
          } else {
            seterrPrice('')
          }
        }
        setPrice(event.target.value)
        break
      case 'RankFrom':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrRankFrom('')
          } else {
            seterrRankFrom('Required field')
          }
          setRankFrom(event.target.value)
          if (parseInt(RankTo) && parseInt(event.target.value) > parseInt(RankTo)) {
            seterrRankFrom('Rank From value should be less than Rank To value')
          } else if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            seterrRankFrom('Value must be less than WinnersCount')
          } else {
            seterrRankFrom('')
            seterrRankTo('')
          }
        }
        break
      case 'RankTo':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrRankTo('')
          } else {
            seterrRankTo('Required field')
          }
          setRankTo(event.target.value)
          if (parseInt(event.target.value) > LeagueDetails?.nWinnersCount) {
            seterrRankTo('Value must be less than WinnersCount')
          } else if (parseInt(RankFrom) > parseInt(event.target.value)) {
            seterrRankTo('Rank To value should be greater than Rank From value')
          } else {
            seterrRankTo('')
            seterrRankFrom('')
          }
        }
        break
      case 'Extra':
        if (verifyLength(event.target.value, 1)) {
          seterrExtra('')
        } else {
          seterrExtra('Required field')
        }
        setExtra(event.target.value)
        break
      case 'RankType':
        if (event.target.value === 'E') {
          setExtra('')
          setPrizeBreakupImage('')
          setPrice(0)
          seterrPrice('')
        }
        setRankType(event.target.value)
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
      return 'Add League Prize Breakup'
    }
    return !isEdit ? 'Edit League Prize Breakup' : 'View Details'
  }

  function button () {
    if (isCreate) {
      return 'Create League Prize Breakup'
    }
    return !isEdit ? 'Save Changes' : 'Edit League Prize Breakup'
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
          {heading()}
        </h2>
        <Form>
          <FormGroup>
              <Label for="Price">Prize <span className="required-field">*</span> <img className='custom-info' src={infoIcon} id='prize'></img>
              <UncontrolledPopover trigger="legacy" placement="bottom" target='prize'>
                <PopoverBody>
                  <p>When league have pool prize the prize money will be in percentage</p>
                </PopoverBody>
              </UncontrolledPopover>
            </Label>
              <Input name="Price" placeholder="Price" disabled={(RankType === 'E') || (adminPermission?.LEAGUE === 'R')} value={Price} onChange={event => handleChange(event, 'Price')} />
              <p className="error-text">{errPrice}</p>
          </FormGroup>
          <FormGroup>
              <Label for="RankFrom">Rank From <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} name="RankFrom" placeholder="Rank From" value={RankFrom} onChange={event => handleChange(event, 'RankFrom')} />
              <p className="error-text">{errRankFrom}</p>
          </FormGroup>
          <FormGroup>
              <Label for="RankTo">Rank To <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} name="RankTo" placeholder="RankTo" value={RankTo} onChange={event => handleChange(event, 'RankTo')} />
              <p className="error-text">{errRankTo}</p>
          </FormGroup>
          <FormGroup>
            <Label for="RankType"> Rank Type </Label>
            <CustomInput
              disabled={adminPermission?.LEAGUE === 'R'}
              type="select"
              name="select"
              id="RankType"
              value={RankType}
              onChange={event => handleChange(event, 'RankType')}
            >
              <option value="R"> RealMoney </option>
              <option value="B"> Bonus </option>
              {(!LeagueDetails?.bPoolPrize) && <option value="E"> Extra </option>}
            </CustomInput>
          </FormGroup>
          {
          RankType === 'E'
            ? (
            <div>
              <FormGroup>
              <Label for="ExtraField">Info <span className="required-field">*</span></Label>
                <Input disabled={adminPermission?.LEAGUE === 'R'} name="ExtraField" placeholder="Add Extra Field" value={Extra} onChange={event => handleChange(event, 'Extra')} />
                <p className="error-text">{errExtra}</p>
              </FormGroup>
              <FormGroup>
                <div className="theme-image text-center">
                  <div className="d-flex theme-photo">
                    <div className="theme-img">
                      <img src={PrizeBreakupImage ? PrizeBreakupImage.imageURL ? PrizeBreakupImage.imageURL : url + PrizeBreakupImage : documentPlaceholder} alt="themeImage" onError={onImageError} />
                    </div>
                  </div>
                {((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE === 'W')) &&
                <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" label="Add Prize Breakup image" onChange={event => handleChange(event, 'ImagePrizeBreakup')} />}
                  <p className="error-text">{errImage}</p>
                </div>
              </FormGroup>
            </div>
              )
            : null
          }
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')) &&
            (
              <Button className="theme-btn full-btn" onClick={Submit} disabled={updateDisable}>
                {button()}
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

AddPrizeBreakUp.propTypes = {
  AddNewLeaguePrice: PropTypes.object,
  UpdateLeaguePrice: PropTypes.object,
  LeaguePriceDetails: PropTypes.object,
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  history: PropTypes.object,
  LeagueDetails: PropTypes.object,
  getLeaguePriceBreakupDetails: PropTypes.func,
  getLeagueDetailsFunc: PropTypes.func
}

export default AddPrizeBreakUp
