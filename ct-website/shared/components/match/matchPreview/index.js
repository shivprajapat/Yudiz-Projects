import React from 'react'
import Trans from 'next-translate/Trans'
import PropTypes from 'prop-types'

import styles from './style.module.scss'

const MatchPreview = ({ data }) => {
  return (
    <section className={`${styles.matchPreview}`}>
      <h4 className="text-uppercase">
        <Trans i18nKey="common:Preview" />
      </h4>
      <div className={`${styles.head} common-box big-text`} dangerouslySetInnerHTML={{ __html: data }}></div>
    </section>
  )
}

MatchPreview.propTypes = {
  data: PropTypes.string
}

export default MatchPreview
