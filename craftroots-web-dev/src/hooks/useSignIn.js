import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import useAsync from './useAsync'
import { request } from '@/services/api.service'
import { MergeCart } from '@/queries/homePageQueries'
import { MutationSignIn } from '@/queries'
import { SOMETHING_WENT_WRONG, STORAGE_KEYS } from '@/helper/constant'
import { customerCart, isLoggedIn, setCookie, trimString } from '@/helper'
import { allRoutes } from '@/constants/allRoutes'
import { logoutHandler } from '@/helper/account-helper'
import { setToastDataAction } from '@/actions/toastAction'

const useSignIn = ({ fromCheckout }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ mode: 'onChange' })
  const intl = useIntl()
  const signInResult = useAsync(null, null)
  const router = useRouter()
  const [emptycartId, setEmptycartId] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoggedIn() && emptycartId) {
      async function mergeCart() {
        try {
          const mergeResult = await request({
            ...MergeCart,
            variables: {
              source_cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
              destination_cart_id: emptycartId,
            },
          })
          localStorage.setItem(STORAGE_KEYS.cartId, mergeResult?.mergeCarts?.id)
          setTimeout(() => {
            if (fromCheckout) {
              window.location.href = window.location.origin + allRoutes.address
              // router.push(allRoutes.address)
              // dispatch(miniCartData())
            } else {
              window.location.href = window.location.origin
              // router.push(allRoutes.home)
              // dispatch(miniCartData())
            }
          }, 200)
        } catch (error) {
          console.log('error', error)
          logoutHandler(dispatch, router)
          dispatch(
            setToastDataAction({
              show: true,
              message: SOMETHING_WENT_WRONG,
              error: true,
            })
          )
        }
      }
      mergeCart()
    }
  }, [isLoggedIn(), emptycartId])

  const errorMessage = signInResult.state.error.message
  const errorValidationMsg = 'This account is not confirmed.'

  const onSubmit = (data) => {
    try {
      signInResult.run(request, {
        ...MutationSignIn,
        variables: { email: trimString(data.email), password: data.password },
      })
    } catch (error) {}
  }
  const CreateEmptyCart = async () => {
    try {
      const destinationId = await customerCart()
      setEmptycartId(destinationId)
    } catch (error) {
      console.log('error CreateEmptyCart', error)
    }
  }
  useEffect(() => {
    if (signInResult?.state.isSuccess) {
      const token = signInResult?.state?.data?.generateCustomerToken?.token
      setCookie(STORAGE_KEYS.token, token)
      CreateEmptyCart()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInResult.state.isSuccess])

  return {
    register,
    handleSubmit,
    errors,
    intl,
    onSubmit,
    signInResult,
    errorMessage,
    errorValidationMsg,
    setValue,
    loading: signInResult.state.isLoading,
  }
}

export default useSignIn
