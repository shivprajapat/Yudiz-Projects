import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonMoreData (props) {
  const { length } = props
  return (
    <>
      {Array(length)
        .fill()
        .map((index) => (
          <div key={index} className="user-container">
            <div className="userprofile mt-3">
              <ul className="p-links">
                <li style={{ textAlign: 'left' }}>
                  <Skeleton className="mt-3 mb-3" height={20} width={280} />
                </li>
                <li style={{ textAlign: 'left' }}>
                  <Skeleton className="mt-3 mb-3" height={20} width={280} />
                </li>
                <li style={{ textAlign: 'left' }}>
                  <Skeleton className="mt-3 mb-3" height={20} width={280} />
                </li>
                <li style={{ textAlign: 'left' }}>
                  <Skeleton className="mt-3 mb-3" height={20} width={280} />
                </li>
                <li style={{ textAlign: 'left' }}>
                  <Skeleton className="mt-3 mb-3" height={20} width={280} />
                </li>
                <li style={{ textAlign: 'left' }}>
                  <Skeleton className="mt-3 mb-3" height={20} width={280} />
                </li>
              </ul>
            </div>
            <p className="mt-3 moreVersion"><Skeleton className="mt-3 mb-3" height={20} width={150} /></p>
          </div>
        ))}
    </>
  )
}

SkeletonMoreData.defaultProps = {
  length: 5
}

SkeletonMoreData.propTypes = {
  length: PropTypes.number
}

export default SkeletonMoreData
