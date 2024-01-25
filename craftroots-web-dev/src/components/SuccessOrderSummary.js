import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

function SuccessOrderSummary({ orderSummary }) {
  return (
    <div className="mb-6 bg-grey-100 p-3 sm:p-4 md:p-6 pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-7 lg:gap-9">
        <div>
          <ul className="flex flex-col gap-2">
            <li className="flex justify-between items-center">
              <span className="text-base font-semibold text-grey-900">
                <FormattedMessage id="page.thankYou.shippingAddress" />
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span
                className="text-base font-normal text-custom-black1"
                dangerouslySetInnerHTML={{
                  __html: orderSummary?.shipping_address,
                }}
              />
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex flex-col gap-2">
            <li className="flex justify-between items-center">
              <span className="text-base font-semibold text-grey-900">
                <FormattedMessage id="page.checkout.title.paymentMethod" />
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-base font-light text-custom-black1">
                {orderSummary?.payment}
              </span>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex flex-col gap-2">
            <li className="flex justify-between items-center">
              <span className="text-base font-semibold text-grey-900">
                <FormattedMessage id="page.checkout.title.orderSummary" />
              </span>
            </li>
            {orderSummary?.subtotal && (
              <li className="flex justify-between items-center">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.thankYou.itemSubTotal" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.subtotal}
                </span>
              </li>
            )}
            {orderSummary?.discount_amount && (
              <li className="flex justify-between items-center">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.checkout.checkoutSummary.discount" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.discount_amount}
                </span>
              </li>
            )}

            {/* {orderSummary?.cgst_amount && (
              <li className="flex justify-between items-center">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.orderDetails.cgst" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.cgst_amount}
                </span>
              </li>
            )}
            {orderSummary?.sgst_amount && (
              <li className="flex justify-between items-center">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.orderDetails.sgst" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.sgst_amount}
                </span>
              </li>
            )}

            {orderSummary?.igst_amount && (
              <li className="flex justify-between items-center">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.orderDetails.igst" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.igst_amount}
                </span>
              </li>
            )} */}
            {orderSummary?.shipping && (
              <li className="flex justify-between items-center pb-1">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.checkout.checkoutSummary.shipping" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.shipping}
                </span>
              </li>
            )}
            {/* {orderSummary?.shipping_cgst_amount && (
              <li className="flex justify-between items-center pb-1">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.orderDetails.shippingCgst" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.shipping_cgst_amount}
                </span>
              </li>
            )}
            {orderSummary?.shipping_sgst_amount && (
              <li className="flex justify-between items-center pb-1">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.orderDetails.shippingSgst" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.shipping_sgst_amount}
                </span>
              </li>
            )}
            {orderSummary?.shipping_igst_amount && (
              <li className="flex justify-between items-center pb-1">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.orderDetails.shippingIgst" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.shipping_igst_amount}
                </span>
              </li>
            )} */}
            {orderSummary?.applied_store_credit && (
              <li className="flex justify-between items-center pb-1">
                <span className="text-base font-light text-custom-black1">
                  <FormattedMessage id="page.checkout.checkoutSummary.storeCredit" />
                </span>
                <span className="text-base font-light text-custom-black1">
                  {orderSummary?.applied_store_credit}
                </span>
              </li>
            )}
            {orderSummary?.grand_total && (
              <li className="flex justify-between items-center">
                <span className="text-base font-medium text-grey-900">
                  Total
                </span>
                <span className="text-base font-medium text-grey-900">
                  {orderSummary?.grand_total}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SuccessOrderSummary
SuccessOrderSummary.propTypes = {
  orderSummary: PropTypes.object.isRequired,
}
