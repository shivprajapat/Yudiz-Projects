import React, { useState, useEffect, useRef } from 'react'
import { Alert, Button, Form, FormGroup, Input, Label } from 'reactstrap'
import { isNumber, ifscCode } from '../../../utils/helper'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import Loading from '../../../component/Loading'
import BankDetail from '../../../HOC/User/BankDetail'
import { useLocation } from 'react-router-dom'
const classNames = require('classnames')
function BankDetailsPage (props) {
  const {
    resMessage,
    modalMessage,
    AddBankDetails,
    loading,
    bankData,
    setLoading,
    onUpdateBankDetails,
    bankDetails,
    options,
    editable,
    setEditable
    // onGetBankList
  } = props
  const [disabled, setDisabled] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [alertShow, setAlertShow] = useState(false)
  const [message, setMessage] = useState('')
  // const [start, setStart] = useState(0)
  // const [search, setSearch] = useState('')
  // const limit = useState(20)
  const [bankDetail, setBankDetail] = useState({
    sBankName: '',
    sBranchName: '',
    sAccountHolderName: '',
    sAccountNo: '',
    sIFSC: ''
  })
  const [bankErrors, setBankErrors] = useState({
    sBankName: '',
    sBranchName: '',
    sAccountHolderName: '',
    sAccountNo: '',
    sIFSC: ''
  })
  const previousProps = useRef({
    resMessage,
    bankData
  }).current

  const location = useLocation()

  useEffect(() => {
    if (previousProps.bankData !== bankData) { // handle the response
      if (bankData && bankData.sBankName) {
        // bankData?.bIsBankApproved ? setDisabled(true) : setDisabled(false)
        if (bankData?.bIsBankApproved) {
          // setDisabled(true)
          setEditable(true)
        } else {
          // setDisabled(false)
          setEditable(false)
        }
        setBankDetail({
          ...bankDetail,
          sBankName: bankData.sBankName,
          sBranchName: bankData.sBranchName,
          sAccountHolderName: bankData.sAccountHolderName,
          sAccountNo: bankData.sAccountNo,
          sIFSC: bankData.sIFSC
        })
      }
    }
    return () => {
      previousProps.bankData = bankData
    }
  }, [bankData])

  useEffect(() => {
    if (editable) {
      setDisabled(true)
    } else {
      setBankDetail({
        ...bankDetail,
        sAccountNo: ''
      })
      setDisabled(false)
    }
  }, [editable])

  useEffect(() => {
    if (location && location.state && location.state.message) {
      setMessage(location.state.message)
      setAlertShow(true)
      setTimeout(() => {
        setAlertShow(false)
      }, 2000)
    }
  }, [location && location.state])

  useEffect(() => {
    if (modalOpen) {
      setInterval(() => {
        setModalOpen(false)
      }, 2000)
    }
  }, [modalOpen])
  // set the value
  const handleChange = (e, type) => {
    switch (type) {
      case 'sBankName':
        // if (e.target.value !== '') {
        //   setBankErrors({ ...bankErrors, sBankName: '' })
        // } else {
        //   setBankErrors({
        //     ...bankErrors,
        //     sBankName: <FormattedMessage id="Bank_name_is_required" />
        //   })
        // }
        setBankErrors({ ...bankErrors, sBankName: '' })
        setBankDetail({ ...bankDetail, sBankName: e.target.value })
        break
      case 'sBranchName':
        // if (e.target.value !== '') {
        //   setBankErrors({ ...bankErrors, sBranchName: '' })
        // } else {
        //   setBankErrors({
        //     ...bankErrors,
        //     sBranchName: <FormattedMessage id="Bank_branch_name_is_required" />
        //   })
        // }
        setBankErrors({ ...bankErrors, sBranchName: '' })
        setBankDetail({ ...bankDetail, sBranchName: e.target.value })
        break
      case 'sAccountHolderName':
        // if (e.target.value !== '') {
        //   setBankErrors({ ...bankErrors, sAccountHolderName: '' })
        // } else {
        //   setBankErrors({
        //     ...bankErrors,
        //     sAccountHolderName: <FormattedMessage id="Bank_account_name_is_required" />
        //   })
        // }
        setBankErrors({ ...bankErrors, sAccountHolderName: '' })
        setBankDetail({ ...bankDetail, sAccountHolderName: e.target.value })
        break
      case 'sAccountNo':
        // if (
        //   e.target.value !== '' &&
        //   isNumber(e.target.value) &&
        //   e.target.value.length > 9 &&
        //   e.target.value.length < 19
        // ) {
        //   setBankErrors({ ...bankErrors, sAccountNo: '' })
        // } else {
        //   if (!isNumber(e.target.value)) {
        //     setBankErrors({
        //       ...bankErrors,
        //       sAccountNo: <FormattedMessage id="Account_number_is_not_valid" />
        //     })
        //   }
        //   if (!e.target.value.length > 9 || !e.target.value.length < 19) {
        //     setBankErrors({
        //       ...bankErrors,
        //       sAccountNo: <FormattedMessage id="Account_number_is_not_valid" />
        //     })
        //   }
        //   if (e.target.value === '') {
        //     setBankErrors({
        //       ...bankErrors,
        //       sAccountNo: <FormattedMessage id="Account_number_is_required" />
        //     })
        //   }
        // }
        setBankErrors({ ...bankErrors, sAccountNo: '' })
        setBankDetail({ ...bankDetail, sAccountNo: e.target.value })
        break
      case 'sIFSC':
        // if (e.target.value !== '' && !ifscCode(e.target.value)) {
        //   setBankErrors({ ...bankErrors, sIFSC: '' })
        // } else {
        //   if (ifscCode(e.target.value)) {
        //     setBankErrors({
        //       ...bankErrors,
        //       sIFSC: <FormattedMessage id="IFSC_code_is_invalid" />
        //     })
        //   }
        //   if (e.target.value === '') {
        //     setBankErrors({
        //       ...bankErrors,
        //       sIFSC: <FormattedMessage id="IFSC_code_is_required" />
        //     })
        //   }
        // }
        setBankErrors({ ...bankErrors, sIFSC: '' })
        setBankDetail({ ...bankDetail, sIFSC: e.target.value })
        break
      default:
        break
    }
  }
  const handleAddBankDetail = (e) => { // add bank details
    e.preventDefault()
    if (
      bankDetail.sBankName !== '' &&
      bankDetail.sBranchName !== '' &&
      bankDetail.sBranchName.length <= 35 &&
      bankDetail.sAccountHolderName !== '' &&
      bankDetail.sAccountHolderName.length <= 35 &&
      bankDetail.sAccountNo !== '' &&
      isNumber(bankDetail.sAccountNo) &&
      bankDetail.sAccountNo.length > 9 &&
      bankDetail.sAccountNo.length < 19 &&
      bankDetail.sIFSC !== '' &&
      !ifscCode(bankDetail.sIFSC)
    ) {
      if (bankData && bankData.sAccountNo && bankData.bIsBankApproved && bankData._id) {
        onUpdateBankDetails(bankDetail, bankData._id)
      } else {
        AddBankDetails(bankDetail)
        setDisabled(false)
        setEditable(true)
      }
      setLoading(true)
    } else {
      setBankErrors({
        sBankName: bankDetail.sBankName === '' ? <FormattedMessage id="Bank_name_is_required" /> : '',

        sBranchName: bankDetail.sBranchName === '' ? <FormattedMessage id="Bank_branch_name_is_required" /> : bankDetail.sBranchName.length > 35 ? <FormattedMessage id="Branch_name_must_be_less_than_or_equal_to_35_characters" /> : '',

        sAccountHolderName: bankDetail.sAccountHolderName === '' ? <FormattedMessage id="Bank_account_name_is_required" /> : bankDetail.sAccountHolderName.length > 35 ? <FormattedMessage id="Account_name_must_be_less_than_or_equal_to_35_characters" /> : '',

        sAccountNo: bankDetail.sAccountNo === '' ? <FormattedMessage id="Account_number_is_required" /> : !isNumber(bankDetail.sAccountNo) ? <FormattedMessage id="Account_number_is_not_valid" /> : (!bankDetail.sAccountNo.length > 9 || !bankDetail.sAccountNo.length < 19) ? <FormattedMessage id="Account_number_must_be_9_to_18_digits" /> : '',

        sIFSC: bankDetail.sIFSC === '' ? <FormattedMessage id="IFSC_code_is_required" /> : ifscCode(bankDetail.sIFSC) ? <FormattedMessage id="IFSC_code_is_invalid" /> : ''
      })
      // if (bankDetail.sBankName === '') {
      //   setBankErrors((prev) => ({
      //     ...prev,
      //     sBankName: <FormattedMessage id="Bank_name_is_required" />
      //   }))
      //   // setBankErrors({
      //   //   ...bankErrors,
      //   //   sBankName: <FormattedMessage id="Bank_name_is_required" />
      //   // })
      // }
      // if (bankDetail.sBranchName.length > 35) {
      //   setBankErrors((prev) => ({
      //     ...prev,
      //     sBranchName: <FormattedMessage id="Branch_name_must_be_less_than_or_equal_to_35_characters" />
      //   }))
      //   // setBankErrors({
      //   //   ...bankErrors,
      //   //   sBranchName: <FormattedMessage id="Branch_name_must_be_less_than_or_equal_to_35_characters" />
      //   // })
      // }
      // if (bankDetail.sBranchName === '') {
      //   setBankErrors({
      //     ...bankErrors,
      //     sBranchName: <FormattedMessage id="Bank_branch_name_is_required" />
      //   })
      // }
      // if (bankDetail.sAccountHolderName === '') {
      //   setBankErrors({
      //     ...bankErrors,
      //     sAccountHolderName: <FormattedMessage id="Bank_account_name_is_required" />
      //   })
      // }
      // if (bankDetail.sAccountHolderName.length > 35) {
      //   setBankErrors({
      //     ...bankErrors,
      //     sAccountHolderName: <FormattedMessage id="Account_name_must_be_less_than_or_equal_to_35_characters" />
      //   })
      // }
      // if (bankDetail.sAccountNo === '') {
      //   setBankErrors({
      //     ...bankErrors,
      //     sAccountNo: <FormattedMessage id="Account_number_is_required" />
      //   })
      // }
      // if (!isNumber(bankDetail.sAccountNo)) {
      //   setBankErrors({
      //     ...bankErrors,
      //     sAccountNo: <FormattedMessage id="Account_number_is_not_valid" />
      //   })
      // }
      // if (!bankDetail.sAccountNo.length > 9 || !bankDetail.sAccountNo.length < 19) {
      //   setBankErrors({
      //     ...bankErrors,
      //     sAccountNo: <FormattedMessage id="Account_number_must_be_9_to_18_digits" />
      //   })
      // }
      // if (bankDetail.sIFSC === '') {
      //   setBankErrors({
      //     ...bankErrors,
      //     sIFSC: <FormattedMessage id="IFSC_code_is_required" />
      //   })
      // }
      // if (ifscCode(bankDetail.sIFSC)) {
      //   setBankErrors({
      //     ...bankErrors,
      //     sIFSC: <FormattedMessage id="IFSC_code_is_invalid" />
      //   })
      // }
      // if (!isNumber(bankDetail.sAccountNo)) {
      //   setBankErrors({
      //     ...bankErrors,
      //     sAccountNo: <FormattedMessage id="Account_number_should_be_number" />
      //   })
      // }
    }
  }
  return (
    <>
      {loading && <Loading />}
      <div className="user-container bg-white no-footer">
        {modalMessage &&
              (
              <Alert color="primary" isOpen={modalMessage}>
                {resMessage}
              </Alert>
              )}
        {alertShow &&
              (
              <Alert color="primary" isOpen={alertShow}>
                {message}
              </Alert>
              )}
        <Form className="form">
          <FormGroup className="c-input">
            {disabled && bankDetail?.sBankName
              ? (
                <Input
                  className={classNames({ 'hash-contain': bankDetail.sBankName, error: bankErrors.sBankName, 'no-border': bankDetail.sBankName && disabled })}
                  disabled={disabled}
                  id="BankName"
                  name="sBankName"
                  type="text"
                  value={bankDetail.sBankName}
                />
                )
              : (
                <Input
                  autoComplete='off'
                  className={classNames({ 'hash-contain': bankDetail.sBankName, error: bankErrors.sBankName, 'no-border': bankDetail.sBankName && disabled })}
                  defaultValue={bankDetail.sBankName}
                  disabled={disabled}
                  id="BankName"
                  name="sBankName"
                  onChange={(e) => {
                    handleChange(e, 'sBankName')
                  }}
                  required
                  type="select"
                  value={bankDetail.sBankName}
                >
                  <option hidden value='' />
                  {
                    options && options.length !== 0 && options.map((data) => {
                      return (
                        <option key={data.sName} id={data.sName} value={data.sName}>{data.sName}</option>
                      )
                    })
                  }
                </Input>
                )}
            <Label className="label no-change m-0" for="BankName">
              <FormattedMessage id="Bank_Name" />
            </Label>
            {bankErrors.sBankName
              ? (
                <p className="error-text">{bankErrors.sBankName}</p>
                )
              : (
                  ''
                )}
          </FormGroup>
          <FormGroup className="c-input">
            <Input
              autoComplete='off'
              className={classNames({ 'hash-contain': bankDetail.sBranchName, error: bankErrors.sBranchName, 'no-border': disabled })}
              disabled={disabled}
              id="BankBranchName"
              name="sBranchName"
              onChange={(e) => {
                handleChange(e, 'sBranchName')
              }}
              required
              type="text"
              value={bankDetail.sBranchName}
            />
            <Label className="label no-change m-0" for="BankBranchName">
              <FormattedMessage id="Bank_Branch_Name" />
            </Label>
            {bankErrors.sBranchName
              ? (
                <p className="error-text">{bankErrors.sBranchName}</p>
                )
              : (
                  ''
                )}
          </FormGroup>
          <FormGroup className="c-input">
            <Input
              autoComplete='off'
              className={classNames({ 'hash-contain': bankDetail.sAccountHolderName, error: bankErrors.sAccountHolderName, 'no-border': bankDetail.sAccountHolderName && disabled })}
              defaultValue={bankDetail.sAccountHolderName}
              disabled={disabled && bankDetail?.sAccountHolderName}
              id="BankAccountName"
              name="sAccountHolderName"
              onChange={(e) => {
                handleChange(e, 'sAccountHolderName')
              }}
              required
              type="text"
            />
            <Label className="label no-change m-0" for="BankAccountName">
              <FormattedMessage id="Bank_Account_Holder_Name" />
            </Label>
            {bankErrors.sAccountHolderName
              ? (
                <p className="error-text">{bankErrors.sAccountHolderName}</p>
                )
              : (
                  ''
                )}
          </FormGroup>
          <FormGroup className="c-input">
            {disabled && bankDetail?.sAccountNo
              ? (
                <Input
                  className={classNames({ 'hash-contain': bankDetail.sAccountNo, error: bankErrors.sAccountNo, 'no-border': bankDetail.sAccountNo && disabled })}
                  disabled={disabled && bankDetail?.sAccountNo}
                  id="AccountNumber"
                  name="sAccountNo"
                  type="text"
                  value={bankDetail?.sAccountNo}
                />
                )
              : (
                <Input
                  autoComplete='off'
                  className={classNames({ 'hash-contain': bankDetail.sAccountNo, error: bankErrors.sAccountNo, 'no-border': bankDetail.sAccountNo && disabled })}
                  disabled={disabled && bankDetails?.sAccountNo}
                  id="AccountNumber"
                  name="sAccountNo"
                  onChange={(e) => {
                    handleChange(e, 'sAccountNo')
                  }}
                  required
                  type="text"
                  value={bankDetail.sAccountNo}
                />
                )}
            <Label className="label no-change m-0" for="AccountNumber">
              <FormattedMessage id="Account_Number" />
            </Label>
            {bankErrors.sAccountNo
              ? (
                <p className="error-text">{bankErrors.sAccountNo}</p>
                )
              : (
                  ''
                )}
          </FormGroup>
          <FormGroup className="c-input">
            <Input
              autoComplete='off'
              className={classNames({ 'hash-contain': bankDetail.sIFSC, error: bankErrors.sIFSC, 'no-border': bankDetail.sIFSC && disabled })}
              disabled={disabled && bankDetail?.sIFSC}
              id="IFSCCode"
              name="sIFSC"
              onChange={(e) => {
                handleChange(e, 'sIFSC')
              }}
              required
              type="text"
              value={bankDetail.sIFSC}
            />
            <Label className="label no-change m-0" for="IFSCCode">
              <FormattedMessage id="IFSC_Code" />
            </Label>
            {bankErrors.sIFSC
              ? (
                <p className="error-text">{bankErrors.sIFSC}</p>
                )
              : (
                  ''
                )}
          </FormGroup>
          {!disabled && (
          <div className="btn-bottom text-center position-relative my-3">
            <Button
              className="w-100 d-block"
              color="primary"
              disabled={
                    !(
                      Object.values(bankErrors).every((x) => x === '') &&
                      Object.values(bankDetail).every((x) => x !== '')
                    ) || disabled
                  }
              onClick={handleAddBankDetail}
              type="submit"
            >
              <FormattedMessage id="Save" />
            </Button>
          </div>
          )}
        </Form>
      </div>
    </>
  )
}
BankDetailsPage.propTypes = {
  modalMessage: PropTypes.bool,
  loading: PropTypes.bool,
  showBankTab: PropTypes.bool,
  AddBankDetails: PropTypes.func,
  setBankTab: PropTypes.func,
  // onGetBankDetails: PropTypes.func,
  onUpdateBankDetails: PropTypes.func,
  handleChange: PropTypes.func,
  handleAddBankDetail: PropTypes.func,
  resMessage: PropTypes.string,
  resStatus: PropTypes.bool,
  isAddedWithdraw: PropTypes.bool,
  bankDetails: PropTypes.bool,
  setLoading: PropTypes.func,
  addWithdraw: PropTypes.func,
  bankData: PropTypes.shape({
    sBankName: PropTypes.string,
    _id: PropTypes.string,
    bIsBankApproved: PropTypes.bool,
    sAccountNo: PropTypes.number,
    sBranchName: PropTypes.string,
    sAccountHolderName: PropTypes.string,
    sIFSC: PropTypes.string
  }),
  location: PropTypes.object,
  options: PropTypes.array,
  onGetBankList: PropTypes.func,
  editable: PropTypes.bool,
  setEditable: PropTypes.func
}
export default BankDetail(BankDetailsPage)
