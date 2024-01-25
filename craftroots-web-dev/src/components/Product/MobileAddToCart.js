import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '../generic'
import AddToCart from './AddToCart'
import NotifyMe from './NotifyMe'
import { IconHeart } from '@/assets/images'
import { OUT_OF_STOCK } from '@/helper/constant'

function MobileAddToCart({
  stockStatus,
  intl,
  isInWishlist,
  addtocart,
  handleWishlist,
  btnLoader,
  disabled,
  showNotifyMeBtn,
  productSku,
}) {
  const isOutOfStock = stockStatus === OUT_OF_STOCK
  const shouldNotify = isOutOfStock && showNotifyMeBtn
  return (
    <>
      <div className="flex-1">
        <Button
          border
          center
          fullWidth
          title={intl.formatMessage({
            id: 'button.wishlist',
          })}
          className="!text-black"
          icon={<IconHeart size="14" filled={isInWishlist} />}
          onClick={handleWishlist}
        />
      </div>
      {stockStatus &&
        (shouldNotify ? (
          <div className="flex-1">
            <NotifyMe fullWidth center intl={intl} productSku={productSku} />
          </div>
        ) : (
          !isOutOfStock && (
            <div className="flex-1">
              <AddToCart
                stockStatus={stockStatus}
                fullWidth
                center
                addtocart={addtocart}
                btnLoader={btnLoader}
                disabled={disabled}
              />
            </div>
          )
        ))}
    </>
  )
}

export default MobileAddToCart
MobileAddToCart.propTypes = {
  stockStatus: PropTypes.string,
  intl: PropTypes.object.isRequired,
  addtocart: PropTypes.func,
  handleWishlist: PropTypes.func,
  btnLoader: PropTypes.bool,
  disabled: PropTypes.bool,
  isInWishlist: PropTypes.bool,
  showNotifyMeBtn: PropTypes.number.isRequired,
  productSku: PropTypes.string.isRequired,
}
MobileAddToCart.defaultProps = {
  stockStatus: '',
  addtocart: () => {},
  handleWishlist: () => {},
  btnLoader: false,
  disabled: false,
  isInWishlist: false,
}
