import React, { Fragment } from 'react'
import { IntlProvider } from 'react-intl'
import PropTypes from 'prop-types'

/* languages set */
import { LOCALES } from './locales'

/* messages file */
import messages from './messages'

const Provider = ({ children, locale = LOCALES.ENGLISH }) => {
  return (
    <>
        <IntlProvider
          locale={locale}
          textComponent={Fragment}
          messages={messages[locale]}
        >
          {children}
        </IntlProvider>
    </>
  )
}

export default Provider

Provider.propTypes = {
  children: PropTypes.any,
  locale: PropTypes.any
}
