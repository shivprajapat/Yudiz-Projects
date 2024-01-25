import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { fixtureLoader } from '@shared/libs/allLoader'

const FixturesItems = dynamic(() => import('@shared-components/series/fixturesItems'), { loading: () => fixtureLoader() })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const MatchDetailUpcoming = ({ data }) => {
  return (
    <>
      {data?.map((fixture, index) => {
        return (
          <React.Fragment key={index}>
            {index === 5 && (
              <Ads
                id="div-ad-gpt-138639789-1660147282-2"
                adIdDesktop="Crictracker2022_Desktop_LiveScore_MID_728x90"
                adIdMobile="Crictracker2022_Mobile_LiveScore_MID_300x250"
                dimensionDesktop={[728, 90]}
                dimensionMobile={[300, 250]}
                mobile
                className={'text-center mb-3'}
              />
            )}
            {index === 10 && (
              <Ads
                id="div-ad-gpt-138639789-1660147282-3"
                adIdDesktop="Crictracker2022_Desktop_LiveScore_MID2_728x90"
                adIdMobile="Crictracker2022_Mobile_LiveScore_MID2_300x250"
                dimensionDesktop={[728, 90]}
                dimensionMobile={[300, 250]}
                mobile
                className={'text-center mb-3'}
              />
            )}
            <FixturesItems key={fixture._id} fixture={fixture} />
          </React.Fragment>
        )
      })}
    </>
  )
}

MatchDetailUpcoming.propTypes = {
  data: PropTypes.array
}

export default MatchDetailUpcoming
