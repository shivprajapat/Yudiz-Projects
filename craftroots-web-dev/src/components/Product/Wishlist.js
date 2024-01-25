import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { iconHeart, iconHeartFill } from '@/assets/images'

function Wishlist({
  className,
  wishlist,
  handleWishlist,
  displayText,
  imgClass,
  disabled,
}) {
  return (
    <button className={className} onClick={handleWishlist} disabled={disabled}>
      <Image
        src={wishlist ? iconHeartFill : iconHeart}
        alt="cart"
        className={imgClass}
      />
      {displayText ? (
        <p>
          <FormattedMessage id="button.AddToWishlist" />
        </p>
      ) : null}
    </button>
  )
}

export default Wishlist
Wishlist.propTypes = {
  className: PropTypes.string.isRequired,
  wishlist: PropTypes.bool.isRequired,
  handleWishlist: PropTypes.func.isRequired,
  displayText: PropTypes.bool,
  imgClass: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
}

Wishlist.defaultProps = {
  displayText: false,
  disabled: false,
}
