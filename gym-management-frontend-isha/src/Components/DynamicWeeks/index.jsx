import React from 'react'
import CalendarInput from 'Components/Calendar-Input'
import PropTypes from 'prop-types'
import { Accordion, Col } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import { formatDate } from 'helpers'
import InterviewEditor from 'Components/Editor'

function DynamicWeekSchedule ({ item, control, isAdd }) {
  return (
    <>
      <Accordion className='mt-2'>
        <Accordion.Item eventKey="0">
          <Accordion.Header className='d-flex'>
            {item.day} | {formatDate(item.date, '-', false)}
          </Accordion.Header>
          <Accordion.Body>
            <Col className='p-lg-2'>
              <Controller
                name={`dMealPlanDate-${formatDate(item.date, '-', false)}`}
                control={control}
                defaultValue={item.date}
                render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                  <>
                    <CalendarInput
                      disabled={isAdd}
                      onChange={onChange}
                      value={value || item.date}
                      ref={ref}
                      errorMessage={error?.message}
                      title="Meal Plan Date"
                    />
                  </>
                )}
              />
            </Col>
            <Col className='p-lg-2 mb-2'>
              <Controller
                name={`sDescription-${formatDate(item.date, '-', false)}`}
                control={control}
                defaultValue={item.value}
                rules={{ required: `${formatDate(item.date)} Description is required` }}
                render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
                  <>
                    <InterviewEditor
                      label='Description'
                      isImportant={true}
                      errorMessage={error?.message}
                      ref={ref}
                      onChange={(e) => {
                        onChange(e?.level ? e?.level?.content : e)
                      }}
                      value={value}
                      className=''
                    />
                  </>
                )}
              />
            </Col>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default DynamicWeekSchedule

DynamicWeekSchedule.propTypes = {
  item: PropTypes.any,
  control: PropTypes.object,
  isAdd: PropTypes.bool
}
