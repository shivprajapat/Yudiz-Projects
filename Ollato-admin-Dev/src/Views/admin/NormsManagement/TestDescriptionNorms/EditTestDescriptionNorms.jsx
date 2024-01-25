import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { editSpecificTestNormsDescription, getSpecificTestNormsDescription } from '../../../../Actions/Admin/Norms/TestNormsDescription/TestNormsDescription'
import { getAllNormsList } from '../../../../Actions/Admin/Norms/norms'
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
    .shape({
      id: yup.string().required('Sub Test is required'),
      title: yup.string().required('Sub Test is required')
    })
    .nullable()
    .required('Sub Test is required'),
  testDescription: yup.string().required('Description is required'),
  planOfAction: yup.string().required('Plan of Action is required')
})

function EditTestDescriptionNorms () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()

  // hook
  const { setMainCatid, testArray, subtestArray } = useCategory()

  // useSelector
  const mainData = useSelector(state => state.testNormsDescription.resData)
  const normsArray = useSelector((state) => state.norms.normsList)
  const editedResMessage = useSelector(state => state.testNormsDescription.resMessage)
  const isEditedData = useSelector(state => state.testNormsDescription.isTestNormsDescriptionEdited)

  // previousProps
  const previousProps = useRef({ editedResMessage, isEditedData }).current

  // useEffect to get data by id
  useEffect(() => {
    dispatch(getSpecificTestNormsDescription(Number(id), token))
    dispatch(getAllNormsList(token))
  }, [])

  // useForm
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // onSubmit
  const onSubmit = (data) => {
    const testNormsDescriptionData = {
      id: mainData?.id,
      test_id: data?.test?.id,
      test_detail_id: data?.subtest?.id,
      norm_id: data?.norms?.id,
      description: data?.testDescription,
      plan_of_action: data?.planOfAction,
      norm: data?.norms?.code
    }
    if (testNormsDescriptionData) {
      dispatch(editSpecificTestNormsDescription(testNormsDescriptionData, token))
    }
  }

  // reSet Form
  useEffect(() => {
    if (mainData) {
      setMainCatid(mainData?.tests?.id)
      const normsV = normsArray?.find(n => n?.id === mainData?.norm_id)
      reset({
        norms: normsV,
        subtest: {
          id: mainData?.test_details?.id,
          title: mainData?.test_details?.title
        },
        test: {
          id: mainData?.tests?.id,
          title: mainData?.tests?.title
        },
        testDescription: mainData?.description,
        planOfAction: mainData?.plan_of_action
      })
    }
  }, [mainData, normsArray])

  // Notification for Edit
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/norms/test-description-norms')
      } else if (isEditedData === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isEditedData = isEditedData
    }
  }, [isEditedData])
  return (
    <>
          <Header />
          <TitleHeader
            name='Edit Test Description Norms'
            title='Norms Management'
          />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Edit Test Description Norms</h5>
              <div className='btn-box'>
                <button className='theme-btn dark-btn text-none' onClick={() => navigate(-1)} >Cancel</button>
                <button className='theme-btn text-none' onClick={handleSubmit(onSubmit)} >Save</button>
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
                        render={({ field: { onChange, value = {} } }) => {
                          return (
                          <Select
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            placeholder={'Select Norms'}
                            getOptionLabel={(option) => option?.title}
                            getOptionValue={(option) => option?.id}
                            value={value || getValues()?.norms}
                            options={normsArray}
                            onChange={(e) => {
                              onChange(e)
                            }}
                          />
                          )
                        }}
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
                        render={({ field }) => {
                          return (
                            <Select
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            placeholder={'Select Test'}
                            options={testArray}
                            value={field.value || getValues()?.testArray}
                            getOptionLabel={(option) =>
                              option?.title
                            }
                            getOptionValue={(option) =>
                              option?.id
                            }
                            onChange={(e) => {
                              field.onChange(e)
                              setMainCatid(e.id)
                              setValue('subtest', '')
                            }}
                          />
                          )
                        }}
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
                      <Form.Label>SubTest</Form.Label>
                      <Controller
                        name='subtest'
                        control={control}
                        render={({ field: { onChange, value = {} } }) => {
                          return (
                            <Select
                            placeholder={'Select SubTest'}
                            getOptionLabel={(option) => option?.title}
                            getOptionValue={(option) => option?.id}
                            options={subtestArray}
                            value={value || getValues()?.subtest}
                            onChange={(e) => {
                              onChange(e)
                            }}
                          />
                          )
                        }}
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

export default EditTestDescriptionNorms
