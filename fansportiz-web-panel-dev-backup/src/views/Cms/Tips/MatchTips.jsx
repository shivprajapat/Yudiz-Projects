import React, { useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Components
import Loading from '../../../component/Loading'

// Utils
import { viewMatchTips } from '../../../utils/Analytics'

// APIs
import useMatchTips from '../../../api/more/queries/useMatchTips'

function MatchTips () {
  const { slug } = useParams()
  const location = useLocation()

  const matchDetails = useSelector(state => state.match.matchDetails)

  const { data: matchTipsDetails, isLoading: isMatchTipsDetailsLoading } = useMatchTips(slug)

  useEffect(() => {
    if (matchDetails && matchDetails.sName && matchDetails._id && location.pathname) {
      viewMatchTips(matchDetails.sName, matchDetails._id, location.pathname)
    } else if (matchDetails && matchDetails.sName && matchDetails._id) {
      viewMatchTips(matchDetails.sName, matchDetails._id, '')
    }
  }, [])

  if (isMatchTipsDetailsLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="cms">
        <h1 className="matchTips">
          {' '}
          {matchTipsDetails && matchTipsDetails.sTitle}
          {' '}
        </h1>
        {
            matchTipsDetails && matchTipsDetails.sContent && (
              <div dangerouslySetInnerHTML={{ __html: matchTipsDetails && matchTipsDetails.sContent && matchTipsDetails.sContent }} className="offer-d-txt" />
            )
          }
      </div>
    </>
  )
}

export default MatchTips
