import React, { useRef } from 'react'
import './_new-client.scss'

import Input from 'Components/Input'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Loading } from 'Components'
import { Row, Col } from 'react-bootstrap'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import InterviewEditor from 'Components/Editor'
import Select from 'Components/Select'
import { countries, toaster } from 'helpers/helper'
import { addClient, updateClient } from 'Query/Client/client.mutation'
import { getSpecificClient } from 'Query/Client/client.query'
import { useState } from 'react'

const validationSchema = yup.object().shape({
  clientName: yup.string().required('Client Name is required'),
  clientContactNumber: yup.string().required('Client Number is required'),
  employeeEmailId: yup.string().email('must be email').required('Email ID is required'),
  country: yup
    .object()
    .shape({
      name: yup.string().required('Country is required'),
      code: yup.string().required('Country is required'),
    })
    .nullable(),
})
const AddClient = () => {
  const navigate = useNavigate()

  const [otherInfo, setOtherInfo] = useState('')

  const mutation = useMutation((data) => addClient(data), {
    onSuccess: () => {
      toaster('Client Added Successfully')
      navigate('/client-management')
    },
  })
  const updateMutation = useMutation((data) => updateClient(data), {
    onSuccess: () => {
      toaster('Client updated Successfully')
      navigate('/client-management')
    },
  })

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const onSubmit = (data) => {
    console.log('DATA', data)
    const clientData = {
      sName: data.clientName,
      sMobNum: data.clientContactNumber,
      sEmail: data.employeeEmailId,
      sCountry: data.country.name,
      sOtherInfo: editorRef.current && editorRef.current.getContent(),
    }
    console.log(editorRef.current.getContent())
    if (type === 'edit') {
      updateMutation.mutate({ id, clientData })
    } else {
      mutation.mutate(clientData)
    }
  }
  const editorRef = useRef(null)
  const { type, id } = useParams()

  if (type === 'edit') {
    useQuery('editClient', () => getSpecificClient(id), {
      // retry: false,
      select: (data) => {
        return data?.data?.data
      },
      onSuccess: (data) => {
        setOtherInfo(data?.sOtherInfo)
        reset({
          clientName: data.sName,
          clientContactNumber: data.sMobNum,
          employeeEmailId: data.sEmail,
          country: { name: data?.sCountry, code: data?.sCountry },
        })
      },
      refetchOnWindowFocus: false,
    })
  }

  if (mutation.isLoading || updateMutation.isLoading) {
    return <Loading />
  }
  return (
    <section className="add-interviews">
      <Wrapper>
        <div className="pageTitle-head">
          <PageTitle
            title="Client Details"
            cancelText="Cancel"
            BtnText="Save"
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate('/client-management')}
          />
        </div>
        <form className="interviews-form">
          <Row>
            <Col lg={5} md={6}>
              <Col lg={12} md={12}>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      labelText={'Client Name'}
                      placeholder={'Select'}
                      id={'clientName'}
                      errorMessage={errors?.clientName?.message}
                    />
                  )}
                />
              </Col>
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="employeeEmailId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      labelText={'Email ID'}
                      type={'text'}
                      placeholder={'Enter Email'}
                      id={'employeeEmailId'}
                      errorMessage={errors?.employeeEmailId?.message}
                    />
                  )}
                />
              </Col>
            </Col>
            <Col lg={5} md={6}>
              <Col lg={12} md={12}>
                <Controller
                  name="clientContactNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      labelText={'Contact Number'}
                      type={'number'}
                      placeholder={'Enter Contact Number'}
                      id={'clientContactNumber'}
                      errorMessage={errors?.clientContactNumber?.message}
                    />
                  )}
                />
              </Col>
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelText="Country"
                      id="country"
                      value={
                        type
                          ? { name: field?.value?.name, code: field?.value?.code }
                          : !!field?.value === false
                          ? null
                          : { name: field?.value?.name || 'select', code: field?.value?.code || '' }
                      }
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.code}
                      errorMessage={errors.country?.label?.message}
                      options={countries}
                    />
                  )}
                />
              </Col>
            </Col>
            <Col lg={10} md={12}>
              <div className="input mb-0">
                <label className="form-label">Other Information</label>
                <InterviewEditor editorRef={editorRef} defaultContent={otherInfo} />
              </div>
            </Col>
          </Row>
        </form>
      </Wrapper>
    </section>
  )
}

export default AddClient
