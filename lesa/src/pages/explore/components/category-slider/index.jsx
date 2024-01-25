import React from 'react'
import PropTypes from 'prop-types'

import Slider from 'shared/components/slider'

const CategorySlider = ({ category, handleCategoryChange, selectedCategory }) => {
  return (
    <div className="explore-top-slider">
      <Slider nav>
        {category?.category?.map((c, index) => (
          <div key={index} onClick={() => handleCategoryChange(c)} className={c.id === selectedCategory ? 'active' : ''}>
            <span className="category">{c.name}</span>
          </div>
        ))}
      </Slider>
    </div>
  )
}
CategorySlider.propTypes = {
  category: PropTypes.object,
  handleCategoryChange: PropTypes.func,
  selectedCategory: PropTypes.number
}
export default CategorySlider
