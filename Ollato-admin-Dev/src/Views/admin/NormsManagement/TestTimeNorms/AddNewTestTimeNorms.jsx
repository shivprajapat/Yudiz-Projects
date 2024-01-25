import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createTestTimeNorms, getAllGreade } from '../../../../Actions/Admin/Norms/TestTimeNorms/TestTimeNorms'
import { useSnackbar } from 'react-notistack'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationSchemaTestTimeNorm } from '../../../../Shared/Utills/validationschema'
import { useCategory } from '../../../../Shared/Hooks/UseCategory'

function AddNewTestTimeNorms () {
  // Constanst
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // useSelector
  const gradeArray = useSelector((state) => state.testTimeNorms.gradeList)
  const isTestTimeNormsAdded = useSelector(state => state.testTimeNorms.isTestTimeNormsAdded)
  const isTestTimeNormsAddedMessage = useSelector(state => state.testTimeNorms.resMessage)

  // hook
  const { mainCatid, setMainCatid, testArray, subtestArray } = useCategory()

  // previousProps
  const previousProps = useRef({ isTestTimeNormsAdded, isTestTimeNormsAddedMessage }).current

  // useEffect
  useEffect(() => {
    dispatch(getAllGreade(token))
  }, [])

  // useForm
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchemaTestTimeNorm)
  })

  // onSubmit
  const onSubmit = (data) => {
    const testTimeNormsData = {
      testDetailId: Number(data.subtest.id),
      gradeId: Number(data.grade.id),
      timeSec: Number(data.time)
    }
    if (testTimeNormsData) {
      dispatch(createTestTimeNorms(testTimeNormsData, token))
    }
  }

  // Notification for Add
  useEffect(() => {
    if (previousProps?.isTestTimeNormsAdded !== isTestTimeNormsAdded) {
      if (isTestTimeNormsAdded) {
        enqueueSnackbar(`${isTestTimeNormsAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/norms/test-time-norms')
      } else if (isTestTimeNormsAdded === false) {
        enqueueSnackbar(`${isTestTimeNormsAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        }
        )
      }
    }
    return () => {
      previousProps.isTestTimeNormsAdded = isTestTimeNormsAdded
    }
  }, [isTestTimeNormsAdded])
  return (
    <>
          <Header />
          <TitleHeader name='Add New TestTimeNorms' title='Norms Management' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Add New TestTimeNorms</h5>
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
                        render={({ field }) => (
                          <Select
                            {...field}
                            className='react-dropdown'
                            classNamePrefix='dropdown'
                            placeholder={'Select Grade'}
                            getOptionLabel={(option) => option?.title}
                            getOptionValue={(option) => option?.id}
                            options={gradeArray}
                          />
                        )}
                      />
                      <p className='error-msg'>
                      {errors.grade?.title?.message || errors.grade?.id?.message }
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
                      {errors.subtest?.title?.message || errors.subtest?.id?.message }
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

export default AddNewTestTimeNorms
