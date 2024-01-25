import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { alertClass, modalMessageFunc } from './helper'
import { UncontrolledAlert } from 'reactstrap'

function ModalComponent (props) {
  const { error } = props
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [close, setClose] = useState(false)

  useEffect(() => {
    if (error) {
      setMessage(error)
      setModalMessage(true)
      modalMessageFunc(true, setModalMessage, setClose)
    }
  }, [])

  return (
    <Fragment>
      {modalMessage && message && <UncontrolledAlert color='primary' className={alertClass(false, close)}>{message}</UncontrolledAlert> }
    </Fragment>
  )
}

ModalComponent.propTypes = {
  error: PropTypes.object
}

export default ModalComponent
