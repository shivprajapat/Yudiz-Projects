import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../../components/Navbar'
import AddSeriesLB from './AddSeriesLB'
import { addSeriesLeaderBoard, getSeriesLeaderBoardDetails, UpdateSeriesLeaderBoard } from '../../../../actions/seriesLeaderBoard'
import PropTypes from 'prop-types'
import { getGameCategory } from '../../../../actions/league'

function AddTemplate (props) {
  const token = useSelector(state => state.auth.token)
  const seriesLeaderBoardDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardDetails)
  const GameCategoryList = useSelector(state => state.league.GamecategoryList)
  const dispatch = useDispatch()

  function AddNewSeries (sName, sInfo, eCategory, eStatus) {
    dispatch(addSeriesLeaderBoard(sName, sInfo, eCategory, eStatus, token))
  }

  function UpdateSeries (Id, sName, sInfo, eCategory, eStatus) {
    dispatch(UpdateSeriesLeaderBoard(Id, sName, sInfo, eCategory, eStatus, token))
  }

  function getGameCategoryFun () {
    dispatch(getGameCategory(token))
  }

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getSeriesLeaderBoardDetails(match.params.id, token))
    }
    getGameCategoryFun()
  }, [])

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="common-box common-detail">
          <AddSeriesLB
            {...props}
            AddNewSeries={AddNewSeries}
            UpdateSeries={UpdateSeries}
            getGameCategoryFun={getGameCategoryFun}
            GameCategoryList={GameCategoryList}
            seriesLeaderBoardDetails={seriesLeaderBoardDetails}
            seriesLeaderBoardCategory="/seriesLeaderBoardCategory"
            cancelLink="/seriesLeaderBoard"
          />
        </section>
      </main>
    </Fragment>
  )
}

AddTemplate.propTypes = {
  match: PropTypes.object
}

export default AddTemplate
