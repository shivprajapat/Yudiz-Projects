import React, {
  useState, Fragment, useEffect, useRef, forwardRef, useImperativeHandle
} from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button, FormGroup, CustomInput, Modal, ModalBody, Row, Col, UncontrolledAlert, Input, ModalHeader, Label
} from 'reactstrap'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import viewIcon from '../../../assets/images/view-icon.svg'
import sortIcon from '../../../assets/images/sorting-icon.svg'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { getUrl } from '../../../actions/url'
import { deleteMatchPlayer, getMatchPlayerScorePoint, updateMPScorePoint } from '../../../actions/matchplayer'
import Loading from '../../../components/Loading'
import SkeletonTable from '../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import right from '../../../assets/images/right-icon.svg'
import PaginationComponent from '../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

const MatchPlayerComponent = forwardRef((props, ref) => {
  const {
    List, getList, flag, editLink, UpdateMatchPlayer, playerRoleList, MatchDetails
  } = props
  const searchProp = props.search
  const [start, setStart] = useState(0)
  const [playerRole, setPlayerRole] = useState('')
  const [credits, setCredits] = useState(0)
  const [isEditableField, setIsEditableField] = useState(false)
  const [fieldType, setFieldType] = useState('')
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'dsc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort, setSort] = useQueryState('sortBy', 'dCreatedAt')
  const [role, setRole] = useQueryState('role', '')
  const [team, setTeam] = useQueryState('team', '')
  const [teams, setTeams] = useState([])
  const [nameOrder, setNameOrder] = useState('asc')
  const [url, setUrl] = useState('')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [deleteId, setDeleteId] = useState('')
  const [listLength, setListLength] = useState('10 entries')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const [matchPlayerId, setMatchPlayerId] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => setModalOpen(!isModalOpen)
  const [aScorePoint, setaScorePoint] = useState([])
  const [seasonPoints, setSeasonPoints] = useState('')
  const matchPlayerScoreList = useSelector(state => state.matchplayer.matchPlayerScorePointList)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.matchplayer.resStatus)
  const resMessage = useSelector(state => state.matchplayer.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    List, searchProp, resMessage, resStatus, role, team, start, offset, matchPlayerScoreList
  }).current
  const paginationFlag = useRef(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const toggle = (data, type) => {
    setIsEditableField(true)
    setFieldType(type)
    setSelectedData(data)
    if (type === 'Role') {
      setPlayerRole(data.eRole)
    } else if (type === 'Credits') {
      setCredits(data.nFantasyCredit)
    } else {
      setSeasonPoints(data.nSeasonPoints)
    }
  }

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
    const obj = qs.parse(props.location.search)
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} entries`)
      }
      if (obj.order) {
        order = obj.order
        setOrder(order)
      }
    }
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, role, team)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps.MatchDetails !== MatchDetails) {
      if (MatchDetails) {
        const arr = []
        const team1 = {
          sName: MatchDetails?.oHomeTeam?.sName,
          iTeamId: MatchDetails?.oHomeTeam?.iTeamId
        }
        arr.push(team1)
        const team2 = {
          sName: MatchDetails?.oAwayTeam?.sName,
          iTeamId: MatchDetails?.oAwayTeam?.iTeamId
        }
        arr.push(team2)
        setTeams(arr)
      }
    }
    return () => {
      previousProps.MatchDetails = MatchDetails
    }
  }, [MatchDetails])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

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
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : []
    data === {}
      ? data = {
        MatchPlayerManagement: props.location.search
      }
      : data.MatchPlayerManagement = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search, role, team)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search, role, team)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(activePageNo)
          }
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
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
    if (previousProps.role !== role) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, role, team)
      setPageNo(1)
    }
    return () => {
      previousProps.role = role
    }
  }, [role])

  useEffect(() => {
    if (previousProps.team !== team) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, role, team)
      setPageNo(1)
    }
    return () => {
      previousProps.team = team
    }
  }, [team])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, role, team)
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

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, search, role, team)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onRefresh () {
    const startFrom = 0
    const limit = offset
    getList(startFrom, limit, sort, order, search, role, team)
    setLoading(true)
    setPageNo(1)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  function onSorting (sortingBy) {
    const Order = sortingBy === 'sName' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, role, team)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'sName') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, role, team)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'sName') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function handleInputChange (event, type) {
    switch (type) {
      case 'Role':
        setPlayerRole(event.target.value)
        break
      case 'Credits':
        if (parseFloat(event.target.value) || !event.target.value) {
          setCredits(event.target.value)
        }
        break
      case 'SeasonPoints':
        if (parseFloat(event.target.value) || !event.target.value) {
          setSeasonPoints(event.target.value)
        }
        break
      default:
        break
    }
  }

  // update status of the match player
  function statusUpdate (data) {
    const Show = data.bShow === true ? 'N' : 'Y'
    UpdateMatchPlayer(
      data.sName,
      data.iPlayerId,
      data.sImage,
      data.eRole,
      data.nFantasyCredit,
      data.nScoredPoints,
      data.nSeasonPoints,
      '',
      Show,
      data.eStatus,
      data._id
    )
  }

  // update status of the match player
  function statusUpdateFrontend (data) {
    const status = data.eStatus === 'Y' ? 'N' : 'Y'
    UpdateMatchPlayer(
      data.sName,
      data.iPlayerId,
      data.sImage,
      data.eRole,
      data.nFantasyCredit,
      data.nScoredPoints,
      data.nSeasonPoints,
      '',
      data.bShow,
      status,
      data._id
    )
  }

  function onStatusUpdate (e, field) {
    e.preventDefault()
    if (field === 'roleAndCredits') {
      UpdateMatchPlayer(
        selectedData.sName,
        selectedData.iPlayerId,
        selectedData.sImage,
        playerRole || selectedData.eRole,
        credits || selectedData.nFantasyCredit,
        selectedData.nScoredPoints,
        seasonPoints || selectedData.nSeasonPoints,
        '',
        selectedData.bShow === true ? 'Y' : 'N',
        selectedData.eStatus === 'Y' ? 'Y' : 'N',
        selectedData._id
      )
      setCredits('')
      setPlayerRole('')
      setSeasonPoints('')
      setIsEditableField(false)
      setFieldType('')
    }
    setLoading(true)
  }

  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deleteMatchPlayer(deleteId, MatchDetails?._id, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onInputChange (e, type) {
    if (type === 'Role') {
      setRole(e.target.value)
    } else if (type === 'Team') {
      setTeam(e.target.value)
    }
  }

  useEffect(() => {
    if (matchPlayerScoreList) {
      const arr = []
      if (matchPlayerScoreList.length !== 0) {
        matchPlayerScoreList.map((data) => {
          const obj = {
            _id: data._id,
            sName: data.sName,
            nScoredPoints: data.nScoredPoints
          }
          arr.push(obj)
          return arr
        })
        setaScorePoint(arr)
      }
      setLoading(false)
    }
    return () => {
      previousProps.matchPlayerScoreList = matchPlayerScoreList
    }
  }, [matchPlayerScoreList])

  function onEdit (e) {
    e.preventDefault()
    setModalOpen(false)
    dispatch(updateMPScorePoint(aScorePoint, matchPlayerId, token))
    setLoading(true)
  }

  function onChangeScorePoint (event, ID) {
    const arr = [...aScorePoint]
    const i = arr.findIndex(data => data._id === ID)
    if (event.target.value && parseFloat(event.target.value)) {
      arr[i] = { ...arr[i], nScoredPoints: parseInt(event.target.value) }
      setaScorePoint(arr)
    } else {
      arr[i] = { ...arr[i], nScoredPoints: parseInt(0) }
      setaScorePoint(arr)
    }
  }

  function openModalFunc (id) {
    dispatch(getMatchPlayerScorePoint(token, id))
    setMatchPlayerId(id)
    setModalOpen(true)
  }

  return (
    <Fragment>
      <div className='table-responsive'>
        {
          modalMessage && message && (
            <UncontrolledAlert color='primary' className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        {loading && <Loading />}
        <table className='table'>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Image</th>
              <th>
                <span className='d-inline-block align-middle'>Player Name</span>
                <Button color='link' className='sort-btn' onClick={() => onSorting('sName')}><img src={sortIcon} className='m-0' alt='sorting' /></Button>
              </th>
              <th>Score Point</th>
              <th>Season Point</th>
              <th>
                <div>Role</div>
                <CustomInput
                  type='select'
                  name='Role'
                  id='Role'
                  value={role}
                  className='mt-2'
                  onChange={(event) => onInputChange(event, 'Role')}
                >
                  <option value=''>All</option>

                {playerRoleList && playerRoleList.length !== 0 && playerRoleList.map((data, i) => {
                  return (
                    <option key={data.sName} value={data.sName}>{data.sFullName}</option>
                  )
                })
              }
                </CustomInput>
              </th>
              <th>Credits</th>
              <th>
                <div>Team</div>
                  <CustomInput
                    type='select'
                    name='Team'
                    id='Team'
                    value={team}
                    className='mt-2'
                    onChange={(event) => onInputChange(event, 'Team')}
                  >
                    <option value=''>All</option>

                  {teams && teams.length !== 0 && teams.map(data => {
                    return (
                      <option key={data.iTeamId} value={data.iTeamId}>{data.sName}</option>
                    )
                  })
                }
                </CustomInput>
              </th>
              <th>Show in Frontend</th>
              <th>In Lineups</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={10} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <Fragment key={data._id}>
                        <tr key={data._id}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>{data.sImage ? <img src={url + data.sImage} className='theme-image' alt='No Image' /> : ' No Image '}</td>
                          <td>{data.sName}</td>
                          <td><Button onClick={() => openModalFunc(data._id)} color='link'>{data.nScoredPoints ? data.nScoredPoints : ' 0 '}</Button></td>
                          <td className='editable-text'>
                          {isEditableField && fieldType === 'SeasonPoints' && data._id === selectedData._id
                            ? <FormGroup>
                              <div className='d-flex justify-content-start'>
                                <Input className='editable-text-field custominput' onChange={(e) => handleInputChange(e, 'SeasonPoints')} value={seasonPoints}></Input>
                                <img src={right} onClick={(e) => onStatusUpdate(e, 'roleAndCredits')} hidden={!seasonPoints}></img>
                              </div>
                            </FormGroup>
                            : <div onClick={() => toggle(data, 'SeasonPoints')}>{data.nSeasonPoints}</div>}
                          </td>
                          <td className='editable-select'>
                          {isEditableField && fieldType === 'Role' && data._id === selectedData._id
                            ? <div className='d-flex justify-content-start'>
                              <CustomInput
                                type='select'
                                name='Role'
                                id='Role'
                                value={playerRole}
                                className='editable-select'
                                onChange={(e) => handleInputChange(e, 'Role')}
                              >
                                {playerRoleList && playerRoleList.length !== 0 && playerRoleList.map(player => {
                                  return (
                                    <option key={player.sName} value={player.sName}>{player.sFullName}</option>
                                  )
                                })}
                              </CustomInput>
                              <img src={right} onClick={(e) => onStatusUpdate(e, 'roleAndCredits')}></img>
                            </div>
                            : <div onClick={() => toggle(data, 'Role')}>
                              {data.eRole === 'ALLR'
                                ? 'All Rounder'
                                : data.eRole === 'BATS'
                                  ? 'Batsman'
                                  : data.eRole === 'BWL'
                                    ? 'Bowler'
                                    : data.eRole === 'WK'
                                      ? 'Wicket Keeper'
                                      : data.eRole === 'FWD'
                                        ? 'Forwards'
                                        : data.eRole === 'GK'
                                          ? 'Goal Keeper'
                                          : data.eRole === 'DEF'
                                            ? 'Defender'
                                            : data.eRole === 'RAID'
                                              ? 'Raider'
                                              : data.eRole === 'MID'
                                                ? 'Mid fielders'
                                                : data.eRole === 'PG'
                                                  ? 'Point-Gaurd'
                                                  : data.eRole === 'SG'
                                                    ? 'Shooting-Gaurd'
                                                    : data.eRole === 'SF'
                                                      ? 'Small-Forwards'
                                                      : data.eRole === 'PF'
                                                        ? 'Power-Forwards'
                                                        : data.eRole === 'C'
                                                          ? 'Centre'
                                                          : data.eRole === 'IF' ? 'Infielder' : data.eRole === 'OF' ? 'Outfielder' : data.eRole === 'P' ? 'Pitcher' : data.eRole === 'CT' ? 'Catcher' : '--'}</div>}
                          </td>
                          <td className='editable-text'>
                          {isEditableField && fieldType === 'Credits' && data._id === selectedData._id
                            ? <FormGroup>
                              <div className='d-flex justify-content-start'>
                                <Input className='editable-text-field custominput' onChange={(e) => handleInputChange(e, 'Credits')} value={credits}></Input>
                                <img src={right} onClick={(e) => onStatusUpdate(e, 'roleAndCredits')} hidden={!credits}></img>
                              </div>
                            </FormGroup>
                            : <div onClick={() => toggle(data, 'Credits')}>{data.nFantasyCredit}</div>}
                          </td>
                          <td>{data.sTeamName}</td>
                          <td className='success-text'>
                            <CustomInput
                              type='switch'
                              id={`switchSIF${i + 1}`}
                              name={`switchSIF${i + 1}`}
                              onClick={() => statusUpdateFrontend(data)}
                              defaultChecked={data.eStatus === 'Y'}
                              disabled={adminPermission?.MATCHPLAYER === 'R'}
                            />
                          </td>
                          <td className='success-text'>
                            <CustomInput
                              type='switch'
                              id={`switch${i + 2}`}
                              name={`switch${i + 2}`}
                              onClick={() => statusUpdate(data)}
                              defaultChecked={data.bShow}
                              disabled={adminPermission?.MATCHPLAYER === 'R'}
                            />
                          </td>
                          <td>
                            <ul className='action-list mb-0 d-flex'>
                              <li>
                                <Link color='link' className='view' to={`${editLink}/${data._id}`}>
                                  <img src={viewIcon} alt='View' />
                                  View
                                </Link>
                              </li>
                              <li>
                                {
                                  ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'R')) && (
                                    <Button color='link' className='delete' onClick={() => warningWithDeleteMessage(data._id)}>
                                      <img src={deleteIcon} alt='Delete' />
                                      Delete
                                    </Button>
                                  )
                                }
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </Fragment>
                    ))
                  }
                </Fragment>)
            }
          </tbody>
        </table>
      </div>
      {
        !loading && list.length === 0 && (
          <div className='text-center'>
            <h3>No Match Player available</h3>
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

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Score Point</ModalHeader>
        <ModalBody>
          <Row className="row-12">
            {
              aScorePoint && aScorePoint.length !== 0 && aScorePoint.map((data, i) => (
                <Col lg={4} md={6} key={data.sName}>
                  <FormGroup>
                    <Label for="runScore">{data.sName}</Label>
                    <Input
                      type="text"
                      id={data.sKey}
                      placeholder={`Enter ${data.sName}`}
                      value={data.nScoredPoints}
                      onChange={event => onChangeScorePoint(event, data._id)}
                      disabled={adminPermission?.SCORE_POINT === 'R'}
                    />
                  </FormGroup>
                </Col>
              ))
            }
          </Row>
          <div className="footer-btn text-center">
            {
              ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'R')) &&
              (
                <Button
                  className="theme-btn"
                  onClick={onEdit}
                >
                  Save Changes
                </Button>
              )
            }
          </div>
        </ModalBody>
      </Modal>

      <Modal isOpen={modalWarning} toggle={toggleWarning} className='modal-confirm'>
        <ModalBody className='text-center'>
          <img className='info-icon' src={warningIcon} alt='check' />
          <h2>Are you sure you want to delete it?</h2>
          <Row className='row-12'>
            <Col>
              <Button type='submit' className='theme-btn outline-btn full-btn' onClick={onCancel}>Cancel</Button>
            </Col>
            {
              <Col>
                <Button type='submit' className='theme-btn danger-btn full-btn' onClick={onDelete}>Yes, Delete It</Button>
              </Col>
            }
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

MatchPlayerComponent.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  editLink: PropTypes.string,
  UpdateMatchPlayer: PropTypes.func,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  playerRoleList: PropTypes.array,
  MatchDetails: PropTypes.object
}

MatchPlayerComponent.displayName = MatchPlayerComponent

export default connect(null, null, null, { forwardRef: true })(MatchPlayerComponent)
