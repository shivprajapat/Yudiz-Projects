import React, { useState } from 'react'
import Input from 'Components/Input'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { changePasswordApi } from 'Query/Auth/auth.query'
import Divider from 'Components/Divider'
import { ReactComponent as Eye } from '../../Assets/Icons/eye.svg'
import { ReactComponent as CloseEye } from '../../Assets/Icons/closeEye.svg'
import { useMutation } from 'react-query'
import { Loading } from 'Components'
import { useNavigate } from 'react-router-dom'
import { removeToken } from 'helpers/helper'

const validationSchema = yup.object().shape({
  currentPassword: yup.string().required('Current Password is required'),
  newPassword: yup
    .string()
    .required('New Password is required')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Minimum 8 characters, at least one letter, one number & one special character'
    ),
  confirmNewPassword: yup.string().required('Confirm New Password is required'),
})

export default function ChangePassword() {
  const [show, setShow] = useState(true)
  const [currentshow, setCurrentShow] = useState(false)
  const navigate = useNavigate()
  const mutation = useMutation(changePasswordApi, {
    onSuccess: () => {
      removeToken()
      navigate('/login')
    },
  })
  // useForm
  const {
    watch,
    control,
    handleSubmit,
    // reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = (data) => {
    const changePasswordData = {
      sCurrentPassword: data.currentPassword,
      sNewPassword: data.newPassword,
      sConfirmPassword: data.confirmNewPassword,
    }
    if (changePasswordData) {
      mutation.mutate(changePasswordData)
    }
  }

  if (mutation.isLoading) return <Loading />

  return (
    <Wrapper>
      <PageTitle title="Set New Passowrd" BtnText="save" handleButtonEvent={handleSubmit(onSubmit)} />
      <div className="mt-3">
        <Divider />
      </div>
      <section className="mt-5 ms-3 w-50 changePassword_section">
        <Controller
          name="currentPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              labelText={'Current Password'}
              placeholder="Enter Current Password"
              id={'currentPassword'}
              type={show ? 'text' : 'password'}
              name="currentPassword"
              errorMessage={errors.currentPassword?.message}
              className="ps-5"
              startIcon={show ? <Eye onClick={() => setShow(false)} /> : <CloseEye onClick={() => setShow(true)} />}
            />
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              labelText={'New Password'}
              placeholder="Enter New Password"
              id={'newPassword'}
              type={currentshow ? 'text' : 'password'}
              name="newPassword"
              errorMessage={errors.newPassword?.message}
              className="ps-5"
              startIcon={currentshow ? <Eye onClick={() => setCurrentShow(false)} /> : <CloseEye onClick={() => setCurrentShow(true)} />}
            />
          )}
        />
        <Controller
          name="confirmNewPassword"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              labelText={'Confirm New Password'}
              placeholder="Re-Enter New Password"
              id={'confirmNewPassword'}
              type={'password'}
              name="confirmNewPassword"
              errorMessage={field.value !== watch('newPassword') && "Password does'nt match"}
              className="ps-5"
              startIcon={<CloseEye />}
            />
          )}
        />
      </section>
    </Wrapper>
  )
}
