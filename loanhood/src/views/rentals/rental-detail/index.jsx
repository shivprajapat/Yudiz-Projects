import React, { Suspense, useEffect, useState } from 'react'
import PageTitle from 'components/PageTitle'
import {
  CircularProgress,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Switch,
  IconButton,
  Box,
  FormHelperText
} from '@material-ui/core'
import TabPanel from 'components/TabPanel'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AddRental, GetRentalDetail, GetRentalTransactions, UpdateRental } from 'state/actions/rental'
import OpenSnackbar from 'components/Snackbar'
import { checkIsNumber } from 'utils/helper'
import AddIcon from '@material-ui/icons/Add'
import { GetUserDetail, GetUsers } from 'state/actions/users'
import RentalItem from 'components/RentalItem'
import RentalApprove from 'components/RentalApprove'
import CloseIcon from '@material-ui/icons/Close'
import LazyLoadingSelect from 'components/LazyLoadingSelect'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import UpdateDialog from 'components/UpdateDialog'
import { GetAddressOfUser } from 'state/actions/address'

const ConfirmDialog = React.lazy(() => import('components/ConfirmDialog'))
const RentalTransactions = React.lazy(() => import('components/RentalTransactions'))
const UserForm = React.lazy(() => import('views/users/user-form'))

function RentalDetail() {
  const { id, type } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const [value, setValue] = useState(0)
  const [userData, setUserData] = useState({})
  const [rentalDetail, setRentalDetail] = useState({ rentalImages: [], rentalitems: [] })
  const [rentalImg, setRentalImg] = useState([])
  const [rentalStatus, setRentalStatus] = useState()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isConfirmOpenForUser, setIsConfirmOpenForUser] = useState(false)
  const [lazyLoad, setLazyLoad] = useState(false)
  const [userId, setUserId] = useState(rentalDetail?.userId)
  const [addressId, setAddressId] = useState(rentalDetail?.addressId)
  const userRentals = useSelector((state) => state.users.userRentals)
  const rentalTransactions = useSelector((state) => state.rental.rentalTransactions)

  const userAddress = useSelector((state) => state.address.userAddress)
  const UpdatedUserData = useSelector((state) => state.rental.updatedUserData)
  const [err, setErrs] = useState({
    rentalImages: '',
    title: '',
    description: '',
    originalPrice: '',
    rentalPricePerWeek: '',
    totalPrice: '',
    userId: '',
    borrowerServiceFee: '',
    loanerServiceFee: '',
    rentalitems: '',
    isPickup: '',
    hasDelivery: '',
    address: ''
  })
  const [formData, setFormData] = useState({
    file: '',
    avatarUrl: '',
    firstName: '',
    lastName: '',
    userName: '',
    emailId: '',
    bio: '',
    isTest: false,
    isLoanHood: false,
    userInterests: []
  })
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const rentalData = useSelector((state) => state.rental.rentalDetail?.rentalDetails)
  const changeState = useSelector((state) => state.rental.rentalDetail?.changeState)
  const canBeDeleted = useSelector((state) => state.rental.rentalDetail?.canBeDeleted)
  const resStatus = useSelector((state) => state.rental.resStatus)
  const resMessage = useSelector((state) => state.rental.resMessage)
  const userDetails = useSelector((state) => state.users.userDetail)
  const rentalItem = {
    brandId: '',
    colorId: '',
    materialId: '',
    sizeGroupId: '',
    sizeId: '',
    categoryId: '',
    subcategoryId: '',
    careDuringRental: '',
    condition: '',
    isDelete: true
  }
  const requestParams = { offset: 0, limit: 10 }

  useEffect(() => {
    if (id) {
      dispatch(GetRentalDetail(id))
      dispatch(GetRentalTransactions(id, requestParams))
    } else {
      setIsPageLoading(true)
      addRentalItem()
    }
  }, [])

  useEffect(() => {
    if (rentalDetail.rentalitems.length && !rentalDetail.borrowerServiceFee) {
      if (rentalDetail.rentalitems.length > 1) {
        setRentalDetail({
          ...rentalDetail,
          isLook: true,
          borrowerServiceFee: rentalDetail.rentalPricePerWeek ? config.appConfig.fees.borrowerLookGBP : ''
        })
      } else {
        setRentalDetail({
          ...rentalDetail,
          isLook: false,
          borrowerServiceFee: rentalDetail.rentalPricePerWeek ? config.appConfig.fees.borrowerItemGBP : ''
        })
      }
    }
  }, [JSON.stringify(rentalDetail.rentalitems, rentalDetail.borrowerServiceFee)])

  useEffect(() => {
    if (typeof userData === 'object') {
      setFormData({
        avatarUrl: userData.avatarUrl,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        emailId: userData.emailId,
        bio: userData.bio,
        isTest: userData.isTest,
        isLoanHood: userData.isLoanHood,
        userInterests: userData.userInterests ? userData.userInterests : []
      })
    }
  }, [userData])

  useEffect(() => {
    if (rentalData) {
      const { listedPrice } = calculateFees(rentalData.isLook, rentalData.rentalPricePerWeek)

      const data = {
        ...rentalData,
        totalPrice: !rentalData.totalPrice ? listedPrice : rentalData.totalPrice
      }
      setRentalDetail(data)
      setDefaultErrs(Array(rentalData.rentalitems.length).fill(rentalItem))
      setRentalStatus(rentalData.status)
      setRentalImg(rentalData.rentalImages)
      dispatch(GetUserDetail(rentalData.userId))
      setIsPageLoading(true)
    }
  }, [rentalData])

  useEffect(() => {
    userDetails && setUserData(userDetails)
  }, [userDetails])

  useEffect(() => {
    if (resStatus && resMessage && isLoading) {
      setIsLoading(false)
      setRentalStatus(rentalDetail.status)
      history.push('/rentals')
    }
    if (!resStatus && resMessage) {
      setIsLoading(false)
    }
  }, [resStatus, resMessage])

  const handleTabChange = (event, newValue) => {
    setValue(newValue)
  }

  function handleChange(e, index) {
    switch (e.target.name) {
      case 'rentalImages':
        // eslint-disable-next-line no-case-declarations
        const files = e.target.files
        if (files.length > 5 || files.length + rentalImg.length > 5) {
          setErrs({ ...err, rentalImages: 'Max 5 images are allow' })
        } else {
          const data = []
          for (let i = 0; i < files.length; ++i) {
            data.push({
              file: files[i],
              imageUrl: URL.createObjectURL(files[i])
            })
          }
          setRentalImg([...rentalImg, ...data])
          setRentalDetail({
            ...rentalDetail,
            rentalImages: rentalDetail.rentalImages ? [...rentalDetail.rentalImages, ...data] : [...data]
          })
          setErrs({ ...err, rentalImages: '' })
        }
        break
      case 'title':
        if (e.target.value.length > 30) {
          setErrs({ ...err, title: 'Title Should be less than 30 characters' })
        } else if (e.target.value.length > 0) {
          setErrs({ ...err, title: '' })
        } else {
          setErrs({ ...err, title: 'Title field is required' })
        }
        setRentalDetail({ ...rentalDetail, title: e.target.value })

        break

      case 'description':
        if (e.target.value.length > 200) {
          setErrs({ ...err, description: 'Description Should be less than 200 characters' })
        } else if (e.target.value.length > 0) {
          setErrs({ ...err, description: '' })
        } else {
          setErrs({ ...err, description: 'Description field is required' })
        }

        setRentalDetail({ ...rentalDetail, description: e.target.value })

        break
      case 'totalPrice':
        if (checkIsNumber(e.target.value)) {
          setErrs({ ...err, totalPrice: '' })
        }
        //  else {
        //   setErrs({ ...err, totalPrice: 'Enter valid Price' })
        // }
        setRentalDetail({ ...rentalDetail, totalPrice: e.target.value })
        break
      case 'originalPrice':
        if (checkIsNumber(e.target.value)) {
          setErrs({ ...err, originalPrice: '' })
        } else {
          setErrs({ ...err, originalPrice: 'Enter valid Price' })
        }
        setRentalDetail({ ...rentalDetail, originalPrice: e.target.value })
        break
      case 'rentalPricePerWeek':
        if (checkIsNumber(e.target.value)) {
          setErrs({ ...err, rentalPricePerWeek: '' })
        } else {
          setErrs({ ...err, rentalPricePerWeek: 'Enter valid Price' })
        }

        setRentalDetail({ ...rentalDetail, rentalPricePerWeek: e.target.value })
        break
      case 'borrowerServiceFee':
        if (checkIsNumber(e.target.value)) {
          setErrs({ ...err, borrowerServiceFee: '' })
        } else {
          setErrs({ ...err, borrowerServiceFee: 'Enter valid Price' })
        }
        setRentalDetail({ ...rentalDetail, borrowerServiceFee: e.target.value })
        break
      case 'loanerServiceFee':
        if (checkIsNumber(e.target.value)) {
          setErrs({ ...err, loanerServiceFee: '' })
        } else {
          setErrs({ ...err, loanerServiceFee: 'Enter valid Price' })
        }
        setRentalDetail({ ...rentalDetail, loanerServiceFee: e.target.value })
        break
      case 'hasDelivery':
        if (rentalDetail?.isPickup?.toString() === 'false' && e.target.value === 'false') {
          setErrs({ ...err, isPickup: "Both Has Delivery and In person pick up can't be No" })
        } else {
          setErrs({ ...err, isPickup: '', hasDelivery: '' })
        }
        setRentalDetail({ ...rentalDetail, [e.target.name]: e.target.value === 'true' })
        break
      case 'isPickup':
        if (e.target.value === 'false' && rentalDetail?.hasDelivery?.toString() === 'false') {
          setErrs({ ...err, hasDelivery: "Both Has Delivery and In person pick up can't be No" })
        } else {
          setErrs({ ...err, isPickup: '', hasDelivery: '' })
        }
        setRentalDetail({ ...rentalDetail, [e.target.name]: e.target.value === 'true' })
        break
      case 'needsDryCleaning':
        setRentalDetail({ ...rentalDetail, [e.target.name]: e.target.value === 'true' })
        break
      case 'wasUpdated':
        setRentalDetail({ ...rentalDetail, [e.target.name]: e.target.checked })
        break
      case 'isLook':
        setRentalDetail({
          ...rentalDetail,
          [e.target.name]: e.target.value ? 'true' : 'false',
          borrowerServiceFee: e.target.value ? config.appConfig.fees.borrowerLookGBP : config.appConfig.fees.borrowerItemGBP
        })
        if (typeof e.target.value === 'boolean') {
          setErrs({ ...err, isLook: '' })
        }
        break
      case 'unbranded':
        if (e.target.value.target.checked === true) {
          const value = rentalDetail.rentalitems
          value[index - 1].brandId = 1
          setRentalDetail({ ...rentalDetail, rentalitems: value, [e.target.name]: e.target.checked })
        }
        break
      default:
        if (Number(index)) {
          const value = [...rentalDetail.rentalitems]
          value[index - 1][e.target.name] = e.target.value
          setRentalDetail({ ...rentalDetail, rentalitems: value })
          if (e.target.value !== '') {
            const errors = err.rentalitems
            errors[index - 1][e.target.name] = ''
            setErrs({ ...err, rentalitems: errors })
          }
        } else {
          setRentalDetail({ ...rentalDetail, [e.target.name]: e.target.value })
        }
        break
    }
  }

  // check is look filed change
  useEffect(() => {
    if (rentalDetail.isLook === 'true' && rentalDetail.rentalitems.length < 2) {
      addRentalItem()
    }
  }, [JSON.stringify(rentalDetail.isLook)])

  useEffect(() => {
    if (rentalDetail.userId && userAddress && !userAddress.length) {
      setErrs({ ...err, address: 'This User Has no address' })
    } else if (rentalDetail.userId) {
      setErrs({ ...err, address: '' })
    }
  }, [userAddress])

  useEffect(() => {
    if (rentalDetail.userId) {
      dispatch(GetAddressOfUser(rentalDetail.userId))
    }
  }, [rentalDetail.userId])

  function handleUserChange(id, name) {
    if (!id) {
      setErrs({ ...err, [name]: 'This field is required' })
    } else {
      setErrs({ ...err, [name]: '' })
    }
    setRentalDetail({ ...rentalDetail, [name]: id })
  }
  function handleAddressChange(e, name) {
    setAddressId(e)
    setRentalDetail({ ...rentalDetail, addressId: e.target.value })
  }
  function handleImgDelete(url) {
    setRentalImg(rentalImg.filter((data) => data.imageUrl !== url))
    setRentalDetail({ ...rentalDetail, rentalImages: rentalDetail.rentalImages.filter((data) => data.imageUrl !== url) })
  }

  function onUpdate(e) {
    e.preventDefault()
    const { errors, isFormValid } = checkValidation(rentalDetail)
    if (isFormValid) {
      if (id) {
        rentalDetail.itemDetails = rentalDetail.rentalitems
        dispatch(UpdateRental(id, rentalDetail))
        setIsLoading(true)
      } else {
        rentalDetail.isLook = rentalDetail.isLook === 'true'
        rentalDetail.itemDetails = rentalDetail.rentalitems
        dispatch(AddRental(rentalDetail))
        setIsLoading(true)
      }
    } else {
      setErrs({ ...err, ...errors })
    }
  }

  function updateState(status) {
    if (status === 'approve') {
      setRentalDetail({ ...rentalDetail, status: 'approved' })
      setRentalStatus('approved')
    } else {
      setRentalDetail({ ...rentalDetail, status: 'rejected' })
      setRentalStatus('rejected')
    }
  }

  function checkValidation(data) {
    const notRequired = ['careLabel']
    const error = {}
    if (!data.isPickup && !data.hasDelivery) error.isPickup = "Both Has Delivery and In person pick up can't be No"
    if (data.isPickup === false && data.hasDelivery === false) error.hasDelivery = "Both Has Delivery and In person pick up can't be No"
    if (!data.title) error.title = 'Title field is required'
    if (!data.description) error.description = 'Description field is required'
    if (!checkIsNumber(data.originalPrice)) error.originalPrice = 'Original Price is required'
    if (!checkIsNumber(data.rentalPricePerWeek)) error.rentalPricePerWeek = 'Rental Price Per Week is required'
    // if (!checkIsNumber(data.totalPrice)) error.totalPrice = 'Total Price is required'
    if (data.rentalImages.length === 0 && !type) error.rentalImages = 'Select at least 1 image'
    if (type === 'edit' || !type) {
      error.rentalitems = []
      if (!id) {
        if (!data.userId) error.userId = 'User field is required'
        if (!data.borrowerServiceFee) error.borrowerServiceFee = 'Borrower Service Fee field is required'
        if (!data.loanerServiceFee) error.loanerServiceFee = 'Loaner Service Fee field is required'
        // if (!data.isLook) error.isLook = 'Is look field is required'
      }
      data.rentalitems.forEach((item, index) => {
        Object.keys(item).forEach((key) => {
          if (!notRequired.includes(key) && item[key] === '') {
            error.rentalitems[index] = {
              ...error.rentalitems[index],
              [key]: 'This field is required'
            }
          }
        })
      })
      for (let i = 0; i < error.rentalitems.length; i++) {
        if (error.rentalitems[i] === undefined) {
          error.rentalitems[i] = rentalItem
        }
      }
      error.rentalitems.length === 0 && delete error.rentalitems
    }
    return { errors: error, isFormValid: Object.keys(error).length === 0 }
  }

  function addRentalItem() {
    rentalDetail.rentalitems &&
      setRentalDetail({ ...rentalDetail, rentalitems: [...rentalDetail.rentalitems, JSON.parse(JSON.stringify(rentalItem))] })
    !rentalDetail.rentalitems && setRentalDetail({ ...rentalDetail, rentalitems: [JSON.parse(JSON.stringify(rentalItem))] })
    setDefaultErrs()
  }
  function deleteRentalItem(index) {
    const errors = { ...err }
    errors.rentalitems.splice(index, 1)
    setErrs(errors)
    const data = { ...rentalDetail }
    data.rentalitems.splice(index, 1)
    setRentalDetail(data)
  }
  function setDefaultErrs(data) {
    if (data) {
      setErrs({
        ...err,
        rentalitems: data
      })
    } else {
      if (err.rentalitems) {
        setErrs({ ...err, rentalitems: [...err.rentalitems, JSON.parse(JSON.stringify(rentalItem))] })
      } else {
        setErrs({ ...err, rentalitems: [JSON.parse(JSON.stringify(rentalItem))] })
      }
    }
  }
  const config = {
    appConfig: {
      fees: {
        borrowerItemGBP: 1.0,
        borrowerLookGBP: 1.0,
        loanerPercent: 15.0,
        retunRentalInDays: 2
      }
    }
  }
  function calculateFees(isLook, rentalPricePerWeek) {
    const borrowServiceFee = isLook ? config.appConfig.fees.borrowerLookGBP : config.appConfig.fees.borrowerItemGBP
    const loanServiceFee = (rentalPricePerWeek * (config.appConfig.fees.loanerPercent / 100)).toFixed(2)
    const listedPrice = (parseFloat(rentalPricePerWeek) + parseFloat(borrowServiceFee) + parseFloat(loanServiceFee)).toFixed(2)
    return {
      borrowServiceFee,
      loanServiceFee,
      listedPrice
    }
  }
  function onBlurRentalPricePerWeek() {
    if (rentalDetail && !rentalDetail.loanerServiceFee && !rentalDetail.borrowerServiceFee) {
      const { listedPrice, borrowServiceFee, loanServiceFee } = calculateFees(rentalDetail.isLook, rentalDetail.rentalPricePerWeek)
      setRentalDetail({ ...rentalDetail, loanerServiceFee: loanServiceFee, borrowerServiceFee: borrowServiceFee, totalPrice: listedPrice })
    } else if (!rentalDetail.loanerServiceFee && rentalDetail.borrowerServiceFee) {
      const { loanServiceFee } = calculateFees(rentalDetail.isLook, rentalDetail.rentalPricePerWeek)
      setRentalDetail({ ...rentalDetail, loanerServiceFee: loanServiceFee })
    } else if (rentalDetail.loanerServiceFee && !rentalDetail.borrowerServiceFee) {
      const { borrowServiceFee } = calculateFees(rentalDetail.isLook, rentalDetail.rentalPricePerWeek)
      setRentalDetail({ ...rentalDetail, borrowerServiceFee: borrowServiceFee })
    } else if (rentalDetail.loanerServiceFee && rentalDetail.borrowerServiceFee) {
      const { listedPrice, borrowServiceFee, loanServiceFee } = calculateFees(rentalDetail.isLook, rentalDetail.rentalPricePerWeek)
      setRentalDetail({ ...rentalDetail, loanerServiceFee: loanServiceFee, borrowerServiceFee: borrowServiceFee, totalPrice: listedPrice })
    }
  }

  function deleteRental(e) {
    if (e) {
      rentalDetail.isActive = false
      rentalDetail.itemDetails = rentalDetail.rentalitems
      dispatch(UpdateRental(id, rentalDetail))
      setIsLoading(true)
      history.push('/rentals')
    } else {
      setIsConfirmOpen(false)
    }
  }
  function onBlurBorrowerServiceFee(e) {
    if (rentalDetail.loanerServiceFee) {
      const listedPrice = (
        parseFloat(rentalDetail.rentalPricePerWeek) +
        parseFloat(e.target.value) +
        parseFloat(rentalDetail.loanerServiceFee)
      ).toFixed(2)

      setRentalDetail({ ...rentalDetail, borrowerServiceFee: Number(e.target.value), totalPrice: listedPrice })
    } else {
      const { loanServiceFee } = calculateFees(rentalDetail.isLook, rentalDetail.rentalPricePerWeek)
      const listedPrice = (parseFloat(rentalDetail.rentalPricePerWeek) + parseFloat(e.target.value) + parseFloat(loanServiceFee)).toFixed(2)
      setRentalDetail({ ...rentalDetail, totalPrice: listedPrice, loanerServiceFee: loanServiceFee })
    }
  }
  function onBlurLoanerServiceFee(e) {
    if (rentalDetail && rentalDetail.borrowerServiceFee) {
      const listedPrice = (
        parseFloat(rentalDetail.rentalPricePerWeek) +
        parseFloat(e.target.value) +
        parseFloat(rentalDetail.borrowerServiceFee)
      ).toFixed(2)

      setRentalDetail({ ...rentalDetail, loanerServiceFee: Number(e.target.value), totalPrice: listedPrice })
    } else if (!(rentalDetail && rentalDetail.borrowerServiceFee)) {
      const { borrowServiceFee } = calculateFees(rentalDetail.isLook, rentalDetail.rentalPricePerWeek)
      const listedPrice = (parseFloat(rentalDetail.rentalPricePerWeek) + parseFloat(e.target.value) + parseFloat(borrowServiceFee)).toFixed(
        2
      )
      setRentalDetail({ ...rentalDetail, totalPrice: listedPrice, borrowerServiceFee: borrowServiceFee })
    }
  }
  function handleChangeUser() {
    setIsConfirmOpenForUser(true)
    setLazyLoad(true)
  }
  useEffect(() => {
    if (UpdatedUserData) {
      setUserData(UpdatedUserData)
      setIsLoading(false)
    }
  }, [UpdatedUserData])

  function handleDialog(e) {
    if (e) {
      setLazyLoad(false)
      setIsConfirmOpenForUser(false)
      rentalDetail.itemDetails = rentalDetail.rentalitems

      const data = {
        ...rentalDetail,
        userId,
        addressId
      }

      dispatch(UpdateRental(id, data))
    } else {
      setLazyLoad(false)
      setIsConfirmOpenForUser(false)
    }
    setLazyLoad(false)
    setIsConfirmOpenForUser(false)
  }
  function handleUserChangeUser(e) {
    setLazyLoad(true)
    setUserId(e)
  }
  function handleEditInDetail() {
    history.push('/rentals/edit/' + id)
  }

  return (
    <>
      {resMessage && <OpenSnackbar isOpen={true} message={resMessage} />}
      <>
        <PageTitle
          title={id ? 'Rental Detail' : 'Add Rental'}
          rightButton={type === 'edit' ? 'Delete' : ''}
          secondRightButton={type === 'edit' ? 'Change user' : ''}
          icon={<DeleteIcon />}
          EditIcon={<EditIcon />}
          handleBtnEvent={() => setIsConfirmOpen(true)}
          handleUserChange={() => handleChangeUser()}
          disabledDeleteRental={!canBeDeleted}
          disabledChangeUser={(userRentals && userRentals?.count !== 0) || (rentalTransactions && rentalTransactions?.count !== 0)}
          EditBtnInDetail={type === 'detail' ? 'Edit' : ''}
          handleEditInDetail={() => handleEditInDetail()}
        />
      </>
      {lazyLoad && (
        <>
          <UpdateDialog
            open={isConfirmOpenForUser}
            message={'You want to change the user!'}
            handleResponse={(e) => handleDialog(e)}
            component={
              <>
                <LazyLoadingSelect
                  apiCall={true}
                  api={GetUsers}
                  selectedId={parseInt(rentalDetail?.userId || '')}
                  placeholder={`${formData?.firstName} ${formData?.lastName}` || ''}
                  storeName="users"
                  selectorName="users"
                  size="small"
                  getSelectedBrand={(e) => handleUserChangeUser(e)}
                />
              </>
            }
          />
        </>
      )}
      {isConfirmOpen && (
        <ConfirmDialog
          open={isConfirmOpen}
          message={'Are you sure that you want to delete this rental?'}
          handleResponse={(e) => deleteRental(e)}
        />
      )}
      <Card>
        <Tabs value={value} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
          <Tab label="Rental & Rental Items" />
          <Tab label="User" disabled={!id} />
          <Tab label="Rental Transactions" disabled={!id} />
        </Tabs>
        <Divider />
        <CardContent>
          <TabPanel value={value} index={0}>
            {isPageLoading && (
              <>
                <form>
                  <Grid container spacing={3}>
                    <Grid className="img-contain" item xs={12} sm={6}>
                      <input
                        multiple
                        hidden
                        onChange={handleChange}
                        type="file"
                        accept="image/*"
                        name="rentalImages"
                        id="rentalImages"
                        disabled={type === 'detail'}
                      />
                      <div className="rental-img">
                        <div className="img-left">
                          <div className="img-box">
                            <label htmlFor="rentalImages">
                              {rentalImg[0] ? (
                                <img
                                  src={rentalImg[0].imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                                  alt={rentalDetail.title}
                                />
                              ) : (
                                <AddIcon />
                              )}
                            </label>
                            {rentalImg[0] && type !== 'detail' && (
                              <IconButton aria-label="delete" onClick={() => handleImgDelete(rentalImg[0].imageUrl)}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                        </div>
                        <div className="img-right">
                          <div className="img-box">
                            <label htmlFor="rentalImages">
                              {rentalImg[1] ? (
                                <img
                                  src={rentalImg[1].imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                                  alt={rentalDetail.title}
                                />
                              ) : (
                                <AddIcon />
                              )}
                            </label>
                            {rentalImg[1] && type !== 'detail' && (
                              <IconButton aria-label="delete" onClick={() => handleImgDelete(rentalImg[1].imageUrl)}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                          <div className="img-box">
                            <label htmlFor="rentalImages">
                              {rentalImg[2] ? (
                                <img
                                  src={rentalImg[2].imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                                  alt={rentalDetail.title}
                                />
                              ) : (
                                <AddIcon />
                              )}
                            </label>
                            {rentalImg[2] && type !== 'detail' && (
                              <IconButton aria-label="delete" onClick={() => handleImgDelete(rentalImg[2].imageUrl)}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                          <div className="img-box">
                            <label htmlFor="rentalImages">
                              {rentalImg[3] ? (
                                <img
                                  src={rentalImg[3].imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                                  alt={rentalDetail.title}
                                />
                              ) : (
                                <AddIcon />
                              )}
                            </label>
                            {rentalImg[3] && type !== 'detail' && (
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  handleImgDelete(rentalImg[3].imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/'))
                                }
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            )}
                          </div>
                          <div className="img-box">
                            <label htmlFor="rentalImages">
                              {rentalImg[4] ? (
                                <img
                                  src={rentalImg[4].imageUrl.replace('cdn.loanhood.com/', 'ik.imagekit.io/w6paupmag1w/')}
                                  alt={rentalDetail.title}
                                />
                              ) : (
                                <AddIcon />
                              )}
                            </label>
                            {rentalImg[4] && type !== 'detail' && (
                              <IconButton aria-label="delete">
                                <CloseIcon />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      </div>
                      {err.rentalImages && <p className="err">{err.rentalImages}</p>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Title"
                        type="text"
                        name="title"
                        size="small"
                        disabled={type === 'detail'}
                        onChange={handleChange}
                        defaultValue={rentalDetail.title || ''}
                        helperText={err.title}
                        error={!!err.title}
                      />
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        required
                        helperText={err.description}
                        error={!!err.description}
                        label="Description"
                        name="description"
                        size="small"
                        disabled={type === 'detail'}
                        multiline
                        rows={3}
                        defaultValue={rentalDetail.description || ''}
                        onChange={handleChange}
                      />
                      <Grid container spacing={1}>
                        <Grid item sm={6} xs={12}>
                          <TextField
                            fullWidth
                            margin="normal"
                            select
                            name="status"
                            label="Status"
                            size="small"
                            variant="outlined"
                            disabled={type === 'detail'}
                            value={rentalDetail.status || ''}
                            onChange={handleChange}
                          >
                            {(changeState || !type) && <MenuItem value="pending">Pending</MenuItem>}
                            {(changeState || !type) && <MenuItem value="rejected">Rejected</MenuItem>}
                            <MenuItem value="approved">Approved</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Total Price"
                            type="number"
                            name="totalPrice"
                            size="small"
                            disabled
                            onChange={handleChange}
                            value={rentalDetail?.totalPrice || ''}
                            helperText={err.totalPrice}
                            error={!!err.totalPrice}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Original Price"
                            type="number"
                            name="originalPrice"
                            size="small"
                            disabled={type === 'detail'}
                            defaultValue={rentalDetail.originalPrice || ''}
                            onChange={handleChange}
                            helperText={err.originalPrice}
                            error={!!err.originalPrice}
                          />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Rental Price Per Week"
                            type="number"
                            name="rentalPricePerWeek"
                            size="small"
                            disabled={type === 'detail'}
                            defaultValue={rentalDetail.rentalPricePerWeek || ''}
                            onChange={handleChange}
                            helperText={err.rentalPricePerWeek}
                            error={!!err.rentalPricePerWeek}
                            onBlur={() => onBlurRentalPricePerWeek()}
                          />
                        </Grid>
                        <>
                          <Grid item sm={6} xs={12}>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Borrower Service Fee"
                              type="number"
                              disabled={type === 'detail'}
                              name="borrowerServiceFee"
                              size="small"
                              value={rentalDetail?.borrowerServiceFee || ''}
                              onChange={handleChange}
                              helperText={err.borrowerServiceFee}
                              error={!!err.borrowerServiceFee}
                              onBlur={(e) => onBlurBorrowerServiceFee(e)}
                            />
                          </Grid>
                          <Grid item sm={6} xs={12}>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              disabled={type === 'detail'}
                              label="Loaner Service Fee"
                              type="number"
                              name="loanerServiceFee"
                              size="small"
                              value={rentalDetail?.loanerServiceFee || ''}
                              onChange={handleChange}
                              helperText={err.loanerServiceFee}
                              error={!!err.loanerServiceFee}
                              onBlur={(e) => onBlurLoanerServiceFee(e)}
                            />
                          </Grid>
                          {userAddress && userAddress.length !== 0 && rentalDetail.userId && (
                            <Grid item sm={12} xs={12}>
                              <TextField
                                fullWidth
                                select
                                size="small"
                                variant="outlined"
                                label={rentalDetail.addressId ? 'Address' : 'Select Address'}
                                value={rentalDetail.addressId}
                                disabled={type === 'detail'}
                                onChange={(e) => handleAddressChange(e, 'addressId')}
                              >
                                {userAddress.map((address) => (
                                  <MenuItem
                                    selected={rentalDetail.addressId === address.id}
                                    key={address.id}
                                    value={address.id}
                                  >{`${address.address1} ${address.address2} ${address.city}`}</MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          )}
                          <Grid item sm={id ? 12 : 6} xs={12}>
                            <FormControl component="fieldset" error={!!err.isPickup}>
                              <FormLabel component="legend">In Person Pick-Up/Drop-Off</FormLabel>
                              <RadioGroup row name="isPickup" onChange={handleChange} value={rentalDetail.isPickup || false}>
                                <FormControlLabel
                                  disabled={type === 'detail'}
                                  value={true}
                                  control={<Radio color="primary" />}
                                  label="Yes"
                                />
                                <FormControlLabel
                                  disabled={type === 'detail'}
                                  value={false}
                                  control={<Radio color="primary" />}
                                  label="No"
                                />
                              </RadioGroup>
                              <FormHelperText>{err.isPickup}</FormHelperText>
                            </FormControl>
                          </Grid>
                          {!id && (
                            <Grid item sm={6} xs={12}>
                              <LazyLoadingSelect
                                apiCall={true}
                                api={GetUsers}
                                selectedId={parseInt(rentalDetail.userId || '')}
                                placeholder="Select User"
                                storeName="users"
                                selectorName="users"
                                size="small"
                                getSelectedBrand={(e) => handleUserChange(e, 'userId')}
                                error={!!err.userId || !!err.address}
                              />
                              {err.userId && <p className="err">{err.userId}</p>}
                              {err.address && <p className="err">{err.address}</p>}
                            </Grid>
                          )}
                        </>
                        <Grid item sm={rentalDetail.hasDelivery ? 6 : 12} xs={12}>
                          <FormControl component="fieldset" error={!!err.hasDelivery}>
                            <FormLabel component="legend">Has Delivery</FormLabel>
                            <RadioGroup row name="hasDelivery" onChange={handleChange} value={rentalDetail.hasDelivery || false}>
                              <FormControlLabel disabled={type === 'detail'} value={true} control={<Radio color="primary" />} label="Yes" />
                              <FormControlLabel disabled={type === 'detail'} value={false} control={<Radio color="primary" />} label="No" />
                            </RadioGroup>
                            <FormHelperText>{err.hasDelivery}</FormHelperText>
                          </FormControl>
                        </Grid>
                        {rentalDetail.hasDelivery && (
                          <Grid item sm={6} xs={12}>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Delivery Price"
                              type="number"
                              name="deliveryPrice"
                              size="small"
                              disabled={type === 'detail'}
                              defaultValue={rentalDetail.deliveryPrice || ''}
                              onChange={handleChange}
                            />
                          </Grid>
                        )}
                        <Grid item sm={6} xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">Needs Dry Cleaning</FormLabel>
                            <RadioGroup row name="needsDryCleaning" onChange={handleChange} value={rentalDetail.needsDryCleaning || false}>
                              <FormControlLabel disabled={type === 'detail'} value={true} control={<Radio color="primary" />} label="Yes" />
                              <FormControlLabel disabled={type === 'detail'} value={false} control={<Radio color="primary" />} label="No" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>

                        {rentalDetail.needsDryCleaning && (
                          <Grid item sm={6} xs={12}>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              label="Dry Clean Price"
                              type="number"
                              name="dryCleanPrice"
                              size="small"
                              disabled={type === 'detail'}
                              defaultValue={rentalDetail.dryCleanPrice || ''}
                              onChange={handleChange}
                            />
                          </Grid>
                        )}
                        {type === 'detail' && (
                          <Grid item xs={12}>
                            <TextField
                              variant="outlined"
                              margin="normal"
                              fullWidth
                              disabled
                              label="Deep link"
                              name="deepLink"
                              size="small"
                              value={rentalDetail?.shareUrl || '-'}
                            />
                          </Grid>
                        )}
                        {id && (
                          <Grid item xs={12}>
                            <FormControlLabel
                              className="rental-switch"
                              control={
                                <Switch
                                  color="primary"
                                  checked={rentalDetail.wasUpdated || false}
                                  name="wasUpdated"
                                  onChange={handleChange}
                                />
                              }
                              disabled={type === 'detail'}
                              label="Was Updated"
                              labelPlacement="start"
                            />
                          </Grid>
                        )}
                      </Grid>

                      {type !== 'detail' && (
                        <Button
                          onClick={onUpdate}
                          variant="contained"
                          fullWidth
                          size="large"
                          type="submit"
                          color="primary"
                          disabled={
                            isLoading ||
                            !(
                              !err.rentalImages &&
                              !err.title &&
                              !err.originalPrice &&
                              !err.rentalPricePerWeek &&
                              !err.totalPrice &&
                              !err.isPickup &&
                              !err.hasDelivery &&
                              !err.address
                            )
                          }
                          endIcon={isLoading && <CircularProgress color="inherit" size={20} />}
                        >
                          {id ? 'Update' : 'Add'}
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </form>
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Suspense fallback={<div>Loading...</div>}>
              {userData && userData.userName && <UserForm data={userData} type={type} isUserForRental={true} />}
            </Suspense>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Suspense fallback={<div>Loading...</div>}>
              <RentalTransactions id={id} api={GetRentalTransactions} storeName="rental" selectorName="rentalTransactions" search={true} />
            </Suspense>
          </TabPanel>
        </CardContent>
      </Card>
      {/* For Edit or detail page */}
      {id &&
        type === 'detail' &&
        value === 0 &&
        isPageLoading &&
        rentalDetail.rentalitems.map((item, index) => {
          return <RentalItem key={item.id} type={type} item={item} index={index} />
        })}
      {/* For add page */}
      {(!id || type === 'edit') && isPageLoading && value === 0 && (
        <>
          {rentalDetail.rentalitems.map((item, index) => {
            return (
              <RentalItem
                allItems={rentalDetail.rentalitems}
                key={index}
                type={type}
                item={item}
                index={index}
                errors={err.rentalitems[index]}
                handleChange={(e, i) => handleChange(e, i)}
                deleteItem={deleteRentalItem}
              />
            )
          })}
          {rentalDetail.rentalitems.length < 5 && (
            <Box p={1} className="text-right">
              <Button onClick={addRentalItem} variant="contained" color="primary">
                {' '}
                Add Item{' '}
              </Button>
            </Box>
          )}
        </>
      )}
      {value === 0 && isPageLoading && rentalStatus === 'pending' && type !== 'detail' && <RentalApprove id={id} onSuccess={updateState} />}
    </>
  )
}

export default RentalDetail
