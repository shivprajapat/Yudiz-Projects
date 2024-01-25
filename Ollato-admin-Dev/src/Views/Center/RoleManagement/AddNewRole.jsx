import React, { useEffect, useRef, useState } from 'react'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import { Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addRoleAction, getAllModuleAction } from '../../../Actions/Admin/role'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSnackbar } from 'react-notistack'

function AddNewRole () {
  // Constant
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()

  // useState
  const [moduleRow, setModuleRow] = useState([])
  const [module, setModule] = useState([])
  // const [allrowselected, setAllrowSelected] = useState(false)
  const [cellCheck, setCellCheck] = useState({})

  // useSelector
  const moduleData = useSelector((state) => state.role.moduleData)
  const isRoleAdded = useSelector((state) => state.role.isRoleAdded)
  const isRoleAddedMessage = useSelector((state) => state.role.resMessage)

  // previousProps
  const previousProps = useRef({ moduleData }).current

  // useEffect
  useEffect(() => {
    dispatch(getAllModuleAction(token))
  }, [])

  useEffect(() => {
    if (previousProps?.moduleData !== moduleData) {
      const arr = []
      if (moduleData) {
        setModuleRow(moduleData)
        // eslint-disable-next-line array-callback-return
        moduleData?.map((data) => {
          arr.push({
            module_permission_id: data?.id,
            permissions: {
              list: data?.list === 1 ? false : null,
              create: data?.create === 1 ? false : null,
              view: data?.view === 1 ? false : null,
              update: data?.update === 1 ? false : null,
              delete: data?.delete === 1 ? false : null
            }
          })
        })
        setModule(arr)
      }
    }
    return () => {
      previousProps.moduleData = moduleData
    }
  }, [moduleData])

  const validationSchema = yup.object().shape({
    roleName: yup
      .string()
      .required('Role is required')
      .matches(/^[aA-zZ\s]+$/, 'Special Charaters & Numbers are not Allowed')
  })

  // useForm
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const handleAccessChange = (e, cell, row) => {
    const myData = module?.filter(
      (data) => data?.module_permission_id === row?.id
    )
    Object.entries(myData).forEach(([key]) => {
      const data = (myData[key].permissions.list = e.target.checked)
      return setModule(
        module?.map((obj) =>
          obj.module_permission_id === data.id ? Object.assign(obj) : obj
        )
      )
    })
    setCellCheck({ ...cellCheck, [row?.id]: e.target.checked })
  }

  // handle Access
  const handleAccess = (cell, row) => {
    if (row?.list === 1 || cell) {
      return <input type='checkbox' onChange={(e) => handleAccessChange(e, cell, row)} />
    } else {
      ;<span>N/A</span>
    }
  }

  // handle Add
  const handleAdd = (cell, row) => {
    const handleChange = (e) => {
      const myData = module?.filter(
        (data) => data?.module_permission_id === row?.id
      )
      Object.entries(myData).forEach(([key]) => {
        const data = (myData[key].permissions.create = e.target.checked)
        return setModule(
          module?.map((obj) =>
            obj.module_permission_id === data.id ? Object.assign(obj) : obj
          )
        )
      })
    }
    if (row?.create === 1) {
      return <input type='checkbox' onChange={(e) => handleChange(e)} />
    } else {
      return <span>N/A</span>
    }
  }

  // handle Edit
  const handleEdit = (cell, row) => {
    const handleChange = (e) => {
      const myData = module?.filter(
        (data) => data?.module_permission_id === row?.id
      )
      Object.entries(myData).forEach(([key]) => {
        const data = (myData[key].permissions.update = e.target.checked)
        return setModule(
          module?.map((obj) =>
            obj.module_permission_id === data.id ? Object.assign(obj) : obj
          )
        )
      })
    }
    if (row?.update === 1) {
      return <input type='checkbox' onChange={(e) => handleChange(e)} />
    } else {
      return <span>N/A</span>
    }
  }

  // handle View
  const handleView = (cell, row) => {
    const handleChange = (e) => {
      const myData = module?.filter(
        (data) => data?.module_permission_id === row?.id
      )
      Object.entries(myData).forEach(([key]) => {
        const data = (myData[key].permissions.view = e.target.checked)
        return setModule(
          module?.map((obj) =>
            obj.module_permission_id === data.id ? Object.assign(obj) : obj
          )
        )
      })
    }
    if (row?.view === 1) {
      return <input type='checkbox' onChange={(e) => handleChange(e)} />
    } else {
      return <span>N/A</span>
    }
  }

  // handle View
  const handleDelete = (cell, row) => {
    const handleChange = (e) => {
      const myData = module?.filter(
        (data) => data?.module_permission_id === row?.id
      )
      Object.entries(myData).forEach(([key]) => {
        const data = (myData[key].permissions.delete = e.target.checked)
        return setModule(
          module?.map((obj) =>
            obj.module_permission_id === data.id ? Object.assign(obj) : obj
          )
        )
      })
    }
    if (row?.delete === 1) {
      return <input type='checkbox' onChange={(e) => handleChange(e)} />
    } else {
      return <span>N/A</span>
    }
  }

  // const selectRow = {
  //   mode: 'checkbox',
  //   selectColumnPosition: 'right'
  // }

  const columns = [
    {
      dataField: 'module_name',
      text: 'Page'
    },
    {
      dataField: 'access_box',
      text: 'Access',
      formatter: handleAccess
    },
    {
      dataField: 'addBox',
      text: 'Add',
      formatter: handleAdd
    },
    {
      dataField: 'edit',
      text: 'Edit',
      formatter: handleEdit
    },
    {
      dataField: 'delete',
      text: 'Delete',
      formatter: handleDelete
    },
    {
      dataField: 'view',
      text: 'View',
      formatter: handleView
    }
  ]

  // onSubmit
  const onSubmit = (data) => {
    const roleData = {
      title: data?.roleName,
      modules: module
    }
    if (roleData) {
      dispatch(addRoleAction(roleData, token))
    }
  }

  // Notification for Add
  useEffect(() => {
    if (previousProps?.isRoleAdded !== isRoleAdded) {
      if (isRoleAdded) {
        enqueueSnackbar(`${isRoleAddedMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/role-management')
      } else if (isRoleAdded === false) {
        enqueueSnackbar(`${isRoleAddedMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isRoleAdded = isRoleAdded
    }
  }, [isRoleAdded])

  return (
    <>
          <TitleHeader name='Add' title='Add Role' />
          <div className='main-layout '>
            <div className='heading-box'>
              <h5>Add</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  className='theme-btn text-none'
                  onClick={handleSubmit(onSubmit)}
                >
                  Save
                </button>
              </div>
            </div>
            <div className='light-bg-box'>
              <div className='main-layout text-left'>
                <Form.Group className='form-group' controlId='roleName'>
                  <Form.Label>*Role Name</Form.Label>
                  <Form.Control
                    placeholder='Enter Role Name'
                    type='text'
                    {...register('roleName', {
                      required: 'true'
                    })}
                  />
                  {errors.roleName?.message && (
                    <Form.Text className='error-msg'>
                      {errors.roleName?.message}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>*User Permissions</Form.Label>
                  <BootstrapTable
                    keyField='id'
                    data={moduleRow}
                    remote={true}
                    columns={columns}
                    responsive='md'
                    noDataIndication={() => (
                      <Spinner className='text-center' animation='border' />
                    )}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
    </>
  )
}

export default AddNewRole
