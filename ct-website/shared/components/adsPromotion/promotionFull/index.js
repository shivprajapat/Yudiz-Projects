import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

import styles from './style.module.scss'
import brandLogo from '@assets/images/dummy/reebok-logo.png'
import product from '@assets/images/dummy/shoes.png'
import Timer from './Timer'
import MatchScore from './MatchScore'

const MyImage = dynamic(() => import('@shared/components/myImage'))

const PromotionFull = ({ match }) => {
  return (
      <div className={`${styles.promotion} d-flex align-items-center text-center mb-3 mb-md-4`}>
        <div className={`${styles.promoInfo} d-flex flex-column flex-md-row align-items-center`}>
          <div className={`${styles.series} mb-2 mb-md-0`}>
            <p className="text-uppercase text-small mb-0">{match?.oSeries?.sTitle}</p>
            <p className="text-uppercase text-small mb-0">{match?.sSubtitle}</p>
          </div>
          <div className={`${styles.centerContent} flex-grow-1`}>
            {
              match?.sStatusStr === 'scheduled' && <Timer date={match?.dStartDate}/>
            }
            {
              (match?.sStatusStr === 'live' || match?.sStatusStr === 'completed' || match?.sStatusStr === 'cancelled') && <MatchScore match={match}/>
            }
          </div>
        </div>
        <div className={`${styles.branding} font-bold d-flex flex-column flex-md-row align-items-center justify-content-center`}>
          <p className="mb-2 mb-md-0">Powered by</p>
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

PromotionFull.propTypes = {
  match: PropTypes.object
}

export default PromotionFull
