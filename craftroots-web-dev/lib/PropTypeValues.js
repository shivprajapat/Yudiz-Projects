import PropTypes from 'prop-types'

export const ProductItemPropType = PropTypes.shape({
  id: PropTypes.number,
  sku: PropTypes.string,
  name: PropTypes.string,
  small_image: {
    url: PropTypes.string,
    __typename: PropTypes.string,
  },
  type_id: PropTypes.string,
  url_key: PropTypes.string,
  price: {
    regularPrice: {
      amount: {
        value: PropTypes.number,
        currency: PropTypes.string,
        __typename: PropTypes.string,
      },
      __typename: PropTypes.string,
    },
    __typename: PropTypes.string,
  },
  __typename: PropTypes.string,
})

export const InvoiceDetailsPropType = PropTypes.shape({
  billing_address: PropTypes.string,
  cgst_amount: PropTypes.string,
  discount_amount_for_refund: PropTypes.string,
  discount_description: PropTypes.string,
  grand_total: PropTypes.string,
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      invoice_date: PropTypes.string,
      invoice_number: PropTypes.string,
      item: {
        options: {
          option_label: PropTypes.string,
          value_label: PropTypes.string,
        },
        price: PropTypes.string,
        product_name: PropTypes.string,
        qty_invoiced: PropTypes.string,
        sku: PropTypes.string,
        subtotal: PropTypes.string,
        tax_amount: PropTypes.string,
        tax_percent: PropTypes.string,
      },
      subtotal: PropTypes.string,
      tax: PropTypes.string,
    })
  ),
  order_number: PropTypes.string,
  payment: PropTypes.string,
  sgst_amount: PropTypes.string,
  shipping: PropTypes.string,
  shipping_address: PropTypes.string,
  shipping_cgst_amount: PropTypes.string,
  shipping_method: PropTypes.string,
  shipping_sgst_amount: PropTypes.string,
  subtotal: PropTypes.stringy,
})

export const CreditMemoPropType = PropTypes.shape({
  can_creditmemo: PropTypes.number,
  cgst_amount: PropTypes.string,
  creditmemo_subtotal: PropTypes.string,
  creditmemo_total: PropTypes.string,
  discount_amount: PropTypes.string,
  discount_amount_for_refund: PropTypes.string,
  discount_description: PropTypes.string,
  grand_total: PropTypes.string,
  hasCreditmemos: PropTypes.bool,
  hasInvoices: PropTypes.bool,
  hasShipments: PropTypes.bool,
  order_date: PropTypes.string,
  order_number: PropTypes.string,
  order_status: PropTypes.string,
  refunds: [
    {
      created_at: PropTypes.string,
      grand_total: PropTypes.string,
      increment_id: PropTypes.string,
      item: [
        {
          options: [
            {
              option_label: PropTypes.string,
              value_label: PropTypes.string,
            },
            {
              option_label: PropTypes.string,
              value_label: PropTypes.string,
            },
          ],
          price: PropTypes.string,
          product_name: PropTypes.string,
          sku: PropTypes.string,
          subtotal: PropTypes.string,
        },
      ],
      shipping_amount: PropTypes.string,
      subtotal: PropTypes.string,
    },
  ],
  sgst_amount: PropTypes.string,
  shipping: PropTypes.string,
  shipping_cgst_amount: PropTypes.string,
  shipping_sgst_amount: PropTypes.string,
  subtotal: PropTypes.string,
  tax: PropTypes.string,
  tax_for_refund: PropTypes.string,
  igst_amount: PropTypes.string,
  shipping_igst_amount: PropTypes.string,
})

export const ShipmentDetailsPropType = PropTypes.shape({
  shipmentDetails: PropTypes.shape({
    billing_address: PropTypes.string,
    shipping_address: PropTypes.string,
    shipping_method: PropTypes.string,
    trackNumber: PropTypes.string,
    carrierName: PropTypes.string,
    order_date: PropTypes.string,
    order_number: PropTypes.string,
    order_status: PropTypes.string,
    payment: PropTypes.string,
    shipment: PropTypes.arrayOf({
      item: PropTypes.arrayOf({
        sku: PropTypes.string,
        product_name: PropTypes.string,
        qty_shipped: PropTypes.string,
        options: {
          option_label: PropTypes.string,
          value_label: PropTypes.string,
        },
      }),
    }),
    shipping_address: PropTypes.string,
    shipping_method: PropTypes.string,
    trackNumber: PropTypes.string,
  }),
})
