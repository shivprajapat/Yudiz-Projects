import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { orderPayment, orderCreation, orderUpdate, getPendingOrder, getReferralDiscount } from 'modules/checkout/redux/service'
import { getNetworkSymbol, scrollTop } from 'shared/utils'
import countries from 'shared/data/countries'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { getUser } from 'modules/user/redux/service'
import { getPaymentCards } from 'modules/paymentCard/redux/service'
import { getMysteryBoxDetails } from 'modules/crates/redux/service'
import { CLEAR_ORDER_CREATION_RESPONSE, CLEAR_ORDER_UPDATE_RESPONSE, CLEAR_PENDING_ORDER_RESPONSE, CLEAR_REFERRAL_DISCOUNT_RESPONSE, CLEAR_STOCK_AVAILABILITY_RESPONSE } from 'modules/checkout/redux/action'
import { getAddress } from 'modules/address/redux/service'

const useCheckout = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId')

  const [formType, setFormType] = useState('paymentMode')
  const [formData, setFormData] = useState({})
  const [assetDetails, setAssetDetails] = useState()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState()
  const [show, setShow] = useState(false)
  const [pendingOrders, setPendingOrders] = useState([])
  const [connectWallet, setConnectWallet] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState(false)
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1)
  const [selectedCard, setSelectedCard] = useState(null)
  const [referralDiscount, setReferralDiscount] = useState(null)

  const mysteryBoxDetailStore = useSelector((state) => state.crates.mysteryBoxDetails)
  const orderCreated = useSelector((state) => state.checkout.orderCreated)
  const orderUpdated = useSelector((state) => state.checkout.orderUpdated)
  const orderCreationStore = useSelector((state) => state.checkout.orderCreation)
  const orderUpdateStore = useSelector((state) => state.checkout.orderUpdate)
  const userStore = useSelector((state) => state.user.user)
  const orderPaymentStore = useSelector((state) => state.checkout.orderPayment)
  const pendingOrderStore = useSelector((state) => state.checkout.pendingOrder)
  const exchangeRateStore = useSelector((state) => state.exchangeRate)
  const paymentCardList = useSelector((state) => state.paymentCards.paymentCardList)
  const referralDiscountData = useSelector((state) => state.checkout.referralDiscount)
  const getAddressStore = useSelector((state) => state.address.getAddress)

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId))
    }
    return () => {
      dispatch({ type: CLEAR_STOCK_AVAILABILITY_RESPONSE })
      dispatch({ type: CLEAR_ORDER_UPDATE_RESPONSE })
      dispatch({ type: CLEAR_ORDER_CREATION_RESPONSE })
      dispatch({ type: CLEAR_PENDING_ORDER_RESPONSE })
      dispatch({ type: CLEAR_REFERRAL_DISCOUNT_RESPONSE })
    }
  }, [])

  useEffect(() => {
    if (assetDetails?.id) {
      dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(assetDetails?.blockchainNetwork || 'Ethereum') }))
    }
    if (assetDetails?.isPhysical) {
      dispatch(getAddress({ userId: userId }))
    }
  }, [assetDetails])

  useEffect(() => {
    if (exchangeRateStore?.exchangeRateData?.exchangeRate) {
      setCurrencyMultiplier(exchangeRateStore?.exchangeRateData?.exchangeRate[0]?.exchangeRate)
    }
  }, [exchangeRateStore])

  useEffect(() => {
    if (orderCreationStore && orderCreationStore.order && orderCreationStore.order.id) {
      setCurrentOrderId(orderCreationStore.order.id)
    }
    if (orderUpdateStore && orderUpdateStore.order && orderUpdateStore.order.length) {
      setCurrentOrderId(orderUpdateStore.order[0].id)
    }
  }, [orderCreationStore, orderUpdateStore])

  const paymentModeFormMethods = useForm({ mode: 'all', defaultValues: { paymentMode: 'Nuu coin' } })
  const addressFormMethods = useForm({ mode: 'all' })
  const cardFormMethods = useForm({ mode: 'all' })
  const metaMaskFormMethods = useForm({ mode: 'all' })
  const nuuCoinFormMethods = useForm({ mode: 'all' })

  const paymentMode = paymentModeFormMethods.watch('paymentMode')

  useEffect(() => {
    if (orderPaymentStore && ['Nuu coin'].includes(paymentMode)) {
      setShow(true)
    }
  }, [orderPaymentStore])

  useEffect(() => {
    if (pendingOrderStore?.order && pendingOrderStore?.order?.length) {
      setPendingOrders(pendingOrderStore.order)
      setCurrentOrderId(pendingOrderStore.order[0].id)
    }
  }, [pendingOrderStore])

  useEffect(() => {
    if (userData && assetDetails) {
      addressFormMethods.setValue('email', userData?.email)
      dispatch(getPendingOrder({ mysteryBoxId: assetDetails?.id, userId: userData?.id, pendingOrder: true }))
    }
  }, [JSON.stringify(userData), JSON.stringify(assetDetails)])

  useEffect(() => {
    if (userStore && userStore.id) {
      setUserData(userStore)
    }
  }, [userStore])

  useEffect(() => {
    if (mysteryBoxDetailStore) {
      setAssetDetails(mysteryBoxDetailStore?.mysteryBox)
    }
  }, [mysteryBoxDetailStore])

  useEffect(() => {
    id && dispatch(getMysteryBoxDetails(id))
  }, [id])

  useEffect(() => {
    if (orderCreated) {
      setLoading(false)
      assetDetails?.isPhysical ? setFormType('address') : setFormType('nuuCoin')
    }
  }, [orderCreated])

  useEffect(() => {
    if (orderUpdated) {
      setLoading(false)
      if (formType !== 'paymentMode') {
        setFormType('nuuCoin')
      } else {
        assetDetails?.isPhysical ? setFormType('address') : setFormType('nuuCoin')
      }
    }
  }, [orderUpdated])

  useEffect(() => {
    if (formType === 'card') {
      dispatch(getPaymentCards({ userId, status: 'complete' }))
    }
  }, [formType])

  useEffect(() => {
    setShow(false)
    setFormType('paymentMode')
  }, [])

  useEffect(() => {
    if (userStore && userStore.id) {
      dispatch(getReferralDiscount(id, { type: 'mysteryBox' }))
    }
  }, [userStore])

  useEffect(() => {
    if (referralDiscountData) {
      setReferralDiscount(referralDiscountData?.referral || {})
    }
  }, [referralDiscountData])
  // prepopulate address if address is present
  useEffect(() => {
    if (getAddressStore?.addresses && getAddressStore?.addresses[0]) {
      const { firstName, lastName, phone, email, city, state, houseNumber, streetName, pinCode, country } = getAddressStore?.addresses[0]
      const phoneNumber = phone?.split('/')[0]
      addressFormMethods.reset({
        firstName: firstName,
        lastName: lastName,
        phone: phoneNumber?.includes('+') ? phoneNumber : `+${phoneNumber}`,
        email: email,
        city: city,
        state: state,
        houseNumber: houseNumber,
        streetName: streetName,
        pinCode: pinCode,
        country: countries.filter((singleCountry) => singleCountry?.label === country)[0]
      })
    }
  }, [getAddressStore])

  const onCardSelect = (event) => {
    setSelectedCard(parseInt(event.target.value))
  }

  const onChangeSelectWallet = () => {
    setConnectWallet((prev) => !prev)
  }

  const changeStep = (type, data) => {
    setFormType(type)
    setFormData({ ...formData, ...data })
  }

  const onFirstStepSubmit = (data) => {
    const payload = {
      paymentCurrencyType: paymentMode,
      mysteryBoxId: id,
      walletAddress: data.walletAddress,
      blockchainNetwork: data.blockchainNetwork?.value || assetDetails?.blockchainNetwork,
      orderType: 1,
      createdBy: assetDetails?.createdBy
    }

    setLoading(true)
    if (formType === 'paymentMode') {
      if (pendingOrders.length || currentOrderId) {
        dispatch(orderUpdate(currentOrderId || id, payload))
        setSavedAddressFormValues()
      } else {
        dispatch(orderCreation(payload))
      }
    }
    scrollTop()
  }

  const setSavedAddressFormValues = () => {
    if (pendingOrders && pendingOrders.length && pendingOrders[0].firstName) {
      const { firstName, lastName, phone, email, city, state, houseNumber, streetName, pinCode, country } = pendingOrders[0]
      const phoneNumber = phone.split('/')[0]
      addressFormMethods.reset({
        firstName: firstName,
        lastName: lastName,
        phone: phoneNumber.includes('+') ? phoneNumber : `+${phoneNumber}`,
        email: email,
        city: city,
        state: state,
        houseNumber: houseNumber,
        streetName: streetName,
        pinCode: pinCode,
        country: countries.filter((singleCountry) => singleCountry.label === country)[0]
      })
    }
  }

  const onSecondStepSubmit = (data) => {
    const phoneNumber = data.phone.split('/')[0]
    const payload = {
      ...data,
      phone: phoneNumber.includes('+') ? phoneNumber : `+${phoneNumber}`,
      country: data.country.label,
      countryCode: data.country.value
    }

    setLoading(true)
    dispatch(orderUpdate(currentOrderId, { ...payload, isAddress: true }))
    dispatch(getMysteryBoxDetails(id))
    setCurrentOrderId(currentOrderId)
    scrollTop()
  }

  const onPrevious = () => {
    if (formType === 'address') {
      setFormType('paymentMode')
    } else if (formType === 'metaMask') {
      setFormType('address')
    } else if (formType === 'nuuCoin') {
      assetDetails?.isPhysical ? setFormType('address') : setFormType('paymentMode')
    } else if (formType === 'paymentMode') {
      navigate(-1)
    }
    scrollTop()
  }

  const onNuuCoinFormSubmit = () => {
    setLoading(true)
    const isAvailable = !assetDetails?.isSold || assetDetails?.stockAvailableOrderId === currentOrderId

    if (isAvailable) {
      const payload = {
        paymentType: 'Nuu coin',
        isAddress: !!assetDetails?.isPhysical
      }
      dispatch(
        orderPayment(currentOrderId, payload, () => {
          setLoading(false)
        })
      )
    } else {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Out of stock',
          type: TOAST_TYPE.Error
        }
      })
      setLoading(false)
    }
  }

  const getNetworkPrice = (price) => {
    return price * currencyMultiplier
  }

  return {
    formType,
    setFormType,
    onPrevious,
    assetDetails,
    paymentMode,
    changeStep,
    onFirstStepSubmit,
    onSecondStepSubmit,
    loading,
    paymentModeFormMethods,
    addressFormMethods,
    cardFormMethods,
    show,
    setShow,
    connectWallet,
    onChangeSelectWallet,
    metaMaskFormMethods,
    getNetworkPrice,
    nuuCoinFormMethods,
    onNuuCoinFormSubmit,
    userData,
    paymentCardList,
    onCardSelect,
    selectedCard,
    referralDiscount
  }
}

export default useCheckout
