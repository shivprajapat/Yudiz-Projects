import { CART_PRICES, CART_SHIPPING_ADDRESSES } from '../cartQueries'

export const EmailExist = {
  query: `query EmailCheck($email: String!){
        isEmailAvailable(email: $email) {
            is_email_available
        }
      }
      `,
  fetchPolicy: 'network-only',
}

export const GuestEmailRegister = {
  mutation: ` mutation GuestEmailRegister($cart_id : String!, $email: String!) {
    setGuestEmailOnCart(input: { cart_id: $cart_id, email: $email }) {
     cart {
      email
      }
   }
 }
 `,
}

export const SetShippingAddress = {
  mutation: `mutation SetShippingAddress($cart_id : String!,$shipping_addresses: [ShippingAddressInput]!) {
    setShippingAddressesOnCart(
   input: {
        cart_id: $cart_id,
        shipping_addresses: $shipping_addresses
      }
    ) {
      cart {
          same_as_shipping:addressesAreSame
           id
          is_virtual
         applied_coupons{
           code
         }
         billing_address {
          firstname
          id
          lastname
          country {
              code
          }
          street
          city
          region {
              code
              region_id
              label
          }
          postcode
          telephone
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
              product {
                  id
                  name
                  sku
                  
                  small_image {
                      url
                      label
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
              }
              quantity
              ... on ConfigurableCartItem {
                  configurable_options {
                      id
                      option_label
                      value_id
                      value_label
                  }
                  configured_variant{
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
          shipping_addresses{
            selected_shipping_method{
              amount{
                currency
                value
              }
              carrier_code
              carrier_title
              method_code
              method_title
            }
           available_shipping_methods{
                amount{
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
           country{
             label
             code
           }
           city
           street
           region{
             label
             code
             region_id
           }
           postcode
           telephone
          }
     total_quantity
      }
      }
    }
  `,
  fetchPolicy: 'network-only',
}

export const SetBillingAddress = {
  mutation: `mutation SetBillingAddress($cart_id : String!,$billing_address: BillingAddressInput!) {
    setBillingAddressOnCart(
      input: {
           cart_id: $cart_id,
           billing_address: $billing_address
         }
       ) {
         cart {
              id
              same_as_shipping:addressesAreSame
              billing_address {
                          id
                         firstname
                         lastname
                         country {
                             code
                         }
                         street
                         city
                         region {
                             code
                             region_id
                             label
                         }
                         postcode
                         telephone
                     }
             is_virtual
             email
            applied_coupons{
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
                 product {
                     id
                     name
                     sku
                     
                     small_image {
                         url
                         label
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
                 }
                 quantity
                 ... on ConfigurableCartItem {
                     configurable_options {
                         id
                         option_label
                         value_id
                         value_label
                     }
                     configured_variant{
                     stock_status
                     sku
                   }
                 }
             }
             ${CART_PRICES}
             ${CART_SHIPPING_ADDRESSES}
        total_quantity
         }
         }
     
    }
  `,
  fetchPolicy: 'network-only',
}

export const CountriesShipping = {
  query: `query GetCountriesShipping{
    countries {
      full_name_english
      id
    }
  
  }`,
  fetchPolicy: 'cache-first',
}

export const StatesShipping = {
  query: `query GetStatesShipping($country_code: String!){
    country(id: $country_code) {
      available_regions {
        code
        id
        name
      }
      full_name_english
      id
    }
  }
  `,
  fetchPolicy: 'cache-first',
}

export const SetShippingMethod = {
  mutation: `mutation SetShippingMethod($cart_id: String! , $shipping_methods:[ShippingMethodInput]!){
    setShippingMethodsOnCart(
      input: { cart_id: $cart_id, shipping_methods: $shipping_methods }
    ) {
      cart {
       
           id
          is_virtual
         applied_coupons{
           code
         }
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
              prices {
                  price {
                      value
                  }
                  row_total {
                      value
                  }
              }
              product {
                  id
                  name
                  sku
                  
                  small_image {
                      url
                      label
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
              }
              quantity
              ... on ConfigurableCartItem {
                  configurable_options {
                      id
                      option_label
                      value_id
                      value_label
                  }
                  configured_variant{
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
            subtotal_including_tax{
              currency
              value
            }
            subtotal_excluding_tax{
              currency
              value
            }
          }  
          shipping_addresses{
            selected_shipping_method{
              amount{
                currency
                value
              }
              carrier_code
              carrier_title
              method_code
              method_title
            }
           available_shipping_methods{
                amount{
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
           country{
             label
             code
           }
           city
           street
           region{
             label
             code
             region_id
           }
           postcode
           telephone
          }
          ${CART_PRICES}
          ${CART_SHIPPING_ADDRESSES}
     total_quantity
      }
      }
    }
  `,
  fetchPolicy: 'network-only',
}

export const GetAddressses = {
  query: ` query GetAddresses{
    customer {
        id
        email
        firstname
        lastname
        mobilenumber
        is_subscribed
        default_billing
        default_shipping
        dob
      addresses {
            id
            firstname
            lastname
            street
            city
            region {
                region_code
                region_id
                region
            }
            postcode
            country_code
            telephone
            default_billing
           default_shipping
        }
        wishlist {
            items_count
        }
        compare_list {
            item_count
        }
    }

  }  
`,
  fetchPolicy: 'network-only',
}

