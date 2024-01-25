import { getAllPermission } from 'query/sub-admin/subAdmin.query'
import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import DataTable from 'shared/components/data-table'
import PermissionRow from 'shared/components/permission-row'

export default function AddEditSubAdmin() {
  const { id } = useParams()
  const [permissionList, setPermissionList] = useState([])
  const tableColumns = [
    { name: <FormattedMessage id='selectAll' />, internalName: 'selectAll' },
    { name: <FormattedMessage id='permissions' />, internalName: 'permissionName' },
    { name: <FormattedMessage id='C' />, internalName: 'create' },
    { name: <FormattedMessage id='R' />, internalName: 'read' },
    { name: <FormattedMessage id='U' />, internalName: 'update' },
    { name: <FormattedMessage id='D' />, internalName: 'delete' }
  ]

  const [columns] = useState(tableColumns)

  useQuery('allPermissions', () => getAllPermission(), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setPermissionList(response)
    },
    onError: () => {
      setPermissionList([])
    }
  })

  return (
    <Form>
      <div className='login-detail add-border mt-0'>
        <h2 className='title-txt'>
          <FormattedMessage id='createSubAdmin' />
        </h2>
        <Row>
          <Col sm='4'>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='userName' />*
              </Form.Label>
              <Form.Control type='text' name='sUserName' autoComplete='new-password' />
              <Form.Control.Feedback type='invalid'>error</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm='4'>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='email' />*
              </Form.Label>
              <Form.Control type='password' name='sPassword' autoComplete='new-password' />
              <Form.Control.Feedback type='invalid'>error</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col sm='4'>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='mobileNo' />*
              </Form.Label>
              <Form.Control type='password' name='sConfirmPassword' autoComplete='new-password' />
              <Form.Control.Feedback type='invalid'>error</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <DataTable columns={columns}>
              {permissionList?.map((data) => {
                return <PermissionRow permissions={data} />
              })}
            </DataTable>
          </Col>
        </Row>
      </div>
      <div className={`btn-bottom add-border ${id && 'mt-0'}`}>
        <Button type='submit' variant='primary' disabled>
          <FormattedMessage id='create' />
        </Button>
      </div>
    </Form>
  )
}
