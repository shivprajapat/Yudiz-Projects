import React, { useState } from 'react'
import BankDetailsPage from './BankDetailsPage'
import UserHeader from '../components/UserHeader'
function BankDetails (props) {
  const [editable, setEditable] = useState(false)
  return (
    <>
      <UserHeader {...props} backURL="/withdraw" editable={editable} setEditable={setEditable} title="Bank Details" />
      <BankDetailsPage {...props} editable={editable} setEditable={setEditable}/>
    </>
  )
}

export default BankDetails
