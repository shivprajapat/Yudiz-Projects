import React, {
  useState, useEffect, useRef, Fragment
} from 'react'
import {
  Row, Col, FormGroup, Input, Label, CustomInput, Button, Modal, ModalBody, UncontrolledAlert, Alert, InputGroupText, ModalHeader
} from 'reactstrap'
import Draggable from 'react-draggable'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import {
  verifySpecialCharacter, withoutSpace, verifyLength, isNumber, verifyEmail, ifscCode, panCardNumber, verifyMobileNumber, verifyAadhaarNumber, isFloat, alertClass, modalMessageFunc, isPincode
} from '../../../../helpers/helper'
import Loading from '../../../../components/Loading'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import profilePicture from '../../../../assets/images/profile_pic.png'
import {
  updateUserDetails, addAdminDeposit, getBankDetails, getBalanceDetails, getPreferenceDetails, UpdatePreferenceDetails, addAdminWithdraw, getUserDetails
} from '../../../../actions/users'
import { TypeList, AddUserNotification } from '../../../../actions/notification'
import { getUrl, getKycUrl } from '../../../../actions/url'
import rightIcon from '../../../../assets/images/right-icon.svg'
import wrongIcon from '../../../../assets/images/wrong-icon.svg'
import warningIcon from '../../../../assets/images/warning-icon.svg'
import viewIcon from '../../../../assets/images/view-icon.svg'
import {
  updatePanDetails, addPanDetails, updateAadhaarDetails, addAadhaarDetails, updateKYCStatus, getKycDetails
} from '../../../../actions/kyc'
import moment from 'moment'
import Select from 'react-select'
import { Link, useHistory } from 'react-router-dom'
import backIcon from '../../../../assets/images/left-theme-arrow.svg'
import { states, cities } from '../../../../helpers/country'
import removeImg from '../../../../assets/images/remove_img.svg'
import { Aadhaar, PAN } from '../../../../helpers/KYCRejectReasons'
import refreshIcon from '../../../../assets/images/refresh.svg'
import closeIcon from '../../../../assets/images/red-close-icon.svg'

