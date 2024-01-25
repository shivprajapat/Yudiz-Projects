import dynamic from 'next/dynamic'
import { Col, Container, Row } from 'react-bootstrap'
import { useRef } from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

import useWindowSize from '@shared/hooks/windowSize'
import { WIDGET } from '@shared/constants'
import { navLoader, pageHeaderLoader, tableLoader } from '@shared/libs/allLoader'
import { RANKING_TYPE } from '@shared/enum/icc-ranking'
import { allRoutes } from '@shared/constants/allRoutes'
import useTranslation from 'next-translate/useTranslation'
import { convertDt24hFormat, dateCheck } from '@shared/utils'
import { getDeviceInfo } from '@shared/libs/menu'

const NoData = dynamic(() => import('@shared/components/noData'), { ssr: false })
const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const AllWidget = dynamic(() => import('@shared/components/allWidget'))
const CommonNav = dynamic(() => import('@shared-components/commonNav'), { loading: () => navLoader() })
const ThemeTable = dynamic(() => import('@shared-components/themeTable'), { loading: () => tableLoader() })
const IccRankingHead = dynamic(() => import('@shared/components/icc-ranking-components/iccRankingHead'), { loading: () => pageHeaderLoader() })
const CustomLink = dynamic(() => import('@shared/components/customLink'))

function ICCRankingsLayout({ rankingData, eRankType, eMatchType, type }) {
  const { isMobile } = getDeviceInfo()
  const lastUpdatedOn = rankingData && rankingData[0]?.dUpdated
  const { t } = useTranslation()
  const [width] = useWindowSize()
  const nav = makeNav()
  const personLabels = useRef([t('common:Rank'), t('common:Name'), t('common:Team'), t('common:Rating')]).current
  const teamLabels = useRef([t('common:Rank'), t('common:Team'), t('common:Rating'), t('common:Points')]).current

  function makeNav() {
    const item = {
      ranking: [],
      formate: [
        {
          navItem: t('common:Test'),
          url: type === 'F' ? allRoutes.iccRankingWomanTest(RANKING_TYPE[eRankType]) : allRoutes.iccRankingTest(RANKING_TYPE[eRankType]),
          active: eMatchType === 'Tests'
        },
        {
          navItem: t('common:ODI'),
          url: type === 'F' ? allRoutes.iccRankingWomanOdi(RANKING_TYPE[eRankType]) : allRoutes.iccRankingOdi(RANKING_TYPE[eRankType]),
          active: eMatchType === 'Odis'
        },
        {
          navItem: t('common:T20i'),
          url: type === 'F' ? allRoutes.iccRankingWomanT20i(RANKING_TYPE[eRankType]) : allRoutes.iccRankingT20i(RANKING_TYPE[eRankType]),
          active: eMatchType === 'T20s'
        }
      ]
    }
    if (type === 'F') item.formate.shift()
    for (const key in RANKING_TYPE) {
      const val = RANKING_TYPE[key]
      item.ranking.push({
        navItem: val?.replaceAll('-', ' '),
        url: type === 'F' ? allRoutes.iccRankingWomanOdi(val) : allRoutes.iccRankingTest(val),
        active: key === eRankType
      })
    }
    return item
  }

  function getName(el) {
    if (eRankType === 'Teams') {
      if (el?.oTeams?.eTagStatus === 'a') {
        return (
          <CustomLink href={`/${el?.oTeams?.oSeo?.sSlug}/`}>
            <a>{el.sName}</a>
          </CustomLink>
        )
      } else return el.sName
    } else {
      if (el?.oPlayer?.eTagStatus === 'a') {
        return (
          <CustomLink href={`/${el?.oPlayer?.oSeo?.sSlug}/`}>
            <a>{el.sName}</a>
          </CustomLink>
        )
      } else return el.sName
    }
  }

  return (
    <section className="common-section">
      <Container>
        <div className="d-none d-md-block mb-3" style={{ minHeight: '90px', marginTop: '-10px' }}>
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
          <Col lg={9} className="left-content">
            <IccRankingHead type={type} />
            <CommonNav
              items={nav.ranking}
            // isSticky
            // themeLight
            />
            <CommonNav
              items={nav.formate}
              themeLight
              className="equal-width-nav"
              isSticky
            />
            <section
            // className={styles.awardsTable}
            >

              {rankingData?.length > 0 ? (
                <ThemeTable
                  labels={eRankType === 'Teams' ? teamLabels : personLabels}
                  isNumbered={true}
                  headClass={{
                    className: 'text-start',
                    index: 1
                  }}
                >
                  {rankingData?.map((el) => {
                    return (
                      <tr key={el._id} className={`${el.highlight && 'highlight'}`}>
                        <td width="10">{el.nRank}</td>
                        <td className='text-start'>{getName(el)}</td>
                        {eRankType !== 'Teams' && (
                          <td width="10">
                            {(el?.oPlayer?.sCountryFull || el?.oPlayer?.sCountry || el?.sTeam) || '-'}
                          </td>
                        )}
                        <td width="10">{el.nRating}</td>
                        {eRankType === 'Teams' && <td width="10">{el.nPoints}</td>}
                      </tr>
                    )
                  })}
                </ThemeTable>
              ) : <NoData />}
              {lastUpdatedOn && (
                <div className="table-footer-note xsmall-text mt-n1">
                  <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(lastUpdatedOn))}
                </div>
              )}
            </section>
          </Col>
          {!isMobile && (
            <Col lg={3} className="common-sidebar">
              <AllWidget type={WIDGET.cricSpecial} show />
              <Ads
                id="div-ad-gpt-138639789-1646636827-0"
                adIdDesktop="Crictracker2022_Desktop_Fix_RightATF_300x600"
                dimensionDesktop={[300, 600]}
                className="sticky-ads position-sticky mb-2"
              />
            </Col>
          )}
        </Row>
      </Container>
    </section>
  )
}
ICCRankingsLayout.propTypes = {
  rankingData: PropTypes.array,
  type: PropTypes.oneOf(['M', 'F']),
  eRankType: PropTypes.string,
  eMatchType: PropTypes.string
}
export default ICCRankingsLayout
