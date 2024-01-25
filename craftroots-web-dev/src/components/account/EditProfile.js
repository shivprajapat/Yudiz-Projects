import { useState } from 'react'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Button, Input } from '../generic'
import {
  accountDetails,
  emailRegex,
  nameRegex,
  phoneRegex,
  trimString,
} from '@/helper'
import { setToastDataAction } from '@/actions/toastAction'
import { setAccountData } from '@/actions/accountDetailAction'
import {
  ChangeUserEmailInformation,
  ChangeUserInformation,
} from '@/queries/accountDetailQueries'
import { request } from '@/services/api.service'

function EditProfile({ handleStepChange }) {
  const intl = useIntl()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    reset,
  } = useForm()
  const [editLoading, setEditLoading] = useState(false)
  const accountdetails = useSelector(
    (state) => state.accountReducer.accountData.customer
  )
  const getUpdatedAccountDetails = async () => {
    dispatch(
      setToastDataAction({
        show: true,
        message: intl.formatMessage({
          id: 'toast.profileUpdateMsg',
        }),
      })
    )
    reset({})
    const accountdetailData = await accountDetails()
    dispatch(setAccountData(accountdetailData))
    handleStepChange(0)
  }
  const onSubmit = async (data) => {
    const payload = {}

    for (const fieldName of Object.keys(dirtyFields)) {
      if (fieldName === 'email') continue
      payload[fieldName] = trimString(data[fieldName])
    }

    const emailChanged = dirtyFields.email
    try {
      setEditLoading(true)

      if (Object.keys(payload).length > 0) {
        await request({
          ...ChangeUserInformation,
          variables: {
            ...payload,
          },
        })
      }

      if (emailChanged) {
        await request({
          ...ChangeUserEmailInformation,
          variables: {
            email: trimString(data.email),
          },
        })
      }

      setEditLoading(false)
      getUpdatedAccountDetails()
    } catch (error) {
      setEditLoading(false)
      console.log('error while updating profile', error)
      dispatch(
        setToastDataAction({
          show: true,
          message: intl.formatMessage({
            id: 'somethingWentWrong',
          }),
          error: true,
        })
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <Input
          placeholder={intl.formatMessage({
            id: 'form.firstName.placeHolder',
          })}
          name="firstname"
          defaultValue={accountdetails?.firstname}
          type="text"
          register={register}
          required
          errorFieldName="First Name"
          validation={{
            pattern: {
              value: nameRegex,
              message: `${intl.formatMessage({
                id: 'form.firstName.errorMessage',
              })}`,
            },
          }}
          errors={errors}
        />
      </div>
      <div className="form-group">
        <Input
          placeholder={intl.formatMessage({
            id: 'form.lastName.placeHolder',
          })}
          name="lastname"
          defaultValue={accountdetails?.lastname}
          type="text"
          register={register}
          required
          errorFieldName="Last Name"
          validation={{
            pattern: {
              value: nameRegex,
              message: `${intl.formatMessage({
                id: 'form.lastName.errorMessage',
              })}`,
            },
          }}
          errors={errors}
        />
      </div>
      <div className="form-group">
        <Input
          placeholder={intl.formatMessage({
            id: 'form.email.placeHolder',
          })}
          name="email"
          defaultValue={accountdetails?.email}
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
      <div className="form-group">
        <Input
          placeholder={intl.formatMessage({
            id: 'form.phoneNumber.placeHolder',
          })}
          name="mobilenumber"
          defaultValue={accountdetails?.mobilenumber}
          type="number"
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
      <div className="mt-8">
        <Button
          title={intl.formatMessage({ id: 'button.save' })}
          className="w-full sm:w-fit"
          btnLoader={editLoading}
          disabled={editLoading || !Object.keys(dirtyFields).length > 0}
        />
      </div>
    </form>
  )
}

EditProfile.propTypes = {
  handleStepChange: PropTypes.func.isRequired,
}

export default EditProfile
