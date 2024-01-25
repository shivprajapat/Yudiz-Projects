import React from 'react'
import PropTypes from 'prop-types'
import { Controller, useForm } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import Image from 'next/image'

import Button from '../Button'
import Input from '../form/input'
import TextArea from '../form/textarea'
import CloseButton from '../CloseButton'
import CustomSelect from '../select/CustomSelect'
import UploadTicketItem from '../UploadTicketItem'
import { iconAttachment, iconCircleInfo } from '@/assets/images'

const NewTicketModal = ({ isShowing, outSideHandler, toggle }) => {
  const intl = useIntl()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    console.log('data', data)
  }
  const options = [
    { value: 'india', label: 'India' },
    { value: 'usa', label: 'USA' },
  ]
  return (
    <div className={`modal ${isShowing ? 'active' : ''}`}>
      <div className="modal-body" />
      <div className="modal-content h-[80%] sm:h-auto">
        <div className="modal-bg">
          <div className="modal-size w-[600px]">
            <div onClick={outSideHandler}>
              <div className="flex justify-between items-center border-b border-grey-400 pb-3">
                <h3 className="text-xl font-semibold font-jost text-gray-900">
                  <FormattedMessage id="modal.ticket.title.raiseATicket" />
                </h3>
                <CloseButton onClick={toggle} />
              </div>
              <div className="mt-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group text-left">
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'form.enterTitle.placeHolder',
                      })}
                      name="email"
                      type="email"
                      register={register}
                      required
                      errors={errors}
                    />
                  </div>
                  <div className="form-group text-left">
                    <Controller
                      name="selectOrder"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CustomSelect
                          value={value}
                          onChange={onChange}
                          options={options}
                          label="select Order"
                        />
                      )}
                      rules={{
                        required: `${intl.formatMessage({
                          id: 'form.stateDropDown.errorMessage',
                        })}`,
                      }}
                    />
                    {errors && errors.state && (
                      <div className="error-text">{errors.state.message}</div>
                    )}
                  </div>
                  <div className="form-group text-left">
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
                  <div className="form-group text-left">
                    <div className="text-grey-800 text-sm font-medium flex items-center gap-2 mb-2 h-10">
                      <span className="flex items-center gap-1 capitalize">
                        <Image
                          src={iconAttachment}
                          alt="Attachment"
                          className="w-4"
                        />
                        <FormattedMessage id="attachment" />
                      </span>
                      <div className="relative flex flex-col items-center group cursor-pointer">
                        <Image src={iconCircleInfo} alt="iconCircleInfo" />
                        <div className="bg-grey-800 p-2 -top-[14px] absolute flex-col items-center hidden group-hover:flex w-32 xs:w-48 z-10 sm:w-56 ml-3 left-full">
                          <span className="relative z-10 font-normal text-white whitespace-no-wrap text-xs">
                            <FormattedMessage id="modal.ticket.tooltip.title" />
                          </span>
                          <div className="tooltip-arrow" />
                        </div>
                      </div>
                    </div>
                    <UploadTicketItem />
                  </div>
                  <div className="text-left mt-6 md:mt-8">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTicketModal
NewTicketModal.propTypes = {
  toggle: PropTypes.bool,
  isShowing: PropTypes.bool,
  outSideHandler: PropTypes.func,
}
