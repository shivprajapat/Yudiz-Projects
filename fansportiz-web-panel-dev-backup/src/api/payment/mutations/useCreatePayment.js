import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from '../../../axios/instanceAxios'
import { setErrorFunc } from '../../../utils/helper'

export const CreatePayment = async ({ nAmount, sPromoCode, eType, ePlatform, sOrderCurrency }) => {
  return await axios.post('/payment/user/payment/create/v2', { nAmount, sPromoCode, eType, ePlatform, sOrderCurrency })
}

export default function useCreatePayment ({ setMessage, setAlert, userData }) {
  const navigate = useNavigate()
  const mutationData = useMutation({
    mutationKey: ['CreatePayment'],
    mutationFn: CreatePayment,
    select: response => response?.data?.data,
    onSuccess: (response) => {
      const paymentMethod = JSON.parse(response?.config?.data)
      const onSuccessResponse = response?.data?.data
      if (userData?.bIsInternalAccount) navigate('/profile')
      else {
        if (paymentMethod?.eType === 'CASHFREE') {
          const paymentSessionId = onSuccessResponse?.payment_session_id
          // eslint-disable-next-line no-undef
          const cashFree = new Cashfree(paymentSessionId)
          cashFree.redirect()
        } else if (paymentMethod?.eType === 'PAYTM') {
          async function onScriptLoad () {
            const config = {
              root: document.querySelector('.checkout-class'),
              flow: 'DEFAULT',
              data: {
                orderId: response?.data?.data?.iOrderId,
                token: response?.data?.data?.sPaytmToken,
                tokenType: 'TXN_TOKEN',
                amount: response?.data?.data?.nOrderAmount
              },
              handler: {
                notifyMerchant: function (eventName, data) {
                  console.warn('notifyMerchant handler function called')
                  console.warn('eventName => ', eventName)
                  // console.warn('data => ', data)
                }
              }
            }
            if (window?.Paytm?.CheckoutJS) {
              window.Paytm.CheckoutJS.init(config).then(function onSuccess () {
                window.Paytm.CheckoutJS.invoke()
              }).catch(function onError (error) {
                console.warn('error => ', error)
                setErrorFunc(error, setMessage, setAlert)
              })
            }
          }
          onScriptLoad()
        } else if (paymentMethod?.eType === 'STRIPE') {
          const checkoutPage = response?.data?.data?.url
          window.open(checkoutPage, '_self')
        } else if (paymentMethod?.eType === 'PAYPAL') {
          const checkoutPage = response?.data?.data?.sPayPalRedirectionUrl
          window.open(checkoutPage, '_self')
        }
      }
    },
    onError: (error) => {
      setErrorFunc(error, setMessage, setAlert)
    }
  })
  return { ...mutationData }
}
