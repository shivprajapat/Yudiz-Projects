import classnames from 'classnames'
import Avatar from '@components/avatar'
import { TrendingUp, User, Film, Video } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'

const StatsCard = ({ cols }) => {
  const data = [
    {
      title: '230k',
      subtitle: 'Total Registered Users',
      color: 'light-primary',
      icon: <TrendingUp size={24} />
    },
    {
      title: '8.549k',
      subtitle: 'New Registered Users in the current month',
      color: 'light-info',
      icon: <User size={24} />
    },
    {
      title: '1.423k',
      subtitle: 'Total Videos',
      color: 'light-danger',
      icon: <Film size={24} />
    },
    {
      title: '$9745',
      subtitle: 'New Videos added in current month',
      color: 'light-success',
      icon: <Video size={24} />
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const margin = Object.keys(cols)
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
          })}
        >
          <Media>
            <Avatar color={item.color} icon={item.icon} className="mr-2" />
            <Media className="my-auto" body>
              <h4 className="font-weight-bolder mb-0">{item.title}</h4>
              <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
            </Media>
          </Media>
        </Col>
      )
    })
  }

  return (
    <Card className="card-statistics">
      <CardHeader>
        <CardTitle tag="h4">Statistics</CardTitle>
        <CardText className="card-text font-small-2 mr-25 mb-0">Updated 1 month ago</CardText>
      </CardHeader>
      <CardBody className="statistics-body">
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
