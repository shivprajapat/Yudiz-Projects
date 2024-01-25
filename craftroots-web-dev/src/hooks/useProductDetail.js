import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import useAsync from './useAsync'
import {
  productColorChangeAction,
  productSelectedSizeAction,
  productDetailsAction,
  productVariantAction,
  resetProductDetails,
} from '@/actions/productDetailAction'
import { request } from '@/services/api.service'
import {
  addToCart,
  getProductSelectedSize,
  getProductVariant,
  getVariantData,
} from '@/helper/product-helper'
import { setToastDataAction } from '@/actions/toastAction'
import {
  setMiniCartData,
  checkAndSetShippingMethod,
} from '@/actions/cartAction'
import { PRODUCT_TYPE } from '@/helper/constant'
import { isLoggedIn } from '@/helper'
import {
  GetWishList,
  MutationAddToWishList,
  MutationRemoveItemFromWishlist,
} from '@/queries/productWishlistQueries'
import { allRoutes } from '@/constants/allRoutes'
import { setWishlistData } from '@/actions/productWishlistAction'
import store from '@/store'

export default function useProductDetail({ productDetail }) {
  const intl = useIntl()
  const [isLoadingImg, setIsLoadingImg] = useState(false)
  const [productInfoTab, setProductInfoTab] = useState(1)
  const [quantity, setQuantity] = useState(1)
  const addTocartPdpRes = useAsync(null, null)
  const buyNowPdpRes = useAsync(null, null)
  const router = useRouter()
  const { query } = router
  const dispatch = useDispatch()
  const productDetailsState = useSelector((state) => state.productDetails)
  const addItemToWishlistResult = useAsync(null, null)
  const removeItemFromWishlistResult = useAsync(null, null)
  const productId = productDetail?.products?.items?.[0]?.id
  const handleProductInfoTab = useCallback((index) => {
    setProductInfoTab(index)
  }, [])

  const wishlistStateItems = useSelector(
    (state) => state.productWishlistReducer.data.items
  )

  const updateWishlistCount = async () => {
    const wishlistData = await request({
      ...GetWishList,
    })
    dispatch(setWishlistData(wishlistData?.customer?.wishlist))
  }

  const handleWishlistToggle = useCallback(
    (currentActionData, nextActionData) => {
      const currentActionResponse = currentActionData?.state?.data
      const resopnseKeys = Object.keys(currentActionResponse)
      if (resopnseKeys.length) {
        updateWishlistCount()
        nextActionData.resetData()
        const message = currentActionResponse[resopnseKeys[0]]?.message
        dispatch(setToastDataAction({ show: true, message }))
      }
    },
    []
  )

  const getActiveClass = (index, className) =>
    productInfoTab === index ? className : ''

  const handleWishlist = () => {
    if (isLoggedIn()) {
      if (wishlistStateItems?.some((i) => i.product.id === productId)) {
        removeItemFromWishlistResult.run(request, {
          ...MutationRemoveItemFromWishlist,
          variables: { product_id: productId },
        })
      } else {
        addItemToWishlistResult.run(request, {
          ...MutationAddToWishList,
          variables: { product_id: productId },
        })
      }
    } else {
      router.push(allRoutes.signIn)
    }
  }
  const variantsData = useMemo(
    () => getVariantData({ productDetailsState }),
    [productDetailsState, productDetailsState.selectedColor]
  )
  const { variantSku } = variantsData

  const handleAddToCart = () => {
    PRODUCT_TYPE.simpleProduct.title.includes(
      productDetail?.products?.items?.[0].__typename
    )
      ? addToCart({
        addTocartRes: addTocartPdpRes,
        item: productDetail?.products?.items?.[0],
        sku: '',
        parentSku: '',
        qty: quantity,
      })
      : addToCart({
        addTocartRes: addTocartPdpRes,
        item: {},
        sku: variantSku,
        parentSku: productDetail?.products?.items?.[0].sku,
        qty: quantity,
      })
  }

  const buyNowHandler = () => {
    PRODUCT_TYPE.simpleProduct.title.includes(
      productDetail?.products?.items?.[0].__typename
    )
      ? addToCart({
        addTocartRes: buyNowPdpRes,
        item: productDetail?.products?.items?.[0],
        sku: '',
        parentSku: '',
        qty: quantity,
      })
      : addToCart({
        addTocartRes: buyNowPdpRes,
        item: {},
        sku: variantSku,
        parentSku: productDetail?.products?.items?.[0].sku,
        qty: quantity,
      })
  }
  useEffect(() => {
    handleWishlistToggle(addItemToWishlistResult, removeItemFromWishlistResult)
  }, [addItemToWishlistResult?.state?.isSuccess])

  useEffect(() => {
    handleWishlistToggle(removeItemFromWishlistResult, addItemToWishlistResult)
  }, [removeItemFromWishlistResult?.state?.isSuccess])

  const handleChangeColor = useCallback(
    (colorId) => {
      if (colorId.toString() !== productDetailsState.selectedColor) {
        dispatch(productColorChangeAction(colorId.toString()))
        setIsLoadingImg(true)
      }
    },
    [productDetailsState.selectedColor]
  )

  const handleSize = useCallback((sizeValueIdx) => {
    dispatch(productSelectedSizeAction(sizeValueIdx?.toString()))
  }, [])

  useEffect(() => {
    dispatch(resetProductDetails())
    /* REMOVED COLOR ATTR FOR TESTING
     const colorAttrIndex =
      productDetail?.products?.items[0]?.configurable_options?.findIndex(
        (option) => option.attribute_code === ATTRIBUTE.color.title
      )
    if (colorAttrIndex > -1) {
      productDetail?.products?.items[0]?.configurable_options.splice(
        colorAttrIndex,
        1
      )
    }
    console.log('nonColorProduct', productDetail?.products?.items) */
    dispatch(productDetailsAction(productDetail?.products?.items))
  }, [query])

  useEffect(() => {
    const { productDetails: updatedProductDetailsState } = store.getState()
    const variantData = getProductVariant(
      updatedProductDetailsState,
      productDetail
    )
    if (variantData) {
      const { variants, selectedColor } = variantData
      dispatch(productVariantAction(variants))
      dispatch(productColorChangeAction(selectedColor?.toString()))
    }
    const { foundSize } = getProductSelectedSize(updatedProductDetailsState)
    if (foundSize && !productDetailsState?.selectedSize) {
      dispatch(productSelectedSizeAction(foundSize?.toString()))
    }
  }, [productDetailsState.data, dispatch, productDetail])

  useEffect(() => {
    const { mediaGallery } = getVariantData({ productDetailsState })
    const url = mediaGallery?.[0]?.url
    if (url) {
      setIsLoadingImg(false)
    }
  }, [productDetailsState.selectedColor])

  useEffect(() => {
    const handleSuccess = (res, shouldRedirect) => {
      const cartData = res?.state?.data[Object.keys(res?.state.data)[0]].cart

      dispatch(
        setMiniCartData({
          items: cartData?.items,
          totalItems: cartData?.total_quantity,
          prices: cartData?.prices,
          paymentMethods: cartData?.available_payment_methods,
          appliedCoupon: cartData?.applied_coupons?.[0]?.code || null,
          storeCreditAmount:
            cartData?.storecredit_applied?.base_bss_storecredit_amount || null,
        })
      )

      dispatch(
        setToastDataAction({
          show: true,
          message: intl.formatMessage({
            id: 'toast.addToCart.successMsg',
          }),
        })
      )

      dispatch(checkAndSetShippingMethod(cartData))

      if (shouldRedirect) {
        router.push(allRoutes.cart)
      }
    }

    if (addTocartPdpRes.state.isSuccess) {
      handleSuccess(addTocartPdpRes, false)
    }

    if (buyNowPdpRes.state.isSuccess) {
      handleSuccess(buyNowPdpRes, true)
    }
  }, [addTocartPdpRes.state.isSuccess, buyNowPdpRes.state.isSuccess])

  return {
    productDetailsState,
    getVariantData,
    handleSize,
    handleChangeColor,
    isLoadingImg,
    setIsLoadingImg,
    productInfoTab,
    handleProductInfoTab,
    getActiveClass,
    handleWishlist,
    variantsData,
    handleAddToCart,
    addTocartPdpRes,
    quantity,
    setQuantity,
    buyNowHandler,
    buyNowPdpRes,
  }
}
