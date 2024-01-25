import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLeadershipBoard } from '../../redux/actions/leaderBoard'

function Leadershipboard (Component) {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [url, setUrl] = useState('')
    const leadershipBoard = useSelector(state => state.leaderBoard.leadershipBoard)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const getUrlLink = useSelector(state => state.url.getUrl)
    const [loading, setLoading] = useState(false)
    const previousProps = useRef({ leadershipBoard }).current

    useEffect(() => {
      getLeadershipList()
    }, [token])

    useEffect(() => {
      if (getUrlLink && token) {
        setUrl(getUrlLink)
      }
    }, [getUrlLink])

    function getLeadershipList () {
      if (token) {
        dispatch(getLeadershipBoard(token))
        setLoading(true)
      }
    }
    useEffect(() => {
      if (previousProps.leadershipBoard !== leadershipBoard) {
        setLoading(false)
      }
      return () => {
        previousProps.leadershipBoard = leadershipBoard
      }
    }, [leadershipBoard])

    return (
      <Component
        {...props}
        getLeadershipList={getLeadershipList}
        leadershipBoardList={leadershipBoard}
        loading={loading}
        url={url}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default Leadershipboard
