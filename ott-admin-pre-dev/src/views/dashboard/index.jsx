import { getStatistics } from 'query/statistics/statistics.query'
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
// import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-query'
import Cards from 'shared/components/card'

function Dashboard() {
  const [allStatistics, setAllStatistics] = useState({})

  useQuery('statisticsData', () => getStatistics(), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setAllStatistics(response)
    },
    onError: () => {
      setAllStatistics({})
    }
  })

  const data = [
    {
      title: `${allStatistics?.totalUsers?.toString() || '-'}`,
      subtitle: 'Total Registered Users',
      color: 'light-primary'
      // icon: <TrendingUp size={24} />
    },
    {
      title: `${allStatistics?.lastMonthUser?.toString() || '-'}`,
      subtitle: 'New Registered Users in the last month',
      color: 'light-info'
      // icon: <User size={24} />
    },
    {
      title: `${allStatistics?.movie?.toString() || '-'}`,
      subtitle: 'Total Movies',
      color: 'light-danger'
      // icon: <Film size={24} />
    },
    {
      title: `${allStatistics?.webSeries?.toString() || '-'}`,
      subtitle: 'Total Web Series',
      color: 'light-success'
      // icon: <Video size={24} />
    }
  ]

  return (
    <div>
      <Row>
        {data?.map((value) => {
          return (
            <Col xxl={3} lg={4} className='pb-3 pb-lg-0'>
              <Cards cardtitle={value?.subtitle} cardtext={value?.title} />
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default Dashboard
