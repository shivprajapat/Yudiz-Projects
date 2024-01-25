import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import LayoutAMP from '@shared-components/layout/layoutAmp'
import { navLoader } from '@shared/libs/allLoader'
import { useRouter } from 'next/router'
import { seriesCategoryNav } from '@shared/constants/allNavBars'
// import useTranslation from 'next-translate/useTranslation'
// import getCategoryMeta from '@shared/libs/meta-details/category'
import { ENUM_SERIES_CATEGORY_PAGES, ENUM_STATS_PAGE } from '@shared/enum'
import { arraySortByOrder } from '@shared/utils'
// import PromotionFullAmp from '../adsPromotionAmp/promotionFullAmp/PromotionFullAmp'
// const PromotionFullAmp = dynamic(() => import('@shared-components/amp/adsPromotionAmp/promotionFullAmp/PromotionFullAmp'))
// import { allRoutes } from '@shared/constants/allRoutes'

const PageHeaderAMP = dynamic(() => import('@shared-components/amp/pageHeaderAMP'))
const CommonNavAMP = dynamic(() => import('@shared-components/amp/commonNavAMP'), { loading: () => navLoader() })
const ClientCommonNavAMP = dynamic(() => import('@shared-components/amp/commonNavAMP/client'), { loading: () => navLoader() })
const ScorecardSliderAMP = dynamic(() => import('@shared-components/amp/scorecardSliderAMP'))

