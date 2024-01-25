import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Link from 'next/link'

import dynamic from 'next/dynamic'
import { ORDER_STATUS } from '@/helper/constant'
import { getDisplayDate } from '@/helper'
const OrderStatusBadge = dynamic(() => import('../OrderStatusBadge'))

const PRODUCT_LINK_STYLE =
  'text-secondary-100 text-sm border-b border-secondary-100 font-normal duration-300 ease-in-out hover:text-secondary-200 hover:border-secondary-200'

const MyOrdersProductListItem = ({
  price,
  orderId,
  status,
  totalItems,
  orderDate,
  isCancelLoading,
  setId,
  setIsShowDeleteModal,
  incrementId,
}) => {
  return (
    <div className="flex justify-between items-start border-b border-grey-400 py-4 gap-2 flex-col sm:flex-row">
      <div className="flex gap-4 md:gap-6 w-full sm:w-fit">
        <div className="flex-1">
          <div className="mb-1 flex gap-2 flex-col">
            <div className="flex items-center gap-4">
              <Link href={`/account/my-orders/${orderId}`}>
                <p className="text-sm text-grey-800 font-medium">
                  <FormattedMessage id="orderId" />:{' '}
                  <span className="mr-1">{orderId}</span>
                </p>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-grey-800 font-medium">
                Total Items: <span className="mr-1">{totalItems}</span>
              </p>
              <p className="text-sm text-grey-900 font-medium">
                Order Total: <span className="mr-1">{price}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-grey-800 font-medium">
                Order Date:{' '}
                <span className="mr-1">{getDisplayDate(orderDate)}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              {status && <OrderStatusBadge status={status} />}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:h-10 hidden sm:flex flex-col items-end gap-3">
        {status === ORDER_STATUS.pending && (
          <button
            type="button"
            className={PRODUCT_LINK_STYLE}
            disabled={isCancelLoading}
            onClick={() => {
              setId(incrementId)
              setIsShowDeleteModal(true)
            }}
            // onClick={() => cancelOrderHandle(orderId)}
          >
            <FormattedMessage id="page.dashboard.myOrder.cancel" />
          </button>
        )}
      </div>
    </div>
  )
}

export default MyOrdersProductListItem
MyOrdersProductListItem.propTypes = {
  orderId: PropTypes.string,
  price: PropTypes.string,
  status: PropTypes.string,
  totalItems: PropTypes.string,
  orderDate: PropTypes.string,
  cancelOrderHandle: PropTypes.func,
  isCancelLoading: PropTypes.bool,
  setId: PropTypes.func.isRequired,
  setIsShowDeleteModal: PropTypes.func.isRequired,
  incrementId: PropTypes.string.isRequired,
}
