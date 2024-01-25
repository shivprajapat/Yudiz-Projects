import React, {
  useState, useEffect, Fragment, useRef
} from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, ModalBody, Row, Col, UncontrolledAlert
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import SkeletonTable from '../../../components/SkeletonTable'
import viewIcon from '../../../assets/images/view-icon.svg'
import deleteIcon from '../../../assets/images/delete-icon.svg'
import warningIcon from '../../../assets/images/warning-icon.svg'
import { deleteSeriesCategory } from '../../../actions/seriesLeaderBoard'
import { alertClass, modalMessageFunc } from '../../../helpers/helper'

function SeriesLeaderBoardCategory (props) {
  const { list, getList, updateSeriesCategory, prizeBreakupUrl, leaderBoardUrl, match, prizeCalculateFlag, winPrizeCalculateFlag, leagueCountFunc } = props
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const dispatch = useDispatch()
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const [deleteId, setDeleteId] = useState('')
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const previousProps = useRef({ list, resMessage, resStatus }).current

  useEffect(() => {
    if (!prizeCalculateFlag && !winPrizeCalculateFlag) {
      getList()
      leagueCountFunc()
    }
  }, [prizeCalculateFlag, winPrizeCalculateFlag])

  useEffect(() => {
    if (props.location.state) {
      if (props.location.state.message) {
        setMessage(props.location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      props.history.replace()
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.list !== list) {
      if (list) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.list = list
    }
  }, [list])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (!prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList()
          }
          // leagueCountFunc()
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
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
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        SeriesLeaderBoard: props.location.search
      }
      : data.SeriesLeaderBoardCategory = props.location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [props.location.search])

  // to open a modal to ask for delete operation
  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  // dispatch action to delete the series category
  function onDelete () {
    if (deleteId && token && match && match.params && match.params.id) {
      dispatch(deleteSeriesCategory(match.params.id, deleteId, token))
    }
  }

  function onCancel () {
    toggleWarning()
  }

  return (
    <Fragment>
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass(status, close)}>{message}</UncontrolledAlert>
        )
      }
      <div className="table-responsive">
        <table className="match-league-table">
          <thead>
            <tr>
              <th> Sr No. </th>
              <th> Name </th>
              <th> Max Rank </th>
              <th> First Prize </th>
              <th> Total Payout</th>
              <th> Actions  </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={6} />
              : (
                <Fragment>
                  {!list && <SkeletonTable numberOfColumns={6} />}
                  {
                    list && list.length !== 0 && list.map((data, index) => (
                      <tr key={data._id} className={data.bCancelled ? 'cancelled-raw' : data.bWinningDone ? 'priceDone-raw' : ''}>
                        <td>{index + 1}</td>
                        <td>
                          {data.sName}
                        </td>
                        <td>
                          {data.nMaxRank}
                        </td>
                        <td>
                          {data.sFirstPrize}
                        </td>
                        <td>
                          {data.nTotalPayout}
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button color="link" className="view" tag={Link} to={`${updateSeriesCategory}/${data._id}`}>
                                <img src={viewIcon} alt="View" />
                                View
                              </Button>
                            </li>
                            <li>
                              <Button color="link" className="view" tag={Link} to={`${prizeBreakupUrl}/${data._id}`}>
                                <img src={viewIcon} alt="View" />
                                Prize Breakup
                              </Button>
                            </li>
                            <li>
                              <Button color="link" className="view" tag={Link} to={`${leaderBoardUrl}/${data._id}`}>
                                <img src={viewIcon} alt="View" />
                                Leader Board
                              </Button>
                            </li>
                            {((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')) &&
                              (
                              <li>
                                <Button color="link" className="delete" onClick={() => warningWithDeleteMessage(data._id)}>
                                  <img src={deleteIcon} alt="Delete" />
                                  Delete
                              </Button>
                              </li>
                              )}
                          </ul>
                        </td>
                      </tr>
                    ))
                  }
                </Fragment>
                )
            }
          </tbody>
        </table>
      </div>
      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className="text-center">
          <img className="info-icon" src={warningIcon} alt="check" />
          <h2>{'Are you sure you want to Delete it?'}</h2>
          <Row className="row-12">
            <Col>
              <Button type="submit" className="theme-btn outline-btn full-btn" onClick={onCancel}>Cancel</Button>
            </Col>
            <Col>
              <Button type="submit" className="theme-btn danger-btn full-btn" onClick={onDelete}> Yes, Delete It</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {
        !loading && list && list.length === 0 &&
        (
          <div className="text-center">
            <h3>No Series LeaderBoard Category is available</h3>
          </div>
        )
      }
    </Fragment>
  )
}

SeriesLeaderBoardCategory.propTypes = {
  list: PropTypes.array,
  getList: PropTypes.func,
  leagueCountFunc: PropTypes.func,
  updateSeriesCategory: PropTypes.string,
  prizeBreakupUrl: PropTypes.string,
  leaderBoardUrl: PropTypes.string,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  prizeCalculateFlag: PropTypes.bool,
  winPrizeCalculateFlag: PropTypes.bool
}

export default SeriesLeaderBoardCategory
