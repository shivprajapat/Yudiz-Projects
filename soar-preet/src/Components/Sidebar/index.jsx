import React, { useState } from 'react'
import sidebarButton from 'Assets/right-arrow.png'
import { NavLink, useNavigate } from 'react-router-dom'
import LayersIcon from '@mui/icons-material/Layers'
import WidgetsIcon from '@mui/icons-material/Widgets'
import SummarizeIcon from '@mui/icons-material/Summarize'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { route } from 'Constants/AllRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { setLoginStatus } from 'Redux/Actions/AuthAction'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { setNotification } from 'Redux/Actions/NotificationAction'

function Sidebar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const notification = useSelector((state) => state.notification.isNotification)

  const [open, setOpen] = useState(false)
  const [subMenuOpen, setSubMenuOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState(null)

  const menu = [
    { id: 1, title: 'All Dashboard', src: <LayersIcon />, path: route.allDashboard },
    { id: 2, title: 'Vulnerability', src: <WidgetsIcon />, path: route.vulnerability },
    {
      id: 3,
      title: 'Patches',
      src: <SummarizeIcon />,
      path: route.patch
    },
    {
      title: 'Audit ',
      src: <AccountBalanceWalletIcon />,
      path: route.audit,
      id: 4
    }
  ]

  function handleLogout() {
    dispatch(setLoginStatus(false))
    navigate(route.login)
    localStorage.removeItem('isUserLoggedIn')
  }

  const handleMenuClick = (id) => {
    setSelectedMenu(id === selectedMenu ? null : id)
  }

  function handleNotification() {
    dispatch(setNotification(!notification))
  }

  return (
    <div className={`${open ? 'w-64 ' : 'w-20 '} bg-darkGrey  h-screen  top-0 p-5 sticky z-10  pt-8 duration-500  `}>
      <img
        alt=''
        src={sidebarButton}
        onClick={() => setOpen(!open)}
        className={`absolute cursor-pointer -right-4 bottom-9 w-7 bg-white  border-grey
           border-2 rounded-full text-white  ${open === true && 'rotate-180'} `}
      />

      <div className='flex gap-x-4 items-center'>
        <p className='text-white'>Logo</p>
        <h3 className={`text-white origin-left font-medium text-xl duration-200 ${!open && 'scale-0'} `}>Soar</h3>
      </div>

      <ul className='pt-6 '>
        {menu.map((data, index) => (
          <NavLink key={index} to={data?.path}>
            <li
              onClick={() => {
                handleMenuClick(data?.id)
                if (data?.subMenuItems?.length) {
                  setSubMenuOpen(!subMenuOpen)
                }
              }}
              className={`group flex p-2 cursor-pointer  text-gray-300 text-xl items-center gap-x-4 hover:bg-lightBlue hover:text-pink-500 ${
                selectedMenu === data?.id ? 'bg-lightBlue' : ''
              }`}
            >
              <span className='menu-hover '>{data?.src}</span>
              <span className={`${!open && 'hidden'} origin-left  duration-200 ${!open && 'scale-0'}`}>{data.title}</span>

              {data?.submenu && open ? (
                <ArrowDropDownIcon className={`${subMenuOpen && 'rotate-180'} mx-20 `} />
              ) : (
                <ul
                  className={` ${
                    data?.submenu ? 'visible' : 'hidden'
                  } invisible absolute z-10 bg-lightBlue  mx-8 flex w-[150px] flex-col  py-1 px-2 text-white shadow-xl group-hover:visible`}
                >
                  {data?.subMenuItems?.map((subitem, index) => (
                    <NavLink key={index} to={subitem?.path}>
                      <li key={index}>
                        <a href='s' className='my-2 block  py-1 text-base font-semibold text-white hover:text-pink-500 md:mx-2'>
                          {subitem?.title}
                        </a>
                      </li>
                    </NavLink>
                  ))}
                </ul>
              )}
            </li>

            {data?.submenu && subMenuOpen && (
              <ul className='bg-lightBlue'>
                {data?.subMenuItems?.map((subitem, index) => (
                  <NavLink key={index} to={subitem?.path}>
                    <li
                      key={index}
                      className={`${
                        open === false && 'hidden'
                      } flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-xl items-center gap-x-4 mx-10 hover:text-pink-500 `}
                    >
                      {subitem?.title}
                    </li>
                  </NavLink>
                ))}
              </ul>
            )}
          </NavLink>
        ))}
      </ul>

      <ul className='flex absolute bottom-16 pb-5'>
        <li
          className={`flex  rounded-md px-2 py-0 cursor-pointer hover:bg-light-white text-gray-300 text-xl items-center gap-x-4 hover:text-pink-500`}
        >
          <NotificationsIcon onClick={handleNotification} />
        </li>
      </ul>

      <ul className='flex absolute bottom-9'>
        <li
          onClick={handleLogout}
          className={`flex  rounded-md px-2 py-0 cursor-pointer hover:bg-light-white text-gray-300 text-xl items-center gap-x-4 hover:text-pink-500`}
        >
          <span>
            <LogoutIcon style={{ transform: 'rotate(180deg)' }} />
          </span>
          <span className={`${!open && 'hidden'} origin-left  duration-200 ${!open && 'scale-0'}`}>Logout</span>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
