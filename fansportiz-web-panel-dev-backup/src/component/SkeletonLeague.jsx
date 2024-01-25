import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import { Card } from 'reactstrap'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLeague (props) {
  const { leagueDetails, length } = props
  return (
    <>
      {
      leagueDetails
        ? (Array(length).fill().map((index) => (
          <Card key={index} className="mt-1 ms-2 me-2 leagues-card">
            <div key={index} className="match-box me-3">
              <div className="d-flex justify-content-between my-2">
                <Skeleton height={20} width={150} />
                <Skeleton height={20} width={150} />
              </div>
              <div className="d-flex justify-content-between my-3">
                <Skeleton height={20} width={200} />
                <Skeleton height={20} width={100} />
              </div>
              <center>
                <Skeleton className="mt-2" height={10} width={390} />
              </center>
              <div className="d-flex justify-content-between my-3">
                <Skeleton height={20} width={100} />
                <Skeleton height={20} width={80} />
              </div>
              <div className="d-flex justify-content-between my-3">
                <div>
                  <Skeleton className="me-2" height={20} width={20} />
                  <Skeleton className="me-2" height={20} width={20} />
                  <Skeleton height={20} width={20} />
                </div>
                <Skeleton height={20} width={50} />
              </div>
              <div className="d-flex justify-content-between my-3">
                <Skeleton className="me-2" height={20} width={40} />
                <Skeleton className="me-2" height={20} width={40} />
                <Skeleton className="me-2" height={20} width={40} />
                <Skeleton className="me-2" height={20} width={40} />
                <Skeleton height={20} width={40} />
              </div>
            </div>
          </Card>
          ))
          )
        : (
          <>
            {Array(3)
              .fill()
              .map((index) => (
                <Fragment key={index}>
                  <Card className="mt-3 ms-2 me-2 leagues-card justify-content-between">
                    <div>
                      <Skeleton circle className="mb-2 ms-2" height={20} width={20} />
                      <Skeleton className="mb-2 ms-2 mt-2" height={20} width={300} />
                    </div>
                  </Card>
                  {
                Array(2)
                  .fill()
                  .map((index) => (
                    <Card key={index} className="mt-3 ms-2 me-2 leagues-card">
                      <div key={`div+${index}`} className="match-box me-3">
                        <div className="d-flex justify-content-between">
                          <Skeleton height={20} width={150} />
                          <Skeleton height={20} width={150} />
                        </div>
                        <div className="d-flex justify-content-between">
                          <Skeleton height={20} width={200} />
                          <Skeleton height={20} width={100} />
                        </div>
                        <center>
                          <Skeleton className="mt-2" height={10} width={400} />
                        </center>
                        <div className="d-flex justify-content-between">
                          <div>
                            <Skeleton className="me-2" height={20} width={20} />
                            <Skeleton className="me-2" height={20} width={20} />
                            <Skeleton height={20} width={20} />
                          </div>
                          <Skeleton height={20} width={50} />
                        </div>
                      </div>
                    </Card>
                  ))
              }
                </Fragment>
              ))}
          </>
          )
      }
    </>
  )
}

SkeletonLeague.propTypes = {
  leagueDetails: PropTypes.bool,
  length: PropTypes.number
}

export default SkeletonLeague
