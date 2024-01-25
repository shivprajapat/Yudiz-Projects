import React from 'react'
import PropTypes from 'prop-types'

function ProductSizeToggle({ sizes, selectedColor, variants, AddToCart, sku }) {
  const sizeHandler = (size) => {
    const Product = variants.find((item) =>
      item.attributes.every(
        (att) =>
          (att.code === ATTRIBUTE.color.title &&
            att.value_index === selectedColor) ||
          (att.code === ATTRIBUTE.size.title &&
            att.value_index === size?.value_index)
      )
    )
    AddToCart({}, Product.product.sku, sku)
  }
  return (
    sizes.length > 0 && (
      <div className="overlay h-auto hidden md:flex gap-2 px-2 py-3 flex-wrap items-center justify-center">
        {sizes?.map((size) => (
          <button
            className="product-size-button"
            key={size?.value_index}
            onClick={() => {
              sizeHandler(size)
            }}
          >
            {size?.swatch_data?.value}
          </button>
        ))}
      </div>
    )
  )
}

ProductSizeToggle.propTypes = {
  sizes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value_index: PropTypes.number,
      swatch_data: {
        value: PropTypes.string,
        __typename: PropTypes.string,
      },
      __typename: PropTypes.string,
    })
  ).isRequired,
  variants: PropTypes.array.isRequired,
  AddToCart: PropTypes.func.isRequired,
  sku: PropTypes.string.isRequired,
  selectedColor: PropTypes.number.isRequired,
}

export default ProductSizeToggle
