import React from 'react'
import PropTypes from 'prop-types'

export default function JobProfile({ fill }) {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill={fill}
          d="M11 12q-1.65 0-2.825-1.175T7 8q0-1.65 1.175-2.825T11 4q1.65 0 2.825 1.175T15 8q0 1.65-1.175 2.825T11 12Zm11.1 11.5l-3.2-3.2q-.525.3-1.125.5T16.5 21q-1.875 0-3.187-1.313T12 16.5q0-1.875 1.313-3.188T16.5 12q1.875 0 3.188 1.313T21 16.5q0 .675-.2 1.275t-.5 1.125l3.2 3.2l-1.4 1.4ZM16.5 19q1.05 0 1.775-.725T19 16.5q0-1.05-.725-1.775T16.5 14q-1.05 0-1.775.725T14 16.5q0 1.05.725 1.775T16.5 19Zm-5.475-6q-1.05 1.55-1.05 3.5t1.05 3.5H3v-2.775q0-.85.425-1.575t1.175-1.1q1.275-.65 2.875-1.1t3.55-.45Z"
        />
      </svg>
    </>
  )
}
JobProfile.propTypes = {
  fill: PropTypes.string,
}
