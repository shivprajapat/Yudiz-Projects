import React, { useContext, useEffect, useState } from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { useHistory, useParams } from 'react-router-dom'

import { validationErrors } from 'shared/constants/ValidationErrors'
import CommonInput from '../common-input'
import { SUBSCRIPTION_TYPES, TOAST_TYPE, PASSWORD } from 'shared/constants'
import Countries from '../../constants/countries.json'
import States from '../../constants/states'
import Cities from '../../constants/cities'
import { addClientData, getClientDetails, updateClientData } from 'shared/apis/clients'
import { ToastrContext } from 'shared/components/toastr'
import { convertDateInYDM } from 'shared/utils'
import Loading from '../loading'
import { allRoutes } from 'shared/constants/AllRoutes'
import ToolTip from 'shared/components/tooltip'
import { getCategoriesForSubscription } from 'shared/apis/categories'

const AddEditClient = () => {
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: 'all'
  })
  const { iClientId } = useParams()
  const { dispatch } = useContext(ToastrContext)
  const history = useHistory()

  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState([])
  const [selectedCountry, setSelectedCountry] = useState()
  const [listOfStates, setListofStates] = useState([])
  const [selectedState, setSelectedState] = useState()
  const [listOfCities, setListofCities] = useState([])
  const [selectedCity, setSelectedCity] = useState()
  const [categoriesList, setCategoriesList] = useState([])
  const [clientDetail, setClientDetail] = useState()
  const [filterDate, setFilterDate] = useState({ dSubscriptionStart: '', dSubscriptionEnd: '' })
  const [isLoading, setIsLoading] = useState(!!iClientId)
  // const [fileName, setFileName] = useState()
  // console.log('fileName', fileName)

  useEffect(() => {
    setListofStates(States.filter((state) => state.country_id === selectedCountry?.id))
  }, [selectedCountry])
  useEffect(() => {
    setListofCities(Cities.filter((city) => city.state_id === selectedState?.id))
  }, [selectedState])

  function manipulateData(data) {
    data.aSubscriptionType = data?.aSubscriptionType?.map(item => item.value)
    return {
      ...data,
      sCountry: data.sCountry?.id || '',
      sState: data.sState?.id || '',
      sCity: data.sCity?.id || '',
      nApiTotal: data?.nApiTotal || 0,
      nArticleTotal: data?.aSubscriptionType?.includes('article') ? data?.nArticleTotal : 0,
      nExclusiveTotal: data?.aSubscriptionType?.includes('exclusive') ? data?.nExclusiveTotal : 0,
      sExclusiveSlug: data?.aSubscriptionType?.includes('exclusive') ? data?.sExclusiveSlug : '',
      aCategoryIds: data?.aSubscriptionType?.includes('category') ? data?.aCategoryIds?.map(item => item._id) : []
    }
  }
  async function addClient(data) {
    const manipulatedData = await manipulateData(data)
    const response = await addClientData(manipulatedData)
    if (response?.status === 200) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
      history.push(allRoutes.clients)
    } else {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Error, btnTxt: 'Close' }
      })
    }
  }
  async function editClient(data) {
    const manipulatedData = await manipulateData(data)
    const response = await updateClientData(manipulatedData, iClientId)
    if (response?.status === 200) {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Success, btnTxt: 'Close' }
      })
      history.push(allRoutes.clients)
    } else {
      dispatch({
        type: 'SHOW_TOAST',
        payload: { message: response.message, type: TOAST_TYPE.Error, btnTxt: 'Close' }
      })
    }
  }

  function handleDate(e) {
    setFilterDate({ ...filterDate, [e.target.name]: e.target.value })
  }

  async function getAPIData() {
    const categories = await getCategoriesForSubscription()
    if (categories?.status === 200) {
      setCategoriesList(categories?.data?.map(item => { return { ...item, label: item?.sName, value: item?.sName } }))
    }

    if (iClientId) {
      const response = await getClientDetails(iClientId)

      if (response.status === 200) {
        response.data.oSubscription.aSubscriptionType = response?.data?.oSubscription?.aSubscriptionType?.map(item => { return { label: <FormattedMessage id={item}/>, value: item } })
        const list = categories?.data?.map(item => { return { ...item, label: item?.sName, value: item?.sName } })
        reset({
          sName: response.data.sName,
          sUsername: response.data.sUsername,
          sEmail: response.data.sEmail,
          sCompanyName: response.data.sCompanyName,
          sPhone: response.data.sPhone,
          sGSTNo: response.data.sGSTNo,
          sAddress: response.data.sAddress,
          aSubscriptionType: response.data?.oSubscription?.aSubscriptionType,
          sCountry: Countries.filter(item => item.id === response?.data?.sCountry)[0],
          sState: States.filter(item => item.id === response?.data?.sState)[0],
          sCity: Cities.filter(item => item.id === response?.data?.sCity)[0],
          aCategoryIds: list.filter(item => response.data.oSubscription?.aCategoryIds.includes(item._id)),
          dSubscriptionStart: convertDateInYDM(response?.data?.oSubscription?.dSubscriptionStart),
          dSubscriptionEnd: convertDateInYDM(response?.data?.oSubscription?.dSubscriptionEnd),
          nApiTotal: response.data.oSubscription.oStats.nApiTotal,
          nArticleTotal: response.data.oSubscription.oStats.nArticleTotal,
          nExclusiveTotal: response.data.oSubscription.oStats.nExclusiveTotal,
          sExclusiveSlug: response.data.sExclusiveSlug
        })
        setSelectedSubscriptionType(response.data.oSubscription.aSubscriptionType)
        setSelectedCountry(Countries.filter(item => item.id === response?.data?.sCountry)[0])
        setSelectedState(States.filter(item => item.id === response?.data?.sState)[0])
        setSelectedCity(Cities.filter(item => item.id === response?.data?.sCity)[0])
        setClientDetail(response?.data)
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    getAPIData()
  }, [])

  return (
    <div>
      { !iClientId && <div className='d-flex justify-content-end w-100'>
        <ToolTip toolTipMessage='Analytics'>
          <Button
            variant='info'
            className={'square'}
            size='sm'
            onClick={() => {
              return history.push(allRoutes.clientAnalytics(clientDetail?.sName), { _id: clientDetail?._id })
            }}
          >
            <i className='icon-analytics_bar-chart_metrics_statistics_icon'/>
            <FormattedMessage id='analytics' />
          </Button>
        </ToolTip>
      </div>
      }
      { !isLoading ? (
        <Form onSubmit={!iClientId ? handleSubmit(addClient) : handleSubmit(editClient)} autoComplete='off'>
        <h5 className='title-text title-font mb-3'>
          <FormattedMessage id='personalDetails' />
        </h5>
        <Row>
          <Col sm='4'>
            <CommonInput
              type='text'
              register={register}
              errors={errors}
              className={`form-control ${errors.sName && 'error'}`}
              name='sName'
              label='fullName'
              required
            />
          </Col>
          <Col sm='4'>
            <CommonInput
              type='text'
              register={register}
              errors={errors}
              className={`form-control ${errors.sUsername && 'error'}`}
              name='sUsername'
              label='userName'
              required
            />
          </Col>
          { !iClientId &&
            <Col sm='4'>
              <CommonInput
                type='text'
                register={register}
                validation={{
                  pattern: {
                    value: PASSWORD,
                    message: validationErrors.passwordRegEx
                  },
                  maxLength: { value: 12, message: validationErrors.rangeLength(8, 12) },
                  minLength: { value: 8, message: validationErrors.rangeLength(8, 12) }
                }}
                errors={errors}
                className={`form-control ${errors.sPassword && 'error'}`}
                name='sPassword'
                label='passWord'
                required
              />
            </Col>
          }
          <Col sm='4'>
            <CommonInput
              type='text'
              register={register}
              errors={errors}
              className={`form-control ${errors.sEmail && 'error'}`}
              name='sEmail'
              label='emailAddress'
              required
            />
          </Col>
          <Col sm='4'>
            <CommonInput
              type='text'
              register={register}
              errors={errors}
              className={`form-control ${errors.sCompanyName && 'error'}`}
              name='sCompanyName'
              label='companyName'
              required
            />
          </Col>
          <Col sm='4'>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='phoneNumber' />*
              </Form.Label>
              <Form.Control
                type='text'
                name='sPhone'
                className={errors.sPhone && 'error'}
                {...register('sPhone', {
                  required: validationErrors.required,
                  maxLength: { value: 10, message: validationErrors.number },
                  minLength: { value: 10, message: validationErrors.number }
                })}
              />
              {errors.sPhone && <Form.Control.Feedback type='invalid'>{errors.sPhone.message}</Form.Control.Feedback>}
            </Form.Group>
          </Col>
          <Col sm='4'>
            <CommonInput
              type='text'
              register={register}
              errors={errors}
              className={`form-control ${errors.sGSTNo && 'error'}`}
              name='sGSTNo'
              label='gstno'
            />
          </Col>
          <Col sm='4'>
            <CommonInput
              type='text'
              register={register}
              errors={errors}
              className={`form-control ${errors.sAddress && 'error'}`}
              name='sAddress'
              label='address'
            />
          </Col>
          <Col sm='4'>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='country' />
              </Form.Label>
              <Controller
                name='sCountry'
                control={control}
                render={({ field: { onChange, value = selectedCountry || [], ref } }) => (
                  <Select
                    ref={ref}
                    value={value}
                    options={Countries}
                    className={`react-select ${errors?.sCountry && 'error'}`}
                    classNamePrefix='select'
                    onChange={(e) => {
                      onChange(e)
                      setSelectedCountry(e)
                    }}
                  />
                )}
              />
              {errors.sCountry && <Form.Control.Feedback type='invalid'>{errors.sCountry.message}</Form.Control.Feedback>}
            </Form.Group>
          </Col>
          <Col sm='4'>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='state' />
              </Form.Label>
              <Controller
                name='sState'
                control={control}
                render={({ field: { onChange, value = selectedState || [], ref } }) => (
                  <Select
                    ref={ref}
                    value={value}
                    options={listOfStates}
                    className={`react-select ${errors?.sState && 'error'}`}
                    classNamePrefix='select'
                    onChange={(e) => {
                      onChange(e)
                      setSelectedState(e)
                    }}
                    isDisabled={selectedCountry === undefined}
                  />
                )}
              />
              {errors.sState && <Form.Control.Feedback type='invalid'>{errors.sState.message}</Form.Control.Feedback>}
            </Form.Group>
          </Col>
          <Col sm='4'>
            <Form.Group className='form-group'>
              <Form.Label>
                <FormattedMessage id='city' />
              </Form.Label>
              <Controller
                name='sCity'
                control={control}
                render={({ field: { onChange, value = selectedCity || [], ref } }) => (
                  <Select
                    ref={ref}
                    value={value}
                    options={listOfCities}
                    className={`react-select ${errors?.sCity && 'error'}`}
                    classNamePrefix='select'
                    onChange={(e) => {
                      onChange(e)
                    }}
                    isDisabled={selectedState === undefined}
                  />
                )}
              />
              {errors.sCity && <Form.Control.Feedback type='invalid'>{errors.sCity.message}</Form.Control.Feedback>}
            </Form.Group>
          </Col>
          <div className='add-border'>
            <h5 className='title-text title-font mb-3'>
              <FormattedMessage id='subscriptionDetails' />
            </h5>
            <Row>
              <Col sm='4'>
                <Form.Group className='form-group'>
                  <Form.Label>
                    <FormattedMessage id='type' />*
                  </Form.Label>
                  <Controller
                    name='aSubscriptionType'
                    control={control}
                    {...register('aSubscriptionType', {
                      required: validationErrors.required
                    })}
                    render={({ field: { onChange, value = clientDetail?.oSubscription?.aSubscriptionType || [], ref } }) => (
                      <Select
                        ref={ref}
                        value={value}
                        options={SUBSCRIPTION_TYPES}
                        isMulti
                        isSearchable
                        isClearable
                        className={`react-select ${errors?.aSubscriptionType && 'error'}`}
                        classNamePrefix='select'
                        closeMenuOnSelect={false}
                        onChange={(e) => {
                          onChange(e)
                          setSelectedSubscriptionType(e)
                        }}
                      />
                    )}
                  />
                  {errors.aSubscriptionType && (
                    <Form.Control.Feedback type='invalid'>{errors.aSubscriptionType.message}</Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              {selectedSubscriptionType?.length !== 0 && (
                <Col sm='4'>
                  <Form.Group className='form-group'>
                  <Form.Label>
                    <FormattedMessage id='apiCount' />*
                  </Form.Label>
                  <Form.Control
                    type='text'
                    name='nApiTotal'
                    className={errors.nApiTotal && 'error'}
                    {...register('nApiTotal', {
                      required: validationErrors.required
                    })}
                    defaultValue={100}
                  />
                  {errors.nApiTotal && <Form.Control.Feedback type='invalid'>{errors.nApiTotal.message}</Form.Control.Feedback>}
                  </Form.Group>
                </Col>)}
              {selectedSubscriptionType?.length !== 0 &&
                selectedSubscriptionType?.map((item, index) => {
                  if (item.value === 'article') {
                    return (
                      <Col key={index} sm='4'>
                        <Form.Group className='form-group'>
                          <Form.Label>
                            <FormattedMessage id='articleCount' />*
                          </Form.Label>
                          <Form.Control
                            type='text'
                            name='nArticleTotal'
                            className={errors.nArticleTotal && 'error'}
                            {...register('nArticleTotal', {
                              required: validationErrors.required
                            })}
                          />
                          {errors.nArticleTotal && (
                            <Form.Control.Feedback type='invalid'>{errors.nArticleTotal.message}</Form.Control.Feedback>
                          )}
                        </Form.Group>
                      </Col>
                    )
                  } else if (item.value === 'exclusive') {
                    return (
                      <>
                        <Col key={index} sm='4'>
                          <Form.Group className='form-group'>
                            <Form.Label>
                              <FormattedMessage id='exArticleCount' />*
                            </Form.Label>
                            <Form.Control
                              type='text'
                              name='nExclusiveTotal'
                              className={errors.nExclusiveTotal && 'error'}
                              {...register('nExclusiveTotal', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.nExclusiveTotal && (
                              <Form.Control.Feedback type='invalid'>{errors.nExclusiveTotal.message}</Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                        <Col key={index} sm='4'>
                          <Form.Group className='form-group'>
                            <Form.Label>
                              <FormattedMessage id='exArticleSlug' />*
                            </Form.Label>
                            <Form.Control
                              type='text'
                              name='sExclusiveSlug'
                              className={errors.sExclusiveSlug && 'error'}
                              {...register('sExclusiveSlug', {
                                required: validationErrors.required
                              })}
                            />
                            {errors.sExclusiveSlug && (
                              <Form.Control.Feedback type='invalid'>{errors.sExclusiveSlug.message}</Form.Control.Feedback>
                            )}
                          </Form.Group>
                        </Col>
                      </>
                    )
                  } else if (item.value === 'category') {
                    return (
                      <Col key={index} sm='4'>
                        <Form.Group className='form-group'>
                          <Form.Label>
                            <FormattedMessage id='categories' />*
                          </Form.Label>
                          <Controller
                            name='aCategoryIds'
                            control={control}
                            {...register('aCategoryIds', {
                              required: validationErrors.required
                            })}
                            render={({ field: { onChange, value = categoriesList?.filter(item => clientDetail?.oSubscription?.aCategoryIds?.includes(item._id)) || [], ref } }) => (
                              <Select
                                ref={ref}
                                value={value}
                                options={categoriesList}
                                isMulti
                                isSearchable
                                isClearable
                                className={`react-select ${errors?.aCategoryIds && 'error'}`}
                                classNamePrefix='select'
                                closeMenuOnSelect={false}
                                onChange={(e) => {
                                  onChange(e)
                                }}
                              />
                            )}
                          />
                          {errors.aCategoryIds && <Form.Control.Feedback type='invalid'>{errors.aCategoryIds.message}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                    )
                  }
                  return null
                })}
            </Row>
            <Row>
              <Col sm='4'>
                <Form.Group className='form-group'>
                  <Form.Label>
                    <FormattedMessage id='startDate' />*
                  </Form.Label>
                  <Form.Control
                    name='dSubscriptionStart'
                    {...register('dSubscriptionStart', {
                      required: validationErrors.required
                    })}
                    className={errors.dSubscriptionStart && 'error'}
                    type='date'
                    onChange={handleDate}
                  />
                  {errors.dSubscriptionStart && <Form.Control.Feedback type='invalid'>{errors.dSubscriptionStart.message}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col sm='4'>
                <Form.Group className='form-group'>
                  <Form.Label>
                    <FormattedMessage id='endDate' />*
                  </Form.Label>
                  <Form.Control
                    name='dSubscriptionEnd'
                    {...register('dSubscriptionEnd', {
                      required: validationErrors.required
                    })}
                    className={errors.dSubscriptionEnd && 'error'}
                    type='date'
                    onChange={handleDate}
                    min={filterDate?.dSubscriptionStart || convertDateInYDM(clientDetail?.oSubscription?.dSubscriptionStart)}
                  />
                  {errors.dSubscriptionEnd && <Form.Control.Feedback type='invalid'>{errors.dSubscriptionEnd.message}</Form.Control.Feedback>}
                </Form.Group>
              </Col>
              <Col sm='4'>
                <CommonInput
                  type='text'
                  register={register}
                  errors={errors}
                  className={`form-control ${errors.nSubscriptionCost && 'error'}`}
                  name='nSubscriptionCost'
                  label='price'
                  required
                  value={clientDetail?.oSubscription?.nSubscriptionCost}
                />
              </Col>
              {/* <Col sm='4'>
                <Form.Group controlId='formFile' className='form-group'>
                  <Form.Label>
                    <FormattedMessage id='uploadFile' />
                  </Form.Label>
                  <Form.Control
                    name='aUploadFile'
                    {...register('aUploadFile', {
                      required: validationErrors.required
                    })}
                    accept='.docx,.doc,.pdf,.xlsx,.xls,.csv'
                    type='file'
                    onChange={(e) => setFileName(e.target.files)}
                  />
                  {errors.aUploadFile && <Form.Control.Feedback type='invalid'>{errors.aUploadFile.message}</Form.Control.Feedback>}
                </Form.Group>
              </Col> */}
            </Row>
          </div>
        </Row>
        <Button variant='primary' type='submit' className='m-2'>
          <FormattedMessage id={!iClientId ? 'add' : 'save'} />
        </Button>
        </Form>) : (
          <Loading/>)
      }
    </div>
  )
}
export default AddEditClient
