import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import dayjs from 'dayjs'
import Link from 'next/link'
import AccountManagements from '.'
import { request } from '@/services/api.service'
import { StoreCreditData } from '@/queries/accountDetailQueries'
import { CardEmpty, Meta, Pagination, Price } from '@/components/generic'
import { iconStoreCreditEmpty } from '@/assets/images'
import META from '@/helper/meta-constant'
import { usePagination } from '@/hooks/usePagination'
import { allRoutes } from '@/constants/allRoutes'

function StoreCredit() {
  const [storeData, setStoreData] = useState()
  const { currentPage, itemsPerPage, paginatedItems, handlePageChange } =
    usePagination(storeData?.storecredit_history_credit, allRoutes.storeCredit)
  const intl = useIntl()
  const getStoredata = async () => {
    const result = await request({
      ...StoreCreditData,
    })
    setStoreData({
      storecredit_credit: result?.customer?.storecredit_credit,
      storecredit_history_credit:
        result?.customer?.storecredit_history_credit.reverse(),
    })
  }
  useEffect(() => {
    getStoredata()
  }, [])

  const tableItem =
    'flex-[100%] lg:flex-1 before:content-[attr(mobilelabel)] before:block before:lg:hidden before:font-medium before:text-grey-900 before:text-sm before:float-left'

  // const infoHandler = (type, orderId) => {
  //   if (type === 'Refund') {
  //     creditMemoAsync.run(request, {
  //       ...CreditMemo,
  //       variables: {
  //         orderId: orderId,
  //       },
  //     })
  //   } else {
  //     router.push(`/account/my-orders/${orderId}`)
  //   }
  // }

  return (
    <>
      <Meta
        title={META.storeCredit.title}
        description={META.storeCredit.description}
      />
      <AccountManagements>
        <div>
          <div className="capitalize border-b border-grey-400 pb-4 mb-6 flex justify-between items-center">
            <h5 className="text-grey-900 font-jost text-xl font-semibold">
              <FormattedMessage id="page.myAccount.title.storeCredit" />
            </h5>
            <div className="flex gap-1">
              <p className="text-base font-semibold text-custom-black2">
                <FormattedMessage id="page.storeCredit.title.balance" />:{' '}
              </p>
              <Price
                price={storeData?.storecredit_credit?.balance_amount || '0'}
              />
            </div>
          </div>
          {paginatedItems?.length > 0 ? (
            <div>
              <div>
                <ul className="hidden lg:flex justify-between font-medium capitalize border-b border-grey-400 pb-4 mb-4 text-sm md:text-base text-grey-900 text-center">
                  <li className="flex-1">
                    {intl.formatMessage({ id: 'page.storeCredit.id' })}
                  </li>
                  <li className="flex-1">
                    {intl.formatMessage({ id: 'page.storeCredit.action' })}
                  </li>
                  <li className="flex-1">
                    {intl.formatMessage({
                      id: 'page.storeCredit.balanceChange',
                    })}
                  </li>
                  <li className="flex-1">
                    {intl.formatMessage({
                      id: 'page.storeCredit.title.balance',
                    })}
                  </li>
                  <li className="flex-1">
                    {intl.formatMessage({ id: 'page.storeCredit.date' })}
                  </li>
                  <li className="flex-1">
                    {intl.formatMessage({
                      id: 'page.storeCredit.additionalInfo',
                    })}
                  </li>
                </ul>
                <div className="overflow-auto">
                  {paginatedItems.map((item, index) => {
                    const {
                      history_id,
                      type,
                      change_amount,
                      balance_amount,
                      created_time,
                      order_id,
                    } = item
                    return (
                      <ul
                        className="flex justify-between font-normal capitalize border-b border-grey-400 pb-4 mb-4 text-sm lg:text-base text-grey-700 text-right lg:text-center flex-wrap space-y-2 lg:space-y-0 last:mb-0 md:space-x-0"
                        key={index}
                      >
                        <li
                          mobilelabel={intl.formatMessage({
                            id: 'page.storeCredit.id',
                          })}
                          className={tableItem}
                        >
                          {history_id}
                        </li>
                        <li
                          mobilelabel={intl.formatMessage({
                            id: 'page.storeCredit.action',
                          })}
                          className={tableItem}
                        >
                          {type}
                        </li>
                        <li
                          mobilelabel={intl.formatMessage({
                            id: 'page.storeCredit.balanceChange',
                          })}
                          className={tableItem}
                        >
                          <Price price={change_amount} />
                          {/* {change_amount} */}
                        </li>
                        <li
                          mobilelabel={intl.formatMessage({
                            id: 'page.storeCredit.title.balance',
                          })}
                          className={tableItem}
                        >
                          <Price price={balance_amount} />
                        </li>
                        <li
                          mobilelabel={intl.formatMessage({
                            id: 'page.storeCredit.date',
                          })}
                          className={tableItem}
                        >
                          {dayjs(created_time).format('YYYY-MM-DD')}
                        </li>
                        <li
                          mobilelabel={intl.formatMessage({
                            id: 'page.storeCredit.additionalInfo',
                          })}
                          className={`${tableItem} text-primary font-medium`}
                        >
                          {/* <Button
                            onClick={() => infoHandler(type,order_id)}
                            title={
                              type === 'Refund'
                                ? 'Credit Memo'
                                : `Order #${order_id}`
                            }
                            className='!bg-transparent !text-primary !p-0 !capitalize tracking-normal  !text-sm md:!text-base'
                          /> */}
                          <Link href={`/account/my-orders/${order_id}`}>
                            {intl.formatMessage({
                              id: 'page.storeCredit.order',
                            })}{' '}
                            #{order_id}
                          </Link>
                        </li>
                      </ul>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-9 md:pt-12 flex items-start justify-center h-full">
              <CardEmpty
                icon={iconStoreCreditEmpty}
                //  TODO: Change icon
                title={intl.formatMessage({
                  id: 'emptyCart.storeCredit.title',
                })}
                TitleSize="!text-xl"
                DescriptionSize="!text-lg"
              />
            </div>
          )}
        </div>
        {storeData?.storecredit_history_credit?.length > itemsPerPage && (
          <div className="flex items-center justify-center sm:justify-end pt-8">
            <Pagination
              totalItems={storeData?.storecredit_history_credit?.length}
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

export default StoreCredit
