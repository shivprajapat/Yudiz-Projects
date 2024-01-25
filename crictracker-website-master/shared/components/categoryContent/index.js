import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Col, Container, Row } from 'react-bootstrap'
import dynamic from 'next/dynamic'

import { seriesCategoryNav } from '../../constants/allNavBars'
import Layout from '../layout'
import { navLoader, pageHeaderLoader, scoreCardSliderLoader } from '@shared/libs/allLoader'
import { WIDGET } from '@shared/constants'
import useWindowSize from '@shared/hooks/windowSize'
// import getCategoryMeta from '@shared/libs/meta-details/category'
// import { allRoutes } from '@shared/constants/allRoutes'
import { ENUM_SERIES_CATEGORY_PAGES, ENUM_STATS_PAGE } from '@shared/enum'
import { arraySortByOrder } from '@shared/utils'

const PageHeader = dynamic(() => import('@shared-components/pageHeader'), { loading: () => pageHeaderLoader() })
const CommonNav = dynamic(() => import('@shared-components/commonNav'), { loading: () => navLoader() })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const ScorecardSlider = dynamic(() => import('@shared-components/scorecardSlider'), { loading: () => scoreCardSliderLoader() })
const ClientCommonNav = dynamic(() => import('@shared-components/commonNav/client'), { loading: () => navLoader() })
// const PromotionFull = dynamic(() => import('@shared/components/adsPromotion/promotionFull'))
const CommonContent = dynamic(() => import('@shared/components/commonContent'))
const OnMouseAndScroll = dynamic(() => import('@shared/components/lazyLoad/onMouseAndScroll'))

