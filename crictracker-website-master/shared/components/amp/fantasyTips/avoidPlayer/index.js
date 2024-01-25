import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import PlayerImgAMP from '@shared/components/amp/playerImgAMP'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))

const AvoidPlayer = ({ players, platFormType, playerTeam }) => {
  const { t } = useTranslation()

  return (
    <>
      <style jsx amp-custom>{`
    .d-flex{display:flex;display:-webkit-flex}.imgBlock{width:64px;margin-right:8px;position:relative;flex-shrink:0}.imgBlock .img{border-radius:50%;overflow:hidden}.point{margin-top:-10px;background-color:#23272e;color:#fff;border-radius:2em;position:relative;text-align:center}p{margin:4px 0}@media(max-width: 575px){.list>div{margin-bottom:24px}.list>div:last-child{margin-bottom:0}.item{width:100%}}/*# sourceMappingURL=style.css.map */

    `}</style>
      <section className="avoidPlayer common-section pb-0">
        <TitleBlock title={t('common:AvoidPlayerMessage')} />
        <div className="list">
          {players &&
            players?.map((player, index) => (
              <div key={index} className="item d-flex align-items-center mb-2">
                <div className="imgBlock flex-shrink-0 me-3 text-center">
                  <div className="img">
                    <PlayerImgAMP
                      head={player?.oPlayerFan?.oPlayer?.oImg}
                      jersey={playerTeam[player?.oPlayerFan?.oTeam?._id]?.oJersey}
                      enableBg
                    />
                  </div>
                  <div className="point">
                    {player?.oPlayerFan?.nRating}
                  </div>
                </div>
                <div>
                  <p className="mb-1"><b>{player?.oPlayerFan?.oPlayer?.sFirstName}</b></p>
                  <p className="text-secondary">
                    {player?.oPlayerFan?.oTeam?.sAbbr && player?.oPlayerFan?.oTeam?.sAbbr + ' | '} {player?.oPlayerFan?.oPlayer?.sPlayingRole?.toUpperCase()}
                  </p>
                  {player?.sDescription && <p className="mb-0 text-secondary">{player?.sDescription}</p>}
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  )
}

AvoidPlayer.propTypes = {
  fantasystyles: PropTypes.any,
  players: PropTypes.array,
  platFormType: PropTypes.string,
  playerTeam: PropTypes.object
}

export default AvoidPlayer
