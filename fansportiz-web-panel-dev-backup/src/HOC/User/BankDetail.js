import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { depositValidationList, AddBankDetail, UpdateBankDetails, GetBankList, GetBankDetail, AddWithdraw, CheckWithdrawLimit, paymentOptionList, GetUserProfile } from '../../redux/actions/profile'

export const BankDetail = (Component) => {
  const MyComponent = (props) => {
    const dispatch = useDispatch()
    const [modalMessage, setModalMessage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showBankTab, setBankTab] = useState(true)
    const token = useSelector(state => state.auth.token) || localStorage.getItem('Token')
    const resStatus = useSelector(state => state.profile.resStatus)
    const resMessage = useSelector(state => state.profile.resMessage)
    const withdrawMessage = useSelector(state => state.profile.withdrawMessage)
    const bankData = useSelector(state => state.profile.bankData)
    const bankDetails = useSelector(state => state.profile.bankDetails)
    const updateBankDetails = useSelector(state => state.profile.updateBankDetails)
    const withdrawPending = useSelector(state => state.profile.withdrawPending)
    const settingValidation = useSelector(state => state.profile.settingValidation)
    const currencyLogo = useSelector(state => state.settings.currencyLogo)
    const paymentList = useSelector(state => state.profile.paymentList)
    const addWithdraw = useSelector(state => state.profile.addWithdraw)
    const bankList = useSelector(state => state.profile.bankList)
    // const bankTotalList = useSelector(state => state.profile.bankTotalList)
    const userInformation = useSelector(state => state.profile.userInfo)

    const previousProps = useRef({ bankList, resMessage, resStatus, bankData, userInformation }).current
    useEffect(() => {
      if (token) {
        onGetUserInfo()
        onDepositValidation('Withdraw')
        dispatch(GetBankDetail(token))
        dispatch(GetBankList(0, 500, '', token))
        setLoading(true)
      }
    }, [token])

    useEffect(() => {
      if (withdrawPending) {
        setLoading(false)
      }
    }, [withdrawPending])

    useEffect(() => {
      if (previousProps.resMessage !== resMessage) {
        if (resMessage && resStatus !== null && !addWithdraw) {
          setLoading(false)
          setBankTab(true)
          setModalMessage(true)
          setTimeout(() => setModalMessage(false), 3000)
        }
        if (resStatus === false) {
          setLoading(false)
          if (resMessage) {
            setModalMessage(true)
            setTimeout(() => setModalMessage(false), 3000)
          }
        }
      }
      return () => {
        previousProps.resMessage = resMessage
      }
    }, [resStatus, resMessage])

    useEffect(() => { // Handle api response
      if (previousProps.bankData !== bankData) {
        if (bankData) {
          setLoading(false)
        }
      }
      return () => {
        previousProps.bankData = bankData
      }
    }, [bankData])

    // useEffect(() => { // Handle api response
    //   if (previousProps.bankTotalList !== bankTotalList) {
    //     if (bankTotalList) {
    //       dispatch(GetBankList(0, bankTotalList, '', token))
    //     }
    //   }
    //   return () => {
    //     previousProps.bankTotalList = bankTotalList
    //   }
    // }, [bankTotalList])

    // useEffect(() => { // Handle api response
    //   if (previousProps.bankList !== bankList) {
    //     if (bankList && bankList.length > 0) {
    //       const arr = [...options]
    //       bankList && bankList.length > 0 && bankList.map(bank => {
    //         const obj = {
    //           value: bank._id,
    //           label: bank.sName
    //         }
    //         arr.push(obj)
    //         return arr
    //       })
    //       setOptions(arr)
    //     }
    //   }
    //   return () => {
    //     previousProps.bankList = bankList
    //   }
    // }, [bankList])

    function onGetUserInfo () {
      dispatch(GetUserProfile(token))
      setLoading(true)
    }

    function AddBankDetailfun (data) {
      token && dispatch(AddBankDetail(data, token))
      setLoading(true)
    }

    function onUpdateBankDetails (data, ID) {
      token && dispatch(UpdateBankDetails(data, ID, token))
      setLoading(true)
    }

    function AddedWithdraw (PaymentGateway, Amount) {
      token && dispatch(AddWithdraw(PaymentGateway, Amount, token))
      setLoading(true)
    }

    function onDepositValidation (type) {
      token && dispatch(depositValidationList(type, token))
    }
    function onGetBankDetails () {
      if (token) {
        dispatch(GetBankDetail(token))
        setLoading(true)
      }
    }

    function onCheckWithDrawLimit () {
      if (token) {
        dispatch(CheckWithdrawLimit(token))
        setLoading(true)
      }
    }

    function onGetPaymentList () {
      if (token) {
        dispatch(paymentOptionList(token))
        setLoading(true)
      }
    }

    function getBankList (start, limit, search) {
      token && dispatch(GetBankList(start, limit, search, token))
      setLoading(true)
    }

    return (
      <Component {...props}
        AddBankDetails={AddBankDetailfun}
        addWithdraw={AddedWithdraw}
        bankData={bankData}
        bankDetails={bankDetails}
        currencyLogo={currencyLogo}
        isAddedWithdraw={addWithdraw}
        loading={loading}
        modalMessage={modalMessage}
        onCheckWithDrawLimit={onCheckWithDrawLimit}
        onDepositValidation={onDepositValidation}
        onGetBankDetails={onGetBankDetails}
        onGetBankList={getBankList}
        onGetPaymentList={onGetPaymentList}
        onUpdateBankDetails={onUpdateBankDetails}
        options={bankList}
        paymentList={paymentList}
        resMessage={resMessage}
        resStatus={resStatus}
        setBankTab={setBankTab}
        setLoading={setLoading}
        settingValidation={settingValidation}
        showBankTab={showBankTab}
        token={token}
        updateBankDetails={updateBankDetails}
        userInformation={userInformation}
        withdrawMessage={withdrawMessage}
        withdrawPending={withdrawPending}
      />
    )
  }
  MyComponent.displayName = MyComponent
  return MyComponent
}
export default BankDetail
