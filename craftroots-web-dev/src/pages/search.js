import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { Meta, SkeletonProductItem } from '@/components/generic'
import {
  capitalFirstCharacter,
  getSearchMetaContent,
  productListReq,
} from '@/helper'
import { ALL_PRODUCT_CAT_ID_URL } from '@/helper/constant'
const ProductListing = dynamic(
  () => import('../components/generic/ProductListing'),
  {
    loading: () => <SkeletonProductItem />,
  }
)

function Search({ result, rootCatId, searchQuery }) {
  const intl = useIntl()
  const router = useRouter()
  const searchPageTitlePrefix = intl.formatMessage({
    id: 'page.search.result.title',
  })
  const pageTitle = searchPageTitlePrefix + ' - ' + searchQuery
  const capitalizedSearchName = capitalFirstCharacter(searchQuery)

  const hasSearchedItems = result?.products?.items?.length > 0
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const currentPath = router.asPath
  const { keyword, description } = getSearchMetaContent(capitalizedSearchName)
  return (
    <>
      <Meta
        title={pageTitle}
        keyword={(hasSearchedItems && keyword) || ''}
        description={(hasSearchedItems && description) || ''}
        canonicalUrl={(hasSearchedItems && baseUrl + currentPath) || baseUrl}
      />
      <ProductListing
        result={result}
        pageTitle={<h1 className="mt-4 mb-3 text-xl">{pageTitle}</h1>}
        rootCatId={rootCatId?.toString()}
      />
    </>
  )
}

Search.propTypes = {
  result: PropTypes.object,
  rootCatId: PropTypes.number.isRequired,
  searchQuery: PropTypes.string,
}

Search.defaultProps = {
  result: {},
  searchQuery: '',
}

export async function getServerSideProps(context) {
  try {
    const { query } = context
    const { result, rootCatId } = await productListReq(
      query,
      ALL_PRODUCT_CAT_ID_URL.url
    )
    return { props: { result, rootCatId, searchQuery: query.query } }
  } catch (error) {
    return { props: { result: {}, rootCatId: null, searchQuery: '' } }
  }
}

export default Search
