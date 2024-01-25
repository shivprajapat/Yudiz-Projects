import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import Logo from '../Layout/Logo'
import { InvoiceDetailsPropType } from '../../../lib/PropTypeValues'
import { BRAND_SUPPORT_EMAIL } from '@/helper/constant'
import { getDisplayPrice } from '@/helper'

function CreditMemoPrint({ data }) {
  const intl = useIntl()
  const priceBreakdownData = useMemo(() => {
    if (!data) return []
    const returnData = [
      { label: 'Subtotal', value: data?.refunds[0]?.subtotal },
      {
        label: `Discount ${
          data.discount_description ? `(${data.discount_description})` : ''
        }`,
        value: data.discount_amount_for_refund,
      },
      {
        label: intl.formatMessage({ id: 'shippingAndHandling' }),
        value: data.shipping,
      },
      {
        label: 'Adjustment Refund',
        value: data.adjustment_refund,
      },
      {
        label: 'Adjustment Fee',
        value: data.adjustment_fee,
      },
      // {
      //   label: 'Store Credit Refund ',
      //   value: data.refunds_store_credit,
      // },
      // { label: 'CGST', value: data.cgst_amount },
      // { label: 'SGST', value: data.sgst_amount },
      // {
      //   label: intl.formatMessage({ id: 'page.orderDetails.shippingCgst' }),
      //   value: data.shipping_cgst_amount,
      // },
      // {
      //   label: intl.formatMessage({ id: 'page.orderDetails.shippingSgst' }),
      //   value: data.shipping_sgst_amount,
      // },
      {
        label: intl.formatMessage({ id: 'grandTotal' }),
        value:
          data?.refunds_store_credit === '0'
            ? data.grand_total
            : data?.refunds_store_credit,
        className: 'border-y',
      },
    ]
    return returnData.filter((d) => d.value !== '₹0' && parseInt(d.value) !== 0)
  }, [data])
  return (
    <div id="invoiceDetails" className="mt-4">
      {/* Guest, */}
      <Logo className="mb-4 inline-block" />
      <p>{intl.formatMessage({ id: 'invoice.thankYou' })}</p>
      <p className="mb-3">
        {intl.formatMessage({ id: 'invoice.supportText' })}
        <a href={'mailto:' + BRAND_SUPPORT_EMAIL}> {BRAND_SUPPORT_EMAIL}.</a>
      </p>
      <h5 className="font-jost border-b pb-2 mb-3 font-light">
        Your Memo for Order #{data.order_number}
      </h5>
      <table cellPadding="5" className="w-full text-left mb-4 border-b">
        <tr className="border-b">
          <th className="w-[50%]">Items </th>
          <th>Qty</th>
          <th>Subtotal</th>
        </tr>
        {data.refunds[0]?.item?.map((product) => (
          <tr key={product.product_name}>
            <td>
              {product.product_name}
              {product.options.length > 0 && (
                <table className="w-full">
                  {product.options.map((option) => {
                    return (
                      option.label &&
                      option.value && (
                        <tr key={option.label}>
                          <td>{option.label}</td>
                          <td>{getDisplayPrice(option.value)}</td>
                        </tr>
                      )
                    )
                  })}
                </table>
              )}
            </td>
            <td className="w-[10%]">{product.qty_refunded}</td>
            <td className="w-[20%]">{product.subtotal}</td>
          </tr>
        ))}
      </table>
      <table cellPadding="5" className="w-full text-left bg-gray-100 rounded">
        {priceBreakdownData.map((price) => (
          <tr key={price.label} className={price.className || ''}>
            <td className="text-right">{price.label}</td>
            <td className="w-[20%]">{getDisplayPrice(price.value)}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

CreditMemoPrint.propTypes = { data: InvoiceDetailsPropType.isRequired }

export default CreditMemoPrint
