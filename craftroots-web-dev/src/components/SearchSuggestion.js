import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, CardEmpty, SkeletonProductItem } from './generic'
import { setSearchOverlayActive } from '@/actions/productSearchAction'
import { iconEmptySearch } from '@/assets/images'
const ProductListItem = dynamic(() => import('./generic/ProductListItem'))

const MAX_PRODUCT_ITEMS = 3
function SearchSuggestion(props) {
  const dispatch = useDispatch()
  const intl = useIntl()
  function handleViewProducts() {
    if (props.onViewProductsClick) {
      props.onViewProductsClick()
    }
    dispatch(setSearchOverlayActive(false))
  }
  return (
    <div
      className={`p-3 bg-white md:shadow-md md:border grow md:block flex flex-col md:max-h-[70vh] md:overflow-auto ${props.className}`}
      tabIndex="-1"
    >
      {props.products?.length > 0 && !props.loading && (
        <>
          <div className="grow overflow-y-auto mb-3">
            <div className="md:grid-cols-3 grid-cols-2 grid gap-4 mb-3">
              {props.products.map((product, pIndex) => (
                <ProductListItem
                  key={product.id + '' + pIndex}
                  {...product}
                  productId={product.id}
                  imageWrapperClass="max-h-64 inline-block"
                  colorGroupName={product.url_key + pIndex}
                  typeName={product.__typename}
                  configurableOptions={product.configurable_options}
                  image={product.small_image?.url}
                />
              ))}
            </div>
          </div>
          {props.totalCounts > MAX_PRODUCT_ITEMS && (
            <Button
              className="shrink-0 mx-auto block"
              title={<FormattedMessage id="button.viewAllProducts" />}
              onClick={handleViewProducts}
            />
          )}
        </>
      )}
      {props.loading && (
        <div className="md:grid-cols-3 grid-cols-2 grid gap-4 mb-3">
          <SkeletonProductItem display={2} />
        </div>
      )}
      {!props.loading && props.products && !props.products.length && (
        <CardEmpty
          icon={iconEmptySearch}
          title={intl.formatMessage({
            id: 'empty.search.title',
          })}
          description={intl.formatMessage({
            id: 'empty.search.description',
          })}
        />
      )}
    </div>
  )
}

SearchSuggestion.propTypes = {
  products: PropTypes.object.isRequired,
  className: PropTypes.string,
  onViewProductsClick: PropTypes.func,
  loading: PropTypes.bool,
  totalCounts: PropTypes.number,
}

SearchSuggestion.defaultProps = {
  className: '',
  onViewProductsClick: () => {},
  loading: false,
  totalCounts: 0,
}

export default React.memo(SearchSuggestion)
