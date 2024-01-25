import React from 'react'
import PropTypes from 'prop-types'

// import styles from './style.module.scss'
import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
import seriesPlaceholder from '@assets/images/placeholder/series-placeholder.jpg'
import useTranslation from 'next-translate/useTranslation'
import PlayerImgAMP from '@shared/components/amp/playerImgAMP'

const SearchCard = ({ data }) => {
  const { t } = useTranslation()

  return (
    <>
      <style jsx amp-custom>{`
      .common-box{margin-bottom:24px;padding:16px;background:var(--light-mode-bg);border-radius:16px}.common-box>:last-child{margin-bottom:0}.searchCard .icon{margin-right:8px;width:60px;border-radius:50%;overflow:hidden}h3{margin:0px 0px 2px;font-size:18px;line-height:24px}p{margin:0;font-size:14px;line-height:20px}@media(max-width: 1199px){h3{font-size:17px;line-height:23px}}@media(max-width: 767px){.common-box{margin-bottom:20px;padding:12px;border-radius:12px}h3{font-size:16px;line-height:22px}p{margin:0;font-size:13px;line-height:18px}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div className="searchCard common-box d-flex align-items-center mb-2 mb-md-3 mb-xl-4">
        <div className="icon rounded-circle overflow-hidden me-2 flex-shrink-0">
          {data?.oSeo?.eType === 'p' && (
            <PlayerImgAMP
              head={data?.oImg}
              jersey={data?.oTeam?.oJersey}
              enableBg
            />
          )}
          {data?.oSeo?.eType !== 'p' && (
            <amp-img
              src={data?.oSeo?.eType === 't' ? teamPlaceholder : seriesPlaceholder}
              alt={data?.sTitle}
              layout="responsive"
              width="40"
              height="40"
            ></amp-img>
          )}
        </div>
        <div>
          <h3 className="small-head small-head font-semi mb-0">
            {(data?.oSeo?.eType === 'p' || data?.oSeo?.eType === 't') ? (
              data?.eTagStatus === 'a' ? (
                <a href={'/' + data?.oSeo?.sSlug}>{data?.sFullName || data?.sTitle || data?.sFirstName}</a>
              ) : (
                data?.sFullName || data?.sTitle || data?.sFirstName
              )
            ) : (
              <a href={`/${data?.iCategoryId ? data?.oCategory?.oSeo?.sSlug : data?.oSeo?.sSlug}`}>{data?.sFullName || data?.sTitle || data?.sFirstName}</a>
            )}
          </h3>
          {data?.sSeason && <p className="small-text secondary-text mb-0 mt-1">{data?.sSeason}</p>}
          {data?.oSeo?.eType === 'p' && (
            <p className="small-text secondary-text mb-0 mt-1">
              <span className="text-capitalize">{data?.sPlayingRole === 'wk' ? t('common:WicketKeeper') : data?.sPlayingRole === 'all' ? t('common:AllRounder') : data?.sPlayingRole === 'bat' ? t('common:Batsman') : data?.sPlayingRole === 'bowl' ? t('common:Bowler') : t('common:WicketKeeperBatsman')}</span>
            </p>
          )}
        </div>
      </div>
    </>
  )
}
SearchCard.propTypes = {
  data: PropTypes.object
}

export default SearchCard
