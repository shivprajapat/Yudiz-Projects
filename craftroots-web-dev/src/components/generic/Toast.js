import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { IconClose, iconCheck, iconInfo } from '@/assets/images'
import { showToastAction } from '@/actions/toastAction'

const Toast = ({ title, error }) => {
  const dispatch = useDispatch()

  const errorMsg = error ? 'text-error' : 'text-success'
  const errorMsgBorder = error
    ? 'bg-red-100 border-error'
    : 'bg-green-100 border-success'
  const errorMsgIcon = error ? 'bg-error' : 'bg-success'

  const iconClass =
    'w-5 h-5 sm:w-6 sm:h-6 grid p-0.5 place-items-center absolute rounded-full text-white'
  const defaultClass =
    'fixed right-2 rounded-md top-4 z-[9999] border-l-8 border-b-[3px] shadow-[0 5px 10px rgba(0,0,0,0.1)] py-3 px-2 flex items-start gap-3 w-auto max-w-[320px]'

  const handleToastClose = () => {
    dispatch(showToastAction(false))
  }
  return (
    <div className={`${errorMsgBorder} ${defaultClass}`}>
      <div className="relative">
        <div className={`${errorMsgIcon} ${iconClass} -left-[2px]`}>
          <Image
            src={error ? iconInfo : iconCheck}
            alt="icon"
            className="w-full h-full"
          />
        </div>
        <p
          className={`${errorMsg} text-sm sm:text-base font-medium leading-5 sm:leading-6 pl-7 pr-6`}
        >
          {title}
        </p>
        <div
          className={`${iconClass} -right-1 -top-1.5 hover:bg-white cursor-pointer transition-all duration-350`}
          onClick={handleToastClose}
        >
          <IconClose className={`${errorMsg} w-4 h-4 sm:w-5 sm:h-5`} />
        </div>
      </div>
    </div>
  )
}

export default Toast
Toast.propTypes = {
  title: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
}
