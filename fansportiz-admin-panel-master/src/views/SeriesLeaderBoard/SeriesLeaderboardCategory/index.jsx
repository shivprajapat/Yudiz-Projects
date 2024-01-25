import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import LeagueHeader from '../../Leagues/Header/LeagueHeader'
import { getSeriesCount, getSeriesLBCategoryList, getSeriesLeaderBoardDetails, PrizeCalculate, WinPrizeDistribution } from '../../../actions/seriesLeaderBoard'
import SeriesLeaderBoardCategory from './SeriesLeaderBoardCategory'
import PropTypes from 'prop-types'

function SeriesLBCategory (props) {
  const { match } = props
  const token = useSelector(state => state.auth.token)
  const seriesLBCategoryList = useSelector(state => state.seriesLeaderBoard.seriesLBCategoryList)?.sort((a, b) => a.nMaxRank - b.nMaxRank)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const dispatch = useDispatch()

  const [prizeCalculateFlag, setPrizeCalculateFlag] = useState(false)
  const [winPrizeCalculateFlag, setWinPrizeCalculateFlag] = useState(false)
  const [prizeCalculateInterval, setPrizeCalculateInterval] = useState({})
  const [winPrizeCalculateInterval, setWinPrizeCalculateInterval] = useState({})

  const seriesCount = useSelector(state => state.seriesLeaderBoard.seriesCount)

  useEffect(() => {
    // getList()
    // leagueCountFunc()
    if (match.params.id) {
      dispatch(getSeriesLeaderBoardDetails(match.params.id, token))
    }
  }, [])

  function getList () {
    dispatch(getSeriesLBCategoryList(match.params.id, token))
  }

  useEffect(() => {
    if (seriesCount) {
      if (seriesCount?.nPrizeCalculatedCategory === seriesCount?.nSeriesCategoryCount) {
        setPrizeCalculateFlag(false)
        clearInterval(prizeCalculateInterval)
      }
      if (seriesCount?.nWinDistributedCategory === seriesCount?.nSeriesCategoryCount) {
        setWinPrizeCalculateFlag(false)
        clearInterval(winPrizeCalculateInterval)
      }
    }
  }, [seriesCount])

  useEffect(() => {
    if (prizeCalculateFlag) {
      const intervalPriceCalculate = setInterval(() => {
        leagueCountFunc()
      }, 2000)
      setPrizeCalculateInterval(intervalPriceCalculate)
    }
  }, [prizeCalculateFlag])

  useEffect(() => {
    if (winPrizeCalculateFlag) {
      const intervalWinPrizeCalculate = setInterval(() => {
        leagueCountFunc()
      }, 2000)
      setWinPrizeCalculateInterval(intervalWinPrizeCalculate)
    }
  }, [winPrizeCalculateFlag])

  function prizeDistributionFunc () {
    setPrizeCalculateFlag(true)
    dispatch(PrizeCalculate(match.params.id, token))
    if (match.params.id) {
      dispatch(getSeriesLeaderBoardDetails(match.params.id, token))
    }
  }

  function winPrizeDistributionFunc () {
    setWinPrizeCalculateFlag(true)
    dispatch(WinPrizeDistribution(match.params.id, token))
    if (match.params.id) {
      dispatch(getSeriesLeaderBoardDetails(match.params.id, token))
    }
  }

  function leagueCountFunc () {
    dispatch(getSeriesCount(match.params.id, token))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <LeagueHeader
            heading="Series LeaderBoard Category"
            buttonText="Add Series Category"
            setUrl={`/seriesLeaderBoardCategory/add-SeriesLeaderBoardCategory/${match.params.id}`}
            backUrl={`/seriesLeaderBoard/edit-SeriesLeaderBoard/${match.params.id}`}
            SearchPlaceholder="Search Series Leader Board Category"
            hidden
            addButton
            seriesDetails
            seriesLeaderBoard
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')}
            prizeDistributionFunc={prizeDistributionFunc}
            winPrizeDistributionFunc={winPrizeDistributionFunc}
            calculate
          />
          <SeriesLeaderBoardCategory
            {...props}
            list={seriesLBCategoryList}
            getList={getList}
            updateSeriesCategory={`/seriesLeaderBoardCategory/edit-SeriesLeaderBoardCategory/${match.params.id}`}
            prizeBreakupUrl={`/seriesLeaderBoardCategory/seriesLBpricebreakup-list/${match.params.id}`}
            leaderBoardUrl={`/seriesLeaderBoardCategory/seriesLeaderBoardUserRanks/${match.params.id}`}
            prizeCalculateFlag={prizeCalculateFlag}
            winPrizeCalculateFlag={winPrizeCalculateFlag}
            leagueCountFunc={leagueCountFunc}
          />
        </section>
      </main>
    </div>
  )
}

SeriesLBCategory.propTypes = {
  match: PropTypes.object
}

export default SeriesLBCategory
