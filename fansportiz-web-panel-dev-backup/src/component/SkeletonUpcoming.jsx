import React, { Fragment } from 'react'
import Skeleton from 'react-loading-skeleton'
import PropTypes from 'prop-types'
import { Card } from 'reactstrap'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonUpcoming (props) {
  const { scoredData } = props
  return (
    <Fragment>
      {
        scoredData
          ? (
            <Fragment>
              {Array(1)
                .fill()
                .map((item, index) => (
                  <Card key={index} className='mt-2 ms-2 me-2 scorecard'>
                    <h4><Skeleton height={15} width={200} /></h4>
                    <p>
                      <span className="t-name">
                        <b>
                          {' '}
                          <Skeleton height={10} width={50} />
                          {' '}
                        </b>
                        {' '}
                      </span>
                      <span className='ms-3'>
                        {' '}
                        <Skeleton height={10} width={150} />
                        {' '}
                      </span>
                    </p>
                    <p>
                      <span className="t-name">
                        <b>
                          {' '}
                          <Skeleton height={10} width={50} />
                          {' '}
                        </b>
                        {' '}
                      </span>
                      <span className='ms-3'>
                        {' '}
                        <Skeleton height={10} width={150} />
                        {' '}
                      </span>
                    </p>
                    <div className="w-txt">
                      {' '}
                      <Skeleton height={10} width={350} />
                      {' '}
                    </div>
                  </Card>
                ))}
            </Fragment>
            )
          : (
            <Fragment>
              {Array(3)
                .fill()
                .map((item, index) => (
                  <Card key={index} className="leagues-card border-0">
                    <div key={index} className="match-box px-0">
                      <div key={index} className="match-i">
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
                ))}
            </Fragment>
            )
      }
    </Fragment>
  )
}

SkeletonUpcoming.propTypes = {
  scoredData: PropTypes.bool
}
export default SkeletonUpcoming
