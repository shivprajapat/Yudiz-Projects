import React from 'react'
import { Button } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import { Link, useNavigate } from 'react-router-dom'
import Home from '../../../../assests/images/homeIconWhite.svg'
import ScoreCards from './ScoreCards'
import useActiveSports from '../../../../api/activeSports/queries/useActiveSports'

function ScorecardIndex (props) {
  const navigate = useNavigate()
  const { activeSport } = useActiveSports()

  return (
    <>
      <div className="league-header u-header">
        <div className="d-flex align-items-center header-i">
          <button aria-label="Go Back" className={document.dir === 'rtl' ? 'btn-link icon-right-arrow' : 'btn-link icon-left-arrow'} onClick={() => navigate(-1)} type="button" />
          <Button className="button-link bg-transparent py-2" tag={Link} to={`/home/${activeSport}`}><img alt="" src={Home} /></Button>
          <h1><FormattedMessage id="Scorecard" /></h1>
        </div>
      </div>
      <ScoreCards {...props} />
    </>
  )
}

export default ScorecardIndex
