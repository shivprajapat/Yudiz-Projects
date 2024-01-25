
import React from 'react'
// import MobileHeader from '../../Components/MobileHeader'
// import Sidebar from '../../Components/Sidebar'
/* images */
// import congrats from '../../assets/images/congrats.svg'
import testicon from '../../assets/images/test-icon.png'

function Congratulations (props) {
  return (
    <>
<div className='main-layout whitebox-layout fullscreendata'>
                <div className='contentbox'>
                    <div className="timesupdesc">
                        <img src={testicon} alt='timeup' />
                        <h2>You have to give atlest one test to see your result</h2>
                        {/* <Link to={'/package'} className='theme-btn text-none'></Link> */}
                    </div>
                </div>
            </div>
    </>
  )
}

export default Congratulations
