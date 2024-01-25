import React, { useCallback, useState } from 'react'

//component
import ConfirmationModal from 'Components/ConfirmationModal'
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import TextArea from 'Components/TextArea'
import CustomModal from 'Components/Modal'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Search from 'Components/Search'
import Button from 'Components/Button'
import Input from 'Components/Input'

//query
import { getJobProfile, getJobProfileById } from 'Query/JobProfile/jobprofile.query'
import { addJobProfile, deleteJobProfile, updateJobProfile } from 'Query/JobProfile/jobprofile.mutation'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from 'queryClient'

//hooks
import { Controller, useForm } from 'react-hook-form'
import { debounce } from 'Hooks/debounce'

//helper
import { appendParams, getSortedColumns, handleErrors, isGranted, parseParams, permissionsName, toaster } from 'helpers'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

function JobProfile() {
    const parsedData = parseParams(location.search)

    const { control, handleSubmit, reset, setError } = useForm()

    const rules = {
        global: (value = 'This field is Required') => ({ required: value }),
    }
    const Prefix = [
        { label: 'Jr', value: 'Jr' },
        { label: 'Sr', value: 'Sr' },
        { label: 'Head', value: 'Head' },
        { label: 'Lead', value: 'Lead' },
        { label: 'Other', value: 'Other' },
        { label: 'Owner', value: 'Owner' },
        { label: 'Manager', value: 'Manager' },
        { label: 'Superior', value: 'Superior' },
    ]
    const level = [
        { label: '1-CEO', value: 1 },
        { label: '2-CTO', value: 2 },
        { label: '3-FM', value: 3 },
        { label: '4-TL', value: 4 },
        { label: '5-EMP', value: 5 }
    ]

    const [modal, setModal] = useState({ open: false, deleteOpen: false })
    const [requestParams, setRequestParams] = useState(getParams())
    const [search, setSearch] = useState(parsedData?.search)
    const [columns] = useState(
        getSortedColumns(
            [
                { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
                { name: 'Prefix', connectionName: 'prefix', isSorting: false, sort: 0 },
                { name: 'Job Title', connectionName: 'sName', isSorting: false, sort: 0 },
                { name: 'Level', connectionName: 'sLevel', isSorting: false, sort: 0 },
            ]
        )
    )

    //get Job-profile
    const { data: JobProfile } = useQuery({
        queryKey: ['jobprofile', requestParams],
        queryFn: () => getJobProfile(requestParams),
        select: (data) => data?.data?.data,
    })

    //get Job-Profile By Id
    const { data: jobProfileById } = useQuery({
        queryKey: ['getJobProfileById', modal?.id],
        queryFn: () => getJobProfileById(modal.id),
        enabled: !!modal.id,
        select: (data) => data?.data?.data?.jobProfile,
        onSuccess: (d) => {
            reset({
                sName: d?.sName,
                sPrefix: Prefix.find(item => item.value === d?.sPrefix),
                nLevel: level.find(item => item.value === d?.nLevel),
                sDescription: d?.sDescription
            })
        }
    })

    //post Job-Profile
    const addJobProfileMutation = useMutation(addJobProfile, {
        onSuccess: () => {
            toaster('Job Profile Added Successfully')
            queryClient.invalidateQueries('jobprofile').then(() => {
                const timeout = setTimeout(() => {
                    setModal({ open: false })
                    clearTimeout(timeout)
                }, 100)
            })
            reset()
        },
        onError: (error) => {
            handleErrors(error.response.data.errors, setError)
        }
    })

    //upadte Job-Profile
    const updateJobProfileMutation = useMutation(updateJobProfile, {
        onSuccess: () => {
            toaster('Job Profile Updated Successfully')
            queryClient.invalidateQueries('jobprofile').then(() => {
                const timeout = setTimeout(() => {
                    setModal({ open: false })
                    clearTimeout(timeout)
                }, 100)
            })
        },
        onError: (error) => {
            handleErrors(error.response.data.errors, setError)
        }

    })

    //Delete Job-Profile
    const deleteJobProfileMutation = useMutation(deleteJobProfile, {
        onSuccess: (data) => {
            toaster(data.data.message)
            queryClient.invalidateQueries('jobprofile').then(() => {
                const timeout = setTimeout(() => {
                    setModal({ open: false })
                    clearTimeout(timeout)
                }, 100)
            })
        }
    })

    function changePage(page) {
        setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
        appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 5 })
    }

    function changePageSize(pageSize) {
        setRequestParams({ ...requestParams, page: 0, limit: pageSize })
        appendParams({ ...requestParams, page: 0, limit: pageSize })
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


    function handleClose() {
        setModal({ open: false })
        reset({
            sName: null,
            sPrefix: null,
            nLevel: null,
            sDescription: null,
        })
    }

    function onEdit(id) {
        setModal({ open: true, id })
    }

    function onDelete(id) {
        setModal({ deleteOpen: true, id })
    }
    function handleDeleteModalClose() {
        setModal({ deleteOpen: false })

    }

    function handleDeleteModalConfirm() {
        setModal({ deleteOpen: false })
        deleteJobProfileMutation.mutate(modal?.id)
    }

    function OnSubmit(e) {
        const { sName, sPrefix, nLevel, sDescription } = e
        const data = {
            sName,
            sPrefix: sPrefix?.value,
            nLevel: nLevel?.value,
            sDescription
        }
        if (modal.id) {
            updateJobProfileMutation.mutate({
                id: modal.id,
                data
            })
        }
        else {
            addJobProfileMutation.mutate(data)
        }
    }

    const permissions = {
        CREATE: permissionsName.CREATE_JOB_PROFILE,
        DELETE: permissionsName.DELETE_JOB_PROFILE,
        UPDATE: permissionsName.UPDATE_JOB_PROFILE,
        get ALL() {
            return [this.UPDATE, this.DELETE]
        },
    }
    function getParams() {
        return {
            page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
            limit: parsedData?.limit === 'all' ? 'all' : (Number(parsedData?.limit) || 10),
            search: parsedData?.search || '',
            sort: parsedData.sort || '',
            order: parsedData.order || '',
        }
    }
    return (
        <>
            <Wrapper >
                <PageTitle
                    title={'Job Profile'}
                    BtnText={isGranted(permissions.CREATE) ? 'Add Job Profile' : null}
                    handleButtonEvent={() => setModal({ open: true })}
                />
                <div>
                    <Search
                        startIcon={<SearchIcon className="mb-1" />}
                        style={{ width: '250px', height: '40px' }}
                        placeholder="Search Job Title"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>

                <DataTable
                    columns={columns}
                    align='left'
                    disableActions={!isGranted(permissions.ALL)}
                    totalData={JobProfile?.jobProfiles?.length}
                >
                    {
                        JobProfile?.jobProfiles?.map((element, index) => {
                            return (
                                <tr key={index}>
                                    <td>{requestParams.page + (index + 1)}</td>
                                    <td>{element?.sPrefix}</td>
                                    <td>{element?.sName}</td>
                                    <td>{element?.nLevel} - {element?.sLevel}</td>

                                    <ActionColumn
                                        permissions={permissions}
                                        handleEdit={() => onEdit(element._id)}
                                        handleDelete={() => onDelete(element._id)}
                                    />
                                </tr>
                            )
                        })
                    }
                </DataTable>
            </Wrapper>

            <Wrapper
                className={'py-2'}
            >
                <TablePagination
                    currentPage={requestParams?.page || 0}
                    totalCount={JobProfile?.count || 0}
                    pageSize={requestParams?.limit || 10}
                    onPageChange={(page) => changePage(page)}
                    onLimitChange={(limit) => changePageSize(limit)}
                />
            </Wrapper>

            <CustomModal
                open={modal?.open}
                handleClose={handleClose}
                title={modal.id ? 'Edit Job Profile' : 'Add Job Profile'}
                // isLoading={true}
                isLoading={addJobProfileMutation?.isLoading || updateJobProfileMutation?.isLoading}
            >
                <Controller
                    name='sName'
                    control={control}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                        <Input
                            onChange={onChange}
                            value={value || ''}
                            ref={ref}
                            labelText={'Job Title*'}
                            placeholder={'Add Job Title'}
                            id={'sName'}
                            errorMessage={error?.message}
                            disabled={jobProfileById?.bIsSystem}
                        />
                    )}
                />
                <Controller
                    name='sPrefix'
                    control={control}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                        <Select
                            labelText="Prefix*"
                            placeholder="Select Prefix"
                            ref={ref}
                            id='sPrefix'
                            value={value}
                            onChange={onChange}
                            options={Prefix}
                            errorMessage={error?.message}
                            isDisabled={jobProfileById?.bIsSystem}
                        />
                    )}
                />
                <Controller
                    name='nLevel'
                    control={control}
                    rules={rules.global()}
                    render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
                        <Select
                            labelText="Level*"
                            placeholder="Select Level"
                            ref={ref}
                            id='nLevel'
                            value={value}
                            onChange={onChange}
                            options={level}
                            errorMessage={error?.message}
                        />
                    )}
                />
                <Controller
                    name='sDescription'
                    control={control}
                    render={({ field: { ref, onChange, value } }) => (
                        <TextArea
                            onChange={onChange}
                            value={value || ''}
                            ref={ref}
                            label={'Description'}
                            id={'sDescription'}
                            style={{
                                height: 90
                            }}
                        />
                    )}
                />

                <div className="mt-3 d-flex justify-content-end">
                    <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={(handleSubmit(OnSubmit))} loading={false}>
                        Save
                    </Button>
                </div>

            </CustomModal>

            <ConfirmationModal
                open={modal?.deleteOpen}
                title="Are you sure ?"
                handleClose={handleDeleteModalClose}
                handleCancel={handleDeleteModalClose}
                handleConfirm={handleDeleteModalConfirm}
            >
                <h6>Are you sure you want to delete?</h6>
            </ConfirmationModal>
        </>
    )
}

export default JobProfile