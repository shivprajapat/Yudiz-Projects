import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMyLeaderboardRank, getAllLeaderBoardRank, getCategoriesDetails } from '../../redux/actions/leaderBoard'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'

function LeaderboardDetails (Component) {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const [leaderBoardAllData, setLeaderBoardAllData] = useState([])
    const leaderboardMyRank = useSelector(state => state.leaderBoard.leaderboardMyRank)
    const leaderboardAllRank = useSelector(state => state.leaderBoard.leaderboardAllRank)
    const leaderboardCategoryDetails = useSelector(state => state.leaderBoard.leaderboardCategoryDetails)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)

    const getUrlLink = useSelector(state => state.url.getUrl)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const userData = useSelector(state => state.auth.userData) || JSON.parse(localStorage.getItem('userData'))
    const [loading, setLoading] = useState(false)
    const previousProps = useRef({ leaderboardMyRank, leaderboardAllRank, leaderboardCategoryDetails }).current

    const { id, detailsId } = useParams()
    const location = useLocation()

    useEffect(() => {
      if ((id || detailsId) && token) {
        if (!detailsId) {
          getMyRank(id)
          getAllRank(id)
        }
      }
      if ((!leaderboardCategoryDetails || !leaderboardCategoryDetails._id) || (leaderboardCategoryDetails && leaderboardCategoryDetails._id !== id)) {
        getCategoryDetails(id || detailsId)
      }
      if (getUrlLink && token) {
        setUrl(getUrlLink)
      }
    }, [token, location.pathname])

    useEffect(() => {
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

    useEffect(() => {
      if (previousProps.leaderboardMyRank !== leaderboardMyRank) {
        setLoading(false)
      }
      return () => {
        previousProps.leaderboardMyRank = leaderboardMyRank
      }
    }, [leaderboardMyRank])

    useEffect(() => {
      if (previousProps.leaderboardAllRank !== leaderboardAllRank) {
        setLoading(false)
        const Data = leaderboardAllRank && leaderboardAllRank.length > 0 ? leaderboardAllRank.filter(leaderBoard => leaderBoard.oUser.iUserId !== userData?._id) : leaderboardAllRank
        setLeaderBoardAllData(Data)
      }
      return () => {
        previousProps.leaderboardAllRank = leaderboardAllRank
      }
    }, [leaderboardAllRank])

    useEffect(() => {
      if (previousProps.leaderboardCategoryDetails !== leaderboardCategoryDetails) {
        setLoading(false)
      }
      return () => {
        previousProps.leaderboardCategoryDetails = leaderboardCategoryDetails
      }
    }, [leaderboardCategoryDetails])

    function getMyRank (id) {
      if (id && token) {
        dispatch(getMyLeaderboardRank(id, token))
        setLoading(true)
      }
    }
    function getAllRank (id) {
      if (id && token) {
        dispatch(getAllLeaderBoardRank(id, token))
        setLoading(true)
      }
    }

    function getCategoryDetails (id) {
      if (id) {
        dispatch(getCategoriesDetails(id))
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        currencyLogo={currencyLogo}
        leaderBoardAllData={leaderBoardAllData}
        leaderboardAllRank={leaderboardAllRank}
        leaderboardCategoryDetails={leaderboardCategoryDetails}
        leaderboardMyRank={leaderboardMyRank}
        loading={loading}
        url={url}
      />
    )
  }
  MyComponent.propTypes = {
    match: PropTypes.object
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default LeaderboardDetails
