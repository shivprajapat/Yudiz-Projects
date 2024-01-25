import React, {
  useState, Fragment, useEffect, useRef
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, FormGroup, Input, Label, Row, UncontrolledAlert } from 'reactstrap'
import PropTypes from 'prop-types'
import { getUrl } from '../../../../actions/url'
import { alertClass, isNumber, isPositive, modalMessageFunc } from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import SkeletonTable from '../../../../components/SkeletonTable'
import { getMatchPlayerList } from '../../../../actions/matchplayer'
import { getProbability, joinBotInContest } from '../../../../actions/systemusers'
import { useHistory } from 'react-router-dom'

function SystemTeamMatchPlayers (props) {
  const { match, matchLeaguePage } = props
  const dispatch = useDispatch()
  const history = useHistory()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [creditLimitMin, setCreditLimitMin] = useState(0)
  const [creditLimitMax, setCreditLimitMax] = useState(0)
  const [teamCount, setTeamCount] = useState(0)
  const [playersErr, setPlayersErr] = useState('')
  const [creditLimitMinErr, setCreditLimitMinErr] = useState('')
  const [creditLimitMaxErr, setCreditLimitMaxErr] = useState('')
  const [teamCountErr, setTeamCountErr] = useState('')
  const [combinationMsg, setCombinationMsg] = useState('')
  const [instantAdd, setInstantAdd] = useState(false)
  const [loader, setLoader] = useState(false)
  const [players, setPlayers] = useState([])
  const [probability, setProbability] = useState(0)
  const [btnDisabled, setBtnDisabled] = useState(false)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.systemusers.resStatus)
  const resMessage = useSelector(state => state.systemusers.resMessage)
  const isTeamCreate = useSelector(state => state.systemusers.isTeamCreate)
  const probabilityForTeams = useSelector(state => state.systemusers.probabilityForTeams)
  const matchPlayerList = useSelector(state => state.matchplayer.matchPlayerList)
  const start = useRef(0)
  const limit = useRef(50)
  const sort = useRef('sName')
  const order = useRef('asc')
  const search = useRef('')
  const role = useRef('')
  const team = useRef('')
  const previousProps = useRef({ list, resMessage, resStatus, probabilityForTeams }).current
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)

  useEffect(() => {
    const matchPlayerListData = {
      start: start.current, limit: limit.current, sort: sort.current, order: order.current, searchText: search.current, role: role.current, team: team.current, token, Id: match.params.id1
    }
    dispatch(getMatchPlayerList(matchPlayerListData))
    dispatch(getUrl('media'))
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.matchPlayerList !== matchPlayerList) {
      if (matchPlayerList) {
        const playersList = matchPlayerList?.results?.filter(data => data.bShow)
        setList(matchPlayerList.results ? playersList : [])
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchPlayerList = matchPlayerList
    }
  }, [matchPlayerList])

  useEffect(() => {
    if (previousProps.probabilityForTeams !== probabilityForTeams) {
      if (probabilityForTeams && probabilityForTeams.combinationCount) {
        setCombinationMsg(`Possible Combinations: ${probabilityForTeams.combinationCount}`)
        setProbability(probabilityForTeams.combinationCount)
      }
    }
    return () => {
      previousProps.probabilityForTeams = probabilityForTeams
    }
  }, [probabilityForTeams])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus && isTeamCreate) {
          history.push(`${matchLeaguePage}`, { message: resMessage })
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
        }
        setLoader(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage, isTeamCreate])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (list) {
      const arr = []
      if (list.length !== 0) {
        list.map((data) => {
          const obj = {
            iPlayerId: data._id,
            selected: false,
            isCaptain: true
          }
          arr.push(obj)
          return arr
        })
        setPlayers(arr)
      }
    }
    return () => {
      previousProps.list = list
    }
  }, [list])

  useEffect(() => {
    if (players.filter(data => data.selected).length === list.length) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }
  }, [players])

  function handleCaption (event, ID, type) {
    if (type === 'Caption') {
      const arr = [...players]
      const index = players.findIndex(data => data.iPlayerId === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], isCaptain: !arr[index].isCaptain }
        setPlayers(arr)
      }
    } else if (type === 'SelectedPlayer') {
      const arr = [...players]
      const index = players.findIndex(data => data.iPlayerId === ID)
      if (event.target.value) {
        arr[index] = { ...arr[index], selected: !arr[index].selected }
        if (arr.filter(data => data.selected).length < 4) {
          setPlayersErr('Select at least 4 players!!')
        } else {
          setPlayersErr('')
        }
        setPlayers(arr)
      }
    }
  }

  function handleOnChange (event, type) {
    switch (type) {
      case 'Min':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setCreditLimitMinErr('')
          } else {
            setCreditLimitMinErr('Required field')
          }
          setCreditLimitMin(event.target.value)
          if (parseInt(creditLimitMax) && parseInt(event.target.value) > parseInt(creditLimitMax)) {
            setCreditLimitMinErr('Value must be less than Max Value ')
          } else {
            setCreditLimitMinErr('')
            setCreditLimitMaxErr('')
          }
        }
        break
      case 'Max':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0 && event.target.value <= 100) {
            setCreditLimitMaxErr('')
          } else if (event.target.value > 100) {
            setCreditLimitMaxErr('Value must be less then or equal to 100')
          } else {
            setCreditLimitMaxErr('Required field')
          }
          setCreditLimitMax(event.target.value)
          if (parseInt(creditLimitMin) && parseInt(creditLimitMin) > parseInt(event.target.value)) {
            setCreditLimitMaxErr('Value must be greater than Min Value ')
          } else {
            if (event.target.value < 100) {
              setCreditLimitMaxErr('')
              setCreditLimitMinErr('')
            }
          }
        }
        break
      case 'TeamCount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > probability) {
            setTeamCountErr(`Value must be less than ${probability}`)
          } else if (!event.target.value) {
            setTeamCountErr('Required field')
          } else {
            setTeamCountErr('')
          }
          setTeamCount(event.target.value)
        }
        break
      case 'InstantAdd':
        setInstantAdd(!instantAdd)
        break
      default:
        break
    }
  }

  function getProbabilityFunc (e) {
    e.preventDefault()
    const rules = {
      creditLimit: {
        min: parseInt(creditLimitMin),
        max: parseInt(creditLimitMax)
      }
    }
    const isPlayersSelected = players.filter(data => data.selected).length
    const validate = (creditLimitMin > 0) && (creditLimitMax <= 100) && !creditLimitMaxErr && (isPositive(creditLimitMin) && (creditLimitMax > 0) && (isPositive(creditLimitMax))) && (parseInt(creditLimitMin) <= parseInt(creditLimitMax)) && players && rules && isPlayersSelected >= 4
    if (validate) {
      const data = {
        players, rules, matchLeagueId: match.params.id2, matchId: match.params.id1, token
      }
      dispatch(getProbability(data))
      setLoader(true)
    } else {
      if (players.filter(data => data.selected).length < 4) {
        setPlayersErr('Select at least 4 players!!')
      }
      if (parseInt(creditLimitMax) < parseInt(creditLimitMin)) {
        setCreditLimitMaxErr('Max credit limit must be greater than Min credit value')
      }
      if (!isPositive(creditLimitMin)) {
        setCreditLimitMinErr('Value must be positive!')
      }
      if (!isPositive(creditLimitMax)) {
        setCreditLimitMaxErr('Value must be positive!')
      }
      if (creditLimitMax > 100) {
        setCreditLimitMaxErr('Value must be less then or equal to 100')
      }
      if (!creditLimitMin) {
        setCreditLimitMinErr('Required field')
      }
      if (!creditLimitMax) {
        setCreditLimitMaxErr('Required field')
      }
    }
  }

  function createTeamsFunc () {
    const rules = {
      creditLimit: {
        min: parseInt(creditLimitMin),
        max: parseInt(creditLimitMax)
      }
    }
    const validate = (teamCount > 0) && (isPositive(teamCount)) && players && rules
    if (validate) {
      const data = {
        players, rules, teamCount: parseInt(teamCount), instantAdd, matchLeagueId: match.params.id2, matchId: match.params.id1, token
      }
      dispatch(joinBotInContest(data))
      setLoader(true)
      setCreditLimitMin(0)
      setCreditLimitMax(0)
      setTeamCount(0)
      setProbability(0)
      setCombinationMsg('')
    } else {
      if (!isPositive(teamCount)) {
        setTeamCountErr('Value must be positive!')
      }
      if (!teamCount) {
        setTeamCountErr('Required field')
      }
    }
  }

  function recalculateFunc () {
    setProbability(0)
    setCombinationMsg('')
  }

  return (
    <Fragment>
      <div className='table-responsive'>
        {
          modalMessage && message && (
            <UncontrolledAlert color='primary' className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        {loader && <Loading />}
        <table className='table'>
          <thead>
            <tr>
              <th>No</th>
              <th>Select Players</th>
              <th>Caption</th>
              <th>Score Point</th>
              <th>Team Name</th>
              <th>Player Name</th>
              <th>Image</th>
              <th>Credits</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={9} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      data.bShow &&
                      <Fragment key={data._id}>
                        <tr key={data._id}>
                          <td>{i + 1}</td>
                          {players.map((player, index) => (player.iPlayerId === data._id) &&
                            <Fragment key={index}>
                              <td><Input type="checkbox" className='custom-check-box' checked={player.selected} onChange={(e) => handleCaption(e, data._id, 'SelectedPlayer')} disabled={probability > 0} /></td>
                              <td><Input type="checkbox" className='custom-check-box' checked={player.isCaptain} onChange={(e) => handleCaption(e, data._id, 'Caption')} disabled={probability > 0} /></td>
                            </Fragment>)}
                          <td>{data.nScoredPoints ? data.nScoredPoints : ' 0 '}</td>
                          <td>{data.sTeamName}</td>
                          <td>{data.sName}</td>
                          <td>{data.sImage ? <img src={url + data.sImage} className='theme-image' alt='No Image' /> : ' No Image '}</td>
                          <td>{data.nFantasyCredit}</td>
                          <td>
                              {data.eRole === 'ALLR'
                                ? 'All Rounder'
                                : data.eRole === 'BATS'
                                  ? 'Batsman'
                                  : data.eRole === 'BWL'
                                    ? 'Bowler'
                                    : data.eRole === 'WK'
                                      ? 'Wicket Keeper'
                                      : data.eRole === 'FWD'
                                        ? 'Forwards'
                                        : data.eRole === 'GK'
                                          ? 'Goal Keeper'
                                          : data.eRole === 'DEF'
                                            ? 'Defender'
                                            : data.eRole === 'RAID'
                                              ? 'Raider'
                                              : data.eRole === 'MID'
                                                ? 'Mid fielders'
                                                : data.eRole === 'PG'
                                                  ? 'Point-Gaurd'
                                                  : data.eRole === 'SG'
                                                    ? 'Shooting-Gaurd'
                                                    : data.eRole === 'SF'
                                                      ? 'Small-Forwards'
                                                      : data.eRole === 'PF'
                                                        ? 'Power-Forwards'
                                                        : data.eRole === 'C'
                                                          ? 'Centre'
                                                          : data.eRole === 'IF' ? 'Infielder' : data.eRole === 'OF' ? 'Outfielder' : data.eRole === 'P' ? 'Pitcher' : data.eRole === 'CT' ? 'Catcher' : '--'}
                          </td>
                        </tr>
                      </Fragment>
                    ))
                  }
                </Fragment>)
            }
          </tbody>
        </table>
        <FormGroup>
          <p className='error-text'>{playersErr}</p>
        </FormGroup>
      </div>
        {
          !loading && list.length === 0 && (
            <div className='text-center'>
              <h3>No Match Player available</h3>
            </div>
          )
        }
        {((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'W')) &&
        <Fragment>
          <Row className='mt-5'>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='creditLimitMin'>Credit Limit (Min) <span className="required-field">*</span></Label>
                <Input type='number' value={creditLimitMin} onChange={(e) => handleOnChange(e, 'Min')} disabled={(list.length === 0) || (probability > 0)}></Input>
                <p className='error-text'>{creditLimitMinErr}</p>
              </FormGroup>
              </Col>
            <Col lg='4' md='6'>
              <FormGroup>
                <Label for='creditLimitMax'>Credit Limit (Max) <span className="required-field">*</span></Label>
                <Input type='number' value={creditLimitMax} onChange={(e) => handleOnChange(e, 'Max')} disabled={(list.length === 0) || (probability > 0)}></Input>
                <p className='error-text'>{creditLimitMaxErr}</p>
              </FormGroup>
              </Col>
          </Row>
          <div className='d-flex justify-content-start'>
            <div>
              <FormGroup>
                <Button onClick={getProbabilityFunc} className='theme-btn outline-btn outline-theme' disabled={(list.length === 0) || (probability > 0) || btnDisabled}>Get Combination Count</Button>
              </FormGroup>
            </div>
            {(probability > 0) && <div className='ml-3'>
              <FormGroup>
                <Button onClick={recalculateFunc} className='theme-btn outline-btn outline-theme'>Re-Calculate</Button>
              </FormGroup>
            </div>}
          </div>
          <p className='total-text'>{combinationMsg}</p>
          {probability > 0 &&
          <Fragment>
            <Row>
              <Col lg='4' md='6'>
                <FormGroup>
                  <Label for='teamCount'>Team Count <span className="required-field">*</span></Label>
                  <Input type='number' value={teamCount} onChange={(e) => handleOnChange(e, 'TeamCount')} disabled={list.length === 0}></Input>
                  <p className='error-text'>{teamCountErr}</p>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg='4' md='6'>
                <FormGroup>
                  <Input type="checkbox" className='custom-check-box' value='Y' checked={instantAdd} onChange={e => handleOnChange(e, 'InstantAdd')} disabled={list.length === 0} />
                  <Label className='ml-2'>Add instant bot</Label>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg='4' md='6'>
                <FormGroup>
                  <Button onClick={createTeamsFunc} className='theme-btn outline-btn outline-theme' disabled={list.length === 0}>Create Teams</Button>
                </FormGroup>
              </Col>
            </Row>
          </Fragment>}
        </Fragment>}
    </Fragment>
  )
}

SystemTeamMatchPlayers.propTypes = {
  match: PropTypes.object,
  matchLeaguePage: PropTypes.string
}

export default SystemTeamMatchPlayers
