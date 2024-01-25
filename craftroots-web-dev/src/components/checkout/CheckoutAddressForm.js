import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import PropTypes from 'prop-types'

import { useDispatch, useSelector } from 'react-redux'
import { request } from '@/services/api.service'
import { STORAGE_KEYS } from '@/helper/constant'
import { GuestEmailRegister } from '@/queries/checkoutQueries'
import { Checkbox } from '@/components/generic'
import AddressForm from '@/components/generic/form/AddressForm'
import { constants } from '@/actions/type'
import { billingAction, setShippingAddress } from '@/actions/cartAction'
import { trimString } from '@/helper'

const CheckoutAddressForm = ({ email }) => {
  const dispatch = useDispatch()
  const { addresses, billingAddress, sameAddresses } = useSelector(
    (state) => state.cartReducer
  )
  const [billingAddressChecked, setBillingAddressChecked] =
    useState(sameAddresses)

  const onSubmit = async (data) => {
    try {
      const result = await request({
        ...GuestEmailRegister,
        variables: {
          cart_id: localStorage.getItem(STORAGE_KEYS.cartId),
          email: email,
        },
      })
      if (result) {
        const address = [
          {
            address: {
              firstname: trimString(data?.firstName),
              lastname: trimString(data?.lastName),
              street: [data?.address],
              city: trimString(data.city),
              region_id: +data?.state?.value,
              postcode: trimString(data?.postalCode),
              country_code: data?.country?.value,
              telephone: trimString(data?.phone),
              save_in_address_book: false,
            },
          },
        ]
        dispatch(setShippingAddress(address))
      }
    } catch (error) {
      console.log('errorrrrrr', error)
    }
  }

  const onSubmitBillingAddress = async (data) => {
    const address = {
      firstname: trimString(data?.firstName),
      lastname: trimString(data?.lastName),
      street: [data?.address],
      city: trimString(data.city),
      region: { region_id: +data?.state?.value, label: data?.state?.label },
      postcode: trimString(data?.postalCode),
      country_code: data?.country?.value,
      telephone: trimString(data?.phone),
      save_in_address_book: false,
    }
    dispatch(billingAction(address))
  }
  const intl = useIntl()

  const billingHandler = (isChecked) => {
    setBillingAddressChecked(isChecked)
    if (!isChecked) {
      dispatch(billingAction({}))
    }
    dispatch({ type: constants.SET_SAME_ADDRESS, sameAddresses: isChecked })
  }

  useEffect(() => {
    setBillingAddressChecked(sameAddresses)
  }, [sameAddresses])

  return (
    <>
      <AddressForm
        onSubmit={onSubmit}
        title="check shipping information"
        resetData={addresses?.[0] || {}}
        isShipping={true}
      />
      <div className="form-group text-left mt-5">
        <Checkbox
          title={intl.formatMessage({
            id: 'billingAddressTheSameAsShippingAddress',
          })}
          value={intl.formatMessage({
            id: 'billingAddressTheSameAsShippingAddress',
          })}
          onCheckHandler={billingHandler}
          checked={billingAddressChecked}
        />
      </div>
      {!billingAddressChecked && (
        <>
          <div className="mb-4 md:mb-8">
            <h6 className="font-jost font-semibold text-xl">
              <FormattedMessage id="page.checkout.billibgAddress.title" />
            </h6>
          </div>
          <AddressForm
            onSubmit={onSubmitBillingAddress}
            title="set billing address"
            resetData={billingAddress || {}}
            isBilling={true}
          />
        </>
      )}
    </>
  )
}

export default CheckoutAddressForm
CheckoutAddressForm.propTypes = {
  onNext: PropTypes.func,
  email: PropTypes.string.isRequired,
}

CheckoutAddressForm.defaultProps = {
  billingAddress: {},
}
// {intl.formatMessage({
//   id: 'button.addAddress',
// })}
