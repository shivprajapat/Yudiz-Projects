import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAsync from './useAsync'
import {
  addToCart,
  getProductSelectedSize,
  getProductVariant,
  getVariantData,
} from '@/helper/product-helper'
import {
  editCartColor,
  editCartItemData,
  editCartSize,
  editCartVariant,
  miniCartData,
  resetEditCartData,
  updateCartAction,
} from '@/actions/cartAction'
import { RemoveItemCart } from '@/queries/cartQueries'
import { request } from '@/services/api.service'
import { ATTRIBUTE } from '@/helper/contants'
import { constants } from '@/actions/type'
import { STORAGE_KEYS } from '@/helper/constant'
import store from '@/store'

export default function useEditCartItem({
  productDetail,
  closeConfirm,
  selectedCartItem,
  UpdateQty,
}) {
  const [isLoadingImg, setIsLoadingImg] = useState(false)
  const addTocartRes = useAsync(null, null)
  const removeItemFromCart = useAsync(null, null)
  const [selectedQuantity, setSelectedQuantity] = useState(
    selectedCartItem?.quantity
  )
  const dispatch = useDispatch()
  const editCartStateData = useSelector((state) => state.cartReducer)
  const variantSku = editCartStateData?.selectedSize
    ? editCartStateData?.productVariants.newImages?.[
      editCartStateData?.selectedColor
    ]?.[editCartStateData?.selectedSize]?.product.sku
    : editCartStateData?.productVariants.newImages?.[
      editCartStateData?.selectedColor
    ].product.sku

  useEffect(() => {
    dispatch(editCartItemData(productDetail?.products?.items))
  }, [productDetail])

  useEffect(() => {
    let color
    let selectedSize

    if (editCartStateData?.data?.length > 0) {
      selectedCartItem?.configurable_options?.forEach((attr) => {
        if (attr.option_label.toLowerCase() === ATTRIBUTE.color.title) {
          color = attr.value_id
          dispatch(editCartColor(color.toString()))
        }
        if (attr.option_label.toLowerCase() === ATTRIBUTE.size.title) {
          selectedSize = attr.value_id
          dispatch(editCartSize(selectedSize.toString()))
        }
      })
      const { cartReducer } = store.getState()
      const variantData = getProductVariant(cartReducer, productDetail)
      if (variantData) {
        const { variants } = variantData
        dispatch(editCartVariant(variants))
      }
    }
  }, [editCartStateData.data])

  const variantsData = useMemo(
    () => getVariantData({ productDetailsState: editCartStateData }),
    [editCartStateData, editCartStateData.selectedColor]
  )

  const { productVariants, stockStatus, mediaGallery } = variantsData

  const handleCloseModal = useCallback(() => {
    if (closeConfirm) {
      closeConfirm()
    }
    dispatch(resetEditCartData())
  }, [])

  const handleSize = useCallback((sizeValueIdx) => {
    dispatch(editCartSize(sizeValueIdx))
  }, [])

  const handleChangeColor = useCallback((colorId) => {
    dispatch(editCartColor(colorId))
    setIsLoadingImg(true)
  }, [])

  useEffect(() => {
    const { foundSize } = getProductSelectedSize()
    if (!editCartStateData?.selectedSize) {
      dispatch(editCartSize(foundSize))
    }
  }, [editCartStateData.selectedColor])

  useEffect(() => {
    if (addTocartRes?.state?.isSuccess) {
      removeItemFromCart.run(request, {
        ...RemoveItemCart,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
          cart_item_id: selectedCartItem.id,
        },
      })
    }
  }, [addTocartRes?.state?.isSuccess])

  useEffect(() => {
    if (removeItemFromCart.state.isSuccess) {
      handleCloseModal()
      dispatch(miniCartData())
      dispatch({ type: constants.UPDATE_PRODUCT_SUCCESS })
    }
  }, [removeItemFromCart.state.isSuccess])

  useEffect(() => {
    if (editCartStateData.isUpdateCartSuccess) {
      handleCloseModal()
      dispatch(
        updateCartAction({
          isUpdateCartSuccess: false,
          updateCartLoading: false,
        })
      )
    }
  }, [editCartStateData.isUpdateCartSuccess])

  useEffect(() => {
    if (addTocartRes.state.isFailed) {
      dispatch(
        updateCartAction({
          isUpdateCartSuccess: false,
          updateCartLoading: false,
        })
      )
    }
  }, [addTocartRes.state.isFailed])
  const handleEditCart = () => {
    if (selectedCartItem?.configured_variant?.sku === variantSku) {
      UpdateQty(selectedCartItem?.id, selectedQuantity)
    } else {
      /* dispatch(clearUpdateCart({
        updateCartLoading: true,
        isError: false,
        isUpdateCartSuccess: false,
      })) */
      dispatch(
        updateCartAction({
          updateCartLoading: true,
          isUpdateCartSuccess: false,
        })
      )
      addToCart({
        addTocartRes: addTocartRes,
        item: {},
        sku: variantSku,
        parentSku: editCartStateData?.data?.[0].sku,
        qty: selectedQuantity,
      })
    }
  }

  return {
    editCartStateData,
    handleCloseModal,
    handleSize,
    getVariantData,
    handleChangeColor,
    mediaGallery,
    selectedQuantity,
    setSelectedQuantity,
    handleEditCart,
    isLoadingImg,
    productVariants,
    stockStatus,
  }
}
