import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { sidebarConfig } from './sidebarConfig'

export function Sidebar() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  function matchRoute(route) {
    return (pathname + search).includes(route) && pathname === route
  }
  function handleNavigate(link) {
    !matchRoute(link) && navigate(link)
  }
  return (
    <>
      <div className="sidebar">
        {sidebarConfig.map(({ link, Component, title, color }) => (
          <div key={link} onClick={() => handleNavigate(link)} className={'nav_items ' + (pathname.includes(link) ? 'active' : '')}>
            <div className="w-5 mb-1">
              <Component fill={pathname.includes(link) ? 'white' : color} />
            </div>
            <span className="ms-2">{title}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export default Sidebar