const categoryContentAMP = ({ tab, seoData, children, category, scoreCard = [], isFantasyArticle, showNav, reWriteURLS, ssrNav, bannerSeriesScoreCard }) => {
  const router = useRouter()
  // const { t } = useTranslation('common')
  const activeTab = router?.query?.tab ? router?.query?.tab : 'home'
  // const liveMatches = bannerSeriesScoreCard && bannerSeriesScoreCard?.length > 0 && bannerSeriesScoreCard?.filter((data) => data?.sStatusStr === 'live')
  // const upcomingMatches = bannerSeriesScoreCard && bannerSeriesScoreCard?.length > 0 && bannerSeriesScoreCard?.filter((data) => data?.sStatusStr === 'scheduled')
  // const bannerData = bannerSeriesScoreCard && liveMatches?.length > 0 ? liveMatches[0] : upcomingMatches?.length > 0 ? upcomingMatches[0] : bannerSeriesScoreCard?.[bannerSeriesScoreCard?.length - 1]
  // const activePath = router.asPath?.split('?')[0]
  // const isHomeActive = allRoutes.seriesHome(category?.oSeo?.sSlug) === activePath

  // const isIpl = category?._id === '623184adf5d229bacb00ff63'
  // const tagLine = {
  //   fixtures: 'The below-mentioned fixtures are of IPL 2022. The fixtures for IPL 2023 will be added once announced',
  //   standings: 'The below-mentioned point table is from IPL 2022. The IPL 2023 standings will be added once the tournament starts',
  //   stats: 'The below-mentioned stats are from IPL 2022. The IPL 2023 numbers will be added once the league starts'
  // }

  function getNavItems() {
    const items = []
    ssrNav.forEach((t) => {
      if (ENUM_SERIES_CATEGORY_PAGES[t?.eSubType]) {
        items.push({
          navItem: ENUM_SERIES_CATEGORY_PAGES[t?.eSubType],
          url: `/${t?.sSlug}/`,
          active: t?.eSubType === seoData?.eSubType
        })
      } else if (t?.eSubType === null) { // Home Tab
        items.push({
          navItem: ENUM_SERIES_CATEGORY_PAGES.h,
          url: `/${t?.sSlug}/`,
          active: t?.eSubType === seoData?.eSubType
        })
      }
    })
    const order = ['home', 'news', 'videos', 'fixtures', 'standings', 'stats', 'teams', 'squads', 'archives', 'fantasy-tips']
    return arraySortByOrder({ data: items, order, key: 'navItem' })
  }

  function getNav() {
    if (showNav) {
      if (category?.eType === 'gt' || category?.eType === 'pct' || category?.eType === 't' || category?.eType === 's' || category?.eType === 'fac' || category?.eType === 'p') {
        return (
          <ClientCommonNavAMP
            items={seriesCategoryNav({
              isSeries: category?.eType,
              categoryId: category?._id
            })}
            active={activeTab}
            isSticky
          />
        )
      } else {
        return (
          <CommonNavAMP items={getNavItems()} isSticky />
        )
      }
    }
  }

  const getTitleDesc = () => {
    let tabData = {}
    ssrNav?.forEach((cat) => {
      if (seoData?.eSubType === cat?.eSubType) {
        tabData = cat
      }
    })
    return tabData
  }

  function showDescription() {
    if (seoData?._id === '6396dd2588e3e61623afa20a' || seoData?._id === '630ca60ff22e6651888369d3' || seoData?._id === '6396dd2988e3e61623afa355') {
      return true
    } else return false
  }
  const getSubPagesDetail = getTitleDesc()

  return (
    <>
      <style jsx amp-custom>{`
        main { min-height: calc(100vh - 157px);  }
        .container { margin: 0px auto; width: 966px; max-width: 100%; }
        @media (max-width: 767px) { main { padding-bottom: 60px;} }

      `}
      </style>
      <style jsx amp-custom global>{`
        .commonTypo{font-size:16px;line-height:24px;color:var(--font-secondary)}.commonTypo p{margin-bottom:18px}.commonTypo a{color:var(--theme-color-medium);text-decoration:underline}.commonTypo a:hover{color:var(--theme-font)}.commonTypo ul,.commonTypo ol{margin-bottom:18px;padding-left:18px;font-size:14px;line-height:24px;font-weight:700}.commonTypo ul{list-style:disc}.commonTypo ol{list-style:decimal}.commonTypo li{padding-left:8px}.commonTypo blockquote{margin-bottom:18px;padding:62px 16px 20px 16px;font-size:18px;line-height:30px;background:#e7f0ff url(../../../assets/images/icon/quote-icon.svg) no-repeat 16px 14px/40px auto;color:#0e3778;font-style:italic;border-radius:16px}.commonTypo table{margin-bottom:4px;font-size:14px;line-height:20px;height:auto;white-space:nowrap}.commonTypo table tbody tr:first-child td{background:#045de9;color:#fff;text-transform:capitalize}.commonTypo table td{background:var(--theme-bg);width:auto}.commonTypo table p{margin:0}.commonTypo figure{margin-bottom:18px;width:100%;position:relative;border-radius:16px;overflow:hidden}.commonTypo figure img{margin-bottom:0px;border-radius:16px}.commonTypo figure figcaption{font-style:italic;color:#7b7b7b;font-size:12px;line-height:14px;text-align:center;margin-top:5px}.commonTypo figure figcaption:empty{display:none}.commonTypo p img{margin:0}.commonTypo img{margin-bottom:18px;width:100%;height:auto}.commonTypo tr:nth-child(2) td:empty{display:none}.commonTypo p:empty{margin:0}.commonTypo iframe{display:block;max-width:100%;margin:0px auto}.commonTypo video{width:100%;aspect-ratio:16/9;height:auto}.commonTypo.typoDark table tr:first-child td{background:#045de9;color:#fff}.commonTypo.typoDark table td{background-color:var(--theme-bg)}/*# sourceMappingURL=commonTypo.css.map */

      `}
      </style>
      <LayoutAMP
        data={{
          ...category,
          sTitle: category?.sName,
          oSeo: seoData
        }}
        scoreCard={category?.eType === 'as' ? scoreCard : undefined}
      >
        {category?.eType === 'as' && <ScorecardSliderAMP data={scoreCard} seriesId={category?.iSeriesId} />}
        <main className="pb-3 pt-3">
          <amp-sticky-ad layout="nodisplay">
            <amp-ad
              width="320"
              height="50"
              type="doubleclick"
              data-slot="138639789/Crictracker2022_AMP_SP_Sticky_320x50"
              data-multi-size-validation="false"
              data-enable-refresh="30"
            />
          </amp-sticky-ad>
          <div className="container">
            <PageHeaderAMP
              name={getSubPagesDetail?.sDTitle || category?.sName}
              favBtn
              desc={seoData?.eSubType ? getSubPagesDetail?.sAmpContent || getSubPagesDetail?.sContent : category?.sAmpContent || category?.sContent}
              type={category?.eType}
              id={seoData?.iId}
              isFavorite={category?.bIsFav}
              isFantasyArticle={isFantasyArticle}
              seoData={seoData}
            />
            {getNav()}
            {/* {(category?.eType === 'as' || category?.eType === 's') && bannerData && <PromotionFullAmp match={bannerData} />} */}
            {/* {(isIpl) && <p style={{ textTransform: 'uppercase' }} ><u><b>{tagLine[tab]}</b></u></p>} */}
            {children}
            {(showDescription() || ENUM_STATS_PAGE[seoData?.eSubType] === 'stats') && (
              <div className="d-flex justify-content-center mb-3">
                <amp-ad
                  width="300"
                  height="250"
                  type="doubleclick"
                  data-slot="138639789/Crictracker2022_AMP_SP_ATF_300x250"
                  data-multi-size-validation="false"
                  data-enable-refresh="30"
                />
              </div>
            )}
            {showDescription() && (
              <>
                <hr /><br />
                <div className="common-box commonTypo typoDark">
                  <div dangerouslySetInnerHTML={{
                    __html: getSubPagesDetail?.sAmpContent || getSubPagesDetail?.sContent
                  }} />
                </div>
              </>
            )}
          </div>
        </main>
      </LayoutAMP>
    </>
  )
}
categoryContentAMP.propTypes = {
  tab: PropTypes.string,
  seoData: PropTypes.object,
  category: PropTypes.object,
  children: PropTypes.node,
  isFantasyArticle: PropTypes.bool,
  showNav: PropTypes.bool,
  reWriteURLS: PropTypes.array,
  ssrNav: PropTypes.array
}

export default categoryContentAMP
