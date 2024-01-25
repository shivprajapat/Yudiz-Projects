import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import ValidationsPage from './Validations'
import qs from 'query-string'

function index (props) {
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)

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
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            heading="Validations"
            setUrl="/settings/add-validation"
            SearchPlaceholder="Search Setting"
            handleSearch={onHandleSearch}
            search={searchText}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.VALIDATION !== 'R')}
          />
          <ValidationsPage
            {...props}
            EditValidationLink={'/settings/validation-details'}
            search={searchText}
            flag={initialFlag}
          />
        </section>
      </main>
    </Fragment>
  )
}

export default index
