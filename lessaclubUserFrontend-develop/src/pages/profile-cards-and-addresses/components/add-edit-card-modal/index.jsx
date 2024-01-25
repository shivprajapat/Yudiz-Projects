import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'

import { validationErrors } from 'shared/constants/validationErrors'
import { forceTextInputAsNumber, handleCardKeyUp } from 'shared/utils'
import { addCard, getCards } from 'modules/card/redux/service'

const AddEditCardModal = ({ show, handleClose }) => {
  const dispatch = useDispatch()
  const userId = localStorage.getItem('userId')
  const addressStore = useSelector((state) => state.address.getAddress)
  const isAddressNotPresent = addressStore.addresses.length === 0
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    getValues
  } = useForm({ mode: 'all' })

  const values = getValues()

  const onSubmit = (data) => {
    const payload = {
      card: Number(data.card.replace(/ /g, '')),
      expMonth: +data.expiryDate.getMonth() + 1,
      expYear: data.expiryDate.getFullYear(),
      cvv: Number(data.cvv)
    }
    dispatch(
      addCard(payload, () => {
        handleClose()
        dispatch(getCards({ userId: userId }))
      })
    )
  }

  return (
    <Modal show={show} centered className="add-edit-address-modal" size="lg">
      <Modal.Header>
        <Modal.Title>Add New Card</Modal.Title>
      </Modal.Header>
      <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
      { isAddressNotPresent && (<p style={{ color: 'red' }}>Please fill the address form first to get card verified</p>)}
          <Row>
            <Col lg={12} md={12}>
              <Form.Group className="form-group">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  name="card"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="XXXX XXXX XXXX XXXX"
                  className={errors.card && 'error'}
                  onKeyUp={handleCardKeyUp}
                  maxLength={19}
                  minLength={19}
                  {...register('card', {
                    required: validationErrors.required,
                    minLength: { value: 19, message: validationErrors.creditCard }
                  })}
                />
                {errors.card && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.card.message}
                  </Form.Control.Feedback>
                )}
                <Form.Control.Feedback type="info" className="info">
                  Sandbox value enter 4757140000000001
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label className="d-block">Choose Expiry Date</Form.Label>
                <Controller
                  name="expiryDate"
                  control={control}
                  rules={{ required: validationErrors.required }}
                  render={({ field: { onChange, value = '' } }) => (
                    <DatePicker
                      placeholderText="Select end date and time"
                      selected={value || values?.expiryDate}
                      minDate={new Date()}
                      className={`form-control ${errors.expiryDate && 'error'}`}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      onChange={(update) => {
                        onChange(update)
                      }}
                      // customInput={<calenderIcon />}
                    />
                  )}
                />
                {errors.expiryDate && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.expiryDate.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>CVV</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="XXX"
                  name="cvv"
                  minLength={3}
                  autoComplete="off"
                  maxLength={3}
                  className={errors.cvv && 'error'}
                  onKeyDown={(e) => forceTextInputAsNumber(e)}
                  {...register('cvv', {
                    required: validationErrors.required,
                    minLength: { value: 3, message: validationErrors.cvv }
                  })}
                />
                {errors.cvv && (
                  <Form.Control.Feedback type="invalid" className="invalidFeedback">
                    {errors.cvv.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className="white-btn" type="submit" disabled={isAddressNotPresent}>
            Add Card
          </Button>
          <Button className="white-border-btn" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
AddEditCardModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func
}
export default AddEditCardModal
