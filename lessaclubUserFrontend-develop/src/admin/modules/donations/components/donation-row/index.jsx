import React from 'react'
import PropTypes from 'prop-types'
// eslint-disable-next-line no-unused-vars
import { allRoutes } from 'shared/constants/allRoutes'
import { Button } from 'react-bootstrap'
import { NETWORKS } from 'modules/blockchainNetwork'
import { getNetworkSymbol } from 'shared/utils'

function DonationRow({ donation, setSelectedDonation, getNetworkPrice }) {
  return (
    <>
      <tr>
        <td>
          <a target="_blank" rel="noreferrer" href={`${window.location.origin}${allRoutes.creatorCollected(donation?.donor?.id)}`}>
            {donation?.donor?.firstName} {donation?.donor?.lastName}
          </a>
        </td>
        <td className="amount-col1">
          {donation?.amount}

        </td>
        <td className="amount-col">
          <span>
            {(getNetworkPrice(donation?.amount, getNetworkSymbol(NETWORKS.POLYGON))).toFixed(8)}
          </span>
        </td>
        <td className="amount-col">
          <span>
            {(getNetworkPrice(donation?.amount, getNetworkSymbol(NETWORKS.ETHEREUM))).toFixed(8)}
          </span>
        </td>
        <td className="amount-col1">
          <a title="View order" target="_blank" rel="noreferrer" href={`${allRoutes.orderDetails}?orderId=${donation?.order?.id}`}>
            {donation?.order?.totalPrice}
          </a>
        </td>
        <td>{donation?.order?.statusName}</td>
        <td>{donation?.payoutStatusName}</td>
        <td>
          {donation?.payoutStatus === 0 ? (
            <>
              <Button className="bg-light text-dark approve-btn" onClick={() => { setSelectedDonation(donation) }}>
                Transfer
              </Button>
            </>
          ) : <>Transfered</>
          }
        </td>
      </tr>
    </>
  )
}
DonationRow.propTypes = {
  donation: PropTypes.object,
  setSelectedDonation: PropTypes.func,
  getNetworkPrice: PropTypes.func
}
export default DonationRow
