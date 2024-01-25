import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
// import OTPForm from 'shared/components/otp-form'
import ResetPasswordForm from 'shared/components/reset-password-form'
import { route } from 'shared/constants/AllRoutes'

function ResetPassword() {
  const navigate = useNavigate()
  const { state } = useLocation()
  // const [formType, setFormType] = useState('OTP')

  useEffect(() => {
    if ((state && !state.sEmail) || !state) {
      navigate(route.forgotPassword)
    }
  }, [])

  // function handleChangeScreen() {
  //   setFormType('resetPassword')
  // }

  return (
    <>
      <ResetPasswordForm sEmail={state.sEmail} />
      {/* {state && formType === 'OTP' && <OTPForm sEmail={state.sEmail} onOtpSuccess={() => handleChangeScreen()} />}
      {state && formType === 'resetPassword' && <ResetPasswordForm sEmail={state.sEmail} />} */}
    </>
  )
}

export default ResetPassword
