import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import LeagueHeader from '../../Leagues/Header/LeagueHeader'
import CategoryTemplateList from './CategoryTemplate'
import {
  getSeriesLBCategoriesTemplateList
} from '../../../actions/seriesLeaderBoard'

function CategoryTemplate (props) {
  const token = useSelector(state => state.auth.token)
  const categoryTemplateList = useSelector(state => state.seriesLeaderBoard.categoryTemplateList)
  const dispatch = useDispatch()

  function getList () {
    dispatch(getSeriesLBCategoriesTemplateList(token))
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <div>
        <main className="main-content">
          <section className="management-section common-box">
            <LeagueHeader
              heading="Category Templates"
              hidden
            />
            <CategoryTemplateList
              {...props}
              getList={getList}
              list={categoryTemplateList}
            />
          </section>
        </main>
      </div>
    </Fragment>
  )
}

export default CategoryTemplate
