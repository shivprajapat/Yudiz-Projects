import React, { useEffect } from 'react'
import { Col, Form, Row, ToggleButton } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { getCategories } from 'modules/category/redux/service'
import { artworkTypeOptions, blockchainNetworkOptions } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'

const StepOne = ({ register, errors, watch, values, hidden, control, setValue, category }) => {
  const { type } = useParams()
  const dispatch = useDispatch()

  const isDrop = watch('isDropNeeded')
  const artworkHiddenType = watch('artworkHiddenType')
  const saleStartTime = watch('saleStartTime')

  const labels = {
    artName: useIntl().formatMessage({ id: 'enterYourArtName' }),
    description: useIntl().formatMessage({ id: 'enterTheProductDescription' }),
    category: useIntl().formatMessage({ id: 'enterCategory' }),
    blockchain: useIntl().formatMessage({ id: 'selectBlockchain' })
  }

  useEffect(() => {
    dispatch(getCategories({ page: 1, perPage: 100 }))
  }, [])

  useEffect(() => {
    if (artworkHiddenType === 'auction' && !type) {
      setValue('blockchainNetwork', [])
    }
  }, [artworkHiddenType])

  return (
    <>
      <Form hidden={hidden} className="step-one" autoComplete="off" id="stepOneForm">
        <Row>
          <Col md={12}>
            <div className="list-nft-que">
              <span className="d-block">
                <FormattedMessage id="howDoYouWantToListYourNft" />
              </span>
              <div className="list-nft-inner d-flex">
                {artworkTypeOptions.map((type, index) => (
                  <div className="list-nft-btns" key={index}>
                    <Controller
                      name="artworkHiddenType"
                      control={control}
                      render={({ field: { onChange, value = [] } }) => (
                        <ToggleButton
                          className="normal-btn"
                          key={index}
                          id={`artwork-type-${index}`}
                          type="radio"
                          name="artworkHiddenType"
                          value={type.value}
                          checked={artworkHiddenType === type.value}
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
            </div>

            <div className="switch-desc first-switch-desc">
              <Form.Check
                type="checkbox"
                {...register('isPhysical')}
                name="isPhysical"
                defaultChecked={false}
                className="switch-box"
                id="doYouHavePhysicalAsset"
                label={
                  <span>
                    <FormattedMessage id="doYouHavePhysicalAsset" />
                  </span>
                }
              />
            </div>

            <div className="switch-desc d-flex second-switch-desc">
              <Form.Check
                type="checkbox"
                {...register('isDropNeeded')}
                name="isDropNeeded"
                defaultChecked={false}
                id="isThisADrop"
                className="switch-box"
                label={
                  <span>
                    <FormattedMessage id="isThisADrop" />
                  </span>
                }
              />
            </div>

            <Form.Group className="form-group">
              <Form.Label>
                <FormattedMessage id="artName" />
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                disabled={type}
                className={errors.name && 'error'}
                {...register('name', {
                  required: validationErrors.required,
                  maxLength: {
                    value: 50,
                    message: validationErrors.maxLength(50)
                  }
                })}
                placeholder={labels.artName}
              />
              {errors.name && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>
                <FormattedMessage id="description" />{' '}
                <Form.Text className="text-muted mx-1">
                  (<FormattedMessage id="max1500CharactersAllowed" />)
                </Form.Text>
              </Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                disabled={type}
                maxLength={1500}
                name="description"
                className={errors.description && 'error'}
                {...register('description', {
                  required: validationErrors.required
                })}
                placeholder={labels.description}
              />
              {errors.description && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.description.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>
                <FormattedMessage id="category" />
              </Form.Label>
              <Controller
                name="categoryId"
                control={control}
                rules={{ required: validationErrors.required }}
                render={({ field: { onChange, value = [] } }) => (
                  <Select
                    value={value}
                    className={`react-select ${errors.categoryId && 'error'}`}
                    classNamePrefix="select"
                    isDisabled={type}
                    placeholder={labels.category}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    options={category?.category}
                    onChange={(e) => {
                      onChange(e)
                    }}
                  />
                )}
              />
              {errors.categoryId && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.categoryId.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="form-group">
              <Form.Label>
                <FormattedMessage id="blockchain" />
              </Form.Label>
              <Controller
                name="blockchainNetwork"
                control={control}
                rules={{ required: validationErrors.required }}
                render={({ field: { onChange, value = [] } }) => (
                  <Select
                    value={value}
                    className={`react-select ${errors.blockchainNetwork && 'error'}`}
                    classNamePrefix="select"
                    isDisabled={type}
                    placeholder={labels.blockchain}
                    options={artworkHiddenType === 'auction' ? blockchainNetworkOptions.slice(0, -1) : blockchainNetworkOptions}
                    onChange={(e) => {
                      onChange(e)
                    }}
                  />
                )}
              />
              {errors.blockchainNetwork && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.blockchainNetwork.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {(artworkHiddenType !== 'fixedPrice' || isDrop) && (
              <Row>
                <Col xl="6">
                  <Form.Group className="form-group">
                    <Form.Label className="d-block">
                      <FormattedMessage id="chooseStartTime" />
                    </Form.Label>
                    <Controller
                      name="saleStartTime"
                      control={control}
                      rules={{ required: validationErrors.required }}
                      render={({ field: { onChange, value = '' } }) => (
                        <DatePicker
                          placeholderText="Select start date and time"
                          selected={value || values?.saleStartTime}
                          minDate={new Date()}
                          className={`form-control ${errors.saleStartTime && 'error'}`}
                          popperPlacement="bottom"
                          showTimeSelect
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy HH:mm"
                          timeFormat="HH:mm"
                          onChange={(update) => {
                            onChange(update)
                          }}
                        />
                      )}
                    />
                    {errors.saleEndTime && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.saleEndTime.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>

                <Col xl="6">
                  <Form.Group className="form-group">
                    <Form.Label className="d-block">
                      <FormattedMessage id="chooseEndTime" />
                    </Form.Label>
                    <Controller
                      name="saleEndTime"
                      control={control}
                      rules={{ required: validationErrors.required }}
                      render={({ field: { onChange, value = '' } }) => (
                        <DatePicker
                          placeholderText="Select end date and time"
                          selected={value || values?.saleEndTime}
                          minDate={new Date(saleStartTime)}
                          className={`form-control ${errors.saleEndTime && 'error'}`}
                          showTimeSelect
                          disabled={!saleStartTime}
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy HH:mm"
                          timeFormat="HH:mm"
                          onChange={(update) => {
                            onChange(update)
                          }}
                        />
                      )}
                    />
                    {errors.saleEndTime && (
                      <Form.Control.Feedback type="invalid" className="invalidFeedback">
                        {errors.saleEndTime.message}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Form>
    </>
  )
}
StepOne.propTypes = {
  register: PropTypes.func,
  errors: PropTypes.object,
  watch: PropTypes.func,
  values: PropTypes.object,
  hidden: PropTypes.bool,
  control: PropTypes.object,
  setValue: PropTypes.func,
  category: PropTypes.object
}
export default StepOne
