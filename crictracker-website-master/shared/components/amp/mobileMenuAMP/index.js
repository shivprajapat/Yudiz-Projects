import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import { allRoutes } from '@shared/constants/allRoutes'

const MobileMenuAMP = ({ handleMenuShow }) => {
  const router = useRouter()
  return (
    <>
      <style jsx amp-custom>{`
    a{color:inherit;text-decoration:none;outline:none;-webkit-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;transition:all .3s ease-in-out;cursor:pointer}@media(max-width: 767px){.mobileMenu{position:fixed;left:0;bottom:0;width:100vw;background:var(--light-mode-bg);z-index:10;-webkit-box-shadow:2px 0px 8px rgba(0,0,0,.1);box-shadow:2px 0px 8px rgba(0,0,0,.1)}.mobileMenu li{padding:4px 4px;flex-grow:1;min-width:68px;text-transform:uppercase}.mobileMenu svg{display:block;margin:0px auto 1px;width:24px;height:24px}.mobileMenu a{display:block;border-radius:8px;font-size:11px}.mobileMenu a:hover,.mobileMenu a.active{background:var(--theme-light);color:var(--theme-medium2)}.mobileMenu a:hover amp-img,.mobileMenu a.active amp-img{-webkit-filter:none;filter:none}.mobileMenu amp-img{display:block;margin:0px auto;-webkit-filter:brightness(0) invert(0);filter:brightness(0) invert(0)}}@media(prefers-color-scheme: dark){.mobileMenu a:hover amp-img,.mobileMenu a.active amp-img{-webkit-filter:brightness(0) invert(1) opacity(0.7);filter:brightness(0) invert(1) opacity(0.7)}.mobileMenu amp-img{-webkit-filter:brightness(0) invert(1) opacity(0.5);filter:brightness(0) invert(1) opacity(0.5)}}@media(max-width: 350px){.mobileMenu li{min-width:60px}.mobileMenu a{border-radius:6px;font-size:10px}}/*# sourceMappingURL=style.css.map */

      `}</style>
      <ul className="mobileMenu d-flex d-md-none t-center t-uppercase font-semi mb-0">
        <li>
          <a href={allRoutes.home} className={`${router.pathname === allRoutes.home ? 'active' : ''}`}>
            <amp-img alt="Home" src="/static/nav-home-icon.svg" width="24" height="24"> </amp-img>
            Home
          </a>
        </li>
        <li>
          <a href={allRoutes.fixtures} className={`${router.pathname.includes(allRoutes.fixtures) && 'active'}`}>
            <amp-img alt="Schedule" src="/static/nav-schedule-icon.svg" width="24" height="24"> </amp-img>
            Schedule</a>
        </li>
        <li>
          <a href={allRoutes.fantasyCricketTips} className={`${router.pathname.includes(allRoutes.fantasyCricketTips) && 'active'}`}>
            <amp-img alt="Fantasy" src="/static/nav-fantasy-tip-icon.svg" width="24" height="24"> </amp-img>
            Fantasy Tips</a>
        </li>
        <li>
          <a href={allRoutes.cricketSeries} className={`${router.pathname.includes(allRoutes.cricketSeries) && 'active'}`}>
            <amp-img alt="fantasy" src="/static/nav-cup-icon.svg" width="24" height="24"> </amp-img>
            Series</a>
        </li>
        <li>
          <a on="tap:sidebar1.toggle" onClick={() => handleMenuShow()}>
            <amp-img alt="Home" src="/static/nav-menu-icon.svg" width="24" height="24"> </amp-img>
            More</a>
        </li>
      </ul>
    </>
  )
}

MobileMenuAMP.propTypes = {
  handleMenuShow: PropTypes.func
}

export default MobileMenuAMP
