import React from 'react'

// component
import DescriptionInput from 'Components/DescriptionInput'
import PageTitle from 'Components/Page-Title'
import Divider from 'Components/Divider'
import { detectBrowser } from 'helpers'
import Input from 'Components/Input'

// icons
import Information from 'Assets/Icons/infoIcon'

import { Controller } from 'react-hook-form'
import { Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'

function SleepInfo({ control }) {
  return (
    <>
      <PageTitle
        title="Sleep Information"
      />
      
      <Divider width={'155%'} height="1px" className='p-0 mb-3' />

      <Row className="mt-2 mt-lg-2 mt-xs-3">
        <Col lg={6} md={6} sm={6} xs={12}>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Controller
                name="sWakeUpTime"
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
                        labelText='WakeUp Time'
                        type='time'
                        info={detectBrowser() === 'Safari' && <Information />}
                        tooltipContent={detectBrowser() === 'Safari' && 'Kindly provide the WakeUp time using the 24 hours format. For eg.: 1:00 PM will be displayed as 13:00'}
                      />
                    </>
                  )
                }}
              />
            </Col>
            <Col lg={12} md={12} sm={12} xs={12}>
              <Controller
                name="sBedTime"
                control={control}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    errorMessage={error?.message}
                    labelText="Bed Time"
                    type='time'
                    info={detectBrowser() === 'Safari' && <Information />}
                    tooltipContent={detectBrowser() === 'Safari' && 'Kindly provide the Bed time using the 24 hours format. For eg.: 1:00 PM will be displayed as 13:00'}
                  />
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={6} xs={12}>
          <Controller
            name="sleepInfoDescription"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <DescriptionInput
                  className="p-2 text-dark"
                  label='Description'
                  errorMessage={error?.message}
                  placeholder="Enter Sleep Information"
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

export default SleepInfo

SleepInfo.propTypes = {
  control: PropTypes.object,
} 
