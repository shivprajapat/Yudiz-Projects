import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonTable (props) {
  const { Lines, series } = props
  return (
    <>
      {Array(Lines || 3)
        .fill()
        .map((index) => (
          <tr key={index} className={series && 'mt-3 mb-3'}>
            <td>
              {' '}
              <Skeleton width="40%" />
              {' '}
            </td>
            <td className="align_right">
              {' '}
              <Skeleton width="25%" />
              {' '}
            </td>
            {
              series && (
              <td className="align_right">
                <Skeleton width="25%" />
              </td>
              )
            }
          </tr>
        ))}
    </>
  )
}

SkeletonTable.defaultProps = {
  series: 5,
  Lines: 5
}

SkeletonTable.propTypes = {
  Lines: PropTypes.number,
  series: PropTypes.bool
}

export default SkeletonTable
