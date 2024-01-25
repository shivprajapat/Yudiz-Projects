import React, { Fragment, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getEmailTemplateList } from '../../../actions/users'
import Navbar from '../../../components/Navbar'
import Heading from '../../Settings/component/Heading'
import EmailTemplateListComponent from './EmailTemplateList'

function EmailTemplate (props) {
  const content = useRef()
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const EmailTemplateList = useSelector(state => state.users.EmailTemplateList)

  function onExport () {
    content.current.onExport()
  }

  function getList () {
    dispatch(getEmailTemplateList(token))
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            heading="Email Template"
            list={EmailTemplateList}
            onExport={onExport}
          />
          <EmailTemplateListComponent
            {...props}
            ref={content}
            getList={getList}
            templatesList={EmailTemplateList}
          />
        </section>
      </main>
    </Fragment>
  )
}

export default EmailTemplate
