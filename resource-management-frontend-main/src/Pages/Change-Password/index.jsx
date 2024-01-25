import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { Row } from 'react-bootstrap'
import Input from 'Components/Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import { passwordRegex, removeToken } from 'helpers'
import Button from 'Components/Button'
import Eye from 'Assets/Icons/Eye'
import { ReactComponent as CloseEye } from 'Assets/Icons/closeEye.svg'
import { changePasswordApi } from 'Query/Auth/auth.query'
import Loading from 'Components/Loading'
import Divider from 'Components/Divider'

const ChangePassword = () => {
  const navigate = useNavigate()

  const [showCurrentPassword, setShowCurrentPassword] = useState(true)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const { control, handleSubmit, setError } = useForm()

  const mutation = useMutation(changePasswordApi, {
    onSuccess: () => {
      const token = localStorage.getItem('token')
      removeToken(token)
      navigate('/login')
    },
  })

  const onSubmit = (data) => {
    const { currentPassword, newPassword, confirmNewPassword } = data
    if (currentPassword && newPassword && confirmNewPassword) {
      if(newPassword === confirmNewPassword) {
        const changePasswordData = {
          sCurrentPassword: currentPassword,
          sNewPassword: newPassword,
          sConfirmPassword: confirmNewPassword,
        }
        mutation.mutate(changePasswordData)
      } else {
        setError('confirmNewPassword', { type: 'custom', message: `confirm new password and new password doesn't match`})
      }
    }
  }

  if (mutation.isLoading) {
    return <Loading />
  }
  return (
    <section>
      <Wrapper>
        <div>
          <PageTitle title="Change Password" />
        </div>
        <Divider />
        <form className='ms-2 mt-4'>
          <Row>
            <Controller
              name="currentPassword"
              control={control}
              rules={{
                required: 'Current Password is required',
                pattern: {
                  value: passwordRegex,
                  message:
                    'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character',
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText={'Current Password'}
                  placeholder={'Enter Current Password'}
                  id={'currentPassword'}
                  errorMessage={error?.message}
                  type={showCurrentPassword ? 'text' : 'password'}
                  startIcon={
                    showCurrentPassword ? (
                      <Eye onClick={() => setShowCurrentPassword(false)} />
                    ) : (
                      <CloseEye onClick={() => setShowCurrentPassword(true)} />
                    )
                  }
                />
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              rules={{
                required: 'New Password is required',
                pattern: {
                  value: passwordRegex,
                  message:
                    'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character',
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText={'New Password'}
                  placeholder={'Enter New Password'}
                  id={'newPassword'}
                  errorMessage={error?.message}
                  type={showNewPassword ? 'text' : 'password'}
                  startIcon={
                    showNewPassword ? (
                      <Eye onClick={() => setShowNewPassword(false)} />
                    ) : (
                      <CloseEye onClick={() => setShowNewPassword(true)} />
                    )
                  }
                />
              )}
            />
            <Controller
              name="confirmNewPassword"
              control={control}
              rules={{ required: 'Confirm New Password is required' }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  labelText={'Confirm New Password'}
                  placeholder={'Re-Enter New Password'}
                  id={'confirmNewPassword'}
                  errorMessage={error?.message}
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  startIcon={
                    showConfirmNewPassword ? (
                      <Eye onClick={() => setShowConfirmNewPassword(false)} />
                    ) : (
                      <CloseEye onClick={() => setShowConfirmNewPassword(true)} />
                    )
                  }
                />
              )}
            />
          </Row>
          <Button className="mt-4" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </form>
      </Wrapper>
    </section>
  )
}

export default ChangePassword