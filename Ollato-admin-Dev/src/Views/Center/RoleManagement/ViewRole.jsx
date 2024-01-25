import React, { useEffect, useState, useRef } from 'react'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import { Form, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllModuleAction,
  getSpecificRoleData
} from '../../../Actions/Admin/role'

function ViewRole () {
  // Constant
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const rowStyle = { backgroundColor: ' #e9ecef' }

  // useState
  const [moduleRow, setModuleRow] = useState([])

  // const [module, setModule] = useState([])

  // useSelector
  const mainData = useSelector((state) => state.role.resData)
  const moduleData = useSelector((state) => state.role.moduleData)

  // previousProps
  const previousProps = useRef({ moduleData }).current

  // useEffect to get data
  useEffect(() => {
    dispatch(getAllModuleAction(token))
    dispatch(getSpecificRoleData(Number(id), token))
  }, [])

  useEffect(() => {
    if (previousProps?.moduleData !== moduleData) {
      if (moduleData) {
        setModuleRow(moduleData)
      }
    }
    return () => {
      previousProps.moduleData = moduleData
    }
  }, [moduleData])

  // handle Add
  const handleAdd = (cell, row) => {
    if (row?.create === 1) {
      return <>
      <input type='checkbox' checked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.create === 1 ? 1 : 0} disabled />
    </>
    } else {
      return <span>N/A</span>
    }
  }

  // handle Access
  const handleAccess = (cell, row) => {
    if (row?.list === 1) {
      return <input type='checkbox' checked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.list === 1 ? 1 : 0} disabled />
    } else {
      return <span>N/A</span>
    }
  }

  // handle Edit
  const handleEdit = (cell, row) => {
    if (row?.update === 1) {
      return <input type='checkbox' checked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.update === 1 ? 1 : 0} disabled />
    } else {
      return <span>N/A</span>
    }
  }

  // handle View
  const handleView = (cell, row) => {
    if (row?.view === 1) {
      return <input type='checkbox' checked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.view === 1 ? 1 : 0} disabled />
    } else {
      return <span>N/A</span>
    }
  }

  // handle delete
  const handledelete = (cell, row) => {
    if (row?.delete === 1) {
      return <input type='checkbox' checked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.delete === 1 ? 1 : 0} disabled />
    } else {
      return <span>N/A</span>
    }
  }

  const columns = [
    {
      dataField: 'module_name',
      text: 'Page'
    },
    {
      dataField: 'list',
      text: 'Access',
      formatter: handleAccess
    },
    {
      dataField: 'create',
      text: 'Add',
      formatter: handleAdd
    },
    {
      dataField: 'update',
      text: 'Edit',
      formatter: handleEdit
    },
    {
      dataField: 'delete',
      text: 'Delete',
      formatter: handledelete
    },
    {
      dataField: 'view',
      text: 'View',
      formatter: handleView
    }
  ]

  return (
    <>
          <TitleHeader name='View' title='View Role' />
          <div className='main-layout whitebox-layout'>
            <div className='profilebutton-box text-end'>
              <button
                className='theme-btn dark-btn text-none'
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
            <div className='light-bg-box'>
              <div className='main-layout text-left'>
                <Form.Group className='form-group' controlId='roleName'>
                  <Form.Label>*Role Name</Form.Label>
                  <Form.Control value={mainData?.title} disabled />
                </Form.Group>
                <Form.Group>
                  <Form.Label>*User Permissions</Form.Label>
                  {mainData &&
                  <BootstrapTable
                    rowStyle={rowStyle}
                    keyField='role'
                    data={moduleRow}
                    columns={columns}
                    responsive='md'
                    noDataIndication={() => (
                      <Spinner className='text-center' animation='border' />
                    )}
                  /> }
                </Form.Group>
              </div>
            </div>
          </div>
    </>
  )
}

export default ViewRole
