import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  billingAction,
  getAllAddressLogin,
  setBillingAddress,
  setSameAddressAction,
  setShippingAddress,
} from '@/actions/cartAction'
import { constants } from '@/actions/type'
import { setToastDataAction } from '@/actions/toastAction'
import { DeleteAdress } from '@/queries/checkoutQueries'
import { request } from '@/services/api.service'
import { trimString } from '@/helper'

export default function useLoginAddress() {
  const billingRef = useRef()
  const { addresses, billingAddress, sameAddresses, loginAddressees } =
    useSelector((state) => state.cartReducer)
  const dispatch = useDispatch()
  const [index, setIndex] = useState()
  const [billingAddressChecked, setBillingAddressChecked] = useState()
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState()
  const [id, setId] = useState()
  const router = useRouter()

  useEffect(() => {
    setBillingAddressChecked(sameAddresses)
  }, [sameAddresses])

  // useEffect(() => {
  //   if (addressSaved) {
  //     router.push('/cart/payment', undefined, { shallow: true })
  //     dispatch(setBillingSaved(false))
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [addressSaved])

  useEffect(() => {
    if (loginAddressees?.length) {
      const result = loginAddressees.find((i) => i.id === addresses?.[0]?.id)
      setIndex(result?.id)
    }
  }, [loginAddressees, billingAddress, addresses])

  const addressHandler = () => {
    if (
      addresses?.[0]?.length ||
      addresses?.length === 0 ||
      (!sameAddresses &&
        (!billingAddress || Object.keys(billingAddress)?.length === 0))
    ) {
      dispatch(
        setToastDataAction({
          show: true,
          error: true,
          message: 'Please Select Shipping and Billing Address',
        })
      )
    } else {
      dispatch(setSameAddressAction(!!sameAddresses))
      router.push('/cart/payment', undefined, { shallow: true })
    }
  }

  const billingHandler = (isChecked) => {
    setBillingAddressChecked(isChecked)
    if (!isChecked) {
      dispatch(billingAction({}))
    }
    dispatch({ type: constants.SET_SAME_ADDRESS, sameAddresses: isChecked })
  }

  const onSubmitBillingAddress = async (data) => {
    const add = {
      firstname: trimString(data?.firstName),
      lastname: trimString(data?.lastName),
      street: [data?.address],
      city: trimString(data.city),
      region: { region_id: +data?.state?.value, label: data?.state?.label },
      postcode: trimString(data?.postalCode),
      country_code: data?.country?.value,
      telephone: trimString(data?.phone),
      save_in_address_book: false,
    }
    dispatch(billingAction(add))
  }

  // function scrollToDiv(ref) {
  //   // Ensure the ref is valid
  //   if (billingRef.current) {
  //     const scrollOffset = billingRef.current.offsetTop - window.innerHeight / 3
  //     window.scrollTo(0, billingRef.current.offsetTop - 200)
  //   }
  // }

  const billingChageHandler = (e, add, index) => {
    e.preventDefault()
    e.stopPropagation()
    if (add.id !== index) scrollToDiv(billingRef)
    const address = {
      customer_address_id: add.id,
      same_as_shipping: add.id === index,
    }
    dispatch(setBillingAddress(address))
  }

  const setAddress = async (address) => {
    try {
      const add = [{ customer_address_id: address?.id }]
      dispatch(setShippingAddress(add, sameAddresses))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteHandler = async () => {
    try {
      const result = await request({
        ...DeleteAdress,
        variables: {
          id: id,
        },
      })
      if (result) {
        dispatch(getAllAddressLogin())
        setIsShowDeleteModal(!isShowDeleteModal)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return {
    addressHandler,
    billingHandler,
    billingAddressChecked,
    onSubmitBillingAddress,
    billingChageHandler,
    billingRef,
    setAddress,
    setSelectedAddress,
    selectedAddress,
    index,
    deleteHandler,
    setId,
    setIsShowDeleteModal,
    isShowDeleteModal,
  }
}
