import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'
import PlayerImgAMP from '@shared/components/amp/playerImgAMP'

export default function SinglePlayerPick({ data, type, platFormType, playerTeam }) {
  return (
    <>
      <style jsx amp-custom>{`
     .item{padding:15px;background:var(--theme-light);color:var(--font-color);border-radius:8px;position:relative}.item:last-child{margin-bottom:0}.imgBlock{width:64px;position:relative;text-align:center}.imgBlock .img{border-radius:50%;overflow:hidden}.point{margin-top:-10px;background-color:#23272e;color:#fff;border-radius:2em;position:relative}p{margin:4px 0}.tag{width:22px;line-height:22px;position:absolute;background-color:#045de9;color:#fff;left:-6px;top:-6px;border-radius:50%}/*# sourceMappingURL=style.css.map */


     `}</style>
      <div className={`${data?.sDescription ? '' : 'half'} item d-flex flex-column align-items-center mb-3`}>
        <div className="imgBlock flex-shrink-0 mb-2 text-center">
          <div className="img">
            <PlayerImgAMP
              head={data?.oPlayerFan?.oPlayer?.oImg}
              jersey={playerTeam[data?.oPlayerFan?.oTeam?._id]?.oJersey}
            />
          </div>
          <div className="point">
            {data?.oPlayerFan?.nRating}
          </div>
          {type === 'captains' && (
            <div className="tag text-light bg-primary rounded-circle small-text">
              {data?.eType === 'v' ? <Trans i18nKey="common:VC" /> : <Trans i18nKey="common:C" />}
            </div>
          )}
        </div>
        <div className="text-center text-sm-start">
          <p className="mb-1 mt-2 mt-sm-0">
            <span className={`font-bold me-2 ${!data?.sDescription && 'd-block'}`}>{data?.oPlayerFan?.oPlayer?.sFirstName}</span>{' '}
            {!data?.sDescription && <br />}
            <span className="text-secondary">
              {data?.oPlayerFan?.oTeam?.sAbbr && data?.oPlayerFan?.oTeam?.sAbbr + ' | '} {data?.oPlayerFan?.oPlayer?.sPlayingRole?.toUpperCase()}
            </span>
          </p>
          {data?.sDescription && <p className="mb-0 text-secondary">{data?.sDescription}</p>}
        </div>
      </div>
    </>
  )
}

SinglePlayerPick.propTypes = {
  styles: PropTypes.any,
  data: PropTypes.object,
  type: PropTypes.string,
  platFormType: PropTypes.string,
  playerTeam: PropTypes.object
}
