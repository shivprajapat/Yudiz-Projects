import React from 'react'
import PropTypes from 'prop-types'

import ScoreCard from './scorecard'

function ScorecardSliderAMP({ isSeriesTitle, seriesId, data: seriesScoreCard }) {
  const scoreCardData = isSeriesTitle ? [] : seriesScoreCard

  return (
    <>
      <style jsx amp-custom global>{`
      .scorecardSlider .live::before{content:"";position:absolute;display:block}.scorecardNav{margin:2px -6px 8px;padding-bottom:6px}.scorecardNav button{margin:0 6px;padding:5px 8px;background:transparent;font-size:12px;line-height:16px;font-weight:700;display:block;color:var(--font-secondary);border-radius:8px;text-transform:uppercase;border:1px solid transparent}.scorecardNav button:hover{color:var(--theme-color)}.scorecardNav button.active{background:#fff;color:var(--theme-color);border-color:var(--theme-medium)}.scorecardSlider{padding:16px 0;border-bottom:1px solid var(--light);overflow:hidden}.scorecardSlider .item{cursor:pointer;cursor:default;margin:0px 4px;width:300px;background:var(--light-mode-bg);border-radius:6px;font-size:11px;line-height:16px;color:var(--border-color);font-weight:600;position:relative}.scorecardSlider p{margin:0}.scorecardSlider .dark{color:var(--font-color)}.scorecardSlider .scoreCardLink{height:100%;width:100%;position:absolute;top:0;left:0;overflow:hidden;z-index:1;background:transparent;text-indent:-2000px}.scorecardSlider .head{color:#757a82}.scorecardSlider .live::before{margin-right:4px;position:relative;top:-4px;width:6px;height:6px;display:inline-block;border-radius:50%;background:#f14f4f}.scorecardSlider .switch label{color:var(--font-color);font-weight:500}.scorecardSlider .series,.scorecardSlider .result{margin:8px 0;font-weight:500;text-overflow:ellipsis}.scorecardSlider .team{margin-bottom:6px;font-size:12px;line-height:19px;position:relative}.scorecardSlider .teamName{color:var(--font-color)}.scorecardSlider .teamName span{margin-left:6px}.scorecardSlider .teamName>div{vertical-align:middle}.scorecardSlider .winner{width:18px}.scorecardSlider .btnList{margin:0px -4px}.scorecardSlider .btnList a{margin:0px 4px;padding:4px;color:var(--font-secondary);border:1px solid #d2d5d9;border-radius:2em;flex-grow:1}.scorecardSlider .btnList a:hover{border-color:var(--theme-color);color:var(--theme-color)}.scorecardSlider .teamFlag{width:20px}div[class*=carousel-button]{margin:0px;width:26px;height:50px;background:var(--light-mode-bg) no-repeat center center;border-radius:13px;border:2px solid #045de9;cursor:pointer}div[class*=carousel-button]:focus{border:2px solid #045de9}div[class*=carousel-button] [class*=arrow-backdrop],div[class*=carousel-button] [class*=arrow-icon],div[class*=carousel-button] [class*=arrow-frosting]{display:none}div[class*=carousel-button][class*=carousel-button-next]{right:0}div[class*=carousel-button][class*=carousel-button-prev]{left:0}div[class*=carousel-button][class*=carousel-button-next]:before{box-shadow:none;background:url(/static/right-theme-arrow.svg) no-repeat center center/20px auto}div[class*=carousel-button][class*=carousel-button-prev]:before{box-shadow:none;background:url(/static/left-theme-arrow.svg) no-repeat center center/20px auto}div[class*=carousel-button]::before{content:"";margin:auto;width:100%;height:100%;display:block}div[class*=carousel-button].prev::before{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}div[class*=carousel-button] .slider{margin:0px -10px}/*# sourceMappingURL=style.css.map */

    `}
      </style>
      <section className="scorecardSlider scorecard-slider">
        <div className="container">
          {scoreCardData?.length !== 0 && (
            <amp-carousel height="142" layout="fixed-height" type="carousel" role="region" aria-label="Basic usage carousel">
              {scoreCardData?.map((card, index) => {
                if (index === 1) {
                  return (
                    <React.Fragment key={card?.iMatchId}>
                      <div style={{ verticalAlign: 'top' }}>
                        <amp-ad
                          width="320"
                          height="140"
                          type="doubleclick"
                          data-slot="138639789/Crictracker2022_AMP_SP_ATF2_320x140"
                          data-multi-size-validation="false"
                          data-enable-refresh="30"
                        />
                      </div>
                      <ScoreCard card={card} key={card?.iMatchId} seriesId={seriesId} />
                    </React.Fragment>
                  )
                }
                return (
                  <ScoreCard card={card} key={card?.iMatchId} seriesId={seriesId} />
                )
              })}
            </amp-carousel>
          )}
        </div>
      </section>
    </>
  )
}

ScorecardSliderAMP.propTypes = {
  isSeriesTitle: PropTypes.bool,
  seriesId: PropTypes.string,
  data: PropTypes.array
}

export default ScorecardSliderAMP
