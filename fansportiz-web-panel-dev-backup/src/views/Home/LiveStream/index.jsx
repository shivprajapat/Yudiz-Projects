import React, { lazy, Suspense } from 'react'
import UserHeader from '../../User/components/UserHeader'
import HomeFooter from '../components/HomeFooter'
import Loading from '../../../component/Loading'
import useActiveSports from '../../../api/activeSports/queries/useActiveSports'
const LiveStreamList = lazy(() => import('./LiveStreamList'))

function Home (props) {
  const { activeSport } = useActiveSports()

  return (
    <>
      <UserHeader {...props} backURL={`/home/${activeSport}`} title="Matches"/>
      <Suspense fallback={<Loading />}>
        <LiveStreamList {...props} />
      </Suspense>
      <HomeFooter {...props}/>
    </>
  )
}

export default Home
