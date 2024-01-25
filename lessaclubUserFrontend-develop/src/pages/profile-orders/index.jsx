import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import OrderHeader from './components/order-header'
import SingleOrder from './components/single-order'
import useOrders from './hooks/use-orders'

const CustomPagination = React.lazy(() => import('shared/components/custom-pagination'))

const Orders = () => {
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
Orders.propTypes = {
  assets: PropTypes.object,
  handleOrderChange: PropTypes.func,
  handleOrderTimeFilter: PropTypes.func
}
export default Orders
