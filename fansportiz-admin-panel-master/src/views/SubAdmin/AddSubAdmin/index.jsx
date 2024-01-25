import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../../components/Header'
import NavBar from '../../../components/Navbar'
import AddSubAdminForm from './AddSubAdmin'
import { addSubadmin, updateSubadmin, getSubadminDetails } from '../../../actions/subadmin'
import PropTypes from 'prop-types'

function AddSubAdmin (props) {
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const subadminDetails = useSelector(state => state.subadmin.subadminDetails)

  useEffect(() => {
    const { match } = props
    if (match.params.id) {
      dispatch(getSubadminDetails(match.params.id, token))
    }
  }, [])

  function addSubAdminFun (fullname, username, email, MobNum, password, aRole, subAdminStatus) {
    const addSubAdminData = {
      fullname, username, email, MobNum, password, aRole, token, subAdminStatus
    }
    dispatch(addSubadmin(addSubAdminData))
  }

  function updateSubAdminFun (fullname, username, email, MobNum, password, aRole, ID, subAdminStatus) {
    const updateSubAdminData = {
      fullname, username, email, MobNum, password, aRole, ID, token, subAdminStatus
    }
    dispatch(updateSubadmin(updateSubAdminData))
  }

  return (
  <Fragment>
    <Header />
    <NavBar {...props} />
    <AddSubAdminForm
      {...props}
      addSubAdmin={addSubAdminFun}
      updateSubAdmin={updateSubAdminFun}
      SubAdminDetails={subadminDetails}
    />
  </Fragment>
  )
}

AddSubAdmin.propTypes = {
  match: PropTypes.object
}

export default AddSubAdmin
