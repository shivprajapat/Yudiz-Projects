import React from 'react'
import { IntlProvider } from 'react-intl'
// import en from 'react-intl/locale-data/en'
// import fr from 'react-intl/locale-data/fr'
import PropTypes from 'prop-types'
import Setting from '../HOC/SportsLeagueList/Setting'
import messages from './messages'
// addLocaleData([...en, ...fr])

const Intl = (props) => {
  const { language, children } = props
  return (
    <IntlProvider locale={language} messages={messages[language]} >
      {children}
    </IntlProvider>
  )
}

Intl.propTypes = {
  language: PropTypes.string,
  children: PropTypes.object
}

export default Setting(Intl)
