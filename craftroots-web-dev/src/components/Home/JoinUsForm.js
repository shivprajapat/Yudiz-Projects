import React from 'react'
import { useIntl } from 'react-intl'
import { Controller, useForm } from 'react-hook-form'
import Image from 'next/image'
import { Button, Input, UploadInput, CustomSelect, Heading } from '../generic'
import { emailRegex, nameRegex, phoneRegex } from '../../helper/index'
import { SELECT_CLASSNAMES } from '../generic/select/CustomSelect'
import useLocation from '@/hooks/useLocation'
import { iconClose } from '@/assets/images'
import useJoinUs from '@/hooks/useJoinUs'
import { joinUsDesignations } from '@/helper/constant'

function JoinUsForm() {
  const intl = useIntl()
  const { countries, setCountryId, states } = useLocation({ shipping: false })
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const { onSubmit, handleImage, selectedImages, joinUsData, removeImage } =
    useJoinUs({ reset, setValue })

  return (
    <div className="w-full md:w-[60%] lg:w-1/2 mx-auto ">
      <div className="lg:px-10 xl:px-36 text-center">
        <Heading
          title={intl.formatMessage({
            id: 'page.home.craftEnthusiast.title',
          })}
          center
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="form-group w-full md:w-1/2">
            <Input
              placeholder={intl.formatMessage({
                id: 'form.fullName.placeHolder',
              })}
              name="name"
              type="text"
              register={register}
              required
              validation={{
                pattern: {
                  value: nameRegex,
                  message: `${intl.formatMessage({
                    id: 'form.name.errorMessage',
                  })}`,
                },
              }}
              errors={errors}
            />
          </div>
          <div className="form-group w-full md:w-1/2">
            <Input
              placeholder={intl.formatMessage({
                id: 'form.phoneNumber.placeHolder',
              })}
              name="phone"
              type="text"
              register={register}
              required
              validation={{
                pattern: {
                  value: phoneRegex,
                  message: `${intl.formatMessage({
                    id: 'form.phoneNumber.errorMessage',
                  })}`,
                },
              }}
              errors={errors}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:gap-4">
          <div className="form-group w-full md:w-1/2">
            <Input
              placeholder={intl.formatMessage({
                id: 'form.email.placeHolder',
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
          <div className="form-group w-full md:w-1/2">
            <Controller
              name="designation"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  id="designation"
                  value={value}
                  onChange={onChange}
                  options={joinUsDesignations}
                  label="Designations"
                  classNames={{
                    ...SELECT_CLASSNAMES,
                  }}
                  isSearchable={false}
                />
              )}
              rules={{
                required: `${intl.formatMessage({
                  id: 'form.designation.errorMessage',
                })}`,
              }}
            />
            {errors && errors.designation && (
              <div className="error-text">{errors.designation.message}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-4 lg:gap-4 flex-wrap lg:flex-nowrap">
          <div className="form-group text-left w-full md:w-[48%] lg:w-1/2">
            <Controller
              name="country"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  id="country"
                  value={value}
                  options={countries}
                  isSearchable={true}
                  label="country"
                  onChange={(e) => {
                    onChange(e)
                    setCountryId(e.value)
                    setValue('state', '')
                  }}
                  classNames={{
                    ...SELECT_CLASSNAMES,
                  }}
                />
              )}
              rules={{
                required: `${intl.formatMessage({
                  id: 'form.countryDropDown.errorMessage',
                })}`,
              }}
            />
            {errors && errors.country && (
              <div className="error-text">{errors.country.message}</div>
            )}
          </div>
          <div className="form-group text-left w-full md:w-[48%] lg:w-1/2">
            <Controller
              name="state"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomSelect
                  id="state"
                  value={value}
                  onChange={onChange}
                  options={states}
                  isSearchable={true}
                  label="state"
                  classNames={{
                    ...SELECT_CLASSNAMES,
                  }}
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
          <div className="form-group text-left w-full lg:w-1/2">
            <Input
              placeholder={intl.formatMessage({
                id: 'form.city.placeHolder',
              })}
              name="city"
              type="text"
              register={register}
              required
              validation={{
                pattern: {
                  value: nameRegex,
                  message: `${intl.formatMessage({
                    id: 'form.cityDropDown.errorMessage',
                  })}`,
                },
              }}
              errors={errors}
            />
          </div>
        </div>
        <div className="form-group">
          <UploadInput
            name="catalogue"
            // required
            multiple={true}
            accept="image/png, image/jpeg, .pdf"
            register={register}
            handleImage={handleImage}
            validation={{
              validate: {
                value: (files) => {
                  if (selectedImages.length !== 5) {
                    const arrayFiles = Array.from(files)
                    if (arrayFiles.some((i) => i.size > 5000000)) {
                      return `${intl.formatMessage({
                        id: 'form.maxFileSize.errorMessage',
                      })}`
                    }
                  }
                },
              },
            }}
            errors={errors}
            // disabled={selectedImages.length === 5}
          />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedImages.map((img) => (
              <li
                key={img.name}
                className="flex items-center gap-2 justify-between sm:justify-start w-full first:mt-2"
              >
                <span className="font-medium text-sm text-success truncate w-72 flex-1">
                  {img.name}
                </span>
                <button
                  onClick={() => removeImage(img.name)}
                  className="border border-grey-400 rounded-full w-5 h-5"
                  type="button"
                >
                  <Image
                    src={iconClose}
                    alt="close"
                    className="w-3.5 h-auto mx-auto"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center">
          <Button
            title={intl.formatMessage({
              id: 'button.submit',
            })}
            type="submit"
            disabled={joinUsData.state.isLoading}
            btnLoader={joinUsData.state.isLoading}
          />
        </div>
      </form>
    </div>
  )
}

export default JoinUsForm
