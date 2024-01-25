import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import UserDebugging from '../../../Users/UserManagement/UserDebugging/UserDebugging'
import Navbar from '../../../../components/Navbar'
import { getSystemUserDetails } from '../../../../actions/systemusers'

function SystemUserDebugging (props) {
  const { match } = props
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const systemUserDetails = useSelector(state => state.systemusers.systemUserDetails)

  useEffect(() => {
    if (match && match.params && match.params.id) {
      dispatch(getSystemUserDetails(match.params.id, token))
    }
  }, [])

  return (
    <Fragment>
      <Navbar {...props} />
      <UserDebugging
        usersDetails={systemUserDetails}
        systemUser
        {...props} />
    </Fragment>
  )
}

SystemUserDebugging.propTypes = {
  match: PropTypes.object
}

export default SystemUserDebugging
