import React, { useEffect } from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

import { useRouter } from 'next/router'
import { iconDash, iconPlus } from '@/assets/images'

const PdpQuantity = ({ disabled, small, quantity, setQuantity, isError }) => {
  const { query } = useRouter()
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1)
  }
  const handleDecrease = () => {
    if (quantity === 1) {
      return
    } else {
      setQuantity((prev) => prev - 1)
    }
  }
  const handleChange = (e) => {
    setQuantity(e.target.value)
  }

  useEffect(() => {
    if (isError || query) {
      setQuantity(1)
    }
  }, [isError, query])

  /* useEffect(() => {
    if (query) {
      setQuantity(1)
    }
  }, [query]) */
  return (
    <div
      className={`${
        small ? '0' : 'p-1'
      } flex items-center border border-grey-400`}
    >
      <button
        className="w-8 h-8"
        onClick={() => handleDecrease()}
        disabled={disabled}
      >
        <Image src={iconDash} alt="dash" className="mx-auto" />
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => handleChange(e)}
        // className={`w-[50px] text-black-100 font-jost text-base text-center px-1 ${disabled ? 'bg-transparent' : ''}`}
        className={`w-[26px] text-black-100 font-jost text-base text-center px-1 ${
          disabled ? 'bg-transparent' : ''
        }`}
        disabled={disabled}
      />
      <button
        className="w-8 h-8"
        onClick={() => handleIncrease()}
        disabled={disabled}
      >
        <Image src={iconPlus} alt="dash" className="mx-auto" />
      </button>
    </div>
  )
}

export default PdpQuantity
PdpQuantity.propTypes = {
  disabled: PropTypes.bool,
  small: PropTypes.bool,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  isError: PropTypes.bool,
}

PdpQuantity.defaultProps = {
  disabled: false,
  small: false,
  isError: false,
}
