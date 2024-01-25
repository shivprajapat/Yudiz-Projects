import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import useAsync from './useAsync'
import {
  OrderCancel,
  PlaceOrder,
  PlaceRazorpayOrder,
  SetPaymentMethodOnCart,
  SetRzpPaymentDetailsForOrder,
} from '@/queries'
import { request } from '@/services/api.service'
import {
  AVAILABLE_PAYMENT_METHODS,
  BRAND_NAME,
  STORAGE_KEYS,
} from '@/helper/constant'
import { createCart } from '@/helper/product-helper'
import { setToastDataAction } from '@/actions/toastAction'
import { allRoutes } from '@/constants/allRoutes'
import {
  addressLoader,
  miniCartData,
  setBillingAddress,
  setMiniCartData,
} from '@/actions/cartAction'
import {
  isLoggedIn,
  outOfStockStatusHandle,
  removeStoreCreditAction,
} from '@/helper'
import { StoreCreditData } from '@/queries/accountDetailQueries'
import { ApplyStoreCredit } from '@/queries/checkoutQueries'

export default function usePayment() {
  const {
    billingAddress,
    emailAddress,
    items,
    paymentMethods,
    sameAddresses,
    addresses,
    storeCreditAmount,
  } = useSelector((state) => state.cartReducer)
  const router = useRouter()
  const intl = useIntl()
  const setPaymentMethodOnCartData = useAsync(null, null)
  const [isPaymentProgress, setIsPaymentProgress] = useState({
    isOrderID: false,
    isPlaceRazorpayOrder: false,
    isPaymentComplete: false,
  })
  const [activePaymentMethod, setActivePaymentMethod] = useState(null)
  const [storeCreditData, setStoreCreditData] = useState({})
  const [credit, setCredit] = useState()
  const appliedCredits = useAsync(null, null)
  const removeCredits = useAsync(null, null)

  useEffect(() => {
    if (storeCreditAmount) {
      setCredit(storeCreditAmount)
    }
  }, [storeCreditAmount])

  const dispatch = useDispatch()
  const getOrderID = async () => {
    setIsPaymentProgress((prevState) => ({
      ...prevState,
      isOrderID: true,
    }))
    try {
      const response = await request({
        ...PlaceOrder,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
        },
      })
      const orderId = response?.placeOrder?.order?.order_number
      setIsPaymentProgress((prevState) => ({
        ...prevState,
        isOrderID: false,
      }))
      return orderId
    } catch (error) {
      console.error('Error while fetching order ID:', error)
      dispatch(addressLoader(false))
      setIsPaymentProgress((prevState) => ({
        ...prevState,
        isOrderID: false,
      }))
    }
  }
  const placeRazorpayOrder = async (orderId) => {
    setIsPaymentProgress((prevState) => ({
      ...prevState,
      isPlaceRazorpayOrder: true,
    }))
    try {
      const response = await request({
        ...PlaceRazorpayOrder,
        variables: {
          order_id: orderId,
          referrer: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
        },
      })
      setIsPaymentProgress((prevState) => ({
        ...prevState,
        isPlaceRazorpayOrder: false,
      }))
      return response.placeRazorpayOrder
    } catch (error) {
      console.error('Error while placing Razorpay order:', error)
      dispatch(addressLoader(false))
      setIsPaymentProgress((prevState) => ({
        ...prevState,
        isPlaceRazorpayOrder: false,
      }))
    }
  }

  /* const resetOrderId = async (orderId) => {
    try {
      const response = await request({
        ...ResetCart,
        variables: {
          order_id: orderId,
        },
      })
      return response
    } catch (error) {
      console.log('Error while resting order id:', error)
    }
  } */
  const handlePaymentSuccess = async (orderId, response) => {
    setIsPaymentProgress((prevState) => ({
      ...prevState,
      isPaymentComplete: true,
    }))
    try {
      await request({
        ...SetRzpPaymentDetailsForOrder,
        variables: {
          order_id: orderId,
          rzp_payment_id: response.razorpay_payment_id,
          rzp_signature: response.razorpay_signature,
        },
      })
      // await resetOrderId(orderId)

      setIsPaymentProgress((prevState) => ({
        ...prevState,
        isPaymentComplete: false,
      }))

      dispatch(
        setToastDataAction({
          show: true,
          message: intl.formatMessage({
            id: 'toast.razorpay.paymentSuccess',
          }),
        })
      )
      // onNext()
      localStorage.setItem(STORAGE_KEYS.canAccess, true)
      router.push(`${allRoutes.thankYou}?orderId=${orderId}`, undefined, {
        shallow: true,
      })
      localStorage.removeItem(STORAGE_KEYS.cartId)
      createCart(dispatch)

      dispatch(
        setMiniCartData({ items: [], totalItems: null, paymentMethods: [] })
      )
    } catch (error) {
      console.error('Error during payment success:', error)
      setIsPaymentProgress((prevState) => ({
        ...prevState,
        isPaymentComplete: false,
      }))
      localStorage.removeItem(STORAGE_KEYS.cartId)
      createCart(dispatch)

      dispatch(
        setMiniCartData({ items: [], totalItems: null, paymentMethods: [] })
      )
    }
  }
  const cancelOrder = async (orderId) => {
    try {
      await request({
        ...OrderCancel,
        variables: {
          id: orderId,
        },
      })
    } catch (error) {
      console.log('Error while order cancel', error)
    }
  }
  const handlePaymentFailure = async (orderId) => {
    setIsPaymentProgress({
      isOrderID: false,
      isPlaceRazorpayOrder: false,
      isPaymentComplete: false,
    })
    await cancelOrder(orderId)
    dispatch(
      setToastDataAction({
        show: true,
        message: intl.formatMessage({
          id: 'toast.razorpay.paymentFailed',
        }),
        error: true,
      })
    )
    localStorage.removeItem(STORAGE_KEYS.cartId)
    createCart(dispatch)
    dispatch(
      setMiniCartData({ items: [], totalItems: null, paymentMethods: [] })
    )
    localStorage.setItem(STORAGE_KEYS.canAccess, true)
    router.push(allRoutes.paymentFailed, undefined, { shallow: true })
  }

  const paymentCardData =
    paymentMethods?.length > 0
      ? paymentMethods?.map((payment) => ({
        id: payment.code,
        title: payment.title,
        htmlFor:
            payment.code.toLowerCase() === AVAILABLE_PAYMENT_METHODS.razorpay
              ? 'razorPay'
              : 'cod',
      }))
      : []

  const handleToggle = (code) => {
    setPaymentMethodOnCartData.run(request, {
      ...SetPaymentMethodOnCart,
      variables: {
        cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
        code,
      },
    })
  }

  async function paymentHandler() {
    if (
      activePaymentMethod?.toLowerCase() === AVAILABLE_PAYMENT_METHODS.razorpay
    ) {
      try {
        console.log('-----------inside try')
        const orderId = await getOrderID()
        console.log(
          '🚀 ~ file: usePayment.js:239 ~ paymentHandler ~ orderId:',
          orderId
        )
        if (orderId) {
          const placeRazorpayOrderResponse = await placeRazorpayOrder(orderId)
          console.log(
            '🚀 ~ file: usePayment.js:242 ~ paymentHandler ~ placeRazorpayOrderResponse:',
            placeRazorpayOrderResponse
          )
          if (placeRazorpayOrderResponse) {
            const options = {
              key: process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID,
              amount: placeRazorpayOrderResponse.amount,
              currency: 'INR',
              name: BRAND_NAME,
              // description: 'Some Description',
              order_id: placeRazorpayOrderResponse.rzp_order_id,
              config: {
                display: {
                  hide: [{ method: 'paylater' }, { method: 'emi' }],
                },
              },
              prefill: {
                //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                name: billingAddress?.firstname + ' ' + billingAddress.lastname, //your customer's name
                email: emailAddress,
                contact: `+91${billingAddress?.telephone}`, //Provide the customer's phone number for better conversion rates
              },
              modal: {
                ondismiss: async function () {
                  // await resetOrderId(orderId)
                  handlePaymentFailure(orderId)
                },
                confirm_close: true, // https://razorpay.com/docs/partners/aggregators/partner-auth/payment-gateway/
              },
              handler: (response) => handlePaymentSuccess(orderId, response),
              theme: {
                color: '#704E2A',
              },
            }
            console.log(
              '🚀 ~ file: usePayment.js:272 ~ paymentHandler ~ options:',
              options
            )

            const rzp1 = new window.Razorpay(options)
            rzp1.on('payment.failed', (response) => {
              console.log('response', response)
            })
            rzp1.open()
          } else {
            console.error(
              'No placeRazorpayOrderResponse was obtained from placeRazorpayOrder function'
            )
          }
        } else {
          console.error('No order ID was obtained from getOrderID function')
        }
      } catch (error) {
        console.error('Error during payment:', error)
      }
    } else {
      try {
        const orderId = await getOrderID()
        // await placeRazorpayOrder(orderId)
        // await resetOrderId(orderId)
        // onNext()
        if (orderId) {
          localStorage.removeItem(STORAGE_KEYS.cartId)
          createCart(dispatch)
          setIsPaymentProgress((prevState) => ({
            ...prevState,
            isPaymentComplete: true,
          }))
          dispatch(
            setToastDataAction({
              show: true,
              message: intl.formatMessage({
                id: 'toast.cod.orderSuccess',
              }),
            })
          )
          localStorage.setItem(STORAGE_KEYS.canAccess, true)
          router.push(`/thank-you?orderId=${orderId}`, undefined, {
            shallow: true,
          })
        } else {
          console.error('No order ID was obtained from getOrderID function')
        }
      } catch (error) {
        setIsPaymentProgress({
          isOrderID: false,
          isPlaceRazorpayOrder: false,
          isPaymentComplete: false,
        })
        console.error('Error during payment:', error)
        localStorage.removeItem(STORAGE_KEYS.cartId)
        createCart(dispatch)

        dispatch(
          setMiniCartData({
            items: [],
            totalItems: null,
            paymentMethods: [],
          })
        )
        dispatch(
          setMiniCartData({
            items: [],
            totalItems: null,
            paymentMethods: [],
          })
        )
        dispatch(
          setToastDataAction({
            show: true,
            message: intl.formatMessage({
              id: 'toast.cod.orderFailed',
            }),
            error: true,
          })
        )
      }
    }
  }

  useEffect(() => {
    if (setPaymentMethodOnCartData.state.isSuccess) {
      /* if (activePaymentMethod === setPaymentMethodOnCartData.state?.data?.selected_payment_method?.code) {
        setActivePaymentMethod(null)
      } else {
        setActivePaymentMethod(code)
      } */
      setActivePaymentMethod(
        setPaymentMethodOnCartData.state?.data?.setPaymentMethodOnCart?.cart
          ?.selected_payment_method?.code
      )
    }
  }, [setPaymentMethodOnCartData.state.isSuccess])

  const getStoredata = async () => {
    const result = await request({
      ...StoreCreditData,
    })
    setStoreCreditData(result?.customer?.storecredit_credit)
  }

  useEffect(() => {
    if (isLoggedIn()) {
      getStoredata()
    }
  }, [])

  useEffect(() => {
    let address
    if (sameAddresses && addresses?.[0]) {
      address = addresses?.[0]
    }
    //sameAddresses value can be a null so here we have to match absolute with boolean
    else if (sameAddresses === false) {
      if (!billingAddress) {
        router.push(allRoutes.address, undefined, { shallow: true })
      } else {
        address = billingAddress
      }
    }
    if (address) {
      dispatch(
        setBillingAddress({
          address: {
            firstname: address?.firstname,
            lastname: address?.lastname,
            street: [address?.street?.[0]],
            city: address?.city,
            region: address?.region?.region_id,
            postcode: address?.postalCode || address?.postcode,
            country_code: address?.country?.code || address?.country_code,
            telephone: address?.telephone,
          },
        })
      ).then(() => {
        dispatch(miniCartData())
      })
    }
  }, [sameAddresses])

  useEffect(() => {
    if (items?.length > 0) {
      outOfStockStatusHandle(items, dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  useEffect(() => {
    if (
      isPaymentProgress.isOrderID ||
      isPaymentProgress.isPlaceRazorpayOrder ||
      isPaymentProgress.isPaymentComplete
    ) {
      dispatch(addressLoader(true))
    }
  }, [isPaymentProgress])

  const creditHandler = () => {
    if (storeCreditAmount) {
      removeStoreCreditAction(removeCredits)
    } else if (credit) {
      appliedCredits.run(request, {
        ...ApplyStoreCredit,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
          amount: credit,
        },
      })
    }
  }

  useEffect(() => {
    if (appliedCredits?.state?.data?.applyStoreCreditToCart?.status) {
      dispatch(miniCartData())
    }
  }, [appliedCredits?.state?.data])

  useEffect(() => {
    if (removeCredits?.state?.isSuccess) {
      setCredit('')
      dispatch(miniCartData())
    }
  }, [removeCredits?.state?.isSuccess])

  return {
    isPaymentProgress,
    paymentHandler,
    paymentCardData,
    handleToggle,
    paymentCardData,
    activePaymentMethod,
    setPaymentMethodOnCartDataState: setPaymentMethodOnCartData.state,
    storeCreditData,
    credit,
    setCredit,
    creditHandler,
    appliedCredits,
  }
}
