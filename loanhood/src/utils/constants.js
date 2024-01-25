/* eslint-disable no-useless-escape */
export const TRANSITION_STATE = [
  { value: 'requestPending', label: 'requestPending' },
  { value: 'requestDeclined', label: 'requestDeclined' },
  { value: 'requestCanceled', label: 'requestCanceled' },
  { value: 'requestAccepted', label: 'requestAccepted' },
  { value: 'paymentPending', label: 'paymentPending' },
  { value: 'paymentAuthorized', label: 'paymentAuthorized' },
  { value: 'paymentFailed', label: 'paymentFailed' },
  { value: 'paymentSuccess', label: 'paymentSuccess' },
  { value: 'confirmed', label: 'confirmed' },
  { value: 'deliveryWaitingForLoaner', label: 'deliveryWaitingForLoaner' },
  { value: 'deliveryShippedByLoaner', label: 'deliveryShippedByLoaner' },
  { value: 'inPersonCollectionPending', label: 'inPersonCollectionPending' },
  { value: 'receivedByBorrower', label: 'receivedByBorrower' },
  { value: 'extensionRequestPending', label: 'extensionRequestPending' },
  { value: 'extensionRequestDeclined', label: 'extensionRequestDeclined' },
  { value: 'extensionRequestCanceled', label: 'extensionRequestCanceled' },
  { value: 'extensionRequestAccepted', label: 'extensionRequestAccepted' },
  { value: 'extensionPaymentPending', label: 'extensionPaymentPending' },
  { value: 'extensionPaymentFailed', label: 'extensionPaymentFailed' },
  { value: 'extensionPaymentSuccess', label: 'extensionPaymentSuccess' },
  { value: 'extensionConfirmed', label: 'extensionConfirmed' },
  { value: 'returnWaitingForBorrower', label: 'returnWaitingForBorrower' },
  { value: 'returnShippedByBorrower', label: 'returnShippedByBorrower' },
  { value: 'inPersonReturnPending', label: 'inPersonReturnPending' },
  { value: 'receivedByLoaner', label: 'receivedByLoaner' },
  { value: 'completed', label: 'completed' }
]

export const URL_REGEX = /^http(s?):\/\/(www\.)?(((\w+(([\.\-]{1}([a-z]{2,})+)+)(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)|(\w+((\.([a-z]{2,})+)+)(\:[0-9]{1,5}(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)))|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(([0-9]|([1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]+)+)(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*)((\:[0-9]{1,5}(\/[a-zA-Z0-9\_\=\?\&\.\#\-\W]*)*$)*))$/
