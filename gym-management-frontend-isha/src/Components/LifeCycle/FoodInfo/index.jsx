import React from 'react'

// component
import DescriptionInput from 'Components/DescriptionInput'
import PageTitle from 'Components/Page-Title'
import Divider from 'Components/Divider'
import Select from 'Components/Select'

import { Controller } from 'react-hook-form'
import { Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

function FoodInfo({ control, option }) {
  return (
    <>
      <PageTitle
        title="Food Information"
      />

      <Divider width={'155%'} height="1px" className='p-0 mb-3' />

      <Row>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="eType"
            control={control}
            render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
              <Select
                labelText='Type'
                id="eType"
                placeholder="Select Food Type"
                onChange={onChange}
                value={value}
                ref={ref}
                errorMessage={error?.message}
                options={option}
              />
            )}
          />
        </Col>        
      </Row>

      <Row className='mt-2'>
        <Col lg={12} md={12} xs={12}>
          <Controller
            name="foodInfoDescription"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label='Description'
                  errorMessage={error?.message}
                  placeholder="Enter Food Information"
                  {...field}
                />
              </>
            )}
          />
        </Col>
      </Row>
    </>
  )
}

export default FoodInfo

FoodInfo.propTypes = {
  control: PropTypes.object,
  option: PropTypes.array
}
