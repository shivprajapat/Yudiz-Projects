import React, { useEffect, useState } from 'react'
import { Container, Navbar, Nav, Dropdown, Button } from 'react-bootstrap'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import { MenuIcon } from '@shared-components/ctIcons'
import logo from '@assets/images/logo.svg'
import useWindowSize from '@shared/hooks/windowSize'
import { allRoutes } from '@shared/constants/allRoutes'
import { useRouter } from 'next/router'
import { checkIsGlanceView } from '@shared/utils'

const HeaderSidebar = dynamic(() => import('@shared-components/header/headerSidebar'), { ssr: false })
const HeaderBottomMenu = dynamic(() => import('@shared-components/header/headerBottomMenu'))
const MobileMenu = dynamic(() => import('@shared-components/mobileMenu'))
const MyImage = dynamic(() => import('@shared/components/myImage'))
const CustomLink = dynamic(() => import('../customLink'))
const HeaderUser = dynamic(() => import('./headerUser'), { ssr: false })
const CtToolTip = dynamic(() => import('@shared/components/ctToolTip'))

function MainHeader() {
  const router = useRouter()
  const { t } = useTranslation()
  const [showMenu, setMenuShow] = useState(false)
  const handleMenuClose = () => setMenuShow(false)
  const handleMenuShow = (e) => {
    e.preventDefault()
    setMenuShow(true)
  }
  const [showLang, setShowLang] = useState(false)
  const showDropdown = (e) => { setShowLang(!showLang) }
  const hideDropdown = e => { setShowLang(false) }
  const [width] = useWindowSize()
  const [scrollTrigger, setScrollTrigger] = useState(false)
  const [scrollDirection, setScrollDirection] = useState(null)
  const isGlanceView = checkIsGlanceView(router?.query)

  useEffect(() => {
    function handleScroll() {
      setScrollTrigger(window.scrollY > 48)
      const currentScrollPos = window.pageYOffset
      const isScrollingUp = currentScrollPos < (window.prevScrollPos || 0)

      setScrollDirection(isScrollingUp ? 'up' : 'down')
      if (isScrollingUp) {
        document.body.classList.remove('downStickyAds')
      } else if (window.scrollY > 48) {
        document.body.classList.add('downStickyAds')
      }
      window.prevScrollPos = currentScrollPos
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`${styles.siteHeader} ${width < 768 && scrollDirection === 'up' ? styles.fixed : styles.down} ${scrollTrigger && styles.fixedAnimation} position-sticky`}>
        <Container>
          <Navbar className={`${styles.navbar} align-items-center position-sticky top-0 p-0`}>
            <CustomLink prefetch={false} href="/">
              <a className={`${styles.logo} ${isGlanceView ? 'pe-none' : ''} navbar-brand d-block m-0 p-0`}>
                <MyImage
                  src={logo}
                  alt="logo"
                  layout="responsive"
                />
              </a>
            </CustomLink>
            <span className={`${styles.separator} d-none d-md-block ms-1 ms-md-2 ms-lg-3`}></span>
            <Dropdown className={`${styles.langMenu} common-dropdown d-none d-md-block ms-md-2 ms-lg-3`} show={showLang} onMouseEnter={showDropdown} onMouseLeave={hideDropdown}>
              <Dropdown.Toggle id="language" variant="link" className="d-flex xsmall-text p-0 bg-transparent align-items-center a-transition">
                {t('common:English')}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="https://hindi.crictracker.com" target="_blank">
                  {t('common:Hindi')}
                </Dropdown.Item>
                <Dropdown.Item href="https://bengali.crictracker.com" target="_blank">
                  {t('common:Bengali')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav className={`${styles.nav} ms-auto align-items-center`}>
              <a href={allRoutes.signIn} className="d-none">Sign in</a>
              <HeaderUser isGlanceView={isGlanceView} styles={styles} />
              <span className={`${styles.separator} d-none d-md-block ms-1 ms-md-2 ms-lg-3`}></span>
              <CtToolTip tooltip={t('common:More')}>
                <Button onClick={handleMenuShow} aria-label="menu" className={`${styles.navLink} ${styles.iconItem} p-0 d-none d-md-block`}>
                  <MenuIcon />
                </Button>
              </CtToolTip>
            </Nav>
          </Navbar>
        </Container>
      </header>
      {showMenu && <HeaderSidebar showMenu={showMenu} handleMenu={handleMenuClose} />}
      {!isGlanceView && (
        <>
          <HeaderBottomMenu />
          {width < 767 && (
            <MobileMenu handleMenuShow={handleMenuShow} scrollDirection={scrollDirection} scrollTrigger={scrollTrigger} />
          )}
        </>
      )}
    </>
  )
}
export default MainHeader
