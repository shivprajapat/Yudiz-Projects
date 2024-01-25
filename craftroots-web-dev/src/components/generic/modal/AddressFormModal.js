import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { useDispatch } from 'react-redux'
import { useIntl } from 'react-intl'
import CloseButton from '../CloseButton'
import AddressForm from '../form/AddressForm'
import Checkbox from '../form/checkbox'
import useAsync from '@/hooks/useAsync'
import { request } from '@/services/api.service'
import { AddAddressLogin, UpdateAddress } from '@/queries/checkoutQueries'
import { getAllAddressLogin } from '@/actions/cartAction'

const AddressFormModal = ({ isShowing, handleClick, toggle, address }) => {
  const AddAddressRes = useAsync(null, null)
  const intl = useIntl()

  const UpdateAddRes = useAsync(null, null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [defaultShippingCheck, setDefaultShippingCheck] = useState(false)
  const [defaultBillingCheck, setDefaultBillingCheck] = useState(false)

  useEffect(() => {
    if (Object.keys(address)?.length > 0) {
      setDefaultBillingCheck(address?.default_billing)
      setDefaultShippingCheck(address?.default_shipping)
    }
  }, [address])

  const onSubmit = async (data) => {
    if (Object.keys(address).length === 0) {
      AddAddressRes.run(request, {
        ...AddAddressLogin,
        variables: {
          address: {
            firstname: data?.firstName,
            lastname: data?.lastName,
            street: data?.address,
            city: data.city,
            region: {
              region_id: data?.state?.value,
              region: data?.state?.label,
            },
            postcode: data?.postalCode,
            country_code: data?.country?.value,
            telephone: data?.phone,
            default_shipping: defaultShippingCheck,
            default_billing: defaultBillingCheck,
          },
        },
      })
    } else {
      UpdateAddRes.run(request, {
        ...UpdateAddress,
        variables: {
          id: address.id,
          address: {
            firstname: data?.firstName,
            lastname: data?.lastName,
            street: data?.address,
            city: data.city,
            region: {
              region_id: data?.state?.value,
              region: data?.state?.label,
            },
            postcode: data?.postalCode,
            country_code: data?.country?.value,
            telephone: data?.phone,
            default_shipping: defaultShippingCheck,
            default_billing: defaultBillingCheck,
          },
        },
      })
      // if(result){
      //   dispatch(getAllAddressLogin())
      //   toggle()
      // }
    }
  }

  useEffect(() => {
    if (AddAddressRes.state.isSuccess || UpdateAddRes.state.isSuccess) {
      dispatch(getAllAddressLogin())
      toggle()
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [
    AddAddressRes.state.isSuccess,
    UpdateAddRes.state.isSuccess,
    AddAddressRes.state.isFailed,
    UpdateAddRes.state.isFailed,
  ])

  useEffect(() => {
    if (AddAddressRes.state.isLoading || UpdateAddRes.state.isLoading) {
      setLoading(true)
    }
  }, [AddAddressRes.state.isLoading, UpdateAddRes.state.isLoading])

  const shippingCheckHandler = (isCheck) => {
    setDefaultShippingCheck(isCheck)
  }
  const billingCheckHandler = (isCheck) => {
    setDefaultBillingCheck(isCheck)
  }

  // console.log('address', address,Object.keys(address).length > 0)
  return (
    <div className={`modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" />
      <div className="modal-content h-[80%] sm:h-auto">
        <div className="modal-bg">
          <div className="modal-size w-[600px]">
            <div onClick={handleClick}>
              <div className="flex justify-between items-center border-b border-grey-400 pb-3">
                <h3 className="text-xl font-semibold font-jost text-gray-900">
                  {/* <FormattedMessage id="page.checkout.title.addNewAddress" /> */}
                  {Object.keys(address).length > 0
                    ? 'Update Address'
                    : 'Add Address'}
                </h3>
                <CloseButton onClick={toggle} />
              </div>
              <div className="mt-4">
                <AddressForm
                  resetData={address}
                  title={
                    Object.keys(address).length > 0 ? 'Update' : 'Add Address'
                  }
                  onSubmit={onSubmit}
                  loading={loading}
                  isMyAccount={true}
                />
                <div className="mt-4">
                  <Checkbox
                    title={intl.formatMessage({
                      id: 'useAsMyDefaultShippingAddress',
                    })}
                    value={intl.formatMessage({
                      id: 'useAsMyDefaultShippingAddress',
                    })}
                    className="text-start"
                    onCheckHandler={shippingCheckHandler}
                    checked={defaultShippingCheck}
                  />
                  <Checkbox
                    title={intl.formatMessage({
                      id: 'useAsMyDefaultBillingAddress',
                    })}
                    value={intl.formatMessage({
                      id: 'useAsMyDefaultBillingAddress',
                    })}
                    className="text-start"
                    onCheckHandler={billingCheckHandler}
                    // onCheckHandler={billingHandler}
                    checked={defaultBillingCheck}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressFormModal
AddressFormModal.propTypes = {
  toggle: PropTypes.bool,
  isShowing: PropTypes.bool,
  handleClick: PropTypes.func,
  address: PropTypes.object,
}

AddressFormModal.defaultProps = {
  address: {},
}
