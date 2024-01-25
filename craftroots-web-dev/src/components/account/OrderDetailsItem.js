import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import NextImage from '../generic/NextImage'

function OrderDetailsProductItem({ product, orderId }) {
  return (
    <div className="flex justify-between items-start border-b border-grey-400 pt-10 pb-6 gap-2 flex-col sm:flex-row">
      <div className="flex gap-4 md:gap-6 w-full sm:w-fit">
        <div>
          <NextImage
            src={product.image}
            alt={product.name}
            className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
            width={64}
            height={64}
          />
        </div>
        <div className="flex-1">
          <h5 className="font-jost text-sm sm:text-base text-grey-900 font-medium mb-0 sm:mb-1 lg:text-lg line-clamp-2">
            {product.name}
          </h5>
          <div className="mb-1 flex gap-2 flex-col">
            <div className="flex items-center gap-4">
              <p className="text-sm text-grey-800 font-medium">
                <FormattedMessage id="orderId" />:{' '}
                <span className="mr-1">{orderId}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-grey-800 font-medium">
                <FormattedMessage id="page.productDetails.totalItems" /> :{' '}
                <span className="mr-1">{product.qty_ordered}</span>
              </p>
              <p className="text-sm text-grey-900 font-medium">
                <FormattedMessage id="page.productDetails.orderTotal" />:{' '}
                <span className="mr-1">{product.row_total}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <Button
        title="buy again"
        border
        className="!px-3.5 !py-1.5 sm:!py-[9px]"
        onClick={() => {}}
      /> */}
    </div>
  )
}

OrderDetailsProductItem.propTypes = {
  product: PropTypes.any.isRequired,
  orderId: PropTypes.string,
}
OrderDetailsProductItem.defaultProps = {
  orderId: '',
}

export default OrderDetailsProductItem
