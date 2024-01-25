import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Meta, OrderDetailsHeader } from '@/components/generic'
import SkeletonOrderDetails from '@/components/generic/skeleton/SkeletonOrderDetails'
import { BRAND_NAME } from '@/helper/constant'
import useOrderDetails from '@/hooks/useOrderDetails'
import ConfirmationDeleteModal from '@/components/generic/modal/ConfirmationDeleteModal'
import SuccessOrderSummary from '@/components/SuccessOrderSummary'
import { filteredOrderData } from '@/helper'
const OrderDetailsProductItem = dynamic(() =>
  import('@/components/account/OrderDetailsItem')
)

const MyOrderDetails = () => {
  const {
    orderId,
    orderData,
    loading,
    invoiceHandle,
    // orderTrackHandle,
    cancelOrderHandle,
    cancelOrderState,
    deleteHandler,
    setId,
    setIsShowDeleteModal,
    isShowDeleteModal,
    closeConfirm,
  } = useOrderDetails()
  const filteredOrder = filteredOrderData(orderData?.orderDetails)

  return (
    <>
      <Meta title={`Order ${orderId?.[0] || ''} | ${BRAND_NAME}`} />
      <section className="section-padding container">
        {loading ? (
          <SkeletonOrderDetails width="500" height="500" />
        ) : (
          <>
            <OrderDetailsHeader
              orderData={filteredOrder}
              invoiceOrderHandle={invoiceHandle}
              // trackOrderHandle={orderTrackHandle}
              returnOrderBtn={true}
              invoiceBtn={true}
              cancelOrderState={cancelOrderState}
              cancelOrderHandle={() =>
                cancelOrderHandle(orderData?.orderDetails?.increment_id)
              }
              setId={setId}
              incrementId={orderData?.orderDetails?.increment_id}
              setIsShowDeleteModal={setIsShowDeleteModal}
            />
            <SuccessOrderSummary orderSummary={filteredOrder} />

            {orderData?.orderDetails?.items.map((item) => {
              return (
                <OrderDetailsProductItem
                  key={item.id}
                  product={item}
                  orderId={orderId[0] || ''}
                />
              )
            })}

            {isShowDeleteModal && (
              <ConfirmationDeleteModal
                itemName="order"
                isShowing={isShowDeleteModal}
                closeConfirm={closeConfirm}
                confirmHandler={deleteHandler}
                loading={cancelOrderState?.isLoading}
                actionWord="cancel"
              />
            )}
          </>
        )}
      </section>
    </>
  )
}

export default MyOrderDetails
MyOrderDetails.propTypes = {
  orderData: PropTypes.object,
}
