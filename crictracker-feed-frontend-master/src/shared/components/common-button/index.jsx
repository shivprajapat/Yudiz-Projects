import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

function CommonButton({ btnValue, onClick, isDisabled }) {
  return (
    <>
      <Button disabled={isDisabled} className='common-btn' onClick={onClick}>{btnValue}</Button>
    </>
  )
}

CommonButton.propTypes = {
  btnValue: PropTypes.string,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool
}
export default CommonButton
