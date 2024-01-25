import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'

import { PollIcon } from '@shared-components/ctIcons'
import InnerHTML from '@shared/components/InnerHTML'
import MatchProbabilityAmp from '@shared/components/amp/matchProbabilityAmp'
import { convertDateAMPM, dateCheck } from '@shared/utils'
function LiveBlogCardAmp({ data, lastArticle, isTemplate }) {
  const { t } = useTranslation()

  const isPoll = data?.eType === 'poll'
  return <>
    <style jsx amp-custom >{`
    .secondary::before,.liveBox:not(.iconBox)::before{content:"";position:absolute;display:block}.icon{position:absolute;left:-10px;top:-14px;width:10px;height:10px;border-radius:50%}.date{text-transform:uppercase;font-style:italic;position:absolute;top:-10px;background-color:var(--light-mode-bg)}.liveBox{border-top:1px solid var(--border-light);position:relative}.liveBox:not(.iconBox)::before{left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;background:gray}.liveBox.liveBoxFirst:first-child::before{width:10px;height:10px;background:#f14f4f;box-shadow:0 0 0 6px rgba(241,79,79,.4),0 0 0 9px rgba(241,79,79,0)}.secondary::before{left:-5px;top:-5px;width:10px;height:10px;display:inline-block;border-radius:50%;background:gray}/*# sourceMappingURL=style.css.map */

    `}
    </style>

    <style jsx amp-custom global>{`
      .liveMain p { margin-bottom: 5px; }
    `}
    </style>

    {isTemplate ? <>
      <div id={'{{_id}}'} className='liveMain pt-2 pb-2'>
        {'{{ #oPoll }}'}
        <div className='iconBox pt-3 ps-3 mt-1 mb-1' id={'{{_id}}'}>
          <div className='icon d-inline-block'>
            <PollIcon />
          </div>
          <span className='date d-block px-1 position-absolute'>
            <amp-date-display datetime={'{{dPublishDate}}'}
              layout="fixed-height"
              height="20"
              template="date-template">
            </amp-date-display>
          </span>
          <MatchProbabilityAmp isTemplate />
          {'{{#oAuthor}}'}
          <div className='text-capitalize'>
            <span className='small-text'>{t('common:By')} </span>
            <span className='theme-text small-text font-bold '>{'{{sFName}}'}</span>
          </div>
          {'{{/oAuthor}}'}
        </div>
        {'{{ /oPoll }}'}
        {'{{ ^oPoll }}'}
        <div className='liveBox pt-3 ps-3 mt-1 mb-1' id={'{{_id}}'} >
          <span className='date d-block px-2 t-uppercase'>
            <amp-date-display datetime={'{{dPublishDate}}'}
              layout="fixed-height"
              height="20"
              template="date-template">
            </amp-date-display>
          </span>
          <div>
            <h3>{'{{sTitle}}'}</h3>
            <div> {'{{{sAmpContent}}}'}</div>
          </div>
          {'{{#oAuthor}}'}
          <div className='text-capitalize pb-2'><span className='small-text'>{t('common:By')}</span> <span className='theme-text small-text font-bold '>{'{{sFName}}'}</span> </div>
          {'{{/oAuthor}}'}
        </div>
        {'{{ /oPoll }}'}

      </div>
    </> : <>
      <div item data-update-time={data.dPublishDate} data-sort-time={new Date(data.dPublishDate).getTime()} key={data._id} className={`liveBox liveBoxFirst ${isPoll && 'iconBox'} mt-4 ${lastArticle ? 'mb-0' : 'mb-3'} pt-3 ps-3`} id={`${data?._id}_${data?.iEventId}_${data?.sEventId}`}>
        <span className='date d-block px-2 t-uppercase'>{convertDateAMPM(dateCheck(data?.dPublishDate))} </span>
        {isPoll ? <>
          <div className='icon d-inline-block'>
            <PollIcon />
          </div>
          <MatchProbabilityAmp oPoll={data?.oPoll} authorName={data?.oAuthor?.sFName} />
        </> : <div>
          <h3>{data?.sTitle}</h3>
          <InnerHTML html={data?.sAmpContent} />
        </div>}
        {<div className='text-capitalize pb-2'><span className='small-text'>{t('common:By')}</span> <span className='theme-text small-text font-bold '>{data?.oAuthor?.sFName}</span> </div>}
      </div>
    </>}
  </>
}

LiveBlogCardAmp.propTypes = {
  data: PropTypes.object,
  isTemplate: PropTypes.bool,
  lastArticle: PropTypes.bool
}
export default LiveBlogCardAmp
