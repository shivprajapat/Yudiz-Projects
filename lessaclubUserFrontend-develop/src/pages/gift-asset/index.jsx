import { arrowBackIcon } from 'assets/images'
import React, { useEffect, useState } from 'react'
import { Col, Container, Form, Row, Button } from 'react-bootstrap'
import { useForm, Controller } from 'react-hook-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { validationErrors } from 'shared/constants/validationErrors'
import { EMAIL, TOAST_TYPE } from 'shared/constants'
import './style.scss'
import { getAssetShow } from 'modules/assets/redux/service'
import SelectWalletModal from 'shared/components/select-wallet-modal'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { giftTransaction } from 'modules/blockchainNetwork'
import { allRoutes } from 'shared/constants/allRoutes'
import WalletAddressField from 'shared/components/wallet-address-field'
import { giftCreation } from 'modules/gifts/redux/service'
import { GlbViewer } from 'modules/3DFiles'
import { FileZipIcon } from 'assets/images/icon-components/icons'
import ReactPlayer from 'react-player'
import UserInfo from 'shared/components/user-info'
import { CLEAR_GIFT_CREATION_RESPONSE } from 'modules/gifts/redux/action'
import Phone from 'shared/components/phone'
import countries from 'shared/data/countries'
import Select from 'react-select'

