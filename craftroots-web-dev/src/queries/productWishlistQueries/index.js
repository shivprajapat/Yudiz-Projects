export const MutationAddToWishList = {
  mutation: `mutation addToWishList($product_id: Int!) {
    addItemToWishlist(
        product_id: $product_id
        ) {
            message
            success
        }
      }`,
}

export const MutationRemoveItemFromWishlist = {
  mutation: `mutation removeItemFromWishlist($product_id: Int!) {
        removeFromWishlist(
          product_id: $product_id
          ) {
              message
              success
          }
        }`,
}

export const GetWishList = {
  query: `query GetWishList{
    customer{
    wishlist {
        items_count
        sharing_code
        updated_at
        items {
            id
            qty
            description
            added_at
            product {
                id
                sku
                name
                small_image {
                    url
                }
                type_id
                url_key
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
        }
    }
  }
}
`,
  fetchPolicy: 'no-cache',
}
