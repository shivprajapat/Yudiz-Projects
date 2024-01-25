import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

// Components
import HomeHeader from '../../Home/components/HomeHeader'
import HomeFooter from '../../Home/components/HomeFooter'
import Loading from '../../../component/Loading'

const MorePage = lazy(() => import('./More'))

function More (props) {
  const { match } = props
  const location = useLocation()
  return (
    <>
      <HomeHeader active />
      <Suspense fallback={<Loading />}>
        <MorePage match={match} />
      </Suspense>
      <HomeFooter isPublic={location?.pathname === '/more/v1'} match={match} />
    </>
  )
}

More.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired
}

export default More
