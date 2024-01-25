import React from 'react'
import Header from '../../../components/Header'
import NavBar from '../../../components/Navbar'
import ChangePasswordContent from './changePassword'

function ChangePassword (props) {
  return (
  <div>
    <Header />
    <NavBar {...props} />
    <ChangePasswordContent />
  </div>
  )
}
export default ChangePassword
