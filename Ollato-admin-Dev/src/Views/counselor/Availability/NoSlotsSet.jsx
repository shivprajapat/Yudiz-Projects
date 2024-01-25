import React from 'react'
import { Link } from 'react-router-dom'
import MobileHeader from '../../../Components/MobileHeader'
import Header from '../../../Components/Header'
import Sidebar from '../../../Components/Sidebar'
/* images */
import noslotsets from '../../../assets/images/noslotsets.svg'

function NoSlotsSet () {
  return (
    <>
       <div className='common-layout common-dashboard-wrapper no-breadcrumbs no-dropdown'>
          <Sidebar location={location} />
          <MobileHeader />
          <div className='main-content-box'>
            <Header />
            <div className="title-header no-breadcrumbs d-flex flex-row align-items-center">
                <ul className="breadcrumbs">
                    <li className="breadcrumbs-item"><h3>Availability Management</h3></li>
                </ul>
                <button className="theme-btn text-none">Set Availability</button>
            </div>
            <div className='main-layout whitebox-layout fullscreendata withheader'>
                <div className='contentbox'>
                    <div className="timesupdesc">
                        <img src={noslotsets} alt='timeup' />
                        <h2>No Slots set</h2>
                        <h4>You’ve not set your availability yet, You can add/ manage your availability time slot here.</h4>
                        <Link to='/set-availability' className='theme-btn text-none'>Set Availability</Link>
                    </div>
                </div>
            </div>
          </div>
      </div>
    </>
  )
}

export default NoSlotsSet
