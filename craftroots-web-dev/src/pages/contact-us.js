import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useForm } from 'react-hook-form'

import Link from 'next/link'
import { IconMap, IconMessage, IconPhone } from '@/assets/images'
import { Button, Heading, Input, Meta } from '@/components/generic'
import META from '@/helper/meta-constant'
import useContactUs from '@/hooks/useContactUs'
import { emailRegex, nameRegex } from '@/helper'

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const { submitHandler } = useContactUs(reset)

  const onSubmit = (data) => {
    submitHandler(data)
  }

  const intl = useIntl()

  return (
    <>
      <Meta
        title={META.contactUs.title}
        description={META.contactUs.description}
      />
      <section className="section-padding">
        <div className="container">
          <div className="flex gap-8 sm:gap-10 flex-col md:flex-row justify-between">
            <div className="w-full md:w-[50%] lg:w-[55%]">
              <Heading
                title={intl.formatMessage({ id: 'page.contactUs.title' })}
              />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'form.name.placeHolder',
                    })}
                    name="name"
                    type="text"
                    register={register}
                    required
                    errors={errors}
                    validation={{
                      pattern: {
                        value: nameRegex,
                        message: `${intl.formatMessage({
                          id: 'form.name.errorMessage',
                        })}`,
                      },
                    }}
                  />
                </div>
                <div className="form-group text-left">
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'form.emailAddress.placeHolder',
                    })}
                    name="email"
                    type="email"
                    register={register}
                    required
                    errors={errors}
                    validation={{
                      pattern: {
                        value: emailRegex,
                        message: `${intl.formatMessage({
                          id: 'form.email.errorMessage',
                        })}`,
                      },
                    }}
                  />
                </div>
                {/* <div className="form-group">
                  <TextArea
                    placeholder={intl.formatMessage({
                      id: 'form.textArea.placeHolder',
                    })}
                    name="message"
                    type="text"
                    register={register}
                    required
                    validation={{
                      pattern: {
                        message: `${intl.formatMessage({
                          id: 'form.maxTextAreaCharacters.errorMessage',
                        })}`,
                      },
                    }}
                    errors={errors}
                    className="h-28"
                  />
                </div> */}
                <div className="text-left mt-5 sm:mt-8">
                  <Button
                    title={intl.formatMessage({
                      id: 'button.submit',
                    })}
                    type="submit"
                    className="w-full sm:w-fit"
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-[50%] lg:w-[40%] xl:w-[35%]">
              <div className="bg-grey-100 p-3 xs:p-5 lg:p-7 xl:p-10">
                <ul className="space-y-4 lg:space-y-5">
                  <li>
                    <span className="text-grey-900 text-lg font-medium mb-2 lg:mb-3 xl:mb-5 block">
                      <FormattedMessage id="page.contactUs.visitUs" />
                    </span>
                    <ul className=" mt-2 space-y-1 list-inside">
                      <li className="flex gap-2">
                        <div className="w-4 h-4 mt-1 text-primary">
                          <IconMap />
                        </div>
                        <div>
                          <h5 className="text-primary text-base font-medium xs:mb-1 sm:mb-2 font-jost">
                            <FormattedMessage id="page.checkout.title.address" />
                          </h5>
                          <p className="text-grey-800 text-sm sm:text-base font-light leading-6">
                            Craftroots 1st floor,Veer House, Near IOC Petrol
                            Pump,Bodakdev, Ahmedabad 380054
                          </p>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <span className="text-grey-900 text-lg font-medium mb-2 sm:mb-5 block">
                      <FormattedMessage id="page.contactUs.getInTouch" />
                    </span>
                    <ul className="list-inside flex items-start justify-between">
                      <li className="flex gap-2">
                        <div className="w-4 h-4 mt-1 text-primary">
                          <IconPhone />
                        </div>
                        <div>
                          <h5 className="text-primary text-base font-medium xs:mb-1 sm:mb-2 font-jost">
                            <FormattedMessage id="page.contactUs.callUs" />
                          </h5>
                          <Link
                            className="text-grey-800 text-sm sm:text-base font-light leading-6"
                            href="tel:+91787854268"
                          >
                            +91 787854268
                          </Link>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <div className="w-4 h-4 mt-1 text-primary">
                          <IconMessage />
                        </div>
                        <div>
                          <h5 className="text-primary text-base font-medium xs:mb-1 sm:mb-2 font-jost">
                            <FormattedMessage id="page.contactUs.emailUs" />
                          </h5>
                          <Link
                            className="text-grey-800 text-sm sm:text-base font-light leading-6"
                            href="mailto:info@craftroots.com"
                          >
                            info@craftroots.com
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 sm:mt-12 ">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10384.56750219078!2d72.51263967246605!3d23.04215864971188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b4d25dbbeb3%3A0x9cef7b20c8750a3f!2sCraftroots!5e0!3m2!1sen!2sin!4v1642593707666!5m2!1sen!2sin"
              className="w-full h-[300px] sm:h-[400px] lg:h-[480px]"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
