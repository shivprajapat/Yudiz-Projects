import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import dynamic from 'next/dynamic'
import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'
import useWindowSize, { SIZE_BREAKPOINTS } from '@/hooks/useWindowSize'
import { navigationDataAction } from '@/actions/headerAction'
const PromotionsBar = dynamic(() => import('./PromotionBar'), {
  ssr: false,
})

const HEADER_HEIGHT = 200
const Header = () => {
  const [show, handleShow] = useState(false)
  const size = useWindowSize()
  const storeConfigState = useSelector((state) => state.storeReducer)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    window.addEventListener('scroll', () => {
      handleShow(window.scrollY > HEADER_HEIGHT)
    })

    dispatch(
      navigationDataAction({
        rootCategoryId: storeConfigState?.data?.storeConfig?.root_category_id,
      })
    )
  }, [])

  const showPromotionBar = !router.pathname.startsWith('/cart/')
  return (
    <header
      className={`${
        show ? 'stick' : ''
      } fixed bg-white w-full top-0 sm:z-[99] z-[999]`}
    >
      {showPromotionBar && <PromotionsBar />}
      {size.width &&
        (size.width >= SIZE_BREAKPOINTS.md ? <DesktopMenu /> : <MobileMenu />)}
    </header>
  )
}

export default Header
Header.propTypes = {
  show: PropTypes.bool,
}
