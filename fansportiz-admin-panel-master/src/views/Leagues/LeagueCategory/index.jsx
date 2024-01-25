import React, { useState, useEffect } from 'react'
import qs from 'query-string'
import { useSelector, useDispatch } from 'react-redux'
import LeaguesCategoryList from './LeagueCategoryList'
import NavbarComponent from '../../../components/Navbar'
import LeagueHeader from '../Header/LeagueHeader'
import {
  getLeagueCategoryList
} from '../../../actions/leaguecategory'
import PropTypes from 'prop-types'

function LeagueCategoryManagement (props) {
  const [searchText, setSearchText] = useState('')
  const [SportsType, setSportsType] = useState('CRICKET')
  const [initialFlag, setinitialFlag] = useState(false)
  const token = useSelector(state => state.auth.token)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const LeagueCategoryList = useSelector(state => state.leaguecategory.LeaguecategoriesList)
  const dispatch = useDispatch()

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (value) {
    setSearchText(value)
    setinitialFlag(true)
  }

  function onHandleSport (e) {
    setSportsType(e.target.value)
  }

  function getList (start, limit, sort, order, search) {
    dispatch(getLeagueCategoryList(start, limit, sort, order, search.trim(), token))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <LeagueHeader
            heading="League Categories"
            buttonText="Create League Category"
            handleSportType={onHandleSport}
            selectGame={SportsType}
            handleSearch={onHandleSearch}
            search={searchText}
            seriesLeaderBoard
            SearchPlaceholder="Search league Category"
            goToLeague="/league"
            addButton
            info
            setUrl="/league/add-league-category"
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
          />
          <LeaguesCategoryList
            {...props}
            List={LeagueCategoryList}
            getList={getList}
            search={searchText}
            selectGame={SportsType}
            flag={initialFlag}
            updateLeague="/league/update-league-category"
          />
        </section>
      </main>
    </div>
  )
}

LeagueCategoryManagement.propTypes = {
  location: PropTypes.object
}
export default LeagueCategoryManagement
