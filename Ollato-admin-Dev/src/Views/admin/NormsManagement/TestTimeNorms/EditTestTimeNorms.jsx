import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editSpecificTestTimeNorms, getAllGreade, getSpecificTestTimeNorms } from '../../../../Actions/Admin/Norms/TestTimeNorms/TestTimeNorms'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import { useCategory } from '../../../../Shared/Hooks/UseCategory'

const validationSchema = yup.object().shape({
  grade: yup
    .object()
    .shape({
      id: yup.string().required('Grade is required'),
      title: yup.string().required('Grade is required')
    })
    .nullable()
    .required('Grade is required'),
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
    .required('Test is required'),
  time: yup.number().positive().typeError('Time shold be positive').required('Time is required')
})

function EditTestTimeNorms () {
  // Constant
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // hook
  const { setMainCatid, testArray, subtestArray } = useCategory()

  // useEffect to getData
  useEffect(() => {
    dispatch(getSpecificTestTimeNorms(id, token))
    dispatch(getAllGreade(token))
  }, [])

  // useSelector
  const mainData = useSelector((state) => state.testTimeNorms.resData)
  const gradeArray = useSelector((state) => state.testTimeNorms.gradeList)
  const isEditedData = useSelector((state) => state.testTimeNorms.isTestTimeNormsEdited)
  const editedResMessage = useSelector((state) => state.testTimeNorms.resMessage)

  // previousProps
  const previousProps = useRef({ editedResMessage, isEditedData }).current

  // useForm
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  // reSet
  useEffect(() => {
    if (mainData) {
      setMainCatid(mainData?.test_details?.tests?.id)
      const gradeV = gradeArray?.filter(g => g?.id === mainData?.grade_id)[0]
      reset({
        grade: gradeV,
        test: {
          id: mainData?.test_details?.tests?.id,
          title: mainData?.test_details?.tests?.title
        },
        subtest: {
          id: mainData?.test_details?.id,
          title: mainData?.test_details?.title
        },
        time: mainData?.time_Sec
      })
    }
  }, [mainData, gradeArray])

  // onSubmit
  const onSubmit = (data) => {
    const testTimeNormsData = {
      id,
      testDetailId: Number(data.subtest.id),
      gradeId: Number(data.grade.id),
      timeSec: Number(data.time)
    }
    if (testTimeNormsData) {
      dispatch(editSpecificTestTimeNorms(testTimeNormsData, token))
    }
  }

  // Notification for Edit
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/norms/test-time-norms')
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
          <TitleHeader name='Edit Test Time Norms' title='Norms Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Edit TestTimeNorms</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
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
                      <Form.Label>Grade</Form.Label>
                      <Controller
                        name='grade'
                        control={control}
                        render={({ field: { onChange, value = {} } }) => {
                          return (
                          <Select
                            placeholder={'Select Grade'}
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            options={gradeArray}
                            getOptionLabel={(option) => option?.title}
                            getOptionValue={(option) => option?.id}
                            onChange={(e) => {
                              onChange(e)
                            }}
                            value={value || getValues()?.gradeArray}
                            />
                          )
                        }}
                        />
                      <p className='error-msg'>
                        {errors.grade?.message ||
                          errors.grade?.label.message}
                      </p>
                      {/* <Select
                        isSearchable={false}
                        placeholder={'Select Grade'}
                      /> */}
                    </Form.Group>
                  </div>
                  <div className='col-md-6'>
                <Form.Group
                  className={`form-group common-select-style ${
                    errors.test?.id.message || errors.test?.title.message
                      ? 'error-occured'
                      : ''
                  }`}
                  controlId='formfullname'
                >
                  <Form.Label>Test</Form.Label>
                  <Controller
                    name='test'
                    control={control}
                    render={({ field }) => (
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
                    )}
                  />
                  <p className='error-msg'>
                    {errors.test?.id?.message || errors.test?.title?.message}
                  </p>
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group common-select-style ${
                    errors.subtest?.id?.message || errors.subtest?.title?.message
                      ? 'error-occured'
                      : ''
                  }`}
                  controlId='formfullname'
                >
                  <Form.Label>SubTest</Form.Label>
                  <Controller
                    name='subtest'
                    control={control}
                    render={({ field: { onChange, value = {} } }) => (
                      <Select
                        className='react-dropdown'
                        classNamePrefix='dropdown'
                        placeholder={'Select SubTest'}
                        getOptionLabel={(option) => option.title}
                        getOptionValue={(option) => option.id}
                        options={subtestArray}
                        value={value || getValues()?.subtestArray}
                        onChange={(e) => {
                          onChange(e)
                        }}
                      />
                    )}
                  />
                  <p className='error-msg'>
                    {errors?.subtest?.message ||
                      errors?.subtest?.title?.message}
                  </p>
                </Form.Group>
              </div>
                  <div className='col-md-6'>
                    <Form.Group
                      className='form-group'
                      controlId='formtimeinsec'
                    >
                      <Form.Label>Time in Sec</Form.Label>
                      <Form.Control
                        type='number'
                        placeholder='Enter Time in Sec'
                        {...register('time', {
                          required: 'true'
                        })}
                      />
                      {errors.time?.message && (
                          <Form.Text className='error-msg'>
                            {errors.time?.message}
                          </Form.Text>
                      )}
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </div>
          </div>
    </>
  )
}

export default EditTestTimeNorms
