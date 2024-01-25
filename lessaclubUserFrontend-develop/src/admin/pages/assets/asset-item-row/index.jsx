import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { FaRegEye } from 'react-icons/fa'

import { allRoutes } from 'shared/constants/allRoutes'
import { Button, Form } from 'react-bootstrap'
import { toggleAssetApproval, adminBlockUnblockAsset } from 'admin/modules/assetManagement/redux/service'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { AssetRejectModal } from '../asset-reject-modal'
import ConfirmationModal from 'shared/components/confirmation-modal'

function AssetItemRow({ asset }) {
  const dispatch = useDispatch()
  const [isApproveSuccessState, setIsApproveSuccessState] = useState(false)
  const [isRejectSuccess, setIsRejectSuccess] = useState(false)
  const [showRejectMessageModal, setShowRejectMessageModal] = useState(false)
  const [isCheckBoxOn, setIsCheckBoxOn] = useState(asset.isActive)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [checkBoxTarget, setCheckBoxTarget] = useState(null)

  const blockedUnblockedAsset = useSelector((state) => state.adminAssetManagement.asset)

  const confirmationTitle = `Asset ${isCheckBoxOn ? 'Block' : 'Unblock'} Confirmation`
  const confirmationDescription = `Are you sure to ${isCheckBoxOn ? 'Block' : 'Unblock'} the asset?`
  const approve = 'APPROVE'
  const reject = 'REJECT'
  const isExclusiveAssetInitiallyCreated = asset?.isExclusive && asset?.isApproved === null

  const approveBtnHandler = async (approveState, description) => {
    const isApproval = approveState === approve
    const response = await dispatch(toggleAssetApproval({ assetId: asset.id, isApproval, reason: description }))
    const isApprovalSuccess = response?.status === 200
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: isApprovalSuccess ? isApproval ? 'Exclusive asset got approved' : 'Exclusive asset got rejected' : 'Sorry, Something went wrong',
        type: isApprovalSuccess ? TOAST_TYPE.Success : TOAST_TYPE.Error
      }
    })

    if (isApprovalSuccess && isApproval) {
      setIsApproveSuccessState(true)
      setIsRejectSuccess(false)
    }
    if (isApprovalSuccess && !isApproval) {
      setIsRejectSuccess(true)
      setIsApproveSuccessState(false)
    }
  }

  const rejectOnClickHandler = () => {
    setShowRejectMessageModal(true)
  }

  const handleStatusChange = (target) => {
    dispatch(adminBlockUnblockAsset(target.id, { isActive: !target.checked }))
    setIsConfirmOpen(false)
  }

  const handleCheckBoxStatusChange = ({ target }) => {
    setIsConfirmOpen(!isConfirmOpen)
    setCheckBoxTarget(target)
  }

  const handleConfirmation = () => {
    handleStatusChange(checkBoxTarget)
  }

  const handleClose = () => {
    setIsConfirmOpen(false)
  }

  useEffect(() => {
    if (blockedUnblockedAsset?.asset?.id === asset.id) {
      setIsCheckBoxOn(blockedUnblockedAsset.asset.isActive)
    }
  }, [blockedUnblockedAsset])

  return (
    <>
         <ConfirmationModal
        show={isConfirmOpen}
        handleConfirmation={handleConfirmation}
        handleClose={handleClose}
        title={confirmationTitle}
        description={confirmationDescription}
      />
      {showRejectMessageModal && (
        <AssetRejectModal
          show={true}
          setShowRejectMessageModal={setShowRejectMessageModal}
          approveBtnHandler={approveBtnHandler}
          reject={reject}
        />
      )}
      <tr key={asset.id}>
        <td>
          <span className="admin-asset-name">{asset.name}</span>
        </td>
        <td>{asset?.blockchainNetwork || '-'}</td>
        <td>{asset?.fileType || '-'}</td>
        <td>{asset?.isPhysical ? 'physical asset' : 'digital asset'}</td>
        <td>
          {isExclusiveAssetInitiallyCreated && !isApproveSuccessState && !isRejectSuccess && (
            <>
              <Button className="bg-light text-dark approve-btn" onClick={() => approveBtnHandler(approve)}>
                {approve}
              </Button>
              <Button className="bg-danger text-light approve-btn" onClick={rejectOnClickHandler}>
                {reject}
              </Button>
            </>
          )}
        </td>
        <td>
          <Form.Check
            className="admin-switch d-inline-block"
            type="switch"
            id={asset.id}
            checked={isCheckBoxOn}
            onChange={handleCheckBoxStatusChange}
          />
          <a target="_blank" rel="noreferrer" href={`${window.location.origin}${allRoutes.adminAssetDetails('admin', asset?.id)}?basic`}>
            <FaRegEye />
          </a>
        </td>
      </tr>
    </>
  )
}
AssetItemRow.propTypes = {
  asset: PropTypes.object
}

export default AssetItemRow
