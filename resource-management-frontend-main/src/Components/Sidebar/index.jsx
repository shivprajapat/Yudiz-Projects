import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'

import { sidebarConfig } from './sidebarConfig'
import { isGranted } from 'helpers'
import circleLeftArrow from '../../Assets/Icons/circle-left-arrow.png'
import circleRightArrow from '../../Assets/Icons/circle-right-arrow.png'
import CustomToolTip from 'Components/TooltipInfo'

export function Sidebar({ onClose = () => { }, isSidebarWrapped = true, setIsSidebarWrapped = () => { } }) {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  function matchRoute(route) {
    return (pathname + search).startsWith(route) && pathname === route
  }
  function handleNavigate(link) {
    !matchRoute(link) && navigate(link)
  }
  return (
    <div className="sidebar">
      {sidebarConfig.map(({ link, Component, title, color, disabled, allowed }, index) =>
        !disabled && isGranted(allowed) ? (
          <CustomToolTip
            position="right"
            tooltipContent={
              isSidebarWrapped ? (
                <div style={{ height: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{title}</div>
              ) : null
            }
            key={index}
          >
            {({ target }) => (
              <div
                onClick={() => {
                  onClose()
                  handleNavigate(link)
                }}
                className={'nav_items ' + (pathname.startsWith(link) ? 'active' : '') + (isSidebarWrapped ? ' nav_items_center' : '')}
                ref={target}
              >
                <div
                  className="w-5 mb-1"
                  style={
                    !isSidebarWrapped
                      ? {
                        width: 30,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }
                      : undefined
                  }
                >
                  <Component fill={pathname.startsWith(link) ? 'white' : color} />
                </div>
                {!isSidebarWrapped && <span className="ms-2">{title}</span>}
              </div>
            )}
          </CustomToolTip>
        ) : null
      )}
      <button onClick={() => setIsSidebarWrapped(!isSidebarWrapped)} className="sidebar-icon">
        <img src={isSidebarWrapped ? circleRightArrow : circleLeftArrow} alt="" />
      </button>
    </div>
  )
}

Sidebar.propTypes = {
  onClose: PropTypes.func,
  isSidebarWrapped: PropTypes.bool,
  setIsSidebarWrapped: PropTypes.func,
}

export default Sidebar
