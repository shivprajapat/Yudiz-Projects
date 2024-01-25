import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddPermission from './AddPermission'
import NavBar from '../../../components/Navbar'
import { addPermission, updatePermission, getPermissionDetails } from '../../../actions/permission'
import PropTypes from 'prop-types'

function AddSubAdmin (props) {
  const token = useSelector(state => state.auth.token)
  const permissionDetails = useSelector(state => state.permission.permissionDetails)
  const dispatch = useDispatch()

  function AddPermissionFunc (sName, sKey, eStatus) {
    dispatch(addPermission(sName, sKey, eStatus, token))
  }
  function EditPermissionFunc (Name, Key, permissionStatus, ID) {
    const updatedPermissionData = {
      Name, Key, permissionStatus, ID, token
    }
    dispatch(updatePermission(updatedPermissionData))
  }

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getPermissionDetails(match.params.id, token))
    }
  }, [])

  return (
  <Fragment>
    <NavBar {...props} />
    <AddPermission
      {...props}
      AddPermissionFunc={AddPermissionFunc}
      UpdatePermission={EditPermissionFunc}
      PermissionDetails={permissionDetails}
      cancelLink="/sub-admin/permission"
    />
  </Fragment>
  )
}

AddSubAdmin.propTypes = {
  match: PropTypes.object
}

export default AddSubAdmin
