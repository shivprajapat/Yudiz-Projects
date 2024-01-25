import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button, Form, FormGroup, Label, Input, UncontrolledAlert, CustomInput, InputGroupText
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { alertClass, isNumber, modalMessageFunc, verifyLength, verifyUrl } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import { getSportDetails, updateSport } from '../../../../actions/sports'
import PropTypes from 'prop-types'

function AddSport (props) {
  const { match } = props
  const [sportName, setSportName] = useState('')
  const [key, setKey] = useState('')
  const [position, setPosition] = useState('')
  const [Active, setActive] = useState('N')
  const [maxPlayerOneTeam, setMaxPlayerOneTeam] = useState(0)
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [scoreInfoLink, setScoreInfoLink] = useState('')
  const [scoreInfoTabName, setScoreInfoTabName] = useState('')
  const [errSportName, setErrSportName] = useState('')
  const [errKey, setErrKey] = useState('')
  const [errPosition, setErrPosition] = useState('')
  const [totalPlayerErr, setTotalPlayerErr] = useState('')
  const [maxPlayerOneTeamErr, setMaxPlayerOneTeamErr] = useState('')
  const [scoreInfoLinkErr, setScoreInfoLinkErr] = useState('')
  const [scoreInfoTabNameErr, setScoreInfoTabNameErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const sportDetails = useSelector(state => state.sports.sportDetails)
  const resStatus = useSelector(state => state.sports.resStatus)
  const resMessage = useSelector(state => state.sports.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, sportDetails }).current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = sportDetails && previousProps.sportDetails !== sportDetails && sportDetails.sName === sportName && sportDetails.nPosition === parseInt(position) && sportDetails.eStatus === Active && sportDetails.oRule && sportDetails.oRule.nTotalPlayers === parseInt(totalPlayers) && sportDetails.oRule.nMaxPlayerOneTeam === parseInt(maxPlayerOneTeam) && sportDetails.sScoreInfoLink === scoreInfoLink && sportDetails.sScoreInfoTabName === scoreInfoTabName

  useEffect(() => {
    if (match.params.id) {
      dispatch(getSportDetails(match.params.id, token))
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
          props.history.push('/settings/sports', { message: resMessage })
        }

        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.sportDetails !== sportDetails) {
      if (sportDetails) {
        setSportName(sportDetails.sName)
        setKey(sportDetails.sKey)
        setPosition(sportDetails.nPosition || '')
        setActive(sportDetails.eStatus)
        setTotalPlayers(sportDetails?.oRule?.nTotalPlayers || 0)
        setMaxPlayerOneTeam(sportDetails?.oRule?.nMaxPlayerOneTeam || 0)
        setScoreInfoLink(sportDetails?.sScoreInfoLink || '')
        setScoreInfoTabName(sportDetails?.sScoreInfoTabName || '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.sportDetails = sportDetails
    }
  }, [sportDetails])

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(sportName, 1) && verifyLength(key, 1) && isNumber(position) && isNumber(totalPlayers) && isNumber(maxPlayerOneTeam) && scoreInfoLink && scoreInfoTabName && !errSportName && !errKey && !errPosition) {
      const updateSportData = {
        sportName, key, position, Active, totalPlayers, maxPlayerOneTeam, scoreInfoLink, scoreInfoTabName, id: match.params.id, token
      }
      dispatch(updateSport(updateSportData))
      setLoading(true)
    } else {
      if (!verifyLength(sportName, 1)) {
        setErrSportName('Required field')
      }
      if (!verifyLength(key, 1)) {
        setErrKey('Required field')
      }
      if (!position) {
        setErrPosition('Required field')
      } else if (!isNumber(position)) {
        setErrPosition('Field should be number')
      }
      if (!totalPlayers) {
        setTotalPlayerErr('Required field')
      } else if (!isNumber(position)) {
        setTotalPlayerErr('Field should be number')
      }
      if (!maxPlayerOneTeam) {
        setMaxPlayerOneTeamErr('Required field')
      } else if (!isNumber(position)) {
        setMaxPlayerOneTeamErr('Field should be number')
      }
      if (!scoreInfoLink) {
        setScoreInfoLinkErr('Required field')
      }
      if (!scoreInfoTabName) {
        setScoreInfoTabNameErr('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'SportName':
        if (verifyLength(event.target.value, 1)) {
          setErrSportName('')
        } else {
          setErrSportName('Required field')
        }
        setSportName(event.target.value)
        break
      case 'Key':
        if (verifyLength(event.target.value, 1)) {
          setErrKey('')
        } else {
          setErrKey('Required field')
        }
        setKey(event.target.value)
        break
      case 'Position':
        if (isNumber(event.target.value)) {
          setErrPosition('')
        } else {
          setErrPosition('Required field')
        }
        setPosition(event.target.value)
        break
      case 'Status':
        setActive(event.target.value)
        break
      case 'TotalPlayers':
        if (event.target.value) {
          if (!isNumber(event.target.value)) {
            setTotalPlayerErr('Enter numeric value only!')
          } else {
            setTotalPlayerErr('')
          }
        } else {
          setTotalPlayerErr('Required field')
        }
        setTotalPlayers(event.target.value)
        break
      case 'MaxPlayerOneTeam':
        if (event.target.value) {
          if (!isNumber(event.target.value)) {
            setMaxPlayerOneTeamErr('Enter numeric value only!')
          } else {
            setMaxPlayerOneTeamErr('')
          }
        } else {
          setMaxPlayerOneTeamErr('Required field')
        }
        setMaxPlayerOneTeam(event.target.value)
        break
      case 'ScoreInfoLink':
        if (event.target.value) {
          if (!verifyUrl(event.target.value)) {
            setScoreInfoLinkErr('Invalid link ')
          } else {
            setScoreInfoLinkErr('')
          }
        } else {
          setScoreInfoLinkErr('Required field')
        }
        setScoreInfoLink(event.target.value)
        break
      case 'ScoreInfoTabName':
        if (verifyLength(event.target.value, 1)) {
          setScoreInfoTabNameErr('')
        } else {
          setScoreInfoTabNameErr('Required field')
        }
        setScoreInfoTabName(event.target.value)
        break
      default:
        break
    }
  }
  return (
    <main className="main-content">
      {loading && <Loading />}
      {
          modalMessage && message &&
          (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
      }
      <section className="common-form-block">
        <h2>Edit Sport</h2>
        <Form>
          <FormGroup>
            <Label for="sportName">Sport <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SPORT === 'R'} name="sportName" placeholder="Sport" value={sportName} onChange={event => handleChange(event, 'SportName')} />
            <p className="error-text">{errSportName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="key">Key <span className="required-field">*</span></Label>
            <InputGroupText>{key}</InputGroupText>
          </FormGroup>
          <FormGroup>
            <Label for="position">Position <span className="required-field">*</span></Label>
            <Input disabled={adminPermission?.SPORT === 'R'} name="position" placeholder="Position" value={position} onChange={event => handleChange(event, 'Position')} />
            <p className="error-text">{errPosition}</p>
          </FormGroup>
          <FormGroup>
            <Label for="totalPlayers">Total Players</Label>
            <Input disabled={adminPermission?.SPORT === 'R'} name="totalPlayers" placeholder="Total Players" value={totalPlayers} onChange={event => handleChange(event, 'TotalPlayers')} />
            <p className="error-text">{totalPlayerErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="maxPlayerOneTeam">Max Player From One Team</Label>
            <Input disabled={adminPermission?.SPORT === 'R'} name="maxPlayerOneTeam" placeholder="Max Player One Team" value={maxPlayerOneTeam} onChange={event => handleChange(event, 'MaxPlayerOneTeam')} />
            <p className="error-text">{maxPlayerOneTeamErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="scoreInfoLink">Score Info Link</Label>
            <Input disabled={(adminPermission?.SPORT === 'R') || (key !== 'CRICKET')} name="scoreInfoLink" placeholder="Score Info Link" value={scoreInfoLink} onChange={event => handleChange(event, 'ScoreInfoLink')} />
            <p className="error-text">{scoreInfoLinkErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="scoreInfoTabName">Score Info Tab Name</Label>
            <Input disabled={(adminPermission?.SPORT === 'R') || (key !== 'CRICKET')} name="scoreInfoTabName" placeholder="Score Info Tab Name" value={scoreInfoTabName} onChange={event => handleChange(event, 'ScoreInfoTabName')} />
            <p className="error-text">{scoreInfoTabNameErr}</p>
          </FormGroup>
          <FormGroup>
            <Label for="status">Status</Label>
            <div className="d-flex inline-input">
              <CustomInput
                  type="radio"
                  disabled={adminPermission?.SPORT === 'R'}
                  id="themeRadio1"
                  name="themeRadio"
                  label="Active"
                  onChange={event => handleChange(event, 'Status')}
                  checked={Active === 'Y'}
                  value="Y"
              />
              <CustomInput
                  type="radio"
                  disabled={adminPermission?.SPORT === 'R'}
                  id="themeRadio2"
                  name="themeRadio"
                  label="InActive"
                  onChange={event => handleChange(event, 'Status')}
                  checked={Active !== 'Y'}
                  value="N"
              />
            </div>
          </FormGroup>
          {
              ((Auth && Auth === 'SUPER') || (adminPermission?.SPORT !== 'R')) &&
              (
              <Fragment>
                  <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onSubmit}>
                  Save Changes
                  </Button>
              </Fragment>
              )
          }
        </Form>
        <div className="form-footer text-center small-text">
            <NavLink to="/settings/sports">Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddSport.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default AddSport
