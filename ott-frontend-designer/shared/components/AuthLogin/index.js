import Image from 'next/image'
import React from 'react'
import Button from '../Button'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'
import style from "./style.module.scss";
import ModalWrapper from '../ModalWrapper';
import IconLogout from '@/assets/images/jsIcon/Logout'
import { iconApple, iconArrowLeft, iconGoogle } from '@/assets/images'

const AuthLogin = ({ title, subtitle, children, onsubmit, backBtn, ...props }) => {
  const { authLogin, authLogin_heading, authLogin_button } = style;

  return (
    <Form className={authLogin} {...props} onSubmit={onsubmit}>
      <ModalWrapper Shadow space_lg>
        <div className={authLogin_heading}>
          <h2>{backBtn && <Image src={iconArrowLeft} alt="iconArrowLeft" onClick={backBtn} />} {title && title}</h2>
          <p>{subtitle && subtitle}</p>
        </div>
        {children}
        <article>
          <p>Or Login with following options</p>
          <div className={authLogin_button}>
            <Button className='facebook-btn' bgWhite BtnIcon={<IconLogout />}>Facebook</Button>
            <Button bgWhite BtnIcon={<Image src={iconGoogle} alt="iconGoogle" />}><span>Google</span></Button>
            <Button bgWhite BtnIcon={<Image src={iconApple} alt="iconApple" />}><span>Apple</span></Button>
          </div>
        </article>
      </ModalWrapper>
    </Form>
  )
}
ModalWrapper.propTypes = {
  backBtn: PropTypes.bool,
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  subtitle: PropTypes.string,
  children: PropTypes.object || PropTypes.string,
}
export default AuthLogin