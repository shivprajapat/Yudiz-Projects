export const ProductDetail = {
  query: `query ProductDetail($url_key:String!){
	products(
		filter: { url_key: { eq: $url_key } }
	) {
		items {
			__typename
			category_flag
			notify_me
			canonical_url
			categories {
				id
				breadcrumbs {
					category_id
					category_url_path
					category_url_key
				}
			}

			id
			meta_description
			meta_title
			meta_keyword
			name
			special_price
			description {
				html
			}
			small_image{
        url
      }
			short_description {
				html
			}
			thumbnail {
				url
			}
			mp_sizeChart{
				rule_content
				template_styles
			  }
			price_range {
				minimum_price {
					regular_price {
						value
						currency
					}
					final_price {
						value
						currency
					}
					discount {
						amount_off
						percent_off
					}
				}
				maximum_price {
					regular_price {
						value
						currency
					}
					final_price {
						value
						currency
					}
					discount {
						amount_off
						percent_off
					}
				}
			}
			sku
			stock_status
			only_x_left_in_stock
			rating_summary
			review_count
			url_key
			... on SimpleProduct {
				stock_status_data {
					stock_status
					low_stock_qty
					qty
				}
				price_range {
					minimum_price {
						regular_price {
							value
							currency
						}
						final_price {
							value
							currency
						}
						discount {
							amount_off
							percent_off
						}
					}
					maximum_price {
						regular_price {
							value
							currency
						}
						final_price {
							value
							currency
						}
						discount {
							amount_off
							percent_off
						}
					}
				}
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
				
			}
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
						notify_me
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
						only_x_left_in_stock
						price_range {
							minimum_price {
								regular_price {
									value
									currency
								}
								final_price {
									value
									currency
								}
								discount {
									amount_off
									percent_off
								}
							}
							maximum_price {
								regular_price {
									value
									currency
								}
								final_price {
									value
									currency
								}
								discount {
									amount_off
									percent_off
								}
							}
						}
					}
				}
			}
		}
	}
}
`,
  fetchPolicy: 'network-only',
}

export const AdditionalInfo = {
  query: `query AdditionalInfo($sku:String!){
			moreInfoProducts(sku: $sku) {
				data {
					attribute_code
					label
					value
				}
			}
		}
	`,
}

export const RelatedProduct = {
  query: `query RealtedProduct($sku:String!){
		relatedProduct(sku: $sku) {
			data {
				child{
					childId
					childSku
					childName
					childImage
					childstockstatus
					configurable_options{
						Attribute_code
						Attribute_id
						attribute_options{
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
				price_range{
						maximum_price{
						final_price{
							value
							currency
							
						}
						regular_price{
							value
							currency
						
						}
						discount{
							amount_off
							percent_off
						}
					 
					}
					minimum_price{
						final_price{
							value
							currency
						}
						regular_price{
							value
							currency
						}
						discount{
							amount_off
							percent_off
						}
					}
				}
				rating_summary
				regularPrice
				review_count
				sku
				specialPrice
				stock_status_data{
					qty
					stock_status
				}
				type
				urlkey
			}
		}
	}
	`,
}

export const GetProductReview = {
  query: `query GetProductReviews($product_id: Int){
		productReviews(product_id: $product_id) {
			avgRating
			current_page
			data {
				created_at
				detail
				nickname
				product_img
				product_name
				rating
				review
				review_id
				status
				url_key
			}
			limit
			ratingStarCount
			totalRating
			totalStarts
			total_count
		}
	}
		
	`,
}

export const PinCodeCheck = {
  query: `query PinCodeCheck($pin_code: Int!){
		pincodecheck(deliveryPostCode: $pin_code) {
		  message
		  status
		}
	  }`,
}

export const MpProductAlertNotifyInStock = {
  mutation: `mutation MpProductAlertNotifyInStock($email:String!, $productSku: String!){
		MpProductAlertNotifyInStock(input:{email: $email, productSku: $productSku})
		 {
			message
		}
	}
	
	`,
}
