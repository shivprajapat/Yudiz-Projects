import { Col, Container, Row } from 'react-bootstrap'
import React from 'react'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'

import { WIDGET } from '@shared/constants'
import { convertDt24hFormat, dateCheck, groupBy } from '@shared/utils'
import useTranslation from 'next-translate/useTranslation'
import Trans from 'next-translate/Trans'
import { getDeviceInfo } from '@shared/libs/menu'

const Ads = dynamic(() => import('@shared/components/ads'), { ssr: false })
const AllWidget = dynamic(() => import('@shared/components/allWidget'))
const IccRanking = dynamic(() => import('@shared/components/icc-ranking-components/iccRanking'))
const IccRankingHead = dynamic(() => import('@shared/components/icc-ranking-components/iccRankingHead'))

const IccRankingContent = ({ type, rankingOverviewData = [] }) => {
  const { isMobile } = getDeviceInfo()
  const lastUpdatedOn = rankingOverviewData && rankingOverviewData[0]?.aRanking[0]?.dUpdated
  const data = groupBy(rankingOverviewData, (t) => t?.eRank)
  const { t } = useTranslation()
  const types = [{ label: t('common:Team'), key: 'Teams', url: 'teams' }, { label: t('common:Batting'), key: 'Batsmen', url: 'batting' }, { label: t('common:Bowling'), key: 'Bowlers', url: 'bowling' }, { label: t('common:AllRounder'), key: 'AllRounders', url: 'all-rounder' }]
  const subTypes = [{ label: t('common:T20i'), key: 'T20s', url: 't20i' }, { label: t('common:ODI'), key: 'Odis', url: 'odi' }, { label: t('common:Test'), key: 'Tests', url: 'test' }]
  if (type === 'F') subTypes.pop()
  return (
    <main className="my-3 my-md-4">
      <Container>
        <Row>
          <Col lg={9} className="left-content">
            <IccRankingHead type={type} />
            {types.map((rankingType, i) => {
              const sortedRankings = data[rankingType.key]?.aRanking?.sort((a, b) => parseFloat(a.nRank) - parseFloat(b.nRank))
              return (
                <React.Fragment key={i}>
                  {sortedRankings?.length > 0 && (
                    <h4 className="mb-2">
                      {type === 'F' ? <Trans i18nKey="common:Womens" /> : <Trans i18nKey="common:Mens" />} {rankingType?.label} <Trans i18nKey="common:Rankings" />
                    </h4 >
                  )}
                  <Row className="gx-2 gx-md-3">
                    {subTypes.map((subType, i) => {
                      const data = {
                        subType,
                        rankingType,
                        type,
                        aRankings: sortedRankings?.filter(sorted => sorted.eMatchType === subType.key),
                        title: `${subType.label} ${rankingType.label}`
                      }
                      return data.aRankings?.length ? (
                        <Col key={`${data?.rankingType?.key}${data?.subType?.key}${i}`} md={4}>
                          <IccRanking data={data} />
                        </Col>
                      ) : null
                    })}
                  </Row>
                </React.Fragment>
              )
            })}
            {lastUpdatedOn && (
              <div className="table-footer-note xsmall-text mt-n1">
                <Trans i18nKey="common:LastUpdatedOn" /> {convertDt24hFormat(dateCheck(lastUpdatedOn))}
              </div>
            )}
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
    </main >
  )
}
IccRankingContent.propTypes = {
  type: PropTypes.oneOf(['M', 'F']),
  rankingOverviewData: PropTypes.array
}
export default IccRankingContent
