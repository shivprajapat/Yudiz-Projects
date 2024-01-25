import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import { formatDate, getFileFromUrl, scrollTop, updateToS3 } from 'shared/utils'
import { createAsset, getOwnedAssetDetails, uploadAsset } from 'modules/assets/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { blockchainNetworkOptions, TOAST_TYPE } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import { resaleTransaction, handleError } from 'modules/metaMask'

const useAssetCreation = () => {
  const { id, type } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [artwork, setArtwork] = useState()
  const [artworkMediaType, setArtworkMediaType] = useState()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assetFile, setAssetFile] = useState(null)
  const [category, setCategory] = useState()

  const assetUploadStore = useSelector((state) => state.asset.assetUpload)
  const resMessage = useSelector((state) => state.asset.resMessage)
  const ownedAssetDetailStore = useSelector((state) => state.asset.ownedAssetDetails)
  const categoryData = useSelector((state) => state.category.categories)
  const walletAccountStore = useSelector((state) => state.wallet)

  const {
    register: stepOneField,
    handleSubmit: stepOneSubmit,
    formState: { errors: stepOneErrors },
    watch,
    setValue,
    getValues: stepOneValue,
    control: stepOneControl,
    reset: stepOneReset
  } = useForm({ mode: 'all', defaultValues: { artworkHiddenType: 'auction', isExclusive: false } })

  const {
    register: stepTwoField,
    handleSubmit: stepTwoSubmit,
    formState: { errors: stepTwoErrors },
    control,
    watch: stepTwoWatch,
    setValue: setStepTwoValue,
    reset: stepTwoReset,
    getValues: stepTwoValue,
    clearErrors: stepTwoClearErrors
  } = useForm({
    mode: 'all',
    defaultValues: {
      donationPercentage: 0.5
    }
  })

  const addImage = stepOneField('addImage', { required: artworkMediaType ? false : validationErrors.required })

  useEffect(() => {
    categoryData && setCategory(categoryData)
  }, [categoryData])

  useEffect(() => {
    if (id) {
      dispatch(getOwnedAssetDetails(id))
    }
    if (!id) {
      stepOneReset({})
      stepTwoReset({})
    }
  }, [id])

  useEffect(() => {
    if (ownedAssetDetailStore?.ownedAsset && category?.category) {
      const data = ownedAssetDetailStore?.ownedAsset
      const oldFileObject = getFileFromUrl(data?.asset?.awsUrl, data?.asset?.fileName)
      setValue('addImage.files', oldFileObject)
      setAssetFile(oldFileObject)
      setArtworkMediaType(data?.asset?.fileType)
      setArtwork(data?.asset?.awsUrl)
      stepOneReset({
        isPhysical: data?.asset?.isPhysical || false,
        isDropNeeded: false,
        name: data?.asset?.name,
        description: data?.asset?.description,
        categoryId: category?.category.filter((item) => item.id === data?.asset?.categoryId),
        saleStartTime: '',
        saleEndTime: '',
        blockchainNetwork: data.blockchainNetwork ? blockchainNetworkOptions.filter((item) => item.value === data?.blockchainNetwork)[0] : blockchainNetworkOptions[3]
      })
      stepTwoReset({
        royaltyPercentage: data?.asset?.royaltyPercentage,
        donationPercentage: 0.5,
        shortDescription: data?.asset?.shortDescription
      })
    }
  }, [ownedAssetDetailStore, category])

  useEffect(() => {
    if (resMessage) {
      setLoading(false)
    }
  }, [resMessage])

  useEffect(() => {
    if (assetUploadStore && assetUploadStore.file) {
      setS3Url(assetFile, assetUploadStore.file)
    }
  }, [assetUploadStore])

  const setS3Url = async (assetFile, file) => {
    const fileUrl = await updateToS3(assetFile, file.url)
    setAssetFormData(file, fileUrl)
  }

  const changeStep = (number, data) => {
    setStep(number)
    setFormData({ ...formData, ...data })
    scrollTop()
  }

  const handleArtworkChange = (e, isDrag) => {
    const file = isDrag ? e[0] : e.target.files[0]
    if (file.size > 105000000) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: <FormattedMessage id="PleaseUploadAFileSmallerThan100MB" />,
          type: TOAST_TYPE.Error
        }
      })
    } else if (isDrag || (e && e.target.files.length > 0)) {
      setValue('addImage.files', file)
      setAssetFile(file)
      setArtworkMediaType(file.type.split('/')[1])
      setArtwork(URL.createObjectURL(file))
      stepTwoClearErrors('addImage')
    }
  }

  const onFirstStepSubmit = (data) => {
    changeStep(2, data)
  }

  const onSecondStepSubmit = (data) => {
    setLoading(true)
    setFormData({ ...formData, ...data })
    const payload = { ...formData, ...data }
    if (id) {
      setAssetFormData()
    } else if (payload.addImage) {
      dispatch(uploadAsset({ fileName: payload.addImage.files.name }))
    }
  }
  const setAssetFormData = async (preSignedData, fileUrl) => {
    const payload = type === 'resell' ? { ...stepOneValue(), ...stepTwoValue() } : formData
    if (payload.categoryId) payload.categoryId = payload.categoryId.id
    if (payload.blockchainNetwork && payload.blockchainNetwork.value === 'buyer') {
      payload.blockchainNetwork = null
    } else if (payload.blockchainNetwork) payload.blockchainNetwork = payload.blockchainNetwork.value
    if (payload.saleStartTime) payload.saleStartTime = formatDate(payload.saleStartTime)
    if (payload.saleEndTime) payload.saleEndTime = formatDate(payload.saleEndTime)
    if (payload.donationPercentage) payload.donationPercentage = Number(payload.donationPercentage)
    if (payload.royaltyPercentage) payload.royaltyPercentage = Number(payload.royaltyPercentage)
    if (payload.minimumBidPrice) payload.minimumBidPrice = Number(payload.minimumBidPrice)
    if (payload.networkSellingPrice) payload.networkSellingPrice = Number(payload.networkSellingPrice)

    if (preSignedData) {
      payload.awsUrl = fileUrl
      payload.fileName = preSignedData.fileName
      payload.fileNameWithTime = preSignedData.fileNameWithTime
      payload.fileType = payload.addImage.files.type.split('/')[1]
      payload.size = payload.addImage.files.size
    }
    if (payload.artworkHiddenType === 'auction') {
      payload.auctionMinimumPrice = payload.minimumBidPrice
    } else if (payload.artworkHiddenType === 'fixedPrice') {
      payload.sellingPrice = payload.minimumBidPrice
      delete payload.saleStartTime
      delete payload.saleEndTime
    }
    if (id) {
      payload.assetId = ownedAssetDetailStore?.ownedAsset?.assetId
      payload.resell = true
      delete payload.royaltyPercentage
    }

    delete payload.artworkHiddenType
    delete payload.editImage
    delete payload.addImage
    delete payload.minimumBidPrice

    setLoading(true)
    let result = false
    if (id) {
      result = await resaleTransactionOnNetwork({ payload })
    } else {
      result = true
    }
    if (result) {
      dispatch(
        createAsset(payload, () => {
          setShow(true)
        })
      )
    } else {
      setLoading(false)
    }
  }

  const resaleTransactionOnNetwork = async ({ payload }) => {
    const response = await resaleTransaction({
      connectedAccount: walletAccountStore.account,
      setLoading,
      assetDetails: ownedAssetDetailStore,
      assetOnSalePayload: payload,
      dispatch
    })
    if (response && response.blockHash) {
      return true
    }
    handleError({ dispatch, setLoading })
    return false
  }

  const goBack = () => {
    navigate(-1)
  }

  return {
    step,
    formData,
    artwork,
    artworkMediaType,
    show,
    assetUploadStore,
    stepOneField,
    stepOneSubmit,
    stepOneErrors,
    watch,
    stepOneValue,
    stepOneControl,
    stepTwoField,
    stepTwoSubmit,
    stepTwoErrors,
    control,
    stepTwoWatch,
    setStepTwoValue,
    addImage,
    changeStep,
    handleArtworkChange,
    onFirstStepSubmit,
    onSecondStepSubmit,
    goBack,
    loading,
    setValue,
    category,
    stepTwoClearErrors
  }
}

export default useAssetCreation
