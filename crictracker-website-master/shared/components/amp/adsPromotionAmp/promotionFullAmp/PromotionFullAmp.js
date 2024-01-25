import React from 'react'
import PropTypes from 'prop-types'

import TimerAmp from './Timer'
import MatchScore from './MatchScore'
// import { ELEVEN_WICKETS } from '@shared/constants'
import CustomLink from '@shared/components/customLink'

const PromotionFullAmp = ({ match }) => {
  // const matchTitle = match?.oSeries?.sTitle
  return (
    <>
      <style jsx amp-custom global>
        {`
        .promotion::before{content:"";position:absolute;display:block}.promotion{padding:12px;background-image:linear-gradient(136deg, #30A8EF 0%, #2C3697 100%);color:#fff;border-radius:16px;position:relative}.promotion::before{width:100%;height:100%;opacity:.1;z-index:1;left:0;top:0;background-image:repeating-linear-gradient(135deg, #fff 0%, #fff 5%, transparent 5.1%, transparent 10%)}.promotion .badge{background:#fff;color:#045de9;padding:2px 8px;border-radius:2em}.promotion .badge.badge-danger{color:#f14f4f}.promotion h3{font-weight:500}.promotion a{color:#fff}.promotion .promoInfo{width:68%}.promotion .series{width:100%}.promotion .branding{width:32%;font-size:10px;line-height:14px;gap:6px;padding-left:16px;flex-shrink:0;border-left:1px solid rgba(255,255,255,.18)}.promotion .centerContent{width:100%;border:0}.promotion .text-uppercase{text-transform:uppercase}.promotion .timer{font-size:10px;line-height:14px;font-weight:400;letter-spacing:.2px}.promotion .timer .time{margin:0px 6px;width:44px}.promotion .product{margin:0px 8px 0px 6px;width:52px}.promotion .logo{width:100px}.promotion .team{padding:0px 24px}.promotion .matchInfo{gap:8px}.promotion .teamScore{min-width:74px}.fullLink{position:absolute;left:0;top:0;width:100%;height:100%;z-index:2}/*# sourceMappingURL=style.css.map */

        `}
      </style>
      <div className='promotion d-flex align-items-center text-center mb-3 mb-md-4'>
        <div className='promoInfo d-flex flex-column flex-md-row align-items-center' style={{ textAlign: 'center' }}>
          <div className='series mb-2 mb-md-0 text-center'>
            {/* <CustomLink href={'/t20/ipl-indian-premier-league/?ref=cspAMP'}>
              <a className="d-flex flex-column align-items-center text-white text-center"> */}
            <p className="text-uppercase text-small text-white text-center mb-0">Indian T20 League</p>
            <p className="text-uppercase text-small text-white text-center mb-0">{match?.sSubtitle}</p>
            {/* </a>
            </CustomLink> */}
          </div>
          <div className='centerContent flex-grow-1'>
            {
              match?.sStatusStr === 'scheduled' && <TimerAmp date={match?.dStartDate} />
            }
            {
              (match?.sStatusStr === 'live' || match?.sStatusStr === 'completed' || match?.sStatusStr === 'cancelled') && <MatchScore match={match} />
            }
          </div>
        </div>
        <div className='branding font-bold d-flex flex-column flex-md-row align-items-center justify-content-center'>
          <p className="mb-2 mb-md-0">Powered by</p>
          {/* <a href={ELEVEN_WICKETS} rel="noreferrer" target='_blank' className='d-block logoSmall'> */}
          <amp-img alt="post" src='/static/11w_short.png' width="35" height="35" layout="fixed"></amp-img>
          {/* </a> */}
          <p className='text-uppercase text-small mb-0 text-white text-nowrap'>11 WICKETS</p>
        </div>
        <CustomLink href={`/${match?.oSeo?.sSlug}?ref=cspAMP`}>
          <a className="fullLink d-flex align-items-center text-center">
          </a>
        </CustomLink>
      </div>
    </>
  )
}

PromotionFullAmp.propTypes = {
  match: PropTypes.object
}

export default PromotionFullAmp
