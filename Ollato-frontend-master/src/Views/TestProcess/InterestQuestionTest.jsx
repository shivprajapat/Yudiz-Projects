/* eslint-disable multiline-ternary */
import React, {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react'
// import Slider from 'react-slick'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'
import { Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import ImageViewer from 'react-simple-image-viewer'
import ReactHtmlParser from 'react-html-parser'
import MathJax from 'react-mathjax'
import SpinnerLoader from '../../Components/CommonSpinner'
import {
  getQuestionsByIDAction,
  submitAnswer,
  submitTest
} from '../../Actions/auth'
import { getInterestTestDetails } from '../../Actions/testProcess'
import Timesup from './Timesup'
// import { MathJax, MathJaxContext } from 'better-react-mathjax'
import parse from 'html-react-parser'
import Loader from '../../Components/Loader'

const NeedsPreviousTest = lazy(() => import('./NeedsPreviousTest'))
const Alreadygiventest = lazy(() => import('./Alreadygiventest'))

const TestQuestion = () => {
  // constatnts
  const params = useParams()
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem('token')
  // useState
  const [queArray, setQueArray] = useState([])
  const [selectedQuestion, setselectedQuestion] = useState({})
  const [selectedCount, setselectedCount] = useState(1)
  const [selectedAns, setselectedAns] = useState('')
  const [isError, setisError] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [counter, setCounter] = useState()
  const [selectedOptions, setSelectedOptions] = useState([])
  const [currentImage, setCurrentImage] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [backimage, setBackImage] = useState([])
  const [unSelectQuestion, setUnSelectQuestion] = useState([])

  // useSelector
  const questions = useSelector((state) => state.auth.questionsArray)
  const interestTestDataArray = useSelector(
    (state) => state.test.interestTestData
  )
  const answerAdded = useSelector((state) => state.auth.isAnswerAdded)
  const optionResponse = useSelector((state) => state.auth.resMessage)
  const testCompleted = useSelector((state) => state.auth.isTestCompleted)
  const errorStatus = useSelector((state) => state.test.resStatus)
  const alredyGiven = useSelector((state) => state.auth.alredyGiven)
  const errorMessage = useSelector((state) => state.auth.resMessage)
  const remainingData = useSelector((state) => state.auth.remainingTestIdS)
  const isLoadingFlag = useSelector((state) => state.auth.isLoading)

  // previousProps
  const previousProps = useRef({
    questions,
    answerAdded,
    optionResponse,
    testCompleted,
    interestTestDataArray
  }).current
  useEffect(() => {
    if (previousProps?.interestTestDataArray !== interestTestDataArray) {
      if (interestTestDataArray) {
        setQueArray(interestTestDataArray?.questions)
        setselectedQuestion(interestTestDataArray?.questions[0])
      }
    }
    return () => {
      previousProps.interestTestDataArray = interestTestDataArray
    }
  }, [interestTestDataArray])
  // useEffect(() => {}, [params?.id])

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index)
    setIsViewerOpen(true)
  }, [])
  const closeImageViewer = () => {
    setCurrentImage(0)
    setIsViewerOpen(false)
  }
  useEffect(() => {
    if (params?.id) {
      dispatch(getQuestionsByIDAction(Number(params?.id), token))
    }
  }, [params?.id])

  useEffect(() => {
    if (previousProps?.questions !== questions) {
      if (questions) {
        setCounter(questions?.testDetail?.time_Sec)
        setQueArray(questions)
        setselectedQuestion(questions?.questions[0])
      }
    }
    return () => {
      previousProps.questions = questions
    }
  }, [questions])

  useEffect(() => {
    if (location.pathname === '/test-process/test-question/interest-test') {
      if (location?.state?.id) {
        const data = {
          testId: location?.state?.id
        }
        dispatch(getInterestTestDetails(data, token))
      } else {
        const data = {
          testId: location?.state?.data
        }
        dispatch(getInterestTestDetails(data, token))
      }
      // setQueArray(location?.state?.data?.questions)
      // setselectedQuestion(location?.state?.data?.questions[0])
    }
  }, [location.pathname])

  useEffect(() => {
    if (counter === 0) {
      setTimeUp(true)
      setselectedAns('')
      setselectedCount(1)
      setSelectedOptions([])
      const data = {
        student_test_id: questions.student_test.id,
        is_timeout: true
      }
      dispatch(submitTest(data, token))
    }
    counter > 0 &&
      setTimeout(() => {
        setCounter(counter - 1)
      }, 1000)
  }, [counter])

  useEffect(() => {
    if (selectedQuestion?.path) {
      const array = []
      array.push(selectedQuestion?.path)
      setBackImage(array)
    }
    // setBackImage(selectedQuestion?.path)
  }, [selectedQuestion?.path])
  // Toastify Notification
  useEffect(() => {
    if (previousProps?.testCompleted !== testCompleted) {
      if (testCompleted && !timeUp) {
        enqueueSnackbar('Congratulations! You have completed the test', {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
        navigate('/congratulations', {
          state: {
            id: params?.id,
            title: queArray?.testDetail?.title,
            name: 'Interest'
          }
        })
      } else if (testCompleted === false) {
        enqueueSnackbar(`${optionResponse}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000
        })
      }
    }
    return () => {
      previousProps.testCompleted = testCompleted
    }
  }, [testCompleted])

  const changeQuestion = (index) => {
    setselectedAns('')
    setselectedQuestion(queArray?.[index])
    setselectedCount(index + 1)
    console.log('test22222')

    for (let i = 0; i < selectedOptions.length; i++) {
      for (let j = 0; j < queArray?.[index].options.length; j++) {
        if (selectedOptions[i].value === queArray?.[index].options[j].id) {
          setisError(false)
          setselectedAns(selectedOptions[i].value)
          return
        }
      }
    }
  }

  console.log('selectedAns', selectedAns)

  const nextQuestion = () => {
    if (selectedAns === '') {
      setisError(true)
      return
    }

    const temp = selectedOptions.map((item) =>
      item.label === selectedCount ? { ...item, completed: true } : item
    )
    setSelectedOptions(temp)
    // unselect
    setUnSelectQuestion((current) =>
      current?.filter((id) => {
        return id !== selectedQuestion.id
      })
    )
    setisError(false)
    if (queArray?.length === selectedCount) {
      setselectedCount(selectedCount)
      setisError(false)
    } else {
      setselectedQuestion(queArray?.[selectedCount])
      setselectedCount(selectedCount + 1)
    }
    setselectedAns('')
    setisError(false)
    const data = {
      student_test_id: interestTestDataArray?.student_test?.id,
      question_id: selectedQuestion?.id,
      option_id: Number(selectedAns),
      test_type: interestTestDataArray?.student_test?.test_type
    }
    dispatch(submitAnswer(data, token))
  }

  useEffect(() => {
    setUnSelectQuestion(remainingData)
  }, [remainingData])
  const setOption = (e) => {
    const index = selectedOptions.findIndex(
      (item) => item?.label === selectedCount
    )

    if (index === -1) {
      setSelectedOptions([
        ...selectedOptions,
        { label: selectedCount, value: e }
      ])
    } else {
      const setValue = selectedOptions?.map((item) =>
        item.label === selectedCount ? { ...item, value: e } : item
      )
      setSelectedOptions(setValue)
    }

    setselectedAns(e)
    setisError(false)
  }

  const handleSubmitForm = (e) => {
    const data = {
      student_test_id: interestTestDataArray?.student_test?.id,
      is_timeout: false,
      test_type: interestTestDataArray?.student_test?.test_type
    }
    dispatch(submitTest(data, token))
    e.preventdefault()
  }

  // Notification
  useEffect(() => {
    if (previousProps?.answerAdded !== answerAdded) {
      if (answerAdded === false) {
        enqueueSnackbar(`${errorMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true
        })
      }
    }
    return () => {
      previousProps.answerAdded = answerAdded
    }
  }, [answerAdded])

  console.log('unSelectQuestion', unSelectQuestion)

  return (
    // eslint-disable-next-line multiline-ternary
    timeUp ? (
      <Timesup
        id={params?.id}
        title={queArray?.testDetail?.title}
        setTimeUp={setTimeUp}
      />
    ) : (
      <>
        <div className=''>
          <div className='title-header no-breadcrumbs'>
            <ul className='breadcrumbs'>
              <li className='breadcrumbs-item'>
                <h3>{queArray?.testDetail?.title} Question Test</h3>
              </li>
            </ul>
            {/* {errorStatus && (
                <div className='test-timer lesstime'>
                  <img src={timerline} alt='testtimer' />
                  <h4 className='lesstime'>
                    <span>
                      {moment.utc(counter * 1000).format('mm:ss')} Min{' '}
                    </span>
                    Left
                  </h4>
                </div>
              )} */}
          </div>

          {isLoadingFlag === true ? (
            <>
              <SpinnerLoader />
            </>
          ) : (
            <>
              {alredyGiven ||
              errorStatus === null ||
              errorStatus === 500 ||
              errorStatus === true ||
              errorStatus === 406 ? (
                <Suspense fallback={<Loader />}>
                  <div className='question-pagination-box'>
                    <div className='row w-100 align-items-center'>
                      <div className='col-md-4'>
                        <h5 className='ques-title mb-0'>
                          Question {selectedCount} out {queArray?.length}{' '}
                        </h5>
                      </div>
                      <div className='col-md-8'>
                        <div className='submit-btn-box mt-0'>
                          <button
                            className='theme-btn'
                            type='submit'
                            onClick={(e) => nextQuestion()}
                          >
                            Submit and Next
                          </button>
                          <button
                            className='theme-btn dark-btn'
                            type='submit'
                            onClick={handleSubmitForm}
                          >
                            Finish Test
                          </button>
                        </div>{' '}
                      </div>
                    </div>
                  </div>
                  <div className='main-layout whitebox-layout que-ans-box'>
                    <div className='row'>
                      <div className='col-lg-7 order-2 order-lg-0'>
                        <div className='question-box'>
                          <h4 className='question'>
                            {ReactHtmlParser(
                              selectedQuestion?.question?.replace('[e0]', ' ')
                            )}
                          </h4>
                          {selectedQuestion?.is_image === true && (
                            <div>
                              <img
                                src={selectedQuestion?.path}
                                onClick={() => openImageViewer(0)}
                              />
                            </div>
                          )}
                          {isViewerOpen && (
                            // <Box mt={5}>
                            <ImageViewer
                              src={backimage}
                              currentIndex={currentImage}
                              onClose={closeImageViewer}
                              disableScroll={false}
                              backgroundStyle={{
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                zIndex: 99999
                              }}
                              closeOnClickOutside={true}
                              style={{
                                width: '10% !important',
                                height: '10% !important'
                              }}
                            />
                          )}
                          {selectedQuestion?.is_math === true && (
                            <div>
                              <h4 className='font-black'>
                                <MathJax.Provider>
                                  <div>
                                    <MathJax.Node
                                      inline
                                      formula={
                                        selectedQuestion?.math_expression
                                      }
                                    />
                                  </div>
                                </MathJax.Provider>
                              </h4>
                            </div>
                          )}
                          <div className='option-box'>
                            {selectedQuestion?.options &&
                              selectedQuestion?.options.length >= 0 &&
                              selectedQuestion?.options.map((opt, index) => {
                                return (
                                  <div
                                    className='ques-box'
                                    key={index + selectedCount}
                                    onChange={() => setOption(opt.id)}
                                  >
                                    <Form.Check
                                      className={`${
                                        selectedOptions?.find(
                                          (item) => item.label === selectedCount
                                        )?.value === opt.id
                                          ? 'checked'
                                          : ''
                                      }`}
                                    >
                                      <Form.Check.Input
                                        type='radio'
                                        id={index + selectedCount}
                                        name={'option-' + selectedCount}
                                        onChange={() => {}}
                                        value={opt.id}
                                        checked={
                                          selectedOptions?.find(
                                            (item) =>
                                              item.label === selectedCount
                                          )?.value === opt.id
                                        }
                                      />
                                      <Form.Check.Label
                                        htmlFor={index + selectedCount}
                                      >
                                        <span className='opt-cnt'>
                                          {index + 1}
                                        </span>{' '}
                                        {parse(
                                          String(
                                            opt?.ans_desc.replace('[e0]', ' ')
                                          )
                                        )}
                                        <div className='math-exp'>
                                          {opt?.is_math === true && (
                                            <MathJax.Provider>
                                              <div>
                                                <MathJax.Node
                                                  inline
                                                  formula={opt?.math_expression}
                                                />
                                              </div>
                                            </MathJax.Provider>
                                            // <MathJaxContext config={config}>
                                            //   <MathJax>
                                            //     {'$' + opt?.math_expression + '$'}
                                            //   </MathJax>
                                            // </MathJaxContext>
                                          )}
                                        </div>
                                      </Form.Check.Label>
                                    </Form.Check>
                                    {/*  <label className='form-check-label' htmlFor={index + selectedCount}>
                                    <span className="opt-cnt">A</span> {parse(String(opt?.ans_desc))}
                                  </label> */}

                                    {opt?.is_image === true && (
                                      <img src={opt?.path} />
                                    )}
                                    <br />
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      </div>
                      <div className='col-lg-5 order-1 order-lg-0'>
                        <div className='slider-box'>
                          <div className='slider-section'>
                            <h5 className='ques-title'>No of Questions</h5>
                            <div className='d-flex flex-wrap justify-content-start queselectionbox'>
                              {queArray &&
                                queArray.map((question, index) => {
                                  return (
                                    <div
                                      className='quesitem '
                                      onClick={(e) => changeQuestion(index)}
                                      key={index}
                                    >
                                      <Link
                                        to=''
                                        className={
                                          unSelectQuestion === null ||
                                          unSelectQuestion === undefined
                                            ? selectedCount === index + 1 ||
                                              selectedOptions?.find(
                                                (i) => i.label === index + 1
                                              )?.completed
                                              ? selectedQuestion?.id ===
                                                question?.id
                                                ? 'quesno active'
                                                : 'quesno active'
                                              : 'quesno'
                                            : unSelectQuestion?.find(
                                              (i) => i === question?.id
                                            )
                                              ? selectedQuestion?.id ===
                                              question?.id
                                                ? 'quesno active'
                                                : 'quesno'
                                              : 'quesno active'
                                        }
                                      >
                                        {index + 1}
                                      </Link>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isError ? (
                      <div className='error_occured'>
                        <p>Please select atleast 1 option</p>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </Suspense>
                  ) : (
                <Suspense fallback={<Loader />}>
                  {errorStatus === 422 ? (
                    <Alreadygiventest />
                  ) : (
                    <NeedsPreviousTest errorMessageProps={errorMessage} />
                  )}
                </Suspense>
                  )}
            </>
          )}
        </div>
      </>
    )
  )
}

export default TestQuestion
