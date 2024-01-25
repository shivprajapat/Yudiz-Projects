import React from "react"
import {ModalProps} from 'react-bootstrap'

export interface ICustomModalProps {
    open?: boolean,
    handleClose?: () => void,
    title?: string,
    children?: React.ReactNode,
    isLoading?: boolean,
    disableHeader?: boolean,
    className?: string,
    modalBodyClassName?: string,
    fullscreen?: ModalProps['fullscreen'],
    size?: ModalProps['size']
}