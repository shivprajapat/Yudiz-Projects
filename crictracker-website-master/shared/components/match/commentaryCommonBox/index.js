import React from 'react'
import PropTypes from 'prop-types'

import styles from './style.module.scss'

const CommentaryCommonBox = ({ title, children, className = '' }) => {
  return (
    <section className={`${styles.fallWickets} ${className} common-box p-0 mb-3 br-sm overflow-hidden`}>
      <div className={`${styles.head} ${styles.item}`}>
        <p className="text-uppercase text-primary fw-bold mb-0">{title}</p>
      </div>
      <div className={`${styles.content} ${styles.item}`}>
        <p className="mb-0 text-secondary">
          {children}
        </p>
      </div>
    </section>
  )
}

CommentaryCommonBox.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
}

export default CommentaryCommonBox
