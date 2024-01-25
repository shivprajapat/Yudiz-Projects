import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))

const InfoBlock = (props) => {
  return (
    <>
      <style jsx amp-custom global>{`
        .infoBlock a{color:var(--theme-color-medium);text-decoration:underline}.infoDesc{font-size:16px;line-height:24px}/*# sourceMappingURL=style.css.map */

      `}</style>
      <section className="common-section infoBlock pb-0">
        <TitleBlock title={props?.title} />
        <div className="infoDesc" dangerouslySetInnerHTML={{ __html: props?.info }}></div>
      </section>
    </>
  )
}

InfoBlock.propTypes = {
  fantasystyles: PropTypes.any,
  title: PropTypes.any,
  info: PropTypes.any
}

export default InfoBlock
