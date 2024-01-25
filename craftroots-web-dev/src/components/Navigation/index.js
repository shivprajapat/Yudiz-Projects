import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import NavLink from './NavLink'
import MegaMenu from './MegaMenu'
import HeaderLinkItem from './HeaderLinkItem'
import { allRoutes } from '@/constants/allRoutes'

function Navigation() {
  const storeConfigState = useSelector((state) => state.storeReducer)
  const [activeMenu, setActiveMenu] = useState('')
  function handleLinkOverOut(url) {
    setActiveMenu(url)
  }

  return (
    <nav className="hidden sm:block header-nav relative bg-zinc-50">
      <div className="max-w-screen-xl mx-auto relative">
        <div className="flex justify-center items-center">
          <ul className="nav-items">
            {storeConfigState?.data?.navData?.length > 0 && (
              <>
                <NavLink title="Home" path={allRoutes.home} className="py-3" />
                {storeConfigState?.data?.navData?.map((navData, idx) => {
                  const haveSecondLevelChildren =
                    navData?.children?.[idx]?.children?.length
                  const MenuComponent = haveSecondLevelChildren && MegaMenu
                  // : SubMenu -> Client change: The Our Roots menu item should be hidden since it is already available at the footer
                  return (
                    navData?.name !== 'Our Roots' && (
                      <li
                        key={navData.id}
                        onMouseOver={() => {
                          handleLinkOverOut(navData.url_path)
                        }}
                        onMouseLeave={() => {
                          handleLinkOverOut('')
                        }}
                      >
                        <HeaderLinkItem
                          href={navData.url_path}
                          classNameDropDown="nav-dropdown py-3 relative z-0"
                          navData={navData}
                          classNameImage="ml-2 -z-[1]"
                        />
                        {!!MenuComponent && (
                          <MenuComponent
                            navData={navData}
                            activeMenu={activeMenu}
                            setActiveMenu={setActiveMenu}
                          />
                        )}
                      </li>
                    )
                  )
                })}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
