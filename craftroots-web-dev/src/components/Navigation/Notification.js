import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'

import { CardEmpty } from '../generic'
import CloseButton from '../generic/CloseButton'
import { iconNotificationEmpty } from '@/assets/images'

const Notification = ({ isShowing, toggle }) => {
  const intl = useIntl()
  const fakeData = [
    {
      title: 'Lorem ipsum dolor',
      description:
        'Lorem ipsum dolor sit amet consectetur. Consectetur sed mauris viverra sit semper eget elementum maecenas.',
    },
    {
      title: 'Lorem ipsum dolor',
      description:
        'Lorem ipsum dolor sit amet consectetur. Consectetur sed mauris viverra sit semper eget elementum maecenas.',
    },
    {
      title: 'Lorem ipsum dolor',
      description:
        'Lorem ipsum dolor sit amet consectetur. Consectetur sed mauris viverra sit semper eget elementum maecenas.',
    },
    {
      title: 'Lorem ipsum dolor',
      description:
        'Lorem ipsum dolor sit amet consectetur. Consectetur sed mauris viverra sit semper eget elementum maecenas.',
    },
    {
      title: 'Lorem ipsum dolor',
      description:
        'Lorem ipsum dolor sit amet consectetur. Consectetur sed mauris viverra sit semper eget elementum maecenas.',
    },
  ]
  return (
    <div>
      <div
        className={`sidebar-left-overlay ${isShowing ? 'active' : ''}`}
        onClick={toggle}
      />
      <div className={`sidebar-left ${isShowing ? 'active' : ''}`}>
        <div className={`head ${fakeData.length > 0 ? 'mb-6' : ''}`}>
          <h5>
            <FormattedMessage id="notificationSidebar.title" />
          </h5>
          <CloseButton onClick={toggle} />
        </div>
        <div className="h-[100%] overflow-y-auto remove-scrollbar">
          {fakeData.length > 0 ? (
            fakeData.map((item, i) => {
              const { title, description } = item
              return (
                <div
                  key={i}
                  className="border-b border-grey-400 pb-2 last:border-none mb-4 last:mb-0"
                >
                  <span className="text-base text-grey-700 mb-1">{title}</span>
                  <p className="text-sm leading-[22px] text-grey-700">
                    {description}
                  </p>
                </div>
              )
            })
          ) : (
            <div className="pt-9 sm:pt-12 flex items-start justify-center h-full">
              <CardEmpty
                icon={iconNotificationEmpty}
                title={intl.formatMessage({
                  id: 'empty.notification.title',
                })}
                description={intl.formatMessage({
                  id: 'empty.notification.description',
                })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notification
Notification.propTypes = {
  isShowing: PropTypes.bool,
  toggle: PropTypes.func,
}
