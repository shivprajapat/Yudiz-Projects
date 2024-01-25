import React from 'react'
import { Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'

const PlayerCard = dynamic(() => import('@shared-components/playerCard'))

const TopPlayerRankings = ({ data }) => {
  return (
    <Row className="flex-nowrap scroll-list">
      {data?.map((player) => {
        return (
          <Col xl={3} xs="auto" key={player._id}>
            <PlayerCard data={player} />
          </Col>
        )
      })}
    </Row>
  )
}

TopPlayerRankings.propTypes = {
  data: PropTypes.array
}
export default TopPlayerRankings
