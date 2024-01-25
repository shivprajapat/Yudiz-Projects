import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import styles from '../style.module.scss'

function Otp({ setOtp, type, isClear }) {
  const otp = useRef()
  const otpIsValid = useRef(true)

  useEffect(() => {
    if (otp.current.value && otpIsValid.current) {
      setOtp(otp.current.value)
    }
  })

  useEffect(() => {
    if (isClear) {
      otp.current.value = ''
    }
  }, [isClear])

  return (
    <div className={styles.otpContainer}>
      <input className={styles.otpInput} minLength="4" maxLength="4" ref={otp} pattern="[0-9]+" required/>
    </div>
  )
}

Otp.propTypes = {
  setOtp: PropTypes.func,
  type: PropTypes.string,
  isClear: PropTypes.bool
}

export default Otp
