import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import AccountManagements from '../../pages/account'
import { iconArrowLeft } from '@/assets/images'
import { Badge, Button, TextArea } from '@/components/generic'

const ProgressDetails = () => {
  const router = useRouter()
  const intl = useIntl()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log('data', data)
  }
  const listItemStyle = 'flex justify-start gap-2 items-center'
  const listItemLeftLabelStyle =
    'flex justify-between items-center text-sm font-normal text-grey-800 w-24'
  const listItemRightLabelStyle = 'text-sm font-medium text-grey-800'

  return (
    <AccountManagements>
      <div className="capitalize sm:border-b border-grey-400 pb-4 sm:mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-grey-800 font-normal flex items-center gap-2"
        >
          <Image
            src={iconArrowLeft}
            alt="iconArrowLeft"
            className="w-2 h-auto"
          />
          <span>
            <FormattedMessage id="page.supportTicket.button.backToTicket" />
          </span>
        </button>
      </div>
      <div className="mb-6 border-b border-grey-400 pb-4">
        <h5 className="text-primary font-medium font-jost mb-3 text-lg md:text-xl">
          <FormattedMessage id="page.progressDetails.refundNotInitiated" />
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-7 lg:gap-9">
          <div className="w-full md:w-56">
            <ul className="flex flex-col gap-2">
              <li className={listItemStyle}>
                <p className={listItemLeftLabelStyle}>
                  <FormattedMessage id="requestId" />
                  <span>:</span>
                </p>
                <span className={listItemRightLabelStyle}>ZCG-116-17213 </span>
              </li>
              <li className={listItemStyle}>
                <span className={listItemLeftLabelStyle}>
                  <FormattedMessage id="orderId" /> :
                </span>
                <span className="text-sm font-medium text-grey-900">
                  #125876521
                </span>
              </li>
              <li className={`${listItemStyle} hidden sm:flex`}>
                <p className={listItemLeftLabelStyle}>
                  <FormattedMessage id="page.supportTicket.status" />{' '}
                  <span>:</span>
                </p>
                <span>
                  <Badge
                    title={intl.formatMessage({ id: 'inProcess' })}
                    className="rounded-none px-1 bg-success !py-[1px]"
                  />
                </span>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-56">
            <ul className="flex flex-col gap-2">
              <li className={listItemStyle}>
                <p className={listItemLeftLabelStyle}>
                  {' '}
                  <FormattedMessage id="page.supportTicket.raiseDate" />{' '}
                  <span>:</span>
                </p>
                <span className={listItemRightLabelStyle}>
                  20th April, 2023
                </span>
              </li>
              <li className={listItemStyle}>
                <p className={listItemLeftLabelStyle}>
                  <FormattedMessage id="page.supportTicket.closeDate" />{' '}
                  <span>:</span>
                </p>
                <span className={listItemRightLabelStyle}>-</span>
              </li>
              <li className={`${listItemStyle} flex sm:hidden`}>
                <p className={listItemLeftLabelStyle}>
                  <FormattedMessage id="page.supportTicket.status" />{' '}
                  <span>:</span>
                </p>
                <span>
                  <Badge
                    title={intl.formatMessage({ id: 'inProcess' })}
                    className="rounded-none px-1 bg-success !py-[1px]"
                  />
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h5 className="text-grey-900 font-semibold font-jost mb-3 text-lg md:text-xl">
            <FormattedMessage id="page.progressDetails.postAReply" />
          </h5>
          <div className="form-group">
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
          </div>
          <div className="flex items-center gap-2 sm:gap-6 justify-between sm:justify-end my-3 border-b border-grey-400 pb-4">
            <Button
              border
              title={intl.formatMessage({
                id: 'button.closeTicket',
              })}
              className="w-full sm:w-fit !px-1 md:!px-6 !py-1.5 sm:!py-[9px]"
            />
            <Button
              title={intl.formatMessage({
                id: 'button.submitMessage',
              })}
              type="submit"
              className="w-full sm:w-fit !px-1 md:!px-6 !py-1.5 sm:!py-[9px]"
            />
          </div>
        </form>
      </div>
      <div className="pt-4">
        <h5 className="text-grey-900 font-semibold font-jost mb-3 text-lg md:text-xl">
          <FormattedMessage id="page.progressDetails.history" />
        </h5>
        <div className="flex justify-start items-center gap-4 flex-col comment-items">
          <div className="border border-grey-400 p-4 justify-between mb-0 comment-item">
            <div>
              <div className="flex gap-1 mb-2 flex-col sm:items-start">
                <p className="text-grey-900 text-sm font-medium">
                  Katie Couris (Sales Department)
                </p>
                <p className="text-grey-800 text-sm font-medium">
                  20th April, 2023
                </p>
              </div>
              <p className="text-grey-800 text-sm font-normal leading-6 w-full">
                Lorem ipsum dolor sit amet consectetur. Odio placerat
                suspendisse faucibus faucibus amet vel suspendisse. Volutpat
                gravida sed urna ullamcorper eget sit imperdiet interdum.
                Quisque morbi semper ac varius elementum morbi eu adipiscing
                cras. Ac id feugiat tempus a varius vestibulum in.{' '}
              </p>
            </div>
          </div>
          <div className="border border-grey-400 p-4 justify-between mb-0 comment-item">
            <div>
              <div className="flex gap-1 mb-2 flex-col sm:items-start">
                <p className="text-grey-900 text-sm font-medium">
                  Katie Couris (Sales Department)
                </p>
                <p className="text-grey-800 text-sm font-medium">
                  20th April, 2023
                </p>
              </div>
              <p className="text-grey-800 text-sm font-normal leading-6 w-full">
                Lorem ipsum dolor sit amet consectetur. Odio placerat
                suspendisse faucibus faucibus amet vel suspendisse. Volutpat
                gravida sed urna ullamcorper eget sit imperdiet interdum.
                Quisque morbi semper ac varius elementum morbi eu adipiscing
                cras. Ac id feugiat tempus a varius vestibulum in.{' '}
              </p>
            </div>
          </div>
          <div className="border border-grey-400 p-4 justify-between mb-0 comment-item">
            <div>
              <div className="flex gap-1 mb-2 flex-col sm:items-start">
                <p className="text-grey-900 text-sm font-medium">
                  Katie Couris (Sales Department)
                </p>
                <p className="text-grey-800 text-sm font-medium">
                  20th April, 2023
                </p>
              </div>
              <p className="text-grey-800 text-sm font-normal leading-6 w-full">
                Lorem ipsum dolor sit amet consectetur. Odio placerat
                suspendisse faucibus faucibus amet vel suspendisse. Volutpat
                gravida sed urna ullamcorper eget sit imperdiet interdum.
                Quisque morbi semper ac varius elementum morbi eu adipiscing
                cras. Ac id feugiat tempus a varius vestibulum in.{' '}
              </p>
            </div>
          </div>
          <div className="border border-grey-400 p-4 justify-between mb-0 comment-item">
            <div>
              <div className="flex gap-1 mb-2 flex-col sm:items-start">
                <p className="text-grey-900 text-sm font-medium">
                  Katie Couris (Sales Department)
                </p>
                <p className="text-grey-800 text-sm font-medium">
                  20th April, 2023
                </p>
              </div>
              <p className="text-grey-800 text-sm font-normal leading-6 w-full">
                Lorem ipsum dolor sit amet consectetur. Odio placerat
                suspendisse faucibus faucibus amet vel suspendisse. Volutpat
                gravida sed urna ullamcorper eget sit imperdiet interdum.
                Quisque morbi semper ac varius elementum morbi eu adipiscing
                cras. Ac id feugiat tempus a varius vestibulum in.{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AccountManagements>
  )
}

export default ProgressDetails
