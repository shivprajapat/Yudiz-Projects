/* eslint-disable no-case-declarations */
import React, { useState, useEffect, useRef, forwardRef, Fragment } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import moment from 'moment'
import {
  Row, Col, FormGroup, Input, Label, Button, CustomInput, UncontrolledAlert, InputGroupText, ModalBody, ModalHeader, Modal, Collapse, Card, CardBody
} from 'reactstrap'
import Select from 'react-select'
import {
  alertClass,
  isNumber,
  isScore,
  modalMessageFunc,
  verifyLength,
  verifyUrl,
  withoutSpace
} from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import { getSeriesNameList } from '../../../../actions/seriesLeaderBoard'
import PropTypes from 'prop-types'
import { generatePdf, getPost, loadLiveLeaderBoard, matchRefresh, liveInnings, fullScoreCard } from '../../../../actions/match'
import backIcon from '../../../../assets/images/left-theme-arrow.svg'
import viewIcon from '../../../../assets/images/view-icon.svg'
import DatePicker from 'react-datepicker'
import { getSeasonList } from '../../../../actions/season'
import down from '../../../../assets/images/down-arrow.svg'
import star from '../../../../assets/images/star.svg'

function AddMatch (props) {
  const {
    AddMatchFunc,
    UpdateMatch,
    teamName,
    SportsType,
    getTeamName,
    FormatsList,
    getMatchDetailsFunc,
    mergeMatchPage
  } = props
  const [provider, setProvider] = useState('')
  const [matchId, setMatchId] = useState('')
  const [info, setInfo] = useState('')
  const [options, setOptions] = useState([])
  const [tossOptions, setTossOptions] = useState([])
  const [Series, setSeries] = useState('')
  const [season, setSeasonName] = useState('')
  const [SeasonKey, setSeasonKey] = useState('')
  const [StatusNote, setStatusNote] = useState('')
  const [matchKey, setMatchKey] = useState('')
  const [MatchName, setMatchName] = useState('')
  const [Total, setTotal] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [searchType, setSearchType] = useState('')
  const [MatchFormat, setMatchFormat] = useState('')
  const [StartDate, setStartDate] = useState('')
  const [TeamAName, setTeamAName] = useState('')
  const [TeamBName, setTeamBName] = useState('')
  const [Venue, setVenue] = useState('')
  const [winningText, setWinningText] = useState('')
  const [MatchStatus, setMatchStatus] = useState('')
  const [StreamType, setStreamType] = useState('YOUTUBE')
  const [TeamAScore, setTeamAScore] = useState('')
  const [TeamBScore, setTeamBScore] = useState('')
  const [TossWinner, setTossWinner] = useState('')
  const [MaxTeamLimit, setMaxTeamLimit] = useState(0)
  const [matchOnTop, setmatchOnTop] = useState('N')
  const [disable, setDisable] = useState('Y')
  const [ChooseTossWinner, setChooseTossWinner] = useState('')
  const [SponsoredText, setSponsoredText] = useState('')
  const [FantasyPostID, setFantasyPostID] = useState('')
  const [StreamURL, setStreamURL] = useState('')
  const [scoreCardFlag, setScoreCardFlag] = useState('N')
  const [errFantasyPostID] = useState('')
  const [errStreamURL, setStreamURLErr] = useState('')
  const [activePageNo, setPageNo] = useState(1)
  const [isCreate, setIsCreate] = useState(true)
  const [errChooseTossWinner, setErrChooseTossWinner] = useState('')
  const [seasonErr, setSeasonErr] = useState('')
  const [errSeasonKey, setErrSeasonKey] = useState('')
  const [errMatchName, setErrMatchName] = useState('')
  const [errStartDate, setErrStartDate] = useState('')
  const [errTeamAName, setErrTeamAName] = useState('')
  const [errTeamBName, setErrTeamBName] = useState('')
  const [errVenue, setErrVenue] = useState('')
  const [errTeamAScore, seterrTeamAScore] = useState('')
  const [errTeamBScore, seterrTeamBScore] = useState('')
  const [errSponsoredText] = useState('')
  const [loading, setLoading] = useState(false)
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [seriesOptions, setSeriesOptions] = useState([])
  const [seasonOptions, setSeasonOptions] = useState([])
  const [seasonTotal, setSeasonTotal] = useState(0)
  const [limit] = useState(10)
  const [seriesTotal, setSeriesTotal] = useState(0)
  const [seriesActivePage, setSeriesActivePage] = useState(1)
  const [seasonActivePage, setSeasonActivePage] = useState(1)
  const [liveInningsState, setLiveInningsState] = useState([])
  const [fullScoreCardState, setFullScoreCardState] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [field, setField] = useState([false, false, false, false])
  const toggle = () => setModalOpen(!modalOpen)
  const history = useHistory()

  const matchDetails = useSelector((state) => state.match.matchDetails)
  const post = useSelector((state) => state.match.post)
  const resStatus = useSelector((state) => state.match.resStatus)
  const resMessage = useSelector((state) => state.match.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector((state) => state.auth.token)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const seasonList = useSelector(state => state.season.seasonList)
  const seriesNameList = useSelector(state => state.seriesLeaderBoard.seriesNameList)
  const liveInningsData = useSelector(state => state.match.liveInningsData)
  const fullScoreCardData = useSelector(state => state.match.fullScoreCardData)
  const previousProps = useRef({
    resStatus,
    resMessage,
    matchDetails,
    teamName,
    seriesNameList,
    searchValue,
    seasonList,
    liveInningsData,
    fullScoreCardData
  }).current
  const dispatch = useDispatch()
  const [modalMessage, setModalMessage] = useState(false)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const appView = localStorage.getItem('AppView')
  const [modalState, setModalState] = useState(false)
  const [streamURLModal, setStreamURLModal] = useState(false)
  const updateDisable = matchDetails && (previousProps.matchDetails !== matchDetails) && ((matchDetails.iSeriesId ? matchDetails.iSeriesId : '') === Series.value) && matchDetails?.iSeasonId === (season && (season?.value?.split('/'))[0]) &&
   matchDetails?.sSeasonKey === SeasonKey && matchDetails.sName === MatchName && matchDetails.eFormat === MatchFormat && moment(matchDetails.dStartDate).isSame(StartDate) && matchDetails.sVenue === Venue &&
   matchDetails?.eStatus === MatchStatus && (matchDetails.oHomeTeam && (matchDetails.oHomeTeam.nScore ? matchDetails.oHomeTeam.nScore : '') === TeamAScore) && ((matchDetails.oAwayTeam && matchDetails.oAwayTeam.nScore ? matchDetails.oAwayTeam.nScore : '') === TeamBScore) &&
   ((matchDetails.nMaxTeamLimit ? matchDetails.nMaxTeamLimit : 0) === parseInt(MaxTeamLimit)) && ((matchDetails.sFantasyPost ? matchDetails.sFantasyPost : '') === FantasyPostID) && ((matchDetails.sStreamUrl ? matchDetails.sStreamUrl : '') === StreamURL) && ((matchDetails.eStreamType ? matchDetails.eStreamType : '') === StreamType) && ((matchDetails.iTossWinnerId ? matchDetails.iTossWinnerId : '') === TossWinner) && ((matchDetails.eTossWinnerAction ? matchDetails.eTossWinnerAction : '') === ChooseTossWinner) && ((matchDetails.sSponsoredText ? matchDetails.sSponsoredText : '') === SponsoredText) && ((matchDetails.sInfo ? matchDetails.sInfo : '') === info) && (matchDetails?.bMatchOnTop === (matchOnTop === 'Y')) && (matchDetails?.bDisabled === (disable === 'Y')) && (matchDetails.bScorecardShow === (scoreCardFlag === 'Y')) && (matchDetails.sWinning ? matchDetails.sWinning : '') === winningText

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      setIsCreate(false)
      setLoading(true)
    }
    dispatch(getSeriesNameList(SportsType, searchValue, 0, limit, token))
    getSeasonListFunc(0, '')
    // setMatchReport(false)
    SportsType === 'cricket'
      ? setMatchFormat('ODI')
      : setMatchFormat(SportsType)
  }, [])

  function getSeasonListFunc (start, search) {
    const data = {
      start, limit: 10, search, sportsType: SportsType, startDate: '', endDate: '', token
    }
    dispatch(getSeasonList(data))
  }

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.seasonList !== seasonList) {
      if (seasonList && seasonList.results && seasonList.results.length > 0) {
        const arr = [...seasonOptions]
        seasonList.results.map((data) => {
          const obj = {
            value: data._id + '/' + data.sKey,
            label: data.sName
          }
          arr.push(obj)
          return arr
        })
        setSeasonOptions(arr)
      }
      setLoading(false)
    }
    if (seasonList && seasonList.total) {
      setSeasonTotal(seasonList.total)
    }
    return () => {
      previousProps.seasonList = seasonList
    }
  }, [seasonList])

  useEffect(() => {
    if (previousProps.seriesNameList !== seriesNameList) {
      if (seriesNameList && seriesNameList.aData && seriesNameList.aData.length > 0) {
        const arr = [...seriesOptions]
        seriesNameList.aData.map((series) => {
          const obj = {
            value: series._id,
            label: series.sName
          }
          arr.push(obj)
          return arr
        })
        setSeriesOptions(arr)
      }
      setLoading(false)
    }
    if (seriesNameList && seriesNameList.nTotal) {
      setSeriesTotal(seriesNameList.nTotal)
    }
    return () => {
      previousProps.seriesNameList = seriesNameList
    }
  }, [seriesNameList])

  useEffect(() => {
    if (previousProps.teamName !== teamName) {
      if (teamName && teamName.results) {
        const arr = [...options]
        if (teamName.results.length !== 0) {
          teamName.results.map(data => {
            const obj = {
              value: data._id,
              label: data.sName
            }
            arr.push(obj)
            return arr
          })
          setOptions(arr)
        }
        setLoading(false)
      }
    }

    if (teamName && teamName.total) {
      setTotal(teamName.total)
    }
    return () => {
      previousProps.teamName = teamName
    }
  }, [teamName])

  useEffect(() => {
    if (TeamAName && TeamBName && TeamBName.value && TeamAName.value) {
      const arr = []
      if (TeamAName.value && TeamBName.value) {
        const obj = {
          value: TeamAName.value,
          label: TeamAName.label
        }
        const obj2 = {
          value: TeamBName.value,
          label: TeamBName.label
        }
        arr.push(obj, obj2)
      }
      setTossOptions(arr)

      if (TeamAName.value === TeamBName.value) {
        setErrTeamAName('Same Team Name')
        setErrTeamBName('Same Team Name')
      } else {
        setErrTeamAName('')
        setErrTeamBName('')
      }
    }
  }, [TeamAName, TeamBName])

  useEffect(() => {
    if (previousProps.liveInningsData !== liveInningsData) {
      if (liveInningsData) {
        setLiveInningsState(liveInningsData)
        setModalOpen(true)
      }
    }
    if (previousProps.fullScoreCardData !== fullScoreCardData) {
      if (fullScoreCardData) {
        setFullScoreCardState(fullScoreCardData)
      }
    }
    return () => {
      previousProps.liveInningsData = liveInningsData
      previousProps.fullScoreCardData = fullScoreCardData
    }
  }, [liveInningsData, fullScoreCardData])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          props.history.push(`/${SportsType}/match-management`, {
            message: resMessage
          })
        } else {
          if (resStatus) {
            setLoading(false)
          }
          getMatchDetailsFunc()
          setLoading(true)
          setModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.matchDetails !== matchDetails) {
      if (matchDetails) {
        const arr = []
        if (
          matchDetails.oAwayTeam &&
          matchDetails.oAwayTeam.iTeamId &&
          matchDetails.oHomeTeam &&
          matchDetails.oHomeTeam.iTeamId
        ) {
          const obj = {
            value: matchDetails.oAwayTeam.iTeamId,
            label: matchDetails.oAwayTeam.sName
          }
          const obj2 = {
            value: matchDetails.oHomeTeam.iTeamId,
            label: matchDetails.oHomeTeam.sName
          }
          arr.push(obj, obj2)
        }
        setTossOptions(arr)
        setMatchId(matchDetails._id)
        setTossWinner(
          matchDetails.iTossWinnerId ? matchDetails.iTossWinnerId : ''
        )
        setChooseTossWinner(
          matchDetails.eTossWinnerAction ? matchDetails.eTossWinnerAction : ''
        )
        setmatchOnTop(matchDetails.bMatchOnTop === true ? 'Y' : 'N')
        setDisable(matchDetails.bDisabled === true ? 'Y' : 'N')
        setMatchStatus(matchDetails.eStatus ? matchDetails.eStatus : '')
        setStreamType(matchDetails.eStreamType ? matchDetails.eStreamType : 'YOUTUBE')
        setTeamAName({
          label:
            matchDetails &&
            matchDetails.oHomeTeam &&
            matchDetails.oHomeTeam.sName
              ? matchDetails.oHomeTeam.sName
              : '',
          value:
            matchDetails &&
            matchDetails.oHomeTeam &&
            matchDetails.oHomeTeam.iTeamId
              ? matchDetails.oHomeTeam.iTeamId
              : ''
        })
        setTeamBName({
          label:
            matchDetails &&
            matchDetails.oAwayTeam &&
            matchDetails.oAwayTeam.sName
              ? matchDetails.oAwayTeam.sName
              : '',
          value:
            matchDetails &&
            matchDetails.oAwayTeam &&
            matchDetails.oAwayTeam.iTeamId
              ? matchDetails.oAwayTeam.iTeamId
              : ''
        })
        setSeasonName(matchDetails.oSeason ? { label: matchDetails.oSeason?.sName || '', value: matchDetails.oSeason?._id || '' } : '')
        setInfo(matchDetails.sInfo ? matchDetails.sInfo : '')
        setSeasonKey(matchDetails?.sSeasonKey || '')
        setStatusNote(matchDetails?.sStatusNote || '')
        setMatchName(matchDetails.sName)
        setSeries(matchDetails.oSeries ? { label: matchDetails.oSeries?.sName || '', value: matchDetails.oSeries?._id || '' } : '')
        setMatchFormat(matchDetails.eFormat)
        setStartDate(new Date(moment(matchDetails.dStartDate).format()))
        setVenue(matchDetails.sVenue)
        setSponsoredText(
          matchDetails.sSponsoredText ? matchDetails.sSponsoredText : ''
        )
        setTeamAScore(
          matchDetails &&
            matchDetails.oHomeTeam &&
            matchDetails.oHomeTeam.nScore
            ? matchDetails.oHomeTeam.nScore
            : ''
        )
        setTeamBScore(
          matchDetails &&
            matchDetails.oAwayTeam &&
            matchDetails.oAwayTeam.nScore
            ? matchDetails.oAwayTeam.nScore
            : ''
        )
        setMaxTeamLimit(
          matchDetails && matchDetails.nMaxTeamLimit
            ? matchDetails.nMaxTeamLimit
            : 0
        )
        setFantasyPostID(
          matchDetails && matchDetails.sFantasyPost
            ? matchDetails.sFantasyPost
            : ''
        )
        setStreamURL(
          matchDetails && matchDetails.sStreamUrl ? matchDetails.sStreamUrl : ''
        )
        setMatchKey(matchDetails && matchDetails.sKey ? matchDetails.sKey : '')
        setProvider(matchDetails.eProvider ? matchDetails.eProvider : '')
        setWinningText(matchDetails.sWinning ? matchDetails.sWinning : '')
        setScoreCardFlag(matchDetails.bScorecardShow ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.matchDetails = matchDetails
    }
  }, [matchDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'season':
        if (event) {
          setSeasonErr('')
        } else {
          setSeasonErr('Required field')
        }
        const seasonData = (event.value).split('/')
        setSeasonName(event)
        setSeasonKey(seasonData[1])
        if (errSeasonKey) {
          setErrSeasonKey('')
        }
        break
      case 'Series':
        setSeries(event)
        break
      case 'TossWinner':
        if (event.target.value === '') {
          setTossWinner(event.target.value)
          setChooseTossWinner('')
        } else {
          setTossWinner(event.target.value)
        }
        errChooseTossWinner && setErrChooseTossWinner('')
        break
      case 'ChooseTossWinner':
        if (verifyLength(event.target.value, 1)) {
          setErrChooseTossWinner('')
        } else if (TossWinner && !verifyLength(event.target.value, 1)) {
          setErrChooseTossWinner('Required field')
        }
        setChooseTossWinner(event.target.value)
        break
      case 'SeasonKey':
        if (verifyLength(event.target.value, 1)) {
          if (withoutSpace(event.target.value)) {
            setErrSeasonKey('No space')
          } else {
            setErrSeasonKey('')
          }
        } else {
          setErrSeasonKey('Required field')
        }
        setSeasonKey(event.target.value)
        break
      case 'MatchStatus':
        setMatchStatus(event.target.value)
        break
      case 'StreamType' :
        setStreamType(event.target.value)
        break
      case 'MatchName':
        if (verifyLength(event.target.value, 1)) {
          setErrMatchName('')
        } else {
          setErrMatchName('Required field')
        }
        setMatchName(event.target.value)
        break
      case 'SponsoredText':
        setSponsoredText(event.target.value)
        break
      case 'TeamAName':
        if (verifyLength(event.value, 1)) {
          setErrTeamAName('')
        } else {
          setErrTeamAName('Required field')
        }
        setTeamAName(event)
        break
      case 'TeamBName':
        if (verifyLength(event.value, 1)) {
          setErrTeamBName('')
        } else {
          setErrTeamBName('Required field')
        }
        setTeamBName(event)
        break
      case 'TeamAScore':
        if (event.target.value && !isScore(event.target.value)) {
          seterrTeamAScore('Enter proper score')
        } else {
          seterrTeamAScore('')
          seterrTeamBScore('')
          TeamBScore && setTeamBScore('')
        }
        setTeamAScore(event.target.value)
        break
      case 'TeamBScore':
        if (event.target.value && !isScore(event.target.value)) {
          seterrTeamBScore('Enter proper score')
        } else if (TeamAScore && !event.target.value) {
          seterrTeamBScore('Required field')
        } else {
          seterrTeamBScore('')
        }
        setTeamBScore(event.target.value)
        break
      case 'Venue':
        if (verifyLength(event.target.value, 1)) {
          setErrVenue('')
        } else {
          setErrVenue('Required field')
        }
        setVenue(event.target.value)
        break
      case 'MatchFormat':
        setMatchFormat(event.target.value)
        break
      case 'matchOnTop':
        setmatchOnTop(event.target.value)
        break
      case 'disable':
        setDisable(event.target.value)
        break
      case 'StartDate':
        const Dated = moment(event).format('DD/MM/YYYY hh:mm A')
        if (verifyLength(Dated, 1)) {
          setErrStartDate('')
        } else {
          setErrStartDate('Required field')
        }
        setStartDate(event)
        break
      case 'MaxTeamLimit':
        if (isNumber(event.target.value) || (!event.target.value)) {
          setMaxTeamLimit(event.target.value)
        }
        break
      case 'FantasyPostID':
        setFantasyPostID(event.target.value)
        break
      case 'StreamURL':
        if (event.target.value && !verifyUrl(event.target.value)) {
          setStreamURLErr('Enter valid URL')
        } else {
          setStreamURLErr('')
        }
        setStreamURL(event.target.value)
        break
      case 'Info':
        setInfo(event.target.value)
        break
      case 'WinningText':
        setWinningText(event.target.value)
        break
      case 'ScoreCardFlag':
        setScoreCardFlag(event.target.value)
        break
      default:
        break
    }
  }

  function onAdd (e) {
    e.preventDefault()
    const validateCreate = season && verifyLength(SeasonKey, 1) && verifyLength(MatchName, 1) && MatchFormat && TeamAName && TeamBName && StartDate && verifyLength(Venue, 1) && !seasonErr && !errSeasonKey &&
    !errMatchName && !errStartDate && !errVenue && !errTeamAScore && !errTeamBScore && !errTeamAName && !errTeamBName && !errStreamURL
    const validateEdit = season && verifyLength(MatchName, 1) && MatchFormat && TeamAName && TeamBName && StartDate && verifyLength(Venue, 1) && !seasonErr && !errSeasonKey &&
    !errMatchName && !errStartDate && !errVenue && !errTeamAScore && !errTeamBScore && !errTeamAName && !errTeamBName && !errStreamURL
    const validation = isCreate ? validateCreate : validateEdit
    if (validation) {
      let contestDate
      if (StartDate) {
        contestDate = new Date(StartDate).toISOString()
      }
      const seasonKey = season.value.split('/')
      if (isCreate) {
        AddMatchFunc(Series.value, seasonKey[0], season.label, SeasonKey, MatchName, MatchFormat, contestDate, TeamAName.value, TeamBName.value, TeamAScore, TeamBScore, Venue, matchOnTop, TossWinner, ChooseTossWinner, disable, parseInt(MaxTeamLimit), SponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag)
      } else {
        UpdateMatch(Series.value, seasonKey[0], season.label, SeasonKey, MatchName, MatchFormat, contestDate, TeamAName.value, TeamBName.value, TeamAScore, TeamBScore, Venue, MatchStatus, TossWinner, ChooseTossWinner, matchOnTop, disable, parseInt(MaxTeamLimit), SponsoredText, FantasyPostID, StreamURL, StreamType, matchKey, info, winningText, scoreCardFlag)
      }
      // setMatchReport(false)
      setLoading(true)
    } else {
      if (!season) {
        setSeasonErr('Required field')
      }
      if (!verifyLength(SeasonKey, 1)) {
        setErrSeasonKey('Required field')
      }
      if (!verifyLength(MatchName, 1)) {
        setErrMatchName('Required field')
      }
      if (!StartDate) {
        setErrStartDate('Required field')
      }
      if (!TeamAName.value) {
        setErrTeamAName('Required field')
      }
      if (!TeamBName.value) {
        setErrTeamBName('Required field')
      }
      if (!StartDate) {
        setErrStartDate('Required field')
      }
      if (!verifyLength(Venue, 1)) {
        setErrVenue('Required field')
      }
    }
  }

  function generatePDF () {
    dispatch(generatePdf('MATCH', matchId, token))
  }

  // pagination for series field
  function onSeriesPagination () {
    const length = Math.ceil(seriesTotal / 10)
    if (seriesActivePage < length) {
      const start = seriesActivePage * 10
      dispatch(getSeriesNameList(SportsType, searchValue, start, limit, token))
      setSeriesActivePage(seriesActivePage + 1)
    }
  }

  // pagination for season field
  function onSeasonPagination () {
    const length = Math.ceil(seasonTotal / 10)
    if (seasonActivePage < length) {
      const start = seasonActivePage * 10
      getSeasonListFunc(start, searchValue)
      setSeasonActivePage(seasonActivePage + 1)
    }
  }

  // pagination for teams field
  function onPagination () {
    const length = Math.ceil(Total / 10)
    if (activePageNo < length) {
      const start = activePageNo * 10
      getTeamName(start, searchValue)
      setPageNo(activePageNo + 1)
    }
  }

  useEffect(() => {
    const callSearchService = () => {
      if (searchType === 'Series') {
        const isSeriesTotalValid = (seriesTotal !== seriesOptions.length)
        const isValueNotInList = !(seriesNameList.aData.some(series => series.sName.toUpperCase().includes(searchValue) || series.sName.toLowerCase().includes(searchValue)))
        if (isSeriesTotalValid && isValueNotInList) {
          const start = 0
          dispatch(getSeriesNameList(SportsType, searchValue, start, limit, token))
          setPageNo(1)
          setLoading(true)
        }
      } else if (searchType === 'season') {
        const start = 0
        const isSeasonTotalValid = (seasonTotal !== seasonOptions.length)
        const isSeasonNotInList = !(seasonList.results.some(data => data.sName.toUpperCase().includes(searchValue) || data.sName.toLowerCase().includes(searchValue)))
        if (isSeasonTotalValid && isSeasonNotInList) {
          getSeasonListFunc(start, searchValue)
          setLoading(true)
        }
      } else if (searchType === 'TeamName') {
        const start = 0
        const isTeamTotalValid = (Total !== options.length)
        const isTeamNotInList = !(teamName.results.some(team => team.sName.toUpperCase().includes(searchValue) || team.sName.toLowerCase().includes(searchValue)))
        if (isTeamTotalValid && isTeamNotInList) {
          getTeamName(start, searchValue)
          setLoading(true)
          setPageNo(1)
        }
      }
    }
    if (previousProps.searchValue !== searchValue) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchValue = searchValue
      }
    }
    return () => {
      previousProps.searchValue = searchValue
    }
  }, [searchValue])

  function handleInputChange (value, type) {
    setSearchValue(value)
    setSearchType(type)
  }

  function calculateLiveLeaderBoard () {
    dispatch(loadLiveLeaderBoard(matchId, token))
  }

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <Input value={value} placeholder='Enter match date' ref={ref} readOnly />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  function onRefresh () {
    dispatch(matchRefresh(matchId, token))
  }

  function getScoreCardDataFunc () {
    dispatch(liveInnings(matchId, token))
    dispatch(fullScoreCard(matchId, token))
    setLoading(true)
  }

  return (
    <main className='main-content'>
      {loading && <Loading />}
      {
        modalMessage && message && (
          <UncontrolledAlert color='primary' className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <section className='common-box management-section'>
        <section className='add-contest-section'>
        <Row>
          <Col md='12' lg='3'>
          <div className='d-flex inline-input'>
              <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => props?.location?.state?.goBack ? history.goBack() : (appView === 'true') ? history.push(`/${SportsType}/matches-app-view`) : history.push(`/${SportsType}/match-management${page?.MatchManagement || ''}`)}></img>
              <h2 className='ml-2'>{isCreate ? 'Create Match' : 'Edit Match Details'} </h2>
            </div>
            </Col>
            {isCreate
              ? null
              : (<Col md='12' lg='9'>
                <div className='match-buttons d-flex inline-input'>
                  <div className='btn-list'>
                    {
                      ((Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'N')) && (
                        <Button className='theme-btn' tag={Link} to={`/admin-logs/${matchDetails?._id}`}>
                          Match Logs
                        </Button>
                      )
                    }
                    {matchDetails && (matchDetails.eStatus === 'L') && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE === 'W')) &&
                    <Button className='theme-btn' onClick={() => generatePDF()}>
                      Generate Fair Play
                    </Button>}
                    {matchDetails && (matchDetails.eStatus === 'L') && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH === 'W')) &&
                    <Button className='theme-btn' onClick={() => calculateLiveLeaderBoard()}>
                      Load Live Leader Board
                    </Button>}
                      {
                        (matchDetails && matchDetails.eStatus === 'CMP') && ((Auth && Auth === 'SUPER') || (adminPermission?.REPORT === 'W')) && (
                          <Button className='theme-btn' tag={Link} to={`${props.matchReport}`}>
                            Reports
                          </Button>
                        )
                      }
                      {
                        (matchDetails && matchDetails.eProvider === 'CUSTOM') && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) &&
                          <Button className='theme-btn' onClick={() => history.push(`${mergeMatchPage}/${matchId}`)}>
                            Merge Match
                          </Button>
                      }
                      {
                        ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'N')) && (
                          <Button className='theme-btn' tag={Link} to={`${props.matchLeague}`}>
                            League Management
                          </Button>
                        )
                      }
                      {
                        ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'N')) && (
                          <Button className='theme-btn' tag={Link} to={`${props.matchPlayer}`}>
                            Player Management
                          </Button>
                        )
                      }
                      {matchDetails && ((matchDetails.eStatus === 'P') || (matchDetails.eStatus === 'U')) && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) &&
                        <Button className='theme-btn' onClick={onRefresh}>Match Data Refresh
                        </Button>
                      }
                      {matchDetails && ((matchDetails.eStatus === 'L') || (matchDetails.eStatus === 'CMP') || (matchDetails.eStatus === 'I')) && ((Auth && Auth === 'SUPER') || (adminPermission?.MATCH !== 'N')) &&
                        <Button className='theme-btn' onClick={getScoreCardDataFunc}>Score Card</Button>
                      }
                    </div>
                  </div>
                  </Col>)
            }
          </Row>
          <Row className='row-12 mt-4'>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='Series'> Series</Label>
                <Select
                    options={seriesOptions}
                    id='series'
                    name='series'
                    type='select'
                    placeholder='Select a Series'
                    value={Series}
                    onMenuScrollToBottom={onSeriesPagination}
                    onChange={(selectedOption) => handleChange(selectedOption, 'Series')}
                    onInputChange={(value) => handleInputChange(value, 'Series')}
                    isDisabled={adminPermission?.MATCH === 'R'}
                    controlShouldRenderValue={seriesOptions}
                  />
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='season'>Season Name <span className='required-field'>*</span></Label>
                <Select
                  options={seasonOptions}
                  id='season'
                  name='season'
                  type='select'
                  placeholder='Select a season'
                  value={season}
                  onMenuScrollToBottom={onSeasonPagination}
                  onChange={(selectedOption) => handleChange(selectedOption, 'season')}
                  onInputChange={(value) => handleInputChange(value, 'season')}
                  isDisabled={adminPermission?.MATCH === 'R'}
                  controlShouldRenderValue={seasonOptions}
                />
                <p className='error-text'>{seasonErr}</p>
              </FormGroup>
            </Col>
              <Col xl={4} lg={4} md={6}>
                <FormGroup>
                  <Label for='SeasonKey'>Season Key <span className='required-field'>*</span>
                  </Label>
                  {isCreate
                    ? <Input
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    type='text'
                    id='SeasonKey'
                    placeholder='Enter Season Key'
                    value={SeasonKey}
                    onChange={(event) => handleChange(event, 'SeasonKey')}
                  />
                    : <InputGroupText>{SeasonKey}</InputGroupText>}
                  <p className='error-text'>{errSeasonKey}</p>
                </FormGroup>
              </Col>
            {!isCreate && matchKey && (
              <Col xl={4} lg={4} md={6}>
                <FormGroup>
                  <Label for='MatchKey'>Match Key</Label>
                  <InputGroupText>{matchKey}</InputGroupText>
                </FormGroup>
              </Col>
            )}
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='MatchName'>Match Name <span className='required-field'>*</span></Label>
                <Input
                  disabled={adminPermission?.MATCH === 'R'}
                  type='text'
                  id='MatchName'
                  placeholder='Enter Match Name'
                  value={MatchName}
                  onChange={(event) => handleChange(event, 'MatchName')}
                />
                <p className='error-text'>{errMatchName}</p>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='matchFormat'>Match Format </Label>
                <CustomInput
                  disabled={adminPermission?.MATCH === 'R'}
                  type='select'
                  name='select'
                  id='matchFormat'
                  value={MatchFormat}
                  onChange={(event) => handleChange(event, 'MatchFormat')}
                >
                  {FormatsList &&
                    FormatsList.length !== 0 &&
                    FormatsList.map((data, i) => {
                      return (
                        <option value={data} key={data}>
                          {data}
                        </option>
                      )
                    })}
                </CustomInput>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='startDate'>
                  Match Date <span className='required-field'>*</span>
                </Label>
                <DatePicker
                  selected={StartDate}
                  value={StartDate}
                  dateFormat="dd-MM-yyyy h:mm aa"
                  onChange={(date) => {
                    handleChange(date, 'StartDate')
                  }}
                  showTimeSelect
                  timeIntervals={1}
                  customInput={<ExampleCustomInput />}
                  disabled={adminPermission?.MATCH === 'R'}
                />
                <p className='error-text'>{errStartDate}</p>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='Venue'>
                  {' '}
                  Venue <span className='required-field'>*</span>
                </Label>
                <Input
                  disabled={adminPermission?.MATCH === 'R'}
                  type='text'
                  id='Venue'
                  placeholder='Enter Venue'
                  value={Venue}
                  onChange={(event) => handleChange(event, 'Venue')}
                />
                <p className='error-text'>{errVenue}</p>
              </FormGroup>
            </Col>
            {!isCreate && (
              <Col xl={4} lg={4} md={6}>
                <FormGroup>
                  <Label for='MatchStatus'> Match Status</Label>
                  <CustomInput
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    type='select'
                    name='MatchStatus'
                    id='MatchStatus'
                    value={MatchStatus}
                    onChange={(event) => handleChange(event, 'MatchStatus')}
                  >
                    <option value='P'>Pending</option>
                    <option value='U'>Upcoming </option>
                    <option value='L'>Live </option>
                    <option value='I'>In-review</option>
                    <option value='CMP'>Completed </option>
                    <option value='CNCL'>Cancel</option>
                  </CustomInput>
                </FormGroup>
              </Col>
            )}
            {!isCreate && provider && <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='MatchStatus'>Provider</Label>
                <InputGroupText>{provider}</InputGroupText>
              </FormGroup>
            </Col>}
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='TeamAName'>
                  Season Team A Name <span className='required-field'>*</span>
                </Label>
                <Select
                  options={options}
                  id='SeasonAname'
                  name='SeasonAname'
                  placeholder='Enter Team A Name'
                  value={TeamAName}
                  // onMenuScrollToTop={onTop}
                  onInputChange={(value) => handleInputChange(value, 'TeamName')}
                  onMenuScrollToBottom={onPagination}
                  onChange={(selectedOption) =>
                    handleChange(selectedOption, 'TeamAName')
                  }
                  isDisabled={!isCreate}
                  controlShouldRenderValue={options}
                />
                <p className='error-text'>{errTeamAName}</p>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='TeamBName'>
                  Season Team B Name <span className='required-field'>*</span>
                </Label>
                <Select
                  options={options}
                  id='TeamBName'
                  name='TeamBName'
                  placeholder='Enter Team B Name'
                  value={TeamBName}
                  // onMenuScrollToTop={onTop}
                  onInputChange={(value) => handleInputChange(value, 'TeamName')}
                  onMenuScrollToBottom={onPagination}
                  onChange={(selectedOption) =>
                    handleChange(selectedOption, 'TeamBName')
                  }
                  isDisabled={!isCreate}
                />
                <p className='error-text'>{errTeamBName}</p>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='TeamAScore'>Season Team A Score</Label>
                <Input
                  disabled={adminPermission?.MATCH === 'R'}
                  type='string'
                  id='TeamAScore'
                  placeholder='Enter Team A Score'
                  value={TeamAScore}
                  onChange={(event) => handleChange(event, 'TeamAScore')}
                />
                <p className='error-text'>{errTeamAScore}</p>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='TeamBScore'>Season Team B Score</Label>
                <Input
                  disabled={adminPermission?.MATCH === 'R'}
                  type='string'
                  id='TeamBScore'
                  placeholder='Enter Team B Score'
                  value={TeamBScore}
                  onChange={(event) => handleChange(event, 'TeamBScore')}
                />
                <p className='error-text'>{errTeamBScore}</p>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='MaxTeamLimit'>Max Team Limit</Label>
                <Input
                  disabled={adminPermission?.MATCH === 'R'}
                  type='number'
                  id='MaxTeamLimit'
                  placeholder='Enter Max Team Limit'
                  value={MaxTeamLimit}
                  onChange={(event) => handleChange(event, 'MaxTeamLimit')}
                />
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='fantasyPost'>Fantasy Post ID</Label>
                <div style={{ position: 'relative' }}>
                  <Input
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    type='string'
                    id='fantasyPost'
                    placeholder='Enter Fantasy Tips post ID'
                    value={FantasyPostID}
                    onChange={(event) => handleChange(event, 'FantasyPostID')}
                  />
                    {matchDetails && matchDetails.sFantasyPost && <img
                      src={viewIcon}
                      className='view-info'
                      alt='View'
                      onClick={() => {
                        setModalState(true)
                        dispatch(getPost(FantasyPostID, token))
                      }}
                    />}
                  <Modal
                    isOpen={modalState}
                    toggle={() => {
                      setModalState(false)
                    }}
                  >
                    <ModalHeader
                      toggle={() => {
                        setModalState(false)
                      }}
                    >
                      <h2>{post?.sTitle}</h2>
                    </ModalHeader>
                    <ModalBody>
                      <div dangerouslySetInnerHTML={{ __html: post?.sContent }}></div>
                    </ModalBody>
                  </Modal>
                </div>
                <p className='error-text'>{errFantasyPostID}</p>
              </FormGroup>
            </Col>
            {(
              <Col xl={4} lg={4} md={6}>
                <FormGroup>
                  <Label for='StreamType'>Stream Type</Label>
                  <CustomInput
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    type='select'
                    name='StreamType'
                    id='StreamType'
                    value={StreamType}
                    onChange={(event) => handleChange(event, 'StreamType')}
                  >
                    <option value='YOUTUBE'>YouTube</option>
                    <option value='STREAM'>Stream</option>
                  </CustomInput>
                </FormGroup>
              </Col>
            )}
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                  <Label for='streamURL'>Stream URL (Only add embed)</Label>
                  <Input
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    type='string'
                    id='streamURL'
                    placeholder='Enter URL'
                    value={StreamURL}
                    onChange={(event) => handleChange(event, 'StreamURL')}
                  />
                  {matchDetails && matchDetails.sStreamUrl && <img
                    src={viewIcon}
                    className='view-info'
                    alt='View'
                    onClick={() => {
                      setStreamURLModal(true)
                    }}
                  />}
                  <Modal
                    isOpen={streamURLModal}
                    toggle={() => {
                      setStreamURLModal(false)
                    }}
                  >
                    <ModalHeader
                      toggle={() => {
                        setStreamURLModal(false)
                      }}
                    >
                    </ModalHeader>
                    <ModalBody>
                      <div className='videoShowing'>
                        <iframe
                          src={StreamURL}
                          frameBorder='0'
                          allow='autoplay; encrypted-media'
                          allowFullScreen
                          title='video'
                        />
                      </div>
                    </ModalBody>
                  </Modal>
                <p className='error-text'>{errStreamURL}</p>
              </FormGroup>
            </Col>
            {SportsType === 'cricket'
              ? <Col xl={4} lg={4} md={6}>
                <FormGroup>
                  <Label for='Toss'>Toss Winner Team</Label>
                  <CustomInput
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    type='select'
                    name='tossName'
                    id='Toss'
                    placeholder='Enter Toss Winner Team'
                    value={TossWinner}
                    onChange={(event) => handleChange(event, 'TossWinner')}
                  >
                    <option value=''>
                      Select Toss Winner Team
                    </option>
                    {tossOptions &&
                      tossOptions.length !== 0 &&
                      tossOptions.map((data) => {
                        return (
                          <option key={data.value} value={data.value}>
                            {data.label}
                          </option>
                        )
                      })}
                  </CustomInput>
                </FormGroup>
              </Col>
              : ('')}
            {SportsType === 'cricket'
              ? <Col xl={4} lg={4} md={6}>
                <FormGroup>
                  <Label for='chooseTossWinner'>Opted field</Label>
                  <CustomInput
                    disabled={
                      !TossWinner ||
                      (adminPermission?.MATCH === 'R')
                    }
                    type='select'
                    name='chooseTossWinner'
                    id='chooseTossWinner'
                    placeholder='Enter Choose Toss Winner'
                    value={ChooseTossWinner}
                    onChange={(event) =>
                      handleChange(event, 'ChooseTossWinner')
                    }
                  >
                    <option value=''>
                      {' '}
                      Select a Opted Field
                    </option>
                    <option value='BAT'>Batting</option>
                    <option value='BOWLING'>Bowling</option>
                  </CustomInput>
                  <p className='error-text'>{errChooseTossWinner}</p>
                </FormGroup>
              </Col>
              : ''}
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='WinningText'>Winning Text</Label>
                <Input
                  disabled={adminPermission?.MATCH === 'R'}
                  type='text'
                  id='WinningText'
                  placeholder='Enter Winning Text'
                  value={winningText}
                  onChange={(event) => handleChange(event, 'WinningText')}
                />
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='SponsoredText'>Sponsored Text</Label>
                <Input
                  disabled={adminPermission?.MATCH === 'R'}
                  type='text'
                  id='SponsoredText'
                  placeholder='Enter Sponsored Text'
                  value={SponsoredText}
                  onChange={(event) => handleChange(event, 'SponsoredText')}
                />
                <p className='error-text'>{errSponsoredText}</p>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='Info'>Info</Label>
                <Input
                  disabled={adminPermission?.MATCH === 'R'}
                  type='text'
                  id='Info'
                  placeholder='Enter Info'
                  value={info}
                  onChange={(event) => handleChange(event, 'Info')}
                />
              </FormGroup>
            </Col>
            {StatusNote &&
              <Col xl={4} lg={4} md={6}>
                <FormGroup>
                  <Label for='StatusNote'>Status Note</Label>
                  <InputGroupText>{StatusNote}</InputGroupText>
                </FormGroup>
              </Col>
            }
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='matchontop'>Match On Top </Label>
                <div className='d-flex inline-input mt-2'>
                  <CustomInput
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    className='matchBottom'
                    type='radio'
                    id='matchOnTop1'
                    name='matchOnTop1'
                    label='Yes'
                    onChange={(event) => handleChange(event, 'matchOnTop')}
                    checked={matchOnTop === 'Y'}
                    value='Y'
                  />
                  <CustomInput
                    className='matchBottom'
                    type='radio'
                    id='matchOnTop2'
                    name='matchOnTop2'
                    label='No'
                    onChange={(event) => handleChange(event, 'matchOnTop')}
                    checked={matchOnTop !== 'Y'}
                    value='N'
                  />
                </div>
              </FormGroup>
            </Col>
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='matchontop'>Disabled </Label>
                <div className='d-flex inline-input mt-2'>
                  <CustomInput
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    className='matchBottom'
                    type='radio'
                    id='disable1'
                    name='disable1'
                    label='Yes'
                    onChange={(event) => handleChange(event, 'disable')}
                    checked={disable === 'Y'}
                    value='Y'
                  />
                  <CustomInput
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    className='matchBottom'
                    type='radio'
                    id='disable2'
                    name='disable2'
                    label='No'
                    onChange={(event) => handleChange(event, 'disable')}
                    checked={disable !== 'Y'}
                    value='N'
                  />
                </div>
              </FormGroup>
            </Col>
            {SportsType === 'cricket' &&
            <Col xl={4} lg={4} md={6}>
              <FormGroup>
                <Label for='ScoreCardFlag'>Show Score Card</Label>
                <div className='d-flex inline-input mt-2'>
                  <CustomInput
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    type='radio'
                    id='scoreCard1'
                    name='scoreCard1'
                    label='Yes'
                    onChange={(event) => handleChange(event, 'ScoreCardFlag')}
                    checked={scoreCardFlag === 'Y'}
                    value='Y'
                  />
                  <CustomInput
                    disabled={
                     adminPermission?.MATCH === 'R'
                    }
                    type='radio'
                    id='scoreCard2'
                    name='scoreCard2'
                    label='No'
                    onChange={(event) => handleChange(event, 'ScoreCardFlag')}
                    checked={scoreCardFlag !== 'Y'}
                    value='N'
                  />
                </div>
              </FormGroup>
            </Col>}
          </Row>
          <div className='footer-btn text-center'>
            <Link
              className='theme-btn outline-btn outline-theme mr-3'
              to={appView === 'true' ? `/${SportsType}/matches-app-view` : `/${SportsType}/match-management${page?.MatchManagement || ''}`}
            >
              Cancel
            </Link>
            {((Auth && Auth === 'SUPER') ||
              (adminPermission?.MATCH !== 'R')) && (
              <Button className='theme-btn' onClick={onAdd} disabled={updateDisable}>
                {isCreate
                  ? 'Add Match'
                  : 'Save Changes'}
              </Button>
            )}
          </div>
        </section>
      </section>

      <Modal isOpen={modalOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Live Innings</ModalHeader>
        <ModalBody>
        <div className="score-cards">
        {
          liveInningsState?.length > 0
            ? (
            <Fragment>
              {
                liveInningsState.map((inning, index) => {
                  return (
                    <Fragment key={index}>
                      <Button color=" d-flex justify-content-between align-item-center" onLoad={() => setField([true, false, false, false])} onClick={() => {
                        setField(field.map((data, index2) => index2 === index && !data))
                      }} style={{ marginBottom: '1rem' }}>
                        <span>{inning?.sName}{(fullScoreCardState?.nLatestInningNumber === inning?.nInningNumber) && <img src={star}></img>}</span>
                        <span>
                          {inning?.oEquations?.nRuns}/{inning?.oEquations?.nWickets} ({inning?.oEquations?.sOvers})
                          <img className={`${field[index] ? 'rotate' : ''}`} src={down}></img>
                        </span>
                      </Button>
                      <Collapse isOpen={field[index]}>
                        <Card>
                          <CardBody>
                            <div style={{ overflowX: 'auto' }} className='mb-3'>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Batsman</th>
                                    <th>Runs</th>
                                    <th>Balls</th>
                                    <th>4s</th>
                                    <th>6s</th>
                                    <th>SR</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    inning?.aBatters?.length > 0 && inning?.aBatters.map((bat, ind) => {
                                      const isInInning = inning?.oCurrentPartnership?.aBatters?.map(inn => inn.iBatterId)
                                      return (
                                        <Fragment key={ind}>
                                          <tr>
                                            <td className={isInInning.includes(bat?.iBatterId) ? 'blueText' : ''}>
                                              <p><b>{bat?.oBatter?.sName}</b></p>
                                              <span> {bat?.sHowOut} </span>
                                            </td>
                                            {/* <td className={`${isInInning.includes(bat?.iBatterId) ? 'blueText' : ''}`}>
                                            </td> */}
                                            <td>{bat?.nRuns}</td>
                                            <td>{bat?.nBallFaced}</td>
                                            <td>{bat?.nFours}</td>
                                            <td>{bat?.nSixes}</td>
                                            <td>{bat?.sStrikeRate}</td>
                                          </tr>
                                        </Fragment>
                                      )
                                    })
                                  }
                                  <tr>
                                    <td>
                                      <p>Extra</p>
                                      <span>
                                        ( b - {inning?.oExtraRuns?.nByes || 0}, w - {inning?.oExtraRuns?.nWides || 0}, no - {inning?.oExtraRuns?.nNoBalls || 0}, lb - {inning?.oExtraRuns?.nLegByes || 0}, p - {inning?.oExtraRuns?.nPenalty || 0} )
                                      </span>
                                    </td>
                                    {/* <td>( b - {inning?.oExtraRuns?.nByes || 0}, w - {inning?.oExtraRuns?.nWides || 0}, no - {inning?.oExtraRuns?.nNoBalls || 0}, lb - {inning?.oExtraRuns?.nLegByes || 0}, p - {inning?.oExtraRuns?.nPenalty || 0} )</td> */}
                                    <td>{inning?.oExtraRuns?.nTotal}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  <tr className='backgroundBlue'>
                                    <td>
                                      <p>Total</p>
                                      <span>( {inning?.oEquations?.sRunRate} Runs Per Over)</span>
                                    </td>
                                    {/* <td></td> */}
                                    <td>{inning?.oEquations?.nRuns}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className='fow'>
                              <span className='blueText d-block'>Fall Of Wickets</span>
                                <span className='d-block'>
                                  {inning?.aFOWs.map((fow, indF) => (fow?.nRuns) + '-' + fow?.nWicketNumber + '(' + fow?.oBatter?.sName + ',' + fow?.sOverDismissal + ')' + (indF === (inning?.aFOWs?.length - 1) ? '' : ', '))}
                                </span>
                            </div>
                            <div style={{ overflowX: 'auto' }} className='mb-3'>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Bowler</th>
                                    <th>Ov</th>
                                    <th>M</th>
                                    <th>R</th>
                                    <th>W</th>
                                    <th>NB</th>
                                    <th>WD</th>
                                    <th>Eco</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    inning?.aBowlers?.length > 0 && inning?.aBowlers.map((bowl, ind) => {
                                      return (
                                        <Fragment key={ind}>
                                          <tr>
                                            <td>{bowl?.oBowler?.sName}</td>
                                            <td>{bowl?.sOvers}</td>
                                            <td>{bowl?.nMaidens}</td>
                                            <td>{bowl?.nRunsConducted}</td>
                                            <td>{bowl?.nWickets}</td>
                                            <td>{bowl?.nNoBalls}</td>
                                            <td>{bowl?.nWides}</td>
                                            <td>{bowl?.sEcon}</td>
                                          </tr>
                                        </Fragment>
                                      )
                                    })
                                  }
                                </tbody>
                              </table>
                            </div>
                          </CardBody>
                        </Card>
                      </Collapse>
                    </Fragment>
                  )
                })
              }
            </Fragment>
              )
            : (
            <h1>Data not available</h1>)
        }
      </div>
        </ModalBody>
      </Modal>
    </main>
  )
}

AddMatch.propTypes = {
  AddMatchFunc: PropTypes.func,
  UpdateMatch: PropTypes.func,
  teamName: PropTypes.object,
  SportsType: PropTypes.string,
  getTeamName: PropTypes.func,
  FormatsList: PropTypes.array,
  match: PropTypes.object,
  history: PropTypes.object,
  matchReport: PropTypes.string,
  matchLeague: PropTypes.string,
  matchPlayer: PropTypes.string,
  getMatchDetailsFunc: PropTypes.func,
  value: PropTypes.string,
  onClick: PropTypes.func,
  mergeMatchPage: PropTypes.string,
  location: PropTypes.object
}

export default connect()(AddMatch)
