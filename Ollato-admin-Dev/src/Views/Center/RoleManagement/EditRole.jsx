import React, { useEffect, useRef, useState } from 'react'
import TitleHeader from '../../../Components/TitleHeader'
import BootstrapTable from 'react-bootstrap-table-next'
import { Form, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as yup from 'yup'
import { useSnackbar } from 'react-notistack'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { editSpecificRole, getAllModuleAction, getSpecificRoleData } from '../../../Actions/Admin/role'

function EditRole () {
  // Constant
  const navigate = useNavigate()
  const { id } = useParams()
  const dispatch = useDispatch()
  const token = localStorage.getItem('token')
  const { enqueueSnackbar } = useSnackbar()

  // useState
  const [moduleRow, setModuleRow] = useState([])
  // const [roleName, setRoleName] = useState('')
  const [module, setModule] = useState([])
  // const [allrole, setAllRole] = useState([])

  // useSelector
  const mainData = useSelector((state) => state.role.resData)
  const moduleData = useSelector((state) => state.role.moduleData)
  const isEditedData = useSelector(state => state.role.isRoleEdited)
  const editedResMessage = useSelector(state => state.role.resMessage)

  // previousProps
  const previousProps = useRef({ moduleData, isEditedData, editedResMessage }).current

  // useEffect to get data
  useEffect(() => {
    dispatch(getSpecificRoleData(Number(id), token))
    dispatch(getAllModuleAction(token))
  }, [])
  useEffect(() => {
    if (previousProps?.moduleData !== moduleData) {
      const arr = []
      if (mainData) {
        setModuleRow(moduleData)
        /* eslint-disable */
        moduleData?.map((data) => {
          const matcharray=mainData.role_permissions.find(i=>i.module_permission_id===data.id)
          arr.push({
            id:matcharray ? matcharray.id : "", 
            module_permission_id: data.id,
            permissions: {
              list:data.list === 0 ? null : +matcharray?.list === 0 ? false : +matcharray?.list === 1 ? true : false,
              create:data.create === 0 ? null : +matcharray?.create === 0 ? false : +matcharray?.create === 1 ? true : false,
              view:data.view === 0 ? null : +matcharray?.view === 0 ? false : +matcharray?.view === 1 ? true : false,
              update:data.update === 0 ? null : +matcharray?.update === 0 ? false : +matcharray?.update === 1 ? true : false,
              delete:data.delete === 0 ? null : +matcharray?.delete === 0 ? false : +matcharray?.delete === 1 ? true : false
            }
          })
        /* eslint-enable */
        })
        setModule(arr)
      }
    }
    return () => {
      previousProps.moduleData = moduleData
    }
  }, [mainData])

  useEffect(() => {
    if (mainData) {
      reset({
        roleName: mainData?.title
      })
    }
    // setAllRole(mainData)
  }, [mainData])

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
    onChange,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

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
      return <>
      <input type='checkbox' defaultChecked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.create === 1 ? 1 : 0} onChange={(e) => handleChange(e)}/>
    </>
    } else {
      return <span>N/A</span>
    }
  }

  // handle Access
  const handleAccess = (cell, row) => {
    const handleChange = (e) => {
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
    }
    if (row?.list === 1) {
      return <input type='checkbox' defaultChecked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.list === 1 ? 1 : 0} onChange={(e) => handleChange(e)}/>
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
      return <input type='checkbox' defaultChecked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.update === 1 ? 1 : 0} onChange={(e) => handleChange(e)} />
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
      return <input type='checkbox' defaultChecked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.view === 1 ? 1 : 0} onChange={(e) => handleChange(e)}/>
    } else {
      return <span>N/A</span>
    }
  }

  // handle delete
  const handledelete = (cell, row) => {
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
      return <input type='checkbox' defaultChecked={+mainData?.role_permissions?.find(i => +i.module_permission_id === row.id)?.delete === 1 ? 1 : 0} onChange={(e) => handleChange(e)}/>
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

  // onSubmit
  const onSubmit = (data) => {
    const roleData = {
      id,
      title: data?.roleName,
      modules: module
    }
    if (roleData) {
      dispatch(editSpecificRole(roleData, token))
    }
  }

  // Notification for Edit
  useEffect(() => {
    if (previousProps?.isEditedData !== isEditedData) {
      if (isEditedData) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'success',
          hide: 2000,
          autoHide: true
        })
        navigate('/admin/role-management')
      } else if (isEditedData === false) {
        enqueueSnackbar(`${editedResMessage}`, {
          variant: 'error',
          hide: 2000,
          autoHide: true,
          TransitionComponent: 'Fade'
        })
      }
    }
    return () => {
      previousProps.isEditedData = isEditedData
    }
  }, [isEditedData])

  return (
    <>
          <TitleHeader name='Edit' title='Edit Role' />
          <Form className='light-bg'>
          <div className='main-layout whitebox-layout'>
            <div className='heading-box'>
              <h5>Edit Role</h5>
              <div className='btn-box'>
                <button
                  className='theme-btn dark-btn text-none'
                  onClick={() => navigate('/admin/role-management')}
                >
                  Cancel
                </button>
                <button className='theme-btn text-none' onClick={handleSubmit(onSubmit)} >Save</button>
              </div>
            </div>
            <div className='light-bg-box'>
              <div className='main-layout text-left'>
                <Form.Group className='form-group' controlId='roleName'>
                  <Form.Label>*Role Name</Form.Label>
                  <Form.Control placeholder='Enter Role Name' onChange={(e) => { onChange(e) }
                    } { ...register('roleName', { required: 'true' }) }/>
                    {errors.roleName?.message && (
                        <Form.Text className='error-msg'>
                          {errors.roleName?.message}
                        </Form.Text>
                    )}
                </Form.Group>
                <Form.Group>
                  <Form.Label>*User Permissions</Form.Label>
                  {/* {allrole?.role_permissions && */}
                  {mainData &&
                  <BootstrapTable
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
          </Form>
    </>
  )
}

export default EditRole
