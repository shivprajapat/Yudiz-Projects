import React from 'react'
import PropTypes from 'prop-types'
import ScoreCards from '../components/ScoreCard/ScoreCards'

function ScoreCard (props) {
  return (
    <>
      <div className='full-screens'>
        <ScoreCards {...props} />
      </div>
    </>
  )
}

ScoreCard.propTypes = {
  match: PropTypes.object
}
export default ScoreCard
