import React from 'react'
import Navbar from '../../../../components/Navbar'
import UpdateComplaint from './UpdateComplaint'

function UpdateComplaintComponent (props) {
  return (
    <div>
      <Navbar {...props} />
      <UpdateComplaint {...props} />
    </div>
  )
}

export default UpdateComplaintComponent
