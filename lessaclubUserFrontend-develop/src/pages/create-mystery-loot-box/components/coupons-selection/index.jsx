import React from 'react'
import { useFieldArray } from 'react-hook-form'
import PropTypes from 'prop-types'

import Coupon from '../coupon'

const CouponSelection = ({ errors, control, register, couponKey, watch, validateCoupon, couponStatus }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'coupons'
  })

  return (
    <div className="coupon-selection">
      <h3 className="form-heading">Add Coupons</h3>

      {fields.map((field, index) => (
        <Coupon
          key={field.id}
          errors={errors}
          register={register}
          watch={watch}
          index={index}
          fields={fields}
          handleDelete={(i) => remove(i)}
          addMore={() => append(couponKey)}
          validateCoupon={validateCoupon}
          couponStatus={couponStatus}
        />
      ))}
    </div>
  )
}
CouponSelection.propTypes = {
  errors: PropTypes.object,
  control: PropTypes.object,
  register: PropTypes.func,
  couponKey: PropTypes.object,
  watch: PropTypes.func,
  validateCoupon: PropTypes.func,
  couponStatus: PropTypes.object
}

export default CouponSelection
