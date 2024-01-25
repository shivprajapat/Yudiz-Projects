import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

import EditProfileComponent from 'shared/components/profile'
import { getClientProfile, updateClientProfile } from 'shared/apis/profile'
import { getFromLocalStorage } from 'shared/helper/localStorage'
import { ToastrContext } from 'shared/components/toastr'
import { TOAST_TYPE } from 'shared/constants'
import { allRoutes } from 'shared/constants/AllRoutes'
import Countries from 'shared/constants/countries'
import States from 'shared/constants/states'
import Cities from 'shared/constants/cities'

function EditProfile() {
  const history = useHistory()
  const [profileData, setProfileData] = useState({})
  const { dispatch } = useContext(ToastrContext)

  const {
    register,
    control,
    formState: { errors },
    clearErrors,
    trigger,
    getValues,
    handleSubmit,
    setValue,
    reset
  } = useForm({
    mode: 'all',
    defaultValues: {
      sProfilePicture: ''
    }
  })

  async function getProfileData() {
    const response = await getClientProfile()
    if (response.status === 200) {
      setProfileData(response.data)
      reset({
        sUsername: response.data.sUsername,
        sName: response.data.sName,
        sEmail: response.data.sEmail,
        sCompanyName: response.data.sCompanyName,
        sPhone: response.data.sPhone,
        sGSTNo: response.data.sGSTNo,
        sAddress: response.data.sAddress,
        sCountry: Countries.filter(item => item.id === response?.data?.sCountry)[0],
        sState: States.filter(item => item.id === response?.data?.sState)[0],
        sCity: Cities.filter(item => item.id === response?.data?.sCity)[0]
      })
    }
  }
  useEffect(() => {
    if (getFromLocalStorage('role') === 'client') {
      getProfileData()
    }
  }, [])

  function handleChange(newValue) {
    setProfileData({ ...profileData, sUrl: newValue })
  }
  function manipulateData(data) {
    data.aSubscriptionType = data?.aSubscriptionType?.map(item => item.value)
    return {
      ...data,
      sCountry: data.sCountry?.id || '',
      sState: data.sState?.id || '',
      sCity: data.sCity?.id || ''
    }
  }
  async function editProfile(data) {
    const manipulatedData = await manipulateData(data)
    const response = await updateClientProfile(manipulatedData)
    if (response.status === 200) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
      history.push(allRoutes.dashboard)
    }
  }

  return (
    <>
      <div className='edit-profile'>
        <Form onSubmit={handleSubmit(editProfile)} autoComplete='off'>
          <EditProfileComponent
            register={register}
            control={control}
            errors={errors}
            clearErrors={clearErrors}
            trigger={trigger}
            values={getValues()}
            profileData={profileData}
            handleChange={(e) => handleChange(e)}
            setValue={setValue}
          />
          <div className='add-border'>
            <Button variant='primary' type='submit' className='m-2'>
              <FormattedMessage id='update' />
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default EditProfile
