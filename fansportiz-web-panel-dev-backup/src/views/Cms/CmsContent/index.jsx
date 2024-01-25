import React, { useState, lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'

const CMSContentPage = lazy(() => import('./CMSContentPage'))

function CMSContent () {
  const [title, setTitle] = useState('')
  const token = localStorage.getItem('Token')

  const location = useLocation()

  function backUrlFunc () {
    if (token) {
      return '/more'
    }
    if (location.pathname.includes('/v1')) {
      return '/more/v1'
    }
    return '/sign-up'
  }

  return (
    <>
      <UserHeader
        backURL={backUrlFunc()}
        title={title}
      />
      <Suspense fallback={<Loading />}>
        <CMSContentPage setTitle={setTitle} />
      </Suspense>
    </>
  )
}

export default CMSContent
