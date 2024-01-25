import React, { useState, useEffect, useRef } from 'react'
import { connect, useSelector } from 'react-redux'

import { NavLink } from 'react-router-dom'
import {
  Button, Form, FormGroup, Label, Input, UncontrolledAlert, InputGroupText
} from 'reactstrap'
import PropTypes from 'prop-types'
import { verifyLength, isNumber, modalMessageFunc, alertClass } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'

function AddPlayerRole (props) {
  const {
    cancelLink, PlayerRoleDetails, UpdatePlayerRole, clearMsg, playerRoleDetailsFunc
  } = props
  const [RoleName, setRoleName] = useState('')
  const [RoleShortName, setRoleShortName] = useState('')
  const [MinPlayer, setMinPlayer] = useState(0)
  const [MaxPlayer, setMaxPlayer] = useState(0)
  const [Position, setPosition] = useState(0)
  const [errRoleName, setErrRoleName] = useState('')
  const [errRoleShortName, setErrRoleShortName] = useState('')
  const [errMinPlayer, setErrMinPlayer] = useState('')
  const [errMaxPlayer, setErrMaxPlayer] = useState('')
  const [errPosition, setErrPosition] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const resStatus = useSelector(state => state.playerRole.resStatus)
  const resMessage = useSelector(state => state.playerRole.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ PlayerRoleDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = PlayerRoleDetails && previousProps.PlayerRoleDetails !== PlayerRoleDetails && PlayerRoleDetails.nMin === parseInt(MinPlayer) && PlayerRoleDetails.nMax === parseInt(MaxPlayer) && PlayerRoleDetails.sFullName === RoleName && PlayerRoleDetails.nPosition === parseInt(Position)

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
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
        if (resStatus && isCreate) {
          props.history.push(`${props.cancelLink}`, { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
            playerRoleDetailsFunc()
          }
          setModalMessage(true)
        }
        setLoading(false)
      }
      clearMsg()
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.PlayerRoleDetails !== PlayerRoleDetails) {
      if (PlayerRoleDetails) {
        setRoleName(PlayerRoleDetails.sFullName ? PlayerRoleDetails.sFullName : '')
        setMinPlayer(PlayerRoleDetails.nMin)
        setMaxPlayer(PlayerRoleDetails.nMax)
        setPosition(PlayerRoleDetails.nPosition || 0)
        setRoleShortName(PlayerRoleDetails && PlayerRoleDetails.sName ? PlayerRoleDetails.sName : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.PlayerRoleDetails = PlayerRoleDetails
    }
  }, [PlayerRoleDetails])

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(RoleName, 1) && verifyLength(RoleShortName, 1) && MinPlayer !== 0 && MaxPlayer !== 0 && Position !== 0 && !errRoleName && !errRoleShortName && !errMaxPlayer && !errMinPlayer && !errPosition) {
      if (!isCreate) {
        UpdatePlayerRole(RoleName, MaxPlayer, MinPlayer, Position)
      }
      setLoading(true)
    } else {
      if (!verifyLength(RoleName, 1)) {
        setErrRoleName('Required field')
      }
      if (!verifyLength(RoleShortName, 1)) {
        setErrRoleShortName('Required field')
      }
      if (MinPlayer === 0) {
        setErrMinPlayer('Required field')
      }
      if (MaxPlayer === 0) {
        setErrMaxPlayer('Required field')
      }
      if (Position === 0) {
        setErrPosition('Required field')
      }
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'RoleName':
        if (verifyLength(event.target.value, 1)) {
          setErrRoleName('')
        } else {
          setErrRoleName('Required field')
        }
        setRoleName(event.target.value)
        break
      case 'RoleShortName':
        if (verifyLength(event.target.value, 1)) {
          setErrRoleShortName('')
        } else {
          setErrRoleShortName('Required field')
        }
        setRoleShortName(event.target.value)
        break
      case 'MaxPlayer':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrMaxPlayer('')
          } else {
            setErrMaxPlayer('Required field')
          }
          setMaxPlayer(event.target.value)
        }
        break
      case 'MinPlayer':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrMinPlayer('')
          } else {
            setErrMinPlayer('Required field')
          }
          setMinPlayer(event.target.value)
        }
        break
      case 'Position':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrPosition('')
          } else {
            setErrPosition('Required field')
          }
          setPosition(event.target.value)
        }
        break
      default:
        break
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
        <h2> {isCreate ? 'Add Player Role' : !isEdit ? 'Edit Player Role' : 'View Player Role Details'} </h2>
        <Form>
          <FormGroup>
            <Label for="RoleName">Player Role <span className='required-field'>*</span></Label>
            {/* <InputGroupText>{RoleName}</InputGroupText> */}
            <Input disabled={adminPermission?.ROLES === 'R'} name="RoleName" placeholder="RoleName" value={RoleName} onChange={event => handleChange(event, 'RoleName')} />
            <p className="error-text">{errRoleName}</p>
          </FormGroup>
          <FormGroup>
          <Label for="RoleShortName">Short Name</Label>
            <InputGroupText>{RoleShortName}</InputGroupText>
            <p className="error-text">{errRoleShortName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="MinPlayer">Min Player <span className='required-field'>*</span></Label>
            <Input disabled={adminPermission?.ROLES === 'R'} name="MinPlayer" placeholder="MinPlayer" value={MinPlayer} onChange={event => handleChange(event, 'MinPlayer')} />
            <p className="error-text">{errMinPlayer}</p>
          </FormGroup>
          <FormGroup>
            <Label for="MaxPlayer">Max Player <span className='required-field'>*</span></Label>
            <Input disabled={adminPermission?.ROLES === 'R'} name="MaxPlayer" placeholder="MaxPlayer" value={MaxPlayer} onChange={event => handleChange(event, 'MaxPlayer')} />
            <p className="error-text">{errMaxPlayer}</p>
          </FormGroup>
          {/* <FormGroup>
            <Label for="Position">Position <span className='required-field'>*</span></Label>
            <Input disabled={adminPermission?.ROLES === 'R'} name="Position" placeholder="Position" value={Position} onChange={event => handleChange(event, 'Position')} />
            <p className="error-text">{errPosition}</p>
          </FormGroup> */}
          <FormGroup>
            <Label for="GameCategory">Game Category</Label>
            <InputGroupText>{props.sportsType}</InputGroupText>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.ROLES !== 'R')) &&
            (
              <Button className="theme-btn full-btn" onClick={onSubmit} disabled={submitDisable}>
                {isCreate ? 'Create PlayerRole' : !isEdit ? 'Save Changes' : 'Edit PlayerRole'}
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

AddPlayerRole.defaultProps = {
  history: {}
}

AddPlayerRole.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  cancelLink: PropTypes.string,
  PlayerRoleDetails: PropTypes.object,
  UpdatePlayerRole: PropTypes.func,
  clearMsg: PropTypes.func,
  match: PropTypes.object,
  sportsType: PropTypes.string,
  playerRoleDetailsFunc: PropTypes.func
}

export default connect()(AddPlayerRole)
