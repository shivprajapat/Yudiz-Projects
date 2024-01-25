import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'
import Slider from '@shared/components/slider'
import { ALPHABETS } from '@shared/utils'

function AlphabetSlider({ year, selectedAlphabet, handleSearch }) {
  useEffect(() => {
    const selected = document.getElementById('selectedItem')
    const slider = document.getElementById('c-slider')
    slider.scrollBy((selected?.offsetLeft - 45), 0)
  }, [])

  return (
    <section className={`${styles.dateSlider} text-center mb-4 br-sm`}>
      <Slider gap={0} nav destroyBelow={1199} className={`${styles.slider} date-slider text-uppercase`}>
        {
          ALPHABETS?.map((a, index) => {
            return (
              <div
                key={index}
                onClick={() => handleSearch(a)}
                id={selectedAlphabet === a ? 'selectedItem' : ''}
              // id={index === 7 ? 'selectedItem' : ''}
              >
                <div className={`${selectedAlphabet === a ? styles.active : ''} ${styles.item} light-bg mx-1 py-1 br-sm`}>
                  <p className="mb-0">{a}</p>
                </div>
              </div>
            )
          })}
      </Slider>
    </section>
  )
}

AlphabetSlider.propTypes = {
  year: PropTypes.object,
  selectedAlphabet: PropTypes.string,
  handleSearch: PropTypes.func,
  selectedDay: PropTypes.string
}

export default AlphabetSlider