const GiftAsset = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {
    watch,
    register,
    formState: { errors },
    setValue,
    clearErrors,
    control,
    handleSubmit
  } = useForm()

  const [asset, setAsset] = useState()
  const [account, setAccount] = useState(null)
  const [showGiftConfirmation, setGiftConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [connectWallet, setConnectWallet] = useState(false)

  const assetShow = useSelector((state) => state.asset.assetShow)
  const giftCreated = useSelector((state) => state.gift.giftCreated)
  const walletAccountStore = useSelector((state) => state.wallet)

  const receiverAddress = watch('receiverAddress')
  const receiverEmail = watch('receiverEmail')
  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const houseNumber = watch('houseNumber')
  const streetName = watch('streetName')
  const city = watch('city')
  const state = watch('state')
  const pinCode = watch('pinCode')

  const labels = {
    firstName: useIntl().formatMessage({ id: 'enterFirstName' }),
    lastName: useIntl().formatMessage({ id: 'enterLastName' }),
    houseNumber: useIntl().formatMessage({ id: 'enterHouseNumber' }),
    streetName: useIntl().formatMessage({ id: 'enterStreetName' }),
    city: useIntl().formatMessage({ id: 'enterCity' }),
    state: useIntl().formatMessage({ id: 'enterState' }),
    pinCode: useIntl().formatMessage({ id: 'enterPinCode' }),
    email: useIntl().formatMessage({ id: 'enterEmail' })
  }

  useEffect(() => {
    if (id) {
      dispatch(getAssetShow(id))
    }
  }, [id])

  useEffect(() => {
    if (assetShow?.assets) {
      setAsset(assetShow.assets)
    }
  }, [assetShow])

  useEffect(() => {
    if (walletAccountStore) {
      setAccount(walletAccountStore.account)
    }
  }, [walletAccountStore])

  useEffect(() => {
    // not tested
    if (giftCreated && giftCreated.errors) {
      setLoading(false)
      setGiftConfirmation(false)
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: giftCreated.error,
          type: TOAST_TYPE.Error
        }
      })
    } else if (giftCreated) {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: 'Your gift is created successfully',
          type: TOAST_TYPE.Success
        }
      })
      dispatch({
        type: CLEAR_GIFT_CREATION_RESPONSE
      })
      navigate(allRoutes.profile)
    }
  }, [giftCreated])

  const areYouSure = () => {
    toggleConfirmationModal()
  }

  const toggleConfirmationModal = () => {
    setGiftConfirmation((prev) => !prev)
  }

  const handleConfirmation = async () => {
    if (!account) {
      setConnectWallet(true)
    } else {
      setConnectWallet(false)
      document.body.classList.add('global-loader')
      const result = await giftTransaction({
        blockchainNetwork: asset.blockchainNetwork,
        walletAccountStore,
        connectedAccount: account,
        setLoading: setLoading,
        assetDetails: asset,
        receiverAddress: receiverAddress,
        dispatch
      })
      if (result && result.status) {
        document.body.classList.remove('global-loader')
        const payload = {
          assetId: asset.id,
          blockchainNetwork: asset.blockchainNetwork,
          toWalletAddress: receiverAddress,
          email: receiverEmail,
          blockchainNetworkResponse: result,
          firstName,
          lastName,
          state,
          city,
          pinCode,
          streetName,
          houseNumber
        }
        dispatch(giftCreation(payload))
      }
    }
  }

  const onChangeSelectWallet = () => {
    setConnectWallet((prev) => !prev)
  }

  return (
    <section className="section-padding section-lr-m gift-assets">
      {connectWallet && <SelectWalletModal blockchainNetwork={asset.blockchainNetwork} show={connectWallet} onCloseSelectWallet={onChangeSelectWallet} />}
      {showGiftConfirmation && (
        <ConfirmationModal
          show={showGiftConfirmation}
          handleConfirmation={handleConfirmation}
          handleClose={toggleConfirmationModal}
          loading={loading}
          title={'Gift Confirmation'}
          description={'Are you sure to transfer the asset?'}
        />
      )}
      <Container>
        <Form onSubmit={handleSubmit(areYouSure)}>
          <Row>
            <div className="back-arrow-box">
              <button type="button" onClick={() => navigate(-1)} className="back-btn d-flex justify-content-center align-items-center btn btn-primary">
                <img src={arrowBackIcon} alt="arrowBackIcon" className="img-fluid" />
              </button>
              <h4 className="arrow-heading">Gift Asset</h4>
            </div>
            <Col lg={6} md={6}>
              <div className="gits-assets">
                <h4>{asset?.name}</h4>
                <div className="asset-owner-artist d-flex flex-wrap py-4">
                  {asset?.currentOwnerId && (
                    <UserInfo
                      profileImage={asset?.currentOwner?.profilePicUrl}
                      name={asset?.currentOwner?.userName || asset?.owner?.userName}
                      isOwner
                      link={allRoutes.creatorCollected(asset?.asset?.currentOwnerId)}
                    />
                  )}
                  <UserInfo
                    profileImage={asset?.creator?.profilePicUrl}
                    name={asset?.creator?.userName}
                    isArtist
                    link={allRoutes.creatorCollected(asset?.creator?.id)}
                  />
                </div>
                <div className="gits-assets-content">
                  <h3>Description</h3>
                  <p>
                    {asset?.description}
                  </p>
                </div>
                <div className="upload-buttons">
                  <Button
                    className="white-btn"
                    onClick={onChangeSelectWallet}
                  >
                    Connect Wallet
                  </Button>
                </div>
                <div className="gits-assets-email">
                  {/* <Form.Group className="form-group">
                  <Form.Label>Customer Role</Form.Label>
                  <br />
                </Form.Group> */}
                  <WalletAddressField name="receiverAddress" errors={errors} register={register} setValue={setValue} clearErrors={clearErrors} label={'Enter wallet address of the person you want to gift this NFT to'} setValueFromWalletStore={false} />

                  <Form.Group className="form-group">
                    <Form.Label>
                      Enter email of the person you want to gift this NFT to
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="receiverEmail"
                      placeholder="Enter valid email"
                      className={errors.receiverEmail && 'error'}
                      {...register('receiverEmail', {
                        pattern: {
                          value: EMAIL,
                          message: validationErrors.email
                        },
                        validate: (value) => setValue('receiverEmail', value.toLowerCase())
                      })}
                    />
                    {errors.receiverEmail && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.receiverEmail.message}
                      </Form.Control.Feedback>
                    )}
                    <Form.Text>(Please enter email of the user if the person is available in the app.)</Form.Text>
                  </Form.Group>
                  <Form.Group className="form-group">
                    <Form.Label>
                      <FormattedMessage id="blockchainNetwork" />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={asset?.blockchainNetwork}
                      disabled
                    />
                  </Form.Group>
                  {asset?.isPhysical &&
                    <>
                      <div className="address-title">
                        <h4 className="title text-capitalize">
                          <FormattedMessage id="addYourAddress" />
                        </h4>
                        <p>
                          <FormattedMessage id="enterYourAddressToProceedToPayment" />
                        </p>
                      </div>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>
                              <FormattedMessage id="firstName" />*
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              className={errors.firstName && 'error'}
                              placeholder={labels.firstName}
                              {...register('firstName', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.firstName && (
                              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                                {errors.firstName.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>
                              <FormattedMessage id="lastName" />*
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              placeholder={labels.lastName}
                              className={errors.lastName && 'error'}
                              {...register('lastName', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.lastName && (
                              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                                {errors.lastName.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>
                              <FormattedMessage id="houseNumber" />*
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="houseNumber"
                              placeholder={labels.houseNumber}
                              className={errors.houseNumber && 'error'}
                              {...register('houseNumber', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.houseNumber && (
                              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                                {errors.houseNumber.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>
                              <FormattedMessage id="streetName" />*
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="streetName"
                              className={errors.streetName && 'error'}
                              placeholder={labels.streetName}
                              {...register('streetName', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.streetName && (
                              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                                {errors.streetName.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>
                              <FormattedMessage id="city" />*
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              className={errors.city && 'error'}
                              placeholder={labels.city}
                              {...register('city', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.city && (
                              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                                {errors.city.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="form-group">
                            <Form.Label>
                              <FormattedMessage id="state/province" />*
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              className={errors.state && 'error'}
                              placeholder={labels.state}
                              {...register('state', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.state && (
                              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                                {errors.state.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="form-group">
                            <Form.Label>
                              <FormattedMessage id="country" />*
                            </Form.Label>
                            <Controller
                              name="country"
                              control={control}
                              rules={{ required: validationErrors.required }}
                              render={({ field: { onChange, value = [] } }) => (
                                <Select
                                  value={value}
                                  className={`react-select ${errors.country && 'error'}`}
                                  classNamePrefix="select"
                                  options={countries}
                                  onChange={(e) => {
                                    onChange(e)
                                  }}
                                />
                              )}
                            />
                            {errors.country && (
                              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                                {errors.country.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="form-group">
                            <Form.Label>
                              <FormattedMessage id="postcode/zipCode" />*
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="pinCode"
                              className={errors.pinCode && 'error'}
                              placeholder={labels.pinCode}
                              {...register('pinCode', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.pinCode && (
                              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                                {errors.pinCode.message}
                              </Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Phone control={control} name="phone" required={true} errors={errors} />
                        </Col>
                      </Row>

                    </>
                  }
                </div>

              </div>
            </Col>
            <Col lg={6} md={6}>
              <div className="gift-assets-img">
                <div className="upload-box">
                  <div className="uploaded-file">
                    {asset?.fileType && asset?.awsUrl && (
                      <div className="uploaded-file">
                        {['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(asset?.fileType) ? (
                          <img className="img" src={asset.awsUrl} alt="asset img" />
                        ) : ['glb', 'gltf'].includes(asset?.fileType) ? (
                          <GlbViewer artwork={asset.awsUrl} ignoreThumbnail showThumbnail={false} />
                        ) : ['zip'].includes(asset?.fileType) ? (
                          <div className="d-flex flex-column justify-content-center align-items-center h-100">
                            <FileZipIcon />
                          </div>
                        ) : (
                          <ReactPlayer
                            config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                            url={[asset.awsUrl]}
                            controls
                            width="100%"
                            height="100%" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {asset?.thumbnailAwsUrl &&
                  <div className="thumb-row">
                    <img src={asset?.thumbnailAwsUrl} alt="asset-thumbnail" />
                  </div>
                }
                <div className="upload-buttons">
                  <button onClick={() => navigate(-1)} type="button" className="white-border-btn">Cancel</button>
                  <Button className="white-btn" type="submit">
                    Continue
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </section >
  )
}

export default GiftAsset
