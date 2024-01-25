import { CART_QUERY_PRICES_KEYS } from '@/helper/constant'

export const CART_SHIPPING_ADDRESSES = `shipping_addresses {
  selected_shipping_method {
    amount {
      currency
      value
    }
    carrier_code
    carrier_title
    method_code
    method_title
  }
  available_shipping_methods {
    amount {
      currency
      value
    }
    carrier_code
    carrier_title
    method_code
    method_title
  }
  id
  firstname
  lastname
  country {
    label
    code
  }
  city
  street
  region {
    label
    code
    region_id
  }
  postcode
  telephone
}
billing_address {
  city
  id
  country {
    code
    label
  }
  firstname
  lastname
  postcode
  region {
    code
    label
    region_id
  }
  street
  telephone
}`

export const CART_PRICES = `prices {
  ${CART_QUERY_PRICES_KEYS.grandTotal.key} {
    value
    currency
  }
  ${CART_QUERY_PRICES_KEYS.subtotalExcludingTax.key} {
    currency
    value
  }
  ${CART_QUERY_PRICES_KEYS.cgst.key} {
    code
    value
  }
  ${CART_QUERY_PRICES_KEYS.sgst.key} {
    value
    code
    currency
  }
  ${CART_QUERY_PRICES_KEYS.igst.key} {
    value
    code
    currency
  }
  ${CART_QUERY_PRICES_KEYS.shippingCgst.key} {
    code
    value
  }
  ${CART_QUERY_PRICES_KEYS.shippingSgst.key} {
    value
    code
  }
  ${CART_QUERY_PRICES_KEYS.shippingIgst.key} {
    value
    code
  }
  ${CART_QUERY_PRICES_KEYS.discounts.key} {
    amount {
      value
      currency
    }
    label
  }
}`

const CART_PRODUCTS = `product {
  id
  name
  sku
  url_key
  stock_status
  small_image {
    url
    label
  }
  stock_status_data {
    stock_status
    low_stock_qty
    qty
  }
  price {
    regularPrice {
      amount {
        value
      }
    }
    minimalPrice {
      amount {
        currency
        value
      }
    }
  }
}`

export const CART_DETAIL_FRAGMENT = (withVariable = false) =>
  `cart ${withVariable ? '(cart_id: $cart_id)' : ''} {
    id
    same_as_shipping:addressesAreSame
    is_virtual
    applied_coupons {
      code
    }
    email
    storecredit_applied {
      base_bss_storecredit_amount
  }
    available_payment_methods {
      code
      title
    }
    items {
      id
      item_image
      item_status
      total_qty
      prices {
        price {
          value
        }
        row_total {
          value
        }
      }
      ${CART_PRODUCTS}
      quantity
      ... on ConfigurableCartItem {
        configurable_options {
          id
          option_label
          value_id
          value_label
        }
        configured_variant {
          stock_status
          sku
          stock_status_data {
            stock_status
            low_stock_qty
            qty
          }
        }
      }
    }
    ${CART_PRICES}
    ${CART_SHIPPING_ADDRESSES}
    total_quantity
  }`

export const AddToCartReq = {
  mutation: `mutation addSimpleProductsToCart($cart_id: String!, $quantity: Float!, $sku: String!) {
    addSimpleProductsToCart(
      input: {
        cart_id: $cart_id
        cart_items: [{ data: { quantity: $quantity, sku: $sku } }]
      }
    ) {
      cart {
        id
        total_quantity
        storecredit_applied {
          base_bss_storecredit_amount
      }
        items {
          id
          item_image
          prices {
            price {
              value
            }
            row_total {
              value
            }
          }
          ${CART_PRODUCTS}
          quantity
          total_qty
          ... on ConfigurableCartItem {
            configurable_options {
              id
              option_label
              value_id
              value_label
            }
            configured_variant {
              stock_status
              sku
            }
          }
        }
        ${CART_PRICES}
        ${CART_SHIPPING_ADDRESSES}
        applied_coupons{
          code
        }
      }
    }
  }`,
}

