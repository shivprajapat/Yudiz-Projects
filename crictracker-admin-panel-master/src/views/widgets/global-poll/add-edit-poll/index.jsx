import React, { forwardRef, useContext, useEffect } from 'react'
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'

import CommonInput from 'shared/components/common-input'
import { TOAST_TYPE } from 'shared/constants'
import { ADD_GLOBAL_POLL, GET_POLL_BY_ID, UPDATE_GLOBAL_POLL } from 'graph-ql/widgets/poll/query'
import { ToastrContext } from 'shared/components/toastr'
import Loading from 'shared/components/loading'
import { removeTypeName } from 'shared/utils'
import { allRoutes } from 'shared/constants/AllRoutes'

function AddEditPoll() {
  const { id } = useParams()
  const history = useHistory()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: getDefaultValue() })
  const { dispatch } = useContext(ToastrContext)

  const [addPoll, { loading }] = useMutation(ADD_GLOBAL_POLL, {
    onCompleted: (data) => {
      handleAPIResponse(data?.addPoll)
    }
  })

  const [updatePoll, { loading: updatePollLoading }] = useMutation(UPDATE_GLOBAL_POLL, {
    onCompleted: (data) => {
      handleAPIResponse(data?.editPoll)
    }
  })

  const [getPoll, { data: pollData }] = useLazyQuery(GET_POLL_BY_ID, {
    onCompleted: (data) => {
      if (data && data?.getPollById) {
        reset({
          sTitle: data?.getPollById?.sTitle,
          aField: data?.getPollById?.aField?.map(ele => removeTypeName(ele)),
          dStartDate: data?.getPollById?.dStartDate,
          dEndDate: data?.getPollById?.dEndDate
        })
      }
    }
  })

  function handleAPIResponse(data) {
    if (data) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: data?.sMessage, type: TOAST_TYPE.Success, btnTxt: <FormattedMessage id="close" /> }
      })
      history.push(allRoutes.poll)
    }
  }

  function getDefaultValue() {
    return { sTitle: '', aField: [{ sTitle: '' }, { sTitle: '' }] }
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'aField'
  })

  function onAddPoll(data) {
    if (id) {
      updatePoll({ variables: { input: { ...data, _id: id } } })
    } else {
      addPoll({ variables: { input: { ...data, eStatus: 's' } } })
    }
  }

  useEffect(() => {
    if (id) {
      getPoll({ variables: { input: { _id: id } } })
    }
  }, [id])

  return (
    <>
      {((!pollData && id) || updatePollLoading) && <Loading />}
      <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit(onAddPoll)}>
        <Row>
          <Col lg={8}>
            <Row>
              <Col md={6}>
                <CommonInput
                  register={register}
                  errors={errors}
                  className={`${errors?.sTitle && 'error'}`}
                  as="input"
                  placeholder={useIntl().formatMessage({ id: 'pollTitle' })}
                  type="text"
                  name="sTitle"
                  label="pollTitle"
                  required
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-block">
                    <FormattedMessage id="startTime" />
                  </Form.Label>
                  <Controller
                    name="dStartDate"
                    control={control}
                    defaultValue={new Date(moment().add(2, 'minute').format())}
                    render={({ field: { onChange, value = '' } }) => (
                      <>
                        <DatePicker
                          selected={value}
                          dateFormat="dd-MM-yyyy h:mm aa"
                          onChange={onChange}
                          showTimeSelect
                          timeIntervals={15}
                          minDate={new Date(moment().add(30, 'minute').format())}
                          customInput={<ExampleCustomInput icon="visibility" error={errors.date} />}
                        />
                      </>
                    )}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="d-block">
                    <FormattedMessage id="endTime" />
                  </Form.Label>
                  <Controller
                    name="dEndDate"
                    control={control}
                    defaultValue={new Date(moment().add(1, 'day').add(30, 'minute').format())}
                    render={({ field: { onChange, value = '' } }) => (
                      <>
                        <DatePicker
                          selected={value}
                          dateFormat="dd-MM-yyyy h:mm aa"
                          onChange={onChange}
                          showTimeSelect
                          timeIntervals={15}
                          customInput={<ExampleCustomInput icon="visibility" error={errors.date} />}
                        />
                      </>
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex flex-column">
              <Form.Label className="text-uppercase">
                <FormattedMessage id="pollOptions" />*
              </Form.Label>
              {fields?.map((field, i) => {
                return (
                  <div key={field?.id} className="d-flex align-items-start gap-1">
                    <CommonInput
                      register={register}
                      errors={errors}
                      className={errors?.aField?.[`${i}`]?.sTitle && 'error'}
                      placeholder={`${i + 1}`}
                      as="input"
                      name={`aField[${i}].sTitle`}
                      type="text"
                      required
                    />
                    {fields?.length > 2 && (
                      <Button variant="link" className="square icon-btn mt-1" onClick={() => remove(i)}>
                        <i className="icon-delete d-block" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
            <Button disabled={fields?.length >= 5} className="w-100" size="md" variant="secondary" onClick={() => append({ nVote: 0, sTitle: '' })}>
              + <FormattedMessage id="addOption" />
            </Button>
              <Button variant="primary" type="submit" className="mt-3">
                {loading ? <Spinner animation="border" size="sm" /> : id ? <FormattedMessage id="updatePoll" /> : <FormattedMessage id="createPoll" />}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  )
}

export default AddEditPoll

// eslint-disable-next-line react/prop-types
const ExampleCustomInput = forwardRef(({ value, onClick, icon, error }, ref) => (
  <InputGroup>
    <Form.Control value={value} type="text" ref={ref} onClick={onClick} className={error && 'error'} readOnly />
  </InputGroup>
))
ExampleCustomInput.displayName = ExampleCustomInput
