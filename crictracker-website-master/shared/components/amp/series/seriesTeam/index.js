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
  .title{text-transform:uppercase;text-align:center}.team{padding:12px 16px;background:var(--light-mode-bg);border-radius:9px;-webkit-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;transition:all .3s ease-in-out;text-decoration:none;font-weight:600;color:var(--font-color-light);font-size:13px;line-height:18px}.team:hover{-webkit-box-shadow:0px 6px 16px rgba(166,200,255,.48);box-shadow:0px 6px 16px rgba(166,200,255,.48)}.teamLogo{width:60px;height:60px;border-radius:50%;overflow:hidden;flex-shrink:0;-webkit-flex-shrink:0}.name{padding-left:12px;font-size:18px;line-height:24px}/*# sourceMappingURL=style.css.map */

  `}
      </style>
      <section>
        {data?.listSeriesTeams && (
          <>
            <h4 className="title t-uppercase t-center">{t('common:Teams')}</h4>
            <div className="row teamList t-center">
              {teams?.map((team) => {
                return (
                  <div key={team?._id} className="col-md-6">
                    <a href={'/' + team?.oSeo?.sSlug || ''} className={`team ${team?.eTagStatus === 'p' ? 'disabled' : ''} d-flex align-items-center opacity-100 mb-2`}>
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
                        <p className="name font-bold mb-0">{team?.sTitle}</p>
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
