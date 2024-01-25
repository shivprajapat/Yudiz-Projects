import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'

import teamPlaceholder from '@assets/images/placeholder/team-placeholder.jpg'
import { calculateAge, convertDt24h, getImgURL, getPlayerRole } from '@shared/utils'

function PlayerOverviewAMP({ playerDetails }) {
  const { t } = useTranslation()
  const playerRole = getPlayerRole(playerDetails?.sPlayingRole)

  return (
    <>
      <style jsx amp-custom>
        {`.title{margin-bottom:0}.flag{width:24px}hr{background-color:var(--light);opacity:1;border:none;height:1px;margin:1rem 0}.desc p{margin-bottom:12px}[class*=truncate-expanded-slot],[class*=truncate-collapsed-slot]{display:flex;-webkit-justify-content:flex-end;justify-content:flex-end}.read-more-less-btn{margin-left:auto;padding:5px 12px;display:block;background:#045de9;font-size:12px;line-height:18px;color:#fff;text-align:center;font-weight:700;border:1px solid #045de9;border-radius:2em;cursor:pointer}.action-btn{display:flex;-webkit-justify-content:flex-end;justify-content:flex-end}.truncate-text{margin-bottom:8px}.col-xs-6{width:50%;padding:0 12px}/*# sourceMappingURL=style.css.map */
        `}
      </style>
      <div className="playerOverview common-box">
        <div className="row">
          <div className="col-xs-6">
            <p className="title text-muted">{t('common:FullName')}</p>
            <p>{playerDetails?.sFullName || playerDetails?.sFirstName || '--'}</p>
          </div>
          <div className="col-xs-6">
            <p className="title text-muted">{t('common:Nationality')}</p>
            <p>{playerDetails?.sCountryFull || playerDetails?.sNationality || '--'}</p>
          </div>
          <div className="col-xs-6">
            <p className="title text-muted">{t('common:OtherName')}</p>
            <p>{playerDetails?.sNickName || playerDetails?.sFirstName || '--'}</p>
          </div>
          <div className="col-xs-6">
            <p className="title text-muted">{t('common:Role')}</p>
            <p>{playerRole || '--'}</p>
          </div>
          <div className="col-xs-6">
            <p className="title text-muted">{t('common:BirthDate')}</p>
            <p>{playerDetails?.dBirthDate ? `${convertDt24h(playerDetails?.dBirthDate)} (${calculateAge(playerDetails?.dBirthDate)} years)` : '--'}</p>
          </div>
          <div className='col-xs-6'>
            <p className="title text-muted">{t('common:BirthPlace')}</p>
            <p>{playerDetails?.sBirthPlace || '--'}</p>
          </div>
          <div className="col-lg-5">
            <div className="row">
              <div className="col-lg-5 col-xs-6">
                <p className="title text-muted">{t('common:BattingStyle')}</p>
                <p>{playerDetails?.sBattingStyle || '--'}</p>
              </div>
              <div className="col-lg-7 col-xs-6">
                <p className="title text-muted">{t('common:BowlingStyle')}</p>
                <p>{playerDetails?.sBowlingStyle || '--'}</p>
              </div>
            </div>
          </div>
        </div>

        {playerDetails?.aTeam?.length > 0 && (
          <>
            <hr />
            <h5 className="text-uppercase mt-2">{t('common:Teams')}</h5>
            <div className="row">
              {playerDetails?.aTeam?.map(({ oTeam }, index) => {
                return (
                  <div className="col-lg-4 col-md-6" key={index}>
                    <div className="d-flex align-items-center mb-2">
                      <div className="flag me-2 me-md-3 rounded-circle overflow-hidden">
                        <amp-img
                          src={getImgURL(oTeam?.oImg?.sUrl) || teamPlaceholder.src}
                          width="32"
                          height="32"
                          alt={oTeam?.oImg?.sText || 'teamFlag'}
                          layout="responsive"
                        ></amp-img>
                      </div>
                      {oTeam?.eTagStatus === 'a' ? <a href={`/${oTeam?.oSeo?.sSlug}/`}>{oTeam?.sTitle}</a> : oTeam?.sTitle}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
        {playerDetails?.sContent && (
          <>
            <hr />
            <h5 className="text-uppercase mt-2">{t('common:About')}</h5>
            <div className="mt-2">
              <amp-truncate-text layout="fixed-height" height="7em">
                <div className="desc active truncate-text big-text" dangerouslySetInnerHTML={{ __html: playerDetails?.sAmpContent || playerDetails?.sContent }}></div>
                <div slot="collapsed" className="action-btn">
                  <button className="read-more-less-btn">{t('common:ReadMore')}</button>
                </div>
                <div slot="expanded" className="demo">
                  <button className="read-more-less-btn">{t('common:ReadLess')}</button>
                </div>
              </amp-truncate-text>
            </div>
          </>
        )}
      </div>
    </>
  )
}

PlayerOverviewAMP.propTypes = {
  playerDetails: PropTypes.object
}
export default PlayerOverviewAMP
