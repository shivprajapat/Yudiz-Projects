import React, { Fragment, useEffect, useState, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Navbar from '../../../components/Navbar'
import Heading from '../component/Heading'
import { getPayoutList } from '../../../actions/payout'
import PayoutManagement from './PayoutManagement'

function Payout (props) {
  const dispatch = useDispatch()
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const payoutList = useSelector(state => state.payout.payoutList)
  const [searchText, setSearchText] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
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

  function getPayoutMethods (start, limit, sort, order, search) {
    dispatch(getPayoutList(start, limit, sort, order, search.trim(), token))
  }

  function onExport () {
    content.current.onExport()
  }

  return (
    <Fragment>
      <Navbar {...props} />
      <main className="main-content">
        <section className="management-section common-box">
          <Heading
            list={payoutList}
            heading="Payout Gateways"
            handleSearch={onHandleSearch}
            search={searchText}
            onExport={onExport}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.PAYOUT_OPTION !== 'R')}
          />
          <PayoutManagement
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            getList={getPayoutMethods}
            payoutList={payoutList}
          />
        </section>
      </main>
    </Fragment>
  )
}

Payout.propTypes = {
  location: PropTypes.object
}

export default Payout
