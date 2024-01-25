import React from 'react'

import styles from './style.module.scss'
import ball from '@assets/images/icon/loader-ball.svg'
import MyImage from '../myImage'

const Loader = (props) => {
  return (
    <div className={`${styles.loader} d-flex align-items-center justify-content-center`}>
      <div className={`${styles.icon} rounded-circle d-flex align-items-center justify-content-center`}>
        <div className={`${styles.ball}`}>
          <MyImage src={ball} alt="post" layout="responsive" />
        </div>
        <div className={`${styles.shadow}`}></div>
      </div>
    </div>
  )
}

export default Loader
