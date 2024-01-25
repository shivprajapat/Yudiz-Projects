import React from 'react'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { useQuery } from '@apollo/client'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import widgetsStyles from '../widgets.module.scss'
import { CURRENT_SERIES_LIST } from '@graphql/globalwidget/rankings.query'
import winnerIcon from '@assets/images/icon/cup-theme-icon.svg'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })

function CurrentSeries() {
  const { t } = useTranslation()

  const { data, loading } = useQuery(CURRENT_SERIES_LIST)

  const list = data?.getCurrentPopularSeries?.aResults

  return (
    <>
      {list?.length !== 0 &&
        <section className="widget">
          <div className={widgetsStyles.title}>
            <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
              <span className={`${widgetsStyles.icon} me-1`}>
                <MyImage src={winnerIcon} alt="winner" width="24" height="24" layout="responsive" />
              </span>
              <span>{t('common:CurrentSeries')}</span>
            </h3>
          </div>
          <div className={`${styles.items} font-semi`}>
            {list?.map((series) => {
              return (
                <Link key={series?._id} href={`/${series?.oSeries?.oCategory?.oSeo?.sSlug || series?.oSeries?.oSeo?.sSlug}`} prefetch={false}>
                  <a className={`${styles.item} common-box d-block mb-2`}>{series?.oSeries?.sTitle}</a>
                </Link>
              )
            })}
            {loading && (
              [0, 1, 2, 3, 4].map(i => <div key={i} className='bg-white p-3 rounded mb-2'> <Skeleton height={'20px'} /> </div>)
            )}
          </div>
        </section>
      }
    </>
  )
}

export default CurrentSeries
