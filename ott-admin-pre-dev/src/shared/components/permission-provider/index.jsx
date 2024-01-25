import PropTypes from 'prop-types'
import { getUserPermission } from 'query/permissions/permissions.query'
import { useState } from 'react'
import { useQuery } from 'react-query'

function PermissionProvider({ children, isAllowedTo, isAllowedToModule }) {
  const [permissions, setPermissions] = useState()
  useQuery(['permission'], () => getUserPermission(), {
    select: (data) => data.data.data.admin,
    onSuccess: (response) => {
      setPermissions(response)
    },
    onError: () => {
      setPermissions({})
    }
  })

  if (permissions?.eUserType === 'super') {
    return children
  } else if (permissions?.aPermissions?.find((per) => per.eModuleName === isAllowedToModule && per.aOperations.includes(isAllowedTo))) {
    return children
  }
}
PermissionProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isAllowedTo: PropTypes.string.isRequired
}
export default PermissionProvider
