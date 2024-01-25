import React, { Fragment, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRuleList } from '../../../actions/rule'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import CommonRuleList from './CommonRuleList'

function CommonRules (props) {
  const content = useRef()
  const dispatch = useDispatch()
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const token = useSelector(state => state.auth.token)
  const ruleList = useSelector(state => state.rule.ruleList)

  function onExport () {
    content.current.onExport()
  }

  function getRulesList () {
    dispatch(getRuleList(token))
  }

  return (
    <Fragment>
      <NavbarComponent {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            {...props}
            list={ruleList}
            heading="Common Rules"
            onExport={onExport}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.RULE !== 'R')}
          />
          <CommonRuleList
            {...props}
            ref={content}
            rulesList={ruleList}
            getList={getRulesList}
           />
        </section>
      </main>
    </Fragment>
  )
}

export default CommonRules
