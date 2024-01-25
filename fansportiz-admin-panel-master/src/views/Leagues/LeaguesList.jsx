import React, {
  Fragment,
  forwardRef,
  useEffect,
  useState,
  useRef,
  useImperativeHandle
} from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import {
  Button,
  CustomInput,
  Badge,
  Modal,
  ModalBody,
  Row,
  Col,
  UncontrolledAlert
} from 'reactstrap'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import SkeletonTable from '../../components/SkeletonTable'
import { deleteleague } from '../../actions/league'
import warningIcon from '../../assets/images/warning-icon.svg'
import deleteIcon from '../../assets/images/delete-icon.svg'
import viewIcon from '../../assets/images/view-icon.svg'
import { getListOfCategory } from '../../actions/leaguecategory'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import PaginationComponent from '../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../helpers/helper'

const LeaguesList = forwardRef((props, ref) => {
  const {
    List,
    getList,
    updateLeague,
    UpdatedLeague,
    blankMessage,
    getGameCategory,
    flag,
    handleSearchBox,
    activeSports
  } = props
  const exporter = useRef(null)
  const search = props.search
  const searchField = props.searchField
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'asc')
  const [sort] = useQueryState('sortBy', 'sName')
  const [LeagueCategory, setLeagueCategory] = useQueryState('leagueCategory', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [listLength, setListLength] = useState('10 entries')
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  const SelectGame = props.selectGame
  const LeagueCategoryList = useSelector((state) => state.leaguecategory.LeaguecategoryList)
  const resStatus = useSelector((state) => state.league.resStatus)
  const resMessage = useSelector((state) => state.league.resMessage)
  const Auth = useSelector((state) => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const previousProps = useRef({
    List,
    resMessage,
    resStatus,
    SelectGame,
    LeagueCategory,
    start,
    offset,
    searchField,
    activeSports
  }).current
  const paginationFlag = useRef(false)

  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

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
    let orderBy = 'asc'
    let leagueCategory = ''
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
      if (obj.leagueCategory) {
        leagueCategory = obj.leagueCategory
        setLeagueCategory(leagueCategory)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, orderBy, search, searchField, LeagueCategory, SelectGame)
    if (adminPermission?.MATCH !== 'N') {
      getGameCategory()
    }
    dispatch(getListOfCategory(token))
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        if (List.results) {
          const userArrLength = List.results.length
          const startFrom = (activePageNo - 1) * offset + 1
          const end = startFrom - 1 + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List.results ? List.results : [])
        setIndex(activePageNo)
        setTotal(List.total ? List.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
            getGameCategory()
            dispatch(getListOfCategory(token))
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
            getGameCategory()
            dispatch(getListOfCategory(token))
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(activePageNo)
          }
        } else {
          getGameCategory()
          setStatus(resStatus)
          setMessage(resMessage)
          setModalWarning(false)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    data === {}
      ? (data = {
          League: props.location.search
        })
      : (data.League = props.location.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.searchField !== searchField) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
      setPageNo(1)
      setStart(startFrom)
      setLoading(true)
    }
    return () => {
      previousProps.searchField = searchField
    }
  }, [searchField])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.search !== search && flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.search = search
      }
    }
    return () => {
      previousProps.search = search
    }
  }, [search])

  useEffect(() => {
    if (previousProps.SelectGame !== SelectGame) {
      if (SelectGame) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
        setStart(startFrom)
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.SelectGame = SelectGame
    }
  }, [SelectGame])

  useEffect(() => {
    if (previousProps.LeagueCategory !== LeagueCategory) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
      setStart(startFrom)
      setPageNo(1)
    }
    return () => {
      previousProps.LeagueCategory = LeagueCategory
    }
  }, [LeagueCategory])

  useEffect(() => {
    if (
      (previousProps.start !== start || previousProps.offset !== offset) &&
      paginationFlag.current
    ) {
      getList(start, offset, sort, order, search, searchField, LeagueCategory, SelectGame)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deleteleague(deleteId, token))
    setLoading(true)
  }

  function onLeagueCategory (e) {
    setLeagueCategory(e.target.value)
  }

  // close popup modal
  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  // update status from list
  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    // const statuss = smallIfElse(selectedData.eStatus === 'Y', 'N', 'Y')
    const UpdatedLeagueData = {
      LeagueName: selectedData.sName,
      maxEntry: selectedData.nMax,
      minEntry: selectedData.nMin,
      Price: selectedData.nPrice,
      TotalPayout: selectedData.nTotalPayout,
      DeducePercent: selectedData.nDeductPercent,
      BonusUtil: selectedData.nBonusUtil,
      ConfirmLeague: selectedData.bConfirmLeague ? 'Y' : 'N',
      multipleEntry: selectedData.bMultipleEntry ? 'Y' : 'N',
      autoCreate: selectedData.bAutoCreate ? 'Y' : 'N',
      poolPrize: selectedData.bPoolPrize ? 'Y' : 'N',
      // ConfirmLeague: smallIfElse(selectedData.bConfirmLeague, 'Y', 'N'),
      // multipleEntry: smallIfElse(selectedData.bMultipleEntry, 'Y', 'N'),
      // autoCreate: smallIfElse(selectedData.bAutoCreate, 'Y', 'N'),
      // poolPrize: smallIfElse(selectedData.bPoolPrize, 'Y', 'N'),
      Position: selectedData.nPosition,
      active: statuss,
      GameCategory: selectedData.eCategory,
      LeagueCategory: selectedData.iLeagueCatId,
      iFilterCatId: selectedData.iFilterCatId,
      TeamJoinLimit: selectedData.nTeamJoinLimit,
      winnersCount: selectedData.nWinnersCount,
      LoyaltyPoint: selectedData.nLoyaltyPoint,
      unlimitedJoin: selectedData.bUnlimitedJoin ? 'Y' : 'N',
      // unlimitedJoin: smallIfElse(selectedData.bUnlimitedJoin, 'Y', 'N'),
      minCashbackTeam: selectedData.nMinCashbackTeam,
      cashBackAmount: selectedData.nCashbackAmount,
      cashbackType: selectedData.eCashbackType,
      minTeamCount: selectedData.nMinTeamCount,
      botCreate: selectedData.bBotCreate ? 'Y' : 'N',
      cashbackEnabled: selectedData.bCashbackEnabled ? 'Y' : 'N',
      // botCreate: smallIfElse(selectedData.bBotCreate, 'Y', 'N'),
      // cashbackEnabled: smallIfElse(selectedData.bCashbackEnabled, 'Y', 'N'),
      copyBotPerTeam: selectedData.nCopyBotsPerTeam
    }
    UpdatedLeague(UpdatedLeagueData, selectedData._id)
    blankMessage()
    setLoading(true)
    toggleWarning()
  }

  // export list
  const processExcelExportData = (data) =>
    data.map((leagueList) => {
      const bAutoCreate = leagueList.bAutoCreate ? 'Yes' : 'No'
      const eStatus = leagueList.eStatus ? 'Active' : 'InActive'
      const bMultipleEntry = leagueList.bMultipleEntry ? 'Yes' : 'No'
      const bCashbackEnabled = leagueList.bCashbackEnabled ? 'Yes' : 'No'
      const bPoolPrize = leagueList.bPoolPrize ? 'Yes' : 'No'
      const bUnlimitedJoin = leagueList.bUnlimitedJoin ? 'Yes' : 'No'
      const bBotCreate = leagueList.bBotCreate ? 'Yes' : 'No'
      const bConfirmLeague = leagueList.bConfirmLeague ? 'Yes' : 'No'
      const nWinnersCount = leagueList.nWinnersCount ? leagueList.nWinnersCount : 0
      const nMinTeamCount = leagueList.nMinTeamCount ? leagueList.nMinTeamCount : 0
      const nMinCashbackTeam = leagueList.nMinCashbackTeam ? leagueList.nMinCashbackTeam : 0
      const nCashbackAmount = leagueList.nCashbackAmount ? leagueList.nCashbackAmount : 0
      const eCashbackTypeIfPart = leagueList.eCashbackType === 'C' ? 'Cash' : 'Bonus'
      const eCashbackType = leagueList.eCashbackType ? eCashbackTypeIfPart : '--'
      const nTeamJoinLimit = leagueList.nTeamJoinLimit ? leagueList.nTeamJoinLimit : 0
      const nCopyBotsPerTeam = leagueList.nCopyBotsPerTeam ? leagueList.nCopyBotsPerTeam : 0
      // const bAutoCreate = smallIfElse(leagueList.bAutoCreate, 'Yes', 'No')
      // const eStatus = smallIfElse(leagueList.eStatus, 'Active', 'InActive')
      // const bMultipleEntry = smallIfElse(leagueList.bMultipleEntry, 'Yes', 'No')
      // const bCashbackEnabled = smallIfElse(leagueList.bCashbackEnabled, 'Yes', 'No')
      // const bPoolPrize = smallIfElse(leagueList.bPoolPrize, 'Yes', 'No')
      // const bUnlimitedJoin = smallIfElse(leagueList.bUnlimitedJoin, 'Yes', 'No')
      // const bBotCreate = smallIfElse(leagueList.bBotCreate, 'Yes', 'No')
      // const bConfirmLeague = smallIfElse(leagueList.bConfirmLeague, 'Yes', 'No')
      // const nWinnersCount = smallIfElse(leagueList.nWinnersCount, leagueList.nWinnersCount, 0)
      // const nMinTeamCount = smallIfElse(leagueList.nMinTeamCount, leagueList.nMinTeamCount, 0)
      // const nMinCashbackTeam = smallIfElse(
      //   leagueList.nMinCashbackTeam,
      //   leagueList.nMinCashbackTeam,
      //   0
      // )
      // const nCashbackAmount = smallIfElse(leagueList.nCashbackAmount, leagueList.nCashbackAmount, 0)
      // const eCashbackType = smallIfElse(leagueList.eCashbackType === 'C', 'Cash', 'Bonus')
      // const eCashbackType = smallIfElse(leagueList.eCashbackType, leagueList.eCashbackType, '--')
      // const nTeamJoinLimit = smallIfElse(leagueList.nTeamJoinLimit, leagueList.nTeamJoinLimit, 0)
      // const nCopyBotsPerTeam = smallIfElse(
      //   leagueList.nCopyBotsPerTeam,
      //   leagueList.nCopyBotsPerTeam,
      //   0
      // )

      return {
        ...leagueList,
        bAutoCreate,
        eStatus,
        bMultipleEntry,
        bCashbackEnabled,
        bPoolPrize,
        bUnlimitedJoin,
        bBotCreate,
        bConfirmLeague,
        nWinnersCount,
        nMinTeamCount,
        nMinCashbackTeam,
        nCashbackAmount,
        eCashbackType,
        nTeamJoinLimit,
        nCopyBotsPerTeam
      }
    })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = {
        ...exporter.current.props,
        data: processExcelExportData(list),
        fileName: 'LeagueList.xlsx'
      }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <div className="table-responsive">
        {modalMessage && message && (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>
            {message}
          </UncontrolledAlert>
        )}
        <ExcelExport data={list} fileName="LeagueList.xlsx" ref={exporter}>
          <ExcelExportColumn field="sName" title="League Name" />
          <ExcelExportColumn field="eCategory" title="Game Category" />
          <ExcelExportColumn field="sLeagueCategory" title="League Category" />
          <ExcelExportColumn field="sFilterCategory" title="Filter Category" />
          <ExcelExportColumn field="nLoyaltyPoint" title="Loyalty Point" />
          <ExcelExportColumn field="bConfirmLeague" title="Confirm League" />
          <ExcelExportColumn field="bAutoCreate" title="Auto Create" />
          <ExcelExportColumn field="nPrice" title="Entry Fee" />
          <ExcelExportColumn field="nMin" title="Min Entry" />
          <ExcelExportColumn field="nMax" title="Max Entry" />
          <ExcelExportColumn field="nTotalPayout" title="Total Payout" />
          <ExcelExportColumn field="nWinnersCount" title="Winners Count" />
          <ExcelExportColumn field="nBonusUtil" title="Bonus Util(%)" />
          <ExcelExportColumn field="nPosition" title="Position" />
          <ExcelExportColumn field="eStatus" title="Status" />
          <ExcelExportColumn field="bMultipleEntry" title="Multiple Entry" />
          <ExcelExportColumn field="nTeamJoinLimit" title="Team Join Limit" />
          <ExcelExportColumn field="bCashbackEnabled" title="Cashback Enabled" />
          <ExcelExportColumn field="nMinCashbackTeam" title="Min no of Team for Cashback" />
          <ExcelExportColumn field="nCashbackAmount" title="Cashback Amount" />
          <ExcelExportColumn field="eCashbackType" title="Cashback Type" />
          <ExcelExportColumn field="bPoolPrize" title="Pool Prize" />
          <ExcelExportColumn field="bUnlimitedJoin" title="Unlimited Join" />
          <ExcelExportColumn field="nDeductPercent" title="Deduct Percent" />
          <ExcelExportColumn field="nMinTeamCount" title="Min no of Team for bot" />
          <ExcelExportColumn field="bBotCreate" title="Bot Create" />
          <ExcelExportColumn field="nCopyBotsPerTeam" title="Copy bots per team" />
        </ExcelExport>
        <table className="table">
          <thead>
            <tr>
              <th> Sr No. </th>
              <th> Name </th>
              <th>
                <div>League Category</div>
                <CustomInput
                  type="select"
                  name="leagueCategory"
                  id="leagueCategory"
                  value={LeagueCategory}
                  className="mt-2"
                  onChange={(event) => onLeagueCategory(event)}
                >
                  <option value="">All</option>
                  {/* {LeagueCategoryList &&
                    LeagueCategoryList.length >= 1 && */}
                  {LeagueCategoryList?.map((data) => (
                    <option value={data.sTitle} key={data._id}>
                      {data.sTitle}
                    </option>
                  ))}
                </CustomInput>
              </th>
              <th>
                <div>League Type</div>
                <CustomInput
                  type="select"
                  name="leagueType"
                  id="leagueType"
                  value={searchField}
                  className="mt-2"
                  onChange={(event) => handleSearchBox(event)}
                >
                  <option value="">All</option>
                  <option value="nBonusUtil">Bonus Util</option>
                  <option value="bConfirmLeague">Confirm League</option>
                  <option value="bMultipleEntry">Multiple Entry</option>
                  <option value="bAutoCreate">Auto Create</option>
                  <option value="bPoolPrize">Pool Prize</option>
                  <option value="bUnlimitedJoin">Unlimited Join</option>
                </CustomInput>
              </th>
              <th> Min-Max Entry </th>
              <th> Entry Fee </th>
              <th> Bonus Util(%)</th>
              <th> Total Payout </th>
              <th> Winners Count </th>
              <th> Pool Prize </th>
              <th> Position </th>
              <th> Status </th>
              <th> Actions </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
              <SkeletonTable numberOfColumns={13} />
                )
              : (
              <Fragment>
                {list &&
                  list.length !== 0 &&
                  list.map((data, i) => (
                    <tr key={data._id}>
                      <td>{(index - 1) * offset + (i + 1)}</td>
                      <td>{data.sName}</td>
                      <td>{data.sLeagueCategory}</td>
                      <td>
                        {data.bAutoCreate
                          ? (
                          <Badge color="warning" className="ml-2">
                            A
                          </Badge>
                            )
                          : (
                              ''
                            )}
                        {data.bConfirmLeague
                          ? (
                          <Badge color="success" className="ml-2">
                            C
                          </Badge>
                            )
                          : (
                              ''
                            )}
                        {data.bMultipleEntry
                          ? (
                          <Badge color="primary" className="ml-2">
                            M
                          </Badge>
                            )
                          : (
                              ''
                            )}
                        {data.nBonusUtil > 0
                          ? (
                          <Badge color="info" className="ml-2">
                            B
                          </Badge>
                            )
                          : (
                              ''
                            )}
                        {data.bUnlimitedJoin
                          ? (
                          <Badge color="secondary" className="ml-2">
                            ∞
                          </Badge>
                            )
                          : (
                              ''
                            )}
                        {!data.bAutoCreate &&
                        !data.bConfirmLeague &&
                        !data.bMultipleEntry &&
                        !data.nBonusUtil > 0 &&
                        !data.bUnlimitedJoin
                          ? '--'
                          : ''}
                      </td>
                      <td>
                        ({data.nMin} - {data.nMax})
                      </td>
                      <td>{data.nPrice}</td>
                      <td>{data.nBonusUtil}</td>
                      <td>{data.nTotalPayout}</td>
                      <td>{data.nWinnersCount || '--'}</td>
                      <td>
                        <Badge color={`${data.bPoolPrize ? 'success' : 'danger'}`} className="ml-2">
                          {data.bPoolPrize ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td>{data.nPosition}</td>
                      <td className="success-text">
                        <CustomInput
                          type="switch"
                          id={`${data.sName}`}
                          name={`${data.sName}`}
                          onClick={() =>
                            warningWithConfirmMessage(
                              data,
                              data.eStatus === 'Y' ? 'Inactivate' : 'activate'
                            )
                          }
                          checked={data.eStatus === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                        />
                      </td>
                      <td>
                        <ul className="action-list mb-0 d-flex">
                          <li>
                            <Button
                              color="link"
                              className="view"
                              tag={Link}
                              to={`${updateLeague}/${data._id}`}
                            >
                              <img src={viewIcon} alt="View" />
                              View
                            </Button>
                          </li>
                          {((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE !== 'R') && (
                            <li>
                              <Button
                                color="link"
                                className="delete"
                                onClick={() => warningWithDeleteMessage(data._id, 'delete')}
                              >
                                <img src={deleteIcon} alt="Delete" />
                                Delete
                              </Button>
                            </li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  ))}
              </Fragment>
                )}
          </tbody>
        </table>
      </div>
      {!loading && list.length === 0 && (
        <div className="text-center">
          <h3>No League available</h3>
        </div>
      )}
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
      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className="text-center">
          <img className="info-icon" src={warningIcon} alt="check" />
          <h2>{`Are you sure you want to ${type} it?`}</h2>
          <Row className="row-12">
            <Col>
              <Button
                type="submit"
                className="theme-btn outline-btn full-btn"
                onClick={deleteId ? onCancel : toggleWarning}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type="submit"
                className="theme-btn danger-btn full-btn"
                onClick={deleteId ? onDelete : onStatusUpdate}
              >
                {' '}
                {deleteId ? 'Yes, Delete It' : `Yes, ${type} it`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

LeaguesList.defaultProps = {
  history: {},
  search: ''
}

LeaguesList.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.object,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  search: PropTypes.string,
  List: PropTypes.object,
  getList: PropTypes.func,
  updateLeague: PropTypes.string,
  UpdatedLeague: PropTypes.func,
  blankMessage: PropTypes.func,
  handleSportType: PropTypes.func,
  handleSearch: PropTypes.func,
  getGameCategory: PropTypes.func,
  selectGame: PropTypes.string,
  location: PropTypes.object,
  flag: PropTypes.bool,
  searchField: PropTypes.string,
  handleSearchBox: PropTypes.func,
  activeSports: PropTypes.array
}

LeaguesList.displayName = LeaguesList

export default connect(null, null, null, { forwardRef: true })(LeaguesList)
