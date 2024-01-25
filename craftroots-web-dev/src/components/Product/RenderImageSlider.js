import React from 'react'
import PropTypes from 'prop-types'
import NextImage from '../generic/NextImage'

function RenderImageSlider({
  src,
  width,
  height,
  sizes,
  className,
  quality,
  imageLoadType,
}) {
  return (
    <NextImage
      src={src}
      alt="imgProduct1"
      className={className}
      width={width}
      height={height}
      sizes={sizes}
      quality={quality}
      loading={imageLoadType}
    />
  )
}

export default RenderImageSlider
RenderImageSlider.propTypes = {
  className: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  imageLoadType: PropTypes.string,
  quality: PropTypes.number.isRequired,
  sizes: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
}
