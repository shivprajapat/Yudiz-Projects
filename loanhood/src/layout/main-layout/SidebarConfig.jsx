import React from 'react'
import StoreIcon from '@material-ui/icons/Store'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import AppsIcon from '@material-ui/icons/Apps'
import ReportIcon from '@material-ui/icons/Report'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'

const sidebarConfig = [
  {
    title: 'Rentals',
    path: '/rentals',
    icon: <StoreIcon />,
    subMenu: false
  },
  {
    title: 'Fees',
    path: '/fees',
    icon: <AttachMoneyIcon />,
    subMenu: false
  },
  {
    title: 'Access Codes',
    path: '/access-codes',
    icon: <VpnKeyIcon />,
    subMenu: false
  },
  {
    title: 'Transactions',
    path: '/transactions',
    icon: <AccountBalanceWalletIcon />,
    subMenu: false
  },
  {
    title: 'Users',
    path: '/users',
    icon: <PeopleAltIcon />,
    subMenu: false
  },
  {
    title: 'Meta Data',
    icon: <AcUnitIcon />,
    subMenu: true,
    children: [
      {
        title: 'Categories',
        path: '/categories'
      },
      {
        title: 'Brands',
        path: '/brands'
      },
      {
        title: 'Materials',
        path: '/materials'
      },
      {
        title: 'Colors',
        path: '/colors'
      },
      {
        title: 'Size Groups',
        path: '/size-groups'
      }
    ]
  },
  {
    title: 'App',
    icon: <AppsIcon />,
    subMenu: true,
    children: [
      {
        title: 'Banner Images',
        path: '/banner-images'
      },
      {
        title: 'Banner Texts',
        path: '/banner-texts'
      },
      {
        title: 'Splash Screen',
        path: '/splash-screen'
      }
    ]
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: <ReportIcon />,
    subMenu: false
  }
]

export default sidebarConfig
