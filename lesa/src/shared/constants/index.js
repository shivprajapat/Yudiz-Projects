/* eslint-disable no-useless-escape */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import { FormattedMessage } from 'react-intl'

// RegEx
export const ONLY_NUMBER = /^[0-9]*$/
export const ONLY_POSITIVE_DECIMAL = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
export const EMAIL =
  /^\s*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))\s*$/
export const PASSWORD = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/
export const NO_SPACE = /^\S*$/
export const NO_SPECIAL_CHARACTER = /^[A-Za-z0-9 ]+$/
export const URL_REGEX =
  /^http(s?):\/\/(www\.)?(((\w+(([\.\-]{1}([a-z]{2,})+)+)(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)|(\w+((\.([a-z]{2,})+)+)(\:[0-9]{1,5}(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*)((\:[0-9]{1,5}(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)*))$/

export const TOAST_TYPE = {
  Error: 'danger',
  Success: 'success'
}

export const blockchainNetworks = process.env.REACT_APP_BLOCKCHAIN_NETWORKS.split(',')

// for toggle buttons
export const artworkTypeOptions = [
  { name: <FormattedMessage id="auction" />, value: 'auction' },
  { name: <FormattedMessage id="fixedPrice" />, value: 'fixedPrice' }
]

export const nftTypes = [
  { name: 'Multi-Chain NFT', value: 'multiChain' },
  { name: 'Exclusive NFT', value: 'exclusive' }
]

export const paymentModeOptions = [
  { name: 'Crypto currency', value: 'Crypto Currency' },
  { name: 'Fiat currency', value: 'fiat Currency' },
  { name: 'Nuu coins', value: 'Nuu coin' }
]

// for react-select
export const currencyOptions = [
  { value: 'ETH', label: 'ETH' },
  { value: 'GBP', label: 'GBP' }
]

export const mediaTypeOptions = [
  { value: 'audio', label: <FormattedMessage id="audio" /> },
  { value: '3-D', label: '3-D' },
  { value: 'image', label: <FormattedMessage id="image" /> },
  { value: 'video', label: <FormattedMessage id="video" /> }
]

export const blockchainNetworkOptions = [
  { value: blockchainNetworks[0], label: blockchainNetworks[0] },
  { value: blockchainNetworks[1], label: blockchainNetworks[1] },
  { value: blockchainNetworks[2], label: blockchainNetworks[2] },
  { value: 'buyer', label: <FormattedMessage id="letBuyerChooseBlockchainNetwork" /> }
]
export const placedOrderDropDown = [
  { label: 'Last 30 days', value: 'lastThirtyDays' },
  { label: 'Past 3 months', value: 'lastThreeMonths' }
]

export const orderStatus = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Ordered', value: 'PAYMENT_SUCCESS' },
  { label: 'Failed', value: 'PAYMENT_FAILED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Payment Pending', value: 'PAYMENT_PENDING' }
]
