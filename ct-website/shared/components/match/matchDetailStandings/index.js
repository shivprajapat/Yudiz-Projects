import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import { tableLoader } from '@shared/libs/allLoader'

const Standings = dynamic(() => import('@shared/components/series/standings'), { loading: () => tableLoader() })

const MatchDetailStandings = ({ data, roundData }) => {
  return (
    <>
      <Standings standing={data} round={roundData}/>
    </>
  )
}

MatchDetailStandings.propTypes = {
  data: PropTypes.array,
  roundData: PropTypes.array
}

export default MatchDetailStandings
