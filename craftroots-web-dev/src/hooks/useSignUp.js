import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import useAsync from './useAsync'
import { allRoutes } from '@/constants/allRoutes'
import { request } from '@/services/api.service'
import { setToastDataAction } from '@/actions/toastAction'
import { CreateCustomer } from '@/queries'
import { numberRegex, trimString, uppercaseRegex } from '@/helper'

const useSignUp = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const intl = useIntl()
  const signUpResult = useAsync(null, null)

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

  const password = watch('password', '')

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
      signUpResult.run(request, {
        ...CreateCustomer,
        variables: {
          firstname: trimString(data.firstname),
          lastname: trimString(data.lastname),
          mobilenumber: trimString(data.mobilenumber),
          email: trimString(data.email),
          password: data.password,
        },
      })
    }
  }

  useEffect(() => {
    if (signUpResult && signUpResult.state && signUpResult.state.data) {
      const signUpData = signUpResult.state.data

      if (Object.keys(signUpData).length) {
        const message = signUpData.createCustomer?.message
        router.push(allRoutes.signIn)
        dispatch(setToastDataAction({ show: true, message }))
      }
    }
  }, [signUpResult.state?.data?.createCustomer?.message])

  return {
    register,
    handleSubmit,
    errors,
    validateConfirmPassword,
    onSubmit,
    intl,
    signUpResult,
    handlePassword,
    passwordState,
    hasRequiredFieldError,
  }
}

export default useSignUp