function UserDetails (props) {
  const { match } = props
  const history = useHistory()
  // const [bankApproval, setBankApproval] = useState('N')
  const [userAccount, setUserAccount] = useState('N')
  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [Id, setId] = useState('')
  const [message, setMessage] = useState('')
  const [userName, setUsername] = useState('')
  const [errUsername, setErrUserName] = useState('')
  const [fullname, setFullname] = useState('')
  const [ErrFullName, setErrFullName] = useState('')
  const [email, setEmail] = useState('')
  const [State, setState] = useState('')
  const [type, setType] = useState('')
  const [errPanNo, setErrPanNo] = useState('')
  const [errPanName, setErrPanName] = useState('')
  const [statusType, setStatusType] = useState('')
  const [errAadhaarNo, setErrAadhaarNo] = useState('')
  const [modal, setModal] = useState(false)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [pincodeErr, setPincodeErr] = useState('')
  const [MobNum, setMobNum] = useState(0)
  const [errEmail, setErrEmail] = useState('')
  const [errMobNum, setErrMobNum] = useState('')
  const [cash, setCash] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [MobNumVerified, setMobNumVerified] = useState(false)
  const [emailVerified, setemailVerified] = useState(false)
  const [Cancel, setCancel] = useState(false)
  const [status, setStatus] = useState(false)
  const [bankDetails, setBankDetails] = useState({})
  const [birthdate, setBirthdate] = useState('')
  const [birthDateErr, setBirthDateErr] = useState('')
  const [gender, setGender] = useState('')
  const [propic, setproPic] = useState('')
  const [userStatus, setUserStatus] = useState('')
  const [referralCode, setRefferalCode] = useState('')
  const [referrals, setReferrals] = useState(0)
  const [panDetails, setPanDetails] = useState({})
  const [aadhaarDetails, setAadhaarDetails] = useState({
    sNo: '',
    nNo: '',
    sFrontImage: '',
    sBackImage: ''
  })
  const [balance, setBalance] = useState('deposit')
  const [balanceType, setBalanceType] = useState('cash')
  const [DepositPassword, setDepositPassword] = useState('')
  const [ErrDepositPassword, setErrDepositPassword] = useState('')
  const [close, setClose] = useState(false)
  const [url, setUrl] = useState('')
  const [kycUrl, setKycUrl] = useState('')
  const [bankErrors, setBankErrors] = useState({
    sName: '',
    sBranch: '',
    sAccountHolderName: '',
    sAccountNo: '',
    sIFSC: ''
  })
  const [bankInformation, setBankInformation] = useState({
    nTotalBonus: '',
    nTotalWin: '',
    nTotalPlayCash: '',
    nTotalDeposit: '',
    nCurrentBonus: '',
    nCurrentCash: '',
    nDeposit: '',
    nWinnings: ''
  })
  const [preferenceInformation, setPreferenceInformation] = useState({
    bEmails: true,
    bPush: true,
    bSms: true,
    bSound: true,
    bVibration: true
  })
  const [isEditUserDetails, setEditUserDetails] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isEditBankDetails, setEditBankDetails] = useState(false)
  const [isEditAdminDeposit, setEditAdminDeposit] = useState(false)
  const [isEditAdminWithdraw, setEditAdminWithdraw] = useState(false)
  const [isEditPanDetails, setEditPanDetails] = useState(false)
  const [addedPanDetails, setAddedPanDetails] = useState(false)
  const [addedKycDetails, setAddedKycDetails] = useState(false)
  const [isEditPreferenceDetails, setEditPreferenceDetails] = useState(false)
  const [isEditAadhaarDetails, setEditAadhaarDetails] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errPanImage, setErrPanImage] = useState('')
  const [errAadhaarImage, setErrAadhaarImage] = useState('')
  const [errTitle, setErrTitle] = useState('')
  const [errDescription, setErrDescription] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [errNotificationType, setErrNotificationType] = useState('')
  const [errCash, setErrCash] = useState('')
  const [errBonus, setErrBonus] = useState('')
  const [reason, setReason] = useState('')
  const [errReason, setErrReason] = useState('')
  const [errImage, setErrImage] = useState('')
  const [withdrawType, setWithdrawType] = useState('withdraw')
  const [amount, setAmount] = useState(0)
  const [WithDrawPassword, setWithDrawPassword] = useState('')
  const [ErrWithdrawPassword, setErrWithdrawPassword] = useState('')
  const [errAmount, setErrAmount] = useState('')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.users.resStatus)
  const resMessage = useSelector(state => state.users.resMessage)
  const actionType = useSelector(state => state.users.type)
  const usersDetails = useSelector(state => state.users.usersDetails)
  const BankDetails = useSelector(state => state.users.bankDetails)
  const BalanceDetails = useSelector(state => state.users.balanceDetails)
  const PreferenceDetails = useSelector(state => state.users.preferenceDetails)
  const kycDetails = useSelector(state => state.kyc.kycDetails)
  const kycResStatus = useSelector(state => state.kyc.resStatus)
  const kycResMessage = useSelector(state => state.kyc.resMessage)
  const kycActionType = useSelector(state => state.kyc.type)
  const updatedKyc = useSelector(state => state.kyc.updatedKyc)
  const getKycUrlLink = useSelector(state => state.url.getKycUrl)
  const notiResStatus = useSelector(state => state.notification.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const notiResMessage = useSelector(state => state.notification.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const typeList = useSelector(state => state.notification.typeList)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalPan, setModalOpen] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  // const [bankModal, setBankModal] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  // const bankWarning = () => {
  //   setBankModal(!bankModal)
  //   setBankDetails({
  //     ...bankDetails,
  //     sAccountHolderName: BankDetails && BankDetails.sAccountHolderName ? BankDetails.sAccountHolderName : '',
  //     sBankName: BankDetails && BankDetails.sBankName ? BankDetails.sBankName : '',
  //     sIFSC: BankDetails && BankDetails.sIFSC ? BankDetails.sIFSC : '',
  //     sAccountNo: BankDetails && BankDetails.sAccountNo ? BankDetails.sAccountNo : '',
  //     sBranch: BankDetails && BankDetails.sBranchName ? BankDetails.sBranchName : '',
  //     bIsChangeApprove: BankDetails && BankDetails.bIsBankApproved,
  //     bAllowUpdate: BankDetails?.bAllowUpdate
  //   })
  // }
  const togglepan = () => setModalOpen(!modalPan)
  const [modalAadhaarF, setModalAADHAARF] = useState(false)
  const toggleAadhaarF = () => setModalAADHAARF(!modalAadhaarF)
  const [modalAadhaarB, setModalAADHAARB] = useState(false)
  const toggleAadhaarB = () => setModalAADHAARB(!modalAadhaarB)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const previousProps = useRef({
    resStatus, resMessage, notiResStatus, notiResMessage, kycResStatus, kycResMessage, BankDetails, PreferenceDetails, kycDetails, updatedKyc, usersDetails, BalanceDetails, State
  }).current

  useEffect(() => {
    dispatch(TypeList(token))
    if (match && match.params && match.params.id) {
      setId(match.params.id)
      if ((Auth && Auth === 'SUPER') || (adminPermission && adminPermission?.USERS !== 'N')) {
        dispatch(getUserDetails(match.params.id, token))
      }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.BANKDETAILS !== 'N')) {
        dispatch(getBankDetails(match.params.id, token))
      }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE !== 'N')) {
        dispatch(getBalanceDetails(match.params.id, token))
      }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.PREFERENCES !== 'N')) {
        dispatch(getPreferenceDetails(match.params.id, token))
      }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'N')) {
        dispatch(getKycDetails(match.params.id, token))
      }
    }
    if (!getUrlLink && !url) {
      dispatch(getUrl('media'))
    }
    if (!getKycUrlLink && !kycUrl) {
      dispatch(getKycUrl('kyc'))
    }
    setLoading(true)
  }, [])

  // set states list
  useEffect(() => {
    if (states) {
      const arr = []
      states.forEach(data => {
        const obj = {
          label: data.state_name,
          value: data.id
        }
        arr.push(obj)
      })
      setStateOptions(arr)
    }
  }, [states])

  useEffect(() => {
    if (previousProps.State !== State) {
      const arr = cities.filter(data => State.value === data.state_id)
      const cityOps = []
      arr.forEach(data => {
        const obj = {
          label: data.city_name,
          value: data.id
        }
        cityOps.push(obj)
      })
      setCityOptions(cityOps)
    }
    return () => {
      previousProps.State = State
    }
  }, [State])

  useEffect(() => {
    if (getUrlLink && (!url)) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (getKycDetails && (!kycUrl)) {
      setKycUrl(getKycUrlLink)
    }
  }, [getKycUrlLink])

  // handle response of kyc
  useEffect(() => {
    if (previousProps.kycDetails !== kycDetails) {
      if (kycDetails) {
        if (kycDetails && kycDetails.oAadhaar && kycDetails.oPan) {
          setAddedPanDetails(true)
          setAddedKycDetails(true)
          setAadhaarDetails(kycDetails.oAadhaar)
          setPanDetails(kycDetails.oPan)
        } else if (kycDetails && kycDetails.oAadhaar) {
          setAddedKycDetails(true)
          setAadhaarDetails(kycDetails.oAadhaar)
        } else if (kycDetails && kycDetails.oPan) {
          if (kycDetails.oPan.eStatus === 'P' || kycDetails.oPan.eStatus === 'A') setAddedPanDetails(true)
          setPanDetails(kycDetails.oPan)
        }
        setCancel(false)
        setLoading(false)
      }
    }

    if ((!kycResStatus && kycResMessage)) {
      if (kycActionType === 'UPDATE_AADHAAR_DETAILS' || kycActionType === 'ADD_AADHAAR_DETAILS') {
        setAadhaarDetails({
          sNo: '',
          nNo: '',
          sFrontImage: '',
          sBackImage: ''
        })
      } else if (kycActionType === 'UPDATE_PAN_DETAILS' || kycActionType === 'ADD_PAN_DETAILS') {
        setPanDetails({
          sNo: '',
          sImage: '',
          sName: ''
        })
      }
      dispatch(getKycDetails(match.params.id, token))
      setLoading(false)
    }
    return () => {
      previousProps.kycDetails = kycDetails
    }
  }, [kycDetails, kycResMessage, kycResStatus])

  useEffect(() => {
    if (previousProps.updatedKyc !== updatedKyc) {
      if (updatedKyc && match && match.params && match.params.id) {
        dispatch(getKycDetails(match.params.id, token))
        setAadhaarDetails({})
        setPanDetails({})
        setLoading(false)
      }
    }
    return () => {
      previousProps.updatedKyc = updatedKyc
    }
  }, [updatedKyc])

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.usersDetails !== usersDetails && previousProps.PreferenceDetails !== PreferenceDetails && previousProps.BankDetails !== BankDetails && previousProps.BalanceDetails !== BalanceDetails && (kycDetails && previousProps.kycDetails !== kycDetails)) {
      setLoading(false)
    }
  }, [usersDetails, PreferenceDetails, BankDetails, BalanceDetails, kycDetails])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setStatus(resStatus)
          if (actionType === 'ADD_BANK_DETAILS') {
            setEditBankDetails(false)
          } else if (actionType === 'UPDATE_USER_DETAILS') {
            setEditUserDetails(false)
          } else if (actionType === 'UPDATE_PREFERENCE_DETAILS') {
            setEditPreferenceDetails(false)
          } else if (actionType === 'UPDATE_BANK_DETAILS') {
            setEditBankDetails(false)
          } else if (actionType === 'ADD_USER_DEPOSIT') {
            setEditAdminDeposit(false)
          } else if (actionType === 'ADD_USER_WITHDRAW') {
            setEditAdminWithdraw(false)
          }
        }
        setMessage(resMessage)
        setModalMessage(true)
        setLoading(false)
        dispatch(getUserDetails(match.params.id, token))
        dispatch(getBankDetails(match.params.id, token))
        dispatch(getBalanceDetails(match.params.id, token))
        dispatch(getPreferenceDetails(match.params.id, token))
        dispatch(getKycDetails(match.params.id, token))
        dispatch(getUrl('media'))
        dispatch(getKycUrl('kyc'))
      }
    }
    if (previousProps.notiResMessage !== notiResMessage) {
      if (notiResMessage) {
        if (notiResStatus) {
          setStatus(notiResStatus)
        }
        setMessage(notiResMessage)
        setModalMessage(true)
        setLoading(false)
      }
    }
    if (previousProps.kycResMessage !== kycResMessage) {
      if (kycResMessage) {
        if (kycResStatus) {
          setStatus(kycResStatus)
          if (kycActionType === 'UPDATE_PAN_DETAILS' || kycActionType === 'ADD_PAN_DETAILS') {
            setEditPanDetails(false)
          } else if (kycActionType === 'UPDATE_AADHAAR_DETAILS' || kycActionType === 'ADD_AADHAAR_DETAILS') {
            setEditAadhaarDetails(false)
          }
          dispatch(getKycDetails(match.params.id, token))
        }
        setMessage(kycResMessage)
        setModalMessage(true)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
      previousProps.notiResMessage = notiResMessage
      previousProps.kycResMessage = kycResMessage
    }
  }, [resStatus, resMessage, notiResMessage, notiResStatus, kycResStatus, kycResMessage])

  useEffect(() => {
    if (previousProps.usersDetails !== usersDetails || (!resStatus && resMessage) || Cancel) {
      if (usersDetails) {
        setUserAccount(usersDetails.bIsInternalAccount ? 'Y' : 'N')
        setEmail(usersDetails.sEmail)
        setUsername(usersDetails.sUsername)
        setFullname(usersDetails.sName)
        setMobNum(usersDetails.sMobNum)
        setMobNumVerified(usersDetails.bIsMobVerified)
        setemailVerified(usersDetails.bIsEmailVerified)
        setRefferalCode(usersDetails.sReferCode)
        setproPic(usersDetails.sProPic)
        setGender(usersDetails.eGender)
        setBirthdate(usersDetails.dDob)
        setAddress(usersDetails.sAddress ? usersDetails.sAddress : '')
        setPincode(usersDetails.nPinCode ? usersDetails.nPinCode : '')
        setUserStatus(usersDetails.eStatus)
        setReferrals(usersDetails.nReferrals ? usersDetails.nReferrals : 0)
        setCancel(false)
        const state = states.find(data => data.id === parseInt(usersDetails?.iStateId))
        setState(((usersDetails.iStateId && state)) ? { label: state.state_name || '', value: state.id || '' } : '')
        const city = cities.find(data => data.id === parseInt(usersDetails?.iCityId))
        setCity((usersDetails.iCityId && city) ? { label: city.city_name || '', value: city.id || '' } : '')
      }
    }
    return () => {
      previousProps.usersDetails = usersDetails
    }
  }, [usersDetails, resMessage, resStatus, Cancel])

  useEffect(() => {
    if (previousProps.BalanceDetails !== BalanceDetails) {
      if (BalanceDetails) {
        setBankInformation({
          ...bankInformation,
          nTotalBonus: BalanceDetails.nTotalBonusEarned ? BalanceDetails.nTotalBonusEarned.toFixed(2) : 0,
          nTotalWin: BalanceDetails.nTotalWinningAmount ? BalanceDetails.nTotalWinningAmount.toFixed(2) : 0,
          nTotalPlayCash: BalanceDetails.nTotalPlayCash ? BalanceDetails.nTotalPlayCash.toFixed(2) : 0,
          nTotalDeposit: BalanceDetails.nTotalDepositAmount ? BalanceDetails.nTotalDepositAmount.toFixed(2) : 0,
          nCurrentBonus: BalanceDetails.nCurrentBonus ? BalanceDetails.nCurrentBonus.toFixed(2) : 0,
          nCurrentCash: BalanceDetails.nCurrentTotalBalance ? BalanceDetails.nCurrentTotalBalance.toFixed(2) : 0,
          nDeposit: BalanceDetails.nCurrentDepositBalance ? BalanceDetails.nCurrentDepositBalance.toFixed(2) : 0,
          nWinnings: BalanceDetails.nCurrentWinningBalance ? BalanceDetails.nCurrentWinningBalance.toFixed(2) : 0
        })
      }
    }
    return () => {
      previousProps.BalanceDetails = BalanceDetails
    }
  }, [BalanceDetails])

  useEffect(() => {
    if (previousProps.PreferenceDetails !== PreferenceDetails || Cancel || (!resStatus && resMessage)) {
      if (PreferenceDetails) {
        setPreferenceInformation({
          ...preferenceInformation,
          bEmails: PreferenceDetails.bEmails,
          bPush: PreferenceDetails.bPush,
          bSms: PreferenceDetails.bSms,
          bSound: PreferenceDetails.bSound,
          bVibration: PreferenceDetails.bVibration
        })
        setCancel(false)
      }
    }
    return () => {
      previousProps.PreferenceDetails = PreferenceDetails
    }
  }, [PreferenceDetails, resMessage, resStatus, Cancel])

  useEffect(() => {
    if (previousProps.BankDetails !== BankDetails || Cancel || (!resStatus && resMessage)) {
      if (BankDetails) {
        setBankDetails({
          ...bankDetails,
          sAccountHolderName: BankDetails && BankDetails.sAccountHolderName ? BankDetails.sAccountHolderName : '',
          sBankName: BankDetails && BankDetails.sBankName ? BankDetails.sBankName : '',
          sIFSC: BankDetails && BankDetails.sIFSC ? BankDetails.sIFSC : '',
          sAccountNo: BankDetails && BankDetails.sAccountNo ? BankDetails.sAccountNo : '',
          sBranch: BankDetails && BankDetails.sBranchName ? BankDetails.sBranchName : '',
          bIsChangeApprove: BankDetails && BankDetails.bIsBankApproved,
          bAllowUpdate: BankDetails?.bAllowUpdate
        })
        setCancel(false)
      }
    }
    return () => {
      previousProps.BankDetails = BankDetails
    }
  }, [BankDetails, resMessage, resStatus, Cancel])

  useEffect(() => {
    if (typeList) {
      if (typeList && typeList.length !== 0) {
        setNotificationType(typeList[0]._id)
      }
    }
  }, [typeList])

  function handleChange (event, eType) {
    switch (eType) {
      case 'RemoveImage':
        setproPic('')
        break
      case 'RemovePANImage':
        setPanDetails({ ...panDetails, sImage: '' })
        break
      case 'RemoveAadhaarFront':
        setAadhaarDetails({ ...aadhaarDetails, sFrontImage: '' })
        break
      case 'RemoveAadhaarBack':
        setAadhaarDetails({ ...aadhaarDetails, sBackImage: '' })
        break
      case 'UserAccount':
        setUserAccount(event.target.value)
        break
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrFullName('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrFullName('Required field')
        }
        setFullname(event.target.value)
        break
      case 'Email':
        if (verifyLength(event.target.value, 1) && verifyEmail(event.target.value)) {
          setErrEmail('')
        }
        setEmail(event.target.value)
        break
      case 'userName':
        if (verifyLength(event.target.value, 5) && event.target.value.length <= 16 && !withoutSpace(event.target.value) && verifySpecialCharacter(event.target.value)) {
          setErrUserName('')
        } else {
          if (withoutSpace(event.target.value)) {
            setErrUserName('Team Name must be alpha-numeric.')
          } else if (!verifyLength(event.target.value, 5)) {
            setErrUserName('Team Name must of minimum of 5 character')
          } else if (!verifySpecialCharacter(event.target.value)) {
            setErrUserName('Team Name must be alpha-numeric.')
          } else if (event.target.value.length > 16) {
            setErrUserName('Team Name must be maximum of 15 characters')
          }
        }
        setUsername(event.target.value)
        break
      case 'MobNum':
        if (!event.target.value) {
          setErrMobNum('Required field')
        } else if (verifyMobileNumber(event.target.value)) {
          setErrMobNum('')
        } else if (!isNumber(event.target.value)) {
          setErrMobNum('Must be numbers')
        } else if (!verifyMobileNumber(event.target.value)) {
          setErrMobNum('Must be 10 digits')
        }
        setMobNum(event.target.value)
        break
      case 'Address':
        setAddress(event.target.value)
        break
      case 'PreferenceEmail':
        setPreferenceInformation({ ...preferenceInformation, bEmails: event.target.value === 'Y' })
        break
      case 'PreferencePush':
        setPreferenceInformation({ ...preferenceInformation, bPush: event.target.value === 'Y' })
        break
      case 'PreferenceSMS':
        setPreferenceInformation({ ...preferenceInformation, bSms: event.target.value === 'Y' })
        break
      case 'PreferenceSound':
        setPreferenceInformation({ ...preferenceInformation, bSound: event.target.value === 'Y' })
        break
      case 'PreferenceVibration':
        setPreferenceInformation({ ...preferenceInformation, bVibration: event.target.value === 'Y' })
        break
      case 'PreferencePushNoti':
        setPreferenceInformation({ ...preferenceInformation, bPush: event.target.value === 'Y' })
        break
      case 'City':
        setCity(event)
        break
      case 'Pincode':
        if (!isNaN(event.target.value) || (!event.target.value)) {
          if (isPincode(event.target.value)) {
            setPincodeErr('Please enter proper Pincode!')
          } else {
            setPincodeErr('')
          }
          setPincode(event.target.value && parseInt(event.target.value))
        }
        break
      case 'State':
        setState(event)
        setCity('')
        break
      case 'Gender':
        setGender(event.target.value)
        break
      case 'UserStatus':
        setUserStatus(event.target.value)
        break
      case 'Birthdate':
        if (moment(event.target.value).isAfter(moment())) {
          setBirthDateErr('Date should not be future date')
        } else if (moment().subtract('years', 18).isBefore(event.target.value)) {
          setBirthDateErr('User must be greater or equal to 18 years old')
        } else if (!verifyLength(moment(event.target.value).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setBirthDateErr('Required field')
        } else {
          setBirthDateErr('')
        }
        setBirthdate(event.target.value)
        break
      case 'Status':
        setStatus(event.target.value === 'true')
        break
      case 'AccHolderName':
        if (verifyLength(event.target.value, 1)) {
          setBankErrors({ ...bankErrors, sAccountHolderName: '' })
        } else {
          setBankErrors({ ...bankErrors, sAccountHolderName: 'Required field' })
        }
        setBankDetails({ ...bankDetails, sAccountHolderName: event.target.value })
        break
      case 'BankChangeApproval':
        setBankDetails({ ...bankDetails, bIsChangeApprove: event.target.value === 'true' })
        break
      case 'BankName':
        if (verifyLength(event.target.value, 1)) {
          setBankErrors({ ...bankErrors, sBankName: '' })
        } else {
          setBankErrors({ ...bankErrors, sBankName: 'Required field' })
        }
        setBankDetails({ ...bankDetails, sBankName: event.target.value })
        break
      case 'IFSCCode':
        if (verifyLength(event.target.value, 1) && !ifscCode(event.target.value)) {
          setBankErrors({ ...bankErrors, sIFSC: '' })
        } else {
          setBankErrors({ ...bankErrors, sIFSC: 'IFSC is not correct' })
        }
        setBankDetails({ ...bankDetails, sIFSC: (event.target.value).toUpperCase() })
        break
      case 'AccNo':
        if (isNumber(event.target.value)) {
          setBankErrors({ ...bankErrors, sAccountNo: '' })
        } else if (!event.target.value) {
          setBankErrors({ ...bankErrors, sAccountNo: 'Required field' })
        } else if (!isNumber(event.target.value)) {
          setBankErrors({ ...bankErrors, sAccountNo: 'Must be number' })
        }
        setBankDetails({ ...bankDetails, sAccountNo: event.target.value })
        break
      case 'Branch':
        if (verifyLength(event.target.value, 1)) {
          setBankErrors({ ...bankErrors, sBranch: '' })
        } else {
          setBankErrors({ ...bankErrors, sBranch: 'Required field' })
        }
        setBankDetails({ ...bankDetails, sBranch: event.target.value })
        break
      case 'KYC_Pan':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          setErrPanImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrPanImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPanDetails({ ...panDetails, sImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          setEditPanDetails(true)
          setErrPanImage('')
        }
        break
      case 'KYC_Pan_DocNo':
        if (!panCardNumber(event.target.value)) {
          setErrPanNo('')
        } else {
          setErrPanNo('Enter Proper PanCard Number')
        }
        setPanDetails({ ...panDetails, sNo: (event.target.value).toUpperCase() })
        break
      case 'KYC_Pan_Name':
        if (verifyLength(event.target.value, 1)) {
          setErrPanName('')
        } else {
          setErrPanName('Required field')
        }
        setPanDetails({ ...panDetails, sName: event.target.value })
        break
      case 'KYC_IDProof_front':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          setErrAadhaarImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrAadhaarImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setAadhaarDetails({ ...aadhaarDetails, sFrontImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          aadhaarDetails && aadhaarDetails.sBackImage && aadhaarDetails.sBackImage.imageUrl && setErrAadhaarImage('')
          setErrAadhaarImage('')
        }
        break
      case 'KYC_IDProof_Back':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          setErrAadhaarImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrAadhaarImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setAadhaarDetails({ ...aadhaarDetails, sBackImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          aadhaarDetails && aadhaarDetails.sFrontImage && aadhaarDetails.sFrontImage.imageUrl && setErrAadhaarImage('')
          setErrAadhaarImage('')
        }
        break
      case 'KYC_AADHAAR_NO':
        if (!event.target.value) {
          setErrAadhaarNo('Required field')
        } else if (verifyAadhaarNumber(event.target.value)) {
          setErrAadhaarNo('')
        } else if (!isNumber(event.target.value)) {
          setErrAadhaarNo('Must be numbers')
        } else if (!verifyAadhaarNumber(event.target.value)) {
          setErrAadhaarNo('Length Must be 12')
        }
        setAadhaarDetails({ ...aadhaarDetails, nNo: event.target.value })
        break
      case 'Balance':
        setBalance(event.target.value)
        break
      case 'Deposit_Type':
        setBalanceType(event.target.value)
        break
      case 'ProPic':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          setErrImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0]) {
          setproPic({ imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'title':
        if (verifyLength(event.target.value, 1)) {
          setErrTitle('')
        } else {
          setErrTitle('Required field')
        }
        setTitle(event.target.value)
        break
      case 'description':
        if (verifyLength(event.target.value, 1)) {
          setErrDescription('')
        } else {
          setErrDescription('Required field')
        }
        setDescription(event.target.value)
        break
      case 'Cash':
        if (!event.target.value) {
          setErrCash('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setErrCash('Enter number only')
          } else {
            setErrCash('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setErrCash('')
        }
        setCash(event.target.value)
        break
      case 'Bonus':
        if (!event.target.value) {
          setErrBonus('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setErrBonus('Enter number only')
          } else {
            setErrBonus('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setErrBonus('')
        }
        setBonus(event.target.value)
        break
      case 'DepositPassword':
        if (verifyLength(event.target.value, 1)) {
          setErrDepositPassword('')
        } else {
          setErrDepositPassword('Required field')
        }
        setDepositPassword(event.target.value)
        break
      case 'WithdrawType':
        setWithdrawType(event.target.value)
        break
      case 'Amount':
        if (!event.target.value) {
          setErrAmount('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setErrAmount('Enter number only')
          } else {
            setErrAmount('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setErrAmount('')
        }
        setAmount(event.target.value)
        break
      case 'WithdrawPassword':
        if (verifyLength(event.target.value, 1)) {
          setErrWithdrawPassword('')
        } else {
          setErrWithdrawPassword('Required field')
        }
        setWithDrawPassword(event.target.value)
        break
      case 'Type':
        if (verifyLength(event.target.value, 1)) {
          setErrNotificationType('')
        } else {
          setErrNotificationType('Required field')
        }
        setNotificationType(event.target.value)
        break
      case 'Reason':
        if (!event.target.value) {
          setErrReason('Please select reason')
        } else {
          setErrReason('')
        }
        setReason(event.target.value)
        break
      default:
        break
    }
  }

  function changeProfileData () {
    if (isNumber(MobNum) && !birthDateErr && !errEmail) {
      const updateUserData = {
        userName, userAccount, fullname, ID: match.params.id, propic, email, MobNum, gender, birthdate, address, city: city.value, pincode, State: State.value, userStatus, token
      }
      dispatch(updateUserDetails(updateUserData))
      setErrImage('')
      setLoading(true)
    } else {
      if (!email) {
        setErrEmail('Required field')
      } else if (!verifyEmail(email)) {
        setErrEmail('Enter Proper Email')
      }
      if (MobNum.length !== 10) {
        setErrMobNum('Number must be 10 digits')
      }
      if (!MobNum) {
        setErrMobNum('Required field')
      } else if (!isNumber(MobNum)) {
        setErrMobNum('Enter only numbers')
      }
      if (moment(birthdate).isAfter(moment())) {
        setBirthDateErr('Date should not be future date')
      }
    }
  }

  function addAdminDepo () {
    if (isFloat(cash) && isFloat(bonus) && DepositPassword) {
      dispatch(addAdminDeposit(match.params.id, balance, balanceType, cash, bonus, DepositPassword, token))
      setBalance('deposit')
      setBalanceType('cash')
      setCash(0)
      setBonus(0)
      setDepositPassword('')
      setLoading(true)
    } else {
      if (balanceType === 'cash' && !cash) {
        setErrCash('Required field')
      }
      if (balanceType === 'bonus' && !bonus) {
        setErrBonus('Required field')
      }
      if (!verifyLength(DepositPassword, 1)) {
        setErrDepositPassword('Required field')
      }
    }
  }

  function funcAddAdminWithdraw () {
    if (isFloat(amount)) {
      dispatch(addAdminWithdraw(match.params.id, withdrawType, amount, WithDrawPassword, token))
      setWithdrawType('withdraw')
      setAmount(0)
      setWithDrawPassword('')
      setLoading(true)
    } else {
      if (!amount) {
        setErrAmount('Required field')
      }
      if (!verifyLength(WithDrawPassword, 1)) {
        setErrWithdrawPassword('Required field')
      }
    }
  }

  // function changeBankDetails () {
  //   if (verifyLength(bankDetails.sBankName, 1) && verifyLength(bankDetails.sBranch, 1) && verifyLength(bankDetails.sAccountHolderName, 1) && verifyLength(bankDetails.sIFSC, 1) && verifyLength(bankDetails.sAccountNo, 1) && !ifscCode(bankDetails.sIFSC)) {
  //     if (BankDetails && BankDetails.sAccountNo) {
  //       dispatch(UpdateBankDetails(bankDetails, Id, token))
  //     } else {
  //       dispatch(AddBankDetails(bankDetails, Id, token))
  //     }
  //     setLoading(true)
  //     setBankModal(false)
  //   } else {
  //     setBankErrors({
  //       sBankName: !verifyLength(bankDetails.sBankName, 1) ? 'Required field' : '',
  //       sBranch: !verifyLength(bankDetails.sBranch, 1) ? 'Required field' : '',
  //       sAccountHolderName: !verifyLength(bankDetails.sAccountHolderName, 1) ? 'Required field' : '',
  //       sAccountNo: !bankDetails.sAccountNo ? 'Required field' : !isNumber(bankDetails.sAccountNo) ? 'Must be number' : '',
  //       sIFSC: !verifyLength(bankDetails.sIFSC, 1) ? 'Required field' : ifscCode(bankDetails.sIFSC) ? 'IFSC is not correct' : ''
  //     })
  //   }
  // }

  function changePreferenceDetails (e) {
    e.preventDefault()
    if (preferenceInformation) {
      dispatch(UpdatePreferenceDetails(preferenceInformation, Id, token))
      setLoading(true)
    }
  }

  function onEditUserDetails () {
    if (!isEditUserDetails) {
      setEditUserDetails(true)
    }
  }

  // function onEditBankDetails () {
  //   if (!isEditBankDetails) {
  //     setEditBankDetails(true)
  //   }
  // }

  function onEditAdminDeposit () {
    if (!isEditAdminDeposit) {
      setEditAdminDeposit(true)
    }
  }

  function onEditAdminWithdraw () {
    if (!isEditAdminWithdraw) {
      setEditAdminWithdraw(true)
    }
  }

  function onEditPreferenceDetails () {
    if (!isEditPreferenceDetails) {
      setEditPreferenceDetails(true)
    }
  }

  function onSendNotification () {
    if (verifyLength(title, 1) && verifyLength(description, 1) && notificationType && !errTitle && !errDescription) {
      dispatch(AddUserNotification(match.params.id, title, description, notificationType, token))
      setLoading(true)
      setTitle('')
      setDescription('')
      if (typeList) {
        if (typeList && typeList.length !== 0) {
          setNotificationType(typeList[0]._id)
        }
      }
    } else {
      if (!verifyLength(title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(description, 1)) {
        setErrDescription('Required field')
      }
    }
  }

  function warningWithConfirmMessage (eType, statustype) {
    const Status = (eType === 'verify' ? 'A' : eType === 'reject' ? 'R' : '')
    setStatusType(statustype)
    setType(eType)
    if (Status === 'R') {
      setModal(true)
    } else {
      setModalWarning(true)
    }
  }

  function onImageError () {

  }

  function onEditPanDetails () {
    if (isEditPanDetails) {
      if (panDetails && panDetails.sImage && panDetails.sNo && !errPanNo && addedPanDetails && kycDetails && kycDetails.oPan) {
        if (match && match.params && match.params.id) {
          dispatch(updatePanDetails(match.params.id, panDetails.sImage, panDetails.sNo, panDetails.sName, token))
          setErrPanImage('')
          setLoading(true)
          setType('')
        }
      } else {
        if (panDetails && panDetails.sImage && panDetails.sNo && !errPanNo && !addedPanDetails) {
          if (match && match.params && match.params.id) {
            dispatch(addPanDetails(match.params.id, panDetails.sImage, panDetails.sNo, panDetails.sName, token))
            setErrPanImage('')
            setLoading(true)
            setType('')
          }
        } else {
          if (!panDetails.sNo) {
            setErrPanNo('Pan No is Required')
          }
          if (!panDetails.sImage) {
            setErrPanImage('Image Required')
          }
          if (!panDetails.sName) {
            setErrPanName('Name Required')
          }
        }
      }
    } else {
      setEditPanDetails(true)
    }
  }

  function onEditAadhaarDetails () {
    if (isEditAadhaarDetails) {
      if (aadhaarDetails && aadhaarDetails.sFrontImage && aadhaarDetails.sBackImage && aadhaarDetails.nNo && addedKycDetails) {
        if (match && match.params && match.params.id) {
          if (aadhaarDetails.sBackImage.imageUrl && aadhaarDetails.sFrontImage.imageUrl && addedKycDetails) {
            dispatch(updateAadhaarDetails(match.params.id, aadhaarDetails.sFrontImage, aadhaarDetails.sBackImage, aadhaarDetails.nNo, token))
            setErrAadhaarImage('')
          }
          setLoading(true)
          setType('')
        }
      } else {
        if (aadhaarDetails.sBackImage && aadhaarDetails.sFrontImage && !addedKycDetails) {
          if (match && match.params && match.params.id) {
            dispatch(addAadhaarDetails(match.params.id, aadhaarDetails.sFrontImage, aadhaarDetails.sBackImage, aadhaarDetails.nNo, token))
            setErrAadhaarImage('')
            setLoading(true)
            setType('')
          }
        } else {
          if (!isNumber(aadhaarDetails.nNo)) {
            setErrAadhaarNo('Required field')
          }
          if (!aadhaarDetails.sBackImage || !aadhaarDetails.sFrontImage) {
            setErrAadhaarImage('Both images are required')
          }
        }
      }
    } else {
      setEditAadhaarDetails(true)
    }
  }

  function handleModalClose () {
    setModal(false)
  }

  function copyToClipboard () {
    if (usersDetails && usersDetails.sReferCode) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(usersDetails.sReferCode).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
          .catch(() => console.log('error'))
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = usersDetails.sReferCode
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise(function () {
          if (document.execCommand('copy')) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }
          textArea.remove()
        })
      }
    }
  }

  function onUpdateStatus () {
    const eStatus = (type === 'verify' ? 'A' : 'R')
    if (match && match.params && match.params.id) {
      dispatch(updateKYCStatus(match.params.id, eStatus, statusType, reason, token))
      setLoading(true)
    }
    if (type === 'verify') {
      toggleWarning()
    } else {
      setModal(false)
      setReason('')
    }
  }

  // to handle cancel button operation
  function cancelFunc (type) {
    if (type === 'profile') {
      setEditUserDetails(false)
      setErrEmail('')
      setErrMobNum('')
      setErrFullName('')
      setErrImage('')
    } else if (type === 'preference') {
      setEditPreferenceDetails(false)
    } else if (type === 'bank') {
      setEditBankDetails(false)
      setBankErrors({
        sBankName: '',
        sBranch: '',
        sAccountHolderName: '',
        sAccountNo: '',
        sIFSC: ''
      })
    } else if (type === 'admin_deposit') {
      setEditAdminDeposit(false)
      setCash(0)
      setBonus(0)
      setDepositPassword('')
      setErrCash('')
      setErrBonus('')
      setErrDepositPassword('')
    } else if (type === 'admin_withdraw') {
      setEditAdminWithdraw(false)
      setAmount('')
      setWithDrawPassword('')
      setErrAmount('')
      setErrWithdrawPassword('')
    } else if (type === 'kyc_pan') {
      setEditPanDetails(false)
      setErrPanImage('')
      setErrPanNo('')
      panDetails.sNo = ''
      panDetails.sImage = ''
      panDetails.sName = ''
    } else if (type === 'kyc_aadhaar') {
      setEditAadhaarDetails(false)
      setErrAadhaarImage('')
      setErrAadhaarNo('')
      aadhaarDetails.sNo = ''
      aadhaarDetails.nNo = ''
      aadhaarDetails.sFrontImage = ''
      aadhaarDetails.sBackImage = ''
    }
    setCancel(true)
  }

  function onRefresh () {
    dispatch(getUserDetails(match.params.id, token))
    dispatch(getBankDetails(match.params.id, token))
    dispatch(getBalanceDetails(match.params.id, token))
    dispatch(getPreferenceDetails(match.params.id, token))
    dispatch(getKycDetails(match.params.id, token))
    dispatch(getUrl('media'))
    dispatch(getKycUrl('kyc'))
    setLoading(true)
  }

  // function bankChangeApprovalWarning () {
  //   setBankApproval(!bankDetails.bIsChangeApprove)
  //   setBankDetails({ ...bankDetails, bIsChangeApprove: !bankDetails.bIsChangeApprove })
  //   setBankModal(true)
  // }

  return (
    <>
      {loading && <Loading />}
      <main className='main-content d-flex'>
        {
          modalMessage && message && (
            <UncontrolledAlert color='primary' className={alertClass(status, close)}>{message}</UncontrolledAlert>
          )
        }
        {copied && <Alert color='primary'>Copied into a Clipboard</Alert>}
        <section className='user-section'>
          <div className='mb-3 d-flex justify-content-between'>
            <div>
              <img src={backIcon} className='custom-go-back' height='24' width='24' onClick={() => (props.location.state && props.location.state.userList) ? history.push(`/users/user-management${page?.UserManagement || ''}`) : history.goBack()}></img>
            </div>
            <div>
              <Link className='btn-link' to={{ pathname: '/users/user-management/user-debugger-page/' + match.params.id, state: { goBack: 'yes' } }}>Go To User Debugger</Link>
              <Button color="link" className='ml-3' onClick={onRefresh}>
                <img src={refreshIcon} alt="Users" height="20px" width="20px" />
              </Button>
            </div>
          </div>
          <Row>
            <Col lg='3'>
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.USERS !== 'N')) &&
                (
                  <Fragment>
                    <div className='common-box'>

                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.USERS !== 'R')) &&
                          (
                            <Fragment>
                              <div className='float-right'><Button onClick={isEditUserDetails ? changeProfileData : onEditUserDetails} color='link'>{isEditUserDetails ? 'Save' : 'Edit'}</Button></div>
                              <div className='float-left'><Button className='text-left' onClick={() => cancelFunc('profile')} color='link'>{isEditUserDetails ? 'Cancel' : ''}</Button></div>
                            </Fragment>
                          )
                        }
                      <div className='profile-block text-center'>
                        <div className='profile-image'>
                          <img className='profile-pic' src={propic ? propic.imageUrl ? propic.imageUrl : url + propic : profilePicture} alt='userPic' onError={ev => onImageError(ev, 'propic')} />
                          {!propic && <div className='file-btn'><Input accept="image/png, image/jpg, image/jpeg" type='file' disabled={!isEditUserDetails} onChange={event => handleChange(event, 'ProPic')} /></div>}
                          {propic && ((Auth && Auth === 'SUPER') || (adminPermission?.USERS === 'W')) && <div className='remove-img-label' onClick={event => handleChange(event, 'RemoveImage')} hidden={!isEditUserDetails}><img src={removeImg} /></div>}
                          <p className='error-text mr-4'>{errImage}</p>
                        </div>
                        <h3>{fullname}</h3>
                      </div>
                      <FormGroup>
                        <Label for='account'>Internal Account</Label>
                        <div className='d-flex inline-input'>
                          <CustomInput disabled={!isEditUserDetails} type='radio' id='accountRadio1' name='account' label='Yes' onChange={event => handleChange(event, 'UserAccount')} value='Y' checked={userAccount === 'Y'} />
                          <CustomInput disabled={!isEditUserDetails} type='radio' id='accountRadio2' name='account' label='No' onChange={event => handleChange(event, 'UserAccount')} value='N' checked={userAccount === 'N'} />
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Label for='fullName'>Full Name</Label>
                        <Input disabled={!isEditUserDetails} type='text' id='fullName' placeholder='Enter Full Name' value={fullname} onChange={event => handleChange(event, 'Name')} />
                        <p className='error-text'>{ErrFullName}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for='userName'>Team Name</Label>
                        <Input disabled={!isEditUserDetails} type='text' id='userName' placeholder='Enter Team Name' value={userName} onChange={event => handleChange(event, 'userName')} />
                        <p className='error-text'>{errUsername}</p>
                      </FormGroup>
                      <FormGroup className='custom-form-group-input'>
                        <Label for='email'>Email</Label>
                        <Input disabled={!isEditUserDetails} type='text' id='email' placeholder='Enter Email' value={email} onChange={event => handleChange(event, 'Email')} />
                        {email && (emailVerified ? <img className='custom-form-group-input-img' src={rightIcon} alt='Approve' /> : <img className='custom-form-group-input-img' src={closeIcon} alt='Reject' />)}
                        <p className='error-text'>{errEmail}</p>
                      </FormGroup>
                      <FormGroup className='custom-form-group-input'>
                        <Label for='phoneNumber'>Mobile Number</Label>
                        <Input disabled={!isEditUserDetails} type='text' id='mobnum' placeholder='Enter Mobile Number' value={MobNum} onChange={event => handleChange(event, 'MobNum')} />
                        {MobNum && (MobNumVerified ? <img className='custom-form-group-input-img' src={rightIcon} alt='Approve' /> : <img className='custom-form-group-input-img' src={closeIcon} alt='Reject' />)}
                        <p className='error-text'>{errMobNum}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for='birthdate'>Birthdate</Label>
                        <Input disabled={!isEditUserDetails} type='date' id='birthdate' placeholder='Enter Birthdate' value={birthdate ? moment(birthdate).format('YYYY-MM-DD') : ''} onChange={event => handleChange(event, 'Birthdate')} />
                        <p className='error-text'>{birthDateErr}</p>
                      </FormGroup>
                <FormGroup>
                  <Label for='platform'>Platform</Label>
                  <InputGroupText disabled type='text' id='platform'>{usersDetails?.ePlatform === 'W' ? 'Web' : usersDetails?.ePlatform === 'A' ? 'Android' : usersDetails?.ePlatform === 'I' ? 'iOS' : 'Not Available'}</InputGroupText>
                </FormGroup>
                <FormGroup>
                  <Label for='phoneNumber'>Gender</Label>
                  <div className='d-flex inline-input'>
                    <CustomInput disabled={!isEditUserDetails} type='radio' id='genderRadio1' name='genderRadio' label='Male' onClick={event => handleChange(event, 'Gender')} value='M' checked={gender === 'M'} />
                    <CustomInput disabled={!isEditUserDetails} type='radio' id='genderRadio2' name='genderRadio' label='Female' onClick={event => handleChange(event, 'Gender')} value='F' checked={gender === 'F'} />
                    <CustomInput disabled={!isEditUserDetails} type='radio' id='genderRadio3' name='genderRadio' label='Other' onClick={event => handleChange(event, 'Gender')} value='O' checked={gender === 'O'} />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for='status'>User Status</Label>
                  <div className='d-flex inline-input'>
                    <CustomInput disabled={!isEditUserDetails} type='radio' id='statusRadio1' name='statusRadio' label='Active' onClick={event => handleChange(event, 'UserStatus')} value='Y' checked={userStatus === 'Y'} />
                    <CustomInput disabled={!isEditUserDetails} type='radio' id='statusRadio2' name='statusRadio' label='Block' onClick={event => handleChange(event, 'UserStatus')} value='N' checked={userStatus === 'N'} />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for='state'>State</Label>
                  <Select
                    options={stateOptions}
                    id='state'
                    name='state'
                    placeholder='Select State'
                    value={State}
                    onChange={selectedOption => handleChange(selectedOption, 'State')}
                    isDisabled={!isEditUserDetails}
                  />
                </FormGroup>
                <FormGroup>
                <Label for='city'>City</Label>
                  <Select
                    options={cityOptions}
                    id='city'
                    name='city'
                    placeholder='Select City'
                    value={city}
                    onChange={selectedOption => handleChange(selectedOption, 'City')}
                    isDisabled={!isEditUserDetails || !State}
                    controlShouldRenderValue={cityOptions}
                  />
              </FormGroup>
                <FormGroup>
                  <Label for='address'>Address</Label>
                  <Input disabled={!isEditUserDetails} type='text' id='address' placeholder='Enter Address' value={address} onChange={event => handleChange(event, 'Address')} />
                </FormGroup>

                <FormGroup>
                  <Label for='pincode'>Pincode</Label>
                  <Input disabled={!isEditUserDetails} type='text' id='pincode' placeholder='Enter Pincode' value={pincode} onChange={event => handleChange(event, 'Pincode')} />
                  <p className='error-text'>{pincodeErr}</p>
                </FormGroup>
                </div>
                </Fragment>
                )
              }
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.PREFERENCES !== 'N')) &&
                (
                  <Fragment>
                    <div className='common-box'>
                      <div className='d-flex justify-content-between align-items-start'>
                          <h3>Preference Details</h3>
                          {((Auth && Auth === 'SUPER') || (adminPermission?.PREFERENCES !== 'R')) && <div><Button color='link' onClick={isEditPreferenceDetails ? changePreferenceDetails : onEditPreferenceDetails}>{isEditPreferenceDetails ? 'Save' : 'Edit'}</Button>
                          {isEditPreferenceDetails && <Button className='ml-3' onClick={() => cancelFunc('preference')} color='link'>{isEditPreferenceDetails ? 'Cancel' : ''}</Button>}</div>}
                      </div>
                      <FormGroup>
                        <Label for='phoneNumber'>Email</Label>
                        <div className='d-flex inline-input'>
                          <CustomInput disabled={!isEditPreferenceDetails} type='radio' id='EmailRadio1' name='EmailRadio' label='Yes' onClick={event => handleChange(event, 'PreferenceEmail')} value='Y' checked={preferenceInformation.bEmails} />
                          <CustomInput disabled={!isEditPreferenceDetails} type='radio' id='EmailRadio2' name='EmailRadio' label='No' onClick={event => handleChange(event, 'PreferenceEmail')} value='N' checked={!preferenceInformation.bEmails} />
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Label for='phoneNumber'>SMS</Label>
                        <div className='d-flex inline-input'>
                          <CustomInput disabled={!isEditPreferenceDetails} type='radio' id='SMSRadio1' name='SMSRadio' label='Yes' onClick={event => handleChange(event, 'PreferenceSMS')} value='Y' checked={preferenceInformation.bSms} />
                          <CustomInput disabled={!isEditPreferenceDetails} type='radio' id='SMSRadio2' name='SMSRadio' label='No' onClick={event => handleChange(event, 'PreferenceSMS')} value='N' checked={!preferenceInformation.bSms} />
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Label for='pushNotificatoin'>Push Notification</Label>
                        <div className='d-flex inline-input'>
                          <CustomInput disabled={!isEditPreferenceDetails} type='radio' id='PushNotiRadio1' name='PushNotiRadio' label='Yes' onClick={event => handleChange(event, 'PreferencePushNoti')} value='Y' checked={preferenceInformation.bPush} />
                          <CustomInput disabled={!isEditPreferenceDetails} type='radio' id='PushNotiRadio2' name='PushNotiRadio' label='No' onClick={event => handleChange(event, 'PreferencePushNoti')} value='N' checked={!preferenceInformation.bPush} />
                        </div>
                      </FormGroup>
                    </div>
                  </Fragment>
                )
              }
            </Col>
            <Col lg='5'>
              <Fragment>
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE !== 'N')) &&
                  (
                    <Fragment>
                      <div className='common-box'>
                        <div className='d-flex justify-content-between align-items-start fdc-480 mb-20px-480'>
                          <h3>Cash/ Bonus Information</h3>
                          <Link className='mr-3 btn-link' to={{ pathname: '/users/passbook', search: `?searchValue=${match.params.id}`, state: { userToPassbook: true, id: match.params.id } }}>Show Users Transactions</Link>
                        </div>
                        <Row>
                          <Col xs={6}>
                            <FormGroup>
                              <Label>Available Bonus</Label>
                              <InputGroupText>{bankInformation.nCurrentBonus}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label>Total Bonus</Label>
                              <InputGroupText>{bankInformation.nTotalBonus}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label>Available Winnings</Label>
                              <InputGroupText>{bankInformation.nWinnings}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label>Total Winnings</Label>
                              <InputGroupText>{bankInformation.nTotalWin}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label>Available Deposit </Label>
                              <InputGroupText>{bankInformation.nDeposit}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label>Total Deposit</Label>
                              <InputGroupText>{bankInformation.nTotalDeposit}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label>Available Cash</Label>
                              <InputGroupText>{bankInformation.nCurrentCash}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label>Total Play(Cash)</Label>
                              <InputGroupText>{bankInformation.nTotalPlayCash}</InputGroupText>
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </Fragment>
                  )
                }
                {
                ((Auth && Auth === 'SUPER') || (adminPermission?.BANKDETAILS !== 'N')) && (
                  <Fragment>
                    <div className='common-box'>
                      <div className='d-flex justify-content-between align-items-start'>
                        <h3>Bank Details</h3>
                        {/* {((Auth && Auth === 'SUPER') || (adminPermission?.BANKDETAILS === 'W')) && <div><Button onClick={isEditBankDetails ? changeBankDetails : onEditBankDetails} color='link'>{isEditBankDetails ? 'Save' : 'Edit'}</Button>
                {isEditBankDetails && <Button className='ml-3' onClick={() => cancelFunc('bank')} color='link'>Cancel</Button>}</div>} */}
                      </div>
                        <Row>
                          <Col xs={6}>
                            <FormGroup>
                              <Label for='accountHolderName'>Account Holder Name</Label>
                              <InputGroupText>{bankDetails.sAccountHolderName || 'Not Added'}</InputGroupText>
                              {/* <Input disabled type='text' id='accountHolderName' placeholder='Enter Account Holder Name' value={bankDetails.sAccountHolderName} onChange={event => handleChange(event, 'AccHolderName')} />
                              <p className='error-text'>{bankErrors && bankErrors.sAccountHolderName}</p> */}
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label for='bankAccountNumber'>Account Number</Label>
                              <InputGroupText>{bankDetails.sAccountNo || 'Not Added'}</InputGroupText>
                              {/* <Input disabled type='text' placeholder='Enter Bank Account Number' value={bankDetails.sAccountNo} onChange={event => handleChange(event, 'AccNo')} />
                              <p className='error-text'>{bankErrors && bankErrors.sAccountNo}</p> */}
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label for='bankName'>Bank Name</Label>
                              <InputGroupText>{bankDetails.sBankName || 'Not Added'}</InputGroupText>
                              {/* <Input disabled type='text' id='bankName' placeholder='Enter Bank Name' value={bankDetails.sBankName} onChange={event => handleChange(event, 'BankName')} />
                              <p className='error-text'>{bankErrors && bankErrors.sBankName}</p> */}
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label for='branch'>Branch</Label>
                              <InputGroupText>{bankDetails.sBranch || 'Not Added'}</InputGroupText>
                              {/* <Input disabled type='text' id='branch' placeholder='Enter Branch' value={bankDetails.sBranch} onChange={event => handleChange(event, 'Branch')} />
                              <p className='error-text'>{bankErrors && bankErrors.sBranch}</p> */}
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <FormGroup>
                              <Label for='ifsc'>IFSC</Label>
                              <InputGroupText>{bankDetails.sIFSC || 'Not Added'}</InputGroupText>
                              {/* <Input disabled type='text' id='ifsc' placeholder='Enter IFSC Code' value={bankDetails.sIFSC} onChange={event => handleChange(event, 'IFSCCode')} />
                              <p className='error-text'>{bankErrors && bankErrors.sIFSC}</p> */}
                            </FormGroup>
                          </Col>
                          {/* BankDetails && BankDetails.sAccountNo && BankDetails.sAccountHolderName && BankDetails.sBankName && BankDetails.bAllowUpdate
                            ? <Col xs={12}>
                            <FormGroup className='d-flex justify-content-between mb-0'>
                              <Label for='bankChangeApproval'>Bank Change Approval?</Label>
                              <CustomInput
                                type='switch'
                                id='bankChangeApproval'
                                name='bankChangeApproval'
                                onClick={(event) => bankChangeApprovalWarning(event.target.value)}
                                checked={bankDetails.bIsChangeApprove}
                                disabled={((adminPermission?.BANKDETAILS === 'R') && (!BankDetails.bAllowUpdate))}
                              />
                            </FormGroup>
                          </Col>
                          : '' */}
                        </Row>
                      </div>
                    </Fragment>
                )
                }
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT === 'W')) &&
                  (
                    <Fragment>
                      <div className='common-box'>
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT === 'W')) &&
                            (
                              <div className='d-flex justify-content-between align-items-start'>
                                <h3>Admin Deposit</h3>
                                <div><Button color='link' onClick={isEditAdminDeposit ? addAdminDepo : onEditAdminDeposit}>{isEditAdminDeposit ? 'Save' : 'Edit'}</Button>
                                {isEditAdminDeposit && <Button className='ml-3' onClick={() => cancelFunc('admin_deposit')} color='link'>Cancel</Button>}</div>
                              </div>
                            )
                          }
                        <Row>
                          <Col xs={6}>
                            <FormGroup>
                              <Label for='adminDeposit'>Type</Label>
                              <div className='d-flex inline-input'>
                                <CustomInput disabled={!isEditAdminDeposit} type='radio' id='cash' name='balanceType' label='Cash' value='cash' checked={balanceType === 'cash'} onChange={event => handleChange(event, 'Deposit_Type')} />
                                <CustomInput disabled={!isEditAdminDeposit} type='radio' id='bonus' name='balanceType' label='Bonus' value='bonus' checked={balanceType === 'bonus'} onChange={event => handleChange(event, 'Deposit_Type')} />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={6}>
                            <FormGroup>
                              <Label for='Type'>To Balance</Label>
                              <CustomInput className='form-control' type='select' id='balance' name='balance' value={balance} disabled={!isEditAdminDeposit || balanceType === 'bonus'} onChange={event => handleChange(event, 'Balance')}>
                                <option value='deposit'>Deposit</option>
                                <option value='winning'>Winning</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          {
                            balanceType === 'cash'
                              ? (
                              <Col xs={6}>
                                <FormGroup>
                                  <Label for='Cash'>Cash</Label>
                                  <Input type='number' id='Cash' placeholder='Enter Cash' value={cash} disabled={!isEditAdminDeposit} onChange={event => handleChange(event, 'Cash')} />
                                  <p className='error-text'>{errCash}</p>
                                </FormGroup>
                              </Col>
                                )
                              : balanceType === 'bonus'
                                ? (
                                <Col xs={6}>
                                  <FormGroup>
                                    <Label for='Bonus'>Bonus</Label>
                                    <Input type='number' id='Bonus' placeholder='Enter Bonus' value={bonus} disabled={!isEditAdminDeposit} onChange={event => handleChange(event, 'Bonus')} />
                                    <p className='error-text'>{errBonus}</p>
                                  </FormGroup>
                                </Col>
                                  )
                                : ''
                          }
                          <br />
                          <Col xs={6}>
                            <FormGroup>
                              <Label for='DPassword'>Password</Label>
                              <Input type='password' id='DPassword' placeholder='Enter Password' value={DepositPassword} disabled={!isEditAdminDeposit} onChange={event => handleChange(event, 'DepositPassword')} />
                              <p className='error-text'>{ErrDepositPassword}</p>
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </Fragment>
                  )
                }
                {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW === 'W')) &&
                  (
                    <Fragment>
                      <div className='common-box'>
                          {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW !== 'R')) &&
                            (
                              <div className='d-flex justify-content-between align-items-start'>
                                <h3>Admin Withdraw</h3>
                                <div><Button color='link' onClick={isEditAdminWithdraw ? funcAddAdminWithdraw : onEditAdminWithdraw}>{isEditAdminWithdraw ? 'Save' : 'Edit'}</Button>
                                {isEditAdminWithdraw && <Button className='ml-3' onClick={() => cancelFunc('admin_withdraw')} color='link'>Cancel</Button>}</div>
                              </div>
                            )
                          }
                        <Row>
                          <Col xs={6}>
                            <FormGroup>
                            <Label for='adminWithdraw'>From Balance</Label>
                              <div className='d-flex inline-input'>
                                <CustomInput disabled={!isEditAdminWithdraw} type='radio' id='withdraw' name='withdrawType' label='Deposit' value='withdraw' checked={withdrawType === 'withdraw'} onChange={event => handleChange(event, 'WithdrawType')} />
                                <CustomInput disabled={!isEditAdminWithdraw} type='radio' id='winningWithdraw' name='withdrawType' label='Winning' value='winning' checked={withdrawType === 'winning'} onChange={event => handleChange(event, 'WithdrawType')} />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                              <Col xs={6}>
                                <FormGroup>
                                  <Label for='Amount'>Amount</Label>
                                  <Input type='number' id='Amount' placeholder='Enter Amount' value={amount} disabled={!isEditAdminWithdraw} onChange={event => handleChange(event, 'Amount')} />
                                  <p className='error-text'>{errAmount}</p>
                                </FormGroup>
                              </Col>

                          <Col xs={6}>
                            <FormGroup>
                              <Label for='WPassword'>Password</Label>
                              <Input type='password' id='WPassword' placeholder='Enter Password' value={WithDrawPassword} disabled={!isEditAdminWithdraw} onChange={event => handleChange(event, 'WithdrawPassword')} />
                              <p className='error-text'>{ErrWithdrawPassword}</p>
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    </Fragment>
                  )
                }
              </Fragment>
            </Col>
            <Col lg='4'>
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'N')) &&
                (
                  <Fragment>
                    <div className='common-box'>
                      <h3>Documents</h3>
                        {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'N')) &&
                          (<div className='d-flex justify-content-between align-items-start'>
                            <h3>PAN{panDetails && panDetails.eStatus === 'A' ? <span className='success-text'>(Verified)</span> : panDetails.eStatus === 'R' ? <span className='danger-text ml-2'>(Rejected)</span> : ''}</h3>
                            {((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'R')) &&
                            <div><Button hidden={['P', 'A'].includes(kycDetails && kycDetails.oPan && kycDetails.oPan.eStatus)} onClick={onEditPanDetails} color='link'>{isEditPanDetails ? 'Save' : 'Edit'}</Button>
                            {isEditPanDetails && <Button className='ml-3' onClick={() => cancelFunc('kyc_pan')} color='link'>Cancel</Button>}</div>}
                          </div>)
                        }
                      <div className='document-list'>
                        <div className='item'>
                          <div className='doc-photo text-center'>
                            <div className='doc-img'>
                              {panDetails && panDetails.sImage ? <img className='custom-img' src={panDetails.sImage.imageUrl ? panDetails.sImage.imageUrl : panDetails.sImage} alt='pancard' onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt='pancard' onError={ev => onImageError(ev, 'document')} />}
                              {isEditPanDetails && panDetails?.sImage && ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemovePANImage')} src={removeImg} /></div>}
                            </div>
                            {isEditPanDetails ? <CustomInput hidden={panDetails && (panDetails.eStatus === 'A' || panDetails.eStatus === 'P')} disabled={!isEditPanDetails} accept="image/png, image/jpg, image/jpeg" type='file' id='exampleCustomFileBrowser' name='customFile' onChange={event => handleChange(event, 'KYC_Pan')} /> : '' }
                            <Button hidden={!(panDetails && panDetails.sImage)} color='link' className='view ml-3' onClick={() => setModalOpen(true)}> <img src={viewIcon} alt='View' /> View </Button>
                          </div>
                          <p className='error-text'>{errPanImage}</p>
                          <Row>
                            <Col xl={6} lg={12} md={6}>
                              <FormGroup>
                                <Label for='PANName'>Name as per PAN</Label>
                                <Input disabled={!isEditPanDetails} type='text' id='PANName' placeholder='Name as per PAN' value={panDetails?.sName || ''} onChange={event => handleChange(event, 'KYC_Pan_Name')} />
                                <p className='error-text'>{errPanName}</p>
                              </FormGroup>
                            </Col>
                            <Col xl={6} lg={12} md={6}>
                              <FormGroup>
                                <Label for='document1No'>PAN</Label>
                                <Input disabled={!isEditPanDetails} type='text' id='document1No' placeholder='Enter PAN' value={panDetails && panDetails.sNo ? panDetails.sNo : ''} onChange={event => handleChange(event, 'KYC_Pan_DocNo')} />
                                <p className='error-text'>{errPanNo}</p>
                              </FormGroup>
                            </Col>
                            <Col xl={6} lg={12} md={6} className='d-flex align-self-center'>
                              {panDetails && panDetails.eStatus === 'A' && ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && <Button color='link' className='danger-btn' onClick={() => warningWithConfirmMessage('reject', 'PAN')}><img src={wrongIcon} alt='Reject' /><span>Reject</span></Button>}
                            </Col>
                          </Row>
                          {panDetails && panDetails.eStatus === 'R' ? <p className='danger-text ml-2'>Reason: {panDetails && panDetails.sRejectReason} </p> : ''}
                          {((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) &&
                            <div className='mb-3'>
                              {panDetails && panDetails.eStatus === 'P' && <Button color='link' className='success-btn' onClick={() => warningWithConfirmMessage('verify', 'PAN')}><img src={rightIcon} alt='Approve' /><span>Approve</span></Button>}
                              {panDetails && panDetails.eStatus === 'P' && <Button color='link' className='danger-btn' onClick={() => warningWithConfirmMessage('reject', 'PAN')}><img src={wrongIcon} alt='Reject' /><span>Reject</span></Button>}
                              </div>}
                        </div>
                        {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) &&
                            (
                              <Fragment>
                                <div className='d-flex justify-content-between align-items-start'>
                                  <h3>Aadhaar {aadhaarDetails && aadhaarDetails.eStatus === 'A' ? <span className='success-text'>(Verified)</span> : aadhaarDetails.eStatus === 'R' ? <span className='danger-text ml-2'>(Rejected)</span> : ''}</h3>
                                  {((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'R')) && <div><Button hidden={['P', 'A'].includes(kycDetails && kycDetails.oAadhaar && kycDetails.oAadhaar.eStatus)} onClick={onEditAadhaarDetails} color='link'>{isEditAadhaarDetails ? 'Save' : 'Edit'}</Button>
                                    {isEditAadhaarDetails && <Button className='ml-3' onClick={() => cancelFunc('kyc_aadhaar')} color='link'>Cancel</Button>}</div>}
                                  </div>
                              </Fragment>
                            )
                          }
                        <div className='item'>
                          <div className='doc-photo text-center'>
                            <div className='doc-img'>
                              {aadhaarDetails && aadhaarDetails.sFrontImage ? <img className='custom-img' src={aadhaarDetails.sFrontImage.imageUrl ? aadhaarDetails.sFrontImage.imageUrl : aadhaarDetails.sFrontImage} alt='aadhaarfront' onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt='aadhaarcardFront' onError={ev => onImageError(ev, 'document')} />}
                              {isEditAadhaarDetails && aadhaarDetails?.sFrontImage && ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveAadhaarFront')} src={removeImg} /></div>}
                              <div className='side-label'>Front</div>
                            </div>
                            {isEditAadhaarDetails ? <CustomInput hidden={aadhaarDetails && (aadhaarDetails.eStatus === 'A' || aadhaarDetails.eStatus === 'P')} disabled={!isEditAadhaarDetails} accept="image/png, image/jpg, image/jpeg" type='file' id='exampleCustomFileBrowser1' name='customFile1' onChange={event => handleChange(event, 'KYC_IDProof_front')} /> : ''}
                            <Button hidden={!(aadhaarDetails && aadhaarDetails.sFrontImage)} color='link' className='view ml-3' onClick={() => setModalAADHAARF(true)}> <img src={viewIcon} alt='View' /> View </Button>
                          </div>
                          <div className='doc-photo text-center'>
                            <div className='doc-img'>
                              {aadhaarDetails && aadhaarDetails.sBackImage ? <img className='custom-img' src={aadhaarDetails.sBackImage.imageUrl ? aadhaarDetails.sBackImage.imageUrl : aadhaarDetails.sBackImage} alt='aadhaarback' onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt='aadhaarcardFront' onError={ev => onImageError(ev, 'document')} />}
                              {isEditAadhaarDetails && aadhaarDetails?.sBackImage && ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveAadhaarBack')} src={removeImg} /></div>}
                              <div className='side-label'>Back</div>
                            </div>
                            {isEditAadhaarDetails ? <CustomInput hidden={aadhaarDetails && (aadhaarDetails.eStatus === 'A' || aadhaarDetails.eStatus === 'P')} disabled={!isEditAadhaarDetails} accept="image/png, image/jpg, image/jpeg" type='file' id='exampleCustomFileBrowser2' name='customFile2' label='Edit' onChange={event => handleChange(event, 'KYC_IDProof_Back')} /> : ''}
                            <Button hidden={!(aadhaarDetails && aadhaarDetails.sBackImage)} color='link' className='view ml-3' onClick={() => setModalAADHAARB(true)}> <img src={viewIcon} alt='View' /> View </Button>
                          </div>
                          <p className='error-text'>{errAadhaarImage}</p>
                          <Row>
                            <Col xl={6} lg={12} md={6}>
                              <FormGroup>
                                <Label for='document2No'>Aadhaar Number</Label>
                                <div className='d-flex justify-content-between'>
                                  <Input disabled={!isEditAadhaarDetails} type='text' id='document2No' placeholder='Enter Aadhaar Number' value={aadhaarDetails && aadhaarDetails.nNo ? aadhaarDetails.nNo : ''} onChange={event => handleChange(event, 'KYC_AADHAAR_NO')} />
                                </div>
                                <p className='error-text'>{errAadhaarNo}</p>
                              </FormGroup>
                            </Col>
                            {((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && <Col xl={6} lg={12} md={6} className='d-flex align-self-center'>
                              {aadhaarDetails && aadhaarDetails.eStatus === 'A' && <Button color='link' className='danger-btn' onClick={() => warningWithConfirmMessage('reject', 'AADHAAR')}><img src={wrongIcon} alt='Reject' /><span>Reject</span></Button>}
                            </Col>}
                          </Row>
                        {aadhaarDetails && aadhaarDetails.eStatus === 'R' ? <p className='danger-text ml-2'>Reason: {kycDetails && kycDetails.oAadhaar && kycDetails.oAadhaar.sRejectReason} </p> : ''}
                          {((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) &&
                          <Fragment>
                            {aadhaarDetails && aadhaarDetails.eStatus === 'P' && <Button color='link' className='success-btn' onClick={() => warningWithConfirmMessage('verify', 'AADHAAR')}><img src={rightIcon} alt='Approve' /><span>Approve</span></Button>}
                            {aadhaarDetails && aadhaarDetails.eStatus === 'P' && <Button color='link' className='danger-btn' onClick={() => warningWithConfirmMessage('reject', 'AADHAAR')}><img src={wrongIcon} alt='Reject' /><span>Reject</span></Button>}
                            </Fragment>}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                )
              }
              <div className='common-box'>
                <div className='d-flex justify-content-between align-items-start'>
                  <h3>Referral Information</h3>
                  <Button color='link' onClick={copyToClipboard}>Copy</Button>
                </div>
                <Row>
                  <Col xs={6}>
                    <FormGroup>
                      <Label for='referralCode'>Referral Code</Label>
                      <InputGroupText>{referralCode || 'NA'}</InputGroupText>
                    </FormGroup>
                  </Col>
                </Row>
                {referrals ? <Button color='link' className='view' onClick={() => history.push(`/users/user-referred-list/${match.params.id}`)}>Total Refer - {referrals}</Button> : <b>Total Refer - {referrals}</b>}
              </div>
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'N')) &&
                (
                  <Fragment>
                    <div className='common-box'>
                      <div className='d-flex justify-content-between align-items-start'>
                        <h3>Send Notification</h3>
                      </div>
                      <FormGroup>
                        <Label for='NotificationTitle'>Title</Label>
                        <Input
                          type='text'
                          disabled={adminPermission?.NOTIFICATION === 'R'}
                          placeholder='Enter Title'
                          value={title}
                          onChange={event => handleChange(event, 'title')}
                        />
                        <p className='error-text'>{errTitle}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for='notificationDescription'>Description</Label>
                        <Input
                          type='textarea'
                          disabled={adminPermission?.NOTIFICATION === 'R'}
                          placeholder='Enter Description'
                          value={description}
                          onChange={event => handleChange(event, 'description')}
                        />
                        <p className='error-text'>{errDescription}</p>
                      </FormGroup>
                      <FormGroup>
                        <Label for='typeSelect'>Notification Type</Label>
                        <CustomInput
                          type='select'
                          name='typeSelect'
                          id='typeSelect'
                          disabled={adminPermission?.NOTIFICATION === 'R'}
                          className='form-control'
                          value={notificationType}
                          onChange={event => handleChange(event, 'Type')}
                        >
                          {typeList && typeList.length !== 0 && typeList.map(Data => <option value={Data._id} key={Data._id}> {Data.sHeading} </option>)}
                        </CustomInput>
                        <p className='error-text'>{errNotificationType}</p>
                      </FormGroup>
                      {
                        ((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'R')) &&
                        (
                          <Button type='submit' className='theme-btn full-btn' onClick={onSendNotification}>Send</Button>
                        )
                      }
                    </div>
                  </Fragment>
                )
              }
            </Col>
          </Row>
        </section>
        <Draggable>
          <Modal isOpen={modalPan} toggle={togglepan} className='modal-reject'>
            <ModalBody className='text-center'>
              <div className='doc-img2'>
                {
                  panDetails && panDetails.sImage ? <img className='kyc-img' src={panDetails.sImage && panDetails.sImage.imageUrl ? panDetails.sImage.imageUrl : panDetails.sImage} alt='pancard' onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt='pancard' onError={ev => onImageError(ev, 'document')} />
                }
              </div>
              <div className='d-flex justify-content-between align-items-center p-4 mt-2'>
                <h3>PAN : <span>{panDetails?.sNo}</span></h3>
                <h3>Name as per PAN : <span>{panDetails?.sName}</span></h3>
              </div>
              <Button color='secondary' onClick={togglepan}>Cancel</Button>
            </ModalBody>
          </Modal>
        </Draggable>
        <Draggable>
          <Modal isOpen={modalAadhaarF} toggle={toggleAadhaarF} className='modal-reject'>
            <ModalBody className='text-center'>
              <div className='doc-img2'>
                {
                  aadhaarDetails && aadhaarDetails.sFrontImage ? <img className='kyc-img' src={aadhaarDetails.sFrontImage && aadhaarDetails.sFrontImage.imageUrl ? aadhaarDetails.sFrontImage.imageUrl : aadhaarDetails.sFrontImage} alt='pancard' onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt='aadhaarcardFront' onError={ev => onImageError(ev, 'document')} />
                }
              </div>
              <h3 className='mt-3'>Aadhaar Number : <span>{aadhaarDetails?.nNo}</span></h3>
              <Button className='mt-2' color='secondary' onClick={toggleAadhaarF}>Cancel</Button>
            </ModalBody>
          </Modal>
        </Draggable>
        <Draggable>
          <Modal isOpen={modalAadhaarB} toggle={toggleAadhaarB} className='modal-reject'>
            <ModalBody className='text-center'>
              <div className='doc-img2'>
                {
                  aadhaarDetails && aadhaarDetails.sBackImage ? <img className='kyc-img' src={aadhaarDetails.sBackImage && aadhaarDetails.sBackImage.imageUrl ? aadhaarDetails.sBackImage.imageUrl : aadhaarDetails.sBackImage} alt='pancard' onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt='aadhaarcardFront' onError={ev => onImageError(ev, 'document')} />
                }
              </div>
              <h3 className='mt-3'>Aadhaar Number : <span>{aadhaarDetails?.nNo}</span></h3>
              <Button className='mt-2' color='secondary' onClick={toggleAadhaarB}>Cancel</Button>
            </ModalBody>
          </Modal>
        </Draggable>
        <Modal isOpen={modalWarning} toggle={toggleWarning} className='modal-confirm'>
          <ModalBody className='text-center'>
            <img className='info-icon' src={warningIcon} alt='check' />
            <h2>{`Are you sure you want to ${type} it?`}</h2>
            <Row className='row-12'>
              <Col>
                <Button type='submit' className='theme-btn outline-btn full-btn' onClick={toggleWarning}>Cancel</Button>
              </Col>
              <Col>
                <Button type='submit' className='theme-btn danger-btn full-btn' onClick={onUpdateStatus}>{`Yes, ${type} it`}</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal isOpen={modal} toggle={handleModalClose} className='modal-confirm-bot'>
          <ModalHeader toggle={handleModalClose}></ModalHeader>
          <ModalBody>
            <Col md='12'>
              <Label for='rejectReason'>Reason for Reject</Label>
            </Col>
            <Col md='12'>
              <FormGroup>
                <CustomInput
                  type="select"
                  name="rejectReason"
                  id="rejectReason"
                  value={reason}
                  // className={`mt-2`}
                  onChange={(event) => handleChange(event, 'Reason')}
                >
                  <option value="">Select reason for rejection</option>
                  {statusType === 'AADHAAR'
                    ? Aadhaar && Aadhaar.length !== 0 && Aadhaar.map((data, i) => {
                      return (
                      <option key={i} value={data}>{data}</option>
                      )
                    })
                    : statusType === 'PAN'
                      ? PAN && PAN.length !== 0 && PAN.map((data, i) => {
                        return (
                      <option key={i} value={data}>{data}</option>
                        )
                      })
                      : ''
                  }
                </CustomInput>
                <p className='error-text'>{errReason}</p>
              </FormGroup>
            </Col>
            <Button type='submit' className='theme-btn full-btn' disabled={!reason} onClick={() => onUpdateStatus()}>SEND</Button>
          </ModalBody>
        </Modal>
      </main>
    </>
  )
}

UserDetails.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserDetails
