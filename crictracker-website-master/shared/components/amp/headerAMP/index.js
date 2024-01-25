import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import dynamic from 'next/dynamic'
import iconImg from '@assets/images/icon/trending-icon.svg'

import { allRoutes } from '@shared/constants/allRoutes'
import { getHeaderSidebarMenu } from '../../../libs/menu'
import { FACEBOOK_URL, TELEGRAM_URL, LINKEDIN_URL, INSTAGRAM_URL, TWITTER_URL, YOUTUBE_URL, SPORTSINFO_URL, CRICTRACKER_HINDI_URL, CRICTRACKER_BENGALI_URL, S3_PREFIX, THREADS_URL } from '@shared/constants'
// import WhatsAppUpdateAMP from '@shared-components/amp/whatsAppUpdateAMP'

const HeaderMenuAMP = dynamic(() => import('@shared-components/amp/headerAMP/headerMenuAMP'))
const MobileMenuAMP = dynamic(() => import('@shared-components/amp/mobileMenuAMP'))

function HeaderAMP() {
  const { t } = useTranslation()
  const sliderData = getHeaderSidebarMenu()

  return (
    <>
      <style jsx amp-custom global>{`
      .siteHeader{background:#045de9}.siteHeader .navbar{padding:10px 0;font-size:12px;line-height:20px;-webkit-align-items:center;align-items:center}.siteHeader .navbar .nav{margin-left:auto;-webkit-align-items:center;align-items:center}.siteHeader .navbar .nav .userDropdown>button,.siteHeader .navbar .nav .navLink{margin-left:4px;color:#fff;font-weight:700}.siteHeader .navbar .nav .userDropdown>button:hover,.siteHeader .navbar .nav .navLink:hover{color:#fff}.siteHeader .navbar .nav .userDropdown>button.fillBtn,.siteHeader .navbar .nav .userDropdown>button.outlineBtn,.siteHeader .navbar .nav .navLink.fillBtn,.siteHeader .navbar .nav .navLink.outlineBtn{border-radius:2em}.siteHeader .navbar .nav .userDropdown>button.fillBtn,.siteHeader .navbar .nav .navLink.fillBtn{padding:6px 10px;background:#fff;color:#045de9}.siteHeader .navbar .nav .userDropdown>button.outlineBtn,.siteHeader .navbar .nav .navLink.outlineBtn{padding:4px 12px;color:#fff;border:2px solid #fff}.siteHeader .navbar .nav .userDropdown>button.outlineBtn svg,.siteHeader .navbar .nav .navLink.outlineBtn svg{margin:0 4px 0 -2px}.siteHeader .navbar .nav .iconItem{padding:0}.siteHeader .navbar .nav .iconItem svg{width:28px;height:28px}.siteHeader .navbar .nav .search-icon{width:32px;height:32px}.siteHeader .navbar .separator{margin-left:6px;width:1px;height:26px;display:block;background:rgba(255,255,255,.2)}.siteHeader .navbar .userDropdown>button{padding:0}.siteHeader .navbar .userDropdown>button::after{display:none}.siteHeader .navbar .userDropdown>button>span{display:block}.siteHeader .navbar .userDropdown .dropdownMenu{min-width:190px}.siteHeader .navbar .profileInfo{margin-bottom:7px;padding-bottom:9px;border-bottom:1px solid #d8d8d8;cursor:pointer}.siteHeader .navbar .profileInfo .profilePic{width:32px;margin-right:7px}.siteHeader .navbar .profileInfo .profilePic img{object-fit:cover}.siteHeader .logo{padding:0;margin:0;width:140px;display:block}.siteHeader .modeSwitch label{color:#fff;margin-right:8px}.userDropdown .dropdownVerify button{width:auto;border:1px solid}.langMenu{margin-left:6px}.langMenu>button{display:flex;display:-webkit-flex;-webkit-align-items:center;align-items:center;background-color:transparent;font-size:12px;line-height:18px;color:#fff;padding:0}.langMenu>button::after{margin-left:2px;width:18px;height:18px;background:url(../../../assets/images/icon/down-caret.svg) no-repeat center center/cover;border:none;-webkit-transition:all .3s ease-in-out;-ms-transition:all .3s ease-in-out;transition:all .3s ease-in-out}.langMenu>button:hover,.langMenu>button:focus{color:#fff}.langMenu.show .dropdown-toggle{background:#f2f4f7;border-color:#f2f4f7;color:inherit;box-shadow:none;outline:none}.langMenu.show .dropdown-toggle:hover,.langMenu.show .dropdown-toggle:focus{background:#f2f4f7;border-color:#f2f4f7;color:inherit;box-shadow:none;outline:none}.langMenu.show .dropdown-toggle::after{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.langMenu .dropdown-menu{margin-top:-8px;padding:8px 0;min-width:100%;background:#f2f4f7;border:none}.langMenu .dropdown-menu button{width:100%;background:transparent;border:none;display:flex;display:-webkit-flex;-webkit-justify-content:space-between;justify-content:space-between}.langMenu .dropdown-menu button:hover,.langMenu .dropdown-menu button:focus{color:inherit}.sidebar{min-width:440px;padding:24px;background:var(--light-mode-bg)}.sidebar .closeMenu{padding:0;width:24px;height:24px;position:absolute;right:20px;top:20px;border:1px solid var(--border-color);border-radius:50%;z-index:1}.sidebar .item{margin-bottom:60px}.sidebar .item:last-child{margin-bottom:0}.sidebar h4{margin-bottom:16px;font-size:12px;line-height:17px;color:var(--font-light);text-transform:uppercase}.sidebar .moreLink ul{padding-top:8px}.sidebar .moreLink li{margin-bottom:16px}.sidebar .moreLink li:last-child{margin-bottom:0}.sidebar .moreLink a{display:block;padding-left:8px;font-size:14px;line-height:21px}.sidebar .socialMenu li{margin-right:12px}.sidebar .socialMenu li:last-child{margin-right:0}.sidebar .socialMenu a{display:block;width:32px;filter:brightness(0.4)}.sidebar .socialMenu a:hover{opacity:1}.sidebar .otherLogo-container{display:flex;flex-direction:column;gap:10px}.sidebar .otherLogo{width:116px;max-width:60%}.accordian-heading{border-radius:6px;width:250px;font-size:14px;line-height:24px;font-weight:600;padding:8px;background:var(--light-mode-bg);color:var(--font-color);border:1px solid var(--light-bg)}.accordian-heading div{display:flex;align-items:center;gap:8px}.accordian-list{border-radius:6px}.accordian-list li{background-color:var(--theme-bg);padding:12px 8px 12px 12px;font-size:14px}.accordian-lblimg{width:24px;height:24px;padding:4px;background-color:var(--theme-medium);border-radius:4px;display:flex;align-items:center;justify-content:center}.acordian{display:flex;gap:24px}.accordian-container{margin:8px 0px}@media(min-width: 1400px){.userDropdown .dropdownMenu{right:50%;-webkit-transform:translate(calc(50% + 8px));-ms-transform:translate(calc(50% + 8px));transform:translate(calc(50% + 8px))}}@media(max-width: 767px){.siteHeader .navbar .separator{display:none}.d-md-block{display:none}.acordian{flex-direction:column}.accordian-heading{width:auto}}/*# sourceMappingURL=style.css.map */

      `}</style>
      <header className="siteHeader">
        <div className="container">
          <nav className="navbar d-flex align-items-center navbar navbar-expand navbar-light">
            <a href="/" className="logo navbar-brand d-block">
              <amp-img alt="post" src="/static/logo.png" width="689" height="108" layout="responsive"></amp-img>
            </a>
            <div className="nav d-flex ms-auto align-items-center">
              {/* {!isAuthenticated && (
                <CustomLink href={allRoutes.signIn} prefetch={false}>
                  <a className="navLink fillBtn">
                    {t('common:SignIn')}
                  </a>
                </Link>
              )} */}
              {/* <GlobalSearch /> */}
              {/* For phase 2 */}
              {/* {isAuthenticated &&
                showPopUp === true &&
                userData &&
                userData.bIsMobVerified === false &&
                router.pathname !== '/verify-phone-number' && (
                  <Dropdown defaultShow className="userDropdown user-dropdown">
                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="navLink iconItem">
                      <NotificationIcon />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdownMenu dropdownVerify text-center" align="end">
                      <div className="mb-2">
                        <PasswordPhoneIcon />
                      </div>
                      <p className="mb-2">{t('common:VerifyPhonenumber')}</p>
                      <CustomLink href={allRoutes.verifyPhoneNumber} prefetch={false}>
                        <a className="theme-btn outline-btn small-btn mx-auto">{t('common:Verify')}</a>
                      </Link>
                      <Dropdown.Item onClick={() => setUserPrefrence()}>{t('common:Skip')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              )} */}
              {/* {isAuthenticated && (
                <Dropdown className="userDropdown user-dropdown">
                  <Dropdown.Toggle variant="link" id="dropdown-basic">
                    <Image src={userIcon} alt="user name" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdownMenu" align="end">
                    <CustomLink href={allRoutes.profile} prefetch={false}>
                      <div className="profileInfo d-flex align-items-center">
                        <div className="profilePic rounded-circle overflow-hidden">
                          <Image
                            src={getImgURL(userData?.sProPic) || userImg}
                            alt={userData?.sFullName}
                            width="80"
                            height="80"
                            layout="responsive"
                          />
                        </div>
                        <span>{userData?.sFullName}</span>
                      </div>
                    </CustomLink>
                    <CustomLink href={allRoutes.saveForLater} passHref prefetch={false}>
                      <Dropdown.Item href={allRoutes.saveForLater}> {t('common:SavedForLater')}</Dropdown.Item>
                    </CustomLink>
                    <Dropdown.Item>{t('common:ChangePassword')}</Dropdown.Item>
                    <Dropdown.Item onClick={handleSignOut} as="button"> {t('common:SignOut')}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )} */}
              {/* <a href={allRoutes.search} className="navLink iconItem search-icon">
                <amp-img alt="menu" src="/static/search-icon.svg" width="32" height="32" layout="responsive"></amp-img>
              </a> */}
              <span className="separator d-none d-md-block"></span>
              <a on="tap:sidebar1.toggle" className="navLink iconItem search-icon d-none d-md-block">
                <amp-img alt="menu" src="/static/menu-icon.svg" width="32" height="32" layout="responsive"></amp-img>
              </a>
              {/* <WhatsAppUpdateAMP /> */}
            </div>
          </nav>
        </div>
        <HeaderMenuAMP />
      </header>
      <amp-sidebar id="sidebar1" layout="nodisplay" side="right" className="sidebar">
        <div className="acordian">
          <div className="item">
            <h4 className="text-uppercase">{t('common:Topics')}</h4>
            <amp-accordion animate="">
              {
                sliderData.map((data, i) =>
                  <section className="accordian-container" key={i}>
                    <h5 className="accordian-heading">
                      <div>
                        {data?.oImg?.sUrl && <span className='accordian-lblimg'><amp-img src={data?.oImg?.sUrl ? `${S3_PREFIX}${data?.oImg?.sUrl}` : iconImg} width="18" height="18"></amp-img></span>}
                        {
                          data?.bIsMulti ? <span>{data?.sName}</span> : <a href={`/${data?.sSlug}?amp=1`}>{data?.sName}</a>
                        }
                      </div>
                    </h5>
                    <ul className="accordian-list">
                      {data.aSlide.map((slide, i) =>
                        <li key={i}><a href={`/${slide?.sSlug}?amp=1`}>{slide?.sName}</a></li>)}
                    </ul>
                  </section>
                )
              }
            </amp-accordion>
          </div>
          <div className="infoSection">
            <div className="item moreLink">
              <h4 className="text-uppercase">{t('common:MoreLinks')}</h4>
              <ul className="mb-0">
                <li>
                  <a href={allRoutes.aboutUs}>{t('common:AboutUs')}</a>
                </li>
                <li>
                  <a href={allRoutes.contactUs}>{t('common:ContactUs')}</a>
                </li>
                <li>
                  <a href={allRoutes.privacyPolicy}>{t('common:PrivacyPolicy')}</a>
                </li>
                <li>
                  <a href="/">{t('common:GDPRCompliance')}</a>
                </li>
                <li>
                  <a href="/">{t('common:Affiliate')}</a>
                </li>
              </ul>
            </div>
            <div className="item">
              <h4 className="text-uppercase"># {t('common:FollowUs')}</h4>
              <ul className="socialMenu d-flex text-uppercase align-items-center d-flex mb-0">
                <li>
                  <a href={FACEBOOK_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="menu" src="/static/facebook-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={THREADS_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="threads" src="/static/threads-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={TWITTER_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="twitter" src="/static/twitter-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="instagram" src="/static/instagram-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="linkedin" src="/static/linkedin-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={YOUTUBE_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="youtube" src="/static/youtube-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
                <li>
                  <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
                    <amp-img alt="telegram" src="/static/telegram-icon.svg" width="32" height="32" layout="responsive"></amp-img>
                  </a>
                </li>
              </ul>
            </div>
            <div className="item">
              <h4 className="text-uppercase">{t('common:OtherSports')}</h4>
              <div className="otherLogo-container">
                <a href={SPORTSINFO_URL} target="_blank" rel="noreferrer" className="otherLogo">
                  <amp-img src="/static/sportsinfo.svg" alt="logo" width="116" height="24" layout="responsive"></amp-img>
                </a>
                <a href={CRICTRACKER_HINDI_URL} target="_blank" rel="noreferrer" className="otherLogo">
                  <amp-img src="/static/crictracker-logo-hindi.png" alt="crictracker logo" width="164" height="26" layout="responsive"></amp-img>
                </a>
                <a href={CRICTRACKER_BENGALI_URL} target="_blank" rel="noreferrer" className="otherLogo">
                  <amp-img src="/static/crictracker-logo-bangla.png" alt="crictracker logo" width="164" height="22" layout="responsive"></amp-img>
                </a>
              </div>
            </div>
          </div>
        </div>
      </amp-sidebar>
      <MobileMenuAMP />
      {/* <MobileMenu handleMenuShow={handleMenuShow} /> */}
    </>
  )
}
export default HeaderAMP
