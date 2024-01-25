import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import ToolTip from 'shared/components/tooltip'

function MenuItem({ item, isMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const childPaths = item.children && item.children.map((i) => i.path.split('/')[1])
  // const currentPathSlashIndex = location.pathname.split('/').length
  useEffect(() => {
    !isMenuOpen && setIsOpen(false)
  }, [isMenuOpen])

  return (
    <li className={isOpen ? 'open' : ''}>
      <ToolTip toolTipMessage={item.title} disable={!isMenuOpen} isSideMenu={true} position='right'>
        <NavLink exact
          to={item.path}
          activeClassName={`active ${!item.children && 'pe-none'} `}
          className={childPaths?.includes(location?.pathname?.split('/')[1]) ? 'active pe-none' : ''}
        >
          <i className={item.icon}></i>
          {isMenuOpen && item.title}
        </NavLink>
      </ToolTip>
      {item.children && (
        <>
          {isMenuOpen && <i onClick={() => setIsOpen(!isOpen)} className='icon-arrow-drop-down drop-icon'></i>}
          {/* <ul className="left-arrow dropdown-menu show big">
            {item.children.map((subItem) => {
              return (
                <li key={subItem.path}>
                  <NavLink
                    to={subItem.path}
                    activeClassName={`active ${(currentPathSlashIndex === 3 || currentPathSlashIndex === 2) && 'pe-none'}`}
                  >
                    {subItem.title}
                  </NavLink>
                </li>
              )
            })}
          </ul> */}
        </>
      )}
    </li>
  )
}
MenuItem.propTypes = {
  item: PropTypes.object,
  isMenuOpen: PropTypes.bool
}
export default MenuItem
