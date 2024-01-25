import React, { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { Row, Col } from 'react-bootstrap'
import { addClient, updateClient } from 'Query/Client/client.mutation'
import { getSpecificClient } from 'Query/Client/client.query'
import Input from 'Components/Input'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import InterviewEditor from 'Components/Editor'
import Select from 'Components/Select'
import { Loading } from 'Components'
import { countries, onlyInt, toaster } from 'helpers'
import './_new-client.scss'

const AddClient = () => {
  const navigate = useNavigate()

  const [otherInfo, setOtherInfo] = useState('')

  const rules = {
    global: (value = 'This field is Required') => ({
      required: value,
    }),
    maxLength: (length = 10) => ({
      maxLength: {
        value: length,
        message: `Mobile Number cannot exceed ${length} characters`,
      },
    }),
  }


  const mutation = useMutation((data) => addClient(data), {
    onSuccess: () => {
      toaster('Client Added Successfully', 'success')
      navigate('/client-management')
    },
  })
  const updateMutation = useMutation((data) => updateClient(data), {
    onSuccess: () => {
      toaster('Client updated Successfully', 'success')
      navigate('/client-management')
    },
  })

  const { control, reset, handleSubmit } = useForm()

  const onSubmit = (data) => {
    const clientData = {
      sName: data.clientName,
      sMobNum: data.clientContactNumber,
      sEmail: data.employeeEmailId,
      sCountry: data.country.name,
      sOtherInfo: otherInfo,
    }
    if (type === 'edit') {
      updateMutation.mutate({ id, clientData })
    } else {
      mutation.mutate(clientData)
    }
  }
  const editorRef = useRef(null)
  const { type, id } = useParams()

  useQuery('editClient', () => getSpecificClient(id), {
    enabled: type === 'edit',
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
  })

  if (mutation.isLoading || updateMutation.isLoading) {
    return <Loading />
  }
  return (
    <section className="add-client">
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
          <Row className="mt-3">
            <Col lg={5} md={6}>
              <Col lg={12} md={12}>
                <Controller
                  name="clientName"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input {...field} labelText={'Client Name'} placeholder={'Enter Client Name'} id={'clientName'} errorMessage={error?.message} />
                  )}
                />
              </Col>
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="employeeEmailId"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Input
                      {...field}
                      labelText={'Email ID'}
                      placeholder={'Enter Email ID'}
                      id={'employeeEmailId'}
                      errorMessage={error?.message}
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
                  rules={rules.global()}
                  render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                    <Input
                      onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                      value={value}
                      ref={ref}
                      labelText={'Contact Number'}
                      placeholder={'Enter Contact Number'}
                      id={'clientContactNumber'}
                      errorMessage={error?.message}
                      maxLength={10}
                    />
                  )}
                />
              </Col>
              <Col lg={12} md={12} className="mb-3">
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: 'This field is required' }}
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      labelText="Country"
                      placeholder="Select Country"
                      height={40}
                      id="country"
                      ref={field.ref}
                      value={field?.value}
                      onChange={field.onChange}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.code}
                      errorMessage={error?.message}
                      options={Object.entries(countries).map(([key, value]) => ({ name: key, code: value }))}
                    />
                  )}
                />
              </Col>
            </Col>
            <Col lg={10} md={12}>
              <div className="input mb-0">
                <label className="form-label">Other Information</label>
                <InterviewEditor editorRef={editorRef} setDesc={setOtherInfo} defaultContent={otherInfo} />
              </div>
            </Col>
          </Row>
        </form>
      </Wrapper>
    </section>
  )
}

export default AddClient
