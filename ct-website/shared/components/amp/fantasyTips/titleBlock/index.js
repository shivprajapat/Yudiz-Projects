import React from 'react'
import PropTypes from 'prop-types'

const TitleBlock = (props) => {
  return (
    <>
      <style jsx amp-custom>{`
      .icon{width:32px}.itemTitle{margin:0 0 12px;padding-bottom:12px;border-bottom:1px solid #e4e6eb;text-transform:uppercase;color:#045de9}.itemTitle b{display:flex;align-items:center}@media(max-width: 575px){.itemTitle{padding:6px 0}}/*# sourceMappingURL=style.css.map */

      `}</style>
      <p className="itemTitle"><b>{props?.title}</b></p>
    </>
  )
}

TitleBlock.propTypes = {
  title: PropTypes.any
}

export default TitleBlock