const CategoryContent = ({ seoData, children, category, isFantasyArticle, showNav, tabSeo, reWriteURLS, tab, scoreCard, ssrNav }) => {
  const router = useRouter()
  // const { t } = useTranslation('common')
  const [width] = useWindowSize()
  const [activeTab, setActiveTab] = useState(router?.query?.tab === 'videos' ? 'videos' : 'home')
  // const isHomeActive = allRoutes.seriesHome(category?.oSeo?.sSlug) === router.asPath?.split('?')[0]
  // const isIpl = category?._id === '623184adf5d229bacb00ff63'
  // const tagLine = {
  //   fixtures: 'The below-mentioned fixtures are of IPL 2022. The fixtures for IPL 2023 will be added once announced',
  //   standings: 'The below-mentioned point table is from IPL 2022. The IPL 2023 standings will be added once the tournament starts',
  //   stats: 'The below-mentioned stats are from IPL 2022. The IPL 2023 numbers will be added once the league starts'
  // }

  function getNavItems() {
    const items = []
    ssrNav?.forEach((t) => {
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
    const order = ['home', 'news', 'videos', 'fixtures', 'standings', 'stats', 'fantasy-tips', 'teams', 'squads', 'archives']
    return arraySortByOrder({ data: items, order, key: 'navItem' })
  }

  function getNav() {
    if (showNav) {
      if (category?.eType === 'gt' || category?.eType === 'pct' || category?.eType === 't' || category?.eType === 's' || category?.eType === 'fac' || category?.eType === 'p') {
        return (
          <ClientCommonNav
            items={seriesCategoryNav({
              isSeries: category?.eType,
              categoryId: category?._id
            })}
            active={activeTab}
            onTabChange={(e) => setActiveTab(e)}
            isSticky
          />
        )
      } else {
        return (
          <>
            <CommonNav
              items={getNavItems()}
              isSticky
            />
          </>
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
    <Layout
      data={{
        ...category,
        sTitle: category?.sName,
        oSeo: seoData
        // getCategoryMeta({ oSeo: { ...seoData, ...tabSeo }, oCategory: category, tab: tab, t, router })
      }}
      scoreCard={category?.eType === 'as' ? scoreCard : undefined}
    >
      {(category?.eType === 'as' && scoreCard?.length > 0) && <ScorecardSlider
        data={scoreCard}
        seriesId={category?.iSeriesId}
        // adData={{
        //   id: 'div-ad-gpt-138639789-1679039771-0s',
        //   adIdDesktop: 'Crictracker2022_Desktop_LiveScore_ATF2_320x140',
        //   adIdMobile: 'Crictracker2022_Mobile_LiveScore_ATF2_320x140',
        //   dimensionDesktop: [320, 140],
        //   dimensionMobile: [320, 140],
        //   mobile: true
        // }}
      />}
      <main className="pb-3 pt-3">
        <Container>
          <div className="d-none d-md-block mb-3" style={{ minHeight: '100px' }}>
            {width > 767 && ( // Desktop top
              <Ads
                id="div-ad-gpt-138639789--0-Crictracker2022_Desktop_Top_970"
                adIdDesktop="Crictracker2022_Desktop_Top_970x90"
                dimensionDesktop={[970, 90]}
                className={'text-center'}
                style={{ minHeight: '90px' }}
              />
            )}
          </div>
          <Row>
            <Col xl={8} xxl={9} className="left-content">
              <PageHeader
                name={getSubPagesDetail?.sDTitle || category?.sName}
                favBtn={category?.eType === 'as' || category?.eType === 's'}
                desc={seoData?.eSubType ? getSubPagesDetail?.sContent : category?.sContent}
                type={category?.eType}
                id={seoData?.iId}
                isFavorite={category?.bIsFav}
                isFantasyArticle={isFantasyArticle}
                seoData={seoData}
              />
              {getNav()}
              {/* {(category?.eType === 'as' || category?.eType === 's') && <PromotionFull />} */}
              <OnMouseAndScroll>
                {width > 767 && ( // Only for desktop after nav
                  <Ads
                    id="div-ad-gpt-138639789-Desktop_SP_ATF_728"
                    adIdDesktop="Crictracker2022_Desktop_SP_ATF_728x90"
                    adIdMobile="Crictracker2022_Mobile_SP_ATF_300x250"
                    dimensionDesktop={[728, 90]}
                    dimensionMobile={[300, 250]}
                    mobile
                    className="text-center mb-2 mb-md-4"
                  />
                )}
              </OnMouseAndScroll>
              {/* {(isIpl) && <p className='text-uppercase' ><u><b>{tagLine[tab]}</b></u></p>} */}
              {children({ activeTab, changeTab: (e) => setActiveTab(e) })}
              {(width < 767 || showDescription() || ENUM_STATS_PAGE[seoData?.eSubType] === 'stats') && ( // Only for mobile after children
                <Ads
                  id="div-ad-gpt-138639789-Desktop_SP_ATF_728"
                  adIdDesktop="Crictracker2022_Desktop_SP_ATF_728x90"
                  adIdMobile="Crictracker2022_Mobile_SP_ATF_300x250"
                  dimensionDesktop={[728, 90]}
                  dimensionMobile={[300, 250]}
                  mobile
                  className="text-center mb-2 mb-md-4"
                />
              )}
              {showDescription() && (
                <>
                  <hr />
                  <section className="common-box">
                    <CommonContent isDark>
                      <div dangerouslySetInnerHTML={{ __html: getSubPagesDetail?.sContent }} />
                    </CommonContent>
                  </section>
                </>
              )}

            </Col>
            {width > 991 && (
              <Col xl={4} xxl={3} className="common-sidebar">
                <AllWidget type={WIDGET.ranking} show />
                <OnMouseAndScroll>
                  <AllWidget type={WIDGET.currentSeries} show />
                </OnMouseAndScroll>
                {/* In the right side bar desktop/mobile */}
                <Ads
                  id="div-ad-gpt-138639789-164660-Crictracker2022_Desktop_SP_RightATF_300"
                  adIdDesktop="Crictracker2022_Desktop_SP_RightATF_300x600"
                  dimensionDesktop={[300, 600]}
                  className="text-center sticky-ads position-sticky mb-2"
                />
              </Col>
            )}
          </Row>
        </Container>
      </main>
    </Layout>
  )
}
CategoryContent.propTypes = {
  seoData: PropTypes.object,
  category: PropTypes.object,
  children: PropTypes.func,
  isFantasyArticle: PropTypes.bool,
  showNav: PropTypes.bool,
  tabSeo: PropTypes.object,
  reWriteURLS: PropTypes.array,
  scoreCard: PropTypes.array,
  tab: PropTypes.string,
  ssrNav: PropTypes.array
}

export default CategoryContent
