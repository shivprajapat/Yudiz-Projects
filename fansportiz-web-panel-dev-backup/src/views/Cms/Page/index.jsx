import React, {
  useEffect, useState, lazy, Suspense
} from 'react'
// import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

// Components
import UserHeader from '../../User/components/UserHeader'
import Loading from '../../../component/Loading'
import { useLocation } from 'react-router-dom'

const PrivacyPolicyPage = lazy(() => import('./OtherContentPage'))

function Page () {
  const { state } = useLocation()
  const [contentDetails, setContentDetails] = useState('')
  const [bannerImg, setBannerImg] = useState('')

  useEffect(() => {
    if (state?.contentDetails) {
      setContentDetails(state.contentDetails)
      setBannerImg(state.image)
    }
  }, [])

  return (
    <>
      <UserHeader title={<FormattedMessage id="Refer_a_friend" />} />
      <Suspense fallback={<Loading />}>
        <PrivacyPolicyPage bannerImg={bannerImg} contentDetails={contentDetails} />
      </Suspense>
    </>
  )
}

Page.propTypes = {
}

export default Page
