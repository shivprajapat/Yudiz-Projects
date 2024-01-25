import React, { useState } from 'react'
import { Button, Toast } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import './style.scss'
import { CloseIcon } from 'assets/images/icon-components/icons'

const Toaster = ({ type, msg, btnTxt }) => {
  const [show, setShow] = useState(true)
  const [isHover, setIsHover] = useState(true)
  const dispatch = useDispatch()

  const handleHover = ({ type }) => {
    type === 'mouseenter' ? setIsHover(false) : setIsHover(true)
  }

  const onClose = () => {
    setShow(false)
    dispatch({
      type: 'SHOW_TOAST',
      payload: { message: '', type: '', btnTxt: '' }
    })
  }

  return (
    <div className="custom-toast">
      <Toast
        onClose={onClose}
        show={show}
        delay={4000}
        autohide={isHover}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        className={`toast ${type === 'success' ? 'success' : 'danger'} font-semi`}
      >
        <div className="d-flex align-items-center justify-content-between">
          <Toast.Body>{msg}</Toast.Body>
          <Button onClick={onClose} variant="link" className="btnClose ms-2 flex-shrink-0">
            <CloseIcon />
          </Button>
        </div>
      </Toast>
    </div>
  )
}
Toaster.propTypes = {
  type: PropTypes.string,
  msg: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  btnTxt: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}
export default Toaster
