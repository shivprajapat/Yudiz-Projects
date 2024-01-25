import { ReactNode } from "react"
import { IProps } from "types/types"

export interface IActionButtonProps {
    actionButtonText?: string,
    className?: string,
    setIcon?: ReactNode,
    props?:IProps
}