import React from 'react'
import PropTypes from 'prop-types'
import {   ReactComponent as AuthDesign} from "../../Assets/Images/Auth-design.svg"


const AuthForm = ({ onSubmit, title, subTitle, children, ...props }) => {
  return (
    <>
      <section className='d-flex justify-content-center align-items-center authForm_section'>
        <form className='authForm' {...props} onSubmit={onSubmit}>
          <div className='d-flex flex-column justify-content-evenly align-items-center authFormTitle'>
            {title && <h1>{title}</h1>}
            {subTitle && <h6>{subTitle}</h6>}
          </div>
          <div className='d-flex flex-column justify-content-center align-items-center'>{children}</div>
        </form>
        <div className='auth_design'> <AuthDesign/> </div>
      </section>
    </>
  )
}

AuthForm.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
}

export default AuthForm
