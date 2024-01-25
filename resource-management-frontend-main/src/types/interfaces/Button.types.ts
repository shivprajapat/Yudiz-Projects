import React from "react"
import { IProps } from "types/types"

export interface IButtonProps {
    fullWidth?: boolean,
    loading?: boolean;
    children?: React.ReactNode,
    className?: string,
    startIcon?: React.ReactNode,
    cancel?:boolean,
    onClick?: () => void, 
    props?:IProps
}