import React from 'react'
import { Link } from 'react-router-dom'
/* images */
import testicon from '../../assets/images/test-icon.png'

function Alreadygiventest () {
  return (
    <>
        <div className='main-layout whitebox-layout fullscreendata'>
          <div className='contentbox'>
            <div className='timesupdesc'>
                <img src={testicon} alt='timeup' />
                <h2>Already given test </h2>
                          <h4>
                  You’ve already given this test, you can return to the test
                  list and check other tests.
                    </h4>
                <Link to='/test-process' className='theme-btn text-none'>
                  Back to Test List
                </Link>
              </div>
            </div>
          </div>
    </>
  )
}

export default Alreadygiventest
