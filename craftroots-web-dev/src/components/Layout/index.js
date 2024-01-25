import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Toast } from '../generic'
import Header from './Header'
import { iconArrowDown, iconWhatsapp } from '@/assets/images'
import useLayout from '@/hooks/useLayout'
import { allRoutes } from '@/constants/allRoutes'

const Footer = dynamic(() => import('./Footer'))
const Newsletter = dynamic(() => import('./Newsletter'))
function Layout({ children, storeConfig }) {
  const { goToTop, handleGoToTop, toastState } = useLayout({ storeConfig })
  const [showWhatsappWidget, setShowWhatsAppWidget] = useState(true)

  const router = useRouter()
  const storeConfigState = useSelector((state) => state.storeReducer)
  const promotionData =
    storeConfigState?.promotion?.data?.cmsBlocks?.items?.[0]?.content

  useEffect(() => {
    setShowWhatsAppWidget(!router.pathname.includes('/cart'))
  }, [router.pathname])
  /*  
  commented for now because of client change - skipping nextel for now  
   
  useEffect(() => {
    if (!router.pathname.includes('/cart')) {
      window.nextbot = {
        botId: '3430',
      }
      var n_js = document.createElement('SCRIPT')
      n_js.async = true
      n_js.type = 'text/javascript'
      n_js.src =
        (location.protocol == 'https:' ? 'https:' : 'http:') +
        '//chat.nextel.io/chat/wd/' +
        window.nextbot.botId
      document.head.appendChild(n_js)
    } else {
      const element = document.getElementById('nextel-chatbox')
      element?.remove()
    }
  }, [router.pathname]) */

  useEffect(() => {
    const element = document.getElementById('nextel-chatbox')
    if (goToTop && element) {
      element?.style.setProperty('bottom', '70px', 'important')
    } else {
      element?.style.setProperty('bottom', '20px', 'important')
    }
  }, [goToTop])

  return (
    <Fragment>
      {toastState.message && toastState.show && (
        <Toast title={toastState.message} error={toastState.error} />
      )}
      {router.pathname !== allRoutes.underMaintenance && <Header />}
      <main
        className={`${
          promotionData && promotionData.length > 0
            ? 'pt-[110px] sm:pt-[150px] md:pt-[220px] lg:pt-[241px]'
            : 'pt-[90px] md:pt-[200px]'
        }`}
      >
        {children}
        {router.pathname !== allRoutes.underMaintenance && <Newsletter />}
      </main>
      {router.pathname !== allRoutes.underMaintenance && <Footer />}
      {goToTop && (
        <button className="go-to-top" type="button" onClick={handleGoToTop}>
          <Image
            src={iconArrowDown}
            alt="arrow"
            className="rotate-180 w-4 h-4"
          />
        </button>
      )}
      {showWhatsappWidget && (
        <Link
          href={allRoutes.whatsappRedirectUrl}
          target="_blank"
          className={`flex-center w-12 h-12 sm:w-14 sm:h-14 rounded-full fixed right-4 p-2 bg-[#7ad03a] hover:bg-[#0dd17f] z-10 ${
            goToTop ? ' bottom-[70px]' : 'bottom-8'
          }`}
        >
          <Image
            src={iconWhatsapp}
            alt="Whatsapp"
            className="w-full h-full icon-white"
          />
        </Link>
      )}
    </Fragment>
  )
}

Layout.propTypes = {
  children: PropTypes.array.isRequired,
  storeConfig: PropTypes.object.isRequired,
}

export default Layout
