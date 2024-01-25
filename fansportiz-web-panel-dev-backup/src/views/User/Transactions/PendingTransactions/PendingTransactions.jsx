import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import Transaction from '../../../../HOC/User/Transaction'

function PendingTransactions (props) {
  const { pendingDeposits, currencyLogo, Tab, getPendingDepositsList, token } = props

  useEffect(() => {
    if (token) getPendingDepositsList(token)
  }, [token])

  return (
    <div className='user-container bg-white no-footer'>
      {pendingDeposits && pendingDeposits.length !== 0
        ? (
            pendingDeposits?.sort((a, b) => a.dCreatedAt < b.dCreatedAt ? 1 : -1).map((offer, index) => {
              return (
                <Fragment key={index} >
                  <div className="pending-transactions-box">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="ammount">
                        {' '}
                        {currencyLogo}
                        {Tab === 'all'
                          ? offer.nAmount
                          : Tab === 'cash'
                            ? offer.nCash
                            : Tab === 'bonus' &&
                          offer.nBonus}
                      </div>
                      <div className='date-id' dir='ltr'>{moment(offer.dCreatedAt).format('DD-MM-YYYY hh:mm A')}</div>
                    </div>
                    <div className='remarks'>{offer.ePaymentGateway && <FormattedMessage id='Pending_Deposit_by'>{message => message + offer.ePaymentGateway}</FormattedMessage>}</div>
                    <div className='date-id'>
                      <FormattedMessage id='Transaction_ID' />
                      {offer.iReferenceId ? `- ${offer.iReferenceId}` : ''}
                    </div>
                  </div>
                </Fragment>
              )
            })
          )
        : (
          <div className='no-team fixing-width3 d-flex align-items-center justify-content-center'>
            <h1><FormattedMessage id="No_pending_deposit_available" /></h1>
          </div>
          )
    }
    </div>
  )
}

PendingTransactions.propTypes = {
  pendingDeposits: PropTypes.object,
  currencyLogo: PropTypes.string,
  Tab: PropTypes.string,
  getPendingDepositsList: PropTypes.func,
  token: PropTypes.string
}

export default Transaction(PendingTransactions)
