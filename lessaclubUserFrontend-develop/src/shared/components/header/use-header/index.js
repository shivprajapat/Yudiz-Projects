import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { getUser } from 'modules/user/redux/service'
import { connectMetaMask, connectWallet as connectToWallet } from 'modules/wallet/redux/service'
import { allRoutes } from 'shared/constants/allRoutes'
import { KYC_STATUS_HIDE } from 'modules/user/redux/action'
import { signOut } from 'modules/signOut/redux/service'
import { GlobalEventsContext } from 'shared/components/global-events'

const useHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { dispatch: editProfileEvent } = useContext(GlobalEventsContext)
  const userId = localStorage.getItem('userId')

  const [truliooKyc, setTruliooKyc] = useState(false)
  const [kyc, setKyc] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)
  const [logOutValue, setLogOutValue] = useState(false)

  useEffect(() => {
    dispatch(connectMetaMask)
  }, [])

  useEffect(() => {
    if (userId) {
      dispatch(
        getUser(userId, (data) => {
          editProfileEvent({
            type: 'CHANGE_PROFILE',
            payload: { profileData: data?.users }
          })
        })
      )
    }
  }, [])

  const onClose = () => {
    setKyc(false)
  }
  const onConfirm = () => {
    setTruliooKyc(true)
    setKyc(false)
  }

  const handleKyc = (kyc) => {
    setKyc(kyc)
    dispatch({ type: KYC_STATUS_HIDE })
  }

  const logOut = () => {
    document.body.classList.add('global-loader')
    dispatch(connectToWallet({ walletAddress: null, walletName: null }))
    setLogOutValue(true)
  }

  useEffect(() => {
    if (logOutValue) {
      localStorage.clear()
      editProfileEvent({
        type: 'CHANGE_PROFILE',
        payload: { profileData: {} }
      })
      dispatch(
        signOut(() => {
          navigate(allRoutes.login)
        })
      )
    }
  }, [logOutValue])

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
    isLoggedIn: !!userId,
    handleKyc,
    logOut
  }
}

export default useHeader
