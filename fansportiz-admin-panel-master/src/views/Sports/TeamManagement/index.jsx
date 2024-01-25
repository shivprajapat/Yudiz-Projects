import React, { useEffect, useState } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import { getTeamList, getTeamsTotalCount } from '../../../actions/team'
import TeamList from './TeamList'
import SportsHeader from '../SportsHeader'
import NavbarComponent from '../../../components/Navbar'
import PropTypes from 'prop-types'

function IndexTeamManagement (props) {
  const [SearchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const dispatch = useDispatch()
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  function getTeamsTotalCountFunc (searchText, provider) {
    const data = {
      searchText, provider, sportsType, token
    }
    dispatch(getTeamsTotalCount(data))
  }

  function getList (start, limit, sort, order, searchText, provider) {
    const teamListData = {
      start, limit, sort, order, searchText: searchText.trim(), provider, sportsType, token
    }
    dispatch(getTeamList(teamListData))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Team Management`}
            handleSearch={onHandleSearch}
            buttonText="Add Team"
            search={SearchText}
            setUrl={`/${sportsType}/team-management/add-team`}
            SearchPlaceholder="Search Team"
            extButton
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.TEAM !== 'R')}
          />
          <TeamList
            {...props}
            token={token}
            sportsType={sportsType}
            getList={getList}
            search={SearchText}
            flag={initialFlag}
            getTeamsTotalCountFunc={getTeamsTotalCountFunc}
            EditPlayerLink={`/${sportsType}/team-management/update-team`}
          />
        </section>
      </main>
    </div>
  )
}

IndexTeamManagement.propTypes = {
  location: PropTypes.object
}

export default IndexTeamManagement
