import React, { useEffect, useRef, useState } from 'react'

// component
import CreateClient from 'Components/Offcanvas/CreateClient'
import AlterImage from 'Components/AlterImage'
import PageTitle from 'Components/Page-Title'
import AlertModal from 'Components/Alert'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Input from 'Components/Input'

// query
import { addProject, updateProject } from 'Query/Project/project.mutation'
import { addProjectTags, addTechnology } from 'Query/Common/common.query'
import { getAllCurrencies } from 'Query/Currency/currency.query'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from 'App'

// icons
import cameraIcon from 'Assets/Icons/camara.svg'
import iconLogo from 'Assets/Icons/logo.svg'

// helper
import { addNewOption, appendParams, handleAlterImage, handleErrors, projectStatus, projectStatusLabel, toaster } from 'helpers'

// hooks
import useResourceDetails from 'Hooks/useResourceDetails'
import { Controller, useForm } from 'react-hook-form'

import { useNavigate, useParams } from 'react-router-dom'
import { route } from 'Routes/route'

import { Row, Col, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './_basic.scss'

function BasicDetails({ setProjectType, formData, setPage, keyValue, projectType }) {
  const navigate = useNavigate()
  const { type, id } = useParams()

  const { control, reset, handleSubmit, setError, setValue, watch } = useForm()
  const [projectImage, setProjectImage] = useState('')
  const [modal, setModal] = useState({ open: false })
  const profilePic = useRef({ sLogo: '' })

  // get currencies
  const { loading: isCurrenciesLoading, data: allCurrencies } = useQuery(['currencies'], getAllCurrencies, {
    select: (data) => data?.data?.data?.currency,
  })

  // post Project
  const mutation = useMutation(addProject, {
    onSuccess: (data) => {
      setPage('2')
      navigate(route.projectEdit(data.data.data.projectId, 'edit'))
      toaster('Project Created Successfully')
    },
    onError: (error) => {
      Array.isArray(error.response.data.errors) && handleErrors(error.response.data.errors, setError)
    },
  })

  // update project
  const updateMutation = useMutation(updateProject, {
    onSuccess: (data) => {


      if (data?.data?.data?.eProjectStatus === projectStatusLabel.closed) {
        setModal({ open: true })
      }
      setPage('2')
      queryClient.invalidateQueries('getProjectDetails')
      toaster('Project Updated Successfully')

    },
    onError: (error) => handleErrors(error.response.data.errors, setError),
  })

  const { resourceDetail, handleScroll, data, handleSearch, createNewOption } = useResourceDetails([
    'technology',
    'client',
    'projectManager',
    'ba',
    'bde',
    'projectTag',
    'employee'
  ])

  const addTechnologyMutation = useMutation(addTechnology, {
    onSuccess: () => toaster('Technology added successfully'),
  })
  const addProjectTagMutation = useMutation(addProjectTags, {
    onSuccess: () => toaster('project tag added successfully'),
  })



  function onSubmit(e) {
    const {
      eProjectType,
      sName,
      iBAId,
      iBDEId,
      aClient,
      iProjectManagerId,
      aTechnology,
      aProjectTag,
      eProjectStatus,
      sProjectDescription,
      iCurrencyId,
      iEstimateBy
    } = e

    const resData = {
      flag: 1,
      sName,
      sProjectDescription,
      eProjectType: eProjectType?.label,
      iProjectManagerId: iProjectManagerId?._id,
      iBAId: iBAId?._id,
      iBDId: iBDEId?._id,
      aTechnology: aTechnology?.map((d) => ({ iTechnologyId: d._id })),
      aProjectTag: aProjectTag?.map((d) => ({ iProjectTagId: d._id })),
      aClient: aClient?.map((d) => ({ iClientId: d._id })),
      eProjectStatus: eProjectStatus?.label,
      iCurrencyId: iCurrencyId._id,
      iEstimateBy: iEstimateBy?._id
    }

    if (type === 'edit') {
      updateMutation.mutate({
        ...resData,
        imageData: profilePic.current.sLogo || formData?.sLogo,
        iProjectId: id,
      })
    } else {
      // if (!profilePic?.current?.sLogo) {
      mutation.mutate({ ...resData, imageData: profilePic.current?.sLogo })
      // } else {
      //   toaster('please add project image')
      // }
    }
  }

  function handleImageChange(e) {
    profilePic.current.sLogo = e.target.files[0]
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProjectImage(reader.result)
      }
    }
    reader?.readAsDataURL(e.target.files[0])
  }

  function getDetail(property) {
    return { ...data[property], data: resourceDetail?.[property] }
  }
  function handleClose() {
    setModal({ open: false })
  }

  //project types
  const ProjectTypes = [
    { label: 'Fixed', value: 'Fixed' },
    { label: 'Dedicated', value: 'Dedicated' },
  ]
  const [ProjectStatus, setProjectStatus] = useState(projectStatus)

  useEffect(() => {
    if (formData && type === 'edit') {
      const {
        sCurrency,
        eProjectType,
        sName,
        BA,
        BD,
        sClient,
        ProjectManager,
        technology,
        projecttag,
        flag,
        eProjectStatus,
        sProjectDescription,
        Estimator
      } = formData
      if (flag['1'] === 'Y') {
        setPage('2')
      }
      setProjectType(eProjectType)
      const { associate } = projectStatus.find((status) => status?.value === eProjectStatus)
      setProjectStatus(projectStatus.filter((s) => associate?.includes(s.index)))
      reset({
        sName,
        sProjectDescription,
        eProjectType: { label: eProjectType, value: eProjectType },
        iBAId: BA?._id && { sName: BA?.sEmployeeName, _id: BA?._id },
        iBDEId: { sName: BD?.sEmployeeName, _id: BD?._id },
        iProjectManagerId: ProjectManager?._id && { sName: ProjectManager?.sEmployeeName, _id: ProjectManager?._id },
        aClient: sClient?.map((d) => ({ sName: d.sClientName, _id: d._id })),
        aTechnology: technology?.map((d) => ({ sName: d?.sTechnologyName, _id: d?._id })),
        aProjectTag: projecttag?.map((d) => ({ ...d, sName: d?.sProjectTagName, _id: d?._id })),
        eProjectStatus: { label: eProjectStatus, value: eProjectStatus },
        iCurrencyId: sCurrency,
        iEstimateBy: Estimator?._id && { sName: Estimator?.sEmployeeName, _id: Estimator?._id }
      })
      formData.sLogo && setProjectImage('https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + formData.sLogo)
    } else {
      setValue('eProjectType', { label: 'Dedicated', value: 'Dedicated' })
    }
  }, [formData])

  function handleCancel() {
    navigate(route.projects)
    appendParams({ eProjectType: projectType })
  }
  const [showOffcanvas, setShowOffcanvas] = useState({ client: false })
  function handleCloseOffcanvas(name) {
    setShowOffcanvas({ [name]: false })
  }
  function handleShowOffcanvas({ name, data }) {
    setShowOffcanvas({ [name]: true, data })
  }

  return (
    <>
      <Wrapper transparent isLoading={mutation.isLoading || updateMutation.isLoading}>
        <Row>
          <Col xxl={12} lg={12}>
            <div className="user-profile">
              <div className="profile">
                <div className="profile-img">
                  {projectImage ? (
                    <img
                      src={projectImage}
                      onError={(e) => handleAlterImage(e, iconLogo, true)}
                      alt="project Image"
                      className="img-fluid"
                    />
                  ) : (
                    <AlterImage text={watch('sName')} />
                  )}
                </div>
              </div>
              <div className="icon" style={{ cursor: 'pointer !important' }}>
                <img style={{ cursor: 'pointer !important' }} src={cameraIcon} alt="camara" className="camera-icon" />
                <input type="file" id="file" onChange={handleImageChange} accept=".png, .jpg, .jpeg" />
              </div>
            </div>
          </Col>
          <Col lg={10}>
            <Row>
              <Col lg={6} md={6}>
                <Col lg={12} md={12} className="mb-3">
                  <Controller
                    name="sName"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Input
                        onChange={onChange}
                        value={value}
                        ref={ref}
                        labelText="Project Name*"
                        placeholder="Enter Project Name"
                        id="sName"
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
                <Col lg={12} md={12} className="mb-3">
                  <Controller
                    name="eProjectType"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        onChange={(e) => {
                          setProjectType(e.value)
                          onChange(e)
                        }}
                        value={value}
                        ref={ref}
                        errorDisable
                        labelText="Type of Project"
                        placeholder="Select Project Type"
                        id="eProjectType"
                        errorMessage={error?.message}
                        options={ProjectTypes}
                        isDisabled={(type === 'edit') && formData?.eProjectStatus !== projectStatusLabel.pending}
                      />
                    )}
                  />
                </Col>
                <Col lg={12} md={12} className="mb-3">
                  <Controller
                    name="eProjectStatus"
                    control={control}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        onChange={onChange}
                        value={value}
                        ref={ref}
                        labelText="Project status"
                        placeholder="Select Project status"
                        id="eProjectStatus"
                        errorMessage={error?.message}
                        options={type !== 'edit' ? [{ label: projectStatusLabel.pending, value: projectStatusLabel.pending }] : ProjectStatus}
                      />
                    )}
                  />
                </Col>

                <Col lg={12} md={12} className="mb-3">
                  <Controller
                    name="iBAId"
                    control={control}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="BA"
                        id="iBAId"
                        placeholder="Select BA"
                        getOptionLabel={(option) => option?.sName}
                        getOptionValue={(option) => option?._id}
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        fetchMoreData={() => handleScroll('ba')}
                        isLoading={getDetail('ba')?.isLoading}
                        options={getDetail('ba').data}
                        isEmployeeSelector={true}
                      />
                    )}
                  />
                </Col>
                <Col lg={12} md={12} className="mb-3">
                  <Controller
                    name="iBDEId"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="BDE*"
                        id="iBDEId"
                        placeholder="Select BDE"
                        getOptionLabel={(option) => option?.sName}
                        getOptionValue={(option) => option?._id}
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        onInputChange={(s) => handleSearch('bde', s)}
                        fetchMoreData={() => handleScroll('bde')}
                        isLoading={getDetail('bde')?.isLoading}
                        options={getDetail('bde').data}
                        isEmployeeSelector={true}
                      />
                    )}
                  />
                </Col>
                <Col lg={12} md={12} className="mb-3">
                  <Controller
                    name="aClient"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="Client*"
                        placeholder="Select Client"
                        closeMenuOnSelect={false}
                        isMulti
                        onCreateOption={(data) => handleShowOffcanvas({ name: 'client', data })}
                        CreateOptionLabel="sName"
                        CreateOptionValue="_id"
                        getOptionLabel={(option) => option?.sName}
                        getOptionValue={(option) => option?._id}
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        onInputChange={(s) => handleSearch('client', s)}
                        fetchMoreData={() => handleScroll('client')}
                        isLoading={getDetail('client')?.isLoading}
                        options={getDetail('client').data}
                      />
                    )}
                  />
                </Col>
                <Col lg={12} md={12} className="mb-3">
                  <Controller
                    name="iEstimateBy"
                    control={control}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="Estimation By"
                        id="iEstimateBy"
                        placeholder="Select Estimation By"
                        getOptionLabel={(option) => option?.sName}
                        getOptionValue={(option) => option?._id}
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        onInputChange={(s) => handleSearch('employee', s)}
                        fetchMoreData={() => handleScroll('employee')}
                        isLoading={getDetail('employee')?.isLoading}
                        options={getDetail('employee').data}
                        isEmployeeSelector={true}
                      />
                    )}
                  />
                </Col>
              </Col>
              <Col lg={6} md={6}>
                <Col lg={12} md={12}>
                  <Row>
                    <Form>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Controller
                          name="sProjectDescription"
                          control={control}
                          render={({ field: { onChange, value, ref } }) => (
                            <Form.Control
                              as="textarea"
                              onChange={onChange}
                              value={value}
                              ref={ref}
                              maxLength={500}
                              placeholder="Enter Description"
                              className="p-2 text-dark description"
                            />
                          )}
                        />
                      </Form.Group>
                    </Form>
                  </Row>
                </Col>
                <Col lg={12} md={12} className="form-dropdown">
                  <Controller
                    name="iProjectManagerId"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="Project Manager"
                        placeholder="Select Project Manager"
                        id="iProjectManagerId"
                        getOptionLabel={(option) => option?.sName}
                        getOptionValue={(option) => option?._id}
                        ref={ref}
                        errorDisable
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        onInputChange={(s) => handleSearch('projectManager', s)}
                        fetchMoreData={() => handleScroll('projectManager')}
                        isLoading={getDetail('projectManager')?.isLoading}
                        options={getDetail('projectManager').data}
                        isEmployeeSelector={true}
                      />
                    )}
                  />
                </Col>
                <Col xs={12} lg={12} md={12} className="form-dropdown">
                  <Controller
                    name="aTechnology"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="Technology*"
                        placeholder="Select Technology"
                        closeMenuOnSelect={false}
                        isMulti
                        onCreateOption={(input) =>
                          addNewOption({ value: input, module: 'technology', createNewOption }, addTechnologyMutation, (opt) =>
                            onChange([...(value?.length ? value : []), opt])
                          )
                        }
                        CreateOptionLabel="sName"
                        CreateOptionValue="_id"
                        getOptionLabel={(option) => option?.sName}
                        getOptionValue={(option) => option?._id}
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        onInputChange={(s) => handleSearch('technology', s)}
                        fetchMoreData={() => handleScroll('technology')}
                        isLoading={getDetail('technology')?.isLoading || addTechnologyMutation.isLoading}
                        options={getDetail('technology').data}
                      />
                    )}
                  />
                </Col>
                <Col lg={12} md={12}>
                  <Controller
                    name="aProjectTag"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="Project Tag*"
                        placeholder="Select Project Tag"
                        closeMenuOnSelect={false}
                        isMulti
                        isSearchable
                        onCreateOption={(input) =>
                          addNewOption({ value: input, module: 'projectTag', createNewOption }, addProjectTagMutation, (opt) =>
                            onChange([...(value?.length ? value : []), opt])
                          )
                        }
                        CreateOptionLabel="sName"
                        CreateOptionValue="_id"
                        getOptionLabel={(option) => option?.sName}
                        getOptionValue={(option) => option?._id}
                        isColored
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                        fetchMoreData={() => handleScroll('projectTag')}
                        isLoading={getDetail('projectTag')?.isLoading || addProjectTagMutation.isLoading}
                        options={getDetail('projectTag').data}
                        onInputChange={(s) => handleSearch('projectTag', s)}
                      />
                    )}
                  />
                </Col>
                <Col lg={12} md={12} className="mt-3">
                  <Controller
                    name="iCurrencyId"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <Select
                        labelText="Payment Currency*"
                        id="iCurrencyId"
                        placeholder="Select Payment Currency"
                        getOptionLabel={(option) => option?.sSymbol ? `${option?.sName} (${option?.sSymbol})` : option?.sName}
                        getOptionValue={(option) => option?._id}
                        options={allCurrencies}
                        isLoading={isCurrenciesLoading}
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
              </Col>
            </Row>
            <PageTitle
              className="my-4"
              cancelText="Cancel"
              cancelButtonEvent={handleCancel}
              BtnText={keyValue !== '3' ? 'Save & Next' : 'Save'}
              handleButtonEvent={handleSubmit(onSubmit)}
            />
          </Col>
        </Row>
        <CreateClient
          show={showOffcanvas.client}
          data={showOffcanvas.data}
          onSuccess={(data) => createNewOption('client', data)}
          handleClose={() => handleCloseOffcanvas('client')}
        />
      </Wrapper>

      <AlertModal
        open={modal.open}
        title='Alert'
        handleClose={handleClose}
        handleCancel={handleClose}
      >
        <h6>Now you can see this project in Closed Project module</h6>
      </AlertModal>
    </>
  )
}

BasicDetails.propTypes = {
  reset: PropTypes.func,
  control: PropTypes.func,
  setHandleSubmitFunc: PropTypes.func,
  setProjectType: PropTypes.func,
  setPage: PropTypes.func,
  projectType: PropTypes.string,
  keyValue: PropTypes.string,
  formData: PropTypes.object,
}

export default BasicDetails
