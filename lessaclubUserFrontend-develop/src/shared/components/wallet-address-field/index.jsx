import React, { useEffect } from 'react'
import { Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'

import { validationErrors } from 'shared/constants/validationErrors'
import { isWalletAddressValid } from 'modules/blockchainNetwork'

const WalletAddressField = ({ errors, name, register, setValue, clearErrors, label, setValueFromWalletStore = true }) => {
  const labels = {
    enterWalletAddress: useIntl().formatMessage({ id: 'enterWalletAddress' })
  }
  const walletAccountStore = useSelector((state) => state.wallet)
  useEffect(() => {
    if (walletAccountStore && walletAccountStore?.account) {
      if (setValueFromWalletStore) {
        setValue(name, walletAccountStore.account)
      }
      clearErrors(name)
    } else {
      if (name !== 'receiverAddress') {
        setValue(name, '')
      }
    }
  }, [walletAccountStore])

  return (
    <Form.Group className="form-group">
      <Form.Label>
        {label ? (
          <>
            {label}
            <sup style={{ fontSize: '1.2em', top: '0', color: '#fff' }}>*</sup>
          </>
        ) : (
          <FormattedMessage id="walletAddress" />
        )}
      </Form.Label>
      <Form.Control
        type="text"
        name={name}
        className={errors?.[name] && 'error'}
        {...register(name, {
          required: validationErrors.required,
          validate: (value) => isWalletAddressValid({ walletAccountStore, address: value }) || validationErrors.walletAddress
        })}
        placeholder={labels.enterWalletAddress}
      />
      {errors?.[name] && (
        <Form.Control.Feedback type="invalid" className="invalidFeedback">
          {errors?.[name].message}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}
WalletAddressField.propTypes = {
  errors: PropTypes.object,
  name: PropTypes.string,
  register: PropTypes.func,
  setValue: PropTypes.func,
  clearErrors: PropTypes.func,
  label: PropTypes.string,
  walletAccountStore: PropTypes.object,
  setValueFromWalletStore: PropTypes.bool
}

export default WalletAddressField
