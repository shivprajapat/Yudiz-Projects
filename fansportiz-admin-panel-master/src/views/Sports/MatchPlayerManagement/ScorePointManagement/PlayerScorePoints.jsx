import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  Row, Col, FormGroup, Input, Label, Button, UncontrolledAlert
} from 'reactstrap'
import Loading from '../../../../components/Loading'
import PropTypes from 'prop-types'
import { alertClass, modalMessageFunc } from '../../../../helpers/helper'

function PlayerScorePoints (props) {
  const {
    match, getList, updateMPScorePoint
  } = props
  const [matchPlayerId, setmatchPlayerId] = useState('')
  const [aScorePoint, setaScorePoint] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)

  const matchPlayerScoreList = useSelector(state => state.matchplayer.matchPlayerScorePointList)
  const resStatus = useSelector(state => state.matchplayer.resStatus)
  const resMessage = useSelector(state => state.matchplayer.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    resStatus, resMessage, matchPlayerScoreList
  }).current

  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    if (match.params.id1 && match.params.id2) {
      setmatchPlayerId(match.params.id2)
      getList(match.params.id2)
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
    if (matchPlayerScoreList) {
      const arr = []
      if (matchPlayerScoreList.length !== 0) {
        matchPlayerScoreList.map((data) => {
          const obj = {
            _id: data._id,
            sName: data.sName,
            nScoredPoints: data.nScoredPoints
          }
          arr.push(obj)
          return arr
        })
        setaScorePoint(arr)
      }
      setLoading(false)
    }
    return () => {
      previousProps.matchPlayerScoreList = matchPlayerScoreList
    }
  }, [matchPlayerScoreList])

  function onEdit (e) {
    e.preventDefault()
    updateMPScorePoint(aScorePoint, matchPlayerId)
    setLoading(true)
  }

  function onChangeScorePoint (event, ID) {
    const arr = [...aScorePoint]
    const i = arr.findIndex(data => data._id === ID)
    if (event.target.value && parseFloat(event.target.value)) {
      arr[i] = { ...arr[i], nScoredPoints: parseInt(event.target.value) }
      setaScorePoint(arr)
    } else {
      arr[i] = { ...arr[i], nScoredPoints: parseInt(0) }
      setaScorePoint(arr)
    }
  }

  return (
    <div>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      {loading && <Loading />}
      <h2 className="text-center mb-5">Score Point</h2>
      <Row className="row-12">
        {
          aScorePoint && aScorePoint.length !== 0 && aScorePoint.map((data, i) => (
            <Col xl={3} lg={4} md={6} key={data.sName}>
              <FormGroup>
                <Label for="runScore">{data.sName}</Label>
                <Input
                  type="text"
                  id={data.sKey}
                  placeholder={`Enter ${data.sName}`}
                  value={data.nScoredPoints}
                  onChange={event => onChangeScorePoint(event, data._id)}
                  disabled={adminPermission?.SCORE_POINT === 'R'}
                />
              </FormGroup>
            </Col>
          ))
        }
      </Row>
      <div className="footer-btn text-center">
        <Button
          className="theme-btn outline-btn outline-theme mr-3"
          onClick={() => props.history.goBack()}
        >
          Cancel
        </Button>
        {
          ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'R')) &&
          (
            <Button
              className="theme-btn"
              onClick={onEdit}
            >
              Save Changes
            </Button>
          )
        }
      </div>
    </div>
  )
}

PlayerScorePoints.propTypes = {
  getList: PropTypes.func,
  updateMPScorePoint: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object
}

export default PlayerScorePoints
