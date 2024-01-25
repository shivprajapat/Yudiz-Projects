import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonProfile (props) {
  const { length } = props
  return (
    <>
      {Array(length)
        .fill()
        .map((index) => (
          <div key={index} className="user-container">
            <div className="userprofile" style={{ backgroundColor: 'white', textAlign: 'center' }}>
              <Skeleton circle className="mt-3" height={150} width={150} />
              <div className="u-name">
                <Skeleton height={20} width={80} />
              </div>
              <div className="d-flex align-items-center justify-content-around mt-3">
                <Skeleton height={180} width={450} />
              </div>
              <div className="d-flex align-items-center justify-content-around mt-3">
                <Skeleton height={50} width={450} />
              </div>
              <center>
                <div className="u-matchinfo d-flex align-items-center justify-content-center" style={{ textAlign: 'center' }}>
                  <div className="me-5">
                    <Skeleton height={95} width={95} />
                  </div>
                  <div className="ms-2 me-5">
                    <Skeleton height={95} width={95} />
                  </div>
                  <div className="ms-2">
                    <Skeleton height={95} width={95} />
                  </div>
                </div>
              </center>
              <div className="d-flex align-items-center justify-content-around mt-3">
                <Skeleton className="mb-3" height={200} width={450} />
              </div>
            </div>
          </div>
        ))}
    </>
  )
}

SkeletonProfile.defaultProps = {
  length: 5
}

SkeletonProfile.propTypes = {
  length: PropTypes.number
}

export default SkeletonProfile
