import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

const CommonNavAMP = (props) => {
  const router = useRouter()
  return (
    <>
      <style jsx amp-custom>{`
       .commonNav{margin:0 0 16px;padding:6px 8px;background:var(--light-mode-bg);white-space:nowrap;overflow:auto}.commonNav .item{margin:0 3px;-webkit-flex-grow:0;flex-grow:0}.commonNav .item a{display:block;padding:5px 8px;font-size:12px;line-height:18px;color:var(--font-color);font-weight:700;background:transparent;border-radius:2em;text-decoration:none}.commonNav .item a:hover{color:var(--theme-color-light)}.commonNav .item a.active{background:var(--theme-light);color:var(--font-color)}.commonNav .item:first-child{margin-left:0}.commonNav .item:last-child{margin-right:0}.commonNav.themeLightNav{background:var(--theme-light)}.commonNav.themeLightNav a.active{background:var(--light-mode-bg)}@media(max-width: 575px){.commonNav{margin:0px -12px 12px;border-radius:0}.commonNav.stickyNav{position:sticky;top:0px;z-index:5;-webkit-box-shadow:0 2px 4px 0 rgba(var(--bs-dark-rgb), 0.2);box-shadow:0 2px 4px 0 rgba(var(--bs-dark-rgb), 0.2)}}/*# sourceMappingURL=style.css.map */

      `}
      </style>
      <div
        className={`commonNav d-flex ${props.isEqualWidth && 'equal-width-nav'} ${props.isSticky && 'stickyNav'} ${props.themeLight && 'themeLightNav'
          } t-uppercase scroll-list flex-nowrap text-nowrap`}
      >
        {props.items.map(({ navItem, url, active }) => (
          <div key={url} className="item">
            {props.queryParams && (
              <a href={{ pathname: url, query: { q: `${router?.query?.q}?amp=1` } }} id={url} className={`${active && 'active'} nav-link`}>
                {typeof navItem === 'string' ? navItem?.replaceAll('-', ' ') : navItem}
              </a>
            )}
            {!props.queryParams && (
              <a href={`${url}?amp=1`} id={url} className={`${active && 'active'} nav-link`}>
                {typeof navItem === 'string' ? navItem?.replaceAll('-', ' ') : navItem}
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

CommonNavAMP.propTypes = {
  items: PropTypes.array,
  isEqualWidth: PropTypes.bool,
  themeLight: PropTypes.bool,
  queryParams: PropTypes.bool,
  isSticky: PropTypes.bool
}

export default CommonNavAMP
