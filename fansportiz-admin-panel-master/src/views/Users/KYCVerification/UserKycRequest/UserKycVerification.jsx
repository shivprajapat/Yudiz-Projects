import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, FormGroup, Input, Label, CustomInput, Button, Modal, ModalBody, ModalHeader, UncontrolledAlert } from 'reactstrap'
import profilePicture from '../../../../assets/images/profile_pic.png'
import documentPlaceholder from '../../../../assets/images/doc-placeholder.jpg'
import Loading from '../../../../components/Loading'
import rightIcon from '../../../../assets/images/right-icon.svg'
import wrongIcon from '../../../../assets/images/wrong-icon.svg'
import viewIcon from '../../../../assets/images/view-icon.svg'
import warningIcon from '../../../../assets/images/warning-icon.svg'
import { getKycUrl } from '../../../../actions/url'
import { updatePanDetails, updateAadhaarDetails, updateKYCStatus, getKycDetails, getKycInfo } from '../../../../actions/kyc'
import PropTypes from 'prop-types'
import { modalMessageFunc } from '../../../../helpers/helper'

function UserKycVerification (props) {
  const { match } = props
  const adminData = useSelector(state => state.auth.adminData)
  const permission = adminData.aPermissions && adminData.aPermissions.length !== 0 && adminData.aPermissions.filter(e => e.eKey === 'USERS')[0].eType
  const [isEditPanDetails, setEditPanDetails] = useState(false)
  const [isEditAadhaarDetails, setEditAadhaarDetails] = useState(false)
  const [isEditUserDetails] = useState(false)
  const [kycPanImgErr, setKycPanImgErr] = useState('')
  const [aadharFrontImgErr, setAadharFrontImgErr] = useState('')
  const [aadharBackImgErr, setAadharBackImgErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('')
  const [userId, setUserId] = useState('')
  const [userName, setUsername] = useState('')
  const [errReason, setErrReason] = useState('')
  const [errPanNo] = useState('')
  const [url, setUrl] = useState('')
  const [errAadhaarNo] = useState('')
  const [reason, setReason] = useState('')
  const [modal, setModal] = useState(false)
  const [panDetails, setPanDetails] = useState({})
  const [aadhaarDetails, setAadhaarDetails] = useState({})
  const [Aadhaar, setAadhaar] = useState({})
  const [statusType, setStatusType] = useState('')
  const [message, setMessage] = useState('')
  const [responseStatus, setResponseStatus] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const getKycUrlLink = useSelector(state => state.url.getKycUrl)
  const kycDetails = useSelector(state => state.kyc.kycDetails)
  const kycInfo = useSelector(state => state.kyc.kycInfo)
  const resStatus = useSelector(state => state.kyc.resStatus)
  const resMessage = useSelector(state => state.kyc.resMessage)
  const previousProps = useRef({
    resStatus, resMessage, kycDetails, kycInfo
  }).current

  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const [modalPan, setModalOpen] = useState(false)
  const togglepan = () => setModalOpen(!modalPan)
  const [modalAadhaarF, setModalAADHAARF] = useState(false)
  const toggleAadhaarF = () => setModalAADHAARF(!modalAadhaarF)
  const [modalAadhaarB, setModalAADHAARB] = useState(false)
  const toggleAadhaarB = () => setModalAADHAARB(!modalAadhaarB)

  useEffect(() => {
    if (match.params.id) {
      dispatch(getKycInfo(match.params.id, token))
      dispatch(getKycDetails(match.params.id, token))
      setUserId(match.params.id)
      setLoading(true)
    }
    if (!getKycUrlLink) {
      dispatch(getKycUrl('kyc'))
    } else {
      setUrl(getKycUrlLink)
    }
  }, [])

  useEffect(() => {
    if (!getKycUrlLink) {
      dispatch(getKycUrl('kyc'))
    } else {
      setUrl(getKycUrlLink)
    }
  }, [getKycUrlLink])

  useEffect(() => {
    if (previousProps.kycDetails !== kycDetails) {
      if (kycDetails) {
        setUsername(kycDetails.sName ? kycDetails.sName : '')
        setAadhaarDetails(kycDetails.oAadhaar)
        setPanDetails(kycDetails.oPan)
        setLoading(false)
      }
    }
    return () => {
      previousProps.kycDetails = kycDetails
    }
  }, [kycDetails])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.kycInfo !== kycInfo) {
      if (kycInfo) {
        setAadhaar(kycInfo.oAadhaar)
      }
    }
    return () => {
      previousProps.kycInfo = kycInfo
    }
  }, [kycInfo])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setLoading(true)
          dispatch(getKycDetails(userId, token))
          setMessage(resMessage)
          setResponseStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
        } else {
          setLoading(false)
          setMessage(resMessage)
          setResponseStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
        }
      }
    }
    setLoading(false)
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function handleChange (event, eType) {
    switch (eType) {
      case 'Name':
        setUsername(event.target.value)
        break
      case 'KYC_AADHAAR_NO':
        setAadhaarDetails({ ...aadhaarDetails, nNo: event.target.value })
        break
      case 'KYC_Pan_DocNo':
        setPanDetails({ ...panDetails, sNo: event.target.value })
        break
      case 'KYC_Aadhaar_front':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setAadharFrontImgErr('Please select a file less than 5MB')
        } else if (event.target.files[0].type.includes('image') && event.target.files[0].size !== 0) {
          setAadhaarDetails({ ...aadhaarDetails, sFrontImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          setEditAadhaarDetails(true)
          setAadharFrontImgErr('')
        }
        break
      case 'KYC_Aadhaar_Back':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setAadharBackImgErr('Please select a file less than 5MB')
        } else if (event.target.files[0].type.includes('image') && event.target.files[0].size !== 0) {
          setAadhaarDetails({ ...aadhaarDetails, sBackImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          setEditAadhaarDetails(true)
          setAadharBackImgErr('')
        }
        break
      case 'KYC_Pan':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setKycPanImgErr('Please select a file less than 5MB')
        } else if (event.target.files[0].type.includes('image') && event.target.files[0].size !== 0) {
          setPanDetails({ ...panDetails, sImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          setEditPanDetails(true)
          setKycPanImgErr('')
        }
        break
      case 'Reason':
        if (event.target.value.length >= 10) {
          setErrReason('')
        } else {
          setErrReason('Reason should be greater than 10 letter!')
        }
        setReason(event.target.value)
        break
      default:
        break
    }
  }

  function onEditPanDetails () {
    if (isEditPanDetails) {
      if (panDetails && panDetails.sImage !== 0) {
        dispatch(updatePanDetails(userId, panDetails.sImage, panDetails.sNo, token))
        setLoading(true)
        setEditPanDetails(false)
        setType('')
      }
    } else {
      setEditPanDetails(true)
    }
  }

  function onEditAadhaarDetails () {
    if (isEditAadhaarDetails) {
      if (aadhaarDetails && aadhaarDetails.sFrontImage && aadhaarDetails.sBackImage) {
        if (aadhaarDetails.sBackImage.imageUrl && aadhaarDetails.sFrontImage.imageUrl) {
          dispatch(updateAadhaarDetails(userId, aadhaarDetails.sFrontImage, aadhaarDetails.sBackImage, aadhaarDetails.nNo, token))
        } else if (aadhaarDetails.sBackImage.imageUrl && !aadhaarDetails.sFrontImage.imageUrl) {
          dispatch(updateAadhaarDetails(userId, Aadhaar.sFrontImage, aadhaarDetails.sBackImage, aadhaarDetails.nNo, token))
        } else if (aadhaarDetails.sFrontImage.imageUrl && !aadhaarDetails.sBackImage.imageUrl) {
          dispatch(updateAadhaarDetails(userId, aadhaarDetails.sFrontImage, Aadhaar.sBackImage, aadhaarDetails.nNo, token))
        } else {
          dispatch(updateAadhaarDetails(userId, Aadhaar.sFrontImage, Aadhaar.sBackImage, aadhaarDetails.nNo, token))
        }
        setLoading(true)
        setEditPanDetails(false)
        setType('')
      }
    } else {
      setEditAadhaarDetails(true)
    }
  }

  function onImageError (ev, Type) {
    if (Type === 'propic') {
      ev.target.src = profilePicture
    } else {
      ev.target.src = documentPlaceholder
    }
  }

  function handleModalClose () {
    setModal(false)
  }

  function onUpdateStatus () {
    const eStatus = (type === 'verify' ? 'A' : 'R')
    dispatch(updateKYCStatus(userId, eStatus, statusType, reason, token))
    setLoading(true)
    toggleWarning()
  }

  function warningWithConfirmMessage (eType, statustype) {
    const Status = (eType === 'verify' ? 'A' : 'R')
    setStatusType(statustype)
    setType(eType)
    if (Status === 'R') {
      setModal(true)
    } else {
      setModalWarning(true)
    }
  }

  function onConfirm () {
    onUpdateStatus()
    setModal(false)
    setReason('')
  }

  function alertClass () {
    if (responseStatus) {
      return `sucess-alert ${!close ? 'alert' : 'alert-close'}`
    }
    return `fail-alert ${!close ? 'alert' : 'alert-close'}`
  }

  return (
    <main className="main-content d-flex">
      {loading && <Loading />}
      {
        modalMessage && message &&
        (
          <UncontrolledAlert color="primary" className={alertClass()}>{message}</UncontrolledAlert>
        )
      }
      <section className="sidebar common-box">
        <div className="text-right">
          {permission === 'R' ? null : <Button color="link">{isEditUserDetails ? 'Save' : 'Edit'}</Button>}
        </div>
        <FormGroup>
          <Label for="userName">Username</Label>
          <Input disabled={!isEditUserDetails} type="text" id="userName" placeholder="Enter Your Username" value={userName} onChange={event => handleChange(event, 'Name')} />
        </FormGroup>
      </section>
      <section className="content-section user-edit-view">
        <Row>
          <Col lg="5">
            <div className="common-box">
              <h3>Documents</h3>
              <div className="d-flex justify-content-between align-items-start">
                <h3>PAN Card</h3>
                <Button onClick={onEditPanDetails} color="link">{isEditPanDetails ? 'Save' : 'Edit'}</Button>
              </div>
              <div className="document-list">
                <div className="item">
                  <div className="doc-photo text-center">
                    <div className="doc-img">
                      {
                        panDetails && panDetails.sImage ? <img src={panDetails.sImage.imageUrl ? panDetails.sImage.imageUrl : url + panDetails.sImage} alt="pancard" onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt="pancard" onError={ev => onImageError(ev, 'document')} />
                      }
                    </div>
                    <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser" name="customFile" label="Edit" onChange={event => handleChange(event, 'KYC_Pan')} />
                    <Button hidden={!panDetails.sImage} color="link" className="view ml-3" onClick={togglepan}> <img src={viewIcon} alt="View" /> View </Button>
                    <p className="error-text">{kycPanImgErr}</p>
                  </div>
                  <Row>
                    <Col xl={6} lg={12} md={6}>
                      <FormGroup>
                        <Label for="document1No">Pan No.</Label>
                        <Input disabled={!isEditPanDetails} type="text" id="document1No" placeholder="Enter Document No." value={panDetails && panDetails.sNo ? panDetails.sNo : ''} onChange={event => handleChange(event, 'KYC_Pan_DocNo')} />
                        <p className="error-text">{errPanNo}</p>
                      </FormGroup>
                    </Col>
                  </Row>
                  {panDetails && panDetails.eStatus === 'P'
                    ? (
                      <div>
                        <Button color="link" className="success-btn" onClick={() => warningWithConfirmMessage('verify', 'PAN')}><img src={rightIcon} alt="Approve" /><span>Approve</span></Button>
                        <Button color="link" className="danger-btn" onClick={() => warningWithConfirmMessage('reject', 'PAN')}><img src={wrongIcon} alt="Reject" /><span>Reject</span></Button>
                      </div>
                      )
                    : (
                        panDetails && panDetails.eStatus === 'A' ? <p className="success-text"> Verified </p> : (panDetails && panDetails.eStatus === 'N' ? <p> Not Added </p> : <p className="warning-text"> Rejected </p>)
                      )
                  }
                </div>
                <div className="d-flex justify-content-between align-items-start">
                  <h3>Aadhaar Details</h3>
                  <Button onClick={onEditAadhaarDetails} color="link">{isEditAadhaarDetails ? 'Save' : 'Edit'}</Button>
                </div>
                <div className="item">
                  <div className="doc-photo text-center">
                    <div className="doc-img">
                      {aadhaarDetails && aadhaarDetails.sFrontImage ? <img src={aadhaarDetails.sFrontImage.imageUrl ? aadhaarDetails.sFrontImage.imageUrl : aadhaarDetails.sFrontImage} alt="pancard" onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt="aadhaarcardFront" onError={ev => onImageError(ev, 'document')} />
                      }
                      <div className="side-label">Front</div>
                    </div>
                    <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser1" name="customFile1" label="Edit" onChange={event => handleChange(event, 'KYC_Aadhaar_front')} />
                    <Button hidden={!aadhaarDetails.sFrontImage} color="link" className="view ml-3" onClick={toggleAadhaarF}> <img src={viewIcon} alt="View" /> View </Button>
                    <p className="error-text">{aadharFrontImgErr}</p>
                  </div>
                  <div className="doc-photo text-center">
                    <div className="doc-img">
                      {aadhaarDetails && aadhaarDetails.sBackImage ? <img src={aadhaarDetails.sBackImage.imageUrl ? aadhaarDetails.sBackImage.imageUrl : aadhaarDetails.sBackImage} alt="pancard" onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt="aadhaarcardFront" onError={ev => onImageError(ev, 'document')} />
                      }
                      <div className="side-label">Back</div>
                    </div>
                    <CustomInput accept="image/png, image/jpg, image/jpeg" type="file" id="exampleCustomFileBrowser2" name="customFile2" label="Edit" onChange={event => handleChange(event, 'KYC_Aadhaar_Back')} />
                    <Button hidden={!aadhaarDetails.sBackImage} color="link" className="view ml-3" onClick={toggleAadhaarB}> <img src={viewIcon} alt="View" /> View </Button>
                    <p className="error-text">{aadharBackImgErr}</p>
                  </div>
                  <Row>
                    <Col xl={6} lg={12} md={6}>
                      <FormGroup>
                        <Label for="document2No">Aadhaar No.</Label>
                        <Input disabled={!isEditAadhaarDetails} type="text" id="document2No" placeholder="Enter Aadhaar No." value={aadhaarDetails && aadhaarDetails.nNo ? aadhaarDetails.nNo : ''} onChange={event => handleChange(event, 'KYC_AADHAAR_NO')} />
                        <p className="error-text">{errAadhaarNo}</p>
                      </FormGroup>
                    </Col>
                  </Row>
                  {aadhaarDetails
                    ? aadhaarDetails.eStatus === 'P'
                      ? (
                      <div>
                        <Button color="link" className="success-btn" onClick={() => warningWithConfirmMessage('verify', 'AADHAAR')}><img src={rightIcon} alt="Approve" /><span>Approve</span></Button>
                        <Button color="link" className="danger-btn" onClick={() => warningWithConfirmMessage('reject', 'AADHAAR')}><img src={wrongIcon} alt="Reject" /><span>Reject</span></Button>
                      </div>
                        )
                      : (
                          aadhaarDetails.eStatus === 'A' ? <p className="success-text"> Verified </p> : (aadhaarDetails.eStatus === 'N' ? <p> Not Added </p> : <p className="warning-text"> Rejected </p>)
                        )
                    : null}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>
      <Modal isOpen={modalPan} toggle={togglepan} className="modal-reject">
        <ModalBody className="text-center">
          <div className="doc-img2">
            {
              panDetails && panDetails.sImage ? <img src={panDetails.sImage && panDetails.sImage.imageUrl ? panDetails.sImage.imageUrl : panDetails.sImage} alt="pancard" onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt="pancard" onError={ev => onImageError(ev, 'document')} />
            }
          </div>
          <Button className="mt-5" color="secondary" onClick={togglepan}>Cancel</Button>
        </ModalBody>
      </Modal>
      <Modal isOpen={modalAadhaarF} toggle={toggleAadhaarF} className="modal-reject">
        <ModalBody className="text-center">
          <div className="doc-img2">
            {
              aadhaarDetails && aadhaarDetails.sFrontImage ? <img src={aadhaarDetails.sFrontImage && aadhaarDetails.sFrontImage.imageUrl ? aadhaarDetails.sFrontImage.imageUrl : aadhaarDetails.sFrontImage} alt="pancard" onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt="aadhaarcardFront" onError={ev => onImageError(ev, 'document')} />
            }
          </div>
          <Button className="mt-5" color="secondary" onClick={toggleAadhaarF}>Cancel</Button>
        </ModalBody>
      </Modal>
      <Modal isOpen={modalAadhaarB} toggle={toggleAadhaarB} className="modal-reject">
        <ModalBody className="text-center">
          <div className="doc-img2">
            {
              aadhaarDetails && aadhaarDetails.sBackImage ? <img src={aadhaarDetails.sBackImage && aadhaarDetails.sBackImage.imageUrl ? aadhaarDetails.sBackImage.imageUrl : aadhaarDetails.sBackImage} alt="pancard" onError={ev => onImageError(ev, 'document')} /> : <img src={documentPlaceholder} alt="aadhaarcardFront" onError={ev => onImageError(ev, 'document')} />
            }
          </div>
          <Button className="mt-5" color="secondary" onClick={toggleAadhaarB}>Cancel</Button>
        </ModalBody>
      </Modal>
      <Modal isOpen={modal} toggle={handleModalClose} className="modal-reject" >
        <ModalHeader toggle={handleModalClose}></ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="rejectReason">Reason for Reject</Label>
            <Input type="textarea" name="rejectReason" id="rejectReason" placeholder="Describe Your Reason for Reject" value={reason} onChange={event => handleChange(event, 'Reason')} />
            <p className="error-text">{errReason}</p>
          </FormGroup>
          <Button type="submit" className="theme-btn full-btn" onClick={onConfirm}>SEND</Button>
        </ModalBody>
      </Modal>
      <Modal isOpen={modalWarning} toggle={toggleWarning} className="modal-confirm">
        <ModalBody className="text-center">
          <img className="info-icon" src={warningIcon} alt="check" />
          <h2>{`Are you sure you want to ${type} it?`}</h2>
          <Row className="row-12">
            <Col>
              <Button type="submit" className="theme-btn outline-btn full-btn" onClick={toggleWarning}>Cancel</Button>
            </Col>
            <Col>
              <Button type="submit" className="theme-btn danger-btn full-btn" onClick={onUpdateStatus}>{`Yes, ${type} it`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </main>
  )
}

UserKycVerification.propTypes = {
  match: PropTypes.object
}

export default UserKycVerification
