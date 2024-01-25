import React, { Fragment, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button, Card, CardBody, CardFooter, CardHeader, Alert } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { verifyLength, isPositive } from '../../../../utils/helper'
import createteam from '../../../../assests/images/create-team.svg'
import close from '../../../../assests/images/close.svg'
import MyTeam from '../../components/MyTeam'
import _ from 'lodash'
import { createPrivateContest } from '../../../../utils/Analytics.js'
import Loading from '../../../../component/Loading'
import Contest from '../../../../HOC/SportsLeagueList/Contest'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function PrizeBreakups (props) {
  const {
    generatePrizeBreakup,
    setLoading,
    createContest,
    onCreateContestAndTeam,
    IsCreateContestAndTeam,
    teamList,
    jointAndCreateContest,
    gPrizeBreakup,
    loading,
    resMessage,
    resStatus,
    contestDetails,
    isNavigate,
    isTeamList,
    getMyTeamList,
    joinedContest,
    setIsTeamList,
    currencyLogo,
    isCreatedContest,
    resContestMessage,
    // userInfo,
    // onGetUserProfile,
    token,
    onFetchMatchPlayer,
    teamPlayerList
  } = props
  const [winners, setwinners] = useState(0)
  const [userTeams, setUserTeams] = useState([])
  const [message, setMessage] = useState('')
  const [modalMessage2, setModalMessage2] = useState(false)
  const [selectedAll, setSelectedAll] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [selectTeamModal, setSelectTeamModal] = useState(false)
  const [isJoinAndCreate, setIsJoinAndCreate] = useState(false)
  // const [teamModal, setTeamModal] = useState(false)
  // const [totalPay, setTotalPay] = useState(0)
  // const [updatedFilterData, setUpdatedFilterData] = useState([])
  const matchDetails = useSelector(state => state.match.matchDetails)
  const { sMatchId, sportsType } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const { ContestName, ContestPrize, ContestSize, multipleTeam, poolPrice, entryFee } = location?.state
  const previousProps = useRef({ ContestPrize, isTeamList, resMessage, resStatus, joinedContest, IsCreateContestAndTeam, isCreatedContest }).current

  useEffect(() => {
    if (location?.state?.ContestSize && location?.state?.poolPrice !== null && token) {
      generatePrizeBreakup(ContestSize, poolPrice)
    }
    if (sMatchId && (teamPlayerList?.length === 0 || !teamPlayerList)) {
      onFetchMatchPlayer(sMatchId)
    }
  }, [token])

  useEffect(() => {
    if (previousProps.IsCreateContestAndTeam !== IsCreateContestAndTeam) {
      if (IsCreateContestAndTeam) {
        navigate(`/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${contestDetails._id}/private/${contestDetails.sShareCode}`)
      }
    }
    return () => {
      previousProps.IsCreateContestAndTeam = IsCreateContestAndTeam
    }
  }, [IsCreateContestAndTeam])

  useEffect(() => {
    if (isNavigate) {
      if (isJoinAndCreate) {
        if (contestDetails) {
          setIsTeamList(null)
          setSelectTeamModal(false)
          setIsJoinAndCreate(false)
          setModalMessage2(true)
          setMessage(resMessage)
          navigate(`/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${contestDetails._id}/private/${contestDetails.sShareCode}`)
        }
      } else if (joinedContest !== null) {
        navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`, { state: { matchDetails: matchDetails, matchLeagueDetails: contestDetails } })
      } else {
        navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`, { state: { matchDetails: matchDetails, matchLeagueDetails: contestDetails } })
      }
    }
  }, [isNavigate])

  useEffect(() => {
    if (previousProps.joinedContest !== joinedContest) {
      if (joinedContest !== null) {
        setLoading(false)
        setSelectTeamModal(false)
        if (joinedContest) {
          navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`, { state: { matchDetails: matchDetails, matchLeagueDetails: contestDetails } })
        } else {
          if (!_.isEmpty(contestDetails)) {
            navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`, { state: { matchDetails: matchDetails, matchLeagueDetails: contestDetails } })
          }
        }
      }
    }
    return () => {
      previousProps.joinedContest = joinedContest
    }
  }, [joinedContest])

  useEffect(() => {
    if (modalMessage2) {
      setTimeout(() => {
        setModalMessage2(false)
      }, 2000)
    }
  }, [modalMessage2])

  useEffect(() => {
    if (previousProps.isCreatedContest !== isCreatedContest) {
      if (isCreatedContest) {
        if (isCreate) {
          navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`)
          setIsCreate(false)
        } else if (teamList && teamList.length > 0) {
          navigate(`/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${contestDetails._id}/private/${contestDetails.sShareCode}`)
        }
      } else {
        if (isCreatedContest === false) {
          setModalMessage2(true)
          setMessage(resContestMessage)
        }
      }
    }
    return () => {
      previousProps.isCreatedContest = isCreatedContest
    }
  }, [isCreatedContest])

  useEffect(() => {
    if (selectedAll) {
      let updatedSelectedTeam = []
      if (teamList && teamList.length > 0) {
        updatedSelectedTeam = teamList.map(data => data._id)
        setUserTeams(updatedSelectedTeam)
      }
    } else {
      setUserTeams([])
    }
  }, [selectedAll])

  function AddContest () {
    if (verifyLength(ContestName, 3) && isPositive(ContestSize) && isPositive(ContestPrize) && isPositive(winners)) {
      createContest(ContestSize, sMatchId, (ContestName).trim(), multipleTeam, poolPrice, ContestPrize, winners)
      callCreatePrivateContestEvent()
      setLoading(true)
      setIsCreate(true)
    }
  }

  function AddContestAndTeam () {
    if (verifyLength(ContestName, 3) && isPositive(ContestSize) && isPositive(ContestPrize) && isPositive(winners)) {
      onCreateContestAndTeam(ContestSize, sMatchId, (ContestName).trim(), multipleTeam, poolPrice, ContestPrize, winners)
    }
  }

  function onJoin () {
    if (verifyLength(ContestName, 3) && isPositive(ContestSize) && isPositive(ContestPrize) && isPositive(winners)) {
      jointAndCreateContest(ContestSize, sMatchId, (ContestName).trim(), multipleTeam, poolPrice, ContestPrize, winners, userTeams)
      // setTeamModal(false)
    }
  }

  // useEffect(() => {
  //   if (userInfo !== previousProps.userInfo) {
  //     if (userInfo && userInfo.nCurrentTotalBalance) {
  //       const value = ContestPrize && userTeams && ((ContestPrize * userTeams.length) - (userInfo && userInfo.nCurrentTotalBalance))
  //       // setTotalPay(value > 0 ? value.toFixed(2) : 0)
  //     }
  //   }
  //   return () => {
  //     previousProps.userInfo = userInfo
  //   }
  // }, [userInfo])

  function checkTeam () {
    if (winners) {
      setIsJoinAndCreate(true)
      getMyTeamList(sMatchId)
    }
  }

  useEffect(() => {
    if (previousProps.isTeamList !== isTeamList) {
      if (isTeamList !== null) {
        if (isTeamList) {
          isJoinAndCreate && setSelectTeamModal(true)
        } else {
          createContest(ContestSize, sMatchId, ContestName.trim(), multipleTeam, poolPrice, ContestPrize, winners)
          callCreatePrivateContestEvent()
          setLoading(true)
        }
      }
    }
    return () => {
      previousProps.isTeamList = isTeamList
    }
  }, [isTeamList])

  function closeSelectTeam () {
    setLoading(false)
    setIsTeamList(null)
    setSelectTeamModal(false)
    setIsJoinAndCreate(false)
  }

  function callCreatePrivateContestEvent () {
    if (ContestName && sMatchId && location.pathname) {
      createPrivateContest(ContestName, sMatchId, location.pathname)
    } else {
      ContestName && sMatchId && createPrivateContest(ContestName, sMatchId, '')
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="user-container bg-white prize-breakup">
        {
          modalMessage2
            ? (
              <Fragment>
                <Alert color="primary" isOpen={modalMessage2}>{message}</Alert>
              </Fragment>
              )
            : ''
        }
        <div className="select-team promo-card c-winner">
          <div className="p-0">
            <div className="d-flex h-w">
              <div className={`hw-b ${document.dir === 'rtl' ? 'text-end' : 'text-start'}`}>
                <p><FormattedMessage id="Contest_Size" /></p>
                <h4>{ContestSize}</h4>
              </div>
              <div className="hw-b text-center">
                <p><FormattedMessage id="Entry_Fee" /></p>
                <h4>
                  {currencyLogo}
                  {' '}
                  {entryFee}
                </h4>
              </div>
              <div className={`hw-b ${document.dir === 'rtl' ? 'text-start' : 'text-end'}`}>
                <p><FormattedMessage id="Contest_Prize" /></p>
                <h4>
                  {currencyLogo}
                  {' '}
                  {ContestPrize}
                </h4>
              </div>
            </div>
            <div className='total-winner'><FormattedMessage id="Choose_total_no_of_winners" /></div>
            <ol className="s-winner">
              {
                  loading && <Loading />
                }
              {gPrizeBreakup && gPrizeBreakup.length > 0 && gPrizeBreakup.sort((a, b) => a?.nPrizeNo?.toString().localeCompare(b?.nPrizeNo?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map(data => {
                return (
                  <>
                    <li key={data._id}>
                      <input className="d-none" defaultChecked={winners === data.nPrizeNo} id={`label${data.nPrizeNo}`} name='winner' type="radio" />
                      <label htmlFor={`label${data.nPrizeNo}`} onClick={() => setwinners(data.nPrizeNo)}>
                        <h3>{data && data.sTitle && data.sTitle}</h3>
                        {
                            data.aPrizeBreakups && data.aPrizeBreakups.length !== 0 && data.aPrizeBreakups.map((prize, index) => {
                              return (
                                <div key={prize._id} className="item d-flex">
                                  <span className={document.dir === 'rtl' ? 'text-end' : 'text-start'}>
                                    {prize && prize.nRankFrom && prize.nRankTo && prize.nRankFrom === prize.nRankTo ? `# ${prize.nRankFrom}` : `# ${prize.nRankFrom} - ${prize.nRankTo}`}
                                  </span>
                                  <span className="text-center">
                                    {prize && prize.nPrizePer}
                                    <FormattedMessage id="Percentage" />
                                  </span>
                                  <span className={document.dir === 'rtl' ? 'text-start' : 'text-end'} >{((ContestPrize * prize.nPrizePer) / 100).toFixed(1)}</span>
                                </div>
                              )
                            })
                          }
                      </label>
                    </li>
                  </>
                )
              })}
            </ol>
          </div>
        </div>
        {
          selectTeamModal
            ? (
              <>
                <div className="s-team-bg" />
                <Card className="filter-card select-team promo-card">
                  <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                    <button><FormattedMessage id="Select_Team" /></button>
                    <button onClick={() => {
                      closeSelectTeam()
                      setIsTeamList(null)
                    }}
                    >
                      <img src={close} />
                    </button>
                  </CardHeader>
                  <CardBody className="p-0">
                    <div className="two-button border-0 bg-white m-0 d-flex justify-content-center card-footer">
                      {/* <Button type="submit" color='border' onClick={AddContestAndTeam}><FormattedMessage id="Create_a_new_team" /></Button> */}
                      <Button className='create-team-button' onClick={AddContestAndTeam} type="submit">
                        <img alt='Create Team' className={document.dir === 'rtl' ? 'ms-2' : 'me-2'} src={createteam} width={20} />
                        <FormattedMessage id="Create_Team" />
                      </Button>
                    </div>
                    {
                    multipleTeam && (
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
                    )
                  }
                    {(
                    teamList && teamList.length !== 0 && teamList.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data, index) => {
                      return (
                        <div key={data._id} className='d-flex justify-content-betwee'>
                          <MyTeam {...props}
                            key={data._id}
                            UserTeamChoice
                            allTeams={teamList}
                            index={index}
                            join
                            noOfJoin={multipleTeam ? ContestSize : 1}
                            notLoading
                            params={sMatchId}
                            setUserTeams={(Id) => setUserTeams(Id)}
                            teamDetails={data}
                            upcoming
                            userTeams={userTeams}
                          />
                        </div>
                      )
                    })
                  )
                  }
                  </CardBody>
                  <CardFooter className='two-button border-0 bg-white m-0 p-0 d-flex justify-content-between'>
                    <Button className='w-100'
                      color='primary-two'
                      disabled={userTeams && userTeams.length === 0}
                      onClick={onJoin}
                      type="submit"
                    >
                      <FormattedMessage id="Join" />
                      (
                      <FormattedMessage id='Pay' />
                      {' '}
                      {currencyLogo}
                      {' '}
                      {location?.state?.entryFee * userTeams?.length}
                      )
                    </Button>
                  </CardFooter>
                </Card>
              </>
              )
            : ''
        }
        {/* {
          teamModal
            ? <>
              {loading && <Loading />}
              <div className="s-team-bg"></div>
              <Card className="filter-card select-team promo-card">
                <CardHeader className='d-flex align-items-center justify-content-between m-0'>
                  <button><FormattedMessage id="Payment" /></button>
                  <button onClick={() => {
                    setTeamModal(false)
                    setIsTeamList(null)
                  }}><img src={close} /></button>
                </CardHeader>
                <CardBody className="p-0 teamXShawing">
                  <div className='teamJoin'>
                    {
                      userTeams && userTeams.length && (
                        <h3>
                          {userTeams.length} <FormattedMessage id="Teams_Selected" />
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
                              <MyTeam {...props} upcoming
                                params={match && id} index={index} teamDetails={data1} key={data1._id} allTeams={updatedFilterData} UserTeamChoice viewOnly />
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
                        <th className='rightAlign'>{currencyLogo}{location?.state?.entryFee * userTeams.length} ( {location?.state?.entryFee && userTeams && `${location?.state?.entryFee} X ${userTeams.length}`} )</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><FormattedMessage id="From_wallet" /></td>
                        <td className='rightAlign'>{currencyLogo}{userInfo && userInfo.nCurrentTotalBalance ? userInfo.nCurrentTotalBalance : 0}</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
                <CardFooter className='p-0 border-0 bg-trnsparent m-0 d-flex justify-content-between'>
                  <Button type="submit" color='primary-two' className="w-100"
                    disabled={userTeams && userTeams.length === 0}
                    onClick={onJoin}>
                    {
                      totalPay > 0
                        ? <FormattedMessage id="Add_Money" />
                        : <FormattedMessage id="Join" />
                    }
                  </Button>
                </CardFooter>
              </Card>
            </>
            : ''
        } */}
      </div>
      <div className='create-contest-two-button m-0 border-0 bg-white d-flex justify-content-around'>
        <Button color='border-two' disabled={winners === 0} onClick={AddContest} type="submit" ><FormattedMessage id="Create_Contest" /></Button>
        <Button color='primary-orange' disabled={winners === 0} onClick={checkTeam} type="submit">
          <FormattedMessage id="Join_and_Create_Contest" />
          {' '}
        </Button>
      </div>
    </>
  )
}

