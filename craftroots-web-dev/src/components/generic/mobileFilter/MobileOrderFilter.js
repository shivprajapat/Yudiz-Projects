import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'

import Button from '../Button'
import Checkbox from '../form/checkbox'
import CloseButton from '../CloseButton'

const MobileOrderFilter = ({ toggle, isShowing }) => {
  const intl = useIntl()
  const onCheckHandler = () => {
    console.log('i am checked')
  }

  const checkboxLabels = {
    all: intl.formatMessage({ id: 'all' }),
    onTheWay: intl.formatMessage({ id: 'onTheWay' }),
    delivered: intl.formatMessage({ id: 'page.myAccount.myOrders.delivered' }),
    cancelled: intl.formatMessage({ id: 'page.myAccount.myOrders.cancelled' }),
    returned: intl.formatMessage({ id: 'page.myAccount.myOrders.returned' }),
  }

  return (
    <div
      className={`mobile-filter pt-0 mobile-sidebar side-left ${
        isShowing ? 'active' : ''
      }`}
    >
      <div className="h-full flex flex-col justify-between">
        <div className="mobile-top py-3">
          <h6 className="text-grey-900 font-medium">
            <FormattedMessage id="filter" />
          </h6>
          <CloseButton onClick={toggle} top />
        </div>
        <div className="flex flex-wrap mobile-filter-h overflow-y-auto hide-scrollbar">
          <div className="w-full flex justify-between flex-col">
            <div className="px-4">
              <Checkbox
                title={checkboxLabels.all}
                value="all"
                onCheckHandler={onCheckHandler}
              />
              <Checkbox
                title={checkboxLabels.onTheWay}
                value="onTheWay"
                onCheckHandler={onCheckHandler}
              />
              <Checkbox
                title={checkboxLabels.delivered}
                value="delivered"
                onCheckHandler={onCheckHandler}
              />
              <Checkbox
                title={checkboxLabels.cancelled}
                value="cancelled"
                onCheckHandler={onCheckHandler}
              />
              <Checkbox
                title={checkboxLabels.returned}
                value="returned"
                onCheckHandler={onCheckHandler}
              />
            </div>
            <div className="gap-11 py-3 px-6 grid grid-cols-2 border-t border-grey-400">
              <Button
                title={intl.formatMessage({
                  id: 'button.clearAll',
                })}
                border
                fullWidth
              />
              <Button
                title={intl.formatMessage({
                  id: 'apply',
                })}
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileOrderFilter
MobileOrderFilter.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}
