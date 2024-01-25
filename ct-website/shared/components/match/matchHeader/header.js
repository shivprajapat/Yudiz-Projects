import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { convertDate, dateCheck } from '@shared/utils'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

const SocialShare = dynamic(() => import('@shared-components/socialShare'))
export default function Header({ data }) {
  const { t } = useTranslation()
  return (
    <>
      <section className={styles.matchHeader}>
        <div className={`${styles.head} d-md-flex align-items-start justify-content-between`}>
          <div>
            <h4>
              {data?.sTitle}
              {data?.sSubtitle && ', ' + data?.sSubtitle} - {t('common:LiveCricketScore')}
            </h4>
            <p className="small-text text-muted mb-0">
              <span>
                <Link href={`/${data?.oSeries?.oCategory?.oSeo?.sSlug || data?.oSeries?.oSeo?.sSlug}`} prefetch={false}>
                  <a>
                    {data?.oSeries?.sTitle}
                    {data?.oSeries?.sSeason && ', ' + data?.oSeries?.sSeason}
                  </a>
                </Link>
              </span>
              <span>{data?.dStartDate && ' | ' + convertDate(dateCheck(data?.dStartDate))}</span>
              <span>{data?.oVenue?.sName && ' | ' + data?.oVenue?.sName}</span>
            </p>
          </div>
          <div className={`${styles.btns} d-flex justify-content-end`}>
            <SocialShare />
          </div>
        </div>
      </section>
    </>
  )
}

Header.propTypes = {
  data: PropTypes.object
}
