import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import { fixtureLoader } from '@shared/libs/allLoader'
import { checkIsGlanceView } from '@shared/utils'

const FixturesItems = dynamic(() => import('@shared-components/series/fixturesItems'), { loading: () => fixtureLoader() })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const GlanceAd = dynamic(() => import('@shared-components/ads/glanceAd'), { ssr: false })

const MatchDetailUpcoming = ({ data }) => {
  const router = useRouter()
  const isGlanceView = checkIsGlanceView(router?.query)
  return (
    <>
      {data?.map((fixture, index) => {
        return (
          <React.Fragment key={index}>
            {isGlanceView && (
              <>
                {index === 2 && (
                  <GlanceAd
                    id={`div-gpt-ad-1${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
                    adId="Crictracker_mrec_mid"
                    dimension={[[300, 250], [336, 280], 'fluid']}
                    adUnitName="Crictracker_Sportstab_InArticleMedium_Mid2"
                    placementName="InArticleMedium"
                    className="d-flex justify-content-center"
                    width={300}
                    height={250}
                    pageName="Crictracker SportsTab"
                  />
                )}
                {index === 5 && (
                  <GlanceAd
                    id={`div-gpt-ad-2${new Date().getTime() * ((Math.random() + 1) * 1000)}`}
                    adId="Crictracker_mrec_bottom"
                    dimension={[[300, 250], [336, 280], 'fluid']}
                    className="mt-2 d-flex justify-content-center"
                    adUnitName="Crictracker_Sportstab_InArticleMedium_Mid3"
                    placementName="InArticleMedium"
                    width={300}
                    height={250}
                    pageName="Crictracker SportsTab"
                  />
                )}
              </>
            )}
            {index === 5 && (
              <Ads
                id="div-ad-gpt-138639789-1660147282-2"
                adIdDesktop="Crictracker2022_Mobile_LiveScore_MID_300x250"
                // adIdMobile="Crictracker2022_Desktop_LiveScore_MID_728x90"
                dimensionDesktop={[300, 250]}
                // dimensionMobile={[300, 250]}
                // mobile
                className={'text-center mb-3 d-md-none'}
              />
            )}
            {/* {index === 10 && (
              <Ads
                id="div-ad-gpt-138639789-1660147282-3"
                adIdDesktop="Crictracker2022_Desktop_LiveScore_MID2_728x90"
                adIdMobile="Crictracker2022_Mobile_LiveScore_MID2_300x250"
                dimensionDesktop={[728, 90]}
                dimensionMobile={[300, 250]}
                mobile
                className={'text-center mb-3 d-none d-md-block'}
              />
            )} */}
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
