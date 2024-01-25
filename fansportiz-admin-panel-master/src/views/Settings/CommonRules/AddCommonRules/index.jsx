import React from 'react'
import Navbar from '../../../../components/Navbar'
import AddRuleComponent from './Addrule'

function AddRule (props) {
  return (
    <div>
      <Navbar {...props} />
      <AddRuleComponent {...props} />
    </div>
  )
}

export default AddRule
