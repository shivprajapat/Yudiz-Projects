import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import ResetPasswordForm from 'shared/components/reset-password-form'
import { allRoutes } from 'shared/constants/AllRoutes'

function ResetPassword() {
  const history = useHistory()
  const [token, setToken] = useState()
  const searchToken = new URLSearchParams(useLocation().search)

  useEffect(() => {
    if (searchToken.get('t')) {
      setToken(searchToken.get('t'))
    } else {
      history.push(allRoutes.forgotPassword)
    }
  }, [])

  return (
    <>
      {token && <ResetPasswordForm sToken={token} />}
    </>
  )
}

export default ResetPassword
