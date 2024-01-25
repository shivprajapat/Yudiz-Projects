import PropTypes from 'prop-types'

// import navigationSchema from '@assets/data/site-navigation-schema.json'
// import { makeSchema } from '@shared/libs/schems'
import { convertDateToISTWithFormate, dateCheck, getMetaTagImg } from '@shared/utils'
import { DOMAIN, REACT_APP_ENV, SITE_NAME } from '@shared/constants'
import { useAmp } from 'next/amp'

function MetaTags({ data, router, title, canonical }) {
  const previewImg = `${DOMAIN}images/CricTracker-Facebook-Preview.jpg`
  // const [url] = router?.asPath?.split('?')
  // const nav = url?.split('/')?.filter((x) => x)
  const isAmp = useAmp()

  return (
    <>
      {/* <title>{(data?.oSeo?.sTitle || data?.sTitle) || SITE_NAME}</title> */}
      {!isAmp && (
        <>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2" />
        </>
      )}
      {/* Schema.org markup for Google */}
      {/* <meta itemProp="name" content={title} />
      <meta itemProp="description" content={data?.oSeo?.sDescription || data?.sDescription} />
      <meta itemProp="image" content={getMetaTagImg(data, 'oFB') || getMetaTagImg(data, 'oTwitter') || previewImg} /> */}

      {/* Common */}
      <meta name="Author" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta name="description" content={data?.oSeo?.sDescription || data?.sDescription} />
      {data?.oSeo?.aKeywords?.length > 0 && <meta name="keywords" content={data?.oSeo?.aKeywords?.join(', ')} />}
      {REACT_APP_ENV === 'production' && <meta name="robots" content={data?.oSeo?.sRobots || 'Follow, Index'} />}
      <meta property="og:title" content={data?.oSeo?.oFB?.sTitle || data?.oSeo?.sTitle || data?.sTitle || SITE_NAME} />
      <meta property="og:type" content={data?.oSeo?.eType === 'ar' ? 'article' : 'website'} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={getMetaTagImg(data, 'oFB') || previewImg} />
      <meta property="og:image:alt" content={data?.oSeo?.oFB?.sTitle || data?.oSeo?.sTitle || data?.sTitle || SITE_NAME} />
      <meta property="og:image:width" content="640" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:url" content={getMetaTagImg(data, 'oFB') || previewImg} />
      <meta property="og:image:type" content={`image/${data?.oSeo?.oFB?.sUrl?.split('.')[1] || 'jpeg'}`} />
      <meta property="og:description" content={data?.oSeo?.oFB?.sDescription || data?.oSeo?.sDescription || data?.sDescription} />

      {/* Facebook */}
      {/* <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="es_ES" /> */}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cricketracker" />
      <meta name="twitter:domain" content="crictracker.com" />
      <meta property="twitter:title" content={data?.oSeo?.oTwitter?.sTitle || data?.oSeo?.sTitle || data?.sTitle || SITE_NAME} />
      <meta property="twitter:image" content={getMetaTagImg(data, 'oTwitter') || previewImg} />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:image:alt" content={data?.oSeo?.oTwitter?.sTitle || data?.oSeo?.sTitle || SITE_NAME} />
      <meta name="twitter:creator" content={data?.oDisplayAuthor?.sDisplayName || '@cricketracker'} />
      <meta property="twitter:description" content={data?.oSeo?.oTwitter?.sDescription || data?.oSeo?.sDescription || data?.sDescription} />
      {(data?.oSeo?.eType === 'ar' || data?.oSeo?.eType === 'fa') && (
        <>
          {/* Article */}
          <meta property="article:publisher" content="https://www.facebook.com/Crictracker" />
          <meta property="article:published_time" content={convertDateToISTWithFormate(dateCheck(data?.dPublishDisplayDate || data?.dPublishDate))} />
          <meta property="article:modified_time" content={convertDateToISTWithFormate(dateCheck(data?.dUpdated))} />
          <meta property="article:author" content={data?.oDisplayAuthor?.sDisplayName} />
          <meta property="article:section" content={data?.oCategory?.sName} />
        </>
      )}

      <meta property="fb:pages" content="600228316674560" />
      <meta property="fb:pages" content="307083702751174" />
      <meta property="fb:pages" content="1644838162470778" />
      <meta name="p:domain_verify" content="195bbe55be30c5d6ff0e09090afb9684" />

      {/* For facebook instant article */}
      <meta property="fb:pages" content="352719408676818" />
      <meta property="fb:app_id" content="1133939180696269" />
      {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeSchema(data, nav)) }} /> */}
      {/* {(!isAmp && data?.bOld) && <link className='customAmp' rel="amphtml" href={`${DOMAIN}${router?.asPath?.substring(1)}?amp`} />} */}
    </>
  )
}
MetaTags.propTypes = {
  data: PropTypes.object,
  router: PropTypes.object,
  title: PropTypes.string,
  canonical: PropTypes.string,
  indexData: PropTypes.bool
}
export default MetaTags
