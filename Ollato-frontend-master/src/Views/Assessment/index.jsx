import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'

/* Components */
// import MobileHeader from '../../Components/MobileHeader'
import TitleHeader from '../../Components/TitleHeader'
import GiveTest from './giveTest'
// import lightlogomark from '../../assets/images/lightlogomark.svg'
import assessment from '../../assets/images/assessmenticon.svg'
import verified from '../../assets/images/verified.svg'
import { useDispatch, useSelector } from 'react-redux'
import pdficon from '../../assets/images/pdf-icon.svg'
import { BsFillBarChartLineFill } from 'react-icons/bs'
import { Accordion, Nav, ProgressBar, Tab } from 'react-bootstrap'
import {
  getCompletedTestData,
  downloadReport
} from '../../Actions/assessment'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-notistack'

function Assessment () {
  // Constant
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  // useState
  const [testarray, setTestArray] = useState([])
  const [key, setKey] = useState('')
  const [, setCustomId] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  // useSelector
  const completedTestDataArray = useSelector((state) => state.assessment.completedTestData)
  const totalTestData = useSelector((state) => state.assessment.totalTest)
  // const reportDownloadedFlag = useSelector((state) => state.assessment.isReportDownloaded)
  const downloadReportLinkData = useSelector((state) => state.assessment.downloadReportLink)
  const resMessage = useSelector((state) => state.assessment.resMessage)
  const resStatus = useSelector((state) => state.assessment.resStatus)
  const [compTest, setCompTest] = useState(completedTestDataArray?.studentTestData[0]?.testData?.completed_test)
  const previousProps = useRef({ downloadReportLinkData, resMessage, resStatus }).current

  useEffect(() => {
    if (completedTestDataArray) {
      setCompTest(
        completedTestDataArray?.studentTestData[0]?.testData?.completed_test
      )
      setKey(completedTestDataArray?.studentTestData[0]?.testData?.id)
    }
  }, [completedTestDataArray])
  useEffect(() => {
    if (key) {
      const testDetails = completedTestDataArray?.studentTestData?.filter(
        (data) => data?.testData?.id === Number(key)
      )
      setTestArray(testDetails)
    }
  }, [key, completedTestDataArray])
  useEffect(() => {
    if (token) {
      dispatch(getCompletedTestData(token))
    }
  }, [])
  const handleCompTest = (data, id) => {
    setCompTest(data)
  }
  const handleGiveTest = (id, data) => {
    if (data?.test_id === 2) {
      navigate('/test-process/test-question/interest-test', { state: { id: data?.test_id } })
    } else {
      navigate(`/test-process/test-category-detail/${id}`)
    }
  }

  const handleDownlaodReport = () => {
    const filteredData = completedTestDataArray?.studentTestData.filter((data) => {
      return data?.testData?.id === Number(key)
    })
    if (filteredData) {
      dispatch(downloadReport(filteredData && filteredData[0]?.testData?.custom_id, token))
      setCustomId(filteredData[0]?.testData?.custom_id)
    }
  }

  useEffect(() => {
    if (previousProps?.downloadReportLinkData !== downloadReportLinkData) {
      if (downloadReportLinkData) {
        window.open(downloadReportLinkData, '_blank')
      }
    }
    return () => {
      previousProps.downloadReportLinkData = downloadReportLinkData
    }
  }, [downloadReportLinkData])
  const handleGraph = () => {
    const filteredData = completedTestDataArray?.studentTestData.filter((data) => {
      return data?.testData?.id === Number(key)
    })
    if (filteredData) {
      navigate('/chart', { state: { id: filteredData[0]?.testData?.custom_id } })
    }
  }

  // Toastify Notification
  useEffect(() => {
    if (previousProps?.resStatus !== resStatus) {
      if (resStatus && resMessage) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'success',
          autoHide: true,
          hide: 3000
        })
      } else if (resStatus === false && resMessage) {
        enqueueSnackbar(`${resMessage}`, {
          variant: 'error',
          autoHide: true,
          hide: 3000,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.resStatus = resStatus
    }
  }, [resStatus])
  return (
    <>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Assessment - Ollato</title>
        </Helmet>
        <div className=''>

          {/* <Header /> */}

          <TitleHeader name='Assessment' />
          <div className=' test-process-tab'>

                    {
                      completedTestDataArray?.studentTestData.length > 0
                        ? <Tab.Container
                      id='left-tabs-example'
                      defaultActiveKey={key}
                      activeKey={key}
                      onSelect={(k) => {
                        setKey(k)
                      }}
                    >
                      <Nav variant='pills'>
                        {completedTestDataArray && completedTestDataArray?.studentTestData.map((data, index) => {
                          return (
                              <>
                                <Nav.Item>
                                  <Nav.Link
                                    eventKey={data?.testData?.id}
                                    onClick={() =>
                                      handleCompTest(
                                        data?.testData?.completed_test,
                                        data?.testData.id
                                      )
                                    }
                                  >
                                    Test {index + 1}
                                  </Nav.Link>
                                </Nav.Item>
                              </>
                          )
                        })
                         }
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey={key}>
                          <div className='profile-item h-100 w-100 assessment-box d-flex flex-wrap  align-items-center position-relative overflow-hidden'>
                            <img
                              className='assessmenticon'
                              src={assessment}
                              alt='assessment'
                            />
                            <div className='student-code'>
                              {/* <img src={studenticon} alt="studenticon" /> */}
                              <p> Ollato Student Code </p>
                              <h2>
                                {Math.round((parseInt(compTest) * 100) / totalTestData)}
                                %
                              </h2>
                            </div>
                            {
                                  (Math.round((parseInt(compTest) * 100) / totalTestData) === 100)
                                    ? (<>
                                          <div className="button-box assessment-button">
                                            <button className='outline-btn withicon' onClick={() => handleGraph()} ><BsFillBarChartLineFill /> <span style={{ marginLeft: 10 }}>Detailed Report</span></button>
                                            <button className='outline-btn withicon' type='button' onClick={() => handleDownlaodReport()} >
                                            <img src={pdficon} alt="" /> <span>Download</span></button>
                                          </div>
                                    </>)
                                    : ''
                                }
                            {/* <img
                              src={lightlogomark}
                              className='lightlogomark'
                              alt='ollato-img'
                            /> */}
                          </div>
                          <div className='assessment-item-box '>
                            {testarray &&
                              testarray?.map((data) => {
                                return (
                                  <>
                                    {data.tests.map((test) => {
                                      if (test.title === 'Aptitude Test') {
                                        const filteredData = test?.test_details?.filter((data) => {
                                          return data?.studentTests?.length > 0
                                        })
                                        localStorage.setItem('aptitudeCount', filteredData?.length)
                                        // setArrayCounter(filteredData?.length)
                                      } else if (test.title === 'Interest Test') {
                                        const filteredData = test?.test_details?.filter((data) => {
                                          return data?.studentTests?.length > 0
                                        })
                                        localStorage.setItem('intereestCount', filteredData?.length)
                                      }
                                      return (
                                        <>
                                          <Accordion className='rowspacer'>
                                            <Accordion.Item>
                                              <Accordion.Header>
                                                <h5>{test?.title}</h5>
                                                <div className='progress-box'>
                                                  <h5>
                                                    {test?.title === 'Aptitude Test'
                                                      ? localStorage.getItem('aptitudeCount')
                                                      : localStorage.getItem('intereestCount')}
                                                    /{test?.test_details?.length}
                                                  </h5>
                                                  <ProgressBar
                                                    now={
                                                      ((test?.title === 'Aptitude Test'
                                                        ? localStorage.getItem('aptitudeCount')
                                                        : localStorage.getItem('intereestCount')) *
                                                        100) /
                                                      test?.test_details?.length
                                                    }
                                                  />
                                                </div>
                                              </Accordion.Header>
                                              <Accordion.Body>
                                                {test &&
                                                  test?.test_details?.map((tDetail) => {
                                                    return (
                                                      <>
                                                        <div className='subtest-box'>
                                                          <h4>{tDetail?.title}</h4>
                                                          {tDetail &&
                                                          tDetail?.studentTests.length >
                                                            0
                                                            ? (
                                                                tDetail?.studentTests.map(
                                                                  (studentTest) => {
                                                                    return (
                                                                  <>

                                                                    <div className='status-box'>
                                                                      <h6>Completed</h6>
                                                                      <img
                                                                        src={verified}
                                                                        alt='verified'
                                                                      />
                                                                    </div>
                                                                  </>
                                                                    )
                                                                  }
                                                                )
                                                              )
                                                            : (
                                                            <div className='status-box'>
                                                              <button
                                                                type='button'
                                                                className='theme-btn text-none'
                                                                onClick={() =>
                                                                  handleGiveTest(
                                                                    tDetail?.id, tDetail
                                                                  )
                                                                }
                                                              >
                                                                Give Test
                                                              </button>
                                                            </div>
                                                              )}
                                                        </div>
                                                      </>
                                                    )
                                                  })}
                                              </Accordion.Body>
                                            </Accordion.Item>
                                          </Accordion>
                                        </>
                                      )
                                    })}
                                  </>
                                )
                              })}
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                        : <GiveTest />
                    }

          </div>
        </div>
    </>
  )
}

export default Assessment
