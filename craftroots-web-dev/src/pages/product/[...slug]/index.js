import React from 'react'
import PropTypes from 'prop-types'

import useModal from '@/hooks/useModal'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import { request } from '@/services/api.service'
import { AdditionalInfo, ProductDetail } from '@/queries'
import ProductDetailsPage from '@/components/Product/ProductDetailsPage'

const ProductDetails = ({ productDetail, additionalInfo }) => {
  const { isShowing } = useModal()
  useDisableBodyScroll(isShowing)

  return (
    <div className="product-details">
      <ProductDetailsPage
        productDetail={productDetail}
        additionalInfo={additionalInfo}
      />
    </div>
  )
}

export default ProductDetails
ProductDetails.propTypes = {
  productDetail: PropTypes.object,
  additionalInfo: PropTypes.object,
}

export const getServerSideProps = async (ctx) => {
  try {
    const { slug } = ctx.params
    const productDetail = await request({
      ...ProductDetail,
      variables: { url_key: slug[0] },
    })
    // Check if product data is invalid or not found
    if (!productDetail?.products?.items?.length) {
      // Redirect to custom 404 page
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      }
    }

    let additionalInfo
    if (productDetail?.products?.items?.[0]?.sku) {
      additionalInfo = await request({
        ...AdditionalInfo,
        variables: { sku: productDetail?.products?.items?.[0]?.sku },
      })
    }
    ctx.res.setHeader(
      'Cache-Control',
      'public, s-maxage=59, stale-while-revalidate=59'
    )
    return { props: { productDetail, additionalInfo } }
  } catch (error) {
    return { props: { productDetail: null, additionalInfo: null } }
  }
}
