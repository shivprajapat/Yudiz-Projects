import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { addRole, getRoleDetails, updateRole } from '../../../../actions/role'
import AddRole from './AddRole'
import Navbar from '../../../../components/Navbar'

function IndexAddRole (props) {
  const token = useSelector(state => state.auth.token)
  const roleDetails = useSelector(state => state.role.roleDetails)
  const dispatch = useDispatch()

  function addRoleFunc (name, permissions, roleStatus) {
    const addRoleData = {
      name, roleStatus, permissions, token
    }
    dispatch(addRole(addRoleData))
  }
  function updateRoleFunc (name, permissions, roleStatus, roleId) {
    const updateRoleData = {
      name, permissions, roleStatus, roleId, token
    }
    dispatch(updateRole(updateRoleData))
  }

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getRoleDetails(match.params.id, token))
    }
  }, [])

  return (
  <Fragment>
    <Navbar {...props} />
    <AddRole
      {...props}
      addRoleFunc={addRoleFunc}
      updateRoleFunc={updateRoleFunc}
      roleDetails={roleDetails}
      cancelLink="/sub-admin/roles"
    />
  </Fragment>
  )
}

IndexAddRole.propTypes = {
  match: PropTypes.object
}

export default IndexAddRole
