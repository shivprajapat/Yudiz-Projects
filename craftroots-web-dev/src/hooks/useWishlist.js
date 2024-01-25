import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import useAsync from './useAsync'
import {
  GetWishList,
  MutationRemoveItemFromWishlist,
} from '@/queries/productWishlistQueries'
import { request } from '@/services/api.service'
import { setWishlistData } from '@/actions/productWishlistAction'
import { setToastDataAction } from '@/actions/toastAction'

const useWishlist = () => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const wishlistRef = useRef()
  const [removeWishlistLoading, setRemoveWishlistLoading] = useState(false)
  const removeItemFromWishlistResult = useAsync(null, null)

  const wishlistStateItems = useSelector(
    (state) => state.productWishlistReducer
  )

  const deleteProductFromWishlistHandle = (productId) => {
    setRemoveWishlistLoading(true)
    removeItemFromWishlistResult.run(request, {
      ...MutationRemoveItemFromWishlist,
      variables: { product_id: productId },
    })
    setTimeout(() => {
      setRemoveWishlistLoading(false)
    }, 1000)
  }

  const wishlistCount = async () => {
    const wishlistData = await request({
      ...GetWishList,
    })
    dispatch(setWishlistData(wishlistData?.customer?.wishlist))
  }

  useEffect(() => {
    if (removeItemFromWishlistResult?.state?.isSuccess) {
      wishlistCount()

      const removeWishlistData = removeItemFromWishlistResult.state.data
      if (Object.keys(removeWishlistData).length) {
        const message = removeWishlistData?.removeFromWishlist?.message
        dispatch(setToastDataAction({ show: true, message }))
      }
    }
  }, [removeItemFromWishlistResult?.state?.isSuccess])

  return {
    wishlistStateItems,
    deleteProductFromWishlistHandle,
    intl,
    removeItemFromWishlistResult,
    wishlistRef,
    removeWishlistLoading,
  }
}

export default useWishlist
