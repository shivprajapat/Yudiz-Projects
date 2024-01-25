// import moment from 'moment'
import React from 'react'
// import { Line } from 'react-chartjs-2'
// import { useDispatch, useSelector } from 'react-redux'
// import { Col, Row } from 'reactstrap'
// import { getDashboardData } from '../../actions/charts'

function dashboard () {
  // const dispatch = useDispatch()
  // const [date, setDate] = useState([])
  // const [value, setValue] = useState([])
  // const token = useSelector(state => state.auth.token)
  // const dashboardData = useSelector(state => state.charts.dashboardData)
  // const userRegistrations = useSelector(state => state.charts.userRegistrations)
  // const previousProps = useRef({ dashboardData }).current

  // useEffect(() => {
  //   dispatch(getDashboardData(token))
  //   // dispatch(getUserRegistrations(token))
  // }, [])

  // useEffect(() => {
  //   if (previousProps.dashboardData !== dashboardData && dashboardData) {
  //     const registeredUsersDateWise = dashboardData.find(data => data.sKey === 'RUDW')
  //     const dates = []
  //     const values = []
  //     registeredUsersDateWise?.aData.map(data => {
  //       dates.push(moment(data.dStartDate).format('ll'))
  //       values.push(Number(data.nValue).toFixed(2))
  //       return data
  //     })
  //     setDate(dates)
  //     setValue(values)
  //   }
  //   return () => {
  //     previousProps.dashboardData = dashboardData
  //   }
  // }, [dashboardData])

  // useEffect(() => {
  //   if (userRegistrations) {
  //     userRegistrations.map(data => {
  //       date.push(moment(data.dDate).format('l'))
  //       value.push(data.nValue)
  //       return data
  //     })
  //   }
  // }, [userRegistrations])

  // const state = {
  //   labels: date,
  //   datasets: [
  //     {
  //       backgroundColor: 'rgba(75,192,192,0.2)',
  //       borderColor: 'rgba(75,192,192,0.2)',
  //       data: value,
  //       fill: true
  //     }
  //   ]
  // }

  return (
    <div></div>
    // <div className='container-fluid'>
    //   <Row>
    //     <Col xl='3' lg='4' md='6'>
    //       <Line
    //         data={state}
    //         options={{
    //           plugins: {
    //             title: {
    //               display: true,
    //               text: 'Registered Users',
    //               position: 'bottom',
    //               font: {
    //                 size: '20'
    //               }
    //             },
    //             legend: {
    //               display: false
    //             }
    //           }
    //         }}
    //       ></Line>
    //     </Col>
    //     <Col xl='3' lg='3' md='6'>
    //       <Line
    //         data={state}
    //         options={{
    //           plugins: {
    //             title: {
    //               display: true,
    //               text: 'Deposits',
    //               position: 'bottom',
    //               font: {
    //                 size: '20'
    //               }
    //             },
    //             legend: {
    //               display: false
    //             }
    //           }
    //         }}
    //       ></Line>
    //     </Col>
    //     <Col xl='3' lg='3' md='6'>
    //       <Line
    //         data={state}
    //         options={{
    //           plugins: {
    //             title: {
    //               display: true,
    //               text: 'Withdrawals',
    //               position: 'bottom',
    //               font: {
    //                 size: '20'
    //               }
    //             },
    //             legend: {
    //               display: false
    //             }
    //           }
    //         }}
    //       ></Line>
    //     </Col>
    //     <Col xl='3' lg='3' md='6'>
    //       <Line
    //         data={state}
    //         options={{
    //           plugins: {
    //             title: {
    //               display: true,
    //               text: 'Teams',
    //               position: 'bottom',
    //               font: {
    //                 size: '20'
    //               }
    //             },
    //             legend: {
    //               display: false
    //             }
    //           }
    //         }}
    //       ></Line>
    //     </Col>
    //   </Row>
    // </div>
  )
}

export default dashboard
