import React from 'react'
import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'

function Title({ heading }) {
  const { t } = useTranslation()
  return (
    <h3 className={`${styles.title} d-flex flex-grow-1 p-1 p-md-2 rounded-pill mb-2`}>
      <span className="d-inline-flex xsmall-text rounded-pill text-uppercase py-1 py-md-2 px-2 px-md-3">{t(`common:${heading}`)}</span>
    </h3>
  )
}
Title.propTypes = {
  heading: PropTypes.string
}
export default Title
