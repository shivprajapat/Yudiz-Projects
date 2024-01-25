import React, { Fragment, useEffect, useState, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import {
  Button, Modal, ModalBody, Row, Col, Form, FormGroup, Label, Input, UncontrolledAlert
} from 'reactstrap'
import NavbarComponent from '../../../../components/Navbar'
import UserLeagueManagement from './UserLeagueManagement'
import SportsHeader from '../../SportsHeader'
import { getMatchDetails } from '../../../../actions/match'
import { addSystemTeams, botCountMatchLeague, botUsers, getUserLeagueList } from '../../../../actions/matchleague'
import PropTypes from 'prop-types'
import Loading from '../../../../components/Loading'
import { alertClass } from '../../../../helpers/helper'

function UserLeague (props) {
  const {
    match
  } = props
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [matchId, setMatchId] = useState('')
  const [matchStatus, setMatchStatus] = useState('')
  const [matchName, setMatchName] = useState('')
  const [matchLeagueId, setMatchLeagueId] = useState('')
  const [teams, setTeams] = useState('')
  const [instantAdd, setInstantAdd] = useState(false)
  const token = useSelector(state => state.auth.token)
  const userLeagueList = useSelector(state => state.matchleague.userLeagueList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const resStatus = useSelector(state => state.matchleague.resStatus)
  const resMessage = useSelector(state => state.matchleague.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''
  const dispatch = useDispatch()
  const [modalMessage, setModalMessage] = useState(false)
  const [resModalMessage, setResModalMessage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)

  const toggleMessage = () => setModalMessage(!modalMessage)
  const previousProps = useRef({
    resStatus, resMessage
  }).current

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
    if (match.params.id1 && match.params.id2) {
      setMatchId(match.params.id1)
      setMatchLeagueId(match.params.id2)
    }
    if (match.params.id1) {
      getMatchDetailsFunc()
    }
    if (match.params.id2) {
      botCountInMatchLeagueFunc()
    }
  }, [])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setResModalMessage(true)
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (resModalMessage) {
      setTimeout(() => {
        setResModalMessage(false)
        setClose(false)
      }, 3000)
      setTimeout(() => {
        setClose(true)
      }, 2500)
    }
  }, [resModalMessage])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
      setMatchStatus(MatchDetails.eStatus)
    }
  }, [MatchDetails])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function handleInputChange (event, type) {
    switch (type) {
      case 'Teams':
        setTeams(event.target.value)
        break
      case 'InstantAdd':
        setInstantAdd(!instantAdd)
        break
      default:
        break
    }
  }

  // dispatch action to add system teams in particular contest
  function addBot (e) {
    e.preventDefault()
    if (match && match.params && match.params.id2) {
      dispatch(addSystemTeams(matchId, match.params.id2, teams, instantAdd, token))
      setLoading(true)
      toggleMessage()
    }
  }

  function getMatchDetailsFunc () {
    dispatch(getMatchDetails(match.params.id1, token))
  }

  // dispatch action to get number of rank, prize calculation, prize distribution, win prize distribution
  function botCountInMatchLeagueFunc () {
    dispatch(botCountMatchLeague(match.params.id2, token))
  }

  function getList (start, limit, sort, order, search, userType, isFullList) {
    const userLeagueData = {
      start, limit, sort, order, searchText: search, userType, isFullList, sportsType, ID: match.params.id2, token
    }
    dispatch(getUserLeagueList(userLeagueData))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function cancel (e) {
    e.preventDefault()
    toggleMessage()
  }

  // dispatch action to stop adding system teams in contest
  function botUsersFunc (bBotUser) {
    setLoading(true)
    dispatch(botUsers(bBotUser, matchLeagueId, token))
  }

  function onExport () {
    content.current.onExport()
  }

  function heading () {
    if (matchName && userLeagueList?.matchLeague?.sName) {
      if (window.innerWidth <= 480) {
        return <div>User Leagues <p className='mb-0'>{`(${matchName})`}</p> <p>{`(${userLeagueList?.matchLeague?.sName})`}</p></div>
      } else {
        return <div>User Leagues {`(${matchName} - ${userLeagueList?.matchLeague?.sName})`}</div>
      }
    } else {
      return 'User Leagues'
    }
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
      {loading && <Loading />}
    {
      resModalMessage && message &&
      (
        <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
      )
    }
        <section className="management-section common-box">
          <SportsHeader
            {...props}
            // heading={(matchName && userLeagueList?.matchLeague?.sName) ? `User Leagues (${matchName} - ${userLeagueList?.matchLeague?.sName})` : 'User Leagues'}
            heading={heading()}
            SearchPlaceholder="Search League"
            handleSearch={onHandleSearch}
            matchLeaguePage={`/${sportsType}/match-management/match-league-management/${matchId}`}
            search={searchText}
            AddSystemTeam="Add System Team"
            status={matchStatus}
            setModalMessage={setModalMessage}
            onRefresh={onRefreshFun}
            userLeagueList={userLeagueList}
            Bot
            hidden
            onExport={onExport}
            matchLeagueManagement
            botUser={botUsersFunc}
            refresh
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'W')}
          />
          <UserLeagueManagement
            {...props}
            ref={content}
            sportsType={sportsType}
            List={userLeagueList}
            getList={getList}
            userTeams={`/${sportsType}/match-management/match-league-management/user-league/user-teams/${matchId}/${matchLeagueId}`}
            userleagues={`/${sportsType}/match-management/match-league-management/user-league/user-leagues/${matchId}/${matchLeagueId}`}
            search={searchText}
            flag={initialFlag}
            getMatchDetailsFunc={getMatchDetailsFunc}
            botCountInMatchLeagueFunc={botCountInMatchLeagueFunc}
            resMessage={resMessage}
            resStatus={resStatus}
          />
        </section>
      </main>

      { /* Modal to add system teams */ }
      <Modal isOpen={modalMessage} toggle={toggleMessage} className="modal-confirm-bot">
        <ModalBody className="text-center">
          <Form>
            <FormGroup>
              <Row>
                <Col md='4' className='align-self-center'>
                  <Label for="exampleTeams">Teams</Label>
                </Col>
                <Col md='7'>
                  <Input type="number" name="exampleTeams" id="exampleTeams" placeholder="Team Count" value={teams} onChange={event => handleInputChange(event, 'Teams')} />
                </Col>
                <Col md='6' className='mt-4 ml-4'>
                  <Input type="checkbox" value='Y' checked={instantAdd} onChange={event => handleInputChange(event, 'InstantAdd')} />
                  <Label>
                    Add instant bot
                  </Label>
                </Col>
              </Row>
            </FormGroup>
            {((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'R')) &&
            <Row className='buttons'>
              <Col md='6'>
                <Button type="submit" className="theme-btn outline-btn full-btn" onClick={(e) => cancel(e)}>Cancel</Button>
              </Col>
              <Col md='6'>
                <Button type="submit" className="theme-btn success-btn full-btn" disabled={!teams} onClick={(e) => addBot(e)}>Add</Button>
              </Col>
            </Row>}
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

UserLeague.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserLeague
