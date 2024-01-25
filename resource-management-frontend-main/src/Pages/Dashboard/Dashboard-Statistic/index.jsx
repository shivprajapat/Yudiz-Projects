import React from 'react'

//component
import DashboardCard from 'Components/DashboardCard'
import Wrapper from 'Components/wrapper'

//query
import { getDashboard } from 'Query/Dashboard/dashboard.query'
import { useQuery } from 'react-query'

//helper
import { isGranted, permissionsName } from 'helpers'

import { Row } from 'react-bootstrap'

function DashboardStatistic() {

    // get dashboard statistic 
    const { data: dashboardDetails, isLoading } = useQuery(['dashboard'], getDashboard, {
        select: (data) => data.data.data,
        staleTime: 10000,
        enabled: isGranted(permissionsName.VIEW_DASHBOARD_STATISTICS)
    })

    return (
        <Wrapper
            transparent
            isLoading={isLoading}
        >
            <Row className="mt-4">
                <DashboardCard
                    name='Total Projects'
                    // name={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Total Projects (Own/All) ' : 'Total Projects'}
                    number={
                        dashboardDetails?.eShowAllProjects === 'ALL' ? ` ${dashboardDetails?.data?.totalOwnProjects}/${dashboardDetails?.data?.totalAllProjects}` : dashboardDetails?.data?.totalOwnProjects
                    }
                    eShow={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Own/All' : null}

                    color="#0487FF" />
                <DashboardCard
                    name='Up Coming Projects'
                    // name={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Up Coming Projects (Own/All) ' : 'Up Coming Projects'}
                    number={
                        dashboardDetails?.eShowAllProjects === 'ALL' ? `${dashboardDetails?.data?.onPendingOwnProjects}/${dashboardDetails?.data?.onPendingAllProjects}` : dashboardDetails?.data?.onPendingOwnProjects
                    }
                    eShow={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Own/All' : null}
                    color="#c831bc" />
                <DashboardCard
                    name="New Projects"
                    // name={dashboardDetails?.eShowAllProjects === 'ALL' ? 'New Projects (Own/All) ' : 'New Projects'}
                    number={
                        dashboardDetails?.eShowAllProjects === 'ALL' ? `${dashboardDetails?.data?.newOwnProjects}/${dashboardDetails?.data?.newAllProjects}` : dashboardDetails?.data?.newOwnProjects
                    }
                    eShow={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Own/All' : null}
                    color="#0EA085" />
                <DashboardCard
                    name="On Going Projects"
                    // name={dashboardDetails?.eShowAllProjects === 'ALL' ? 'On Going Projects (Own/All) ' : 'On Going Projects'}
                    number={
                        dashboardDetails?.eShowAllProjects === 'ALL' ? `${dashboardDetails?.data?.inProgressOwnProjects}/${dashboardDetails?.data?.inProgressAllProjects}` : dashboardDetails?.data?.inProgressOwnProjects
                    }
                    eShow={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Own/All' : null}
                    color="#884B9D" />
                <DashboardCard
                    name="Completed Project"
                    //    name={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Completed Project (Own/All) ' : 'Completed Project'}
                    number={
                        dashboardDetails?.eShowAllProjects === 'ALL' ? `${dashboardDetails?.data?.completedOwnProjects}/${dashboardDetails?.data?.completedAllProjects}` : dashboardDetails?.data?.completedOwnProjects
                    }
                    eShow={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Own/All' : null}
                    color="#F29B20" />
                <DashboardCard
                    name="On Hold"
                    //    name={dashboardDetails?.eShowAllProjects === 'ALL' ? 'On Hold (Own/All) ' : 'On Hold'}
                    number={
                        dashboardDetails?.eShowAllProjects === 'ALL' ? `${dashboardDetails?.data?.onHoldOwnProjects}/${dashboardDetails?.data?.onHoldAllProjects}` : dashboardDetails?.data?.onHoldOwnProjects
                    }
                    eShow={dashboardDetails?.eShowAllProjects === 'ALL' ? 'Own/All' : null}
                    color="#42abe1" />
            </Row>
        </Wrapper>
    )
}

export default DashboardStatistic