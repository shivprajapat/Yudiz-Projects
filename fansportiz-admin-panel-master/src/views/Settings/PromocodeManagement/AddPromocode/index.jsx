import React from 'react'
import Navbar from '../../../../components/Navbar'
import AddPromocode from './AddPromocode'

function index (props) {
  return (
    <div>
      <Navbar {...props} />
      <AddPromocode {...props} />
    </div>
  )
}

export default index
