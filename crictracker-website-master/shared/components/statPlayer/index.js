import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Trans from 'next-translate/Trans'

import styles from './style.module.scss'
import CustomLink from '@shared/components/customLink'
import { activeTabWiseData } from '@shared/libs/fantasyMatchPlayerStats'

const PlayerImg = dynamic(() => import('@shared/components/playerImg'))

const StatPlayer = ({ data, index, activeTab, playerTeam }) => {
  const value = activeTabWiseData(activeTab, data)

  return (
    <div className={`${styles.searchCard} common-box d-flex align-items-center justify-content-between mb-2 mb-md-3`}>
      <div className='d-flex align-items-center'>
        <div className={styles.playerImage}>
          <div className={`${styles.icon} rounded-circle overflow-hidden me-2 flex-shrink-0`}>
            <PlayerImg
              head={data?.oPlayer?.oImg}
              jersey={playerTeam[data?.oTeam?._id]?.oJersey}
              enableBg
            />
          </div>
          <div className={`${styles.serialNo} text-white`}>
            <span>
              {index}
            </span>
          </div>
        </div>
        <div>
          <h3 className="small-head small-head font-semi mb-0">
            {data?.oPlayer?.eTagStatus === 'a' ? (
              <CustomLink href={'/' + data?.oPlayer?.oSeo?.sSlug} prefetch={false}>
                <a>{data?.oPlayer?.sFullName || data?.oPlayer?.sTitle || data?.oPlayer?.sFirstName}</a>
              </CustomLink>
            ) : (
              data?.oPlayer?.sFullName || data?.oPlayer?.sTitle || data?.oPlayer?.sFirstName
            )}
          </h3>
          {data?.sSeason && <p className="small-text secondary-text mb-0 mt-1">{data?.sSeason}</p>}
          <p className="small-text secondary-text text-uppercase mb-0 mt-1">
            <span>{data?.oTeam?.sAbbr}</span> - <span>{data?.oPlayer?.sPlayingRole}</span>
          </p>
        </div>
      </div>
      <div className='text-center'>
        <h4 className='mb-0 text-primary'>{value}</h4>
        <p>
          {data?.nMatches}&nbsp;
          {data?.nMatches > 1 ? <Trans i18nKey="common:Matches" /> : <Trans i18nKey="common:Match" />}
        </p>
      </div>
    </div>
  )
}
StatPlayer.propTypes = {
  data: PropTypes.object,
  playerTeam: PropTypes.object,
  index: PropTypes.number,
  activeTab: PropTypes.string
}

export default StatPlayer
