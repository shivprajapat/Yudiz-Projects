import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import UserHeader from '../../../User/components/UserHeader'
import Loading from '../../../../component/Loading'
import { FormattedMessage } from 'react-intl'
import { useParams, useSearchParams } from 'react-router-dom'
const PrizeBreakupsPage = lazy(() => import('./PrizeBreakups'))

function PrizeBreakups (props) {
  const { sportsType, sMatchId } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')

  return (
    <>
      <UserHeader {...props} backURL={homePage ? `/create-contest/${sportsType}/${sMatchId}?homePage=yes` : `/create-contest/${sportsType}/${sMatchId}`} title={<FormattedMessage id='Winning_Breakup'/>} />
      <Suspense fallback={<Loading />}>
        <PrizeBreakupsPage {...props}/>
      </Suspense>
    </>
  )
}

PrizeBreakups.propTypes = {
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

export default PrizeBreakups
