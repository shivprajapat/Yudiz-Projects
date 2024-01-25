/* eslint-disable no-useless-escape */
/* eslint-disable react/jsx-key */
/* eslint-disable react/react-in-jsx-scope */
import { FormattedMessage } from 'react-intl'
import { allRoutes } from './allRoutes'

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

export const headerMenuItems = [
  {
    name: <FormattedMessage id="explore" />,
    path: allRoutes.explore
  },
  {
    name: <FormattedMessage id="auction" />,
    path: allRoutes.auction
  },
  {
    name: <FormattedMessage id="drop" />,
    path: allRoutes.drop
  },
  {
    name: <FormattedMessage id="crates" />,
    path: allRoutes.crates
  },
  {
    name: <FormattedMessage id="community" />,
    path: allRoutes.community
  }
]

export const blockchainNetworks = process.env.REACT_APP_BLOCKCHAIN_NETWORKS.split(',')

// for toggle buttons
export const artworkTypeOptions = [
  { name: <FormattedMessage id="auction" />, value: 'auction' },
  { name: <FormattedMessage id="fixedPrice" />, value: 'fixedPrice' }
]

export const cratesTypeOptions = [
  { name: <FormattedMessage id="lootBox" />, value: 'lootBox' },
  { name: <FormattedMessage id="mysteryBox" />, value: 'mysteryBox' }
]

export const bankAccountTypeOptions = [
  { name: <FormattedMessage id="withoutIBAN" />, value: 'withoutIban' },
  { name: <FormattedMessage id="withIBAN" />, value: 'withIban' }
]

export const nftTypes = [
  { name: <FormattedMessage id="multiChainNFT" />, value: 'multiChain' },
  { name: <FormattedMessage id="exclusiveNFT" />, value: 'exclusive' }
]

export const paymentModeOptions = [
  { name: <FormattedMessage id="cryptoCurrency" />, value: 'Crypto Currency' },
  { name: <FormattedMessage id="fiatCurrency" />, value: 'fiat Currency' },
  { name: <FormattedMessage id="nuuCoins" />, value: 'Nuu coin' }
]

// for react-select
export const policyOptions = [
  { value: 'privacyPolicy', label: 'Privacy Policy' },
  { value: 'termsAndConditions', label: 'Terms and Conditions' }
]

export const exportTransactionOptions = [
  { value: 'privacyPolicy', label: 'Privacy Policy' },
  { value: 'termsAndConditions', label: 'Terms and Conditions' }
]

export const currencyOptions = [
  { value: 'ETH', label: 'ETH' },
  { value: 'GBP', label: 'GBP' },
  { value: 'SOL', label: 'SOLANA' },
  { value: 'MATIC', label: 'MATIC' }
]

export const assetTypeOptions = [
  { value: 'physical', label: 'Physical' },
  { value: 'digital', label: 'Digital' }
]

export const fileTypeOptions = [
  { value: 'jpeg', label: 'jpeg' },
  { value: 'jpg', label: 'jpg' },
  { value: 'png', label: 'png' },
  { value: 'glb', label: 'glb' },
  { value: 'mp3', label: 'mp3' },
  { value: 'mp4', label: 'mp4' }
]

export const categoryTypeOptions = [
  { value: 1, label: 'Virtual Fashion' },
  { value: 2, label: 'Memes' },
  { value: 3, label: 'Art' },
  { value: 4, label: 'Collectibles' },
  { value: 5, label: 'Domain Names' },
  { value: 6, label: 'Music' },
  { value: 7, label: 'Photography' },
  { value: 8, label: 'Sports' },
  { value: 9, label: 'Misc' },
  { value: 10, label: 'Trading Cards' },
  { value: 11, label: 'Utility' },
  { value: 12, label: 'Virtual World' },
  { value: 13, label: 'Phygital' },
  { value: 14, label: 'Top' }
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
  { value: 'buyer', label: <FormattedMessage id="letBuyerChooseBlockchainNetwork" /> }
]
export const placedOrderDropDown = [
  { label: <FormattedMessage id="lastThirtyDays" />, value: 'lastThirtyDays' },
  { label: <FormattedMessage id="lastThreeMonths" />, value: 'lastThreeMonths' }
]

export const orderStatus = [
  { label: <FormattedMessage id="pending" />, value: 'PENDING' },
  { label: <FormattedMessage id="ordered" />, value: 'PAYMENT_SUCCESS' },
  { label: <FormattedMessage id="failed" />, value: 'PAYMENT_FAILED' },
  { label: <FormattedMessage id="cancelled" />, value: 'CANCELLED' },
  { label: <FormattedMessage id="paymentPending" />, value: 'PAYMENT_PENDING' }
]

export const dropFilterOptions = [
  { label: 'Current', value: 1 },
  { label: 'Upcoming', value: 2 }
]

export const GLB = 'glb'
export const ZIP = 'zip'
export const GLTF = 'gltf'

export const envModes = {
  LOCAL: 'LOCAL',
  DEV: 'DEV',
  QA: 'QA',
  UAT: 'UAT',
  PRODUCTION: 'PRODUCTION'
}

export const userRoles = {
  ADMIN: 'admin',
  REG_CUSTOMER: 'reg_customer'
}

export const orderTypeOptions = [
  { label: 'Asset', value: '0' },
  { label: 'Mystery box', value: '1' },
  { label: 'Loot box', value: '2' },
  { label: 'Gift', value: '3' },
  { label: 'Physical', value: '4' },
  { label: 'Auction', value: '5' }
]

export const transactionStatus = {
  'Payment Pending': 0,
  'Payment Success': 4,
  'Payment Failed': 5
}

export const kycStatus = ['Approved', 'Pending']
