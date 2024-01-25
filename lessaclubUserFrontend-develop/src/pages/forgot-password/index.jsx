import React from 'react'

import Password from 'shared/components/password'
import { parseParams } from 'shared/utils'

const ForgotPassword = () => {
  const params = parseParams(window.location.search)

  return <Password forgotPassword={!params.token} forgotPasswordEmail={params.token} />
}

export default ForgotPassword
