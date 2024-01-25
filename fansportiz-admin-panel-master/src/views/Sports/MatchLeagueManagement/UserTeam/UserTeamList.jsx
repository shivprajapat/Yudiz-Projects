import React, {
  Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle
} from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import {
  Button, Modal, ModalBody, ModalHeader
} from 'reactstrap'
import { Link } from 'react-router-dom'
import SkeletonTable from '../../../../components/SkeletonTable'
import PropTypes from 'prop-types'
import { getUserTeamPlayerList } from '../../../../actions/matchleague'
import Loading from '../../../../components/Loading'

const UserTeamList = forwardRef((props, ref) => {
  const {
    List, getList, match
  } = props
  const dispatch = useDispatch()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [loader, setLoader] = useState(false)
  const [modalState, setModalState] = useState(false)
  const [totalScoredPoints, setTotalScoredPoints] = useState(0)
  const [totalCredits, setTotalCredits] = useState(0)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector((state) => state.auth.token)
  const resStatus = useSelector(state => state.team.resStatus)
  const resMessage = useSelector(state => state.team.resMessage)
  const userTeamPlayerList = useSelector(state => state.matchleague.userTeamPlayerList)
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

  function onRefresh () {
    if (match && match.params && match.params.id1 && match.params.id3) {
      getList(match.params.id1, match.params.id3)
      setLoading(true)
    }
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  return (
    <Fragment>
      {loader && <Loading />}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Username</th>
              <th>Team Name </th>
              <th>Match Name</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <SkeletonTable numberOfColumns={4} />
              : (
                <Fragment>
                  {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr key={data._id}>
                        <td>{i + 1}</td>
                        <td>{data.iUserId && adminPermission?.SYSTEM_USERS !== 'N' ? <Button color="link" className="view" tag={Link} to={(data.iUserId.eType && data.iUserId.eType === 'U') ? `/users/user-management/user-details/${data.iUserId._id}` : `/users/system-user/system-user-details/${data.iUserId._id}`}>{data?.iUserId?.sUsername || '-'}</Button> : data?.iUserId?.sUsername || '--'}</td>
                        <td>
                          <Button
                              color="link"
                              className="view"
                              onClick={() => {
                                dispatch(getUserTeamPlayerList(data._id, token))
                                setLoader(true)
                              }}
                            >{data && data.sName ? data.sName : '-'}
                          </Button>
                        </td>
                        <td>{data && data.iMatchId && data.iMatchId.sName ? data.iMatchId.sName : '-'}</td>
                      </tr>
                    ))
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
            <h3>No Team available</h3>
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
    </Fragment>
  )
})

UserTeamList.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object
}

UserTeamList.displayName = UserTeamList

export default connect(null, null, null, { forwardRef: true })(UserTeamList)
