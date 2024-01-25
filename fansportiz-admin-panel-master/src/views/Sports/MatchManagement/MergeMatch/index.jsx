import React, { useEffect, useState } from 'react'
import Navbar from '../../../../components/Navbar'
import SportsHeader from '../../SportsHeader'
import MergeMatch from './MergeMatch'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getMatchPlayerList } from '../../../../actions/matchplayer'
import { getMatchDetails } from '../../../../actions/match'

function MergeMatchIndex (props) {
  const { match } = props
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const token = useSelector(state => state.auth.token)
  const sportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    if (match.params.id) {
      dispatch(getMatchDetails(match.params.id, token))
      const data = {
        start: '', limit: '', sort: 'sName', order: 'asc', searchText: '', role: '', team: '', token, Id: match.params.id
      }
      dispatch(getMatchPlayerList(data, false))
      setLoading(true)
    }
  }, [])

  return (
    <div>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <SportsHeader
            heading='Merge Match'
            hidden
            MatchPageLink={`/${sportsType}/match-management/view-match/${match.params.id}`}
          />
          <MergeMatch
            {...props}
            loading={loading}
            setLoading={setLoading}
          />
        </section>
      </main>
    </div>
  )
}

MergeMatchIndex.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default MergeMatchIndex
