import { memo } from 'react'
import PropTypes from 'prop-types'
import CloseButton from '../generic/CloseButton'
import {
  CreditMemoPropType,
  InvoiceDetailsPropType,
  ShipmentDetailsPropType,
} from '../../../lib/PropTypeValues'
import InvoicePrint from './InvoicePrint'
import ShipmentPrint from './ShipmentPrint'
import CreditMemoPrint from './CreditMemoPrint'

const OrderInvoicesModal = ({
  closeConfirm,
  isShowing,
  invoice,
  shipment,
  creditMemo,
}) => {
  const outSideHandler = (e) => {
    e.stopPropagation()
  }
  return (
    <div className={`modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" onClick={closeConfirm} />
      <div className="modal-content">
        <div className="modal-size">
          <div onClick={outSideHandler}>
            <div className="flex justify-between items-center border-b border-grey-400 pb-3">
              <CloseButton onClick={closeConfirm} />
            </div>
            {invoice && <InvoicePrint data={invoice} />}
            {shipment && <ShipmentPrint data={shipment} />}
            {creditMemo && <CreditMemoPrint data={creditMemo} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(OrderInvoicesModal)
OrderInvoicesModal.propTypes = {
  closeConfirm: PropTypes.func,
  isShowing: PropTypes.bool,
  invoice: InvoiceDetailsPropType,
  shipment: ShipmentDetailsPropType,
  creditMemo: CreditMemoPropType,
}

OrderInvoicesModal.defaultProps = {
  closeConfirm: () => {},
  isShowing: false,
  invoice: null,
  shipment: null,
  creditMemo: null,
}
