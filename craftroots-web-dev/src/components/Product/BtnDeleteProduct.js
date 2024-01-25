import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { iconTrash } from '@/assets/images'

function BtnDeleteProduct({ className, handleRemoveCart }) {
  return (
    <button className="icon-hover" onClick={handleRemoveCart}>
      <Image src={iconTrash} alt="trash" className={className} />
    </button>
  )
}

export default BtnDeleteProduct
BtnDeleteProduct.propTypes = {
  className: PropTypes.string.isRequired,
  handleRemoveCart: PropTypes.func.isRequired,
}
