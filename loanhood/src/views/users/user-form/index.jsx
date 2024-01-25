import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Switch,
  TextField,
  FormGroup
} from '@material-ui/core'
import { formateDate, verifyEmail } from 'utils/helper'
import PersonIcon from '@material-ui/icons/Person'
import { CreateUser, getPresignedUrl, UpdateUser } from 'state/actions/users'
import { useHistory } from 'react-router-dom'
import OpenSnackbar from 'components/Snackbar'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router'

function UserForm({ data, type }) {
  const userInterestOptions = [
    {
      label: 'Women',
      value: 'women'
    },
    {
      label: 'Men',
      value: 'men'
    },
    {
      label: 'Ungendered',
      value: 'Ungendered'
    }
  ]
  const { register, handleSubmit, control, watch, getValues, reset } = useForm({
    defaultValues: {
      userInterests: []
    }
  })
  const { id } = useParams()
  const profileImageInput = watch('profileImage') && watch('profileImage')[0]
  const profileImageInputUrl = profileImageInput && URL.createObjectURL(profileImageInput)
  const dispatch = useDispatch()
  const history = useHistory()
  const inputImageVal = getValues('profileImage')
  const [formData, setFormData] = useState({
    file: '',
    avatarUrl: '',
    firstName: '',
    lastName: '',
    userName: '',
    emailId: '',
    bio: '',
    isTest: false,
    isLoanHood: false,
    userInterests: []
  })
  const [pageLoading, setPageLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const resStatus = useSelector((state) => state.users.resStatus)
  const resMessage = useSelector((state) => state.users.resMessage)
  const rentalDetail = useSelector((state) => state.rental.rentalDetail)
  const [sentData, setSentData] = useState({})
  const userPreSignedUrl = useSelector((state) => state?.users?.preSignedUrl)

  useEffect(() => {
    if (data && typeof data === 'object') {
      setFormData({
        avatarUrl: data.avatarUrl,
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        emailId: data.emailId,
        bio: data.bio,
        isTest: data.isTest,
        isLoanHood: data.isLoanHood,
        userInterests: data.userInterests ? data.userInterests : []
      })
      reset({
        avatarUrl: data.avatarUrl,
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        emailId: data.emailId,
        bio: data.bio,
        isTest: data.isTest,
        isLoanHood: data.isLoanHood,
        userInterests: data.userInterests ? data.userInterests : []
      })
      setPageLoading(true)
    } else {
      setPageLoading(true)
    }
  }, [data])

  useEffect(() => {
    if (resStatus && resMessage) {
      setIsLoading(false)
      history.push('/users')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
    // if (resMessage) {
    //   setIsLoading(false)
    // }
  }, [resStatus, resMessage])

  useEffect(() => {
    rentalDetail && setSentData(rentalDetail)
  }, [rentalDetail, sentData])

  useEffect(() => {
    if (inputImageVal && inputImageVal[0]) {
      dispatch(getPresignedUrl({ file: inputImageVal[0] }))
    }
  }, [inputImageVal])

  function onSubmit(e) {
    if (profileImageInput) {
      e.file = e.profileImage[0]
      e.avatarUrl = userPreSignedUrl && userPreSignedUrl[0].s3Url
    }
    delete e.profileImage
    if (id) {
      dispatch(UpdateUser(id, e))
      setIsLoading(true)
    } else {
      dispatch(CreateUser(e))
      setIsLoading(true)
    }
  }

  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      {pageLoading && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justify="space-between" spacing={3}>
            <Grid item xs={12} sm={4}>
              <input
                type="file"
                disabled={type === 'detail'}
                accept="image/*"
                name="profileImage"
                hidden
                id="userImg"
                {...register('profileImage')}
              />
              <label htmlFor="userImg" className={`user-img ${!(profileImageInputUrl || formData.avatarUrl) && 'no-image'}`}>
                {profileImageInputUrl || formData.avatarUrl ? (
                  <Box
                    component="img"
                    alt={formData.userName}
                    src={profileImageInputUrl || formData.avatarUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                  />
                ) : (
                  <PersonIcon />
                )}
              </label>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue={formData?.firstName || ''}
                    rules={{ required: 'First name is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        label="First Name"
                        type="text"
                        name="firstName"
                        disabled={type === 'detail'}
                        value={value}
                        onChange={onChange}
                        helperText={error ? error.message : null}
                        error={!!error}
                        {...register('firstName', {
                          minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters'
                          },
                          maxLength: {
                            value: 20,
                            message: 'First name must be less than 20 characters'
                          }
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue={formData?.lastName || ''}
                    rules={{ required: 'Last name is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        label="Last Name"
                        type="text"
                        name="lastName"
                        disabled={type === 'detail'}
                        value={value}
                        onChange={onChange}
                        helperText={error ? error.message : null}
                        error={!!error}
                        {...register('lastName', {
                          minLength: {
                            value: 2,
                            message: 'Last name must be at least 2 characters'
                          },
                          maxLength: {
                            value: 20,
                            message: 'Last name must be less than 20 characters'
                          }
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="userName"
                    control={control}
                    defaultValue={formData?.userName || ''}
                    rules={{ required: 'User name is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        label="User Name"
                        disabled={type === 'detail'}
                        type="text"
                        name="userName"
                        value={value}
                        onChange={onChange}
                        helperText={error ? error.message : null}
                        error={!!error}
                        {...register('userName')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="emailId"
                    control={control}
                    defaultValue={formData?.emailId || ''}
                    rules={{ required: 'Email id is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        label="Email"
                        disabled={type === 'detail'}
                        type="text"
                        name="emailId"
                        helperText={error ? error.message : null}
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        {...register('emailId', {
                          validate: (value) => verifyEmail(value) || 'Please enter valid email'
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="bio"
                    control={control}
                    defaultValue={formData?.bio || ''}
                    rules={{ required: 'Bio field is required' }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        label="Bio"
                        type="text"
                        name="bio"
                        disabled={type === 'detail'}
                        multiline
                        rows={4}
                        value={value}
                        onChange={onChange}
                        helperText={error ? error.message : null}
                        error={!!error}
                        {...register('bio', {
                          maxLength: {
                            value: 200,
                            message: 'bio Should be less than 200 characters'
                          }
                        })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {type === 'detail' && (
                    <Controller
                      name="userInterests"
                      control={control}
                      defaultValue={formData?.userInterests || ''}
                      render={({ field: { value } }) => (
                        <TextField
                          margin="normal"
                          variant="outlined"
                          fullWidth
                          label="Interests"
                          type="text"
                          name="userInterests"
                          value={value}
                          disabled
                        />
                      )}
                    />
                  )}

                  {type !== 'detail' && (
                    <FormControl component="fieldset" variant="standard">
                      <FormLabel component="legend">Interests</FormLabel>
                      <FormGroup>
                        <Controller
                          name="userInterests"
                          control={control}
                          render={({ field }) => (
                            <>
                              {userInterestOptions.map((userInterestOption) => (
                                <FormControlLabel
                                  key={userInterestOption.value}
                                  label={userInterestOption.label}
                                  control={
                                    <Checkbox
                                      size="small"
                                      color="primary"
                                      value={userInterestOption.value}
                                      checked={field.value.some((existingValue) => existingValue === userInterestOption.value)}
                                      onChange={(event, checked) => {
                                        if (checked) {
                                          field.onChange([...field.value, event.target.value])
                                        } else {
                                          field.onChange(field.value.filter((value) => value !== event.target.value))
                                        }
                                      }}
                                    />
                                  }
                                />
                              ))}
                            </>
                          )}
                        />
                      </FormGroup>
                    </FormControl>
                  )}
                </Grid>
                {type === 'detail' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled
                        type="text"
                        label="Is Email Verified"
                        defaultValue={data.isEmailVerified ? 'Yes' : 'No'}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled
                        type="text"
                        label="Is Admin"
                        defaultValue={data.isAdmin ? 'Yes' : 'No'}
                      />
                    </Grid>
                  </>
                )}
                {type && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled
                        type="text"
                        label="Is Stripe Verified"
                        defaultValue={data.isStripeVerified ? 'Yes' : 'No'}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled
                        type="text"
                        label="Is Stripe Merchant"
                        defaultValue={data.isStripeMerchant ? 'Yes' : 'No'}
                      />
                    </Grid>
                  </>
                )}
                {type === 'detail' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled
                        type="text"
                        label="Stripe Customer Id"
                        defaultValue={data.stripeCustomerId}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled
                        type="text"
                        label="Stripe Identity Id"
                        defaultValue={data.stripeIdentityId}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled
                        type="text"
                        label="Updated At"
                        defaultValue={formateDate(data.updatedAt)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        disabled
                        type="text"
                        label="Created At"
                        defaultValue={formateDate(data.createdAt)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        disabled
                        label="Deep link"
                        name="deepLink"
                        size="small"
                        value={data?.shareUrl || '-'}
                      />
                    </Grid>
                  </>
                )}
                {type === 'edit' && (
                  <>
                    <Grid item xs={6}>
                      <Controller
                        name="isTest"
                        control={control}
                        defaultValue={formData?.isTest}
                        render={({ field }) => (
                          <FormControlLabel
                            className="rental-switch"
                            control={
                              <Switch
                                color="primary"
                                name="isTest"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            }
                            disabled={type === 'detail'}
                            label="Is Test"
                            labelPlacement="start"
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Controller
                        name="isLoanHood"
                        control={control}
                        defaultValue={formData?.isLoanHood}
                        render={({ field }) => (
                          <FormControlLabel
                            className="rental-switch"
                            control={
                              <Switch
                                color="primary"
                                checked={field.value}
                                name="isLoanHood"
                                onChange={(e) => field.onChange(e.target.checked)}
                              />
                            }
                            disabled={type === 'detail' || data.isStripeMerchant === false}
                            label="Managed by LNHD"
                            labelPlacement="start"
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
                {type !== 'detail' && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      type="submit"
                      color="primary"
                      disabled={isLoading}
                      endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                    >
                      {type === 'edit' ? 'Update User' : 'Add User'}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </>
  )
}

UserForm.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string
}

export default UserForm
