import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { getUser } from 'modules/user/redux/service'
import { connectMetaMask, connectWallet as connectToWallet } from 'modules/wallet/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import useStorageEvents from 'shared/hooks/use-storage-events'

const useHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [truliooKyc, setTruliooKyc] = useState(false)
  const { isAuthenticated: isLoggedIn, setIsAuthenticated: setIsLoggedIn } = useStorageEvents()
  const [kyc, setKyc] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)

  useEffect(() => {
    dispatch(connectMetaMask)
  }, [])

  const handleChangeStorage = () => {
    if (localStorage.getItem('userId')) {
      setIsLoggedIn(true)
      dispatch(getUser(localStorage.getItem('userId')))
    }
  }

  useEffect(() => {
    handleChangeStorage()
  }, [])

  const onClose = () => {
    setKyc(false)
  }
  const onConfirm = () => {
    setTruliooKyc(true)
    setKyc(false)
  }

  const logOut = () => {
    document.body.classList.add('global-loader')
    dispatch(
      connectToWallet({ walletAddress: null, walletName: null }, () => {
        localStorage.clear()
        navigate(allRoutes.home)
      })
    )
    setIsLoggedIn(false)
  }

  const onChangeSelectWallet = () => {
    setConnectWallet(!connectWallet)
  }
  return {
    truliooKyc,
    connectWallet,
    onChangeSelectWallet,
    kyc,
    onConfirm,
    onClose,
    isLoggedIn,
    setKyc,
    logOut
  }
}

export default useHeader