PrizeBreakups.propTypes = {
  setLoading: PropTypes.func,
  generatePrizeBreakup: PropTypes.func,
  createContest: PropTypes.func,
  resMessage: PropTypes.string,
  resStatus: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      sportsType: PropTypes.string,
      id: PropTypes.string
    })
  }),
  gPrizeBreakup: PropTypes.array,
  navigate: PropTypes.shape({
    push: PropTypes.func
  }),
  teamList: PropTypes.array,
  isTeamList: PropTypes.bool,
  jointAndCreateContest: PropTypes.func,
  joinedContest: PropTypes.bool,
  getMyTeamList: PropTypes.func,
  contestDetails: PropTypes.shape({
    sShareCode: PropTypes.string,
    _id: PropTypes.string
  }),
  isNavigate: PropTypes.bool,
  loading: PropTypes.bool,
  resContestMessage: PropTypes.string,
  message: PropTypes.string,
  currencyLogo: PropTypes.string,
  IsCreateContestAndTeam: PropTypes.bool,
  toggleMessage: PropTypes.func,
  isCreatedContest: PropTypes.bool,
  setIsTeamList: PropTypes.func,
  onCreateContestAndTeam: PropTypes.func,
  location: PropTypes.object,
  userInfo: PropTypes.object,
  onGetUserProfile: PropTypes.func,
  token: PropTypes.string,
  teamPlayerList: PropTypes.array,
  onFetchMatchPlayer: PropTypes.func
}

export default Contest(PrizeBreakups)
