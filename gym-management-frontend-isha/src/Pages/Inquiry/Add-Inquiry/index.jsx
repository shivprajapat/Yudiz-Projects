import React, { useMemo, useState } from 'react'

import { route } from 'Routes/route'
import { Col, Row, Tab, Tabs } from 'react-bootstrap'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'


// component
import InquiryFollowUpList from 'Components/Inquiry-FollowUp'
import DescriptionInput from 'Components/DescriptionInput'
import InquiryVisitList from 'Components/Inquiry-Visit'
import CalendarInput from 'Components/Calendar-Input'
import CustomToolTip from 'Components/TooltipInfo'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Input from 'Components/Input'


// query
import { addInquiry, addInquiryFollowUp, addInquiryVisit, deleteInquiryFollowUp, deleteInquiryVisit, updateInquiry, updateInquiryFollowUp, updateInquiryVisit } from 'Query/Inquiry/inquiry.mutation'
import { getInquiryFollowUpList, getInquiryVisitList, getSpecificInquiry, getSpecificInquiryFollowUp, getSpecificInquiryVisit } from 'Query/Inquiry/inquiry.query'
import { getOrganizationList } from 'Query/Organization/organization.query'
import { getEmployeeList } from 'Query/Employee/employee.query'

// hook
import usePageType from 'Hooks/usePageType'
import Information from 'Assets/Icons/infoIcon'

// icons
import { appendParams, formatDate, parseParams, rules, toaster } from 'helpers'
import './_addInquiry.scss'
import ConfirmationModal from 'Components/ConfirmationModal'

