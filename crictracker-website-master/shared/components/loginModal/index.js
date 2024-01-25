import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Row, Col } from 'react-bootstrap'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'
import { allRoutes } from '@shared/constants/allRoutes'
import CustomLink from '../customLink'

const LoginModal = (props) => {
  const { t } = useTranslation()
  return (
    <Modal show={props.isConfirm} onHide={props.closeConfirm} centered className="modal-small">
      <Modal.Body className={`${styles.modalBody} text-center mx-auto mt-3`}>
        <h3 className="small-head text-uppercase text-primary mb-2">{t('common:LoginContinue')}</h3>
        <p className="text-secondary mb-4">{t('common:LoginMessage')}</p>
        <div className={styles.submitBlock}>
          <Row className="justify-content-center mb-3">
            <Col xs={6}>
              <CustomLink href={allRoutes.signIn} prefetch={false}>
                <a className="theme-btn w-100">
                  {t('common:Login')}
                </a>
              </CustomLink>
            </Col>
            <Col xs={6}>
              <Button variant="link" className="theme-btn outline-btn outline-light w-100" onClick={props.closeConfirm}>
                {t('common:Cancel')}
              </Button>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  )
}
LoginModal.propTypes = {
  isConfirm: PropTypes.bool,
  closeConfirm: PropTypes.func
}

export default LoginModal
