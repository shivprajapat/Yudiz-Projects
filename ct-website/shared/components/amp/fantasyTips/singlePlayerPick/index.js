import React from 'react'
import PropTypes from 'prop-types'
import Trans from 'next-translate/Trans'

export default function SinglePlayerPick({ data, type, platFormType }) {
  return (
    <>
      <style jsx amp-custom>{`
     .d-flex{display:flex;display:-webkit-flex}.item{margin-bottom:16px;padding:15px;background:#e7f0ff;border-radius:8px;position:relative}.item:last-child{margin-bottom:0}.imgBlock{width:64px;margin-right:8px;position:relative;text-align:center;-webkit-flex-shrink:0;flex-shrink:0}.imgBlock .img{border-radius:50%;overflow:hidden}.point{margin-top:-10px;background-color:#23272e;color:#fff;border-radius:2em;position:relative}p{margin:4px 0}.tag{width:22px;line-height:22px;position:absolute;background-color:#045de9;color:#fff;left:-6px;top:-6px;border-radius:50%}/*# sourceMappingURL=style.css.map */


     `}</style>
      <div className={`${data?.sDescription ? '' : 'half'} item d-flex flex-column flex-sm-row align-items-center align-items-sm-center`}>
        <div className="imgBlock flex-shrink-0 me-sm-3 text-center">
          <div className="img">
            <amp-img src={'/static/player-placeholder.jpg'} alt="user" layout="responsive" width="40" height="40" />
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
            {data?.oPlayerFan?.oTeam?.sAbbr && data?.oPlayerFan?.oTeam?.sAbbr + ' | '} {data?.oPlayerFan?.oPlayer?.sPlayingRole.toUpperCase()}
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
  platFormType: PropTypes.string
}
