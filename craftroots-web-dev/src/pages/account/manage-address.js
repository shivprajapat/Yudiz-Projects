import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { useDispatch, useSelector } from 'react-redux'
import AccountManagements from './index'
import useModal from '@/hooks/useModal'
import { AddressFormModal, AddressItem, Meta } from '@/components/generic'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import useLoginAddress from '@/hooks/useLoginAddress'
import { getAllAddressLogin } from '@/actions/cartAction'
import ConfirmationDeleteModal from '@/components/generic/modal/ConfirmationDeleteModal'
import META from '@/helper/meta-constant'

const ManageAddress = () => {
  const { isShowing, toggle } = useModal()
  const dispatch = useDispatch()
  useDisableBodyScroll(isShowing)
  const { loginAddressees } = useSelector((state) => state.cartReducer)
  const {
    selectedAddress,
    setSelectedAddress,
    deleteHandler,
    setIsShowDeleteModal,
    setId,
    isShowDeleteModal,
  } = useLoginAddress()

  useEffect(() => {
    dispatch(getAllAddressLogin())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const outSideHandler = (e) => {
  //   e.stopPropagation()
  // }

  const closeConfirm = () => {
    setIsShowDeleteModal(!isShowDeleteModal)
  }
  return (
    <>
      <Meta
        title={META.manageAddress.title}
        description={META.manageAddress.description}
      />
      <AccountManagements>
        <div className="capitalize border-b border-grey-400 pb-4 mb-6">
          <h5 className="text-grey-900 font-jost text-xl font-semibold">
            <FormattedMessage id="page.myAccount.title.manageAddress" />
          </h5>
        </div>
        <div className="flex flex-col-reverse sm:flex-col">
          <button
            className="text-secondary-200 border border-dashed border-grey-400 p-4 sm:mb-6 w-full text-left text-sm font-medium relative z-10"
            onClick={() => {
              toggle()
              setSelectedAddress({})
            }}
          >
            <span className="pr-1">+</span>
            <FormattedMessage id="button.addNewAddress" />
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-2 flex-row-reverse gap-2 sm:gap-6">
            {loginAddressees?.map((add) => {
              return (
                <AddressItem
                  key={add.id}
                  BadgeTitle="header.item.home"
                  address={add}
                  setSelectedAddress={setSelectedAddress}
                  toggle={toggle}
                  setId={setId}
                  setIsShowDeleteModal={setIsShowDeleteModal}
                />
              )
            })}
          </div>
        </div>
      </AccountManagements>
      {isShowing && (
        <AddressFormModal
          isShowing={isShowing}
          toggle={toggle}
          // handleClick={handleClick}
          address={selectedAddress}
        />
      )}
      {isShowDeleteModal && (
        <ConfirmationDeleteModal
          itemName="address"
          isShowing={isShowDeleteModal}
          closeConfirm={closeConfirm}
          confirmHandler={deleteHandler}
        />
      )}
    </>
  )
}

export default ManageAddress
