import { toast } from 'react-toastify'

export const SuccessToastNotification = (message) => {
  return toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false
  })
}

export const FailureToastNotification = (message) => {
  return toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    draggable: false,
    pauseOnHover: false
  })
}
