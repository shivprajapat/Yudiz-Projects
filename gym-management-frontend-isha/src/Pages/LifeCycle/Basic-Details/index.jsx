/* eslint-disable react/prop-types */
import React from 'react'

// component
import FoodInfo from 'Components/LifeCycle/FoodInfo'
import SleepInfo from 'Components/LifeCycle/SleepInfo'
import SmokeInfo from 'Components/LifeCycle/SmokeInfo'
import WorkInfo from 'Components/LifeCycle/WorkInfo'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Input from 'Components/Input'

// helper
import { FoodType, MaritalStatus, SmokeType } from 'helpers'

import { Controller } from 'react-hook-form'
import { Col, Row } from 'react-bootstrap'


function LifeCycleBasic({ control }) {

    return (
        <Wrapper transparent>

            <Row>

                <Col lg={6} md={6} sm={6} xs={12}>
                    <Controller
                        name="sWeight"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Input
                                {...field}
                                labelText="Weight"
                                placeholder="eg.: 70 kg"
                                id="sWeight"
                                errorMessage={error?.message}
                            />
                        )}
                    />
                </Col>

                <Col lg={6} md={6} sm={6} xs={12}>
                    <Controller
                        name="sHeight"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Input
                                {...field}
                                labelText="Height"
                                placeholder="eg.: 5 ft"
                                id="sHeight"
                                errorMessage={error?.message}
                            />
                        )}
                    />
                </Col>

            </Row>

            <Row>

                <Col lg={6} md={6} sm={6} xs={12}>
                    <Controller
                        name="eMaritalStatus"
                        control={control}
                        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                            <Select
                                labelText='Marital Status'
                                id="eMaritalStatus"
                                placeholder="Select Marital Status"
                                onChange={onChange}
                                value={value}
                                ref={ref}
                                errorMessage={error?.message}
                                options={MaritalStatus}
                            />
                        )}
                    />
                </Col>

                <Col lg={6} md={6} sm={6} xs={12} className='mt-2 mt-sm-0 mt-lg-0 mt-md-0'>
                    <Controller
                        name="sCaste"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <Input
                                {...field}
                                labelText="Caste"
                                placeholder="Enter the Caste"
                                id="sCaste"
                                errorMessage={error?.message}
                            />
                        )}
                    />
                </Col>

            </Row>

            <div className='mt-3 food-info'>
                <FoodInfo control={control} option={FoodType} />
            </div>

            <div className='mt-3 sleep-info'>
                <SleepInfo control={control} />
            </div>

            <div className='mt-2 smoke-info'>
                <SmokeInfo control={control} options={SmokeType} />
            </div>

            <div className='mt-3 work-info'>
                <WorkInfo control={control} />
            </div>
          
        </Wrapper>
    )
}

export default LifeCycleBasic