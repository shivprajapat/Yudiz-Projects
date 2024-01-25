import dynamic from 'next/dynamic'
import React from 'react'
import PropTypes from 'prop-types'

const Skeleton = dynamic(() => import('@shared-components/skeleton'), { ssr: false })
const MatchInfo = dynamic(() => import('../matchInfo'), {
  loading: () => (
    <div className="bg-white rounded p-3">
      {Array.from(Array(5)).map((e, i) => {
        return (
          <React.Fragment key={i}>
            <div className="d-flex">
              <Skeleton width={'10%'} className={'me-3'} />
              <Skeleton width={'25%'} />
            </div>
            <hr />
          </React.Fragment>
        )
      })}
    </div>
  )
})
const InfoList = dynamic(() => import('../../fantasyTips/infoList'))
const MatchXI = dynamic(() => import('../matchXI'))

const MatchDetailInfo = ({ data }) => {
  return (
    <>
      <MatchInfo data={data?.oMatch} />
      {(data?.oWinnerTeam !== null || data?.sAvgScore !== null || data?.sPitchCondition !== null || data?.sWeatherReport) && (
        <InfoList overViewData={data} />
      )}
      {(data?.oTeam1?.aPlayers.length !== 0 || data?.oTeam2?.aPlayers.length !== 0) && <MatchXI data={data} />}
    </>
  )
}

MatchDetailInfo.propTypes = {
  data: PropTypes.object
}

export default MatchDetailInfo
