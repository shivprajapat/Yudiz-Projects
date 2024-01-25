import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { myUpcomingMatchList, myLiveMatchList, myCompletedMatchList, getMatchList } from '../../redux/actions/match'
import PropTypes from 'prop-types'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'

function SportsLeagueList (Component) {
  function MyComponent (props) {
    const { subIndex, mainIndex } = props
    const [url, setUrl] = useState('')
    const [Match, setMatch] = useState([])
    const [matchDetailsList, setMatchDetailList] = useState([])
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const matchList = useSelector(state => state.match.matchList)
    const matchDetailList = useSelector(state => state.match.matchDetailList)
    const resStatus = useSelector(state => state.match.resStatus)
    const resMessage = useSelector(state => state.match.resMessage)
    const getUrlLink = useSelector(state => state.url.getUrl)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const { data: activeSports } = useActiveSports()
    const previousProps = useRef({
      matchList, matchDetailList, mainIndex, subIndex, getUrlLink, activeSports
    }).current

    useEffect(() => {
      if (!subIndex && mainIndex) {
        FetchMatchList()
      } else {
        if (mainIndex && subIndex) {
          FetchingList(mainIndex, subIndex)
        }
      }
    }, [token])

    useEffect(() => {
      if (getUrlLink) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

    useEffect(() => {
      if (mainIndex && subIndex !== undefined) {
        FetchingList(mainIndex, subIndex)
      } else {
        if (mainIndex) {
          FetchMatchList()
        }
      }
    }, [mainIndex, subIndex])

    useEffect(() => {
      if (previousProps.matchList !== matchList) {
        if (matchList) {
          let top = []
          let bottom = []
          if (matchList.length !== 0) {
            top = matchList.length !== 0 && matchList.filter(match => match.bMatchOnTop).sort((a, b) => new Date(a.dStartDate) - new Date(b.dStartDate))
            bottom = matchList.length !== 0 && matchList.filter(match => !match.bMatchOnTop).sort((a, b) => new Date(a.dStartDate) - new Date(b.dStartDate))
          }
          setMatch([...top, ...bottom])
          setLoading(false)
        }
      }
      return () => {
        previousProps.matchList = matchList
      }
    }, [matchList])

    useEffect(() => {
      if (previousProps.matchDetailList !== matchDetailList) { // handle the response
        if (matchDetailList) {
          setMatchDetailList(matchDetailList)
        }
      }
      return () => {
        previousProps.matchDetailList = matchDetailList
      }
    }, [matchDetailList])

    function FetchMatchList () {
      let sportsType = ''
      if (activeSports && activeSports.length > 0) {
        const activeSportsArr = [...activeSports]
        activeSportsArr.sort((a, b) => a.sName > b.sName ? -1 : 1).sort((a, b) => ((a.nPosition > b.nPosition) ? 1 : -1))
        sportsType = activeSportsArr[mainIndex - 1].sName
        sportsType && dispatch(getMatchList(sportsType))
        setLoading(true)
      }
    }

    function FetchingList (MainIndex, subIndex) {
      if (subIndex) {
        let sportsType = ''
        const activeSportsArr = [...activeSports]
        activeSportsArr.sort((a, b) => a.sName > b.sName ? -1 : 1).sort((a, b) => ((a.nPosition > b.nPosition) ? 1 : -1))
        sportsType = activeSportsArr[MainIndex - 1].sName
        if (subIndex === 1) {
          sportsType && dispatch(myUpcomingMatchList(sportsType, token, 'U'))
        } else if (subIndex === 2) {
          sportsType && dispatch(myLiveMatchList(sportsType, token, 'L'))
        } else if (subIndex === 3) {
          sportsType && dispatch(myCompletedMatchList(sportsType, token, 'CMP'))
        }
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        FetchMatchList={FetchMatchList}
        FetchingList={FetchingList}
        list={Match}
        loading={loading}
        matchDetailsList={matchDetailsList}
        resMessage={resMessage}
        resStatus={resStatus}
        url={url}
      />
    )
  }
  MyComponent.propTypes = {
    subIndex: PropTypes.number,
    mainIndex: PropTypes.number
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default SportsLeagueList
