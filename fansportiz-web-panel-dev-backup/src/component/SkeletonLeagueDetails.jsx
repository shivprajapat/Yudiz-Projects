import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLeagueDetails () {
  return (
    <>
      {Array(3)
        .fill()
        .map((index) => (
          <tr key={index}>
            <td>
              {' '}
              <Skeleton width="60%" />
              {' '}
            </td>
            <td className="align_right">
              {' '}
              <Skeleton width="40%" />
              {' '}
            </td>
          </tr>
        ))}
    </>
  )
}

export default SkeletonLeagueDetails
