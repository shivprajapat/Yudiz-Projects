import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useDispatch, useSelector } from 'react-redux'
import ShippingAddress from '../../components/checkout/ShippingAddress'

import { getAllAddressLogin, miniCartData } from '@/actions/cartAction'
import { isLoggedIn, outOfStockStatusHandle } from '@/helper'
import LoginAddresses from '@/components/LoginAddresses'
import { CartLayout } from '@/components/checkout'
import { STORAGE_KEYS } from '@/helper/constant'

const Address = () => {
  const [isLogin, setIsLogin] = useState(false)
  const { cartLoading, items } = useSelector((state) => state.cartReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoggedIn()) {
      dispatch(getAllAddressLogin())
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
    if (localStorage.getItem(STORAGE_KEYS.cartId)) {
      dispatch(miniCartData())
    }
  }, [isLoggedIn()])

  useEffect(() => {
    if (items?.length > 0) {
      outOfStockStatusHandle(items, dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  return (
    <CartLayout>
      {!cartLoading && (isLogin ? <LoginAddresses /> : <ShippingAddress />)}
    </CartLayout>
  )
}

export default Address
Address.propTypes = {
  onNext: PropTypes.func,
}
