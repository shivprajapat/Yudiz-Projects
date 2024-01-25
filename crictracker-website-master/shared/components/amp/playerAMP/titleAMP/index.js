import React from 'react'
import useTranslation from 'next-translate/useTranslation'
import PropTypes from 'prop-types'

function TitleAMP({ heading }) {
  const { t } = useTranslation()
  return (
    <>
      <style jsx amp-custom>
        {`.rounded-pill{border-radius:2em}.title{background:var(--theme-light)}.title span{padding:4px 12px;background:var(--theme-color);color:#fff}/*# sourceMappingURL=style.css.map */
        `}
      </style>
      <h3 className="title d-flex flex-grow-1 p-2 rounded-pill mb-2">
        <span className="d-inline-flex xsmall-text rounded-pill t-uppercase">{t(`common:${heading}`)}</span>
      </h3>
    </>
  )
}
TitleAMP.propTypes = {
  heading: PropTypes.string
}
export default TitleAMP
