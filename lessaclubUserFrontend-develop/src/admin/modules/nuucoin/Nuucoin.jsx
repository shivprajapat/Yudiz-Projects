import { SHOW_TOAST } from 'modules/toast/redux/action'
import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { EMAIL, TOAST_TYPE } from 'shared/constants'
import { validationErrors } from 'shared/constants/validationErrors'
import './index.scss'
import { createNuuCoinData, listNuuCoinsData, updateNuuCoinData } from './redux/service'

const Nuucoin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    mode: 'all'
  })

  const [nuuCoinData, setNuuCoinData] = useState({})

  const dispatch = useDispatch()

  useEffect(() => {
    getNuucoinDetails()
  }, [])

  useEffect(() => {
    setValue('coinCount', nuuCoinData.coinCount)
    setValue('email', nuuCoinData.email)
    setValue('thresholdCount', nuuCoinData.thresholdCount)
    setValue('coinRate', nuuCoinData.coinRate)
  }, [nuuCoinData])

  const getNuucoinDetails = async () => {
    try {
      const response = await listNuuCoinsData()
      if (response?.status === 200) {
        const data = response?.data?.result?.nuuCoin || []
        setNuuCoinData(data[0] || {})
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleStepSubmit = async (data) => {
    const payload = { ...data }
    try {
      let response = {}
      if (nuuCoinData.id) {
        response = await updateNuuCoinData(payload, nuuCoinData.id)
      } else {
        response = await createNuuCoinData(payload)
      }
      if (response.status === 200) {
        getNuucoinDetails()
        dispatch({
          type: SHOW_TOAST,
          payload: {
            message: `${nuuCoinData.id ? 'Updated' : 'Created'} Nuucoin settings`,
            type: TOAST_TYPE.Success
          }
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <h2 className="admin-heading">Manage Nuucoins</h2>
      <div className="nuucoin-settings">
        <Form onSubmit={handleSubmit((data) => handleStepSubmit(data))} autoComplete="off">
          <Row>
            <Form.Group className="form-group" as={Col} lg="8">
              <Form.Label>Total Number of Nuucoins</Form.Label>
              <Form.Control
                type="number"
                step=".01"
                name="coinCount"
                placeholder="Total Number of Nuucoins"
                {...register('coinCount', {
                  required: validationErrors.required,
                  valueAsNumber: true
                })}
                onWheel={(e) => e.target.blur()}
              />
              {errors.coinCount && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.coinCount.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="form-group" as={Col} lg="8">
              <Form.Label>Nuucoin Rate(in GBP)</Form.Label>
              <Form.Control
                type="number"
                step=".01"
                name="coinRate"
                placeholder="Nuucoin Rate(in GBP)"
                {...register('coinRate', {
                  valueAsNumber: true,
                  required: validationErrors.required
                })}
                onWheel={(e) => e.target.blur()}
              />
              {errors.coinRate && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.coinRate.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="form-group" as={Col} lg="8">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter Email"
                {...register('email', {
                  required: validationErrors.required,
                  pattern: {
                    value: EMAIL,
                    message: validationErrors.email
                  }
                })}
                onWheel={(e) => e.target.blur()}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="form-group" as={Col} lg="8">
              <Form.Label>Threshold Count</Form.Label>
              <Form.Control
                type="number"
                name="thresholdCount"
                placeholder="Enter Threshold Count"
                {...register('thresholdCount', {
                  valueAsNumber: true,
                  required: validationErrors.required
                })}
                onWheel={(e) => e.target.blur()}
              />
              {errors.thresholdCount && (
                <Form.Control.Feedback type="invalid" className="invalidFeedback">
                  {errors.thresholdCount.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="form-group" as={Col} lg="8">
              <div className='d-flex justify-content-center'>
                <Button className='white-btn' type="submit">Submit</Button>
              </div>
            </Form.Group>
          </Row>
        </Form>
      </div>
    </>
  )
}

export default Nuucoin
