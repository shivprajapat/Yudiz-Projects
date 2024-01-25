import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Image from 'next/image'
import Link from 'next/link'
import { iconArrowDown } from '@/assets/images'
import { allRoutes } from '@/constants/allRoutes'

const ShopMenu = ({ isOpen, setIsOpen }) => {
  const shopOpen = () => {
    setIsOpen({
      shopMenu: !isOpen.shopMenu,
      partnershipMenu: false,
      ourRootsMenu: false,
    })
  }

  return (
    <li onMouseLeave={shopOpen}>
      <button
        onMouseOver={shopOpen}
        className={`${
          isOpen.shopMenu ? 'active' : ''
        } nav-dropdown py-3 relative z-0`}
      >
        <FormattedMessage id="header.item.shop" />
        <Image
          src={iconArrowDown}
          alt="iconArrowDown"
          className={`${
            isOpen.shopMenu ? 'rotate-180' : 'rotate-0'
          } ml-2 -z-[1]`}
        />
      </button>
      <div
        className={`${
          isOpen.shopMenu ? 'block' : 'hidden'
        } nav-dropdown-mega-menu`}
      >
        <div className=" max-full px-1 lg:px-2 py-6 flex">
          <div className="w-1/3 px-3 lg:px-6 border-r border-grey-200">
            <h5 className="font-jost font-medium text-base leading-6 mb-4 text-grey-900">
              Woman
            </h5>
            <div className="flex justify-between ">
              <ul
                className="space-y-4 sm:mb-4 md:mb-0"
                aria-labelledby="mega-menu-full-cta-button"
              >
                <li className="text-grey-600 font-normal opacity-90 text-base leading-6">
                  Ethnicwear
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Kurta
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Kurti
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Dupatta
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Kaftan
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Chaniya
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Palazzo
                  </Link>
                </li>
              </ul>
              <ul
                className="space-y-4 sm:mb-4 md:mb-0"
                aria-labelledby="mega-menu-full-cta-button"
              >
                <li className="text-grey-600 font-normal opacity-90 text-base leading-6">
                  Other
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Saree
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Blouse
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Koti Blouse
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Stole{' '}
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Bracelet{' '}
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Earring{' '}
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.blog} className="mega-menu-link">
                    Clutch{' '}
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.blog} className="mega-menu-link">
                    Bags{' '}
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.blog} className="mega-menu-link">
                    Pouch{' '}
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.blog} className="mega-menu-link">
                    Footwear{' '}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-1/4 px-3 lg:px-6 border-r border-grey-200">
            <h5 className="font-jost font-medium text-base leading-6 mb-4 text-grey-900">
              Men
            </h5>
            <ul
              className="space-y-4 mb-4"
              aria-labelledby="mega-menu-full-cta-button"
            >
              <li className="text-grey-600 font-normal opacity-90 text-base leading-6">
                Clothing
              </li>
              <li>
                <Link href={allRoutes.home} className="mega-menu-link">
                  Jackets
                </Link>
              </li>
              <li>
                <Link href={allRoutes.home} className="mega-menu-link">
                  Kurta
                </Link>
              </li>
            </ul>
            <ul
              className="space-y-4 sm:mb-4 md:mb-0"
              aria-labelledby="mega-menu-full-cta-button"
            >
              <li className="text-grey-600 font-normal opacity-90 text-base leading-6">
                Other
              </li>
              <li>
                <Link href={allRoutes.home} className="mega-menu-link">
                  Shawls
                </Link>
              </li>
            </ul>
          </div>
          <div className="w-1/2 px-3 lg:px-6 border-r border-grey-200">
            <h5 className="font-jost font-medium text-base leading-6 mb-4 text-grey-900">
              Home Decor
            </h5>
            <div className="flex justify-between">
              <ul
                className="space-y-4 sm:mb-4 md:mb-0"
                aria-labelledby="mega-menu-full-cta-button"
              >
                <li className="text-grey-600 font-normal opacity-90 text-base leading-6">
                  Living
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Box
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Budhha
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Holder
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Lamp
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Fridge Magnets
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Laxmi Ganesh
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Lantern
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Lamp Shade
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Stone Box
                  </Link>
                </li>
              </ul>
              <ul
                className="space-y-4 sm:mb-4 md:mb-0"
                aria-labelledby="mega-menu-full-cta-button"
              >
                <li className="text-grey-600 font-normal opacity-90 text-base leading-6">
                  Table and Dining
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Table Mat
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Napkin
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Bowl
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Serving Bowl
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Paper Weight
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Plate{' '}
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Tea Coaster
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Napkin Set
                  </Link>
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Table Mat Set{' '}
                  </Link>
                </li>
              </ul>
              <ul
                className="space-y-4 sm:mb-4 md:mb-0"
                aria-labelledby="mega-menu-full-cta-button"
              >
                <li className="text-grey-600 font-normal opacity-90 text-base leading-6">
                  Bedding
                </li>
                <li>
                  <Link href={allRoutes.home} className="mega-menu-link">
                    Caushion
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-1/3 px-3 lg:px-6">
            <h5 className="font-jost font-medium text-base leading-6 mb-4 text-grey-900">
              Collections
            </h5>
            <ul
              className="space-y-4 mb-4"
              aria-labelledby="mega-menu-full-cta-button"
            >
              <li>
                <Link href={allRoutes.home} className="mega-menu-link">
                  Pravalika
                </Link>
              </li>
              <li>
                <Link href={allRoutes.home} className="mega-menu-link">
                  Rangmala
                </Link>
              </li>
              <li>
                <Link href={allRoutes.home} className="mega-menu-link">
                  Tangaliya
                  <FormattedMessage id="page.productListing.homeFurnishing" />
                </Link>
              </li>
            </ul>
            <h5 className="font-jost font-medium text-base leading-6 mb-4 text-grey-900">
              More
            </h5>
            <ul
              className="space-y-4 sm:mb-4 md:mb-0"
              aria-labelledby="mega-menu-full-cta-button"
            >
              <li>
                <Link href={allRoutes.home} className="mega-menu-link">
                  <FormattedMessage id="page.productListing.homeFurnishing" />
                </Link>
              </li>
              <li>
                <Link href={allRoutes.home} className="mega-menu-link">
                  <FormattedMessage id="page.productListing.stationary" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </li>
  )
}

export default ShopMenu
ShopMenu.propTypes = {
  isOpen: PropTypes.object || PropTypes.bool,
  setIsOpen: PropTypes.func,
}
