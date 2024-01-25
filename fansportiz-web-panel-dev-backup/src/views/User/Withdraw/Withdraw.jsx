import React, { useState, useEffect, useRef } from 'react'
import { Alert, Button, Input, Modal, ModalBody } from 'reactstrap'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Loading from '../../../component/Loading'
import { useLocation, useNavigate } from 'react-router-dom'
import success from '../../../assests/images/DepositSuccess.svg'
import BankDetail from '../../../HOC/User/BankDetail'
import useGetCurrency from '../../../api/settings/queries/useGetCurrency'
import classNames from 'classnames'
function WithdrawPage (props) {
  const {
    resMessage,
    modalMessage,
    loading,
    bankData,
    addWithdraw,
    isAddedWithdraw,
    withdrawPending,
    onCheckWithDrawLimit,
    settingValidation,
    paymentList,
    onGetPaymentList,
    token,
    withdrawMessage,
    userInformation
  } = props
  const navigate = useNavigate()
  const { data: currencyLogo } = useGetCurrency()
  const [PaymentGateway, setPaymentGateway] = useState('')
  const [PaymentGatewayKey, setPaymentGatewayKey] = useState('')
  const [Amount, setAmount] = useState(0)
  const [Error, setError] = useState('')
  const [Error2, setError2] = useState('')
  const [validationWithdraw, setValidationWithdraw] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [bankDetailsAdded, setBankDetailsAdded] = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [bankDetail, setBankDetail] = useState({ sBankName: '', sBranchName: '', sAccountHolderName: '', sAccountNo: '', sIFSC: '' })
  const previousProps = useRef({ resMessage, bankData, isAddedWithdraw, withdrawPending }).current

  const location = useLocation()

  useEffect(() => { // Handle bankData
    onGetPaymentList()
  }, [token])

  useEffect(() => { // Handle bankData
    if (previousProps.bankData !== bankData) {
      if (bankData && bankData._id) {
        setBankDetailsAdded(true)
        setBankDetail({ ...bankDetail, sBankName: bankData.sBankName, sBranchName: bankData.sBranchName, sAccountHolderName: bankData.sAccountHolderName, sAccountNo: bankData.nAcNo, sIFSC: bankData.sIFSC })
      }
    }
    return () => {
      previousProps.bankData = bankData
    }
  }, [bankData])

  useEffect(() => {
    if (settingValidation) {
      setValidationWithdraw(settingValidation)
    }
  }, [settingValidation])

  useEffect(() => { // Handle bankData
    if (previousProps.withdrawPending !== withdrawPending) {
      if (withdrawPending === false) {
        addWithdraw(PaymentGateway, Amount)
      } else if (withdrawPending === true && withdrawMessage) {
        setModalOpen(true)
        setError2(withdrawMessage)
      }
    }
    return () => {
      previousProps.withdrawPending = withdrawPending
    }
  }, [withdrawPending])

  useEffect(() => {
    if (modalOpen) {
      setInterval(() => {
        setModalOpen(false)
      }, 2000)
    }
  }, [modalOpen])

  // useEffect(() => {
  //   if (location && location.state && location.state.userInformation && location.state.userInformation.nCurrentWinningBalance) {
  //     setAmount(location.state.userInformation.nCurrentWinningBalance)
  //   }
  // }, [location && location.state])

  useEffect(() => {
    if (previousProps.isAddedWithdraw !== isAddedWithdraw) {
      if (isAddedWithdraw) {
        setWithdrawModal(true)
      }
    }
    return () => {
      previousProps.isAddedWithdraw = isAddedWithdraw
    }
  }, [isAddedWithdraw])

  function handleOnClick () {
    navigate('/profile')
  }

  const handleonKeyPress = (e) => {
    if (e.key === '+' || e.key === '-') {
      e.preventDefault()
    }
  }

  function withDraw () {
    if (bankDetailsAdded && PaymentGateway && (Amount > 0)) {
      onCheckWithDrawLimit()
    } else {
      if (!bankDetailsAdded) {
        navigate('/bank-details', { state: { message: 'Please fill your bank details first.' } })
      } else if (Amount > validationWithdraw?.nMax) {
        setError(`${validationWithdraw?.sMaxMessage}`)
      } else if (Amount < validationWithdraw?.nMin) {
        setError(`${validationWithdraw?.sMinMessage}`)
      } else if (location && location.state && location.state.userInformation && (Amount > location.state.userInformation.nCurrentWinningBalance)) {
        setError(<FormattedMessage id="Amount_can_not_be_greater_than_win_balance" />)
        setModalOpen(true)
      } else setError('')
    }
  }
  const handleChangeAmount = (e) => {
    // if (e.target.value > validationWithdraw?.nMax || e.target.value < validationWithdraw?.nMin) setError(<Fragment><FormattedMessage id="Withdraw_amount_between" /> {`${currencyLogo} ${validationWithdraw?.nMin}`} <FormattedMessage id="and" /> {`${currencyLogo} ${validationWithdraw?.nMax}`} </Fragment>)
    // if (e.target.value > validationWithdraw?.nMax) {
    //   setError(`${validationWithdraw?.sMaxMessage}`)
    // } else if (e.target.value < validationWithdraw?.nMin) {
    //   setError(`${validationWithdraw?.sMinMessage}`)
    // } else setError('')
    setError('')
    setAmount(e.target.value)
  }
  return (
    <>
      {loading && <Loading />}
      { modalOpen ? <Alert color="primary" isOpen={modalOpen}>{Error2}</Alert> : ''}
      {userInformation && (
      <div className='withdraw-container deposit-banner'>
        <p><FormattedMessage id='Available_Cash_Balance' /></p>
        <h2>
          {currencyLogo}
          {userInformation?.nTotalWinningAmount}
        </h2>
      </div>
      )}
      <div className="user-container bg-white no-footer">
        {modalMessage ? <Alert color="primary" isOpen={modalMessage}>{resMessage}</Alert> : ''}
        <div className="form pb-0 pt-3 deposit-o" >
          <p className={classNames('m-msg mt-0', { 'text-start': document.dir !== 'rtl', 'text-end': document.dir === 'rtl' })}><FormattedMessage id="Enter_the_amount_you_wish_to_withdraw_from_your_balance" /></p>
          <div className="position-relative">
            <span className="c-icon">{currencyLogo}</span>
            <Input autoComplete='off' className="m" defaultValue="2875" min="0" onChange={handleChangeAmount} onKeyPress={handleonKeyPress} type="number" value={Amount}/>
            {Error && <p className="error-text">{Error}</p>}
          </div>
        </div>
        <div className="form pb-0 pt-3 deposit-o">
          {/* <h4 className="w-title"><FormattedMessage id="Withdrawal_Method" /></h4> */}
          <ul className="payment-o">
            {
                paymentList && paymentList.length > 0 && paymentList.map((data, index) => {
                  return (
                    <li key={data._id} className={`d-flex align-items-center ${!data.bEnable && 'disable'}`} disabled={!data.bEnable}>
                      <Input autoComplete='off'
                        className="d-none"
                        id={`withdraw${index}`}
                        name="Withdrawal"
                        onChange={() => {
                          setPaymentGateway(data._id)
                          setPaymentGatewayKey(data.eKey)
                        }}
                        type="radio"
                        value='CASHFREE'
                      />
                      <label htmlFor={`withdraw${index}`}>
                        <span className={classNames({ 'text-end': document.dir === 'rtl' })}>
                          <b>
                            {data.sTitle}
                          </b>
                          <br />
                          {data.sInfo}
                        </span>
                      </label>
                    </li>
                  )
                })
              }
          </ul>
        </div>
        <div className="btn-bottom position-relative mx-3 mb-3 text-center">
          {
              PaymentGatewayKey === 'AMAZON' && (
                <button className="btn-link"
                  onClick={() => {
                    navigate('/more/amazon-withdraw-tnc')
                  }}
                >
                  <FormattedMessage id="Amazon_pay_gift_card_T_and_C" />

                </button>
              )
            }
          <Button className="w-100 d-block" color="primary" disabled={!Amount || !PaymentGateway || Error} onClick={withDraw}><FormattedMessage id="Proceed" /></Button>
          <button className="btn-link"
            onClick={() => {
              navigate('/bank-details')
            }}
          >
            {bankDetailsAdded ? <FormattedMessage id="View_Bank_Details" /> : <FormattedMessage id="Add_Bank_Details" />}
          </button>
        </div>
        <Modal className='payment-modal' isOpen={withdrawModal}>
          <ModalBody className='payment-modal-body d-flex flex-column justify-content-center align-items-center'>
            <img alt='Success' src={success} />
            <h2><FormattedMessage id='Withdrawal_request_sent' /></h2>
            <p>
              <FormattedMessage id='Your_request_for_the_withdrawal_of_amount' />
              <span>{currencyLogo + ' ' + Amount}</span>
              <FormattedMessage id='has_been_sent_successfully' />
            </p>
            <Button onClick={handleOnClick}><FormattedMessage id='Okay'/></Button>
          </ModalBody>
        </Modal>
      </div>
    </>
  )
}
WithdrawPage.propTypes = {
  modalMessage: PropTypes.bool,
  loading: PropTypes.bool,
  showBankTab: PropTypes.bool,
  navigate: PropTypes.shape({
    push: PropTypes.func
  }),
  AddBankDetails: PropTypes.func,
  setBankTab: PropTypes.func,
  onGetBankDetails: PropTypes.func,
  onCheckWithDrawLimit: PropTypes.func,
  handleChange: PropTypes.func,
  onGetPaymentList: PropTypes.func,
  resMessage: PropTypes.string,
  paymentList: PropTypes.string,
  resStatus: PropTypes.bool,
  settingValidation: PropTypes.array,
  withdrawPending: PropTypes.bool,
  isAddedWithdraw: PropTypes.bool,
  setLoading: PropTypes.func,
  addWithdraw: PropTypes.func,
  bankData: PropTypes.object,
  currencyLogo: PropTypes.string,
  withdrawMessage: PropTypes.string,
  token: PropTypes.string,
  userInformation: PropTypes.object,
  location: PropTypes.shape({
    state: PropTypes.shape({
      userInformation: PropTypes.string
    })
  })
}
export default BankDetail(WithdrawPage)
