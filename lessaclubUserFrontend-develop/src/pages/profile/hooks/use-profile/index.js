import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { getUser } from 'modules/user/redux/service'

const useProfile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [user, setUser] = useState()

  const isMounted = useRef(false)
  const tabs = useRef([
    { name: 'Collected', internalName: 'collected', active: false },
    { name: 'Created', internalName: 'created', active: false },
    { name: 'Communities', internalName: 'communities', active: false },
    { name: 'Private', internalName: 'private', active: false },
    { name: 'Wishlist', internalName: 'wishlist', active: false },
    { name: 'Orders To Receive', internalName: 'orders', active: false },
    { name: 'Orders To Send', internalName: 'order-to-send', active: false },
    { name: 'Cards & addresses', internalName: 'cards-and-addresses', active: false },
    { name: 'Transactions', internalName: 'transactions', active: false },
    { name: 'Wallet', internalName: 'my-wallets', active: false }
  ])

  const currentUser = useSelector((state) => state.user.user)
  const truliooKycStore = useSelector((state) => state.truliooKyc)
  const userId = useSelector((state) => state.auth.userId) || localStorage.getItem('userId')

  const currentUserId = id || userId

  useEffect(() => {
    if (id) {
      dispatch(getUser(id))
    }
  }, [id])

  useEffect(() => {
    if (isMounted.current) {
      if (!id && userId && isMounted.current) {
        dispatch(getUser(userId))
      }
    } else isMounted.current = true
  }, [id])

  useEffect(() => {
    truliooKycStore?.kyc?.user?.id && setUser(truliooKycStore.kyc.user)
  }, [truliooKycStore])

  useEffect(() => {
    currentUser && setUser(currentUser)
  }, [currentUser])

  return {
    id,
    user,
    tabs: tabs.current,
    currentUserId
  }
}

export default useProfile