export const AddAddressLogin = {
  mutation: `mutation AddAddressLogin($address: CustomerAddressInput!){
    createCustomerAddress(
      input: $address
    ){
      id
      region{
        region
        region_code
      }
      country_code
      street
      telephone
      postcode
      city
      firstname
      lastname
      default_shipping
      default_billing
    }
  }
  `,
}

export const DeleteAdress = {
  mutation: `mutation DeleteAdresss($id: Int!){
    deleteCustomerAddress(id: $id)
  }
  `,
}

export const UpdateAddress = {
  mutation: `mutation UpdateAddress($id: Int!,$address: CustomerAddressInput) {
    updateCustomerAddress(
      id: $id
      input: $address
    ) {
      id
      street
      city
      postcode
      firstname
      lastname
      country_code
      region{
        region
        region_id
        region_code
      }
    }
  }
  
  `,
}

export const SetPaymentMethodOnCart = {
  mutation: `mutation SetPaymentMethodOnCart($cart_id:String!,$code: String!) {
    setPaymentMethodOnCart(input: { cart_id: $cart_id,payment_method:{code:$code} }) {
      cart {
        selected_payment_method {
          code
        }
      }
    }
  }
  `,
}
export const PlaceOrder = {
  mutation: `mutation PlaceOrder($cart_id:String!) {
    placeOrder(input: { cart_id: $cart_id }) {
      order {
        order_number
      }
    }
  }
  `,
  fetchPolicy: 'no-cache',
}
export const PlaceRazorpayOrder = {
  mutation: `mutation PlaceRazorpayOrder($order_id:String!, $referrer:String!) {
    placeRazorpayOrder( order_id: $order_id, referrer: $referrer ) {
    success
    rzp_order_id
    order_id
    amount
    currency
    message
    }
  }
  `,
  fetchPolicy: 'no-cache',
}

export const SetRzpPaymentDetailsForOrder = {
  mutation: `mutation SetRzpPaymentDetailsForOrder($order_id:String!, $rzp_payment_id:String!, $rzp_signature:String!){
    setRzpPaymentDetailsForOrder (
      input: {
        order_id: $order_id
        rzp_payment_id: $rzp_payment_id
        rzp_signature: $rzp_signature
      }
    ){
    order{
      order_id
    }
    }
  }
  `,
  fetchPolicy: 'no-cache',
}

export const ResetCart = {
  mutation: `mutation ResetCart($order_id:String!) {
    resetCart (
      order_id: $order_id
    ){
      success
    }
  }`,
  fetchPolicy: 'no-cache',
}

export const OrderDetails = {
  query: `
  query OrderDetails($id: Int!){
    orderDetails(id:$id) {
      billing_address
      cgst_amount
      comment {
        comment
        create_at
      }
      created_at
      customer_email
      customer_firstname
      customer_lastname
      customer_name
      discount_amount
      discount_amount_for_refund
      discount_description
      grand_total
      hasCreditmemos
      hasInvoices
      hasShipments
      increment_id
      invoice_id
      items {
        discount_amount
        discount_amount_for_refund
        id
        image
        name
        options {
          option_label
          value_label
        }
        price
        qty_ordered
        qty_refund
        qty_shipped
        row_total
        row_total_for_refund
        sku
        status
        sub_total
        tax_amount
        tax_amount_for_refund
        tax_percent
      }
      mp_extra_fee
      payment
      pos
      sgst_amount
      shipping
      shipping_address
      shipping_cgst_amount
      shipping_method
      shipping_sgst_amount
      status
      subtotal
      tax
      tax_for_refund
      telephone
      igst_amount
      shipping_igst_amount
    }
  }
  
  `,
  fetchPolicy: 'no-cache',
}
// export const SetLoginAddress ={
//   mutation : `mutation SetLoginAddress($cart_id: String!,){
//     setShippingAddressesOnCart(cart_id: $cart_id)
//   } `
// }

// {
//   region: {
//     region: "Gujarat"
//     region_code: "580"
//   }
//   country_code: IN
//   street: "Ahmedabad"
//   telephone: "0123456789"
//   postcode: "380015"
//   city: "Ahmedabad"
//   firstname: "Payal"
//   lastname: "Patel"
//   default_shipping: true
//   default_billing: false
// }

export const OrderCancel = {
  mutation: `mutation OrderCancel($id:String!){
    orderCancel(input: {
      id:$id
    }) {
      message
    }
  }
  `,
}

export const ApplyStoreCredit = {
  mutation: `mutation ApplyStoreCredit($cart_id: String!, $amount: Float!) {
    applyStoreCreditToCart(input: { cart_id: $cart_id ,amount:$amount}) {
      message
      status
    }
  }  
  `,
}

export const RemoveStoreCredit = {
  mutation: `mutation RemoveStoreCredit($cart_id: String!) {
    removeStoreCreditFromCart(input: { cart_id: $cart_id}) {
      status
    }
  }  
  `,
}
