import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import { Table, Card } from 'reactstrap'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonPlayerStatus (props) {
  const { teams } = props
  return (
    <>
      {
        teams
          ? (
            <>
              {Array(teams)
                .fill()
                .map((item, index) => (
                  <Card key={index} className="mt-1 ms-2 me-2 leagues-card">
                    <div key={index} className="match-box me-3">
                      <div className="d-flex justify-content-between">
                        <Skeleton height={20} width={100} />
                        <Skeleton height={20} width={100} />
                      </div>
                      <div className="team-p d-flex align-items-center">
                        <div className="me-5 player" width={75}>
                          <div className="img">
                            <Skeleton circle className="mt-2 ms-4" height={80} width={80} />
                          </div>
                          <Skeleton className="ms-4 mb-3" height={20} width={80} />
                        </div>
                        <div className="me-5 player" width={75}>
                          <div className="img">
                            <Skeleton circle className="mt-2 ms-4" height={80} width={80} />
                          </div>
                          <Skeleton className="ms-4 mb-3" height={20} width={80} />
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <Skeleton className="ms-4" height={20} width={40} />
                        <Skeleton height={20} width={40} />
                        <Skeleton height={20} width={40} />
                        <Skeleton className="me-4" height={20} width={40} />
                      </div>
                    </div>
                  </Card>
                ))}
            </>
            )
          : (
            <>
              {
            Array(1)
              .fill()
              .map((item, index) => (
                <Table key={index} className="bg-white player-list player-stats-table m-0">
                  <thead>
                    <tr>
                      <th><Skeleton height={20} width={50} /></th>
                      <th><Skeleton height={20} width={30} /></th>
                      <th><Skeleton height={20} width={30} /></th>
                      <th><Skeleton height={20} width={30} /></th>
                      <th><Skeleton height={20} width={30} /></th>
                    </tr>
                  </thead>
                  { Array(props.numberOfColumns)
                    .fill()
                    .map((ind) => (
                      <tr key={ind}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="l-img">
                              <Skeleton circle className="border-0" height={20} width={20} />
                            </div>
                            <div className="ms-2">
                              <h4 className="p-name"><Skeleton height={10} width={80} /></h4>
                              <p className="c-name">
                                <Skeleton height={10} width={30} />
                                <span className="role ms-2"><Skeleton height={10} width={30} /></span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td><Skeleton height={10} width={30} /></td>
                        <td><Skeleton height={10} width={30} /></td>
                        <td><Skeleton height={10} width={30} /></td>
                        <td><Skeleton height={10} width={30} /></td>
                      </tr>
                    ))}
                </Table>
              ))
          }
            </>
            )
      }
    </>
  )
}

SkeletonPlayerStatus.propTypes = {
  numberOfColumns: PropTypes.number,
  teams: PropTypes.bool
}

export default SkeletonPlayerStatus
