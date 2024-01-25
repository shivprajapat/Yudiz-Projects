import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  UncontrolledAlert, Button, Modal, ModalHeader, ModalBody, CustomInput
} from 'reactstrap'
import { useSelector, connect, useDispatch } from 'react-redux'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import SkeletonTable from '../../../../components/SkeletonTable'
import viewIcon from '../../../../assets/images/view-icon.svg'
import PropTypes from 'prop-types'
import sortIcon from '../../../../assets/images/sorting-icon.svg'
import { getUserTeamPlayerList } from '../../../../actions/matchleague'
import PaginationComponent from '../../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../../helpers/helper'
import moment from 'moment'
import { ExcelExport, ExcelExportColumn, ExcelExportColumnGroup } from '@progress/kendo-react-excel-export'
import Loading from '../../../../components/Loading'

const UserLeagueManagement = forwardRef((props, ref) => {
  const {
    List, getList, botCountInMatchLeagueFunc, getMatchDetailsFunc, resMessage, resStatus, sportsType
  } = props
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const [fullList, setFullList] = useState([])
  const [userCount, setUserCount] = useState(0)
  const [copyBotCount, setCopyBotCount] = useState(0)
  const [normalBotCount, setNormalBotCount] = useState(0)
  const [combinationBotCount, setCombinationBotCount] = useState(0)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'asc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'nRank')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [totalScoredPoints, setTotalScoredPoints] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)
  const [selectedFieldData, setSelectedFieldData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userType, setUserType] = useQueryState('type', '')
  const [nameOrder, setNameOrder] = useState('asc')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const loader = useRef(false)
  const searchProp = props.search

  const isFullList = useSelector(state => state.matchleague.isFullResponse)
  const token = useSelector((state) => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const userTeamPlayerList = useSelector(state => state.matchleague.userTeamPlayerList)
  const botCountInMatchLeague = useSelector(state => state.matchleague.botCountInMatchLeague)
  const previousProps = useRef({ List, resMessage, resStatus, start, offset, botCountInMatchLeague, userTeamPlayerList, userType }).current
  const [modalState, setModalState] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const paginationFlag = useRef(false)

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      // props.history.replace()
    }
    let page = 1
    let limit = offset
    let orderBy = 'asc'
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
        orderBy = obj.order
        setOrder(orderBy)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, userType, false)
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.userTeamPlayerList !== userTeamPlayerList) {
      if (userTeamPlayerList) {
        setModalState(true)
        const nScoredPoints = userTeamPlayerList?.aPlayers?.map(data => data.nScoredPoints)
        const sum = nScoredPoints.reduce((a, b) => {
          return a + b
        })
        setTotalScoredPoints(sum)
        const nFantasyCredit = userTeamPlayerList?.aPlayers?.map(data => data.iMatchPlayerId.nFantasyCredit)
        const creditSum = nFantasyCredit.reduce((a, b) => {
          return a + b
        })
        setTotalCredits(creditSum)
        loader.current = false
      }
    }
    return () => {
      previousProps.userTeamPlayerList = userTeamPlayerList
    }
  }, [userTeamPlayerList])

  useEffect(() => {
    if (previousProps.List !== List) {
      if ((List && List.data && List.data[0]) && !isFullList) {
        if (List.data[0].results) {
          const userArrLength = List.data[0].results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List.data[0].results ? List.data[0].results : [])
        setIndex(activePageNo)
        setTotal(List.data[0].total ? List.data[0].total : 0)
        setLoading(false)
      } else if (List && List.data && List.data[0] && isFullList) {
        setFullList(List.data[0].results ? List.data[0].results : [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List.data[0].results ? List.data[0].results : []),
          fileName: 'BotTeams.xlsx'
        }
        exporter.current.save()
        setLoading(false)
      }
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        UserLeagueManagement: props.location.search
      }
      : data.UserLeagueManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          // getList(startFrom, limit, sort, order, search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
        }
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, userType, false)
        botCountInMatchLeagueFunc()
        getMatchDetailsFunc()
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.botCountInMatchLeague !== botCountInMatchLeague && botCountInMatchLeague) {
      const copyBot = botCountInMatchLeague.botCount && botCountInMatchLeague.botCount.find(data => data.sType === 'CB' ? data.count : 0)
      const normalBot = botCountInMatchLeague.botCount && botCountInMatchLeague.botCount.find(data => data.sType === 'B' ? data.count : 0)
      const combinationBotCount = botCountInMatchLeague.botCount && botCountInMatchLeague.botCount.find(data => data.sType === 'CMB' ? data.count : 0)
      const user = botCountInMatchLeague.botCount && botCountInMatchLeague.botCount.find(data => data.sType === 'U' ? data.count : 0)
      setCopyBotCount(copyBot && copyBot.count ? copyBot.count : 0)
      setNormalBotCount(normalBot && normalBot.count ? normalBot.count : 0)
      setUserCount(user && user.count ? user.count : 0)
      setCombinationBotCount(combinationBotCount?.count || 0)
    }
    return () => {
      previousProps.botCountInMatchLeague = botCountInMatchLeague
    }
  }, [botCountInMatchLeague])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, userType, false)
      setSearch(searchProp.trim())
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && props.flag) {
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

  useEffect(() => {
    if (previousProps.userType !== userType) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, userType, false)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.userType = userType
    }
  }, [userType])

  // To sort by given field
  function onSorting (sortingBy) {
    const Order = sortingBy === 'nTotalPoints' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, userType, false)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'nTotalPoints') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, userType, false)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'nRank') {
        setCreatedOrder('asc')
        setSort(sortingBy)
      } else {
        setNameOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, search, userType, false)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // refresh function
  function onRefresh () {
    const startFrom = 0
    const limit = offset
    getList(startFrom, limit, sort, order, search, userType, false)
    botCountInMatchLeagueFunc()
    getMatchDetailsFunc()
    setLoading(true)
    setPageNo(1)
  }

  const processExcelExportData = (data) =>
    data.map((userList, index2) => {
      const joinedUsersList = [{ ...userList }]
      const sUserName = userList.sUserName ? userList.sUserName : '-'
      let eType = userList.eType
      eType = eType === 'U' ? 'User' : eType === 'B' ? 'Bot' : eType === 'CB' ? 'Copy Bot' : eType === 'CMB' ? 'Combination Bot' : '--'
      const sTeamName = userList.sTeamName || '--'
      const sMatchName = userList.sMatchName || '--'
      const nTotalPoints = userList.nTotalPoints ? Number(userList.nTotalPoints).toFixed(2) : '-'
      const nPoolPrice = userList.nPoolPrice ? 'Yes' : 'No'
      const winPrize = (userList.nPrice || '0') + (userList.nBonusWin ? '(Bonus -' + Number(userList.nBonusWin).toFixed(2) + ')' : '') + (userList.aExtraWin && userList.aExtraWin[0]?.sInfo ? '(Extra -' + userList.aExtraWin[0].sInfo + ')' : '')
      let dCreatedAt = moment(userList.dCreatedAt).local().format('lll')
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
      const arr = userList.aPlayers.map(player => player.iMatchPlayerId)
      const botData = arr.map((d, i) => {
        joinedUsersList['sName' + i] = `${d.sName + (d._id === userList.iViceCaptainId ? '(VC)' : '') + (d._id === userList.iCaptainId ? '(C)' : '')}`
        return joinedUsersList
      })
      const sName0 = botData[0].sName0
      const sName1 = botData[0].sName1
      const sName2 = botData[0].sName2
      const sName3 = botData[0].sName3
      const sName4 = botData[0].sName4
      const sName5 = botData[0].sName5
      const sName6 = botData[0].sName6
      const sName7 = (sportsType === 'cricket' || sportsType === 'football' || sportsType === 'basketball') ? botData[0].sName7 : ''
      const sName8 = (sportsType === 'cricket' || sportsType === 'football') ? botData[0].sName8 : ''
      const sName9 = (sportsType === 'cricket' || sportsType === 'football') ? botData[0].sName9 : ''
      const sName10 = (sportsType === 'cricket' || sportsType === 'football') ? botData[0].sName10 : ''
      return {
        ...botData,
        sName0,
        sName1,
        sName2,
        sName3,
        sName4,
        sName5,
        sName6,
        sName7,
        sName8,
        sName9,
        sName10,
        sUserName,
        eType,
        sTeamName,
        sMatchName,
        nTotalPoints,
        nPoolPrice,
        winPrize,
        dCreatedAt,
        index: index2 + 1
      }
    })

  async function onExport () {
    getList(start, offset, sort, order, search, userType, true)
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onRefresh,
    onExport
  }))

  function modalOpenFunc (data) {
    setSelectedFieldData(data)
    setIsModalOpen(true)
  }

  function onFiltering (event) {
    setUserType(event.target.value)
  }

  return (
    <Fragment>
      {loader.current && <Loading />}
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <ExcelExport data={fullList} fileName='BotTeams.xlsx' ref={exporter}>
        <ExcelExportColumn field='index' title='Sr No.' />
        <ExcelExportColumn field='sUserName' title='Username' />
        <ExcelExportColumn field='eType' title='User Type' />
        <ExcelExportColumn field='sMatchName' title='Match Name' />
        <ExcelExportColumn field='sTeamName' title='Team Name' />
        <ExcelExportColumn field='nTotalPoints' title='Total Points' />
        <ExcelExportColumn field='winPrize' title='Prize' />
        <ExcelExportColumn field='nPoolPrice' title='Pool Prize' />
        <ExcelExportColumn field='dCreatedAt' title='Contest Join Time' />
        <ExcelExportColumnGroup
          title="Players"
          headerCellOptions={{
            textAlign: 'center'
          }}
        >
          <ExcelExportColumn field='sName0' title='Player1' />
          <ExcelExportColumn field='sName1' title='Player2' />
          <ExcelExportColumn field='sName2' title='Player3' />
          <ExcelExportColumn field='sName3' title='Player4' />
          <ExcelExportColumn field='sName4' title='Player5' />
          <ExcelExportColumn field='sName5' title='Player6' />
          <ExcelExportColumn field='sName6' title='Player7' />
          {(sportsType === 'cricket' || sportsType === 'football' || sportsType === 'basketball') && <ExcelExportColumn field='sName7' title='Player8' />}
          {(sportsType === 'cricket' || sportsType === 'football') && <ExcelExportColumn field='sName8' title='Player9' />}
          {(sportsType === 'cricket' || sportsType === 'football') && <ExcelExportColumn field='sName9' title='Player10' />}
          {(sportsType === 'cricket' || sportsType === 'football') && <ExcelExportColumn field='sName10' title='Player11' />}
        </ExcelExportColumnGroup>
      </ExcelExport>
      <div className="table-responsive">
        <table className="match-league-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th> Team Name</th>
              <th> Username</th>
              <th>
              <div>User Type</div>
                <CustomInput
                  type="select"
                  name="userType"
                  id="userType"
                  value={userType}
                  className={`mt-2 ${window.innerWidth <= 768 ? 'custom-selection' : 'w-75'}`}
                  onChange={(event) => onFiltering(event)}
                >
                  <option value="">All</option>
                  <option value="U">User{userCount && (Auth && Auth === 'SUPER') ? '(' + userCount + ')' : ''}</option>
                  <option value="B">Bot{normalBotCount && (Auth && Auth === 'SUPER') ? '(' + normalBotCount + ')' : ''}</option>
                  <option value='CB'>Copy Bot{copyBotCount && (Auth && Auth === 'SUPER') ? '(' + copyBotCount + ')' : ''}</option>
                  <option value='CMB'>Combination Bot{combinationBotCount && (Auth && Auth === 'SUPER') ? '(' + combinationBotCount + ')' : ''}</option>
                </CustomInput>
              </th>
              <th>Total Points
                <Button color="link" className="sort-btn" onClick={() => onSorting('nTotalPoints')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>
                <span className="d-inline-block align-middle">Rank</span>
                <Button color="link" className="sort-btn" onClick={() => onSorting('nRank')}><img src={sortIcon} className="m-0" alt="sorting" /></Button>
              </th>
              <th>
                <div>Prize</div>
                {List?.matchLeague?.nTotalPayout ? <div className='total-text'>Total Payout- {List?.matchLeague?.nTotalPayout}</div> : ''}
              </th>
              <th> Actions </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={8} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={i}
                          className={data.bCancelled ? 'cancelled-raw' : ''}
                        >
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>
                            <Button
                              color="link"
                              className="view"
                              onClick={() => {
                                dispatch(getUserTeamPlayerList(data.iUserTeamId, token))
                                loader.current = true
                              }}
                            >{data.sTeamName}</Button>
                          </td>
                          <td>{adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N') ? <Button color="link" className="view" tag={Link} to={data?.eType === 'U' ? `/users/user-management/user-details/${data.iUserId}` : `/users/system-user/system-user-details/${data.iUserId}`}>{data.sUserName || '--'}</Button> : data?.sUserName || '--'}</td>
                          <td>{data.eType && data.eType === 'U' ? 'User' : data.eType === 'B' ? 'Bot' : data.eType === 'CB' ? 'Copy Bot' : data.eType === 'CMB' ? 'Combination Bot' : '--'}</td>
                          <td>{data.nTotalPoints ? Number(data.nTotalPoints).toFixed(2) : '-'}</td>
                          <td>{data.nRank ? data.nRank : '-'}</td>
                          <td><Button color="link" className="view" onClick={() => modalOpenFunc(data)}>{data.nPrice || 0}{data.nBonusWin ? '(Bonus -' + Number(data.nBonusWin).toFixed(2) + ')' : ''}{data.aExtraWin && data.aExtraWin[0]?.sInfo ? '(Extra -' + data.aExtraWin[0].sInfo + ')' : ''}</Button></td>
                          <td>
                            <ul className="action-list mb-0 d-flex">
                              <li>
                                {
                                  ((Auth && Auth === 'SUPER') || (adminPermission?.USERTEAM !== 'N')) &&
                                  (
                                    <NavLink color="link" to={`${props.userTeams}/${data.iUserId}`} className="view">
                                      <img src={viewIcon} alt="View" />
                                      User Teams
                                    </NavLink>
                                  )
                                }
                              </li>
                              <li>
                                {
                                  ((Auth && Auth === 'SUPER') || (adminPermission?.USERLEAGUE !== 'N')) &&
                                  (
                                    <NavLink color="link" to={`${props.userleagues}/${data.iUserId}`} className="view">
                                      <img src={viewIcon} alt="View" />
                                      User leagues
                                    </NavLink>
                                  )
                                }
                              </li>
                            </ul>
                          </td>
                        </tr>
                      )
                    })
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No User League available</h3>
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
        </ModalHeader>
        <ModalBody>
          <h3 className='text-center'>User Team ({userTeamPlayerList?.sName || '--'})</h3>
          <table className='table'>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Player Role</th>
                <th>Player Team</th>
                <th>Score Points</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {userTeamPlayerList && userTeamPlayerList.aPlayers && userTeamPlayerList.aPlayers.map((data, i) =>
              <tr key={i}>
                <td>{data.iMatchPlayerId && data.iMatchPlayerId.sName ? data.iMatchPlayerId.sName : '-'}
                <span className='danger-text'>{userTeamPlayerList.iCaptainId === data.iMatchPlayerId._id ? '(C)' : userTeamPlayerList.iViceCaptainId === data.iMatchPlayerId._id ? '(VC)' : ''}</span></td>
                <td>{data.iMatchPlayerId && data.iMatchPlayerId.eRole &&
                  data.iMatchPlayerId.eRole === 'ALLR'
                  ? 'All Rounder'
                  : '' ||
                  data.iMatchPlayerId.eRole === 'BATS'
                    ? 'Batsman'
                    : '' ||
                    data.iMatchPlayerId.eRole === 'BWL'
                      ? 'Bowler'
                      : '' ||
                      data.iMatchPlayerId.eRole === 'WK'
                        ? 'Wicket Keeper'
                        : '' ||
                        data.iMatchPlayerId.eRole === 'FWD'
                          ? 'Forwards'
                          : '' ||
                          data.iMatchPlayerId.eRole === 'GK'
                            ? 'Goal Keeper'
                            : '' ||
                            data.iMatchPlayerId.eRole === 'DEF'
                              ? 'Defender'
                              : '' ||
                              data.iMatchPlayerId.eRole === 'RAID'
                                ? 'Raider'
                                : '' ||
                                data.iMatchPlayerId.eRole === 'MID'
                                  ? 'Mid fielders'
                                  : '' ||
                                  data.iMatchPlayerId.eRole === 'PG'
                                    ? 'Point-Gaurd'
                                    : '' ||
                                    data.iMatchPlayerId.eRole === 'SG'
                                      ? 'Shooting-Gaurd'
                                      : '' ||
                                      data.iMatchPlayerId.eRole === 'SF'
                                        ? 'Small-Forwards'
                                        : '' ||
                                        data.iMatchPlayerId.eRole === 'PF'
                                          ? 'Power-Forwards'
                                          : '' ||
                                          data.iMatchPlayerId.eRole === 'C'
                                            ? 'Centre'
                                            : '' ||
                                            data.iMatchPlayerId.eRole === 'IF'
                                              ? 'Infielder'
                                              : '' ||
                                            data.iMatchPlayerId.eRole === 'OF'
                                                ? 'Outfielder'
                                                : '' ||
                                            data.iMatchPlayerId.eRole === 'P'
                                                  ? 'Pitcher'
                                                  : '' ||
                                            data.iMatchPlayerId.eRole === 'CT'
                                                    ? 'Catcher'
                                                    : '--'}
                </td>
                <td>{(data.iTeamId && data.iTeamId.sName) ? data.iTeamId.sName : '--'}</td>
                <td>{data.nScoredPoints ? data.nScoredPoints : '--'}</td>
                <td>{data.iMatchPlayerId && data.iMatchPlayerId.nFantasyCredit ? data.iMatchPlayerId.nFantasyCredit : '-'}</td>
              </tr>)}
            </tbody>
          </table>
          <div className='d-flex justify-content-between'>
            <div><b>Total Scored Points: {totalScoredPoints}</b></div>
            <div><b>Total Credits: {totalCredits}</b></div>
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={isModalOpen} toggle={toggleModal} className='modal-confirm-bot'>
        <ModalHeader toggle={toggleModal}>Prize</ModalHeader>
        <ModalBody>
          <div className="table-responsive">
            <table className="table">
              <tr>
                <td>Cash Win</td>
                <td><b>{selectedFieldData?.nPrice || 0}</b></td>
              </tr>
              <tr>
                <td>Bonus</td>
                <td><b>{Number(selectedFieldData?.nBonusWin).toFixed(2) || 0}</b></td>
              </tr>
              <tr>
                <td>Extra Win</td>
                <td><b>{(selectedFieldData?.aExtraWin?.length !== 0) ? [...new Set(selectedFieldData?.aExtraWin?.map(data => data.sInfo))].toString() : '--'}</b></td>
              </tr>
            </table>
          </div>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

UserLeagueManagement.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  search: PropTypes.string,
  flag: PropTypes.bool,
  userTeams: PropTypes.string,
  userleagues: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  botCountInMatchLeagueFunc: PropTypes.func,
  getMatchDetailsFunc: PropTypes.func,
  resMessage: PropTypes.string,
  resStatus: PropTypes.bool,
  sportsType: PropTypes.string
}

UserLeagueManagement.displayName = UserLeagueManagement

export default connect(null, null, null, { forwardRef: true })(UserLeagueManagement)
