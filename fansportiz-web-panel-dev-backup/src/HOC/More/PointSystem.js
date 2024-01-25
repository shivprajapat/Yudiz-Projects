import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getScorePoints } from '../../redux/actions/more'
import useActiveSports from '../../api/activeSports/queries/useActiveSports'

function PointSystem (Component) {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [scorePointsData, setScorePointsData] = useState({})
    const [loading, setLoading] = useState(false)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const scorePoints = useSelector(state => state.more.scorePoints)
    const offerList = useSelector(state => state.more.offerList)
    const { data: activeSports } = useActiveSports()
    const resMessage = useSelector(state => state.more.resMessage)
    const resStatus = useSelector(state => state.more.resStatus)
    const [innerTab, setInnerTab] = useState('')
    const [activeSport, setActiveSport] = useState('')
    const previousProps = useRef({
      activeSport, scorePoints, resMessage, resStatus, offerList, innerTab
    }).current

    useEffect(() => { // handle the call apis
      // if (token) {
      if (activeSport && activeSport !== 'cricket') {
        getScorePointData(activeSport)
        setInnerTab('')
      } else if (activeSport && activeSport === 'cricket') {
        getScorePointData('ODI')
        setInnerTab('ODI')
      }
      // }
      // (!activeSports || activeSports.length === 0) && dispatch(GetActiveSports())
      return () => {
        previousProps.activeSport = activeSport
      }
    }, [token, activeSport])

    useEffect(() => {
      getScorePointData(innerTab)
    }, [innerTab])

    useEffect(() => {
      if (activeSports && activeSports.length > 0) {
        const sport = activeSports.sort((a, b) => a.sName > b.sName ? -1 : 1).sort((a, b) => (a.nPosition > b.nPosition) ? 1 : -1).map(data => data.sName)
        setActiveSport(sport && sport[0] && (sport[0].toLowerCase()))
      }
    }, [activeSports])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    useEffect(() => {
      const cms = {}
      if (previousProps.scorePoints !== scorePoints) {
        if (scorePoints) {
          activeSport === 'cricket' && scorePoints.forEach((sp) => {
            if (!cms[sp.bMulti]) {
              cms[sp.bMulti] = []
            }
            cms[sp.bMulti].push(sp)
          })
          setScorePointsData(activeSport === 'cricket' ? cms : scorePoints)
          setLoading(false)
        }
      }
      return () => {
        previousProps.scorePoints = scorePoints
      }
    }, [scorePoints])

    function getScorePointData (format) {
      if (format) {
        dispatch(getScorePoints(format))
        setLoading(true)
      }
    }

    return (
      <Component
        {...props}
        activeSport={activeSport}
        activeSports={activeSports}
        innerTab={innerTab}
        loading={loading}
        scorePointsData={scorePointsData}
        setActiveSport={setActiveSport}
        setInnerTab={setInnerTab}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}

export default PointSystem
