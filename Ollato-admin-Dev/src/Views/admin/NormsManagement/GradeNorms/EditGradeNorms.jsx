import React, { useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  editSpecificGradeNorms,
  getAllGreades,
  getSpecificGradeNorms
} from '../../../../Actions/Admin/Norms/GradeNorms/GradeNorms'
import { getAllNormsFrontend } from '../../../../Actions/Admin/Norms/norms'
import { useSnackbar } from 'react-notistack'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationSchemaGradNorm } from '../../../../Shared/Utills/validationschema'
import { useCategory } from '../../../../Shared/Hooks/UseCategory'

function EditGradeNorms () {
  // Constanst
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')

  // hook
  const { setMainCatid, testArray, subtestArray } = useCategory()

  // useEffect
  useEffect(() => {
    dispatch(getSpecificGradeNorms(Number(id), token))
    dispatch(getAllGreades(token))
    dispatch(getAllNormsFrontend(token))
  }, [])

  // useSelector
  const mainData = useSelector((state) => state.gradeNorms.resData)
  const gradeArray = useSelector((state) => state.gradeNorms.gradeList)
  const normArray = useSelector((state) => state.norms.normsFrontList)
  const isEditedData = useSelector(
    (state) => state.gradeNorms.isGradeNormsEdited
  )
  const editedResMessage = useSelector((state) => state.gradeNorms.resMessage)

  // previousProps
  const previousProps = useRef({ editedResMessage, isEditedData }).current

  // useForm
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset
  } = useForm({
    resolver: yupResolver(validationSchemaGradNorm)
  })

  // reSet
  useEffect(() => {
    if (mainData) {
      setMainCatid(mainData?.tests?.id)
      reset({
        grade: gradeArray?.find((g) => g?.id === mainData?.grade_id),
        test: {
          id: mainData?.tests?.id,
          title: mainData?.tests?.title
        },
        subtest: {
          id: mainData?.test_details?.id,
          title: mainData?.test_details?.title
        },
        norms: normArray?.find((g) => g?.id === mainData?.norm_id),
        minmarks: mainData?.min_marks,
        maxmarks: mainData?.max_marks
      })
    }
  }, [mainData, gradeArray, normArray])

  // onSubmit
  const onSubmit = (data) => {
    const gradeNormsData = {
      id,
      test_id: Number(data.test.id),
      grade_id: Number(data.grade.id),
      norm_id: Number(data.norms.id),
      test_detail_id: Number(data.subtest.id),
      min_marks: Number(data.minmarks),
      max_marks: Number(data.maxmarks)
    }
    if (gradeNormsData) {
      dispatch(editSpecificGradeNorms(gradeNormsData, token))
    }
  }
  // Notification for Add
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/norms/gradenorms')
      } else if (isEditedData === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isEditedData = isEditedData
    }
  }, [isEditedData])
  return (
    <>
      <Header />
      <TitleHeader name='Edit GradeNorms' title='Norms Management' />
      <div className='main-layout'>
        <div className='heading-box'>
          <h5>Edit GradeNorms</h5>
          <div className='btn-box'>
            <div className='btn-box'>
              <button
                onClick={() => navigate(-1)}
                className='theme-btn dark-btn text-none'
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
        </div>
        <div className='form-middle-layout'>
          <Form className='light-bg'>
            <div className='row'>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group common-select-style ${
                    errors.grade?.id.message || errors.grade?.title.message
                      ? 'error-occured'
                      : ''
                  }`}
                  controlId='formgradeselect'
                >
                  <Form.Label>Grade</Form.Label>
                  <Controller
                    name='grade'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isClearable
                        isSearchable={false}
                        placeholder={'Select Grade'}
                        className='react-dropdown'
                        classNamePrefix='dropdown'
                        options={gradeArray}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                      />
                    )}
                  />
                  <p className='error-msg'>
                    {errors.grade?.id.message || errors.grade?.title.message}
                  </p>
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group common-select-style ${
                    errors.norms?.id.message || errors.norms?.title.message
                      ? 'error-occured'
                      : ''
                  }`}
                  controlId='formfullname'
                >
                  <Form.Label>Norms</Form.Label>
                  <Controller
                    name='norms'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isClearable
                        isSearchable={false}
                        placeholder={'Select Grade'}
                        className='react-dropdown'
                        classNamePrefix='dropdown'
                        options={normArray}
                        getOptionLabel={(option) => option?.title}
                        getOptionValue={(option) => option?.id}
                      />
                    )}
                  />
                  <p className='error-msg'>
                    {errors.norms?.id.message || errors.norms?.title.message}
                  </p>
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
                  className={`form-group ${
                    errors.minmarks?.message ? 'error-occured' : ''
                  }`}
                  controlId='formminmarks'
                >
                  <Form.Label>Min Marks</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter Min Marks'
                    {...register('minmarks', {
                      required: 'true'
                    })}
                  />
                  {errors.minmarks?.message && (
                    <Form.Text className='error-msg'>
                      {errors.minmarks?.message}
                    </Form.Text>
                  )}
                </Form.Group>
              </div>
              <div className='col-md-6'>
                <Form.Group
                  className={`form-group ${
                    errors.maxmarks?.message ? 'error-occured' : ''
                  }`}
                  controlId='formmaxmarks'
                >
                  <Form.Label>Max Marks</Form.Label>
                  <Form.Control
                    type='number'
                    placeholder='Enter Min Marks'
                    {...register('maxmarks', {
                      required: 'true'
                    })}
                  />
                  {errors.maxmarks?.message && (
                    <Form.Text className='error-msg'>
                      {errors.maxmarks?.message}
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

export default EditGradeNorms
