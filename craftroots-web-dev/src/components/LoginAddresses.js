import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import SkeletonCartAddress from './generic/skeleton/SkeletonCartAddress'
import { AddressFormModal, Checkbox } from './generic'
import AddressForm from './generic/form/AddressForm'
import ShippingMethod from './ShippingMethod'
import { CheckoutPriceItem, CheckoutSummaryProductItem } from './checkout'
import { iconEdit } from '@/assets/images'

import useLoginAddress from '@/hooks/useLoginAddress'
import useModal from '@/hooks/useModal'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'

function LoginAddresses() {
  const intl = useIntl()
  const { isShowing, toggle } = useModal()
  const handleClick = (e) => {
    e.stopPropagation()
  }

  const {
    addresses,
    billingAddress,
    loginAddressees,
    getAddressLoading,
    items,
    prices,
  } = useSelector((state) => state.cartReducer)
  const {
    addressHandler,
    billingHandler,
    billingAddressChecked,
    onSubmitBillingAddress,
    setAddress,
    setSelectedAddress,
    selectedAddress,
    index,
  } = useLoginAddress()
  useDisableBodyScroll(isShowing)

  return (
    <>
      <div className="flex gap-8 sm:gap-10 flex-col md:flex-row justify-between">
        <div className="w-full md:w-[50%] lg:w-[75%] xl:w-[60%]">
          <div className="mb-4 md:mb-8">
            <h6 className="font-jost font-semibold text-xl">
              <FormattedMessage id="page.thankYou.shippingAddress" />
            </h6>
          </div>
          <div>
            {getAddressLoading ? (
              <SkeletonCartAddress display={3} />
            ) : (
              loginAddressees?.map((add) => {
                return (
                  <label
                    className={`${
                      index === add.id && '!border-secondary-200'
                    } radio address-label`}
                    htmlFor={add.id}
                    key={add.id}
                  >
                    <div className="flex justify-between items-start sm:items-center relative w-full">
                      <input
                        type="radio"
                        name="radio"
                        id={add.id}
                        checked={index === add.id}
                        onClick={() => {
                          setAddress(add)
                        }}
                      />
                      <span className="checkmark w-4 h-4 rounded-full absolute top-0 left-0" />
                      <div>
                        <div className="flex gap-2 flex-col items-start sm:flex-row sm:items-center mb-4">
                          <p className="text-grey-900 text-base font-semibold">
                            {add.firstname + ' ' + add.lastname}
                          </p>
                        </div>
                        <p className="text-grey-800 text-sm font-normal leading-6 w-full sm:w-[90%] md::w-[80%] lg:w-[70%]">
                          {add.street?.[0] +
                            ',' +
                            add.city +
                            ' ' +
                            add.postcode +
                            ',' +
                            (add.region.region !== null
                              ? add.region.region + ','
                              : '') +
                            'India'}
                        </p>
                      </div>
                      <div className="flex items-center flex-col gap-5">
                        <button
                          className="icon-hover"
                          onClick={() => {
                            toggle()
                            setSelectedAddress(add)
                          }}
                        >
                          <Image
                            src={iconEdit}
                            alt="edit"
                            className="w-4 h-4"
                          />
                        </button>
                        {/* <button
                  className="icon-hover"
                  onClick={() => {
                    deleteModalHandler()
                    setId(add.id)
                  }}
                  //  onClick={()=>deleteHandler(i.id)}
                >
                  <Image
                    src={iconTrash}
                    alt="trash"
                    className="w-4 h-4"
                  />
                </button> */}
                      </div>
                    </div>
                  </label>
                )
              })
            )}
            <div className="pt-3 pb-4">
              <button
                className="text-secondary-200 border border-dashed border-grey-400 p-4 sm:mb-4 w-full text-left text-sm font-medium relative z-10"
                onClick={() => {
                  toggle()
                  setSelectedAddress({})
                }}
              >
                <span className="pr-1">+</span>
                <FormattedMessage id="button.addAddress" />
              </button>
            </div>
          </div>
          <div>
            {loginAddressees?.length > 0 && (
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
            )}
            {!billingAddressChecked && (
              <>
                <h6 className="font-jost font-semibold text-xl my-9">
                  <FormattedMessage id="page.checkout.billibgAddress.title" />
                </h6>
                <AddressForm
                  onSubmit={onSubmitBillingAddress}
                  title={
                    <FormattedMessage id="page.checkout.setBillingAddress" />
                  }
                  resetData={billingAddress || {}}
                  isBilling={true}
                />
              </>
            )}
          </div>
          {addresses?.[0]?.available_shipping_methods && <ShippingMethod />}
        </div>
        <div className="w-full md:w-[50%] lg:w-[35%] xl:w-[30%]">
          <div className="mb-3">
            <div className="mb-4 md:mb-8">
              <h6 className="font-jost font-semibold text-xl">
                <FormattedMessage id="page.checkout.title.orderSummary" />
              </h6>
            </div>
            <div className="overflow-hidden">
              {items?.map((i) => {
                return <CheckoutSummaryProductItem key={i.id} item={i} />
              })}
              {/* <button className="flex items-center gap-2 my-6 sm:my-4">
                <span className="text-grey-800 text-sm">
                  <FormattedMessage id="button.loadMore" />
                </span>
                <Image
                  src={iconArrowDown}
                  alt="arrow"
                  className="w-3 h-3 mt-[3px]"
                />
              </button> */}
              <CheckoutPriceItem
                padding
                prices={prices}
                btnTitle={intl.formatMessage({
                  id: 'button.continue',
                })}
                onCheckoutClick={addressHandler}
              />
            </div>
          </div>
        </div>
      </div>
      {isShowing && (
        <AddressFormModal
          isShowing={isShowing}
          toggle={toggle}
          handleClick={handleClick}
          address={selectedAddress}
        />
      )}
    </>
  )
}

export default LoginAddresses
