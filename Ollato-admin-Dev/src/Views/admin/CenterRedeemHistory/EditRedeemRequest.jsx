import React, { useEffect, useRef, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import { editSpecidicRedeemRequest, getSpecificRedeemReqCenter } from '../../../Actions/Admin/center'
import TitleHeader from '../../../Components/TitleHeader'
import otherdocPlaceholder from '../../../assets/images/other-img-placeholder.svg'
import crossWhite from '../../../assets/images/crosswhite.svg'
import { useSnackbar } from 'react-notistack'

function EditRedeemRequest () {
  const dispatch = useDispatch()
  const location = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const params = useParams()
  const id = params.id
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [signature, setSignature] = useState()

  // useselector
  const specicRedeemReqData = useSelector(
    (state) => state.centerManAdmin.specicRedeemReqData
  )
  const isRedeemReqEdited = useSelector(
    (state) => state.centerManAdmin.isRedeemReqEdited
  )
  const resMessage = useSelector(
    (state) => state.centerManAdmin.resMessage
  )
  const previousProps = useRef({
    isRedeemReqEdited
  }).current

  useEffect(() => {
    if (previousProps?.isRedeemReqEdited !== isRedeemReqEdited) {
      if (isRedeemReqEdited) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        if (location.pathname.includes('center')) {
          navigate('/admin/center-redeem-history')
        } else {
          navigate('/admin/counsellor-redeem-history')
        }
        reset()
      } else if (isRedeemReqEdited === false) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isRedeemReqEdited = isRedeemReqEdited
    }
  }, [isRedeemReqEdited])

  const statusArray = [
    { id: 1, title: 'paid' },
    { id: 2, title: 'pending' },
    { id: 3, title: 'rejected' }
  ]

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    // getValues,
    reset
    // setValue
  } = useForm({
    // resolver: yupResolver(validationSchemaCenter)
  })
  const { onChange } = register()

  useEffect(() => {
    if (location.pathname.includes('center')) {
      dispatch(getSpecificRedeemReqCenter(id, token, 'center'))
    } else {
      dispatch(getSpecificRedeemReqCenter(id, token, 'counsellor'))
    }
  }, [])

  useEffect(() => {
    if (specicRedeemReqData) {
      setSignature(specicRedeemReqData?.receipt)
      reset({
        status: {
          id: statusArray?.find((i) => i.title === specicRedeemReqData?.status)
            ?.id,
          title: specicRedeemReqData?.status
        }
      })
    }
  }, [specicRedeemReqData])

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('id', +id)
    formData.append('redeemStatus', data.status.title)
    formData.append('amount', specicRedeemReqData?.amount)
    if (signature) {
      formData.append('receipt', signature)
    }
    formData.append('center_id', specicRedeemReqData?.center_id)
    if (formData) {
      if (location.pathname.includes('center')) {
        dispatch(editSpecidicRedeemRequest(formData, token, 'center'))
      } else {
        dispatch(editSpecidicRedeemRequest(formData, token, 'counsellor'))
      }
    }
  }

  return <>
   <TitleHeader name='Edit' title='Edit Redeem Request' />

          <div className='main-layout whitebox-layout my-editprofile-page'>
            {specicRedeemReqData
              ? <>
              <Form className='light-bg' onSubmit={handleSubmit(onSubmit)}>
              <div className='heading-box'>
                <h5>Edit Request</h5>
                <div className='btn-box'>
                  <button
                  // type='button'
                    className='theme-btn dark-btn text-none'
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button type='submit' className='theme-btn text-none'>
                    Save
                  </button>
                </div>
              </div>
              <div className='light-bg-box'>
                <div className='row'>

                  <div className='col-xxl-12 '>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <h4>Request Details</h4>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                         className='form-group'
                          controlId='title'
                        >
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            placeholder='Enter Name'
                            type='text'
                            value={specicRedeemReqData?.centers?.title || specicRedeemReqData?.counsellors?.first_name + ' ' + specicRedeemReqData?.counsellors?.last_name }
                            disabled
                          />
                        </Form.Group>
                      </div>

                      <div className='col-lg-6'>
                        <Form.Group
                          controlId='formBasicEmail'
                          className='form-group'
                        >
                          <Form.Label>Amount</Form.Label>
                          <Form.Control
                            placeholder='Enter Mobile Number'
                            type='text'
                            value={specicRedeemReqData?.amount}
                            disabled
                          />
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                        <Form.Group
                          className={`form-group verified ${
                            errors.email?.message ? 'error-occured' : ''
                          }`}
                          controlId='formBasicEmail'
                        >
                          <Form.Label>Date</Form.Label>
                          <div className='position-relative'>
                            <Form.Control
                              placeholder='Enter Email ID'
                              type='text'
                              value={specicRedeemReqData?.date}
                              disabled
                            />
                          </div>
                          {errors.email?.message && (
                            <Form.Text className='error-msg'>
                              {errors.email?.message}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-lg-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>Status</Form.Label>
                      <Controller
                        name='status'
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={statusArray}
                            placeholder={'Select Professional Expertness'}
                            isSearchable={false}
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            getOptionLabel={(option) => option?.title}
                            getOptionValue={(option) => option?.id}
                          />
                        )}
                      />
                    </Form.Group>
                  </div>
                  {specicRedeemReqData &&
                  <div className='col-lg-6'>
                          <Form.Group
                            controlId='formgstnumber'
                            className='form-group document-file-input common-input-file  uploaded-doc'
                          >
                            <Form.Label>Update Signature</Form.Label>
                            <Form.Control
                              type='file'
                              className='hidden-file'
                              name='signature'
                              {...register('signature')}
                              onChange={(e) => {
                                onChange(e)
                                setSignature(e.target.files[0])
                              }}
                              accept="image/*"
                            />
                            <div className='form-control d-flex align-items-center flex-column justify-content-center text-center'>
                              <div className='img-box'>
                                <>
                                      <img src={typeof signature === 'string' ? `${process.env.REACT_APP_AXIOS_BASE_URL}${signature}` : typeof signature === 'object' && signature !== null ? URL.createObjectURL(signature) : otherdocPlaceholder} alt='' />
                                      {signature && <button
                                        className='close-cross-btn'
                                        onClick={(e) =>
                                          setSignature()
                                        }
                                      >
                                        <img src={crossWhite} alt='' />
                                      </button>}
                                    </>
                              </div>
                            </div>
                          </Form.Group>
                        </div> }
                    </div>
                  </div>
                </div>
              </div>
            </Form>
            </>
              : <Spinner className='text-center' animation='border' />}
          </div></>
}

export default EditRedeemRequest
