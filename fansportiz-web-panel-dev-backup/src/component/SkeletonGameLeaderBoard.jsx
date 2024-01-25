import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import { Card, Row, Col } from 'reactstrap'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonGameLeaderBoard (props) {
  const { length } = props
  return (
    <>
      {Array(length)
        .fill()
        .map((index) => (
          <Card key={index} className="mt-1 ms-2 me-2 leagues-card">
            <div className="leaderboard-card">
              <div>
                <Row>
                  <Col className="col-3">
                    <Skeleton className="img mt-2 mb-2" height={60} square width={60} />
                  </Col>
                  <Col className="col-9 mt-3">
                    <Row>
                      <Skeleton height={10} width={200} />
                    </Row>
                    <Row>
                      <Skeleton height={10} width={100} />
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        ))}
    </>
  )
}

SkeletonGameLeaderBoard.defaultProps = {
  length: 5
}

SkeletonGameLeaderBoard.propTypes = {
  length: PropTypes.number
}

export default SkeletonGameLeaderBoard
