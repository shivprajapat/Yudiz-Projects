import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import Image from 'next/image'
import Link from 'next/link'

import Badge from './Badge'
import { iconAttachment } from '@/assets/images'
import { allRoutes } from '@/constants/allRoutes'

const SupportTicketItem = ({
  title,
  description,
  BadgeColor,
  attachment,
  BadgeTitle,
  CloseDate,
  progressDetails,
}) => {
  const intl = useIntl()
  return (
    <div className="border border-grey-400 p-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-jost text-grey-900 text-lg font-medium">{title}</h5>
        <span className="text-sm text-grey-600 font-medium">
          20th April, 2023
        </span>
      </div>
      <p className="text-grey-800 font-normal mb-4">{description}</p>
      <div className="border-t border-grey-400 pt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 sm:gap-8 flex-wrap flex-row justify-between sm:justify-start">
          {progressDetails ? (
            <Link href={allRoutes.progressDetails} className="hidden sm:block">
              <Badge
                title={intl.formatMessage({ id: BadgeTitle })}
                className={`${BadgeColor} rounded-none px-3`}
              />
            </Link>
          ) : (
            <Badge
              title={intl.formatMessage({ id: BadgeTitle })}
              className={`${BadgeColor} rounded-none px-3 hidden sm:block`}
            />
          )}
          {CloseDate && (
            <p className="text-grey-800 text-sm font-medium">
              <FormattedMessage id="page.supportTicket.closeDate" />:
              <span className="text-grey-900 pl-1">{CloseDate}</span>
            </p>
          )}
          <p className="text-grey-800 text-sm font-medium">
            <FormattedMessage id="orderId" />:
            <span className="text-grey-900 pl-1">#125876521</span>
          </p>
          {attachment && (
            <button className="text-grey-800 text-sm font-medium flex items-center gap-1">
              <Image src={iconAttachment} alt="Attachment" className="w-4" />
              <FormattedMessage id="attachment" />
            </button>
          )}
        </div>
        <div className="flex sm:hidden">
          {progressDetails ? (
            <Link href={allRoutes.progressDetails}>
              <Badge
                title={intl.formatMessage({ id: BadgeTitle })}
                className={`${BadgeColor} rounded-none px-3`}
              />
            </Link>
          ) : (
            <Badge
              title={intl.formatMessage({ id: BadgeTitle })}
              className={`${BadgeColor} rounded-none px-3`}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default SupportTicketItem
SupportTicketItem.propTypes = {
  title: PropTypes.string,
  CloseDate: PropTypes.string || PropTypes.bool,
  BadgeColor: PropTypes.bool,
  attachment: PropTypes.bool,
  BadgeTitle: PropTypes.string,
  description: PropTypes.string,
  progressDetails: PropTypes.bool,
}
