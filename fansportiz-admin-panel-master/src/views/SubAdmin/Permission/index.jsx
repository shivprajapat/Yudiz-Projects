import React, {
  Fragment, useRef
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SubAdminHeader from '../components/SubAdminHeader'
import NavBar from '../../../components/Navbar'
import PermissionContent from './Permission'
import { getPermissionList } from '../../../actions/permission'

function Permission (props) {
  const content = useRef()
  const permissionsList = useSelector(state => state.permission.permissionList)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

  function getList () {
    dispatch(getPermissionList(token))
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <Fragment>
      <NavBar {...props} />
      <main className="main-content">
      <section className="management-section common-box">
        <SubAdminHeader
          {...props}
          permission={(Auth && Auth === 'SUPER') || (adminPermission?.PERMISSION !== 'R')}
          addLink="/sub-admin/add-permission"
          addText="Add permission"
          header="Permissions"
          List={permissionsList}
          onExport={onExport}
        />
        <PermissionContent
          EditPermissionLink="/sub-admin/edit-permission"
          ref={content}
          {...props}
          List={permissionsList}
          getList={getList}
        />
      </section>
      </main>
    </Fragment>
  )
}

export default Permission
