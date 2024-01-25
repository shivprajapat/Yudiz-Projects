import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Toast } from 'react-bootstrap'
import { ToastrContext } from '.'
import styles from './style.module.scss'
import { CloseIcon } from '../ctIcons'
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
      className={`${styles.toast} ${type === 'success' ? styles.success : styles.danger} font-semi`}
    >
      <div className="d-flex align-items-center justify-content-between">
        <Toast.Body>{msg}</Toast.Body>
        <Button onClick={onClose} variant="link" className={`${styles.btnClose} ms-2 flex-shrink-0`}>
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
