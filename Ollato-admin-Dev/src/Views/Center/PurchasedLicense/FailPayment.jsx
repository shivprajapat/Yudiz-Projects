import React from 'react'
import failpayment from '../../../assets/images/sidebar-icons/fail-payment.svg'

function FailPayment () {
  return <>
  <div className=''>
    <div className='main-layout whitebox-layout fullscreendata'>
        <div className='contentbox'>
            <div className="timesupdesc">
                <h2>Purchase Failed</h2>
                <img src={failpayment} alt='timeup' />
            </div>
        </div>
    </div>
  </div>
</>
}

export default FailPayment
