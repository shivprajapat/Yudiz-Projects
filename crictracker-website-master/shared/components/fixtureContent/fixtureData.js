import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { fixtureLoader } from '@shared/libs/allLoader'

const FixturesItems = dynamic(() => import('@shared-components/series/fixturesItems'), { loading: () => fixtureLoader() })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

function FixtureData({ data, id, isSeriesShow }) {
  return (
    <>
      {data?.map((fixture, i) => {
        return (
          <React.Fragment key={i + fixture?._id}>
            {i === 1 && (
              <Ads
                id="div-ad-gpt-138639789-Desktop_Fix_ATF"
                adIdDesktop="Crictracker2022_Desktop_Fix_ATF_728x90"
                adIdMobile="Crictracker2022_Mobile_Fix_ATF_300x250"
                dimensionDesktop={[728, 90]}
                dimensionMobile={[300, 250]}
                mobile
                className="mb-3 text-center"
              />
            )}
            {i === 3 && (
              <Ads
                id="div-ad-gpt-138639789-1646636968-0"
                // adIdDesktop="Crictracker2022_Desktop_Fix_MID_728x90"
                adIdDesktop="Crictracker2022_Mobile_Fix_MID_300x250"
                // adIdMobile="Crictracker2022_Mobile_Fix_MID_300x250"
                // dimensionDesktop={[728, 90]}
                dimensionDesktop={[300, 250]}
                // dimensionMobile={[300, 250]}
                // mobile
                className="mb-3 text-center d-md-none"
              />
            )}
            {/* {i === 6 && (
              <Ads
                id="div-ad-gpt-Desktop_Fix_MID2_728x90"
                adIdDesktop="Crictracker2022_Desktop_Fix_MID2_728x90"
                adIdMobile="Crictracker2022_Mobile_Fix_MID2_300x250"
                dimensionDesktop={[728, 90]}
                dimensionMobile={[300, 250]}
                mobile
                className="mb-3 text-center"
              />
            )} */}
            <FixturesItems fixture={fixture} id={fixture?._id} isSeriesShow/>
          </React.Fragment>
        )
      })}
    </>
  )
}

FixtureData.propTypes = {
  data: PropTypes.array,
  id: PropTypes.string,
  isSeriesShow: PropTypes.bool
}
export default FixtureData
