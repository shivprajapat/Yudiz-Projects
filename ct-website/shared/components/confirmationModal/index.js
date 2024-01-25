import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Row, Col } from 'react-bootstrap'

import styles from './style.module.scss'
import useTranslation from 'next-translate/useTranslation'

const ConfirmationModal = (props) => {
  const { t } = useTranslation()
  return (
    <Modal show={props.isConfirm} onHide={props.closeConfirm} centered className="modal-medium">
      <Modal.Body className={`${styles.modalBody} text-center mx-auto mt-2`}>
        <h3 className="small-head text-uppercase text-primary mb-1">{t('common:PleaseConfirm')}</h3>
        <p className="text-secondary mb-4">{t('common:DeleteMessage')}</p>
        <div className={styles.submitBlock}>
          <Row className="justify-content-center">
            <Col xs={5}>
              <Button className="theme-btn w-100" onClick={props.handleConfirm}>
                {t('common:Delete')}
              </Button>
            </Col>
            <Col xs={5}>
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
ConfirmationModal.propTypes = {
  isConfirm: PropTypes.bool,
  handleConfirm: PropTypes.func,
  closeConfirm: PropTypes.func
}

export default ConfirmationModal
