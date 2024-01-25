import React from 'react'

// component
import DescriptionInput from 'Components/DescriptionInput'

// icons
import Delete from 'Assets/Icons/Delete'

// hook
import { Controller } from 'react-hook-form'

import { Accordion, Col, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './_dietQuestion.scss'


function DietQuestion({ control, questionList, handleClear }) {

  return (
    <div className='mt-3'>
      {questionList?.map((data, i) => {
        return (
          <Row key={data?._id} >
            <Col lg={11} md={11} xs={10}>
              <Accordion className='mb-3' defaultActiveKey={0}>
                <Accordion.Item eventKey={i} >
                  <Accordion.Header>{`(${i + 1})`} {data?.sQuestion}</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col lg={12} md={12} xs={12}>
                        <Controller
                          name={`question-${data?._id}-desc`}
                          control={control}
                          defaultValue={(data?.sAnswer === '') ? '' : data?.sAnswer}
                          render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                            <>
                              <DescriptionInput
                                className="p-2 text-dark"
                                label='Answer'
                                errorMessage={error?.message}
                                placeholder="Enter the Diet Answer"
                                ref={ref}
                                onChange={onChange}
                                value={value}
                              />
                            </>
                          )}
                        />
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
            <Col>
              <div
                className="mt-2"
                onClick={() => handleClear(data?._id, 'D')}
              >
                <Delete fill="#ff2e69" />
              </div>
            </Col>
          </Row>
        )
      })}
    </div>
  )
}

export default DietQuestion

DietQuestion.propTypes = {
  control: PropTypes.object,
  handleClear: PropTypes.func,
  questionList: PropTypes.array,
} 
