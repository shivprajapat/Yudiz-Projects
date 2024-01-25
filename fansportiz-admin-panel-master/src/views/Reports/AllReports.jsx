import React, { useEffect, useRef, useState, Fragment, forwardRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllReports, getDateRangeWiseReport, updateAppDownloadReport, updateCashbackReport, updateCashbackReturnReport, updateCreatorBonusReport, updateCreatorBonusReturnReport, updateGeneralizeReport, updateParticipants, updatePlayedReport, updatePlayReturnReport, updatePrivateLeague, updateTeams, updateWinReturn, updateWins } from '../../actions/reports'
import { Button, Col, CustomInput, Form, FormGroup, Input, PopoverBody, Row, UncontrolledAlert, UncontrolledPopover } from 'reactstrap'
import refreshIcon from '../../assets/images/refresh.svg'
import Loading from '../../components/Loading'
import { useQueryState } from 'react-router-use-location-state'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'
import { getSportsList } from '../../actions/sports'
import calendarIcon from '../../assets/images/calendar-icon.svg'
import DatePicker from 'react-datepicker'
import infoIcon from '../../assets/images/info2.svg'
import Info from '../../helpers/info'
import { alertClass, modalMessageFunc } from '../../helpers/helper'
import excelIcon from '../../assets/images/excel-icon.svg'
import { ExcelExport, ExcelExportColumn, ExcelExportColumnGroup } from '@progress/kendo-react-excel-export'

