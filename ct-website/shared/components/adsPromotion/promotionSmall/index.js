import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import brandLogo from '@assets/images/dummy/reebok-logo.png'
import product from '@assets/images/dummy/shoes.png'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const promotionSmall = () => {
  return (
    <div className={`${styles.promotion} d-flex align-items-center text-center mb-3 mb-md-4`}>
      <div className={`${styles.promoInfo}`}>
        <div className={`${styles.series} mb-2`}>
          <p className="font-bold text-uppercase mb-0">CSK vs RCB</p>
          <p className="text-uppercase text-small mb-0">IPL 2021 Season 14</p>
        </div>
        <div className={`${styles.centerContent} flex-grow-1`}>
          <div className={`${styles.timer} d-flex align-items-center justify-content-center text-uppercase`}>
            <div className={`${styles.time}`}>
              <h3 className="mb-0">02</h3>
              <p className="mb-0">Days</p>
            </div>
            <h3 className="mb-0">:</h3>
            <div className={`${styles.time}`}>
              <h3 className="mb-0">10</h3>
              <p className="mb-0">Hrs</p>
            </div>
            <h3 className="mb-0">:</h3>
            <div className={`${styles.time}`}>
              <h3 className="mb-0">49</h3>
              <p className="mb-0">Min</p>
            </div>
          </div>
          {/* <div className={`${styles.matchInfo} d-flex justify-content-center align-items-center`}>
            <div>
              <p className={`${styles.team} mb-0 font-bold`}>IND</p>
              <p className="mb-0">186/4</p>
            </div>
            <p className="mb-0">vs</p>
            <div>
              <p className={`${styles.team} mb-0 font-bold`}>END</p>
              <p className="mb-0">172/10</p>
            </div>
          </div> */}
        </div>
      </div>
      <div className={`${styles.branding} font-semi`}>
        <p className="mb-2">Powered by</p>
        <div className={styles.product}>
          <MyImage src={product} alt="product" layout="responsive" />
        </div>
        <div className={styles.logo}>
          <MyImage src={brandLogo} alt="logo" layout="responsive" />
        </div>
      </div>
    </div>
  )
}

promotionSmall.propTypes = {
  isArticle: PropTypes.bool,
  listicleCurrentPage: PropTypes.number
}

export default promotionSmall
