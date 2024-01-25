import React from 'react'
import './_actionButton.scss'
import { IActionButtonProps } from 'types/interfaces/ActionButton.types'

export default function ActionButton({ actionButtonText, className, setIcon, ...props }: IActionButtonProps) {
  return (
    <div className={`actionButton ${className}`} {...props}>
      <div className="px-1 pb-1 me-1">{setIcon}</div>
      <span className="pe-1">{actionButtonText}</span>
    </div>
  )
}

