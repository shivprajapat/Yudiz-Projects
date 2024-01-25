import React, { useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Password from 'shared/components/password'
import { parseParams } from 'shared/utils'
import { allRoutes } from 'shared/constants/allRoutes'

const SetPassword = () => {
  const navigate = useNavigate()
  const params = parseParams(window.location.search)

  useLayoutEffect(() => {
    if (!params.token) {
      navigate(allRoutes.home, { replace: true })
    }
  }, [])

  return <Password setPassword />
}

export default SetPassword
