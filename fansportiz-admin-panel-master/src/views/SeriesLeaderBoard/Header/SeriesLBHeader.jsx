import React from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import backIcon from '../../../assets/images/left-theme-arrow.svg'
import { Button } from 'reactstrap'
import addlIcon from '../../../assets/images/add-white-icon.svg'

// Common header for series leader board tab
function SeriesLBHeader (props) {
  const {
    heading, seriesLBCategoryLink, addPrizeBreakup
  } = props

  const history = useHistory()

  return (
    <div className="header-block">
      <div className="filter-block d-flex justify-content-between align-items-start">
        <div className='d-inline-flex'>
          {seriesLBCategoryLink && <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => history.push(`${seriesLBCategoryLink}`)}></img>}
          <h2>{heading}</h2>
        </div>
      </div>
      <div className="text-right text-align-left-480">
        <div className="btn-list">
          {props.buttonText && props.permission && props.addButton && (
              <Button className="theme-btn icon-btn ml-2" onClick={() => addPrizeBreakup()}>
                <img src={addlIcon} alt="add" />
                {props.buttonText}
              </Button>
          )}
        </div>
      </div>
    </div>
  )
}

SeriesLBHeader.propTypes = {
  heading: PropTypes.string,
  seriesLBCategoryLink: PropTypes.string,
  buttonText: PropTypes.string,
  permission: PropTypes.bool,
  addPrizeBreakup: PropTypes.func,
  addButton: PropTypes.bool
}

export default SeriesLBHeader
