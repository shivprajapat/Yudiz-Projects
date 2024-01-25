import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import OrderHeader from 'pages/profile-orders/components/order-header'
import SingleOrder from 'pages/profile-orders/components/single-order'
import useOrders from 'pages/profile-orders/hooks/use-orders'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const OrdersToSend = () => {
  const { assets, handleOrderChange, handleOrderTimeFilter, handlePageChange, handleOrderTypeFilter } = useOrders()
  return (
    <>
      <OrderHeader
        handleOrderTypeFilter={handleOrderTypeFilter}
        handleOrderChange={handleOrderChange}
        handleOrderTimeFilter={handleOrderTimeFilter}
        totalItems={assets?.metaData?.totalItems}
      />
      {assets?.order?.length ? (
        <>
          {assets.order.map((asset) => (
            <SingleOrder asset={asset} key={asset.id} />
          ))}
        </>
      ) : (
        <h4 className="my-5">
          <FormattedMessage id="noDataFound" />
        </h4>
      )}
      <Suspense fallback={<div />}>
        <CustomPagination
          currentPage={assets?.metaData?.currentPage}
          totalCount={assets?.metaData?.totalItems}
          pageSize={12}
          onPageChange={handlePageChange}
          id="profile-tabs"
        />
      </Suspense>
    </>
  )
}
OrdersToSend.propTypes = {
  assets: PropTypes.object,
  handleOrderChange: PropTypes.func,
  handleOrderTimeFilter: PropTypes.func
}
export default OrdersToSend
