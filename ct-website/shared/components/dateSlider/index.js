import React from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import Slider from '@shared/components/slider'
import { decodeMonth, excludeYear, decodeDay } from '@utils'

function DateSlider({ year, handleYear, selectedYear, monthArray, selectedMonth, dayArray, handleMonth, selectedDay }) {
  const yearData = year?.listSeriesYear
  // useEffect(() => {
  //   if (window.innerWidth < 992) {
  //     console.log(window.innerWidth)
  //   }
  //   console.log(window.innerWidth)
  //   window.addEventListener('load', function(e) {
  //     const container = document.querySelector('.date-slider')
  //     const middle = container.children[Math.floor((container.children.length - 1) / 2)]
  //     container.scrollLeft = middle.offsetLeft +
  //       middle.offsetWidth / 2 - container.offsetWidth / 2
  //   })
  // }, [])
  return (
    <section className={`${styles.dateSlider} text-center mb-3`}>
      <Slider gap={0} nav className={`${styles.slider} date-slider`}>
        {yearData &&
          yearData?.map((y, index) => {
            return (
              <div key={index} onClick={() => handleYear(y)}>
                <div className={`${selectedYear === y && styles.active} ${styles.item}`}>
                  <p className="mb-0">{y}</p>
                </div>
              </div>
            )
          })}
        {monthArray &&
          monthArray?.map((m, index) => {
            return (
              <div key={index} onClick={() => handleYear(m)}>
                <div className={`${selectedMonth === decodeMonth(m) && styles.active} ${styles.item}`}>
                  <p className="mb-0">{m}</p>
                </div>
              </div>
            )
          })}
        {dayArray &&
          dayArray?.map((d, index) => {
            return (
              <div key={index} onClick={() => handleMonth(d)}>
                <div className={`${selectedDay === decodeDay(d) && styles.active} ${styles.item}`}>
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
  selectedDay: PropTypes.string
}

export default DateSlider
