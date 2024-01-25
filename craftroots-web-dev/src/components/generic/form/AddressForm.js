import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import CustomSelect, { SELECT_CLASSNAMES } from '../select/CustomSelect'
import Button from '../Button'
import Input from './input'
import { nameRegex, phoneRegex, pinCodeRegex } from '@/helper'
import useLocation from '@/hooks/useLocation'
import { dirtyHandlerBilling, dirtyHandlerShipping } from '@/actions/cartAction'

const CUSTOM_SELECT_CLASSES = {
  menuPortal: () => '!z-[999]',
  menuList: () => 'sm:!max-h-60 !max-h-[196px]',
}

function AddressForm({
  onSubmit,
  title,
  resetData,
  loading,
  isBilling,
  isMyAccount,
  isShipping,
}) {
  const intl = useIntl()
  const dispatch = useDispatch()
  const { countries, setCountryId, states } = useLocation({ shipping: true })
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm()

  useEffect(() => {
    dispatch(dirtyHandlerBilling(isDirty))
    if (isShipping) {
      dispatch(dirtyHandlerShipping(isDirty))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty])

  useEffect(() => {
    if (Object.keys(resetData).length > 0) {
      reset({
        firstName: resetData?.firstname,
        lastName: resetData?.lastname,
        postalCode: resetData?.postcode || resetData?.postalCode,
        country: { value: resetData?.country?.code, label: 'India' },
        state: {
          value: resetData?.region?.region_id,
          label: resetData?.region?.label || resetData?.region?.region,
        },
        phone: resetData?.telephone,
        address: resetData?.street?.[0],
        city: resetData?.city,
      })
      setCountryId(resetData?.country_code)
    }
  }, [resetData])

  const handlesubmit = (data) => {
    onSubmit(data)
    if (isBilling) {
      dispatch(dirtyHandlerBilling(isDirty))
    }
  }

  return (
    <form onSubmit={handleSubmit(handlesubmit)}>
      <div className="flex flex-col md:flex-row md:gap-4">
        <div className="form-group w-full md:w-1/2 text-left">
          <Input
            placeholder={intl.formatMessage({
              id: 'form.firstName.placeHolder',
            })}
            name="firstName"
            type="text"
            register={register}
            required
            errors={errors}
            validation={{
              pattern: {
                value: nameRegex,
                message: `${intl.formatMessage({
                  id: 'form.firstName.errorMessage',
                })}`,
              },
            }}
          />
        </div>
        <div className="form-group w-full md:w-1/2 text-left">
          <Input
            placeholder={intl.formatMessage({
              id: 'form.lastName.placeHolder',
            })}
            name="lastName"
            type="text"
            register={register}
            required
            errors={errors}
            validation={{
              pattern: {
                value: nameRegex,
                message: `${intl.formatMessage({
                  id: 'form.lastName.errorMessage',
                })}`,
              },
            }}
          />
        </div>
      </div>
      <div className="form-group text-left">
        <Input
          placeholder={intl.formatMessage({
            id: 'form.phoneNumber.placeHolder',
          })}
          name="phone"
          type="number"
          register={register}
          required
          errors={errors}
          validation={{
            pattern: {
              value: phoneRegex,
              message: `${intl.formatMessage({
                id: 'form.phoneNumber.errorMessage',
              })}`,
            },
          }}
        />
      </div>
      <div className="form-group text-left">
        <Input
          placeholder={intl.formatMessage({
            id: 'form.phoneAddress.placeHolder',
          })}
          name="address"
          type="text"
          register={register}
          required
          errors={errors}
        />
      </div>
      <div className="form-group text-left">
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
      <div className="flex flex-col md:flex-row gap-x-4 lg:gap-4 flex-wrap lg:flex-nowrap">
        <div className="form-group text-left w-full md:w-[47%] lg:w-1/2">
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
                menuPortalTarget={
                  typeof document !== 'undefined' ? document.body : null
                }
                label="state"
                classNames={{
                  ...SELECT_CLASSNAMES,
                  ...CUSTOM_SELECT_CLASSES,
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
        <div className="form-group text-left w-full md:w-[47%] lg:w-1/2">
          <Input
            placeholder={intl.formatMessage({
              id: 'form.city.placeHolder',
            })}
            name="city"
            type="text"
            register={register}
            required
            errors={errors}
            validation={{
              pattern: {
                value: nameRegex,
                message: `${intl.formatMessage({
                  id: 'form.city.errorMessage',
                })}`,
              },
            }}
          />
        </div>

        <div className="form-group text-left w-full md:w-[47%] lg:w-1/2">
          <Input
            placeholder={intl.formatMessage({
              id: 'form.postalCode.placeHolder',
            })}
            name="postalCode"
            type="text"
            register={register}
            required
            validation={{
              pattern: {
                value: pinCodeRegex,
                message: `${intl.formatMessage({
                  id: 'form.postalCode.errorMessage',
                })}`,
              },
            }}
            errors={errors}
          />
        </div>
      </div>
      {/* <div className="form-group text-left">
    <label className="form-label mb-4 text-left">Address Type</label>
    <div className=" flex items-center gap-3 md:gap-6">
      <Radio title="Home" value="home" />
      <Radio title="Work" value="work" />
    </div>
  </div> */}

      <div className="text-left mt-5">
        <Button
          title={title}
          type="submit"
          className="w-full sm:w-fit"
          disabled={(!isMyAccount && !isDirty) || loading}
          btnLoader={loading}
        />
      </div>
    </form>
  )
}

export default AddressForm

AddressForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  resetData: PropTypes.object,
  loading: PropTypes.bool,
  isBilling: PropTypes.bool,
  isMyAccount: PropTypes.bool,
  isShipping: PropTypes.bool,
}
AddressForm.defaultProps = {
  title: 'Submit',
  loading: false,
  isBilling: false,
  isMyAccount: false,
  isShipping: false,
}
