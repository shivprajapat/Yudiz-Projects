import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import styles from './style.module.scss'
import { checkIsGlanceView, convertDate, dateCheck } from '@shared/utils'
import CustomLink from '@shared/components/customLink'

const SocialShare = dynamic(() => import('@shared-components/socialShare'))

export default function Header({ data, showShareBtn = true }) {
  const { t } = useTranslation()
  const router = useRouter()
  const isGlanceView = checkIsGlanceView(router?.query)
  return (
    <>
      <section className={`${styles.matchHeader} mb-01`}>
        <div className={`${styles.head} light-bg br-md d-md-flex align-items-start justify-content-between position-relative mb-01`}>
          <div>
            <h1 className="me-4 me-md-0">
              {data?.sTitle}
              {data?.sSubtitle && ', ' + data?.sSubtitle} - {t('common:LiveCricketScore')}
            </h1>
            <p className="small-text text-muted mb-0">
              <span>
                <CustomLink href={`/${data?.oSeries?.oCategory?.oSeo?.sSlug || data?.oSeries?.oSeo?.sSlug}/`} prefetch={false}>
                  <a className={`${isGlanceView ? 'pe-none' : 'text-decoration-underline'}`}>
                    {data?.oSeries?.sTitle}
                    {data?.oSeries?.sSeason && ', ' + data?.oSeries?.sSeason}
                  </a>
                </CustomLink>
              </span>
              <span>{data?.dStartDate && ' | ' + convertDate(dateCheck(data?.dStartDate))}</span>
              <span>{data?.oVenue?.sName && ' | ' + data?.oVenue?.sName}</span>
            </p>
          </div>
          {showShareBtn && (
            <div className={`${styles.btns} d-flex justify-content-end`}>
              <SocialShare seoData={data?.oSeo} />
            </div>
          )}
        </div>
      </section>
    </>
  )
}

Header.propTypes = {
  data: PropTypes.object,
  showShareBtn: PropTypes.bool
}
