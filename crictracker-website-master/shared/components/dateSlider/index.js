import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import Slider from '@shared/components/slider'
import { decodeMonth, excludeYear, decodeDay } from '@utils'

function DateSlider({ year, handleYear, selectedYear, monthArray, selectedMonth, dayArray, handleMonth, selectedDay, isSticky, className }) {
  const yearData = year?.listSeriesYear

  useEffect(() => {
    const selected = document.getElementById('selectedItem')
    const slider = document.getElementById('c-slider')
    slider.scrollBy((selected?.offsetLeft - 45), 0)
  }, [])

  return (
    <section className={`${styles.dateSlider} ${isSticky ? styles.stickySlider : ''} ${className} text-center mb-3 br-sm`}>
      <Slider gap={0} nav destroyBelow={1199} className={`${styles.slider} date-slider`}>
        {yearData &&
          yearData?.map((y, index) => {
            return (
              <div
                key={index}
                onClick={() => handleYear(y)}
                id={selectedYear === y ? 'selectedItem' : ''}
              // id={index === 7 ? 'selectedItem' : ''}
              >
                <div className={`${selectedYear === y ? 'light-bg' : ''} ${styles.item} br-sm mx-1`}>
                  <p className="mb-0">{y}</p>
                </div>
              </div>
            )
          })}
        {monthArray &&
          monthArray?.map((m, index) => {
            return (
              <div
                key={index}
                onClick={() => handleYear(m)}
                id={selectedMonth === decodeMonth(m) ? 'selectedItem' : ''}
              // id={index === 1 ? 'selectedItem' : ''}
              >
                <div
                  className={`${selectedMonth === decodeMonth(m) ? 'light-bg' : ''} ${styles.item} br-sm mx-1`}
                >
                  <p className="mb-0">{m}</p>
                </div>
              </div>
            )
          })}
        {dayArray &&
          dayArray?.map((d, index) => {
            return (
              <div
                key={index}
                onClick={() => handleMonth(d)}
                id={selectedDay === decodeDay(d) ? 'selectedItem' : ''}
              >
                <div className={`${selectedDay === decodeDay(d) ? 'light-bg' : ''} ${styles.item} br-sm mx-1`}>
                  <p className="mb-0">{excludeYear(d)}</p>
                </div>
              </div>
            )
          })}
      </Slider>
    </section>
  )
}

DateSlider.propTypes = {
  year: PropTypes.object,
  handleYear: PropTypes.func,
  selectedYear: PropTypes.string,
  monthArray: PropTypes.array,
  selectedMonth: PropTypes.string,
  dayArray: PropTypes.array,
  handleMonth: PropTypes.func,
  selectedDay: PropTypes.string,
  className: PropTypes.string,
  isSticky: PropTypes.bool
}

export default DateSlider
