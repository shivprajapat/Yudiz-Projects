import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useDispatch } from 'react-redux'
import { imgThankYou, iconGreenCheck } from '@/assets/images'
import { allRoutes } from '@/constants/allRoutes'
import useAsync from '@/hooks/useAsync'
import {
  Button,
  Meta,
  SkeletonOrderDetail,
  SpinnerLoader,
} from '@/components/generic'
import { STORAGE_KEYS } from '@/helper/constant'
import { request } from '@/services/api.service'
import { addressLoader, setMiniCartData } from '@/actions/cartAction'
import META from '@/helper/meta-constant'
import SuccessOrderSummary from '@/components/SuccessOrderSummary'
import { filteredOrderData } from '@/helper'
import { GetOrderListDetailWithId } from '@/queries/orderQueries'
import NextImage from '@/components/generic/NextImage'

const ThankYou = () => {
  const orderDetails = useAsync(null, null)
  const intl = useIntl()
  const dispatch = useDispatch()
  const router = useRouter()
  const navigate = () => {
    router.push(allRoutes.shop)
  }

  useEffect(() => {
    if (
      router.query.orderId &&
      localStorage.getItem(STORAGE_KEYS.canAccess) === 'true'
    ) {
      const orderId = Number(router.query.orderId)
      orderDetails.run(request, {
        ...GetOrderListDetailWithId,
        variables: {
          id: orderId,
        },
      })
      dispatch(
        setMiniCartData({ items: [], totalItems: null, paymentMethods: [] })
      )
    } else {
      router.replace('/', undefined, { shallow: true })
    }
    localStorage.removeItem(STORAGE_KEYS.canAccess)
    dispatch(addressLoader(false))
  }, [])

  const filteredOrder = filteredOrderData(
    orderDetails?.state?.data?.orderDetails
  )
  return (
    <>
      <Meta
        title={META.thankYou.title}
        description={META.thankYou.description}
      />
      <div className="container px-0 py-10 md:py-16 lg:py-20">
        <div className="text-center">
          <div className="mb-5">
            <div className="text-center mb-3">
              <Image src={iconGreenCheck} alt="" className="mx-auto" />
            </div>
            <h1 className="mb-2">
              <FormattedMessage id="page.thankYou.title" />
            </h1>
            <p className="text-grey-700 text-sm sm:text-base">
              <FormattedMessage id="page.thankYou.description" />
            </p>
          </div>
          <div className="text-center mb-5">
            <NextImage src={imgThankYou} alt="" className="mx-auto" />
          </div>
        </div>

        {!orderDetails.state.isLoading &&
        orderDetails.state.data.orderDetails &&
        Object.keys(orderDetails.state.data.orderDetails)?.length > 0 ? (
            <>
              <SuccessOrderSummary orderSummary={filteredOrder} />
              <div className="text-center">
                <Button
                  title={intl.formatMessage({
                    id: 'button.continueShopping',
                  })}
                  onClick={navigate}
                />
              </div>
            </>
          ) : (
            <>
              <SkeletonOrderDetail />

              <div className="bg-white fixed inset-0 w-full h-full flex-center z-10">
                <div className="shadow-md w-14 h-14 flex-center rounded-full z-20 relative">
                  <SpinnerLoader size={10} />
                </div>
              </div>
            </>
          )}
      </div>
    </>
  )
}

export default ThankYou
