import React, { useState } from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { Nav } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import tableItemStyles from '@assets/scss/components/table-item.module.scss'
import { RANKINGS } from '@graphql/globalwidget/rankings.query'
import { allRoutes } from '@shared/constants/allRoutes'
import { convertDt24hFormat, dateCheck } from '@shared/utils'
import rankIcon from '@assets/images/icon/rank-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })

const RankingTab = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState({ eMatchType: 'Tests', eRankType: 'Teams', nLimit: 5, nSkip: 0 })
  const { data: newData, loading } = useQuery(RANKINGS, {
    variables: { input: filter }
  })
  const rankings = newData?.getRankings?.aResults

  const handleRankFilter = (value) => {
    setFilter({ ...filter, eRankType: value })
  }
  const handleMatchFilter = (value) => {
    setFilter({ ...filter, eMatchType: value })
  }
  return (
    <>
      <div className={`${styles.rankingTab} widget`}>
        <div className={`${styles.title} d-flex justify-content-between align-items-center`}>
          <h3 className="small-head mb-0 d-flex align-items-center text-uppercase justify-content-center justify-content-md-start">
            <span className={`${styles.icon} me-1`}>
              <MyImage src={rankIcon} alt="winner" width="24" height="24" layout="responsive" />
            </span>
            <span>{t('common:Ranking')}</span>
          </h3>
          <Link href={allRoutes.iccRankings} prefetch={false}>
            <a className="theme-text">{t('common:VisitAll')}</a>
          </Link>
        </div>
        <div className={styles.tabContainer}>
          <Nav className={`${styles.navTab} text-uppercase equal-width-nav`} variant="pills">
            <Nav.Item>
              <Nav.Link className={`${filter.eMatchType === 'Tests' && 'active'} nav-link`} onClick={() => handleMatchFilter('Tests')}>
                {t('common:Test')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className={`${filter.eMatchType === 'Odis' && 'active'} nav-link`} onClick={() => handleMatchFilter('Odis')}>
                {t('common:ODI')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className={`${filter.eMatchType === 'T20s' && 'active'} nav-link`} onClick={() => handleMatchFilter('T20s')}>
                {t('common:T20i')}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className={`${styles.simpleTab} simple-tab`}>
            <Nav.Item>
              <Nav.Link className={`${filter.eRankType === 'Teams' && 'active'} nav-link`} onClick={() => handleRankFilter('Teams')}>
                {t('common:Teams')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className={`${filter.eRankType === 'Batsmen' && 'active'} nav-link`} onClick={() => handleRankFilter('Batsmen')}>
                {t('common:Batting')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className={`${filter.eRankType === 'Bowlers' && 'active'} nav-link`} onClick={() => handleRankFilter('Bowlers')}>
                {t('common:Bowling')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className={`${filter.eRankType === 'AllRounders' && 'active'} nav-link`}
                onClick={() => handleRankFilter('AllRounders')}
              >
                {t('common:ALR')}
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <div className={tableItemStyles.itemCard}>
            <div className={`${tableItemStyles.item} ${tableItemStyles.head} d-flex align-items-center`}>
              <p className="mb-0">{t('common:Rank')}</p>
              <p className="mb-0 flex-grow-1">{filter.eRankType !== 'Teams' ? 'Player' : 'Team'}</p>
              <p className="mb-0">{t('common:Rating')}</p>
            </div>
            {loading && [0, 1, 2, 3, 4].map((s) => {
              return (
                <div key={s} className={`${tableItemStyles.item} d-flex align-items-center `}>
                  <Skeleton height={'20px'} className="mb-0 flex-shrink-0" />
                  <Skeleton height={'20px'} className={`${tableItemStyles.itemDesc} d-flex align-items-center flex-grow-1 p-0 mx-2`} />
                  <Skeleton height={'20px'} className="mb-0 flex-shrink-0" />
                </div>
              )
            })}
            {!loading && rankings?.length === 0 && (
              <div className={tableItemStyles.item}>
                <p className="mb-0 w-100">{t('common:NoDataFound')}</p>
              </div>
            )}
            {rankings?.map((element) => {
              return (
                <div key={element._id} className={`${tableItemStyles.item} d-flex align-items-center `}>
                  <p className="mb-0 flex-shrink-0">{element.nRank}.</p>
                  <div className={`${tableItemStyles.itemDesc} d-flex align-items-center flex-grow-1`}>
                    {/* <div className={`${tableItemStyles.itemImg} flex-shrink-0`}>
                    <MyImage src={playerImg} width={80} height={80} alt={name} layout="responsive" />
                  </div> */}
                    <div>
                      <p className="mb-0">{element.sName}</p>
                      {/* {filter.eRankType !== 'Teams' && <p className={tableItemStyles.subText}>{element.sTeam}</p>}
                    {filter.eRankType === 'Teams' && (
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
              {rankings[0]?.dUpdated && <p className="card-footer-note text-center">
                {t('common:LastUpdatedOn')} {convertDt24hFormat(dateCheck(rankings[0]?.dUpdated))}
              </p>}
            </> : <>
              <div className="card-footer-note text-center">
                <Skeleton height={'17px'} className="d-inline-block" width="60%" />
              </div>
            </>}
            {/* <p className="card-footer-note text-center">
              {t('common:LastUpdatedOn')} {(!loading && rankings) ? convertDt24h(dateCheck(rankings[0]?.dUpdated)) : <Skeleton className="d-inline-block" width="10px" />} <Skeleton className="d-inline-block" width="50px" />
            </p> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default RankingTab
