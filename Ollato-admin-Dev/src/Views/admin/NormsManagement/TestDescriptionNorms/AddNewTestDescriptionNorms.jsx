import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { getAllNormsList } from '../../../../Actions/Admin/Norms/norms'
import { createTestNormsDescription } from '../../../../Actions/Admin/Norms/TestNormsDescription/TestNormsDescription'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'
import { useCategory } from '../../../../Shared/Hooks/UseCategory'

const validationSchema = yup.object().shape({
  norms: yup
    .object()
    .shape({
      id: yup.string().required('Norms is required'),
      title: yup.string().required('Norms is required')
    })
    .nullable()
    .required('Norms is required'),
  test: yup
    .object()
    .shape({
      id: yup.string().required('Test is required'),
      title: yup.string().required('Test is required')
    })
    .nullable()
    .required('Test is required'),
  subtest: yup
    .object()
    .nullable()
    .required('Sub Test is required'),
  testDescription: yup.string().required('Description is required'),
  planOfAction: yup.string().required('Plan of Action is required')
})

function AddNewTestDescriptionNorms () {
  // constant
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  // useSelector
  const normsArray = useSelector((state) => state.norms.normsList)
  const isTestNormsDescriptionAdded = useSelector((state) => state.testNormsDescription.isTestNormsDesscriptionAdded)
  const isTestNormsDescriptionAddedMessage = useSelector((state) => state.testNormsDescription.resMessage)

  // hook
  const { mainCatid, setMainCatid, testArray, subtestArray } = useCategory()

  // useEffect
  useEffect(() => {
    dispatch(getAllNormsList(token))
  }, [])

  // previousProps
  const previousProps = useRef({
    isTestNormsDescriptionAdded,
    isTestNormsDescriptionAddedMessage
  }).current

  // useForm
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // onSubmit
  const onSubmit = (data) => {
    const testNormsDescriptionData = {
      norm_id: data.norms.id,
      norm: data?.norms?.code,
      test_id: data?.test?.id,
      test_detail_id: data?.subtest?.id,
      description: data.testDescription,
      plan_of_action: data.planOfAction
    }
    if (testNormsDescriptionData) {
      dispatch(createTestNormsDescription(testNormsDescriptionData, token))
    }
  }

  // Notification for Add
  useEffect(() => {
    if (previousProps?.isTestNormsDescriptionAdded !== isTestNormsDescriptionAdded) {
      if (isTestNormsDescriptionAdded) {
        enqueueSnackbar(`${isTestNormsDescriptionAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/norms/test-description-norms')
      } else if (isTestNormsDescriptionAdded === false) {
        enqueueSnackbar(`${isTestNormsDescriptionAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isTestNormsDescriptionAdded = isTestNormsDescriptionAdded
    }
  }, [isTestNormsDescriptionAdded])
  return (
    <>
          <Header />
          <TitleHeader
            name='Add New TestDescription Norms'
            title='Norms Management'
          />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Add New TestDescription Norms</h5>
              <div className='btn-box'>
                <button className='theme-btn dark-btn text-none' onClick={() => navigate(-1)} >Cancel</button>
                <button className='theme-btn text-none' onClick={handleSubmit(onSubmit)}>Save</button>
              </div>
            </div>
            <div className='form-middle-layout'>
              <Form className='light-bg'>
                <div className='row'>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>Norms</Form.Label>
                      <Controller
                        name='norms'
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            placeholder={'Select Norms'}
                            getOptionLabel={(option) => option?.title}
                            getOptionValue={(option) => option?.id}
                            options={normsArray}
                          />
                        )}
                      />
                      <p className='error-msg'>
                      {errors.norms?.title?.message || errors.norms?.id?.message }
                      </p>
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>Test</Form.Label>
                      <Controller
                        name='test'
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            placeholder={'Select Test'}
                            getOptionLabel={(option) => option.title}
                            getOptionValue={(option) => option.id}
                            options={testArray}
                            onChange={(e) => {
                              field.onChange(e)
                              setMainCatid(e.id)
                              setValue('subtest', '')
                            }}
                          />
                        )}
                      />
                      <p className='error-msg'>
                      {errors.test?.title?.message || errors.test?.id?.message }
                      </p>
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group common-select-style'
                      controlId='formfullname'
                    >
                      <Form.Label>Sub-Test</Form.Label>
                      <Controller
                        name='subtest'
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            placeholder={'Select Test'}
                            getOptionLabel={(option) => option.title}
                            getOptionValue={(option) => option.id}
                            options={subtestArray}
                            isDisabled={!mainCatid && true}
                          />
                        )}
                      />
                      <p className='error-msg'>
                      {errors.subtest?.message || errors.subtest?.id?.message }
                      </p>
                    </Form.Group>
                  </div>
                  <div className='col-md-12'>
                    <div className='row'>
                      <div className='col-md-6'>
                        <Form.Group
                          className='form-group'
                          controlId='formdescription'
                        >
                          <Form.Label>Test Description</Form.Label>
                          <Form.Control
                            as='textarea'
                            className='big-textarea'
                            placeholder='Enter Test Description'
                            {...register('testDescription', {
                              required: 'true'
                            })}
                          />
                          {errors.testDescription?.message && (
                          <Form.Text className='error-msg'>
                            {errors.testDescription?.message}
                          </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                      <div className='col-md-6'>
                        <Form.Group
                          className='form-group'
                          controlId='formplanofaction'
                        >
                          <Form.Label>Plan of action</Form.Label>
                          <Form.Control
                            as='textarea'
                            className='big-textarea'
                            placeholder='Enter Plan of action'
                            {...register('planOfAction', {
                              required: 'true'
                            })}
                          />
                          {errors.planOfAction?.message && (
                          <Form.Text className='error-msg'>
                            {errors.planOfAction?.message}
                          </Form.Text>
                          )}
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
    </>
  )
}

export default AddNewTestDescriptionNorms
