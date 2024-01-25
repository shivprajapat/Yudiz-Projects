import React, { Fragment, useEffect, useState, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import SettingManagementList from './SettingManagementList'
import PropTypes from 'prop-types'
import { getSettingList } from '../../../actions/setting'

function SettingManagement (props) {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const settingList = useSelector(state => state.setting.settingList)
  const content = useRef()

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

  function getSettingsList (start, limit, sort, order, search) {
    dispatch(getSettingList(start, limit, sort, order, search.trim(), token))
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            info
            heading="Settings"
            setUrl="/settings/add-setting"
            SearchPlaceholder="Search Setting"
            handleSearch={onHandleSearch}
            search={searchText}
            list={settingList}
            onExport={onExport}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.SETTING !== 'R')}
          />
          <SettingManagementList
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            getList={getSettingsList}
            settingList={settingList}
          />
        </section>
      </main>
    </Fragment>
  )
}

SettingManagement.propTypes = {
  location: PropTypes.object
}

export default SettingManagement
