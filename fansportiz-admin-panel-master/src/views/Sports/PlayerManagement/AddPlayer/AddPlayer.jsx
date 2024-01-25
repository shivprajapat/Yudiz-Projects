import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  FormGroup, Input, Label, Button, CustomInput, Form, UncontrolledAlert, InputGroupText
} from 'reactstrap'
import { NavLink, useHistory } from 'react-router-dom'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import { verifyLength, withoutSpace, isFloat, modalMessageFunc, alertClass } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import Loading from '../../../../components/Loading'
import PropTypes from 'prop-types'
import removeImg from '../../../../assets/images/remove_img.svg'

function AddPlayer (props) {
  const {
    AddNewPlayer, match, gameCategory, cancelLink, PlayerDetails, UpdatePlayer, playerRoleList
  } = props

  const history = useHistory()
  const [playerImage, setplayerImage] = useState('')
  const [PlayerPoint, setPlayerPoint] = useState(0)
  const [PlayerName, setPlayerName] = useState('')
  const [playerKey, setplayerKey] = useState('')
  const [provider, setProvider] = useState('')
  const [errPlayerKey, seterrPlayerKey] = useState('')
  const [errPlayerName, seterrPlayerName] = useState('')
  const [errPlayerPoint, seterrPlayerPoint] = useState('')
  const [playerRoleErr, setPlayerRoleErr] = useState('')
  const [PlayerRole, setPlayerRole] = useState('')
  const [GameCategory, setGameCategory] = useState('')
  const [errImage, setErrImage] = useState('')
  const [url, setUrl] = useState('')
  const [errPlayerRole, setErrPlayerRole] = useState('')
  const [PlayerId, setPlayerId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const dispatch = useDispatch()
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.player.resStatus)
  const resMessage = useSelector(state => state.player.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ playerRoleList, PlayerDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const submitDisable = PlayerDetails && previousProps.PlayerDetails !== PlayerDetails && PlayerDetails.sName === PlayerName && PlayerDetails.sKey === playerKey && PlayerDetails.sImage === playerImage && PlayerDetails.eRole === PlayerRole && ((PlayerDetails?.nFantasyCredit || 0) === parseFloat(PlayerPoint))

  useEffect(() => {
    if (match.params.id) {
      setPlayerId(match.params.id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
  }, [])

  useEffect(() => {
    gameCategory && setGameCategory(gameCategory)
  }, [gameCategory])

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
          history.push(`${props.cancelLink}`, { message: resMessage })
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
    if (previousProps.PlayerDetails !== PlayerDetails) {
      if (PlayerDetails) {
        setplayerImage(PlayerDetails.sImage)
        setPlayerPoint(PlayerDetails.nFantasyCredit ? PlayerDetails.nFantasyCredit : 0)
        setPlayerName(PlayerDetails.sName)
        setplayerKey(PlayerDetails.sKey)
        setPlayerRole(PlayerDetails.eRole)
        setProvider(PlayerDetails.eProvider ? PlayerDetails.eProvider : '--')
        setLoading(false)
      }
    }
    return () => {
      previousProps.PlayerDetails = PlayerDetails
    }
  }, [PlayerDetails])

  function Submit (e) {
    e.preventDefault()
    if (verifyLength(PlayerName, 1) && isFloat(PlayerPoint) && verifyLength(playerKey, 1) && verifyLength(PlayerRole, 1) && !errPlayerName && !errPlayerPoint && !errPlayerKey && !playerRoleErr) {
      if (isCreate) {
        AddNewPlayer(playerKey, PlayerName, playerImage, PlayerPoint, PlayerRole)
      } else {
        UpdatePlayer(PlayerId, playerKey, PlayerName, playerImage, PlayerPoint, PlayerRole)
      }
      setLoading(true)
    } else {
      if (!verifyLength(PlayerName, 1)) {
        seterrPlayerName('Required field')
      }
      if (!verifyLength(playerKey, 1)) {
        seterrPlayerKey('Required field')
      }
      if (!isFloat(PlayerPoint)) {
        seterrPlayerPoint('Required field')
      }
      if (!PlayerRole) {
        setErrPlayerRole('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Image':
        if (event.target.files[0].type.includes('image/gif')) {
          setErrImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0].type.includes('image') && (!event.target.files[0].type.includes('image/gif')) && event.target.files[0].size !== 0) {
          setplayerImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'PlayerName':
        if (verifyLength(event.target.value, 1)) {
          seterrPlayerName('')
        } else {
          seterrPlayerName('Required field')
        }
        setPlayerName(event.target.value)
        break
      case 'PlayerKey':
        if (verifyLength(event.target.value, 1)) {
          if (withoutSpace(event.target.value)) {
            seterrPlayerKey('No space')
          } else {
            seterrPlayerKey('')
          }
        } else {
          seterrPlayerKey('Required field')
        }
        setplayerKey(event.target.value)
        break
      case 'PlayerPoint':
        if (isFloat(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrPlayerPoint('')
          } else {
            seterrPlayerPoint('Required field')
          }
          event.target.value > 10 ? seterrPlayerPoint('Point should not be greater than 10!') : setPlayerPoint(event.target.value)
        }
        break
      case 'PlayerRole':
        if (verifyLength(event.target.value, 1)) {
          setPlayerRoleErr('')
        } else {
          setPlayerRoleErr('Required field')
        }
        setPlayerRole(event.target.value)
        break
      case 'GameCategory':
        setGameCategory(event.target.value)
        break
      case 'RemoveImage':
        setplayerImage('')
        break
      default:
        break
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
          {isCreate ? 'Add Player' : !isEdit ? 'Edit Player' : 'Player Details'}
        </h2>
        <Form>
          <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                  <img className='custom-img' src={playerImage ? playerImage.imageURL ? playerImage.imageURL : url + playerImage : documentPlaceholder} alt="PlayerImage" onError={onImageError} />
                  {playerImage && ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                </div>
              </div>
              {((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER === 'W')) &&
              <CustomInput
                accept="image/png, image/jpg, image/jpeg"
                type="file"
                id="examplePlayerImageBrowser"
                name="PlayerImage"
                label="Add Player Image"
                onChange={event => handleChange(event, 'Image')}
              />}
              <p className="error-text">{errImage}</p>
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="PlayerName">Player Name <span className="required-field">*</span></Label>
            <Input
                disabled={adminPermission?.PLAYER === 'R'}
              type="text"
              id="PlayerName"
              placeholder="Enter Player Name"
              value={PlayerName}
              onChange={event => handleChange(event, 'PlayerName')}
            />
            <p className="error-text">{errPlayerName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="Key">Player Key <span className="required-field">*</span></Label>
            <Input
              type="text"
              name="Key"
              disabled={adminPermission?.PLAYER === 'R'}
              placeholder="Enter Player Key"
              value={playerKey}
              onChange={event => handleChange(event, 'PlayerKey')}
            />
            <p className="error-text">{errPlayerKey}</p>
          </FormGroup>
          <FormGroup>
            <Label for="PlayerPoint">Player Credit Points <span className="required-field">*</span></Label>
            <Input
              disabled={adminPermission?.PLAYER === 'R'}
              type="number"
              id="PlayerPoint"
              placeholder="Enter Player Point"
              value={PlayerPoint}
              onChange={event => handleChange(event, 'PlayerPoint')}
            />
            <p className="error-text">{errPlayerPoint}</p>
          </FormGroup>
          <FormGroup>
            <Label for="PlayerRole">Player Role <span className="required-field">*</span></Label>
            <CustomInput
              disabled={adminPermission?.PLAYER === 'R'}
              type="select"
              name="select"
              id="PlayerRole"
              value={PlayerRole}
              onChange={event => handleChange(event, 'PlayerRole')}
            >
              <option value=''>Select Player Role</option>
              {
                playerRoleList && previousProps.playerRoleList !== playerRoleList && playerRoleList.length !== 0 && playerRoleList.map((data, i) => {
                  return (
                    <option value={data.sName} key={data.sName}>{data.sName === 'ALLR'
                      ? 'All Rounder'
                      : data.sName === 'BATS'
                        ? 'Batsman'
                        : data.sName === 'BWL'
                          ? 'Bowler'
                          : data.sName === 'WK'
                            ? 'Wicket Keeper'
                            : data.sName === 'FWD'
                              ? 'Forwards'
                              : data.sName === 'GK'
                                ? 'Goal Keeper'
                                : data.sName === 'DEF'
                                  ? 'Defender'
                                  : data.sName === 'RAID'
                                    ? 'Raider'
                                    : data.sName === 'MID'
                                      ? 'Mid fielders'
                                      : data.sName === 'PG'
                                        ? 'Point-Gaurd'
                                        : data.sName === 'SG'
                                          ? 'Shooting-Gaurd'
                                          : data.sName === 'SF'
                                            ? 'Small-Forwards'
                                            : data.sName === 'PF'
                                              ? 'Power-Forwards'
                                              : data.sName === 'C'
                                                ? 'Centre'
                                                : data.sName === 'IF' ? 'Infielder' : data.sName === 'OF' ? 'Outfielder' : data.sName === 'P' ? 'Pitcher' : data.sName === 'CT' ? 'Catcher' : '--'} {`(${data.sName})`}</option>
                  )
                })
              }
              <p className="error-text">{playerRoleErr}</p>
            </CustomInput>
            <p className="error-text">{errPlayerRole}</p>
          </FormGroup>
          {!isCreate && <FormGroup>
            <Label for="provider">Provider</Label>
            <InputGroupText>{provider}</InputGroupText>
          </FormGroup>}
          <FormGroup>
            <Label for="GameCategory">Game Category </Label>
            <InputGroupText>{GameCategory}</InputGroupText>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'R')) &&
            (
              <Button
                className="theme-btn full-btn"
                onClick={Submit}
                disabled={submitDisable}
              >
                {isCreate ? 'Add Player' : !isEdit ? 'Save Changes' : 'Edit Player'}
              </Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`${cancelLink}${page?.PlayerManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddPlayer.propTypes = {
  AddNewPlayer: PropTypes.func,
  match: PropTypes.object,
  gameCategory: PropTypes.string,
  cancelLink: PropTypes.string,
  PlayerDetails: PropTypes.object,
  UpdatePlayer: PropTypes.func,
  playerRoleList: PropTypes.array,
  history: PropTypes.object,
  getPlayerDetailsFunc: PropTypes.func
}

export default AddPlayer
