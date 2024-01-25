import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import Logo from '../Layout/Logo'
import { BRAND_SUPPORT_EMAIL } from '@/helper/constant'

function ShipmentPrint({ data }) {
  const intl = useIntl()
  return (
    <div id="invoiceDetails" className="mt-4">
      <Logo className="mb-4 inline-block" />
      <p>{intl.formatMessage({ id: 'invoice.thankYou' })}</p>
      <p className="mb-3">
        {intl.formatMessage({ id: 'invoice.supportText' })}
        <a href={'mailto:' + BRAND_SUPPORT_EMAIL}> {BRAND_SUPPORT_EMAIL}.</a>
      </p>
      <h5 className="font-jost border-b pb-2 mb-3 font-light">
        Shipment #{data.shipment[0].shipment_number} for Order #
        {data.order_number}
      </h5>
      <table className="table-fixed w-full mb-4">
        <tr>
          <td>
            <h5 className="font-jost font-light text-xl">
              {intl.formatMessage({ id: 'page.checkout.billibgAddress.title' })}
            </h5>
            <div
              dangerouslySetInnerHTML={{
                __html: data.billing_address,
              }}
            />
          </td>
          <td>
            <h5 className="font-jost font-light text-xl">
              {intl.formatMessage({ id: 'page.thankYou.shippingAddress' })}
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
          <th className="w-[40%]">Items </th>
          <th className="w-[30%]">SKU</th>
          <th>Qty Shipped</th>
        </tr>
        {data.shipment[0]?.item?.map((product) => (
          <tr key={product.product_name}>
            <td>
              {product.product_name}
              {product.options?.length > 0 && (
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
            <td className="w-[10%]">{product.sku}</td>
            <td className="w-[20%]">{product.qty_shipped}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}

ShipmentPrint.propTypes = {
  data: PropTypes.shape({
    billing_address: PropTypes.any,
    order_number: PropTypes.any,
    payment: PropTypes.any,
    shipment: PropTypes.any,
    shipping_address: PropTypes.any,
    shipping_method: PropTypes.any,
  }),
}

export default ShipmentPrint
