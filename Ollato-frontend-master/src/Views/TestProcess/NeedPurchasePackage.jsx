import React from 'react'
import { Link } from 'react-router-dom'
/* images */
import testicon from '../../assets/images/test-icon.png'

function NeedPurchasePackage () {
  return (
    <>
        <div className='main-layout whitebox-layout fullscreendata'>
          <div className='contentbox'>
              <div className='timesupdesc'>
                <img src={testicon} alt='timeup' />
                <h2>Please Purchase package first</h2>
                <h4>
                  You don’t have any purchased package.
                </h4>
                <Link to='/package' className='theme-btn text-none'>
                  Back to Package List
                </Link>
              </div>
          </div>
        </div>
    </>
  )
}

export default NeedPurchasePackage
