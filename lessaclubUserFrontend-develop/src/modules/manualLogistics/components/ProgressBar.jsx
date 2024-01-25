import React from 'react'
import PropTypes from 'prop-types'
import { logisticsStatus } from '../utils'

const Progressbar = ({ status }) => {
  return (
    <div className='progress-container'>
      <div className="label">Manual Logistics Status :</div>
      <div className="progress-wrapper">
        {logisticsStatus.map((step) => {
          return <div className={status === step.value ? 'step active' : 'step'} key={step.value}>{step.label}</div>
        })}
      </div>
    </div>

  )
}
Progressbar.propTypes = {
  status: PropTypes.number
}
export default Progressbar
