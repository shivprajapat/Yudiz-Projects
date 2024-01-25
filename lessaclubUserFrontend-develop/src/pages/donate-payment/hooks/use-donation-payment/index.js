import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { allRoutes } from 'shared/constants/allRoutes'
import { getNetworkSymbol, scrollTop } from 'shared/utils'
import { donatePurchaseCreate, donateCoinPurchaseUsingCard } from 'modules/donate/redux/service'
import { getPaymentCards } from 'modules/paymentCard/redux/service'
import { getExchangeRate } from 'modules/exchangeRate/redux/service'
import { CHAIN_ID, NETWORKS, paymentTransfer } from 'modules/blockchainNetwork'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { getAllAdminGeneralSetting } from 'admin/modules/adminSettings/redux/service'
import { getNuuCoinsDetails } from 'modules/nuuCoins/redux/service'

const useDonationPayment = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state: locationState } = useLocation()
  const userId = localStorage.getItem('userId')
  const { selectedDonateType, amount } = locationState || {}

  const [formType, setFormType] = useState('paymentMode')
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)
  const [isForNewCard, setIsForNewCard] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)
  const [currencyMultiplier, setCurrencyMultiplier] = useState({})
  const [networkCurrencies, setNetworkCurrencies] = useState({})
  const [adminWalletAddress, setAdminWalletAddress] = useState([])
  const [userData, setUserData] = useState()
  const [nuuCoinsMultiplier, setNuuCoinsMultiplier] = useState()

  const donatePurchaseCreateStore = useSelector((state) => state.donate)
  const resError = useSelector((state) => state.nuuCoins.error)
  const paymentCardList = useSelector((state) => state.paymentCards.paymentCardList)
  const walletAccountStore = useSelector((state) => state.wallet)
  const exchangeRateStore = useSelector((state) => state.exchangeRate)
  const userStore = useSelector((state) => state.user.user)
  const adminSettings = useSelector((state) => state.adminSettings?.singleAdminGeneralSettings?.setting)
  const nuuCoinsStore = useSelector((state) => state.nuuCoins)
  const paymentModeFormMethods = useForm({ mode: 'all', defaultValues: { paymentMode: 'Crypto Currency' } })
  const cardFormMethods = useForm({ mode: 'all' })
  const metaMaskFormMethods = useForm({ mode: 'all' })
  const nuuCoinFormMethods = useForm({ mode: 'all' })

  const paymentMode = paymentModeFormMethods.watch('paymentMode')

  const donationPurchaseData = { selectedDonateType, amount }

  useEffect(() => {
    if (!amount) {
      navigate(allRoutes.donate)
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
          const price = donationPurchaseData?.amount
          const networkPrice = getNetworkPrice(price, convertSymbol)
          newCurrencies[convertSymbol] = networkPrice
          return newCurrencies
        })
      }
    }
  }, [exchangeRateStore])

  useEffect(() => {
    if (paymentMode === 'Crypto Currency' && formType === 'paymentMode') {
      dispatch(getAllAdminGeneralSetting())
    }
  }, [])

  useEffect(() => {
    if (adminSettings && adminSettings.length !== 0) {
      setAdminWalletAddress(adminSettings)
    }
  }, [adminSettings])

  useEffect(() => {
    if (userStore && userStore.id) {
      setUserData(userStore)
    }
  }, [userStore])

  useEffect(() => {
    dispatch(getNuuCoinsDetails({ date: (+new Date() / 1000) | 0 }))
  }, [])

  useEffect(() => {
    if (nuuCoinsStore?.nuuCoinsDetails?.nuuCoin?.length) {
      setNuuCoinsMultiplier(Number(nuuCoinsStore?.nuuCoinsDetails?.nuuCoin[0]?.coinRate))
    }
  }, [nuuCoinsStore])

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
    const payload = {
      amount: donationPurchaseData.amount
    }
    dispatch(
      donatePurchaseCreate(payload, () => {
        scrollTop()
        if (paymentMode === 'fiat Currency' && formType === 'paymentMode') {
          setFormType('card')
        } else if (paymentMode === 'Crypto Currency' && formType === 'paymentMode') {
          setConnectWallet(true)
          setFormType('metaMask')
        } else if (paymentMode === 'Nuu coin' && formType === 'paymentMode') {
          setFormType('nuuCoin')
        }
        setLoading(false)
      })
    )
  }

  const onPrevious = () => {
    if (formType === 'paymentMode') {
      navigate(-1)
    } else {
      setFormType('paymentMode')
    }
    scrollTop()
  }

  const onCardSubmit = (data) => {
    if (!selectedCard) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Please select a card',
          type: TOAST_TYPE.Error
        }
      })
      return false
    }
    setLoading(true)
    const payload = {
      paymentCurrencyType: 'Fiat',
      paymentCardId: selectedCard,
      paymentType: 'Fiat'
    }
    const { donatePurchaseCreate } = donatePurchaseCreateStore
    console.log('onCardSubmit', {
      data,
      selectedCard,
      payload,
      donatePurchaseCreate
    })

    dispatch(
      donateCoinPurchaseUsingCard(donatePurchaseCreate?.donations?.id, payload, () => {
        setLoading(false)
        navigate(allRoutes.donate, { state: { donationPurchaseData: {} } })
      })
    )
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
    price: donationPurchaseData?.amount,
    blockchainNetwork: blockchainNetwork,
    assetGbpPrice: donationPurchaseData?.amount,
    networkPrice: networkPrice,
    networkSymbol: networkSymbol,
    sellerWalletAddress: adminWalletAddress[0]?.donationWalletAddress
  }

  const onMetaMaskFormSubmit = () => {
    setLoading(true)
    payWithCrypto(walletAccountStore, assetDetails.networkPrice)
  }

  const onNuuCoinFormSubmit = () => {
    setLoading(true)
    const payload = {
      paymentCurrencyType: 'Nuucoin'
    }
    const { donatePurchaseCreate } = donatePurchaseCreateStore
    dispatch(
      donateCoinPurchaseUsingCard(donatePurchaseCreate?.donations?.id, payload, () => {
        setLoading(false)
        navigate(allRoutes.donate, { state: { donationPurchaseData: {} } })
      })
    )
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
        paymentCurrencyType: 'Crypto',
        paymentType: 'MetaMask',
        metaMaskTransaction: result,
        walletAddress: account
      }
      const { donatePurchaseCreate } = donatePurchaseCreateStore
      dispatch(
        donateCoinPurchaseUsingCard(donatePurchaseCreate?.donations?.id, payload, () => {
          setLoading(false)
          navigate(allRoutes.donate, { state: { donationPurchaseData: {} } })
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
    donationPurchaseData,
    paymentCardList,
    onCardSelect,
    selectedCard,
    assetDetails,
    metaMaskFormMethods,
    onMetaMaskFormSubmit,
    getNetworkPrice,
    walletAccountStore,
    networkCurrencies,
    nuuCoinFormMethods,
    onNuuCoinFormSubmit,
    userData,
    nuuCoinsMultiplier
  }
}

export default useDonationPayment
