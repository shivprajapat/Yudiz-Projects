import React, { useState, useEffect, useRef, Fragment, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Row, Col, FormGroup, Input, CustomInput, Label, Button, UncontrolledAlert, InputGroupText, UncontrolledPopover, PopoverBody
} from 'reactstrap'
import moment from 'moment'
import { verifyLength, isNumber, isPositive, modalMessageFunc, alertClass } from '../../../../helpers/helper'
import { addPromocode, getPromocodeDetails, updatePromocode } from '../../../../actions/promocode'
import Loading from '../../../../components/Loading'
import PropTypes from 'prop-types'
import { getAllLeagues } from '../../../../actions/league'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { getUpcomingMatchList } from '../../../../actions/match'
import infoIcon from '../../../../assets/images/info2.svg'
import DatePicker from 'react-datepicker'
const animatedComponents = makeAnimated()

function AddPromocode (props) {
  const { match } = props
  const [Name, setName] = useState('')
  const [CouponCode, setCouponCode] = useState('')
  const [amount, setAmount] = useState(0)
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [maxAllow, setMaxAllow] = useState(0)
  const [promoType, setPromoType] = useState('')
  const [MatchList, setMatchList] = useState([])
  const [Match, setMatch] = useState([])
  const [LeagueList, setLeagueList] = useState([])
  const [leagueInput, setLeagueInput] = useState('')
  const [League, setLeague] = useState([])
  const [SelectedMatchOption, setSelectedMatchOption] = useState([])
  const [SelectedLeagueOption, setSelectedLeagueOption] = useState([])
  const [errPromoType, setErrPromoType] = useState('')
  const [errMatch, setErrMatch] = useState('')
  const [errLeague, setErrLeague] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [errCouponCode, setErrCouponCode] = useState('')
  const [errName, setErrName] = useState('')
  const [errAmount, setErrAmount] = useState('')
  const [errMinAmount, setErrMinAmount] = useState('')
  const [errMaxAmount, setErrMaxAmount] = useState('')
  const [errmaxAllow, setErrmaxAllow] = useState('')
  const [errStartDate, setErrStartDate] = useState('')
  const [errEndDate, setErrEndDate] = useState('')
  const [errdescription, setErrdescription] = useState('')
  const [Percentage, setPercentage] = useState('N')
  const [promocodeStatus, setPromocodeStatus] = useState('N')
  const [isMaxAllowForAllUsers, setIsMaxAllowForAllUsers] = useState('N')
  const [maxAllowPerUser, setMaxAllowPerUser] = useState(1)
  const [loading, setLoading] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [promocodeId, setPromocodeId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [close, setClose] = useState(false)
  const [matchDetailActivePage, setMatchDetailActivePage] = useState(1)
  const [leagueDetailActivePage, setLeagueDetailActivePage] = useState(1)
  const [matchStart, setMatchStart] = useState(0)
  const [leagueStart, setLeagueStart] = useState(0)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const promocodeDetails = useSelector(state => state.promocode.promocodeDetails)
  const resMessage = useSelector(state => state.promocode.resMessage)
  const resStatus = useSelector(state => state.promocode.resStatus)
  const sportsList = useSelector(state => state.sports.sportsList)
  const upcomingMatchList = useSelector(state => state.match.upcomingMatchList)
  const allLeagues = useSelector(state => state.league.allLeagues)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resMessage, promocodeDetails, allLeagues, upcomingMatchList, leagueInput }).current
  const [modalMessage, setModalMessage] = useState(false)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const leagueResDisable = promocodeDetails && previousProps.promocodeDetails !== promocodeDetails && promocodeDetails.aLeagues && promocodeDetails.aLeagues.map(data => data._id)
  const leagueDisable = League && League.length >= 1 && League.map(data => data.value)
  const matchResDisable = promocodeDetails && previousProps.promocodeDetails !== promocodeDetails && promocodeDetails.aMatches && promocodeDetails.aMatches.map(data => data._id)
  const matchDisable = Match && Match.length >= 1 && Match.map(data => data.value)
  const submitDisable = promocodeDetails && (previousProps.promocodeDetails !== promocodeDetails && promocodeDetails?.sName === Name && promocodeDetails?.eType === promoType && JSON.stringify(matchDisable) === JSON.stringify(matchResDisable) && JSON.stringify(leagueDisable) === JSON.stringify(leagueResDisable) && promocodeDetails.sCode === CouponCode &&
  promocodeDetails.sInfo === description && promocodeDetails.nAmount === parseInt(amount) && promocodeDetails?.nMinAmount === parseInt(minAmount) && promocodeDetails?.nMaxAmount === parseInt(maxAmount) &&
  promocodeDetails.nMaxAllow === parseInt(maxAllow) && promocodeDetails.nPerUserUsage === parseInt(maxAllowPerUser) && moment(promocodeDetails.dStartTime).isSame(startDate) && moment(promocodeDetails.dExpireTime).isSame(endDate) && (promocodeDetails.bIsPercent === (Percentage === 'Y')) &&
  (promocodeDetails.eStatus === promocodeStatus) && (promocodeDetails.bMaxAllowForAllUser === (isMaxAllowForAllUsers === 'Y')))

  useEffect(() => {
    if (match.params.id) {
      dispatch(getPromocodeDetails(match.params.id, token))
      setPromocodeId(match.params.id)
      setIsCreate(false)
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
        setLoading(false)
        if (resStatus && isCreate) {
          props.history.push('/settings/promocode-management', { message: resMessage })
        } else {
          if (resStatus) {
            dispatch(getPromocodeDetails(match.params.id, token))
          }
        }
        setModalMessage(true)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage])

  useEffect(() => {
    setLeagueList([])
    const callSearchService = () => {
      dispatch(getAllLeagues(0, leagueInput, token))
    }
    if (leagueInput) {
      if (previousProps.leagueInput !== leagueInput) {
        const debouncer = setTimeout(() => {
          callSearchService()
        }, 1000)
        return () => {
          clearTimeout(debouncer)
          previousProps.leagueInput = leagueInput
        }
      }
    }
    return () => {
      previousProps.leagueInput = leagueInput
    }
  }, [leagueInput])

  useEffect(() => {
    if (previousProps.promoType !== promoType) {
      if (promoType === 'MATCH') {
        dispatch(getUpcomingMatchList(matchStart, token))
        dispatch(getAllLeagues(leagueStart, leagueInput, token))
        setLoading(true)
      }
    }
    return () => {
      previousProps.promoType = promoType
    }
  }, [promoType, sportsList])

  useEffect(() => {
    if (upcomingMatchList && allLeagues) {
      setLoading(false)
    }
    return () => {
      previousProps.upcomingMatchList = upcomingMatchList
      previousProps.allLeagues = allLeagues
    }
  }, [upcomingMatchList, allLeagues])

  useEffect(() => {
    if (previousProps.upcomingMatchList !== upcomingMatchList) {
      if (upcomingMatchList) {
        !upcomingMatchList.results && setErrMatch('')
        const arr = [...MatchList]
        if (upcomingMatchList.results && upcomingMatchList.results.length !== 0) {
          upcomingMatchList.results.map((data) => {
            const obj = {
              value: data._id,
              label: <><p className='m-0'>{data.sName} ({data.eCategory})</p><p className='m-0'>{moment(data.dStartDate).format('DD/MM/YYYY hh:mm:ss A')}</p></>
            }
            arr.push(obj)
            return arr
          })
          setMatchList(arr)
        }
      }
    }
    return () => {
      previousProps.upcomingMatchList = upcomingMatchList
    }
  }, [upcomingMatchList])

  useEffect(() => {
    if (previousProps.allLeagues !== allLeagues) {
      if (allLeagues) {
        const arr = [...LeagueList]
        if (allLeagues.results.length !== 0) {
          allLeagues.results.map((leagueData) => {
            const obj = {
              value: leagueData._id,
              label: leagueData.sName + ' (' + leagueData.eCategory + ')'
            }
            arr.push(obj)
            return arr
          })
          setLeagueList(arr)
        }
      }
    }
    return () => {
      previousProps.allLeagues = allLeagues
    }
  }, [allLeagues])

  useEffect(() => {
    if (previousProps.promocodeDetails !== promocodeDetails) {
      if (promocodeDetails) {
        setPromoType(promocodeDetails.eType)
        setMatch(promocodeDetails.aMatches && promocodeDetails.aMatches.length !== 0
          ? promocodeDetails.aMatches.map((data) => (
            {
              value: data._id,
              label: <><p className='m-0'>{data.sName} ({data.eCategory})</p><p className='m-0'>{moment(data.dStartDate).format('DD/MM/YYYY hh:mm:ss A')}</p></>
            })
          )
          : [])
        setLeague(promocodeDetails.aLeagues?.length !== 0
          ? promocodeDetails.aLeagues.map((data) => (
            {
              value: data._id,
              label: data.sName + ' (' + data.eCategory + ')'
            })
          )
          : [])
        setSelectedMatchOption(promocodeDetails.aMatches?.length !== 0
          ? promocodeDetails.aMatches.map((data) => (
            {
              value: data._id,
              label: <><p className='m-0'>{data.sName} ({data.eCategory})</p><p className='m-0'>{moment(data.dStartDate).format('DD/MM/YYYY hh:mm:ss A')}</p></>
            })
          )
          : [])
        setSelectedLeagueOption(promocodeDetails.aLeagues?.length !== 0
          ? promocodeDetails.aLeagues.map((data) => (
            {
              value: data._id,
              label: data.sName + ' (' + data.eCategory + ')'
            })
          )
          : [])
        setName(promocodeDetails.sName)
        setDescription(promocodeDetails.sInfo)
        setCouponCode(promocodeDetails.sCode)
        setAmount(promocodeDetails.nAmount)
        setMaxAmount(promocodeDetails.nMaxAmount)
        setMinAmount(promocodeDetails.nMinAmount)
        setMaxAllow(promocodeDetails.nMaxAllow)
        setMaxAllowPerUser(promocodeDetails.nPerUserUsage ? promocodeDetails.nPerUserUsage : 1)
        setStartDate(new Date(moment(promocodeDetails.dStartTime).format()))
        setEndDate(new Date(moment(promocodeDetails.dExpireTime).format()))
        setPromocodeStatus(promocodeDetails.eStatus)
        setPercentage(promocodeDetails.bIsPercent ? 'Y' : 'N')
        setIsMaxAllowForAllUsers(promocodeDetails.bMaxAllowForAllUser ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.promocodeDetails = promocodeDetails
    }
  }, [promocodeDetails])

  function onLeagueSelect (selectedOption, type) {
    switch (type) {
      case 'League':
        if (selectedOption) {
          setSelectedLeagueOption(selectedOption)
          if (selectedOption.length >= 1) {
            setErrLeague('')
          } else {
            setErrLeague('Required field')
          }
          setLeague(selectedOption)
        } else {
          setLeague([])
          setSelectedLeagueOption([])
        }
        break
      case 'Match':
        if (selectedOption) {
          setSelectedMatchOption(selectedOption)
          if (selectedOption.length >= 1) {
            setErrMatch('')
          } else {
            setErrMatch('Required field')
          }
          setMatch(selectedOption)
        } else {
          setMatch([])
          setSelectedMatchOption([])
        }
        break
      default:
        break
    }
  }

  function handleChange (event, type) {
    switch (type) {
      case 'PromoType':
        if (verifyLength(event.target.value, 1)) {
          setErrPromoType('')
        } else {
          setErrPromoType('Required field')
        }
        setPromoType(event.target.value)
        setMatch([])
        setLeague([])
        setSelectedMatchOption([])
        setSelectedLeagueOption([])
        errMinAmount && setErrMinAmount('')
        errMaxAmount && setErrMaxAmount('')
        break
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'CouponCode':
        if ((event.target.value)) {
          setErrCouponCode('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrCouponCode('Required field')
        }
        setCouponCode((event.target.value).toUpperCase())
        break
      case 'Amount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrAmount('')
          } else {
            setErrAmount('Required field')
          }
          setAmount(event.target.value)
        }
        break
      case 'Min':
        if (isPositive(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrMinAmount('')
          } else {
            setErrMinAmount('Required field')
          }
          setMinAmount(event.target.value)
          if (parseInt(maxAmount) && (parseInt(event.target.value) > parseInt(maxAmount))) {
            setErrMinAmount('Minimum amount should be less than Maximum amount!')
          } else {
            setErrMinAmount('')
            setErrMaxAmount('')
          }
        }
        break
      case 'Max':
        if (isPositive(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrMaxAmount('')
          } else {
            setErrMaxAmount('Required field')
          }
          setMaxAmount(event.target.value)
          if (parseInt(minAmount) && (parseInt(minAmount) > parseInt(event.target.value))) {
            setErrMaxAmount('Maximum amount should be greater than Minimum amount!')
          } else {
            setErrMaxAmount('')
            setErrMinAmount('')
          }
        }
        break
      case 'maxAllow':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrmaxAllow('')
          } else {
            setErrmaxAllow('Required field')
          }
          setMaxAllow(event.target.value)
        }
        break
      case 'MaxAllowPerUser':
        if (isNumber(event.target.value) || !event.target.value) {
          setMaxAllowPerUser(event.target.value)
        }
        break
      case 'Status':
        setPromocodeStatus(event.target.value)
        break
      case 'Percentage':
        setPercentage(event.target.value)
        break
      case 'StartDate':
        if (verifyLength(moment(event).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setErrStartDate('')
        } else {
          setErrStartDate('Required field')
        }
        if (moment(event).isBefore(moment())) {
          setErrStartDate('Date should be future date')
        }
        setStartDate(event)
        if (moment(event).isSame(endDate)) {
          setErrStartDate('Date should be past date from end date!')
        } else {
          setErrEndDate('')
          setErrStartDate('')
        }
        break
      case 'EndDate':
        if (verifyLength(moment(event).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setErrEndDate('')
        } else {
          setErrEndDate('Required field')
        }
        if (moment(event).isBefore(moment()) || moment(event).isBefore(startDate)) {
          setErrEndDate('Date should be future date')
        } else if (moment(event).isSame(startDate)) {
          setErrEndDate('Date should be future date from start date!')
        } else {
          setErrEndDate('')
          setErrStartDate('')
        }
        setEndDate(event)
        break
      case 'description':
        if (verifyLength(event.target.value, 1)) {
          setErrdescription('')
        } else {
          setErrdescription('Required field')
        }
        setDescription(event.target.value)
        break
      case 'MaxAllowForAllUsers':
        if (event.target.value === 'N') {
          setMaxAllowPerUser(1)
        }
        setIsMaxAllowForAllUsers(event.target.value)
        break
      default:
        break
    }
  }

  function onAdd (e) {
    e.preventDefault()
    let verify = false
    if (promoType === 'DEPOSIT') {
      verify = (verifyLength(CouponCode, 1) && verifyLength(Name, 1) && verifyLength(description, 1) && minAmount && maxAmount && parseInt(minAmount) <= parseInt(maxAmount) && startDate && endDate && !errName && !errStartDate && !errEndDate && !errCouponCode && !errAmount && !errdescription)
    } else if (promoType === 'MATCH') {
      verify = (SelectedMatchOption && SelectedMatchOption.length >= 1 && SelectedLeagueOption && SelectedLeagueOption.length >= 1 && verifyLength(CouponCode, 1) && verifyLength(Name, 1) && verifyLength(description, 1) && startDate && endDate && !errName && !errStartDate && !errEndDate && !errCouponCode && !errAmount && !errdescription && !errMatch && !errLeague)
    }
    if (verify) {
      let startingDate, endingDate
      if (startDate && endDate) {
        startingDate = new Date(startDate).toISOString()
        endingDate = new Date(endDate).toISOString()
      }
      const selectedMatches = []
      SelectedMatchOption && SelectedMatchOption.map((data) => {
        selectedMatches.push(data.value)
        return selectedMatches
      })
      const selectedLeagues = []
      SelectedLeagueOption && SelectedLeagueOption.map((data) => {
        selectedLeagues.push(data.value)
        return selectedLeagues
      })
      if (isCreate) {
        const addPromocodeData = {
          promoType, selectedMatches, selectedLeagues, Name, CouponCode, description, amount, minAmount, maxAmount, maxAllow, maxAllowPerUser, startingDate, endingDate, Percentage: Percentage === 'Y', promocodeStatus, isMaxAllowForAllUsers: isMaxAllowForAllUsers === 'Y', token
        }
        dispatch(addPromocode(addPromocodeData))
      } else {
        const updatePromocodeData = {
          promoType, selectedMatches, selectedLeagues, promocodeId, Name, CouponCode, description, amount, minAmount, maxAmount, maxAllow, maxAllowPerUser, startingDate, endingDate, Percentage: Percentage === 'Y', promocodeStatus, isMaxAllowForAllUsers: isMaxAllowForAllUsers === 'Y', token
        }
        dispatch(updatePromocode(updatePromocodeData))
      }
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        setErrName('Required field')
      }
      if (!verifyLength(CouponCode, 1)) {
        setErrCouponCode('Required field')
      }
      if (!verifyLength(description, 1)) {
        setErrdescription('Required field')
      }
      if (!startDate) {
        setErrStartDate('Required field')
      }
      if (!endDate) {
        setErrEndDate('Required field')
      }
      if (!amount) {
        setErrAmount('Required field')
      }
      if (promoType === 'DEPOSIT' && (parseInt(minAmount) > parseInt(maxAmount))) {
        setErrMaxAmount('Maximum amount should be greater than Minimum Amount')
      }
      if ((promoType === 'DEPOSIT' || promoType === '') && !minAmount) {
        setErrMinAmount('Required field')
      }
      if ((promoType === 'DEPOSIT' || promoType === '') && !maxAmount) {
        setErrMaxAmount('Required field')
      }
      if (!maxAllow) {
        setErrmaxAllow('Required field')
      }
      if (!promoType) {
        setErrPromoType('Required field')
      }
      if (promoType === 'MATCH' && SelectedMatchOption.length === 0) {
        setErrMatch('Required field')
      }
      if (promoType === 'MATCH' && SelectedLeagueOption.length === 0) {
        setErrLeague('Required field')
      }
    }
  }

  function onMatchPagination () {
    const length = Math.ceil(upcomingMatchList?.total / 10)
    if (matchDetailActivePage < length) {
      const start = matchDetailActivePage * 10
      setMatchStart(start)
      dispatch(getUpcomingMatchList(start, token))
      setMatchDetailActivePage(matchDetailActivePage + 1)
    }
  }

  function onLeaguePagination () {
    const length = Math.ceil(allLeagues?.total / 10)
    if (leagueDetailActivePage < length) {
      const start = leagueDetailActivePage * 10
      setLeagueStart(start)
      dispatch(getAllLeagues(start, leagueInput, token))
      setLeagueDetailActivePage(leagueDetailActivePage + 1)
    }
  }

  function handleInputChange (value) {
    setLeagueInput(value)
  }

  const ExampleCustomInput = forwardRef(({ value, onClick, placeHolder }, ref) => (
    <div className='form-control date-range'>
      <Input value={value} placeholder={placeHolder} ref={ref} onClick={onClick} readOnly />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  return (
    <main className="main-content">
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      {loading && <Loading />}
      <section className="common-box common-detail">
        <h2>
        {isCreate ? 'Create Promocode' : 'Edit Promocode'}
        </h2>
        <Row className="row-12">
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="promocodeType">Promocode Type <span className="required-field">*</span></Label>
              <CustomInput disabled={adminPermission?.PROMO === 'R'} type="select" name="promoType" id="promoType" className="form-control" value={promoType} onChange={event => handleChange(event, 'PromoType')}>
                <option value=''>Select Type</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="MATCH">Match/Contest</option>
              </CustomInput>
              <p className="error-text">{errPromoType}</p>
            </FormGroup>
          </Col>
        {promoType === 'MATCH' && <Col xl={4} lg={4} md={6}>
          <FormGroup>
            <Label for="LeagueName">Match List <span className="required-field">*</span></Label>
            <Select
              menuPlacement="auto"
              menuPosition="fixed"
              captureMenuScroll={true}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti={true}
              options={MatchList}
              id="Match"
              name="Match"
              placeholder="Select Match"
              value={Match}
              onMenuScrollToBottom={onMatchPagination}
              onChange={selectedOption => onLeagueSelect(selectedOption, 'Match')}
              isDisabled={adminPermission?.PROMO === 'R'}
            />
            <p className="error-text">{errMatch}</p>
          </FormGroup>
        </Col>}
        {promoType === 'MATCH' && <Col xl={4} lg={4} md={6}>
        <FormGroup>
            <Label for="LeagueName">League List <span className="required-field">*</span></Label>
            <Select
              menuPlacement="auto"
              menuPosition="fixed"
              captureMenuScroll={true}
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti={true}
              options={LeagueList}
              id="League"
              name="League"
              placeholder="Select League"
              value={League}
              onMenuScrollToBottom={onLeaguePagination}
              onChange={selectedOption => onLeagueSelect(selectedOption, 'League')}
              isDisabled={adminPermission?.PROMO === 'R'}
              onInputChange={(value) => handleInputChange(value)}
            />
            <p className="error-text">{errLeague}</p>
          </FormGroup>
          </Col>}
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="Name">Promo Name <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.PROMO === 'R'} type="text" id="Name" placeholder="Enter Promo Name" value={Name} onChange={event => handleChange(event, 'Name')} />
              <p className="error-text">{errName}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="CouponCode">Coupon Code <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.PROMO === 'R'} type="text" id="CouponCode" placeholder="Enter Promo Code" value={CouponCode} onChange={event => handleChange(event, 'CouponCode')} />
              <p className="error-text">{errCouponCode}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="Amount">Amount/Percentage <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.PROMO === 'R'} type="text" id="Amount" placeholder="Enter  Amount" value={amount} onChange={event => handleChange(event, 'Amount')} />
              <p className="error-text">{errAmount}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="minPrice">Min Price <span className="required-field">*</span></Label>
              <Input disabled={(adminPermission?.PROMO === 'R') || promoType === 'MATCH'} type="text" id="minPrice" placeholder="Enter Min Value" value={minAmount} onChange={event => handleChange(event, 'Min')} />
              <p className="error-text">{errMinAmount}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="maxPrice">Max Price <span className="required-field">*</span></Label>
              <Input disabled={(adminPermission?.PROMO === 'R') || promoType === 'MATCH'} type="text" id="maxPrice" placeholder="Enter Max Value" value={maxAmount} onChange={event => handleChange(event, 'Max')} />
              <p className="error-text">{errMaxAmount}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="maxAllow">Maximum Allow <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.PROMO === 'R'} type="text" id="MaxAllowAllUsers" placeholder="Enter maximum allow" value={maxAllow} onChange={event => handleChange(event, 'maxAllow')} />
              <p className="error-text">{errmaxAllow}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="MaxAllowForAllUsers">Want to change promo usage allowance per user? <img className='custom-info' src={infoIcon} id='Promo'></img>
                <UncontrolledPopover trigger="legacy" placement="bottom" target='Promo'>
                  <PopoverBody><p>No: Can use promocode only 1 time</p>
                  <p>Yes: Can allow as many as you want in Maximum Allow(Per User) field</p>
                  <p>Note: This is for per user</p>
                  </PopoverBody>
                </UncontrolledPopover>
              </Label>
              <div className="d-flex inline-input">
                <CustomInput
                  disabled={adminPermission?.PROMO === 'R'}
                  type="radio"
                  id="MaxAllowForAllUsers1"
                  name="MaxAllowForAllUsers"
                  label="Yes"
                  onChange={event => handleChange(event, 'MaxAllowForAllUsers')}
                  checked={isMaxAllowForAllUsers === 'Y'}
                  value="Y"
                />
                <CustomInput
                  disabled={adminPermission?.PROMO === 'R'}
                  type="radio"
                  id="MaxAllowForAllUsers2"
                  name="MaxAllowForAllUsers"
                  label="No"
                  onChange={event => handleChange(event, 'MaxAllowForAllUsers')}
                  checked={isMaxAllowForAllUsers !== 'Y'}
                  value="N"
                />
              </div>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="MaxAllowPerUser">Maximum Allow(Per User) <img className='custom-info' src={infoIcon} id='MaxAllow'></img>
                <UncontrolledPopover trigger="legacy" placement="bottom" target='MaxAllow'>
                  <PopoverBody>
                    <p>Maximum allow will be considered per league</p>
                    <p>E.g. If maximum allow is 5 and there are two leagues, for both leagues maximum allow will be 5, 5(Total will be 10)</p>
                  </PopoverBody>
                </UncontrolledPopover>
              </Label>
              {isMaxAllowForAllUsers === 'Y'
                ? <Input disabled={(adminPermission?.PROMO === 'R') || isMaxAllowForAllUsers === 'N'} type="text" id="MaxAllowPerUser" placeholder="Enter maximum allow per user" value={maxAllowPerUser} onChange={event => handleChange(event, 'MaxAllowPerUser')} />
                : <InputGroupText>{maxAllowPerUser}</InputGroupText>}
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="startDate">Start Date & Time <span className="required-field">*</span></Label>
              <DatePicker
                selected={startDate}
                value={startDate}
                dateFormat="dd-MM-yyyy h:mm aa"
                onChange={(date) => {
                  handleChange(date, 'StartDate')
                }}
                showTimeSelect
                timeIntervals={15}
                customInput={<ExampleCustomInput placeHolder='Enter Start Date' />}
                disabled={adminPermission?.PROMO === 'R'}
              />
              <p className="error-text">{errStartDate}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="endDate">End Date & Time <span className="required-field">*</span></Label>
              <DatePicker
                  selected={endDate}
                  value={endDate}
                  dateFormat="dd-MM-yyyy h:mm aa"
                  onChange={(date) => {
                    handleChange(date, 'EndDate')
                  }}
                  showTimeSelect
                  timeIntervals={15}
                  customInput={<ExampleCustomInput placeHolder='Enter End Date' />}
                  disabled={adminPermission?.PROMO === 'R'}
                />
              <p className="error-text">{errEndDate}</p>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="Percentage">Percentage</Label>
              <div className="d-flex inline-input">
                <CustomInput
                  disabled={adminPermission?.PROMO === 'R'}
                  type="radio"
                  id="PerRadio1"
                  name="Percentage"
                  label="Yes"
                  onChange={event => handleChange(event, 'Percentage')}
                  checked={Percentage === 'Y'}
                  value="Y"
                />
                <CustomInput
                  disabled={adminPermission?.PROMO === 'R'}
                  type="radio"
                  id="PerRadio2"
                  name="Percentage"
                  label="No"
                  onChange={event => handleChange(event, 'Percentage')}
                  checked={Percentage !== 'Y'}
                  value="N"
                />
              </div>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="Status">Status</Label>
              <div className="d-flex inline-input">
                <CustomInput
                  disabled={adminPermission?.PROMO === 'R'}
                  type="radio"
                  id="StatusRadio1"
                  name="Status"
                  label="Active"
                  onChange={event => handleChange(event, 'Status')}
                  checked={promocodeStatus === 'Y'}
                  value="Y"
                />
                <CustomInput
                  disabled={adminPermission?.PROMO === 'R'}
                  type="radio"
                  id="StatusRadio2"
                  name="Status"
                  label="InActive"
                  onChange={event => handleChange(event, 'Status')}
                  checked={promocodeStatus !== 'Y'}
                  value="N"
                />
              </div>
            </FormGroup>
          </Col>
          <Col xl={4} lg={4} md={6}>
            <FormGroup>
              <Label for="description">Description <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.PROMO === 'R'} type="text" id="description" placeholder="Enter Description of promocode" value={description} onChange={event => handleChange(event, 'description')} />
              <p className="error-text">{errdescription}</p>
            </FormGroup>
          </Col>
        </Row>
        <div className="footer-btn text-center">
          <Link className="theme-btn outline-btn outline-theme mb-3" to={`/settings/promocode-management${page?.PromoCodeManagement || ''}`}>Cancel</Link>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PROMO !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn" disabled={submitDisable} onClick={onAdd}>{isCreate ? 'Add Promocode' : 'Save Changes'}</Button>
              </Fragment>
            )
          }
        </div>
      </section>
    </main>
  )
}

AddPromocode.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  value: PropTypes.string,
  onClick: PropTypes.func,
  placeHolder: PropTypes.string
}

export default AddPromocode
