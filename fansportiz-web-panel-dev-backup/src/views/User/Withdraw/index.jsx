import React from 'react'
import WithdrawPage from './Withdraw'
import UserHeader from '../components/UserHeader'
function Withdraw (props) {
  return (
    <>
      <UserHeader {...props} backURL='/profile' title="Withdraw"/>
      <WithdrawPage {...props}/>
    </>
  )
}

export default Withdraw
