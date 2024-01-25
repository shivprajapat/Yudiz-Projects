import React from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'

const CommonContent = ({ children, isDark, isSmall }) => {
  return (
    <div className={`${styles.commonContent} ${isDark ? styles.darkContent : ''} ${isSmall ? styles.smallContent : ''}`}>
      {children}
    </div>
  )
}

CommonContent.propTypes = {
  children: PropTypes.any,
  isDark: PropTypes.bool,
  isSmall: PropTypes.bool
}

export default CommonContent
