import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Meta, SkeletonProductListing } from '@/components/generic'
import { productListReq } from '@/helper'
import { BRAND_NAME } from '@/helper/constant'
import META from '@/helper/meta-constant'

const ProductListing = dynamic(
  () => import('@/components/generic/ProductListing'),
  {
    loading: () => <SkeletonProductListing />,
  }
)
function CategoryProductList({ result, rootCatId, metaTags, breadCrumbsRes }) {
  let pageTitle = 'Shop'

  if (
    metaTags?.categoryList?.length > 0 &&
    !metaTags?.categoryList?.[0]?.meta_title
  ) {
    const categoryName = breadCrumbsRes?.category?.url_path
      .split('/')
      .slice(-1)[0]
    pageTitle =
      categoryName.charAt(0).toUpperCase() +
      categoryName.slice(1) +
      ' | ' +
      BRAND_NAME
  } else {
    pageTitle = metaTags?.categoryList?.[0]?.meta_title
  }

  const finalTitle = pageTitle
  return (
    <>
      {metaTags && (
        <Meta
          title={finalTitle}
          keyword={
            metaTags?.categoryList[0]?.meta_keywords ||
            META.commonContent.keywords
          }
          description={
            metaTags?.categoryList[0]?.meta_description ||
            META.commonContent.description
          }
          canonicaUrl={metaTags?.categoryList[0]?.canonical_url}
        />
      )}
      <ProductListing
        result={result}
        rootCatId={rootCatId?.toString()}
        metaTags={metaTags}
        breadCrumbsRes={breadCrumbsRes?.category}
      />
    </>
  )
}

export default CategoryProductList

CategoryProductList.propTypes = {
  result: PropTypes.object,
  rootCatId: PropTypes.number.isRequired,
  metaTags: PropTypes.object,
  breadCrumbsRes: PropTypes.object,
}

CategoryProductList.defaultProps = {
  result: {},
  metaTags: null,
  breadCrumbsRes: undefined,
}

export async function getServerSideProps(context) {
  try {
    const { query, res } = context
    const subcat = query.slug
    const url = subcat ? '/shop/' + subcat.join('/') + '.html' : '/shop.html'
    const { result, rootCatId, metaTags, breadCrumbsRes } =
      await productListReq(query, url)

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=59, stale-while-revalidate=59'
    )

    return { props: { result, rootCatId, metaTags, breadCrumbsRes } }
  } catch (error) {
    console.log('error', error)
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }
}
