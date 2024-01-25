import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import { formatToIso, getFileFromUrl, scrollTop, updateToS3 } from 'shared/utils'
import { createAsset, getAssetShow, getOwnedAssetDetails, uploadAsset, uploadThreeDAsset, uploadThumbnailAsset } from 'modules/assets/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { blockchainNetworkOptions, GLB, GLTF, TOAST_TYPE, ZIP } from 'shared/constants'
import { resaleTransaction, handleError } from 'modules/blockchainNetwork'

const useAssetCreation = () => {
  const { id, type, assetId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [artwork, setArtwork] = useState()
  const [thumbnailArtwork, setThumbnailArtwork] = useState()
  const [artworkMediaType, setArtworkMediaType] = useState()
  const [thumbnailArtworkMediaType, setThumbnailArtworkMediaType] = useState()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [assetFile, setAssetFile] = useState(null)
  const [thumbnailAssetFile, setThumbnailAssetFile] = useState(null)
  const [assetFileSize, setAssetFileSize] = useState(null)
  const [category, setCategory] = useState()
  const [isExclusive, setIsExclusive] = useState(false)
  const [asset, setAsset] = useState()

  const assetUploadStore = useSelector((state) => state.asset.assetUpload)
  const threeDAssetUploadData = useSelector((state) => state.asset.threeDAssetUpload)
  const thumbnailUploadStore = useSelector((state) => state.asset.thumbnailUpload)
  const resMessage = useSelector((state) => state.asset.resMessage)
  const ownedAssetDetailStore = useSelector((state) => state.asset.ownedAssetDetails)
  const categoryData = useSelector((state) => state.category.categories)
  const walletAccountStore = useSelector((state) => state.wallet)
  const assetShow = useSelector((state) => state.asset.assetShow)

  const [threeDAssetData, setThreeDAssetData] = useState({
    threeDThumbnailFile: null,
    threeDThumbnailObjUrl: null,
    threeDThumbnailMediaType: null,
    threeDPreviewFile: null,
    threeDPreviewObjUrl: null,
    threeDPreviewMediaType: null,
    threeDPreviewFileSize: null,
    threeDOriginalFile: null,
    threeDOriginalObjUrl: null,
    threeDOriginalMediaType: null,
    threeDOriginalFileSize: null
  })

  const {
    register: stepOneField,
    handleSubmit: stepOneSubmit,
    formState: { errors: stepOneErrors },
    watch,
    setValue,
    getValues: stepOneValue,
    control: stepOneControl,
    reset: stepOneReset,
    clearErrors: stepOneClearErrors,
    resetField: stepOneResetField
  } = useForm({ mode: 'all', blockchainNetwork: [], defaultValues: { artworkHiddenType: 'auction', isExclusive: false, blockchainNetwork: [] } })

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

  useEffect(() => {
    categoryData && setCategory(categoryData)
  }, [categoryData])

  useEffect(() => {
    if (assetId) {
      dispatch(getAssetShow(assetId))
      dispatch(getOwnedAssetDetails(id, { wishlistByLoggedInUser: true }))
    }
  }, [])

  useEffect(() => {
    if (id) {
      dispatch(getOwnedAssetDetails(id, { wishlistByLoggedInUser: true }))
    }
    if (!id) {
      stepOneReset({})
      stepTwoReset({})
    }
  }, [id])

  useEffect(() => {
    if (assetShow?.assets) {
      setAsset(assetShow.assets)
    }
  }, [assetShow])

  useEffect(async () => {
    if (category?.category) {
      let data
      if (ownedAssetDetailStore?.ownedAsset) {
        data = ownedAssetDetailStore?.ownedAsset
      } else if (asset) {
        data = { asset, blockchainNetwork: asset.blockchainNetwork }
      }
      const oldFileObject = await getFileFromUrl(data?.asset?.awsUrl, data?.asset?.fileName)
      if (oldFileObject) {
        setValue('addImage.files', oldFileObject)
        setAssetFile(oldFileObject)
      }
      setArtworkMediaType(data?.asset?.fileType)
      setArtwork(data?.asset?.awsUrl)
      setThumbnailArtwork(data?.asset?.thumbnailAwsUrl)
      let thumbName = data?.asset?.thumbnailAwsUrl || null
      if (thumbName) {
        thumbName = thumbName.substring(thumbName.lastIndexOf('.') + 1)
      }
      setThumbnailArtworkMediaType(thumbName)
      stepOneReset({
        isPhysical: data?.asset?.isPhysical || false,
        isDropNeeded: false,
        name: data?.asset?.name,
        description: data?.asset?.description,
        categoryId: category?.category.filter((item) => item.id === data?.asset?.categoryId),
        saleStartTime: '',
        saleEndTime: '',
        blockchainNetwork: (() => {
          if (data?.blockchainNetwork) {
            return blockchainNetworkOptions.filter((item) => item.value === data?.blockchainNetwork)[0]
          } else {
            return []
          }
        })()
      })
      stepTwoReset({
        royaltyPercentage: data?.asset?.royaltyPercentage,
        donationPercentage: 0.5,
        shortDescription: data?.asset?.shortDescription
      })
    }
  }, [ownedAssetDetailStore, category, asset])

  useEffect(() => {
    if (resMessage) {
      setLoading(false)
    }
  }, [resMessage])

  useEffect(() => {
    if (assetUploadStore && assetUploadStore.file) {
      if (!formData.is3D && !thumbnailAssetFile && assetUploadStore?.file) {
        updateImagesToS3Bucket({ assetFile, fileDetails: assetUploadStore?.file })
      }
      if (!formData.is3D && assetUploadStore?.file && thumbnailUploadStore?.file) {
        updateImagesToS3Bucket({ assetFile, fileDetails: assetUploadStore?.file, thumbnailAssetFile, thumbnailDetails: thumbnailUploadStore?.file })
      }
    }

    if (threeDAssetUploadData && threeDAssetUploadData.data.length > 0) {
      updateThreeDImagesToS3Bucket({ threeDAssetUploadData, thumbnailUploadStore, threeDAssetData })
    }
  }, [assetUploadStore, thumbnailUploadStore, threeDAssetUploadData])

  const updateThreeDImagesToS3Bucket = async ({ threeDAssetUploadData, thumbnailUploadStore, threeDAssetData }) => {
    const uploadedFileUrls = {
      threeDThumbnailUrl: null,
      threeDPreviewUrl: null,
      threeDOriginalUrl: null
    }

    if (thumbnailUploadStore && thumbnailUploadStore.file) {
      const threeDThumbnailUrl = await updateToS3(threeDAssetData.threeDThumbnailFile, thumbnailUploadStore.file.url)
      uploadedFileUrls.threeDThumbnailUrl = threeDThumbnailUrl
    }
    let threeDUploadedAssetDetails = { threeDThumbnail: thumbnailUploadStore.file }
    threeDAssetUploadData.data.forEach(item => {
      threeDUploadedAssetDetails = {
        ...threeDUploadedAssetDetails,
        [item.field]: item.file.file
      }
    })

    const [threeDPreviewUrl, threeDOriginalUrl] = await Promise.all([
      updateToS3(threeDAssetData.threeDPreviewFile, threeDUploadedAssetDetails.threeDPreview.url),
      updateToS3(threeDAssetData.threeDOriginalFile, threeDUploadedAssetDetails.threeDOriginal.url)
    ])
    uploadedFileUrls.threeDPreviewUrl = threeDPreviewUrl
    uploadedFileUrls.threeDOriginalUrl = threeDOriginalUrl

    if (uploadedFileUrls.threeDThumbnailUrl && uploadedFileUrls.threeDPreviewUrl && uploadedFileUrls.threeDOriginalUrl) {
      setAssetFormData(threeDUploadedAssetDetails, uploadedFileUrls)
    }
  }

  const updateImagesToS3Bucket = async ({ assetFile, fileDetails, thumbnailAssetFile, thumbnailDetails }) => {
    let fileUrl, thumbnailUrl
    if (fileDetails.url && !thumbnailAssetFile) {
      fileUrl = await updateToS3(assetFile, fileDetails.url)
      setAssetFormData(fileDetails, fileUrl)
    } else if (thumbnailAssetFile && fileDetails?.url && thumbnailDetails?.url) {
      fileUrl = await updateToS3(assetFile, fileDetails.url)
      thumbnailUrl = await updateToS3(thumbnailAssetFile, thumbnailDetails.url)
      setAssetFormData(fileDetails, fileUrl, thumbnailUrl)
    }
  }

  const changeStep = (number, data) => {
    setStep(number)
    setFormData({ ...formData, ...data })
    scrollTop()
  }

  const handleArtworkChange = (e, isDrag) => {
    const file = isDrag ? e[0] : e.target.files[0]
    const extension = file.name.split('.')[1]

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
      setArtwork(URL.createObjectURL(file))
      setAssetFileSize(file.size)
      stepOneClearErrors('addImage')
      if ((!file.type && extension === 'glb') || file.type === 'application/x-zip-compressed') {
        setArtworkMediaType(extension)
      } else {
        setArtworkMediaType(file.type.split('/')[1])
      }
    }
  }

  const handleThumbnailChange = (e, isDrag) => {
    const file = isDrag ? e[0] : e.target.files[0]

    if (file.size > 10500000) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: <FormattedMessage id="PleaseUploadAFileSmallerThan10MB" />,
          type: TOAST_TYPE.Error
        }
      })
    } else if (isDrag || (e && e.target.files.length > 0)) {
      setValue('addThumbnail', file)
      setThumbnailAssetFile(file)
      setThumbnailArtwork(URL.createObjectURL(file))
      stepOneClearErrors('addThumbnail')
      setThumbnailArtworkMediaType(file.type.split('/')[1])
    }
  }

  const handle3DAssetsChange = (assetData) => {
    try {
      const { event, isDrag, sizeLimit } = assetData

      const file = isDrag ? event[0] : event.target.files[0]
      if (!file) return false
      const extension = file.name.split('.')[1]

      if (file.size > sizeLimit) {
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: <FormattedMessage
              id={
                sizeLimit === 10500000 ? 'PleaseUploadAFileSmallerThan10MB' : sizeLimit === 30000000 ? 'PleaseUploadAFileSmallerThan30MB' : 'PleaseUploadAFileSmallerThan100MB'
              }
            />,
            type: TOAST_TYPE.Error
          }
        })
        return false
      }
      if (isDrag || (event && event.target.files.length > 0)) {
        switch (event.target.name) {
          case 'threeDThumbnail':
            setValue(`${event.target.name}.files`, file)
            stepOneClearErrors(event.target.name)
            setThreeDAssetData({
              ...threeDAssetData,
              threeDThumbnailFile: file,
              threeDThumbnailObjUrl: URL.createObjectURL(file),
              threeDThumbnailMediaType: file.type.split('/')[1]
            })
            break
          case 'threeDPreview':
            setValue(`${event.target.name}.files`, file)
            stepOneClearErrors(event.target.name)
            setThreeDAssetData({
              ...threeDAssetData,
              threeDPreviewFile: file,
              threeDPreviewObjUrl: URL.createObjectURL(file),
              threeDPreviewMediaType: (!file.type && extension === 'glb') || file.type === 'application/x-zip-compressed' ? extension : file.type.split('/')[1],
              threeDPreviewFileSize: file.size
            })
            break
          case 'threeDOriginal':
            setValue(`${event.target.name}.files`, file)
            stepOneClearErrors(event.target.name)
            setThreeDAssetData({
              ...threeDAssetData,
              threeDOriginalFile: file,
              threeDOriginalObjUrl: URL.createObjectURL(file),
              threeDOriginalMediaType: (!file.type && extension === 'glb') || file.type === 'application/x-zip-compressed' ? extension : file.type.split('/')[1],
              threeDOriginalFileSize: file.size
            })
            break
          default:
            break
        }
      }
    } catch (error) {
      console.log('handle3DAssetsChange Error', error)
    }
  }

  const onFirstStepSubmit = (data) => {
    changeStep(2, data)
  }

  const onSecondStepSubmit = (data) => {
    setLoading(true)
    setFormData({ ...formData, ...data, is3D: !!formData.threeDOriginal?.files?.name })
    const payload = { ...formData, ...data }
    setIsExclusive(payload.isExclusive)

    if (id) {
      setAssetFormData()
    } else if (payload.addImage || payload.threeDOriginal) {
      if (payload.addImage?.files?.name) {
        dispatch(uploadAsset({ fileName: payload.addImage?.files?.name }))
      }
      if (payload.addThumbnail?.name) {
        dispatch(uploadThumbnailAsset({ fileName: payload.addThumbnail.name }))
      }
      if (payload?.threeDOriginal?.files?.name && payload?.threeDPreview?.files?.name && payload?.threeDThumbnail?.files?.name) {
        dispatch(uploadThumbnailAsset({ fileName: payload.threeDThumbnail?.files?.name, field: 'threeDThumbnail' }))
        dispatch(uploadThreeDAsset({
          threeDPreview: { fileName: payload.threeDPreview?.files?.name },
          threeDOriginal: { fileName: payload.threeDOriginal?.files?.name }
        }))
      }
    }
  }

  const setAssetFormData = async (preSignedData, fileUrl, thumbnailAwsUrl) => {
    const payload = type === 'resell' ? { ...stepOneValue(), ...stepTwoValue() } : formData

    if (payload.categoryId) payload.categoryId = payload.categoryId.id
    if (payload.blockchainNetwork && payload.blockchainNetwork.value === 'buyer') {
      payload.blockchainNetwork = null
    } else if (payload.blockchainNetwork) payload.blockchainNetwork = payload.blockchainNetwork.value
    if (payload.saleStartTime) payload.saleStartTime = formatToIso(payload.saleStartTime)
    if (payload.saleEndTime) payload.saleEndTime = formatToIso(payload.saleEndTime)
    if (payload.donationPercentage) payload.donationPercentage = Number(payload.donationPercentage)
    if (payload.royaltyPercentage) payload.royaltyPercentage = Number(payload.royaltyPercentage)
    if (payload.minimumBidPrice) payload.minimumBidPrice = Number(payload.minimumBidPrice)
    if (payload.networkSellingPrice) payload.networkSellingPrice = Number(payload.networkSellingPrice)
    if (payload.currentNftDropId) payload.currentNftDropId = payload.currentNftDropId.id

    const is3DUpload = formData.is3D

    if (preSignedData) {
      let original3DFileType = null
      let preview3DFileType = null
      let fileType = null

      if (is3DUpload) {
        original3DFileType = preSignedData.threeDOriginal.fileNameWithTime.split('.')[1]
        preview3DFileType = preSignedData.threeDPreview.fileNameWithTime.split('.')[1]
      } else {
        fileType = preSignedData.fileNameWithTime.split('.')[1]
      }

      payload.largerFileGltfZipAwsUrl = fileUrl.threeDOriginalUrl || undefined
      payload.largerFileType = GLB
      payload.largerFileAwsUrl = fileUrl.threeDOriginalUrl
      payload.largerFileAwsUrl = fileUrl.threeDOriginalUrl

      if (!is3DUpload) {
        if (fileType === ZIP) {
          payload.fileType = GLTF
          payload.gltfZipAwsUrl = fileUrl
        } else if (fileType === GLB) {
          payload.fileType = GLB
          payload.awsUrl = fileUrl
        } else {
          payload.awsUrl = fileUrl
          payload.fileType = payload.addImage.files.type.split('/')[1]
        }
        payload.fileName = preSignedData.fileName
        payload.fileNameWithTime = preSignedData.fileNameWithTime
        payload.size = payload?.addImage?.files?.size
        payload.thumbnailAwsUrl = thumbnailAwsUrl
      } else {
        if (original3DFileType === ZIP) {
          payload.largerFileType = GLTF
          payload.largerFileGltfZipAwsUrl = fileUrl.threeDOriginalUrl
        } else if (original3DFileType === GLB) {
          payload.largerFileType = GLB
          payload.largerFileAwsUrl = fileUrl.threeDOriginalUrl
        } else {
          payload.largerFileAwsUrl = fileUrl.threeDOriginalUrl
          payload.largerFileType = payload.addImage.files.type.split('/')[1]
        }

        if (preview3DFileType === ZIP) {
          payload.fileType = GLTF
          payload.gltfZipAwsUrl = fileUrl.threeDPreviewUrl
        } else if (original3DFileType === GLB) {
          payload.fileType = GLB
          payload.awsUrl = fileUrl.threeDPreviewUrl
        } else {
          payload.fileType = fileUrl.threeDPreviewUrl
          payload.largerFileType = payload.addImage.files.type.split('/')[1]
        }

        payload.fileName = preSignedData.threeDPreview.fileName
        payload.fileNameWithTime = preSignedData.threeDPreview.fileNameWithTime
        payload.size = payload?.threeDPreview?.files?.size

        payload.largerFileName = preSignedData.threeDOriginal.fileName
        payload.largerFileNameWithTime = preSignedData.threeDOriginal.fileNameWithTime
        payload.largerFileSize = payload?.threeDOriginal?.files?.size
        payload.thumbnailAwsUrl = fileUrl.threeDThumbnailUrl
      }
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
    delete payload.addThumbnail
    delete payload.threeDOriginal
    delete payload.threeDPreview
    delete payload.threeDThumbnail

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
    console.log('resaleTransactionOnNetwork')
    const response = await resaleTransaction({
      blockchainNetwork: payload.blockchainNetwork,
      walletAccountStore,
      connectedAccount: walletAccountStore.account,
      setLoading,
      assetDetails: ownedAssetDetailStore,
      assetOnSalePayload: payload,
      dispatch
    })
    console.log('response')
    console.log(response)
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
    thumbnailArtwork,
    artworkMediaType,
    thumbnailArtworkMediaType,
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
    changeStep,
    handleArtworkChange,
    handleThumbnailChange,
    onFirstStepSubmit,
    onSecondStepSubmit,
    goBack,
    loading,
    setValue,
    category,
    stepTwoClearErrors,
    stepOneResetField,
    setArtwork,
    setThumbnailArtwork,
    assetFileSize,
    assetFile,
    handle3DAssetsChange,
    threeDAssetData,
    isExclusive
  }
}

export default useAssetCreation
