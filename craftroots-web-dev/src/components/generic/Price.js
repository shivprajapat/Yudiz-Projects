import PropTypes from 'prop-types'
import { PRODUCT_TYPE } from '@/helper/constant'
import { getDisplayPrice } from '@/helper'

function Price({ price, productType, className }) {
  return (
    <p className={className}>
      {getDisplayPrice(
        price,
        PRODUCT_TYPE.configuralProduct.title.includes(productType)
      )}
    </p>
  )
}

export default Price
Price.propTypes = {
  price: PropTypes.number,
  className: PropTypes.string,
  productType: PropTypes.string.isRequired,
}

Price.defaultProps = {
  className: '',
  price: 0,
  productType: '',
}
