import React from "react"
import PropTypes from "prop-types"
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'

export default function ConfirmationModal({
    open = false,
    title = '',
    children,
    handleClose = () => { },
    handleCancel = () => { },
    handleConfirm = () => { },
    btnCancel,
    btnDelete,
    isLoading
}) {
    return (
        <CustomModal modalBodyClassName="p-0 py-2" open={open} handleClose={handleClose} title={title} isLoading={isLoading}>
            {children}
            <div className="d-flex justify-content-end">
                <div className="mt-4">
                    <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleCancel}>
                        {btnCancel || 'Cancel'}
                    </Button>
                    <Button onClick={handleConfirm}>
                        {btnDelete || 'Delete'}
                    </Button>
                </div>
            </div>
        </CustomModal>)
}

ConfirmationModal.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    handleClose: PropTypes.func,
    handleCancel: PropTypes.func,
    handleConfirm: PropTypes.func,
    children: PropTypes.node,
    btnCancel: PropTypes.string,
    btnDelete: PropTypes.string,
    isLoading: PropTypes.bool
}
