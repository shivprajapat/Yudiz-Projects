import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import Image from 'next/image'
import { iconArrowDown } from '@/assets/images'
import { allRoutes } from '@/constants/allRoutes'

const OurRootsMenu = () => {
  return (
    <li>
      <button className="nav-dropdown py-3 relative z-0">
        <FormattedMessage id="header.item.ourRoots" />
        <Image
          src={iconArrowDown}
          alt="iconArrowDown"
          className="ml-2 -z-[1] "
        />
      </button>
      <div className="nav-dropdown-menu">
        <ul className="py-3">
          <li>
            <Link href={allRoutes.about} className="nav-dropdown-item">
              About Us
            </Link>
          </li>
          <li>
            <Link href={allRoutes.home} className="nav-dropdown-item">
              Our Journy
            </Link>
          </li>
          <li>
            <Link href={allRoutes.home} className="nav-dropdown-item">
              Guiding Philosophy
            </Link>
          </li>
          <li>
            <Link href={allRoutes.home} className="nav-dropdown-item">
              Our Craft
            </Link>
          </li>
          <li>
            <Link href={allRoutes.home} className="nav-dropdown-item">
              Our Stores
            </Link>
          </li>
          <li>
            <Link href={allRoutes.home} className="nav-dropdown-item">
              Our Exhibition
            </Link>
          </li>
          <li>
            <Link href={allRoutes.blog} className="nav-dropdown-item">
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </li>
  )
}

export default OurRootsMenu
OurRootsMenu.propTypes = {
  isOpen: PropTypes.object,
  setIsOpen: PropTypes.func,
}
