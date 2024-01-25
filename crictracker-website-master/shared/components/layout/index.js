import React, { useEffect } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import MetaTags from '../metaTags'
import { SITE_NAME, DOMAIN } from '@shared/constants'
import AllSchema from '../all-schema'
import { checkPageNumberInSlug, makeCanonical } from '@shared/utils'

const Layout = ({ children, isPreviewMode, data = {}, matchDetail, scoreCard }) => {
  const router = useRouter()
  const { lastSlug, slug } = checkPageNumberInSlug(router?.asPath?.split('/').filter(e => e), false)
  const canonical = makeCanonical(data, router?.asPath)

  function getDocumentTitle() {
    const t = (data?.oSeo?.sTitle || data?.sTitle) || SITE_NAME
    if (data?.oListicleArticle?.oPageContent?.length > 0) {
      return Number(lastSlug) ? `Page ${Number(lastSlug)}: ${t}` : t
    }
    return t
  }

  function getAmpURL() {
    if (data?.bIsListicleArticle && !isNaN(lastSlug)) {
      return `${DOMAIN}${slug?.join('/')}/${lastSlug}/?amp=1`
    } else { return `${DOMAIN}${slug?.join('/')}/?amp=1` }
  }

  useEffect(() => {
    const ampLink = document.getElementById('ampURL')
    if (ampLink && (data?.oSeo?.eType === 'ct' || data?.oSeo?.eType === 'gt' || data?.oSeo?.eType === 'p' || data?.oSeo?.eType === 't' || data?.oSeo?.eType === 'ar' || data?.oSeo?.eType === 'fa' || data?.oSeo?.eType === 'cms')) {
      ampLink.href = getAmpURL()
    } else if (ampLink) {
      ampLink?.remove()
    }
  }, [router?.asPath])

  return (
    <>
      <Head>
        <title>{getDocumentTitle()}</title>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" /> */}
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /> */}
        {/* <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@500;600;700;800&display=swap" rel="stylesheet" /> */}
        <link rel="canonical" href={canonical} />
        {
          (
            (
              data?.oSeo?.eType === 'ct' ||
              data?.oSeo?.eType === 'gt' ||
              data?.oSeo?.eType === 'p' ||
              data?.oSeo?.eType === 't' ||
              data?.oSeo?.eType === 'ar' ||
              data?.oSeo?.eType === 'fa' ||
              data?.oSeo?.eType === 'cms'
            ) && (data?.oSeo?.sSlug !== 'cricket-videos')
          ) && (
            <link rel="amphtml" id="ampURL" href={getAmpURL()} />
          )
        }
        {/* ar,ct,gt=general tag,p=player,t=team,v=venu,fa */}
        <MetaTags title={getDocumentTitle()} data={data} canonical={canonical} router={router} />
      </Head>
      {children}
      <AllSchema data={data} matchDetail={matchDetail} scoreCard={scoreCard} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  isPreviewMode: PropTypes.bool,
  data: PropTypes.object,
  matchDetail: PropTypes.object,
  scoreCard: PropTypes.array
}

export default Layout
