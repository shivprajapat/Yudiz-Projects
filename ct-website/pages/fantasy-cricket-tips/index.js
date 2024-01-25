import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useAmp } from 'next/amp'

import queryGraphql from '@shared/components/queryGraphql'
import { FANTASY_TIPS_LIST } from '@graphql/fantasy-tips/fantasy-tips.query'
import { checkRedirectionStatus, currentDateMonth, getTimeZone, handleApiError } from '@shared/utils'
import Error from '@shared/components/error'
import { pageLoading } from '@shared/libs/allLoader'
import { GET_ARTICLE_ID } from '@graphql/article/article.query'
import { allRoutes } from '@shared/constants/allRoutes'
import { HOME_FANTASY_ARTICLE } from '@graphql/home/home.query'
import useTranslation from 'next-translate/useTranslation'

const FantasyTipsList = dynamic(() => import('@shared/components/fantasyTips/fantasyTipsList'), { loading: () => pageLoading() })
const SeriesHomeAMP = dynamic(() => import('@shared/components/amp/seriesHomeAMP'), { loading: () => pageLoading() })
const CategoryContentAMP = dynamic(() => import('@shared/components/amp/categoryContentAMP'), { loading: () => pageLoading() })
export const config = { amp: 'hybrid' }
function FantasyTips({ fantasyTipsList, seoData, articles }) {
  const isAmp = useAmp()
  const { t } = useTranslation()
  if (!isAmp) {
    return <FantasyTipsList data={fantasyTipsList} seoData={seoData} />
  } else {
    return (
      <CategoryContentAMP seoData={seoData} category={{ sName: t('common:FantasyTips') }}>
        <SeriesHomeAMP data={articles}/>
      </CategoryContentAMP>
    )
  }
}

FantasyTips.propTypes = {
  fantasyTipsList: PropTypes.array,
  seoData: PropTypes.object,
  articles: PropTypes.object
}

export default Error(FantasyTips)

export async function getServerSideProps({ req, res }) {
  try {
    res.setHeader('Cache-Control', 'public, max-age=10')
    const { data: seoData } = await queryGraphql(GET_ARTICLE_ID, { input: { sSlug: allRoutes.fantasyCricketTips.replaceAll('/', '') || '' } })

    // Check Redirection
    const { redirectStatus, eCode, returnObj, props } = checkRedirectionStatus(seoData?.getSeoData)
    if (redirectStatus && props) {
      res.statusCode = eCode
      return { props }
    } else if (redirectStatus) return returnObj

    if (req?.url.includes('?amp=1')) {
      const { data: fantasyData } = await queryGraphql(HOME_FANTASY_ARTICLE, { input: { nLimit: 22, nSkip: 1 } })
      return {
        props: {
          seoData: seoData?.getSeoData,
          articles: { fantasyArticle: fantasyData?.listFrontFantasyArticle }
        }
      }
    } else {
      const { data } = await queryGraphql(FANTASY_TIPS_LIST, { input: { dDay: currentDateMonth(), sSortBy: 'dStartDate', nOrder: 1, sTimezone: getTimeZone(), nLimit: 10, nSkip: 1 } })
      return {
        props: {
          fantasyTipsList: data?.listMatchFantasyTipsFront?.aResults,
          seoData: seoData?.getSeoData
        }
      }
    }
  } catch (e) {
    res.setHeader('Cache-Control', 'no-cache')
    const status = handleApiError(e)
    return status
  }
}
