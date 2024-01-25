import React, { useState, useCallback } from 'react'

//component
import GoogleAutocompleteInput from 'Components/GoogleAutocompleteInput'
import ConfirmationModal from 'Components/ConfirmationModal'
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import TextArea from 'Components/TextArea'
import CustomModal from 'Components/Modal'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Button from 'Components/Button'
import Input from 'Components/Input'
import Search from 'Components/Search'

//query
import { addBranchData, deleteBranchData, updateBranchData } from 'Query/Branch/branch.mutation'
import { updateOrganizationDetails } from 'Query/Organization/organization.mutation'
import { getBranchDetails, getBranchDetailsById } from 'Query/Branch/branch.query'
import { getOrganizationDetails } from 'Query/Organization/organization.query'
import { useMutation, useQuery } from 'react-query'
import { getState } from 'Query/State/state'
import { getCity } from 'Query/City/city'

//helper
import { appendParams, cell, isGranted, onlyInt, parseParams, permissionsName, toaster } from 'helpers'
import { handleErrors } from 'helpers'

//hooks
import useResourceDetails from 'Hooks/useResourceDetails'
import { debounce } from 'Hooks/debounce'

import { Controller, useForm } from 'react-hook-form'
import { Col, Row, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { queryClient } from 'queryClient'
import './_OfficeMaster.scss'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

const OfficeMasterManagement = () => {
  const navigate = useNavigate()
  const parsedData = parseParams(location.search)

  const { control, handleSubmit, reset } = useForm()
  const { control: modalControl, handleSubmit: modalHandleSubmit, setError: modalSetError, reset: modalReset, setValue: modalSetValue } = useForm()

  const [organizationId, setOrganizationId] = useState('')
  const [selectBranchesDropDownData, setSelectBranchesDropDowndata] = useState({
    selectCountry: null,
    selectState: null,
  })
  const [modal, setModal] = useState({ open: false })
  const [deleteModal, setDeleteModal] = useState({ open: false })
  const [latLng, setLatLng] = useState({
    lat: null,
    lng: null
  })
  const [requestParams, setRequestParams] = useState(getParams())
  const [search, setSearch] = useState(parsedData?.search)

  const rules = {
    global: (value = 'This field is Required') => ({ required: value }),
  }

  const { resourceDetail, handleScroll, handleSearch: handleSearchDetail, data: d } = useResourceDetails(['country'])
  function getDetail(property) {
    return { ...d[property], data: resourceDetail?.[property] }
  }

  //get OrganizationDetails
  useQuery({
    queryKey: ['organizationDetail'],
    queryFn: () => getOrganizationDetails(),
    select: (data) => data?.data?.data?.details,
    onSuccess: (d) => {
      setOrganizationId(d?._id)
      reset({
        sOrgName: d.sName,
        sWorkinghour: d.nHoursPerDay,
        sWorkingDaysInmonth: d.nDaysPerMonth,
      })
    },
  })

  //update OrganizationDetails
  const updateOrganization = useMutation(updateOrganizationDetails, {
    onSuccess: (data) => {
      toaster(data?.data?.message)
      queryClient.invalidateQueries('organizationDetail').then(() => {
        const timeout = setTimeout(() => {
          handleModalClose()
          clearTimeout(timeout)
        }, 100)
      })
    },
    onError: (error) => {
      handleErrors(error.response.data.errors, modalSetError)
      queryClient.invalidateQueries('organizationDetail')
    },
  })

  //get state
  const { data: state } = useQuery({
    queryKey: ['state', selectBranchesDropDownData.selectCountry?._id],
    queryFn: () => getState(selectBranchesDropDownData.selectCountry?._id, { limit: 500 }),
    enabled: !!selectBranchesDropDownData.selectCountry?._id,
    select: (data) => data?.data?.data?.state,
  })

  //get city
  const { data: city } = useQuery({
    queryKey: ['city', selectBranchesDropDownData.selectState?._id],
    queryFn: () => getCity(selectBranchesDropDownData.selectCountry?._id, selectBranchesDropDownData.selectState?._id, { limit: 500 }),
    enabled: !!selectBranchesDropDownData.selectState?._id,
    select: (data) => data?.data?.data?.city,
  })

  //get branch details
  const { data: branchDetails, refetch: branchRefetch } = useQuery({
    queryKey: ['getBranchDetail', requestParams],
    queryFn: () => getBranchDetails(requestParams),
    select: (data) => data?.data?.data,
  })

  //get branch details by ID
  useQuery({
    queryKey: ['getBranchIdDetail', modal?.id],
    queryFn: () => getBranchDetailsById(modal?.id),
    enabled: !!modal?.id,
    select: (data) => data?.data?.data?.organizationBranch,
    onSuccess: (d) => {
      setSelectBranchesDropDowndata({ selectCountry: d?.iCountryId, selectState: d?.iStateId })
      modalReset({
        sBranchName: d?.sName,
        country: d?.iCountryId,
        sState: d?.iStateId,
        sCity: d?.iCityId,
        sAddress: d?.sAddress,
        sOfficeDescription: d?.sDescription,
        bIsHeadquarter: d?.bIsHeadquarter,
        sSeatingCaapacity: d?.nSeatingCapacity,
        sLatitude: d?.sLatitude,
        sLongitude: d?.sLongitude,
      })
    },
  })

  //post branch data
  const addBranchMutation = useMutation(addBranchData, {
    onSuccess: () => {
      setModal({ open: false })
      toaster('Branch Added Successfully')
      queryClient.invalidateQueries('getBranchDetail').then(() => {
        const timeout = setTimeout(() => {
          handleModalClose()
          clearTimeout(timeout)
        }, 100)
      })
    },
    onError: (error) => {
      handleErrors(error.response.data.errors, modalSetError)
    },
  })

  //update branch data
  const updateBranchMutation = useMutation(updateBranchData, {
    onSuccess: () => {
      setModal({ open: false })
      toaster('Branch Updated Successfully')
      queryClient.invalidateQueries('getBranchDetail').then(() => {
        const timeout = setTimeout(() => {
          handleModalClose()
          clearTimeout(timeout)
        }, 100)
      })
    },
    onError: (error) => {
      handleErrors(error.response.data.errors, modalSetError)
    },
  })

  //delete branch
  const deleteBranchMutation = useMutation(deleteBranchData, {
    onSuccess: (data) => {
      toaster(data.data.message)
      branchRefetch()
    },
    onError: () => {
      setDeleteModal({ open: false })
    }
  })

  function handleModalClose() {
    modalReset(modalControl)
    setModal({ open: false })
  }

  const handleDeleteModalClose = () => {
    setDeleteModal({ open: false })
  }

  const handleDeleteModalCancel = () => {
    setDeleteModal({ open: false })
  }

  const handleDeleteModalConfirm = () => {
    setDeleteModal({ open: false })
    if (deleteModal?.id) [deleteBranchMutation.mutate(deleteModal?.id)]
  }

  const debouncedSearch = useCallback(
    debounce((trimmed, params) => {
      setRequestParams({ ...params, page: 0, search: trimmed })
      appendParams({ ...params, page: 0, search: trimmed })
    }),
    []
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed, requestParams)
  }

  const onSubmit = (e) => {
    const { sOrgName, sWorkinghour, sWorkingDaysInmonth } = e
    const data = {
      sName: sOrgName,
      nHoursPerDay: sWorkinghour,
      nDaysPerMonth: sWorkingDaysInmonth,
    }
    if (organizationId) {
      updateOrganization.mutate({
        id: organizationId,
        data,
      })
    } else {
      toaster('Contact Admin for Update Organization Detail')
    }
  }

  const modalOnSubmit = (e) => {
    const { sBranchName, country, sState, sCity, sAddress, sOfficeDescription, bIsHeadquarter, sSeatingCaapacity } = e
    const data = {
      sName: sBranchName,
      sAddress: sAddress,
      sDescription: sOfficeDescription,
      sLatitude: latLng?.lat,
      sLongitude: latLng?.lng,
      iStateId: sState?._id,
      iCountryId: country?._id,
      iCityId: sCity?._id,
      bIsHeadquarter: bIsHeadquarter,
      nSeatingCapacity: parseInt(sSeatingCaapacity),
    }

    if (modal.id) {
      updateBranchMutation.mutate({
        ibranchId: modal?.id,
        data,
      })
    } else {
      addBranchMutation.mutate(data)
    }
  }

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: parsedData?.limit === 'all' ? 'all' : (Number(parsedData?.limit) || 5),
      search: parsedData?.search || '',
    }
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  const permissions = {
    UPDATE: permissionsName.UPDATE_ORGANIZATION_BRANCH,
    DELETE: permissionsName.DELETE_ORGANIZATION_BRANCH,
    ORG_UPDATE: permissionsName.UPDATE_ORGANIZATION_DETAILS,
    CREATE: permissionsName.CREATE_ORGANIZATION_BRANCH,
    get ALL() {
      return [this.UPDATE, this.DELETE]
    },
  }

  return (
    <>
      <Wrapper>
        <section>
          <PageTitle
            title="Office Master Details"
            BtnText={isGranted(permissions.ORG_UPDATE) ? 'Update' : null}
            handleButtonEvent={handleSubmit(onSubmit)}
            cancelButtonEvent={() => navigate('/office-master-management')}
          />
          <div>
            <form>
              <div className="row mt-3">
                <div className="col-md-4 mb-2">
                  <Controller
                    name="sOrgName"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Input
                        onChange={onChange}
                        value={value || ''}
                        ref={ref}
                        labelText={'Organization Name*'}
                        placeholder={'Enter Organization Name'}
                        id={'sOrgName'}
                        errorMessage={error?.message}
                        disabled={!isGranted(permissions.ORG_UPDATE)}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 offset-md-1 mb-2">
                  <Controller
                    name="sWorkinghour"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Input
                        onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                        value={value || ''}
                        ref={ref}
                        labelText={'Working hours per day*'}
                        placeholder={'Enter working hours per day'}
                        id={'sWorkinghour'}
                        errorMessage={error?.message}
                        disabled={!isGranted(permissions.ORG_UPDATE)}
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 mb-2">
                  <Controller
                    name="sWorkingDaysInmonth"
                    control={control}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Input
                        onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                        value={value || ''}
                        ref={ref}
                        labelText={'Working days per month*'}
                        placeholder={'Enter working days per month'}
                        id={'sWorkingDaysInmonth'}
                        errorMessage={error?.message}
                        disabled={!isGranted(permissions.ORG_UPDATE)}
                      />
                    )}
                  />
                </div>

              </div>
            </form>
          </div>
        </section>
      </Wrapper>
      {isGranted(permissionsName.VIEW_ORGANIZATION_BRANCH) && (
        <Wrapper>

          <PageTitle
            title="Branches"
            BtnText={isGranted(permissions.CREATE) ? 'Add Branch' : null}
            handleButtonEvent={() => setModal({ open: true })}
          />

          <div className="w-100 d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex flex-end">
              <Search
                startIcon={<SearchIcon className="mb-1" />}
                style={{ width: '250px', height: '40px' }}
                placeholder="Search Branches"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="my-4">
            <DataTable
              columns={[
                { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
                { name: 'Branch Name', connectionName: 'sBranch', isSorting: false, sort: 0 },
                { name: 'Country', connectionName: 'sCountry', isSorting: false, sort: 0 },
                { name: 'Is Headquarter', connectionName: 'bIsHeadquarter', isSorting: false, sort: 0 },
                { name: 'Total Capacity ', connectionName: 'nSeatingCapacity', isSorting: false, sort: 0 },
                { name: 'Available Capacity ', connectionName: 'nAvailableCapacity', isSorting: false, sort: 0 },
              ]}
              align="left"
              totalData={branchDetails?.branch.length}
              actionPadding="25px"
            >

              {branchDetails?.branch?.map((items, i) => (
                <tr key={i}>
                  <td>{cell(requestParams.page + (i + 1))}</td>
                  <td>{cell(items?.sName)}</td>
                  <td>{cell(items?.iCountryId?.sName)}</td>
                  <td>{cell(items?.bIsHeadquarter === true ? 'YES' : 'NO')}</td>
                  <td>{cell(items?.nSeatingCapacity)}</td>
                  <td>{cell(items?.nSeatingCapacity - items?.nCurrentEmployee)}</td>
                  <ActionColumn
                    className="m-0"
                    handleEdit={() => setModal({ open: true, id: items._id })}
                    handleDelete={() => setDeleteModal({ open: true, id: items._id, name: items?.sName })}
                    permissions={permissions}
                  />
                </tr>
              ))}
            </DataTable>
          </div>
          <TablePagination
            currentPage={Number(requestParams?.page)}
            totalCount={branchDetails?.count || 0}
            pageSize={requestParams?.limit || 5}
            onPageChange={(page) => changePage(page)}
            onLimitChange={(limit) => changePageSize(limit)}
          />

          <ConfirmationModal
            open={deleteModal?.open}
            title="Are you sure ?"
            handleClose={handleDeleteModalClose}
            handleCancel={handleDeleteModalCancel}
            handleConfirm={handleDeleteModalConfirm}
          >
            <h6>{deleteModal?.name ? `You want to delete '${deleteModal?.name}' branch ?` : 'You want to delete ?'}</h6>
          </ConfirmationModal>

          <CustomModal open={modal.open} handleClose={handleModalClose} size="xl" title={modal.id ? 'Edit Branch' : 'Add Branch'} isLoading={addBranchMutation?.isLoading || updateBranchMutation?.isLoading}>
            <div className="d-flex flex-column w-100">
              <Row>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <Controller
                    name="sBranchName"
                    control={modalControl}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Input
                        onChange={(e) => onChange(e.target.value)}
                        value={value || ''}
                        ref={ref}
                        labelText={'Branch Name*'}
                        placeholder='Enter branch name'
                        id={'sBranchName'}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <Controller
                    name="country"
                    control={modalControl}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Select
                        ref={ref}
                        placeholder="Select country"
                        labelText="Country*"
                        id="country"
                        value={value}
                        onChange={(selectedOption) => {
                          onChange(selectedOption)
                          modalSetValue('sState', null)
                          modalSetValue('sCity', null)
                          setSelectBranchesDropDowndata({ selectCountry: selectedOption, selectState: null })
                        }}
                        getOptionLabel={(option) => option.sName}
                        getOptionValue={(option) => option._id}
                        errorMessage={error?.message}
                        options={getDetail('country')?.data}
                        isLoading={getDetail('country')?.isLoading}
                        fetchMoreData={() => handleScroll('country')}
                        onInputChange={(s) => handleSearchDetail('country', s)}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <Controller
                    name="sState"
                    control={modalControl}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Select
                        labelText="State*"
                        placeholder="Select state"
                        height={40}
                        id="sState"
                        ref={ref}
                        value={value}
                        onChange={(selectedOption) => {
                          onChange(selectedOption)
                          modalSetValue('sCity', null)
                          setSelectBranchesDropDowndata({ ...selectBranchesDropDownData, selectState: selectedOption })
                        }}
                        getOptionLabel={(option) => option.sName}
                        getOptionValue={(option) => option._id}
                        options={state}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <Controller
                    name="sCity"
                    control={modalControl}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Select
                        labelText="City*"
                        placeholder="Select city"
                        height={40}
                        id="sCity"
                        ref={ref}
                        value={value}
                        onChange={onChange}
                        getOptionLabel={(option) => option.sName}
                        getOptionValue={(option) => option._id}
                        options={city}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Controller
                    name="sAddress"
                    control={modalControl}
                    rules={rules.global()}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <GoogleAutocompleteInput
                        onChange={onChange}
                        value={value || ''}
                        labelText={'Address*'}
                        placeholder={'Enter Address'}
                        id={'sAddress'}
                        error={error?.message}
                        setLatLng={setLatLng}
                        modalSetValue={modalSetValue}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Controller
                    name="sOfficeDescription"
                    control={modalControl}
                    render={({ field: { ref, onChange, value } }) => (
                      <TextArea
                        onChange={onChange}
                        value={value || ''}
                        ref={ref}
                        label={'Description'}
                        placeholder={'Enter Description'}
                        id={'sOfficeDescription'}
                        style={{
                          height: 90
                        }}
                      />
                    )}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={6} className='d-flex align-items-center mb-2'>
                  <Controller
                    name="bIsHeadquarter"
                    control={modalControl}
                    render={({ field: { onChange, value, ref } }) => (
                      <Form.Check
                        type="checkbox"
                        id="bIsHeadquarter"
                        onChange={(e) => onChange(e.target.checked)}
                        checked={value || ''}
                        ref={ref}
                        label="Is Headquarter"
                      />
                    )}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <Controller
                    name="sSeatingCaapacity"
                    control={modalControl}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                      <Input
                        onChange={(e) => onChange(e.target.value.replace(onlyInt, ''))}
                        value={value || ''}
                        ref={ref}
                        labelText={'Seating Capacity*'}
                        placeholder={'Enter Seating Capacity'}
                        id={'sSeatingCaapacity'}
                        errorMessage={error?.message}
                      />
                    )}
                  />
                </Col>
              </Row>

              <div className="mt-3 d-flex justify-content-end">
                <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button onClick={modalHandleSubmit(modalOnSubmit)} loading={false}>
                  Save
                </Button>
              </div>
            </div>
          </CustomModal>
        </Wrapper>
      )}
    </>
  )
}

export default OfficeMasterManagement
