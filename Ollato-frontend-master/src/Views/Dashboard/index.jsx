import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CircularProgressbar } from 'react-circular-progressbar'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import defaultPic from '../../assets/default_profile copy.jpg'
// CSS File
import 'react-circular-progressbar/dist/styles.css'

// images
// import profileimg from '../../assets/images/profile-picture.png'
import ProgressImg4 from '../../assets/images/Dahsboard-img4.png'

// Action files
import { viewProfileAction } from '../../Actions/auth'
import { getDashboardCount } from '../../Actions/dashboard'
import { downloadReport } from '../../Actions/assessment'
import { useSnackbar } from 'react-notistack'

function index () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem(['token'])
  const { enqueueSnackbar } = useSnackbar()

  // useState
  const [assessmentPercentage, setAssessmentPercentage] = useState()

  // useSelector
  const profileData = useSelector((state) => state.auth.profileData)
  const dashboardData = useSelector((state) => state.dashboard.dashboardData)
  const downloadReportLinkData = useSelector(
    (state) => state.assessment.downloadReportLink
  )
  const reportDownloadedFlag = useSelector(
    (state) => state.assessment.isReportDownloaded
  )
  const resMessage = useSelector((state) => state.assessment.resMessage)
  const resStatus = useSelector((state) => state.assessment.resStatus)
  const previousProps = useRef({
    dashboardData,
    downloadReportLinkData,
    reportDownloadedFlag,
    resMessage,
    resStatus
  }).current

  // Call Dashboard and Profile API
  useEffect(() => {
    if (token) {
      dispatch(viewProfileAction(token))
      dispatch(getDashboardCount(token))
    }
  }, [])

  // Set Dashboard API Response Data
  useEffect(() => {
    if (previousProps?.dashboardData !== dashboardData) {
      if (dashboardData) {
        if (dashboardData.length <= 0) {
          setAssessmentPercentage(0)
        } else {
          setAssessmentPercentage(
            dashboardData?.assessmentTest?.completed_percent
          )
        }
      }
    }
    return () => {
      previousProps.dashboardData = dashboardData
    }
  }, [dashboardData])

  // Download Report of Student
  const handleReport = () => {
    dispatch(downloadReport(dashboardData?.assessmentTest?.custom_id, token))
  }

  // Redirect to chart component of Assessment
  const handleReportGraph = () => {
    navigate('/chart', {
      state: { id: dashboardData?.assessmentTest?.custom_id }
    })
  }

  // Downloaded Report Link
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

  // Redirect to Test Process
  const handleProgressBar = () => {
    navigate('/test-process', { state: { key: 'Aptitude Test' } })
  }

  // Redirect to Interest Test
  const handleInterestProgress = () => {
    navigate('/test-process', {
      state: { data: 2, key: 'Interest Test' }
    })
  }

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
        <meta charSet="utf-8" />
        <title>Dashbaord - Ollato</title>
      </Helmet>
      <div>
        <div className="main-layout whitebox-layout my-profile-page">
          <div className="profile-item">
            <div className="row align-items-lg-center">
              <div className="col-md-8 order-2 order-md-0">
                <div className="profile-desc">
                  <h4>
                    Dear {profileData?.first_name} {profileData?.last_name},
                  </h4>
                  <p>Welcome to the world of career possibilities! </p>
                  <p>
                    You read the given instructions carefully. In the diagram
                    below, the process to complete the assessment is explained.
                    It will take you at least 02 hours to complete this test.
                    After completion of the test you will get 25 page detailed
                    report with best 3 career options along with their detailed
                    portfolio. You can then book your session for expert
                    guidance.
                  </p>
                  <h4>Wish You All The Best!</h4>
                  <h4>Team Ollato</h4>
                </div>
              </div>
              <div className="col-md-4 order-1 order-md-0 mb-3 mb-md-0">
                <div className="profileinfo profile-updated">
                  <div className="profile-img">
                    {/* <img src={profileimg} alt='ollato-img' /> */}
                    <img
                      src={
                        profileData?.profile === null ||
                        profileData?.profile === 'undefined'
                          ? defaultPic
                          : `${process.env.REACT_APP_AXIOS_BASE_URL}${profileData?.profile}`
                      }
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-item no-border">
            <div className="row">
              <div className="col-xxl-12 mx-auto">
                <h5>PROCESS</h5>
                <div className="process-lavel text-center">
                  <div className="lavel">
                    <Link to="/package">
                      <h5>SELECT {<br />}PACKAGE</h5>
                    </Link>
                  </div>
                  <div className="lavel">
                    <Link to="/package">
                      <h5>Make {<br />}payment</h5>
                    </Link>
                  </div>
                  <div className="lavel">
                    <Link to="/assetment">
                      <h5>GIVE {<br />}ASSESSMENT</h5>
                    </Link>
                  </div>
                  <div className="lavel">
                    <button
                      className="d-report-btn"
                      disabled={
                        !dashboardData?.assessmentTest ||
                        dashboardData?.assessmentTest?.is_submitted === 0
                      }
                      onClick={() => handleReportGraph()}
                    >
                      <h5>DETAILED {<br />}REPORT</h5>
                    </button>
                  </div>
                  <div className="lavel">
                    <h5>BOOK {<br />}COUNSELLING</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-item no-border no-p-t-b">
            <h5>PROGRESS</h5>
          </div>
          <div className="profile-item">
            <div className="row text-center">
              <div className="col-sm-6 col-lg-3">
                <div className="progress-lavel">
                  <div className="progress-graph">
                    <button
                      onClick={() => handleReportGraph()}
                      // disabled={
                      //  dashboardData !== null || (dashboardData?.length > 0 && dashboardData?.assessmentTest?.is_submitted === 0)
                      // }
                      disabled={
                        !dashboardData?.assessmentTest ||
                        dashboardData?.assessmentTest?.completed_percent !== 100
                      }
                    >
                      <CircularProgressbar
                        value={assessmentPercentage}
                        background={false}
                        counterClockwise={true}
                        text={`${assessmentPercentage}%`}
                        styles={{
                          root: {},
                          stroke: '#ff0000',
                          path: {
                            stroke: '#ff0000',
                            strokeLinecap: 'butt',
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                            transform: 'rotate(0.5turn)',
                            transformOrigin: 'center center'
                          },
                          trail: {
                            stroke: '#ff000024',
                            strokeLinecap: 'butt',

                            transform: 'rotate(0.5turn)',
                            transformOrigin: 'center center'
                          },
                          text: {
                            fill: '#ff0000',
                            fontSize: '24px',
                            fontWeight: '700'
                          },
                          background: {
                            fill: '#008000'
                          }
                        }}
                      />
                    </button>
                  </div>
                  <p>Assessment</p>
                </div>
              </div>
              <div className=" col-sm-6 col-lg-3">
                <div className="progress-lavel">
                  <div className="progress-graph">
                    <button
                      // disabled={
                      //   dashboardData?.length > 0 || dashboardData?.studentTestData?.length > 0
                      //     ? dashboardData?.studentTestData[0]
                      //       ?.completed_percent === 100
                      //     : false
                      // }
                      disabled={
                        !dashboardData?.studentTestData ||
                        dashboardData?.studentTestData?.find(
                          (i) => i.title === 'Aptitude Test'
                        ).completed_percent === 0
                      }
                      onClick={() => handleProgressBar()}
                    >
                      <CircularProgressbar
                        value={
                          dashboardData?.studentTestData &&
                          dashboardData?.studentTestData.length > 0
                            ? dashboardData?.studentTestData[0]
                              ?.completed_percent
                            : '0'
                        }
                        background={false}
                        counterClockwise={true}
                        text={`${
                          dashboardData?.studentTestData &&
                          dashboardData?.studentTestData.length > 0
                            ? dashboardData?.studentTestData[0]
                                ?.completed_percent
                            : '0'
                        }%`}
                        styles={{
                          root: {},
                          path: {
                            stroke: '#008000',
                            strokeLinecap: 'butt',
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                            transform: 'rotate(0.5turn)',
                            transformOrigin: 'center center'
                          },
                          trail: {
                            stroke: '#0080003c',
                            strokeLinecap: 'butt',
                            transform: 'rotate(0.5turn)',
                            transformOrigin: 'center center'
                          },
                          text: {
                            fill: '#008000',
                            fontSize: '24px',
                            fontWeight: '700'
                          },
                          background: {
                            fill: '#008000'
                          }
                        }}
                      />
                    </button>
                  </div>
                  <p>Aptitude</p>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="progress-lavel">
                  <div className="progress-graph">
                    <button
                      // disabled={
                      //   dashboardData?.length > 0 && dashboardData?.studentTestData?.length > 0 && dashboardData?.studentTestData[0]
                      //     ?.completed_percent === 100
                      // }
                      // disabled={
                      //   dashboardData?.length > 0 ||
                      //   dashboardData?.studentTestData?.length > 0
                      //     ? dashboardData?.studentTestData[1]
                      //       ?.completed_percent === 100
                      //     : false
                      // }
                      disabled={
                        !dashboardData?.studentTestData ||
                        dashboardData?.studentTestData?.find(
                          (i) => i.title === 'Interest Test'
                        ).completed_percent === 0
                      }
                      onClick={() => handleInterestProgress()}
                    >
                      <CircularProgressbar
                        value={
                          dashboardData?.studentTestData &&
                          dashboardData?.studentTestData.length > 0
                            ? dashboardData?.studentTestData[1]
                              ?.completed_percent
                            : '0'
                        }
                        background={false}
                        counterClockwise={true}
                        text={`${
                          dashboardData?.studentTestData &&
                          dashboardData?.studentTestData.length > 0
                            ? dashboardData?.studentTestData[1]
                                ?.completed_percent
                            : '0'
                        }%`}
                        styles={{
                          // Customize the root svg element
                          root: {},
                          // Customize the path, i.e. the "completed progress"
                          path: {
                            // Path color
                            stroke: '#00009d',
                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',
                            // Customize transition animation
                            transition: 'stroke-dashoffset 0.5s ease 0s',
                            // Rotate the path
                            transform: 'rotate(0.5turn)',
                            transformOrigin: 'center center'
                          },
                          // Customize the circle behind the path, i.e. the "total progress"
                          trail: {
                            // Trail color
                            stroke: '#00009d47',
                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',
                            // Rotate the trail
                            transform: 'rotate(0.5turn)',
                            transformOrigin: 'center center'
                          },
                          // Customize the text
                          text: {
                            // Text color
                            fill: '#00009d',
                            // Text size
                            fontSize: '24px',
                            fontWeight: '700'
                          },
                          // Customize background - only used when the `background` prop is true
                          background: {
                            fill: '#008000'
                          }
                        }}
                      />
                      {/* <img className='progress-img' src={ProgressIc3} alt='' /> */}
                    </button>
                  </div>
                  <p>Interest</p>
                </div>
              </div>
              <div iv className="col-sm-6 col-lg-3">
                <div className="progress-lavel">
                  <div className="progress-img progress-graph">
                    <button
                      disabled={
                        !dashboardData?.assessmentTest ||
                        dashboardData?.assessmentTest?.is_submitted === 0
                      }
                      onClick={() => handleReport()}
                    >
                      <img src={ProgressImg4} alt="" />
                    </button>
                    <p>Detailed Report Download</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-item">
            <div className="row">
              <div className="col-xxl-12 mx-auto">
                <h5>Counselling</h5>
                <div className="process-lavel counselling text-center">
                  <div className="lavel">
                    <Link
                      to="/counselling/career"
                      state={{ data: 'career_counsellor' }}
                    >
                      <h5>Carrer Counsellor</h5>
                    </Link>
                  </div>
                  <div className="lavel">
                    <Link
                      to="/counselling/psy"
                      state={{ data: 'psychologist' }}
                    >
                      <h5>Psychologist</h5>
                    </Link>
                  </div>
                  <div className="lavel">
                    <Link
                      to="/counselling/over"
                      state={{ data: 'overseas_counsellor' }}
                    >
                      <h5>Overseas</h5>
                    </Link>
                  </div>
                  <div className="lavel">
                    <Link
                      to="/counselling/expert"
                      state={{ data: 'subject_expert' }}
                    >
                      <h5>
                        Subject <br /> expert
                      </h5>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default index
