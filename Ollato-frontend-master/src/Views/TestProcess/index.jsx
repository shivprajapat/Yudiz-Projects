import React, { useEffect, useState } from 'react'
import { Tab, Nav } from 'react-bootstrap'
// import Tabs from 'react-bootstrap/Tabs'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Helmet } from 'react-helmet'

// Images
import verified from '../../assets/images/verified.svg'

/* Components */
// import Header from '../../Components/Header'
import TitleHeader from '../../Components/TitleHeader'

/* images */
import queansline from '../../assets/images/question-answer-line.svg'
import timerline from '../../assets/images/timer-line.svg'

import { getTestProcess } from '../../Actions/testProcess'
import NeedPurchasePackage from './NeedPurchasePackage'

function TestProcess () {
  const [interestId, setInterestId] = useState(1)
  const [testType, setTestType] = useState('')

  // Constant
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const location = useLocation()
  const statusCode = useSelector((state) => state.test.resStatus)

  // useState
  const testProcessArray = useSelector((state) => state.test.testProcessTest)
  const interestTestDataArray = useSelector((state) => state.test.interestTestData)
  const [key, setKey] = useState('')
  // useEffect
  useEffect(() => {
    if (token) {
      dispatch(getTestProcess(token))
    }
  }, [token])
  useEffect(() => {
    if (testProcessArray && location.state === null) {
      setKey(testProcessArray && testProcessArray[0]?.title)
      setTestType(location?.state?.key)
    } else if (location?.state?.key) {
      setKey(location?.state?.key)
      setTestType(location?.state?.key)
    }
  }, [testProcessArray])
  const handleId = (id) => {
    setInterestId(id)
  }
  useEffect(() => {
    if (interestTestDataArray?.student_test?.test_type) {
      setTestType('Interest Test')
    }
  }, [interestTestDataArray?.student_test?.test_type])

  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Test Process - Ollato</title>
      </Helmet>
        <div className="">
          {/* <Header /> */}
          <TitleHeader name="Test Process" />
          <div className=" test-process-tab">
           {
            statusCode === 400
              ? <NeedPurchasePackage/>
              : (
                <>
                  {
                    testProcessArray
                      ? <Tab.Container
                    id="left-tabs-example"
                    defaultActiveKey={key}
                    activeKey={key}
                    onSelect={(k) => {
                      setKey(k)
                      setTestType(k)
                    }}
                  >
                    <Nav variant="pills">
                      {testProcessArray &&
                        testProcessArray.map((data) => {
                          return (
                            <>
                              <Nav.Item>
                                <Nav.Link eventKey={data?.title} onClick={() => handleId(data?.id)} >
                                  {data?.title}
                                </Nav.Link>
                              </Nav.Item>
                            </>
                          )
                        })}
                    </Nav>
                    <Tab.Content>
                      {
                          testType === 'Interest Test' && testProcessArray
                            ? (
                            <>
                              <div className='main-layout whitebox-layout test-desc'>
                                    <div className='common-white-box'>
                                            <div className="left-box">
                                              <h5>{testProcessArray[1]?.title}</h5>
                                              {/* <h4>{testProcessArray[1]?.description}</h4> */}
                                              <h4 style={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: testProcessArray[1]?.description }}></h4>
                                              <div className="inner-box d-flex align-items-center">
                                                <h4> <img src={queansline} alt="queansline" /> 90 Questions</h4>
                                              </div>
                                            </div>
                                            <div className="right-box d-md-block text-end">
                                              {
                                                testProcessArray[1].studentInterestTest && (testProcessArray[1].studentInterestTest !== null)
                                                  ? <div className="status-box catstatus justify-content-end">
                                                <h6>Completed</h6>
                                                <img src={verified} alt="verified" />
                                            </div>
                                                  : (
                                                    <>
                                                      <Link to={'/test-process/test-question/interest-test'} state={{ id: interestId }} className="theme-btn text-none">Start Test Now</Link>
                                                 <p className='note-line mb-0'>All questions are mandatory</p>
                                                    </>
                                                    )
                                              }
                                            </div>
                                          </div>
                                        {/* <div className="test-description">
                                          <div className="instruction">
                                            <h4>Instructions</h4>
                                            <ul>
                                              <li>Each question is timed</li>
                                              <li>Do not use search engines or get help from others</li>
                                              <li>Once you’ve submitted an answer, you cannot go back</li>
                                            </ul>
                                          </div>
                                        </div> */}
                                    </div>
                            </>
                              )
                            : (
                            <>
                              {testProcessArray &&
                                testProcessArray.map((data) => {
                                  return (
                                    <>
                                      {data?.test_details.map((d) => {
                                        return (
                                          <>
                                            <Tab.Pane eventKey={data?.title}>
                                              <ul className="pl-0">
                                                <li className="common-white-box">
                                                  <div className="left-box">
                                                    <h5>{d?.title}</h5>
                                                    <div className="inner-box d-flex align-items-center">
                                                      <h4>
                                                        <img
                                                          src={queansline}
                                                          alt="queansline"
                                                        />
                                                        {d?.no_of_questions} Questions
                                                      </h4>
                                                      {d.test_time === null
                                                        ? (
                                                            ''
                                                          )
                                                        : (
                                                        <h4>
                                                          <img
                                                            src={timerline}
                                                            alt="timerline"
                                                          />
                                                          {d?.test_time?.time_Sec
                                                            ? moment
                                                              .utc(
                                                                d?.test_time?.time_Sec *
                                                                    1000
                                                              )
                                                              .format('mm')
                                                            : '0'}{' '}
                                                          Minutes
                                                        </h4>
                                                          )}
                                                    </div>
                                                  </div>
                                                  <div className="right-box d-md-block text-end">
                                                    {
                                                      d?.studentTests?.length > 0
                                                        ? <div className="status-box catstatus justify-content-end">
                                                            <h6>Completed</h6>
                                                            <img src={verified} alt="verified" />
                                                        </div>
                                                        : <>
                                                        <Link
                                                          to={`/test-process/test-category-detail/${d?.id}`}
                                                          state={{ dataObject: d }}
                                                          className="theme-btn text-none"
                                                        >
                                                          View Details
                                                        </Link>
                                                        <p className="note-line mb-0">
                                                          All questions are mandatory
                                                        </p>
                                                      </>
                                                    }
                                                  </div>
                                                </li>
                                              </ul>
                                            </Tab.Pane>
                                          </>
                                        )
                                      })}
                                    </>
                                  )
                                })}
                            </>
                              )
                      }
                    </Tab.Content>
                     </Tab.Container>
                      : <>
                       <div className='main-layout test-process-tab'>
                        No Data Found
                       </div>
                      </>
                  }
                </>
                )

           }
          </div>
        </div>
    </>
  )
}

export default TestProcess
