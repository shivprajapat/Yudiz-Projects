import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import styles from '../style.module.scss'

function Otp({ setOtp, type, isClear }) {
  const otp = useRef()

  useEffect(() => {
    if (isClear) {
      otp.current.value = ''
    }
  }, [isClear])

  return (
    <div className={styles.otpContainer}>
      <input
        ref={otp}
        className={styles.otpInput}
        minLength="4"
        maxLength="4"
        pattern="[0-9]+"
        onChange={({ target }) => setOtp(target?.value)}
        required
      />
    </div>
  )
}

Otp.propTypes = {
  setOtp: PropTypes.func,
  type: PropTypes.string,
  isClear: PropTypes.bool
}

export default Otp
