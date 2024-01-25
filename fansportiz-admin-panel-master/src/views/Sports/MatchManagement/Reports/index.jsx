import React, { useState, useEffect } from 'react'
import NavbarComponent from '../../../../components/Navbar'
import ReportListData from './ReportList'
import PropTypes from 'prop-types'

function ReportListMain (props) {
  const {
    match
  } = props
  const [matchId, setMatchId] = useState('')
  const SportsType = props.location.pathname.includes('cricket') ? 'cricket' : props.location.pathname.includes('football') ? 'football' : props.location.pathname.includes('basketball') ? 'basketball' : props.location.pathname.includes('kabaddi') ? 'kabaddi' : ''

  useEffect(() => {
    if (match.params.id) {
      setMatchId(match.params.id)
    }
  }, [])

  return (
    <div>
      <NavbarComponent {...props} />
      <main className='main-content'>
        <section className='management-section common-box'>
          <ReportListData
            {...props}
            MatchPageLink={`/${SportsType}/match-management/view-match/${matchId}`}
          />
        </section>
      </main>
    </div>
  )
}

ReportListMain.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default ReportListMain
