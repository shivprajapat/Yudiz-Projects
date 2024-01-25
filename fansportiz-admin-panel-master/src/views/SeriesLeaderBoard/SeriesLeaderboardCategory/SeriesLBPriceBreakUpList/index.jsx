import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Navbar from '../../../../components/Navbar'
import SeriesLBPriceBreakUpList from './SeriesPriceBreakupList'
import { getLBCategoryDetails, listOfSeriesLBPrizeBreakup } from '../../../../actions/seriesLeaderBoard'
import SeriesLBHeader from '../../Header/SeriesLBHeader'

function SeriesLeaderBoardPriceBreakup (props) {
  const { match } = props
  const [showInputFields, setShowInputFields] = useState(false)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const seriesLBPrizeBreakUpList = useSelector(state => state.seriesLeaderBoard.seriesLBPrizeBreakUpList)
  const dispatch = useDispatch()

  useEffect(() => {
    getList(match?.params?.id2)
    dispatch(getLBCategoryDetails(match?.params?.id2, token))
  }, [])

  function getList (seriesID) {
    dispatch(listOfSeriesLBPrizeBreakup(seriesID, token))
  }

  function addPrizeBreakup () {
    setShowInputFields(!showInputFields)
  }

  return (
    <div>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SeriesLBHeader
            heading="Series Prize Breakup List"
            buttonText="Add Series Prize BreakUp"
            addButton
            addPrizeBreakup={addPrizeBreakup}
            seriesLBCategoryLink={`/seriesLeaderBoardCategory/${match.params.id}`}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')}
          />
          <SeriesLBPriceBreakUpList
            {...props}
            getList={getList}
            List={seriesLBPrizeBreakUpList}
            showInputFields={showInputFields}
          />
        </section>
      </main>
    </div>
  )
}

SeriesLeaderBoardPriceBreakup.propTypes = {
  match: PropTypes.object
}

export default SeriesLeaderBoardPriceBreakup
