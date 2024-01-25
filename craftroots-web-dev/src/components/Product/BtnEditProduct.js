import React from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { iconEdit } from '@/assets/images'

function BtnEditProduct({ className, handleCartEdit }) {
  return (
    <button className="icon-hover" onClick={handleCartEdit}>
      <Image src={iconEdit} alt="trash" className={className} />
    </button>
  )
}

export default BtnEditProduct
BtnEditProduct.propTypes = {
  className: PropTypes.string.isRequired,
  handleCartEdit: PropTypes.func.isRequired,
}
