import React, { Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getSeasonDetails, getUsersListInSeason, seasonDataExport } from '../../../../actions/season'
import UsersList from './UsersList'
import Navbar from '../../../../components/Navbar'
import SportsHeader from '../../SportsHeader'

const UserListManagement = props => {
  const { match } = props
  const content = useRef()
  const dispatch = useDispatch()
  const usersListInSeason = useSelector(state => state.season.usersListInSeason)
  const seasonDetails = useSelector(state => state.season.seasonDetails)
  const fullSeasonList = useSelector(state => state.season.fullSeasonList)
  const token = useSelector(state => state.auth.token)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  // dispatch action to get users list of particular season
  function getList (start, limit) {
    const data = { start, limit, seasonId: match.params.id, token }
    dispatch(getUsersListInSeason(data))
  }

  function getSeasonDetailsFunc () {
    dispatch(getSeasonDetails(match.params.id, token))
  }

  function getSeasonDataFunc () {
    dispatch(seasonDataExport(match.params.id, token))
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <div>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Fragment>
            <SportsHeader
              heading={`User List (${seasonDetails && seasonDetails.sName})`}
              onRefresh={onRefreshFun}
              onExport={onExport}
              usersListInSeason={usersListInSeason}
              seasonListPage={`/${sportsType}/season-management`}
              refresh
              hidden
            />
            <UsersList
              {...props}
              ref={content}
              getList={getList}
              fullSeasonList={fullSeasonList}
              getSeasonDetailsFunc={getSeasonDetailsFunc}
              getSeasonDataFunc={getSeasonDataFunc}
              usersList={usersListInSeason}
              sportsType={sportsType}
              systemUserDetailsPage='/users/system-user/system-user-details'
              userDetailsPage='/users/user-management/user-details'
            />
          </Fragment>
        </section>
      </main>
    </div>
  )
}

UserListManagement.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default UserListManagement
