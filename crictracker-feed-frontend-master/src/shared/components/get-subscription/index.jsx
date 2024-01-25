import React, { useContext, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'

import PopUpModal from '../pop-up-modal'
import CommonInput from '../common-input'
import { sendQuery } from 'shared/apis/subscription'
import { ToastrContext } from '../toastr'
import { TOAST_TYPE } from 'shared/constants'

const GetSubScription = ({ header }) => {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: 'all'
  })
  const [isGetSubscriptionOpen, setIsGetSubscriptionOpen] = useState(false)
  const { dispatch } = useContext(ToastrContext)

  function handleSubscriptionPopUp() {
    setIsGetSubscriptionOpen(!isGetSubscriptionOpen)
  }
  async function getSubscriptionData(data) {
    handleSubscriptionPopUp()
    const response = await sendQuery(data)
    if (response.status === 200) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
    }
  }
  return (
    <>
      <div className='subscription-information'>
        <h2>{header}</h2>
        <h6>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, velit neque. Aut culpa pariatur aliquid repudiandae odit ipsa,
          iusto, magni vero labore earum tenetur quisquam nobis cupiditate est sit possimus. Assumenda!
        </h6>
        <Button className='common-btn' onClick={handleSubscriptionPopUp}>
          <FormattedMessage id='getSubscription' />
        </Button>
      </div>
      {isGetSubscriptionOpen && (
        <PopUpModal
          isOpen={isGetSubscriptionOpen}
          onClose={handleSubscriptionPopUp}
          title={useIntl().formatMessage({ id: 'getSubscription' })}
        >
          <Form autoComplete='off' onSubmit={handleSubmit(getSubscriptionData)}>
            <CommonInput
              type='textarea'
              register={register}
              errors={errors}
              className={`form-control ${errors.sDetails && 'error'}`}
              name='sDetails'
              label='details'
              required
            />
            <div className='add-border'>
              <Row>
                <Col className='d-flex justify-content-center'>
                  <Button className='w-100' variant='primary' type='submit'>
                    <FormattedMessage id='send' />
                  </Button>
                </Col>
              </Row>
              <div className='d-flex justify-content-center mb-2 mt-2'>OR</div>
              <Row>
                <Col className='d-flex justify-content-center'>
                  <h3>Contact us - 9988776655</h3>
                </Col>
              </Row>
            </div>
          </Form>
        </PopUpModal>
      )}
    </>
  )
}
GetSubScription.propTypes = {
  header: PropTypes.any
}
export default GetSubScription
