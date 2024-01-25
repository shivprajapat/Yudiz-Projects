import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchList } from '../../redux/actions/match'
import { getMatchLeagueDetails } from '../../redux/actions/league'
import { GetUserProfile } from '../../redux/actions/profile'
import PropTypes from 'prop-types'

export const CommonInviteFriend = (Component) => {
  const MyComponent = (props) => {
    const { matchId } = props
    const dispatch = useDispatch()
    const matchList = useSelector(state => state.match.matchList)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const getUrlLink = useSelector(state => state.url.getUrl)
    const profileData = useSelector(state => state.profile.userInfo)
    const [matchDetails, setMatchDetails] = useState({})
    const [url, setUrl] = useState('')
    const previousProps = useRef({
      getUrlLink
    }).current

    useEffect(() => {
      if (matchId) {
        if (matchList && matchList.length > 0) {
          const match = matchList.filter(data => data._id === matchId)
          if (match && match.length > 0) {
            setMatchDetails(match[0])
          }
        }
      }
      if (getUrlLink && token) {
        setUrl(getUrlLink)
      }
      if (token) {
        dispatch(GetUserProfile(token))
      }
    }, [token])

    useEffect(() => {
      if (previousProps.getUrlLink !== getUrlLink) {
        if (getUrlLink && getUrlLink.length !== 0) {
          setUrl(getUrlLink)
        }
      }
      return () => {
        previousProps.getUrlLink = getUrlLink
      }
    }, [getUrlLink])

    function getDetails (ID2, sportsType) {
      if (token) {
        dispatch(getMatchList(sportsType))
        dispatch(getMatchLeagueDetails(ID2, token))
      }
    }

    return (
      <Component
        {...props}
        getDetails={getDetails}
        matchDetails={matchDetails}
        profileData={profileData}
        token={token}
        url={url}
      />
    )
  }
  MyComponent.propTypes = {
    matchId: PropTypes.string
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default CommonInviteFriend
