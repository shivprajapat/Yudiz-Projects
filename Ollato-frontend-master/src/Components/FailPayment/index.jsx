import React from 'react'
import failpayment from '../../assets/images/card-error-icon.svg'

function FailPayment () {
  return <>
  <div className=''>
    <div className='main-layout whitebox-layout fullscreendata'>
        <div className='contentbox'>
            <div className="timesupdesc">
                <h2 className='failed-text'>Purchase Failed</h2>
            <img src={failpayment} alt='timeup' />
            </div>
        </div>
    </div>
  </div>
</>
}

export default FailPayment
