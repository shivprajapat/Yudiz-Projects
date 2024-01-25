import PropTypes from 'prop-types'
import { MultiRangeSlider } from '../generic'

function PriceRangeFilter({ priceRange, handlePriceChange, isMobile }) {
  return (
    <MultiRangeSlider
      min={+priceRange?.min}
      max={+priceRange?.max}
      value={{
        min: +priceRange?.value?.min,
        max: +priceRange?.value?.max,
      }}
      onChange={({ min, max }) => handlePriceChange({ min, max }, isMobile)}
    />
  )
}

PriceRangeFilter.propTypes = {
  priceRange: PropTypes.object.isRequired,
  handlePriceChange: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
}

PriceRangeFilter.defaultProps = {
  isMobile: false,
}

export default PriceRangeFilter
