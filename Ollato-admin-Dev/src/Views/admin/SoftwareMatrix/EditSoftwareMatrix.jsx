import React, { useEffect, useRef, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../Components/Header'
import TitleHeader from '../../../Components/TitleHeader'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteSoftwareMetricsDetail,
  editSpecificSoftwareMetrics,
  getSpecificsoftwareMetricsData
} from '../../../Actions/Admin/softwareMetrix'
import { useNavigate, useParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'
import { Controller, useForm } from 'react-hook-form'
import { getAllSubCategory } from '../../../Actions/Admin/Test/Question'
import { profileDetail } from '../../../Actions/Admin/careerProfile'
import { validationSchemaSoftMat } from '../../../Shared/Utills/validationschema'

function EditSoftwareMatrix () {
  // Constant
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const defaultValues = {
    mathDropped: false,
    scienceDropped: false
  }

  // useState
  const [detail, setDetail] = useState({})

  // useSelector
  const mainData = useSelector((state) => state.softwareMetrics.resData)
  const careerProfile = useSelector(
    (state) => state.careerProfile.careerProfileData
  )
  const subTest = useSelector((state) => state.question.testSubCategoryList)
  const isSoftwareMatricsEdited = useSelector(
    (state) => state.softwareMetrics.isSoftwareMetricsEdited
  )
  const editedResMessage = useSelector(
    (state) => state.softwareMetrics?.resMessage
  )

  // previousProps
  const previousProps = useRef({
    isSoftwareMatricsEdited,
    editedResMessage
  }).current

  // useState
  const [matrixArray, setMatrixArray] = useState(
    mainData?.softwareAllMatrix || []
  )

  // useEffect
  useEffect(() => {
    dispatch(getSpecificsoftwareMetricsData(Number(id), token))
    dispatch(getAllSubCategory(token))
    dispatch(profileDetail(token))
  }, [])

  useEffect(() => {
    mainData && setMatrixArray(mainData?.softwareAllMatrix)
    if (mainData?.softwareAllMatrix?.length === 0) {
      setMatrixArray([
        {
          norm_values: '',
          test_detail_id: ''
        }
      ])
    }
  }, [mainData])

  // useForm
  const {
    control,
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(validationSchemaSoftMat),
    defaultValues
  })

  // reSet Data
  useEffect(() => {
    if (mainData && careerProfile?.length) {
      const profileDetailsV = careerProfile?.find(
        (data) => data?.id === mainData?.career_profile_detail_id
      )
      reset({
        tAbOne: mainData?.test_abb_1,
        tAbTwo: mainData?.test_abb_2,
        tAbThree: mainData?.test_abb_3,
        profileDetail: profileDetailsV,
        mathDropped: mainData?.math_dropped,
        scienceDropped: mainData?.science_dropped,
        sortOrder: mainData?.sort_order
      })
    }
  }, [mainData, careerProfile])

  // increase
  const addOption = (e, i) => {
    e.preventDefault()
    setMatrixArray([
      ...matrixArray,
      {
        norm_values: '',
        test_detail_id: '',
        subTest: ''
      }
    ])
  }

  // decrease
  const removeOption = (e, count, idForDelete) => {
    e.preventDefault()
    if (count === 0) return
    setMatrixArray(matrixArray.filter((value, index) => count !== index))
    dispatch(deleteSoftwareMetricsDetail({ id: [idForDelete] }))
  }

  // handle Value change in matrixArray
  const handleChangeMatrixArray = (e, count) => {
    const selectedArray = matrixArray?.map((value, index) => {
      const d = e.target.value.toUpperCase()
      return count === index
        ? {
            ...value,
            norm_values: d
          }
        : value
    })
    setMatrixArray(selectedArray)
  }

  const handleChangeSubTest = (e, count, name) => {
    setDetail((p) => ({ ...p, [name]: e }))
    const selectedArray = matrixArray?.map((value, index) => {
      return count === index
        ? {
            ...value,
            test_detail_id: e.id
          }
        : value
    })
    setMatrixArray(selectedArray)
  }

  // onSubmit
  const onSubmit = (data) => {
    const softwareMatrixData = {
      id,
      testAbb1: data?.tAbOne,
      testAbb2: data?.tAbTwo,
      testAbb3: data?.tAbThree,
      mathDropped: data?.mathDropped,
      scienceDropped: data?.scienceDropped,
      careerProfileId: data?.profileDetail?.id,
      sortOrder: data?.sortOrder,
      matrixArray
    }
    if (softwareMatrixData) {
      dispatch(editSpecificSoftwareMetrics(softwareMatrixData, token))
    }
  }

  // Notification for Edit
  useEffect(() => {
    if (previousProps?.isSoftwareMatricsEdited !== isSoftwareMatricsEdited) {
      if (isSoftwareMatricsEdited) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/software-matrix')
      } else if (isSoftwareMatricsEdited === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isSoftwareMatricsEdited = isSoftwareMatricsEdited
    }
  }, [isSoftwareMatricsEdited])
  return (
    <>
          <Header />
          <TitleHeader name='Edit Software Matrix' title='Software Matrix' />
          <div className='main-layout'>
            <div className='heading-box'>
              <h5>Edit SoftwareMatrix</h5>
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
            {mainData?.id
              ? (
              <div className='form-middle-layout'>
                <Form className='light-bg'>
                  <div className='row'>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formtestabbrevation1'
                      >
                        <Form.Label>Test Abbrevation 1</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Test Abbrevation 1'
                          {...register('tAbOne', {
                            required: 'true'
                          })}
                        />
                        {errors.tAbOne?.message && (
                          <Form.Text className='error-msg'>
                            {errors.tAbOne?.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formtestabbrevation2'
                      >
                        <Form.Label>Test Abbrevation 2</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Test Abbrevation 2'
                          {...register('tAbTwo', {
                            required: 'true'
                          })}
                        />
                        {errors.tAbTwo?.message && (
                          <Form.Text className='error-msg'>
                            {errors.tAbTwo?.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formtestabbrevation3'
                      >
                        <Form.Label>Test Abbrevation 3</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Test Abbrevation 3'
                          {...register('tAbThree', {
                            required: 'true'
                          })}
                        />
                        {errors.tAbThree?.message && (
                          <Form.Text className='error-msg'>
                            {errors.tAbThree?.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group common-select-style'
                        controlId='formfullname'
                      >
                        <Form.Label>Profile Details</Form.Label>
                        <Controller
                          name='profileDetail'
                          control={control}
                          render={({ field: { onChange, value = {} } }) => {
                            return (
                              <Select
                                isSearchable={false}
                                placeholder={'Select Profile Details'}
                                options={careerProfile}
                                getOptionLabel={(option) =>
                                  option?.profile_type_det
                                }
                                getOptionValue={(option) => option?.id}
                                value={value || getValues()?.subCategory}
                                onChange={(e) => {
                                  onChange(e)
                                }}
                              />
                            )
                          }}
                        />
                      </Form.Group>
                      <p className='error-msg'>
                        {errors.profileDetail?.id?.message }
                      </p>
                    </div>
                    <div className='col-md-6 align-self-center'>
                      <div className='row align-items-center'>
                        <div className='col-xxl-6'>
                          <Form.Group
                            className='form-group switchbox mb-2 d-flex align-items-center'
                            controlId='formfullname'
                          >
                            <Form.Label className='mb-0'>
                              Math Dropped
                            </Form.Label>
                            <label className='switch'>
                              <Controller
                                name='mathDropped'
                                control={control}
                                render={({ field }) => (
                                  <input
                                    type='checkbox'
                                    name='mathDropped'
                                    onChange={(e) =>
                                      field.onChange(e.target.checked)
                                    }
                                    checked={field.value}
                                  />
                                )}
                              />
                              <span className='slider blue' id='round'></span>
                            </label>
                          </Form.Group>
                        </div>
                        <div className='col-xxl-6'>
                          <Form.Group
                            className='form-group switchbox mb-2 d-flex align-items-center'
                            controlId='formfullname'
                          >
                            <Form.Label className='mb-0'>
                              Science Dropped
                            </Form.Label>
                            <label className='switch'>
                              <Controller
                                name='scienceDropped'
                                control={control}
                                render={({ field }) => (
                                  <input
                                    type='checkbox'
                                    onChange={(e) =>
                                      field.onChange(e.target.checked)
                                    }
                                    checked={field.value}
                                  />
                                )}
                              />
                              <span className='slider blue' id='round'></span>
                            </label>
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group
                        className='form-group'
                        controlId='formsortorder'
                      >
                        <Form.Label>Sort Order</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter Sort Order'
                          {...register('sortOrder', {
                            required: 'true'
                          })}
                        />
                        {errors.sortOrder?.message && (
                          <Form.Text className='error-msg'>
                            {errors.sortOrder?.message}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </div>
                    <h4 className='black-font mb-4'>Software Details</h4>
                    {matrixArray?.map((i, count) => {
                      return (
                        <>
                          <div className='grade-profile d-flex align-items-start'>
                            <div className='row addmoreaddbox d-flex align-items-start'>
                              <div className=' col-md-12 '>
                                <div className='option-item w-100'>
                                  <div className='optionitembox'>
                                    <Form.Group
                                      className='form-group text-input'
                                      controlId='formoption'
                                    >
                                      <Form.Label>Norms Grade</Form.Label>
                                      <Form.Control
                                        type='text'
                                        placeholder='Enter Option'
                                        onChange={(e) =>
                                          handleChangeMatrixArray(e, count)
                                        }
                                        value={i.norm_values}
                                      />
                                    </Form.Group>
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-12'>
                                <div className='option-item w-100'>
                                  <div className='optionitembox'>
                                    <Form.Group
                                      className='form-group common-select-style'
                                      controlId='formfullname'
                                    >
                                      <Form.Label>Sub Test</Form.Label>
                                      <Controller
                                        name='subTest'
                                        control={control}
                                        render={({
                                          field: { onChange, value = {} }
                                        }) => {
                                          return (
                                            <Select
                                              isSearchable={true}
                                              options={subTest}
                                              getOptionLabel={(option) =>
                                                option?.title
                                              }
                                              getOptionValue={(option) =>
                                                option?.id
                                              }
                                              placeholder={'Select SubTest'}
                                              value={
                                                detail['subTest' + count] ||
                                                subTest?.find(
                                                  (data) =>
                                                    data?.id ===
                                                    mainData?.softwareAllMatrix[
                                                      count
                                                    ]?.test_detail_id
                                                )
                                              }
                                              onChange={(e) =>
                                                handleChangeSubTest(
                                                  e,
                                                  count,
                                                  'subTest' + count
                                                )
                                              }
                                            />
                                          )
                                        }}
                                      />
                                    </Form.Group>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='add-remove-btn'>
                              <div>
                                <button
                                  className='theme-btn small-btn'
                                  onClick={(e) =>
                                    addOption(e, matrixArray?.length + 1)
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <div>
                                <button
                                  className='theme-btn dark-btn'
                                  onClick={(e) => removeOption(e, count, i?.id)}
                                >
                                  -
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })}
                  </div>
                </Form>
              </div>
                )
              : (
              <Spinner animation='border' />
                )}
          </div>
    </>
  )
}

export default EditSoftwareMatrix
