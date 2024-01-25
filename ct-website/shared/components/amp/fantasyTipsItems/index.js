import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import { convertDt24h, dateCheck, hourFromTimeStamp } from '@utils'
import useTranslation from 'next-translate/useTranslation'
import { S3_PREFIX } from '@shared/constants'

const FantasyTipsItems = ({ data, isSeries }) => {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>{`
  .mb-0{margin:0}.me-2{margin-right:8px}.mx-4{margin:0 24px}.t-center{text-align:center}.d-block{display:block}.d-flex{display:flex;-webkit-display:flex}.align-items-center{align-items:center;-webkit-align-items:center}.col-md-5{flex:0 0 auto;width:41.66666667%}.col-md-7{flex:0 0 auto;width:58.33333333%}.justify-content-center{justify-content:center;-webkit-justify-content:center}.big-text{font-size:16px;line-height:24px}p{font-size:14px;line-height:20px}.common-box{margin-bottom:24px;padding:16px;background:#fff;border-radius:16px}.common-box>:last-child{margin-bottom:0}.title{margin-top:20px;font-weight:600;color:#045de9}.matchInfo{border-right:1px solid #e4e6eb}.item{margin-bottom:2px}.teams{margin:12px 0}.flag{width:28px}.tipsBtn{margin-right:32px;text-decoration:none}.tipsBtn.dream11{color:#db0100}.tipsBtn.eleWickets{color:#7641a4}.tipsBtn.gamezy{color:#2400a8}.tipsBtn.my11circle{color:#e42400}.tipsBtn .icon{width:28px;overflow:hidden;border-radius:50%}.tipsBtn:last-child{margin-right:0}.dropdownToggle{width:28px;height:28px}.dropdownToggle::after{display:none}@media(max-width: 767px){.row{flex-wrap:wrap}p{font-size:13px;line-height:18px}.big-text{font-size:14px;line-height:22px}.matchInfo{width:100%;margin-bottom:12px;padding-bottom:16px;border-right:none;border-bottom:1px solid #e4e6eb}.tipsBtn{margin-right:12px;padding:4px 8px;border-radius:2em}.tipsBtn.dream11{background:rgba(219,1,0,.08)}.tipsBtn.eleWickets{background:rgba(118,65,164,.08)}.tipsBtn.gamezy{background:rgba(36,0,168,.08)}.tipsBtn.my11circle{background:rgba(228,36,0,.08)}.tipsBtn .icon{display:none}[class*=col-]{width:100%}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div className="fantasyTips mt-4">
        {!isSeries ? <p className="title text-primary font-semi mb-2">{data?.oSeries?.sTitle}</p> : <p className="font-semi mb-2">{convertDt24h(data?.dStartDate)}</p>}
        <div className="items">
          <div className="item row d-flex flex-column flex-md-row align-items-center common-box t-center">
            <div className="matchInfo col-md-5 pe-md-2">
              <p className="p mb-0">
                {t('common:MatchStartsAt')} {hourFromTimeStamp(dateCheck(data?.dStartDate))} {t('common:IST')}
              </p>
              <div className="teams d-flex align-items-center justify-content-center">
                <div className="team d-flex align-items-center">
                  <div className="flag me-2">
                    <amp-img
                      src={data?.oTeamA?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamA?.oImg?.sUrl}` : '/static/team-placeholder.jpg'}
                      layout="responsive"
                      alt={data?.oTeamA?.sAbbr}
                      width="20"
                      height="20"
                    ></amp-img>
                  </div>
                  <p className="big-text font-semi mb-0">{data?.oTeamA?.sAbbr}</p>
                </div>
                <p className="vs mb-0 mx-4">V</p>
                <div className="team d-flex align-items-center">
                  <div className="flag me-2">
                    <amp-img
                      src={data?.oTeamB?.oImg?.sUrl ? `${S3_PREFIX}${data?.oTeamB?.oImg?.sUrl}` : '/static/team-placeholder.jpg'}
                      layout="responsive"
                      alt={data?.oTeamB?.sAbbr}
                      width="20"
                      height="20"
                    ></amp-img>
                  </div>
                  <p className="big-text font-semi mb-0">{data?.oTeamB?.sAbbr}</p>
                </div>
              </div>
              <p className="text-muted font-semi mb-0">
                {data?.sSubtitle}
                {data?.oVenue?.sLocation && ' - ' + data?.oVenue?.sLocation}
              </p>
            </div>
            <div className="tipsInfo col-md-7 ps-md-2 text-uppercase font-semi">
              {data?.aFantasyTips?.length === 0 && <p className="mb-1 mb-md-0">{t('common:FantasyTipsComingSoon')}</p>}
              {data?.aFantasyTips?.length > 0 && (
                <div className="d-flex justify-content-center align-items-center flex-wrap">
                  {data?.aFantasyTips?.map((platform) => {
                    return (
                      <React.Fragment key={platform._id}>
                        {platform?.ePlatformType === 'de' && (
                          <Link href={`/${platform?.oSeo?.sSlug || ''}`} prefetch={false}>
                            <a className="tipsBtn dream11 d-flex align-items-center mb-1 mt-1 mb-md-2 mt-sm-2">
                              <span className="icon d-block me-2 rounded-circle">
                                <amp-img src="/static/dream11-icon.png" layout="responsive" alt={t('common:Dream11')} width="24" height="24"></amp-img>
                              </span>
                              <span>{t('common:Dream11')}</span>
                            </a>
                          </Link>
                        )}
                        {platform?.ePlatformType === 'ew' && (
                          <Link href={platform?.oSeo?.sSlug || ''} prefetch={false}>
                            <a className="tipsBtn eleWickets d-flex align-items-center mb-1 mt-1 mb-md-2 mt-sm-2">
                              <span className="icon d-block me-2 rounded-circle">
                                <amp-img src="/static/11wickets-icon.png" layout="responsive" alt={t('common:11Wickets')} width="24" height="24"></amp-img>
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
    </>
  )
}

FantasyTipsItems.propTypes = {
  data: PropTypes.object,
  isSeries: PropTypes.bool
}

export default FantasyTipsItems
