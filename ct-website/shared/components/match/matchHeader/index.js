import { useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const Result = dynamic(() => import('./result'))
const Upcoming = dynamic(() => import('./upcoming'))

const MatchHeader = ({ data }) => {
  const [disableData, setDisableData] = useState(false)
  const handleTime = () => {
    setDisableData(true)
  }

  return (
    <>
      {((data?.sStatusStr === 'live' || data?.sStatusStr === 'completed' || data?.sStatusStr === 'cancelled') && disableData) && <Result data={data} />}
      {(data?.sStatusStr === 'scheduled' || !disableData) && <Upcoming data={data} handleTime={handleTime}/>}
    </>
  )
}

export default MatchHeader

MatchHeader.propTypes = {
  data: PropTypes.object
}
