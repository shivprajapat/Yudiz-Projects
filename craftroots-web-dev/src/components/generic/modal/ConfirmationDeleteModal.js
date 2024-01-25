import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import Image from 'next/image'

// import CloseButton from '../CloseButton'
import Button from '../Button'
import { iconClose } from '@/assets/images'

const ConfirmationDeleteModal = ({
  itemName,
  closeConfirm,
  isShowing,
  confirmHandler,
  loading,
  actionWord,
}) => {
  const intl = useIntl()
  const outSideHandler = (e) => {
    e.stopPropagation()
  }

  return (
    <div className={` modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" onClick={closeConfirm} />
      <div className="modal-content">
        <div className="modal-bg">
          <div className="modal-size w-full max-w-[400px]">
            <div onClick={outSideHandler} className="!p-5 xs:!p-7">
              {/* <CloseButton
                onClick={closeConfirm}
                className="absolute top-2 right-2 z-10 bg-gray-100"
              /> */}
              <button
                type="button"
                onClick={closeConfirm}
                disabled={loading}
                className="absolute top-2 right-2 z-10 bg-gray-100"
              >
                <Image src={iconClose} alt="close" />
              </button>
              <div className="w-full md:max-w-full md:flex pb-6 pt-5">
                <h5 className="font-jost text-base sm:text-lg text-grey-900 font-medium mb-2">
                  Are you sure you want to {actionWord} this {itemName}?
                </h5>
              </div>
              <div className="flex gap-4">
                <Button
                  fullWidth
                  btnLoader={loading}
                  disabled={loading}
                  onClick={confirmHandler}
                  title={intl.formatMessage({
                    id: 'button.yes',
                  })}
                />
                <Button
                  border
                  onClick={closeConfirm}
                  fullWidth
                  title={intl.formatMessage({
                    id: 'button.no',
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ConfirmationDeleteModal)
ConfirmationDeleteModal.propTypes = {
  closeConfirm: PropTypes.func,
  isShowing: PropTypes.bool,
  confirmHandler: PropTypes.bool.isRequired,
  itemName: PropTypes.string,
  loading: PropTypes.bool,
  actionWord: PropTypes.string,
}
ConfirmationDeleteModal.defaultProps = {
  closeConfirm: () => {},
  isShowing: false,
  itemName: 'Item',
  loading: false,
  actionWord: 'delete',
}
