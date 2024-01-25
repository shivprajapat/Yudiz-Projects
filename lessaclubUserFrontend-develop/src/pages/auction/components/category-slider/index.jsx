import React from 'react'
import PropTypes from 'prop-types'

import Slider from 'shared/components/slider'
import { closeIcon } from 'assets/images'

const CategorySlider = ({ category, handleCategoryChange, selectedCategory }) => {
  return (
    <div className="explore-top-slider">
      <Slider nav>
        {category?.category?.map((c) => (
          <div key={c.id} onClick={() => handleCategoryChange(c)} className={c.id === selectedCategory ? 'active' : ''}>
            <span className="category">{c.name}</span>
          </div>
        ))}
      </Slider>
      {selectedCategory && (
        <span className="clear-slider" onClick={() => handleCategoryChange()}>
          <img src={closeIcon} alt="clear" />
        </span>
      )}
    </div>
  )
}
CategorySlider.propTypes = {
  category: PropTypes.object,
  handleCategoryChange: PropTypes.func,
  selectedCategory: PropTypes.number
}
export default CategorySlider
