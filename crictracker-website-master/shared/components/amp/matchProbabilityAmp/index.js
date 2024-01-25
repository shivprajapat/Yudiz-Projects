import React from 'react'
import PropTypes from 'prop-types'
// import Trans from 'next-translate/Trans'
import PollOptionsAmp from '@shared/components/amp/matchProbabilityAmp/pollOptionsAmp'

const MatchProbabilityAmp = ({ oPoll, isTemplate, authorName }) => {
  return (
    <>
      <section className='matchProbability'>
        <div className='title d-flex justify-content-between align-items-center'>
          <h4 className="text-uppercase">
            {isTemplate ? '{{ sTitle }}' : oPoll?.sTitle}
          </h4>
        </div>
        <div className='text-uppercase'>
          {isTemplate ? (<>
            {'{{#aField}}'}
            <PollOptionsAmp totalPollCount={'{{nTotalVote}}'} isTemplate />
            {'{{/aField}}'} </>) : (<>
              {oPoll?.aField?.map((poll, key) => {
                return <PollOptionsAmp totalPollCount={oPoll?.nTotalVote} key={key} oPollOption={poll} />
              })}
            </>)}
          <div className='xsmall-text text-capitalize px-2' style={{ textAlign: 'end' }}>{isTemplate ? '{{ nTotalVote }}' : oPoll?.nTotalVote} votes</div>
        </div>
      </section>
    </>
  )
}

MatchProbabilityAmp.propTypes = {
  oPoll: PropTypes.object,
  authorName: PropTypes.string,
  isTemplate: PropTypes.bool
}

export default MatchProbabilityAmp
