import React from 'react'
import './_breadCrumbs.scss'
import { Breadcrumb } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { checkObjectId } from 'helpers/helper'

export default function BreadCrumbs() {
  const location = useLocation()
  const navigate = useNavigate()

  const pathNames = location?.pathname?.split('/').filter((x) => x && !checkObjectId(x))

  function handleClick(i) {
    navigate('/' + pathNames.slice(0, i).join('/'))
  }

  return (
    <div>
      <Breadcrumb>
        {location?.pathname !== '/dashboard' && (
          <Breadcrumb.Item
            linkProps={{ className: 'text-decoration-none text-dark', style: { textTransform: 'capitalize' } }}
            onClick={() => navigate('/dashboard')}
          >
            home
          </Breadcrumb.Item>
        )}
        {pathNames.map((value, index) => {
          const last = index === pathNames.length - 1
          const to = location?.pathname?.split(value)[0]
          return last ? (
            <Breadcrumb.Item key={to} style={{ textTransform: 'capitalize' }} active>
              {value?.replace('-', ' ')}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item
              onClick={() => handleClick(index + 1)}
              linkProps={{ className: 'text-decoration-none text-dark', style: { textTransform: 'capitalize' } }}
              key={to}
            >
              {value?.replace('-', ' ')}
            </Breadcrumb.Item>
          )
        })}
      </Breadcrumb>
    </div>
  )
}
