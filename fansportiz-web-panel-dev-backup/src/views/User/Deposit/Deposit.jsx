import React, { useState, useEffect, Fragment, lazy, Suspense } from 'react'
import { Alert, Button, FormGroup, Input, Label } from 'reactstrap'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Loading from '../../../component/Loading'
import Slider from '../../../component/Slider'
import { useLocation } from 'react-router-dom'
import useGetFixDepositAmounts from '../../../api/deposit/queries/useGetFixDepositAmounts'
import useGetDepositValidation from '../../../api/deposit/queries/useGetDepositValidation'
import useGetPromoCodes from '../../../api/promocode/queries/useGetPromoCodes'
import useGetUserProfile from '../../../api/user/queries/useGetUserProfile'
import useGetPaymentOptions from '../../../api/payment/queries/useGetPaymentOptions'
import useCreatePayment from '../../../api/payment/mutations/useCreatePayment'
import useGetCurrency from '../../../api/settings/queries/useGetCurrency'
import useGetUrl from '../../../api/url/queries/useGetUrl'
import useApplyPromoCode from '../../../api/promocode/mutations/useApplyPromoCode'
import classNames from 'classnames'
const PromoCode = lazy(() => import('../../../component/Promocode'))

function DepositPage (props) {
  const {
    // amountData,
    activeTab,
    setActiveTab
  } = props

  const { state } = useLocation()
  const [promoData, setPromoData] = useState({ sPromo: '', nAmount: 0 })
  const [isPromoModalOpen, setOpenPromoModal] = useState(false)
  const [message, setMessage] = useState('')
  const [alert, setAlert] = useState(false)
  const [error, setError] = useState('')
  const [PaymentGateway, setPaymentGateway] = useState('')
  // const previousProps = useRef({ amountData }).current

  const { data: currencyLogo } = useGetCurrency()
  const { sMediaUrl } = useGetUrl()
  const { data: fixAmounts, isLoading: fixDepositLoading } = useGetFixDepositAmounts()
  const { data: settingValidation, isLoading: depositValidationLoading } = useGetDepositValidation({ type: 'Deposit' })
  const { data: promoCodeList, refetch: GetPromoCodes } = useGetPromoCodes()
  const { data: userData } = useGetUserProfile()
  const { data: paymentOptionsList } = useGetPaymentOptions()
  const { mutate: applyPromoCode, isSuccess: isPromoApplied } = useApplyPromoCode({ setMessage, setAlert, clearPromo })
  const { mutate: CreatePayment } = useCreatePayment({ setMessage, setAlert, userData })

  // useEffect(() => {
  //   if (previousProps.amountData !== amountData) {
  //     if (amountData && amountData.nAmount) {
  //       setPromoData({ ...promoData, nAmount: parseFloat(Number((amountData.nAmount)).toFixed(2)) })
  //     }
  //   }
  //   return () => {
  //     previousProps.amountData = amountData
  //   }
  // }, [amountData && amountData.nAmount])

  useEffect(() => {
    if (state?.amountData) {
      setPromoData({ ...promoData, nAmount: parseFloat(Number((state.amountData.nAmount)).toFixed(2)) })
    }
  }, [state?.amountData && state.amountData.nAmount])

  useEffect(() => {
    if (state) {
      setMessage(state?.message)
      setAlert(true)
      setTimeout(() => {
        setAlert(false)
      }, 2000)
    }
  }, [state])

  const handleChange = (e) => {
    setPromoData({ ...promoData, nAmount: e.target.value })
    setError('')
  }

  const applyPromoCodeFunc = (name) => {
    setPromoData({ ...promoData, sPromo: name })
    applyPromoCode({ nAmount: promoData.nAmount, sPromo: name })
    setOpenPromoModal(false)
  }

  const addDeposit = () => {
    // if (promoData?.nAmount && PaymentGateway !== 'CASHFREE') {
    //   CreatePayment({ nAmount: promoData.nAmount, eType: PaymentGateway, ePlatform: 'W', sOrderCurrency: 'INR', sPromocode: isPromoApplied ? promoData.sPromo : '' })
    //   setActiveTab(true)
    // } else {
    CreatePayment({ nAmount: promoData.nAmount, eType: PaymentGateway, ePlatform: 'W', sOrderCurrency: 'INR', sPromocode: isPromoApplied && promoData?.sPromo ? promoData.sPromo : '' })
    setActiveTab(true)
    // }
  }

  const handleOnKeyPress = (e) => {
    if (e.key === '+' || e.key === '-') {
      e.preventDefault()
    }
  }

  function clearPromo () {
    setPromoData({ ...promoData, sPromo: '' })
  }

  function PageChange () {
    if (promoData?.sPromo && promoCodeList?.length > 1) {
      const filterData = promoCodeList.filter(data => data.sCode === promoData?.sPromo)
      if (filterData && !((promoData.nAmount > filterData.nMinAmount) && (promoData.nAmount < filterData.nMaxAmount))) {
        clearPromo()
      }
    }
    if (promoData?.nAmount > settingValidation?.nMax) setError(`${settingValidation?.sMaxMessage}`)
    else if (promoData?.nAmount < settingValidation?.nMin) setError(`${settingValidation?.sMinMessage}`)
    else {
      setActiveTab(false)
      setPaymentGateway('')
    }
  }

  return (
    <Fragment>
      { alert && message ? <Alert color="primary" isOpen={alert}>{message}</Alert> : ''}
      {(fixDepositLoading || depositValidationLoading) && <Loading />}
      <Slider screen='D' />
      <div className="user-container bg-white with-footer deposit-screen" onClick={() => { if (isPromoModalOpen) setOpenPromoModal(false) }}>
        {activeTab
          ? (
            <div className="form pb-0 pt-3 deposit-o" >
              <p className={classNames('m-msg mt-0', { 'text-end': document.dir === 'rtl', 'text-start': document.dir !== 'rtl' })}><FormattedMessage id="Enter_the_amount" /></p>
              <div className="position-relative">
                <span className="c-icon">
                  {currencyLogo}
                  {' '}
                </span>
                <Input autoComplete='off' className="m" onChange={handleChange} onKeyPress={handleOnKeyPress} type="number" value={promoData.nAmount}/>
                {error && <p className="error-text">{error}</p>}
              </div>
              <ul className="d-flex select-m">
                {fixAmounts?.map(data => (
                  <li key={data._id}
                    onClick={() => {
                      setPromoData({ ...promoData, nAmount: promoData.nAmount ? parseInt(promoData.nAmount) + parseInt(data.sValue) : parseInt(data?.sValue) })
                      setError('')
                    }}
                  >
                    {data?.sValue && currencyLogo ? '+' + currencyLogo + parseInt(data?.sValue) : ''}
                  </li>
                ))}
              </ul>
              <div className="ul-p-bar" />
              <p className={classNames('m-msg mt-0', { 'text-start': document.dir !== 'rtl', 'text-end': document.dir === 'rtl' })}><FormattedMessage id="Have_a_Promocode" /></p>
              <FormGroup className="c-input mt-4">
                <Input
                  className={`bg-white ${isPromoApplied && promoData.sPromo ? 'hash-contain applied' : ''}`}
                  disabled={!promoData.nAmount}
                  id="Promocode"
                  onClick={() => {
                    setOpenPromoModal(true)
                    GetPromoCodes()
                  }}
                  readOnly
                  required
                  type="text"
                  value={(isPromoApplied && promoData.sPromo) ? `${promoData.sPromo}` + ' Applied!' : ''}
                />
                {!promoData.isPromoApplied && !promoData.sPromo && <Label className="no-change label m-0" for="Promocode"><FormattedMessage id="Enter_Promocode" /></Label>}
                {isPromoApplied && promoData.sPromo &&
                <button className="i-icon" onClick={clearPromo}><FormattedMessage id='Remove' /></button>}
              </FormGroup>
              <div className="btn-bottom position-relative my-3">
                <Button className="w-100 d-block" color="primary" disabled={!promoData?.nAmount || error} onClick={PageChange}><FormattedMessage id="Proceed" /></Button>
              </div>
            </div>
            )
          : (
            <div className="form pb-0 pt-3 deposit-o" >
              <p className={classNames('m-msg text-start mt-0 mb-2', { 'text-start': document.dir !== 'rtl', 'text-end': document.dir === 'rtl' })}><FormattedMessage id="Deposit_using_Amazon_Pay_and_Get_cashback_surprise" /></p>
              <ul className="payment-o">
                {Object.keys(paymentOptionsList).length > 0 && paymentOptionsList?.map((data, index) => {
                  return (data.eKey !== 'CASHFREE_UPI' && data.bEnable && (
                  <li key={data._id} className="d-flex align-items-center">
                    <Input autoComplete='off' className="d-none" id={`card${index}`} name="Deposit" onClick={() => setPaymentGateway(data?.eKey)} type="radio"/>
                    <label htmlFor={`card${index}`} id='deposite' value={data.eKey}>
                      <img className='fix40HeiWid' src={sMediaUrl + data.sImage}/>
                      <span className={classNames('ms-3', { 'text-end': document.dir === 'rtl' })}>
                        {data.sName}
                        <br />
                        {data?.sOffer}
                      </span>
                      <br/>
                    </label>
                  </li>
                  )
                  )
                })}
              </ul>
              <div className="btn-bottom position-relative my-3">
                <Button className="w-100 d-block" color="primary" disabled={!PaymentGateway} onClick={addDeposit}>
                  <FormattedMessage id="Add" />
                  {' '}
                  <span dir='ltr'>
                    {' ' + currencyLogo}
                    {promoData?.nAmount}
                  </span>
                </Button>
              </div>
            </div>
            )}
      </div>
      {isPromoModalOpen && (
      <Suspense fallback={<Loading />}>
        <PromoCode
          applyPromoCodeFunc={applyPromoCodeFunc}
          promoCodeList={promoCodeList}
          promoData={promoData}
          setOpenPromoModal={setOpenPromoModal}
          setPromoData={setPromoData}
        />
      </Suspense>
      )}
    </Fragment>
  )
}

DepositPage.propTypes = {
  // amountData: PropTypes.object,
  privateLeagueValidation: PropTypes.array,
  setActiveTab: PropTypes.func,
  activeTab: PropTypes.bool
}

export default DepositPage
