import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Badge } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { addAdsInsideParagraph, addEditorAds, sendMobileWebViewEvent } from '@shared/utils'
import InnerHTML from '@shared/components/InnerHTML'
import { refreshGoogleAds } from '@shared/libs/ads'
import { useRouter } from 'next/router'

const ListicleArticle = dynamic(() => import('../listicleArticle'))
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
// const InnerHTML = dynamic(() => import('@shared/components/InnerHTML'))

function ArticleContent({ article }) {
  const router = useRouter()
  const isMobileWebView = router?.query?.isMobileWebView
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (document.getElementById('gt-ads-1')) { // Editor ads one
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-1660131756-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID3_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_MID3_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center mb-4'}
        />, document.getElementById('gt-ads-1'))
      }
      if (document.getElementById('gt-ads-2')) { // Editor ads Two
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-1660131756-1"
          adIdDesktop="Crictracker2022_Desktop_AP_MID4_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_MID4_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center mb-4'}
        />, document.getElementById('gt-ads-2'))
      }
      if (document.getElementById('fixed-ads-2')) { // After 3rd paragraph fixed ads
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789-Desktop_AP_MID-1646637168-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_MID_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center'}
        />, document.getElementById('fixed-ads-2'))
      }
      if (document.getElementById('fixed-ads-5')) { // After 6th paragraph fixed ads
        ReactDOM.render(<Ads
          id="div-ad-gpt-138639789_Desktop_AP_MID2_728-46637168-0"
          adIdDesktop="Crictracker2022_Desktop_AP_MID2_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_MID2_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
          mobile
          className={'text-center'}
        />, document.getElementById('fixed-ads-5'))
      }
      if (document.getElementById('video-ads')) { // Video ads after 1st paragraph
        ReactDOM.render(<Ads
          id="div-ad-desk-138639789-1660131489-0"
          adIdDesktop="Crictracker2022_Inread_1x1"
          dimensionDesktop={[1, 1]}
          className={'text-center'}
        />, document.getElementById('video-ads'))
      }
    }
    refreshGoogleAds()
  }, [])
  const handleEvent = (id, type) => {
    if (isMobileWebView) {
      sendMobileWebViewEvent(`tag:${type}:${id}`)
    }
  }
  return (
    <>
      {!article?.bIsListicleArticle && (
        <InnerHTML
          className={`${styles.content} text-break`}
          html={addEditorAds(addAdsInsideParagraph(article?.sContent, [0, 2, 5]))}
        />
      )}
      {article?.bIsListicleArticle && <ListicleArticle article={article} outerStyle={styles} />}
      <div className={`${styles.tagList} d-flex flex-lg-wrap pb-2 pb-lg-0`}>
        {article?.aSeries?.map((cat, index) => (
          <div key={index} onClick={() => handleEvent(cat?._id, cat?.eType)}>
            <Link href={'/' + cat?.oSeo?.sSlug} prefetch={false}>
              <a target='_blank' style={isMobileWebView && { pointerEvents: 'none' }} className={cat?.eStatus === 'i' ? 'disabled' : ''}>
                <Badge bg="primary">{cat?.sName}</Badge>
              </a>
            </Link>
          </div>
        ))}
        {article?.aTeam?.map((team, index) => (
          <div key={index} onClick={() => handleEvent(team?._id, team?.eType)}>
            <Link href={'/' + team?.oSeo?.sSlug} prefetch={false} >
              <a target='_blank' style={isMobileWebView && { pointerEvents: 'none' }} className={team?.eStatus === 'i' ? 'disabled' : ''}>
                <Badge bg="primary">{team?.sName}</Badge>
              </a>
            </Link>
          </div>
        ))}
        {article?.aPlayer?.map((player, index) => (
          <div key={index} onClick={() => handleEvent(player?._id, player?.eType)}>
            <Link href={'/' + player?.oSeo?.sSlug} prefetch={false}>
              <a target='_blank' style={isMobileWebView && { pointerEvents: 'none' }} className={player?.eStatus === 'i' ? 'disabled' : ''}>
                <Badge bg="primary">{player?.sName}</Badge>
              </a>
            </Link>
          </div>
        ))}
        {article?.aTags?.map((tag, index) => (
          <div key={index} onClick={() => handleEvent(tag?._id, tag?.eType)}>
            <Link href={'/' + tag?.oSeo?.sSlug} prefetch={false}>
              <a target='_blank' style={isMobileWebView && { pointerEvents: 'none' }} className={tag?.eStatus === 'i' ? 'disabled' : ''}>
                <Badge bg="primary">{tag?.sName}</Badge>
              </a>
            </Link>
          </div>
        ))}
        {/* <Ads
          id="div-ad-gpt-138639789-1646637259-0"
          adIdDesktop="Crictracker2022_Desktop_AP_BTF_728x90"
          adIdMobile="Crictracker2022_Mobile_AP_BTF_300x250"
          dimensionDesktop={[728, 90]}
          dimensionMobile={[300, 250]}
        /> */}
      </div>
    </>
  )
}
ArticleContent.propTypes = {
  article: PropTypes.object
}

export default ArticleContent
