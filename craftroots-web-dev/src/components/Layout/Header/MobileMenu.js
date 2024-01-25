import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import Logo from '../Logo'
import TopHeader from './TopHeader'
import NavAccordionHeader from './NavAccordionHeader'
import { SOCIALICON } from '@/constants'
import { allRoutes } from '@/constants/allRoutes'
import NavLink from '@/components/Navigation/NavLink'
import Accordion from '@/components/generic/accordion'
import { imgMobileHeaderShape } from '@/assets/images'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import CloseButton from '@/components/generic/CloseButton'
import NextImage from '@/components/generic/NextImage'

export function navChildrenRender(eachNav, handleMobileMenu) {
  if (eachNav?.children?.length) {
    return <NavAccordionHeader nav={eachNav} onLinkClick={handleMobileMenu} />
  } else if (eachNav?.url_path) {
    return (
      <Link
        href={'/' + eachNav?.url_path}
        className="p-3 block font-medium"
        onClick={handleMobileMenu}
      >
        {eachNav.name}
      </Link>
    )
  }
}

const MobileMenu = () => {
  const storeConfigState = useSelector((state) => state.storeReducer)
  const [menu, setMenu] = useState(false)
  useDisableBodyScroll(menu)

  const handleMenu = () => {
    setMenu(!menu)
  }

  const navData = useMemo(
    () => storeConfigState?.data?.navData,
    [storeConfigState?.data]
  )
  return (
    <nav className="block md:hidden mobile-menu bg-zinc-50">
      <div className="relative">
        <NextImage
          className="bg-repeat bg-contain object-cover w-full absolute h-2 bottom-[-5px]"
          src={imgMobileHeaderShape}
          alt="shape"
        />
        <div className="relative">
          <TopHeader showMobileIcon menu={menu} handleMenu={handleMenu} />
        </div>
      </div>
      <div className={`mobile-sidebar ${menu ? 'active' : ''}`}>
        <div className="mobile-top">
          <Logo />
          <CloseButton onClick={handleMenu} top />
        </div>
        <div className="overflow-auto grow mb-3">
          <Accordion>
            {navData?.length > 0 &&
              navData.map((eachNav) => navChildrenRender(eachNav, handleMenu))}
          </Accordion>
          <ul className="mobile-menu-footer flex-col px-3">
            <NavLink
              title="Contact Us"
              path={allRoutes.contactUs}
              onClick={handleMenu}
            />
            {/* <NavLink
              title="Track Order"
              path={allRoutes.home}
              onClick={handleMenu}
            /> */}
          </ul>
        </div>
        <div className="flex pb-3 space-x-4 sm:justify-start items-center sm:mt-0 px-4">
          {SOCIALICON.map((item, i) => {
            const { icon, title, url } = item
            return (
              <Link
                href={`https://${url}`}
                target="_blank"
                key={i}
                onClick={handleMenu}
              >
                <NextImage
                  src={icon}
                  alt={title}
                  className="w-7 h-7 max-w-[24px]"
                />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default MobileMenu
