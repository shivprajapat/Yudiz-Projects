import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import { getAssetDetails } from 'modules/assets/redux/service'
import { orderPayment, orderCreation, orderUpdate, getPendingOrder } from 'modules/checkout/redux/service'
import { getNetworkSymbol, scrollTop } from 'shared/utils'
import countries from 'shared/libs/country'
import { metaMaskBid } from 'modules/auction'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { paymentTransfer } from 'modules/metaMask'

const useCheckout = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const [formType, setFormType] = useState('paymentMode')
  const [formData, setFormData] = useState({})
  const [assetDetails, setAssetDetails] = useState()
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState()
  const [show, setShow] = useState(false)
  const [pendingOrders, setPendingOrders] = useState([])
  const [connectWallet, setConnectWallet] = useState(false)
  const [isForNewCard, setIsForNewCard] = useState(false)
  const [currentOrderId, setCurrentOrderId] = useState(false)
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1)

  const assetDetailStore = useSelector((state) => state.asset.assetDetails)
  const orderCreated = useSelector((state) => state.checkout.orderCreated)
  const orderUpdated = useSelector((state) => state.checkout.orderUpdated)
  const orderCreationStore = useSelector((state) => state.checkout.orderCreation)
  const orderUpdateStore = useSelector((state) => state.checkout.orderUpdate)
  const userStore = useSelector((state) => state.user.user)
  const orderPaymentStore = useSelector((state) => state.checkout.orderPayment)
  const pendingOrderStore = useSelector((state) => state.checkout.pendingOrder)
  const walletAccountStore = useSelector((state) => state.wallet)
  const exchangeRateStore = useSelector((state) => state.exchangeRate)

  useEffect(() => {
    if (assetDetails?.id) {
      dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(assetDetails?.blockchainNetwork || 'Ethereum') }))
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

  const paymentModeFormMethods = useForm({ mode: 'all', defaultValues: { paymentMode: 'Crypto Currency' } })
  const addressFormMethods = useForm({ mode: 'all' })
  const cardFormMethods = useForm({ mode: 'all' })
  const metaMaskFormMethods = useForm({ mode: 'all' })

  const paymentMode = paymentModeFormMethods.watch('paymentMode')
  const bidAmount = paymentModeFormMethods.watch('bidAmount')

  useEffect(() => {
    if (orderPaymentStore && ['fiat Currency', 'Crypto Currency'].includes(paymentMode)) {
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
      dispatch(getPendingOrder({ assetId: assetDetails?.assetId, userId: userData?.id, pendingOrder: true }))
    }
  }, [JSON.stringify(userData), JSON.stringify(assetDetails)])

  useEffect(() => {
    if (userStore && userStore.id) {
      setUserData(userStore)
    }
  }, [userStore])

  useEffect(() => {
    if (assetDetailStore) {
      setAssetDetails(assetDetailStore.assetOnSale)
    }
  }, [assetDetailStore])

  useEffect(() => {
    id && dispatch(getAssetDetails(id))
  }, [id])

  useEffect(() => {
    if (orderCreated) {
      setLoading(false)
      setFormType('address')
    }
  }, [orderCreated])

  useEffect(() => {
    if (orderUpdated) {
      setLoading(false)
      if (paymentMode === 'fiat Currency' && formType !== 'paymentMode') {
        setFormType('card')
      } else if (formType === 'paymentMode') {
        setFormType('address')
      }
    }
  }, [orderUpdated])

  const onMetaMaskFormSubmit = () => {
    setLoading(true)
    payWithMetaMask(walletAccountStore.account)
  }

  const onChangeSelectWallet = () => {
    setConnectWallet((prev) => !prev)
  }

  const changeStep = (type, data) => {
    setFormType(type)
    setFormData({ ...formData, ...data })
  }

  const onFirstStepSubmit = (data) => {
    const payload = { paymentCurrencyType: paymentMode, assetOnSaleId: id, walletAddress: data.walletAddress }
    if (data.bidAmount) payload.bidAmount = data.bidAmount
    if (data.blockchainNetwork) payload.blockchainNetwork = data.blockchainNetwork.value
    setLoading(true)
    if (formType === 'paymentMode') {
      if (pendingOrders.length) {
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
      addressFormMethods.reset({
        firstName: firstName,
        lastName: lastName,
        phone: phone,
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
    if (paymentMode === 'Crypto Currency') {
      setConnectWallet(true)
      setFormType('metaMask')
    }
    scrollTop()
  }

  const onPrevious = () => {
    if (formType === 'address') {
      setFormType('paymentMode')
    } else if (formType === 'card' && isForNewCard) {
      setIsForNewCard(!isForNewCard)
    } else if (formType === 'card' && !isForNewCard) {
      setFormType('address')
    } else if (formType === 'metaMask') {
      setFormType('address')
    }
    scrollTop()
  }

  const onCardSubmit = (data) => {
    setLoading(true)
    // TODO: dynamic card and phone number -- static for now
    const payload = {
      // cardNumber: data.cardNumber,
      // cvv: data.cvv,
      // expMonth: data.expMonth,
      // expYear: data.expYear,
      cardNumber: '4007400000000007',
      cvv: '123',
      expMonth: '01',
      expYear: '2020',
      paymentType: 'Fiat',
      description: 'Test Payment'
    }
    dispatch(orderPayment(currentOrderId, payload))
  }

  const getNetworkPrice = (price) => {
    return price * currencyMultiplier
  }

  const payWithMetaMask = async (connectedAccount) => {
    let result = null
    if (assetDetails.auctionId) {
      const amount = paymentModeFormMethods.watch('bidAmount')
      result = await metaMaskBid({
        connectedAccount,
        bidAmount: getNetworkPrice(amount),
        setLoading,
        assetDetails,
        dispatch
      })
    } else {
      result = await paymentTransfer({
        connectedAccount,
        sellingPrice: getNetworkPrice(assetDetails.sellingPrice),
        setLoading,
        assetDetails,
        dispatch
      })
    }

    if (result && result.status) {
      document.body.classList.remove('global-loader')
      dispatch(orderPayment(currentOrderId, { paymentType: 'MetaMask', metaMaskTransaction: result, walletAddress: connectedAccount }))
    }
  }

  return {
    formType,
    onPrevious,
    assetDetails,
    paymentMode,
    changeStep,
    onFirstStepSubmit,
    onCardSubmit,
    onSecondStepSubmit,
    loading,
    paymentModeFormMethods,
    addressFormMethods,
    cardFormMethods,
    show,
    connectWallet,
    onChangeSelectWallet,
    isForNewCard,
    setIsForNewCard,
    metaMaskFormMethods,
    onMetaMaskFormSubmit,
    getNetworkPrice,
    bidAmount
  }
}

export default useCheckout
