import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import PlayerImgAMP from '@shared/components/amp/playerImgAMP'
export default function PlayerRoles({ data, capData, playerData, teamA, playerTeam }) {
  return (
    <>
      <style jsx amp-custom>{`
        .b-circle{border-radius:50%}.player{margin:0 4px;width:60px;flex-grow:1;max-width:24%;position:relative;font-size:12px}.player .playerImg{width:48px}.tag{width:20px;line-height:20px;background:#045de9;color:#fff;position:absolute;left:-2px;top:-2px}.name{margin-top:-6px;padding:2px 4px;position:relative;font-size:10px;line-height:11px;background:#fff;color:#23272e;border-radius:3px;word-break:break-word}.name span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.name.bg-dark{background:#23272e;color:#fff}p{margin:0;color:#fff}.rating{font-size:10px}/*# sourceMappingURL=style.css.map */

       `}</style>
      <div className="player ms-2 me-2 ms-md-4 me-md-4 flex-shrink-t">
        <div className="playerImg mx-auto">
          <PlayerImgAMP
            head={data?.oPlayer?.oImg}
            jersey={playerTeam?.oJersey}
            enableBg
          />
        </div>
        <div className={`name ${teamA === data?.oTeam?._id ? '' : 'bg-dark text-light'}`}>
          <span>{data?.oPlayer?.sShortName || data?.oPlayer?.sFirstName}</span>
        </div>
        {data?._id === capData?.oCapFan?._id && (
          <div className="tag text-light bg-primary b-circle small-text">
            <Trans i18nKey="common:C" />
          </div>
        )}
        {data?._id === capData?.oVCFan?._id && (
          <div className="tag text-light bg-primary b-circle small-text">
            <Trans i18nKey="common:VC" />
          </div>
        )}
        {data?._id === capData?.oTPFan?._id && (
          <div className="tag text-light bg-primary b-circle small-text">12</div>
        )}
        <p className="rating xsmall-text text-light mt-1">{data?.nRating}</p>
      </div>
    </>
  )
}

PlayerRoles.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  capData: PropTypes.object,
  playerData: PropTypes.array,
  playerTeam: PropTypes.object,
  teamA: PropTypes.string
}
