import React, { useCallback, useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'

const MultiRangeSlider = ({ min, max, value, onChange }) => {
  const [minVal, setMinVal] = useState(value.min)
  const [maxVal, setMaxVal] = useState(value.max)
  const range = useRef(null)

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  )

  useEffect(() => {
    setMinVal(value.min)
    setMaxVal(value.max)
  }, [value.min, value.max])

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.left = `${minPercent}%`
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minVal, getPercent])

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minVal)
    const maxPercent = getPercent(maxVal)

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [maxVal, getPercent])

  return (
    <div className="multi-range-slider">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1)
          setMinVal(value)
          onChange({ min: value, max: maxVal })
        }}
        className="thumb thumb--left"
      />
      <style jsx>{`
        .thumb--left {
          z-index: minVal > max - 100 && '5';
        }
      `}</style>
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1)
          setMaxVal(value)
          onChange({ min: minVal, max: value })
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="flex items-center justify-between">
          <div className="slider__left-value">₹{minVal}</div>
          <div className="h-8 w-10 xs:w-20 text-center font-jost font-medium text-2xl leading-4 text-secondary-800 flex-center mt-[20px]">
            <span>-</span>
          </div>
          <div className="slider__right-value">₹{maxVal}</div>
        </div>
      </div>
    </div>
  )
}

MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
}

MultiRangeSlider.defaultProps = {
  priceRange: { value: { min: 0, max: 0 } },
}

export default MultiRangeSlider