function AllReports (props) {
  const dispatch = useDispatch()
  const exporter = useRef(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useQueryState('reports', 'USER_REPORT')
  const [userType, setUserType] = useQueryState('usertype', 'U')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)

  const [TotalUsers, setTotalUsers] = useState({})
  const [LoginUser, setLoginUser] = useState({})
  const [RegisteredUsers, setRegisteredUsers] = useState({})
  const [Deposit, setDeposit] = useState({})
  const [Withdraw, setWithdraw] = useState({})
  const [BonusExpire, setBonusExpire] = useState({})
  const [userBonus, setUserBonus] = useState({})
  const [TDS, setTDS] = useState({})
  const [Teams, setTeams] = useState([])
  const [Participants, setParticipants] = useState([])
  const [Wins, setWins] = useState([])
  const [WinReturn, setWinReturn] = useState([])
  const [PrivateLeague, setPrivateLeague] = useState([])
  const [cashback, setCashback] = useState([])
  const [cashbackReturn, setCashbackReturn] = useState([])
  const [creatorBonus, setCreatorBonus] = useState([])
  const [creatorBonusReturn, setCreatorBonusReturn] = useState([])
  const [appDownloadReturn, setAppDownloadReturn] = useState([])
  const [playReturn, setPlayReturn] = useState([])
  const [played, setPlayed] = useState([])
  const [activeSports, setActiveSports] = useState([])
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  // eslint-disable-next-line no-unused-vars
  const [StartDate, setStartDate] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [EndDate, setEndDate] = useQueryState('dateto', '')
  const [dateWiseReports, setDateWiseReports] = useState([])

  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector((state) => state.auth.token)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const allReportsList = useSelector((state) => state.reports.allReportsList)
  const updatedGeneralizeData = useSelector(
    (state) => state.reports.updatedGeneralizeData
  )
  const updatedBotUserData = useSelector(state => state.reports.updatedBotUserData)
  const updatedCashbackData = useSelector(state => state.reports.updatedCashbackData)
  const updatedCashbackReturnData = useSelector(state => state.reports.updatedCashbackReturnData)
  const updatedPlayedData = useSelector(state => state.reports.updatedPlayedData)
  const updatedPlayReturnData = useSelector(state => state.reports.updatedPlayReturnData)
  const updatedCreatorBonusData = useSelector(state => state.reports.updatedCreatorBonusData)
  const updatedCreatorBonusReturnData = useSelector(state => state.reports.updatedCreatorBonusReturnData)
  // const updatedAppDownloadData = useSelector(state => state.reports.updatedAppDownloadData)
  const updatedTeamData = useSelector((state) => state.reports.updatedTeamData)
  const updatedParticipantsData = useSelector(
    (state) => state.reports.updatedParticipantsData
  )
  const updatedWinsData = useSelector((state) => state.reports.updatedWinsData)
  const updatedWinReturnData = useSelector(state => state.reports.updatedWinReturnData)
  const updatedPrivateLeagueData = useSelector(
    (state) => state.reports.updatedPrivateLeagueData
  )
  const updatedAppDownloadStatisticsData = useSelector((state) => state.reports.updatedAppDownloadData)

  const dateRangeWiseReportList = useSelector(
    (state) => state.reports.dateRangeWiseReportList
  )
  const sportsList = useSelector(state => state.sports.sportsList)
  const resMessage = useSelector((state) => state.reports.resMessage)
  const resStatus = useSelector((state) => state.reports.resStatus)
  const previousProps = useRef({
    allReportsList,
    resStatus,
    resMessage,
    updatedGeneralizeData,
    updatedTeamData,
    updatedParticipantsData,
    updatedWinsData,
    updatedPrivateLeagueData,
    isOpen,
    dateWiseReports,
    dateRangeWiseReportList,
    userType,
    updatedBotUserData,
    updatedPlayedData,
    updatedPlayReturnData,
    updatedCashbackData,
    updatedCashbackReturnData,
    updatedCreatorBonusData,
    updatedAppDownloadStatisticsData
  }).current
  const permission = (Auth && Auth === 'SUPER') || (adminPermission?.REPORT === 'W')

  useEffect(() => {
    if (props && props.location && props.location.search) {
      const obj = qs.parse(props.location.search)
      if (obj) {
        if (obj.usertype) {
          setUserType(obj.usertype)
        }
        if (obj.datefrom && obj.dateto) {
          setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
        }
        if (obj.reports) {
          setIsOpen(obj.reports)
          // setKey(obj.reports)
        }
      }
    }
    dispatch(getAllReports(token))
    dispatch(getSportsList(token))
    setLoading(true)
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
    if (allReportsList && allReportsList?.data?.length > 0) {
      const userIndex = allReportsList.data.findIndex(data => data.eType === 'U')
      const systemIndex = allReportsList.data.findIndex(data => data.eType === 'B')
      if (userType === 'U') {
        setTotalUsers(allReportsList.data[userIndex].oTotalUser)
        setLoginUser(allReportsList.data[userIndex].oLoginUser)
        setRegisteredUsers(allReportsList.data[userIndex].oRegisterUser)
        setDeposit(allReportsList.data[userIndex].oDeposit)
        setWithdraw(allReportsList.data[userIndex].oWithdraw)
        setBonusExpire(allReportsList.data[userIndex].oBonusExpire)
        setUserBonus(allReportsList.data[userIndex].oUserBonus)
        setTDS(allReportsList.data[userIndex].oTds)
        setTeams(allReportsList.data[userIndex].aTeams)
        setParticipants(allReportsList.data[userIndex].aParticipants)
        setWins(allReportsList.data[userIndex].aWins)
        setWinReturn(allReportsList.data[userIndex].aWinReturn)
        setPrivateLeague(allReportsList.data[userIndex].aPrivateLeague)
        setCashback(allReportsList.data[userIndex].aCashback)
        setCashbackReturn(allReportsList.data[userIndex].aCashbackReturn)
        setPlayed(allReportsList.data[userIndex].aPlayed)
        setPlayReturn(allReportsList.data[userIndex].aPlayReturn)
        setCreatorBonus(allReportsList.data[userIndex].aCreatorBonus)
        setCreatorBonusReturn(allReportsList.data[userIndex].aCreatorBonusReturn)
        setAppDownloadReturn(allReportsList.data[userIndex].aAppDownload)
        setLoading(false)
      } else {
        setTotalUsers(allReportsList.data[systemIndex].oTotalUser)
        setLoginUser(allReportsList.data[systemIndex].oLoginUser)
        setRegisteredUsers(allReportsList.data[systemIndex].oRegisterUser)
        setDeposit(allReportsList.data[systemIndex].oDeposit)
        setWithdraw(allReportsList.data[systemIndex].oWithdraw)
        setBonusExpire(allReportsList.data[systemIndex].oBonusExpire)
        setUserBonus(allReportsList.data[systemIndex].oUserBonus)
        setTDS(allReportsList.data[systemIndex].oTds)
        setTeams(allReportsList.data[systemIndex].aTeams)
        setParticipants(allReportsList.data[systemIndex].aParticipants)
        setWins(allReportsList.data[systemIndex].aWins)
        setWinReturn(allReportsList.data[systemIndex].aWinReturn)
        setPrivateLeague(allReportsList.data[systemIndex].aPrivateLeague)
        setCashback(allReportsList.data[systemIndex].aCashback)
        setCashbackReturn(allReportsList.data[systemIndex].aCashbackReturn)
        setPlayed(allReportsList.data[systemIndex].aPlayed)
        setPlayReturn(allReportsList.data[systemIndex].aPlayReturn)
        setCreatorBonus(allReportsList.data[systemIndex].aCreatorBonus)
        setCreatorBonusReturn(allReportsList.data[systemIndex].aCreatorBonusReturn)
        setAppDownloadReturn(allReportsList.data[systemIndex].aAppDownload)
        setLoading(false)
      }
    }
  }, [allReportsList])

  // will be called when user type/ report type changes occurred
  useEffect(() => {
    if (previousProps.userType !== userType || previousProps.isOpen !== isOpen) {
      if (startDate && endDate && (previousProps.isOpen !== isOpen || previousProps.userType !== userType)) {
        const startingDate = new Date(moment(startDate).startOf('day').format())
        const endingDate = new Date(moment(endDate).endOf('day').format())
        dispatch(getDateRangeWiseReport(new Date(startingDate).toISOString(), new Date(endingDate).toISOString(), isOpen, userType, token))
        setLoading(true)
      } else if ((previousProps.isOpen !== isOpen || previousProps.userType !== userType)) {
        dispatch(getAllReports(token))
        setLoading(true)
      }
    }
    return () => {
      previousProps.userType = userType
      previousProps.isOpen = isOpen
    }
  }, [userType, isOpen])

  // set active sports
  useEffect(() => {
    if (sportsList) {
      setActiveSports(sportsList.filter(sport => sport.eStatus === 'Y').map(data => data.sKey))
    }
  }, [sportsList])

  // to set updated users generalize data
  useEffect(() => {
    if (updatedGeneralizeData) {
      if (previousProps.updatedGeneralizeData !== updatedGeneralizeData) {
        if (updatedGeneralizeData.oTotalUser) {
          setTotalUsers(updatedGeneralizeData.oTotalUser)
        } else if (updatedGeneralizeData.oLoginUser) {
          setLoginUser(updatedGeneralizeData.oLoginUser)
        } else if (updatedGeneralizeData.oRegisterUser) {
          setRegisteredUsers(updatedGeneralizeData.oRegisterUser)
        } else if (updatedGeneralizeData.oWithdraw) {
          setWithdraw(updatedGeneralizeData.oWithdraw)
        } else if (updatedGeneralizeData.oDeposit) {
          setDeposit(updatedGeneralizeData.oDeposit)
        } else if (updatedGeneralizeData.oBonusExpire) {
          setBonusExpire(updatedGeneralizeData.oBonusExpire)
        } else if (updatedGeneralizeData.oUserBonus) {
          setUserBonus(updatedGeneralizeData.oUserBonus)
        } else if (updatedGeneralizeData.oTds) {
          setTDS(updatedGeneralizeData.oTds)
        }
      }
    }
    return () => {
      previousProps.updatedGeneralizeData = updatedGeneralizeData
    }
  }, [updatedGeneralizeData])

  // to set updated system users data
  useEffect(() => {
    if (updatedBotUserData) {
      if (previousProps.updatedBotUserData !== updatedBotUserData) {
        if (updatedBotUserData.oTotalUser) {
          setTotalUsers(updatedBotUserData.oTotalUser)
        } else if (updatedBotUserData.oLoginUser) {
          setLoginUser(updatedBotUserData.oLoginUser)
        } else if (updatedBotUserData.oRegisterUser) {
          setRegisteredUsers(updatedBotUserData.oRegisterUser)
        } else if (updatedBotUserData.oWithdraw) {
          setWithdraw(updatedBotUserData.oWithdraw)
        } else if (updatedBotUserData.oDeposit) {
          setDeposit(updatedBotUserData.oDeposit)
        } else if (updatedBotUserData.oBonusExpire) {
          setBonusExpire(updatedBotUserData.oBonusExpire)
        } else if (updatedBotUserData.oUserBonus) {
          setUserBonus(updatedBotUserData.oUserBonus)
        } else if (updatedBotUserData.oTds) {
          setTDS(updatedBotUserData.oTds)
        }
      }
    }
    return () => {
      previousProps.updatedBotUserData = updatedBotUserData
    }
  }, [updatedBotUserData])

  // to set updated teams data
  useEffect(() => {
    if (updatedTeamData) {
      if (previousProps.updatedTeamData !== updatedTeamData) {
        const categoryIndex = Teams.findIndex(
          (team) => team.eCategory === updatedTeamData.eCategory
        )
        const newArray = [...Teams]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedTeamData.nTotal,
          nToday: updatedTeamData.nToday,
          nYesterday: updatedTeamData.nYesterday,
          nLastWeek: updatedTeamData.nLastWeek,
          nLastMonth: updatedTeamData.nLastMonth,
          nLastYear: updatedTeamData.nLastYear,
          dUpdatedAt: updatedTeamData.dUpdatedAt
        }
        setTeams(newArray)
      }
    }
    return () => {
      previousProps.updatedTeamData = updatedTeamData
    }
  }, [updatedTeamData])

  // to set updated participants data
  useEffect(() => {
    if (updatedParticipantsData) {
      if (previousProps.updatedParticipantsData !== updatedParticipantsData) {
        const categoryIndex = Participants.findIndex(
          (participants) =>
            participants.eCategory === updatedParticipantsData.eCategory
        )
        const newArray = [...Participants]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedParticipantsData.nTotal,
          nToday: updatedParticipantsData.nToday,
          nYesterday: updatedParticipantsData.nYesterday,
          nLastWeek: updatedParticipantsData.nLastWeek,
          nLastMonth: updatedParticipantsData.nLastMonth,
          nLastYear: updatedParticipantsData.nLastYear,
          dUpdatedAt: updatedParticipantsData.dUpdatedAt
        }
        setParticipants(newArray)
      }
    }
    return () => {
      previousProps.updatedParticipantsData = updatedParticipantsData
    }
  }, [updatedParticipantsData])

  useEffect(() => {
    if (updatedWinsData) {
      if (previousProps.updatedWinsData !== updatedWinsData) {
        const categoryIndex = Wins.findIndex(
          (wins) => wins.eCategory === updatedWinsData.eCategory
        )
        const newArray = [...Wins]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedWinsData.nTotal,
          nToday: updatedWinsData.nToday,
          nYesterday: updatedWinsData.nYesterday,
          nLastWeek: updatedWinsData.nLastWeek,
          nLastMonth: updatedWinsData.nLastMonth,
          nLastYear: updatedWinsData.nLastYear,
          dUpdatedAt: updatedWinsData.dUpdatedAt
        }
        setWins(newArray)
      }
    }
    return () => {
      previousProps.updatedWinsData = updatedWinsData
    }
  }, [updatedWinsData])

  useEffect(() => {
    if (updatedWinReturnData) {
      if (previousProps.updatedWinReturnData !== updatedWinReturnData) {
        const categoryIndex = WinReturn.findIndex(
          (winReturn) => winReturn.eCategory === updatedWinReturnData.eCategory
        )
        const newArray = [...WinReturn]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedWinReturnData.nTotal,
          nToday: updatedWinReturnData.nToday,
          nYesterday: updatedWinReturnData.nYesterday,
          nLastWeek: updatedWinReturnData.nLastWeek,
          nLastMonth: updatedWinReturnData.nLastMonth,
          nLastYear: updatedWinReturnData.nLastYear,
          dUpdatedAt: updatedWinReturnData.dUpdatedAt
        }
        setWinReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedWinReturnData = updatedWinReturnData
    }
  }, [updatedWinReturnData])

  useEffect(() => {
    if (updatedAppDownloadStatisticsData) {
      if (previousProps.updatedAppDownloadStatisticsData !== updatedAppDownloadStatisticsData) {
        const platformIndex = appDownloadReturn.findIndex(
          (appDownloadReturn) => appDownloadReturn.ePlatform === updatedAppDownloadStatisticsData.ePlatform
        )
        const newArray = [...appDownloadReturn]
        newArray[platformIndex] = {
          ...newArray[platformIndex],
          nTotal: updatedAppDownloadStatisticsData.nTotal,
          nToday: updatedAppDownloadStatisticsData.nToday,
          nYesterday: updatedAppDownloadStatisticsData.nYesterday,
          nLastWeek: updatedAppDownloadStatisticsData.nLastWeek,
          nLastMonth: updatedAppDownloadStatisticsData.nLastMonth,
          nLastYear: updatedAppDownloadStatisticsData.nLastYear,
          dUpdatedAt: updatedAppDownloadStatisticsData.dUpdatedAt
        }
        setAppDownloadReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedAppDownloadStatisticsData = updatedAppDownloadStatisticsData
    }
  }, [updatedAppDownloadStatisticsData])

  // to set updated private league data
  useEffect(() => {
    if (updatedPrivateLeagueData) {
      if (previousProps.updatedPrivateLeagueData !== updatedPrivateLeagueData) {
        const categoryIndex = PrivateLeague.findIndex(
          (privateLeague) =>
            privateLeague.eCategory === updatedPrivateLeagueData.sSport
        )
        const newArray = [...PrivateLeague]
        if (updatedPrivateLeagueData.oCancelled) {
          newArray[categoryIndex] = {
            ...newArray[categoryIndex],
            oCancelled: {
              ...newArray[categoryIndex].oCancelled,
              nTotal: updatedPrivateLeagueData.oCancelled.nTotal,
              nToday: updatedPrivateLeagueData.oCancelled.nToday,
              nYesterday: updatedPrivateLeagueData.oCancelled.nYesterday,
              nLastWeek: updatedPrivateLeagueData.oCancelled.nLastWeek,
              nLastMonth: updatedPrivateLeagueData.oCancelled.nLastMonth,
              nLastYear: updatedPrivateLeagueData.oCancelled.nLastYear,
              dUpdatedAt: updatedPrivateLeagueData.oCancelled.dUpdatedAt
            }
          }
        } else if (updatedPrivateLeagueData.oCompleted) {
          newArray[categoryIndex] = {
            ...newArray[categoryIndex],
            oCompleted: {
              ...newArray[categoryIndex].oCompleted,
              nTotal: updatedPrivateLeagueData.oCompleted.nTotal,
              nToday: updatedPrivateLeagueData.oCompleted.nToday,
              nYesterday: updatedPrivateLeagueData.oCompleted.nYesterday,
              nLastWeek: updatedPrivateLeagueData.oCompleted.nLastWeek,
              nLastMonth: updatedPrivateLeagueData.oCompleted.nLastMonth,
              nLastYear: updatedPrivateLeagueData.oCompleted.nLastYear,
              dUpdatedAt: updatedPrivateLeagueData.oCompleted.dUpdatedAt
            }
          }
        } else if (updatedPrivateLeagueData.oCreated) {
          newArray[categoryIndex] = {
            ...newArray[categoryIndex],
            oCreated: {
              ...newArray[categoryIndex].oCreated,
              nTotal: updatedPrivateLeagueData.oCreated.nTotal,
              nToday: updatedPrivateLeagueData.oCreated.nToday,
              nYesterday: updatedPrivateLeagueData.oCreated.nYesterday,
              nLastWeek: updatedPrivateLeagueData.oCreated.nLastWeek,
              nLastMonth: updatedPrivateLeagueData.oCreated.nLastMonth,
              nLastYear: updatedPrivateLeagueData.oCreated.nLastYear,
              dUpdatedAt: updatedPrivateLeagueData.oCreated.dUpdatedAt
            }
          }
        }
        setPrivateLeague(newArray)
      }
    }
    return () => {
      previousProps.updatedPrivateLeagueData = updatedPrivateLeagueData
    }
  }, [updatedPrivateLeagueData])

  // to set updated played data
  useEffect(() => {
    if (updatedPlayedData) {
      if (previousProps.updatedPlayedData !== updatedPlayedData) {
        const categoryIndex = played.findIndex(
          (playedData) => playedData.eCategory === updatedPlayedData.eCategory
        )
        const newArray = [...played]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotalCash: updatedPlayedData.nTotalCash,
          nTotalBonus: updatedPlayedData.nTotalBonus,
          nTodayCash: updatedPlayedData.nTodayCash,
          nTodayBonus: updatedPlayedData.nTodayBonus,
          nYesterCash: updatedPlayedData.nYesterCash,
          nYesterBonus: updatedPlayedData.nYesterBonus,
          nWeekCash: updatedPlayedData.nWeekCash,
          nWeekBonus: updatedPlayedData.nWeekBonus,
          nMonthCash: updatedPlayedData.nMonthCash,
          nMonthBonus: updatedPlayedData.nMonthBonus,
          nYearCash: updatedPlayedData.nYearCash,
          nYearBonus: updatedPlayedData.nYearBonus,
          dUpdatedAt: updatedPlayedData.dUpdatedAt
        }
        setPlayed(newArray)
      }
    }
    return () => {
      previousProps.updatedPlayedData = updatedPlayedData
    }
  }, [updatedPlayedData])

  // to set updated play return data
  useEffect(() => {
    if (updatedPlayReturnData) {
      if (previousProps.updatedPlayReturnData !== updatedPlayReturnData) {
        const categoryIndex = playReturn.findIndex(
          (playReturnData) => playReturnData.eCategory === updatedPlayReturnData.eCategory
        )
        const newArray = [...playReturn]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotalCash: updatedPlayReturnData.nTotalCash,
          nTotalBonus: updatedPlayReturnData.nTotalBonus,
          nTodayCash: updatedPlayReturnData.nTodayCash,
          nTodayBonus: updatedPlayReturnData.nTodayBonus,
          nYesterCash: updatedPlayReturnData.nYesterCash,
          nYesterBonus: updatedPlayReturnData.nYesterBonus,
          nWeekCash: updatedPlayReturnData.nWeekCash,
          nWeekBonus: updatedPlayReturnData.nWeekBonus,
          nMonthCash: updatedPlayReturnData.nMonthCash,
          nMonthBonus: updatedPlayReturnData.nMonthBonus,
          nYearCash: updatedPlayReturnData.nYearCash,
          nYearBonus: updatedPlayReturnData.nYearBonus,
          dUpdatedAt: updatedPlayReturnData.dUpdatedAt
        }
        setPlayReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedPlayReturnData = updatedPlayReturnData
    }
  }, [updatedPlayReturnData])

  // to set updated cashback data
  useEffect(() => {
    if (updatedCashbackData) {
      if (previousProps.updatedCashbackData !== updatedCashbackData) {
        const categoryIndex = cashback.findIndex(
          (cashbackData) => cashbackData.eCategory === updatedCashbackData.eCategory
        )
        const newArray = [...cashback]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotalCash: updatedCashbackData.nTotalCash,
          nTotalBonus: updatedCashbackData.nTotalBonus,
          nTodayCash: updatedCashbackData.nTodayCash,
          nTodayBonus: updatedCashbackData.nTodayBonus,
          nYesterCash: updatedCashbackData.nYesterCash,
          nYesterBonus: updatedCashbackData.nYesterBonus,
          nWeekCash: updatedCashbackData.nWeekCash,
          nWeekBonus: updatedCashbackData.nWeekBonus,
          nMonthCash: updatedCashbackData.nMonthCash,
          nMonthBonus: updatedCashbackData.nMonthBonus,
          nYearCash: updatedCashbackData.nYearCash,
          nYearBonus: updatedCashbackData.nYearBonus,
          dUpdatedAt: updatedCashbackData.dUpdatedAt
        }
        setCashback(newArray)
      }
    }
    return () => {
      previousProps.updatedCashbackData = updatedCashbackData
    }
  }, [updatedCashbackData])

  // to set updated cashback return data
  useEffect(() => {
    if (updatedCashbackReturnData) {
      if (previousProps.updatedCashbackReturnData !== updatedCashbackReturnData) {
        const categoryIndex = cashbackReturn.findIndex(
          (cashbackReturnData) => cashbackReturnData.eCategory === updatedCashbackReturnData.eCategory
        )
        const newArray = [...cashbackReturn]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotalCash: updatedCashbackReturnData.nTotalCash,
          nTotalBonus: updatedCashbackReturnData.nTotalBonus,
          nTodayCash: updatedCashbackReturnData.nTodayCash,
          nTodayBonus: updatedCashbackReturnData.nTodayBonus,
          nYesterCash: updatedCashbackReturnData.nYesterCash,
          nYesterBonus: updatedCashbackReturnData.nYesterBonus,
          nWeekCash: updatedCashbackReturnData.nWeekCash,
          nWeekBonus: updatedCashbackReturnData.nWeekBonus,
          nMonthCash: updatedCashbackReturnData.nMonthCash,
          nMonthBonus: updatedCashbackReturnData.nMonthBonus,
          nYearCash: updatedCashbackReturnData.nYearCash,
          nYearBonus: updatedCashbackReturnData.nYearBonus,
          dUpdatedAt: updatedCashbackReturnData.dUpdatedAt
        }
        setCashbackReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedCashbackReturnData = updatedCashbackReturnData
    }
  }, [updatedCashbackReturnData])

  // to set updated creator bonus data
  useEffect(() => {
    if (updatedCreatorBonusData) {
      if (previousProps.updatedCreatorBonusData !== updatedCreatorBonusData) {
        const categoryIndex = creatorBonus.findIndex(
          (creatorBonusData) => creatorBonusData.eCategory === updatedCreatorBonusData.eCategory
        )
        const newArray = [...creatorBonus]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedCreatorBonusData.nTotal,
          nToday: updatedCreatorBonusData.nToday,
          nYesterday: updatedCreatorBonusData.nYesterday,
          nLastWeek: updatedCreatorBonusData.nLastWeek,
          nLastMonth: updatedCreatorBonusData.nLastMonth,
          nLastYear: updatedCreatorBonusData.nLastYear,
          dUpdatedAt: updatedCreatorBonusData.dUpdatedAt
        }
        setCreatorBonus(newArray)
      }
    }
    return () => {
      previousProps.updatedCreatorBonusData = updatedCreatorBonusData
    }
  }, [updatedCreatorBonusData])

  useEffect(() => {
    if (updatedCreatorBonusReturnData) {
      if (previousProps.updatedCreatorBonusReturnData !== updatedCreatorBonusReturnData) {
        const categoryIndex = creatorBonusReturn.findIndex(
          (creatorBonusReturnData) => creatorBonusReturnData.eCategory === updatedCreatorBonusReturnData.eCategory
        )
        const newArray = [...creatorBonusReturn]
        newArray[categoryIndex] = {
          ...newArray[categoryIndex],
          nTotal: updatedCreatorBonusReturnData.nTotal,
          nToday: updatedCreatorBonusReturnData.nToday,
          nYesterday: updatedCreatorBonusReturnData.nYesterday,
          nLastWeek: updatedCreatorBonusReturnData.nLastWeek,
          nLastMonth: updatedCreatorBonusReturnData.nLastMonth,
          nLastYear: updatedCreatorBonusReturnData.nLastYear,
          dUpdatedAt: updatedCreatorBonusReturnData.dUpdatedAt
        }
        setCreatorBonusReturn(newArray)
      }
    }
    return () => {
      previousProps.updatedCreatorBonusReturnData = updatedCreatorBonusReturnData
    }
  }, [updatedCreatorBonusReturnData])

  // useEffect(() => {
  //   if (updatedAppDownloadData) {
  //     if (previousProps.updatedAppDownloadData !== updatedAppDownloadData) {
  //       const categoryIndex = appDownloadReturn.findIndex(
  //         (appDownloadReturnData) => appDownloadReturnData.eCategory === updatedAppDownloadData.eCategory
  //       )
  //       const newArray = [...appDownloadReturn]
  //       newArray[categoryIndex] = {
  //         ...newArray[categoryIndex],
  //         nTotal: updatedAppDownloadData.nTotal,
  //         nToday: updatedAppDownloadData.nToday,
  //         nYesterday: updatedAppDownloadData.nYesterday,
  //         nLastWeek: updatedAppDownloadData.nLastWeek,
  //         nLastMonth: updatedAppDownloadData.nLastMonth,
  //         nLastYear: updatedAppDownloadData.nLastYear,
  //         dUpdatedAt: updatedAppDownloadData.dUpdatedAt
  //       }
  //       setAppDownloadReturn(newArray)
  //     }
  //   }
  //   return () => {
  //     previousProps.updatedAppDownloadData = updatedAppDownloadData
  //   }
  // }, [updatedAppDownloadData])

  // to set date range wise data
  useEffect(() => {
    if (
      dateRangeWiseReportList &&
      previousProps.dateRangeWiseReportList !== dateRangeWiseReportList
    ) {
      setDateWiseReports(dateRangeWiseReportList)
      setLoading(false)
    }
    return () => {
      previousProps.dateRangeWiseReportList = dateRangeWiseReportList
    }
  }, [dateRangeWiseReportList])

  // dispatch action to get date-range wise data
  useEffect(() => {
    if (startDate && endDate) {
      setStartDate(moment(startDate).format('MM-DD-YYYY'))
      setEndDate(moment(endDate).format('MM-DD-YYYY'))
      const startingDate = new Date(moment(startDate).startOf('day').format())
      const endingDate = new Date(moment(endDate).endOf('day').format())
      dispatch(getDateRangeWiseReport(new Date(startingDate).toISOString(), new Date(endingDate).toISOString(), isOpen, userType, token))
      setLoading(true)
    } else if ((!startDate) && (!endDate)) {
      setStartDate('')
      setEndDate('')
      dateRangeWiseReportList && dispatch(getAllReports(token))
      setDateWiseReports([])
    }
  }, [startDate, endDate])

  // to change type of report
  function toggle (event) {
    if (event.target.value === 'PRIVATE_LEAGUE_REPORT' || event.target.value === 'CREATOR_BONUS_REPORT' || event.target.value === 'APP_DOWNLOAD_REPORT') {
      setIsOpen(event.target.value)
      if (userType === 'B') {
        setUserType('U')
      }
    } else {
      setIsOpen(event.target.value)
    }
  }

  // to change user's type
  function setUserTypeFunc (event) {
    setUserType(event.target.value)
  }

  // dispatch action to update the generalize data
  function updateGeneralizeReportFunc (key) {
    if (token) {
      const generalizeReportData = {
        key, userType, token
      }
      dispatch(updateGeneralizeReport(generalizeReportData))
      setLoading(true)
    }
  }

  // dispatch action to update the teams data
  function updateTeamsFunc (id, sportsType) {
    if (token) {
      const updateTeamsData = {
        id, sportsType, userType, token
      }
      dispatch(updateTeams(updateTeamsData))
      setLoading(true)
    }
  }

  // dispatch action to update the participants data
  function updateParticipantsFunc (id, sportsType) {
    if (token) {
      const updateParticipantData = {
        id, sportsType, userType, token
      }
      dispatch(updateParticipants(updateParticipantData))
      setLoading(true)
    }
  }

  // dispatch action to update the wins data
  function updateWinsFunc (id, sportsType) {
    if (token) {
      const updateWinsData = {
        id, sportsType, userType, token
      }
      dispatch(updateWins(updateWinsData))
      setLoading(true)
    }
  }

  // dispatch action to update the winReturn data
  function updateWinReturnFunc (id, sportsType) {
    if (token) {
      const updateWinsData = {
        id, sportsType, userType, token
      }
      dispatch(updateWinReturn(updateWinsData))
      setLoading(true)
    }
  }

  // dispatch action to update the private league data
  function updatePrivateLeagueFunc (id, key, sportsType) {
    if (token) {
      const updatePrivateLeagueData = {
        id, key, sportsType, token
      }
      dispatch(updatePrivateLeague(updatePrivateLeagueData))
      setLoading(true)
    }
  }

  // dispatch action to update the cashback data
  function updateCashbackFunc (id, key, sportsType) {
    if (token) {
      const updateCashbackData = {
        id, key, sportsType, userType, token
      }
      dispatch(updateCashbackReport(updateCashbackData))
      setLoading(true)
    }
  }

  // dispatch action to update the cashback return data
  function updateCashbackReturnFunc (id, key, sportsType) {
    if (token) {
      const updateCashbackReturnData = {
        id, key, sportsType, userType, token
      }
      dispatch(updateCashbackReturnReport(updateCashbackReturnData))
      setLoading(true)
    }
  }

  // dispatch action to update the played data
  function updatePlayedFunc (id, key, sportsType) {
    if (token) {
      const updatePlayedData = {
        id, key, sportsType, userType, token
      }
      dispatch(updatePlayedReport(updatePlayedData))
      setLoading(true)
    }
  }

  // dispatch action to update the play return data
  function updatePlayReturnFunc (id, key, sportsType) {
    if (token) {
      const updatePlayReturnData = {
        id, key, sportsType, userType, token
      }
      dispatch(updatePlayReturnReport(updatePlayReturnData))
      setLoading(true)
    }
  }

  // dispatch action to update the creator bonus data
  function updateCreatorBonusFunc (id, key, sportsType) {
    if (token) {
      const updateCreatorBonusData = {
        id, key, sportsType, token
      }
      dispatch(updateCreatorBonusReport(updateCreatorBonusData))
      setLoading(true)
    }
  }

  // dispatch action to update the creator bonus return data
  function updateCreatorBonusReturnFunc (id, key, sportsType) {
    if (token) {
      const updateCreatorBonusReturnData = {
        id, key, sportsType, token
      }
      dispatch(updateCreatorBonusReturnReport(updateCreatorBonusReturnData))
      setLoading(true)
    }
  }

  function updateAppDownloadFunc (id, key, platform) {
    if (token) {
      const updateAppDownloadData = {
        id, key, platform, token
      }
      dispatch(updateAppDownloadReport(updateAppDownloadData))
      setLoading(true)
    }
  }

  // function to put custom input in date-picker
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range ml-3 ml-0-480' onClick={onClick}>
      <Input className='mx-2' value={value} placeholder='Select Date Range' ref={ref} readOnly />
      {((!startDate) && (!endDate)) && <img src={calendarIcon} alt="calendar" />}
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  const processExcelExportData = (data) => {
    if (isOpen === 'USER_REPORT') {
      const userData = []
      userData.push({
        ...data.oTotalUser,
        ...data.oTds,
        ...data.oDeposit,
        totalRegisteredUsers: data.oRegisterUser.Total,
        platformWiseRegisteredUsers: (data.oRegisterUser.aPlatformWiseUser.map(platformWiseUser => platformWiseUser.eTitle + '-' + Number(platformWiseUser.nValue))).toString(),
        totalLoggedInUsers: data.oLoginUser.Total,
        depositMethods: (data.oDeposit.aDeposits.map(deposit => deposit.eTitle + '-' + Number(deposit.nValue))).toString(),
        nTotalWithdrawals: data.oWithdraw.nTotalWithdrawals,
        pendingWithdrawals: data.oWithdraw.aPendingWithdrawals.length > 0 ? (data.oWithdraw.aPendingWithdrawals.map(pendingWithdrawal => pendingWithdrawal.eTitle + '-' + Number(pendingWithdrawal.nValue))).toString() : '--',
        successWithdrawals: data.oWithdraw.aSuccessWithdrawals.length > 0 ? (data.oWithdraw.aSuccessWithdrawals.map(successWithdrawal => successWithdrawal.eTitle + '-' + Number(successWithdrawal.nValue))).toString() : '--',
        totalUserBonus: data.oUserBonus.nTotal,
        totalBonusExpire: data.oBonusExpire.nTotal
      })
      return userData
    } else if (isOpen === 'USERTEAM_REPORT' || isOpen === 'PARTICIPANT_REPORT' || isOpen === 'CREATOR_BONUS_REPORT' || isOpen === 'CREATOR_BONUS_RETURN_REPORT') {
      const finalData = data?.map((info) => {
        const nTotal = Number(info.nTotal) || 0
        let dUpdatedAt = moment(info.dUpdatedAt).local().format('lll')
        dUpdatedAt = dUpdatedAt === 'Invalid date' ? ' - ' : dUpdatedAt
        return {
          ...info,
          nTotal,
          dUpdatedAt
        }
      })
      return finalData
    } else if (isOpen === 'WIN_REPORT' || isOpen === 'WIN_RETURN_REPORT' || isOpen === 'PLAY_REPORT' || isOpen === 'PLAY_RETURN_REPORT' || isOpen === 'CASHBACK_REPORT' || isOpen === 'CASHBACK_RETURN_REPORT') {
      const finalData = data?.map((info) => {
        const nTotalCash = Number(info.nTotalCash) || 0
        const nTotalBonus = Number(info.nTotalBonus) || 0
        let dUpdatedAt = moment(info.dUpdatedAt).local().format('lll')
        dUpdatedAt = dUpdatedAt === 'Invalid date' ? ' - ' : dUpdatedAt
        return {
          ...info,
          nTotalCash,
          nTotalBonus,
          dUpdatedAt
        }
      })
      return finalData
    } else if (isOpen === 'PRIVATE_LEAGUE_REPORT') {
      const finalData = data?.map((info) => {
        const createdTotal = Number(info.oCreated.nTotal) || 0
        const completedTotal = Number(info.oCompleted.nTotal) || 0
        const cancelledTotal = Number(info.oCancelled.nTotal) || 0
        let dUpdatedAt = moment(info.dUpdatedAt).local().format('lll')
        dUpdatedAt = dUpdatedAt === 'Invalid date' ? ' - ' : dUpdatedAt
        return {
          ...info,
          createdTotal,
          completedTotal,
          cancelledTotal,
          dUpdatedAt
        }
      })
      return finalData
    } else if (isOpen === 'APP_DOWNLOAD_REPORT') {
      const finalData = data?.map((info) => {
        const nTotal = Number(info.nTotal) || 0
        let dUpdatedAt = moment(info.dUpdatedAt).local().format('lll')
        dUpdatedAt = dUpdatedAt === 'Invalid date' ? ' - ' : dUpdatedAt
        const ePlatform = info.ePlatform === 'A' ? 'Android' : 'iOS'
        return {
          ...info,
          nTotal,
          ePlatform,
          dUpdatedAt
        }
      })
      return finalData
    }
  }

  function onExport () {
    if (startDate && endDate) {
      if (isOpen === 'USER_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports), fileName: 'UserReports.xlsx' }
      } else if (isOpen === 'USERTEAM_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aTeams), fileName: 'UserTeamsReport.xlsx' }
      } else if (isOpen === 'PARTICIPANT_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aParticipants), fileName: 'ParticipantsReport.xlsx' }
      } else if (isOpen === 'WIN_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aWins), fileName: 'WinReport.xlsx' }
      } else if (isOpen === 'WIN_RETURN_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aWinReturn), fileName: 'WinReturnReport.xlsx' }
      } else if (isOpen === 'CREATOR_BONUS_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aCreatorBonus), fileName: 'CreatorBonusReport.xlsx' }
      } else if (isOpen === 'CREATOR_BONUS_RETURN_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aCreatorBonusReturn), fileName: 'CreatorBonusReturnReport.xlsx' }
      } else if (isOpen === 'PLAY_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aPlayed), fileName: 'PlayedReport.xlsx' }
      } else if (isOpen === 'PLAY_RETURN_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aPlayReturn), fileName: 'PlayReturn.xlsx' }
      } else if (isOpen === 'CASHBACK_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aCashback), fileName: 'CashbackReport.xlsx' }
      } else if (isOpen === 'CASHBACK_RETURN_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aCashbackReturn), fileName: 'CashbackReturnReport.xlsx' }
      } else if (isOpen === 'PRIVATE_LEAGUE_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aPrivateLeague), fileName: 'PrivateLeagueReport.xlsx' }
      } else if (isOpen === 'APP_DOWNLOAD_REPORT') {
        exporter.current.props = { ...exporter.current.props, data: processExcelExportData(dateWiseReports?.aAppDownload), fileName: 'AppDownloadReport.xlsx' }
      }
      exporter.current.save()
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }

  return (
    <Fragment>
      {modalMessage && message && (
        <UncontrolledAlert color='primary' className={alertClass(status, close)}>
          {message}
        </UncontrolledAlert>
      )}
      {loading && <Loading />}

      {isOpen === 'USER_REPORT'
        ? <ExcelExport fileName='Reports.xlsx' ref={exporter}>
        <ExcelExportColumnGroup
            title="Users"
            headerCellOptions={{
              textAlign: 'center'
            }}
          >
          <ExcelExportColumn field='nTotalUsers' title='Total Users' />
          <ExcelExportColumn field='nTotalEmailVerifiedUsers' title='Email Verified user' />
          <ExcelExportColumn field='nTotalPhoneVerifiedUsers' title='Mobile No verified user' />
        </ExcelExportColumnGroup>
        <ExcelExportColumnGroup
            title="Registered Users"
            headerCellOptions={{
              textAlign: 'center'
            }}
          >
        <ExcelExportColumn field='totalRegisteredUsers' title='Total Registered Users' />
        <ExcelExportColumn field='platformWiseRegisteredUsers' title='Platform Wise Registered Users' />
        </ExcelExportColumnGroup>

        <ExcelExportColumn field='totalLoggedInUsers' title='Total Logged In Users' />

        <ExcelExportColumnGroup
            title="Deposits"
            headerCellOptions={{
              textAlign: 'center'
            }}
          >
          <ExcelExportColumn field='nTotalDeposits' title='Total Deposits' />
          <ExcelExportColumn field='nTotalPendingDeposits' title='Pending Deposits' />
          <ExcelExportColumn field='nTotalSuccessDeposits' title='Success Deposits' />
          <ExcelExportColumn field='nTotalRejectedDeposits' title='Rejected Deposits' />
          <ExcelExportColumn field='nTotalCancelledDeposits' title='Cancelled Deposits' />
          <ExcelExportColumn field='nTotalWinnings' title='Total Winnings' />
          <ExcelExportColumn field='depositMethods' title='Deposit Methods' />
        </ExcelExportColumnGroup>

        <ExcelExportColumnGroup
            title="Withdrawals"
            headerCellOptions={{
              textAlign: 'center'
            }}
          >
          <ExcelExportColumn field='nTotalWithdrawals' title='Total Withdrawals' />
          <ExcelExportColumn field='successWithdrawals' title='Successful Withdrawals' />
          <ExcelExportColumn field='pendingWithdrawals' title='Pending Withdrawals' />
        </ExcelExportColumnGroup>

        <ExcelExportColumn field='totalUserBonus' title='Total User Bonus' />
        <ExcelExportColumn field='totalBonusExpire' title='Total Bonus Expire' />

        <ExcelExportColumnGroup
            title="TDS"
            headerCellOptions={{
              textAlign: 'center'
            }}
          >
          <ExcelExportColumn field='nTotalTds' title='Total TDS' />
          <ExcelExportColumn field='nTotalPendingTds' title='Pending TDS' />
          <ExcelExportColumn field='nTotalActiveTds' title='Active TDS' />
        </ExcelExportColumnGroup>
        </ExcelExport>
        : ''}
        {(isOpen === 'USERTEAM_REPORT' || isOpen === 'PARTICIPANT_REPORT' || isOpen === 'CREATOR_BONUS_REPORT' || isOpen === 'CREATOR_BONUS_RETURN_REPORT')
          ? <ExcelExport fileName='Reports.xlsx' ref={exporter}>
        <ExcelExportColumn field='eCategory' title='SportsType' />
        <ExcelExportColumn field='nTotal' title='Total' />
        <ExcelExportColumn field='dUpdatedAt' title='Last Updated Time' />
      </ExcelExport>
          : ''}
            {(isOpen === 'WIN_REPORT' || isOpen === 'WIN_RETURN_REPORT' || isOpen === 'PLAY_REPORT' || isOpen === 'PLAY_RETURN_REPORT' || isOpen === 'CASHBACK_REPORT' || isOpen === 'CASHBACK_RETURN_REPORT')
              ? <ExcelExport fileName='Reports.xlsx' ref={exporter}>
          <ExcelExportColumn field='eCategory' title='SportsType' />
          <ExcelExportColumnGroup
            title="Total"
            headerCellOptions={{
              textAlign: 'center'
            }}
          ><ExcelExportColumn field='nTotalCash' title='Total Cash' />
          <ExcelExportColumn field='nTotalBonus' title='Total Bonus' />
          </ExcelExportColumnGroup>
          <ExcelExportColumn field='dUpdatedAt' title='Last Updated Time' />
        </ExcelExport>
              : ''}

        {isOpen === 'PRIVATE_LEAGUE_REPORT'
          ? <ExcelExport fileName='Reports.xlsx' ref={exporter}>
              <ExcelExportColumn field='eCategory' title='SportsType' />
              <ExcelExportColumnGroup
                title="Total"
                headerCellOptions={{
                  textAlign: 'center'
                }}>
              <ExcelExportColumn field='createdTotal' title='Created' />
              <ExcelExportColumn field='completedTotal' title='Completed' />
              <ExcelExportColumn field='cancelledTotal' title='Cancelled' />
          </ExcelExportColumnGroup>
          <ExcelExportColumn field='dUpdatedAt' title='Last Updated Time' />
              </ExcelExport>
          : ''}

          {isOpen === 'APP_DOWNLOAD_REPORT'
            ? <ExcelExport fileName='Reports.xlsx' ref={exporter}>
                <ExcelExportColumn field='ePlatform' title='Platform' />
                <ExcelExportColumn field='nTotal' title='Total' />
                <ExcelExportColumn field='dUpdatedAt' title='Last Updated Time' />
              </ExcelExport>
            : ''}

      <div className='d-flex justify-content-between flex-wrap pr-3 pl-3'>
        <div className='d-flex justify-content-between w-100'>
            <h2 className='title-text-center'>Reports</h2>
            {/* <div className="btn-list mr-3 d-flex align-self-center"> */}
              <img src={excelIcon} alt="excel" onClick={onExport} title="Export" className="header-button" style={{ cursor: 'pointer' }}/>
            {/* </div> */}
        </div>
        <div className='d-flex justify-content-between fdc-480'>
            <Form className='d-flex fdc-480'>
              <FormGroup className='mr-3 mr-0-480'>
                <CustomInput
                  className='mt-1'
                  type="select"
                  name="type"
                  id="type"
                  value={userType}
                  onChange={(event) => setUserTypeFunc(event)}
                >
                  <option value='U'>User</option>
                  {(isOpen === 'PRIVATE_LEAGUE_REPORT' || isOpen === 'CREATOR_BONUS_REPORT' || isOpen === 'CREATOR_BONUS_RETURN_REPORT' || isOpen === 'APP_DOWNLOAD_REPORT') ? '' : <option value='B'>System User</option>}
                </CustomInput>
              </FormGroup>
              <FormGroup>
                <CustomInput
                  className='mt-1'
                  type="select"
                  name="type"
                  id="type"
                  value={isOpen}
                  onChange={(event) => toggle(event)}
                >
                  <option key='USER_REPORT' value='USER_REPORT'>Users Report</option>
                  <option key='USERTEAM_REPORT' value='USERTEAM_REPORT'>Teams Report</option>
                  <option key='PARTICIPANT_REPORT' value='PARTICIPANT_REPORT'>Participants Report</option>
                  <option key='WIN_REPORT' value='WIN_REPORT'>Win Report</option>
                  <option key='WIN_RETURN_REPORT' value='WIN_RETURN_REPORT'>Win Return Report</option>
                  <option key='PRIVATE_LEAGUE_REPORT' value='PRIVATE_LEAGUE_REPORT'>Private League Report</option>
                  <option key='PLAY_REPORT' value='PLAY_REPORT'>Played Report</option>
                  <option key='PLAY_RETURN_REPORT' value='PLAY_RETURN_REPORT'>Play Return Report</option>
                  <option key='CASHBACK_REPORT' value='CASHBACK_REPORT'>Cashback Report</option>
                  <option key='CASHBACK_RETURN_REPORT' value='CASHBACK_RETURN_REPORT'>Cashback Return Report</option>
                  <option key='CREATOR_BONUS_REPORT' value='CREATOR_BONUS_REPORT'>Creator Bonus Report</option>
                  <option key='CREATOR_BONUS_RETURN_REPORT' value='CREATOR_BONUS_RETURN_REPORT'>Creator Bonus Return Report</option>
                  <option key='APP_DOWNLOAD_REPORT' value='APP_DOWNLOAD_REPORT'>App Download Report</option>
                </CustomInput>
              </FormGroup>
            </Form>
            {((Auth && Auth === 'SUPER') || (adminPermission?.REPORT !== 'N')) && <FormGroup>
              <DatePicker
                value={dateRange}
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                onChange={(update) => {
                  setDateRange(update)
                }}
                isClearable={true}
                placeholderText='Select Date Range'
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                customInput={<ExampleCustomInput />}
              >
              </DatePicker>
            </FormGroup>}
        </div>
      </div>

      <main className='main-content d-flex'>
        {isOpen === 'USER_REPORT' && dateWiseReports.length !== 0 && (
          <section className='user-section'>
            <Row>
              <Col md='6' lg='4' className='mb-4'>
                  <div className='table-responsive common-box-leagues'>
                    <h3>Total Users <img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.totalUsers.replace('##', '') : Info.totalUsers.replace('##', 'system')} id='TU'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='TU'>
                        <PopoverBody>{userType === 'U' ? Info.totalUsers.replace('##', '') : Info.totalUsers.replace('##', 'system')}</PopoverBody>
                      </UncontrolledPopover>
                    </h3>
                    {dateWiseReports && dateWiseReports.length !== 0 && dateWiseReports.oTotalUser
                      ? (<table className='table'>
                        <tbody>
                          <tr>
                            <td>Total Users</td>
                            <td>
                              <b>
                                {dateWiseReports.oTotalUser.nTotalUsers || 0}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Email Verified Users</td>
                            <td>
                              <b>
                                {dateWiseReports.oTotalUser.nTotalEmailVerifiedUsers || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Mobile Number Verified Users</td>
                            <td>
                              <b>
                                {dateWiseReports.oTotalUser.nTotalPhoneVerifiedUsers || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='2' className='text-center'>
                              <b>
                                Last Update :{dateWiseReports.oTotalUser.dUpdatedAt ? moment(dateWiseReports.oTotalUser.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                        )
                      : (
                      <Col className='text-center'>
                        <h3>No Data Available</h3>
                      </Col>
                        )}
                  </div>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <Fragment>
                  <div className='table-responsive common-box-leagues'>
                    <h3>Log In Users<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.loggedInUsers.replace('##', '') : Info.loggedInUsers.replace('##', 'system')} id='LU'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='LU'>
                        <PopoverBody>{userType === 'U' ? Info.loggedInUsers.replace('##', '') : Info.loggedInUsers.replace('##', 'system')}</PopoverBody>
                      </UncontrolledPopover>
                    </h3>
                    {dateWiseReports &&
                    dateWiseReports.oLoginUser &&
                    dateWiseReports !== 0
                      ? (
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Total</td>
                            <td>
                              <b>
                                {dateWiseReports.oLoginUser.Total || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='2' className='text-center'>
                              <b>
                                Last Update :{' '}
                                {dateWiseReports.oLoginUser.dUpdatedAt
                                  ? moment(
                                    dateWiseReports.oLoginUser.dUpdatedAt
                                  ).format('DD/MM/YYYY hh:mm A')
                                  : 'No Data Available'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                        )
                      : (
                      <Col className='text-center'>
                        <h3>No Data Available</h3>
                      </Col>
                        )}
                  </div>
                </Fragment>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <Fragment>
                  <div className='table-responsive common-box-leagues'>
                    <h3>Registered Users<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.registeredUsers.replace('##', '') : Info.registeredUsers.replace('##', 'system')} id='RU'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='RU'>
                        <PopoverBody>{userType === 'U' ? Info.registeredUsers.replace('##', '') : Info.registeredUsers.replace('##', 'system')}</PopoverBody>
                      </UncontrolledPopover>
                    </h3>
                    {dateWiseReports &&
                    dateWiseReports !== 0 &&
                    dateWiseReports.oRegisterUser
                      ? (
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Total</td>
                            <td>
                              <b>
                                {dateWiseReports.oRegisterUser.Total || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='2' className='text-center'>
                              <b>
                                Last Update :{' '}
                                {dateWiseReports.oRegisterUser.dUpdatedAt
                                  ? moment(
                                    dateWiseReports.oRegisterUser.dUpdatedAt
                                  ).format('DD/MM/YYYY hh:mm A')
                                  : 'No Data Available'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                        )
                      : (
                      <Col className='text-center'>
                        <h3>No Data Available</h3>
                      </Col>
                        )}
                  </div>
                </Fragment>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='common-box-leagues'>
                  <h3>
                    Platform Wise Registered Users
                  </h3>
                  {dateWiseReports &&
                  dateWiseReports.length !== 0 &&
                  dateWiseReports.oRegisterUser &&
                  dateWiseReports.oRegisterUser.aPlatformWiseUser
                    ? (
                    <div className='table-responsive'>
                      <table className='table'>
                        <tbody>
                          <tr>
                            <th>Platform</th>
                            <th>Value</th>
                          </tr>
                          {dateWiseReports.oRegisterUser.aPlatformWiseUser.map(
                            (platformwiseuser, index) => (
                              <tr key={index}>
                                <td>
                                  {platformwiseuser.eTitle &&
                                  platformwiseuser.eTitle === 'O'
                                    ? 'Other'
                                    : platformwiseuser.eTitle === 'A'
                                      ? 'Android'
                                      : platformwiseuser.eTitle === 'I'
                                        ? 'iOS'
                                        : platformwiseuser.eTitle === 'W'
                                          ? 'Web'
                                          : ''}
                                </td>
                                <td>
                                  {platformwiseuser.nValue
                                    ? platformwiseuser.nValue
                                    : '0'}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                      )
                    : (
                    <Col className='text-center'>
                      <h3>No Data Available</h3>
                    </Col>
                      )}
                </div>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='table-responsive common-box-leagues'>
                  <h3>Bonus Expire<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.bonusExpire.replace('##', '') : Info.bonusExpire.replace('##', 'System')} id='BE'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='BE'>
                      <PopoverBody>{userType === 'U' ? Info.bonusExpire.replace('##', '') : Info.bonusExpire.replace('##', 'System')}</PopoverBody>
                    </UncontrolledPopover>
                  </h3>
                  {dateWiseReports &&
                  dateWiseReports.length !== 0 &&
                  dateWiseReports.oBonusExpire
                    ? (
                    <table className='table'>
                      <tbody>
                        <tr>
                          <td>Total</td>
                          <td>
                            <b>
                              {dateWiseReports.oBonusExpire.nTotal || '0'}
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                      )
                    : (
                    <Col className='text-center'>
                      <h3>No Data Available</h3>
                    </Col>
                      )}
                  {dateWiseReports &&
                    dateWiseReports.length !== 0 &&
                    dateWiseReports.oBonusExpire && (
                      <p className='text-center'>
                        <b>
                          Last Update :{' '}
                          {dateWiseReports.oBonusExpire.dUpdatedAt
                            ? moment(
                              dateWiseReports.oBonusExpire.dUpdatedAt
                            ).format('DD/MM/YYYY hh:mm A')
                            : 'No Data Available'}
                        </b>
                      </p>
                  )}
                </div>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <Fragment>
                  <div className='table-responsive common-box-leagues'>
                    <h3>User Bonus<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.userBonus.replace('##', '') : Info.userBonus.replace('##', 'System')} id='UB'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='UB'>
                        <PopoverBody>{userType === 'U' ? Info.userBonus.replace(/##/g, '') : Info.userBonus.replace('##', 'System')}</PopoverBody>
                      </UncontrolledPopover>
                    </h3>
                    {dateWiseReports &&
                    dateWiseReports !== 0 &&
                    dateWiseReports.oUserBonus
                      ? (
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Total</td>
                            <td>
                              <b>
                                {dateWiseReports.oUserBonus.nTotal || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='2' className='text-center'>
                              <b>
                                Last Update :{' '}
                                {dateWiseReports.oUserBonus.dUpdatedAt
                                  ? moment(
                                    dateWiseReports.oUserBonus.dUpdatedAt
                                  ).format('DD/MM/YYYY hh:mm A')
                                  : 'No Data Available'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                        )
                      : (
                      <Col className='text-center'>
                        <h3>No Data Available</h3>
                      </Col>
                        )}
                  </div>
                </Fragment>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <Fragment>
                  <div className='table-responsive common-box-leagues'>
                    <h3>TDS<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.tds.replace('##', '') : Info.tds.replace('##', 'System')} id='TDS'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='TDS'>
                        <PopoverBody>{userType === 'U' ? Info.tds.replace('##', '') : Info.tds.replace('##', 'System')}</PopoverBody>
                      </UncontrolledPopover>
                    </h3>
                    {dateWiseReports &&
                    dateWiseReports !== 0 &&
                    dateWiseReports.oTds
                      ? (
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Total</td>
                            <td>
                              <b>
                                {dateWiseReports.oTds.nTotalTds || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Total Pending TDS</td>
                            <td>
                              <b>
                                {dateWiseReports.oTds.nTotalPendingTds || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Total Active TDS</td>
                            <td>
                              <b>
                                {dateWiseReports.oTds.nTotalActiveTds || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='2' className='text-center'>
                              <b>
                                Last Update :{' '}
                                {dateWiseReports.oTds.dUpdatedAt
                                  ? moment(
                                    dateWiseReports.oTds.dUpdatedAt
                                  ).format('DD/MM/YYYY hh:mm A')
                                  : 'No Data Available'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                        )
                      : (
                      <Col className='text-center'>
                        <h3>No Data Available</h3>
                      </Col>
                        )}
                  </div>
                </Fragment>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='common-box-leagues'>
                  <h3>Deposit<img className='custom-info' src={infoIcon} title={Info.deposit} id='DEPOSIT'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='DEPOSIT'>
                      <PopoverBody>{userType === 'U' ? Info.deposit.replace('##', '') : Info.deposit.replace('##', 'System')}</PopoverBody>
                    </UncontrolledPopover>
                  </h3>
                  {dateWiseReports &&
                  dateWiseReports.length !== 0 &&
                  dateWiseReports.oDeposit
                    ? (
                    <div className='table-responsive'>
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Total Deposits</td>
                            <td>
                              <b>
                                {dateWiseReports.oDeposit.nTotalDeposits || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Total Winnings</td>
                            <td>
                              <b>
                                {dateWiseReports.oDeposit.nTotalWinnings || '0'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                      )
                    : (
                    <Col className='text-center'>
                      <h3>No Data Available</h3>
                    </Col>
                      )}
                  {dateWiseReports &&
                    dateWiseReports.length !== 0 &&
                    dateWiseReports.oDeposit && dateWiseReports.oDeposit.aDeposits && (
                      <div className='table-responsive'>
                        <h3 className='text-center'>Methods</h3>
                        <table className='table'>
                          <tbody>
                            <tr>
                              <th>Method</th>
                              <th>Value</th>
                            </tr>
                            {dateWiseReports.oDeposit.aDeposits.map(
                              (deposits, index) => (
                                <tr key={deposits._id}>
                                  <td>
                                    {deposits.eTitle || '-'}
                                  </td>
                                  <td>
                                    {deposits.nValue || '0'}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                        <p className='text-center'>
                          <b>
                            Last Update :{' '}
                            {dateWiseReports.oDeposit &&
                            dateWiseReports.oDeposit.dUpdatedAt
                              ? moment(
                                dateWiseReports.oDeposit.dUpdatedAt
                              ).format('DD/MM/YYYY hh:mm A')
                              : 'No Data Available'}
                          </b>
                        </p>
                      </div>
                  )}
                </div>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='common-box-leagues'>
                  <h3>Withdraw<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.withdraw.replace('##', '') : Info.withdraw.replace('##', 'System')} id='WITHDRAW'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='WITHDRAW'>
                      <PopoverBody>{userType === 'U' ? Info.withdraw.replace('##', '') : Info.withdraw.replace('##', 'System')}</PopoverBody>
                    </UncontrolledPopover>
                  </h3>
                  {dateWiseReports &&
                  dateWiseReports !== 0 &&
                  dateWiseReports.oWithdraw
                    ? (
                    <div className='table-responsive'>
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Total Withdrawals</td>
                            <td>
                              <b>
                                {dateWiseReports.oWithdraw.nTotalWithdrawals || '0'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                      )
                    : (
                    <Col className='text-center'>
                      <h3>No Data Available</h3>
                    </Col>
                      )}
                  {dateWiseReports &&
                    dateWiseReports !== 0 &&
                    dateWiseReports.oWithdraw &&
                    dateWiseReports.oWithdraw.aSuccessWithdrawals &&
                    dateWiseReports.oWithdraw.aSuccessWithdrawals.length !==
                      0 && (
                      <div className='table-responsive'>
                        <p className='sub-title'>SuccessFul Withdrawal</p>
                        <table className='table'>
                          <thead>
                            <tr>
                              <th>Method</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dateWiseReports.oWithdraw.aSuccessWithdrawals.map(
                              (successWithdrawals) => (
                                <tr key={successWithdrawals._id}>
                                  <td>
                                    {successWithdrawals.eTitle || '-'}
                                  </td>
                                  <td>
                                    {successWithdrawals.nValue || 0}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                  )}

                  {dateWiseReports &&
                    dateWiseReports !== 0 &&
                    dateWiseReports.oWithdraw &&
                    dateWiseReports.oWithdraw.aPendingWithdrawals &&
                    dateWiseReports.oWithdraw.aPendingWithdrawals.length !==
                      0 && (
                      <div className='table-responsive'>
                        <p className='sub-title'>Pending Withdrawal</p>
                        <table className='table'>
                          <thead>
                            <tr>
                              <th>Method</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dateWiseReports.oWithdraw.aPendingWithdrawals.map(
                              (pendingWithdrawals) => (
                                <tr key={pendingWithdrawals._id}>
                                  <td>
                                    {pendingWithdrawals.eTitle || '-'}
                                  </td>
                                  <td>
                                    {pendingWithdrawals.nValue || '0'}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                        <p colSpan='2' className='text-center'>
                          <b>
                            Last Update :{' '}
                            {dateWiseReports.oWithdraw &&
                            dateWiseReports.oWithdraw.dUpdatedAt
                              ? moment(
                                dateWiseReports.oWithdraw.dUpdatedAt
                              ).format('DD/MM/YYYY hh:mm A')
                              : 'No Data Available'}
                          </b>
                        </p>
                      </div>
                  )}
                </div>
              </Col>
            </Row>
          </section>
        )}
        {isOpen === 'USER_REPORT' && dateWiseReports.length === 0 && (
          <section className='user-section'>
            <Row>
              <Col md='6' lg='4' className='mb-4'>
                <Fragment>
                  <div className='table-responsive common-box-leagues'>
                    <div className='d-flex justify-content-between'>
                      <h3>Total Users <img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.totalUsers.replace('##', '') : Info.totalUsers.replace('##', 'system')} id='TU'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='TU'>
                          <PopoverBody>{userType === 'U' ? Info.totalUsers.replace('##', '') : Info.totalUsers.replace('##', 'system')}</PopoverBody>
                        </UncontrolledPopover>
                      </h3>
                      {permission && <Button
                        color='link'
                        onClick={() => updateGeneralizeReportFunc('TU')}
                      >
                        <img
                          src={refreshIcon}
                          alt='Users'
                          height='20px'
                          width='20px'
                        />
                      </Button>}
                    </div>
                    {TotalUsers
                      ? (
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Total Users</td>
                            <td>
                              <b>
                                {TotalUsers.nTotalUsers || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Email Verified Users</td>
                            <td>
                              <b>
                                {TotalUsers.nTotalEmailVerifiedUsers || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Mobile Number Verified Users</td>
                            <td>
                              <b>
                                {TotalUsers.nTotalPhoneVerifiedUsers || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='2' className='text-center'>
                              <b>
                                Last Update :{' '}
                                {TotalUsers.dUpdatedAt
                                  ? moment(TotalUsers.dUpdatedAt).format(
                                    'DD/MM/YYYY hh:mm A'
                                  )
                                  : 'No Data Available'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                        )
                      : (
                      <Col className='text-center'>
                        <h3>No Data Available</h3>
                      </Col>
                        )}
                    {RegisteredUsers &&
                      RegisteredUsers.aPlatformWiseUser &&
                      RegisteredUsers.length !== 0 && (
                        <div className='table-responsive'>
                          <p className='sub-title'>Platform Wise Registered Users</p>
                          <table className='table'>
                            <tbody>
                              <tr>
                                <th>Platform</th>
                                <th>Value</th>
                              </tr>
                              {RegisteredUsers.aPlatformWiseUser.map(
                                (platformwiseuser, index) => (
                                  <tr key={index}>
                                    <td>
                                      {platformwiseuser.eTitle &&
                                      platformwiseuser.eTitle === 'O'
                                        ? 'Other'
                                        : platformwiseuser.eTitle === 'A'
                                          ? 'Android'
                                          : platformwiseuser.eTitle === 'I'
                                            ? 'iOS'
                                            : platformwiseuser.eTitle === 'W'
                                              ? 'Web'
                                              : ''}
                                    </td>
                                    <td>
                                      {platformwiseuser.nValue
                                        ? platformwiseuser.nValue
                                        : '0'}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                    )}
                  </div>
                </Fragment>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <Fragment>
                  <div className='common-box-leagues'>
                  <div className='table-responsive custom-row'>
                    <div className='d-flex justify-content-between'>
                      <h3>Log In Users<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.loggedInUsers.replace('##', '') : Info.loggedInUsers.replace('##', 'system')} id='LU'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='LU'>
                          <PopoverBody>{userType === 'U' ? Info.loggedInUsers.replace('##', '') : Info.loggedInUsers.replace('##', 'system')}</PopoverBody>
                        </UncontrolledPopover>
                      </h3>
                      {permission && <Button
                        color='link'
                        onClick={() => updateGeneralizeReportFunc('LU')}
                      >
                        <img
                          src={refreshIcon}
                          alt='Users'
                          height='20px'
                          width='20px'
                        />
                      </Button>}
                    </div>
                    {LoginUser && LoginUser !== 0
                      ? (
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Today</td>
                            <td>
                              <b>{LoginUser.nToday || '0'}</b>
                            </td>
                          </tr>
                          <tr>
                            <td>Yesterday</td>
                            <td>
                              <b>
                                {LoginUser.nYesterday || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Last Week</td>
                            <td>
                              <b>
                                {LoginUser.nLastWeek || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Last Month</td>
                            <td>
                              <b>
                                {LoginUser.nLastMonth || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Last Year</td>
                            <td>
                              <b>
                                {LoginUser.nLastYear || '0'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                        )
                      : (
                      <Col className='text-center'>
                        <h3>No Data Available</h3>
                      </Col>
                        )}
                  </div>
                  <div className='text-center'><b>
                    Last Update :{' '}
                    {LoginUser.dUpdatedAt
                      ? moment(LoginUser.dUpdatedAt).format(
                        'DD/MM/YYYY hh:mm A'
                      )
                      : 'No Data Available'}
                    </b>
                  </div>
                </div>
                </Fragment>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <Fragment>
                  <div className='table-responsive common-box-leagues'>
                    <div className='d-flex justify-content-between'>
                      <h3>Registered Users<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.registeredUsers.replace('##', '') : Info.registeredUsers.replace('##', 'system')} id='RU'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='RU'>
                          <PopoverBody>{userType === 'U' ? Info.registeredUsers.replace('##', '') : Info.registeredUsers.replace('##', 'system')}</PopoverBody>
                        </UncontrolledPopover>
                      </h3>
                      {permission && <Button
                        color='link'
                        onClick={() => updateGeneralizeReportFunc('RU')}
                      >
                        <img
                          src={refreshIcon}
                          alt='Users'
                          height='20px'
                          width='20px'
                        />
                      </Button>}
                    </div>
                    {RegisteredUsers && RegisteredUsers.length !== 0
                      ? (
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Today</td>
                            <td>
                              <b>
                                {RegisteredUsers.nToday || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Yesterday</td>
                            <td>
                              <b>
                                {RegisteredUsers.nYesterday || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Last Week</td>
                            <td>
                              <b>
                                {RegisteredUsers.nLastWeek || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Last Month</td>
                            <td>
                              <b>
                                {RegisteredUsers.nLastMonth || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Last Year</td>
                            <td>
                              <b>
                                {RegisteredUsers.nLastYear || '0'}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                        )
                      : (
                      <Col className='text-center'>
                        <h3>No Data Available</h3>
                      </Col>
                        )}
                    <div className='text-center'><b>
                    Last Update :{' '}
                    {RegisteredUsers.dUpdatedAt
                      ? moment(RegisteredUsers.dUpdatedAt).format(
                        'DD/MM/YYYY hh:mm A'
                      )
                      : 'No Data Available'}
                    </b>
                  </div>
                  </div>
                </Fragment>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='table-responsive common-box-leagues'>
                  <div className='d-flex justify-content-between'>
                    <h3>User Bonus<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.userBonus.replace(/##/g, '') : Info.userBonus.replace(/##/g, 'System')} id='UB'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='UB'>
                        <PopoverBody>{userType === 'U' ? Info.userBonus.replace(/##/g, '') : Info.userBonus.replace(/##/g, 'System')}</PopoverBody>
                      </UncontrolledPopover>
                    </h3>
                    {permission && <Button
                      color='link'
                      onClick={() => updateGeneralizeReportFunc('UB')}
                    >
                      <img
                        src={refreshIcon}
                        alt='Users'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </div>
                  {userBonus
                    ? (
                  <table className='table'>
                    <tbody>
                      <tr>
                        <td>Total</td>
                        <td>
                          <b>
                            {userBonus.nTotal || '0'}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Today</td>
                        <td>
                          <b>
                            {userBonus.nToday || '0'}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Yesterday</td>
                        <td>
                          <b>
                            {userBonus.nYesterday || '0'}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Last Week</td>
                        <td>
                          <b>
                            {userBonus.nLastWeek || '0'}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Last Month</td>
                        <td>
                          <b>
                            {userBonus.nLastMonth || '0'}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Last Year</td>
                        <td>
                          <b>
                            {userBonus.nLastYear || '0'}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                      )
                    : (
                  <Col className='text-center'>
                    <h3>No Data Available</h3>
                  </Col>
                      )}
                {userBonus && (
                  <p className='text-center'>
                    <b>
                      Last Update :{' '}
                      {userBonus && userBonus.dUpdatedAt
                        ? moment(userBonus.dUpdatedAt).format(
                          'DD/MM/YYYY hh:mm A'
                        )
                        : 'No Data Available'}
                    </b>
                  </p>
                )}
              </div>
            </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='table-responsive common-box-leagues'>
                  <div className='d-flex justify-content-between'>
                    <h3>Bonus Expire<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.bonusExpire.replace('##', '') : Info.bonusExpire.replace('##', 'System')} id='BE'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='BE'>
                      <PopoverBody>{userType === 'U' ? Info.bonusExpire.replace('##', '') : Info.bonusExpire.replace('##', 'System')}</PopoverBody>
                    </UncontrolledPopover>
                  </h3>
                    {permission && <Button
                      color='link'
                      onClick={() => updateGeneralizeReportFunc('BE')}
                    >
                      <img
                        src={refreshIcon}
                        alt='Users'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </div>
                  {BonusExpire
                    ? (
                    <table className='table'>
                      <tbody>
                        <tr>
                          <td>Total</td>
                          <td>
                            <b>
                              {BonusExpire.nTotal || '0'}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Today</td>
                          <td>
                            <b>
                              {BonusExpire.nToday || '0'}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Yesterday</td>
                          <td>
                            <b>
                              {BonusExpire.nYesterday
                                ? BonusExpire.nYesterday
                                : '0'}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Last Week</td>
                          <td>
                            <b>
                              {BonusExpire.nLastWeek
                                ? BonusExpire.nLastWeek
                                : '0'}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Last Month</td>
                          <td>
                            <b>
                              {BonusExpire.nLastMonth
                                ? BonusExpire.nLastMonth
                                : '0'}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Last Year</td>
                          <td>
                            <b>
                              {BonusExpire.nLastYear
                                ? BonusExpire.nLastYear
                                : '0'}
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                      )
                    : (
                    <Col className='text-center'>
                      <h3>No Data Available</h3>
                    </Col>
                      )}
                  {BonusExpire && (
                    <p className='text-center'>
                      <b>
                        Last Update :{' '}
                        {BonusExpire && BonusExpire.dUpdatedAt
                          ? moment(BonusExpire.dUpdatedAt).format(
                            'DD/MM/YYYY hh:mm A'
                          )
                          : 'No Data Available'}
                      </b>
                    </p>
                  )}
                </div>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='table-responsive common-box-leagues'>
                  <div className='d-flex justify-content-between'>
                    <h3>TDS<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.tds.replace('##', '') : Info.tds.replace('##', 'System')} id='TDS'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='TDS'>
                      <PopoverBody>{userType === 'U' ? Info.tds.replace('##', '') : Info.tds.replace('##', 'System')}</PopoverBody>
                    </UncontrolledPopover>
                  </h3>
                    {permission && <Button
                      color='link'
                      onClick={() => updateGeneralizeReportFunc('TDS')}
                    >
                      <img
                        src={refreshIcon}
                        alt='TDS'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </div>
                  {TDS
                    ? (
                    <table className='table'>
                      <tbody>
                        <tr>
                          <td>Total</td>
                          <td>
                            <b>
                              {TDS.nTotalTds || '0'}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Total Pending TDS</td>
                          <td>
                            <b>
                              {TDS.nTotalPendingTds || '0'}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Total Active TDS</td>
                          <td>
                            <b>
                              {TDS.nTotalActiveTds || '0'}
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                      )
                    : (
                    <Col className='text-center'>
                      <h3>No Data Available</h3>
                    </Col>
                      )}
                  {TDS && (
                    <p className='text-center'>
                      <b>
                        Last Update :{' '}
                        {TDS && TDS.dUpdatedAt
                          ? moment(TDS.dUpdatedAt).format(
                            'DD/MM/YYYY hh:mm A'
                          )
                          : 'No Data Available'}
                      </b>
                    </p>
                  )}
                </div>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='common-box-leagues'>
                  <div className='d-flex justify-content-between'>
                    <h3>Withdraw<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.withdraw.replace('##', '') : Info.withdraw.replace('##', 'System')} id='WITHDRAW'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='WITHDRAW'>
                        <PopoverBody>{userType === 'U' ? Info.withdraw.replace('##', '') : Info.withdraw.replace('##', 'System')}</PopoverBody>
                      </UncontrolledPopover>
                    </h3>
                    {permission && <Button
                      color='link'
                      onClick={() => updateGeneralizeReportFunc('W')}
                    >
                      <img
                        src={refreshIcon}
                        alt='Users'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </div>
                  {Withdraw
                    ? (
                  <div className='table-responsive'>
                    <table className='table'>
                      <tbody>
                        <tr>
                          <td>Total Withdrawals</td>
                          <td>
                            <b>
                              {Withdraw.nTotalWithdrawals || '0'}
                            </b>
                          </td>
                        </tr>
                        <tr>
                          <td>Instant Withdrawals</td>
                          <td>
                            <b>
                              {Withdraw.nInstantWithdrawals || '0'}
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>)
                    : (
                  <Col className='text-center'>
                    <h3>No Data Available</h3>
                  </Col>
                      )}
              {Withdraw &&
                Withdraw.aSuccessWithdrawals &&
                  <div className='table-responsive'>
                    <p className='sub-title'>SuccessFul Withdrawal</p>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>Method</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Withdraw.aSuccessWithdrawals.map(
                          (successWithdrawals) => (
                            <tr key={successWithdrawals._id}>
                              <td>
                                {successWithdrawals.eTitle || '-'}
                              </td>
                              <td>
                                {successWithdrawals.nValue || '0'}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
              }
              {Withdraw &&
                Withdraw.aPendingWithdrawals &&
                  <div className='table-responsive'>
                    <p className='sub-title'>Pending Withdrawal</p>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>Method</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Withdraw.aPendingWithdrawals.map(
                          (pendingWithdrawals, index) => (
                            <tr key={pendingWithdrawals._id}>
                              <td>
                                {pendingWithdrawals.eTitle || '-'}
                              </td>
                              <td>
                                {pendingWithdrawals.nValue || '0'}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                    </div>}
                    <p className='text-center'>
                      <b>
                        Last Update :{' '}
                        {Withdraw && Withdraw.dUpdatedAt
                          ? moment(Withdraw.dUpdatedAt).format(
                            'DD/MM/YYYY hh:mm A'
                          )
                          : 'No Data Available'}
                      </b>
                    </p>
                </div>
              </Col>

              <Col md='6' lg='4' className='mb-4'>
                <div className='common-box-leagues'>
                  <div className='d-flex justify-content-between'>
                    <h3>Deposit<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.deposit.replace('##', '') : Info.deposit.replace('##', 'System')} id='DEPOSIT'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='DEPOSIT'>
                        <PopoverBody>{userType === 'U' ? Info.deposit.replace('##', '') : Info.deposit.replace('##', 'System')}</PopoverBody>
                      </UncontrolledPopover>
                    </h3>
                    {permission && <Button
                      color='link'
                      onClick={() => updateGeneralizeReportFunc('TUT')}
                    >
                      <img
                        src={refreshIcon}
                        alt='Users'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </div>
                  {Deposit
                    ? (
                    <div className='table-responsive'>
                      <table className='table'>
                        <tbody>
                          <tr>
                            <td>Deposits</td>
                            <td>
                              <b>
                                {Deposit.nTotalDeposits || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Winnings</td>
                            <td>
                              <b>
                                {Deposit.nTotalWinnings || '0'}
                              </b>
                            </td>
                          </tr>
                          <tr>
                            <td>Pending Deposits</td>
                            <td><b>{Deposit.nTotalPendingDeposits || 0}</b></td>
                          </tr>
                          <tr>
                            <td>SuccessFul Deposits</td>
                            <td><b>{Deposit.nTotalSuccessDeposits || 0}</b></td>
                          </tr>
                          <tr>
                            <td>Rejected Deposits</td>
                            <td><b>{Deposit.nTotalRejectedDeposits || 0}</b></td>
                          </tr>
                          <tr>
                            <td>Cancelled Deposits</td>
                            <td><b>{Deposit.nTotalCancelledDeposits || 0}</b></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                      )
                    : (
                    <Col className='text-center'>
                      <h3>No Data Available</h3>
                    </Col>
                      )}
                  {Deposit && Deposit.aDeposits && Deposit.aDeposits.length !== 0 && (
                    <div className='table-responsive'>
                      <p className='sub-title'>Methods</p>
                      <table className='table'>
                        <tbody>
                          <tr>
                            <th>Method</th>
                            <th>Value</th>
                          </tr>
                          {Deposit.aDeposits.map((deposits, index) => (
                            <tr key={deposits._id}>
                              <td>{deposits.eTitle || '-'}</td>
                              <td>{deposits.nValue || '0'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <p className='text-center'>
                      <b>
                        Last Update :{' '}
                        {Deposit && Deposit.dUpdatedAt
                          ? moment(Deposit.dUpdatedAt).format(
                            'DD/MM/YYYY hh:mm A'
                          )
                          : 'No Data Available'}
                      </b>
                    </p>
                </div>
              </Col>
            </Row>
          </section>
        )}

        {isOpen === 'USERTEAM_REPORT' && dateWiseReports && previousProps.dateWiseReports !== dateWiseReports && dateWiseReports.length !== 0 && (
            <section className='user-section'>
              <div className='table-responsive'>
                <table className='reports-table'>
                  <tbody>
                    <tr align='center'>
                      <td>Category<img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.userTeams.replace(/##/g, '') : Info.userTeams.replace(/##/g, 'System')} id='USERTEAM'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='USERTEAM'>
                          <PopoverBody>{userType === 'U' ? Info.userTeams.replace(/##/g, '') : Info.userTeams.replace(/##/g, 'System')}</PopoverBody>
                        </UncontrolledPopover>
                      </td>
                      <td>Total</td>
                      <td>Last Update</td>
                    </tr>
                    {dateWiseReports.aTeams && dateWiseReports.aTeams.filter(teamsData => activeSports.includes(teamsData.eCategory)).map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.eCategory}</h3></td>
                      <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </section>
        )}
        {isOpen === 'USERTEAM_REPORT' && dateWiseReports.length === 0
          ? (Teams && Teams.length > 0)
              ? (
            <section className='user-section'>
              <div className='table-responsive'>
                <table className='table'>
                  <tbody>
                    <tr align='center'>
                      <td>Category</td>
                      <td>Total</td>
                      <td>Today</td>
                      <td>Yesterday</td>
                      <td>Last Week</td>
                      <td>Last Month</td>
                      <td>Last Year</td>
                      <td>Last Update</td>
                      <td><img className='custom-info' src={infoIcon} title={userType === 'U' ? Info.userTeams.replace(/##/g, '') : Info.userTeams.replace(/##/g, 'System')} id='USERTEAM'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='USERTEAM'>
                        <PopoverBody>{userType === 'U' ? Info.userTeams.replace(/##/g, '') : Info.userTeams.replace(/##/g, 'System')}</PopoverBody>
                      </UncontrolledPopover>
                    </td>
                    </tr>
                    {Teams.filter(teamsData => activeSports.includes(teamsData.eCategory)).map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.eCategory}</h3></td>
                      <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nToday) ? Number(data.nToday) : Number(data.nToday).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nYesterday) ? Number(data.nYesterday) : Number(data.nYesterday).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nLastWeek) ? Number(data.nLastWeek) : Number(data.nLastWeek).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nLastMonth) ? Number(data.nLastMonth) : Number(data.nLastMonth).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nLastYear) ? Number(data.nLastYear) : Number(data.nLastYear).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                      <td>
                        {permission && <Button
                          color='link'
                          onClick={() =>
                            updateTeamsFunc(data._id, data.eCategory)
                          }
                        >
                          <img
                            src={refreshIcon}
                            alt='Participants'
                            height='20px'
                            width='20px'
                          />
                        </Button>}
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>)
              : <p className='no-data-text'>Data not available</p>
          : ''}

        {isOpen === 'PARTICIPANT_REPORT' && dateWiseReports && dateWiseReports.length !== 0 && (
            <section className='user-section'>
              <div className='table-responsive'>
                <table className='reports-table'>
                  <tbody>
                    <tr align='center'>
                      <td>Category<img className='custom-info' src={infoIcon} title={Info.participants} id='PARTICIPANTS'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='PARTICIPANTS'>
                          <PopoverBody>{Info.participants}</PopoverBody>
                        </UncontrolledPopover>
                      </td>
                      <td>Total</td>
                      <td>Last Update</td>
                    </tr>
                    {dateWiseReports.aParticipants && dateWiseReports.aParticipants.filter(participants => activeSports.includes(participants.eCategory)).map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.eCategory}</h3></td>
                      <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </section>
        )}
        {isOpen === 'PARTICIPANT_REPORT' && dateWiseReports.length === 0
          ? (Participants && Participants.length > 0)
              ? <section className='user-section'>
              <div className='table-responsive'>
                <table className='table'>
                  <tbody>
                    <tr align='center'>
                      <td>Category</td>
                      <td>Total</td>
                      <td>Today</td>
                      <td>Yesterday</td>
                      <td>Last Week</td>
                      <td>Last Month</td>
                      <td>Last Year</td>
                      <td>Last Update</td>
                      <td><img className='custom-info' src={infoIcon} title={Info.participants} id='PARTICIPANTS'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='PARTICIPANTS'>
                        <PopoverBody>{Info.participants}</PopoverBody>
                      </UncontrolledPopover>
                    </td>
                    </tr>
                    {Participants.filter(participantsData => activeSports.includes(participantsData.eCategory)).map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.eCategory}</h3></td>
                      <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nToday) ? Number(data.nToday) : Number(data.nToday).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nYesterday) ? Number(data.nYesterday) : Number(data.nYesterday).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nLastWeek) ? Number(data.nLastWeek) : Number(data.nLastWeek).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nLastMonth) ? Number(data.nLastMonth) : Number(data.nLastMonth).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nLastYear) ? Number(data.nLastYear) : Number(data.nLastYear).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                      <td>
                        {permission && <Button
                          color='link'
                          onClick={() =>
                            updateParticipantsFunc(data._id, data.eCategory)
                          }
                        >
                          <img
                            src={refreshIcon}
                            alt='Participants'
                            height='20px'
                            width='20px'
                          />
                        </Button>}
                      </td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}

        {isOpen === 'WIN_REPORT' && dateWiseReports && dateWiseReports.length !== 0 && (
          <section className='user-section'>
              <div className='table-responsive'>
                <table className='reports-table'>
                  <tbody>
                    <tr align='center'>
                      <td rowSpan='2'>Category<img className='custom-info' src={infoIcon} title={Info.wins} id='WINS'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='WINS'>
                          <PopoverBody>{Info.wins}</PopoverBody>
                        </UncontrolledPopover>
                      </td>
                      <td colSpan='2'>Total</td>
                      <td rowSpan='2'>Last Update</td>
                    </tr>
                    <tr align='center'>
                        <td>Cash</td>
                        <td>Bonus</td>
                      </tr>
                    {dateWiseReports.aWins && dateWiseReports.aWins.filter(win => activeSports.includes(win.eCategory)).map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.eCategory}</h3></td>
                      <td>{Number.isInteger(data?.nTotal?.winCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                      <td>{Number.isInteger(data?.nTotal?.winBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </section>
        )}
        {(isOpen === 'WIN_REPORT' && dateWiseReports.length === 0)
          ? (Wins && Wins.length > 0)
              ? <section className='user-section'>
            <div className='table-responsive'>
              <table className='table'>
                <tbody>
                  <tr>
                    <td rowSpan='2' align='center'>Category</td>
                    <td colSpan='2' align='center'>Total</td>
                    <td colSpan='2' align='center'>Today</td>
                    <td colSpan='2' align='center'>Yesterday</td>
                    <td colSpan='2' align='center'>Week</td>
                    <td colSpan='2' align='center'>Month</td>
                    <td colSpan='2' align='center'>Year</td>
                    <td rowSpan='2' align='center'>Last Update</td>
                    <td rowSpan='2'><img className='custom-info' src={infoIcon} title={Info.wins} id='WINS'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='WINS'>
                      <PopoverBody>{Info.wins}</PopoverBody>
                    </UncontrolledPopover>
                  </td>
                  </tr>
                  <tr align='center'>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                  </tr>
                  {Wins.filter(winsData => activeSports.includes(winsData.eCategory)).map((data, index) => (
                  <tr key={index} align='center'>
                    <td><h3>{data.eCategory}</h3></td>
                    <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTodayCash) ? Number(data.nTodayCash) : Number(data.nTodayCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTodayBonus) ? Number(data.nTodayBonus) : Number(data.nTodayBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYesterCash) ? Number(data.nYesterCash) : Number(data.nYesterCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYesterBonus) ? Number(data.nYesterBonus) : Number(data.nYesterBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nWeekCash) ? Number(data.nWeekCash) : Number(data.nWeekCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nWeekBonus) ? Number(data.nWeekBonus) : Number(data.nWeekBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nMonthCash) ? Number(data.nMonthCash) : Number(data.nMonthCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nMonthBonus) ? Number(data.nMonthBonus) : Number(data.nMonthBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYearCash) ? Number(data.nYearCash) : Number(data.nYearCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYearBonus) ? Number(data.nYearBonus) : Number(data.nYearBonus).toFixed(2)}</td>
                    <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    <td>
                      {permission && <Button
                        color='link'
                        onClick={() =>
                          updateWinsFunc(data._id, data.eCategory)
                        }
                      >
                        <img
                          src={refreshIcon}
                          alt='Participants'
                          height='20px'
                          width='20px'
                        />
                      </Button>}
                    </td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}

          {isOpen === 'WIN_RETURN_REPORT' && dateWiseReports.length !== 0 && (
            <section className='user-section'>
              <div className='table-responsive'>
                <table className='reports-table'>
                  <tbody>
                    <tr align='center'>
                        <td rowSpan='2'>Category<img className='custom-info' src={infoIcon} title={Info.winReturn} id='WIN_RETURN'></img>
                          <UncontrolledPopover trigger="legacy" placement="bottom" target='WIN_RETURN'>
                            <PopoverBody>{Info.winReturn}</PopoverBody>
                          </UncontrolledPopover>
                        </td>
                        <td colSpan='2'>Total</td>
                        <td rowSpan='2'>Last Update</td>
                      </tr>
                      <tr align='center'>
                        <td>Cash</td>
                        <td>Bonus</td>
                      </tr>
                    {dateWiseReports.aWinReturn && dateWiseReports.aWinReturn.filter(winReturn => activeSports.includes(winReturn.eCategory)).map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.eCategory}</h3></td>
                      <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                      <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </section>)}
          {isOpen === 'WIN_RETURN_REPORT' && dateWiseReports.length === 0
            ? (WinReturn && WinReturn.length > 0)
                ? <section className='user-section'>
            <div className='table-responsive'>
              <table className='table'>
                <tbody>
                  <tr>
                    <td rowSpan='2' align='center'>Category</td>
                    <td colSpan='2' align='center'>Total</td>
                    <td colSpan='2' align='center'>Today</td>
                    <td colSpan='2' align='center'>Yesterday</td>
                    <td colSpan='2' align='center'>Week</td>
                    <td colSpan='2' align='center'>Month</td>
                    <td colSpan='2' align='center'>Year</td>
                    <td rowSpan='2' align='center'>Last Update</td>
                    <td rowSpan='2' align='center'><img className='custom-info' src={infoIcon} title={Info.winReturn} id='PLAY'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAY'>
                        <PopoverBody>{Info.winReturn}</PopoverBody>
                      </UncontrolledPopover>
                    </td>
                  </tr>
                  <tr align='center'>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                  </tr>
                  {WinReturn.filter(winReturnData => activeSports.includes(winReturnData.eCategory)).map((data, index) => (
                  <tr key={index} align='center'>
                    <td><h3>{data.eCategory}</h3></td>
                    <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTodayCash) ? Number(data.nTodayCash) : Number(data.nTodayCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTodayBonus) ? Number(data.nTodayBonus) : Number(data.nTodayBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYesterCash) ? Number(data.nYesterCash) : Number(data.nYesterCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYesterBonus) ? Number(data.nYesterBonus) : Number(data.nYesterBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nWeekCash) ? Number(data.nWeekCash) : Number(data.nWeekCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nWeekBonus) ? Number(data.nWeekBonus) : Number(data.nWeekBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nMonthCash) ? Number(data.nMonthCash) : Number(data.nMonthCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nMonthBonus) ? Number(data.nMonthBonus) : Number(data.nMonthBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYearCash) ? Number(data.nYearCash) : Number(data.nYearCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYearBonus) ? Number(data.nYearBonus) : Number(data.nYearBonus).toFixed(2)}</td>
                    <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    <td>{permission && <Button
                    color='link'
                    onClick={() =>
                      updateWinReturnFunc(data._id, data.eCategory)
                    }
                  >
                    <img
                      src={refreshIcon}
                      alt='WinReturn'
                      height='20px'
                      width='20px'
                    />
                  </Button>}</td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </section>
                : <p className='no-data-text'>Data not available</p>
            : ''}

        {isOpen === 'PRIVATE_LEAGUE_REPORT' && dateWiseReports && dateWiseReports.length !== 0 && (
            <section className='user-section'>
              <div className='table-responsive'>
                <table className='table'>
                  <thead>
                    <tr align='center'>
                      <th>Category<img className='custom-info' src={infoIcon} title={Info.privateLeague} id='PRIVATELEAGUE'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='PRIVATELEAGUE'>
                          <PopoverBody>{Info.privateLeague}</PopoverBody>
                        </UncontrolledPopover>
                      </th>
                      <th></th>
                      <th>Total</th>
                      <th>Last Update</th>
                    </tr>
                  </thead>
                  {dateWiseReports.aPrivateLeague &&
                    dateWiseReports.aPrivateLeague.length !== 0 && (
                    dateWiseReports.aPrivateLeague.filter(privateLeagueData => activeSports.includes(privateLeagueData.eCategory)).map((data, index) => (
                  <tbody key={index}>
                    <tr key={index} align='center'>
                      <td rowSpan='3'><h3>{data.eCategory}</h3></td>
                      <td>Created</td>
                      <td>{data.oCreated && Number.isInteger(data.oCreated.nTotal) ? Number(data.oCreated.nTotal) : Number(data.oCreated.nTotal).toFixed(2)}</td>
                      <td>{data.oCreated.dUpdatedAt
                        ? moment(
                          data.oCreated.dUpdatedAt
                        ).format('DD/MM/YYYY hh:mm A')
                        : 'No Data Available'}</td>
                    </tr>
                    <tr align='center'>
                      <td>Completed</td>
                      <td>{data.oCompleted && Number.isInteger(data.oCompleted.nTotal) ? Number(data.oCompleted.nTotal) : Number(data.oCompleted.nTotal).toFixed(2)}</td>
                      <td>{data.oCompleted.dUpdatedAt
                        ? moment(
                          data.oCompleted.dUpdatedAt
                        ).format('DD/MM/YYYY hh:mm A')
                        : 'No Data Available'}</td>
                    </tr>
                    <tr align='center'>
                      <td>Cancelled</td>
                      <td>{data.oCancelled && Number.isInteger(data.oCancelled.nTotal) ? Number(data.oCancelled.nTotal) : Number(data.oCancelled.nTotal).toFixed(2)}</td>
                      <td>{data.oCompleted.dUpdatedAt
                        ? moment(
                          data.oCompleted.dUpdatedAt
                        ).format('DD/MM/YYYY hh:mm A')
                        : 'No Data Available'}</td>
                    </tr>
                  </tbody>)))}
                </table>
              </div>
            </section>
        )}
        {isOpen === 'PRIVATE_LEAGUE_REPORT' && dateWiseReports.length === 0
          ? (PrivateLeague && PrivateLeague.length > 0)
              ? (
          <section className='user-section'>
            <div className='table-responsive'>
              <table className='table'>
                <thead>
                  <tr align='center'>
                    <th align='left'>Category</th>
                    <th></th>
                    <th>Total</th>
                    <th>Today</th>
                    <th>Yesterday</th>
                    <th>Last Week</th>
                    <th>Last Month</th>
                    <th>Last Year</th>
                    <th>Last Update</th>
                    <th><img className='custom-info' src={infoIcon} title={Info.privateLeague} id='PRIVATELEAGUE'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='PRIVATELEAGUE'>
                      <PopoverBody>{Info.privateLeague}</PopoverBody>
                    </UncontrolledPopover>
                  </th>
                  </tr>
                </thead>
                  {PrivateLeague.filter(privateLeagueData => activeSports.includes(privateLeagueData.eCategory)).map((data, index) => (
                <tbody key={index}>
                  <tr key={index} align='center'>
                    <td rowSpan='3'>
                      <h3>{data.eCategory}</h3>
                    </td>
                    <td>Create</td>
                    <td>{data.oCreated && Number.isInteger(data.oCreated.nTotal) ? Number(data.oCreated.nTotal) : Number(data.oCreated.nTotal).toFixed(2)}</td>
                    <td>{data.oCreated && Number.isInteger(data.oCreated.nToday) ? Number(data.oCreated.nToday) : Number(data.oCreated.nToday).toFixed(2)}</td>
                    <td>{data.oCreated && Number.isInteger(data.oCreated.nYesterday) ? Number(data.oCreated.nYesterday) : Number(data.oCreated.nYesterday).toFixed(2)}</td>
                    <td>{data.oCreated && Number.isInteger(data.oCreated.nLastWeek) ? Number(data.oCreated.nLastWeek) : Number(data.oCreated.nLastWeek).toFixed(2)}</td>
                    <td>{data.oCreated && Number.isInteger(data.oCreated.nLastMonth) ? Number(data.oCreated.nLastMonth) : Number(data.oCreated.nLastMonth).toFixed(2)}</td>
                    <td>{data.oCreated && Number.isInteger(data.oCreated.nLastYear) ? Number(data.oCreated.nLastYear) : Number(data.oCreated.nLastYear).toFixed(2)}</td>
                    <td>
                    {data.oCreated.dUpdatedAt
                      ? moment(
                        data.oCreated.dUpdatedAt
                      ).format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}
                    </td>
                    <td>
                      {permission && <Button
                        color='link'
                        onClick={() =>
                          updatePrivateLeagueFunc(data._id, 'CL', data.eCategory)
                        }
                      >
                      <img
                        src={refreshIcon}
                        alt='Participants'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </td>
                  </tr>
                  <tr align='center'>
                    <td>Completed</td>
                    <td>{data.oCompleted && Number.isInteger(data.oCompleted.nTotal) ? Number(data.oCompleted.nTotal) : Number(data.oCompleted.nTotal).toFixed(2)}</td>
                    <td>{data.oCompleted && Number.isInteger(data.oCompleted.nToday) ? Number(data.oCompleted.nToday) : Number(data.oCompleted.nToday).toFixed(2)}</td>
                    <td>{data.oCompleted && Number.isInteger(data.oCompleted.nYesterday) ? Number(data.oCompleted.nYesterday) : Number(data.oCompleted.nYesterday).toFixed(2)}</td>
                    <td>{data.oCompleted && Number.isInteger(data.oCompleted.nLastWeek) ? Number(data.oCompleted.nLastWeek) : Number(data.oCompleted.nLastWeek).toFixed(2)}</td>
                    <td>{data.oCompleted && Number.isInteger(data.oCompleted.nLastMonth) ? Number(data.oCompleted.nLastMonth) : Number(data.oCompleted.nLastMonth).toFixed(2)}</td>
                    <td>{data.oCompleted && Number.isInteger(data.oCompleted.nLastYear) ? Number(data.oCompleted.nLastYear) : Number(data.oCompleted.nLastYear).toFixed(2)}</td>
                    <td>{data.oCompleted.dUpdatedAt
                      ? moment(
                        data.oCompleted.dUpdatedAt
                      ).format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}</td>
                    <td>
                      {permission && <Button
                        color='link'
                        onClick={() =>
                          updatePrivateLeagueFunc(data._id, 'CMPL', data.eCategory)
                        }
                      >
                        <img
                          src={refreshIcon}
                          alt='Participants'
                          height='20px'
                          width='20px'
                        />
                    </Button>}
                  </td>
                  </tr>
                  <tr align='center'>
                    <td>Cancelled</td>
                    <td>{data.oCancelled && Number.isInteger(data.oCancelled.nTotal) ? Number(data.oCancelled.nTotal) : Number(data.oCancelled.nTotal).toFixed(2)}</td>
                    <td>{data.oCancelled && Number.isInteger(data.oCancelled.nToday) ? Number(data.oCancelled.nToday) : Number(data.oCancelled.nToday).toFixed(2)}</td>
                    <td>{data.oCancelled && Number.isInteger(data.oCancelled.nYesterday) ? Number(data.oCancelled.nYesterday) : Number(data.oCancelled.nYesterday).toFixed(2)}</td>
                    <td>{data.oCancelled && Number.isInteger(data.oCancelled.nLastWeek) ? Number(data.oCancelled.nLastWeek) : Number(data.oCancelled.nLastWeek).toFixed(2)}</td>
                    <td>{data.oCancelled && Number.isInteger(data.oCancelled.nLastMonth) ? Number(data.oCancelled.nLastMonth) : Number(data.oCancelled.nLastMonth).toFixed(2)}</td>
                    <td>{data.oCancelled && Number.isInteger(data.oCancelled.nLastYear) ? Number(data.oCancelled.nLastYear) : Number(data.oCancelled.nLastYear).toFixed(2)}</td>
                    <td>{data.oCancelled.dUpdatedAt
                      ? moment(
                        data.oCancelled.dUpdatedAt
                      ).format('DD/MM/YYYY hh:mm A')
                      : 'No Data Available'}</td>
                    <td>
                      {permission && <Button
                        color='link'
                        onClick={() =>
                          updatePrivateLeagueFunc(data._id, 'CNCLL', data.eCategory)
                        }
                      >
                        <img
                          src={refreshIcon}
                          alt='Participants'
                          height='20px'
                          width='20px'
                        />
                    </Button>}
                  </td>
                </tr>
                </tbody>
                  ))}
              </table>
            </div>
          </section>
                )
              : <p className='no-data-text'>Data not available</p>
          : ''}

        {isOpen === 'PLAY_REPORT' && dateWiseReports.length !== 0 && (
          <section className='user-section'>
            <div className='table-responsive'>
              <table className='reports-table'>
                <tbody>
                  <tr align='center'>
                      <td rowSpan='2'>Category<img className='custom-info' src={infoIcon} title={Info.played} id='PLAY'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAY'>
                          <PopoverBody>{Info.played}</PopoverBody>
                        </UncontrolledPopover>
                      </td>
                      <td colSpan='2'>Total</td>
                      <td rowSpan='2'>Last Update</td>
                    </tr>
                    <tr align='center'>
                      <td>Cash</td>
                      <td>Bonus</td>
                    </tr>
                  {dateWiseReports.aPlayed && dateWiseReports.aPlayed.filter(played => activeSports.includes(played.eCategory)).map((data, index) => (
                  <tr key={index} align='center'>
                    <td><h3>{data.eCategory}</h3></td>
                    <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                    <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </section>)}
        {isOpen === 'PLAY_REPORT' && dateWiseReports.length === 0
          ? (played && played.length > 0)
              ? <section className='user-section'>
          <div className='table-responsive'>
            <table className='table'>
              <tbody>
                <tr>
                  <td rowSpan='2' align='center'>Category</td>
                  <td colSpan='2' align='center'>Total</td>
                  <td colSpan='2' align='center'>Today</td>
                  <td colSpan='2' align='center'>Yesterday</td>
                  <td colSpan='2' align='center'>Week</td>
                  <td colSpan='2' align='center'>Month</td>
                  <td colSpan='2' align='center'>Year</td>
                  <td rowSpan='2' align='center'>Last Update</td>
                  <td rowSpan='2' align='center'><img className='custom-info' src={infoIcon} title={Info.played} id='PLAY'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAY'>
                      <PopoverBody>{Info.played}</PopoverBody>
                    </UncontrolledPopover>
                  </td>
                </tr>
                <tr align='center'>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                </tr>
                {played.filter(playedData => activeSports.includes(playedData.eCategory)).map((data, index) => (
                <tr key={index} align='center'>
                  <td><h3>{data.eCategory}</h3></td>
                  <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nTodayCash) ? Number(data.nTodayCash) : Number(data.nTodayCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nTodayBonus) ? Number(data.nTodayBonus) : Number(data.nTodayBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYesterCash) ? Number(data.nYesterCash) : Number(data.nYesterCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYesterBonus) ? Number(data.nYesterBonus) : Number(data.nYesterBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nWeekCash) ? Number(data.nWeekCash) : Number(data.nWeekCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nWeekBonus) ? Number(data.nWeekBonus) : Number(data.nWeekBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nMonthCash) ? Number(data.nMonthCash) : Number(data.nMonthCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nMonthBonus) ? Number(data.nMonthBonus) : Number(data.nMonthBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYearCash) ? Number(data.nYearCash) : Number(data.nYearCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYearBonus) ? Number(data.nYearBonus) : Number(data.nYearBonus).toFixed(2)}</td>
                  <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  <td>{permission && <Button
                  color='link'
                  onClick={() =>
                    updatePlayedFunc(data._id, 'PL', data.eCategory)
                  }
                >
                  <img
                    src={refreshIcon}
                    alt='Participants'
                    height='20px'
                    width='20px'
                  />
                </Button>}</td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}

        {isOpen === 'PLAY_RETURN_REPORT' && dateWiseReports.length !== 0 && (
          <section className='user-section'>
            <div className='table-responsive'>
              <table className='reports-table'>
                <tbody>
                  <tr align='center'>
                      <td rowSpan='2'>Category<img className='custom-info' src={infoIcon} title={Info.playReturn} id='PLAYRETURN'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAYRETURN'>
                          <PopoverBody>{Info.playReturn}</PopoverBody>
                        </UncontrolledPopover>
                      </td>
                      <td colSpan='2'>Total</td>
                      <td rowSpan='2'>Last Update</td>
                    </tr>
                    <tr align='center'>
                      <td>Cash</td>
                      <td>Bonus</td>
                    </tr>
                  {dateWiseReports.aPlayReturn && dateWiseReports.aPlayReturn.filter(playReturnData => activeSports.includes(playReturnData.eCategory)).map((data, index) => (
                  <tr key={index} align='center'>
                    <td><h3>{data.eCategory}</h3></td>
                    <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                    <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </section>)}
        {isOpen === 'PLAY_RETURN_REPORT' && dateWiseReports.length === 0
          ? (playReturn && playReturn.length > 0)
              ? <section className='user-section'>
            <div className='table-responsive'>
              <table className='table'>
                <tbody>
                  <tr>
                    <td rowSpan='2' align='center'>Category</td>
                    <td colSpan='2' align='center'>Total</td>
                    <td colSpan='2' align='center'>Today</td>
                    <td colSpan='2' align='center'>Yesterday</td>
                    <td colSpan='2' align='center'>Week</td>
                    <td colSpan='2' align='center'>Month</td>
                    <td colSpan='2' align='center'>Year</td>
                    <td rowSpan='2' align='center'>Last Update</td>
                    <td rowSpan='2' align='center'><img className='custom-info' src={infoIcon} title={Info.playReturn} id='PLAYRETURN'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAYRETURN'>
                        <PopoverBody>{Info.playReturn}</PopoverBody>
                      </UncontrolledPopover>
                    </td>
                  </tr>
                  <tr align='center'>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                  </tr>
                  {playReturn.filter(playReturnData => activeSports.includes(playReturnData.eCategory)).map((data, index) => (
                  <tr key={index} align='center'>
                    <td><h3>{data.eCategory}</h3></td>
                    <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTodayCash) ? Number(data.nTodayCash) : Number(data.nTodayCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTodayBonus) ? Number(data.nTodayBonus) : Number(data.nTodayBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYesterCash) ? Number(data.nYesterCash) : Number(data.nYesterCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYesterBonus) ? Number(data.nYesterBonus) : Number(data.nYesterBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nWeekCash) ? Number(data.nWeekCash) : Number(data.nWeekCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nWeekBonus) ? Number(data.nWeekBonus) : Number(data.nWeekBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nMonthCash) ? Number(data.nMonthCash) : Number(data.nMonthCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nMonthBonus) ? Number(data.nMonthBonus) : Number(data.nMonthBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYearCash) ? Number(data.nYearCash) : Number(data.nYearCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYearBonus) ? Number(data.nYearBonus) : Number(data.nYearBonus).toFixed(2)}</td>
                    <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    <td>{permission && <Button
                      color='link'
                      onClick={() =>
                        updatePlayReturnFunc(data._id, 'PR', data.eCategory)
                      }
                    >
                      <img
                        src={refreshIcon}
                        alt='Participants'
                        height='20px'
                        width='20px'
                      />
                  </Button>}</td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}

        {isOpen === 'CASHBACK_REPORT' && dateWiseReports.length !== 0 && (
          <section className='user-section'>
            <div className='table-responsive'>
              <table className='reports-table'>
                <tbody>
                  <tr align='center'>
                    <td rowSpan='2'>Category<img className='custom-info' src={infoIcon} title={Info.cashback} id='PLAY'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAY'>
                        <PopoverBody>{Info.cashback}</PopoverBody>
                      </UncontrolledPopover>
                    </td>
                    <td colSpan='2'>Total</td>
                    <td rowSpan='2'>Last Update</td>
                  </tr>
                  <tr align='center'>
                    <td>Cash</td>
                    <td>Bonus</td>
                  </tr>
                  {dateWiseReports.aCashback && dateWiseReports.aCashback.filter(cashbackData => activeSports.includes(cashbackData.eCategory)).map((data, index) => (
                  <tr key={index} align='center'>
                    <td><h3>{data.eCategory}</h3></td>
                    <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                    <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </section>)}

        {isOpen === 'CASHBACK_REPORT' && dateWiseReports.length === 0
          ? (cashback && cashback.length > 0)
              ? <section className='user-section'>
            <div className='table-responsive'>
              <table className='table'>
                <tbody>
                  <tr>
                    <td rowSpan='2' align='center'>Category</td>
                    <td colSpan='2' align='center'>Total</td>
                    <td colSpan='2' align='center'>Today</td>
                    <td colSpan='2' align='center'>Yesterday</td>
                    <td colSpan='2' align='center'>Week</td>
                    <td colSpan='2' align='center'>Month</td>
                    <td colSpan='2' align='center'>Year</td>
                    <td rowSpan='2' align='center'>Last Update</td>
                    <td rowSpan='2' align='center'><img className='custom-info' src={infoIcon} title={Info.cashback} id='CASHBACK'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='CASHBACK'>
                        <PopoverBody>{Info.cashback}</PopoverBody>
                      </UncontrolledPopover>
                    </td>
                  </tr>
                  <tr align='center'>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td>Cash</td>
                    <td>Bonus</td>
                  </tr>
                  {cashback.filter(cashbackData => activeSports.includes(cashbackData.eCategory)).map((data, index) => (
                  <tr key={index} align='center'>
                    <td><h3>{data.eCategory}</h3></td>
                    <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTodayCash) ? Number(data.nTodayCash) : Number(data.nTodayCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTodayBonus) ? Number(data.nTodayBonus) : Number(data.nTodayBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYesterCash) ? Number(data.nYesterCash) : Number(data.nYesterCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYesterBonus) ? Number(data.nYesterBonus) : Number(data.nYesterBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nWeekCash) ? Number(data.nWeekCash) : Number(data.nWeekCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nWeekBonus) ? Number(data.nWeekBonus) : Number(data.nWeekBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nMonthCash) ? Number(data.nMonthCash) : Number(data.nMonthCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nMonthBonus) ? Number(data.nMonthBonus) : Number(data.nMonthBonus).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYearCash) ? Number(data.nYearCash) : Number(data.nYearCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nYearBonus) ? Number(data.nYearBonus) : Number(data.nYearBonus).toFixed(2)}</td>
                    <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    <td>{permission && <Button
                      color='link'
                      onClick={() =>
                        updateCashbackFunc(data._id, 'CC', data.eCategory)
                      }
                    >
                      <img
                        src={refreshIcon}
                        alt='Participants'
                        height='20px'
                        width='20px'
                      />
                    </Button>}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}

        {isOpen === 'CASHBACK_RETURN_REPORT' && dateWiseReports.length !== 0 && (
          <section className='user-section'>
            <div className='table-responsive'>
              <table className='reports-table'>
                <tbody>
                  <tr>
                    <td rowSpan='2' align='center'>Category<img className='custom-info' src={infoIcon} title={Info.cashbackReturn} id='PLAY'></img>
                      <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAY'>
                        <PopoverBody>{Info.cashbackReturn}</PopoverBody>
                      </UncontrolledPopover>
                    </td>
                    <td colSpan='2' align='center'>Total</td>
                    <td rowSpan='2' align='center'>Last Update</td>
                  </tr>
                  <tr align='center'>
                    <td>Cash</td>
                    <td>Bonus</td>
                    <td></td>
                  </tr>
                  {dateWiseReports.aCashbackReturn && dateWiseReports.aCashbackReturn.filter(cashbackReturnData => activeSports.includes(cashbackReturnData.eCategory)).map((data, index) => (
                  <tr key={index} align='center'>
                    <td><h3>{data.eCategory}</h3>
                    </td>
                    <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                    <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                    <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </section>)}
        {isOpen === 'CASHBACK_RETURN_REPORT' && dateWiseReports.length === 0
          ? (cashbackReturn && cashbackReturn.length > 0)
              ? <section className='user-section'>
          <div className='table-responsive'>
            <table className='table'>
              <tbody>
                <tr>
                  <td rowSpan='2' align='center'>Category</td>
                  <td colSpan='2' align='center'>Total</td>
                  <td colSpan='2' align='center'>Today</td>
                  <td colSpan='2' align='center'>Yesterday</td>
                  <td colSpan='2' align='center'>Week</td>
                  <td colSpan='2' align='center'>Month</td>
                  <td colSpan='2' align='center'>Year</td>
                  <td rowSpan='2' align='center'>Last Update</td>
                  <td rowSpan='2' align='center'><img className='custom-info' src={infoIcon} title={Info.cashbackReturn} id='CASHBACKRETURN'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='CASHBACKRETURN'>
                      <PopoverBody>{Info.cashbackReturn}</PopoverBody>
                    </UncontrolledPopover>
                  </td>                </tr>
                <tr align='center'>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                  <td>Cash</td>
                  <td>Bonus</td>
                </tr>
                {cashbackReturn.filter(cashbackReturnData => activeSports.includes(cashbackReturnData.eCategory)).map((data, index) => (
                <tr key={index} align='center'>
                  <td><h3>{data.eCategory}</h3></td>
                  <td>{Number.isInteger(data.nTotalCash) ? Number(data.nTotalCash) : Number(data.nTotalCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nTotalBonus) ? Number(data.nTotalBonus) : Number(data.nTotalBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nTodayCash) ? Number(data.nTodayCash) : Number(data.nTodayCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nTodayBonus) ? Number(data.nTodayBonus) : Number(data.nTodayBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYesterCash) ? Number(data.nYesterCash) : Number(data.nYesterCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYesterBonus) ? Number(data.nYesterBonus) : Number(data.nYesterBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nWeekCash) ? Number(data.nWeekCash) : Number(data.nWeekCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nWeekBonus) ? Number(data.nWeekBonus) : Number(data.nWeekBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nMonthCash) ? Number(data.nMonthCash) : Number(data.nMonthCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nMonthBonus) ? Number(data.nMonthBonus) : Number(data.nMonthBonus).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYearCash) ? Number(data.nYearCash) : Number(data.nYearCash).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYearBonus) ? Number(data.nYearBonus) : Number(data.nYearBonus).toFixed(2)}</td>
                  <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  <td>
                    {permission && <Button
                    color='link'
                      onClick={() =>
                        updateCashbackReturnFunc(data._id, 'CR', data.eCategory)
                      }
                    >
                      <img
                        src={refreshIcon}
                        alt='Participants'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}

        {isOpen === 'CREATOR_BONUS_REPORT' && dateWiseReports && dateWiseReports.length !== 0 && (
            <section className='user-section'>
              <div className='table-responsive'>
                <table className='reports-table'>
                  <tbody>
                    <tr align='center'>
                      <td>Category<img className='custom-info' src={infoIcon} title={Info.creatorBonus} id='PLAY'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAY'>
                          <PopoverBody>{Info.creatorBonus}</PopoverBody>
                        </UncontrolledPopover>
                      </td>
                      <td>Total</td>
                      <td>Last Update</td>
                    </tr>
                    {dateWiseReports.aCreatorBonus && dateWiseReports.aCreatorBonus.filter(creatorBonus => activeSports.includes(creatorBonus.eCategory)).map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.eCategory}</h3></td>
                      <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </section>
        )}
        {isOpen === 'CREATOR_BONUS_REPORT' && dateWiseReports.length === 0
          ? (creatorBonus && creatorBonus.length > 0)
              ? <section className='user-section'>
          <div className='table-responsive'>
            <table className='table'>
              <tbody>
                <tr align='center'>
                  <td>Category</td>
                  <td>Total</td>
                  <td>Today</td>
                  <td>Yesterday</td>
                  <td>Last Week</td>
                  <td>Last Month</td>
                  <td>Last Year</td>
                  <td>Last Update</td>
                  <td align='center'><img className='custom-info' src={infoIcon} title={Info.creatorBonus} id='CREATORBONUS'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='CREATORBONUS'>
                      <PopoverBody>{Info.creatorBonus}</PopoverBody>
                    </UncontrolledPopover>
                  </td>                 </tr>
                {creatorBonus.filter(creatorBonusData => activeSports.includes(creatorBonusData.eCategory)).map((data, index) => (
                <tr key={index} align='center'>
                  <td><h3>{data.eCategory}</h3></td>
                  <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nToday) ? Number(data.nToday) : Number(data.nToday).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYesterday) ? Number(data.nYesterday) : Number(data.nYesterday).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastWeek) ? Number(data.nLastWeek) : Number(data.nLastWeek).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastMonth) ? Number(data.nLastMonth) : Number(data.nLastMonth).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastYear) ? Number(data.nLastYear) : Number(data.nLastYear).toFixed(2)}</td>
                  <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  <td>
                    {permission && <Button
                      color='link'
                      onClick={() =>
                        updateCreatorBonusFunc(data._id, 'CB', data.eCategory)
                      }
                    >
                      <img
                        src={refreshIcon}
                        alt='Participants'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}
          {isOpen === 'CREATOR_BONUS_RETURN_REPORT' && dateWiseReports && dateWiseReports.length !== 0 && (
            <section className='user-section'>
              <div className='table-responsive'>
                <table className='reports-table'>
                  <tbody>
                    <tr align='center'>
                      <td>Category<img className='custom-info' src={infoIcon} title={Info.creatorBonusReturn} id='PLAY'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAY'>
                          <PopoverBody>{Info.creatorBonusReturn}</PopoverBody>
                        </UncontrolledPopover>
                      </td>
                      <td>Total</td>
                      <td>Last Update</td>
                    </tr>
                    {dateWiseReports.aCreatorBonusReturn && dateWiseReports.aCreatorBonusReturn.filter(creatorBonusReturn => activeSports.includes(creatorBonusReturn.eCategory)).map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.eCategory}</h3></td>
                      <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        {isOpen === 'CREATOR_BONUS_RETURN_REPORT' && dateWiseReports.length === 0
          ? (creatorBonusReturn && creatorBonusReturn.length > 0)
              ? <section className='user-section'>
          <div className='table-responsive'>
            <table className='table'>
              <tbody>
                <tr align='center'>
                  <td>Category</td>
                  <td>Total</td>
                  <td>Today</td>
                  <td>Yesterday</td>
                  <td>Last Week</td>
                  <td>Last Month</td>
                  <td>Last Year</td>
                  <td>Last Update</td>
                  <td align='center'><img className='custom-info' src={infoIcon} title={Info.creatorBonusReturn} id='CREATORBONUSRETURN'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='CREATORBONUSRETURN'>
                      <PopoverBody>{Info.creatorBonusReturn}</PopoverBody>
                    </UncontrolledPopover>
                  </td>                 </tr>
                {creatorBonusReturn.filter(creatorBonusReturnData => activeSports.includes(creatorBonusReturnData.eCategory)).map((data, index) => (
                <tr key={index} align='center'>
                  <td><h3>{data.eCategory}</h3></td>
                  <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nToday) ? Number(data.nToday) : Number(data.nToday).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYesterday) ? Number(data.nYesterday) : Number(data.nYesterday).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastWeek) ? Number(data.nLastWeek) : Number(data.nLastWeek).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastMonth) ? Number(data.nLastMonth) : Number(data.nLastMonth).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastYear) ? Number(data.nLastYear) : Number(data.nLastYear).toFixed(2)}</td>
                  <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  <td>
                    {permission && <Button
                      color='link'
                      onClick={() =>
                        updateCreatorBonusReturnFunc(data._id, 'CBR', data.eCategory)
                      }
                    >
                      <img
                        src={refreshIcon}
                        alt='Creator Bonus Return'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}

          {isOpen === 'APP_DOWNLOAD_REPORT' && dateWiseReports && dateWiseReports.length !== 0 && (
            <section className='user-section'>
              <div className='table-responsive'>
                <table className='reports-table'>
                  <tbody>
                    <tr align='center'>
                      <td>Category<img className='custom-info' src={infoIcon} title={Info.appDownload} id='PLAY'></img>
                        <UncontrolledPopover trigger="legacy" placement="bottom" target='PLAY'>
                          <PopoverBody>{Info.appDownload}</PopoverBody>
                        </UncontrolledPopover>
                      </td>
                      <td>Total</td>
                      <td>Last Update</td>
                    </tr>
                    {dateWiseReports.aAppDownload && dateWiseReports.aAppDownload.map((data, index) => (
                    <tr key={index} align='center'>
                      <td><h3>{data.ePlatform && data.ePlatform === 'A' ? 'Android' : 'iOS'}</h3></td>
                      <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                      <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                    </tr>))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        {isOpen === 'APP_DOWNLOAD_REPORT' && dateWiseReports.length === 0
          ? (appDownloadReturn && appDownloadReturn.length > 0)
              ? <section className='user-section'>
          <div className='table-responsive'>
            <table className='table'>
              <tbody>
                <tr align='center'>
                  <td>Platform</td>
                  <td>Total</td>
                  <td>Today</td>
                  <td>Yesterday</td>
                  <td>Last Week</td>
                  <td>Last Month</td>
                  <td>Last Year</td>
                  <td>Last Update</td>
                  <td align='center'><img className='custom-info' src={infoIcon} title={Info.appDownload} id='CREATORBONUSRETURN'></img>
                    <UncontrolledPopover trigger="legacy" placement="bottom" target='CREATORBONUSRETURN'>
                      <PopoverBody>{Info.appDownload}</PopoverBody>
                    </UncontrolledPopover>
                  </td>
                </tr>
                {appDownloadReturn.map((data, index) => (
                <tr key={index} align='center'>
                  <td><h3>{data.ePlatform && data.ePlatform === 'A' ? 'Android' : 'iOS'}</h3></td>
                  <td>{Number.isInteger(data.nTotal) ? Number(data.nTotal) : Number(data.nTotal).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nToday) ? Number(data.nToday) : Number(data.nToday).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nYesterday) ? Number(data.nYesterday) : Number(data.nYesterday).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastWeek) ? Number(data.nLastWeek) : Number(data.nLastWeek).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastMonth) ? Number(data.nLastMonth) : Number(data.nLastMonth).toFixed(2)}</td>
                  <td>{Number.isInteger(data.nLastYear) ? Number(data.nLastYear) : Number(data.nLastYear).toFixed(2)}</td>
                  <td>{data.dUpdatedAt ? moment(data.dUpdatedAt).format('DD/MM/YYYY hh:mm A') : 'No Data Available'}</td>
                  <td>
                    {permission && <Button
                      color='link'
                      onClick={() =>
                        updateAppDownloadFunc(data._id, 'AD', data.ePlatform)
                      }
                    >
                      <img
                        src={refreshIcon}
                        alt='Creator Bonus Return'
                        height='20px'
                        width='20px'
                      />
                    </Button>}
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </section>
              : <p className='no-data-text'>Data not available</p>
          : ''}
      </main>
    </Fragment>
  )
}

AllReports.propTypes = {
  location: PropTypes.object,
  onClick: PropTypes.func,
  value: PropTypes.string
}

export default AllReports
