import React, { useEffect } from 'react'
import TitleHeader from '../../Components/TitleHeader'
import { CChart } from '@coreui/react-chartjs'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getGraphData } from '../../Actions/assessment'
import ChartImg from '../../assets/images/findings-2-img.png'
export default function graph () {
  const location = useLocation()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')

  // useState
  // useSelector
  const grapnDataArray = useSelector((state) => state.assessment.graphData)
  useEffect(() => {
    if (location?.state?.id) {
      dispatch(getGraphData(location?.state?.id, token))
    }
  }, [location?.state?.id])

  return (
    <>
        <div className=''>
          <TitleHeader name='Assessment' />
          <div className='main-layout whitebox-layout test-desc'>
              <h2 className='testNameTitle' >CONCLUSIVE FINDINGS</h2>
            <div className='chartSection chart-img'>
            <div className="chart-image">
                  <img src={ChartImg} alt="" />
                </div>
              <div className="innerChart">
              <div className="findings-point-bg">
              <ul>
                {
                  grapnDataArray?.conclusive_findings && grapnDataArray?.conclusive_findings.length > 0
                    ? grapnDataArray?.conclusive_findings.map((conclusiveData, index) => {
                      return <li key={index} >{conclusiveData?.career_profile_detail_name}</li>
                    })
                    : <p>No Data Found</p>
                }
              </ul>
            </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6">
            <div className='main-layout whitebox-layout test-desc mt-4'>
              <h2 className='testNameTitle' >Aptitude Test</h2>
            <div className='chartSection'>
              <CChart
              className='innerChart'
                type='bar'
                style={{ width: '1000%' }}
                data={{
                  labels: grapnDataArray?.apptitude?.aptituteGraphLabel,
                  datasets: [
                    {
                      label: '# out of 10',
                      backgroundColor: '#2170AC',
                      data: grapnDataArray?.apptitude?.aptituteGraphValue
                    }
                  ]
                }
              }
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 10
                  }
                }
              }}
                labels='months'
              />
            </div>
          </div>
            </div>
            <div className="col-xl-6">
            <div className='main-layout whitebox-layout test-desc mt-4'>
            <h2 className='testNameTitle' >Interest Test</h2>
          <div className='chartSection'>
            <CChart
             className='innerChart'
              type='bar'
              style={{ width: '1000%' }}
              data={{
                labels: grapnDataArray?.interest?.interestGraphLabel,
                datasets: [
                  {
                    label: '# out of 10',
                    backgroundColor: '#2170AC',
                    data: grapnDataArray?.interest?.interestGraphValue
                  }
                ]
              }}
              options={{
                scales: {
                  y: {
                    min: 0,
                    max: 10
                  }
                }
              }}
              labels='months'
            />
            </div>
          </div>
            </div>
          </div>
        </div>
    </>
  )
}
