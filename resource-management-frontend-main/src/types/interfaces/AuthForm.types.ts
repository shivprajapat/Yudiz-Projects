import React from "react"
import { IProps } from "types/types"

export interface IAuthFormProps {
    onSubmit?: React.FormEventHandler<HTMLFormElement>,
    title?: string,
    subTitle?: string,
    children?: React.ReactNode,
    props?: IProps
}