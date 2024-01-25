import React from 'react'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonMore (props) {
  const { table } = props
  return (
    // <table width={100}>
    <>
      {table
        ? (Array(10).fill()
            .map((KeyIndex) => (
              <tr key={KeyIndex}>
                <td>
                  {' '}
                  <Skeleton width="60%" />
                  {' '}
                </td>
                <td>
                  {' '}
                  <Skeleton width="40%" />
                  {' '}
                </td>
                {/* <td>
                {' '}
                <Skeleton width="20%" />
                {' '}
              </td> */}
              </tr>
            ))
          )
        : (Array(10).fill()
            .map((KeyIndex) => (
              <tr key={KeyIndex}>
                <td>
                  {' '}
                  <Skeleton width="70%" />
                  {' '}
                </td>
                <td>
                  {' '}
                  <Skeleton width="20%" />
                  {' '}
                </td>
              </tr>
            ))
          )}
    </>
    //  </table>
  )
}

SkeletonMore.defaultProps = {
  table: ''
}

SkeletonMore.propTypes = {
  table: PropTypes.bool
}

export default SkeletonMore
