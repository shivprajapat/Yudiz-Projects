import React, { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import PropTypes from 'prop-types'

import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import Button from '../Button'
import CloseButton from '../CloseButton'
import Input from '../form/input'
import { emailRegex, productAlert, trimString } from '@/helper'
import useAsync from '@/hooks/useAsync'
import { setToastDataAction } from '@/actions/toastAction'

const NotifyMeModal = ({ closeConfirm, isShowing, productSku }) => {
  const intl = useIntl()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const notifyMeRes = useAsync()
  const dispatch = useDispatch()
  const outSideHandler = (e) => {
    e.stopPropagation()
  }
  useEffect(() => {
    if (!notifyMeRes?.state?.isLoading) {
      closeConfirm()
      reset()
    }
  }, [notifyMeRes?.state?.isLoading])

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

  const onSubmit = (data) => {
    try {
      productAlert(notifyMeRes, trimString(data?.email), productSku)
    } catch (error) {
      console.error('error while product alert', error)
    }
  }

  return (
    <div className={`modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" onClick={closeConfirm} />
      <div className="modal-content">
        <div className="modal-bg">
          <div className="modal-size w-[450px] max-w-full">
            <div onClick={outSideHandler} className="!p-6">
              <div className="flex justify-between items-center border-b border-grey-400 pb-3">
                <h3 className="text-xl tracking-wide font-semibold font-jost text-grey-900">
                  <FormattedMessage id="button.NotifyMe" />{' '}
                </h3>
                <CloseButton onClick={closeConfirm} />
              </div>
              <div className="my-4">
                <div className="mb-1">
                  <h3 className="text-lg font-medium font-jost text-grey-900 mb-2">
                    {intl.formatMessage({ id: 'notifyMe.modal.text' })}
                  </h3>
                </div>
                <div className="w-full mt-4">
                  <form
                    className="w-full notify-me-modal"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="flex justify-center items-start text-left flex-col sm:flex-row gap-3 sm:gap-0">
                      <Input
                        className="px-3 h-10 text-sm border border-black-100 w-full max-w-full sm:w-56"
                        placeholder={intl.formatMessage({
                          id: 'form.email.placeHolder',
                        })}
                        name="email"
                        type="text"
                        register={register}
                        required
                        validation={{
                          pattern: {
                            value: emailRegex,
                            message: `${intl.formatMessage({
                              id: 'form.email.errorMessage',
                            })}`,
                          },
                        }}
                        errors={errors}
                      />
                      <Button
                        title={intl.formatMessage({
                          id: 'button.NotifyMe',
                        })}
                        type="submit"
                        className="!py-2 sm:!py-2.5 !w-full sm:!w-fit"
                        disabled={notifyMeRes?.state?.isLoading}
                        btnLoader={notifyMeRes?.state?.isLoading}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotifyMeModal
NotifyMeModal.propTypes = {
  closeConfirm: PropTypes.func,
  isShowing: PropTypes.bool,
  productSku: PropTypes.string,
}

NotifyMeModal.defaultProps = {
  isShowing: false,
  closeConfirm: () => {},
  productSku: '',
}
