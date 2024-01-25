import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Logo from 'assets/images/logo-white.png'
import LogoIcon from 'assets/images/logo-icon.png'
import { Button } from 'react-bootstrap'
import { sidebarConfig } from './SidebarConfig'
import MenuItem from './MenuItem'
import { allRoutes } from 'shared/constants/AllRoutes'
import ToolTip from 'shared/components/tooltip'

function SideBar({ role }) {
  const [isOpen, setIsOpen] = useState(false)
  const [sideBarList, setSideBarList] = useState()
  useEffect(() => {
    setSideBarList(sidebarConfig.filter(item => item.roles.includes(role)))
  }, [])
  return (
    <div className={`side-bar ${isOpen && 'expanded'}`}>
      <div className='logo'>
        <Link to={allRoutes.dashboard}>
          {isOpen && <img src={Logo} alt='CricTracker' />}
          {!isOpen && <img src={LogoIcon} alt='CricTracker' />}
        </Link>
      </div>
      <div className='menu'>
        <ul className='p-0 m-0'>
          {sideBarList?.map((item) => (
            <MenuItem key={item.path} item={item} isMenuOpen={isOpen} />
          ))}
        </ul>
      </div>
      <ToolTip toolTipMessage={isOpen ? null : 'Slide'} position='right' disable={!isOpen} isSideMenu={true}>
        <Button onClick={() => setIsOpen(!isOpen)} variant='link' className='open-btn square lh-1 p-1'>
          <i className='icon-sidebar'></i>
        </Button>
      </ToolTip>
    </div>
  )
}
SideBar.propTypes = {
  role: PropTypes.string.isRequired
}
export default SideBar
