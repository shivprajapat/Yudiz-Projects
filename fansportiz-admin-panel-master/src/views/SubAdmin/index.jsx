import React, {
  Fragment, useRef, useEffect, useState
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import qs from 'query-string'
import NavBar from '../../components/Navbar'
import SubAdminHeader from './components/SubAdminHeader'
import SubAdminContent from './SubAdmin'
import { getSubadminList } from '../../actions/subadmin'
import PropTypes from 'prop-types'
function SubAdmin (props) {
  const content = useRef()
  const [SearchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const subadminList = useSelector(state => state.subadmin.subadminList)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()

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

  function getList (start, limit, sort, order, searchText) {
    dispatch(getSubadminList(start, limit, sort, order, searchText.trim(), token))
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
            List={subadminList}
            onExport={onExport}
            search={SearchText}
            handleSearch={onHandleSearch}
            addLink="/sub-admin/add-sub-admin"
            addText="Add SubAdmin"
            header="Sub Admins"
            permissionLink="/sub-admin/permission"
            searchPlaceholder="Search Sub-Admin"
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.SUBADMIN !== 'R')}
            otherButton
            Searchable
          />
          <SubAdminContent
            {...props}
            ref={content}
            search={SearchText}
            List={subadminList}
            getList={getList}
            flag={initialFlag}
            editLink="/sub-admin/edit-sub-admin"
          />
        </section>
      </main>
    </Fragment>
  )
}

SubAdmin.propTypes = {
  location: PropTypes.object
}

export default SubAdmin
