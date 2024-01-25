import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { S3_PREFIX } from '@shared/constants'
import { allRoutes } from '@shared/constants/allRoutes'
const MyImage = dynamic(() => import('@shared/components/myImage'))
function TopPlaylist({ data }) {
  const { t } = useTranslation()
  return (
    <section className={`${styles.topPlaylist} common-sm-section pt-0`}>
      <h4 className="text-uppercase">{t('common:TopPlaylist')}</h4>
      <div className={`${styles.items} d-flex text-center pb-3`}>
        {data?.map((element) => {
          return (
            <Link href={`${element?.oSeo?.sSlug}/${element?.oCategory?.eType !== 's' && element?.oSeo?.eType !== 'pl' ? `${allRoutes.cricketVideo}` : '?tab=videos'}`} key={element?._id} prefetch={false}>
              <a className={`${styles.item} d-flex align-items-center flex-shrink-0 flex-lg-shrink-1`}>
                <div className="w-100">
                  {
                    element?.sThumbnailUrl &&
                    <MyImage src={S3_PREFIX + element?.sThumbnailUrl} blurDataURL={S3_PREFIX + element?.sThumbnailUrl} width="120" height="180" alt={element?.sTitle} placeholder="blur" layout="responsive" />
                  }
                  {
                    !element?.sThumbnailUrl &&
                    <p className="big-text font-bold text-light text-uppercase mb-0 p-2 p-xl-3">{element?.sTitle}</p>
                  }
                </div>
              </a>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

TopPlaylist.propTypes = {
  data: PropTypes.array
}

export default TopPlaylist
