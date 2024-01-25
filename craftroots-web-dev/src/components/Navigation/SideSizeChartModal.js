import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Image from 'next/image'

import { iconClose } from '@/assets/images'

const SideSizeChartModal = ({ isShowing, closeConfirm, data }) => {
  return (
    <div>
      <div
        className={`sidebar-left-overlay ${isShowing ? 'active' : ''}`}
        onClick={closeConfirm}
      />
      <div className={`sidebar-left ${isShowing ? 'active' : ''}`}>
        <div className="head">
          <h5>
            <FormattedMessage id="page.productDetails.modal.title.sizeChart" />
          </h5>
          <button type="button" onClick={closeConfirm} className="icon-hover">
            <Image src={iconClose} alt="close" />
          </button>
        </div>
        <div
          id="size-chart"
          dangerouslySetInnerHTML={{
            __html: data?.rule_content,
          }}
        ></div>
      </div>
    </div>
  )
}

export default SideSizeChartModal
SideSizeChartModal.propTypes = {
  isShowing: PropTypes.bool,
  closeConfirm: PropTypes.func,
  data: PropTypes.object,
}
