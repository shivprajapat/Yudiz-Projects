import React, { useEffect } from 'react'
// import Sidebar from '../../../Components/Sidebar'
import Header from '../../../Components/Header'
// import ollatoicon from '../../../assets/images/ollatoicon.svg'
import ollatoicon from '../../../assets/images/ollatoicon.svg'
import { useDispatch, useSelector } from 'react-redux'
import { DashBoardData } from '../../../Actions/Center/dashboard'
import { useNavigate } from 'react-router-dom'

const CenterDashboard = () => {
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  // useSelector
  const dashData = useSelector((state) => state.center.centerDashData)
  useEffect(() => {
    dispatch(DashBoardData(token))
  }, [])
  return (
    <>
          <Header />
          <div className='main-layout'>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <div className='common-white-box withrightlogo' onClick={() => navigate('/center/counsellor-management')}>
                  <div className="left-box text-start">
                    <h5>Counsellors </h5>
                    <h2>{dashData?.counsellors}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-4">
                <div className='common-white-box withrightlogo' onClick={() => navigate('/center/sessions')}>
                  <div className="left-box text-start">
                    <h5>Completed Session</h5>
                    <h2>{dashData?.CompletedSessions}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className='common-white-box withrightlogo' onClick={() => navigate('/center/students-management')}>
                  <div className="left-box text-start">
                    <h5>Students</h5>
                    <h2>{dashData?.Students}</h2>
                  </div>
                  <div className="right-box">
                    <img src={ollatoicon} alt="ollatoicon" />
                  </div>
                </div>
              </div>
            </div>
          </div>
    </>
  )
}
export default CenterDashboard
