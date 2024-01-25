import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useSelector } from 'react-redux'
import CloseButton from '../generic/CloseButton'
import {
  IconArrowRight,
  iconBox,
  iconHeart,
  iconUser,
  iconLogout,
  iconWalletOutline,
} from '@/assets/images'
import { allRoutes } from '@/constants/allRoutes'
import Logo from '@/components/Layout/Logo'
const AccountNavSidebar = ({
  isShowing,
  toggle,
  onLogOutHandle,
  onMenuItemClick,
}) => {
  const router = useRouter()

  const accountManagementsData = [
    {
      title: <FormattedMessage id="page.myAccount.title.myAccount" />,
      icon: iconUser,
      path: allRoutes.profile,
      onClick: onMenuItemClick,
    },
    {
      title: <FormattedMessage id="page.myAccount.title.myOrders" />,
      icon: iconBox,
      path: allRoutes.myOrders,
      onClick: onMenuItemClick,
    },
    {
      title: <FormattedMessage id="page.myAccount.title.wishlist" />,
      icon: iconHeart,
      path: allRoutes.wishlist,
      onClick: onMenuItemClick,
    },
    {
      title: <FormattedMessage id="page.myAccount.title.manageAddress" />,
      icon: iconUser,
      path: allRoutes.manageAddress,
      onClick: onMenuItemClick,
    },
    {
      title: <FormattedMessage id="page.myAccount.title.storeCredit" />,
      icon: iconWalletOutline,
      path: allRoutes.storeCredit,
      onClick: onMenuItemClick,
    },
    /* {
      title: <FormattedMessage id="page.myAccount.title.supportTicket" />,
      icon: iconMap,
      path: allRoutes.supportTicket,
      onClick: onMenuItemClick,
    }, */
    {
      title: <FormattedMessage id="page.myAccount.title.logout" />,
      icon: iconLogout,
      path: allRoutes.signIn,
      onClick: onLogOutHandle,
    },
  ]

  const accountdetails = useSelector(
    (state) => state.accountReducer.accountData.customer
  )

  return (
    <div>
      <div
        className={`sidebar-left-overlay ${isShowing ? 'active' : ''}`}
        onClick={toggle}
      />
      <div
        className={`justify-between sidebar-left p-0 ${
          isShowing ? 'active' : ''
        }`}
      >
        <div className="h-full">
          <div className="head px-2 pt-2 border-none sm:!justify-end flex sm:!hidden relative">
            <div>
              <Logo onClick={toggle} />
            </div>
            <CloseButton onClick={toggle} top />
          </div>
          <div className="flex items-center justify-between bg-gray-100 p-4 border-b border-grey-400 mb-2 relative">
            <div className="capitalize flex gap-1 flex-col">
              <span className="text-grey-900 font-jost text-sm font-light">
                hello,
              </span>
              <h5 className="text-grey-900 font-jost text-xl font-semibold">
                {accountdetails?.firstname + ' ' + accountdetails?.lastname}
              </h5>
            </div>
            <CloseButton onClick={toggle} className="hidden sm:flex" top />
          </div>
          <div className="px-4">
            <ul className="space-y-1 block">
              {accountManagementsData.map((item, index) => {
                const { icon, path, title, onClick } = item
                return (
                  <li key={index}>
                    <Link href={path} legacyBehavior>
                      <a
                        className={`flex items-center py-3 duration-300 ease-in-out group ${
                          router.pathname === path ? 'active' : ''
                        }`}
                        onClick={onClick}
                      >
                        <Image src={icon} alt="icon" />
                        <span className="flex-1 ml-3 text-grey-900 font-medium text-base transition duration-75 group-hover:text-primary">
                          {title}
                        </span>
                        <span className="block sm:hidden text-grey-700 text-base">
                          <IconArrowRight size="24" />
                        </span>
                      </a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountNavSidebar
AccountNavSidebar.propTypes = {
  isShowing: PropTypes.bool,
  toggle: PropTypes.func,
  onLogOutHandle: PropTypes.func,
  onClick: PropTypes.func,
  onMenuItemClick: PropTypes.func,
}
AccountNavSidebar.defaultProps = {
  isShowing: false,
  toggle: () => {},
  onLogOutHandle: () => {},
  onClick: () => {},
  onMenuItemClick: () => {},
}
