import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import playerPlaceholder from '@assets/images/placeholder/player-placeholder.jpg'
import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
import seriesPlaceholder from '@assets/images/placeholder/series-placeholder.jpg'
import { getImgURL } from '@shared/utils'
import useTranslation from 'next-translate/useTranslation'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const SearchCard = ({ data }) => {
  const { t } = useTranslation()

  return (
    <div className={`${styles.searchCard} common-box d-flex align-items-center mb-2 mb-md-3 mb-xl-4`}>
      <div className={`${styles.icon} rounded-circle overflow-hidden me-2`}>
        {data?.oSeo?.eType === 'p' && (
          <MyImage
            src={getImgURL(data?.oImg?.sUrl) || playerPlaceholder}
            blurDataURL={getImgURL(data?.oImg?.sUrl) || playerPlaceholder}
            alt={data?.sFullName}
            placeholder="blur"
            layout="responsive"
            width="40"
            height="40"
          />
        )}
        {data?.oSeo?.eType !== 'p' && (
          <MyImage
            src={data?.oSeo?.eType === 't' ? teamPlaceholder : seriesPlaceholder}
            blurDataURL={teamPlaceholder}
            alt={data?.sTitle}
            placeholder="blur"
            layout="responsive"
            width="40"
            height="40"
          />
        )}
      </div>
      <div>
        <h3 className="small-head small-head font-semi mb-0">
          {(data?.oSeo?.eType === 'p' || data?.oSeo?.eType === 't') ? (
            data?.eTagStatus === 'a' ? (
              <Link href={'/' + data?.oSeo?.sSlug} prefetch={false}>
                <a>{data?.sFullName || data?.sTitle || data?.sFirstName}</a>
              </Link>
            ) : (
              data?.sFullName || data?.sTitle || data?.sFirstName
            )
          ) : (
            <Link href={`/${data?.iCategoryId ? data?.oCategory?.oSeo?.sSlug : data?.oSeo?.sSlug}`} prefetch={false}>
              <a>{data?.sFullName || data?.sTitle || data?.sFirstName}</a>
            </Link>
          )}
        </h3>
        {data?.sSeason && <p className="small-text secondary-text mb-0 mt-1">{data?.sSeason}</p>}
        {data?.oSeo?.eType === 'p' && (
          <p className="small-text secondary-text mb-0 mt-1">
            <span className="text-capitalize">{data?.sPlayingRole === 'wk' ? t('common:WicketKeeper') : data?.sPlayingRole === 'all' ? t('common:AllRounder') : data?.sPlayingRole === 'bat' ? t('common:Batsman') : data?.sPlayingRole === 'bowl' ? t('common:Bowler') : t('common:WicketKeeperBatsman') }</span>
          </p>
        )}
      </div>
    </div>
  )
}
SearchCard.propTypes = {
  data: PropTypes.object
}

export default SearchCard
