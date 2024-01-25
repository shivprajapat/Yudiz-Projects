import {
  CART_QUERY_PRICES_KEYS,
  IN_STOCK,
  OUT_OF_STOCK,
  PRODUCT_TYPE,
  STORAGE_KEYS,
} from './constant'
import { ATTRIBUTE } from './contants'
import { request } from '@/services/api.service'
import { AddToCartConfigReq, AddToCartReq } from '@/queries/cartQueries'
import { CreateCartId } from '@/queries/homePageQueries'
import { miniCartData } from '@/actions/cartAction'

export const getVariantData = ({ productDetailsState }) => {
  if (!productDetailsState) {
    return {
      productVariants: [],
      productPrices: {},
      stockStatus: '',
      mediaGallery: [],
    }
  }
  const {
    data: [firstProduct],
    productVariants,
    selectedColor,
    selectedSize,
  } = productDetailsState || {}

  /**
   * flag to change product image based on size selection
   */
  const categorywiseSizeImageFlag = firstProduct?.category_flag
  const isSimpleProduct = PRODUCT_TYPE.simpleProduct.title.includes(
    firstProduct?.__typename || ''
  )
  const selectedColorVariant = productVariants?.newImages?.[selectedColor]
  const selectedVariant = isSimpleProduct
    ? productVariants?.newImages
    : selectedColorVariant?.[selectedSize] || selectedColorVariant

  const maxPrice = selectedVariant?.product?.price_range?.maximum_price

  const productPrices = selectedVariant
    ? {
      discount: maxPrice?.discount?.percent_off || 0,
      regular: maxPrice?.regular_price?.value || 0,
      final: maxPrice?.final_price?.value || 0,
    }
    : null

  const stockStatus = isSimpleProduct
    ? selectedVariant?.product?.stock_status
    : selectedVariant?.product?.stock_status_data?.stock_status

  const mediaGallery = isSimpleProduct
    ? selectedVariant?.product?.media_gallery
    : selectedColorVariant?.product?.media_gallery ||
      selectedColorVariant?.[
        categorywiseSizeImageFlag
          ? selectedSize
          : Object.keys(selectedColorVariant)[0]
      ]?.product?.media_gallery

  const variantSku = !isSimpleProduct
    ? selectedVariant?.product?.sku
    : firstProduct?.sku

  const notifyMe = !isSimpleProduct
    ? selectedVariant?.product?.notify_me
    : firstProduct?.notify_me

  const totalQuantiy = !isSimpleProduct
    ? selectedVariant?.product?.stock_status_data?.qty
    : firstProduct?.stock_status_data?.qty
  return {
    productVariants,
    productPrices,
    stockStatus,
    mediaGallery,
    variantSku,
    notifyMe,
    totalQuantiy,
  }
}

