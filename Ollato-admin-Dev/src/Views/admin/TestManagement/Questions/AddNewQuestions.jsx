import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import Header from '../../../../Components/Header'
import TitleHeader from '../../../../Components/TitleHeader'
import otherdocPlaceholder from '../../../../assets/images/other-img-placeholder.svg'
import crossWhite from '../../../../assets/images/crosswhite.svg'
import { useDispatch, useSelector } from 'react-redux'
import {
  createQuestion,
  getAllSubCategoryFrontend
} from '../../../../Actions/Admin/Test/Question'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'
import { useS3Upload } from '../../../../Shared/Hooks/UseS3UPload'

const validationSchema = yup.object().shape({
  subCategory: yup
    .object()
    .shape({
      label: yup.string().required('Sub Category is required'),
      value: yup.string().required('Sub Category is required')
    })
    .nullable()
    .required('Sub Category is required'),
  question: yup.string().required('Question is required'),
  questionMarks: yup.string().required('Mark is required'),
  questionTime: yup.string().required('Time is required')
})

function AddNewQuestions () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  const isQuestionDataAdded = useSelector(
    (state) => state.question.isQuestionAdded
  )
  const isQuestionAddedMessage = useSelector(
    (state) => state.question.resMessage
  )
  const subCategoryArray = useSelector(
    (state) => state.question.testSubCategoryList
  )
  const [options, setOptions] = useState([
    {
      label: 'option-1',
      ans_desc: '',
      math_expression: '',
      is_math: false,
      is_correct_ans: false,
      is_image: false
    }
  ])
  const [showComp, setShowComp] = useState({
    isMath: false,
    isImage: false,
    isImageValue: ''
  })
  const [subCategory, setSubCategory] = useState([])
  const previousProps = useRef(
    subCategoryArray,
    isQuestionDataAdded,
    isQuestionAddedMessage
  ).current

  useEffect(() => {
    if (previousProps?.subCategoryArray !== subCategoryArray) {
      const array = []
      if (subCategoryArray) {
        // eslint-disable-next-line array-callback-return
        subCategoryArray.map((data) => {
          array.push({
            value: data.id,
            label: data.title
          })
        })
        setSubCategory(array)
      }
    }
    return () => {
      previousProps.subCategoryArray = subCategoryArray
    }
  }, [subCategoryArray])

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

  useEffect(() => {
    dispatch(getAllSubCategoryFrontend(token))
  }, [])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const { uploadFile } = useS3Upload()

  console.log('options', options)

  const onSubmit = async (data) => {
    let newoptions = []
    const payload = {
      question: data.question,
      marks: data?.questionMarks,
      time_Sec: data?.questionTime,
      is_image: showComp?.isImage,
      ques_img: showComp?.isImageValue,
      is_math: showComp?.isMath,
      math_expression: data?.math_expression,
      sort_order: '1',
      test_detail_id: Number(data?.subCategory?.value),
      options
    }
    const imagePayload = []
    const imageArray = []
    options.forEach((data, i) => {
      imageArray.push({
        selected: data['option-' + (i + 1)],
        flag: 'question/option-' + (i + 1)
      })
    })
    if (showComp?.isImage) {
      imageArray.push({
        selected: showComp?.isImageValue,
        flag: 'question'
      })
    }
    for (const selection of imageArray) {
      const { selected, flag } = selection
      if (typeof selected === 'object') {
        imagePayload.push({
          fileName: selected.name.replace(/\.(\w+)$/, ''),
          sContentType: selected.type,
          flag,
          file: selected
        })
      }
    }
    if (imagePayload.length > 0) {
      const result = await uploadFile(imagePayload)
      if (result?.err) {
        return null
      } else {
        newoptions = options.map((i, index) => {
          const newObj = { ...i }
          newObj.path = result['question/option-' + (index + 1)]?.sPath || null
          return newObj
        })
        payload.options = newoptions
        if (showComp?.isImage) payload.path = result?.question?.sPath
      }
    }

    dispatch(createQuestion(payload, token))
  }

  const handleChange = (e) => {
    setShowComp({ ...showComp, [e.target.name]: e.target.checked })
  }

  const handleQuestionImage = (e) => {
    setShowComp({ ...showComp, isImageValue: e.target.files[0] })
  }
  const removeImage = (e) => {
    e.preventDefault()
    setShowComp({ ...showComp, isImageValue: '' })
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
                : value.math_expression,
            [value.label]:
              e.target.name === 'is_image' && e.target.checked
                ? value[value.label]
                : ''
          }
        : { ...value, is_correct_ans: false }
    })
    setOptions(selectedOption)
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
  // Notification
  useEffect(() => {
    if (previousProps?.isQuestionDataAdded !== isQuestionDataAdded) {
      if (isQuestionDataAdded) {
        enqueueSnackbar(`${isQuestionAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/test-management/questions')
      } else if (isQuestionDataAdded === false) {
        enqueueSnackbar(`${isQuestionAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isQuestionDataAdded = isQuestionDataAdded
    }
  }, [isQuestionDataAdded])
  return (
    <>
      <Header />
      <TitleHeader name="Add New Questions" title="Test Management" />
      <div className="main-layout">
        <div className="heading-box">
          <h5>Add Question</h5>
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
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={subCategory}
                        placeholder={'Select sub Category'}
                      />
                    )}
                  />
                  <p className="error-msg">
                    {errors.subCategory?.message ||
                      errors.subCategory?.label.message}
                  </p>
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
                    placeholder="Enter Question"
                    {...register('question', {
                      required: 'true'
                    })}
                  />
                  {errors.question?.message && (
                    <Form.Text className="error-msg">
                      {errors.question?.message}
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
                            (showComp?.isImageValue &&
                              URL.createObjectURL(showComp?.isImageValue)) ||
                            otherdocPlaceholder
                          }
                          alt=""
                        />
                        <button
                          onClick={(e) => removeImage(e)}
                          className="close-cross-btn"
                        >
                          <img src={crossWhite} alt="" />
                        </button>
                      </div>
                      {!showComp?.isImageValue && (
                        <>
                          <p className="m-2 blue-placeholder">Upload JPG</p>
                          <p className="m-0 color-black">Front Side</p>
                        </>
                      )}
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
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Check.Label>Is Image ?</Form.Check.Label>
                  </Form.Check>
                  <Form.Check type="checkbox" id="checkbox-2">
                    <Form.Check.Input
                      name="isMath"
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
                              className="form-group text-input"
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
                              // className={`form-group mb-0  document-file-input common-input-file ${
                              //   data?.label === `option-${i + 1}` ? 'uploaded-doc' : ''
                              // }`}
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
                                      (data?.['option-' + (i + 1)] &&
                                        URL.createObjectURL(
                                          data?.['option-' + (i + 1)]
                                        )) ||
                                      otherdocPlaceholder
                                    }
                                    alt=""
                                  />
                                  {/* <button className='close-cross-btn'>
                                        <img src={crossWhite} alt='' />
                                      </button> */}
                                </div>
                                {!!data?.is_image && (
                                  <>
                                    <p className="m-2 blue-placeholder">
                                      Upload JPG, PNG or PDF
                                    </p>
                                    <p className="m-0 color-black">
                                      Front Side
                                    </p>
                                  </>
                                )}
                              </div>
                            </Form.Group>
                          )}
                          {data?.is_math && (
                            <Form.Group
                              className="form-group text-input"
                              controlId="formquestion"
                            >
                              <Form.Label>Math Expression</Form.Label>
                              <Form.Control
                                type="text"
                                name="math_expression"
                                placeholder="Enter Math Expression"
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
                              disabled={options?.length === 5 && true}
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

export default AddNewQuestions
