import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

import { iconEdit, iconTrash } from '@/assets/images'

const AddressItem = ({
  address,
  setSelectedAddress,
  toggle,
  setId,
  setIsShowDeleteModal,
}) => {
  return (
    <div className="address-label !p-2.5 sm:!p-6 " htmlFor="home">
      <div className="flex justify-between items-start sm:items-center relative w-full">
        <div>
          <div className="flex gap-2 mb-4 flex-col items-start">
            <p className="text-grey-900 text-base font-semibold">
              {/* <FormattedMessage id={Title} />
               */}
              {address?.firstname + ' ' + address?.lastname}
            </p>
            {/* <Badge
              title={intl.formatMessage({ id: BadgeTitle })}
              className="border border-success rounded-none text-success !text-xs"
            /> */}
          </div>
          <p className="text-grey-800 text-sm font-normal leading-6 w-full sm:w-[90%] md::w-[80%] lg:w-[70%]">
            {address?.street?.[0] +
              ',' +
              address?.city +
              ' ' +
              address?.postcode +
              ',' +
              (address?.region?.region || address?.region?.label) +
              ',' +
              'India'}
          </p>
        </div>
        <div className="flex items-center flex-col gap-3 pt-4">
          <div className="flex gap-2 absolute top-0 sm:top-[-10px] right-[-10px] text-primary">
            <span>{address?.default_shipping && 'Shipping'}</span>
            {address?.default_shipping && address?.default_billing && (
              <span className="w-1 block"> |</span>
            )}
            {address?.default_billing && 'Billing'}
            <span></span>
          </div>
          <button
            className="icon-hover mt-1"
            onClick={() => {
              toggle()
              setSelectedAddress(address)
            }}
          >
            <Image src={iconEdit} alt="edit" className="w-4 h-4" />
          </button>
          <button
            className="icon-hover"
            onClick={() => {
              setId(address?.id)
              setIsShowDeleteModal(true)
            }}
          >
            <Image src={iconTrash} alt="trash" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddressItem
AddressItem.propTypes = {
  checked: PropTypes.bool,
  address: PropTypes.object.isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  setId: PropTypes.func,
  setIsShowDeleteModal: PropTypes.func.isRequired,
}

AddressItem.defaultProps = {
  setId: () => {},
}
