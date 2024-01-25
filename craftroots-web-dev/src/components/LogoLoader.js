import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import NProgress from 'nprogress' //nprogress module
import LogoLoaderGIF from '@/assets/logo-loader.gif'
import { iconHamburger } from '@/assets/images'

const Logo = dynamic(() => import('./Layout/Logo'))

const ANIM_DUR = {
  basic: 1000,
  hide: 5050,
}
function LogoLoader({ className, showMenu, onMenuClick }) {
  const router = useRouter()
  const [isLoaderVisible, setIsLoaderVisible] = useState({
    show: false,
    class: '',
  })
  const indicator = useRef({ interval: null, value: 0 })
  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      NProgress.start()
      if (!shallow) {
        /* indicator.current.interval = setInterval(() => {
          indicator.current.value += ANIM_DUR.basic
        }, ANIM_DUR.basic)
        setIsLoaderVisible({
          show: true,
          class: 'logo-wrapper',
        }) */
        if (!isLoaderVisible.show) {
          setIsLoaderVisible({
            show: true,
            class: 'logo-wrapper',
          })
          setTimeout(() => {
            setIsLoaderVisible({
              show: false,
              class: '',
            })
          }, ANIM_DUR.hide)
        }
      }
    }

    const handleRouteComplete = (url, { shallow }) => {
      NProgress.done()
      if (!shallow) {
        if (indicator.current.value >= ANIM_DUR.hide) {
          // timeout = { class: 0, hide: ANIM_DUR.basic }
          const remainder = indicator.current.value / ANIM_DUR.hide
          if (!Number.isInteger(remainder)) {
          } else {
          }
        }
        /* setTimeout(() => {
          setIsLoaderVisible({
            show: true,
            // class: 'hide',
            class: 'logo-wrapper',
          })
        }, timeout.class) */
        /* setTimeout(() => {
          setIsLoaderVisible({
            show: false,
            class: '',
          })
          indicator.current.value = 0
          clearInterval(indicator.current.interval)
        }, timeout.hide) */
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)
    router.events.on('routeChangeComplete', handleRouteComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleRouteComplete)
    }
  }, [isLoaderVisible.show])

  return (
    <div className={`${isLoaderVisible.class} ${className}`}>
      {showMenu && (
        <button
          type="button"
          onClick={onMenuClick}
          className="cursor-pointer mr-5"
        >
          <Image src={iconHamburger} alt="icon menu" className="w-8 h-8" />
        </button>
      )}
      <img
        src={isLoaderVisible.show ? LogoLoaderGIF.src : ''}
        alt="logo-loader"
        className="logo-loader absolute bottom-0 !w-auto"
      />
      {/* )} */}
      <Logo />
    </div>
  )
}

LogoLoader.propTypes = {
  className: PropTypes.string,
  showMenu: PropTypes.bool,
  onMenuClick: PropTypes.func.isRequired,
}
LogoLoader.defaultProps = {
  className: '',
  showMenu: false,
}

export default LogoLoader
