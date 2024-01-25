import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Col, Container, Row } from 'react-bootstrap'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import { seriesCategoryNav } from '../../constants/allNavBars'
import Layout from '../layout'
import { navLoader, pageHeaderLoader, scoreCardSliderLoader } from '@shared/libs/allLoader'
import { WIDGET } from '@shared/constants'
import useWindowSize from '@shared/hooks/windowSize'
import getCategoryMeta from '@shared/libs/meta-details/category'

const PageHeader = dynamic(() => import('@shared-components/pageHeader'), { loading: () => pageHeaderLoader() })
const CommonNav = dynamic(() => import('@shared-components/commonNav'), { loading: () => navLoader() })
const AllWidget = dynamic(() => import('@shared/components/allWidget'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const ScorecardSlider = dynamic(() => import('@shared-components/scorecardSlider'), { loading: () => scoreCardSliderLoader() })
const ClientCommonNav = dynamic(() => import('@shared-components/commonNav/client'), { loading: () => navLoader() })

const CategoryContent = ({ seoData, children, category, isFantasyArticle, showNav, tabSeo, reWriteURLS, tab, scoreCard }) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [width] = useWindowSize()
  const [activeTab, setActiveTab] = useState(router?.query?.tab === 'videos' ? 'videos' : 'home')

  function getNav() {
    if (showNav) {
      if (category?.eType === 'gt' || category?.eType === 'p' || category?.eType === 't' || category?.eType === 's' || category?.eType === 'fac') {
        return (
          <ClientCommonNav
            items={seriesCategoryNav({
              isSeries: category?.eType
            })}
            active={activeTab}
            onTabChange={(e) => setActiveTab(e)}
          />
        )
      } else {
        return (
          <CommonNav
            items={seriesCategoryNav({
              slug: category?.oSeo?.sSlug,
              activePath: router.asPath,
              isSeries: category?.eType,
              totalTeams: category?.oSeries?.nTotalTeams,
              tabName: seoData?.eTabType,
              tabSlug: `/${seoData?.sSlug}/`,
              reWriteURLS
            })}
          />
        )
      }
    }
  }

  return (
    <Layout
      data={{
        ...category,
        sTitle: category?.sName,
        oSeo: getCategoryMeta({ oSeo: { ...seoData, ...tabSeo }, oCategory: category, tab: tab, t, reWriteURLS })
      }}
      scoreCard={category?.eType === 'as' ? scoreCard : undefined}
    >
      {category?.eType === 'as' && <ScorecardSlider data={scoreCard} seriesId={category?.iSeriesId} />}
      <main className="pb-3 pt-3">
        <Container>
          <div className="d-none d-md-block my-3" style={{ minHeight: '90px' }}>
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
                name={category?.sName}
                favBtn
                desc={category?.sContent}
                type={seoData?.eType === 'ct' && category?.eType === 'p' ? 'pct' : category?.eType}
                id={seoData?.iId}
                isFavorite={category?.bIsFav}
                isFantasyArticle={isFantasyArticle}
              />
              {getNav()}
              <Ads
                id="div-ad-gpt-138639789-Desktop_SP_ATF_728"
                adIdDesktop="Crictracker2022_Desktop_SP_ATF_728x90"
                adIdMobile="Crictracker2022_Mobile_SP_ATF_300x250"
                dimensionDesktop={[728, 90]}
                dimensionMobile={[300, 250]}
                mobile
                className="text-center mb-4"
              />
              {children({ activeTab, changeTab: (e) => setActiveTab(e) })}
            </Col>
            <Col xl={4} xxl={3} className="common-sidebar">
              <AllWidget type={WIDGET.ranking} show />
              <AllWidget type={WIDGET.currentSeries} show />
              {/* In the right side bar desktop/mobile */}
              <Ads
                id="div-ad-gpt-138639789-164660-Crictracker2022_Desktop_SP_RightATF_300"
                adIdDesktop="Crictracker2022_Desktop_SP_RightATF_300x600"
                adIdMobile="Crictracker2022_Mobile_SP_BTF_300x250"
                dimensionDesktop={[300, 600]}
                dimensionMobile={[300, 250]}
                mobile
                className="text-center sticky-ads"
              />
            </Col>
          </Row>
          {category?.eType === 's' && ( // Only for simple category mobile/desktop
            <Ads
              id="div-ad-gpt-138639789-16466-Crictracker2022_Desktop_SP_"
              adIdDesktop="Crictracker2022_Desktop_SP_BTF_728x90"
              adIdMobile="Crictracker2022_Mobile_SP_BTF2_300x250"
              dimensionDesktop={[728, 90]}
              dimensionMobile={[300, 250]}
              mobile
              className={'text-center mt-4'}
            />
          )}
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
  tab: PropTypes.string
}

export default CategoryContent
