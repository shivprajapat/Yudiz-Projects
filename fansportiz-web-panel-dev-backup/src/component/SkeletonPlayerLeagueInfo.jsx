import React from 'react'
import { Card } from 'reactstrap'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonPlayerLeagueInfo (props) {
  const { length } = props
  return (
    <>
      {
        Array(length || 2)
          .fill()
          .map((index) => (
            <Card key={index} className="mt-3 ms-2 me-2 leagues-card">
              <div>
                <li>
                  <div className="d-flex">
                    <h3 className="l-name">
                      <Skeleton height={20} width={200} />
                      {' '}
                    </h3>
                    <span className="l-date">
                      <Skeleton height={15} width={50} />
                      {' '}
                    </span>
                  </div>
                  <div className="d-flex mt-2">
                    <div className="l-state">
                      <p><Skeleton height={10} width={70} /></p>
                      <b><Skeleton height={10} width={50} /></b>
                    </div>
                    <div className="l-state text-center">
                      <p><Skeleton height={10} width={50} /></p>
                      <b><Skeleton height={10} width={30} /></b>
                    </div>
                    <div className="l-state text-end">
                      <p><Skeleton height={10} width={80} /></p>
                      <b><Skeleton height={10} width={50} /></b>
                    </div>
                  </div>
                </li>
              </div>
            </Card>
          ))
      }
    </>

  )
}

SkeletonPlayerLeagueInfo.defaultProps = {
  length: 5
}

SkeletonPlayerLeagueInfo.propTypes = {
  length: PropTypes.number
}

export default SkeletonPlayerLeagueInfo
