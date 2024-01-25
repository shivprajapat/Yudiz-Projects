import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import Chart from 'react-apexcharts'

import Card from 'shared/components/card'
import Loading from 'shared/components/loading'
import { getAPIStats } from 'shared/apis/analytics'
import { convertDateInDMY, firstLetterCapital, graphOptions, lastSevenDays } from 'shared/utils'
import { getSubscriptionDetail } from 'shared/apis/dashboard'
import { getFromLocalStorage } from 'shared/helper/localStorage'

function Dashboard() {
  const [graphData, setGraphData] = useState([])
  const [subscriptionData, setSubscriptionData] = useState()
  const role = getFromLocalStorage('role')
  const [isLoading, setIsLoading] = useState(getFromLocalStorage('role') === 'client')

  async function getAPIData() {
    const apiStatsResponse = await getAPIStats()
    if (apiStatsResponse?.status === 200 && apiStatsResponse?.data.length !== 0) {
      const dates = lastSevenDays()
      const nTotalCount = []
      for (const date of dates) {
        let flag = false
        for (const item of apiStatsResponse?.data) {
          if (item?.dDate === date) {
            nTotalCount.push(Object.values(item?.aCount).reduce((a, b) => parseInt(a) + parseInt(b), 0))
            flag = true
            break
          }
        }
        if (!flag) {
          nTotalCount.push(0)
        }
      }
      setGraphData([{ data: dates?.map((item, i) => { return { x: item, y: nTotalCount[i] || 0 } }) }])
    } else {
      setGraphData([])
    }

    const subscriptionResponse = await getSubscriptionDetail()
    if (subscriptionResponse?.status === 200) {
      setSubscriptionData(subscriptionResponse?.data)
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (role === 'client') {
      getAPIData()
    }
  }, [])

  return (
    <>
      { !isLoading ? (
        <>
          <Row>
            <Col md={4}>
              <Card cardsFor={'counts'} colorClass={1} title={<FormattedMessage id='totalApi'/>} counts={subscriptionData?.oStats?.nApiTotal || 0} />
            </Col>
            <Col md={4}>
              <Card cardsFor={'counts'} colorClass={2} title={<FormattedMessage id='usedApi'/>} counts={subscriptionData?.oStats?.nApiUsed || 0} />
            </Col>
            <Col md={4}>
              <Card cardsFor={'counts'} colorClass={3} title={<FormattedMessage id='remainedApi'/>} counts={subscriptionData?.oStats?.nApiTotal - subscriptionData?.oStats?.nApiUsed || 0} />
            </Col>
          </Row>
          <div className='dashboard-details'>
            <Row>
              <Col md={6} lg={3} className='d-flex justify-content-center align-items-center '>
                <Card cardsFor={'subscription-details'} title={<FormattedMessage id='plan'/>} detail={subscriptionData?.aSubscriptionType?.map(item => firstLetterCapital(item)).join(', ') || 'No Data'} />
              </Col>
              <Col md={6} lg={3} className='d-flex justify-content-center align-items-center '>
                <Card cardsFor={'subscription-details'} title={<FormattedMessage id='subscriptionStartDate'/>} detail={convertDateInDMY(subscriptionData?.dSubscriptionStart)} />
              </Col>
              <Col md={6} lg={3} className='d-flex justify-content-center align-items-center '>
                <Card cardsFor={'subscription-details'} title={<FormattedMessage id='subscriptionExpire'/>} detail={convertDateInDMY(subscriptionData?.dSubscriptionEnd)} />
              </Col>
              <Col md={6} lg={3} className='d-flex justify-content-center align-items-center '>
                <Card cardsFor={'subscription-details'} colorClass={1} />
              </Col>
            </Row>
          </div>
          {
            graphData?.length !== 0 ? (
              <div className='bar-chart-container'>
                <Chart options={graphOptions} series={graphData} type='bar' width='100%' />
              </div>
            ) : (
              <div className='bar-chart-container text-center'>
                <h4><FormattedMessage id='noRecordFound'/></h4>
              </div>
            )
          }
        </>
      ) : (
        <Loading/>
      )
      }
    </>
  )
}
export default Dashboard
