import React from 'react'
import PropTypes from 'prop-types'

export default function Compare({ fill }) {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill={fill} d="m15.3 13.3l-3.6-3.6q-.15-.15-.212-.325T11.425 9q0-.2.063-.375T11.7 8.3l3.6-3.6q.3-.3.7-.3t.7.3q.3.3.3.713t-.3.712L14.825 8H21q.425 0 .713.288T22 9q0 .425-.288.713T21 10h-6.175l1.875 1.875q.3.3.3.7t-.3.7q-.3.3-.687.325t-.713-.3Zm-8 5.975q.3.3.7.313t.7-.288l3.6-3.6q.15-.15.212-.325t.063-.375q0-.2-.063-.375T12.3 14.3l-3.6-3.6q-.3-.3-.7-.3t-.7.3q-.3.3-.3.713t.3.712L9.175 14H3q-.425 0-.713.288T2 15q0 .425.288.713T3 16h6.175L7.3 17.875q-.3.3-.3.7t.3.7Z"></path></svg>
    </>
  )
}
Compare.propTypes = {
  fill: PropTypes.string,
}