import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getDashboardDataAdminAction } from '../../Actions/Admin/dashboard'
import ollatoicon from '../../assets/images/ollatoicon.svg'
import Header from '../../Components/Header'
import { Spinner } from 'react-bootstrap'
// import { useNavigate } from 'react-router-dom'
// import MobileHeader from '../../Components/MobileHeader'
// import Sidebar from '../../Components/Sidebar'

const Index = () => {
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  // useSelector
  const dashBoardData = useSelector((state) => state.auth.dashboardDataAdmin)
  const isLoading = useSelector((state) => state.auth.loading)

  useEffect(() => {
    if (token) {
      dispatch(getDashboardDataAdminAction(token))
    }
  }, [token])

  return (
       <>
       <Header/>
       {isLoading
         ? <Spinner className='text-center' animation='border' />
         : <div className='main-layout'>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <div className='common-white-box withrightlogo' onClick={() => navigate('/admin/counsellor-management')}>
                  <div className="left-box text-start" >
                    <h5>Counsellors </h5>
                    <h2>{dashBoardData?.counsellors}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <div className='common-white-box withrightlogo' onClick={() => navigate('/admin/sessions')}>
                  <div className="left-box text-start">
                    <h5>Completed Session</h5>
                    <h2>{dashBoardData?.CompletedSessions}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className='common-white-box withrightlogo' onClick={() => navigate('/admin/students-management')}>
                  <div className="left-box text-start">
                    <h5>Students</h5>
                    <h2>{dashBoardData?.Students}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className='common-white-box withrightlogo' onClick={() => navigate('/admin/center-management')}>
                  <div className="left-box text-start">
                    <h5>Centers</h5>
                    <h2>{dashBoardData?.centers}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className='common-white-box withrightlogo' onClick={() => navigate('/admin/students-management', { state: { test_completed: true } })}>
                  <div className="left-box text-start">
                    <h5>Total Completed Test</h5>
                    <h2>{dashBoardData?.testCompletedStudents}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
            </div>
          </div>}
       </>
  )
}

export default Index
