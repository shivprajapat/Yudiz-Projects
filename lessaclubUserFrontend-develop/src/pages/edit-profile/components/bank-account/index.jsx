import React, { useEffect } from 'react'
import { Form, Row, Col, Button, ToggleButton } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { bankAccountTypeOptions } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import countries from 'shared/data/countries'

const BankAccount = ({ handleStepSubmit, defaultValues, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control
  } = useForm({
    mode: 'all'
  })
  const bankAccountType = watch('decryptedBankDetails.isIban') || 'withIban'

  useEffect(() => {
    if (defaultValues) {
      console.log(defaultValues)
      reset({
        decryptedBankDetails: {
          billingDetails: {
            firstName: defaultValues?.decryptedBankDetails?.billingDetails?.firstName,
            lastName: defaultValues?.decryptedBankDetails?.billingDetails?.lastName,
            city: defaultValues?.decryptedBankDetails?.billingDetails?.city,
            country: (() => {
              if (defaultValues?.decryptedBankDetails?.billingDetails?.country) {
                return countries.filter(
                  (singleCountry) => singleCountry.value === defaultValues?.decryptedBankDetails?.billingDetails?.country
                )[0]
              } else {
                return []
              }
            })(),
            line1: defaultValues?.decryptedBankDetails?.billingDetails?.line1,
            district: defaultValues?.decryptedBankDetails?.billingDetails?.district,
            postalCode: defaultValues?.decryptedBankDetails?.billingDetails?.postalCode
          },
          bankAddress: {
            bankName: defaultValues?.decryptedBankDetails?.bankAddress?.bankName,
            city: defaultValues?.decryptedBankDetails?.bankAddress?.city,
            country: (() => {
              if (defaultValues?.decryptedBankDetails?.bankAddress?.country) {
                return countries.filter(
                  (singleCountry) => singleCountry.value === defaultValues?.decryptedBankDetails?.bankAddress?.country
                )[0]
              } else {
                return []
              }
            })(),
            district: defaultValues?.decryptedBankDetails?.bankAddress?.district,
            line1: defaultValues?.decryptedBankDetails?.bankAddress?.line1
          },
          accountNumber: defaultValues?.decryptedBankDetails?.accountNumber,
          routingNumber: defaultValues?.decryptedBankDetails?.routingNumber,
          iban: defaultValues?.decryptedBankDetails?.iban,
          isIban: defaultValues?.decryptedBankDetails?.isIban ? 'withIban' : 'withoutIban'
        }
      })
    }
  }, [defaultValues])

  const billingDetailsCountry = watch('decryptedBankDetails.billingDetails.country')
  const bankDetailsCountry = watch('decryptedBankDetails.bankAddress.country')

  const isBillingDetailsDistrictRequired = ['US', 'CA'].includes(billingDetailsCountry?.value)
  const isbankAddressDistrictRequired = ['US', 'CA'].includes(bankDetailsCountry?.value)

  return (
    <section>
      <Form onSubmit={handleSubmit((data) => handleStepSubmit('bankAccountInfo', data))} autoComplete="off">
        <h3 className="form-heading mt-5">Account</h3>
        <div className="list-nft-inner d-flex mb-5">
          {bankAccountTypeOptions.map((type, index) => (
            <div className="list-nft-btns" key={index}>
              <Controller
                name="decryptedBankDetails.isIban"
                control={control}
                render={({ field: { onChange, value = [] } }) => (
                  <ToggleButton
                    className="normal-btn"
                    key={index}
                    id={`bank-type-${index}`}
                    type="radio"
                    name="decryptedBankDetails.isIban"
                    value={type.value}
                    checked={bankAccountType === type.value}
                    onChange={(e) => {
                      onChange(e)
                    }}
                  >
                    {type.name}
                  </ToggleButton>
                )}
              />
            </div>
          ))}
        </div>
        {bankAccountType === 'withIban' && (
          <Form.Group className="form-group">
            <Form.Label>IBAN*</Form.Label>
            <Form.Control
              name="decryptedBankDetails.iban"
              placeholder="Enter IBAN"
              className={errors?.decryptedBankDetails?.iban && 'error'}
              {...register('decryptedBankDetails.iban', {
                required: validationErrors.required
              })}
            />
            {errors?.decryptedBankDetails?.iban && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors.decryptedBankDetails.iban.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        )}

        {bankAccountType === 'withoutIban' && (
          <>
            <Form.Group className="form-group">
              <Form.Label>Account Number*</Form.Label>
              <Form.Control
                type="text"
                name="decryptedBankDetails.accountNumber"
                className={errors?.decryptedBankDetails?.accountNumber && 'error'}
                placeholder="Enter Account Name"
                {...register('decryptedBankDetails.accountNumber', {
                  required: validationErrors.required
                })}
              />
              {errors?.decryptedBankDetails?.accountNumber && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.decryptedBankDetails.accountNumber.message}
                </Form.Control.Feedback>
              )}
              <Form.Control.Feedback type="info" className="info">
                Sandbox value enter 123456789
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>Routing Number*</Form.Label>
              <Form.Control
                type="text"
                name="decryptedBankDetails.routingNumber"
                className={errors?.decryptedBankDetails?.routingNumber && 'error'}
                placeholder="Enter Routing Name"
                {...register('decryptedBankDetails.routingNumber', {
                  required: validationErrors.required
                })}
              />
              {errors?.decryptedBankDetails?.routingNumber && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.decryptedBankDetails.routingNumber.message}
                </Form.Control.Feedback>
              )}
              <Form.Control.Feedback type="info" className="info">
                Sandbox value enter 021000021
              </Form.Control.Feedback>
            </Form.Group>
          </>
        )}

        <h3 className="form-heading mt-5">User Details</h3>

        <Row>
          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>First Name*</Form.Label>
            <Form.Control
              type="text"
              name="decryptedBankDetails?.billingDetails?.firstName"
              className={errors?.decryptedBankDetails?.billingDetails?.firstName && 'error'}
              placeholder="Enter First Name"
              {...register('decryptedBankDetails.billingDetails.firstName', {
                required: validationErrors.required
              })}
            />
            {errors?.decryptedBankDetails?.billingDetails?.firstName && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors?.decryptedBankDetails?.billingDetails?.firstName?.message}
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback type="info" className="info">
              Sandbox value enter Satoshi
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>Last Name*</Form.Label>
            <Form.Control
              type="text"
              name="decryptedBankDetails.billingDetails.lastName"
              className={errors?.decryptedBankDetails?.billingDetails?.lastName && 'error'}
              placeholder="Enter Last Name"
              {...register('decryptedBankDetails.billingDetails.lastName', {
                required: validationErrors.required
              })}
            />
            {errors?.decryptedBankDetails?.billingDetails?.lastName && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors?.decryptedBankDetails?.billingDetails?.lastName?.message}
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback type="info" className="info">
              Sandbox value enter Nakamoto
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row>
          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>Country*</Form.Label>
            <Controller
              name="decryptedBankDetails.billingDetails.country"
              control={control}
              rules={{ required: validationErrors.required }}
              render={({ field: { onChange, value = [] } }) => (
                <Select
                  value={value}
                  className={`react-select ${errors?.decryptedBankDetails?.billingDetails?.country && 'error'}`}
                  classNamePrefix="select"
                  options={countries}
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )}
            />
            {errors?.decryptedBankDetails?.billingDetails?.country && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors?.decryptedBankDetails?.billingDetails?.country?.message}
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback type="info" className="info">
              Sandbox value enter United States
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>Postcode*</Form.Label>
            <Form.Control
              type="text"
              name="decryptedBankDetails.billingDetails.postalCode"
              className={errors?.decryptedBankDetails?.billingDetails?.postalCode && 'error'}
              placeholder="Enter Postcode/Zip Code"
              {...register('decryptedBankDetails.billingDetails.postalCode', {
                required: validationErrors.required
              })}
            />
            {errors?.decryptedBankDetails?.billingDetails?.postalCode && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors?.decryptedBankDetails?.billingDetails?.postalCode?.message}
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback type="info" className="info">
              Sandbox value enter 01234
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Form.Group className="form-group">
          <Form.Label>City*</Form.Label>
          <Form.Control
            type="text"
            name="decryptedBankDetails.billingDetails.city"
            className={errors?.decryptedBankDetails?.billingDetails?.city && 'error'}
            placeholder="Enter City"
            {...register('decryptedBankDetails.billingDetails.city', {
              required: validationErrors.required
            })}
          />
          {errors?.decryptedBankDetails?.billingDetails?.city && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.decryptedBankDetails?.billingDetails?.city?.message}
            </Form.Control.Feedback>
          )}
          <Form.Control.Feedback type="info" className="info">
            Sandbox value enter Boston
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>Address Line 1*</Form.Label>
          <Form.Control
            type="text"
            name="decryptedBankDetails.billingDetails.line1"
            placeholder="Enter Address Line 1"
            {...register('decryptedBankDetails.billingDetails.line1', {
              required: validationErrors.required
            })}
          />
          {errors?.decryptedBankDetails?.billingDetails?.line1 && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.decryptedBankDetails?.billingDetails?.line1.message}
            </Form.Control.Feedback>
          )}
          <Form.Control.Feedback type="info" className="info">
            Sandbox value enter 100 Money Street
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>District {isBillingDetailsDistrictRequired && '*'}</Form.Label>
          <Form.Control
            type="text"
            name="decryptedBankDetails.billingDetails.district"
            maxLength={isBillingDetailsDistrictRequired ? 2 : 5}
            placeholder="Enter District"
            {...register('decryptedBankDetails.billingDetails.district', {
              required: isBillingDetailsDistrictRequired ? validationErrors.required : false
            })}
          />
          {errors?.decryptedBankDetails?.billingDetails?.district && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.decryptedBankDetails?.billingDetails?.district.message}
            </Form.Control.Feedback>
          )}
          <Form.Control.Feedback type="info" className="info">
            Sandbox value enter MA
          </Form.Control.Feedback>
        </Form.Group>

        <h3 className="form-heading">Bank Address</h3>

        <Row>
          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>Bank Name*</Form.Label>
            <Form.Control
              type="text"
              name="decryptedBankDetails.bankAddress.bankName"
              className={errors.bankName && 'error'}
              placeholder="Enter  Bank Name"
              {...register('decryptedBankDetails.bankAddress.bankName', {
                required: validationErrors.required
              })}
            />
            {errors?.decryptedBankDetails?.bankAddress?.bankName && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors?.decryptedBankDetails?.bankAddress?.bankName.message}
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback type="info" className="info">
              Sandbox value enter SAN FRANCISCO
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="form-group" as={Col} lg="6">
            <Form.Label>City*</Form.Label>
            <Form.Control
              type="text"
              name="decryptedBankDetails.bankAddress.city"
              className={errors?.decryptedBankDetails?.bankAddress?.city && 'error'}
              placeholder="Enter Bank City"
              {...register('decryptedBankDetails.bankAddress.city', {
                required: validationErrors.required
              })}
            />
            {errors?.decryptedBankDetails?.bankAddress?.city && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors?.decryptedBankDetails?.bankAddress?.city?.message}
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback type="info" className="info">
              Sandbox value enter SAN FRANCISCO
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row>
          <Form.Group className="form-group">
            <Form.Label>Country*</Form.Label>
            <Controller
              name="decryptedBankDetails.bankAddress.country"
              control={control}
              rules={{ required: validationErrors.required }}
              render={({ field: { onChange, value = [] } }) => (
                <Select
                  value={value}
                  className={`react-select ${errors?.decryptedBankDetails?.bankAddress?.country && 'error'}`}
                  classNamePrefix="select"
                  options={countries}
                  onChange={(e) => {
                    onChange(e)
                  }}
                />
              )}
            />
            {errors?.decryptedBankDetails?.bankAddress?.country && (
              <Form.Control.Feedback type="invalid" className="invalidFeedback">
                {errors?.decryptedBankDetails?.bankAddress?.country?.message}
              </Form.Control.Feedback>
            )}
            <Form.Control.Feedback type="info" className="info">
              Sandbox value enter United States
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Form.Group className="form-group">
          <Form.Label>Address Line 1*</Form.Label>
          <Form.Control
            type="text"
            name="decryptedBankDetails.bankAddress.line1"
            placeholder="Enter Account Address Line 1"
            {...register('decryptedBankDetails.bankAddress.line1', {
              required: validationErrors.required
            })}
          />
          {errors?.decryptedBankDetails?.bankAddress?.line1 && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.decryptedBankDetails?.bankAddress?.line1?.message}
            </Form.Control.Feedback>
          )}
          <Form.Control.Feedback type="info" className="info">
            Sandbox value enter 100 Money Street
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>District {isbankAddressDistrictRequired && '*'}</Form.Label>
          <Form.Control
            type="text"
            name="decryptedBankDetails.bankAddress.district"
            maxLength={isbankAddressDistrictRequired ? 2 : 5}
            placeholder="Enter District"
            {...register('decryptedBankDetails.bankAddress.district', {
              required: isbankAddressDistrictRequired ? validationErrors.required : false
            })}
          />
          {errors?.decryptedBankDetails?.bankAddress?.district && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.decryptedBankDetails?.bankAddress?.district.message}
            </Form.Control.Feedback>
          )}
          <Form.Control.Feedback type="info" className="info">
            Sandbox value enter CA
          </Form.Control.Feedback>
        </Form.Group>

        {/* TODO: hide for now */}

        {/* <Form.Group className="form-group">
          <Form.Label>District{isDecryptedBankDetailsDistrictRequired && '*'}</Form.Label>
          <Form.Control
            type="text"
            name="district"
            placeholder="Enter District"
            maxLength={isDecryptedBankDetailsDistrictRequired ? 2 : 5}
            {...register('decryptedBankDetails.bankAddress.district', {
              required: isDecryptedBankDetailsDistrictRequired ? validationErrors.required : false
            })}
          />
          {errors?.decryptedBankDetails?.bankAddress?.district && (
            <Form.Control.Feedback type="invalid" className="invalidFeedback">
              {errors?.decryptedBankDetails?.bankAddress?.district?.message}
            </Form.Control.Feedback>
          )}
        </Form.Group> */}

        <div className="form-footer">
          <Row>
            <Col md={6}>
              <Button className="white-btn" type="submit" disabled={loading}>
                Save Update
              </Button>
            </Col>
          </Row>
        </div>
      </Form>
    </section>
  )
}
BankAccount.propTypes = {
  handleStepSubmit: PropTypes.func,
  defaultValues: PropTypes.object,
  loading: PropTypes.bool
}
export default BankAccount
