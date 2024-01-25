/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment, useRef, Suspense } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Card, CardBody, CardFooter, CardHeader, Alert, Form, FormGroup, Input, Label, Table } from 'reactstrap'
import { verifyLength, isUpperCase } from '../../../utils/helper'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import Loading from '../../../component/Loading'
import MyTeam from '../components/MyTeam'
import { joinPrivateContest, joinTeam } from '../../../utils/Analytics.js'
import PrivateJoinContest from '../../../HOC/SportsLeagueList/PrivateJoinContest'
import qs from 'query-string'
import close from '../../../assests/images/close.svg'
import classNames from 'classnames'
function JoinContestPage (props) {
  const {
    resMessage,
    verifyContestDetails,
    verifyingContest,
    isTeamList,
    joiningContest,
    modalOpen,
    joinedContest,
    sucessFullyJoin,
    updatedTeamList,
    loading,
    amountData,
    verifiedId,
    onMyJoinList,
    teamPlayerList,
    onFetchMatchPlayer,
    token,
    currencyLogo,
    // onGetUserProfile,
    userInfo
  } = props
  const [alert, setAlert] = useState(false)
  const [code, setCode] = useState('')
  const [sportType, setSportType] = useState('')
  const [matchId, setMatchId] = useState('')
  const [errCode, setErrCode] = useState('')
  const [userTeams, setUserTeams] = useState([])
  const [modalMessage, setModalMessage] = useState(false)
  const [selectedAll, setSelectedAll] = useState(false)
  const [modalMessage2, setModalMessage2] = useState(false)
  const [totalPay, setTotalPay] = useState(0)
  const [alertMessage, setAlertMessage] = useState('')
  const [updatedFilterData, setUpdatedFilterData] = useState([])
  const [userTeamId, setUserTeamId] = useState([])
  const mainTeamList = useSelector(state => state.team.teamList)
  const previousProps = useRef({ verifyContestDetails, updatedTeamList, joinedContest, sucessFullyJoin, amountData }).current

  const { sportsType, sMatchId, code: Code } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (sMatchId) {
      setMatchId(sMatchId)
    }
    if (sportsType) {
      const sport = sportsType
      setSportType(sport)
    } else {
      if (sportsType) {
        const sport = sportsType
        setSportType(sport)
      }
    }
  }, [])
  useEffect(() => {
    if (Code) {
      if (Code) {
        setCode(Code)
      }
      if (sMatchId && sportsType) {
        const sport = sportsType
        setSportType(sport)
        setMatchId(sMatchId)
        navigate(`/join-contest/${sport.toLowerCase()}/${sMatchId}?code=${code}`)
      }
    }
    if (sMatchId && (teamPlayerList?.length === 0 || !teamPlayerList)) {
      setMatchId(sMatchId)
      onFetchMatchPlayer(sMatchId)
    }
    if (sMatchId && (teamPlayerList?.length === 0 || !teamPlayerList)) {
      onFetchMatchPlayer(sMatchId)
    }
    if (sportsType) {
      const sport = sportsType
      setSportType(sport)
      isUpperCase(sport) && navigate(`/join-contest/${sport.toLowerCase()}/${sMatchId}`)
    }
  }, [token])

  // useEffect(() => {
  //   if (selectedAll) {
  //     let updatedSelectedTeam = []
  //     if (mainTeamList && mainTeamList.length > 0) {
  //       updatedSelectedTeam = mainTeamList.map(data => data._id)
  //       setUserTeams(updatedSelectedTeam)
  //     }
  //   } else {
  //     setUserTeams([])
  //   }
  // }, [selectedAll])

  useEffect(() => {
    if (selectedAll) {
      let updatedSelectedTeam = []
      if (updatedTeamList && updatedTeamList.length > 0) {
        updatedSelectedTeam = updatedTeamList.map(data => data._id)
        setUserTeams(updatedSelectedTeam)
      } else if (mainTeamList && mainTeamList.length > 0) {
        updatedSelectedTeam = mainTeamList.map(data => data._id)
        setUserTeams(updatedSelectedTeam)
      }
    } else {
      if (userTeamId?.length > 0) {
        setUserTeams(userTeams.filter((item) => item.id !== userTeamId))
      } else {
        setUserTeams([])
      }
    }
  }, [selectedAll, userTeamId])

  useEffect(() => {
    if (previousProps.sucessFullyJoin !== sucessFullyJoin) {
      if (sucessFullyJoin) {
        navigate(`/upcoming-match/leagues/${(sportType).toLowerCase()}/${matchId}`, { state: { message: resMessage } })
      }
    }
    return () => {
      previousProps.sucessFullyJoin = sucessFullyJoin
    }
  }, [sucessFullyJoin])

  useEffect(() => {
    if (previousProps.verifyContestDetails !== verifyContestDetails) {
      if (verifyContestDetails && verifyContestDetails._id) {
        if (isTeamList) {
          setModalMessage(true)
        } else {
          navigate(`/create-team/${(sportType).toLowerCase()}/${matchId}/join/${verifyContestDetails._id}/private/${verifyContestDetails.sShareCode}`)
        }
      }
    }
    return () => {
      previousProps.verifyContestDetails = verifyContestDetails
    }
  }, [verifyContestDetails])
  useEffect(() => {
    if (previousProps.amountData !== amountData) {
      if (amountData && amountData?.oValue?.nAmount > 0) {
        navigate('/deposit',
          {
            state: {
              amountData: amountData?.oValue,
              message: 'Insufficient Balance',
              joinData: {
                userTeams, verifiedId, code
              }
            }
          })
      }
    }
    return () => {
      previousProps.amountData = amountData
    }
  }, [amountData])

  useEffect(() => {
    if (previousProps.updatedTeamList !== updatedTeamList) {
      if (updatedTeamList !== null && updatedTeamList.length === 0 && verifyContestDetails?._id && sMatchId && code) {
        navigate(`/create-team/${(sportType).toLowerCase()}/${matchId}/join/${verifiedId}/private/${verifyContestDetails.sShareCode}`)
      }
    }
    return () => {
      previousProps.updatedTeamList = updatedTeamList
    }
  }, [updatedTeamList])

  function handleChangeJoin (event, type) { // set the value
    switch (type) {
      case 'Code':
        if (verifyLength(event.target.value, 4)) {
          setErrCode('')
        } else {
          if (!verifyLength(event.target.value, 4)) {
            setErrCode(<FormattedMessage id="Code_should_be_greater_than_4" />)
          }
        }
        setCode(event.target.value)
        break
      default:
        break
    }
  }

  function JoinContest () { // join contest
    setModalMessage2(false)
    if (userTeams && userTeams.length > 0 && verifyLength(code, 4) && verifiedId) {
      joiningContest(userTeams, verifiedId, code)
      callJoinContestEvent()
      callJoinTeamEvent()
      setModalMessage(false)
    } else {
      if (!verifyLength(code, 4)) {
        setErrCode(<FormattedMessage id="Code_should_be_greater_than_4" />)
      }
    }
  }

  function checkTeamJoin (e) {
    e.preventDefault()
    if (verifyLength(code, 4) && matchId) {
      verifyingContest(matchId, code)
      onMyJoinList(matchId)
    }
  }

  function callJoinContestEvent () {
    if (code && matchId && location.pathname) {
      joinPrivateContest(code, matchId, location.pathname)
    } else {
      code && matchId && joinPrivateContest(code, matchId, '')
    }
  }

  function callJoinTeamEvent () {
    if (userTeams && matchId && location.pathname) {
      joinTeam(userTeams, matchId, location.pathname)
    } else {
      userTeams && matchId && joinTeam(userTeams, matchId, '')
    }
  }

  useEffect(() => {
    if (userInfo !== previousProps.userInfo) {
      if (userInfo && userInfo.nCurrentTotalBalance) {
        const value = verifyContestDetails && updatedFilterData && ((verifyContestDetails.nPrice * updatedFilterData.length) - (userInfo && userInfo.nCurrentTotalBalance))
        setTotalPay(value > 0 ? value.toFixed(2) : 0)
      }
    }
    return () => {
      previousProps.userInfo = userInfo
    }
  }, [userInfo])

  return (
    <>
      {alert && alertMessage ? <Alert className='select-all' color="primary" isOpen={alert}>{alertMessage}</Alert> : ''}
      {loading && <Loading />}
      {
        modalOpen && resMessage
          ? (
            <Fragment>
              <Alert color="primary" isOpen={modalOpen}>{resMessage}</Alert>
            </Fragment>
            )
          : ''
      }
      <div className="user-container join-contest bg-white no-footer">
        <Form className="form">
          <p className="m-msg text-center mt-0"><FormattedMessage id="Enter_the_contest_code_to_join_contest" /></p>
          <FormGroup className="c-input">
            <Input autoComplete='off' className={classNames({ 'hash-contain': code, error: errCode }) } id="InviteCode" maxLength={6} onChange={(e) => { handleChangeJoin(e, 'Code') }} type="text" value={code} />
            <Label className="label m-0" for="InviteCode"><FormattedMessage id="Contest_Code" /></Label>
            <p className="error-text">{errCode}</p>
          </FormGroup>
          {/* <div className="btn-bottom text-center"> */}
          <Button className="w-100 d-block" color="primary" disabled={!code || errCode} onClick={(e) => checkTeamJoin(e)} type="submit"><FormattedMessage id="Join_Contest" /></Button>
          {/* </div> */}
        </Form>
        {
          modalMessage
            ? (
              <>
                <div className="s-team-bg"
                  onClick={() => {
                    setModalMessage(false)
                    setSelectedAll(false)
                  }}
                />
                <Card className="filter-card select-team promo-card">
                  <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                    <button><FormattedMessage id="Select_Team" /></button>
                    <button onClick={() => {
                      setModalMessage(false)
                      setSelectedAll(false)
                    }}
                    >
                      <img src={close} />
                    </button>
                  </CardHeader>
                  <CardBody className="p-0">
                    <div className="two-button border-0 bg-white m-0 d-flex justify-content-center card-footer">
                      <Button className="create-team-button" onClick={() => navigate(`/create-team/${(sportType).toLowerCase()}/${matchId}/join/${verifiedId}/private/${verifyContestDetails.sShareCode}`)} type="submit"><FormattedMessage id="Create_Team" /></Button>
                    </div>
                    {
                    verifyContestDetails?.bPrivateLeague && verifyContestDetails?.bMultipleEntry && (
                      <Fragment>
                        <div className='SelectAll d-flex align-items-center'>
                          <input checked={selectedAll}
                            id='name'
                            name="gender"
                            onClick={() => setSelectedAll(!selectedAll)}
                            type="radio"
                          />
                          <label htmlFor='name'>
                            <FormattedMessage id="Select_All" />
                            {' '}
                          </label>
                        </div>
                      </Fragment>
                    )
                  }
                    {
                    (mainTeamList && mainTeamList.length
                      ? (
                        <Fragment>
                          {(
                          mainTeamList && mainTeamList.length !== 0 && mainTeamList.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data, index) => {
                            return (
                              <div key={data._id} className='d-flex justify-content-betwee'>
                                <MyTeam {...props}
                                  UpdatedTeamList={updatedTeamList}
                                  UserTeamChoice
                                  allTeams={mainTeamList}
                                  disabledRadio={updatedTeamList?.find((item) => item._id === data._id)?._id}
                                  disabledRadioFlag={updatedTeamList.length !== 0}
                                  hidden
                                  index={index}
                                  join
                                  leagueData={verifyContestDetails}
                                  noOfJoin={verifyContestDetails && verifyContestDetails.bMultipleEntry ? verifyContestDetails.nMax - verifyContestDetails.nJoined : 1}
                                  noRefresh={true}
                                  params={matchId}
                                  setUserTeams={(Id) => {
                                    setUserTeams(Id)
                                    setUserTeamId(Id)
                                    setSelectedAll(false)
                                  }}
                                  teamDetails={data}
                                  teamId={data._id}
                                  teamList={mainTeamList}
                                  upcoming
                                  userTeams={userTeams}
                                />
                              </div>
                            )
                          })
                        )
                        }
                        </Fragment>
                        )
                      : (
                        <Fragment>
                          <div className="no-team d-flex align-items-center justify-content-center">
                            <div className="">
                              <i className="icon-trophy" />
                              <h6 className="m-3"><FormattedMessage id="No_team_created_yet" /></h6>
                              <Link className="btn btn-primary" to={`/create-team/${(sportType).toLowerCase()}/${matchId}/join/${verifiedId}/private/${verifyContestDetails.sShareCode}`}><FormattedMessage id="Create_Team" /></Link>
                            </div>
                          </div>
                        </Fragment>
                        )
                    )
                  }
                  </CardBody>
                  <CardFooter className='p-0 border-0 bg-trnsparent m-0 d-flex justify-content-between'>
                    {/* <Button type="submit" color='border' className="w-100" onClick={() => navigate(`/create-team/${(sportType).toLowerCase()}/${matchId}/join/${verifiedId}/private/${verifyContestDetails.sShareCode}`)}><FormattedMessage id="Create_Team" /></Button> */}
                    <Button className="w-100"
                      color='primary-two'
                      disabled={userTeams && userTeams.length === 0}
                      onClick={() => {
                        if ((verifyContestDetails && userTeams) && userTeams.length > (verifyContestDetails.nMax - verifyContestDetails.nJoined)) {
                          setAlert(true)
                          setAlertMessage(
                            <p>
                              <FormattedMessage id="You_can_select_max " />
                              {' '}
                              {verifyContestDetails.nMax - verifyContestDetails.nJoined || '-'}
                              {' '}
                              <FormattedMessage id="Teams_for_this_contest" />
                            </p>)
                          setTimeout(() => {
                            setAlertMessage('')
                            setAlert(false)
                          }, 2000)
                          setUserTeams([])
                        } else if (updatedTeamList?.length >= userTeams.length) {
                          JoinContest(userTeams)
                          // const filterData = updatedTeamList.filter(data => userTeams.includes(data._id))
                          // onGetUserProfile()
                          // setUpdatedFilterData(filterData)
                          // setModalMessage2(true)
                          // setModalMessage(false)
                        } else {
                          setAlert(true)
                          setAlertMessage(
                            <p>
                              <FormattedMessage id="You_can_select_max " />
                              {' '}
                              -
                              {' '}
                              <FormattedMessage id="Teams_for_this_contest" />
                            </p>)
                          setTimeout(() => {
                            setAlertMessage('')
                            setAlert(false)
                          }, 2000)
                          setUserTeams([])
                        }
                      }}
                      type="submit"
                    >
                      <FormattedMessage id="Join" />
                      (
                      <FormattedMessage id='Pay' />
                      {' '}
                      {currencyLogo}
                      {' '}
                      {userTeams?.length * verifyContestDetails.nPrice}
                      )
                    </Button>
                  </CardFooter>
                </Card>
              </>
              )
            : modalMessage2
              ? (
                <>
                  {loading && <Loading />}
                  <div className="s-team-bg" onClick={() => setModalMessage2(false)} />
                  <Card className="filter-card select-team promo-card">
                    <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                      <button><FormattedMessage id="Payment" /></button>
                      <button onClick={() => { setModalMessage2(false) }} ><img src={close} /></button>
                    </CardHeader>
                    <CardBody className="p-0 teamXShawing">
                      <div className='teamJoin'>
                        {
                      updatedFilterData && updatedFilterData.length && (
                        <h3>
                          {updatedFilterData.length}
                          {' '}
                          <FormattedMessage id="Teams_Selected" />
                        </h3>
                      )
                    }
                      </div>
                      <div className='selectedTeamList'>
                        {
                      updatedFilterData && updatedFilterData.length !== 0
                        ? updatedFilterData.sort((a, b) => a?.sTeamName?.toString().localeCompare(b?.sTeamName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data1, index) => {
                          return (
                            <Suspense key={data1._id} fallback={<Loading />}>
                              <MyTeam {...props}
                                key={data1._id}
                                UserTeamChoice
                                allTeams={updatedFilterData}
                                index={index}
                                params={sMatchId}
                                teamDetails={data1}
                                upcoming
                                viewOnly
                              />
                            </Suspense>
                          )
                        })
                        : ''
                    }
                      </div>
                      <Table className="m-0 bg-white promocode">
                        <thead>
                          <tr>
                            <th><FormattedMessage id="Total_Entry" /></th>
                            <th className='rightAlign'>
                              {currencyLogo}
                              {verifyContestDetails && updatedFilterData && verifyContestDetails.nPrice * updatedFilterData.length}
                              {' '}
                              (
                              {verifyContestDetails && updatedFilterData && `${verifyContestDetails.nPrice} X ${updatedFilterData.length}`}
                              {' '}
                              )
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><FormattedMessage id="From_wallet" /></td>
                            <td className='rightAlign'>
                              {currencyLogo}
                              {userInfo && userInfo.nCurrentTotalBalance ? userInfo.nCurrentTotalBalance : 0}
                            </td>
                          </tr>
                        </tbody>
                        {
                      totalPay && currencyLogo
                        ? (
                          <tfoot>
                            <tr>
                              <td><h1><FormattedMessage id="To_Pay" /></h1></td>
                              <td className='rightAlign'>
                                {currencyLogo}
                                {totalPay}
                              </td>
                            </tr>
                          </tfoot>
                          )
                        : ''
                    }
                      </Table>
                    </CardBody>
                    <CardFooter className='p-0 border-0 bg-trnsparent m-0 d-flex justify-content-between'>
                      <Button className="w-100"
                        color='primary'
                        disabled={userTeams && userTeams.length === 0}
                        onClick={() => JoinContest(userTeams)}
                        type="submit"
                      >
                        {
                      totalPay > 0
                        ? <FormattedMessage id="Add_Money" />
                        : <FormattedMessage id="Join" />
                    }
                      </Button>
                    </CardFooter>
                  </Card>
                </>
                )
              : ''
        }
      </div>
    </>
  )
}

JoinContestPage.propTypes = {
  isTeamList: PropTypes.bool,
  loading: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  amountData: PropTypes.shape({
    oValue: PropTypes.shape({
      nAmount: PropTypes.number
    })
  }),
  verifyingContest: PropTypes.func,
  joiningContest: PropTypes.func,
  resMessage: PropTypes.string,
  onFetchMatchPlayer: PropTypes.func,
  modalOpen: PropTypes.bool,
  joinedContest: PropTypes.bool,
  sucessFullyJoin: PropTypes.bool,
  verifyContestDetails: PropTypes.object,
  modalMessage: PropTypes.string,
  token: PropTypes.string,
  verifiedId: PropTypes.string,
  updatedTeamList: PropTypes.array,
  teamList: PropTypes.array,
  onMyJoinList: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  }),
  teamPlayerList: PropTypes.shape({
    length: PropTypes.number
  }),
  currencyLogo: PropTypes.string,
  userInfo: PropTypes.object,
  onGetUserProfile: PropTypes.func
}

export default PrivateJoinContest(JoinContestPage)
