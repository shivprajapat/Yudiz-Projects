// import React from 'react'
// import { Button, Col, Form, Row, Spinner } from 'react-bootstrap'
// import { validationErrors } from 'shared/constants/validationErrors'
// import { forceTextInputAsNumber, handleCardKeyUp } from 'shared/utils'

const PaymentCardCreate = () => {
  // <Row>
  //         <Col md={12}>
  //         <Form.Group className="form-group">
  //             <Form.Label>Card Number</Form.Label>
  //             <Form.Control
  //             type="text"
  //             name="card"
  //             placeholder="XXXX XXXX XXXX XXXX"
  //             className={errors.card && 'error'}
  //             onKeyUp={handleCardKeyUp}
  //             maxLength={19}
  //             minLength={19}
  //             {...register('card', {
  //                 required: validationErrors.required,
  //                 minLength: { value: 16, message: validationErrors.creditCard }
  //             })}
  //             />
  //             {errors.card && (
  //             <Form.Control.Feedback type="invalid" className="invalidFeedback">
  //                 {errors.card.message}
  //             </Form.Control.Feedback>
  //             )}
  //         </Form.Group>
  //         </Col>
  //         <Col md={6}>
  //         <Form.Group className="form-group">
  //             <Form.Label>Expiry Date</Form.Label>
  //             <Form.Control
  //             type="text"
  //             name="exp"
  //             minLength={5}
  //             maxLength={5}
  //             placeholder="MM/YY"
  //             onKeyUp={(e) => handleCardKeyUp(e, true)}
  //             className={errors.expiryDate && 'error'}
  //             {...register('expiryDate', {
  //                 required: validationErrors.required
  //             })}
  //             />
  //             {errors.expiryDate && (
  //             <Form.Control.Feedback type="invalid" className="invalidFeedback">
  //                 {errors.expiryDate.message}
  //             </Form.Control.Feedback>
  //             )}
  //         </Form.Group>
  //         </Col>
  //         <Col md={6}>
  //         <Form.Group className="form-group">
  //             <Form.Label>CVV</Form.Label>
  //             <Form.Control
  //             type="password"
  //             placeholder="XXX"
  //             name="cvv"
  //             minLength={3}
  //             maxLength={3}
  //             className={errors.cvv && 'error'}
  //             onKeyDown={(e) => forceTextInputAsNumber(e)}
  //             {...register('cvv', {
  //                 required: validationErrors.required,
  //                 minLength: { value: 3, message: validationErrors.cvv }
  //             })}
  //             />
  //             {errors.cvv && (
  //             <Form.Control.Feedback type="invalid" className="invalidFeedback">
  //                 {errors.cvv.message}
  //             </Form.Control.Feedback>
  //             )}
  //         </Form.Group>
  //         </Col>
  //     </Row>
}

export default PaymentCardCreate
