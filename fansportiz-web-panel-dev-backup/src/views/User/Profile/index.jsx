import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import HomeFooter from '../../Home/components/HomeFooter'
import HomeHeader from '../../Home/components/HomeHeader'
import Loading from '../../../component/Loading'
import { matchPath, useLocation } from 'react-router-dom'
const ProfilePage = lazy(() => import('./Profile'))

function Profile (props) {
  const { pathname } = useLocation()

  return (
    <>
      <HomeHeader active={true} />
      <Suspense fallback={<Loading />}>
        < ProfilePage {...props}/>
      </Suspense>
      <HomeFooter {...props} isPublic={matchPath('/profile/v1', pathname)}/>
    </>
  )
}

Profile.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string
  })
}

export default Profile
