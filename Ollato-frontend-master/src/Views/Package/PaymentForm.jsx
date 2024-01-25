import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function PaymentForm () {
  const form = useRef()
  const { state } = useLocation()

  useEffect(() => {
    form.current.submit()
  }, [])
  return <form action={`${process.env.REACT_APP_PAYUMONEY}`} ref={form} method='post'>
  <input type="hidden" name="key" value={state?.newdata?.key} />
  {/* <input type="hidden" name="service_provider" value="payu_paisa"></input> */}
  <input type="hidden" name="txnid" value={state?.newdata?.txnid} />
  <input type="hidden" name="productinfo" value={state?.newdata?.productinfo} />
  <input type="hidden" name="amount" value={state?.newdata?.amount} />
  <input type="hidden" name="email" value={state?.newdata?.email} />
  <input type="hidden" name="firstname" value={state?.newdata?.firstname} />
  <input type="hidden" name="surl" value={state?.newdata?.surl}/>
  <input type="hidden" name="furl" value={state?.newdata?.furl} />
  <input type="hidden" name="phone" value={state?.newdata?.phone} />
  <input type="hidden" name="hash" value={state?.newdata?.hash} />
  </form>
}

export default PaymentForm
