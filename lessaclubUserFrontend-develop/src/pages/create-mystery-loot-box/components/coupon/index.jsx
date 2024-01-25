import React, { useEffect } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

import { validationErrors } from 'shared/constants/validationErrors'

const Coupon = ({ errors, register, watch, index, fields, handleDelete, addMore, validateCoupon, couponStatus }) => {
  const name = watch(`coupons[${index}].name`)
  const couponCode = watch(`coupons[${index}].code`)
  const description = watch(`coupons[${index}].description`)
  const couponDescription = watch('couponsHints.description')

  useEffect(() => {
    if (name || couponCode || description) {
      const temp = {
        name: name ? null : validationErrors.required,
        code: couponCode ? null : validationErrors.required,
        description: description ? null : validationErrors.required
      }
      validateCoupon(index, temp)
    } else {
      validateCoupon(index, {
        name: null,
        code: null,
        description: null
      })
    }
  }, [name, couponCode, description])

  return (
    <div className="coupon">
      <Row>
        <Form.Group className="form-group" as={Col} lg={6}>
          <Form.Label>Name{(couponStatus[index]?.name || couponDescription) && '*'}</Form.Label>
          <Form.Control
            type="text"
            name={`coupons[${index}].name`}
            placeholder="Enter your coupon name"
            className={`${errors?.coupons?.[index]?.name && 'error'}`}
            {...register(`coupons[${index}].name`, {
              required: couponStatus[index]?.name || couponDescription ? validationErrors.required : false
            })}
          />
          {errors?.coupons?.[index]?.name && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.coupons?.[index]?.name?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="form-group" as={Col} lg={6}>
          <Form.Label>Code{(couponStatus[index]?.code || couponDescription) && '*'}</Form.Label>
          <Form.Control
            type="text"
            name={`coupons[${index}].code`}
            className={`${errors?.coupons?.[index]?.code && 'error'}`}
            placeholder="Enter your coupon code"
            {...register(`coupons[${index}].code`, {
              required: couponStatus[index]?.code || couponDescription ? validationErrors.required : false
            })}
          />
          {errors?.coupons?.[index]?.code && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.coupons?.[index]?.code?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </Row>

      <Form.Group className="form-group">
        <Form.Label>Description{(couponStatus[index]?.description || couponDescription) && '*'}</Form.Label>
        <Form.Control
          type="text"
          name={`coupons[${index}].description`}
          placeholder="Enter your coupon name"
          className={`${errors?.coupons?.[index]?.description && 'error'}`}
          {...register(`coupons[${index}].description`, {
            required: couponStatus[index]?.description || couponDescription ? validationErrors.required : false,
            maxLength: {
              value: 200,
              message: validationErrors.maxLength(200)
            }
          })}
        />
        {errors?.coupons?.[index]?.description && (
          <Form.Control.Feedback type="invalid" className="invalidFeedback">
            {errors?.coupons?.[index]?.description?.message}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="form-group">
        <Form.Label>Link</Form.Label>
        <Form.Control
          type="text"
          name={`coupons[${index}].link`}
          placeholder="Enter your coupon name"
          className={`${errors?.coupons?.[index]?.link && 'error'}`}
          {...register(`coupons[${index}].link`)}
        />
      </Form.Group>

      <div className="coupon-btns">
        <div className="coupon-btn">
          {fields?.length < 10 && index === fields.length - 1 && (
            <Button className="white-btn" onClick={() => addMore()}>
              Add More
            </Button>
          )}
        </div>
        <div className="coupon-btn">
          {fields?.length > 1 && (
            <Button className="white-btn" onClick={() => handleDelete(index)}>
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
Coupon.propTypes = {
  errors: PropTypes.object,
  register: PropTypes.func,
  watch: PropTypes.func,
  index: PropTypes.number,
  fields: PropTypes.array,
  handleDelete: PropTypes.func,
  addMore: PropTypes.func,
  validateCoupon: PropTypes.func,
  couponStatus: PropTypes.object
}
export default Coupon
