import React from 'react'
import PropTypes from 'prop-types'
import { allRoutes } from 'shared/constants/allRoutes'
import { FaRegEye } from 'react-icons/fa'

const ORDER_TYPE = {
  0: 'Asset',
  1: 'Mystery Box',
  2: 'Loot Box',
  3: 'Gift'
}

function OrderItemRow({ order }) {
  return (
    <>
      <tr key={order.id}>
        <td>
          <span className="admin-asset-name">
            {
              (order?.user?.firstName || order?.user?.lastName) ? `${order?.user?.firstName} ${order?.user?.lastName}` : '-'
            }
          </span>
        </td>
        <td>{order?.asset?.name || order?.mysteryBox?.name || order?.lootBox?.name || '-'}</td>
        <td>{ORDER_TYPE[order?.orderType] || '-'}</td>
        <td>{order?.statusName || '-'}</td>
        <td className='currency'>{order?.paymentCurrencyType === 'Nuu coin' ? 'Nuucoin' : order?.paymentCurrencyType || '-'}</td>
        <td>
          <a target="_blank" rel="noreferrer" href={`${allRoutes.orderDetails}?orderId=${order.id}`}>
            <FaRegEye />
          </a>
        </td>
      </tr>
    </>
  )
}
OrderItemRow.propTypes = {
  order: PropTypes.object
}
export default OrderItemRow
