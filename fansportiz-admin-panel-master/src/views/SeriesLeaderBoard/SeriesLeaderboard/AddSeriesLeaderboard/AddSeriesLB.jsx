import React, {
  useState, useEffect, useRef, Fragment
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import {
  FormGroup, Input, Label, Button, UncontrolledAlert, Row, Col, CustomInput
} from 'reactstrap'
import { alertClass, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import PropTypes from 'prop-types'
import { PrizeCalculate, RankCalculate, WinPrizeDistribution } from '../../../../actions/seriesLeaderBoard'
import backIcon from '../../../../assets/images/left-theme-arrow.svg'

function AddSeriesLB (props) {
  const {
    match, cancelLink, AddNewSeries, UpdateSeries, seriesLeaderBoardDetails, seriesLeaderBoardCategory, GameCategoryList
  } = props

  const [SeriesName, setSeriesName] = useState('')
  const [SeriesInfo, setSeriesInfo] = useState('')
  const [Id, setId] = useState('')
  const [SeriesStatus, setSeriesStatus] = useState('P')
  const [SeriesGetStatus, setSeriesGetStatus] = useState('')
  const [errSeriesName, setErrSeriesName] = useState()
  const [gameCategoryErr, setGameCategoryErr] = useState('')
  const [GameCategory, setGameCategory] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [seriesId, setSeriesId] = useState('')
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ seriesLeaderBoardDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (match.params.id) {
      setSeriesId(match.params.id)
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
          history.push(`${props.cancelLink}`, { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
            // dispatch(getSeriesLeaderBoardDetails(match.params.id, token))
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
    if (previousProps.seriesLeaderBoardDetails !== seriesLeaderBoardDetails) {
      if (seriesLeaderBoardDetails) {
        setSeriesName(seriesLeaderBoardDetails.sName || '')
        setSeriesInfo(seriesLeaderBoardDetails.sInfo || '')
        setSeriesStatus(seriesLeaderBoardDetails.eStatus || '')
        setSeriesGetStatus(seriesLeaderBoardDetails.eStatus || '')
        setGameCategory(seriesLeaderBoardDetails.eCategory || '')
        setId(seriesLeaderBoardDetails._id)
        setLoading(false)
      }
    }
    return () => {
      previousProps.seriesLeaderBoardDetails = seriesLeaderBoardDetails
    }
  }, [seriesLeaderBoardDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'SeriesName':
        if (verifyLength(event.target.value, 1)) {
          setErrSeriesName('')
        } else {
          setErrSeriesName('Required field')
        }
        setSeriesName(event.target.value)
        break
      case 'SeriesInfo':
        setSeriesInfo(event.target.value)
        break
      case 'SeriesStatus':
        setSeriesStatus(event.target.value)
        break
      case 'GameCategory':
        if (verifyLength(event.target.value, 1)) {
          setGameCategoryErr('')
        } else {
          setGameCategoryErr('Required field')
        }
        setGameCategory(event.target.value)
        break
      default:
        break
    }
  }

  function Submit (e) {
    e.preventDefault()
    if (verifyLength(SeriesName, 1) && SeriesStatus && verifyLength(GameCategory, 1) && (!errSeriesName) && (!gameCategoryErr)) {
      if (isCreate) {
        AddNewSeries(SeriesName, SeriesInfo, GameCategory, SeriesStatus)
      } else {
        UpdateSeries(seriesId, SeriesName, SeriesInfo, GameCategory, SeriesStatus)
      }
      setLoading(true)
    } else {
      if (!verifyLength(SeriesName, 1)) {
        setErrSeriesName('Required field')
      }
      if (!verifyLength(GameCategory, 1)) {
        setGameCategoryErr('Required field')
      }
    }
  }

  function heading () {
    if (isCreate) {
      return 'Create Series LeaderBoard'
    }
    return !isEdit ? 'Edit Series LeaderBoard' : 'Series LeaderBoard Details'
  }

  function button () {
    if (isCreate) {
      return 'Create Series'
    }
    return !isEdit ? 'Save Changes' : 'Edit Series'
  }

  function Calculate (type) {
    if (type === 'RankCalculate') {
      dispatch(RankCalculate(match.params.id, token))
      setLoading(true)
    } else if (type === 'PrizeCalculate') {
      dispatch(PrizeCalculate(match.params.id, token))
      setLoading(true)
    } else if (type === 'WinPrizeDistribution') {
      dispatch(WinPrizeDistribution(match.params.id, token))
      setLoading(true)
    }
  }
  return (
    <Fragment>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      {loading && <Loading />}
      <section className="add-contest-section">
        <div className="title d-flex justify-content-between align-items-center fdc-480 align-start-480">
          <div className='d-inline-flex'>
            <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push(`${cancelLink}${page?.SeriesLeaderBoard || ''}`)}></img>
            <h2 className='ml-2'>{heading()}</h2>
          </div>
          <FormGroup className="d-flex justify-content-between mb-0 fdc-480">
            <div className="d-flex inline-input">
              <FormGroup className='mb-0-480'>
                <CustomInput
                  disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
                  type="select"
                  name="select"
                  id="SeriesStatus"
                  value={SeriesStatus}
                  className='series-lb-select'
                  onChange={event => handleChange(event, 'SeriesStatus')}
                >
                  <option value="P">Pending</option>
                  <option value="L">Live</option>
                  <option value="CMP">Completed</option>
                </CustomInput>
              </FormGroup>
            </div>
            <div className="footer-btn text-center mt-0-480">
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')) &&
                (
                  <Button
                    className="theme-btn ml-0-480"
                    onClick={Submit}
                  >
                    {button()}
                  </Button>
                )
              }
            </div>
          </FormGroup>
        </div>
        <Row className="row-12 mt-4">
          <Col xl={4} lg={4} md={4}>
            <FormGroup>
              <Label for="SeriesName">Series Name <span className="required-field">*</span></Label>
              <Input
                disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
                type="text"
                id="SeriesName"
                placeholder="Enter Series Name"
                value={SeriesName}
                onChange={event => handleChange(event, 'SeriesName')}
              />
              <p className="error-text">{errSeriesName}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={4}>
            <FormGroup>
              <Label for="SeriesInfo">Series Info</Label>
              <Input
                disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
                type="text"
                name="SeriesInfo"
                placeholder="Enter Series Info"
                value={SeriesInfo}
                onChange={event => handleChange(event, 'SeriesInfo')}
              />
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={4}>
          <FormGroup>
            <Label for="GameCategory">Game Category <span className="required-field">*</span></Label>
              <CustomInput
                disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
                type="select"
                name="select"
                id="GameCategory"
                value={GameCategory}
                onChange={event => handleChange(event, 'GameCategory')}
              >
                <option value=''>Select Game Category</option>
                {
                  GameCategoryList && GameCategoryList.length !== 0 && GameCategoryList.map((data) => {
                    return (
                      <option value={data} key={data._id}>{data}</option>
                    )
                  })
                }
              </CustomInput>
              <p className="error-text">{gameCategoryErr}</p>
            </FormGroup>
          </Col>
        </Row>
        <div className='text-center'>
          {
            SeriesGetStatus === 'L' && ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD === 'W')) && (
              <Fragment>
                <Button className="theme-btn m-3" onClick={() => Calculate('RankCalculate')} >Rank Calculate</Button>
              </Fragment>
            )
          }
          {!isCreate && <Button className="theme-btn" tag={Link} to={`${seriesLeaderBoardCategory}/${Id}`}>
            Series LeaderBoard Category
          </Button>}
        </div>
      </section>
    </Fragment>
  )
}

AddSeriesLB.propTypes = {
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  AddNewSeries: PropTypes.func,
  UpdateSeries: PropTypes.func,
  seriesLeaderBoardDetails: PropTypes.object,
  seriesLeaderBoardCategory: PropTypes.string,
  GameCategoryList: PropTypes.object
}

export default AddSeriesLB
