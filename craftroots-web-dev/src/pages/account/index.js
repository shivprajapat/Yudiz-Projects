import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useSelector } from 'react-redux'
import { allRoutes } from '@/constants/allRoutes'
import {
  IconArrowRight,
  iconBox,
  iconHeart,
  iconLogout,
  iconWalletOutline,
  iconUser,
} from '@/assets/images'
import { deleteCookie } from '@/helper'
import { STORAGE_KEYS } from '@/helper/constant'
import { Meta } from '@/components/generic'
import { BRAND_NAME } from '@/helper/constant'

const AccountManagements = ({ children }) => {
  const router = useRouter()
  const intl = useIntl()

  const accountdetails = useSelector(
    (state) => state.accountReducer.accountData.customer
  )

  const accountManagementsData = [
    {
      title: accountdetails?.firstname
        ? accountdetails?.firstname + ' ' + accountdetails?.lastname
        : intl.formatMessage({ id: 'page.myAccount.title.myAccount' }),
      icon: iconUser,
      path: allRoutes.profile,
    },
    {
      title: intl.formatMessage({ id: 'page.myAccount.title.myOrders' }),
      icon: iconBox,
      path: allRoutes.myOrders,
    },
    {
      title: intl.formatMessage({ id: 'page.myAccount.title.wishlist' }),
      icon: iconHeart,
      path: allRoutes.wishlist,
    },
    {
      title: intl.formatMessage({ id: 'page.myAccount.title.manageAddress' }),
      icon: iconUser,
      path: allRoutes.manageAddress,
    },
    {
      title: intl.formatMessage({ id: 'page.myAccount.title.storeCredit' }),
      icon: iconWalletOutline,
      path: allRoutes.storeCredit,
    },
  ]
  const currentRouteTitle = useMemo(() => {
    return (
      accountManagementsData.find((accData) => router.pathname === accData.path)
        ?.title || intl.formatMessage({ id: 'page.myAccount.title.myAccount' })
    )
  }, [accountManagementsData])
  const onLogOutHandle = () => {
    deleteCookie(STORAGE_KEYS.token)
    // router.push(allRoutes.signIn)
    window.location.href = window.location.origin + allRoutes.signIn
  }

  return (
    <>
      <Meta title={currentRouteTitle + ' | ' + BRAND_NAME} />
      <section className="md:pt-20 pb-8 sm:pb-36 account-managements relative overflow-hidden">
        {/* <div className="hidden sm:block absolute inset-x-0 top-0 h-20 md:h-36 bg-stars" /> */}
        <div className="container">
          <div className="flex gap-3 sm:gap-8 flex-col sm:flex-row">
            <div className="flex-shrink-0  hidden sm:block w-full sm:w-[261px] lg:w-80">
              <div className="flex sm:items-center gap-1 capitalize border-b border-grey-400 px-4 pt-4 sm:pt-0 sm:px-0 pb-4 sm:mb-6 flex-col sm:flex-row bg-grey-100 sm:bg-transparent">
                <span className="text-grey-900 font-jost text-sm font-light">
                  hello,
                </span>
                <h5 className="text-grey-900 font-jost text-xl font-semibold">
                  {accountdetails?.firstname &&
                    accountdetails?.firstname + ' ' + accountdetails?.lastname}
                </h5>
              </div>

              <div className="h-full overflow-y-auto bg-grey-100">
                <ul className="space-y-1 block">
                  {accountManagementsData.map((item, index) => {
                    const { icon, path, title } = item
                    return (
                      <li key={index} className="mb-2 last:mb-0">
                        <Link href={path} legacyBehavior>
                          <a
                            className={`sidebar-item hover:bg-primary hover:text-white flex items-center py-3 px-4 duration-300 ease-in-out ${
                              router.pathname === path
                                ? 'active bg-primary'
                                : ''
                            }`}
                          >
                            <Image src={icon} alt={title} />
                            <span className="flex-1 ml-3 text-grey-900 font-medium text-base transition duration-75">
                              {title}
                            </span>
                          </a>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <button
                  className="mt-1 flex items-center py-3 px-4 duration-300 ease-in-out cursor-pointer sidebar-item  hover:bg-primary hover:text-white w-full"
                  onClick={onLogOutHandle}
                  type="button"
                >
                  <Image src={iconLogout} alt="icon" />
                  <span className="text-left flex-1 ml-3 text-grey-900 font-medium text-base transition duration-75">
                    <FormattedMessage id="page.myAccount.title.logout" />
                  </span>
                  <span className="block sm:hidden text-grey-700 text-base">
                    <IconArrowRight size="24" />
                  </span>
                </button>
              </div>
            </div>
            <div className="w-full mt-8 sm:mt-0">{children}</div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AccountManagements
AccountManagements.propTypes = {
  children: PropTypes.array.isRequired,
}
