import { useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const Result = dynamic(() => import('./result'))
const Upcoming = dynamic(() => import('./upcoming'))

const MatchHeader = ({ data, liveScoreData, currentTab, showShareBtn, isDailyHuntMode }) => {
  const [disableData, setDisableData] = useState(!!(data?.sStatusStr === 'live' || data?.sStatusStr === 'completed' || data?.sStatusStr === 'cancelled'))
  const handleTime = () => {
    setDisableData(true)
  }

  return (
    <>
      {((data?.sStatusStr === 'live' || data?.sStatusStr === 'completed' || data?.sStatusStr === 'cancelled') && disableData) && (
        <Result data={data} liveScoreData={liveScoreData} currentTab={currentTab} showShareBtn={showShareBtn} isDailyHuntMode={isDailyHuntMode} />
      )}
      {(data?.sStatusStr === 'scheduled' || !disableData) && <Upcoming showShareBtn={showShareBtn} data={data} handleTime={handleTime} />}
    </>
  )
}

export default MatchHeader

MatchHeader.propTypes = {
  data: PropTypes.object,
  liveScoreData: PropTypes.array,
  currentTab: PropTypes.string,
  showShareBtn: PropTypes.bool,
  isDailyHuntMode: PropTypes.bool
}
