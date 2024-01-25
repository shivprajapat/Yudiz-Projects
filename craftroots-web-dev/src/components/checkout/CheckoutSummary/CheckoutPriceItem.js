import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/generic'
import { OUT_OF_STOCK_ERROR } from '@/helper/constant'
import { setToastDataAction } from '@/actions/toastAction'
const SideCartSubTotal = dynamic(() =>
  import('@/components/checkout/SideCartSubTotal')
)

const CheckoutPriceItem = ({
  btnTitle,
  padding,
  btnDisable,
  onCheckoutClick,
  // outOfStockStatus
}) => {
  const { billingIsDirty, sameAddresses, outOfStockStatus, shippingIsDirty } =
    useSelector((state) => state.cartReducer)
  const dispatch = useDispatch()

  const nextHandler = async () => {
    if (outOfStockStatus) {
      dispatch(
        setToastDataAction({
          show: true,
          message: OUT_OF_STOCK_ERROR,
          error: true,
        })
      )
    } else {
      onCheckoutClick()
    }
  }

  return (
    <div className={`bg-grey-100 ${padding ? 'p-6' : ''}`}>
      <SideCartSubTotal className="mb-4" />
      <Button
        disabled={
          (billingIsDirty && !sameAddresses) || btnDisable || shippingIsDirty
        }
        title={btnTitle}
        fullWidth
        onClick={nextHandler}
      />
    </div>
  )
}

export default React.memo(CheckoutPriceItem)
CheckoutPriceItem.propTypes = {
  btnTitle: PropTypes.string,
  padding: PropTypes.bool,
  prices: PropTypes.object,
  appliedCoupon: PropTypes.string,
  sameAddresses: PropTypes.bool,
  onCheckoutClick: PropTypes.func,
  btnDisable: PropTypes.bool,
  setPaymentMethodOnCartData: PropTypes.bool,
  selecetedPaymentMethod: PropTypes.string,
}

CheckoutPriceItem.defaultProps = {
  appliedCoupon: '',
  onCheckoutClick: () => {},
  setPaymentMethodOnCartData: false,
  selecetedPaymentMethod: '',
  btnDisable: false,
}
