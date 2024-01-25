import React, {
  Fragment, useState, useEffect, useRef, useImperativeHandle, forwardRef
} from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalHeader
} from 'reactstrap'
import SkeletonTable from '../../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import { getUserTeamPlayerList } from '../../../../actions/matchleague'
import Loading from '../../../../components/Loading'

const UserLeagueList = forwardRef((props, ref) => {
  const { List, getList, match } = props
  const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [modalState, setModalState] = useState(false)
  const [totalScoredPoints, setTotalScoredPoints] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)
  const token = useSelector((state) => state.auth.token)
  const resStatus = useSelector(state => state.league.resStatus)
  const resMessage = useSelector(state => state.league.resMessage)
  const userTeamPlayerList = useSelector(state => state.matchleague.userTeamPlayerList)
  const [selectedFieldData, setSelectedFieldData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const previousProps = useRef({ List, resMessage, resStatus, userTeamPlayerList }).current

  useEffect(() => {
    if (match && match.params && match.params.id1 && match.params.id3) {
      getList(match.params.id1, match.params.id3)
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        setList(List)
        setLoading(false)
      }
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  function onRefresh () {
    if (match && match.params && match.params.id1 && match.params.id3) {
      getList(match.params.id1, match.params.id3)
      setLoading(true)
    }
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

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
        setLoader(false)
      }
    }
    return () => {
      previousProps.userTeamPlayerList = userTeamPlayerList
    }
  }, [userTeamPlayerList])
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function modalOpenFunc (data) {
    setSelectedFieldData(data)
    setIsModalOpen(true)
  }

  return (
    <Fragment>
      {loader && <Loading />}
      <div className="table-responsive">
        <table className="match-league-table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Team Name </th>
              <th>League Name</th>
              <th>Pool Prize</th>
              <th>Total Payout</th>
              <th>Rank</th>
              <th>Prize</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={7} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={data._id}
                          className={data.bCancelled ? 'cancelled-raw' : data.bWinDistributed ? 'priceDone-raw' : ''}
                        >
                          <td>{i + 1}</td>
                          <td>
                            <Button
                              color="link"
                              className="view"
                              onClick={() => {
                                dispatch(getUserTeamPlayerList(data.iUserTeamId, token))
                                setLoader(true)
                              }}
                            >
                              {data && data.sTeamName ? data.sTeamName : '-'}
                            </Button>
                          </td>
                          <td>{data && data.sLeagueName ? data.sLeagueName : '-'}</td>
                          <td>
                            <Badge
                              color={`${data.nPoolPrice ? 'success' : 'danger'}`}
                              className='ml-2'
                            >
                              {data.nPoolPrice ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                          <td>{data && data.nTotalPayout ? data.nTotalPayout : '-'}</td>
                          <td>{data && data.nRank ? data.nRank : '-'}</td>
                          <td><Button color="link" className="view" onClick={() => modalOpenFunc(data)}>{data.nPrice || 0}{data.nBonusWin ? '(Bonus -' + Number(data.nBonusWin).toFixed(2) + ')' : ''}{data.aExtraWin && data.aExtraWin[0]?.sInfo ? '(Extra -' + data.aExtraWin[0].sInfo + ')' : ''}</Button></td>
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
            <h3>No User Leagues available</h3>
          </div>
        )
      }
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
            {userTeamPlayerList && userTeamPlayerList.aPlayers && userTeamPlayerList.aPlayers.map((data, index) =>
            <tr key={index}>
              <td>{data.iMatchPlayerId && data.iMatchPlayerId.sName ? data.iMatchPlayerId.sName : '-'}
              <span className='danger-text'>{userTeamPlayerList.iCaptainId === data.iMatchPlayerId._id ? '(C)' : userTeamPlayerList.iViceCaptainId === data.iMatchPlayerId._id ? '(VC)' : ''}</span></td>
              <td>{data.iMatchPlayerId && data.iMatchPlayerId.eRole &&
                data.iMatchPlayerId.eRole === 'ALLR'
                ? 'All Rounder'
                : data.iMatchPlayerId.eRole === 'BATS'
                  ? 'Batsman'
                  : data.iMatchPlayerId.eRole === 'BWL'
                    ? 'Bowler'
                    : data.iMatchPlayerId.eRole === 'WK'
                      ? 'Wicket Keeper'
                      : data.iMatchPlayerId.eRole === 'FWD'
                        ? 'Forwards'
                        : data.iMatchPlayerId.eRole === 'GK'
                          ? 'Goal Keeper'
                          : data.iMatchPlayerId.eRole === 'DEF'
                            ? 'Defender'
                            : data.iMatchPlayerId.eRole === 'RAID'
                              ? 'Raider'
                              : data.iMatchPlayerId.eRole === 'MID'
                                ? 'Mid fielders'
                                : data.iMatchPlayerId.eRole === 'PG'
                                  ? 'Point-Gaurd'
                                  : data.iMatchPlayerId.eRole === 'SG'
                                    ? 'Shooting-Gaurd'
                                    : data.iMatchPlayerId.eRole === 'SF'
                                      ? 'Small-Forwards'
                                      : data.iMatchPlayerId.eRole === 'PF'
                                        ? 'Power-Forwards'
                                        : data.iMatchPlayerId.eRole === 'C'
                                          ? 'Centre'
                                          : data.iMatchPlayerId.eRole === 'IF' ? 'Infielder' : data.iMatchPlayerId.eRole === 'OF' ? 'Outfielder' : data.iMatchPlayerId.eRole === 'P' ? 'Pitcher' : data.iMatchPlayerId.eRole === 'CT' ? 'Catcher' : '--'}
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

UserLeagueList.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  match: PropTypes.object
}

UserLeagueList.displayName = UserLeagueList

export default connect(null, null, null, { forwardRef: true })(UserLeagueList)
