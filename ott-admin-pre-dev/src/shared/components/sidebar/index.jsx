import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// import Logo from 'assets/images/logo-white.png'
import logo from 'assets/images/logo.png'
import short_logo from 'assets/images/short-logo.png'
import { Button } from 'react-bootstrap'
import { sidebarConfig } from './SidebarConfig'
import MenuItem from './MenuItem'
import { route } from 'shared/constants/AllRoutes'
import PermissionProvider from '../permission-provider'

function SideBar({isOpen,setIsOpen}) {
  return (
    <div className={`side-bar ${isOpen && 'expanded'}`}>
      <div className='logo'>
        <Link to={route.dashboard}>
          {isOpen && <img src={logo} alt='jojo' />}
          {/* {!isOpen && <img src={short_logo} alt='short_logo' />} */}
        </Link>
      </div>
      <div className='menu'>
        <ul className='p-0 m-0'>
          {sidebarConfig.map((item) => {
            if (item.isAllowedTo) {
              return (
                <PermissionProvider key={item.path} isAllowedTo={item.isAllowedTo} isAllowedToModule={item?.isAllowedToModule}>
                  <MenuItem item={item} isMenuOpen={isOpen} />
                </PermissionProvider>
              )
            } else {
              return <MenuItem key={item.path} item={item} isMenuOpen={isOpen} />
            }
          })}
        </ul>
      </div>
      <Button onClick={() => setIsOpen(!isOpen)} variant='link' className='open-btn square lh-1 p-1'>
        <i className='icon-sidebar'></i>
      </Button>
    </div>
  )
}

export default SideBar
