import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import Logo from '../Layout/Logo'
import { InvoiceDetailsPropType } from '../../../lib/PropTypeValues'
import { BRAND_SUPPORT_EMAIL } from '@/helper/constant'

function InvoicePrint({ data }) {
  const intl = useIntl()
  const priceBreakdownData = useMemo(() => {
    if (!data) return []
    const returnData = [
      { label: 'Subtotal', value: data.subtotal },
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
        value: data.grand_total,
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
        Your Invoice #{data.invoices[0].invoice_number} for Order #
        {data.order_number}
      </h5>
      <table className="table-fixed w-full mb-4">
        <tr>
          <td>
            <h5 className="font-jost font-light text-xl">
              {intl.formatMessage({ id: 'billingInfo' })}
            </h5>
            <div
              dangerouslySetInnerHTML={{
                __html: data.billing_address,
              }}
            />
          </td>
          <td>
            <h5 className="font-jost font-light text-xl">
              {intl.formatMessage({ id: 'shippingInfo' })}
            </h5>
            <div
              dangerouslySetInnerHTML={{
                __html: data.shipping_address,
              }}
            />
          </td>
        </tr>
        <tr>
          <td height="20px"></td>
        </tr>
        <tr>
          <td>
            <h5 className="font-jost text-xl font-light">
              {intl.formatMessage({
                id: 'page.checkout.title.paymentMethod',
              })}
            </h5>
            <p>{data.payment}</p>
          </td>
          <td>
            <h5 className="font-jost text-xl font-light">
              {intl.formatMessage({
                id: 'page.checkout.title.shippingMethod',
              })}
            </h5>
            <p>{data.shipping_method}</p>
          </td>
        </tr>
      </table>
      <table cellPadding="5" className="w-full text-left mb-4 border-b">
        <tr className="border-b">
          <th className="w-[50%]">Items </th>
          <th>Qty</th>
          <th>Subtotal</th>
        </tr>
        {data.invoices[0]?.item?.map((product) => (
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
                          <td>{option.value}</td>
                        </tr>
                      )
                    )
                  })}
                </table>
              )}
            </td>
            <td className="w-[10%]">{product.qty_invoiced}</td>
            <td className="w-[20%]">{product.subtotal}</td>
          </tr>
        ))}
      </table>
      <table cellPadding="5" className="w-full text-left bg-gray-100 rounded">
        {priceBreakdownData.map((price) => (
          <tr key={price.label} className={price.className || ''}>
            <td className="text-right">{price.label}</td>
            <td className="w-[20%]">{price.value}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

InvoicePrint.propTypes = { data: InvoiceDetailsPropType.isRequired }

export default InvoicePrint
