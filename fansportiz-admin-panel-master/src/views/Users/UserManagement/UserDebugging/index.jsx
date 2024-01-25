import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import NavbarComponent from '../../../../components/Navbar'
import UserDebuggingPage from './UserDebugging'
import { getUserDetails } from '../../../../actions/users'

function UserDebugging (props) {
  const { match } = props
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const usersDetails = useSelector(state => state.users.usersDetails)

  useEffect(() => {
    if (match && match.params && match.params.id) {
      dispatch(getUserDetails(match.params.id, token))
    }
  }, [])

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <UserDebuggingPage usersDetails={usersDetails} user {...props} />
    </Fragment>
  )
}

UserDebugging.propTypes = {
  match: PropTypes.object
}

export default UserDebugging