export const getProductVariant = (productDetailsState, productDetail) => {
  let imageArray = {}
  let variants = {}
  let selectedColor = ''

  if (
    !PRODUCT_TYPE.configuralProduct.title.includes(
      productDetailsState?.data?.[0]?.__typename
    )
  ) {
    const productData = productDetail?.products?.items?.[0]
    imageArray['product'] = {
      media_gallery: productData?.media_gallery,
      price_range: productData?.price_range,
      stock_status: productData?.stock_status_data?.stock_status,
    }

    variants = {
      colors: [],
      sizes: [],
      newImages: imageArray,
    }
    selectedColor = ''
  } else {
    for (const item of productDetailsState?.data?.[0]?.variants) {
      const { attributes, product } = item
      let colorAttr, sizeAttr

      for (const attr of attributes) {
        if (attr.code === ATTRIBUTE.color.title) {
          colorAttr = attr
        } else if (attr.code === ATTRIBUTE.size.title) {
          sizeAttr = attr
        }
      }

      const colorIndex = colorAttr?.value_index
      const sizeIndex = sizeAttr?.value_index

      if (!imageArray[colorIndex]) {
        imageArray[colorIndex] = {}
      }

      if (sizeAttr) {
        if (colorIndex) {
          imageArray[colorIndex][sizeIndex] = {
            product,
          }
        } else {
          imageArray[sizeIndex] = {
            product,
          }
        }
      } else if (colorIndex) {
        imageArray[colorIndex] = { product }
      }
    }
    const colorAndSize =
      productDetailsState?.data?.[0]?.configurable_options.reduce(
        (acc, option) => {
          const cloneAcc = { ...acc }
          switch (option.attribute_code) {
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
    variants = {
      colors: colorAndSize?.colors[0],
      sizes: colorAndSize?.sizes[0],
      newImages: imageArray,
    }
    /* if (productDetailsState?.selectedColor) {
      return
    } */
    selectedColor =
      productDetailsState?.selectedColor || Object?.keys(imageArray)?.[0]
  }
  return { variants, selectedColor }
}

export const getProductSelectedSize = (productDetailsState) => {
  let foundSize
  if (
    PRODUCT_TYPE.configuralProduct.title.includes(
      productDetailsState?.data?.[0]?.__typename
    ) &&
    productDetailsState?.selectedColor &&
    productDetailsState?.productVariants?.newImages
  ) {
    const colorVariant =
      productDetailsState?.productVariants.newImages?.[
        productDetailsState?.selectedColor
      ]

    if (
      colorVariant &&
      productDetailsState?.productVariants?.sizes?.length > 0
    ) {
      foundSize = Object.keys(colorVariant)?.find(
        (id) =>
          colorVariant?.[id]?.product?.stock_status_data?.stock_status ===
          IN_STOCK
      )

      /* if (!productDetailsState?.selectedSize) {
        dispatch(productSelectedSizeAction(foundSize))
      } */
    }
  }
  return { foundSize }
}

export const addToCart = async ({
  addTocartRes,
  item,
  sku,
  parentSku,
  qty,
}) => {
  const isItemAvailable = item && Object.keys(item).length > 0
  let queryOptions = {
    ...AddToCartReq,
    variables: {
      cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
      quantity: qty || 1,
      sku: item.sku,
    },
  }
  if (!isItemAvailable) {
    queryOptions = {
      ...AddToCartConfigReq,
      variables: {
        ...queryOptions.variables,
        sku,
        parent_sku: parentSku,
      },
    }
  }
  addTocartRes.run(request, queryOptions)
}

export const getColor = (productVariants) => {
  const color =
    productVariants?.colors?.length > 0 &&
    productVariants.colors.map((colorName) => {
      return { label: colorName.label, value: colorName.value_index }
    })
  return color
}

export async function createCart(dispatch) {
  const cartId =
    typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.cartId)
  if (!cartId) {
    const result = await request({
      ...CreateCartId,
    })
    localStorage.setItem(STORAGE_KEYS.cartId, result?.createEmptyCart)
    if (result) {
      // dispatch(miniCartData())
    }
  } else if (dispatch) {
    dispatch(miniCartData())
  }
}

export const getSelectedColor = ({ color, productState }) => {
  const selectedColorValue =
    color.length > 0 &&
    color.find(
      (selectedColor) =>
        selectedColor.value.toString() ===
          productState?.selectedColor.toString() && selectedColor
    )
  return selectedColorValue
}

export function getPipelineVariantLabels(configurableOptions) {
  if (configurableOptions?.length) {
    return configurableOptions.map((i) => i?.value_label).join(' | ')
  }
  return ''
}

export function stockStatushandler(productDetail) {
  if (productDetail) {
    const status =
      (PRODUCT_TYPE.configuralProduct.title.includes(
        productDetail.product.__typename
      ) &&
        productDetail?.configured_variant?.stock_status === OUT_OF_STOCK) ||
      (PRODUCT_TYPE.simpleProduct.title.includes(
        productDetail.product.__typename
      ) &&
        productDetail?.product?.stock_status === OUT_OF_STOCK)

    return status
  }
}

const SUBTOTAL_DISPLAY_ORDER = Object.keys(CART_QUERY_PRICES_KEYS).map(
  (key) => CART_QUERY_PRICES_KEYS[key].key
)
/**
 * Represents the price data for a cart.
 *
 * @param {Object} priceData
 * @param {Object} grand_total - The grand total price.
 * @param {number} grand_total.value - The value of the grand total price.
 * @param {string} grand_total.currency - The currency of the grand total price.
 * @param {string} grand_total.__typename - The type of the grand total price.
 * @param {Object} subtotal_including_tax - The subtotal including tax price.
 * @param {string} subtotal_including_tax.currency - The currency of the subtotal including tax price.
 * @param {number} subtotal_including_tax.value - The value of the subtotal including tax price.
 * @param {string} subtotal_including_tax.__typename - The type of the subtotal including tax price.
 * @param {Object} subtotal_excluding_tax - The subtotal excluding tax price.
 * @param {string} subtotal_excluding_tax.currency - The currency of the subtotal excluding tax price.
 * @param {number} subtotal_excluding_tax.value - The value of the subtotal excluding tax price.
 * @param {string} subtotal_excluding_tax.__typename - The type of the subtotal excluding tax price.
 * @param {Object[]} cgst - The CGST (Central Goods and Services Tax) segments.
 * @param {string} cgst[].code - The code of the CGST segment.
 * @param {number} cgst[].value - The value of the CGST segment.
 * @param {string} cgst[].__typename - The type of the CGST segment.
 * @param {Object[]} sgst - The SGST (State Goods and Services Tax) segments.
 * @param {number} sgst[].value - The value of the SGST segment.
 * @param {string} sgst[].code - The code of the SGST segment.
 * @param {string} sgst[].currency - The currency of the SGST segment.
 * @param {string} sgst[].__typename - The type of the SGST segment.
 * @param {Object[]} shipping_cgst - The CGST segments for shipping.
 * @param {Object[]} shipping_sgst - The SGST segments for shipping.
 * @param {Object[]} discounts - The discounts applied to the cart.
 * @param {Object} discounts[].amount - The amount of the discount.
 * @param {number} discounts[].amount.value - The value of the discount amount.
 * @param {string} discounts[].amount.currency - The currency of the discount amount.
 * @param {string} discounts[].amount.__typename - The type of the discount amount.
 * @param {string} discounts[].label - The label of the discount.
 * @param {string} discounts[].__typename - The type of the discount.
 * @param {string} __typename - The type of the cart prices.
 * @param {string} appliedCoupon - Coupon name
 */
export function getSubtotalContent(priceData, appliedCoupon) {
  /* 
  Display order
  Subtotal
  Shipping & Handling
  CGST
  SGST
  Shipping CGST
  Shipping SGST
  Store Credit
  Grand Total
  */

  /**
   * to have data as per display order
   */

  const returnData = []

  if (!priceData) return returnData

  const orderedPriceData = SUBTOTAL_DISPLAY_ORDER.map((orderKey) =>
    priceData[orderKey] ? { [orderKey]: priceData[orderKey] } : ''
  )

  orderedPriceData.forEach((data) => {
    const dataKey = Object.keys(data)[0]
    const itemData = priceData[dataKey]

    if (
      itemData &&
      (itemData?.value || itemData[0]?.value || itemData[0]?.amount?.value)
    ) {
      switch (dataKey) {
        case CART_QUERY_PRICES_KEYS.subtotalExcludingTax.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.subtotalExcludingTax.intlID,
            value: '₹' + itemData?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.discounts.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.discounts.intlID,
            value: `(${appliedCoupon}) - ₹${itemData[0]?.amount.value}`,
          })
          break
        case CART_QUERY_PRICES_KEYS.storeCredit.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.storeCredit.intlID,
            value: `- ₹${itemData?.value}`,
          })
          break
        case CART_QUERY_PRICES_KEYS.cgst.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.cgst.intlID,
            value: '₹' + itemData[0]?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.sgst.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.sgst.intlID,
            value: '₹' + itemData[0]?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.igst.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.igst.intlID,
            value: '₹' + itemData[0]?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.utgst.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.utgst.intlID,
            value: '₹' + itemData[0]?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.shipping.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.shipping.intlID,
            value: '₹' + itemData?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.shippingCgst.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.shippingCgst.intlID,
            value: '₹' + itemData[0]?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.shippingSgst.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.shippingSgst.intlID,
            value: '₹' + itemData[0]?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.shippingIgst.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.shippingIgst.intlID,
            value: '₹' + itemData[0]?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.shippingUtgst.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.shippingUtgst.intlID,
            value: '₹' + itemData[0]?.value,
          })
          break
        case CART_QUERY_PRICES_KEYS.grandTotal.key:
          returnData.push({
            intlID: CART_QUERY_PRICES_KEYS.grandTotal.intlID,
            value: '₹' + itemData?.value,
          })
          break
        // addresses?.[0]?.available_shipping_methods
        default:
          break
      }
    }
  })
  return returnData
}
