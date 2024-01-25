import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addPackageAction } from '../../../Actions/Admin/package'
import { useSnackbar } from 'react-notistack'
import TextEditor from '../../../Components/Editor'

const packageRegex =
/^(?!\s)[A-Za-z0-9 -_@./#&+,]*$/

// /^[A-Za-z0-9 -]*$/

const validationSchema = yup.object().shape({
  packageType: yup
    .object()
    .shape({
      label: yup.string().required('Package Type is required'),
      value: yup.string().required('Package Type is required')
    })
    .nullable()
    .required('Package Type is required'),
  packageName: yup.string().required('Package Name is required').matches(
    packageRegex,
    'invalid name'
  ),
  packageNumber: yup.number().positive().required('Package Number is required').typeError('Package Number is required'),
  packagePrice: yup.number().positive().required('Package Price is required').typeError('Package Price is required')
})

function AddNewPackage () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const packagetype = [
    { value: 'addon', label: 'Add-On Package' },
    { value: 'subcription', label: 'Inactive' }
  ]
  const defaultValues = {
    reportGeneration: false,
    f2fCounseling: false,
    virtualCounseling: false,
    onlineTest: false
  }

  // useState
  const [htmlData, setHtmlData] = useState('')

  // useSelector
  const isPackageDataAdded = useSelector((state) => state.packages.isPackageAdded)
  const isPackageAddedMessage = useSelector((state) => state.packages.resMessage)

  // previousProps
  const previousProps = useRef({ isPackageDataAdded, isPackageAddedMessage }).current

  // useForm
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues
  })

  // onSubmit
  const onSubmit = (data) => {
    const packageData = {
      title: data.packageName,
      amount: data.packagePrice,
      description: htmlData,
      package_number: data.packageNumber,
      package_type: data.packageType.value,
      online_test: data.onlineTest,
      test_report: data.reportGeneration,
      video_call: data.virtualCounseling,
      f2f_call: data.f2fCounseling
    }
    if (packageData) {
      dispatch(addPackageAction(packageData, token))
    }
    reset()
  }

  // Notification for Add
  useEffect(() => {
    if (previousProps?.isPackageDataAdded !== isPackageDataAdded) {
      if (isPackageDataAdded) {
        enqueueSnackbar(`${isPackageAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/package-management')
      } else if (isPackageDataAdded === false) {
        enqueueSnackbar(`${isPackageAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isPackageDataAdded = isPackageDataAdded
    }
  }, [isPackageDataAdded])
  useEffect(() => {
  }, [htmlData])

  return (
    <>
          <Header />
          <TitleHeader name='Add Package' title='Package Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Add Package</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  className='theme-btn text-none'
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </button>
              </div>
            </div>
            <div className='form-middle-layout'>
              <Form className='light-bg'>
                <div className='row'>
                  <div className='col-md-12'>
                    <div className='row selected-type'>
                      <div className='col-md-6'>
                        <Form.Group
                          className='form-group common-select-style'
                          controlId='formpackagetype'
                        >
                          <Form.Label>PackageType</Form.Label>
                          <Controller
                            name='packageType'
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isClearable
                                isSearchable={false}
                                placeholder={'Select Type'}
                                className='react-dropdown'
                                classNamePrefix='dropdown'
                                options={packagetype}
                              />
                            )}
                          />
                          <p className='error-msg'>
                            {errors.packageType?.message ||
                              errors.packageType?.label.message}
                          </p>
                        </Form.Group>
                      </div>
                      <div className='col-md-12 checkbox-packagetype'>
                        <Form.Group
                          className='form-group package-type-checkbox checkbox-box d-flex align-items-center '
                          controlId='formBasicCheckbox'
                        >
                          <Form.Check type='checkbox' id='checkbox-1'>
                            <Controller
                              name='onlineTest'
                              control={control}
                              render={({ field }) => (
                                <Form.Check.Input
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  checked={field.value}
                                />
                              )}
                            />
                            <Form.Check.Label>Online Test</Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox' id='checkbox-2'>
                            <Controller
                              name='reportGeneration'
                              control={control}
                              render={({ field }) => (
                                <Form.Check.Input
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  checked={field.value}
                                />
                              )}
                            />
                            <Form.Check.Label>
                              Report Generation
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox' id='checkbox-3'>
                            <Controller
                              name='virtualCounseling'
                              control={control}
                              render={({ field }) => (
                                <Form.Check.Input
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  checked={field.value}
                                />
                              )}
                            />
                            <Form.Check.Label>
                              Virtual Counseling
                            </Form.Check.Label>
                          </Form.Check>
                          <Form.Check type='checkbox' id='checkbox-4'>
                            <Controller
                              name='f2fCounseling'
                              control={control}
                              render={({ field }) => (
                                <Form.Check.Input
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  checked={field.value}
                                />
                              )}
                            />
                            <Form.Check.Label>F2F Counseling</Form.Check.Label>
                          </Form.Check>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formpackagename'
                    >
                      <Form.Label>Package Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter Package Name'
                        {...register('packageName', {
                          required: 'true'
                        })}
                      />
                      {errors.packageName?.message && (
                        <Form.Text className='error-msg'>
                          {errors.packageName?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formpackagenumber'
                    >
                      <Form.Label>Package Number</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Enter Package Number'
                        {...register('packageNumber', {
                          required: 'true'
                        })}
                      />
                      {errors.packageNumber?.message && (
                        <Form.Text className='error-msg'>
                          {errors.packageNumber?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formpackageprice'
                    >
                      <Form.Label>Package Price</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Enter Package Price'
                        {...register('packagePrice', {
                          required: 'true'
                        })}
                      />
                      {errors.packagePrice?.message && (
                        <Form.Text className='error-msg'>
                          {errors.packagePrice?.message}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                  <div className='col-md-12'>
                    <Form.Group
                      className='form-group'
                      controlId='formpackagedescription'
                    >
                      <Form.Label>Package Description</Form.Label>
                     {!htmlData && <p className='error-msg'>Required field</p>}
                      <TextEditor setHtmlData={setHtmlData} />
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </div>
          </div>
    </>
  )
}

export default AddNewPackage
