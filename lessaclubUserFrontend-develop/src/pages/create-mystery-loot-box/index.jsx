import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Container, Row, Form, ToggleButton } from 'react-bootstrap'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { FormattedMessage } from 'react-intl'

import './style.scss'
import { arrowBackIcon, createAssetLogoIcon } from 'assets/images'
import { blockchainNetworkOptions, cratesTypeOptions, NO_SPECIAL_CHARACTER, TOAST_TYPE } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import { createLootBox, createMysteryBox, getCrateAssets } from 'modules/crates/redux/service'
import { debounce, forceAsPositiveNumber, getDirtyFormValues, updateToS3 } from 'shared/utils'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import useDragAndDrop from 'shared/hooks/use-drag-and-drop'
import { getPreSignedUrl } from 'shared/functions'
import { allRoutes } from 'shared/constants/allRoutes'
import CouponSelection from './components/coupons-selection'
import WalletAddressField from 'shared/components/wallet-address-field'

const CreateMysteryLootBox = () => {
  const FORM_FIELDS = ['assetHints', 'nuuCoinHints']
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')

  const [requestParams, setRequestParams] = useState()
  const [crateAssets, setCrateAssets] = useState()
  const [loading, setLoading] = useState(false)
  const [validateCouponFields, setValidateCouponFields] = useState(false)
  const [couponStatus, setCouponStatus] = useState({})

  const isBottomReached = useRef(false)
  const totalAssets = useRef(0)

  const crateAssetStore = useSelector((state) => state.crates.crateAssets)
  const resError = useSelector((state) => state.crates.resError)

  const couponKey = {
    name: '',
    description: '',
    code: '',
    link: ''
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
    control,
    setValue,
    setError,
    clearErrors,
    getValues,
    resetField,
    trigger
  } = useForm({ mode: 'all', defaultValues: { crateHiddenType: 'lootBox', coupons: [couponKey] } })

  const values = getValues()

  const crateHiddenType = watch('crateHiddenType')
  const assetIds = watch('assetIds')
  const thumbnailField = watch('thumbnail.files')
  const blockchainNetwork = watch('blockchainNetwork')
  const nuuCoinCount = watch('nuuCoinCount')
  const nuuCoinHintsMinCount = watch('nuuCoinHints.minCount')
  const nuuCoinHintsMaxCount = watch('nuuCoinHints.maxCount')
  const coupons = watch('coupons')

  const assetHints = useWatch({
    control,
    name: 'assetHints'
  })

  const nuuCoinHints = useWatch({
    control,
    name: 'nuuCoinHints'
  })

  useEffect(() => {
    FORM_FIELDS.forEach((field) => {
      dirtyFieldValidations(field)
    })
  }, [assetHints, nuuCoinHints])

  useEffect(() => {
    if (resError) {
      setLoading(false)
    }
  }, [resError])

  useEffect(() => {
    if (requestParams) {
      dispatch(getCrateAssets(requestParams))
    }
  }, [requestParams])

  useEffect(() => {
    if (crateAssetStore?.assetsOnSale) {
      totalAssets.current = crateAssetStore?.metaData?.totalItems
      if (isBottomReached.current) {
        setCrateAssets([...crateAssets, ...crateAssetStore?.assetsOnSale])
      } else {
        setCrateAssets(crateAssetStore?.assetsOnSale)
      }
    }
  }, [crateAssetStore])

  const isNoCoupon = Object.values(coupons[0]).filter((item) => item !== '').length === 0

  const isNftsReq = (() => {
    if (crateHiddenType === 'lootBox') {
      return blockchainNetwork || (assetHints && (!isNaN(assetHints?.minAmount) || !isNaN(assetHints?.maxAmount))) ? validationErrors.required : false
    } else {
      return validationErrors.required
    }
  })()

  const isBlockChainNetworkReq = (() => {
    if (crateHiddenType === 'lootBox') {
      if (blockchainNetwork || (assetHints && (!isNaN(assetHints?.minAmount) || !isNaN(assetHints?.maxAmount)))) {
        return validationErrors.required
      } else {
        return false
      }
    } else {
      return validationErrors.required
    }
  })()

  const validateNuuCoinFields = (nuuCoinCount || nuuCoinHintsMinCount || nuuCoinHintsMaxCount) && validationErrors.required

  const dirtyFieldValidations = (name) => {
    if (dirtyFields?.[name] && FORM_FIELDS.includes(name)) {
      Object.keys(dirtyFields?.[name]).forEach((field) => trigger(`${name}.${field}`))
    }
  }

  const handleScroll = () => {
    if (totalAssets.current > requestParams.page * 10) {
      setRequestParams({ ...requestParams, page: requestParams.page + 1 })
      isBottomReached.current = true
    }
  }

  const optimizedSearch = debounce((txt, { action, prevInputValue }) => {
    if (action === 'input-change') {
      setRequestParams({ ...requestParams, name: txt, page: 1 })
    }
    if (action === 'set-value') {
      prevInputValue && setRequestParams({ ...requestParams, name: '', page: 1 })
    }
    if (action === 'menu-close') {
      prevInputValue && setRequestParams({ ...requestParams, name: '', page: 1 })
    }
  })

  const handleArtworkChange = (e, isDrag) => {
    const file = isDrag ? e[0] : e.target.files[0]
    if (!file.type.startsWith('image/')) {
      setValue('thumbnail', null)
      setError('thumbnail', {
        type: 'fileType',
        message: 'Only image is valid in this field.'
      })
    }

    if (file.size > 105000000) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: <FormattedMessage id="PleaseUploadAFileSmallerThan100MB" />,
          type: TOAST_TYPE.Error
        }
      })
    } else if (isDrag || (e && e.target.files.length > 0)) {
      setValue('thumbnail.files', { fileObject: file, url: URL.createObjectURL(file), type: file.type.split('/')[1], updated: true })
      clearErrors('thumbnail')
    }
  }

  const { dropRef, isDragging } = useDragAndDrop(handleArtworkChange)

  const isNan = (obj) => {
    return Object.values(obj).some((item) => isNaN(item))
  }

  const onSubmit = (data) => {
    if (data.crateHiddenType === 'lootBox' && isNan(data?.assetHints) && isNan(data?.nuuCoinHints) && isNoCoupon) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: "please enter any of the following fields 'Asset Hints', 'Nuucoin Hints', 'Coupons'",
          type: TOAST_TYPE.Error
        }
      })
    } else {
      setLoading(true)
      getPreSignedUrl({ fileName: data.thumbnail.files.fileObject.name }).then((res) => {
        updateToS3(data.thumbnail.files.fileObject, res.data.result.file.url)
          .then((res) => {
            createCrate(data, res)
          })
          .catch((err) => {
            dispatch({
              type: SHOW_TOAST,
              payload: {
                message: err?.message || validationErrors.serverError,
                type: TOAST_TYPE.Error
              }
            })
          })
      })
    }
  }

  const createCrate = (data, thumbnailUrl) => {
    const payload = getDirtyFormValues(dirtyFields, data)
    if (payload.assetIds) payload.assetIds = payload.assetIds.map((item) => item?.asset?.id)
    if (payload.blockchainNetwork) payload.blockchainNetwork = data.blockchainNetwork.value === 'buyer' ? '' : data.blockchainNetwork.value
    payload.thumbnailUrl = thumbnailUrl
    delete payload.crateHiddenType
    delete payload.thumbnail
    payload.sellerWalletAddress = data.sellerWalletAddress
    if (crateHiddenType === 'lootBox') {
      dispatch(
        createLootBox(payload, () => {
          navigate(allRoutes.crates)
        })
      )
    } else {
      dispatch(
        createMysteryBox(payload, () => {
          navigate(allRoutes.crates)
        })
      )
    }
  }

  const validateCoupon = (index, status = {}) => {
    if (isNaN(index)) return
    setCouponStatus({
      ...couponStatus,
      [index]: status
    })
  }

  const onChangeBlockchainNetwork = (e) => {
    resetField('assetIds')
    setRequestParams({
      ...requestParams,
      page: 1,
      perPage: 20,
      isSold: false,
      isSaleInProgress: false,
      isExpired: false,
      auctionId: null,
      nonAuctionAssets: true,
      createdBy: userId,
      blockchainNetwork: e.value === 'buyer' ? '' : e.value
    })
  }

  return (
    <section className="create-mystery-loot-box section-padding section-lr-m">
      <Container>
        <Row className="align-items-end">
          <Col lg={6}>
            <div className="back-arrow-box">
              <Button className="back-btn" onClick={() => navigate(-1)}>
                <img src={arrowBackIcon} alt="back button" />
              </Button>
              <div className="artwork-title d-flex align-items-center">
                <h4>Create your artwork</h4>
              </div>
            </div>
            <div className="list-nft-que">
              <span className="d-block">What do you want to create? </span>
              <div className="list-nft-inner d-flex">
                {cratesTypeOptions.map((type, index) => (
                  <div className="list-nft-btns" key={index}>
                    <Controller
                      name="crateHiddenType"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <ToggleButton
                          className="normal-btn"
                          key={index}
                          id={`crate-type-${index}`}
                          type="radio"
                          name="crateHiddenType"
                          value={type.value}
                          checked={crateHiddenType === type.value}
                          onChange={onChange}
                        >
                          {type.name}
                        </ToggleButton>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)} id="crate-form">
              <Row>
                <Col md={12}>
                  <Form.Group className="form-group">
                    <Form.Label>Crate Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your crate name"
                      className={errors.name && 'error'}
                      {...register('name', {
                        required: validationErrors.required,
                        pattern: { value: NO_SPECIAL_CHARACTER, message: validationErrors.noSpecialCharacters },
                        maxLength: {
                          value: 15,
                          message: validationErrors.maxLength(15)
                        }
                      })}
                    />
                    {errors.name && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.name.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label>Crate Description*</Form.Label>
                    <Form.Control
                      type="text"
                      as="textarea"
                      maxLength={1500}
                      name="description"
                      placeholder="Enter the crate description"
                      className={errors.description && 'error'}
                      {...register('description', {
                        required: validationErrors.required,
                        maxLength: {
                          value: 200,
                          message: validationErrors.maxLength(200)
                        }
                      })}
                    />
                    {errors.description && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.description.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <h3 className="form-heading">Add NFT</h3>

                  <Form.Group className="form-group">
                    <Form.Label>
                      <FormattedMessage id="blockchainNetwork" />
                      {isBlockChainNetworkReq && '*'}
                    </Form.Label>
                    <Controller
                      name="blockchainNetwork"
                      control={control}
                      rules={{ required: isBlockChainNetworkReq }}
                      render={({ field: { onChange, value = [] } }) => (
                        <Select
                          value={value}
                          className={`react-select ${errors.blockchainNetwork && 'error'}`}
                          classNamePrefix="select"
                          placeholder={'Select Blockchain Network'}
                          options={blockchainNetworkOptions}
                          onChange={(e) => {
                            onChange(e)
                            onChangeBlockchainNetwork(e)
                          }}
                        />
                      )}
                    />
                    {errors.blockchainNetwork && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.blockchainNetwork.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <Form.Group className="form-group">
                    <Form.Label>
                      NFTs{isNftsReq && '*'}
                      <Form.Text className="text-muted mx-1">(Max 10 NFTs)</Form.Text>
                    </Form.Label>
                    <Controller
                      name="assetIds"
                      control={control}
                      rules={{ required: isNftsReq }}
                      render={({ field: { onChange, value = [], ref } }) => (
                        <Select
                          value={value}
                          ref={ref}
                          className={`react-select ${errors?.assetIds && 'error'}`}
                          classNamePrefix="select"
                          closeMenuOnSelect={false}
                          getOptionValue={(option) => option?.id}
                          getOptionLabel={(option) => option?.asset?.name}
                          isOptionDisabled={() => assetIds?.length >= 10}
                          isSearchable
                          isMulti
                          options={crateAssets}
                          onMenuScrollToBottom={handleScroll}
                          onInputChange={(value, action) => optimizedSearch(value, action)}
                          onChange={onChange}
                        />
                      )}
                    />
                    {errors?.assetIds && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors?.assetIds?.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  {crateHiddenType === 'lootBox' && (
                    <>
                      <h3 className="form-sub-heading">NFT Hints</h3>
                      <Row>
                        <Form.Group className="form-group" as={Col} lg={6}>
                          <Form.Label>Min Amount{isNftsReq && '*'}</Form.Label>
                          <Form.Control
                            type="number"
                            name="assetHints.minAmount"
                            onKeyDown={forceAsPositiveNumber}
                            onWheel={(e) => e.target.blur()}
                            step="any"
                            placeholder="Enter Minimum Amount"
                            className={errors?.assetHints?.minAmount && 'error'}
                            {...register('assetHints.minAmount', {
                              valueAsNumber: true,
                              required: isNftsReq,
                              validate: (value) => {
                                if (value <= 0) {
                                  return validationErrors.price
                                } else if (values?.assetHints?.maxAmount) {
                                  return value < values?.assetHints?.maxAmount || validationErrors.lessThanMax
                                }
                              }
                            })}
                          />
                          {errors?.assetHints?.minAmount && (
                            <Form.Control.Feedback type="invalid" className="invalidFeedback">
                              {errors?.assetHints?.minAmount?.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group className="form-group" as={Col} lg={6}>
                          <Form.Label>Max Amount{isNftsReq && '*'}</Form.Label>
                          <Form.Control
                            type="number"
                            name="assetHints.maxAmount"
                            onKeyDown={forceAsPositiveNumber}
                            onWheel={(e) => e.target.blur()}
                            step="any"
                            placeholder="Enter Maximum Amount"
                            className={errors?.assetHints?.maxAmount && 'error'}
                            {...register('assetHints.maxAmount', {
                              valueAsNumber: true,
                              required: isNftsReq,
                              validate: (value) => {
                                if (value <= 0) {
                                  return validationErrors.price
                                } else if (values?.assetHints?.minAmount) {
                                  return value > values?.assetHints?.minAmount || validationErrors.greaterThanMin
                                }
                              }
                            })}
                          />
                          {errors?.assetHints?.maxAmount && (
                            <Form.Control.Feedback type="invalid" className="invalidFeedback">
                              {errors?.assetHints?.maxAmount?.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Row>

                      <h3 className="form-heading">Add Nuucoins</h3>
                      <Form.Group className="form-group">
                        <Form.Label>Nuucoins{validateNuuCoinFields ? '*' : null}</Form.Label>
                        <Form.Control
                          type="number"
                          name="nuuCoinCount"
                          onKeyDown={forceAsPositiveNumber}
                          onWheel={(e) => e.target.blur()}
                          step="any"
                          placeholder="Enter Nuucoin Amount"
                          className={errors.nuuCoinCount && 'error'}
                          {...register('nuuCoinCount', {
                            valueAsNumber: true,
                            required: validateNuuCoinFields,
                            validate: (value) => {
                              if (value) {
                                return value > 0 || validationErrors.price
                              }
                            }
                          })}
                        />
                        {errors.nuuCoinCount && (
                          <Form.Control.Feedback type="invalid" className="invalidFeedback">
                            {errors.nuuCoinCount.message}
                          </Form.Control.Feedback>
                        )}
                      </Form.Group>
                      <h3 className="form-sub-heading">Nuucoins Hints</h3>
                      <Row>
                        <Form.Group className="form-group" as={Col} lg={6}>
                          <Form.Label>Min Amount{validateNuuCoinFields ? '*' : null}</Form.Label>
                          <Form.Control
                            type="number"
                            name="nuuCoinHints.minCount"
                            onKeyDown={forceAsPositiveNumber}
                            onWheel={(e) => e.target.blur()}
                            step="any"
                            placeholder="Enter Minimum Amount"
                            className={errors?.nuuCoinHints?.minCount && 'error'}
                            {...register('nuuCoinHints.minCount', {
                              valueAsNumber: true,
                              required: validateNuuCoinFields,
                              validate: (value) => {
                                if (value <= 0) {
                                  return validationErrors.price
                                } else if (values?.nuuCoinHints?.maxCount) {
                                  return value < values?.nuuCoinHints?.maxCount || validationErrors.lessThanMax
                                }
                              }
                            })}
                          />
                          {errors?.nuuCoinHints?.minCount && (
                            <Form.Control.Feedback type="invalid" className="invalidFeedback">
                              {errors?.nuuCoinHints?.minCount?.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                        <Form.Group className="form-group" as={Col} lg={6}>
                          <Form.Label>Max Amount{validateNuuCoinFields ? '*' : null}</Form.Label>
                          <Form.Control
                            type="number"
                            name="nuuCoinHints.maxCount"
                            onKeyDown={forceAsPositiveNumber}
                            onWheel={(e) => e.target.blur()}
                            step="any"
                            placeholder="Enter Maximum Amount"
                            className={errors?.nuuCoinHints?.maxCount && 'error'}
                            {...register('nuuCoinHints.maxCount', {
                              valueAsNumber: true,
                              required: validateNuuCoinFields,
                              validate: (value) => {
                                if (value <= 0) {
                                  return validationErrors.price
                                } else if (values?.nuuCoinHints?.minCount) {
                                  return value > values?.nuuCoinHints?.minCount || validationErrors.greaterThanMin
                                }
                              }
                            })}
                          />
                          {errors?.nuuCoinHints?.maxCount && (
                            <Form.Control.Feedback type="invalid" className="invalidFeedback">
                              {errors?.nuuCoinHints?.maxCount?.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Row>

                      <CouponSelection
                        control={control}
                        errors={errors}
                        register={register}
                        couponKey={couponKey}
                        watch={watch}
                        validateCouponFields={validateCouponFields}
                        setValidateCouponFields={setValidateCouponFields}
                        validateCoupon={validateCoupon}
                        couponStatus={couponStatus}
                      />

                      <h3 className="form-sub-heading">Coupons Hints</h3>
                      <Row>
                        <Form.Group className="form-group">
                          <Form.Label>Description{isNoCoupon ? null : '*'}</Form.Label>
                          <Form.Control
                            type="text"
                            name="couponsHints.description"
                            placeholder="Enter your coupon description"
                            className={`${errors?.couponsHints?.description && 'error'}`}
                            {...register('couponsHints.description', {
                              required: isNoCoupon ? false : validationErrors.required,
                              maxLength: {
                                value: 200,
                                message: validationErrors.maxLength(200)
                              }
                            })}
                          />
                          {errors?.couponsHints?.description && (
                            <Form.Control.Feedback type="invalid" className="invalidFeedback">
                              {errors?.couponsHints?.description?.message}
                            </Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Row>
                    </>
                  )}

                  <Form.Group className="form-group">
                    <Form.Label>Price*</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      step="any"
                      onKeyDown={forceAsPositiveNumber}
                      onWheel={(e) => e.target.blur()}
                      placeholder="Enter Nuucoin Amount"
                      className={errors.price && 'error'}
                      {...register('price', {
                        required: validationErrors.required,
                        validate: (value) => value > 0 || validationErrors.price
                      })}
                    />
                    {errors.price && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.price.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>

                  <WalletAddressField
                    name="sellerWalletAddress"
                    errors={errors}
                    register={register}
                    setValue={setValue}
                    clearErrors={clearErrors}
                  />
                </Col>
              </Row>
            </Form>
          </Col>
          <Col lg={6}>
            <div className="upload-artwork">
              <div className="upload-artwork-title">
                <h6 className="text-capitalize">Upload Crate Image*</h6>
                <div>JPG, PNG, JPEG</div>
              </div>
              <div className="upload-box-container">
                <div
                  className="upload-box"
                  ref={dropRef}
                  style={{ border: `${isDragging ? '2px dashed #C7FFBD' : errors?.thumbnail ? '2px dashed #ff0000' : ''}` }}
                >
                  <input
                    type="file"
                    name="thumbnail"
                    id="crate-image"
                    accept="image/*"
                    {...register('thumbnail', {
                      required: thumbnailField ? false : validationErrors.required
                    })}
                    hidden
                    onChange={(e) => {
                      handleArtworkChange(e, false)
                    }}
                  />

                  {thumbnailField && (
                    <>
                      <div className="uploaded-file">
                        <img className="img" src={thumbnailField?.url} alt="thumbnail image" />
                      </div>
                      <div>
                        <label htmlFor="crate-image" className="change-img-btn">
                          Change image
                        </label>
                      </div>
                    </>
                  )}

                  {!thumbnailField && (
                    <div className="upload-desc">
                      <h6>Drag &amp; drop files here to upload</h6>
                      <label htmlFor="crate-image" className="browse-btn">
                        Browse file
                      </label>
                      <span>Max size limit - 100MB</span>
                    </div>
                  )}
                </div>
                {errors?.thumbnail && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors?.thumbnail?.message}
                  </Form.Control.Feedback>
                )}
              </div>
              <div className="upload-end-btns d-flex justify-content-between">
                <Button className="white-border-btn" disabled={loading} onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button className="white-btn" type="submit" disabled={loading} form="crate-form">
                  Submit
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <img src={createAssetLogoIcon} alt="logo-img" className="img-fluid" />
    </section>
  )
}
export default CreateMysteryLootBox
