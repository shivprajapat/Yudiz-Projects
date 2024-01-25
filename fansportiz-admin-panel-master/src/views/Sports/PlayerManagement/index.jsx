import React, { useState, useEffect } from 'react'
import qs from 'query-string'
import NavbarComponent from '../../../components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import PlayerList from './PlayerList'
import SportsHeader from '../SportsHeader'
import { getPlayersList, getPlayersTotalCount } from '../../../actions/player'
import PropTypes from 'prop-types'

function IndexPlayerManagement (props) {
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('baseball') ? 'baseball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''
  const dispatch = useDispatch()

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

  function getPlayersTotalCountFunc (search, provider) {
    const data = {
      searchText: search, provider, sportsType, token
    }
    dispatch(getPlayersTotalCount(data))
  }

  // dispatch action to get total count of players
  function getList (start, limit, sort, order, search, provider) {
    const getPlayerList = {
      start, limit, sort, order, searchText: search.trim(), provider, sportsType, token
    }
    dispatch(getPlayersList(getPlayerList))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            heading={`${sportsType.charAt(0).toUpperCase() + sportsType.slice(1)} Player Management`}
            buttonText="Add Player"
            setUrl={`/${sportsType}/player-management/add-player`}
            SearchPlaceholder="Search player"
            handleSearch={onHandleSearch}
            search={searchText}
            extButton
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.PLAYER !== 'R')}
          />
          <PlayerList
            {...props}
            sportsType={sportsType}
            getList={getList}
            search={searchText}
            flag={initialFlag}
            EditPlayerLink={`/${sportsType}/player-management/update-player`}
            getPlayersTotalCountFunc={getPlayersTotalCountFunc}
          />
        </section>
      </main>
    </div>
  )
}

IndexPlayerManagement.propTypes = {
  location: PropTypes.object
}

export default IndexPlayerManagement
