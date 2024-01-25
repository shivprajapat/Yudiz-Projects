import { Card, CardContent } from '@material-ui/core'
import PageTitle from 'components/PageTitle'
import React from 'react'
import UserForm from '../user-form'

function UserAdd() {
  return (
    <>
      <PageTitle title={'Add User'} />
      <Card>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </>
  )
}

export default UserAdd
