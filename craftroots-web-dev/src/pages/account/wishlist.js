import React from 'react'
import { FormattedMessage } from 'react-intl'

import AccountManagements from './index'
import { CardEmpty, Meta, Pagination } from '@/components/generic'
import useWishlist from '@/hooks/useWishlist'
import { iconCartEmpty } from '@/assets/images'
import WishlistItem from '@/components/account/WishlistItem'
import META from '@/helper/meta-constant'
import { usePagination } from '@/hooks/usePagination'
import { allRoutes } from '@/constants/allRoutes'
import { getTotalPageCount } from '@/helper/account-helper'

const Wishlist = () => {
  const {
    wishlistStateItems,
    deleteProductFromWishlistHandle,
    intl,
    removeItemFromWishlistResult,
    wishlistRef,
    removeWishlistLoading,
  } = useWishlist()
  const { currentPage, itemsPerPage, paginatedItems, handlePageChange } =
    usePagination(wishlistStateItems?.data?.items, allRoutes.wishlist)

  return (
    <>
      <Meta
        title={META.wishlist.title}
        description={META.wishlist.description}
      />
      <AccountManagements>
        <div
          className="capitalize sm:border-b border-grey-400 sm:pb-4 sm:mb-6"
          ref={wishlistRef}
        >
          <h5 className="text-grey-900 font-jost text-xl font-semibold">
            <FormattedMessage id="page.myAccount.title.wishlist" />(
            {wishlistStateItems?.items_count || 0})
          </h5>
        </div>
        <div>
          {paginatedItems && paginatedItems.length > 0 ? (
            paginatedItems.map((item) => {
              const { product } = item
              return (
                <WishlistItem
                  product={product}
                  key={product?.url_key}
                  disableDelete={removeWishlistLoading}
                  onDeleteClick={() =>
                    deleteProductFromWishlistHandle(product.id)
                  }
                  wishListState={removeItemFromWishlistResult.state}
                />
              )
            })
          ) : (
            <div className="pt-9 sm:pt-12 flex items-start justify-center h-full">
              <CardEmpty
                icon={iconCartEmpty}
                title={intl.formatMessage({
                  id: 'emptyCart.wishlist.title',
                })}
                description={intl.formatMessage({
                  id: 'emptyCart.wishlist.description',
                })}
                btnTitle={intl.formatMessage({
                  id: 'button.continueShopping',
                })}
                TitleSize="!text-xl"
                DescriptionSize="!text-lg"
              />
            </div>
          )}
        </div>
        {wishlistStateItems?.data?.items?.length > 5 && (
          <div className="flex items-center justify-between gap-3 mt-8 flex-col sm:flex-row">
            {
              <p className="text-grey-700 text-sm font-medium">
                Showing {currentPage} of{' '}
                {getTotalPageCount(
                  wishlistStateItems?.items_count,
                  itemsPerPage
                )}{' '}
                pages
              </p>
            }
            <Pagination
              totalItems={wishlistStateItems.items_count}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </AccountManagements>
    </>
  )
}

export default Wishlist
