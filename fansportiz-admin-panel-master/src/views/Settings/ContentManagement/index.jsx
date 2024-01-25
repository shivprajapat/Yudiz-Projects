import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCMSList } from '../../../actions/cms'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import ContentManagementContent from './ContentManagementComponent'
import qs from 'query-string'
import PropTypes from 'prop-types'

function CMS (props) {
  const content = useRef()
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const cmsList = useSelector(state => state.cms.cmsList)

  useEffect(() => {
    const obj = qs.parse(props.location.search)
    if (obj.search) {
      setSearchText(obj.search)
    }
  }, [])

  function onExport () {
    content.current.onExport()
  }

  function getCmsList (search) {
    dispatch(getCMSList(search.trim(), token))
  }

  function onHandleSearch (e) {
    setSearchText(e.target.value)
    setinitialFlag(true)
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            info
            list={cmsList}
            heading="Content"
            buttonText="Add Content"
            setUrl="/settings/add-content"
            handleSearch={onHandleSearch}
            search={searchText}
            onExport={onExport}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.CMS !== 'R')}
          />
          <ContentManagementContent
            {...props}
            ref={content}
            getList={getCmsList}
            cmsList={cmsList}
            search={searchText}
            flag={initialFlag}
          />
        </section>
      </main>
    </Fragment>
  )
}

CMS.propTypes = {
  location: PropTypes.object
}

export default CMS
