import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import styles from './style.module.scss'
import { addAdsInsideParagraph, addEditorAds, checkIsGlanceView } from '@shared/utils'
import InnerHTML from '@shared/components/InnerHTML'
// import { refreshGoogleAds } from '@shared/libs/ads'

const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })

const InfoBlock = (props) => {
  const router = useRouter()
  const isGlanceView = checkIsGlanceView(router?.query)

  useEffect(async () => {
    const ReactDOM = (await import('react-dom'))
    if (!isGlanceView) {
      const gtAds1 = document.getElementById('gt-ads-1')
      if (gtAds1) { // Editor ads one
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-1660131756-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID3_728x90"
          // adIdMobile="Crictracker2022_Mobile_AP_MID3_300x250"
          dimensionDesktop={[728, 90]}
          // dimensionMobile={[300, 250]}
          // mobile
          className={'text-center d-none d-md-block'}
        />, gtAds1)
      }
      const gtAd2 = document.getElementById('gt-ads-2')
      if (gtAd2) { // Editor ads Two
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-1660131756-1"
          adIdDesktop="Crictracker2022_Desktop_AP_MID4_728x90"
          // adIdMobile="Crictracker2022_Mobile_AP_MID4_300x250"
          dimensionDesktop={[728, 90]}
          // dimensionMobile={[300, 250]}
          // mobile
          className={'text-center d-none d-md-block'}
        />, gtAd2)
      }
      // if (document.getElementById('video-ads')) { // Video ads after 1st paragraph
      //   ReactDOM.render(<Ads
      //     id="div-ad-desk-138639789-1660131489-0"
      //     adIdDesktop="Crictracker2022_Inread_1x1"
      //     dimensionDesktop={[1, 1]}
      //     className={'text-center'}
      //   />, document.getElementById('video-ads'))
      // }
      // refreshGoogleAds()
    }
  }, [])
  return (
    <section className={`${styles.infoBlock} common-section pb-0`} id={props?.id}>
      <p className={`${props?.fantasystyles?.itemTitle} text-primary fw-bold text-uppercase`}>{props?.title}</p>
      <InnerHTML
        className={`${props?.fantasystyles?.infoDesc} big-text`}
        html={addEditorAds(addAdsInsideParagraph(props?.info, [0]))}
      />
    </section>
  )
}

InfoBlock.propTypes = {
  fantasystyles: PropTypes.any,
  title: PropTypes.any,
  info: PropTypes.any,
  id: PropTypes.string
}

export default InfoBlock
