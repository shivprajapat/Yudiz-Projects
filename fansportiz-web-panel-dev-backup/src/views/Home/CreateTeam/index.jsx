import React, { useState, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import LeagueHeader from '../components/LeagueHeader'
import Loading from '../../../component/Loading'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
const CreateTeamPage = lazy(() => import('./CreateTeam'))

function CreateTeam (props) {
  const [nextStep, setNextStep] = useState(true)
  const [VideoStream, setVideoStream] = useState(false)

  const location = useLocation()
  const { sportsType, sMatchId, sLeagueId, sShareCode } = useParams()
  const [searchParams] = useSearchParams()
  const homePage = searchParams.get('homePage')

  return (
    <>
      <LeagueHeader
        {...props}
        VideoStream={VideoStream}
        backTab={location?.state?.activeTab}
        goToBack={location.pathname !== `/create-team/${sportsType}/${sMatchId}/join/${sLeagueId}/private/${sShareCode}` ? `/upcoming-match/leagues/${sportsType}/${sMatchId}` : ''}
        nextStep={nextStep}
        notShowing
        search={homePage ? 'homePage=yes' : ''}
        setNextStep={setNextStep}
        setVideoStream={setVideoStream}
      />
      <Suspense fallback={<Loading />}>
        <CreateTeamPage {...props} nextStep={nextStep} setNextStep={setNextStep}/>
      </Suspense>
    </>
  )
}

CreateTeam.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      sportsType: PropTypes.string
    }),
    path: PropTypes.string
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.object
  })
}

export default CreateTeam
