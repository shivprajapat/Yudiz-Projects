import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { getUser } from 'modules/user/redux/service'
import { localStorageUserId } from 'shared/utils'
import { useUpdateEffect } from 'shared/hooks/use-update-effect'

const useProfile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const [user, setUser] = useState()
  // eslint-disable-next-line no-unused-vars
  const [tabs, setTabs] = useState([
    { name: 'Collected', internalName: 'collected', active: false },
    { name: 'Created', internalName: 'created', active: false },
    { name: 'Communities', internalName: 'communities', active: false },
    { name: 'Private', internalName: 'private', active: false },
    { name: 'Wishlist', internalName: 'wishlist', active: false },
    { name: 'Wallet', internalName: 'my-wallets', active: false },
    { name: 'Orders', internalName: 'orders', active: false },
    { name: 'Cards & addresses', internalName: 'cards-and-addresses', active: false }
  ])

  const currentUser = useSelector((state) => state.user.user)
  const truliooKycStore = useSelector((state) => state.truliooKyc)
  const userId = useSelector((state) => state.auth.userId) || localStorageUserId

  const currentUserId = id || userId

  useEffect(() => {
    if (id) {
      dispatch(getUser(id))
    }
  }, [id])

  useUpdateEffect(() => {
    if (!id && userId) {
      dispatch(getUser(userId))
    }
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
    tabs,
    currentUserId
  }
}

export default useProfile
