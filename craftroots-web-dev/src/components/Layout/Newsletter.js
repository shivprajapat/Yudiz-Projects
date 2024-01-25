import React, { useEffect, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import Image from 'next/image'

import CloseButton from '../generic/CloseButton'
import { Button, Input } from '../generic'
import { imgNewsletter } from '@/assets/images'
import { emailRegex, trimString } from '@/helper'
import { request } from '@/services/api.service'
import { NewsLetterSignUp } from '@/queries'
import { setToastDataAction } from '@/actions/toastAction'
import { STORAGE_KEYS } from '@/helper/constant'
import useAsync from '@/hooks/useAsync'

const Newsletter = () => {
  const dispatch = useDispatch()
  const [showPopup, setShowPopup] = useState(false)
  const newsLetterRes = useAsync(null, null)
  const intl = useIntl()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    let timeId

    const showPopupAfterPageLoad = () => {
      timeId = setTimeout(() => setShowPopup(true), 2000)
    }

    const checkNewsletterConditions = () => {
      const storageDate = localStorage.getItem(STORAGE_KEYS.newsLetterDate)
      const hasNewsletterSubmitted = localStorage.getItem(
        STORAGE_KEYS.newsLetterSubmitted
      )
      const currentDate = dayjs().format('YYYY-MM-DD')

      if (storageDate) {
        const differenceInDays = dayjs(currentDate).diff(storageDate, 'day')
        if (differenceInDays > 7 && hasNewsletterSubmitted !== 'true') {
          showPopupAfterPageLoad()
        }
      } else {
        showPopupAfterPageLoad()
      }
    }

    checkNewsletterConditions()

    return () => {
      clearTimeout(timeId)
    }
  }, [])

  const handleClosePopup = () => {
    const currentDate = dayjs().format('YYYY-MM-DD')
    localStorage.setItem(STORAGE_KEYS.newsLetterDate, currentDate)
    setShowPopup(true)
    setShowPopup(false)
  }

  useEffect(() => {
    if (newsLetterRes.state?.isSuccess) {
      localStorage.setItem(STORAGE_KEYS.newsLetterSubmitted, true)
      handleClosePopup()
      dispatch(
        setToastDataAction({
          show: true,
          message:
            newsLetterRes.state?.data?.subscribeEmailToNewsletter?.status,
        })
      )
    }
  }, [newsLetterRes.state?.isSuccess])

  const onSubmit = async (data) => {
    try {
      newsLetterRes.run(request, {
        ...NewsLetterSignUp,
        variables: { email: trimString(data.email) },
      })
    } catch (error) {
      console.error('error while submitting newletter', error)
    }
  }

  return (
    showPopup && (
      <div className="modal active">
        <div className="modal-body newsletter-animation" />
        <div className="modal-content newsletter-animation">
          <div className="modal-bg">
            <div className="modal-size w-[310px] xs:w-[340px] sm:w-[750px]">
              <div className="!p-0 h-full">
                <CloseButton
                  onClick={handleClosePopup}
                  className="absolute top-3 right-4 z-10 bg-transparent"
                />
                <div className="w-full h-full md:max-w-full">
                  <div className="newsletter-content p-5 pt-14 sm:p-6 flex flex-col justify-between my-auto md:pt-16 md:pb-12 leading-normal text-center relative">
                    <div className="w-full z-10">
                      <div className="w-full">
                        <h2 className="font-playfairDisplay text-grey-900 text-[24px] md:text-[35px] lg:text-[40px] mb-2 leading-[52px]">
                          <FormattedMessage id="newsletter.title.signup" />
                        </h2>
                        <p className="font-jost text-grey-800 font-normal">
                          <FormattedMessage id="newsletter.description" />
                        </p>
                      </div>
                      <div className="w-full mt-5 md:mt-10">
                        <form
                          className="w-full"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div className="flex justify-center gap-4 items-start text-left flex-col sm:flex-row newsletter-group">
                            <Input
                              className="px-3 h-10 text-sm border border-black-100 w-full max-w-full sm:w-[400px]"
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
                                id: 'button.submit',
                              })}
                              type="submit"
                              className="!py-2 sm:!py-2.5 !w-full sm:!w-fit"
                              disabled={newsLetterRes?.state?.isLoading}
                              btnLoader={newsLetterRes?.state?.isLoading}
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-40 sm:h-auto newsletter-masking p-4 sm:p-0">
                    <Image
                      src={imgNewsletter}
                      alt="/"
                      className="object-cover sm:object-contain object-[60%] sm:object-center h-full w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default Newsletter
