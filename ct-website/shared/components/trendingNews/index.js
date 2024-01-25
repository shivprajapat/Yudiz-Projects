import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import { useQuery } from '@apollo/client'

import styles from './style.module.scss'
import { TrendingIcon } from '../ctIcons'
import { TRENDING_NEWS } from '@graphql/home/home.query'

const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const TrendingNewsContent = dynamic(() => import('@shared-components/trendingNews/trendingNewsContent'), {
  loading: () => loader
})

const loader =
  <>
    {Array.from(Array(3)).map((e, i) => {
      return (
        <div className='my-3 d-flex' key={i}>
          <div>
            <Skeleton height={'24px'} width={'25px '} />
          </div>
          <div className='w-100 ps-2'>
            <Skeleton height={'14px'} width={'72px '} />
            <Skeleton className={'mt-2'} />
            <Skeleton className={'mt-2'} />
            <Skeleton width={'50%'} className={'mt-2'} />
            <Skeleton height={'1px '} className={'mt-3'} />
          </div>
        </div>
      )
    })}

  </>

function TrendingNews() {
  const { t } = useTranslation()

  const { data, loading } = useQuery(TRENDING_NEWS, {
    variables: { input: { nSkip: 0, nLimit: 3 } }
  })

  return (
    <>
      {data?.getTrendingNews?.aResults.length !== 0 && <div className={`${styles.trendingNews} trending-news widget`}>
        <h3 className="small-head d-flex align-items-center text-uppercase justify-content-center justify-content-md-start">
          <TrendingIcon />
          <span>{t('common:TrendingNews')}</span>
        </h3>
        <div className={`${styles.trendingList}`}>
          {!loading && <TrendingNewsContent data={data?.getTrendingNews?.aResults} />}
          {loading && loader}
        </div>
      </div>}
    </>
  )
}

export default TrendingNews
