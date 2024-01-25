import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'
import { setToastDataAction } from '@/actions/toastAction'
import { setSameAddressAction } from '@/actions/cartAction'

export default function useGuestAddress() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const { addresses, emailAddress, billingAddress, sameAddresses } =
    useSelector((state) => state.cartReducer)

  useEffect(() => {
    if (emailAddress) {
      setEmail(emailAddress)
    }
  }, [emailAddress])

  // useEffect(() => {
  //   if (addressSaved) {
  //     router.push('/cart/payment', undefined, { shallow: true })
  //     dispatch(setBillingSaved(false))
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [addressSaved])

  const addressHandler = () => {
    if (
      addresses?.length === 0 ||
      (!sameAddresses &&
        (!billingAddress || Object.keys(billingAddress)?.length === 0))
    ) {
      dispatch(
        setToastDataAction({
          show: true,
          error: true,
          message: <FormattedMessage id="page.checkout.addressFill.error" />,
        })
      )
    } else {
      dispatch(setSameAddressAction(!!sameAddresses))
      router.push('/cart/payment', undefined, { shallow: true })
    }
  }

  return {
    email,
    setEmail,
    addressHandler,
  }
}
