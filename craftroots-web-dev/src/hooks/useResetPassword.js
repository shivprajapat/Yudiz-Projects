import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import useAsync from './useAsync'
import { request } from '@/services/api.service'
import { ResetPassword } from '@/queries/authQueries'
import { allRoutes } from '@/constants/allRoutes'
import { numberRegex, trimString, uppercaseRegex } from '@/helper'
import { setToastDataAction } from '@/actions/toastAction'

const useResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm()
  const intl = useIntl()
  const resetPasswordResult = useAsync(null, null)
  const router = useRouter()
  const dispatch = useDispatch()
  const { token, email } = router.query

  const [passwordState, setPasswordState] = useState({
    char: false,
    lowerCase: false,
    uppercase: false,
    number: false,
  })

  const { char, lowerCase, uppercase, number } = passwordState
  const hasErrors = Object.keys(errors).length > 0
  const hasRequiredFieldError =
    hasErrors || char || uppercase || lowerCase || number

  const password = watch('newPassword', '')

  const handlePassword = (e) => {
    const passwordFieldValue = e.target.value
    const newState = {
      char: passwordFieldValue.length >= 8,
      lowerCase: passwordFieldValue.toUpperCase() !== passwordFieldValue,
      uppercase: uppercaseRegex.test(passwordFieldValue),
      number: numberRegex.test(passwordFieldValue),
    }
    setPasswordState(newState)
  }

  const validateConfirmPassword = (value) => {
    return value === password || 'Password and Confirm password must be same'
  }

  const onSubmit = (data) => {
    const isAllTrue = Object.values(passwordState).find((value) => !value)
    if (isAllTrue === undefined) {
      resetPasswordResult.run(request, {
        ...ResetPassword,
        variables: {
          email: trimString(email),
          newPassword: data.newPassword,
          resetPasswordToken: token,
        },
      })
    }
  }

  useEffect(() => {
    if (email) {
      setValue('email', email)
    }
  }, [email])

  useEffect(() => {
    if (resetPasswordResult?.state?.isSuccess) {
      const message = resetPasswordResult?.state?.data?.resetPassword?.message
      router.push(allRoutes.signIn)
      dispatch(setToastDataAction({ show: true, message }))
    }
  }, [resetPasswordResult?.state?.isSuccess])

  return {
    register,
    handleSubmit,
    errors,
    intl,
    onSubmit,
    resetPasswordResult,
    validateConfirmPassword,
    email,
    handlePassword,
    passwordState,
    hasRequiredFieldError,
  }
}

export default useResetPassword
