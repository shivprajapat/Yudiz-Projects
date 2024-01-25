import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
// import { Dropdown } from 'react-bootstrap'

import styles from './style.module.scss'
import indFlag from '@assets/images/placeholder/team-placeholder.jpg'
import eleWickets from '@assets/images/icon/11wickets-icon.png'
import dream11 from '@assets/images/icon/dream11-icon.png'
import { convertDt24h, dateCheck, hourFromTimeStamp } from '@utils'
import useTranslation from 'next-translate/useTranslation'
import { S3_PREFIX } from '@shared/constants'
// import gamezy from '@assets/images/icon/gamezy-icon.png'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const FantasyTipsItems = ({ data, isSeries }) => {
  const { t } = useTranslation()
  return (
    <div className={`${styles.fantasyTips} mt-4`} id={data?._id}>
      {!isSeries ? <p className="text-primary font-semi mb-2">{data?.oSeries?.sTitle}</p> : <p className="font-semi mb-2">{convertDt24h(data?.dStartDate)}</p>}
      <div className={styles.items}>
        <div className={`${styles.item} d-flex flex-column flex-md-row align-items-center common-box text-center`}>
          <div className={`${styles.matchInfo} col-md-5 pe-md-2`}>
            <p className={`${styles.p} mb-0`}>
              {t('common:MatchStartsAt')} {hourFromTimeStamp(dateCheck(data?.dStartDate))} {t('common:IST')}
            </p>
            <div className={`${styles.teams} d-flex align-items-center justify-content-center`}>
              <div className={`${styles.team} d-flex align-items-center`}>
                <div className={`${styles.flag} me-2`}>
                  <MyImage
                    src={data?.oTeamA?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamA?.oImg?.sUrl}` : indFlag}
                    layout="responsive"
                    alt={data?.oTeamA?.sAbbr}
                    width="20"
                    height="20"
                  />
                </div>
                <p className="big-text font-semi mb-0">{data?.oTeamA?.sAbbr}</p>
              </div>
              <p className={`${styles.vs} mb-0 ms-4 me-4`}>V</p>
              <div className={`${styles.team} d-flex align-items-center`}>
                <div className={`${styles.flag} me-2`}>
                  <MyImage
                    src={data?.oTeamB?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamB?.oImg?.sUrl}` : indFlag}
                    layout="responsive"
                    alt={data?.oTeamB?.sAbbr}
                    width="20"
                    height="20"
                  />
                </div>
                <p className="big-text font-semi mb-0">{data?.oTeamB?.sAbbr}</p>
              </div>
            </div>
            <p className="text-muted font-semi mb-0">
              {data?.sSubtitle}
              {data?.oVenue?.sLocation && ' - ' + data?.oVenue?.sLocation}
            </p>
          </div>
          <div className={`${styles.tipsInfo} col-md-7 ps-md-2 text-uppercase font-semi`}>
            {data?.aFantasyTips?.length === 0 && <p className="mb-1 mb-md-0">{t('common:FantasyTipsComingSoon')}</p>}
            {data?.aFantasyTips?.length > 0 && (
              <div className="d-flex justify-content-center align-items-center flex-wrap">
                {data?.aFantasyTips?.map((platform) => {
                  return (
                    <React.Fragment key={platform._id}>
                      {platform?.ePlatformType === 'de' && (
                        <Link href={`/${platform?.oSeo?.sSlug || ''}`} prefetch={false}>
                          <a className={`${styles.tipsBtn} ${styles.dream11} d-flex align-items-center mb-1 mt-1 mb-md-2 mt-sm-2`}>
                            <span className={`${styles.icon} d-block me-2 rounded-circle`}>
                              <MyImage src={dream11} layout="responsive" alt={t('common:Dream11')} />
                            </span>
                            <span>{t('common:Dream11')}</span>
                          </a>
                        </Link>
                      )}
                      {platform?.ePlatformType === 'ew' && (
                        <Link href={platform?.oSeo?.sSlug || ''} prefetch={false}>
                          <a className={`${styles.tipsBtn} ${styles.eleWickets} d-flex align-items-center mb-1 mt-1 mb-md-2 mt-sm-2`}>
                            <span className={`${styles.icon} d-block me-2 rounded-circle`}>
                              <MyImage src={eleWickets} layout="responsive" alt={t('common:11Wickets')} />
                            </span>
                            <span>{t('common:11Wickets')}</span>
                          </a>
                        </Link>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            )}
            {/* <Link href="/">
              <a className={`${styles.tipsBtn} ${styles.gamezy} d-flex align-items-center mb-1 mt-1 mb-md-2 mt-sm-2`}>
                <div className={`${styles.icon} me-2 rounded-circle`}>
                  <MyImage src={gamezy} layout="responsive" alt="flag" />
                </div>
                <span>Gamezy</span>
              </a>
            </Link>
             <Dropdown>
              <Dropdown.Toggle variant="link" className={`${styles.dropdownToggle} border border-dark rounded-circle font-semi`}>
                +3
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item href="#/action-1">My 11 Circle</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Gamezy</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Other</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </div>
        </div>
      </div>
    </div>
  )
}

FantasyTipsItems.propTypes = {
  data: PropTypes.object,
  isSeries: PropTypes.bool
}

export default FantasyTipsItems
