import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import useAsync from './useAsync'
import { ATTRIBUTE, PRODUCT_TYPE, STORAGE_KEYS } from '@/helper/constant'
import {
  setSearchActive,
  setSearchOverlayActive,
} from '@/actions/productSearchAction'
import { AddToCartConfigReq, AddToCartReq } from '@/queries/cartQueries'
import { request } from '@/services/api.service'
import { constants } from '@/actions/type'
import { setToastDataAction } from '@/actions/toastAction'
import {
  GetWishList,
  MutationAddToWishList,
  MutationRemoveItemFromWishlist,
} from '@/queries/productWishlistQueries'
import { isLoggedIn } from '@/helper'
import { allRoutes } from '@/constants/allRoutes'
import { setWishlistData } from '@/actions/productWishlistAction'

export default function useProductListItem({
  typeName,
  variants,
  configurableOptions,
  image,
  productId,
  wishlistStateItems,
}) {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [productVariants, setProductVariants] = useState(handleVariantChange())
  const router = useRouter()

  const [selectedImage, setSelectedImage] = useState(handleImageChange())
  const [selectedColor, setSelectedColor] = useState()
  const addTocartRes = useAsync(null, null)
  const [removeWishlistLoading, setRemoveWishlistLoading] = useState(false)
  const addItemToWishlistResult = useAsync(null, null)
  const removeItemFromWishlistResult = useAsync(null, null)

  const handleProductClick = useCallback(() => {
    dispatch(setSearchActive(false))
    dispatch(setSearchOverlayActive(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //change image based on color for Product
  useEffect(() => {
    /**
     * we have removed color select from list
     * therefore take first image from the gallery
     * */

    /* if (selectedColor && productVariants?.images) {
      setSelectedImage(
        productVariants?.images?.find(
          (color) => color.colorID === selectedColor
        )?.product?.media_gallery?.[0]?.url
      )
    } else {
      setSelectedImage(image)
    } */
    const image = handleImageChange()
    setSelectedImage(image)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, productVariants?.images, image])

  function handleImageChange() {
    if (productVariants?.images?.length) {
      // setSelectedImage(
      return productVariants?.images?.[0].product?.media_gallery?.[0]?.url
      // )
    } else {
      return image
    }
  }

  useEffect(() => {
    const changedVariant = handleVariantChange()
    setProductVariants(changedVariant)
    if (changedVariant?.images?.product?.media_gallery?.length) {
      setSelectedImage(changedVariant?.images?.product?.media_gallery?.[0]?.url)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeName, variants])

  function handleVariantChange() {
    if (PRODUCT_TYPE.configuralProduct.title.includes(typeName)) {
      const colorAndSize = configurableOptions.reduce(
        (acc, option) => {
          const cloneAcc = { ...acc }
          switch (option?.attribute_code) {
            case ATTRIBUTE.color.title:
              cloneAcc.colors.push(option?.values)
              break
            case ATTRIBUTE.size.title:
              cloneAcc.sizes.push(option?.values)
              break
            default:
              break
          }
          return acc
        },
        { colors: [], sizes: [] }
      )
      const imagearray = variants?.reduce((acc, item) => {
        const colorattr = item?.attributes?.find(
          (attr) => attr.code === ATTRIBUTE.color.title
        )
        const cloneAcc = acc
        let isColorIDAdded = undefined
        if (cloneAcc.length) {
          isColorIDAdded = cloneAcc?.find(
            (a) => a?.colorID === colorattr?.value_index
          )
        }
        if (!cloneAcc.length || !isColorIDAdded) {
          cloneAcc.push({
            product: item?.product,
            colorID: colorattr?.value_index,
          })
        }
        return cloneAcc
      }, [])
      // setProductVariants({
      //   colors: colorAndSize?.colors?.[0],
      //   sizes: colorAndSize?.sizes?.[0],
      //   images: imagearray,
      // })

      return {
        colors: colorAndSize?.colors?.[0],
        sizes: colorAndSize?.sizes?.[0],
        images: imagearray,
      }

      //setSelected Image
      // setSelectedImage(imagearray[0])
      /* Uncomment this once we have color change in list items
      setSelectedColor(imagearray?.[0]?.colorID)
       */
    }
    return {
      colors: [],
      sizes: [],
      images: [],
    }
  }

  useEffect(() => {
    if (addTocartRes.state.isSuccess) {
      dispatch(
        setToastDataAction({
          show: true,
          message: 'Added To Cart',
        })
      )
      dispatch({
        type: constants.ADD_TO_CART_SUCCESS,
        totalItems:
          addTocartRes?.state?.data?.addSimpleProductsToCart?.cart
            ?.total_quantity ||
          addTocartRes?.state?.data?.addConfigurableProductsToCart?.cart
            ?.total_quantity,
      })
    }
  }, [addTocartRes.state.isSuccess])

  const AddToCart = async (item, sku, parentSku) => {
    if (Object.keys(item).length > 0) {
      addTocartRes.run(request, {
        ...AddToCartReq,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
          quantity: 1,
          sku: item.sku,
        },
      })
    } else {
      addTocartRes.run(request, {
        ...AddToCartConfigReq,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
          quantity: 1,
          sku: sku,
          parent_sku: parentSku,
        },
      })
    }
  }

  const wishlistCount = async () => {
    const wishlistData = await request({
      ...GetWishList,
    })
    dispatch(setWishlistData(wishlistData?.customer?.wishlist))
  }

  const handleWishlist = () => {
    if (isLoggedIn()) {
      setRemoveWishlistLoading(true)
      if (wishlistStateItems?.some((i) => i.product.id === productId)) {
        removeItemFromWishlistResult.run(request, {
          ...MutationRemoveItemFromWishlist,
          variables: { product_id: productId },
        })
        setTimeout(() => {
          setRemoveWishlistLoading(false)
        }, 1000)
      } else {
        setRemoveWishlistLoading(true)
        addItemToWishlistResult.run(request, {
          ...MutationAddToWishList,
          variables: { product_id: productId },
        })
        setTimeout(() => {
          setRemoveWishlistLoading(false)
        }, 1000)
      }
    } else {
      dispatch(
        setToastDataAction({
          show: true,
          error: true,
          message: intl.formatMessage({
            id: 'wishlist.loggedOut.Msg',
          }),
        })
      )
      router.push(allRoutes.signIn)
    }
  }

  useEffect(() => {
    if (removeItemFromWishlistResult?.state?.isSuccess) {
      wishlistCount()
    }
    if (addItemToWishlistResult?.state?.isSuccess) {
      wishlistCount()
    }
  }, [
    removeItemFromWishlistResult?.state?.isSuccess,
    addItemToWishlistResult?.state?.isSuccess,
  ])

  useEffect(() => {
    if (addItemToWishlistResult) {
      const addWishlistData = addItemToWishlistResult.state.data
      if (Object.keys(addWishlistData).length) {
        const message = addWishlistData.addItemToWishlist?.message
        dispatch(setToastDataAction({ show: true, message }))
      }
    }
  }, [addItemToWishlistResult.state?.data?.addItemToWishlist?.message])

  useEffect(() => {
    if (removeItemFromWishlistResult) {
      const removeWishlistData = removeItemFromWishlistResult.state.data
      if (Object.keys(removeWishlistData).length) {
        const message = removeWishlistData.removeFromWishlist?.message
        dispatch(setToastDataAction({ show: true, message }))
      }
    }
  }, [removeItemFromWishlistResult.state?.data?.removeFromWishlist?.message])

  return {
    productVariants,
    selectedImage,
    selectedColor,
    setSelectedColor,
    handleProductClick,
    AddToCart,
    addTocartRes,
    handleWishlist,
    removeWishlistLoading,
  }
}
