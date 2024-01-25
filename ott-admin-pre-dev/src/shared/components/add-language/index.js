import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { FormattedMessage } from 'react-intl'

import { useQuery, useMutation } from 'react-query'
import { addLanguage, getLanguageSelect } from 'query/language-management/language-management.query'
import { toaster } from 'helper/helper'

function AddLannguage({ handleAddLang }) {
  const [languageList, setLanguageList] = useState([])
  const [status, setStatus] = useState(false)
  const [forFrontend, setForFrontend] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm()

  useQuery('languageSelect', () => getLanguageSelect(), {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      setLanguageList(response?.language)
    }
  })

  const { mutate, isLoading } = useMutation(addLanguage, {
    select: (data) => data.data.data,
    onSuccess: (response) => {
      handleAddLang()
      toaster(response?.data?.message)
    }
  })

  const onSubmit = (data) => {
    if (data) {
      mutate({ data, status, forFrontend })
    }
  }

  const changeHandler = (name, e) => {
    if (name === 'status') {
      setStatus(true)
    } else if (name === 'forFrontend') {
      setForFrontend(true)
    }
  }

  return (
    <>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='top-d-button'>
              <Button variant='success' type='submit' className='square' size='sm'>
                <FormattedMessage id='submit' /> {isLoading && <Spinner animation='border' size='sm' />}
              </Button>
            </div>
            <Form.Group className='form-group'>
              <Controller
                name='language'
                control={control}
                rules={{ required: 'please select language' }}
                render={({ onChange, ref, value }) => (
                  <>
                    <Form.Label>
                      <FormattedMessage id='language' />*
                    </Form.Label>
                    <Select
                      onChange={onChange}
                      ref={ref}
                      value={value}
                      options={languageList}
                      getOptionLabel={(option) => option?.name}
                      getOptionValue={(option) => option?.name}
                      isClearable
                      isSearchable={false}
                    />
                  </>
                )}
              />
              {console.log('errors', errors)}
              {errors.language && <Form.Control.Feedback type='invalid'>{errors.language.message}</Form.Control.Feedback>}
            </Form.Group>
            <Row>
              <Col md='5' sm='12'>
                <Form.Group className='form-group'>
                  <Form.Label>
                    <FormattedMessage id='status' />
                  </Form.Label>
                  <Form.Check
                    type='switch'
                    onChange={(e) => {
                      changeHandler('status', e.target.checked)
                    }}
                    id='status'
                    value={status}
                    name='bPriority'
                  />
                </Form.Group>
              </Col>
              <Col md='7' sm='12'>
                <Form.Group className='form-group'>
                  <Form.Label>
                    <FormattedMessage id='frontend Access' />
                  </Form.Label>
                  <Form.Check
                    type='switch'
                    onChange={(e) => {
                      changeHandler('forFrontend', e.target.checked)
                    }}
                    id='forFrontend'
                    value={forFrontend}
                    name='bPriority'
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  )
}
AddLannguage.propTypes = {
  handleAddLang: PropTypes.func
}
export default AddLannguage
