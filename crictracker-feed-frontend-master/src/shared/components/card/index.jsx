import React from 'react'
import PropTypes from 'prop-types'

import CardOne from '../../../assets/images/card-corner.svg'
function Card({ title, counts, colorClass, cardsFor, detail }) {
  return (
    <>{(cardsFor === 'counts' && colorClass) &&
        <div className={`card-container card-${colorClass}`}>
          <img className='card-svg' src={CardOne} alt='image'/>
          <p className='card-title'>{title}</p>
          <p className='card-count'>{counts}</p>
        </div>
      }

      {(cardsFor === 'subscription-details' && colorClass) &&
        <div className={`card-container card-${colorClass}`}>
          <img className='card-svg' src={CardOne} alt='image'/>
          <button className='card-button'>Get More Subscriptions</button>
          <button className='card-button'>My Subscriptions</button>
        </div>
      }

      {(cardsFor === 'subscription-details' && !colorClass) &&
        <div className='card-container simple-card' >
          <p className='card-subscription-title'>{title}</p>
          <p className='card-detail'>{detail}</p>
        </div>
      }

      {(cardsFor === 'designed-subscription-details' && !colorClass) &&
        <div className='card-container design-card' >
          <p className='card-subscription-title'>{title}</p>
          <p className='card-detail'>{detail}</p>
        </div>
      }
    </>
  )
};

Card.propTypes = {
  title: PropTypes.any,
  detail: PropTypes.string,
  cardsFor: PropTypes.string,
  colorClass: PropTypes.number,
  counts: PropTypes.number
}

export default Card
