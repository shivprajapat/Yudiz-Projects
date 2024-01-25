import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import DropdownMenu from '../generic/DropdownMenu'
import OrderInvoicesModal from './OrderInvoicesModal'
import { request } from '@/services/api.service'
import {
  InvoiceDetails,
  ShipmentDetails,
  CreditMemo,
} from '@/queries/orderQueries/index.js'
import useAsync from '@/hooks/useAsync'
const DETAILS_TYPE = {
  invoice: 'invoice',
  shipment: 'shipment',
  creditmemo: 'creditmemo',
}
function OrderInvoiceDropdown({ orderData }) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  function onFetchSuccess() {
    setShowInvoiceModal(true)
  }

  const invoiceDetailsAsync = useAsync(onFetchSuccess)
  const shipmentDetailsAsync = useAsync(onFetchSuccess)
  const creditMemoAsync = useAsync(onFetchSuccess)
  const router = useRouter()
  const intl = useIntl()

  const fetchDetails = (type) => {
    const {
      orderId: [orderNumber],
    } = router.query
    invoiceDetailsAsync.resetData()
    shipmentDetailsAsync.resetData()
    creditMemoAsync.resetData()
    if (orderNumber) {
      let asyncObject, query
      switch (type) {
        case DETAILS_TYPE.invoice:
          asyncObject = invoiceDetailsAsync
          query = InvoiceDetails
          break
        case DETAILS_TYPE.shipment:
          asyncObject = shipmentDetailsAsync
          query = ShipmentDetails
          break
        case DETAILS_TYPE.creditmemo:
          asyncObject = creditMemoAsync
          query = CreditMemo
          break

        default:
          break
      }
      asyncObject.run(request, {
        ...query,
        variables: {
          orderId: orderNumber,
        },
      })
    }
  }
  const options = useMemo(() => {
    const returnOptions = []
    if (orderData?.invoice_id && JSON.parse(orderData?.invoice_id).length) {
      returnOptions.push({
        label: intl.formatMessage({ id: 'button.invoice' }),
        type: DETAILS_TYPE.invoice,
      })
    }
    if (orderData?.hasCreditmemos) {
      returnOptions.push({
        label: intl.formatMessage({ id: 'creditMemo' }),
        type: DETAILS_TYPE.creditmemo,
      })
    }
    if (orderData?.hasShipments) {
      returnOptions.push({
        label: intl.formatMessage({ id: 'shipment' }),
        type: DETAILS_TYPE.shipment,
      })
    }

    return returnOptions
  }, [orderData])

  useEffect(() => {
    if (showInvoiceModal && typeof window !== 'undefined') {
      let fr = document.getElementById('invoicePrintFrame')
      if (!fr) {
        fr = document.createElement('iframe')
        fr.id = 'invoicePrintFrame'
        fr.height = 0
        fr.width = 0
      }

      document.body.append(fr)
      const headContent = document.head.innerHTML
      const invoiceContent =
        document.getElementById('invoiceDetails')?.innerHTML

      setTimeout(function () {
        if (invoiceContent) {
          fr.contentDocument.head.innerHTML = headContent
          fr.contentDocument.body.innerHTML = invoiceContent
          setTimeout(function () {
            fr.contentWindow.print()
          }, 500)
        }
      }, 700)
      setShowInvoiceModal(false)
    }
  }, [showInvoiceModal])

  const dropdownLoading =
    invoiceDetailsAsync.state.isLoading ||
    shipmentDetailsAsync.state.isLoading ||
    creditMemoAsync.state.isLoading

  return (
    options &&
    options.length > 0 && (
      <>
        <DropdownMenu title="Invoices" loading={dropdownLoading}>
          <DropdownMenu.Items>
            {options.map((menu) => (
              <DropdownMenu.Item key={menu.label}>
                <button
                  type="button"
                  className="py-2 px-3.5 w-full text-left hover:bg-grey-300 transition"
                  onClick={() => fetchDetails(menu.type)}
                >
                  {menu.label}
                </button>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Items>
        </DropdownMenu>
        <OrderInvoicesModal
          invoice={invoiceDetailsAsync.state.data?.invoiceDetails}
          shipment={shipmentDetailsAsync.state.data?.shipmentDetails}
          creditMemo={creditMemoAsync.state.data?.creditMemoDetails}
          isShowing={showInvoiceModal}
          closeConfirm={() => setShowInvoiceModal(false)}
        />
      </>
    )
  )
}

OrderInvoiceDropdown.propTypes = {
  orderData: PropTypes.shape({
    hasCreditmemos: PropTypes.any,
    hasShipments: PropTypes.any,
    invoice_id: PropTypes.any,
  }),
}

export default OrderInvoiceDropdown
