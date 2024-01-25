import React from 'react'
import PropTypes from 'prop-types'

function ClientCommonNavAMP(props) {
  return (
    <>
      <style jsx amp-custom>{`
      .d-flex{display:flex;-webkit-display:flex}.commonNav{margin:0px 0px 16px;padding:6px 8px;background:#fff;border-radius:2em;white-space:nowrap;overflow:auto}.commonNav .item{margin:0px 7px;-webkit-flex-grow:0;flex-grow:0;text-transform:uppercase}.commonNav .item a{display:block;padding:5px 8px;font-size:12px;line-height:18px;color:#23272e;font-weight:700;background:transparent;border-radius:2em;text-decoration:none}.commonNav .item a:hover{color:#045de9}.commonNav .item a.active{background:#e7f0ff;color:#23272e}.commonNav .item:first-child{margin-left:0}.commonNav .item:last-child{margin-right:0}.commonNav.themeLightNav{background:#e7f0ff}.commonNav.themeLightNav a.active{background:#fff}@media(max-width: 1199px){.commonNav .item{margin:0px 4px}}@media(max-width: 992px){.commonNav .item{margin:0px 3px}}@media(max-width: 575px){.commonNav{margin:0px -12px 12px;border-radius:0}}/*# sourceMappingURL=style.css.map */
      `}
      </style>
      <div
        className={`commonNav d-flex ${props.isEqualWidth && 'equal-width-nav'} ${props.themeLight && 'themeLightNav'
          } text-uppercase scroll-list flex-nowrap text-nowrap`}
      >
        {props.items?.map(({ navItem, internalName }, i) => {
          return (
            <div key={i} className="item">
              <a
                href={internalName === 'home' ? '?amp=1' : `?amp=1&tab=${internalName}`}
                className={`text-uppercase ${props.active === internalName && 'active'} nav-link`}
              >
                {navItem}
              </a>
            </div>
          )
        })}
      </div>
    </>
  )
}

ClientCommonNavAMP.propTypes = {
  items: PropTypes.array,
  isEqualWidth: PropTypes.bool,
  themeLight: PropTypes.bool,
  active: PropTypes.string
}

export default ClientCommonNavAMP
