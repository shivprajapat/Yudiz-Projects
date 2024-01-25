import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import './style.scss'
import { useUpdateEffect } from 'shared/hooks/use-update-effect'

const MIN = 0
const MAX = 1000000

const MultiRange = ({ values, handleSetValues }) => {
  const [minVal, setMinVal] = useState(MIN)
  const [maxVal, setMaxVal] = useState(MAX)
  const minValRef = useRef(null)
  const maxValRef = useRef(null)
  const range = useRef(null)

  const getPercent = useCallback((value) => Math.round(((value - MIN) / (MAX - MIN)) * 100), [MIN, MAX])

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal)
      const maxPercent = getPercent(+maxValRef.current.value)

      if (range.current) {
        range.current.style.left = `${minPercent}%`
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [minVal, getPercent])

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value)
      const maxPercent = getPercent(maxVal)

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`
      }
    }
  }, [maxVal, getPercent])

  useUpdateEffect(() => {
    handleSetValues([minVal, maxVal])
  }, [minVal, maxVal])

  useEffect(() => {
    if (values !== [minVal, maxVal]) {
      setMinVal(values[0])
      setMaxVal(values[1])
    }
  }, [values])

  return (
    <div className="multi-range">
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1)
          setMinVal(value)
          event.target.value = value.toString()
        }}
        className="thumb thumb--zindex-3"
      />
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1)
          setMaxVal(value)
          event.target.value = value.toString()
        }}
        className="thumb thumb--zindex-4"
      />

      <div className="multi-range-slider">
        <div className="multi-range-slider-track" />
        <div ref={range} className="slider-range" />
      </div>
      <div className="range-output d-flex" id="output">
        <span className="flex-shrink-0">{values[0]}</span>
        <span className="flex-shrink-0">{values[1]}</span>
      </div>
    </div>
  )
}
MultiRange.propTypes = {
  values: PropTypes.array,
  handleSetValues: PropTypes.func
}

export default MultiRange
