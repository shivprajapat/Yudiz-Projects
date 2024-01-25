import React from 'react'
import PropTypes from 'prop-types'

const TitleBlock = (props) => {
  return (
    <>
      <style jsx amp-custom>{`
      .icon{width:24px}.itemTitle{margin:0 0 8px;padding:0 0 8px;border-bottom:1px solid var(--light);text-transform:uppercase;color:var(--theme-color-medium)}.itemTitle b{display:flex;align-items:center}/*# sourceMappingURL=style.css.map */

      `}</style>
      <p className="itemTitle"><b>{props?.title}</b></p>
    </>
  )
}

TitleBlock.propTypes = {
  title: PropTypes.any
}

export default TitleBlock
