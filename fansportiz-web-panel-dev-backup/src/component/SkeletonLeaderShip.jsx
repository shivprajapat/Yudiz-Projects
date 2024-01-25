import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import { Table } from 'reactstrap'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLeaderShip (props) {
  const { length } = props
  return (
    <div className="player-cat bg-white">
      <div className="player-header d-flex justify-content-between bg-white">
        <span>
          <Skeleton height={10} width={150} />
        </span>
        <span>
          <Skeleton height={10} width={150} />
        </span>
      </div>
      <Table className="bg-white player-list m-0">
        <>
          {Array(length || 3)
            .fill()
            .map((index) => (
              <tbody key={index}>
                <tr>
                  <td>
                    <div className="l-img">
                      <Skeleton circle height={50} width={50} />
                    </div>
                  </td>
                  <td>
                    <h4 className="p-name">
                      <Skeleton height={10} width={150} />
                    </h4>
                    <p className="c-name">
                      <Skeleton height={10} width={150} />
                    </p>
                  </td>
                  <td className="align_right">
                    <b>
                      <Skeleton height={10} width={150} />
                    </b>
                  </td>
                </tr>
              </tbody>
            ))}
        </>
      </Table>
    </div>
  )
}

SkeletonLeaderShip.defaultProps = {
  length: 5
}

SkeletonLeaderShip.propTypes = {
  length: PropTypes.number
}

export default SkeletonLeaderShip
