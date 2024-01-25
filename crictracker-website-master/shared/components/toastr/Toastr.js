import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Toast } from 'react-bootstrap'
import { CloseIcon } from '../ctIcons'
import ToastrContext from './ToastrContext'
function Toastr({ type, msg, btnTxt }) {
  const [show, setShow] = useState(true)
  const [isHover, setIsHover] = useState(true)
  const { dispatch } = React.useContext(ToastrContext)

  function handleHover({ type }) {
    type === 'mouseenter' ? setIsHover(false) : setIsHover(true)
  }

  function onClose() {
    setShow(false)
    dispatch({
      type: 'SHOW_TOAST',
      payload: { message: '', type: '', btnTxt: '' }
    })
  }

  return (
    <Toast
      onClose={onClose}
      show={show}
      delay={4000}
      autohide={isHover}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      // className={`${styles.toast} ${type === 'success' ? styles.success : styles.danger} font-semi`}
      className={`toast-b ${type === 'success' ? 'success text-success' : 'danger text-danger'} font-semi position-fixed overflow-hidden px-3 py-2 br-sm end-0 me-4`}
    >
      <div className="d-flex align-items-center justify-content-between">
        <Toast.Body>{msg}</Toast.Body>
        <Button onClick={onClose} variant="link" className="btnClose ms-2 flex-shrink-0 overflow-hidden rounded-circle">
          <CloseIcon />
        </Button>
      </div>
    </Toast>
  )
}

Toastr.propTypes = {
  type: PropTypes.string,
  msg: PropTypes.string,
  btnTxt: PropTypes.string
}
export default Toastr
