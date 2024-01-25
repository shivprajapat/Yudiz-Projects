const priceValues = `
  final_price {
    value
    currency
  }
  regular_price {
    value
    currency
  }
`

export const NewCollection = {
  query: `query NewCollection( $limit: Int,$current_page: Int) {
    latestProducts (current_page: $current_page, limit: $limit) {
      data {
        categoryId
        child {
          childId
          childSku
          childName
          childImage
          childstockstatus
          configurable_options {
            Attribute_code
            Attribute_id
            attribute_options {
              label
              value
              code
            }
          }
        }
        description
        final_price
        id
        image
        name
        price
        price_range {
          maximum_price {
            ${priceValues}
          }
          minimum_price {
            ${priceValues}
          }
        }
        rating_summary
        regularPrice
        review_count
        sku
        specialPrice
        stock_status_data {
          stock_status
          qty
        }
        type
        urlkey
      }
    }
  }
  
  `,
}

export const ExhibitionBanner = {
  query: `query{
    exhibitionBanner {
      data {
        exhibitionBannerImage
      }
    }
  }
  `,
}

export const RegionData = {
  query: `query DiscoverRegion
  {
    discoverByRegion {
      attributeCode
      data {
        attributes
        profile
        title
      }
    }
  }`,
  fetchPolicy: 'cache-first',
}

export const ArtisanStory = {
  query: `query{
    artisanStory {
      data {
        description
        name
        occupation
        profile
        title
      }
    }
  }
  `,
  fetchPolicy: 'cache-first',
}

export const BannerItems = {
  query: `query HomeBanner{
    banner {
      data {
        bannerButtonText
        bannerImage
        bannerMobileImage
        bannerTitle
        bannerUrlKey
        bannerText
      }
    }
  }`,
  fetchPolicy: 'cache-first',
}

export const HarmoniousData = {
  query: `query Harmoniusdata{
    harmonious {
      data {
        name
        id
        price
        productImage
        productUrl
        sku
        title
      }
      mainBannner
    }
  }
  `,
}

export const CreateCartId = {
  mutation: `mutation CreateCartId {
    createEmptyCart(input: {
    })
  }
  `,
}

export const Countries = {
  query: `query GetCountries{
  getAllCountry {
    data {
      country_code
      country_name
    }
}
  }`,
  fetchPolicy: 'cache-first',
}

export const States = {
  query: `query GetCountries($country_code: String!){
    getRegionData(country_id: $country_code) {
      data {
        region_code
        region_name
      }
    }
  
  }`,
  fetchPolicy: 'cache-first',
}

export const JoinUsFormData = {
  mutation: `mutation JoinUsForm($name: String,$email: String, $telephone:String, $country: String,
    $city: String, $state:String, $images: [ItemsIds]!,$designations: String) {
    joinUsForm(input: { 
      name:$name
      email:$email
      telephone:$telephone
      country:$country
      city:$city
      state:$state,
      designations:$designations,
      images: $images}) {
      message
      success
    }
  }
  `,
}

export const CreateEmptyCartId = {
  mutation: `mutation CreateEmptyCartId {
    createEmptyCart
  }
  `,
}

export const MergeCart = {
  mutation: `mutation MergeCart($source_cart_id: String!, $destination_cart_id: String!){
    mergeCarts(source_cart_id: $source_cart_id , destination_cart_id: $destination_cart_id) {
      id
      items {
        id
        uid
        product {
          id
         name
          sku
        }
      }
    }
  }`,
}

export const CreateCustomerCart = {
  query: `query CustomerCart{
      customerCart{
        id
      }
    
  }`,
  fetchPolicy: 'no-cache',
}

export const InstagramData = {
  query: `query InstagramData($limit:Int!){
    instagramPost(limit: $limit) {
      data {
        caption
        id
        media_type
        media_url
        permalink
        thumbnail_url
      }
    }
  }`,
}
