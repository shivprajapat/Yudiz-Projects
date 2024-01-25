export const ProductSearch = {
  query: `query productSearch($searchKey: String!, $currentPage: Int = 1, $pageSize: Int = 3) {
	products(search: $searchKey, currentPage: $currentPage, pageSize: $pageSize) {
		items {
			id
			name
			small_image {
				url
			}
			url_key
			sku
			url_suffix
			price_range {
				minimum_price {
					final_price {
						value
						currency
					}
				}
				maximum_price {
					final_price {
						value
						currency
					}					
				}
			}
            ... on ConfigurableProduct {
				configurable_options {
					attribute_code
					attribute_id
					id
					label
					values {
						label
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
						thumbnail {url}
						media_gallery {url}
						sku
						stock_status
					}
				}
			}
		}
		page_info {
			total_pages
		}
		total_count
	}
}
`,
}
