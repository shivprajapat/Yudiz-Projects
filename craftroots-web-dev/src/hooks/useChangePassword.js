import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import useAsync from './useAsync'
import { ChangeUserPassword } from '@/queries/accountDetailQueries'
import { request } from '@/services/api.service'
import { numberRegex, uppercaseRegex } from '@/helper'
import { setToastDataAction } from '@/actions/toastAction'

const useChangePassword = () => {
  const intl = useIntl()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm()

  const changePasswordResult = useAsync(null, null)

  const [passwordState, setPasswordState] = useState({
    char: false,
    lowerCase: false,
    uppercase: false,
    number: false,
  })
  const accountdetails = useSelector(
    (state) => state.accountReducer.accountData.customer
  )
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
      changePasswordResult.run(request, {
        ...ChangeUserPassword,
        variables: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
      })
    }
  }
  useEffect(() => {
    if (changePasswordResult?.state?.isSuccess) {
      const message =
        changePasswordResult?.state?.data?.changeCustomerPassword?.message
      dispatch(setToastDataAction({ show: true, message }))
      reset()
    }
  }, [changePasswordResult?.state?.isSuccess])

  return {
    register,
    handleSubmit,
    errors,
    intl,
    onSubmit,
    changePasswordResult,
    validateConfirmPassword,
    handlePassword,
    passwordState,
    hasRequiredFieldError,
    accountdetails,
  }
}

export default useChangePassword
