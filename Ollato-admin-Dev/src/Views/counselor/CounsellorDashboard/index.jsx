import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// Components
// import Header from '../../../Components/Header'
import ollatoicon from '../../../assets/images/ollatoicon.svg'

// Action
import { getDashboardDataAction, getCounsellorDataAction } from '../../../Actions/Counsellor/dashboard'
import defaultPic from '../../../assets/images/default_profile.jpg'
import { useS3Upload } from '../../../Shared/Hooks/UseS3UPload'

const CounsellorDashboard = () => {
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { getImage } = useS3Upload()
  const [profileImage, setProfileImage] = useState()

  // useSelector
  const dashBoardData = useSelector((state) => state.dashboard.dashboardData)
  const profileData = useSelector((state) => state.dashboard.counsellorData)
  useEffect(() => {
    if (token) {
      dispatch(getDashboardDataAction(token))
      dispatch(getCounsellorDataAction(token))
    }
  }, [token])

  useEffect(() => {
    async function getImageUrl () {
      if (profileData?.details?.profile_picture) {
        const data = [{
          path: profileData?.details?.profile_picture,
          flag: 'profile_picture'
        }]
        const result = await getImage(data, token)
        setProfileImage(result?.url?.profile_picture)
      }
    }
    getImageUrl()
  }, [profileData?.details?.profile_picture])

  return (
    <>
          {/* <Header /> */}
          <div className='main-layout whitebox-layout my-profile-page'>
          <div className='profile-item text-a-center'>
                <div className='row align-items-lg-center'>
                  <div className='col-md-8 order-2 order-md-0'>
                    <div className='profile-desc'>
                      <h4>
                        Dear {profileData?.first_name} {profileData?.last_name},
                      </h4>
                      <p>Welcome to the world of career possibilities! </p>
                      <p>
                        You read the given instructions carefully. In the
                        diagram below, the process to complete the assessment is
                        explained. It will take you at least 02 hours to
                        complete this test. After completion of the test you
                        will get 25 page detailed report with best 3 career
                        options along with their detailed portfolio. You can
                        then book your session for expert guidance.
                      </p>
                      <h4>Wish You All The Best!</h4>
                      <h4>Team Ollato</h4>
                    </div>
                  </div>
                  <div className='col-md-4 order-1 order-md-0 mb-3 mb-md-0'>
                    <div className='profileinfo profile-updated'>
                      <div className='profile-img'>
                        <img
                              src={profileData?.details?.profile_picture === null || profileData?.details?.profile_picture === 'undefined' ? defaultPic : profileImage}
                              alt=''
                            />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <div>
              <div className='profile-item mt-3'>
              <div className='row '>
                <div className='col-lg-6'>
                  <div className='common-white-box withrightlogo profile-item ' style={{ padding: '5%' }}>
                    <div className='left-box text-start'>
                      <h5>Accepted</h5>
                      <h2>
                        {dashBoardData && dashBoardData[0]?.acceptedSession !== null ? dashBoardData[0]?.acceptedSession : 0}
                      </h2>
                    </div>
                    <div className='right-box'>
                      <img src={ollatoicon} alt='ollatoicon' />
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='common-white-box withrightlogo profile-item' style={{ padding: '5%' }}>
                    <div className='left-box text-start'>
                      <h5>Pending</h5>
                      <h2>
                      {dashBoardData && dashBoardData[0]?.pandingSession !== null ? dashBoardData[0]?.pandingSession : 0}
                      </h2>
                    </div>
                    <div className='right-box'>
                      <img src={ollatoicon} alt='ollatoicon' />
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='common-white-box withrightlogo profile-item' style={{ padding: '5%' }}>
                    <div className='left-box text-start'>
                      <h5>Rescheduled</h5>
                      <h2>
                      {dashBoardData && dashBoardData[0]?.rescheduleSession !== null ? dashBoardData[0]?.rescheduleSession : 0}
                      </h2>
                    </div>
                    <div className='right-box'>
                      <img src={ollatoicon} alt='ollatoicon' />
                    </div>
                  </div>
                </div>
                <div className='col-lg-6'>
                  <div className='common-white-box withrightlogo profile-item' style={{ padding: '5%' }}>
                    <div className='left-box text-start'>
                      <h5>Cancelled</h5>
                      <h2>
                      {dashBoardData && dashBoardData[0]?.cancelSession !== null ? dashBoardData[0]?.cancelSession : 0}
                      </h2>
                    </div>
                    <div className='right-box'>
                      <img src={ollatoicon} alt='ollatoicon' />
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

export default CounsellorDashboard
