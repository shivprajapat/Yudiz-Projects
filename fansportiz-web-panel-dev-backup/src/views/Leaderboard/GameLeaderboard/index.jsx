import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

// Components
import HomeHeader from '../../Home/components/HomeHeader'
import HomeFooter from '../../Home/components/HomeFooter'
import Loading from '../../../component/Loading'

const GameLeaderboardPage = lazy(() => import('./GameLeaderboard'))

function GameLeaderboard (props) {
  const location = useLocation()
  return (
    <>
      <HomeHeader {...props} active/>
      <Suspense fallback={<Loading />}>
        <GameLeaderboardPage {...props} />
      </Suspense>
      <HomeFooter {...props} isPublic={location.pathname === '/game/leader-board/v1'}/>
    </>
  )
}

GameLeaderboard.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string
  })
}

export default GameLeaderboard
