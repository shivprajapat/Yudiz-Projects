import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'

import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import usePayment from '@/hooks/usePayment'
import { SpinnerLoader } from '@/components/generic'
import {
  CartLayout,
  CheckoutPriceItem,
  CheckoutSummaryProductItem,
} from '@/components/checkout'
import { AVAILABLE_PAYMENT_METHODS } from '@/helper/constant'
import StoreCredit from '@/components/checkout/StoreCredit'
const PaymentAddressBlock = dynamic(() =>
  import('@/components/checkout/PaymentAddressBlock')
)
const PaymentMethodAccordionItem = dynamic(() =>
  import('@/components/checkout/PaymentMethodAccordionItem')
)

const Payment = ({ onNext }) => {
  // const dispatch = useDispatch()
  const intl = useIntl()
  const { items, prices, addresses } = useSelector((state) => state.cartReducer)
  // const [activePaymentMethod, setActivePaymentMethod] = useState(null)
  const {
    isPaymentProgress,
    paymentHandler,
    setPaymentMethodOnCartDataState,
    activePaymentMethod,
    paymentCardData,
    handleToggle,
    storeCreditData,
    credit,
    setCredit,
    creditHandler,
    appliedCredits,
  } = usePayment(onNext)

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <CartLayout>
        {items?.length > 0 && addresses.length ? (
          <>
            <div className="flex gap-7 md:gap-10 flex-col md:flex-row">
              <div className="block sm:hidden">
                <div className="mb-4">
                  <h6 className="font-jost font-semibold text-xl">
                    <FormattedMessage id="page.checkout.title.address" />
                  </h6>
                </div>
                <PaymentAddressBlock address={addresses[0]} />
              </div>
              <div className="w-full md:w-[50%] lg:w-[75%] xl:w-[65%]">
                <h6 className="mb-4 md:mb-8 font-jost font-semibold text-xl">
                  <FormattedMessage id="page.checkout.title.paymentMethod" />
                </h6>
                {paymentCardData?.map((item) => (
                  <PaymentMethodAccordionItem
                    key={item.id}
                    activePaymentMethod={activePaymentMethod}
                    handleToggle={handleToggle}
                    item={item}
                  />
                ))}
                {storeCreditData?.balance_amount ? (
                  <StoreCredit
                    amount={storeCreditData?.balance_amount}
                    credit={credit}
                    setCredit={setCredit}
                    creditHandler={creditHandler}
                    appliedCredits={appliedCredits}
                  />
                ) : null}
              </div>

              <div className="w-full md:w-[50%] lg:w-[35%] xl:w-[35%] sm:mt-0 mt-3">
                <h6 className="mb-4 md:mb-8 font-jost font-semibold text-xl">
                  <FormattedMessage id="page.checkout.title.orderSummary" />
                </h6>
                {addresses?.[0] && (
                  <div>
                    <PaymentAddressBlock
                      address={addresses[0]}
                      className="hidden sm:flex"
                    />
                    {items?.map((i) => {
                      return <CheckoutSummaryProductItem key={i.id} item={i} />
                    })}
                    {/* <button className="flex items-center gap-2 my-4">
                  <span className="text-grey-800 text-sm">
                    <FormattedMessage id="button.loadMore" />
                  </span>
                  <Image
                    src={iconArrowDown}
                    alt="arrow"
                    className="w-3 h-3 mt-[3px]"
                  />
                </button> */}
                    <CheckoutPriceItem
                      btnDisable={
                        !setPaymentMethodOnCartDataState.isSuccess ||
                        isPaymentProgress.isPaymentComplete
                      }
                      padding
                      btnTitle={
                        activePaymentMethod?.toLowerCase() ===
                        AVAILABLE_PAYMENT_METHODS.razorpay
                          ? intl.formatMessage({
                            id: 'button.payNow',
                          })
                          : intl.formatMessage({
                            id: 'button.orderNow',
                          })
                      }
                      onCheckoutClick={paymentHandler}
                      prices={prices}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-[#ffffff57] fixed inset-0 w-full h-full flex-center z-10">
            <div className="shadow-md w-14 h-14 flex-center rounded-full z-20 relative">
              <SpinnerLoader size={10} />
            </div>
          </div>
        )}
      </CartLayout>
    </>
  )
}

export default React.memo(Payment)
Payment.propTypes = {
  onNext: PropTypes.func,
}
