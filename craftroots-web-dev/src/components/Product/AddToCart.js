import React from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { Button } from '../generic'
import { IconCart } from '@/assets/images'

function AddToCart({
  className,
  fullWidth,
  center,
  addtocart,
  btnLoader,
  disabled,
}) {
  const intl = useIntl()
  return (
    <div className={className}>
      <Button
        fullWidth={fullWidth}
        center={center}
        title={intl.formatMessage({
          id: 'button.AddToCart',
        })}
        icon={btnLoader ? null : <IconCart size="12" />}
        disabled={disabled}
        btnLoader={btnLoader}
        onClick={addtocart}
      />
    </div>
  )
}

export default React.memo(AddToCart)
AddToCart.propTypes = {
  stockStatus: PropTypes.string,
  intl: PropTypes.object.isRequired,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  center: PropTypes.bool,
  addtocart: PropTypes.func,
  btnLoader: PropTypes.bool,
  disabled: PropTypes.bool,
}
AddToCart.defaultProps = {
  stockStatus: '',
  className: '',
  fullWidth: false,
  center: false,
  addtocart: () => {},
  btnLoader: false,
  disabled: false,
}
