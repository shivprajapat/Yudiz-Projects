export const GetOrderListDetails = {
  query: `query CustomerOrdersList($current_page: Int, $limit: Int){
        customerOrderList(current_page: $current_page, limit: $limit) {
            current_page
            items {
              created_at
              currency
              grand_total
              id
              increment_id
              ship_to
              status
              items_count
            }
            limit
            total_count
          }
        }
        `,
  fetchPolicy: 'no-cache',
}

export const GetOrderListDetailWithId = {
  query: `query CustomerOrdersListWithId($id: Int) {
    orderDetails(id: $id) {
      applied_store_credit
      billing_address
      cgst_amount
      comment {
        comment
        create_at
      }
      hasCreditmemos
      hasShipments
      created_at
      customer_email
      refunds_store_credit 
      customer_firstname
      customer_lastname
      customer_name
      discount_amount
      discount_amount_for_refund
      discount_description
      grand_total
      hasCreditmemos
      hasInvoices
      hasShipments
      increment_id
      invoice_id
      items {
        discount_amount
        discount_amount_for_refund
        id
        image
        name
        options {
          option_label
          value_label
        }
        price
        qty_ordered
        qty_refund
        qty_shipped
        row_total
        row_total_for_refund
        sku
        status
        sub_total
        tax_amount
        tax_amount_for_refund
        tax_percent
      }
      mp_extra_fee
      payment
      pos
      sgst_amount
      shipping
      shipping_address
      shipping_cgst_amount
      shipping_method
      shipping_sgst_amount
      status
      subtotal
      tax
      tax_for_refund
      telephone
      igst_amount
      shipping_igst_amount
    }
  }`,
  fetchPolicy: 'no-cache',
}

export const MutationCancelOrder = {
  mutation: `mutation cancelOrderItem($id: String!) {
    orderCancel(input: {
      id: $id
    }) {
        message
          }
        }`,
}

const INVOICE_FRAGEMENT = `
  cgst_amount  
  discount_amount
  discount_amount_for_refund
  discount_description
  grand_total
  order_date
  order_number
  order_status
  sgst_amount
  shipping
  shipping_cgst_amount
  shipping_sgst_amount
  subtotal
  tax
  tax_for_refund
  igst_amount
  shipping_igst_amount
`

export const InvoiceDetails = {
  query: `query InvoiceDetails($orderId: Int!){
    invoiceDetails(order_id: $orderId) {
      billing_address
      invoices {
        invoice_date
        invoice_number
        item {
          options {
            option_label
            value_label
          }
          price
          product_name
          qty_invoiced
          sku
          subtotal
          tax_amount
          tax_percent
        }
        subtotal
        tax
      }
      mp_extra_fee
      payment      
      shipping_address
      shipping_method
      ${INVOICE_FRAGEMENT}
    }
  }`,
}

export const CreditMemo = {
  query: `query memoDetails($orderId: Int!){
    creditMemoDetails(order_id: $orderId) {
      ${INVOICE_FRAGEMENT}
      refunds_store_credit
      creditmemo_subtotal
      creditmemo_total
      adjustment_refund
      adjustment_fee
      refunds {
        created_at
        grand_total
        increment_id
        item {
          options {
            option_label
            value_label
          }
          price
          product_name
          sku
          subtotal
          qty_refunded
        }
        shipping_amount
        subtotal
      }      
    }
  }`,
}

export const ShipmentDetails = {
  query: `query shipmentDetails($orderId: Int!) {
    shipmentDetails(order_id: $orderId) {
      billing_address
      carrierName
      order_date
      order_number
      order_status
      payment
      shipment {
        item {
          sku
          product_name
          qty_shipped
          options {
            option_label
            value_label
          }
        }
        shipment_date
        shipment_number
      }
      shipping_address
      shipping_method
      trackNumber
    }
  }`,
}
