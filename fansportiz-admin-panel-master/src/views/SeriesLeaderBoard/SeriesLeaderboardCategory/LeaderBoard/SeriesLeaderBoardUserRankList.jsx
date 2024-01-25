import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Link } from 'react-router-dom'
import {
  UncontrolledAlert, Button, Modal, ModalHeader, ModalBody
} from 'reactstrap'
import { useSelector, connect, useDispatch } from 'react-redux'
import qs from 'query-string'
import { useQueryState } from 'react-router-use-location-state'
import PropTypes from 'prop-types'
import SkeletonTable from '../../../../components/SkeletonTable'
import { getUrl } from '../../../../actions/url'
import PaginationComponent from '../../../../components/PaginationComponent'
import { alertClass, modalMessageFunc } from '../../../../helpers/helper'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'

const SeriesLeaderBoardUserRankList = forwardRef((props, ref) => {
  const {
    List, getList
  } = props

  const dispatch = useDispatch()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 entries')
  const [close, setClose] = useState(false)
  const [url, setUrl] = useState('')
  const [fullList, setFullList] = useState([])
  const [selectedFieldData, setSelectedFieldData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const previousProps = useRef({ List, resMessage, resStatus, start, offset }).current
  const [modalMessage, setModalMessage] = useState(false)
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const isFullList = useSelector(state => state.seriesLeaderBoard.isFullResponse)
  const adminPermission = useSelector(state => state.auth.adminPermission)
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
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, false)
    setLoading(true)
    if (!getUrlLink && !url) {
      dispatch(getUrl('media'))
    }
  }, [])

  useEffect(() => {
    !url && setUrl(getUrlLink)
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List?.data && (!isFullList)) {
        const userArrLength = List?.data?.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List?.data)
        setIndex(activePageNo)
        setTotal(List?.total || 0)
      } else if (List?.data && isFullList) {
        setFullList(List?.data || [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List?.data || []),
          fileName: 'Series LeaderBoard PrizeBreakup.xlsx'
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
        SeriesLeaderBoardUserRankList: props.location.search
      }
      : data.SeriesLeaderBoardUserRankList = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, false)
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
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, false)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function modalOpenFunc (data) {
    setSelectedFieldData(data)
    setIsModalOpen(true)
  }

  function oUserTernary (user) {
    if (user.oUser.eType === 'B') {
      return 'Bot'
    }
    return 'Normal'
  }

  function oUserButtonTernary (data) {
    if (data?.oUser?.eType === 'U') {
      return `/users/user-management/user-details/${data?.oUser?.iUserId}`
    }
    return `/users/system-user/system-user-details/${data?.oUser?.iUserId}`
  }

  const processExcelExportData = (data) =>
    data.map((user, index2) => {
      const username = user?.oUser?.sUsername || '--'
      const name = user?.oUser?.sName || '--'
      const userType = user?.oUser?.eType ? oUserTernary(user) : '--'
      const userRank = user?.nUserRank || 0
      const userScore = user?.nUserScore || 0
      const prizeDistribution = (user.nPrize || '0') + (user.nBonusWin ? '(Bonus -' + Number(user.nBonusWin).toFixed(2) + ')' : '') + (user.aExtraWin && user.aExtraWin[0]?.sInfo ? '(Extra -' + user.aExtraWin[0].sInfo + ')' : '')
      return {
        ...user,
        no: index2 + 1,
        username,
        name,
        userType,
        userRank,
        userScore,
        prizeDistribution
      }
    })

  async function onExport () {
    const startFrom = 0
    getList(startFrom, offset, true)
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <ExcelExport
        data={fullList}
        fileName="Series LeaderBoard Prize Breakup.xlsx"
        ref={exporter}
      >
        <ExcelExportColumn field="name" title="Name" />
        <ExcelExportColumn field="username" title="Username" />
        <ExcelExportColumn field="userType" title="User Type" />
        <ExcelExportColumn field="userRank" title="User Rank" />
        <ExcelExportColumn field="userScore" title="User Score" />
        <ExcelExportColumn field="prizeDistribution" title="Win Prize" />
      </ExcelExport>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Profile pic</th>
              <th>Username</th>
              <th>Rank</th>
              <th>User Score</th>
              <th>Prize</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={6} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={i}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>{data.oUser && data.oUser.sProPic
                            ? <img src={url + data.oUser.sProPic} className="theme-image" alt="No Image" />
                            : ' No Image '
                            }
                          </td>
                          <td>{(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N')) && data?.oUser?.eType && data?.oUser?.iUserId
                            ? <Button color="link" className="view" tag={Link} to={oUserButtonTernary(data)}>{data?.oUser?.sUsername || '--'}</Button>
                            : data?.oUser?.sUsername || '--'}</td>
                          <td>{data.nUserRank ? data.nUserRank : '-'}</td>
                          <td>{data.nUserScore ? data.nUserScore : '-'}</td>
                          <td><Button color="link" className="view" onClick={() => modalOpenFunc(data)}>{data.nPrize || 0}{data.nBonusWin ? '(Bonus -' + Number(data.nBonusWin).toFixed(2) + ')' : ''}{data.aExtraWin && data.aExtraWin[0]?.sInfo ? '(Extra -' + data.aExtraWin[0].sInfo + ')' : ''}</Button></td>
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
            <h3>Series leader board user rank list not available</h3>
          </div>
        )
      }

      <Modal isOpen={isModalOpen} toggle={toggleModal} className='modal-confirm-bot'>
        <ModalHeader toggle={toggleModal}>Prize</ModalHeader>
        <ModalBody>
          <div className="table-responsive">
            <table className="table">
              <tr>
                <td>Cash Win</td>
                <td><b>{selectedFieldData?.nPrize || 0}</b></td>
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
    </Fragment>
  )
})

SeriesLeaderBoardUserRankList.propTypes = {
  List: PropTypes.array,
  getList: PropTypes.func,
  search: PropTypes.string,
  flag: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object
}

SeriesLeaderBoardUserRankList.displayName = SeriesLeaderBoardUserRankList

export default connect(null, null, null, { forwardRef: true })(SeriesLeaderBoardUserRankList)
