import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { Badge, Button, OrderReturnModal, Price } from '@/components/generic'
import useModal from '@/hooks/useModal'
import { ORDER_STATUS } from '@/helper/constant'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import { allRoutes } from '@/constants/allRoutes'
import { iconWalletOutline } from '@/assets/images'
const OrderInvoiceDropdown = dynamic(() => import('./OrderInvoiceDropdown'), {
  ssr: false,
})
const OrderStatusBadge = dynamic(() => import('./OrderStatusBadge'))

const OrderDetailsHeader = ({
  orderData,
  // trackOrderHandle,
  cancelOrderState,
  setId,
  setIsShowDeleteModal,
  incrementId,
}) => {
  const intl = useIntl()
  const { isShowing, toggle } = useModal()

  const outSideHandler = (e) => {
    e.stopPropagation()
  }

  useDisableBodyScroll(isShowing)

  const buttonLabels = {
    returnOrder: intl.formatMessage({ id: 'button.returnOrder' }),
    invoice: intl.formatMessage({ id: 'button.invoice' }),
    cancelOrder: intl.formatMessage({ id: 'button.cancelOrder' }),
    trackOrder: intl.formatMessage({ id: 'button.trackOrder' }),
    returnOrder: intl.formatMessage({ id: 'button.returnOrder' }),
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-grey-400 flex-wrap gap-2">
        <div>
          <h6 className="text-lg sm:text-2xl mb-2 font-medium">
            <FormattedMessage id="page.myOrderDetails.title" />
          </h6>
          <p className="text-sm sm:text-base">
            Ordered on: {orderData?.created_at}
          </p>
        </div>
        <div className="flex gap-2 items-end flex-wrap">
          {orderData?.status && <OrderStatusBadge status={orderData?.status} />}

          <div className="flex gap-2 flex-wrap">
            {orderData?.hasCreditmemos && (
              <Badge
                className="flex items-center bg-success font-normal rounded-none"
                title={
                  <>
                    <Image
                      className="icon-white mr-2"
                      src={iconWalletOutline}
                      alt={intl.formatMessage({
                        id: 'page.myAccount.title.storeCredit',
                      })}
                    />
                    <p className="flex gap-2 font-jost text-sm sm:text-base tracking-wider">
                      Refund Credited of{' '}
                      <Price price={orderData?.refunds_store_credit} />
                    </p>
                  </>
                }
              />
            )}
            {orderData?.status === ORDER_STATUS.delivered && (
              <Button
                title={buttonLabels.returnOrder}
                border
                className="!px-3.5 !py-1.5 sm:!py-[9px]"
                onClick={toggle}
              />
            )}
            <OrderInvoiceDropdown orderData={orderData} />
            {orderData?.status === ORDER_STATUS.pending && (
              <Button
                title={buttonLabels.cancelOrder}
                border
                btnLoader={cancelOrderState.isLoading}
                className="!px-3.5 !py-1.5 sm:!py-[9px]"
                onClick={() => {
                  setId(incrementId)
                  setIsShowDeleteModal(true)
                }}
              />
            )}
            {orderData?.status === ORDER_STATUS.processing && (
              <Link
                target="_blank"
                href={allRoutes.shiprocketUrl}
                className="font-jost font-medium text-xs sm:text-sm leading-6 tracking-[1.7px] uppercase sm:px-5 md:px-6 text-center focus:shadow-none ease-in-out duration-300 bg-grey-900 hover:bg-secondary-100 !text-grey-900 bg-transparent border border-grey-900 hover:!text-white !px-3.5 !py-1.5 sm:!py-[9px]"
              >
                {buttonLabels.trackOrder}
              </Link>
            )}
          </div>
        </div>
      </div>
      <OrderReturnModal
        isShowing={isShowing}
        toggle={toggle}
        orderNumber={orderData?.increment_id}
        outSideHandler={outSideHandler}
      />
    </>
  )
}

export default OrderDetailsHeader
OrderDetailsHeader.propTypes = {
  cancelOrderHandle: PropTypes.func,
  // trackOrderHandle: PropTypes.func,
  invoiceOrderHandle: PropTypes.func,
  orderData: PropTypes.any,
  invoiceDetailsState: PropTypes.shape({
    isLoading: PropTypes.bool,
    isSuccess: PropTypes.bool,
    isFailed: PropTypes.bool,
    data: PropTypes.any,
    error: PropTypes.any,
  }),
  cancelOrderState: PropTypes.shape({
    isLoading: PropTypes.bool,
    isSuccess: PropTypes.bool,
    isFailed: PropTypes.bool,
    data: PropTypes.any,
    error: PropTypes.any,
  }),
  returnOrderHandle: PropTypes.func,
  setId: PropTypes.func.isRequired,
  setIsShowDeleteModal: PropTypes.func.isRequired,
  incrementId: PropTypes.string.isRequired,
}
