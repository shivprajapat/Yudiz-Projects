import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
export default function PlayerRoles({ data, capData, playerData, teamA }) {
  return (
    <>
      <style jsx amp-custom>{`
        .b-circle{border-radius:50%}.mx-auto{margin:auto}.player{margin:0 20px;width:68px;position:relative;font-size:12px}.player .playerImg{width:58px}.tag{width:22px;line-height:22px;background:#045de9;color:#fff;position:absolute;left:-2px;top:-2px}.name{margin-top:-6px;padding:4px 4px;position:relative;font-size:11px;line-height:13px;background:#fff;border-radius:3px}.name.bg-dark{background:#23272e;color:#fff}p{margin:0;color:#fff}@media(max-width: 767px){.player{margin:0 8px;width:60px}.player .playerImg{width:54px}}/*# sourceMappingURL=style.css.map */

       `}</style>
      <div className="player ms-2 me-2 ms-md-4 me-md-4 flex-shrink-t">
        <div className="playerImg mx-auto">
          <amp-img className="b-circle" src="/static/player-placeholder.jpg" alt="user" placeholder="blur" layout="responsive" width="40" height="40">
          </amp-img>
        </div>
        <div className={`name ${teamA === data?.oTeam?._id ? '' : 'bg-dark text-light'}`}>{data?.oPlayer?.sShortName || data?.oPlayer?.sFirstName}</div>
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
        <p className="xsmall-text text-light mt-1">{data?.nRating}</p>
      </div>
    </>
  )
}

PlayerRoles.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  capData: PropTypes.object,
  playerData: PropTypes.array,
  teamA: PropTypes.string
}