export const AddToCartConfigReq = {
  mutation: `mutation AddToCartConfigReq(
    $cart_id: String!
    $quantity: Float!
    $sku: String!
    $parent_sku: String
  ) {
    addConfigurableProductsToCart(
      input: {
        cart_id: $cart_id
        cart_items: [
          { data: { quantity: $quantity, sku: $sku }, parent_sku: $parent_sku }
        ]
      }
    ) {
      cart {
        id
        total_quantity
        items {
          id
          item_image
          prices {
            price {
              value
            }
            row_total {
              value
            }
          }
          ${CART_PRODUCTS}
          quantity
          total_qty
          ... on ConfigurableCartItem {
            configurable_options {
              id
              option_label
              value_id
              value_label
            }
            configured_variant {
              stock_status
              sku
            }
          }
        }
        ${CART_PRICES}
        ${CART_SHIPPING_ADDRESSES}
        applied_coupons{
          code
        }
      }
    }
  }`,
}

export const RemoveItemCart = {
  mutation: `mutation RemoveItemCart($cart_id:String!,$cart_item_id: Int!) {
    removeItemFromCart(input: { cart_id: $cart_id,cart_item_id:$cart_item_id }) {
      ${CART_DETAIL_FRAGMENT()}
    }
  }`,
}

export const MiniCart = {
  query: `query MiniCart($cart_id: String!)
  {
    ${CART_DETAIL_FRAGMENT(true)}
  }`,
  fetchPolicy: 'no-cache',
}

export const UpdateItemQty = {
  mutation: `mutation UpdateItemQty($cart_id: String!,$cart_item_id: Int!,$quantity:Float) {
    updateCartItems(input: { cart_id: $cart_id, cart_items: [{cart_item_id:$cart_item_id,quantity:$quantity}] }) {
      ${CART_DETAIL_FRAGMENT()}
    }
  }`,
}

export const GetAllCouponCodes = {
  query: `query GetAllCouponCodes{
    allcouponcodes {
      data {
        couponCode
        couponDescription
        couponFromDate
        couponTitle
        coupontoDate
      }
    }
  }
  `,
}

export const ApplyCouponCode = {
  mutation: `mutation ApplyCouponCode($cart_id: String!, $coupon_code: String!) {
	applyCouponToCart(input: { cart_id: $cart_id, coupon_code: $coupon_code }) {
		cart {
			id
			is_virtual
			applied_coupons {
				code
			}
			available_payment_methods {
				code
				title
			}
			items {
				id
				item_image
				prices {
					price {
						value
					}
					row_total {
						value
					}
				}
				${CART_PRODUCTS}
				quantity
				... on ConfigurableCartItem {
					configurable_options {
						id
						option_label
						value_id
						value_label
					}
					configured_variant {
						stock_status
						sku
					}
				}
			}
			prices {
				grand_total {
					value
					currency
				}
			}
			shipping_addresses {
				selected_shipping_method {
					amount {
						currency
						value
					}
					carrier_code
					carrier_title
					method_code
					method_title
				}
				available_shipping_methods {
					amount {
						currency
						value
					}
					carrier_code
					carrier_title
					method_code
					method_title
				}
				street
			}
			total_quantity
		}
	}
}`,
}

export const RemoveCouponCode = {
  mutation: `mutation removeCouponFromCart($cart_id: String!) {
    removeCouponFromCart(input: { cart_id: $cart_id }) {
      cart {
        id
        is_virtual
        applied_coupons {
          code
        }
        available_payment_methods {
          code
          title
        }
        items {
          id
          item_image
          prices {
            price {
              value
            }
            row_total {
              value
            }
          }
          ${CART_PRODUCTS}
          quantity
          ... on ConfigurableCartItem {
            configurable_options {
              id
              option_label
              value_id
              value_label
            }
            configured_variant {
              stock_status
              sku
            }
          }
        }
        ${CART_PRICES}
        shipping_addresses {
          selected_shipping_method {
            amount {
              currency
              value
            }
            carrier_code
            carrier_title
            method_code
            method_title
          }
          available_shipping_methods {
            amount {
              currency
              value
            }
            carrier_code
            carrier_title
            method_code
            method_title
          }
          street
        }
        total_quantity
      }
    }
  }`,
}