function AddInquiry() {
  const params = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { control, handleSubmit, reset, watch, setValue } = useForm()
  const { control: visitControl, handleSubmit: handleVisitSubmit, reset: resetVisit } = useForm()
  const { control: followUpControl, handleSubmit: handleFollowUpSubmit, reset: resetFollowUp } = useForm()

  const [addEditModal, setAddEditModal] = useState({ open: false, type: '', action: 'add', id: '' })
  const [modalDelete, setModalDelete] = useState({ open: false, type: '' })

  const parsedData = parseParams(location.search)
  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      isBranch: parsedData.isBranch || true,
      eUserType: parsedData.eUserType || 'S',
      inquiryId: params?.id
    }
  }
  const requestParams = useMemo(() => getParams(), [])
  const [requestVisitParams, setRequestVisitParams] = useState(getParams())
  const [requestFollowUpParams, setRequestFollowUpParams] = useState(getParams())

  const { isEdit, id } = usePageType()

  const { data: organizationList } = useQuery('organizations', () => getOrganizationList(), {
    select: (data) => data.data.data.aOrganizationList,
    staleTime: 240000,
    onSuccess: (data) => {
      setValue('iBranchId', data?.find((item) => !item?.isBranch))
    }
  })

  const { isLoading } = useQuery(['inquiryDetails', id], () => getSpecificInquiry(id), {
    enabled: !!id,
    select: (data) => data.data.inquiry,
    onSuccess: (data) => {
      // data.dInquiryAt = formatDate(data.dInquiryAt, '-', true)
      // data.dFollowupDate = formatDate(data.dFollowupDate, '-', true)
      reset({
        sPurpose: data?.sPurpose,
        sDescription: data?.sDescription,
        sPreferredLocation: data?.sPreferredLocation,
        sName: data?.sName,
        sEmail: data?.sEmail,
        sPhone: data?.sPhone,
        sSecondaryPhone: data?.sSecondaryPhone,
        dFollowupDate: formatDate(data.dFollowupDate, '-', true),
        dInquiryAt: formatDate(data.dInquiryAt, '-', true),
        iBranchId: data?.iBranchId,
      })
    },
  })

  const { mutate: mutateAddInquiry } = useMutation((data) => addInquiry(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiry')
      toaster(res.data.message)
      navigate(route.inquiry)
    },
  })

  const updateMutation = useMutation((data) => updateInquiry(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiry')
      toaster(res.data.message)
      navigate(route.inquiry)
    },
  })

  const onSubmit = (data) => {
    if (data?.sSecondaryPhone === "") {
      data.sSecondaryPhone = undefined
    }
    const addData = {
      sPurpose: data?.sPurpose,
      sDescription: data?.sDescription,
      sPreferredLocation: data?.sPreferredLocation,
      sName: data?.sName,
      sEmail: data?.sEmail,
      sPhone: data?.sPhone,
      sSecondaryPhone: data?.sSecondaryPhone,
      dFollowupDate: data?.dFollowupDate,
      dInquiryAt: data?.dInquiryAt,
      iBranchId: data?.iBranchId?._id
    }

    if (isEdit) {
      updateMutation.mutate({ id, addData })
    } else {
      mutateAddInquiry({
        ...data,
        iBranchId: data?.iBranchId?._id,
        oBranch: {
          _id: data?.iBranchId?._id,
          sName: data?.iBranchId?.sName
        },
        sSecondaryPhone: data?.sSecondaryPhone,
      })
    }
  }

  // inquiry Visit
  const visitColumns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Created By', connectionName: 'sUserName', isSorting: false, sort: 0 },
      { name: 'Purpose', connectionName: 'sPurpose', isSorting: false, sort: 0 },
      { name: 'Description', connectionName: 'sDescription', isSorting: false, sort: 0 },
      { name: 'Visited At', connectionName: 'dVistedAt', isSorting: false, sort: 0 },
    ],
    []
  )

  const { data: visit } = useQuery(['inquiryVisit', id, requestVisitParams], () => getInquiryVisitList(id, requestVisitParams), {
    enabled: !!id,
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  const { data: specificVisit } = useQuery(['visitListDetail', addEditModal?.id, addEditModal?.type === 'visit'], () => getSpecificInquiryVisit(addEditModal?.id), {
    enabled: !!addEditModal?.id && !!(addEditModal.type === 'visit'),
    select: (data) => data.data.inquiryVisit,
    onSuccess: (data) => {
      data.dVisitedAt = formatDate(data.dVisitedAt, '-', true)
      resetVisit(data)
    },
  })

  const { mutate: mutateAddVisit } = useMutation((data) => addInquiryVisit(data), {
    onSuccess: (res) => {
      toaster(res.data.message)
      setAddEditModal({ open: false, type: 'visit' })
      queryClient.invalidateQueries('inquiryVisit')
      // navigate(route.inquiryAddViewEdit(isEdit && ('edit', id)))
    },
  })

  const { mutate: mutateUpdateVisit } = useMutation((data) => updateInquiryVisit(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiryVisit')
      toaster(res.data.message)
      setAddEditModal({ open: false, type: 'visit' })
      // navigate(route.inquiryAddViewEdit(isEdit && ('edit', id)))
    },
  })

  const { mutate: deleteVisitMutation } = useMutation(() => deleteInquiryVisit(modalDelete.id, modalDelete.inquiryId), {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('inquiryVisit')
      setModalDelete({ open: false, type: 'visit' })
    },
  })

  const onVisitSubmit = (onSubmitData) => {
    const addData = {
      sPurpose: onSubmitData.sPurpose,
      sDescription: onSubmitData.sDescription,
      dVisitedAt: onSubmitData.dVisitedAt,
      iInquiryID: requestParams.inquiryId
    }
    if (addEditModal.action === 'edit') {
      mutateUpdateVisit({ addEditModal, addData })
      setAddEditModal({ open: true, type: 'visit', action: 'edit' })
    } else {
      mutateAddVisit({
        addData
      })
      setAddEditModal({ open: true, type: 'visit', action: 'add' })
    }
  }

  function gotoAdd(data) {
    resetVisit(data)
    setAddEditModal({ open: true, type: 'visit', action: 'add' })
  }

  function gotoEdit(id) {
    setAddEditModal({ open: true, type: 'visit', action: 'edit', id: id })

    resetVisit({
      sPurpose: specificVisit?.sPurpose,
      dVisitedAt: formatDate(specificVisit?.dVisitedAt),
      sDescription: specificVisit?.sDescription,
    })
  }

  function onDelete(id) {
    setModalDelete({ open: true, type: 'visit', id, inquiryId: requestParams?.inquiryId })
  }

  // inquiry followUp
  const followUpColumns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'FollowedUp By', connectionName: 'sFollowedUpBy', isSorting: false, sort: 0 },
      { name: 'Response', connectionName: 'sResponse', isSorting: false, sort: 0 },
      { name: 'FollowedUp At', connectionName: 'dFollowupAt', isSorting: false, sort: 0 },
      { name: 'Next FollowedUp At', connectionName: 'nextFollowupAt', isSorting: false, sort: 0 },
    ],
    []
  )

  const { data: followUp } = useQuery(['inquiryFollowup', id, requestFollowUpParams], () => getInquiryFollowUpList(id, requestFollowUpParams), {
    enabled: !!id,
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  const { data: specificFollowUp } = useQuery(['followUpListDetail', addEditModal?.id, addEditModal?.type === 'followUp'], () => getSpecificInquiryFollowUp(addEditModal?.id), {
    enabled: !!addEditModal?.id && !!(addEditModal.type === 'followUp'),
    select: (data) => data.data.inquiry,
    onSuccess: (data) => {
      const FollowUpName = followUp?.aInquiryFollowupList?.find(item => item?.iFollowupBy)
      const name = FollowUpName?.oFollowupBy

      resetFollowUp({
        dCreatedDate: data?.dCreatedDate,
        dFollowupAt: formatDate(data.dFollowupAt, '-', true),
        dUpdatedDate: data?.dUpdatedDate,
        eStatus: data?.eStatus,
        iCreatedBy: data?.iCreatedBy,
        iFollowupBy: name,
        iInquiryID: data?.iInquiryID,
        sResponse: data?.sResponse,
        nFollowupInDay: data?.nFollowupInDay
      })
    },
  })

  const { data: employeeList } = useQuery(['employees'], () => getEmployeeList(requestParams), {
    enabled: addEditModal.action === 'add' || !!addEditModal?.id,
    select: (data) => data.data.data.aEmployeeList,
    staleTime: 240000,
  })

  const { mutate: mutateAddFollowUp } = useMutation((data) => addInquiryFollowUp(data), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiryFollowup')
      toaster(res.data.message)
      setAddEditModal({ open: false, type: 'followUp' })
      navigate(route.inquiryAddViewEdit(isEdit && ('edit', id)))
    },
  })

  const { mutate: mutateUpdateFollowUp } = useMutation((followUpId, onSubmitData) => updateInquiryFollowUp(followUpId, onSubmitData), {
    onSuccess: (res) => {
      queryClient.invalidateQueries('inquiryFollowup')
      toaster(res.data.message)
      setAddEditModal({ open: false, type: 'followUp' })
      navigate(route.inquiryAddViewEdit(isEdit && ('edit', id)))
    },
  })

  const { mutate: deleteFollowUpMutation } = useMutation((deleteId) => deleteInquiryFollowUp(deleteId), {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModalDelete({ open: false, type: 'followUp' })
      queryClient.invalidateQueries('inquiryFollowup')
    },
  })

  const onFollowUpSubmit = (onSubmitData) => {
    if (onSubmitData?.nFollowupInDay === "") {
      onSubmitData.nFollowupInDay = undefined
    }
    const addData = {
      sResponse: onSubmitData.sResponse,
      dFollowupAt: onSubmitData.dFollowupAt,
      iFollowupBy: onSubmitData.iFollowupBy._id,
      iInquiryID: requestParams?.inquiryId,
      nFollowupInDay: onSubmitData?.nFollowupInDay
    }

    if (addEditModal.action === 'edit') {
      mutateUpdateFollowUp({
        addEditModal,
        addData
      })
      setAddEditModal({ open: true, type: 'followUp', action: 'edit' })
    } else {
      mutateAddFollowUp({
        addData
      })
      setAddEditModal({ open: true, type: 'followUp', action: 'add' })
    }
  }

  function gotoFollowUpAdd(data) {
    resetFollowUp(data)
    setAddEditModal({ open: true, type: 'followUp', action: 'add' })
  }

  function gotoFollowUpEdit(id) {
    setAddEditModal({ open: true, type: 'followUp', action: 'edit', id: id })
    const filteredData = followUp?.addInquiryFollowUp?.find(item => item._id === id)
    resetFollowUp({
      sResponse: specificFollowUp?.sResponse,
      dFollowupAt: formatDate(specificFollowUp?.dFollowupAt),
      iFollowupBy: filteredData?.oFollowupBy?.sName,
    })
  }

  function onDeleteFollowUp(id) {
    setModalDelete({ open: true, id, type: 'followUp' })
  }

  const permissions = {
    CREATE: 'noRole',
    READ: 'noRole',
    UPDATE: 'noRole',
    DELETE: 'noRole',
    EXCEL: 'noRole',
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  function changeVisitPage(page) {
    setRequestVisitParams({ ...requestVisitParams, page, limit: requestVisitParams?.limit || 10 })
    appendParams({ ...requestVisitParams, page: page / requestVisitParams?.limit, limit: requestVisitParams?.limit || 10 })
  }

  function changeVisitPageSize(pageSize) {
    setRequestVisitParams({ ...requestVisitParams, page: 0, limit: pageSize })
    appendParams({ ...requestVisitParams, page: 0, limit: pageSize })
  }

  function changeFollowUpPage(page) {
    setRequestFollowUpParams({ ...requestFollowUpParams, page, limit: requestFollowUpParams?.limit || 10 })
    appendParams({ ...requestFollowUpParams, page: page / requestFollowUpParams?.limit, limit: requestFollowUpParams?.limit || 10 })
  }

  function changeFollowUpPageSize(pageSize) {
    setRequestFollowUpParams({ ...requestFollowUpParams, page: 0, limit: pageSize })
    appendParams({ ...requestFollowUpParams, page: 0, limit: pageSize })
  }

  function handleDelete(modalInfo) {
    modalInfo.type === 'visit' ? deleteVisitMutation(modalInfo.id, modalInfo.inquiryId) : deleteFollowUpMutation(modalInfo.id)
  }

  function handleCancel(modalInfo) {
    modalInfo.type === 'visit' ? setModalDelete({ open: false, type: 'visit' }) : setModalDelete({ open: false, type: 'followUp' })
  }

  function handleAddEditClose(modalInfo) {
    modalInfo.type === 'visit' ? setAddEditModal({ open: false, type: 'visit', action: modalInfo.action }) : setAddEditModal({ open: false, type: 'followUp', action: modalInfo.action })
  }

  return (
    <>
      <Wrapper>
        <PageTitle
          title={'Inquiry details'}
          className={'mb-3'}
        />

        <Tabs className='project-tabs'>

          <Tab eventKey={1} title={inquiryDetails()}>
            <Wrapper transparent isLoading={mutateAddInquiry.isAddingInquiry || updateMutation.isLoading}>

              <PageTitle
                cancelText="Cancel"
                BtnText={isEdit ? 'Update' : 'Save'}
                handleButtonEvent={handleSubmit(onSubmit)}
                cancelButtonEvent={() => navigate(route.inquiry)}
              />


              <Row className="mt-3">
                <Col lg={6} md={6} sm={6} xs={12}>
                  <Controller
                    name="sName"
                    control={control}
                    rules={rules?.global('Customer Name')}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        labelText='Customer Name'
                        isImportant={true}
                        placeholder="Enter Customer Name"
                        id="sName"
                        errorMessage={error?.message}
                        type="text"
                      />
                    )}
                  />
                </Col>
                <Col lg={6} md={6} sm={6} xs={12}>
                  <Controller
                    name="sEmail"
                    control={control}
                    rules={rules?.email('Email')}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        labelText='Email'
                        isImportant={true}
                        placeholder="eg.: example@gmail.com"
                        id="sEmail"
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
              </Row>

              <Row>
                <Col lg={6} md={6} sm={6} xs={12}>
                  <Controller
                    name="sPhone"
                    control={control}
                    rules={rules?.contact('Contact number')}
                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                      return (
                        <Input
                          ref={ref}
                          info={<Information />}
                          tooltipContent='Contact Number must not contain any space in between, also it should not contain any parenthesis.'
                          onChange={onChange}
                          value={value}
                          labelText='Contact Number'
                          isImportant={true}
                          type="text"
                          placeholder="eg.: 9876543210"
                          id="sPhone"
                          errorMessage={error?.message}
                        />
                      )
                    }
                    }
                  />
                </Col>
                <Col lg={6} md={6} sm={6} xs={12}>
                  <Controller
                    name="sSecondaryPhone"
                    control={control}
                    render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
                      return (
                        <Input
                          ref={ref}
                          info={<Information />}
                          tooltipContent='Contact Number must not contain any space in between, also it should not contain any parenthesis.'
                          onChange={onChange}
                          value={value}
                          labelText="Secondary Contact Number"
                          type="text"
                          placeholder="eg.: 9876543210"
                          id="sSecondaryPhone"
                          errorMessage={error?.message}
                        />
                      )
                    }
                    }
                  />
                </Col>
              </Row>

              <Row className="mt-xs-3">
                <Col lg={6} md={6} sm={6} xs={12}>
                  <Controller
                    name="sPurpose"
                    control={control}
                    rules={rules?.global('Purpose field')}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        labelText='Purpose'
                        isImportant={true}
                        placeholder="Enter Purpose"
                        id="sPurpose"
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
                <Col lg={6} md={6} sm={6} xs={12} className="mt-md-0">
                  <Controller
                    name="sPreferredLocation"
                    control={control}
                    rules={rules?.global('Preferred Location')}
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        {...field}
                        labelText='Preferred Location'
                        isImportant={true}
                        placeholder="Enter Location"
                        id="sPreferredLocation"
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
              </Row>

              <Row>
                <Col lg={6} md={6} sm={6} xs={12} className="mt-md-0">
                  <Controller
                    name="dInquiryAt"
                    control={control}
                    rules={rules?.global('Inquiry Date')}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <CalendarInput
                        id="dInquiryAt"
                        onChange={onChange}
                        value={value}
                        ref={ref}
                        errorMessage={error?.message}
                        title='Inquiry Date'
                        isImportant={true}
                      />
                    )}
                  />
                </Col>
                <Col lg={6} md={6} sm={6} xs={12} className="mt-md-0">
                  <Controller
                    name="dFollowupDate"
                    control={control}
                    rules={rules?.global('Followup Date')}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <CalendarInput
                        id="dFollowupDate"
                        onChange={onChange}
                        min={watch('dInquiryAt')}
                        value={value}
                        ref={ref}
                        errorMessage={error?.message}
                        title='FollowUp Date'
                        isImportant={true}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} xs={12} className="mt-md-0">
                  <Controller
                    name="iBranchId"
                    control={control}
                    rules={rules?.select('Branch')}
                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                      <>
                        <Select
                          labelText='Branch'
                          isImportant={true}
                          id="iBranchId"
                          placeholder="Select Branch"
                          onChange={onChange}
                          value={value}
                          getOptionLabel={(option) => option?.sName}
                          getOptionValue={(option) => option?._id}
                          ref={ref}
                          errorMessage={error?.message}
                          options={organizationList}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>

              <Row>
                <Col lg={12} md={12} xs={12} className="mt-md-2 mt-2">
                  <Controller
                    name="sDescription"
                    control={control}
                    rules={rules?.global('Description field')}
                    render={({ field, fieldState: { error } }) => (
                      <>
                        <DescriptionInput
                          className="p-2 text-dark"
                          label='Description'
                          isImportant={true}
                          errorMessage={error?.message}
                          placeholder="Enter Description"
                          {...field}
                        />
                      </>
                    )}
                  />
                </Col>
              </Row>
            </Wrapper>
          </Tab>

          {
            id &&
            <Tab eventKey={2} title={inquiryVisit()}  >
              <InquiryVisitList
                requestParams={requestVisitParams}
                data={visit}
                onPageChange={changeVisitPage}
                onLimitChange={changeVisitPageSize}
                permissions={permissions}
                gotoAdd={gotoAdd}
                gotoEdit={gotoEdit}
                onDelete={onDelete}
                columns={visitColumns}
                isLoading={isLoading || mutateAddVisit.isLoading}
                addEditModal={addEditModal}
                visitControl={visitControl}
                handleVisitSubmit={handleVisitSubmit}
                handleAddEditClose={handleAddEditClose}
                onVisitSubmit={onVisitSubmit}
              />
            </Tab>
          }

          {
            id &&
            <Tab eventKey={3} title={inquiryFollowUp()}>
              <InquiryFollowUpList
                requestParams={requestFollowUpParams}
                data={followUp}
                onPageChange={changeFollowUpPage}
                onLimitChange={changeFollowUpPageSize}
                permissions={permissions}
                gotoAdd={gotoFollowUpAdd}
                gotoEdit={gotoFollowUpEdit}
                onDelete={onDeleteFollowUp}
                columns={followUpColumns}
                isLoading={isLoading || mutateAddFollowUp.isLoading}
                id={id}
                addEditModal={addEditModal}
                followUpControl={followUpControl}
                handleFollowUpSubmit={handleFollowUpSubmit}
                handleAddEditClose={handleAddEditClose}
                onFollowUpSubmit={onFollowUpSubmit}
                employeeList={employeeList}
              />
            </Tab>
          }
        </Tabs>

      </Wrapper>

      <ConfirmationModal
        title='Are You Sure?'
        open={modalDelete.open}
        handleClose={() => handleCancel(modalDelete)}
        handleCancel={() => handleCancel(modalDelete)}
        handleConfirm={() => handleDelete(modalDelete)}
        isLoading={deleteVisitMutation.isLoading || deleteFollowUpMutation.isLoading}
      >
        <h6>{modalDelete.type === 'visit' ? 'Are you sure you want to delete Inquiry Visit?' : 'Are you sure you want to delete FollowUp Inquiry?'}</h6>
      </ConfirmationModal>

    </>
  )
}

export default AddInquiry


function inquiryDetails() {
  return (
    <div className="tab-item nav-item">
      <button>1</button>
      <p className="nav-link">Inquiry Basic Details</p>
    </div>
  )
}

function inquiryVisit() {
  return (
    <div className="tab-item nav-item">
      <button>2</button>
      <p className="nav-link">Inquiry Visit</p>
      <CustomToolTip tooltipContent={'inquiry visit is usually the initial contact or visit made by someone to gather information'} position='top'>
        {({ target }) => (
          <span
            className='input-info-icon'
            ref={target}
          >
            <Information />
          </span>
        )}
      </CustomToolTip>
    </div>
  )
}

function inquiryFollowUp() {
  return (
    <div className="tab-item nav-item">
      <button>3</button>
      <p className="nav-link">Inquiry FollowUp</p>
      <CustomToolTip tooltipContent={'inquiry follow-up refers to the subsequent actions taken after an initial inquiry visit'} position='top'>
        {({ target }) => (
          <span
            className='input-info-icon'
            ref={target}
          >
            <Information />
          </span>
        )}
      </CustomToolTip>
    </div>
  )
}