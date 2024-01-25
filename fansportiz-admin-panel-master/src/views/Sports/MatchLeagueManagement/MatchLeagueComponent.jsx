import React, {
  useState, Fragment, useEffect, useRef, forwardRef, useImperativeHandle
} from 'react'
import {
  UncontrolledAlert, Badge, Button, Modal, ModalBody, Col, Row, CustomInput, ModalHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledPopover, PopoverBody
} from 'reactstrap'
import { useSelector, connect, useDispatch } from 'react-redux'
import qs from 'query-string'
import { Link, useHistory } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../../components/SkeletonTable'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { getUrl } from '../../../actions/url'
import { generatePdf } from '../../../actions/match'
import { getUserDetails } from '../../../actions/users'
import PaginationComponent from '../../../components/PaginationComponent'
import PropTypes from 'prop-types'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'
import more from '../../../assets/images/arrow_drop_down.svg'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { getMatchLeagueReport } from '../../../actions/matchleague'
import infoIcon from '../../../assets/images/info2.svg'
import moment from 'moment'

const MatchLeagueComponent = forwardRef((props, ref) => {
  const {
    match, List, getList, flag, cancelLeague, matchStatus, getMatchDetailsFunc, leagueCountFunc, leagueCount, systemBotsLogs, systemTeams, pointCalculateFlag, rankCalculateFlag, prizeCalculateFlag, winPrizeCalculateFlag, settingList, getSettingList
  } = props

  const exporter = useRef(null)
  const history = useHistory()
  const dispatch = useDispatch('')
  const [fullList, setFullList] = useState([])
  const [start, setStart] = useState(0)
  const [leagueCreatorInfo, setLeagueCreatorInfo] = useState([])
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [matchLeagueId, setMatchLeagueId] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'dsc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', '_id')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [leagueType, setLeagueType] = useQueryState('leagueType', '')
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [url, setUrl] = useState('')
  const [totalLeagueCount, setTotalLeagueCount] = useState(0)
  const [modalForPublic, setModalForPublic] = useState(false)
  const [leagueName, setLeagueName] = useState('')
  const [prizeBreakup, setPrizeBreakup] = useState([])
  const [isPoolLeague, setIsPoolLeague] = useState(false)
  const [tdsPercentage, setTdsPercentage] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [settingListTDS, setSettingListTDS] = useState(0)
  const [cancelledPublicLeagueCount, setCancelledPublicLeagueCount] = useState(0)
  const [cancelledPrivateLeagueCount, setCancelledPrivateLeagueCount] = useState(0)
  const [totalWinner, setTotalWinner] = useState(0)
  const [winDistAt, setWinDistAt] = useState('')
  const searchProp = props.search
  const shareCode = useRef('')
  const adminCommission = useRef('')
  const creatorCommission = useRef('')
  const userId = useRef('')

  const matchLeagueReport = useSelector(state => state.matchleague.matchLeagueReport)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.match.resStatus)
  const resMessage = useSelector(state => state.match.resMessage)
  const ResStatus = useSelector(state => state.matchplayer.resStatus)
  const ResMessage = useSelector(state => state.matchplayer.resMessage)
  const mlResStatus = useSelector(state => state.matchleague.resStatus)
  const mlResMessage = useSelector(state => state.matchleague.resMessage)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const usersDetails = useSelector(state => state.users.usersDetails)
  const matchDetails = useSelector(state => state.match.matchDetails)
  const previousProps = useRef({
    start, offset, List, resMessage, resStatus, mlResStatus, mlResMessage, ResMessage, ResStatus, leagueType, usersDetails, prizeBreakup, matchLeagueReport
  }).current

  const [modalMessage, setModalMessage] = useState(false)
  const [modalMessage2, setModalMessage2] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleMessage = () => setModalMessage2(!modalMessage2)
  const toggleModal = () => setModalOpen(!isModalOpen)
  const togglePublicModal = () => setModalForPublic(!modalForPublic)
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    let page = 1
    let limit = offset
    let order = 'dsc'
    let type = ''
    let search = ''
    const obj = qs.parse(props.location.search)
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} users`)
      }
      if (obj.order) {
        order = obj.order
        setOrder(order)
      }
      if (obj.leagueType) {
        type = obj.leagueType
        setLeagueType(type)
      }
      if (obj.search) {
        search = obj.search
        setSearch(search)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, leagueType, false)
    setLoading(true)
    dispatch(getUrl('media'))
    getSettingList(0, 20, 'sTitle', 'asd', '', token)
  }, [])

  useEffect(() => {
    if (settingList) {
      settingList?.results?.map((item) => {
        if (item.sKey === 'TDS') {
          setTdsPercentage(item.nMax)
        }
        return item
      })
    }
  }, [settingList])

  useEffect(() => {
    getUrlLink && setUrl(getUrlLink)
  }, [getUrlLink])

  useEffect(() => {
    if (leagueCount?.length !== 0) {
      setTotalLeagueCount(leagueCount?.nJoinedUsers)
      setCancelledPublicLeagueCount(leagueCount?.nCancelledPublicLeagueCount)
      setCancelledPrivateLeagueCount(leagueCount?.nCancelledPrivateLeagueCount)
      setTotalWinner(leagueCount?.nTotalWinner)
    }
  }, [leagueCount])

  useEffect(() => {
    if (matchDetails) {
      setWinDistAt(matchDetails.dWinDistAt)
    }
  }, [matchDetails])

  useEffect(() => {
    if (matchStatus) {
      if (!winPrizeCalculateFlag) {
        getList(start, offset, sort, order, search, leagueType, false)
        // leagueCountFunc(matchStatus)
        getMatchDetailsFunc()
      }
    }
  }, [winPrizeCalculateFlag])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        if (List.results) {
          const userArrLength = List.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List.results ? List.results : [])
        setIndex(activePageNo)
        setTotal(List.total ? List.total : 0)
        setLoading(false)
      }
    }
    if (previousProps.matchLeagueReport !== matchLeagueReport) {
      if (matchLeagueReport?.results) {
        setFullList(matchLeagueReport?.results || [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(matchLeagueReport?.results || []),
          fileName: 'MatchLeagues.xlsx'
        }
        exporter.current.save()
        setLoading(false)
      }
    }
    return () => {
      previousProps.List = List
      previousProps.matchLeagueReport = matchLeagueReport
    }
  }, [List, matchLeagueReport])

  useEffect(() => {
    if (previousProps.leagueType !== leagueType) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, leagueType, false)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.leagueType = leagueType
    }
  }, [leagueType])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (usersDetails && previousProps.usersDetails !== usersDetails) {
      setLeagueCreatorInfo(usersDetails)
      setModalOpen(true)
    }
    return () => {
      previousProps.usersDetails = usersDetails
    }
  }, [usersDetails])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        MatchLeagueManagement: props.location.search
      }
      : data.MatchLeagueManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          if (!pointCalculateFlag && !rankCalculateFlag && !prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList(startFrom, limit, sort, order, search, leagueType, false)
          }
          // getMatchDetailsFunc()
          // leagueCountFunc(matchStatus)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
      // previousProps.resStatus = resStatus
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.mlResMessage !== mlResMessage) {
      if (mlResMessage) {
        setMessage(mlResMessage)
        setStatus(mlResStatus)
        setModalMessage(true)
        if (mlResStatus) {
          const startFrom = 0
          const limit = offset
          if (!pointCalculateFlag && !rankCalculateFlag && !prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList(startFrom, limit, sort, order, search, leagueType, false)
          }
          // getMatchDetailsFunc()
          // leagueCountFunc(matchStatus)
          setPageNo(1)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.mlResMessage = mlResMessage
      previousProps.mlResStatus = mlResStatus
    }
  }, [mlResStatus, mlResMessage])

  useEffect(() => {
    if (previousProps.ResMessage !== ResMessage) {
      if (ResMessage) {
        setMessage(ResMessage)
        setStatus(ResMessage)
        setModalMessage(true)
        if (ResStatus) {
          const startFrom = 0
          const limit = offset
          if (!pointCalculateFlag && !rankCalculateFlag && !prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList(startFrom, limit, sort, order, search, leagueType)
          }
          // getMatchDetailsFunc()
          // leagueCountFunc(matchStatus)
          setPageNo(1)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.ResMessage = ResMessage
      // previousProps.ResStatus = ResStatus
    }
  }, [ResStatus, ResMessage])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, leagueType, false)
      leagueCountFunc(matchStatus)
      setSearch(searchProp.trim())
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchProp = searchProp
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  function onRefresh () {
    const startFrom = 0
    const limit = offset
    getList(startFrom, limit, sort, order, search, leagueType, false)
    getMatchDetailsFunc()
    leagueCountFunc(matchStatus)
    setPageNo(1)
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onRefresh,
    onExport
  }))

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, search, leagueType, false)
      leagueCountFunc(matchStatus)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function cancel () {
    if (matchLeagueId) {
      cancelLeague(matchLeagueId)
      toggleMessage()
      setLoading(true)
    }
  }

  // dispatch action to open/generate fair play for given match league
  function generatePDF (data, id) {
    if (data) {
      window.open(`${url}${data}`)
    } else if (!data) {
      dispatch(generatePdf('MATCH_LEAGUE', id, token))
    } else {
      setMessage('Link is not available')
    }
  }

  function onFiltering (event) {
    setLeagueType(event.target.value)
    const startFrom = 0
    const limit = offset
    getList(startFrom, limit, sort, order, search, leagueType, false)
    getMatchDetailsFunc()
    leagueCountFunc(matchStatus)
    setPageNo(1)
    setLoading(true)
  }

  // dispatch action to get users and private league creator details
  function privateLeagueCreatorDetails (data) {
    dispatch(getUserDetails(data.iUserId, token))
    setPrizeBreakup(data.aLeaguePrize)
    shareCode.current = data?.sShareCode
    adminCommission.current = data.nAdminCommission
    creatorCommission.current = data.nCreatorCommission
    userId.current = data.iUserId
  }

  function setPublicPrizeBreakupFunc (aLeaguePrize, league, poolPrize) {
    setPrizeBreakup(aLeaguePrize)
    setLeagueName(league)
    setIsPoolLeague(poolPrize)
    setModalForPublic(true)
  }

  const processExcelExportData = (data) =>
    data.map((matchLeague, index2) => {
      const sName = matchLeague.sName || '--'
      const leagueType = matchLeague.bPrivateLeague ? 'Private' : 'Public'
      const leagueStatus = matchLeague.bCancelled ? 'Yes' : 'No'
      const entry = (matchLeague.nMin ? matchLeague.nMin : '0') + '-' + (matchLeague.nMax ? matchLeague.nMax : '0')
      const nJoined = matchLeague.nJoined || 0
      const nPrice = matchLeague.nPrice || 0
      const nTotalPayout = matchLeague.nTotalPayout || 0
      const nWinnersCount = matchLeague.nWinnersCount || 0
      const bPoolPrize = matchLeague.bPoolPrize ? 'Yes' : 'No'
      const nBonusUtil = matchLeague.nBonusUtil || '--'
      const nJoinedRealUsers = matchLeague.nJoinedRealUsers || 0
      const botUser = matchLeague.nJoined - matchLeague.nJoinedRealUsers
      const TDS = matchLeague.nTotalTdsAmount || 0
      const totalCollection = matchLeague.nPrice * matchLeague.nJoined
      const nRealCashCollection = totalCollection - matchLeague.nTotalBonusUsed - matchLeague.nBotUsersMoney - matchLeague.nBotUsersBonus - matchLeague.nTotalPromoDiscount
      const userCashWinning = matchLeague.nRealUserWinningCash || 0
      const userBonusWinning = matchLeague.nRealUserWinningBonus || 0
      const botCashWinning = matchLeague.nBotWinningCash || 0
      const botBonusWinning = matchLeague.nBotWinningBonus || 0
      const totalWinningProvided = matchLeague.nRealUserWinningCash + matchLeague.nRealUserWinningBonus + matchLeague.nBotWinningCash + matchLeague.nBotWinningBonus
      const botUserWinning = matchLeague.nBotWinningCash + matchLeague.nBotWinningBonus
      const nBotUsersMoney = matchLeague.nBotUsersMoney || 0
      const nBotUsersBonus = matchLeague.nBotUsersBonus || 0
      const bonusUsed = matchLeague.nTotalBonusUsed || 0
      const nTotalPromoDiscount = matchLeague.nTotalPromoDiscount || 0
      const totalGrossProfit = nRealCashCollection - (matchLeague.nRealUserWinningCash + matchLeague.nRealUserWinningBonus)
      const grossProfit = (totalGrossProfit && nRealCashCollection) ? ((totalGrossProfit / nRealCashCollection) * 100).toFixed(2) : 0
      const cashbackCash = matchLeague.nTotalCashbackCash || 0
      const cashbackBonus = matchLeague.nTotalCashbackBonus || 0
      const netProfit = (totalGrossProfit - (cashbackCash + cashbackBonus)) || 0
      const netProfitPercent = (nRealCashCollection * 100 !== 0) ? ((netProfit / nRealCashCollection) * 100).toFixed(2) : 0
      const nCreatorCommission = matchLeague.nCreatorCommission || '--'
      // const features = []
      // if (matchLeague.bAutoCreate) {
      //   features.push('Auto Create')
      // }
      // if (matchLeague.bConfirmLeague) {
      //   features.push('Confirm League')
      // }
      // if (matchLeague.bMultipleEntry) {
      //   features.push('Multiple Entry')
      // }
      // if (matchLeague.nBonusUtil) {
      //   features.push('Bonus Util')
      // }
      // if (matchLeague.bUnlimitedJoin) {
      //   features.push('Unlimited Join')
      // }
      // const leagueFeatures = (features?.length !== 0) ? features.map(data => data).toString() : '--'
      return {
        ...matchLeague,
        sName,
        leagueType,
        leagueStatus,
        entry,
        nJoined,
        nJoinedRealUsers,
        nPrice,
        nTotalPayout,
        nWinnersCount,
        bPoolPrize,
        // leagueFeatures,
        nBonusUtil,
        index: index2 + 1,
        botUser,
        TDS,
        totalCollection,
        nRealCashCollection,
        userCashWinning,
        userBonusWinning,
        botCashWinning,
        botBonusWinning,
        totalWinningProvided,
        botUserWinning,
        nBotUsersMoney,
        nBotUsersBonus,
        bonusUsed,
        nTotalPromoDiscount,
        totalGrossProfit,
        grossProfit,
        netProfit,
        netProfitPercent,
        cashbackCash,
        cashbackBonus,
        nCreatorCommission
      }
    })

  async function onExport () {
    dispatch(getMatchLeagueReport(match.params.id, token))
    setLoading(true)
  }

  return (
    <Fragment>
      <div className="table-responsive">
        {
          modalMessage && message && (
            <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        <ExcelExport data={fullList} fileName={`${matchDetails?.sName} Match Reports - (${moment(matchDetails?.dStartDate).format('MMMM Do YYYY, h-mm-ss a')}).xlsx`} ref={exporter}>
          <ExcelExportColumn field='index' title='Sr No.' />
          <ExcelExportColumn field='sName' title='League Name' />
          <ExcelExportColumn field='leagueType' title='League Type' />
          <ExcelExportColumn field='leagueStatus' title='Cancelled League' />
          <ExcelExportColumn field='entry' title='Total Spot(Min - Max)' />
          <ExcelExportColumn field='nJoined' title='Total Joined Users' />
          <ExcelExportColumn field='nJoinedRealUsers' title='Total Real Users' />
          <ExcelExportColumn field='botUser' title='Total Bot Users' />
          <ExcelExportColumn field='nWinnersCount' title='Winners Count' />
          <ExcelExportColumn field='nPrice' title='Entry Fees' />
          <ExcelExportColumn field='TDS' title={`TDS (@ ${tdsPercentage}% Applicable on above Rs.10000 Winning Prize)`} />
          <ExcelExportColumn field='totalCollection' title='Total Collection (Cash+Bonus+Promo Code)' />
          <ExcelExportColumn field='nRealCashCollection' title='Real Cash Collection' />
          <ExcelExportColumn field='userCashWinning' title='User Cash Winning' />
          <ExcelExportColumn field='userBonusWinning' title='User Bonus Winning' />
          {/* <ExcelExportColumn field='botCashWinning' title='Bot Cash Winning' /> */}
          {/* <ExcelExportColumn field='botBonusWinning' title='Bot Bonus Winning' /> */}
          <ExcelExportColumn field='totalWinningProvided' title='Total Winning Provided' />
          <ExcelExportColumn field='botUserWinning' title='Bot User Winning' />
          <ExcelExportColumn field='nBotUsersMoney' title="Bot User's Money" />
          <ExcelExportColumn field='nBotUsersBonus' title="Bot User's Bonus" />
          <ExcelExportColumn field='bonusUsed' title='Bonus Used' />
          <ExcelExportColumn field='nTotalPromoDiscount' title='Promo Code amount used(Discount)' />
          <ExcelExportColumn field='totalGrossProfit' title='Total Gross Profit' />
          <ExcelExportColumn field='grossProfit' title='Gross Profit(%)' />
          <ExcelExportColumn field='netProfit' title='Net Profit' />
          <ExcelExportColumn field='netProfitPercent' title='Net Profit(%)' />
          <ExcelExportColumn field='cashbackCash' title='Cashback (Cash)' />
          <ExcelExportColumn field='cashbackBonus' title='Cashback (Bonus)' />
          <ExcelExportColumn field='nCreatorCommission' title='Private League Creator Bonus' />
          <ExcelExportColumn field='bPoolPrize' title='Pool League?' />
        </ExcelExport>
        <div className='d-flex justify-content-between mb-3 fdc-480'>
          {(cancelledPublicLeagueCount >= 0) && (cancelledPrivateLeagueCount >= 0) && <div className='total-text'>Cancelled: (Public-{cancelledPublicLeagueCount || 0}, Private-{cancelledPrivateLeagueCount || 0})</div>}
          <div className='d-flex fdc-480'>
            {(winDistAt) && <div className='total-text'>Win Prize Distribution At : <b>{moment(winDistAt).format('lll')}</b></div>}
            {(winDistAt) && (window.innerWidth > 480) && <div className='total-text mr-2 ml-2'><b>|</b></div>}
            {(totalWinner >= 0) && <div className='total-text'>Winners : <b>{totalWinner || 0}</b></div>}
          </div>
        </div>
        <table className="match-league-table mb-5">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>
                <div>League {total && <span className='total-text'>(Total-{total})</span>}</div>
                {leagueCount?.nPublicLeagueCount >= 0 && leagueCount?.nPrivateLeagueCount >= 0 && <div className='total-text'>Public-{leagueCount.nPublicLeagueCount}, Private-{leagueCount.nPrivateLeagueCount}</div>}
              </th>
              <th>
                <div>League Type</div>
                <CustomInput
                  type="select"
                  name="promoType"
                  id="promoType"
                  value={leagueType}
                  className='mt-2'
                  onChange={(event) => onFiltering(event)}
                >
                  <option value="">All</option>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </CustomInput>
              </th>
              <th>Entry</th>
              <th>
                Joined {totalLeagueCount ? <span className='total-text'>(User Leagues-{totalLeagueCount})</span> : ''}
                {leagueCount?.nTotalPlayReturnUsers ? <div className='total-text'>Play Return-{leagueCount.nTotalPlayReturnUsers}</div> : ''}
              </th>
              <th>Entry Fee</th>
              <th>Total Payout</th>
              <th>Pool League <img className='custom-info' src={infoIcon} id='prize'></img>
              <UncontrolledPopover trigger="legacy" placement="bottom" target='prize'>
                <PopoverBody style={{ width: '520px' }}>
                  <p>If pool prize is turned on, the prize breakup amount will be measured in percentage instead of real money.</p>
                  <p>Formula -</p>
                  <p>Winning amount = ((Total payout * Prize ) / 100) / (Rank To - Rank From + 1)</p>
                  <p>Note - If multiple users get the same rank, then the win amount will be divided between them.</p>
                </PopoverBody>
              </UncontrolledPopover></th>
              <th>League Features</th>
              <th>Bonus Util(%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={11} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr
                        key={i}
                        className={data.bCancelled ? 'cancelled-raw' : data.bWinningDone ? 'priceDone-raw' : data.bPlayReturnProcess ? 'playReturn-raw' : ''}
                      >
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>{!data.bPrivateLeague
                          ? data.sName + (data.bCopyLeague ? '(Copy League)' : '')
                          : data.sName}
                        </td>
                        <td>
                        {data.bPrivateLeague
                          ? <Button color='link' onClick={() => privateLeagueCreatorDetails(data)}>
                            Private
                          </Button>
                          : <Button color='link' onClick={() => setPublicPrizeBreakupFunc(data.aLeaguePrize, data.sName, data.bPoolPrize)}>Public</Button>}
                        </td>
                        <td>{`( ${data.nMin} - ${data.nMax} )`}</td>
                        <td>{data.nJoined}</td>
                        <td>{data.nPrice}</td>
                        <td>{data.nTotalPayout}</td>
                        <td><Badge
                          color={`${data.bPoolPrize ? 'success' : 'danger'}`}
                          className='ml-2'
                        >
                          {data.bPoolPrize ? 'Yes' : 'No'}
                        </Badge>
                        </td>
                        <td>
                          {data.bAutoCreate ? (<Badge color="warning" className="ml-2">A</Badge>) : ''}
                          {data.bConfirmLeague ? (<Badge color="success" className="ml-2">C</Badge>) : ''}
                          {data.bMultipleEntry ? (<Badge color="primary" className="ml-2">M</Badge>) : ''}
                          {data.nBonusUtil > 0 ? (<Badge color="info" className="ml-2">B</Badge>) : ''}
                          {data.bUnlimitedJoin ? (<Badge color="secondary" className="ml-2">∞</Badge>) : ''}
                          {!data.bAutoCreate && !data.bConfirmLeague && !data.bMultipleEntry && !data.nBonusUtil > 0 && !data.bUnlimitedJoin ? '--' : ''}
                        </td>
                        <td>{data.nBonusUtil ? data.nBonusUtil : ' - '}</td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle nav className='match-league-dropdown'>
                              <img src={more} height='25'></img>
                            </DropdownToggle>
                            <DropdownMenu container='body'>
                              {((Auth && Auth === 'SUPER') || (adminPermission?.USERLEAGUE !== 'N')) && (
                              <DropdownItem tag={Link} to={`${props.userLeague}/${data._id}`}>User Leagues</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'N')) && (matchStatus === 'I' || matchStatus === 'L') && !data.bCancelled && (
                              <DropdownItem onClick={() => generatePDF(data.sFairPlay ? data.sFairPlay : '', data._id)}>{data.sFairPlay ? 'Fair Play' : 'Generate Fair Play'}</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) && (!data.bPrivateLeague) && (
                              <DropdownItem tag={Link} to={`${systemBotsLogs}/${data._id}`}>Bot Logs</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) && (matchStatus === 'P' || matchStatus === 'U') && (!data.bPrivateLeague) && (
                              <DropdownItem tag={Link} to={`${systemTeams}/${data._id}`}>Show Match Players(Bot)</DropdownItem>)}

                              {data.bCashbackEnabled && (!data.bCancelled) && <DropdownItem tag={Link} to={`${props.cashback}/${data._id}`}>Cashback List</DropdownItem>}

                              {(!data.bCancelled) && (!data.bPrivateLeague) && <DropdownItem tag={Link} to={`${props.promoUsage}/${data._id}`}>Promo Usage List</DropdownItem>}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.TDS !== 'N')) && (matchStatus === 'I' || matchStatus === 'CMP') && (
                              <DropdownItem tag={Link} to={{ pathname: `/users/tds-management/${data._id}`, state: { leagueTotds: true, leagueTdsId: data.iMatchId, leagueNameToTds: data.sName, matchNameToTds: matchDetails?.sName } }}>TDS</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.PASSBOOK !== 'N')) && (
                              <DropdownItem tag={Link} to={{ pathname: `/users/passbook/${data._id}`, state: { leagueToPassbook: true, leaguePassbookId: data.iMatchId, leagueNameToPassbook: data.sName, matchNameToPassbook: matchDetails?.sName } }}>Passbook</DropdownItem>)}

                              {!data.bCancelled && !data.bWinningDone && props.permission &&
                                <DropdownItem
                                  onClick={() => {
                                    setModalMessage2(true)
                                    setMatchLeagueId(data._id)
                                  }}>Cancel</DropdownItem>}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>)
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 && (
          <div className="text-center">
            <h3>No Match league available</h3>
          </div>
        )
      }
      <PaginationComponent
        activePageNo={activePageNo}
        startingNo={startingNo}
        endingNo={endingNo}
        total={total}
        listLength={listLength}
        setOffset={setOffset}
        setStart={setStart}
        setLoading={setLoading}
        setListLength={setListLength}
        setPageNo={setPageNo}
        offset={offset}
        paginationFlag={paginationFlag}
      />

      <Modal isOpen={modalForPublic} toggle={togglePublicModal} className='prizeBreakupModal'>
        <ModalHeader toggle={togglePublicModal}></ModalHeader>
        <ModalBody>
          <h3>Prize Breakup ({leagueName})</h3>
          <table className='table'>
            <tbody>
              <tr>
                <td><b>Rank</b></td>
                <td><b>Prize {isPoolLeague ? '(%)' : ''}</b></td>
                <td><b>Rank Type</b></td>
                <td><b>Info</b></td>
                <td><b>Image</b></td>
              </tr>
              {prizeBreakup && prizeBreakup.sort((a, b) => a.nRankFrom > b.nRankFrom ? 1 : -1).map((data, index2) =>
              <tr key={index2}>
                <td>{data.nRankFrom === data.nRankTo ? `${data.nRankFrom}` : `${data.nRankFrom}-${data.nRankTo}`}</td>
                <td>{data.nPrize}{isPoolLeague ? '%' : ''}</td>
                <td>{data.eRankType === 'R' ? 'Real Money' : data.eRankType === 'B' ? 'Bonus' : data.eRankType === 'E' ? 'Extra' : '--'}</td>
                <td>{data.sInfo || '--'}</td>
                <td>{data.sImage ? <img src={url + data.sImage} alt="Extra Image" height={50} width={70} /> : ' No Image '}</td>
                </tr>)}
            </tbody>
          </table>
        </ModalBody>
      </Modal>

      <Modal isOpen={isModalOpen} toggle={toggleModal} className='prizeBreakupModal'>
        <ModalHeader toggle={toggleModal}></ModalHeader>
        <ModalBody>
          <h3>Private Contest Details</h3>
          <table className='table'>
            <tbody>
              <tr>
                <td>Username</td>
                <td>Contest Code</td>
                <td>Admin Commission</td>
                <td>Creator Commission</td>
              </tr>
              <tr>
                <td><Button color='link' onClick={() => history.push(`/users/user-management/user-details/${userId.current}`)}>{leagueCreatorInfo.sUsername}</Button></td>
                <td><b>{shareCode.current || '--'}</b></td>
                <td><b>{adminCommission.current || '--'}</b></td>
                <td><b>{creatorCommission.current || '--'}</b></td>
              </tr>
            </tbody>
          </table>
          <h3>Prize Breakup</h3>
          <table className='table'>
            <tbody>
              <tr>
                <td><b>Rank</b></td>
                {prizeBreakup && prizeBreakup.map((data, index2) =>
                    <td key={index2}>{data.nRankFrom === data.nRankTo ? `${data.nRankFrom}` : `${data.nRankFrom}-${data.nRankTo}`}</td>
                )}
              </tr>
              <tr>
                <td><b>Prize</b></td>
                {prizeBreakup && prizeBreakup.map((data, index2) =>
                     <td key={index2}>{data?.nPrize}</td>
                )}
              </tr>
            </tbody>
          </table>
        </ModalBody>
      </Modal>

      <Modal isOpen={modalMessage2} toggle={toggleMessage} className="modal-confirm">
        <ModalBody className="text-center">
          <img className="info-icon" src={warningIcon} alt="check" />
          <h2>Are you sure you want to Cancel it?</h2>
          <Row className="row-12">
            <Col>
              <Button type="submit" className="theme-btn outline-btn full-btn" onClick={toggleMessage}>Cancel</Button>
            </Col>
            <Col>
              <Button type="submit" className="theme-btn danger-btn full-btn" onClick={cancel}> Yes, Cancel It </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

MatchLeagueComponent.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  cancelLeague: PropTypes.func,
  prizeDistributionFunc: PropTypes.func,
  winPrizeDistributionFunc: PropTypes.func,
  matchStatus: PropTypes.string,
  getMatchDetailsFunc: PropTypes.func,
  leagueCountFunc: PropTypes.func,
  permission: PropTypes.bool,
  cashback: PropTypes.string,
  userLeague: PropTypes.string,
  location: PropTypes.object,
  search: PropTypes.string,
  history: PropTypes.object,
  leagueCount: PropTypes.object,
  systemBotsLogs: PropTypes.string,
  systemTeams: PropTypes.string,
  promoUsage: PropTypes.string,
  match: PropTypes.object,
  pointCalculateFlag: PropTypes.bool,
  rankCalculateFlag: PropTypes.bool,
  prizeCalculateFlag: PropTypes.bool,
  winPrizeCalculateFlag: PropTypes.bool,
  settingList: PropTypes.array,
  getSettingList: PropTypes.func
}

MatchLeagueComponent.displayName = MatchLeagueComponent

export default connect(null, null, null, { forwardRef: true })(MatchLeagueComponent)
