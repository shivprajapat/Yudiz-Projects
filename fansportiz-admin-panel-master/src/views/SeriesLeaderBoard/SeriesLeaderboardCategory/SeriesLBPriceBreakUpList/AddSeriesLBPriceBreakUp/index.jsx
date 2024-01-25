import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Navbar from '../../../../../components/Navbar'
import { addSeriesLBPriceBreakup, getSeriesLBPrizeBreakup, updateSeriesLBPriceBreakup } from '../../../../../actions/seriesLeaderBoard'
import AddSeriesLBPrizeBreakUp from './AddSeriesLBPriceBreakup'

function AddSeriesPrizeBreakup (props) {
  const { match } = props
  const token = useSelector(state => state.auth.token)
  const [seriesLBCategoryID, setSeriesLBCategoryID] = useState('')
  const [PriceBreakupId, setPriceBreakupId] = useState('')
  const dispatch = useDispatch()
  const seriesLeaderBoardPrizeBreakupDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardPrizeBreakupDetails)

  function addSeriesLBPriceBreakUpFunc (Prize, RankFrom, RankTo, RankType, Info, Image) {
    const addSeriesLBPriceBreakUpData = {
      Prize, RankFrom, RankTo, RankType, Image, Info, seriesLBCategoryID, token
    }
    dispatch(addSeriesLBPriceBreakup(addSeriesLBPriceBreakUpData))
  }
  function updateSeriesLBPriceBreakUpFunc (Prize, RankFrom, RankTo, RankType, Info, Image) {
    const updateSeriesLBPriceBreakUpData = {
      Prize, RankFrom, RankTo, RankType, Info, Image, seriesLBCategoryID, PriceBreakupId, token
    }
    dispatch(updateSeriesLBPriceBreakup(updateSeriesLBPriceBreakUpData))
  }

  useEffect(() => {
    if (match.params.id2 && match.params.id3) {
      dispatch(getSeriesLBPrizeBreakup(match.params.id2, match.params.id3, token))
      setPriceBreakupId(match.params.id3)
    }
    setSeriesLBCategoryID(match.params.id2)
  }, [])

  return (
    <Fragment>
      <Navbar {...props} />
      <AddSeriesLBPrizeBreakUp
        {...props}
        AddSeriesPriceBreakup={addSeriesLBPriceBreakUpFunc}
        UpdateSeriesPriceBreakup={updateSeriesLBPriceBreakUpFunc}
        seriesLeaderBoardPrizeBreakupDetails={seriesLeaderBoardPrizeBreakupDetails}
        cancelLink={`/seriesLeaderBoardCategory/seriesLBpricebreakup-list/${match.params.id}/${match.params.id2}`}
      />
    </Fragment>
  )
}

AddSeriesPrizeBreakup.propTypes = {
  match: PropTypes.object
}

export default AddSeriesPrizeBreakup
