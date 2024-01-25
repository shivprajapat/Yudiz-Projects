import PropTypes from 'prop-types'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import style from './style.module.scss'
import InnerHTML from '@shared/components/InnerHTML'
import { convertDateAMPM, dateCheck } from '@shared/utils'

const Poll = dynamic(() => import('@shared/components/match/poll'))
const PollIcon = dynamic(() => import('@shared-components/ctIcons').then(e => e.PollIcon))

function LiveBlogCard({ data }) {
  const { t } = useTranslation()

  const isPoll = data?.eType === 'poll'
  return <>
    <div className={`${style.liveBox} ${isPoll && style.iconBox} pt-3 pt-md-4 ps-3 ps-md-4 position-relative`} id={`${data?._id}_${data?.iEventId}_${data?.sEventId}`}>
      <span className={`${style.date} d-block position-absolute px-1 fst-italic`}>{convertDateAMPM(dateCheck(data?.dPublishDate))} </span>
      {isPoll ? (
        <>
          <div className={`${style.icon} position-absolute`}>
            <PollIcon />
          </div>
          <Poll updateDate={data?.dUpdated} details={data?.oPoll} authorName={data?.oAuthor?.sFName} />
        </>
      ) : (
        <div>
          <h3>{data?.sTitle}</h3>
          <InnerHTML html={data?.sContent} />
          {data?.oPoll && <Poll updateDate={data?.dUpdated} details={data?.oPoll} authorName={data?.oAuthor?.sFName} />}
        </div>
      )}
      {(!isPoll && !data?.oPoll) ? <div className='text-capitalize'><span className='small-text'>{t('common:By')}</span> <span className='text-primary small-text fw-bold '>{data?.oAuthor?.sFName}</span> </div> : null}
    </div>
  </>
}

LiveBlogCard.propTypes = {
  data: PropTypes.object,
  firstElement: PropTypes.number
}
export default LiveBlogCard
