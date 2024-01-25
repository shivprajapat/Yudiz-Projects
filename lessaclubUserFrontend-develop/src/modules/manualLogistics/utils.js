import { orderStatus } from 'shared/utils'

const sellerLogisticsOptions = [
  { value: 'manual_logistics_selected', label: 'Activate Manual Logistics' },
  { value: 'package_packed', label: 'Package packed' },
  { value: 'package_posted', label: 'Package posted' },
  { value: 'package_in_transit', label: 'Package in transit' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'not_delivered', label: 'Not delivered' }
]

const buyerLogisticsOptions = [
  { value: 'buyer_confirmed_not_delivered', label: 'Not Delivered' },
  { value: 'buyer_confirmed_delivered', label: 'Confirm Delivery' }
]

const validateAction = (value, status) => {
  const processCompletedError = {
    isError: true,
    errorMsg:
      'Process already completed, please select next step'
  }
  switch (value) {
    case 'manual_logistics_selected':
      if (status > orderStatus.TRANSFER_NFT_SUCCESS) {
        return processCompletedError
      }
      if (status !== orderStatus.TRANSFER_NFT_SUCCESS) {
        return {
          isError: true,
          errorMsg:
            'Manual logistic process can only be started after successful transfer of NFT'
        }
      }
      break
    case 'package_packed':
      if (status > orderStatus.MANUAL_LOGISTICS_SELECTED) {
        return processCompletedError
      }
      if (status !== orderStatus.MANUAL_LOGISTICS_SELECTED) {
        return {
          isError: true,
          errorMsg:
            'Initiate manual logistic process before changing status to package packed'
        }
      }
      break
    case 'package_posted':
      if (status > orderStatus.PACKAGE_PACKED) {
        return processCompletedError
      }
      if (status !== orderStatus.PACKAGE_PACKED && status !== orderStatus.MANUAL_LOGISTICS_SELECTED) {
        return {
          isError: true,
          errorMsg:
            'Initiate manual logistic process before changing status to package posted'
        }
      }
      break
    case 'package_in_transit':
      if (status > orderStatus.PACKAGE_POSTED) {
        return processCompletedError
      }
      if (status !== orderStatus.PACKAGE_POSTED) {
        return {
          isError: true,
          errorMsg:
            'Update package post details before marking it as package in transit'
        }
      }
      break
    case 'out_for_delivery':
      if (status > orderStatus.PACKAGE_IN_TRANSIT) {
        return processCompletedError
      }
      if (status !== orderStatus.PACKAGE_IN_TRANSIT) {
        return {
          isError: true,
          errorMsg:
            'Update package transit details before marking it as out for delivery'
        }
      }
      break
    case 'delivered':
      if (status > orderStatus.PACKAGE_OUT_FOR_DELIVERY) {
        return processCompletedError
      }
      if (status !== orderStatus.PACKAGE_OUT_FOR_DELIVERY) {
        return {
          isError: true,
          errorMsg:
            'Update package out for delivery details details before marking it as delivered'
        }
      }
      break
    case 'not_delivered':
      break
    case 'buyer_confirmed_not_delivered':
      if (status !== orderStatus.PACKAGE_DELIVERED) {
        return {
          isError: true,
          errorMsg: 'Please wait for buyer to update delivery details'
        }
      }
      break
    case 'buyer_confirmed_delivered':
      break
    default:
      return { isError: true }
  }
  return { isError: false }
}

const logisticsStatus = [
  { value: 18, label: 'Manual Logistics Selected' },
  { value: 20, label: 'Package packed' },
  { value: 21, label: 'Package posted' },
  { value: 22, label: 'Package in transit' },
  { value: 23, label: 'Out for delivery' },
  { value: 24, label: 'Delivered' },
  { value: 25, label: 'Not delivered - Seller' },
  { value: 27, label: 'Not Delivered - Buyer' },
  { value: 26, label: 'Delivery Confirmed' }
]

const filterOptions = (type, status) => {
  console.log(type, status)
  const options = []
  if (type === 'seller') {
    sellerLogisticsOptions.forEach(option => {
      const res = validateAction(option.value, status)
      if (!res.isError) {
        options.push(option)
      }
    })
  } else {
    buyerLogisticsOptions.forEach(option => {
      const res = validateAction(option.value, status)
      if (!res.isError) {
        options.push(option)
      }
    })
  }
  console.log(options)
  return options
}

export {
  buyerLogisticsOptions,
  sellerLogisticsOptions,
  validateAction,
  logisticsStatus,
  filterOptions
}
