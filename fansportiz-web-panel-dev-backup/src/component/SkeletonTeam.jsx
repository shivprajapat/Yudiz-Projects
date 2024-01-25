import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonTeam (props) {
  const { length } = props
  return (
    Array(length).fill().map((index) => (
      <div key={index} className="my-team">
        <div className="mt-header d-flex align-items-center justify-content-between"><Skeleton height={15} width={60} /></div>
        <div className="team-p d-flex align-items-center bg-white noBackGround">
          <div className="player">
            <div className="img">
              <Skeleton circle height={65} width={65} />
            </div>
            <Skeleton height={15} width={50} />
          </div>
          <div className="player">
            <div className="img">
              <Skeleton circle height={65} width={65} />
            </div>
            <Skeleton height={15} width={50} />
          </div>
          <div className="player">
            <div className="img">
              <Skeleton circle height={65} width={65} />
            </div>
            <Skeleton height={15} width={50} />
          </div>
        </div>
        <hr className="m-0" />
        <div className="mt-footer bg-white d-flex align-items-center justify-content-around">
          <span>
            <Skeleton height={20} width={30} />
            <Skeleton className="ms-1" height={20} width={20} />
          </span>
          <span>
            <Skeleton height={20} width={30} />
            <Skeleton className="ms-1" height={20} width={20} />
          </span>
          <span>
            <Skeleton height={20} width={30} />
            <Skeleton className="ms-1" height={20} width={20} />
          </span>
          <span>
            <Skeleton height={20} width={30} />
            <Skeleton className="ms-1" height={20} width={20} />
          </span>
        </div>
      </div>
    ))
  )
}

SkeletonTeam.propTypes = {
  length: PropTypes.number
}

export default SkeletonTeam
