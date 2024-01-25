import React from "react"
import CustomModal from 'Components/Modal'
import Button from 'Components/Button'
import { AlertModalProps } from "types/interfaces/AlertModal.types"

function AlertModal({
    open = false,
    title = '',
    children,
    handleClose = () => { },
    handleCancel = () => { }
}: AlertModalProps) {
    return (<CustomModal modalBodyClassName="p-0 py-2" open={open} handleClose={handleClose} title={title}>
        {children}
        <div className="d-flex justify-content-end">
            <div className="mt-4">
                <Button onClick={handleCancel}>
                    OK
                </Button>
            </div>
        </div>
    </CustomModal>)
}

export default AlertModal

