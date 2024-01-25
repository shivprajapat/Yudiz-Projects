import React from 'react'
/* images */
import loaderimg from '../../assets/images/loader.svg'

function Loader () {
  return (
    <>
    <div className="loader-section text-center">
        <img src={loaderimg} className='mb-3' alt="loader" />
        <h5>Please wait. Report will be generate soon</h5>
    </div>
    </>
  )
}

export default Loader
