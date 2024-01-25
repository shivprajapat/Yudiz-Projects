import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

import PopUpModal from '../pop-up-modal'

function Confirmation({ isOpen, onClose, onSubmit, isTitle }) {
  return (
    <div>
      <PopUpModal isOpen={isOpen} onClose={() => onClose(false)} title={isTitle ? <FormattedMessage id='activateTitle'/> : <FormattedMessage id='deactivateTitle'/>} isCentered='true'>
        <h5>{isTitle ? <FormattedMessage id='activateMessage'/> : <FormattedMessage id='deactivateMessage'/>}</h5>
        <div className='d-flex w-100 justify-content-end'>
          <Button className='common-btn-secondary' onClick={() => onClose(false)}><FormattedMessage id='cancel'/></Button>
          <Button className='common-btn' onClick={onSubmit}><FormattedMessage id='yes'/></Button>
        </div>
      </PopUpModal>
    </div>
  )
}
Confirmation.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  isTitle: PropTypes.bool
}
export default Confirmation
