import React from 'react'
import './_wrapper.scss'
import { Spinner } from 'react-bootstrap'
import { IWrapperProps } from 'types/interfaces/Wrapper.types'

export default function Wrapper({ transparent, children, className, isLoading, ...props }:IWrapperProps) {
  return (
    <section className={`${className ? className : ''} wrapper_section ${transparent ? 'transparent' : ''}`} {...props}>
      {children}
      {isLoading && (
        <div className="wrapper-loader d-flex justify-content-center align-items-center w-100">
          <Spinner as="div" animation="border" variant="dark" />
        </div>
      )}
    </section>
  )
}
