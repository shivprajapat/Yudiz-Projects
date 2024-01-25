import React from 'react'

// component
import DescriptionInput from 'Components/DescriptionInput'
import PageTitle from 'Components/Page-Title'
import Divider from 'Components/Divider'
import Input from 'Components/Input'

// icons
import Information from 'Assets/Icons/infoIcon'

// helper
import { detectBrowser } from 'helpers'

import { Col, Row } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import PropTypes from 'prop-types'

function WorkInfo({ control }) {
  return (
    <>
      <PageTitle
        title="Work Information"        
      />

      <Divider width={'155%'} height="1px" className='p-0 mb-3' />

      <Row>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="sOccupation"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText="Occupation"
                placeholder="Enter the Occupation"
                id="sOccupation"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="sDesignation"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                labelText="Designation"
                placeholder="Enter the Designation"
                id="sDesignation"
                errorMessage={error?.message}
              />
            )}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Controller
                name="sStartTime"
                control={control}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => {
                  return (
                    <>
                      <Input
                        onChange={(e) => {
                          onChange(e)
                        }}
                        value={value}
                        ref={ref}
                        errorMessage={error?.message}
                        labelText='Work Start Time'
                        type='time'
                        info={detectBrowser() === 'Safari' && <Information />}
                        tooltipContent={detectBrowser() === 'Safari' && `Kindly provide the working's start time using the 24 hours format. For eg.: 1:00 PM will be displayed as 13:00`}
                      />
                    </>
                  )
                }}
              />
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Controller
                name="sEndTime"
                control={control}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    errorMessage={error?.message}
                    labelText="Work End Time"
                    type='time'
                    info={detectBrowser() === 'Safari' && <Information />}
                    tooltipContent={detectBrowser() === 'Safari' && `Kindly provide the working's end time using the 24 hours format. For eg.: 1:00 PM will be displayed as 13:00`}
                  />
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="workInfoDescription"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label='Description'
                  errorMessage={error?.message}
                  placeholder="Enter Work Information"
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

export default WorkInfo

WorkInfo.propTypes = {
  control: PropTypes.object,
} 
