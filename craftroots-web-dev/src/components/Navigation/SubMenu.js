import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

function SubMenu({ navData, activeMenu, setActiveMenu }) {
  function handleMenuLinkClick() {
    setActiveMenu('')
  }
  return (
    navData?.children?.length > 0 && (
      <div
        className={`nav-dropdown-menu ${
          activeMenu === navData.url_path
            ? 'visible opacity-100'
            : 'invisible opacity-0'
        }`}
      >
        <ul className="py-3">
          {navData?.children?.map((data) => (
            <li key={data?.id}>
              <Link
                href={'/' + data.url_path}
                className="nav-dropdown-item"
                onClick={handleMenuLinkClick}
              >
                {data.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  )
}

export default SubMenu
SubMenu.propTypes = {
  navData: PropTypes.object.isRequired,
  activeMenu: PropTypes.bool,
  setActiveMenu: PropTypes.func,
}

SubMenu.defaultProps = {
  activeMenu: false,
  setActiveMenu: () => {},
}
