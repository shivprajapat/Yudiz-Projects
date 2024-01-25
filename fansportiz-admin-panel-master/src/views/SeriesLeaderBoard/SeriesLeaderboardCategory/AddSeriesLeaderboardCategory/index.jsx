import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddSeriesLBCategory from './AddSeriesLBCategory'
import NavbarComponent from '../../../../components/Navbar'
import {
  addSeriesLeaderBoardCategory, UpdateLeaderBoardCategory, getLBCategoryDetails, getLBCategory
} from '../../../../actions/seriesLeaderBoard'
import PropTypes from 'prop-types'

function AddSeriesLeaderBoardCategory (props) {
  const { match } = props
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  useEffect(() => {
    if (match && match.params && match.params.id && match.params.id2) {
      dispatch(getLBCategoryDetails(match.params.id2, token))
    }
  }, [])

  function AddNewLBCategory (ID, name, seriesLBCategory, prize, rank, TotalPayout, content) {
    const addSeriesLBCategoryData = {
      ID, name, seriesLBCategory, prize, rank, TotalPayout, content, token
    }
    dispatch(addSeriesLeaderBoardCategory(addSeriesLBCategoryData))
  }

  function UpdateLBCategory (ID, name, seriesLBCategory, prize, rank, TotalPayout, content) {
    const updateSeriesLBCategoryData = {
      ID, name, seriesLBCategory, prize, rank, TotalPayout, content, token
    }
    dispatch(UpdateLeaderBoardCategory(updateSeriesLBCategoryData))
  }

  function getLBCategoryIdList () {
    dispatch(getLBCategory(token))
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="common-box common-detail">
          <AddSeriesLBCategory
            {...props}
            AddNewLBCategory={AddNewLBCategory}
            UpdateLBCategory={UpdateLBCategory}
            getLBCategoryIdList={getLBCategoryIdList}
            cancelLink={`/seriesLeaderBoardCategory/${match.params.id}`}
            addpriceBreakup="/seriesLeaderBoardPriceBreakup"
          />
        </section>
      </main>
    </Fragment>
  )
}

AddSeriesLeaderBoardCategory.propTypes = {
  match: PropTypes.object
}

export default AddSeriesLeaderBoardCategory
