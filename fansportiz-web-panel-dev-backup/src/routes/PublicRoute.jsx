import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import useMaintenanceMode from '../api/settings/queries/useMaintenanceMode'
import useActiveSports from '../api/activeSports/queries/useActiveSports'
import Loading from '../component/Loading'

function PublicRoute ({ element: Component }) {
  const token = localStorage.getItem('Token')
  const { activeSport } = useActiveSports()
  const { data: Maintenance } = useMaintenanceMode()
  const { pathname } = useLocation()

  if (Maintenance?.bIsMaintenanceMode) return <Navigate to="/maintenance-mode" />
  if (!!token && !!activeSport) {
    return (
      <Navigate to={
        pathname.includes('/login') ||
        pathname.includes('/home/cricket/v1') ||
        pathname.includes('/home/football/v1') ||
        pathname.includes('/home/kabaddi/v1') ||
        pathname.includes('/home/basketball/v1') ||
        pathname.includes('/home/baseball/v1') ||
        pathname.includes('/home/hockey/v1') ||
        pathname.includes('/home/csgo/v1') ||
        pathname.includes('/upcoming-match/leagues/cricket/:id/v1') ||
        pathname.includes('/upcoming-match/leagues/basketball/:id/v1') ||
        pathname.includes('/upcoming-match/leagues/football/:id/v1') ||
        pathname.includes('/upcoming-match/leagues/kabaddi/:id/v1') ||
        pathname.includes('/matches/cricket/v1') ||
        pathname.includes('/matches/football/v1') ||
        pathname.includes('/matches/kabaddi/v1') ||
        pathname.includes('/matches/basketball/v1') ||
        pathname.includes('/matches/baseball/v1') ||
        pathname.includes('/matches/hockey/v1') ||
        pathname.includes('/matches/csgo/v1') ||
        pathname.includes('/game/leader-board/v1') ||
        pathname.includes('/profile/v1') ||
        pathname.includes('/more/v1') ||
        pathname.includes('/point-system/v1') ||
        pathname === '/sign-up' ||
        pathname === '/confirm-password' ||
        pathname === '/forgot-password' ||
        pathname === '/verification' ||
        pathname === '/'
          ? `/home/${activeSport}`
          : pathname}
      />
    )
  }
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired
}

export default PublicRoute
