export const ProductList = {
  query: `query productListById(
        $filter: ProductAttributeFilterInput = {}
        $sort: ProductAttributeSortInput = {}
        $pageSize: Int
        $currentPage: Int
        $search: String = ""
    ) {
        products(
            filter: $filter
            sort: $sort
            pageSize: $pageSize
            currentPage: $currentPage
            search: $search
        ) {
            items {
                id
                name
                price_range {
                    maximum_price {
                        regular_price {
                            currency
                            value
                        }
                        final_price {
                            value
                            currency
                        }
                    }
                    minimum_price {
                        regular_price {
                            currency
                            value
                        }
                        final_price {
                            value
                            currency
                        }
                    }
                }
                sku
                small_image {
                    url
                }
                stock_status
                type_id
                url_key
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        id
                        label
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                            swatch_data {
                                ... on ImageSwatchData {
                                    thumbnail
                                }
                                value
                            }
                        }
                    }
                    variants {
                        attributes {
                            code
                            value_index
                        }
                        product {
                            id
                            media_gallery {
                                url
                                label
                                position
                                disabled
                                ... on ProductVideo {
                                    video_content {
                                        media_type
                                        video_provider
                                        video_url
                                        video_title
                                        video_description
                                        video_metadata
                                    }
                                }
                            }
                            stock_status_data {
                                stock_status
                                low_stock_qty
                                qty
                            }
                            sku
                            stock_status
                        }
                    }
                }
                url_suffix
            }
            page_info {
                total_pages
            }
            total_count
        }
    }`,
  fetchPolicy: 'cache-first',
}

export const Filterdata = {
  query: `query filterdata(
        $filter: ProductAttributeFilterInput = {}
        $search: String = ""
    ) {
        products(filter: $filter, search: $search) {
            aggregations {
                label
                count
                attribute_code
                options {
                    count
                    label
                    value
                }
            }
        }
    }`,
  fetchPolicy: 'cache-first',
}

export const FilterCategory = {
  query: `query categoryFilters($category_id: Int!){
        categoryFilters(category_id: $category_id) {
          data {
            label
            value
           Child{
              label
              value
            }
          }
         
        }
      }
      
      `,
  fetchPolicy: 'cache-first',
}

export const ResolveURL = {
  query: `query resolveUrl($urlKey: String!) {
        urlResolver(url: $urlKey) {
            type
            id
        }
    }
    `,
  fetchPolicy: 'cache-first',
}

export const Breadcrumbs = {
  query: `query Breadcrumbs($category_id: Int){
  category(id: $category_id) {
    breadcrumbs {
        category_id
        category_level
        category_name
        category_url_path
    }
    id
    name
    url_path
    url_suffix
    }
}
`,
  fetchPolicy: 'cache-first',
}

export const MetaTags = {
  query: `query Metatags($category_id: String){
        categoryList(filters: {ids: {eq: $category_id}}) {
          meta_title
          meta_keywords
          meta_description
          canonical_url
          }
        }`,
}
