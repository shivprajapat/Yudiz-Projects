import React, { lazy, Suspense } from 'react'
import { useLocation, useParams } from 'react-router-dom'

// Components
import UserHeader from '../../User/components/UserHeader'
// import PropTypes from 'prop-types'
import Loading from '../../../component/Loading'

const GameLeaderboardDetailPage = lazy(() => import('./GameLeaderboardDetail'))

function GameLeaderboardDetail (props) {
  const { id, detailsId } = useParams()
  const { state, pathname } = useLocation()

  const data = state?.data
  const leaderboardTitle = state?.leaderboardTitle

  return (
    <>
      <UserHeader
        {...props}
        backURL={detailsId
          ? {
              pathname: pathname === `/game/leader-board/details/${detailsId}/v1`
                ? `/game/leader-board/${detailsId}/v1`
                : `/game/leader-board/${detailsId}`,
              state: { data, leaderboardTitle }
            }
          : pathname === `/game/leader-board/${id}/v1`
            ? '/game/leader-board/v1'
            : `/game/leader-board?activeTab=${state.activeSport}&currSeries=${state.currSeries}`}
        title={leaderboardTitle}
      />
      <Suspense fallback={<Loading />}>
        <GameLeaderboardDetailPage {...props} />
      </Suspense>
    </>
  )
}

GameLeaderboardDetail.propTypes = {
}

export default GameLeaderboardDetail
