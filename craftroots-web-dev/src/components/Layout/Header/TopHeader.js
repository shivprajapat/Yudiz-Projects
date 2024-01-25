import Image from 'next/image'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import Notification from '@/components/Navigation/Notification'
import { iconHeart, iconUser, IconCart, iconSearch } from '@/assets/images'
import SideCart from '@/components/checkout/SideCart'
import { Searchbar } from '@/components/generic'
import useTopHeader from '@/hooks/useTopHeader'
import { allRoutes } from '@/constants/allRoutes'
import LogoLoader from '@/components/LogoLoader'
const AccountNavSidebar = dynamic(() =>
  import('@/components/account/AccountNavSidebar')
)
const BADGE_STYLE =
  'absolute inline-flex items-center justify-center w-[18px] h-[18px] text-[10px] font-bold text-white bg-[#E65B56] rounded-full -top-[3px] -right-[3px]'

const TopHeader = ({ showMobileIcon, handleMenu }) => {
  const { totalItems } = useSelector((state) => state.cartReducer)
  const {
    storeHeaderHtml,
    notificationOpen,
    cartOpen,
    searchOverlayActive,
    handleClick,
    handleNotification,
    handleCart,
    dashboardProfileOpen,
    handleDashboardProfile,
    wishlistStateCount,
    onLogOutHandle,
    handleAccountNavHide,
  } = useTopHeader()

  return (
    <>
      <nav className="top-nav">
        <div className="flex flex-wrap justify-between items-center container px-0">
          <LogoLoader
            className="flex shrink-0 relative"
            onMenuClick={handleMenu}
            showMenu={showMobileIcon}
          />
          <div className="grow">
            <div className="items-center gap-x-5 flex-wrap mb-5 justify-end hidden sm:flex contact-info">
              {storeHeaderHtml && (
                <div
                  className="items-center gap-x-5 flex-wrap mb-5 justify-end hidden sm:flex"
                  dangerouslySetInnerHTML={{
                    __html: storeHeaderHtml,
                  }}
                ></div>
              )}
            </div>
            <div className="flex items-center justify-end">
              <Searchbar className="hidden md:block w-[274px] mr-5" />
              <div className="flex items-center gap-x-2 flex-wrap">
                {/*
                NOTE: have to update in production but the functionality is pending tha's why it is commented 
                <CountriesList /> */}
                {/*
                NOTE: Client Change -> Remove track your order button from website and customer should be able to track the order from my order section 
                <OrderTracking /> 
                */}
                {/* <button
                  type="button"
                  onClick={handleNotification}
                  className="ease-in-out flex-center duration-300 icon-hover w-8 h-8 rounded-full hidden md:flex relative"
                >
                  <Image src={iconNotification} alt="iconNotification" />
                  <div className={BADGE_STYLE}>2</div>{' '}
                </button> */}
                <button
                  type="button"
                  onClick={handleClick}
                  className="ease-in-out flex-center duration-300 icon-hover w-8 h-8 rounded-full flex md:hidden"
                >
                  <Image
                    src={iconSearch}
                    alt="iconSearch"
                    className="w-5 h-5"
                  />
                </button>
                <button
                  type="button"
                  onClick={handleDashboardProfile}
                  className="ease-in-out flex-center duration-300 icon-hover w-8 h-8 rounded-full flex relative"
                >
                  <Image src={iconUser} alt="iconUser" />
                </button>
                <Link
                  href={allRoutes.wishlist}
                  className="ease-in-out flex-center duration-300 icon-hover w-8 h-8 rounded-full flex relative"
                >
                  <Image src={iconHeart} alt="iconHeart" />
                  {wishlistStateCount && (
                    <div className={BADGE_STYLE}>{wishlistStateCount}</div>
                  )}
                </Link>
                <button
                  type="button"
                  onClick={handleCart}
                  className="ease-in-out flex-center duration-300 icon-hover w-8 h-8 rounded-full relative !text-grey-800"
                >
                  <IconCart />
                  {totalItems ? (
                    <div className={BADGE_STYLE}>{totalItems}</div>
                  ) : null}{' '}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`fixed left-0 top-0 h-full w-full md:hidden mobile-topbar ${
            searchOverlayActive ? 'active' : ''
          }`}
        >
          <div className="relative z-[999] py-[9px] w-full h-full">
            <Searchbar />
          </div>
          <div
            className="absolute w-full h-full inset-y-0 bg-white opacity-90"
            onClick={handleClick}
          />
        </div>
        <Notification
          isShowing={notificationOpen}
          toggle={handleNotification}
        />
      </nav>
      <SideCart isShowing={cartOpen} toggle={handleCart} />
      <AccountNavSidebar
        isShowing={dashboardProfileOpen}
        toggle={handleDashboardProfile}
        onLogOutHandle={onLogOutHandle}
        onMenuItemClick={handleAccountNavHide}
      />
    </>
  )
}

export default TopHeader

TopHeader.propTypes = {
  menu: PropTypes.bool,
  showMobileIcon: PropTypes.bool,
  handleMenu: PropTypes.func,
}
