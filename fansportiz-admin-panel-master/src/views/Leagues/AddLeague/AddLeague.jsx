import React, {
  useState, useEffect, useRef, Fragment
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loading from '../../../components/Loading'
import {
  Row, Col, FormGroup, Input, CustomInput, Label, Button, UncontrolledAlert, InputGroupText, Modal, ModalBody, Form, UncontrolledPopover, PopoverBody
} from 'reactstrap'
import {
  verifyLength, isNumber, isPositive, isFloat, alertClass, modalMessageFunc
} from '../../../helpers/helper'
import { copyLeague, getGameCategory, getLeagueDetails } from '../../../actions/league'
import { getFilterCategory, getListOfCategory } from '../../../actions/leaguecategory'
import { settingForValidation } from '../../../actions/setting'
import backIcon from '../../../assets/images/left-theme-arrow.svg'
import infoIcon from '../../../assets/images/info2.svg'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
const animatedComponents = makeAnimated()

function AddLeague (props) {
  const {
    cancelLink, AddNewLeague, priceBreakUpPage, UpdateLeague, addLeaguepriceBreakup, match
  } = props
  const [loading, setLoading] = useState(false)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(0)
  const [LeagueName, setLeagueName] = useState('')
  const [Position, setPosition] = useState('')
  const [errPosition, seterrPosition] = useState('')
  const [LoyaltyPoint, setLoyaltyPoint] = useState('')
  const [LeagueCategory, setLeagueCategory] = useState('')
  const [GameCategory, setGameCategory] = useState('')
  const [FilterCategory, setFilterCategory] = useState('')
  const [minEntry, setminEntry] = useState(0)
  const [maxEntry, setmaxEntry] = useState(0)
  const [entryFee, setEntryFee] = useState(0)
  const [botCreate, setBotCreate] = useState('N')
  const [minTeamCount, setMinTeamCount] = useState(0)
  const [TeamJoinLimit, setTeamJoinLimit] = useState(1)
  const [winnersCount, setwinnersCount] = useState(0)
  const [TotalPayout, setTotalPayout] = useState(0)
  const [DeductPercent, setDeducePercent] = useState(0)
  const [BonusUtil, setBonusUtil] = useState(0)
  const [errLeagueName, setErrLeagueName] = useState('')
  const [errGameCategory, setErrGameCategory] = useState('')
  const [errFilterCategory, setErrFilterCategory] = useState('')
  const [errLeagueCategory, setErrLeagueCategory] = useState('')
  const [errTeamJoinLimit, setErrTeamJoinLimit] = useState('')
  const [errwinnersCount, setErrwinnersCount] = useState('')
  const [errminEntry, setErrminEntry] = useState('')
  const [errmaxEntry, setErrmaxEntry] = useState('')
  const [errMinTeamCount, setErrMinTeamCount] = useState('')
  const [errPrice, seterrPrice] = useState('')
  const [errTotalPayout, seterrTotalPayout] = useState('')
  const [errDeducePercent, seterrDeducePercent] = useState('')
  const [errBonusUtil, seterrBonusUtil] = useState('')
  const [ConfirmLeague, setConfirmLeague] = useState('N')
  const [multipleEntry, setmultipleEntry] = useState('N')
  const [unlimitedJoin, setUnlimitedJoin] = useState('N')
  const [minCashbackTeam, setMinCashbackTeam] = useState(0)
  const [cashBackAmount, setCashBackAmount] = useState(0)
  const [cashbackType, setCashbackType] = useState('')
  const [errCashbackTeam, setErrCashbackTeam] = useState('')
  const [errCashbackAmount, setErrCashbackAmount] = useState('')
  const [errCashbackType, setErrCashbackType] = useState('')
  const [autoCreate, setautoCreate] = useState('N')
  const [poolPrize, setpullPrize] = useState('N')
  const [cashbackEnabled, setCashbackEnabled] = useState('N')
  const [copyBotPerTeam, setCopyBotPerTeam] = useState(0)
  const [copyBotPerTeamErr, setCopyBotPerTeamErr] = useState('')
  const [active, setactive] = useState('N')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isCreate, setIsCreate] = useState(false)
  const [sportsType, setSportsType] = useState([])
  const [options, setOptions] = useState([])
  const [sportsErr, setSportsErr] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState([])
  const [leagueId, setLeagueId] = useState('')
  const toggleMessage = () => setModalOpen(!modalOpen)
  const dispatch = useDispatch()

  const token = useSelector(state => state.auth.token)
  const LeagueDetails = useSelector(state => state.league.LeagueDetails)
  const LeagueCategoryList = useSelector(state => state.leaguecategory.LeaguecategoryList)
  const GameCategoryList = useSelector(state => state.league.GamecategoryList)
  const FilterList = useSelector(state => state.leaguecategory.FiltercategoryList)
  const validation = useSelector(state => state.setting.validation)
  const resStatus = useSelector(state => state.league.resStatus)
  const resMessage = useSelector(state => state.league.resMessage)
  const addedLeague = useSelector(state => state.league.addedLeague)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const previousProps = useRef({ resStatus, resMessage, LeagueDetails }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const updateDisable = LeagueDetails && previousProps.LeagueDetails !== LeagueDetails && LeagueDetails?.bAutoCreate === (autoCreate === 'Y') && LeagueDetails?.bBotCreate === (botCreate === 'Y') &&
                        LeagueDetails?.bCashbackEnabled === (cashbackEnabled === 'Y') && LeagueDetails?.bConfirmLeague === (ConfirmLeague === 'Y') && LeagueDetails?.bMultipleEntry === (multipleEntry === 'Y') && LeagueDetails?.bPoolPrize === (poolPrize === 'Y') &&
                        LeagueDetails?.bUnlimitedJoin === (unlimitedJoin === 'Y') && LeagueDetails?.eCashbackType === cashbackType && LeagueDetails?.eCategory === GameCategory && LeagueDetails?.eStatus === active && LeagueDetails?.iFilterCatId === FilterCategory &&
                        LeagueDetails?.iLeagueCatId === LeagueCategory && LeagueDetails?.nBonusUtil === parseInt(BonusUtil) && LeagueDetails?.nCashbackAmount === parseInt(cashBackAmount) && LeagueDetails?.nCopyBotsPerTeam === parseInt(copyBotPerTeam) &&
                        LeagueDetails?.nDeductPercent === parseInt(DeductPercent) && LeagueDetails?.nLoyaltyPoint === parseInt(LoyaltyPoint) && LeagueDetails?.nMax === parseInt(maxEntry) && LeagueDetails?.nMin === parseInt(minEntry) && LeagueDetails?.nMinCashbackTeam === parseInt(minCashbackTeam) &&
                        LeagueDetails.nMinTeamCount === parseInt(minTeamCount) && LeagueDetails?.nPosition === parseInt(Position) && LeagueDetails?.nPrice === parseInt(entryFee) && LeagueDetails?.nTeamJoinLimit === parseInt(TeamJoinLimit) && LeagueDetails?.nTotalPayout === parseInt(TotalPayout) && LeagueDetails?.nWinnersCount === parseInt(winnersCount) &&
                        LeagueDetails?.iFilterCatId === FilterCategory && LeagueDetails?.iLeagueCatId === LeagueCategory && LeagueDetails?.sName === LeagueName

  const history = useHistory()

  useEffect(() => {
    if (match.params.id) {
      setIsEdit(true)
      setLoading(true)
    } else {
      setIsCreate(true)
      // dispatch action to get list of category, games category, filter category
      dispatch(getListOfCategory(token))
      dispatch(getGameCategory(token))
      dispatch(getFilterCategory(token))
    }
    dispatch(settingForValidation('PUBC', token))
  }, [])

  useEffect(() => {
    if ((isEdit && LeagueCategoryList) || (!resStatus && resMessage)) {
      const index = LeagueCategoryList?.findIndex(list => list._id === LeagueCategory)
      index >= 0 ? setLeagueCategory(LeagueCategoryList[index]._id) : setLeagueCategory('')
    }
  }, [LeagueCategoryList])

  useEffect(() => {
    if ((isEdit && GameCategoryList) || (!resStatus && resMessage)) {
      const index = GameCategoryList?.findIndex(list => list === GameCategory)
      index >= 0 ? setGameCategory(GameCategoryList[index]) : setGameCategory('')
    }
  }, [GameCategoryList])

  useEffect(() => {
    if ((isEdit && FilterList) || (!resStatus && resMessage)) {
      const index = FilterList?.findIndex(list => list._id === FilterCategory)
      index >= 0 ? setFilterCategory(FilterList[index]._id) : setFilterCategory('')
    }
  }, [FilterList, FilterCategory])

  useEffect(() => {
    if (previousProps.validation !== validation && validation) {
      setMinValue(validation.nMin)
      setMaxValue(validation.nMax)
      setLoading(false)
    }
    return () => {
      previousProps.validation = validation
    }
  }, [validation])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          props.history.push(`${priceBreakUpPage}/${addedLeague && addedLeague._id}`, { message: resMessage })
        } else {
          if (resStatus) {
            setIsEdit(false)
          } else if (!isCreate) {
            dispatch(getLeagueDetails(match.params.id, token))
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

  // use effect to set league details
  useEffect(() => {
    if (LeagueDetails) {
      if (previousProps.LeagueDetails !== LeagueDetails || (!resStatus && resMessage)) {
        dispatch(getListOfCategory(token))
        dispatch(getGameCategory(token))
        dispatch(getFilterCategory(token))
        setTeamJoinLimit(LeagueDetails.nTeamJoinLimit)
        setwinnersCount(LeagueDetails.nWinnersCount)
        setLoyaltyPoint(LeagueDetails.nLoyaltyPoint)
        setLeagueName(LeagueDetails.sName)
        setLeagueCategory(LeagueDetails.iLeagueCatId)
        setFilterCategory(LeagueDetails.iFilterCatId)
        setminEntry(LeagueDetails.nMin)
        setmaxEntry(LeagueDetails.nMax)
        setEntryFee(LeagueDetails.nPrice)
        setTotalPayout(LeagueDetails.nTotalPayout)
        setDeducePercent(LeagueDetails.nDeductPercent)
        setBonusUtil(LeagueDetails.nBonusUtil)
        setConfirmLeague(LeagueDetails.bConfirmLeague === true ? 'Y' : 'N')
        setmultipleEntry(LeagueDetails.bMultipleEntry === true ? 'Y' : 'N')
        setUnlimitedJoin(LeagueDetails.bUnlimitedJoin === true ? 'Y' : 'N')
        setautoCreate(LeagueDetails.bAutoCreate === true ? 'Y' : 'N')
        setactive(LeagueDetails.eStatus)
        setpullPrize(LeagueDetails.bPoolPrize === true ? 'Y' : 'N')
        setPosition(LeagueDetails.nPosition)
        setGameCategory(LeagueDetails.eCategory)
        setMinCashbackTeam(LeagueDetails.nMinCashbackTeam)
        setCashBackAmount(LeagueDetails.nCashbackAmount)
        setCashbackType(LeagueDetails.eCashbackType)
        setMinTeamCount(LeagueDetails.nMinTeamCount)
        setBotCreate(LeagueDetails.bBotCreate === true ? 'Y' : 'N')
        setCashbackEnabled(LeagueDetails.bCashbackEnabled === true ? 'Y' : 'N')
        setCopyBotPerTeam(LeagueDetails.nCopyBotsPerTeam)
        setLoading(false)
      }
    }
    return () => {
      previousProps.LeagueDetails = LeagueDetails
      previousProps.resMessage = resMessage
      previousProps.resStatus = resStatus
    }
  }, [LeagueDetails, resStatus, resMessage])

  // handleChange function to handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'LeagueName':
        if (verifyLength(event.target.value, 1)) {
          setErrLeagueName('')
        } else {
          setErrLeagueName('Required field')
        }
        setLeagueName(event.target.value)
        break
      case 'LeagueCategory':
        if (event.target.value) {
          setErrLeagueCategory('')
        } else {
          setErrLeagueCategory('Required field')
        }
        setLeagueCategory(event.target.value)
        break
      case 'GameCategory':
        if (event.target.value) {
          setErrGameCategory('')
        } else {
          setErrGameCategory('Required field')
        }
        setGameCategory(event.target.value)
        break
      case 'FilterCategory':
        if (event.target.value) {
          setErrFilterCategory('')
        } else {
          setErrFilterCategory('Required field')
        }
        setFilterCategory(event.target.value)
        break
      case 'Position':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrPosition('')
          } else {
            seterrPosition('Required field')
          }
          setPosition(event.target.value)
        }
        break
      case 'LoyaltyPoint':
        if (isNumber(event.target.value) || (!event.target.value)) {
          setLoyaltyPoint(event.target.value)
        }
        break
      case 'minEntry':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrminEntry('')
          } else {
            setErrminEntry('Required field')
          }
          setminEntry(event.target.value)
          if (parseInt(event.target.value) < parseInt(minValue)) {
            setErrminEntry(`Must be greater than ${minValue}`)
          } else if (maxEntry && parseInt(event.target.value) > parseInt(maxEntry)) {
            setErrminEntry('Minimum entry should be less than Maximum entry!')
          } else {
            setErrminEntry('')
            setErrmaxEntry('')
          }
        }
        break
      case 'maxEntry':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrmaxEntry('')
          } else {
            setErrmaxEntry('Required field')
          }
          setmaxEntry(event.target.value)
          if (parseInt(event.target.value) > parseInt(maxValue)) {
            setErrmaxEntry(`Must be less than ${maxValue}`)
          } else if (minEntry && parseInt(minEntry) > parseInt(event.target.value)) {
            setErrmaxEntry('Maximum entry should be greater than Minimum entry!')
          } else {
            setErrmaxEntry('')
          }
        }
        break
      case 'entryFee':
        if (!event.target.value) {
          seterrPrice('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            seterrPrice('Value must be number!')
          } else {
            seterrPrice('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          seterrPrice('')
        }
        setEntryFee(event.target.value)
        break
      case 'poolPrize':
        setpullPrize(event.target.value)
        if (unlimitedJoin === 'Y') {
          event.target.value === 'N' && setUnlimitedJoin('N')
        }
        break
      case 'TeamJoinLimit':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value && multipleEntry === 'Y') {
            parseInt(event.target.value) < 2 ? setErrTeamJoinLimit('Value must be greater than 2') : setErrTeamJoinLimit('')
          } else if (event.target.value > 0) {
            setErrTeamJoinLimit('')
          } else if (event.target.value === '') {
            setErrTeamJoinLimit('Required field')
          }
          setTeamJoinLimit(event.target.value)
        }
        break
      case 'winnersCount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrwinnersCount('')
          } else {
            setErrwinnersCount('Required field')
          }
          setwinnersCount(event.target.value)
        }
        break
      case 'TotalPayout':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value >= 0) {
            seterrTotalPayout('')
          } else {
            seterrTotalPayout('Required field')
          }
          setTotalPayout(event.target.value)
        }
        break
      case 'DeductPercent':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value >= 0 && event.target.value <= 100) {
            seterrDeducePercent('')
          } else if (event.target.value >= 100) {
            seterrBonusUtil('Value must be less than 100')
          } else {
            seterrDeducePercent('Required field')
          }
          setDeducePercent(event.target.value)
        }
        break
      case 'BonusUtil':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value >= 0 && event.target.value <= 100) {
            seterrBonusUtil('')
          } else if (event.target.value >= 100) {
            seterrBonusUtil('Value must be less than 100')
          } else {
            seterrBonusUtil('Required field')
          }
          setBonusUtil(event.target.value)
        }
        break
      case 'ConfirmLeague':
        setConfirmLeague(event.target.value)
        break
      case 'multipleEntry':
        if (event.target.value === 'Y') {
          setmultipleEntry(event.target.value)
          if (TeamJoinLimit > 1) {
            setErrTeamJoinLimit('')
          }
          if (minCashbackTeam > 1) {
            setErrCashbackTeam('')
          }
        } else {
          setmultipleEntry(event.target.value)
          setTeamJoinLimit(1)
          setErrTeamJoinLimit('')
          if (minCashbackTeam > 1) {
            setErrCashbackTeam('Team must be less than 2')
          }
        }
        break
      case 'unlimitedJoin':
        setUnlimitedJoin(event.target.value)
        break
      case 'autoCreate':
        setautoCreate(event.target.value)
        break
      case 'active':
        setactive(event.target.value)
        break
      case 'cashbackEnabled':
        if (event.target.value === 'N') {
          setCashbackType('')
          setMinCashbackTeam(0)
          setCashBackAmount(0)
          setErrCashbackAmount('')
          setErrCashbackTeam('')
          setErrCashbackType('')
        }
        setCashbackEnabled(event.target.value)
        break
      case 'MinCashbackTeam':
        if (isNumber(event.target.value) || (!event.target.value)) {
          if (multipleEntry === 'N' && event.target.value > 1) {
            setErrCashbackTeam('Team must be less than 2')
          } else {
            setErrCashbackTeam('')
          }
          setMinCashbackTeam(event.target.value)
          if (!event.target.value) {
            setCashBackAmount(0)
            setCashbackType('')
          }
          if ((event.target.value > 0) && !cashBackAmount) {
            setErrCashbackAmount('Required field')
          } else {
            setErrCashbackAmount('')
          }
          if ((event.target.value > 0) && !cashbackType) {
            setErrCashbackType('Required field')
          } else {
            setErrCashbackType('')
          }
        }
        break
      case 'CashbackAmount':
        if (isNumber(event.target.value) || (!event.target.value)) {
          if (isNumber(event.target.value)) {
            setErrCashbackAmount('')
          } else {
            setErrCashbackAmount('Required field')
          }
          setCashBackAmount(event.target.value)
        }
        break
      case 'CashbackType':
        if (minCashbackTeam && event.target.value === '') {
          setErrCashbackType('Required field')
        } else {
          setErrCashbackType('')
        }
        setCashbackType(event.target.value)
        break
      case 'MinTeamCount':
        if (isNumber(event.target.value) || (!event.target.value)) {
          if (!event.target.value) {
            setErrMinTeamCount('')
          } else if (event.target.value < parseInt(minEntry)) {
            setErrMinTeamCount('Must be greater than min entry')
          } else if (event.target.value > parseInt(maxEntry)) {
            setErrMinTeamCount('Must be less than max entry')
          } else {
            setErrMinTeamCount('')
          }
          setMinTeamCount(event.target.value)
        }
        break
      case 'BotCreate':
        if (event.target.value === 'N') {
          setCopyBotPerTeam(0)
          setMinTeamCount(0)
          setCopyBotPerTeamErr('')
          setErrMinTeamCount('')
          setBotCreate(event.target.value)
        } else {
          setBotCreate(event.target.value)
          setCopyBotPerTeam(3)
        }
        break
      case 'CopyBotPerTeam':
        if (isNumber(event.target.value) || (!event.target.value)) {
          setCopyBotPerTeam(event.target.value)
        }
        break
      default:
        break
    }
  }

  // onSubmit function for validate the fields and to dispatch action
  function onAdd (e) {
    e.preventDefault()
    if (verifyLength(FilterCategory, 1) && verifyLength(LeagueCategory, 1) && verifyLength(GameCategory, 1) && LeagueName.trim().length && (parseInt(minEntry) >= parseInt(minValue)) && (parseInt(maxEntry) <= parseInt(maxValue)) && verifyLength(LeagueName, 1) && isNumber(Position) && isPositive(minEntry) && isPositive(maxEntry) && (parseInt(minEntry) <= parseInt(maxEntry)) && isFloat(entryFee) && isNumber(TotalPayout) && isPositive(TeamJoinLimit) && isPositive(winnersCount) && (BonusUtil >= 0 && BonusUtil <= 100) && (DeductPercent >= 0 && DeductPercent <= 100) && !errLeagueName && !errPosition && !errTeamJoinLimit && !errCashbackTeam && !errCashbackAmount && !errCashbackType && !copyBotPerTeamErr) {
      if (isCreate) {
        const addNewLeagueData = {
          LeagueName, maxEntry, minEntry, Price: parseInt(entryFee), TotalPayout, DeductPercent, BonusUtil, ConfirmLeague, multipleEntry, autoCreate, poolPrize, Position, active, GameCategory, LeagueCategory, FilterCategory, TeamJoinLimit, winnersCount, LoyaltyPoint, unlimitedJoin, minCashbackTeam, cashBackAmount, cashbackType: cashBackAmount <= 0 ? 'C' : cashbackType, minTeamCount, botCreate, cashbackEnabled, copyBotPerTeam: parseInt(copyBotPerTeam)
        }
        AddNewLeague(addNewLeagueData)
      } else {
        const updateNewLeagueData = {
          LeagueName, maxEntry, minEntry, Price: parseInt(entryFee), TotalPayout, DeductPercent, BonusUtil, ConfirmLeague, multipleEntry, autoCreate, poolPrize, Position, active, GameCategory, LeagueCategory, FilterCategory, TeamJoinLimit, winnersCount, LoyaltyPoint, unlimitedJoin, minCashbackTeam, cashBackAmount, cashbackType: cashBackAmount <= 0 ? 'C' : cashbackType, minTeamCount, botCreate, cashbackEnabled, copyBotPerTeam: parseInt(copyBotPerTeam)
        }
        UpdateLeague(updateNewLeagueData)
      }
      setLoading(true)
    } else {
      if (copyBotPerTeam < 0) {
        setCopyBotPerTeamErr('Value must be positive')
      }
      if (parseInt(minEntry) < parseInt(minValue)) {
        setErrminEntry(`Must be greater than ${minValue}`)
      }
      if (parseInt(maxEntry) > parseInt(maxValue)) {
        setErrmaxEntry(`Must be less than ${maxValue}`)
      }
      if (!LeagueName.trim().length) {
        setErrLeagueName('Only white spaces are not allowed')
      }
      if (!LeagueCategory) {
        setErrLeagueCategory('Required field')
      }
      if (!GameCategory) {
        setErrGameCategory('Required field')
      }
      if (!FilterCategory) {
        setErrFilterCategory('Required field')
      }
      if (!TotalPayout) {
        seterrTotalPayout('Required field')
      }
      if (!verifyLength(LeagueName, 1)) {
        setErrLeagueName('Required field')
      }
      if (!isNumber(Position)) {
        seterrPosition('Required field')
      }
      if (parseInt(minEntry) > parseInt(maxEntry)) {
        setErrmaxEntry('Maximum entry should be greater than Minimum entry')
      }
      if (!isPositive(minEntry)) {
        setErrminEntry('Required field')
      }
      if (!isPositive(maxEntry)) {
        setErrmaxEntry('Required field')
      }
      if (!entryFee) {
        seterrPrice('Required field')
      } else if (!isFloat(entryFee)) {
        if (isNaN(parseFloat(entryFee))) {
          seterrPrice('Value must be number!')
        } else {
          seterrPrice('Must be 2 floating point value only')
        }
      }
      if (!isPositive(TeamJoinLimit)) {
        setErrTeamJoinLimit('Required field')
      }
      if (!isPositive(winnersCount)) {
        setErrwinnersCount('Required field')
      }
      if (BonusUtil >= 100) {
        seterrBonusUtil('Value must be less than 100')
      }
      if (!(DeductPercent >= 0 && DeductPercent <= 100)) {
        seterrDeducePercent('Required field')
      }
      if (multipleEntry === 'Y' && (parseInt(TeamJoinLimit) === 0)) {
        setErrTeamJoinLimit('Value must be greater than 0')
      } else if (multipleEntry === 'Y' && (parseInt(TeamJoinLimit) < 2)) {
        setErrTeamJoinLimit('Value must be greater than 1')
      }
      if (multipleEntry === 'N' && minCashbackTeam > 1) {
        setErrCashbackTeam('Team must be less than 2')
      }
      if (minCashbackTeam && !cashBackAmount) {
        setErrCashbackAmount('Required field')
      }
      if (minCashbackTeam && !cashbackType) {
        setErrCashbackType('Required field')
      }
    }
  }

  // function to display heading text
  function heading () {
    if (isCreate) {
      return 'Add League'
    }
    return 'Edit League'
  }

  // function to display submit button text
  function button () {
    if (isCreate) {
      return 'Create League'
    }
    return 'Save Changes'
  }

  useEffect(() => {
    if (GameCategoryList || LeagueDetails?.eCategory) {
      const arr = []
      if (GameCategoryList?.length !== 0) {
        GameCategoryList?.map((data) => {
          const obj = {
            value: data,
            label: data
          }
          data !== LeagueDetails?.eCategory?.toUpperCase() && arr.push(obj)
          return arr
        })
        setOptions(arr)
      }
    }
  }, [GameCategoryList, LeagueDetails])

  function openModalFunc () {
    setLeagueId(match.params.id)
    setModalOpen(true)
  }

  function onHandleChange (selected) {
    if (selected) {
      setSelectedOption(selected)
      if (selected.length >= 1) {
        setSportsErr('')
      } else {
        setSportsErr('Required field')
      }
      setSportsType(selected)
    } else {
      setSportsType([])
    }
  }

  // dispatch action to copy league to other sports
  function copyLeagueFunc (e) {
    e.preventDefault()
    const selected = []
    selectedOption.map((data) => {
      selected.push(data.value)
      return selected
    })
    dispatch(copyLeague(leagueId, selected, token))
    setLoading(true)
    setSportsType([])
    toggleMessage()
  }

  function cancel (e) {
    e.preventDefault()
    toggleMessage()
    setSportsType([])
  }

  return (
    <main className="main-content">
      <section className="common-box common-detail">
        {
          modalMessage && message &&
          (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        {loading && <Loading />}
        <div className="title d-flex justify-content-between align-items-center fdc-480 align-start-480">
        <div className='d-flex'>
          <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push(`${cancelLink}${page?.League || ''}`)}></img>
          <h2 className='ml-2'>
            {heading()}
          </h2>
        </div>
          <FormGroup className="d-flex justify-content-between mb-0 fdc-480">
            {isCreate
              ? null
              : (
                <div className="d-flex inline-input mt-2">
                  <Button tag={Link} className="theme-btn outline-btn outline-theme mr-3" to={addLeaguepriceBreakup}>League Prize BreakUp</Button>
                  <Button tag={Link} className="theme-btn outline-btn outline-theme mr-3" to={{ pathname: `/admin-logs/logs/${LeagueDetails?._id}`, state: { leageToAdminLogs: true } }}>League Logs</Button>
                  <Button className="theme-btn success-btn" onClick={() => openModalFunc()}>Copy League</Button>
                </div>
                )}
          </FormGroup>
        </div>
        <Row className="mt-4">
          <Col md={6}>
            <Fragment>
            <div className="common-box-leagues">
            <Row className='custom-row'>
              <Col xl={4} md={12}>
              <FormGroup>
                  <Label for="LeagueName"> League Name <span className="required-field">*</span></Label>
                  <Input disabled={adminPermission?.LEAGUE === 'R'} type="text" id="LeagueName" placeholder="Enter League Name" value={LeagueName} onChange={event => handleChange(event, 'LeagueName')} />
                  <p className="error-text">{errLeagueName}</p>
                </FormGroup>
              </Col>
              <Col xl={4} md={6}>
                <FormGroup>
                  <Label for="LeagueCategory"> League Category <span className="required-field">*</span></Label>
                  <CustomInput disabled={adminPermission?.LEAGUE === 'R'} type="select" id="LeagueCategory" placeholder="Enter League Category" value={LeagueCategory} onChange={event => handleChange(event, 'LeagueCategory')}>
                    <option value=''>Select League Category</option>
                      {
                        LeagueCategoryList && LeagueCategoryList.length >= 1 && LeagueCategoryList.map(data => (
                          <option value={data._id} key={data._id}>{data.sTitle}</option>
                        ))
                      }
                  </CustomInput>
                  <p className="error-text">{errLeagueCategory}</p>
                </FormGroup>
              </Col>
              <Col xl={4} md={6}>
            <FormGroup>
              <Label for="gameCategory"> Game Category <span className="required-field">*</span></Label>
              <CustomInput disabled={adminPermission?.LEAGUE === 'R'} type="select" id="GameCategory" placeholder="Enter Game Category" value={GameCategory} onChange={event => handleChange(event, 'GameCategory')}>
                <option value=''>Select Game Category</option>
                  {
                    GameCategoryList && GameCategoryList.length >= 0 && GameCategoryList.map((data, index) => (
                      <option value={data} key={index}>{data}</option>
                    ))
                  }
              </CustomInput>
              <p className="error-text">{errGameCategory}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="FilterCategory"> Filter Category <span className="required-field">*</span></Label>
              <CustomInput disabled={adminPermission?.LEAGUE === 'R'} type="select" id="FilterCategory" placeholder="Enter Filter Category" value={FilterCategory} onChange={event => handleChange(event, 'FilterCategory')}>
                <option value=''>Select Filter Category</option>
                  {
                    FilterList && FilterList.length >= 0 && FilterList.map(data => (
                      <option value={data._id} key={data._id}>{data.sTitle}</option>
                    ))
                  }
              </CustomInput>
              <p className="error-text">{errFilterCategory}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="LoyaltyPoint"> Loyalty Point </Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} type="number" id="LoyaltyPoint" placeholder="Enter Loyalty Point" value={LoyaltyPoint} onChange={event => handleChange(event, 'LoyaltyPoint')} />
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="ConfirmLeague">Confirm League?</Label>
              <div className="d-flex inline-input">
                <CustomInput
                  type="radio"
                  disabled={adminPermission?.LEAGUE === 'R'}
                  id="ConfirmLeague1"
                  name="ConfirmLeagueRadio"
                  label="Yes"
                  onClick={event => handleChange(event, 'ConfirmLeague')}
                  checked={ConfirmLeague === 'Y'}
                  value="Y"
                />
                <CustomInput
                  type="radio"
                  disabled={adminPermission?.LEAGUE === 'R'}
                  id="ConfirmLeague2"
                  name="ConfirmLeagueRadio"
                  label="No"
                  onClick={event => handleChange(event, 'ConfirmLeague')}
                  checked={ConfirmLeague !== 'Y'}
                  value="N"
                />
              </div>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
          <FormGroup>
            <Label for="autoCreate">Auto Create?</Label>
            <div className="d-flex inline-input">
              <CustomInput
                type="radio"
                disabled={adminPermission?.LEAGUE === 'R'}
                id="autoCreate1"
                name="autoCreate"
                label="Yes"
                onClick={event => handleChange(event, 'autoCreate')}
                checked={autoCreate === 'Y'}
                value="Y"
              />
              <CustomInput
                type="radio"
                disabled={adminPermission?.LEAGUE === 'R'}
                id="autoCreate2"
                name="autoCreate"
                label="No"
                onClick={event => handleChange(event, 'autoCreate')}
                checked={autoCreate !== 'Y'}
                value="N"
              />
            </div>
          </FormGroup>
        </Col>
        </Row>
          </div>
          </Fragment>
          </Col>

          <Col md={6}>
            <Fragment>
            <div className="common-box-leagues">
            <Row className='custom-row'>
            <Col xl={4} md={6}>
            <FormGroup>
              <Label for="minEntry">Min Entry <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} type='number' id="minEntry" placeholder="Enter Min-Entry" value={minEntry} onChange={event => handleChange(event, 'minEntry')} />
              <p className="error-text">{errminEntry}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="maxEntry"> Max Entry <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} type='number' id="maxEntry" placeholder="Enter Max-Entry" value={maxEntry} onChange={event => handleChange(event, 'maxEntry')} />
              <p className="error-text">{errmaxEntry}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="entryFee"> Entry Fee <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} type="number" id="entryFee" placeholder="Enter Entry Fee" value={entryFee} onChange={event => handleChange(event, 'entryFee')} />
              <p className="error-text">{errPrice}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="Total-Payout"> Total Payout <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} type="number" id="Total-Payout" placeholder="Enter Total Payout" value={TotalPayout} onChange={event => handleChange(event, 'TotalPayout')} />
              <p className="error-text">{errTotalPayout}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="BonusUtil"> Bonus Util (%) </Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} type="number" id="BonusUtil" placeholder="Enter Bonus Util" value={BonusUtil} onChange={event => handleChange(event, 'BonusUtil')} />
              <p className="error-text">{errBonusUtil}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="winnersCount">Winners Count <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} type="number" id="winnersCount" placeholder="Enter Winner's Count " value={winnersCount} onChange={event => handleChange(event, 'winnersCount')} />
              <p className="error-text">{errwinnersCount}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
            <FormGroup>
              <Label for="Position"> Position <span className="required-field">*</span></Label>
              <Input disabled={adminPermission?.LEAGUE === 'R'} type="number" id="Position" placeholder="Enter Position" value={Position} onChange={event => handleChange(event, 'Position')} />
              <p className="error-text">{errPosition}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={6}>
          <FormGroup>
            <Label for="active">Status</Label>
            <div className="d-flex inline-input">
              <CustomInput
                type="radio"
                disabled={adminPermission?.LEAGUE === 'R'}
                id="active1"
                name="active"
                label="Active"
                onClick={event => handleChange(event, 'active')}
                checked={active === 'Y'}
                value="Y"
              />
              <CustomInput
                type="radio"
                disabled={adminPermission?.LEAGUE === 'R'}
                id="active2"
                name="active"
                label="InActive"
                onClick={event => handleChange(event, 'active')}
                checked={active !== 'Y'}
                value="N"
              />
            </div>
          </FormGroup>
        </Col>
          </Row>
          </div>
          </Fragment>
          </Col>
          </Row>

          <Row className='mt-3'>
          <Col xl={2} md={6}>
            <Fragment>
            <div className="common-box-leagues">
            <Row className='custom-row'>
            <Col xl={12}>
            <FormGroup>
              <Label for="multipleEntry">Multiple Entry?</Label>
              <div className="d-flex inline-input">
                <CustomInput
                  type="radio"
                  disabled={adminPermission?.LEAGUE === 'R'}
                  id="multipleEntry1"
                  name="multipleEntry"
                  label="Yes"
                  onClick={event => handleChange(event, 'multipleEntry')}
                  checked={multipleEntry === 'Y'}
                  value="Y"
                />
                <CustomInput
                  type="radio"
                  disabled={adminPermission?.LEAGUE === 'R'}
                  id="multipleEntry2"
                  name="multipleEntry"
                  label="No"
                  onClick={event => handleChange(event, 'multipleEntry')}
                  checked={multipleEntry !== 'Y'}
                  value="N"
                />
              </div>
            </FormGroup>
          </Col>
          <Col xl={12}>
            <FormGroup>
              <Label for="TeamJoinLimit">Team Join Limit</Label>
              <Input type="number" id="TeamJoinLimit" placeholder="Enter Team Join Limit" disabled={multipleEntry === 'N' || (adminPermission?.LEAGUE === 'R')} value={TeamJoinLimit} onChange={event => handleChange(event, 'TeamJoinLimit')} />
              <p className="error-text">{errTeamJoinLimit}</p>
            </FormGroup>
          </Col>
          </Row>
          </div>
          </Fragment>
          </Col>
          <Col xl={4} md={6}>
          <Fragment>
            <div className="common-box-leagues">
            <Row className='custom-row'>
            <Col xl={6} md={12}>
            <FormGroup>
              <Label for="CashbackEnabled">Cashback Enabled?</Label>
              <div className="d-flex inline-input">
                <CustomInput
                  disabled={adminPermission?.LEAGUE === 'R'}
                  type="radio"
                  id="cashback1"
                  name="cashback"
                  label="Yes"
                  onChange={event => handleChange(event, 'cashbackEnabled')}
                  checked={cashbackEnabled === 'Y'}
                  value="Y"
                />
                <CustomInput
                  disabled={adminPermission?.LEAGUE === 'R'}
                  type="radio"
                  id="cashback2"
                  name="cashback"
                  label="No"
                  onChange={event => handleChange(event, 'cashbackEnabled')}
                  checked={cashbackEnabled !== 'Y'}
                  value="N"
                />
              </div>
            </FormGroup>
          </Col>
          <Col xl={6} md={12}>
            <FormGroup>
              <Label for="MinCashbackTeam"> Min No of Team for Cashback </Label>
              <Input disabled={(adminPermission?.LEAGUE === 'R') || cashbackEnabled === 'N'} type="number" id="MinCashbackTeam" placeholder="Enter Min Cashback Team" value={minCashbackTeam} onChange={event => handleChange(event, 'MinCashbackTeam')} />
              <p className="error-text">{errCashbackTeam}</p>
            </FormGroup>
          </Col>

          <Col xl={6} md={12}>
            <FormGroup>
              <Label for="CashbackAmount"> Cashback Amount </Label>
              {minCashbackTeam
                ? <Input disabled={(adminPermission?.LEAGUE === 'R') || (cashbackEnabled === 'N' && !minCashbackTeam)} type="number" id="CashbackAmount" placeholder="Enter Cashback Amount" value={cashBackAmount} onChange={event => handleChange(event, 'CashbackAmount')} />
                : <InputGroupText>{cashBackAmount || 0}</InputGroupText>}<p className="error-text">{errCashbackAmount}</p>
            </FormGroup>
          </Col>
          <Col xl={4} md={12}>
            <FormGroup>
              <Label for="CashbackType"> Cashback Type </Label>
              <CustomInput className={!minCashbackTeam ? 'bgColor' : ''} disabled={(adminPermission?.LEAGUE === 'R') || (cashbackEnabled === 'N' && !minCashbackTeam)} type="select" id="CashbackType" value={cashbackType} onChange={event => handleChange(event, 'CashbackType')}>
                <Fragment>
                  <option value=''>Select Cashback Type</option>
                  <option value='C'>Cash</option>
                  <option value='B'>Bonus</option>
                </Fragment>
              </CustomInput>
              <p className="error-text">{errCashbackType}</p>
            </FormGroup>
          </Col>
          </Row>
          </div>
          </Fragment>
          </Col>
          <Col xl={3} md={6} className='league-common-box'>
            <Fragment>
              <div className="common-box-leagues">
              <Row className='custom-row'>
                <Col xl={6} md={12}>
                  <FormGroup>
                    <Label for="poolPrize">Pool Prize?<img width={18} className='custom-info pb-1' src={infoIcon} id='prize'></img>
                  <UncontrolledPopover trigger="legacy" placement="bottom" target='prize'>
                    <PopoverBody style={{ width: '520px' }}>
                      <p>If pool prize is turned on, the prize breakup amount will be measured in percentage instead of real money.</p>
                      <p>Formula -</p>
                      <p>Winning amount = ((Total payout * Prize ) / 100) / (Rank To - Rank From + 1)</p>
                      <p>Note - If multiple users get the same rank, then the win amount will be divided between them.</p>
                    </PopoverBody>
                  </UncontrolledPopover></Label>
                    <div className="d-flex inline-input">
                      <CustomInput
                        disabled={adminPermission?.LEAGUE === 'R'}
                        type="radio"
                        id="pullPrize1"
                        name="poolPrize"
                        label="Yes"
                        onClick={event => handleChange(event, 'poolPrize')}
                        checked={poolPrize === 'Y'}
                        value="Y"
                      />
                      <CustomInput
                        disabled={adminPermission?.LEAGUE === 'R'}
                        type="radio"
                        id="pullPrize2"
                        name="poolPrize"
                        label="No"
                        onClick={event => handleChange(event, 'poolPrize')}
                        checked={poolPrize !== 'Y'}
                        value="N"
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xl={6} md={12}>
                  <FormGroup>
                    <Label for="unlimitedJoin">Unlimited Join?</Label>
                    <div className="d-flex inline-input">
                      <CustomInput
                        type="radio"
                        disabled={(adminPermission?.LEAGUE === 'R') || poolPrize === 'N'}
                        id="unlimitedJoin1"
                        name="unlimitedJoin"
                        label="Yes"
                        onClick={event => handleChange(event, 'unlimitedJoin')}
                        checked={unlimitedJoin === 'Y'}
                        value="Y"
                      />
                      <CustomInput
                        type="radio"
                        disabled={(adminPermission?.LEAGUE === 'R') || poolPrize === 'N'}
                        id="unlimitedJoin2"
                        name="unlimitedJoin"
                        label="No"
                        onClick={event => handleChange(event, 'unlimitedJoin')}
                        checked={unlimitedJoin !== 'Y'}
                        value="N"
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col xl={6} md={12}>
                  <FormGroup>
                    <Label for="DeductPercent"> Deduct Percent (%)</Label>
                    <Input disabled={(poolPrize === 'N')} type="number" id="DeductPercent" placeholder="Enter DeductPercent" value={DeductPercent} onChange={event => handleChange(event, 'DeductPercent')} />
                    <p className="error-text">{errDeducePercent}</p>
                  </FormGroup>
                </Col>
              </Row>
          </div>
          </Fragment>
          </Col>
          <Col xl={3} md={6} className='league-common-box'>
          <Fragment>
            <div className="common-box-leagues">
            <Row className='custom-row'>
              <Col xl={6}>
              <FormGroup>
                <Label for="BotCreate">Bot Create?</Label>
                <div className="d-flex inline-input">
                  <CustomInput
                    type="radio"
                    disabled={adminPermission?.LEAGUE === 'R'}
                    id="BotCreate1"
                    name="BotCreate"
                    label="Yes"
                    onClick={event => handleChange(event, 'BotCreate')}
                    checked={botCreate === 'Y'}
                    value="Y"
                  />
                  <CustomInput
                    type="radio"
                    disabled={adminPermission?.LEAGUE === 'R'}
                    id="BotCreate2"
                    name="BotCreate"
                    label="No"
                    onClick={event => handleChange(event, 'BotCreate')}
                    checked={botCreate !== 'Y'}
                    value="N"
                  />
                </div>
              </FormGroup>
            </Col>
              <Col xl={6}>
                <FormGroup>
                  <Label for="MinTeamCount">Min no of team for Bot</Label>
                  {botCreate === 'Y'
                    ? <Input disabled={adminPermission?.LEAGUE === 'R'} type="number" id="MinCashbackTeam" placeholder="Enter min no. of team count" value={minTeamCount} onChange={event => handleChange(event, 'MinTeamCount')} />
                    : <InputGroupText>{minTeamCount || 0}</InputGroupText>}<p className='error-text'>{errMinTeamCount}</p>
                </FormGroup>
              </Col>
              <Col xl={6}>
              <FormGroup>
                <Label for="CopyBotPerTeam">Copy bots per Team (Default value will be 3)</Label>
                {botCreate === 'Y'
                  ? <Input disabled={botCreate === 'N' || (adminPermission?.LEAGUE === 'R')} type="number" id="CopyBotPerTeam" placeholder="Enter copy bot per user" value={copyBotPerTeam} onChange={event => handleChange(event, 'CopyBotPerTeam')} />
                  : <InputGroupText>{copyBotPerTeam || 0}</InputGroupText>} <p className='error-text'>{copyBotPerTeamErr}</p>
              </FormGroup>
            </Col>
          </Row>
          </div>
          </Fragment>
          </Col>

        </Row>
        <div className="footer-btn text-center">
          <Button tag={Link} className="theme-btn outline-btn outline-theme mr-3" to={`${cancelLink}${page?.League || ''}`}>Cancel</Button>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')) &&
            (
              <Button className="theme-btn" onClick={onAdd} disabled={updateDisable}>
                {button()}
              </Button>
            )
          }
        </div>
      </section>
      <Modal isOpen={modalOpen} className="modal-confirm-bot">
        <ModalBody className="text-center">
          <Form>
            <FormGroup>
              <Row>
                <Col md='12' className='align-self-center'>
                  <Label for="sportsType">Sports</Label>
                </Col>
                <Col md='12'>
                  <Select
                    menuPlacement="auto"
                    menuPosition="fixed"
                    captureMenuScroll={true}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti={true}
                    options={options}
                    id="SportsType"
                    name="SportsType"
                    placeholder="Select Sports"
                    value={sportsType}
                    onChange={selected => onHandleChange(selected)}
                  />
                  <p className="error-text">{sportsErr}</p>
                </Col>
              </Row>
            </FormGroup>
            {((Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')) &&
            <Row className='buttons'>
              <Col md='5'>
                <Button type="submit" className="theme-btn outline-btn full-btn" onClick={(e) => cancel(e)}>Cancel</Button>
              </Col>
              <Col md='7'>
                <Button type="submit" className="theme-btn success-btn full-btn" disabled={sportsType.length === 0} onClick={(e) => copyLeagueFunc(e)}>Copy League</Button>
              </Col>
            </Row>}
          </Form>
        </ModalBody>
      </Modal>
    </main>
  )
}

AddLeague.propTypes = {
  cancelLink: PropTypes.string,
  AddNewLeague: PropTypes.func,
  UpdateLeague: PropTypes.func,
  addLeaguepriceBreakup: PropTypes.string,
  GameCategoryList: PropTypes.array,
  LeagueCategoryList: PropTypes.array,
  FilterList: PropTypes.array,
  priceBreakUpPage: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object
}

export default AddLeague
