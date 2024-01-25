import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import { Card } from 'reactstrap'

// Skeleton loader component
function SkeletonTable (props) {
  const { matchView } = props
  return (
    <>
    { matchView
      ? Array(5)
        .fill()
        .map((item, index) => (
      <Card className="leagues-card border-0" key={index}>
        <div className="match-box px-0" key={index}>
          <div className="match-i" key={index}>
          <center>
            <Skeleton height={15} width={200} />
          </center>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="team d-flex align-items-center">
              <div className="t-img"><Skeleton circle={true} className="border-0" height={60} width={60} /></div>
              <div className="name">
                <h3><Skeleton className="border-0" width={60} /></h3>
              </div>
            </div>
            <div className="time"><Skeleton className="border-0" width={60} /></div>
            <div className="team d-flex align-items-center">
              <div className="name">
                <h3><Skeleton className="border-0" width={60} /></h3>
              </div>
              <div className="t-img"><Skeleton circle={true} className="border-0" height={60} width={60} /></div>
            </div>
          </div>
          </div>
        </div>
      </Card>
        ))
      : Array(props.numberOfColumns)
        .fill()
        .map((_data1, index) => (
          <tr key={index}>
            { Array(props.numberOfColumns)
              .fill()
              .map((_data, id) => (
                <td key={id}>
                  <Skeleton width="80%" />
                </td>
              ))}
          </tr>
        ))}
        </>
  )
}

SkeletonTable.propTypes = {
  numberOfColumns: PropTypes.number.isRequired,
  matchView: PropTypes.bool
}

export default SkeletonTable
