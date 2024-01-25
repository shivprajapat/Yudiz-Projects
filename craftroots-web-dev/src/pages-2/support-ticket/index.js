import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Image from 'next/image'

import AccountManagements from '../../pages/account/index'
import {
  Button,
  MobileTicketFilter,
  NewTicketModal,
  Searchbar,
  SupportTicketItem,
} from '@/components/generic'
import useModal from '@/hooks/useModal'
import { useDisableBodyScroll } from '@/hooks/useDisableBodyScroll'
import { iconFilter } from '@/assets/images'
import useTab from '@/hooks/useTab'

const SupportTicket = () => {
  const intl = useIntl()
  const [ticketFilter, setTicketFilter] = useState(false)

  const { isShowing, toggle } = useModal()
  const { toggleTab, tabActiveClass } = useTab()

  useDisableBodyScroll(isShowing, ticketFilter)

  const outSideHandler = (e) => {
    e.stopPropagation()
  }
  const handleTicketFilter = () => {
    setTicketFilter(!ticketFilter)
  }

  const tabStyle = 'text-grey-500 text-base font-medium cursor-pointer'
  const badgeLabels = {
    all: intl.formatMessage({ id: 'all' }),
    open: intl.formatMessage({ id: 'open' }),
    inProcess: intl.formatMessage({ id: 'inProcess' }),
    closed: intl.formatMessage({ id: 'closed' }),
    refundNotInitiated: intl.formatMessage({
      id: 'page.myAccount.supportTicket.refundNotInitiated',
    }),
  }
  return (
    <>
      <AccountManagements>
        <div className="support-ticket">
          <div className="flex items-center justify-between sm:hidden pb-4">
            <h5 className="text-grey-900 font-jost text-xl font-semibold">
              <FormattedMessage id="page.myAccount.title.supportTicket" />
            </h5>
            <button
              className="icon-hover"
              type="button"
              onClick={handleTicketFilter}
            >
              <Image src={iconFilter} alt="filter" />
            </button>
          </div>
          <div className="hidden sm:block capitalize border-b border-grey-400 pb-4 mb-6">
            <ul className="flex gap-6 capitalize">
              <li
                className={`${tabStyle} ${tabActiveClass(
                  1,
                  'text-secondary-800'
                )}`}
                onClick={() => toggleTab(1)}
              >
                <FormattedMessage id="page.myAccount.supportTicket.allTickets" />
              </li>
              <li
                className={`${tabStyle} ${tabActiveClass(
                  2,
                  'text-secondary-800'
                )}`}
                onClick={() => toggleTab(2)}
              >
                <FormattedMessage id="page.myAccount.supportTicket.open" />
              </li>
              <li
                className={`${tabStyle} ${tabActiveClass(
                  3,
                  'text-secondary-800'
                )}`}
                onClick={() => toggleTab(3)}
              >
                <FormattedMessage id="page.myAccount.supportTicket.inProgress" />
              </li>
              <li
                className={`${tabStyle} ${tabActiveClass(
                  4,
                  'text-secondary-800'
                )}`}
                onClick={() => toggleTab(4)}
              >
                <FormattedMessage id="page.myAccount.supportTicket.closed" />
              </li>
            </ul>
          </div>
          <div>
            <div className="hidden sm:flex items-center justify-between mb-6">
              <div className="w-72 search-block">
                <Searchbar />
              </div>
              <Button
                title={intl.formatMessage({ id: 'button.newTicket' })}
                onClick={toggle}
              />
            </div>
            <div className={`hidden ${tabActiveClass(1, '!block')}`}>
              <div className="flex flex-col gap-4">
                <SupportTicketItem
                  attachment
                  BadgeTitle={badgeLabels.open}
                  BadgeColor="bg-secondary-200"
                  title={badgeLabels.refundNotInitiated}
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
                <SupportTicketItem
                  progressDetails
                  BadgeTitle={badgeLabels.inProcess}
                  BadgeColor="bg-success"
                  title={badgeLabels.refundNotInitiated}
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
                <SupportTicketItem
                  attachment
                  BadgeTitle={badgeLabels.closed}
                  CloseDate="26th April, 2023"
                  BadgeColor="bg-error"
                  title={badgeLabels.refundNotInitiated}
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
                <SupportTicketItem
                  attachment
                  BadgeTitle={badgeLabels.closed}
                  CloseDate="26th April, 2023"
                  BadgeColor="bg-error"
                  title={badgeLabels.refundNotInitiated}
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
              </div>
            </div>
            <div className={`hidden ${tabActiveClass(2, '!block')}`}>
              <div className="flex flex-col gap-4">
                <SupportTicketItem
                  attachment
                  BadgeTitle={badgeLabels.open}
                  BadgeColor="bg-secondary-200"
                  title="Refund not initiated"
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
                <SupportTicketItem
                  BadgeTitle={badgeLabels.open}
                  BadgeColor="bg-secondary-200"
                  title="Refund not initiated"
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
              </div>
            </div>
            <div className={`hidden ${tabActiveClass(3, '!block')}`}>
              <div className="flex flex-col gap-4">
                <SupportTicketItem
                  attachment
                  BadgeTitle={badgeLabels.inProcess}
                  BadgeColor="bg-success"
                  title="Refund not initiated"
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
                <SupportTicketItem
                  progressDetails
                  BadgeTitle={badgeLabels.inProcess}
                  BadgeColor="bg-success"
                  title="Refund not initiated"
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
              </div>
            </div>
            <div className={`hidden ${tabActiveClass(4, '!block')}`}>
              <div className="flex flex-col gap-4">
                <SupportTicketItem
                  attachment
                  BadgeTitle={badgeLabels.closed}
                  CloseDate="26th April, 2023"
                  BadgeColor="bg-error"
                  title={badgeLabels.refundNotInitiated}
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />
                <SupportTicketItem
                  attachment
                  BadgeTitle={badgeLabels.closed}
                  CloseDate="26th April, 2023"
                  BadgeColor="bg-error"
                  title={badgeLabels.refundNotInitiated}
                  description="After confirmation of order from our customer support team, products are couriered within three business working days or refer product description in-case of made to order products"
                />{' '}
              </div>
            </div>
            <div className="block sm:hidden border-t border-grey-400 mt-8 pt-3">
              <Button
                title={intl.formatMessage({ id: 'button.newTicket' })}
                onClick={toggle}
                fullWidth
              />
            </div>
          </div>
        </div>
      </AccountManagements>
      <NewTicketModal
        isShowing={isShowing}
        toggle={toggle}
        outSideHandler={outSideHandler}
      />
      <MobileTicketFilter
        toggle={handleTicketFilter}
        isShowing={ticketFilter}
      />
    </>
  )
}

export default SupportTicket
