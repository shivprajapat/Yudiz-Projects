import React from "react"

export interface AlertModalProps {
    open?: boolean,
    title?: string,
    children?: React.ReactNode,
    handleClose?: () => void,
    handleCancel?: () => void
}