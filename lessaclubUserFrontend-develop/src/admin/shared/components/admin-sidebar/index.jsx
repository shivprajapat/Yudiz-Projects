import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'

import { Nav } from 'react-bootstrap'
import { BiCategoryAlt } from 'react-icons/bi'
import { FiUsers } from 'react-icons/fi'
import { RiSettingsLine } from 'react-icons/ri'
import { SiHackthebox } from 'react-icons/si'
import { DiGoogleAnalytics } from 'react-icons/di'
import { BsImages, BsLink45Deg, BsFillCartFill, BsArrowLeftRight, BsDownload } from 'react-icons/bs'

import './style.scss'
import { leftArrowWhiteIcon, logoFaviconIcon, logoIcon, nuuCoinsIcon } from 'assets/images'
import { sidebarConfig } from './SidebarConfig'
import { FaHandsHelping } from 'react-icons/fa'
import { MdPolicy } from 'react-icons/md'

const getIcon = (name) => {
  switch (name) {
    case 'Category':
      return <BiCategoryAlt />
    case 'Customers':
      return <FiUsers />
    case 'Assets':
      return <SiHackthebox />
    case 'Analytics':
      return <DiGoogleAnalytics />
    case 'Settings':
      return <RiSettingsLine />
    case 'Banners':
      return <BsImages />
    case 'API':
      return <BsLink45Deg />
    case 'Nuucoin':
      return <img src={nuuCoinsIcon} style={{ background: 'white' }} />
    case 'Transactions':
      return <BsArrowLeftRight />
    case 'Orders':
      return <BsFillCartFill />
    case 'Donations':
      return <FaHandsHelping />
    case 'Policy':
      return <MdPolicy />
    case 'Downloads':
      return <BsDownload />
    default:
      break
  }
}

const AdminSidebar = ({ side, openSidebar }) => {
  return (
    <div className={side ? 'active sidebar' : 'sidebar'}>
      <div className="admin-logo">
        <Link to="/admin">
          <img src={side ? logoFaviconIcon : logoIcon} alt="" />
        </Link>
        <div className="admin-slide" onClick={() => openSidebar()}>
          <img src={leftArrowWhiteIcon} alt="" />
        </div>
      </div>
      <Nav>
        {sidebarConfig.map((item, index) => {
          const { name, path } = item
          return (
            <NavLink to={path} key={index}>
              {getIcon(name)}
              <span style={{ marginLeft: name === 'Nuucoin' ? '15px' : '' }}>{name}</span>
            </NavLink>
          )
        })}
      </Nav>
    </div>
  )
}
AdminSidebar.propTypes = {
  side: PropTypes.bool,
  openSidebar: PropTypes.func
}

export default AdminSidebar
