import React, { Fragment, useEffect, useState, useRef } from 'react'
import qs from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import NavbarComponent from '../../../components/Navbar'
import Heading from '../component/Heading'
import PaymentManagementContent from './PaymentManagement'
import PropTypes from 'prop-types'
import { getPaymentList } from '../../../actions/payment'

function PaymentManagement (props) {
  const dispatch = useDispatch()
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const token = useSelector(state => state.auth.token)
  const paymentList = useSelector(state => state.payment.paymentList)
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

  function getPaymentMethods (start, limit, sort, order, search) {
    dispatch(getPaymentList(start, limit, sort, order, search.trim(), token))
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
            list={paymentList}
            heading="Payment Gateways"
            SearchPlaceholder="Search payment"
            handleSearch={onHandleSearch}
            search={searchText}
            onExport={onExport}
            permission={(Auth && Auth === 'SUPER') || (adminPermission?.PAYMENT_OPTION !== 'R')}
          />
          <PaymentManagementContent
            {...props}
            ref={content}
            search={searchText}
            flag={initialFlag}
            getList={getPaymentMethods}
            paymentList={paymentList}
          />
        </section>
      </main>
    </Fragment>
  )
}

PaymentManagement.propTypes = {
  location: PropTypes.object
}

export default PaymentManagement
