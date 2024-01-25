import React from 'react'
import congrats from '../../../assets/images/sidebar-icons/congrats.svg'

function Congratulations (props) {
  return (
    <>
            <div className='main-layout whitebox-layout fullscreendata'>
                <div className='contentbox'>
                    <div className="timesupdesc">
                        <img src={congrats} alt='timeup' />
                        <h2>Thank you for purchasing the package...!</h2>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Congratulations
