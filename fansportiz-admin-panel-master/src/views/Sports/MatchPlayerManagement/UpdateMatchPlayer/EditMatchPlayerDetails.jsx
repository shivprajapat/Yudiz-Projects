import React, { useState, useRef, useEffect } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Link, NavLink, useHistory } from 'react-router-dom'
import {
  FormGroup, Input, CustomInput, Label, Button, Form, UncontrolledAlert, InputGroup, InputGroupText, InputGroupAddon
} from 'reactstrap'
import PropTypes from 'prop-types'
import { verifyLength, isNumber, modalMessageFunc, alertClass } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import editIcon from '../../../../assets/images/edit-icon.svg'
import { getUrl } from '../../../../actions/url'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import removeImg from '../../../../assets/images/remove_img.svg'

const animatedComponents = makeAnimated()

function EditMatchPlayerDetails (props) {
  const {
    matchPlayerDetails, UpdateMatchPlayer, playerRoleList, matchDetails, getMatchDetails, getList, getPlayersTotalCountFunc, AddNewMatchPlayer
  } = props
  const [playerOptions, setPlayerOptions] = useState('')
  const [playerImage, setPlayerImage] = useState('')
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState([])
  const [playerId, setPlayerId] = useState([])
  const [playerIdErr, setPlayerIdErr] = useState('')
  const [playerImgErr, setPlayerImgErr] = useState('')
  const [seasonPoints, setSeasonPoints] = useState(0)
  const [scorePoints, setScorePoints] = useState(0)
  const [credits, setCredits] = useState(0)
  const [playerRole, setPlayerRole] = useState('')
  const [playerRoleErr, setPlayerRoleErr] = useState('')
  const [TeamName, setTeamName] = useState('')
  const [teamErr, setTeamErr] = useState('')
  const [MatchName, setMatchName] = useState('')
  const [show, setshow] = useState('N')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [playersTotal, setPlayersTotal] = useState('')
  const [playersActivePageNo, setPlayersActivePageNo] = useState(1)
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.matchplayer.resStatus)
  const resMessage = useSelector(state => state.matchplayer.resMessage)
  const matchResStatus = useSelector(state => state.match.resStatus)
  const matchResMessage = useSelector(state => state.match.resMessage)
  const playerList = useSelector(state => state.player.playersList)
  const isSearch = useSelector(state => state.player.isSearch)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const playersTotalCount = useSelector(state => state.player.playersTotalCount)
  const previousProps = useRef({ isSearch, playersTotalCount, matchPlayerDetails, resStatus, resMessage, matchDetails, playerRoleList, playerList, search }).current
  const [modalMessage, setModalMessage] = useState(false)
  const [matchPlayerId, setmatchPlayerId] = useState('')
  const history = useHistory()
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const updateDisable = matchPlayerDetails && previousProps.matchPlayerDetails !== matchPlayerDetails && matchPlayerDetails.iPlayerId === playerId && (matchPlayerDetails.bShow === (show === 'Y')) && matchPlayerDetails.iTeamId === TeamName && matchPlayerDetails.nSeasonPoints === parseFloat(seasonPoints)

  useEffect(() => {
    const { match } = props
    if (match.params.id1 && match.params.id2) {
      setmatchPlayerId(match.params.id2)
      setIsCreate(false)
      getMatchDetails(match.params.id1)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(getUrl('media'))
    const startFrom = 0
    const limit = 20
    getList(startFrom, limit, 'sName', 'asc', '', '')
    getPlayersTotalCountFunc('', '')
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
          history.push(`${props.cancelLink}`, { message: resMessage })
        } else {
          history.push(`${props.cancelLink}${page?.MatchPlayerManagement || ''}`, { message: resMessage })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.matchResMessage !== matchResMessage) {
      if (matchResMessage) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchResMessage = matchResMessage
    }
  }, [matchResStatus, matchResMessage])

  useEffect(() => {
    if (matchPlayerDetails) {
      if (previousProps.matchPlayerDetails !== matchPlayerDetails) {
        setCredits(matchPlayerDetails.nFantasyCredit ? matchPlayerDetails.nFantasyCredit : 0)
        setPlayerImage(matchPlayerDetails.sImage)
        setTeamName(matchPlayerDetails.iTeamId)
        setPlayerRole(matchPlayerDetails.eRole)
        setScorePoints(matchPlayerDetails.nScoredPoints ? matchPlayerDetails.nScoredPoints : 0)
        setSeasonPoints(matchPlayerDetails.nSeasonPoints || 0)
        setshow(matchPlayerDetails.bShow === true ? 'Y' : 'N')
        setPlayerId(matchPlayerDetails.sName ? { label: matchPlayerDetails?.sName || '', value: matchPlayerDetails?.iPlayerId || '' } : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchPlayerDetails = matchPlayerDetails
    }
  }, [matchPlayerDetails])

  useEffect(() => {
    if (matchDetails) {
      const arr = []
      if (matchDetails && matchDetails.oAwayTeam && matchDetails.oAwayTeam.iTeamId && matchDetails.oHomeTeam && matchDetails.oHomeTeam.iTeamId) {
        const obj = {
          value: matchDetails.oAwayTeam.iTeamId,
          label: matchDetails.oAwayTeam.sName
        }
        const obj2 = {
          value: matchDetails.oHomeTeam.iTeamId,
          label: matchDetails.oHomeTeam.sName
        }
        arr.push(obj, obj2)
      }
      setOptions(arr)

      if (matchDetails && matchDetails.sName) {
        setMatchName(matchDetails.sName)
      }
    }

    return () => {
      previousProps.matchDetails = matchDetails
    }
  }, [matchDetails])

  useEffect(() => {
    if (previousProps.playerList !== playerList || previousProps.isSearch !== isSearch) {
      const playerOps = isSearch ? [] : [...playerOptions]
      playerList?.results?.map(data => {
        const obj = {
          label: data.sName,
          value: data._id
        }
        playerOps.push(obj)
        return playerOps
      })
      setPlayerOptions(playerOps)
      setLoading(false)
    }
    if (previousProps.playersTotalCount !== playersTotalCount && playersTotalCount) {
      setPlayersTotal(playersTotalCount?.count ? playersTotalCount?.count : 0)
    }
    return () => {
      previousProps.playerList = playerList
      previousProps.playersTotalCount = playersTotalCount
      previousProps.isSearch = isSearch
    }
  }, [playerList, playersTotalCount, isSearch])

  useEffect(() => {
    const callSearchService = () => {
      const isValueNotInList = !(playerList?.results?.some(player => player.sName.toUpperCase().includes(search) || player.sName.toLowerCase().includes(search)))
      if (isValueNotInList) {
        const startFrom = 0
        getList(startFrom, 20, 'sName', 'asc', search, '')
        getPlayersTotalCountFunc(search, '')
        setLoading(true)
      }
    }
    if (previousProps.search !== search) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.search = search
      }
    }
    return () => {
      previousProps.search = search
    }
  }, [search])

  function Submit (e) {
    e.preventDefault()
    const addValidation = playerId && TeamName && show
    const updateValidation = playerId && TeamName && show && playerRole
    const validate = isCreate ? addValidation : updateValidation
    if (validate) {
      if (isCreate && show) {
        const aPlayers = playerId.map((item) => {
          return { sName: item.label, iPlayerId: item.value }
        })
        AddNewMatchPlayer(aPlayers, scorePoints, seasonPoints, TeamName, show)
      } else {
        UpdateMatchPlayer(playerId?.label, playerId?.value, playerImage, playerRole, credits, scorePoints, seasonPoints, TeamName, show, matchPlayerId)
      }
      setLoading(true)
    } else {
      if (playerId?.length === 0) {
        setPlayerIdErr('Required field')
      }
      if (!TeamName) {
        setTeamErr('Required field')
      }
      if (!playerRole) {
        setPlayerRoleErr('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'Image':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setPlayerImgErr('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPlayerImage({ imageURL: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setPlayerImgErr('')
        }
        break
      case 'Credits':
        if (parseFloat(event.target.value) || !event.target.value) {
          setCredits(event.target.value)
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
      case 'SeasonPoints':
        if (isNumber(event.target.value) || !event.target.value) {
          setSeasonPoints(event.target.value)
        }
        break
      case 'Player':
        if (event !== null && verifyLength(event, 1)) {
          setPlayerIdErr('')
        } else {
          setPlayerIdErr('Required field')
        }
        if (event === null) {
          setSearch('')
          setPlayerOptions([])
          getList(0, 20, 'sName', 'asc', '', '')
          getPlayersTotalCountFunc('', '')
          setPlayerId('')
        } else {
          setPlayerId(event)
        }
        // if (event) {
        //   if (event.length >= 1) {
        //     setPlayerIdErr('')
        //     setPlayerId(event)
        //   } else {
        //     setPlayerIdErr('Required field')
        //   }
        // } else {
        //   setSearch('')
        //   setPlayerOptions([])
        //   getList(0, 20, 'sName', 'asc', '', '')
        //   getPlayersTotalCountFunc('', '')
        //   setPlayerId([])
        // }
        break
      case 'TeamName':
        if (verifyLength(event.target.value, 1)) {
          setTeamErr('')
        } else {
          setTeamErr('Required field')
        }
        setTeamName(event.target.value)
        break
      case 'show':
        setshow(event.target.value)
        break
      case 'RemoveImage':
        setPlayerImage('')
        break
      default:
        break
    }
  }

  // pagination for series field
  function onPlayerPagination () {
    const length = Math.ceil(playersTotal / 20)
    if (playersActivePageNo < length) {
      const start = playersActivePageNo * 20
      getList(start, 20, 'sName', 'asc', search, '')
      getPlayersTotalCountFunc(search, '')
      setPlayersActivePageNo(playersActivePageNo + 1)
    }
  }

  return (
    <main className="main-content">
      <section className="common-form-block">
        {
          modalMessage && message &&
          (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        {loading && <Loading />}
        <h2>
          {isCreate ? `Add Match Player (${MatchName})` : !isEdit ? `Edit Match Player (${MatchName})` : 'View Details'}
        </h2>
        <Form>
          {!isCreate && <FormGroup>
            <div className="theme-image text-center">
              <div className="d-flex theme-photo">
                <div className="theme-img">
                  <img
                    className='custom-img'
                    src={playerImage ? playerImage.imageURL ? playerImage.imageURL : url + playerImage : documentPlaceholder}
                    alt="themeImage"
                  />
                  {playerImage && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                </div>
              </div>
              {((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER === 'W')) &&
              <CustomInput
                accept="image/png, image/jpg, image/jpeg"
                type="file"
                id="exampleCustomFileBrowser"
                name="customFile"
                label="Add Theme image"
                onChange={event => handleChange(event, 'Image')}
              />}
            </div>
            <p className="error-text">{playerImgErr}</p>
          </FormGroup>}
          <FormGroup>
            <Label for="playerId">Player Name <span className="required-field">*</span></Label>
            <Select
              options={playerOptions}
              id='playerId'
              name='playerId'
              placeholder='Select Player'
              value={playerId}
              closeMenuOnSelect={false}
              onChange={selectedOption => handleChange(selectedOption, 'Player')}
              isDisabled={adminPermission?.MATCHPLAYER === 'R' || !isCreate}
              onInputChange={(value) => setSearch(value)}
              onMenuScrollToBottom={onPlayerPagination}
              controlShouldRenderValue={playerOptions}
              components={animatedComponents}
              isMulti={isCreate}
              isClearable
            />
            <p className="error-text">{playerIdErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="SeasonPoints">Player Season Points</Label>
            <Input
              disabled={adminPermission?.MATCHPLAYER === 'R'}
              type="text"
              id="SeasonPoints"
              placeholder="Enter Season Points"
              value={seasonPoints}
              onChange={event => handleChange(event, 'SeasonPoints')}
            />
          </FormGroup>
          <FormGroup>
            <Label for="TeamName">Team Name <span className="required-field">*</span></Label>
            <CustomInput
              disabled={adminPermission?.MATCHPLAYER === 'R'}
              type="select"
              name="teamName"
              id="tName"
              placeholder="Enter Teams name"
              value={TeamName}
              onChange={event => handleChange(event, 'TeamName')}
            >
              <option value=''>Select Team</option>
            {
                options && options.length !== 0 && options.map((data, i) => {
                  return (
                    <option key={data.value} value={data.value}>{data.label}</option>
                  )
                })
              }
            </CustomInput>
            <p className="error-text">{teamErr}</p>
          </FormGroup>
          {!isCreate && <FormGroup>
            <Label for="PlayerRole">{"Player's Role"} <span className="required-field">*</span></Label>
            <CustomInput
              disabled={adminPermission?.MATCHPLAYER === 'R'}
              type="select"
              name="select"
              id="PlayerRole"
              placeholder="Enter Player's Role"
              value={playerRole}
              onChange={event => handleChange(event, 'PlayerRole')}
            >
              <option value=''>Select Player Role</option>
              {
                playerRoleList && playerRoleList.length !== 0 && playerRoleList.map((data, i) => {
                  return (
                    <option key={data.sName} value={data.sName}>{data.sFullName}</option>
                  )
                })
              }
            </CustomInput>
            <p className="error-text">{playerRoleErr}</p>
          </FormGroup>}
          { !isCreate && <FormGroup>
            <Label for="credits">Credits</Label>
              <Input
                type="number"
                id="credits"
                placeholder="Enter Player's credit"
                value={credits}
                onChange={event => handleChange(event, 'Credits')}
              />
          </FormGroup>}
          <FormGroup>
            <Label for="phoneNumber">In Lineups</Label>
            <div className="d-flex inline-input">
              <CustomInput disabled={adminPermission?.MATCHPLAYER === 'R'} type="radio" id="themeRadio1" name="themeRadio" label="Yes" onClick={event => handleChange(event, 'show')} value="Y" checked={show === 'Y'} />
              <CustomInput disabled={adminPermission?.MATCHPLAYER === 'R'} type="radio" id="themeRadio2" name="themeRadio" label="No" onClick={event => handleChange(event, 'show')} value="N" checked={show !== 'Y'} />
            </div>
          </FormGroup>
          { !isCreate && <FormGroup>
            <Label for="scorePoints">Score Points</Label>
            <InputGroup>
              <Input
                disabled
                type="number"
                id="ScorePoint"
                placeholder="Enter Score Point"
                value={scorePoints}
                onChange={event => handleChange(event, 'ScorePoint')}
              />
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'N')) &&
                (
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <Link color="link" to={props.eScorePoint} className='ml-5'>
                      <img src={editIcon} alt="edit" className="mr-2 custom-img" />
                        Score Points
                      </Link>
                    </InputGroupText>
                  </InputGroupAddon>
                )
              }
            </InputGroup>
          </FormGroup>}
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'R')) &&
            (
              <Button className="theme-btn full-btn" onClick={Submit} disabled={updateDisable}>
                {isCreate ? 'Add Match Player ' : !isEdit ? 'Save Changes' : 'Edit Match Player'}
              </Button>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`${props.cancelLink}${page?.MatchPlayerManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

EditMatchPlayerDetails.propTypes = {
  location: PropTypes.object,
  matchPlayerDetails: PropTypes.object,
  AddNewMatchPlayer: PropTypes.func,
  // AddMultipleMatchPlayer: PropTypes.func,
  UpdateMatchPlayer: PropTypes.func,
  playerRoleList: PropTypes.array,
  matchDetails: PropTypes.object,
  getMatchDetails: PropTypes.func,
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  eScorePoint: PropTypes.string,
  getList: PropTypes.func,
  getPlayersTotalCountFunc: PropTypes.func
}
export default connect()(EditMatchPlayerDetails)
