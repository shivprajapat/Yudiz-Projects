import React, {
  Fragment, useEffect, useRef, useState
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRolesList } from '../../../actions/role'
import Navbar from '../../../components/Navbar'
import SubAdminHeader from '../components/SubAdminHeader'
import PropTypes from 'prop-types'
import RolesList from './RolesList'
import qs from 'query-string'

function Roles (props) {
  const content = useRef()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const rolesList = useSelector(state => state.role.rolesList)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  function getList (start, limit, search) {
    const data = {
      start, limit, search: search.trim(), token
    }
    dispatch(getRolesList(data))
  }

  function onExport () {
    content.current.onExport()
  }
  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
      <section className="management-section common-box">
        <SubAdminHeader
          {...props}
          permission={(Auth && Auth === 'SUPER') || (adminPermission?.ADMIN_ROLE !== 'R')}
          addLink="/sub-admin/add-role"
          addText="Add Role"
          header="Sub Admin Roles"
          List={rolesList}
          search={searchText}
          Searchable
          handleSearch={onHandleSearch}
          onExport={onExport}
        />
        <RolesList
          {...props}
          ref={content}
          search={searchText}
          flag={initialFlag}
          rolesList={rolesList}
          getList={getList}
          editRoleLink="/sub-admin/update-role"
        />
      </section>
      </main>
    </Fragment>
  )
}

Roles.propTypes = {
  location: PropTypes.object
}

export default Roles
