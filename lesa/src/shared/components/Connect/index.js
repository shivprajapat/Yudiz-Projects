import React from 'react'
import styles from './Connect.module.sass'
import Icon from '../Icon'

const Connect = () => {
  return (
    <div>
      <div className={styles.icon}>
        <Icon name="wallet" size="24" />
      </div>
      <div className={styles.info}>You need to connect your wallet first to sign messages and send transaction to Ethereum network</div>
      <div className={styles.btns}>
        <button>Connect wallet</button>
        <button>Cancel</button>
      </div>
    </div>
  )
}

export default Connect
