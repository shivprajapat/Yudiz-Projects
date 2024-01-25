import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import { useDispatch, useSelector } from 'react-redux'
import {
  editSpecificQuestion,
  // getAllSubCategory,
  getAllSubCategoryFrontend,
  getSpecificQuestion
} from '../../../../Actions/Admin/Test/Question'
import { useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import otherdocPlaceholder from '../../../../assets/images/other-img-placeholder.svg'
import { useSnackbar } from 'react-notistack'
import { useS3Upload } from '../../../../Shared/Hooks/UseS3UPload'

const validationSchema = yup.object().shape({
  question: yup.string().required('Question is required'),
  questionMarks: yup.string().required('Mark is required'),
  questionTime: yup.string().required('Time is required')
})

function EditQuestions () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const mainData = useSelector((state) => state.question.resData)
  const isQuestionDataEdited = useSelector(
    (state) => state.question.isQuestionEdited
  )
  const isQuestionEditedMessage = useSelector(
    (state) => state.question.resMessage
  )
  const previousProps = useRef({
    isQuestionDataEdited,
    isQuestionEditedMessage
  }).current
  const [options, setOptions] = useState(mainData?.options || [])
  const [showComp, setShowComp] = useState({
    isMath: mainData?.is_math,
    isImage: mainData?.is_image,
    isImageValue: mainData?.path
  })
  const [images, setImages] = useState({})
  const { getImage, uploadFile } = useS3Upload()

  useEffect(() => {
    const options = mainData?.options?.map(function (item) {
      return {
        id: item?.id,
        ans_desc: item?.ans_desc,
        math_expression: item?.math_expression || '',
        is_math: item?.is_math || false,
        is_correct_ans: item?.is_correct_ans || false,
        is_image: item?.is_image || false,
        sort_order: item?.sort_order,
        path: item?.is_image ? item?.path : null
      }
    })
    if (options?.length > 0) setOptions(options)
    if (mainData) {
      setShowComp({
        isMath: mainData?.is_math || false,
        isImage: mainData?.is_image || false,
        isImageValue: mainData?.path
      })
      const hasImages =
        mainData?.options?.some((i) => i.path !== null) || false
      if (Object.keys(mainData).length > 0 && (mainData?.path || hasImages)) {
        async function getImageUrl () {
          const data = mainData?.options
            ?.map((opt, i) => {
              if (opt?.path) {
                return { path: opt.path, flag: 'option-' + (i + 1) }
              }
              return null
            })
            .filter(Boolean)
          if (mainData?.path) {
            data.push({
              path: mainData?.path,
              flag: 'questionImage'
            })
          }
          const result = await getImage(data, token)
          setImages(result?.url)
        }
        getImageUrl()
      }
    }
  }, [mainData])

  const handleChange = (e) => {
    setShowComp({ ...showComp, [e.target.name]: e.target.checked })
  }

  const handleQuestionImage = (e) => {
    setShowComp({ ...showComp, isImageValue: e.target.files[0] })
  }

  const handleOptionValueChange = (e, i) => {
    const selectedOption = options.map((value, index) => {
      return i === index
        ? {
            ...value,
            [e.target.name]: e.target.name.startsWith('option-')
              ? e.target.files[0]
              : e.target.value
          }
        : value
    })
    setOptions(selectedOption)
  }

  const handleOptionChange = (e, i) => {
    const selectedOption = options.map((value, index) => {
      return i === index
        ? {
            ...value,
            [e.target.name]: e.target.checked,
            math_expression:
              e.target.name === 'math_expression'
                ? e.target.checked
                  ? value.math_expression
                  : ''
                : value.math_expression
            // [value?.label]:
            //   e.target.name === 'is_image' && e.target.checked
            //     ? value[value.label]
            //     : ''
          }
        : { ...value, is_correct_ans: false }
    })
    setOptions(selectedOption)
  }

  const subCategoryArray = useSelector(
    (state) => state.question.testSubCategoryList
  )
  // Step-1 Get Question By id
  useEffect(() => {
    dispatch(getSpecificQuestion(Number(id), token))
    dispatch(getAllSubCategoryFrontend(token))
  }, [])
  const {
    reset,
    control,
    getValues,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema) })

  useEffect(() => {
    if (mainData && subCategoryArray?.length) {
      const subCategoryV = subCategoryArray?.find(
        (data) => data?.id === mainData?.test_detail_id
      )
      reset({
        subCategory: subCategoryV,
        question: mainData?.question,
        questionMarks: mainData?.marks,
        questionTime: mainData?.time_Sec,
        math_expression: mainData?.math_expression
      })
    }
  }, [mainData, subCategoryArray])

  const addOption = (e, i) => {
    e.preventDefault()
    if (i === 6) return
    setOptions([
      ...options,
      {
        label: 'option-' + i,
        ans_desc: '',
        is_math: false,
        is_correct_ans: false,
        is_image: false,
        math_expression: ''
      }
    ])
  }

  const removeOption = (e, i) => {
    e.preventDefault()
    if (i === 0) return
    setOptions(options.filter((value, index) => i !== index))
  }
  // const removeImage = (e) => {
  //   e.preventDefault()
  //   setShowComp({ ...showComp, isImageValue: null })
  // }
  // Submit Form
  console.log('options', options)

  const onSubmit = async (data) => {
    const optionArray = options?.map((item) => ({
      ...item, // Copy all existing properties
      path: item?.is_image ? item?.path : null // Set the new path dynamically
    }))
    let newoptions
    const payload = {
      id,
      question: data.question,
      marks: data?.questionMarks,
      time_Sec: data?.questionTime,
      is_image: showComp?.isImage,
      path: showComp?.isImageValue,
      is_math: showComp?.isMath,
      math_expression: data?.math_expression,
      sort_order: '1',
      test_detail_id: Number(data?.subCategory?.id),
      options: optionArray,
      isActive: mainData?.is_active
      // updateType: 'status'
    }
    if (options?.length > 0) {
      const imageArray = []
      options.map((data, i) => {
        if (data['option-' + (i + 1)]) {
          const file = data['option-' + (i + 1)]
          imageArray.push({
            // selected: data['option-' + (i + 1)],
            flag: 'question/option-' + (i + 1),
            fileName: file.name.replace(/\.(\w+)$/, ''),
            sContentType: file.type,
            file
          })
          // delete data['option-' + (i + 1)]
        }
        return null
      })
      if (typeof showComp?.isImageValue === 'object') {
        imageArray.push({
          selected: showComp?.isImageValue,
          flag: 'question',
          // flag: 'question/option-' + (i + 1),
          fileName: showComp?.isImageValue?.name.replace(/\.(\w+)$/, ''),
          sContentType: showComp?.isImageValue?.type,
          file: showComp?.isImageValue
        })
      }
      if (imageArray.length > 0) {
        const result = await uploadFile(imageArray)
        if (result?.err) {
          return null
        } else {
          newoptions = options.map((i, index) => {
            const newObj = { ...i }
            if (i['option-' + (index + 1)]) {
              newObj.path =
                result['question/option-' + (index + 1)]?.sPath || null
            } else {
              newObj.path = i.is_image ? i?.path : null
            }
            return newObj
          })
          payload.options = newoptions
          if (typeof showComp?.isImageValue === 'object') {
            payload.path = result?.question?.sPath
          }
        }
      }
    }
    // option
    // const formData = new FormData()
    // formData.append('id', id)
    // formData.append('question', data.question)
    // formData.append('marks', data?.questionMarks)
    // formData.append('time_Sec', data?.questionTime)
    // formData.append('is_image', showComp?.isImage)
    // formData.append('ques_img', showComp?.isImageValue)
    // formData.append('is_math', showComp?.isMath)
    // formData.append('math_expression', data?.math_expression)
    // formData.append('sort_order', '1')
    // formData.append('test_detail_id', Number(data?.subCategory?.id))
    // options.forEach((data, i) => {
    //   const keys = Object.keys(data)
    //   keys.forEach((key) => {
    //     formData.append(`options[${i}][${key}]`, data[key])
    //   })
    // })

    dispatch(editSpecificQuestion(payload, token))
  }
  // Notification
  useEffect(() => {
    if (previousProps?.isQuestionDataEdited !== isQuestionDataEdited) {
      if (isQuestionDataEdited) {
        enqueueSnackbar(`${isQuestionEditedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/test-management/questions')
      } else if (isQuestionDataEdited === false) {
        enqueueSnackbar(`${isQuestionEditedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isQuestionDataEdited = isQuestionDataEdited
    }
  }, [isQuestionDataEdited])
  return (
    <>
      <Header />
      <TitleHeader name="Edit Questions" title="Test Management" />
      <div className="main-layout">
        <div className="heading-box">
          <h5>Edit Question</h5>
          <div className="btn-box">
            <button
              className="theme-btn dark-btn text-none"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              className="theme-btn text-none"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </button>
          </div>
        </div>
        <div className="form-middle-layout">
          <Form className="light-bg">
            <div className="row">
              <div className="col-md-6">
                <Form.Group
                  className="form-group common-select-style"
                  controlId="formfullname"
                >
                  <Form.Label>Sub Category</Form.Label>
                  <Controller
                    name="subCategory"
                    control={control}
                    render={({ field: { onChange, value = {} } }) => {
                      return (
                        <Select
                          placeholder={'Select Country'}
                          className="react-dropdown"
                          classNamePrefix="dropdown"
                          getOptionLabel={(option) => option.title}
                          getOptionValue={(option) => option.id}
                          options={subCategoryArray}
                          value={value || getValues()?.subCategory}
                          onChange={(e) => {
                            onChange(e)
                          }}
                        />
                      )
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-12 quesbox has-image">
                <Form.Group
                  className="form-group mb-0 text-input"
                  controlId="formquestion"
                >
                  <Form.Label>Question</Form.Label>
                  <Form.Control
                    type="text"
                    name="question"
                    placeholder="Enter Question"
                    {...register('question', {
                      required: 'true'
                    })}
                  />
                  {errors?.question?.message && (
                    <Form.Text className="error-msg">
                      {errors?.question?.message}
                    </Form.Text>
                  )}
                </Form.Group>
                {showComp?.isImage && (
                  <Form.Group
                    controlId="formFile"
                    className={`form-group mb-0  document-file-input common-input-file ${
                      showComp?.isImageValue ? 'uploaded-doc' : ''
                    }`}
                  >
                    <Form.Control
                      type="file"
                      className="hidden-file"
                      name="isImageValue"
                      onChange={(e) => handleQuestionImage(e)}
                    />
                    <div className="form-control d-flex align-items-center flex-column justify-content-center text-center">
                      <div className="img-box">
                        <img
                          src={
                            !showComp?.isImageValue
                              ? otherdocPlaceholder
                              : (typeof showComp?.isImageValue === 'string' &&
                                  images?.questionImage) ||
                                (typeof showComp?.isImageValue === 'object' &&
                                  URL.createObjectURL(
                                    showComp?.isImageValue
                                  )) ||
                                otherdocPlaceholder
                          }
                          alt=""
                        />
                        {/* <button
                          onClick={(e) => removeImage(e)}
                          className="close-cross-btn"
                        >
                          <img src={crossWhite} alt="" />
                        </button> */}
                      </div>

                      <p className="m-2 blue-placeholder">
                        Upload JPG, PNG or PDF
                      </p>
                      <p className="m-0 color-black">Front Side</p>
                    </div>
                  </Form.Group>
                )}
                {showComp?.isMath && (
                  <>
                    <Form.Label>Math Expression</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Math Expression"
                      name="math_expression"
                      {...register('math_expression', {
                        required: 'true'
                      })}
                    />
                    {errors.math_expression?.message && (
                      <Form.Text className="error-msg">
                        {errors.math_expression?.message}
                      </Form.Text>
                    )}
                  </>
                )}
              </div>
              <div className="col-md-12 quesbox has-image">
                <Form.Group
                  className="form-group checkbox-box d-flex align-items-start"
                  controlId="formBasicCheckbox"
                >
                  <Form.Check type="checkbox" id="checkbox-1">
                    <Form.Check.Input
                      name="isImage"
                      checked={showComp.isImage}
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Check.Label>Is Image ?</Form.Check.Label>
                  </Form.Check>
                  <Form.Check type="checkbox" id="checkbox-2">
                    <Form.Check.Input
                      name="isMath"
                      checked={showComp.isMath}
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Check.Label>Is Math ?</Form.Check.Label>
                  </Form.Check>
                </Form.Group>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Label>Marks</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Marks"
                    {...register('questionMarks', {
                      required: 'true'
                    })}
                  />
                  {errors.questionMarks?.message && (
                    <Form.Text className="error-msg">
                      {errors.questionMarks?.message}
                    </Form.Text>
                  )}
                </div>
                <div className="col-md-6">
                  <Form.Label>Time in Second</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Time in Second"
                    {...register('questionTime', {
                      required: 'true'
                    })}
                  />
                  {errors.questionTime?.message && (
                    <Form.Text className="error-msg">
                      {errors.questionTime?.message}
                    </Form.Text>
                  )}
                </div>
              </div>
              <div className="col-md-12 mt-3 mb-3">
                {options?.map((data, i) => {
                  return (
                    <>
                      <div className="col-md-12 optionaddbox">
                        <div className="option-item" key={i}>
                          <div className="optionitembox">
                            <Form.Group
                              className="form-group mb-0 text-input"
                              controlId="formquestion"
                            >
                              <Form.Label>Option</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Option"
                                name="ans_desc"
                                value={data?.ans_desc}
                                onChange={(e) => handleOptionValueChange(e, i)}
                              />
                            </Form.Group>
                            <Form.Group
                              className="form-group checkbox-box d-flex align-items-center"
                              controlId="formBasicCheckbox"
                            >
                              <Form.Check
                                type="checkbox"
                                id={'checkbox-12-' + i}
                              >
                                <Form.Check.Input
                                  name="is_image"
                                  onChange={(e) => handleOptionChange(e, i)}
                                  checked={data?.is_image}
                                />

                                <Form.Check.Label>Is Image ?</Form.Check.Label>
                              </Form.Check>
                              <Form.Check
                                type="checkbox"
                                id={'checkbox-23-' + i}
                              >
                                <Form.Check.Input
                                  name="is_math"
                                  type="checkbox"
                                  checked={data?.is_math}
                                  onChange={(e) => handleOptionChange(e, i)}
                                />
                                <Form.Check.Label>Is Math ?</Form.Check.Label>
                              </Form.Check>
                              <Form.Check
                                type="checkbox"
                                id={'checkbox-34-' + i}
                              >
                                <Form.Check.Input
                                  type="checkbox"
                                  name="is_correct_ans"
                                  checked={data?.is_correct_ans}
                                  onChange={(e) => handleOptionChange(e, i)}
                                />
                                <Form.Check.Label>
                                  Is Correct ?
                                </Form.Check.Label>
                              </Form.Check>
                            </Form.Group>
                          </div>

                          {data?.is_image && (
                            <Form.Group
                              controlId="formFile"
                              className="form-group document-file-input common-input-file uploaded-doc"
                            >
                              <Form.Control
                                type="file"
                                className="hidden-file"
                                name={'option-' + (i + 1)}
                                onChange={(e) => handleOptionValueChange(e, i)}
                              />
                              <div className="form-control d-flex align-items-center flex-column justify-content-center text-center">
                                <div className="img-box">
                                  <img
                                    src={
                                      (data?.['option-' + (i + 1)]
                                        ? URL.createObjectURL(
                                          data?.['option-' + (i + 1)]
                                        )
                                        : images &&
                                          images['option-' + (i + 1)]) ||
                                      otherdocPlaceholder
                                    }
                                    alt=""
                                  />
                                  {/* <button className='close-cross-btn'>
                                        <img src={crossWhite} alt='' />
                                      </button> */}
                                </div>
                                {/* {!!data?.is_imageValue && (
                                      <>
                                        <p className='m-2 blue-placeholder'>
                                          Upload JPG, PNG or PDF
                                        </p>
                                        <p className='m-0 color-black'>
                                          Front Side
                                        </p>
                                      </>
                                    )} */}
                              </div>
                            </Form.Group>
                          )}
                          {data?.is_math && (
                            <Form.Group
                              className="form-group mb-0 text-input"
                              controlId="formquestion"
                            >
                              <Form.Label>Math Expression</Form.Label>
                              <Form.Control
                                type="text"
                                name="math_expression"
                                value={data?.math_expression}
                                onChange={(e) => handleOptionValueChange(e, i)}
                              />
                            </Form.Group>
                          )}
                        </div>
                        <div className="add-remove-btn">
                          <div>
                            <button
                              className="theme-btn small-btn"
                              onClick={(e) => addOption(e, options.length + 1)}
                            >
                              +
                            </button>
                          </div>
                          <div>
                            <button
                              className="theme-btn dark-btn"
                              onClick={(e) => removeOption(e, i)}
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
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

export default EditQuestions
