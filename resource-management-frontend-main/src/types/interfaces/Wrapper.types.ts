import React from "react"
import { IProps } from "types/types"

export interface IWrapperProps {
    transparent?: Boolean,
    children?: React.ReactNode,
    className?: String,
    isLoading?: Boolean,
    props?:IProps
}