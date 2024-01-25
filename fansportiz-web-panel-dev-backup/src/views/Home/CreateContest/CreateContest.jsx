import React, {
  useState, useEffect, useRef
} from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button, Card, CardBody, CardFooter, CardHeader, Form, FormGroup, Input, Label, Alert } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import _ from 'lodash'
import qs from 'query-string'
import {
  verifyLength, isPositive, isNumber, verifySpecCharWithSpace, isUpperCase
} from '../../../utils/helper'
import Loading from '../../../component/Loading'
import createteam from '../../../assests/images/create-team.svg'
import MyTeam from '../components/MyTeam'
import { createPrivateContest } from '../../../utils/Analytics'
import close from '../../../assests/images/close.svg'
import Contest from '../../../HOC/SportsLeagueList/Contest'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

function CreateContest (props) {
  const {
    setLoading,
    createContest,
    onCreateContestAndTeam,
    IsCreateContestAndTeam,
    teamList,
    // generatePrizeBreakup,
    jointAndCreateContest,
    calFee,
    gPrizeBreakup,
    loading,
    calculateFee,
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
    privateLeagueValidation,
    onFetchMatchPlayer,
    teamPlayerList,
    sucessFeeCalculate,
    resContestMessage
    // userInfo
  } = props
  const [winners, setwinners] = useState(0)
  const [userTeams, setUserTeams] = useState([])
  const [message, setMessage] = useState('')
  const [modalMessage2, setModalMessage2] = useState(false)
  const [selectedAll, setSelectedAll] = useState(false)

  const [isCalFee, setIsCalFee] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [ContestName, setContestName] = useState('')
  const [ContestSize, setContestSize] = useState()
  const [ContestPrize, setContestPrize] = useState()
  const [errContestName, setErrContestName] = useState('')
  const [errContestSize, setErrContestSize] = useState('')
  const [errContestPrize, setErrContestPrize] = useState('')
  const [validationFee, setValidationFee] = useState({})
  const [validationSize, setValidationSize] = useState({})
  const [multipleTeam, setMultipleTeam] = useState(false)
  const [poolPrice, setPoolPrice] = useState(false)
  const [modalMessage3, setModalMessage3] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [isJoinAndCreate, setIsJoinAndCreate] = useState(false)
  // const [teamModal, setTeamModal] = useState(false)
  // const [totalPay, setTotalPay] = useState(0)
  // const [updatedFilterData, setUpdatedFilterData] = useState([])
  const matchDetails = useSelector(state => state.match.matchDetails)
  const previousProps = useRef({ ContestPrize, isTeamList, sucessFeeCalculate, resMessage, resStatus, calFee, joinedContest, IsCreateContestAndTeam, isCreatedContest }).current

  const { sMatchId, sportsType } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsCalFee(false)
    if (sMatchId && (teamPlayerList?.length === 0 || !teamPlayerList)) {
      onFetchMatchPlayer(sMatchId)
    }
    if (sportsType) {
      const sport = sportsType
      isUpperCase(sport) && navigate(`/create-contest/${sport.toLowerCase()}/${sMatchId}`)
    }
  }, [])

  useEffect(() => {
    if (location?.state) {
      setContestName(location?.state?.ContestName || '')
      setContestSize(parseInt(location?.state?.ContestSize) || '')
      setContestPrize(parseInt(location?.state?.ContestPrize) || '')
      setMultipleTeam(location?.state?.multipleTeam || '')
      setPoolPrice(location?.state?.poolPrice)
    }
  }, [location?.state])

  window.history.replaceState({}, document.title)

  useEffect(() => {
    if (privateLeagueValidation && privateLeagueValidation.oSize && privateLeagueValidation.oPrize) {
      const contestSize = privateLeagueValidation.oSize.sKey === 'PCS' && privateLeagueValidation.oSize
      const Fee = privateLeagueValidation.oPrize.sKey === 'PCF' && privateLeagueValidation.oPrize
      setValidationFee(Fee)
      setValidationSize(contestSize)
    }
  }, [privateLeagueValidation])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (calFee && calFee.nPrice) {
        setIsCalFee(true)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [calFee])

  useEffect(() => {
    if (previousProps.sucessFeeCalculate !== sucessFeeCalculate) {
      if (sucessFeeCalculate === false) {
        setModalMessage2(true)
        setMessage(resMessage)
      }
    }
    return () => {
      previousProps.sucessFeeCalculate = sucessFeeCalculate
    }
  }, [sucessFeeCalculate])

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
          setModalMessage(false)
          setIsTeamList(null)
          setModalMessage3(false)
          setIsJoinAndCreate(false)
          setModalMessage2(true)
          setMessage(resMessage)
          navigate(`/create-team/${(sportsType).toLowerCase()}/${sMatchId}/join/${contestDetails._id}/private/${contestDetails.sShareCode}`)
        }
      } else if (joinedContest !== null) {
        setModalMessage(false)
        navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`, { state: { matchDetails, matchLeagueDetails: contestDetails } })
      } else {
        navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`, { state: { matchDetails, matchLeagueDetails: contestDetails } })
      }
    }
  }, [isNavigate])

  useEffect(() => {
    if (previousProps.joinedContest !== joinedContest) {
      if (joinedContest !== null) {
        setLoading(false)
        setModalMessage3(false)
        if (joinedContest) {
          navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`, { state: { matchDetails, matchLeagueDetails: contestDetails } })
        } else if (!_.isEmpty(contestDetails)) {
          navigate(`/create-contest/${(sportsType).toLowerCase()}/${sMatchId}/${contestDetails._id}/invite`, { state: { matchDetails, matchLeagueDetails: contestDetails } })
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
      } else if (isCreatedContest === false) {
        setModalMessage2(true)
        setMessage(resContestMessage)
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
        updatedSelectedTeam = teamList.map((data) => data._id)
        setUserTeams(updatedSelectedTeam)
      }
    } else {
      setUserTeams([])
    }
  }, [selectedAll])

  function AddContest () {
    if (verifyLength(ContestName, 3) && isPositive(ContestSize) && isPositive(ContestPrize) && isPositive(winners) && !errContestName && !errContestSize && !errContestPrize) {
      createContest(ContestSize, sMatchId, (ContestName).trim(), multipleTeam, poolPrice, ContestPrize, winners)
      callCreatePrivateContestEvent()
      setLoading(true)
      setIsCreate(true)
      setModalMessage(false)
    }
  }

  function AddContestAndTeam () {
    if (verifyLength(ContestName, 3) && isPositive(ContestSize) && isPositive(ContestPrize) && isPositive(winners) && !errContestName && !errContestSize && !errContestPrize) {
      onCreateContestAndTeam(ContestSize, sMatchId, (ContestName).trim(), multipleTeam, poolPrice, ContestPrize, winners)
      setModalMessage(false)
    }
  }

  function onJoin () {
    if (verifyLength(ContestName, 3) && isPositive(ContestSize) && isPositive(ContestPrize) && isPositive(winners) && !errContestName && !errContestSize && !errContestPrize) {
      jointAndCreateContest(ContestSize, sMatchId, (ContestName).trim(), multipleTeam, poolPrice, ContestPrize, winners, userTeams)
      // setTeamModal(false)
    }
  }

  // useEffect(() => {
  //   if (userInfo !== previousProps.userInfo) {
  //     if (userInfo && userInfo.nCurrentTotalBalance) {
  //       const value = ContestPrize && userTeams && ((ContestPrize * userTeams.length) - (userInfo && userInfo.nCurrentTotalBalance))
  //       setTotalPay(value > 0 ? value.toFixed(2) : 0)
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
          setModalMessage(false)
          isJoinAndCreate && setModalMessage3(true)
        } else {
          createContest(ContestSize, sMatchId, ContestName.trim(), multipleTeam, poolPrice, ContestPrize, winners)
          callCreatePrivateContestEvent()
          setLoading(true)
          setModalMessage(false)
        }
      }
    }
    return () => {
      previousProps.isTeamList = isTeamList
    }
  }, [isTeamList])

  useEffect(() => {
    const callSearchService = () => {
      calculateFee(ContestSize, ContestPrize || 0)
    }
    if (previousProps.ContestPrize !== ContestPrize) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.ContestPrize = ContestPrize
      }
    }
    return () => {
      previousProps.ContestPrize = ContestPrize
    }
  }, [ContestPrize])

  function handleChange (event, type) { // Set the value
    switch (type) {
      case 'ContestSize':
        if (isNumber(event.target.value) && validationSize.nMin && validationSize.nMax && event.target.value >= validationSize.nMin && event.target.value <= validationSize.nMax) {
          if (multipleTeam && parseInt(event.target.value) === validationSize.nMin) {
            setMultipleTeam(false)
            setErrContestSize('')
          } else if (((!multipleTeam && parseInt(event.target.value) >= validationSize.nMin) || (multipleTeam && parseInt(event.target.value) > validationSize.nMin)) && ContestPrize) {
            setErrContestSize('')
          } else if ((!multipleTeam && parseInt(event.target.value) >= validationSize.nMin) || (multipleTeam && parseInt(event.target.value) > validationSize.nMin)) {
            setErrContestSize('')
          }
          if (event.target.value && ContestPrize && validationFee.nMin && validationFee.nMax && ContestPrize >= validationFee.nMin && ContestPrize <= validationFee.nMax) {
            setTimeout(() => {
              calculateFee(event.target.value, ContestPrize)
            }, 1000)
          }
        } else if (event.target.value > validationSize.nMax || event.target.value < validationSize.nMin) {
          setErrContestSize(validationSize.sMinMessage)
        } else if (!(event.target.value >= validationSize.nMin)) {
          setErrContestSize(validationSize.sMinMessage)
        } else {
          setErrContestSize('')
        }
        setContestSize(event.target.value)
        break
      case 'ContestPrize':
        if (isNumber(event.target.value) && validationFee.nMin && validationFee.nMax && event.target.value >= validationFee.nMin && event.target.value <= validationFee.nMax) {
          // if (event.target.value && ContestSize >= 2) {
          //   setTimeout(() => {
          //     calculateFee(ContestSize, event.target.value)
          //   }, 1000)
          // }
          setErrContestPrize('')
        } else if (validationFee.nMin && validationFee.nMax && (event.target.value > validationFee.nMax || event.target.value < validationFee.nMin)) {
          setErrContestPrize(validationFee?.sMinMessage)
        } else if (!(event.target.value >= validationFee.nMin)) {
          setErrContestPrize(validationFee.sMinMessage)
        } else {
          setErrContestPrize('')
        }
        setContestPrize(event.target.value)
        break
      case 'ContestName':
        if (verifyLength(event.target.value, 4) && event.target.value.length <= 16 && verifySpecCharWithSpace(event.target.value)) {
          setErrContestName('')
        } else if (event.target.value.length >= 16) {
          setErrContestName(<FormattedMessage id="Contest_Name_cannot_be_larger_than_16_characters" />)
        } else if (!event.target.value) {
          setErrContestName(<FormattedMessage id="Required_field" />)
        } else if (event.target.value.length <= 4) {
          setErrContestName(<FormattedMessage id="Contest_Name_must_be_minimum_4_character" />)
        } else if (!verifySpecCharWithSpace(event.target.value)) {
          setErrContestName(<FormattedMessage id="Special_character_are_not_allowed_in_Contest_name" />)
        }
        setContestName(event.target.value)
        break
      case 'multiTeam':
        if (!multipleTeam) {
          if (ContestSize === '2') {
            setErrContestSize(<FormattedMessage id="Contest_Size_should_be_greater_than_2" />)
          }
        } else {
          setErrContestSize('')
        }
        setMultipleTeam(!multipleTeam)
        break
      case 'poolPrice':
        setPoolPrice(!poolPrice)
        break
      default:
        break
    }
  }
  function CalculateFee () {
    setwinners(0)
    if (ContestSize && ContestPrize && isPositive(ContestSize)) { calculateFee(ContestSize, ContestPrize) }
  }

  function changeScreen () {
    if (verifyLength(ContestName, 4) && isPositive(ContestSize) && ContestName.trim().length && calFee && calFee.nPrice && !errContestName && !errContestSize && !errContestPrize && calFee.nPrice >= 5) {
      navigate(`/create-contest/${sportsType}/${sMatchId}/prize-breakups`,
        {
          search: `?${qs.stringify({
            homePage: homePage ? 'yes' : undefined
          })}`,
          state: {
            ContestName, ContestPrize, ContestSize, multipleTeam, poolPrice, entryFee: calFee?.nPrice?.toFixed(2)
          }
        })
      // setModalMessage(true)
      // setLoading(true)
      // generatePrizeBreakup(ContestSize, poolPrice)
    } else {
      if (!(calFee && calFee.nPrice >= 5)) {
        setModalMessage2(true)
        setMessage(<FormattedMessage id="Entry_Fee_cannot_be_less_than_5" />)
      }
      if (!verifyLength(ContestName, 4)) {
        setErrContestName(<FormattedMessage id="Contest_Name_must_be_minimum_4_character" />)
      }
      if (!isPositive(ContestSize)) {
        setErrContestSize(<FormattedMessage id="Contest_Size_is_required" />)
      }
      if (!isPositive(ContestPrize)) {
        setErrContestPrize(<FormattedMessage id="Contest_Prize_is_required" />)
      }
      if (!ContestName.trim().length) {
        setErrContestName('Only white spaces are not allowed')
      }
    }
  }

  const handleonKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault()
    }
  }

  function closeSelectTeam () {
    setLoading(false)
    setIsTeamList(null)
    setModalMessage3(false)
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
      <div className="user-container bg-white no-footer">
        {
          modalMessage2
            ? (
              <Alert color="primary" isOpen={modalMessage2}>{message}</Alert>
              )
            : ''
        }
        <Form className="form pb-0">
          <FormGroup className="c-input">
            <Input autoComplete="off" className={ContestName ? 'hash-contain' : ''} id="ContestName" maxLength={16} onChange={(e) => { handleChange(e, 'ContestName') }} type="text" value={ContestName} />
            <Label className="label m-0" for="ContestName"><FormattedMessage id="Contest_Name" /></Label>
            <p className="error-text">{errContestName}</p>
          </FormGroup>
          <FormGroup className="c-input">
            <Input autoComplete="off" className={ContestSize ? 'hash-contain' : ''} id="ContestSize" onChange={(e) => { handleChange(e, 'ContestSize') }} onKeyPress={handleonKeyPress} type="text" value={ContestSize} />
            <Label className="label m-0" for="ContestSize">
              <FormattedMessage id="Contest_Size" />
              (min
              {' '}
              {validationSize?.nMin}
              )
            </Label>
            <p className="error-text">{errContestSize}</p>
          </FormGroup>
          <FormGroup className="c-input">
            <Input autoComplete="off" className={ContestPrize ? 'hash-contain' : ''} id="ContestPrize" onChange={(e) => { handleChange(e, 'ContestPrize') }} onKeyPress={handleonKeyPress} type="text" value={ContestPrize} />
            <Label className="label m-0" for="ContestPrize"><FormattedMessage id="Contest_Prize" /></Label>
            <p className="error-text">{errContestPrize}</p>
          </FormGroup>
          <FormGroup className="custom-switch">
            <Input checked={multipleTeam} className="custom-control-input" id="customSwitch1" onChange={(e) => { handleChange(e, 'multiTeam') }} role='switch' type="checkbox" />
            <Label className="custom-control-label" htmlFor="customSwitch1"><FormattedMessage id="Allow_multiple_teams" /></Label>
          </FormGroup>
          <FormGroup className="custom-switch">
            <Input checked={poolPrice} className="custom-control-input" id="customSwitch2" onChange={(e) => { handleChange(e, 'poolPrice') }} role='switch' type="checkbox" />
            <Label className="custom-control-label" htmlFor="customSwitch2"><FormattedMessage id="Allow_Pool_Prize" /></Label>
            <p className= 'Contest-poolText' >
              (
              <FormattedMessage id="By_default_all_decided_participaints_are_required_for_contest_to_be_confirmed" />
              )
            </p>
          </FormGroup>
          <div className="text-center">
            {/* {
              isCalFee && calFee && calFee.nPrice && */}
            <h1 className="fee-price">
              <FormattedMessage id="Entry_Fee" />
              :
              {' '}
              <b className="fee-price-b">
                {currencyLogo}
                {' '}
                {calFee && calFee.nPrice ? calFee.nPrice.toFixed(2) : '-'}
                {' '}
              </b>
            </h1>
            <p><FormattedMessage id="Entry_Fee_is_calculated_based_on_contest_size_and_contest_prize" /></p>
            {/* } */}
          </div>
          {
            isCalFee && calFee &&
            (
            <div className="creator-bonus">
              <FormattedMessage id="You_Will_Get_Creator_Bonus_of" />
              <b>
                {currencyLogo}
                {' '}
                {calFee && calFee.nCreatorBonus && calFee.nCreatorBonusGst && !isNaN(calFee.nCreatorBonusGst) ? parseFloat(calFee.nCreatorBonus - calFee.nCreatorBonusGst).toFixed(2) : 0}
              </b>
            </div>
            )
          }
          <Button className="w-100 d-block mt-3" color="primary" disabled={errContestPrize || errContestName || errContestSize || !verifyLength(ContestName, 3) || !isPositive(ContestSize) || !isPositive(ContestPrize) || !(calFee && calFee.nPrice)} onClick={changeScreen}><FormattedMessage id="Create_Contest" /></Button>
        </Form>
        {
          modalMessage
            ? (
              <>
                <div className="s-team-bg" />
                <Card className="filter-card select-team promo-card c-winner">
                  <CardHeader className="d-flex align-items-center justify-content-between m-0">
                    <button><FormattedMessage id="Choose_total_no_of_winners" /></button>
                    <button onClick={() => {
                      setModalMessage(false)
                      CalculateFee()
                      setIsTeamList(null)
                    }}
                    >
                      <img src={close} />
                    </button>
                  </CardHeader>
                  <CardBody className="p-0">
                    <div className="d-flex h-w">
                      <div className="hw-b">
                        <p><FormattedMessage id="Contest_Size" /></p>
                        <h4>{ContestSize}</h4>
                      </div>
                      <div className="hw-b text-center">
                        <p><FormattedMessage id="Entry_Fee" /></p>
                        <h4>
                          {currencyLogo}
                          {' '}
                          {calFee && calFee.nPrice ? calFee.nPrice.toFixed(2) : location?.state?.entryFee ? location?.state?.entryFee : ''}
                        </h4>
                      </div>
                      <div className="hw-b text-end">
                        <p><FormattedMessage id="Contest_Prize" /></p>
                        <h4>
                          {currencyLogo}
                          {' '}
                          {ContestPrize}
                        </h4>
                      </div>
                    </div>
                    <ol className="s-winner">
                      {
                      loading && <Loading />
                    }
                      {gPrizeBreakup && gPrizeBreakup.length > 0 && gPrizeBreakup.sort((a, b) => a?.nPrizeNo?.toString().localeCompare(b?.nPrizeNo?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data) => (
                        <li key={data._id}>
                          <input className="d-none" defaultChecked={winners === data.nPrizeNo} id={`label${data.nPrizeNo}`} name="winner" type="radio" />
                          <label htmlFor={`label${data.nPrizeNo}`} onClick={() => setwinners(data.nPrizeNo)}>
                            <h3>{data && data.sTitle && data.sTitle}</h3>
                            {
                                data.aPrizeBreakups && data.aPrizeBreakups.length !== 0 && data.aPrizeBreakups.map((prize, index) => (
                                  <div key={prize._id} className="item d-flex">
                                    <span>
                                      {prize && prize.nRankFrom && prize.nRankTo && prize.nRankFrom === prize.nRankTo ? `# ${prize.nRankFrom}` : `# ${prize.nRankFrom} - ${prize.nRankTo}`}
                                    </span>
                                    <span className="text-center">
                                      {prize && prize.nPrizePer}
                                      <FormattedMessage id="Percentage" />
                                    </span>
                                    <span className="text-end">{((ContestPrize * prize.nPrizePer) / 100).toFixed(1)}</span>
                                  </div>
                                ))
                              }
                          </label>
                        </li>
                      ))}
                    </ol>
                  </CardBody>
                  <CardFooter className="create-contest-two-button border-0 bg-white m-0 d-flex justify-content-around">
                    <Button color="border-two" disabled={winners === 0} onClick={AddContest} type="submit"><FormattedMessage id="Create_Contest" /></Button>
                    <Button color="primary-orange" disabled={winners === 0} onClick={checkTeam} type="submit">
                      <FormattedMessage id="Join_and_Create_Contest" />
                      {' '}
                    </Button>
                  </CardFooter>
                </Card>
              </>
              )
            : ''
        }
        {
          modalMessage3
            ? (
              <>
                <div className="s-team-bg" />
                <Card className="filter-card select-team promo-card">
                  <CardHeader className="d-flex align-items-center justify-content-between m-0">
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
                      <Button className="create-team-button" onClick={AddContestAndTeam} type="submit">
                        <img alt="Create Team" className="me-2" src={createteam} width={20} />
                        <FormattedMessage id="Create_a_new_team" />
                      </Button>
                    </div>
                    {
                    multipleTeam && (
                      <div className="SelectAll d-flex align-items-center">
                        <input
                          checked={selectedAll}
                          id="name"
                          name="gender"
                          onClick={() => setSelectedAll(!selectedAll)}
                          type="radio"
                        />
                        <label htmlFor="name">
                          <FormattedMessage id="Select_All" />
                          {' '}
                        </label>
                      </div>
                    )
                  }
                    {(
                    teamList && teamList.length !== 0 && teamList.sort((a, b) => a?.sName?.toString().localeCompare(b?.sName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data, index) => {
                      return (
                        <div key={data._id} className='d-flex'>
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
                      {calFee?.nPrice && userTeams && calFee?.nPrice * userTeams?.length}
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
            ? (
              <>
                {loading && <Loading />}
                <div className="s-team-bg" />
                <Card className="filter-card select-team promo-card">
                  <CardHeader className="d-flex align-items-center justify-content-between m-0">
                    <button><FormattedMessage id="Payment" /></button>
                    <button onClick={() => {
                      setTeamModal(false)
                      setIsTeamList(null)
                    }}
                    >
                      <img src={close} />
                    </button>
                  </CardHeader>
                  <CardBody className="p-0 teamXShawing">
                    <div className="teamJoin">
                      {
                      userTeams && userTeams.length && (
                        <h3>
                          {userTeams.length}
                          {' '}
                          <FormattedMessage id="Teams_Selected" />
                        </h3>
                      )
                    }
                    </div>
                    <div className="selectedTeamList">
                      {
                      updatedFilterData && updatedFilterData.length !== 0
                        ? updatedFilterData.sort((a, b) => a?.sTeamName?.toString().localeCompare(b?.sTeamName?.toString(), 'en', { numeric: true, sensitivity: 'base' })).map((data1, index) => (
                          <Suspense key={data1._id} fallback={<Loading />}>
                            <MyTeam
                              {...props}
                              upcoming
                                // noOfJoin={noOfJoin}
                              params={match && id}
                              index={index}
                              teamDetails={data1}
                              key={data1._id}
                              allTeams={updatedFilterData}
                              UserTeamChoice
                              viewOnly
                            />
                          </Suspense>
                        ))
                        : ''
                    }
                  </div>
                  <Table className="m-0 bg-white promocode">
                    <thead>
                      <tr>
                        <th><FormattedMessage id="Total_Entry" /></th>
                        <th className='rightAlign'>{currencyLogo}{calFee && calFee.nPrice && userTeams && calFee.nPrice * userTeams.length} ( {calFee && calFee.nPrice && userTeams && `${calFee.nPrice} X ${userTeams.length}`} )</th>
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
              )
            : ''
        } */}
      </div>
    </>
  )
}

CreateContest.propTypes = {
  calculateFee: PropTypes.func,
  setLoading: PropTypes.func,
  generatePrizeBreakup: PropTypes.func,
  createContest: PropTypes.func,
  privateLeagueValidation: PropTypes.array,
  resMessage: PropTypes.string,
  resStatus: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      sportsType: PropTypes.string,
      id: PropTypes.string
    })
  }),
  gPrizeBreakup: PropTypes.array,
  calFee: PropTypes.shape({
    sportsType: PropTypes.string,
    id: PropTypes.string,
    nPrice: PropTypes.number,
    nCreatorBonus: PropTypes.number,
    nCreatorBonusGst: PropTypes.number
  }),
  sucessFeeCalculate: PropTypes.bool,
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
  AddContest: PropTypes.func,
  joinAndCreateContest: PropTypes.func,
  ContestName: PropTypes.string,
  ContestSize: PropTypes.string,
  resContestMessage: PropTypes.string,
  ContestPrize: PropTypes.string,
  message: PropTypes.string,
  currencyLogo: PropTypes.string,
  errContestName: PropTypes.string,
  errContestSize: PropTypes.string,
  errContestPrize: PropTypes.string,
  multipleTeam: PropTypes.bool,
  poolPrice: PropTypes.bool,
  modalMessage: PropTypes.bool,
  modalMessage2: PropTypes.bool,
  IsCreateContestAndTeam: PropTypes.bool,
  toggleMessage: PropTypes.func,
  toggleMessageFirst: PropTypes.func,
  userTeamId: PropTypes.string,
  setUserTeamId: PropTypes.func,
  winners: PropTypes.bool,
  isCreatedContest: PropTypes.bool,
  setIsTeamList: PropTypes.func,
  setwinners: PropTypes.func,
  getMyTeamListFun: PropTypes.func,
  onFetchMatchPlayer: PropTypes.func,
  getDetailsFun: PropTypes.func,
  onCreateContestAndTeam: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.object,
    search: PropTypes.string
  }),
  teamPlayerList: PropTypes.shape({
    length: PropTypes.number
  }),
  userInfo: PropTypes.object,
  onGetUserProfile: PropTypes.func
}

export default Contest(CreateContest)
