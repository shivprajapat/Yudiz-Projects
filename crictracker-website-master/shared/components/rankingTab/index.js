import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import { Nav } from 'react-bootstrap'
import { useLazyQuery } from '@apollo/client'
import dynamic from 'next/dynamic'

import tableItemStyles from '@assets/scss/components/table-item.module.scss'
import { RANKINGS } from '@graphql/globalwidget/rankings.query'
import { allRoutes } from '@shared/constants/allRoutes'
import { convertDt24hFormat, dateCheck } from '@shared/utils'
import rankIcon from '@assets/images/icon/rank-icon-dark.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const CustomLink = dynamic(() => import('@shared/components/customLink'))

const RankingTab = ({ data }) => {
  const { t } = useTranslation()
  const payload = useRef({ eMatchType: 'Tests', eRankType: 'Teams', nLimit: 5, nSkip: 0, eGender: 'M' })
  const [getRanking, { data: newData, loading }] = useLazyQuery(RANKINGS, { variables: { input: payload.current } })

  useEffect(() => {
    if (!data?.aResults) getRanking()
  }, [])

  const rankings = newData?.getRankings?.aResults || data?.aResults

  const handleRankFilter = (value) => {
    payload.current.eRankType = value
    getRanking()
  }
  const handleMatchFilter = (value) => {
    payload.current.eMatchType = value
    getRanking()
  }
  return (
    <>
      <div className="widget">
        <div className="widget-title d-flex justify-content-between align-items-center">
          <h3 className="widget-title small-head mb-0 d-flex align-items-center text-uppercase justify-content-center justify-content-md-start">
            <span className="icon me-1">
              <MyImage src={rankIcon} alt="winner" width="24" height="24" layout="responsive" />
            </span>
            <span>{t('common:Ranking')}</span>
          </h3>
          <CustomLink href={allRoutes.iccRankings} prefetch={false}>
            <a className="theme-text font-semi">{t('common:VisitAll')}</a>
          </CustomLink>
        </div>
        <div className="light-bg br-md p-2">
          <Nav className="text-uppercase equal-width-nav mx-n1 mb-2" variant="pills">
            <Nav.Item>
              <Nav.Link className={`${payload.current.eMatchType === 'Tests' && 'active'} nav-link mx-1`} onClick={() => handleMatchFilter('Tests')}>
                {t('common:Test')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className={`${payload.current.eMatchType === 'Odis' && 'active'} nav-link mx-1`} onClick={() => handleMatchFilter('Odis')}>
                {t('common:ODI')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className={`${payload.current.eMatchType === 'T20s' && 'active'} nav-link mx-1`} onClick={() => handleMatchFilter('T20s')}>
                {t('common:T20i')}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className="simple-tab mx-n2">
            <Nav.Item>
              <Nav.Link className={`${payload.current.eRankType === 'Teams' && 'active'} nav-link`} onClick={() => handleRankFilter('Teams')}>
                {t('common:Teams')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className={`${payload.current.eRankType === 'Batsmen' && 'active'} nav-link`} onClick={() => handleRankFilter('Batsmen')}>
                {t('common:Batting')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className={`${payload.current.eRankType === 'Bowlers' && 'active'} nav-link`} onClick={() => handleRankFilter('Bowlers')}>
                {t('common:Bowling')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={`${payload.current.eRankType === 'AllRounders' && 'active'} nav-link`}
                onClick={() => handleRankFilter('AllRounders')}
              >
                {t('common:ALR')}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className={`${tableItemStyles.itemCard} text-center`}>
            <div className={`${tableItemStyles.item} ${tableItemStyles.head} border-0 d-flex align-items-center`}>
              <p className="mb-0">{t('common:Rank')}</p>
              <p className="mb-0 flex-grow-1 text-start">{payload.current.eRankType !== 'Teams' ? 'Player' : 'Team'}</p>
              <p className="mb-0">{t('common:Rating')}</p>
            </div>
            {!loading && rankings?.length === 0 && (
              <div className={tableItemStyles.item}>
                <p className="mb-0 w-100">{t('common:NoDataFound')}</p>
              </div>
            )}
            {rankings?.map((element) => {
              return (
                <div key={element._id} className={`${tableItemStyles.item} d-flex align-items-center `}>
                  <p className="mb-0 flex-shrink-0">{element.nRank}.</p>
                  <div className={`${tableItemStyles.itemDesc} d-flex align-items-center flex-grow-1 small-text`}>
                    {/* <div className={`${tableItemStyles.itemImg} flex-shrink-0`}>
                    <MyImage src={playerImg} width={80} height={80} alt={name} layout="responsive" />
                  </div> */}
                    <div>
                      <p className="mb-0">{element.sName}</p>
                      {/* {payload.current.eRankType !== 'Teams' && <p className={tableItemStyles.subText}>{element.sTeam}</p>}
                    {payload.current.eRankType === 'Teams' && (
                      <p className={tableItemStyles.subText}>
                        {t('common:Points')}: {element.nPoints}
                      </p>
                    )} */}
                    </div>
                  </div>
                  <p className="mb-0 flex-shrink-0">{element.nRating}</p>
                </div>
              )
            })}
            {(!loading && rankings) ? <>
              {rankings[0]?.dUpdated && <p className="card-footer-note xsmall-text mt-3 mb-1 text-center">
                {t('common:LastUpdatedOn')} {convertDt24hFormat(dateCheck(rankings[0]?.dUpdated))}
              </p>}
            </> : <>
              <div className="card-footer-note xsmall-text mt-3 mb-1 text-center">
                <Skeleton height={'17px'} className="d-inline-block" width="60%" />
              </div>
            </>}
            {/* <p className="card-footer-note xsmall-text mt-3 mb-1 text-center">
              {t('common:LastUpdatedOn')} {(!loading && rankings) ? convertDt24h(dateCheck(rankings[0]?.dUpdated)) : <Skeleton className="d-inline-block" width="10px" />} <Skeleton className="d-inline-block" width="50px" />
            </p> */}
          </div>
        </div>
      </div>
    </>
  )
}

RankingTab.propTypes = {
  data: PropTypes.object
}
export default RankingTab
