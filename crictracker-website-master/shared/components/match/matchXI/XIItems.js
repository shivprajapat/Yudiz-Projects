import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'

import { AllRounderIcon, BallIcon, BatIcon, PlaneIcon, SwapIcon } from '@shared/components/ctIcons'
import PlayerImg from '@shared/components/playerImg'

const CustomLink = dynamic(() => import('@shared/components/customLink'))

const XIItems = ({ styles, data, isOutSideCountryPlane }) => {
  const { t } = useTranslation()
  return (
    <>
      <div className={`${styles.item} d-flex align-items-center`}>
        <div className={`${styles.playerImg} rounded-circle overflow-hidden flex-shrink-0`}>
          <PlayerImg
            head={data?.oPlayer?.oImg}
            jersey={data?.oTeam?.oJersey}
            enableBg
          />
        </div>
        <div className={`${styles.playerinfo} d-flex px-1 px-md-2 align-items-center flex-wrap flex-sm-nowrap`}>
          <span className={`${styles.name}`}>
            {data?.oPlayer?.eTagStatus === 'a' ? (
              <CustomLink href={`/${data?.oPlayer?.oSeo?.sSlug}/`}>
                <a>{data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName}</a>
              </CustomLink>
            ) : (
              data?.oPlayer?.sFullName || data?.oPlayer?.sFirstName
            )}
          </span>
          {data?.sRoleStr === 'cap' && (
            <span className={`${styles.captain} d-block bg-primary text-light text-center xsmall-text rounded-circle`}>
              {t('common:C')}
            </span>
          )}
          {data?.sRoleStr === 'wk' && (
            <span className={`${styles.captain} d-block bg-primary text-light text-center xsmall-text rounded-circle`}>
              {t('common:Wk')}
            </span>
          )}
          {data?.sRoleStr === 'wkcap' && (
            <span className="d-flex me-auto text-center text-light xsmall-text">
              <span className={`${styles.captain} d-block bg-primary rounded-circle`}>
                {t('common:C')}
              </span>
              <span className={`${styles.captain} d-block bg-primary rounded-circle`}>
                {t('common:Wk')}
              </span>
            </span>
          )}
          <span className="d-flex text-center text-light xsmall-text">
            <span className={`${styles.icon}`}>
              {data?.sRoleStr === 'bowl' && (
                <BallIcon />
              )}
              {data?.sRoleStr === 'bat' && (
                <BatIcon />
              )}
              {data?.sRoleStr === 'all' && (
                <AllRounderIcon />
              )}
            </span>
          </span>
          {data?.oPlayer?.sPlayingRole &&
            <span className="text-muted small-text">{data?.oPlayer?.sPlayingRole?.toUpperCase()}</span>
          }
          <div className='d-flex align-items-center gap-2'>
            {isOutSideCountryPlane && data?.bSubstitute && data?.bPlaying11 && <SwapIcon />}
            {isOutSideCountryPlane && data?.oPlayer?.sCountryFull && data?.oPlayer?.sCountryFull?.toLowerCase() !== 'india' &&
              <span className={`${styles.icon}`}><PlaneIcon /></span>
            }
          </div>
        </div>
      </div>
    </>
  )
}

XIItems.propTypes = {
  styles: PropTypes.object,
  isOutSideCountryPlane: PropTypes.bool,
  data: PropTypes.object
}

export default XIItems
