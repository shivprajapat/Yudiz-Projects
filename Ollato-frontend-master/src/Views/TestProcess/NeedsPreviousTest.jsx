import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
/* images */
import testicon from '../../assets/images/test-icon.png'

function NeedsPreviousTest ({ errorMessage }) {
  return (
    <>
            <div className='main-layout whitebox-layout fullscreendata'>
                <div className='contentbox'>
                    <div className="timesupdesc">
                        <img src={testicon} alt='timeup' />
                        <h2>You must complete previous test </h2>
                        <h4>{errorMessage}</h4>
                        <Link to='/test-process' className='theme-btn text-none'>Back to Test List</Link>
                    </div>
                </div>
            </div>
    </>
  )
}

export default NeedsPreviousTest

NeedsPreviousTest.propTypes = {
  errorMessage: PropTypes.string
}
