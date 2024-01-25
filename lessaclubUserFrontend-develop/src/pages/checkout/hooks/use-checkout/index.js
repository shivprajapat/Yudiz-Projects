import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getAssetDetails } from 'modules/assets/redux/service'
import {
  orderPayment,
  orderCreation,
  orderUpdate,
  getPendingOrder,
  checkStockAvailability,
  getReferralDiscount
} from 'modules/checkout/redux/service'
import { getNetworkSymbol, scrollTop } from 'shared/utils'
import countries from 'shared/data/countries'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { makeBid, NETWORKS, payoutTransaction } from 'modules/blockchainNetwork'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { getUser } from 'modules/user/redux/service'
import { getPaymentCards } from 'modules/paymentCard/redux/service'
import { getAddress } from 'modules/address/redux/service'
import { CLEAR_ORDER_CREATION_RESPONSE, CLEAR_ORDER_UPDATE_RESPONSE, CLEAR_PENDING_ORDER_RESPONSE, CLEAR_REFERRAL_DISCOUNT_RESPONSE, CLEAR_STOCK_AVAILABILITY_RESPONSE } from 'modules/checkout/redux/action'
import { getAllAdminGeneralSetting } from 'admin/modules/adminSettings/redux/service'

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
  const [currentOrder, setCurrentOrder] = useState(null)
  const [currencyMultiplier, setCurrencyMultiplier] = useState({})
  const [isStockAvailable, setIsStockAvailable] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [referralDiscount, setReferralDiscount] = useState(null)
  const [settings, setSettings] = useState(null)

  const paymentModeFormMethods = useForm({ mode: 'all', defaultValues: { paymentMode: 'Crypto Currency' } })
  const addressFormMethods = useForm({ mode: 'all' })
  const cardFormMethods = useForm({ mode: 'all' })
  const metaMaskFormMethods = useForm({ mode: 'all' })
  const nuuCoinFormMethods = useForm({ mode: 'all' })

  const paymentMode = paymentModeFormMethods.watch('paymentMode')
  const bidAmount = paymentModeFormMethods.watch('bidAmount')
  const blockchainNetworkEntered = paymentModeFormMethods.watch('blockchainNetwork')
  const blockchainNetwork = blockchainNetworkEntered?.value || assetDetails?.asset?.blockchainNetwork

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
  const stockAvailability = useSelector((state) => state.checkout.stockAvailability)
  const paymentCardList = useSelector((state) => state.paymentCards.paymentCardList)
  const getAddressStore = useSelector((state) => state.address.getAddress)
  const referralDiscountData = useSelector((state) => state.checkout.referralDiscount)
  const adminSettings = useSelector((state) => state.adminSettings?.singleAdminGeneralSettings?.setting)

  const isAuction = !!assetDetails?.auctionId
  const assetGbpPrice = isAuction ? assetDetails?.auction?.nextBid : assetDetails?.sellingPrice
  const payoutToCreator = Number((assetGbpPrice * (assetDetails?.asset.royaltyPercentage / 100)).toFixed(2))
  const payoutToSeller = Number((assetGbpPrice - payoutToCreator).toFixed(2))

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

  useEffect(() => {
    if (userId) {
      dispatch(getUser(userId))
    }
    dispatch(getAllAdminGeneralSetting())
    // clear all checkout states on unmount
    return () => {
      dispatch({ type: CLEAR_STOCK_AVAILABILITY_RESPONSE })
      dispatch({ type: CLEAR_ORDER_UPDATE_RESPONSE })
      dispatch({ type: CLEAR_ORDER_CREATION_RESPONSE })
      dispatch({ type: CLEAR_PENDING_ORDER_RESPONSE })
      dispatch({ type: CLEAR_REFERRAL_DISCOUNT_RESPONSE })
    }
  }, [])

  useEffect(() => {
    if (adminSettings && adminSettings.length !== 0) {
      setSettings(adminSettings[0])
    }
  }, [adminSettings])

  useEffect(() => {
    if (assetDetails?.id) {
      dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(blockchainNetwork) }))
      if (!assetDetails?.blockchainNetwork) {
        dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(NETWORKS.POLYGON) }))
      }
    }
    if (assetDetails?.asset?.isPhysical) {
      dispatch(getAddress({ userId: userId }))
    }
  }, [assetDetails])

  useEffect(() => {
    if (exchangeRateStore?.exchangeRateData?.exchangeRate) {
      const rateObj = exchangeRateStore?.exchangeRateData?.exchangeRate[0]
      if (rateObj) {
        const rate = rateObj.exchangeRate
        const convertSymbol = rateObj.convertSymbol
        setCurrencyMultiplier((prev) => {
          const newCurrencyMultiplier = prev
          newCurrencyMultiplier[convertSymbol] = rate
          return newCurrencyMultiplier
        })
      }
    }
  }, [exchangeRateStore])

  useEffect(() => {
    if (orderCreationStore && orderCreationStore.order && orderCreationStore.order.id) {
      setCurrentOrderId(orderCreationStore.order.id)
      setCurrentOrder(orderCreationStore.order)
      dispatch(getAssetDetails(id, { wishlistByLoggedInUser: false }))
    }
    if (orderUpdateStore && orderUpdateStore.order && orderUpdateStore.order.length) {
      setCurrentOrderId(orderUpdateStore.order[0].id)
      setCurrentOrder(orderUpdateStore.order[0])
      dispatch(getAssetDetails(id, { wishlistByLoggedInUser: false }))
    }
  }, [orderCreationStore, orderUpdateStore])

  useEffect(() => {
    if (orderPaymentStore && ['fiat Currency', 'Crypto Currency', 'Nuu coin'].includes(paymentMode)) {
      setShow(true)
    }
  }, [orderPaymentStore])

  useEffect(() => {
    if (pendingOrderStore?.order && pendingOrderStore?.order?.length) {
      setPendingOrders(pendingOrderStore.order)
      setCurrentOrderId(pendingOrderStore.order[0].id)
      setCurrentOrder(pendingOrderStore.order[0])
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
    if (userStore && userStore.id) {
      dispatch(getReferralDiscount(id, { type: 'asset' }))
    }
  }, [userStore])

  useEffect(() => {
    if (referralDiscountData) {
      setReferralDiscount(referralDiscountData?.referral || {})
    }
  }, [referralDiscountData])

  useEffect(() => {
    id && dispatch(getAssetDetails(id, { wishlistByLoggedInUser: true }))
  }, [id])

  useEffect(() => {
    if (orderCreated) {
      setLoading(false)
      // show address form only for physical asset
      if (assetDetails?.asset?.isPhysical) {
        setFormType('address')
      } else {
        if (paymentMode === 'fiat Currency') {
          setFormType('card')
        } else if (paymentMode === 'Nuu coin') {
          setFormType('nuuCoin')
        } else {
          setConnectWallet(true)
          setFormType('metaMask')
        }
      }
    }
  }, [orderCreated])

  useEffect(() => {
    if (stockAvailability && stockAvailability.assets) {
      const isAvailable =
        !assetDetails?.isSold && (stockAvailability.assets.availableStock > 0 || parseInt(assetDetails?.stockAvailableOrderId) === parseInt(currentOrderId))
      if (isAvailable) {
        dispatch(getAssetDetails(id, { wishlistByLoggedInUser: false }))
        if (assetDetails && !assetDetails.isExpired) {
          setIsStockAvailable(true)
          if (paymentMode === 'fiat Currency') {
            onCardSubmit()
          } else if (paymentMode === 'Nuu coin') {
            onNuuCoinFormSubmit()
          } else if (paymentMode === 'Crypto Currency') {
            onMetaMaskFormSubmit()
          }
        } else {
          setIsStockAvailable(false)
          dispatch({
            type: SHOW_TOAST,
            payload: {
              message: 'Out of stock',
              type: TOAST_TYPE.Error
            }
          })
          setLoading(false)
        }
      } else {
        setIsStockAvailable(false)
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
  }, [stockAvailability])

  useEffect(() => {
    if (orderUpdated) {
      setLoading(false)
      if (formType === 'paymentMode') {
        if (assetDetails?.asset?.isPhysical) {
          setFormType('address')
        } else {
          if (paymentMode === 'fiat Currency') {
            setFormType('card')
          } else if (paymentMode === 'Nuu coin') {
            setFormType('nuuCoin')
          } else {
            setConnectWallet(true)
            setFormType('metaMask')
          }
        }
      } else {
        if (paymentMode === 'fiat Currency') {
          setFormType('card')
        } else if (paymentMode === 'Nuu coin') {
          setFormType('nuuCoin')
        }
      }
    }
  }, [orderUpdated])

  useEffect(() => {
    if (formType === 'card') {
      dispatch(getPaymentCards({ userId, status: 'complete' }))
    }
  }, [formType])

  const onCardSelect = (event) => {
    setSelectedCard(parseInt(event.target.value))
  }

  const onMetaMaskFormSubmit = () => {
    setLoading(true)
    const isAvailable =
      !assetDetails.isExpired &&
      !assetDetails?.isSold &&
      ((stockAvailability && stockAvailability.assets && stockAvailability.assets.availableStock > 0) ||
      parseInt(assetDetails?.stockAvailableOrderId) === parseInt(currentOrderId))
    if (isAvailable) {
      payWithCrypto(walletAccountStore)
    } else if (isStockAvailable === null) {
      if (assetDetails?.asset?.id) {
        dispatch(checkStockAvailability(assetDetails?.asset?.id))
        dispatch(getAssetDetails(id, { wishlistByLoggedInUser: false }))
      }
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
    dispatch(orderUpdate(currentOrderId || id, { ...payload, isAddress: true }))
    dispatch(getAssetDetails(id, { wishlistByLoggedInUser: true }))
    setCurrentOrderId(currentOrderId)
    if (paymentMode === 'Crypto Currency') {
      setConnectWallet(true)
      setFormType('metaMask')
    }
    scrollTop()
  }

  const onPrevious = () => {
    if (formType === 'address') {
      setFormType('paymentMode')
    } else if (formType === 'paymentMode') {
      navigate(-1)
    } else {
      if (assetDetails?.asset?.isPhysical) {
        setFormType('address')
      } else {
        setFormType('paymentMode')
      }
    }
    scrollTop()
  }

  const onCardSubmit = (data) => {
    setLoading(true)
    const isAvailable =
      !assetDetails?.isExpired &&
      !assetDetails?.isSold &&
      ((stockAvailability && stockAvailability.assets && stockAvailability.assets.availableStock > 0) ||
        assetDetails?.stockAvailableOrderId === currentOrderId)
    if (isAvailable) {
      if (selectedCard) {
        const payload = {
          paymentCardId: selectedCard,
          paymentType: 'Fiat'
        }
        dispatch(
          orderPayment(currentOrderId, payload, () => {
            setLoading(false)
          })
        )
      }
    } else if (isStockAvailable === null) {
      if (assetDetails?.asset?.id) {
        dispatch(checkStockAvailability(assetDetails?.asset?.id))
        dispatch(getAssetDetails(id, { wishlistByLoggedInUser: false }))
      }
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

  const onNuuCoinFormSubmit = () => {
    setLoading(true)
    const isAvailable =
      !assetDetails?.isExpired &&
      !assetDetails?.isSold &&
      ((stockAvailability && stockAvailability.assets && stockAvailability.assets.availableStock > 0) ||
        assetDetails?.stockAvailableOrderId === currentOrderId)
    if (isAvailable) {
      const payload = {
        paymentType: 'Nuu coin'
      }
      dispatch(
        orderPayment(currentOrderId, payload, () => {
          setLoading(false)
        })
      )
    } else if (isStockAvailable === null) {
      if (assetDetails?.asset?.id) {
        dispatch(checkStockAvailability(assetDetails?.asset?.id))
        dispatch(getAssetDetails(id, { wishlistByLoggedInUser: false }))
      }
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

  const getNetworkPrice = (price, symbol = 'ETH') => {
    return price * currencyMultiplier[symbol]
  }

  const payWithCrypto = async (walletAccountStore) => {
    const { account } = walletAccountStore
    let result = null
    if (assetDetails.auctionId) {
      document.body.classList.add('global-loader')
      const amount = paymentModeFormMethods.watch('bidAmount')
      const blockchainNetwork = assetDetails?.asset?.blockchainNetwork
      result = await makeBid({
        blockchainNetwork: blockchainNetwork,
        walletAccountStore,
        connectedAccount: account,
        bidAmount: getNetworkPrice(amount, getNetworkSymbol(blockchainNetwork)),
        setLoading,
        assetDetails,
        dispatch
      })
      document.body.classList.remove('global-loader')
    } else {
      document.body.classList.add('global-loader')
      const blockchainNetworkEntered = paymentModeFormMethods.watch('blockchainNetwork')
      const blockchainNetwork = blockchainNetworkEntered?.value || assetDetails?.asset?.blockchainNetwork
      result = await payoutTransaction({
        blockchainNetwork: blockchainNetwork,
        walletAccountStore,
        connectedAccount: account,
        amountValue: getNetworkPrice(assetDetails.sellingPrice, getNetworkSymbol(blockchainNetwork)),
        setLoading,
        assetDetails,
        dispatch,
        order: currentOrder,
        asset: assetDetails?.asset,
        getNetworkPrice,
        getNetworkSymbol,
        settings
      })
      document.body.classList.add('global-loader')
    }

    if (result && result.status) {
      document.body.classList.remove('global-loader')
      dispatch(orderPayment(currentOrderId, { paymentType: 'MetaMask', metaMaskTransaction: result, walletAddress: account }))
    } else {
      document.body.classList.remove('global-loader')
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
    metaMaskFormMethods,
    onMetaMaskFormSubmit,
    getNetworkPrice,
    bidAmount,
    nuuCoinFormMethods,
    onNuuCoinFormSubmit,
    userData,
    paymentCardList,
    onCardSelect,
    selectedCard,
    isAuction,
    payoutToCreator,
    payoutToSeller,
    referralDiscount
  }
}

export default useCheckout
