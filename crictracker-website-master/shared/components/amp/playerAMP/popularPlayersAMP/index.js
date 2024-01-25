import React from 'react'
import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import winnerIcon from '@assets/images/icon/cup-dark-icon.svg'
import PlayerImgAMP from '@shared/components/amp/playerImgAMP'

function PopularPlayersAMP({ popularPlayers }) {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>
        {`.playerPic{width:32px;border-radius:50%}.name{text-overflow:ellipsis;width:calc(100% - 48px)}.widget-title{margin-bottom:14px}.widget-title .icon{width:24px;-webkit-filter:invert(26%) sepia(93%) saturate(2578%) hue-rotate(218deg) brightness(94%) contrast(93%);filter:invert(26%) sepia(93%) saturate(2578%) hue-rotate(218deg) brightness(94%) contrast(93%)}@media(prefers-color-scheme: dark){.widget-title .icon{-webkit-filter:invert(88%) sepia(34%) saturate(4957%) hue-rotate(187deg) brightness(101%) contrast(118%);filter:invert(88%) sepia(34%) saturate(4957%) hue-rotate(187deg) brightness(101%) contrast(118%)}}/*# sourceMappingURL=style.css.map */
        `}
      </style>
      {popularPlayers?.length > 0 && (
        <div className="widget mb-4">
          <div className="widget-title">
            <h3 className="small-head d-flex align-items-center text-uppercase mb-0">
              <span className="icon me-1">
                <amp-img src={winnerIcon.src} alt="winner" width="24" height="24" layout="responsive" />
              </span>
              <span>{t('common:PopularPlayers')}</span>
            </h3>
          </div>
          <div className="common-box font-semi py-1">
            {popularPlayers?.map((ele, index) => (
              <React.Fragment key={index}>
                {ele?.eTagStatus === 'a' ? (
                  <a href={`/${ele?.oSeo?.sSlug}/?amp=1`} className="text-nowrap d-flex align-items-center my-2">
                    <span className="playerPic rounded-circle overflow-hidden me-2">
                      <PlayerImgAMP
                        head={ele?.oImg}
                        jersey={ele?.oPrimaryTeam?.oJersey}
                      />
                    </span>
                    <span className="text-nowrap name overflow-hidden mb-0">{ele?.sFirstName || ele?.sFullName}</span>
                  </a>
                ) : (
                  <div className="text-nowrap d-flex align-items-center my-2">
                    <span className="playerPic rounded-circle overflow-hidden me-2">
                      <PlayerImgAMP
                        head={ele?.oImg}
                        jersey={ele?.oPrimaryTeam?.oJersey}
                      />
                    </span>
                    <span className="text-nowrap name overflow-hidden mb-0">{ele?.sFirstName || ele?.sFullName}</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

PopularPlayersAMP.propTypes = {
  popularPlayers: PropTypes.array
}
export default PopularPlayersAMP
