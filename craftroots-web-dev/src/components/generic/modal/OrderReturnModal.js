import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'
import CloseButton from '../CloseButton'
import { IconReturned } from '@/assets/images'

const OrderReturnModal = ({
  isShowing,
  outSideHandler,
  toggle,
  orderNumber,
}) => {
  return (
    <div className={`modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" />
      <div className="modal-content h-[80%] sm:h-auto">
        <div className="modal-bg">
          <div className="modal-size w-[600px]">
            <div onClick={outSideHandler}>
              <div className="flex justify-between items-center border-b border-grey-400 pb-3">
                <h3 className="text-xl font-semibold font-jost text-gray-900">
                  <FormattedMessage id="modal.returnOrder.title.returnYourOrder" />
                </h3>
                <CloseButton onClick={toggle} />
              </div>
              <div className="mt-4">
                <IconReturned className="mx-auto w-20 h-20 sm:w-32 sm:h-32 text-primary" />
                <h4 className="text-lg font-normal font-jost text-gray-500">
                  <FormattedMessage id="modal.returnOrder.description.returnYourOrder" />
                </h4>
                <div className="mt-4">
                  <Link
                    className="underline text-lg font-normal font-jost"
                    href={`mailto:support@craftroots.com?subject=${encodeURIComponent(
                      `orderID: ${orderNumber}`
                    )}`}
                  >
                    <FormattedMessage id="modal.returnOrder.emailAddress" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderReturnModal
OrderReturnModal.propTypes = {
  toggle: PropTypes.func,
  isShowing: PropTypes.bool,
  outSideHandler: PropTypes.func,
  orderNumber: PropTypes.string,
}
