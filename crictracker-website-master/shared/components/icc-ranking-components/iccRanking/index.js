import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import placeholderFlag from 'assets/images/placeholder/flag-placeholder.png'
import rank1 from 'assets/images/icon/rank-1.svg'
import rank2 from 'assets/images/icon/rank-2.svg'
import rank3 from 'assets/images/icon/rank-3.svg'
import { allRoutes } from '@shared/constants/allRoutes'
import { getImgURL } from '@shared/utils'

const MyImage = dynamic(() => import('@shared/components/myImage'))
const CustomLink = dynamic(() => import('@shared/components/customLink'))
const PlayerImg = dynamic(() => import('@shared/components/playerImg'))

const IccRanking = ({ data }) => {
  const image = {
    0: rank1,
    1: rank2,
    2: rank3
  }

  function getName(ranking) {
    if (data?.rankingType?.key === 'Teams') {
      if (ranking?.oTeams?.eTagStatus === 'a') {
        return (
          <CustomLink href={`/${ranking?.oTeams?.oSeo?.sSlug}/`}>
            <a>{ranking?.oTeams?.sTitle}</a>
          </CustomLink>
        )
      } else return ranking?.oTeams?.sTitle
    } else {
      if (ranking?.oPlayer?.eTagStatus === 'a') {
        return (
          <CustomLink href={`/${ranking?.oPlayer?.oSeo?.sSlug}/`}>
            <a>{ranking.oPlayer?.sFullName || ranking.oPlayer?.sFirstName}</a>
          </CustomLink>
        )
      } else return ranking.oPlayer?.sFullName || ranking.oPlayer?.sFirstName
    }
  }
  return (
    <>
      <h4 className="small-head mb-2">{data?.title}</h4>
      <div className={`${styles.iccRanking} mb-3 mb-md-4`}>
        {data?.aRankings?.map((ranking, index) => {
          return (<div key={ranking._id} className={`${styles.item} common-box p-2 d-flex align-items-center mb-01 br-sm`}>
            <div className={`${styles.icon} flex-shrink-0 rounded-circle overflow-hidden`}>
              {data?.rankingType?.key === 'Teams' ? (
                <MyImage
                  src={ranking?.oTeams?.oImg?.sUrl ? getImgURL(ranking?.oTeams?.oImg?.sUrl) : placeholderFlag}
                  alt={ranking?.oTeams?.oImg?.sText || ranking?.oTeams?.sTitle}
                  layout="responsive"
                  width="20"
                  height="20"
                />
              ) : (
                <PlayerImg
                  head={ranking?.oPlayer?.oImg}
                  jersey={ranking?.oJersey}
                  enableBg
                />
              )}
            </div>
            <div className="flex-grow-1">
              <p className="font-semi mb-0">{getName(ranking)}</p>
              <p className="small-text mb-0 text-muted">{ranking?.nRating}</p>
            </div>
            <div className={`${styles.rank} text-center`}>
              {index <= 2 && <MyImage key='#1' src={image[index]} alt={`Rank ${index + 1}`} layout="responsive" width="20" height="20" />}
              {index > 2 && <span className="font-semi">#{index + 1}</span>}
            </div>
          </div>)
        })}
        <CustomLink
          href={`${data.type === 'F' ? allRoutes.iccRankingsWomen : allRoutes.iccRankings}${data?.rankingType?.url}-${data?.subType?.url}`}
        >
          <a
            className={`${styles.item} theme-btn d-block p-1 text-center br-sm`}
          >
            <Trans i18nKey="common:SeeFullTable" />
          </a>
        </CustomLink>
      </div >
    </>
  )
}
IccRanking.propTypes = {
  data: PropTypes.object
}
export default IccRanking
