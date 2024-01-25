import React, { useEffect } from 'react'

/* React Packages */
import { Link, NavLink, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

// import '../../style.css'

import TitleHeader from '../../Components/TitleHeader'
import backcaret from '../../assets/images/back-caret.svg'
import { getTestProcessCategory } from '../../Actions/testProcess'
/* images */
import queansline from '../../assets/images/question-answer-line.svg'
import timerline from '../../assets/images/timer-line.svg'
const TestCategoryDetail = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const token = localStorage.getItem('token')
  const dataArray = useSelector((state) => state.test.testProcessCategoryByID)
  // const { dataObject } = location?.state
  useEffect(() => {
    if (params?.id) {
      const data = {
        id: Number(params?.id)
      }
      dispatch(getTestProcessCategory(data, token))
    }
  }, [])
  return (
    <>
          <div className=''>
            {/* <Header /> */}
            <TitleHeader name='Test Process'/>
            <div className="gobackbtn">
                <Link to='/test-process'><img src={backcaret} alt="backarrrow" />Go Back</Link>
              </div>
            <div className='main-layout whitebox-layout test-desc'>
            <div className='common-white-box'>
                    <div className="left-box">
                      <h5>{dataArray?.title}</h5>
                      <p>{dataArray?.meaning}</p>
                      <div className="inner-box d-flex align-items-center">
                        <h4> <img src={queansline} alt="queansline" /> {dataArray?.no_of_questions} Questions</h4>
                        {
                            dataArray?.test_time == null ? '' : <h4> <img src={timerline} alt="timerline" /> {dataArray?.test_time?.time_Sec ? moment.utc(dataArray?.test_time?.time_Sec * 1000).format('mm') : '0'} Minutes</h4>
                        }
                      </div>
                    </div>
                    <div className="right-box test-details d-md-block text-end">
                      <NavLink to={`/test-process/test-question/${dataArray?.id}`} className="theme-btn text-none">Start Test Now</NavLink>
                      <p className='note-line mb-0'>All questions are mandatory</p>
                    </div>
                  </div>
                <div className="test-description">
                    {/* <p>{dataArray?.description}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: dataArray?.description }}></div>
                  {/* <div className="instruction">
                    <h4>Instructions</h4>
                    <ul>
                      <li>Each question is timed</li>
                      <li>Do not use search engines or get help from others</li>
                      <li>Once you’ve submitted an answer, you cannot go back</li>
                    </ul>
                  </div> */}
                </div>
            </div>
          </div>
  </>
  )
}

export default TestCategoryDetail
