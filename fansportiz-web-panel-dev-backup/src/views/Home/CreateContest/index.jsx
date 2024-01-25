import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import UserHeader from '../../User/components/UserHeader'
// import { callEvent } from '../../../Analytics.js'
import Loading from '../../../component/Loading'
import { FormattedMessage } from 'react-intl'
import { useParams, useSearchParams } from 'react-router-dom'
const CreateContestPage = lazy(() => import('./CreateContest'))

function CreateContest (props) {
  // useEffect(() => {
  //   callEvent('create_private_contest', 'Create a Private Contest', location.pathname)
  // }, [])

  const { sMatchId, sportsType } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')

  return (
    <>
      <UserHeader
        {...props}
        backURL={homePage ? `/upcoming-match/leagues/${sportsType}/${sMatchId}?homePage=yes` : `/upcoming-match/leagues/${sportsType}/${sMatchId}`}
        createContest
        title={<FormattedMessage id='Create_contest' />}
      />
      <Suspense fallback={<Loading />}>
        <CreateContestPage {...props}/>
      </Suspense>
    </>
  )
}

CreateContest.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      sportsType: PropTypes.string,
      id: PropTypes.string
    })
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  })
}

export default CreateContest
