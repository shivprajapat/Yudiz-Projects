import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import LeaguePrizeListComponent from './LeaguePrizeList'
import LeagueHeader from '../Header/LeagueHeader'
import { getLeagueDetails, getLeaguePrizeList } from '../../../actions/league'
import PropTypes from 'prop-types'

function LeaguePrize (props) {
  const { match } = props
  const [leagueId, setleagueId] = useState('')
  const [showInputFields, setShowInputFields] = useState(false)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const LeaguePrizeList = useSelector(state => state.league.LeaguePrizeList)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const dispatch = useDispatch()

  function getList (LeagueID) {
    dispatch(getLeaguePrizeList(LeagueID, token))
  }

  useEffect(() => {
    if (match.params.id) {
      setleagueId(match.params.id)
      getLeagueDetailsFunc()
    }
  }, [])

  function addPrizeBreakup () {
    setShowInputFields(!showInputFields)
  }

  function getLeagueDetailsFunc () {
    dispatch(getLeagueDetails(match.params.id, token))
  }

  return (
    <div>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <LeagueHeader
            heading="League Prize Breakups"
            buttonText="Add League Prize BreakUp"
            setUrl={`/league/add-League-Price-Breakup/${leagueId}`}
            hidden
            addPrizeBreakup={addPrizeBreakup}
            seriesLeaderBoard
            SearchPlaceholder="Search league Prize"
            LeagueDetailsLink={`/league/update-league/${leagueId}`}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.LEAGUE !== 'R')}
          />
          <LeaguePrizeListComponent
            {...props}
            List={LeaguePrizeList}
            getList={getList}
            showInputFields={showInputFields}
          />
        </section>
      </main>
    </div>
  )
}

LeaguePrize.propTypes = {
  match: PropTypes.object
}

export default LeaguePrize
