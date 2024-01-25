import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import LayoutAMP from '@shared-components/layout/layoutAmp'
import { navLoader } from '@shared/libs/allLoader'
import { useRouter } from 'next/router'
import { seriesCategoryNav } from '@shared/constants/allNavBars'

const PageHeaderAMP = dynamic(() => import('@shared-components/amp/pageHeaderAMP'))
const CommonNavAMP = dynamic(() => import('@shared-components/amp/commonNavAMP'), { loading: () => navLoader() })
const ClientCommonNavAMP = dynamic(() => import('@shared-components/amp/commonNavAMP/client'), { loading: () => navLoader() })

const categoryContentAMP = ({ seoData, children, category, isFantasyArticle, showNav, reWriteURLS }) => {
  const router = useRouter()
  const activePath = router.asPath.replace('?amp=1', '')
  const activeTab = router?.query?.tab ? router?.query?.tab : 'home'

  function getNav() {
    if (showNav) {
      if (category?.eType === 'gt' || category?.eType === 'p' || category?.eType === 't' || category?.eType === 's' || category?.eType === 'fac') {
        return (
          <ClientCommonNavAMP
            items={seriesCategoryNav({
              isSeries: category?.eType
            })}
            active={activeTab}
          />
        )
      } else {
        return (
          <CommonNavAMP items={seriesCategoryNav({
            slug: category?.oSeo?.sSlug,
            activePath: activePath,
            isSeries: category?.eType,
            totalTeams: category?.oSeries?.nTotalTeams,
            tabName: seoData?.eTabType,
            tabSlug: `/${seoData?.sSlug}/`,
            reWriteURLS
          })} />
        )
      }
    }
  }

  return (
    <>
      <style jsx amp-custom>{`
        main { padding: 30px 0; background: #f2f4f7; font-family:Noto Sans Display,sans-serif; min-height: calc(100vh - 157px)  }
        .container { margin: 0px auto; width: 966px; max-width: calc(100% - 24px); }
        @media (max-width: 767px) { main { padding-bottom: 60px;} }
      `}
      </style>
      <LayoutAMP data={{ ...category, sTitle: category?.sName, oSeo: seoData }}>
        <main>
          <div className="container">
            <PageHeaderAMP
              name={category?.sName}
              favBtn
              desc={category?.sContent}
              type={seoData?.eType === 'ct' && category?.eType === 'p' ? 'pct' : category?.eType}
              id={seoData?.iId}
              isFavorite={category?.bIsFav}
              isFantasyArticle={isFantasyArticle}
            />
            {getNav()}
            {children}
          </div>
        </main>
      </LayoutAMP>
    </>
  )
}
categoryContentAMP.propTypes = {
  seoData: PropTypes.object,
  category: PropTypes.object,
  children: PropTypes.node,
  isFantasyArticle: PropTypes.bool,
  showNav: PropTypes.bool,
  reWriteURLS: PropTypes.array
}

export default categoryContentAMP
