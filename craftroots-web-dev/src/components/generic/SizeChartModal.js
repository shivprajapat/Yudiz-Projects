import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import CloseButton from './CloseButton'

const SizeChartModal = ({ closeConfirm, isShowing, data }) => {
  const outSideHandler = (e) => {
    e.stopPropagation()
  }
  return (
    <div className={`modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" onClick={closeConfirm} />
      <div className="modal-content overflow-hidden h-[95%]">
        <div className="modal-bg">
          <div className="modal-size flex-center h-[95%]">
            <div onClick={outSideHandler}>
              <div className="flex justify-between items-center border-b border-grey-400 pb-3">
                <h3 className="text-xl font-semibold font-jost text-gray-900">
                  <FormattedMessage id="page.productDetails.modal.title.sizeChart" />
                </h3>
                <CloseButton onClick={closeConfirm} />
              </div>
              <div
                id="size-chart"
                className="overflow-auto mt-4 max-h-[78vh] w-64 xs:w-80 sm:w-full remove-scrollbar"
                dangerouslySetInnerHTML={{
                  __html: data?.rule_content,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SizeChartModal
SizeChartModal.propTypes = {
  closeConfirm: PropTypes.func,
  isShowing: PropTypes.bool,
  data: PropTypes.object,
}
