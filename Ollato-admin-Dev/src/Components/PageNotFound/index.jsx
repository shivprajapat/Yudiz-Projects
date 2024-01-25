import React from 'react'
import { useNavigate } from 'react-router-dom'
import PageNotFound from '../../assets/images/404-icon.png'

function NeedPurchasePackage () {
  const navigate = useNavigate()
  return (
    <>
        <div className='main-layout whitebox-layout fullscreendata pagenotfound'>
          <div className='contentbox'>
              <div className='timesupdesc'>
                <img src={PageNotFound} alt='timeup' />
                <h2>404</h2>
                <p>ops page not found</p>
                <button className='theme-btn text-none' onClick={() => navigate(-1)} >
                  Back to Home

                </button>
              </div>
          </div>
        </div>
    </>
  )
}

export default NeedPurchasePackage
