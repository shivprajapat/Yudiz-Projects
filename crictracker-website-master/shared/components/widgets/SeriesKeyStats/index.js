import React, { useEffect, useState } from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { useQuery } from '@apollo/client'

import styles from './style.module.scss'
import rankIcon from '@assets/images/icon/rank-icon-dark.svg'
import SeriesKeyStatsPlayer from '@shared/components/seriesKeyStatPlayer'
import { KEY_STATS } from '@graphql/series/stats.query'

const MyImage = dynamic(() => import('@shared/components/myImage'))

function SeriesKeyStats() {
  const { t } = useTranslation()
  const [capHolder, setCapHolder] = useState([])
  const iSeriesId = '63f052b9d5e097df610db62d'

  const { data: orangeCapData } = useQuery(KEY_STATS, {
    variables: { input: { iSeriesId, _id: '62302fc0358523ee1d264d15', nLimit: 1 } }
  })
  const { data: purpleCapData } = useQuery(KEY_STATS, {
    variables: { input: { iSeriesId, _id: '6230303b358523ee1d269831', nLimit: 1 } }
  })
  const { data: mostFiftyData } = useQuery(KEY_STATS, {
    variables: { input: { iSeriesId, _id: '62303026358523ee1d2690a7', nLimit: 1 } }
  })
  const { data: MostSixesData } = useQuery(KEY_STATS, {
    variables: { input: { iSeriesId, _id: '6230302c358523ee1d2692ce', nLimit: 1 } }
  })

  useEffect(() => {
    if (orangeCapData && purpleCapData) {
      setCapHolder([...orangeCapData?.fetchSeriesStats, ...purpleCapData?.fetchSeriesStats])
    }
  }, [orangeCapData, purpleCapData])

  return (
    <>
      <section className="common-box widget px-2 pb-2 pt-3">
        <div className="widget-title d-flex align-items-center justify-content-between">
          <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
            <span className={`${styles.icon} icon me-1`}>
              <MyImage src={rankIcon} alt="winner" width="24" height="24" layout="responsive" />
            </span>
            {t('common:IPLKeyStats')}
          </h3>
        </div>
        <h5 className="big-text mb-1 ms-2 mt-3">{t('common:CapHolders')}</h5>
        <div className={`${styles.searchCard} common-box`}>
          {capHolder?.map((data, index) => {
            return <SeriesKeyStatsPlayer key={index} index={index} section="CapHolders" data={data} />
          })}
        </div>
        <h5 className="big-text mb-1 ms-2 mt-3">{t('common:MostFifties')}</h5>
        <div className={`${styles.searchCard} common-box`}>
          <SeriesKeyStatsPlayer section="MostFifties" data={mostFiftyData?.fetchSeriesStats[0] || {}} />
        </div>
        <h5 className="big-text mb-1 ms-2 mt-3">{t('common:MostSixes')}</h5>
        <div className={`${styles.searchCard} common-box`}>
          <SeriesKeyStatsPlayer section="MostSixes" data={MostSixesData?.fetchSeriesStats[0] || {}} />
        </div>
      </section>
    </>
  )
}

export default SeriesKeyStats
