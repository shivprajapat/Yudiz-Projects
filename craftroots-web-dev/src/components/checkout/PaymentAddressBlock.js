import PropTypes from 'prop-types'
import { IconMap } from '@/assets/images'

function PaymentAddressBlock({ address, className }) {
  return (
    Object.keys(address).length > 0 && (
      <div
        className={`bg-secondary-600 border border-grey-400 p-5 mb-4 flex items-start gap-2 ${className}`}
      >
        <div className="w-4 h-auto text-grey-800">
          <IconMap />
        </div>
        <div>
          <h5 className="font-jost text-base text-secondary-100 font-medium mb-1">
            {address?.firstname + ' ' + address?.lastname}
          </h5>
          <p className="text-grey-800 text-sm leading-6">
            {address?.street?.[0] +
              ',' +
              address?.city +
              ' ' +
              address?.postcode +
              ',' +
              (address?.region?.region || address?.region?.label) +
              ',' +
              'India'}
          </p>
        </div>
      </div>
    )
  )
}

PaymentAddressBlock.propTypes = {
  address: PropTypes.object.isRequired,
  className: PropTypes.string,
}
PaymentAddressBlock.defaultProps = {
  className: '',
}

export default PaymentAddressBlock
