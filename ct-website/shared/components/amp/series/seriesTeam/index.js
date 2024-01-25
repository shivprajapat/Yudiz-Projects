import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

// import styles from './style.module.scss'
import TeamImage from '@assets/images/placeholder/team-placeholder.jpg'
import { S3_PREFIX } from '@shared/constants'

const NoDataAMP = dynamic(() => import('@shared-components/amp/noDataAMP'), { ssr: false })

function SeriesTeamAMP({ data }) {
  const { t } = useTranslation()
  const teams = data?.listSeriesTeams?.aTeams

  return (
    <>
      <style jsx amp-custom>{`
  *{box-sizing:border-box;-webkit-box-sizing:border-box}h4{margin:0 0 16px;font-size:21px;line-height:32px;font-weight:700}.d-flex{display:flex;display:-webkit-flex}.flex-sm-column{flex-direction:column;-webkit-flex-direction:column}.align-items-center{align-items:center;-webkit-align-items:center}.title{text-transform:uppercase}.teamList{flex-wrap:wrap;margin:0 -12px}.teamList>div{width:25%;padding:0 12px}.t-center{text-align:center}.team{margin-bottom:24px;height:calc(100% - 24px);padding:20px 16px;background:#fff;border-radius:9px;-webkit-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;transition:all .3s ease-in-out;text-decoration:none;font-weight:600;color:#23272e;font-size:14px;line-height:20px}.team:hover{-webkit-box-shadow:0px 6px 16px rgba(166,200,255,.48);box-shadow:0px 6px 16px rgba(166,200,255,.48)}.teamLogo{width:112px;height:112px;border-radius:50%;overflow:hidden;flex-shrink:0;-webkit-flex-shrink:0}.name{margin:12px 0}@media(min-width: 992px)and (max-width: 1199px){h4{margin:0 0 12px;font-size:19px;line-height:28px}}@media(max-width: 991px){h4{margin:0 0 10px;font-size:18px;line-height:27px}}@media(max-width: 575px){h4{margin:0 0 12px;font-size:16px;line-height:26px}.title{text-align:center}.team{height:inherit;padding:16px;font-size:13px;line-height:18px}.teamLogo{width:88px;height:88px}.name{margin-top:0;padding-left:12px;font-size:18px;line-height:24px}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <section>
        {data?.listSeriesTeams && (
          <>
            <h4 className="title t-uppercase text-sm-start">{t('common:Teams')}</h4>
            <div className="teamList d-flex t-center">
              {teams?.map((team) => {
                return (
                  <div key={team?._id} className="col-xl-3 col-md-4 col-sm-6">
                    <a href={'/' + team?.oSeo?.sSlug || ''} className={`team ${team?.eTagStatus === 'p' ? 'disabled' : ''} d-flex flex-sm-column align-items-center opacity-100`}>
                      <div className="teamLogo mx-auto">
                        <amp-img
                          src={team?.oImg?.sUrl ? `${S3_PREFIX}${team?.oImg?.sUrl}` : TeamImage}
                          alt={team?.sTitle}
                          width={112}
                          height={112}
                          layout="responsive"
                        ></amp-img>
                      </div>
                      <div className="flex-grow-1">
                        <p className="name font-bold">{team?.sTitle}</p>
                        {/* <Link href={'/' + team?.oSeo?.sSlug || ''}>
                        <a className={`${styles.teamBtn} theme-btn small-btn ${team?.eTagStatus === 'p' ? 'disabled' : ''}`}>{t('common:ViewProfile')}</a>
                      </Link> */}
                      </div>
                    </a>
                  </div>
                )
              })}
            </div>
          </>
        )}
        {!data?.listSeriesTeams && <NoDataAMP />}
      </section>
    </>
  )
}
SeriesTeamAMP.propTypes = {
  data: PropTypes.object
}

export default SeriesTeamAMP
