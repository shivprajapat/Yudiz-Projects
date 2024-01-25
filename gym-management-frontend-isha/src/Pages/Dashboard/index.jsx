/* eslint-disable no-unused-vars */
import DashboardCard from 'Components/DashboardCard'
import Divider from 'Components/Divider'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import { getDashboardStatistics } from 'Query/Dashboard/dashboard.query'
// import { parseParams } from 'helpers'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useQuery } from 'react-query'
import './_dashboard.scss'
import { route } from 'Routes/route'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  // const parsedData = parseParams(location.search)
  const navigate = useNavigate()

  //   function getParams() {
  //     return {
  //       page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
  //       limit: Number(parsedData?.limit) || 10,
  //       search: parsedData?.search || '',
  //       sort: parsedData.sort || '',
  //       order: parsedData.order || '',
  //     }
  //   }
  //   const [requestParams, setRequestParams] = useState(getParams())
  // console.log('object :>> ', setRequestParams)

  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboardStatistics(),
    select: (data) => data?.data?.data
  })
    
  return (
    <Wrapper className='main'>
      <PageTitle title="Dashboard" />
      <Divider width={'155%'} height="1px" />

      <Row className='mt-4'>
        <Col lg={4} md={4}>
          <DashboardCard
            name='Staff'
            number={!data?.staff ? 0 : data?.staff}
            color='#F29B20'
            onClick={() => navigate(route.employees, {
              state: {
                value: 'S',
                label: 'Staff'
              }
            })}
          />
        </Col>
        <Col lg={4} md={4}>
          <DashboardCard
            name='Trainer'
            number={!data?.trainer ? 0 : data?.trainer}
            color='#288BA8'
            onClick={() => navigate(route.employees, {
              state: {
                value: 'T',
                label: 'Trainer'
              }
            })}
          />
        </Col>
        <Col lg={4} md={4}>
          <DashboardCard
            name='Customer'
            number={!data?.totalCustomer ? 0 : data?.totalCustomer}
            color='#884B9D'
            onClick={() => navigate(route.customers)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={4} md={4}>
          <DashboardCard
            name='Inquiry'
            number={!data?.inquiry ? 0 : data?.inquiry}
            color='#288BA8'
            onClick={() => navigate(route.inquiry)}
          />
        </Col>
        <Col lg={4} md={4}>
          <DashboardCard
            name='Active Subscription'
            number={!data?.activeSubscription ? 0 : data?.activeSubscription}
            color='#0EA085'
            onClick={() => navigate(route.subscriptions, {
              state: {
                value: 'Y',
                label: 'Active'
              }
            })}
          />
        </Col>
      </Row>
    </Wrapper>
  )
}
