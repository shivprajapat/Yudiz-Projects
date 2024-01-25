import React from 'react'
import PropTypes from 'prop-types'

const RadioGroup = ({
  allColor,
  big,
  selectedColor,
  productURLKey,
  handleChangeColor,
  name,
}) => {
  return (
    <div className={`radio-group  ${big && 'big'}`}>
      {allColor?.map((color, i) => {
        const radioID = name ? name + '' + i : productURLKey + color.value_index
        return (
          <label htmlFor={radioID} key={radioID}>
            <input
              type="radio"
              name={name || productURLKey}
              id={radioID}
              checked={
                color.value_index.toString() === selectedColor.toString()
              }
              onChange={() => handleChangeColor(color.value_index)}
            />
            <span style={{ '--color': color.swatch_data.value }} />
          </label>
        )
      })}
    </div>
  )
}

export default RadioGroup
RadioGroup.propTypes = {
  big: PropTypes.bool,
  allColor: PropTypes.array,
  handleChangeColor: PropTypes.func,
  productURLKey: PropTypes.string,
  selectedColor: PropTypes.string,
  name: PropTypes.string,
}

RadioGroup.defaultProps = {
  big: false,
  allColor: [],
  handleChangeColor: () => {},
  productURLKey: '',
  selectedColor: '',
}
