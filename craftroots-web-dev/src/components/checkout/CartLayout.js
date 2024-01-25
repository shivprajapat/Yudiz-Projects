import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import { IconCircle, IconCircleGreen } from '@/assets/images'
import { Breadcrumb, Meta, SpinnerLoader } from '@/components/generic'
import { setToastDataAction } from '@/actions/toastAction'
import { allRoutes } from '@/constants/allRoutes'
import { cartLoadingHandler } from '@/actions/cartAction'
import { BRAND_NAME, OUT_OF_STOCK_ERROR } from '@/helper/constant'
const CartLayout = ({ children }) => {
  // const [activeKey, setsLoggedIn] = useState()
  const {
    addresses,
    items,
    addressLoading,
    cartLoading,
    isSuccess,
    outOfStockStatus,
    billingAddress,
  } = useSelector((state) => state.cartReducer)
  const dispatch = useDispatch()

  const steps = {
    0: 'ShoppingCart',
    1: 'address',
    2: 'payment',
    3: 'ThankYou',
  }
  const [step, setStep] = useState(0)
  const router = useRouter()

  const intl = useIntl()
  const stepTitles = [
    intl.formatMessage({ id: 'page.checkout.title.shoppingCart' }),
    intl.formatMessage({ id: 'page.checkout.title.address' }),
    intl.formatMessage({ id: 'page.checkout.title.payment' }),
  ]
  useEffect(() => {
    if (router.pathname === allRoutes.cart) {
      setStep(0)
    }
    if (router.pathname === allRoutes.address) {
      setStep(1)
    }
    if (router.pathname === allRoutes.payment) {
      setStep(2)
    }
  }, [router.pathname])

  useEffect(() => {
    function cartEmpty() {
      if (isSuccess) {
        if (items.length === 0) {
          dispatch(
            setToastDataAction({
              show: true,
              message: 'Please add item to cart',
              error: true,
            })
          )
          return router.replace('/cart', undefined, { shallow: true })
        } else if (outOfStockStatus) {
          dispatch(
            setToastDataAction({
              show: true,
              message: OUT_OF_STOCK_ERROR,
              error: true,
            })
          )
          return router.replace('/cart', undefined, { shallow: true })
        } else {
          dispatch(cartLoadingHandler(false))
        }

        if (router.pathname === allRoutes.payment && addresses.length === 0) {
          router.replace(allRoutes.address, undefined, { shallow: true })
          dispatch(
            setToastDataAction({
              show: true,
              message: 'Please add address',
              error: true,
            })
          )
        }
      }
    }
    cartEmpty()
    // dispatch(addressLoader(false))
  }, [items.length, isSuccess, addresses, outOfStockStatus, billingAddress])

  return (
    <>
      <Breadcrumb />
      {(addressLoading || cartLoading) && (
        <div className="bg-[#ffffff57] fixed inset-0 w-full h-full flex-center z-10">
          <div className="shadow-md w-14 h-14 flex-center rounded-full z-20 relative bg-white">
            <SpinnerLoader size={10} />
          </div>
        </div>
      )}
      <Meta title={stepTitles[step] + ' | ' + BRAND_NAME} />
      <div className=" bg-grey-100 p-4">
        <div className="w-full md:w-10/12 xl:w-1/2 mx-auto">
          <ul className="flex justify-between sm:justify-center items-center gap-2">
            {stepTitles?.map((item, index) => {
              const isPaymentTitle =
                item ===
                intl.formatMessage({ id: 'page.checkout.title.payment' })
              const isAddressTitle =
                item ===
                intl.formatMessage({ id: 'page.checkout.title.address' })
              const isAddressesEmpty =
                addresses?.length === 0 ||
                !billingAddress ||
                Object.keys(billingAddress).length === 0
              const isItemsEmpty = items?.length === 0

              const isDisabled =
                (isPaymentTitle && (isAddressesEmpty || isItemsEmpty)) ||
                (isAddressTitle && isItemsEmpty)

              // Usage:
              // <SomeComponent disabled={isDisabled} />

              return (
                <li
                  className={`flex items-center sm:items-start sm:gap-3 ${
                    index === stepTitles.length - 1
                      ? 'sm:w-1/5 justify-center sm:justify-start'
                      : 'sm:w-1/3 justify-center'
                  }`}
                  key={index}
                >
                  <button
                    className="flex items-center gap-2 flex-col md:flex-row"
                    onClick={() => {
                      if (steps[index] !== 'ShoppingCart') {
                        router.push(`/cart/${steps[index]}`, undefined, {
                          shallow: true,
                        })
                      } else {
                        router.push('/cart')
                      }
                    }}
                    disabled={isDisabled}
                  >
                    {step > index ? (
                      <IconCircleGreen />
                    ) : (
                      <span className="text-grey-300">
                        <IconCircle />
                      </span>
                    )}
                    <span
                      className={`block capitalize font-medium text-xs sm:text-sm 
                    ${step > index ? '!text-success' : 'text-grey-700'}
                    ${step === index ? 'text-primary' : ''}
                    `}
                    >
                      {item}
                    </span>
                  </button>
                  {index === stepTitles.length - 1 ? (
                    ''
                  ) : (
                    <div className="flex-1 h-2 mb-3 sm:mb-0 sm:h-5 w-16 xs:w-20 sm:w-full items-center flex">
                      <span className="border flex-1 border-dashed border-custom-black3 block" />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <section className="section-padding relative">
        <div className="container">
          {children}
          {addressLoading ||
            (cartLoading && (
              <div className="bg-white absolute inset-0 w-full h-[50vh] flex-center z-10">
                <div className="shadow-md w-14 h-14 flex-center rounded-full z-20 relative bg-white">
                  <SpinnerLoader size={10} />
                </div>
              </div>
            ))}
        </div>
      </section>
    </>
  )
}

export default CartLayout
CartLayout.propTypes = {
  children: PropTypes.node,
}
