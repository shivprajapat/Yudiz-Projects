import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../generic'
import NotifyMeModal from '../generic/modal/NotifyMeModal'
import { IconNotifyMe } from '@/assets/images'
import { isLoggedIn, productAlert } from '@/helper'
import { setToastDataAction } from '@/actions/toastAction'
import useAsync from '@/hooks/useAsync'
function NotifyMe({ intl, className, fullWidth, center, productSku }) {
  const accountdetails = useSelector(
    (state) => state.accountReducer.accountData.customer
  )
  const dispatch = useDispatch()
  const [isNotifyPopUpOpen, setIsNotifyPopUpOpen] = useState(false)
  const notifyModalHandler = () => setIsNotifyPopUpOpen(false)
  const notifyMeRes = useAsync()

  useEffect(() => {
    if (notifyMeRes?.state?.isSuccess) {
      dispatch(
        setToastDataAction({
          show: true,
          message:
            notifyMeRes?.state?.data?.MpProductAlertNotifyInStock?.message,
        })
      )
    }
  }, [notifyMeRes?.state?.isSuccess])

  const handleNotifyMe = () => {
    if (isLoggedIn()) {
      try {
        productAlert(notifyMeRes, accountdetails?.email, productSku)
      } catch (error) {
        console.error('error while product alert', error)
      }
    } else {
      setIsNotifyPopUpOpen(true)
    }
  }
  return (
    <div className={className}>
      <Button
        fullWidth={fullWidth}
        center={center}
        title={intl.formatMessage({
          id: 'button.NotifyMe',
        })}
        icon={notifyMeRes?.state?.isLoading ? null : <IconNotifyMe />}
        disabled={notifyMeRes?.state?.isLoading}
        btnLoader={notifyMeRes?.state?.isLoading}
        onClick={handleNotifyMe}
      />
      <NotifyMeModal
        isShowing={isNotifyPopUpOpen}
        closeConfirm={notifyModalHandler}
        productSku={productSku}
      />
    </div>
  )
}

export default NotifyMe
NotifyMe.propTypes = {
  stockStatus: PropTypes.string,
  intl: PropTypes.object.isRequired,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  center: PropTypes.bool,
  btnLoader: PropTypes.bool,
  productSku: PropTypes.string.isRequired,
}
NotifyMe.defaultProps = {
  stockStatus: '',
  className: '',
  fullWidth: false,
  center: false,
}
