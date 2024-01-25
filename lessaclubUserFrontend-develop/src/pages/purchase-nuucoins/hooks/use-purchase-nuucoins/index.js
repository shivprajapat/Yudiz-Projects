import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { allRoutes } from 'shared/constants/allRoutes'
import { getNetworkSymbol, scrollTop } from 'shared/utils'
import { nuuCoinPurchaseCreate, nuuCoinPurchaseUsingCard, getNuuCoinsDetails } from 'modules/nuuCoins/redux/service'
import { getPaymentCards } from 'modules/paymentCard/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { NETWORKS, CHAIN_ID, paymentTransfer } from 'modules/blockchainNetwork'

const usePurchaseNuuCoins = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state: locationState } = useLocation()
  const userId = localStorage.getItem('userId')
  const nuuCoinPurchaseData = locationState?.nuuCoinPurchaseData

  const [formType, setFormType] = useState('paymentMode')
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)
  const [isForNewCard, setIsForNewCard] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [currencyMultiplier, setCurrencyMultiplier] = useState({})
  const [networkCurrencies, setNetworkCurrencies] = useState({})
  const [isStockAvailable, setIsStockAvailable] = useState(null)

  const nuuCoinsStore = useSelector((state) => state.nuuCoins)
  const nuuCoinPurchaseCreateStore = useSelector((state) => state.nuuCoins.nuuCoinsPurchaseCreate)
  const resError = useSelector((state) => state.nuuCoins.error)
  const paymentCardList = useSelector((state) => state.paymentCards.paymentCardList)
  const walletAccountStore = useSelector((state) => state.wallet)
  const exchangeRateStore = useSelector((state) => state.exchangeRate)

  const paymentModeFormMethods = useForm({ mode: 'all', defaultValues: { paymentMode: 'Crypto Currency' } })
  const cardFormMethods = useForm({ mode: 'all' })
  const metaMaskFormMethods = useForm({ mode: 'all' })

  const paymentMode = paymentModeFormMethods.watch('paymentMode')

  const stockAvailability = nuuCoinsStore?.nuuCoinsDetails?.nuuCoin[0] && nuuCoinsStore?.nuuCoinsDetails?.nuuCoin[0].coinCount > 0

  useEffect(() => {
    if (!nuuCoinPurchaseData) {
      navigate(allRoutes.nuuCoins)
    }
  }, [])

  useEffect(() => {
    if (resError) {
      setLoading(false)
    }
  }, [resError])

  useEffect(() => {
    if (formType === 'card') {
      dispatch(getPaymentCards({ userId, status: 'complete' }))
    }
  }, [formType])

  useEffect(() => {
    if (assetDetails) {
      dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(NETWORKS.ETHEREUM) }))
      dispatch(getExchangeRate({ convertSymbol: getNetworkSymbol(NETWORKS.POLYGON) }))
    }
  }, [])

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
        setNetworkCurrencies((prev) => {
          const newCurrencies = prev
          const price = nuuCoinPurchaseData?.gbpAmount
          const networkPrice = getNetworkPrice(price, convertSymbol)
          newCurrencies[convertSymbol] = networkPrice
          return newCurrencies
        })
      }
    }
  }, [exchangeRateStore])

  useEffect(() => {
    dispatch(getNuuCoinsDetails({ date: (+new Date() / 1000) | 0 }))
  }, [])

  useEffect(() => {
    if (stockAvailability) {
      setLoading(true)
      setIsStockAvailable(true)
    } else {
      setIsStockAvailable(false)
    }
  }, [stockAvailability])

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
    setLoading(true)
    dispatch(
      nuuCoinPurchaseCreate({ walletAddress: data.walletAddress, ...nuuCoinPurchaseData }, () => {
        scrollTop()
        if (paymentMode === 'fiat Currency' && formType === 'paymentMode') {
          setFormType('card')
        } else if (paymentMode === 'Crypto Currency' && formType === 'paymentMode') {
          setConnectWallet(true)
          setFormType('metaMask')
        }
        setLoading(false)
      })
    )
  }

  const onPrevious = () => {
    if (formType === 'card') {
      setFormType('paymentMode')
    } else if (formType === 'metaMask') {
      setFormType('paymentMode')
    } else if (formType === 'paymentMode') {
      navigate(-1)
    }
    scrollTop()
  }

  const onCardSubmit = (data) => {
    setLoading(true)
    if (selectedCard) {
      const payload = {
        paymentCardId: selectedCard,
        paymentType: 'Fiat'
      }
      dispatch(
        nuuCoinPurchaseUsingCard(nuuCoinPurchaseCreateStore?.internalWallet?.id, payload, () => {
          setLoading(false)
          navigate(allRoutes.nuuCoins, { state: { nuuCoinPurchaseData: {} } })
        })
      )
    }
  }

  const getNetworkPrice = (price, symbol = 'ETH') => {
    return price * currencyMultiplier[symbol]
  }

  let networkPrice
  let networkSymbol
  let blockchainNetwork
  if (paymentMode === 'Crypto Currency') {
    if (parseInt(CHAIN_ID[NETWORKS.POLYGON]) === parseInt(walletAccountStore.networkId)) {
      networkSymbol = getNetworkSymbol(NETWORKS.POLYGON)
      blockchainNetwork = NETWORKS.POLYGON
    } else {
      networkSymbol = getNetworkSymbol(NETWORKS.ETHEREUM)
    }
    networkPrice = networkCurrencies[networkSymbol]
  }

  const assetDetails = {
    price: nuuCoinPurchaseData?.gbpAmount,
    blockchainNetwork: blockchainNetwork,
    assetGbpPrice: nuuCoinPurchaseData?.gbpAmount,
    networkPrice: networkPrice,
    networkSymbol: networkSymbol,
    sellerWalletAddress: process.env.REACT_APP_SUPER_ADMIN_ETHEREUM_ADDRESS
  }

  const onMetaMaskFormSubmit = () => {
    setLoading(true)
    if (stockAvailability) {
      payWithCrypto(walletAccountStore, assetDetails.networkPrice)
    } else if (isStockAvailable === null) {
      dispatch(getNuuCoinsDetails({ date: (+new Date() / 1000) | 0 }))
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

  const payWithCrypto = async (walletAccountStore, amount) => {
    const { account } = walletAccountStore
    document.body.classList.add('global-loader')
    const result = await paymentTransfer({
      walletAccountStore,
      connectedAccount: account,
      sellingPrice: amount,
      setLoading,
      assetDetails,
      dispatch
    })
    document.body.classList.remove('global-loader')
    if (result && result.status) {
      const payload = {
        paymentType: 'MetaMask',
        metaMaskTransaction: result,
        walletAddress: account
      }
      dispatch(
        nuuCoinPurchaseUsingCard(nuuCoinPurchaseCreateStore?.internalWallet?.id, payload, () => {
          setLoading(false)
          navigate(allRoutes.nuuCoins, { state: { nuuCoinPurchaseData: {} } })
        })
      )
    }
  }

  return {
    formType,
    onPrevious,
    paymentMode,
    changeStep,
    onFirstStepSubmit,
    onCardSubmit,
    loading,
    paymentModeFormMethods,
    cardFormMethods,
    connectWallet,
    onChangeSelectWallet,
    isForNewCard,
    setIsForNewCard,
    nuuCoinPurchaseData,
    paymentCardList,
    onCardSelect,
    selectedCard,
    assetDetails,
    metaMaskFormMethods,
    onMetaMaskFormSubmit,
    getNetworkPrice,
    walletAccountStore,
    networkCurrencies
  }
}

export default usePurchaseNuuCoins
