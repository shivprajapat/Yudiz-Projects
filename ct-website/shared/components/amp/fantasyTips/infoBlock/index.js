import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const TitleBlock = dynamic(() => import('@shared-components/amp/fantasyTips/titleBlock'))

const InfoBlock = (props) => {
  return (
    <>
      <section className="common-section pb-0">
        <TitleBlock title={props?.title} />
        <div className="big-text" dangerouslySetInnerHTML={{ __html: props?.info }}></div>
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
