/* eslint-disable no-unused-vars */
import DataTable from 'admin/shared/components/data-table'
import React, { useEffect, useState } from 'react'
import Row from './Row'
import './index.scss'
import { Button, Col, Form, Modal, Row as ModalRow } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { validationErrors } from 'shared/constants/validationErrors'
import { createApiUserData, deleteApiUserData, listApiUsersData, updateApiUserData } from './redux/service'
import ConfirmationModal from 'shared/components/confirmation-modal'
import { EMAIL, URL_REGEX } from 'shared/constants'
import Phone from 'shared/components/phone'

const ApiList = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    clearErrors,
    control
  } = useForm({ mode: 'all' })

  const [apiData, setApiData] = useState([])
  const [selectedApi, setSelectedApi] = useState({})
  const [isAddModal, setIsAddModal] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(null)
  const [requestParams, setRequestParams] = useState({ page: 1, perPage: 10 })
  const [paginationData, setPaginationData] = useState({})
  const columns = [
    { name: 'name', internalName: 'name', type: 0 },
    { name: 'description', internalName: 'description', type: 0 },
    { name: 'link', internalName: 'link', type: 0 },
    { name: 'status', internalName: 'status', type: 0 }
  ]

  useEffect(() => {
    getApiUserData()
  }, [requestParams])

  const handleStatusChange = async (data) => {
    try {
      const response = await updateApiUserData({ ...data, isBlocked: !data.isBlocked }, data.id)
      if (response.status === 200) {
        setApiData(response?.data.result?.apiUsers || [])
        setIsConfirmOpen(null)
        getApiUserData()
      }
    } catch (error) {
      console.log('error', error)
    }
  }
  const handleClose = () => {
    setIsAddModal(!isAddModal)
    resetForm()
    setSelectedApi({})
  }

  const handleEdit = (data) => {
    setSelectedApi(data)
    setIsAddModal(true)
    setValue('name', data.name)
    setValue('email', data.email)
    setValue('phoneNumber', data.phoneNumber)
    setValue('description', data.description)
    setValue('link', data.link)
  }

  const deleteApiUser = async () => {
    try {
      const response = await deleteApiUserData(isConfirmOpen.id)
      if (response.status === 200) {
        setApiData(response?.data.result?.apiUsers || [])
        setIsConfirmOpen(null)
        getApiUserData()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const getApiUserData = async (data) => {
    try {
      const response = await listApiUsersData(requestParams)
      if (response.status === 200) {
        setApiData(response?.data.result?.apiUsers || [])
        setPaginationData({
          ...(response?.data?.result?.metaData || {})
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const resetForm = () => {
    reset({
      name: '',
      email: '',
      phoneNumber: '',
      description: '',
      link: ''
    })
    clearErrors('name')
    clearErrors('email')
    clearErrors('phoneNumber')
    clearErrors('description')
    clearErrors('link')
  }

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      phoneNumber: data.phoneNumber.split('/')[0],
      role: 'apiUser'
    }
    try {
      let response = {}
      if (selectedApi.id) {
        response = await updateApiUserData(payload, selectedApi.id)
      } else {
        response = await createApiUserData(payload)
      }
      if (response.status === 200) {
        resetForm()
        getApiUserData()
        handleClose()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  function handlePageEvent(page) {
    setRequestParams({ ...requestParams, page: page })
  }

  return (
    <>
      <h2 className="admin-heading">API Integration</h2>
      <div className="admin-apis">
        <div className='d-flex justify-content-end'>
          <Button className='admin-filter-btn btn btn-primary' onClick={() => setIsAddModal(true)} >Add API</Button>
        </div>
        {isConfirmOpen && (
          <ConfirmationModal
            show={isConfirmOpen}
            handleConfirmation={deleteApiUser}
            handleClose={handleClose}
            title={'Delete API user'}
            description={'Are you sure you want to delete this API user?'}
          />
        )}
        {
          isAddModal ? <Modal
            show={isAddModal}
            backdrop="static"
            onHide={handleClose}
            animation={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="communities-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>{selectedApi.id ? 'Edit' : 'Add'} API</Modal.Title>
            </Modal.Header>
            <Form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
              <Modal.Body>
                <ModalRow md={6}>
                  <Col xl="6">
                    <Form.Group className="form-group mt-2">
                      <Form.Label>Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        className={errors.name && 'error'}
                        disabled={selectedApi.id}
                        {...register('name', {
                          required: validationErrors.required
                        })}
                      />
                      {errors.name && (
                        <Form.Control.Feedback type="invalid" className="invalidFeedback">
                          {errors.name.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xl="6">
                    <Form.Group className="form-group mt-2">
                      <Form.Label>Email*</Form.Label>
                      <Form.Control
                        type="text"
                        name="email"
                        className={errors.email && 'error'}
                        {...register('email', {
                          required: validationErrors.required,
                          pattern: {
                            value: EMAIL,
                            message: validationErrors.email
                          }
                        })}
                      />
                      {errors.email && (
                        <Form.Control.Feedback type="invalid" className="invalidFeedback">
                          {errors.email.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xl="6">
                    <Form.Group className="form-group mt-2">
                      <Phone
                        control={control}
                        className={errors.phoneNumber && 'error'}
                        name="phoneNumber"
                        required={true}
                        errors={{
                          ...errors,
                          phone: errors.phoneNumber
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col xl="6">
                    <Form.Group className="form-group mt-2">
                      <Form.Label>Description*</Form.Label>
                      <Form.Control
                        type="text"
                        name="description"
                        className={errors.description && 'error'}
                        {...register('description', {
                          required: validationErrors.required,
                          maxLength: {
                            value: 200,
                            message: validationErrors.maxLength(200)
                          }
                        })}
                      />
                      {errors.description && (
                        <Form.Control.Feedback type="invalid" className="invalidFeedback">
                          {errors.description.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xl="6">
                    <Form.Group className="form-group mt-2">
                      <Form.Label>Link*</Form.Label>
                      <Form.Control
                        type="text"
                        name="link"
                        className={errors.link && 'error'}
                        {...register('link', {
                          required: validationErrors.required,
                          pattern: { value: URL_REGEX, message: validationErrors.url }
                        })}
                      />
                      {errors.link && (
                        <Form.Control.Feedback type="invalid" className="invalidFeedback">
                          {errors.link.message}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>
                </ModalRow>
              </Modal.Body>
              <Modal.Footer>
                <Button className="secondary-white-border-btn" onClick={handleClose} >
                  <FormattedMessage id="close" />
                </Button>
                <Button className="white-btn" type="submit" >
                  {selectedApi.id ? <FormattedMessage id="update" /> : <FormattedMessage id="create" />}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal> : null
        }
        <DataTable
          className="api-user-list"
          columns={columns}
          totalRecord={paginationData.totalItems}
          header={{
            left: {
              rows: true
            },
            right: {
              search: false,
              filter: false
            }
          }}
          pageChangeEvent={handlePageEvent}
          pagination={{ currentPage: requestParams.page, pageSize: requestParams.perPage }}
          actionColumn={true}
        >
          {
            apiData && apiData.length > 0 ? (
              apiData?.map((apiUser, index) => {
                return <Row
                  key={apiUser.id}
                  index={index}
                  apiUser={apiUser}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEdit}
                  onDelete={(apiUser) => setIsConfirmOpen(apiUser)}
                />
              })
            ) : null
          }
        </DataTable>
      </div>
    </>
  )
}

export default ApiList
