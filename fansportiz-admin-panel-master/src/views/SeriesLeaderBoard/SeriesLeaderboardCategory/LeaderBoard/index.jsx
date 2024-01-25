import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import NavbarComponent from '../../../../components/Navbar'
import LeagueHeader from '../../../Leagues/Header/LeagueHeader'
import { getSeriesLeaderBoardUserRankList } from '../../../../actions/seriesLeaderBoard'
import SeriesLeaderBoardUserRankList from './SeriesLeaderBoardUserRankList'

function SeriesLeaderBoardUserRank (props) {
  const { match } = props
  const token = useSelector(state => state.auth.token)
  const [Id, setID] = useState('')
  const seriesLeaderBoardUserRankList = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardUserRankList)
  const dispatch = useDispatch()
  const content = useRef()

  useEffect(() => {
    if (match && match.params && match.params.id) {
      setID(match.params.id)
    }
  }, [])

  function getList (start, limit, isFullList) {
    if (match && match.params && match.params.id2) {
      const data = {
        start, limit, isFullList, categoryId: match.params.id2, token
      }
      dispatch(getSeriesLeaderBoardUserRankList(data))
    }
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <LeagueHeader
            heading="Leader Board"
            seriesLBCategory
            hidden
            onExport={onExport}
            list={seriesLeaderBoardUserRankList}
            backUrl={`/seriesLeaderBoardCategory/${Id}`}
          />
          <SeriesLeaderBoardUserRankList
            {...props}
            ref={content}
            List={seriesLeaderBoardUserRankList}
            getList={getList}
          />
        </section>
      </main>
    </div>
  )
}

SeriesLeaderBoardUserRank.propTypes = {
  match: PropTypes.object
}

export default SeriesLeaderBoardUserRank
