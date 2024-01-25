import React from 'react'
import { FormattedMessage } from 'react-intl'
import AccountManagements from '..'
import useModal from '@/hooks/useModal'
import {
  CardEmpty,
  Meta,
  MobileOrderFilter,
  MyOrdersProductListItem,
  Pagination,
} from '@/components/generic'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import useMyOrders from '@/hooks/useMyOrders'
import { iconEmptySearch } from '@/assets/images'
import SkeletonOrderList from '@/components/generic/skeleton/SkeletonOrderList'
import { getTotalPageCount } from '@/helper/account-helper'
import META from '@/helper/meta-constant'
import ConfirmationDeleteModal from '@/components/generic/modal/ConfirmationDeleteModal'

const MyOrders = () => {
  const { isShowing, toggle } = useModal()

  const {
    loadingOrderList,
    cancelOrderResult,
    orderlistData,
    currentPage,
    itemsPerPage,
    orderListRef,
    handlePageChange,
    intl,
    deleteHandler,
    setId,
    setIsShowDeleteModal,
    isShowDeleteModal,
    closeConfirm,
  } = useMyOrders()

  useDisableBodyScroll(isShowing)
  return (
    <>
      <Meta title={META.myOrder.title} description={META.myOrder.description} />
      <AccountManagements>
        <div
          className="flex items-center justify-between  border-b border-grey-400 pb-4"
          ref={orderListRef}
        >
          <h5 className="text-grey-900 font-jost text-xl font-semibold">
            <FormattedMessage id="page.myAccount.title.myOrders" />
          </h5>
        </div>
        {loadingOrderList ? (
          <SkeletonOrderList
            className="mt-4 container"
            width="500"
            height="500"
          />
        ) : (
          <>
            {orderlistData?.items.length > 0 ? (
              orderlistData?.items.map((item, index) => (
                <MyOrdersProductListItem
                  key={index}
                  price={item?.grand_total}
                  orderId={item?.id}
                  status={item?.status}
                  totalItems={item?.items_count}
                  orderDate={item?.created_at}
                  cancelOrderHandle={() =>
                    cancelOrderHandle(item?.increment_id)
                  }
                  isCancelLoading={cancelOrderResult?.state?.isLoading}
                  setId={setId}
                  incrementId={item?.increment_id}
                  setIsShowDeleteModal={setIsShowDeleteModal}
                />
              ))
            ) : (
              <div className="pt-9 sm:pt-12 flex items-start justify-center h-full">
                <CardEmpty
                  icon={iconEmptySearch}
                  title={intl.formatMessage({
                    id: 'emptyCart.myOrder.title',
                  })}
                  description={intl.formatMessage({
                    id: 'emptyCart.myOrder.description',
                  })}
                  btnTitle={intl.formatMessage({
                    id: 'button.continueShopping',
                  })}
                  TitleSize="!text-xl"
                  DescriptionSize="!text-lg"
                />
              </div>
            )}

            {orderlistData?.total_count > itemsPerPage && (
              <div className="flex items-center justify-between gap-3 mt-5 flex-col sm:flex-row">
                <p className="text-grey-700 text-sm font-medium">
                  Showing {currentPage} of{' '}
                  {getTotalPageCount(orderlistData?.total_count, itemsPerPage)}{' '}
                  pages
                </p>
                <Pagination
                  totalItems={orderlistData?.total_count}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            <MobileOrderFilter toggle={toggle} isShowing={isShowing} />
          </>
        )}
      </AccountManagements>
      {isShowDeleteModal && (
        <ConfirmationDeleteModal
          itemName="order"
          isShowing={isShowDeleteModal}
          closeConfirm={closeConfirm}
          confirmHandler={deleteHandler}
          loading={cancelOrderResult?.state?.isLoading}
          actionWord="cancel"
        />
      )}
    </>
  )
}

export default MyOrders
