import React, { useEffect, useState, Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Button, UncontrolledAlert, Form, FormGroup, Label, Input, InputGroupText
} from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { verifyLength, isNumber, isFloat, modalMessageFunc, alertClass, blockInvalidChar } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import { getPointSystem, updateScorePoint } from '../../../../actions/pointSystem'

function UpdatePoint (props) {
  const { match } = props
  const [message, setMessage] = useState('')
  const [Name, setName] = useState('')
  const [Key, setKey] = useState('')
  const [Points, setPoints] = useState('')
  const [errName, setErrName] = useState('')
  const [errPoints, setErrPoints] = useState('')
  const [Bonus, setBonus] = useState('')
  const [MinValue, setMinValue] = useState('')
  const [RangeFrom, setRangeFrom] = useState('')
  const [RangeTo, setRangeTo] = useState('')
  const [errBonus, setErrBonus] = useState('')
  const [errMinValue, setErrMinValue] = useState('')
  const [errRangeFrom, setErrRangeFrom] = useState('')
  const [errRangeTo, setErrRangeTo] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.pointSystem.resStatus)
  const resMessage = useSelector(state => state.pointSystem.resMessage)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const scorePointDetails = useSelector(state => state.pointSystem.scorePointDetails)
  const previousProps = useRef({
    resStatus, resMessage, scorePointDetails
  }).current
  const submitDisable = scorePointDetails && previousProps.scorePointDetails !== scorePointDetails && scorePointDetails.nPoint === parseInt(Points) && scorePointDetails.sName === Name
  const multiData = scorePointDetails && scorePointDetails.aPoint && scorePointDetails.aPoint.find(data => data._id === match.params.id1)
  const multiUpdate = multiData && multiData.nBonus === Bonus && multiData.nRangeFrom === parseInt(RangeFrom) && multiData.nRangeTo === parseInt(RangeTo) && multiData.nMinValue === MinValue
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    if (match.params.id) {
      dispatch(getPointSystem(match.params.id, token))
      setLoading(true)
    }
  }, [])
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setModalMessage(true)
        setLoading(false)
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.scorePointDetails !== scorePointDetails) {
      if (scorePointDetails) {
        if (match.params.id1 && scorePointDetails.aPoint && scorePointDetails.aPoint.length !== 0) {
          const ScorePointsData = scorePointDetails.aPoint.find(data => data._id === match.params.id1)
          setBonus(ScorePointsData.nBonus)
          setMinValue(ScorePointsData.nMinValue)
          setRangeFrom(ScorePointsData.nRangeFrom)
          setRangeTo(ScorePointsData.nRangeTo)
        }
        setName(scorePointDetails.sName)
        setKey(scorePointDetails.sKey)
        setPoints(scorePointDetails.nPoint)
        setLoading(false)
      }
    }
    return () => {
      previousProps.scorePointDetails = scorePointDetails
    }
  }, [scorePointDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'Bonus':
        if (isNumber(event.target.value)) {
          setErrBonus('')
        } else {
          setErrBonus('Should be a Number')
        }
        setBonus(event.target.value)
        break
      case 'MinValue':
        if (isNumber(event.target.value)) {
          setErrMinValue('')
        } else {
          setErrMinValue('Should be a Number')
        }
        setMinValue(event.target.value)
        break
      case 'RangeFrom':
        if (isFloat(event.target.value) || (!event.target.value)) {
          if (isFloat(event.target.value) && RangeTo > event.target.value) {
            setErrRangeFrom('')
          } else if (!(event.target.value < RangeTo)) {
            setErrRangeFrom('')
          } else if (!isFloat(event.target.value)) {
            setErrRangeFrom('Should be a Number')
          }
          setRangeFrom(event.target.value)
        }
        break
      case 'RangeTo':
        if (isFloat(event.target.value) || (!event.target.value)) {
          if (isFloat(event.target.value) && event.target.value > RangeFrom) {
            setErrRangeTo('')
          } else if (!(event.target.value > RangeFrom)) {
            setErrRangeTo('')
          } else if (!isFloat(event.target.value)) {
            setErrRangeTo('Should be a Number')
          }
          setRangeTo(event.target.value)
        }
        break
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'Points':
        if ((!isNaN(event.target.value)) || !event.target.value) {
          setErrPoints('')
          if (Points[0] === '-' ? event.target.value.length > 4 : event.target.value.length > 3) {
            setErrPoints('Value must be under 3 digit')
          }
        } else {
          if (event.target.value === '-') {
            setErrPoints('Please enter any number')
          } else {
            setErrPoints('Do not use special characters')
          }
        }
        setPoints(event.target.value)
        break
      default:
        break
    }
  }

  function onSubmit () {
    const verify = Name && Key
    if (verify) {
      const scorePointData = {
        iPointId: match.params.id, id: '', Name, Key, Points, Bonus: '', MinValue: '', RangeFrom: '', RangeTo: '', token
      }
      dispatch(updateScorePoint(scorePointData))
    } else {
      if (!Points) {
        setErrPoints('Required field')
      }
    }
  }
  function onInsideSubmit () {
    const verify = Bonus && MinValue && RangeFrom >= 0 && RangeTo >= 0
    if (verify) {
      const scorePointData = {
        iPointId: match.params.id, id: match.params.id1, Name, Key: '', Points: '', Bonus, MinValue, RangeFrom, RangeTo, token
      }
      dispatch(updateScorePoint(scorePointData))
    } else {
      if (!Bonus) {
        setErrBonus('Required field')
      }
      if (!MinValue) {
        setErrMinValue('Required field')
      }
      if (!RangeFrom) {
        setErrRangeFrom('Required field')
      }
      if (!RangeTo) {
        setErrRangeTo('Required field')
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
          Edit Score Point
        </h2>
        <Form>
          {
            match && match.params && match.params.id && match.params.id1
              ? (
              <Fragment>
                <FormGroup>
                  <Label for="Name">Name</Label>
                  <Input disabled={adminPermission?.SCORE_POINT === 'R'} type='textarea' name="Link" placeholder="Enter Name" value={Name} onChange={event => handleChange(event, 'Name')} />
                  <p className="error-text">{errName}</p>
                </FormGroup>
                <FormGroup>
                  <Label for="Bonus">Bonus</Label>
                  <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="Link" placeholder="Enter Bonus" value={Bonus} onChange={event => handleChange(event, 'Bonus')} />
                  <p className="error-text">{errBonus}</p>
                </FormGroup>
                <FormGroup>
                  <Label for="Key">Min Value</Label>
                  <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="Key" placeholder="Enter MinValue" value={MinValue} onChange={event => handleChange(event, 'MinValue')} />
                  <p className="error-text">{errMinValue}</p>
                </FormGroup>
                <FormGroup>
                  <Label for="RangeFrom">{scorePointDetails?.sName?.includes('Strike Rate') ? 'Min Range for Strike Rate' : scorePointDetails?.sName?.includes('Economy Bonus') ? 'Min Range for Economy Bonus' : 'Min Range'}</Label>
                  <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="RangeFrom" type='number' placeholder={scorePointDetails?.sName?.includes('Strike Rate') ? 'Min Range for Strike Rate' : scorePointDetails?.sName?.includes('Economy Bonus') ? 'Min Range for Economy Bonus' : 'Min Range'} value={RangeFrom} onChange={event => handleChange(event, 'RangeFrom')} />
                  <p className="error-text">{errRangeFrom}</p>
                </FormGroup>
                <FormGroup>
                  <Label for="RangeTo">{scorePointDetails?.sName?.includes('Strike Rate') ? 'Max Range for Strike Rate' : scorePointDetails?.sName?.includes('Economy Bonus') ? 'Max Range for Economy Bonus' : 'Max Range'}</Label>
                  <Input disabled={adminPermission?.SCORE_POINT === 'R'} name="RangeTo" type='number' placeholder={scorePointDetails?.sName?.includes('Strike Rate') ? 'Max Range for Strike Rate' : scorePointDetails?.sName?.includes('Economy Bonus') ? 'Max Range for Economy Bonus' : 'Max Range'} value={RangeTo} onChange={event => handleChange(event, 'RangeTo')} />
                  <p className="error-text">{errRangeTo}</p>
                </FormGroup>
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'R')) &&
                  (
                    <Button className="theme-btn full-btn" onClick={onInsideSubmit} disabled={multiUpdate}>Save Changes</Button>
                  )
                }
              </Fragment>
                )
              : (
              <Fragment>
                <FormGroup>
                  <Label for="Name">Name</Label>
                  <Input disabled={adminPermission?.SCORE_POINT === 'R'} type='textarea' name="Link" placeholder="Enter Name" value={Name} onChange={event => handleChange(event, 'Name')} />
                  <p className="error-text">{errName}</p>
                </FormGroup>
                <FormGroup>
                  <Label for="Key">Key</Label>
                  <InputGroupText>{Key}</InputGroupText>
                </FormGroup>
                <FormGroup>
                  <Label for="Order">Points</Label>
                  <Input
                    disabled={adminPermission?.SCORE_POINT === 'R'}
                    type='text'
                    name="Points"
                    placeholder="Enter Points"
                    value={Points}
                    onKeyDown={(e) => blockInvalidChar(e, Points)}
                    onChange={event => handleChange(event, 'Points')}
                  />
                  <p className="error-text">{errPoints}</p>
                </FormGroup>
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'R')) &&
                  (
                    <Button className="theme-btn full-btn" disabled={submitDisable || errPoints} onClick={onSubmit}>Save Changes</Button>
                  )
                }
              </Fragment>
                )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/${sportsType}/point-system${page?.PointSystem || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

UpdatePoint.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      id1: PropTypes.string
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  location: PropTypes.object
}

export default UpdatePoint
