import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

import { iconDash, iconPlus } from '@/assets/images'

const ProductQuantity = ({
  disabled,
  small,
  quantity,
  UpdateQuantity,
  selectedCartItemId,
  isError,
  setSelectedQuantity,
  totalQuantiy,
}) => {
  const [productQuantity, setProductQuantity] = useState(quantity)
  const smallSize = small ? 'w-6 h-6' : 'w-8 h-8'
  const decreaseDisabledStyle =
    +productQuantity === 1 ? 'cursor-not-allowed' : ''
  const increaseDisabledStyle =
    +productQuantity === +totalQuantiy ? 'cursor-not-allowed' : ''

  function updateQuantity(quantity) {
    setSelectedQuantity(quantity)
    UpdateQuantity(selectedCartItemId, quantity)
  }
  const handleIncrease = () => {
    updateQuantity(productQuantity + 1)
  }
  const handleDecrease = () => {
    if (productQuantity > 1) {
      updateQuantity(productQuantity - 1)
    }
  }
  const handleChange = (e) => {
    const inputValue = +e.target.value
    if (inputValue === 0) {
      return
    }
    if (inputValue > +totalQuantiy) {
      setProductQuantity(+totalQuantiy)
    } else {
      setProductQuantity(inputValue)
    }
  }
  const handleBlur = (e) => {
    if (e.target.value !== quantity.toString()) {
      updateQuantity(+productQuantity)
    }
  }

  useEffect(() => {
    setProductQuantity(quantity)
  }, [quantity, isError])

  return (
    <div
      className={`${
        small ? '0' : 'p-1'
      } flex items-center border border-grey-400`}
    >
      <button
        className={`${smallSize} ${decreaseDisabledStyle}`}
        onClick={handleDecrease}
        disabled={+productQuantity === 1}
      >
        <Image src={iconDash} alt="dash" className="mx-auto" />
      </button>
      <input
        type="number"
        value={productQuantity}
        onChange={handleChange}
        onBlur={handleBlur}
        readOnly
        min={1}
        max={totalQuantiy}
        // className={`w-[50px] text-black-100 font-jost text-base text-center px-1 ${disabled ? 'bg-transparent' : ''}`}
        className={`w-[35px] cursor-[context-menu] text-black-100 font-jost text-base text-center px-1 ${
          disabled ? 'bg-transparent' : ''
        }`}
        disabled={disabled}
      />
      <button
        className={`${smallSize} ${increaseDisabledStyle}`}
        onClick={handleIncrease}
        disabled={+productQuantity === +totalQuantiy}
      >
        <Image src={iconPlus} alt="dash" className="mx-auto" />
      </button>
    </div>
  )
}

export default ProductQuantity
ProductQuantity.propTypes = {
  disabled: PropTypes.bool,
  small: PropTypes.bool,
  quantity: PropTypes.number,
  UpdateQuantity: PropTypes.func,
  selectedCartItemId: PropTypes.number,
  isError: PropTypes.bool,
  setSelectedQuantity: PropTypes.func,
  totalQuantiy: PropTypes.number.isRequired,
}

ProductQuantity.defaultProps = {
  disabled: false,
  small: false,
  quantity: 1,
  UpdateQuantity: () => {},
  isError: false,
  setSelectedQuantity: () => {},
}
