import React from 'react'

// component
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'


import DashboardMonthlyChart from './Dashboard-MonthlyChart'
import DashboardFreeResources from './Dashboard-freeResources'
import DashboardLatestProject from './Dashboard-LatestProject'
import DashboardStatistic from './Dashboard-Statistic'
import DashboardWorklog from './Dashboard-Worklog'
import DashboardDueDate from './Dashboard-DueDate'

// helper
import { isGranted, permissionsName } from 'helpers'

import { Col, Row } from 'react-bootstrap'
import './_dashboard.scss'


export default function Dashboard() {

  if (!isGranted(permissionsName.VIEW_DASHBOARD)) {
    return (<></>)
  }

  return (
    <section className="dashboard">

      <PageTitle title="Dashboard" />

      {
        isGranted(permissionsName.VIEW_DASHBOARD_STATISTICS) ?
          <DashboardStatistic />
          : null
      }

      <Wrapper transparent>
        <Row>
          {
            isGranted(permissionsName.VIEW_DASHBOARD_FREE_RESOURCES) ?
              <Col xxl={6} lg={6}>
                <DashboardFreeResources />
              </Col> : null
          }

          {
            isGranted(permissionsName.VIEW_DASHBOARD_MONTHLY_CHART) ?
              <Col xxl={6} lg={6}>
                <DashboardMonthlyChart />
              </Col>
              : null
          }

          {
            isGranted(permissionsName.VIEW_DASHBOARD_LATEST_PROJECTS) ?
              <Col>
                <DashboardLatestProject />
              </Col>
              : null
          }
          
          {
            isGranted(permissionsName.VIEW_DASHBOARD_PROJECT_LINE) ?
              <Col>
                <DashboardDueDate />
              </Col>
              : null
          }

        </Row>
      </Wrapper>

      {
        isGranted(permissionsName?.VIEW_DASHBOARD_WORKLOGS) ?
          <DashboardWorklog />
          : null
      }

    </section>
  )
}
