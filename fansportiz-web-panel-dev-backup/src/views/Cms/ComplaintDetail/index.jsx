import React, { lazy, Suspense, useState } from 'react'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'

const ComplaintDetail = lazy(() => import('./ComplainDetail'))

function PointSystem (props) {
  const [title, setTitle] = useState('')

  const getTitle = (heading) => {
    setTitle(heading)
  }

  return (
    <>
      <UserHeader {...props} backURL="/complaints" title={title} />
      <Suspense fallback={<Loading />}>
        <ComplaintDetail getTitle={getTitle} {...props} />
      </Suspense>
    </>
  )
}

export default PointSystem
