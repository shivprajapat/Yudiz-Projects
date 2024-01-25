import React, { useCallback, useMemo, useState } from 'react'

import { useMutation, useQuery } from 'react-query'
import { queryClient } from 'queryClient'
import { useForm } from 'react-hook-form'

// query
import { getDesignation, getDesignationById } from 'Query/Designation/designation.query'
import { deleteDesignation } from 'Query/Designation/designation.mutation'

// component
import ConfirmationModal from 'Components/ConfirmationModal'
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import Wrapper from 'Components/wrapper'
import Divider from 'Components/Divider'
import Search from 'Components/Search'

import AddDesignation from './Add-Designation'

// icons
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

// hook
import { debounce } from 'Hooks/debounce'

// helper
import { appendParams, cell, isGranted, parseParams, toaster } from 'helpers'


function Designation() {

    const parsedData = parseParams()

    const { control, handleSubmit, reset, setError } = useForm()

    const [requestParams, setRequestParams] = useState(getParams)
    const [search, setSearch] = useState(parsedData?.search)
    const [modal, setModal] = useState({ addOpen: false })
    const columns = useMemo(() => [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Title', connectionName: 'sTitle', isSorting: false, sort: 0 },
    ])


    // get designation data
    const { data, isLoading } = useQuery({
        queryKey: ['designation', requestParams],
        queryFn: () => getDesignation(requestParams),
        select: (data) => data?.data?.data
    })

    // get designation by ID
    const { isLoading: designationByIdLoading } = useQuery({
        queryKey: ['designationById', modal?.id],
        queryFn: () => getDesignationById(modal?.id),
        select: (data) => data?.data?.oDesignation,
        onSuccess: (data) => {
            reset({
                sTitle: data?.sTitle
            })
        },
        enabled: !!modal?.id
    })

    // delete designation 
    const deleteMutation = useMutation(deleteDesignation, {
        onSuccess: (data) => {
            handleCloseDeleteModal()
            toaster(data?.data?.message)
            queryClient.invalidateQueries('designation')
        }
    })

    function handleAddData() {
        reset({
            sTitle: ''
        })
        setModal({ addOpen: open })
    }

    function handleAddClose() {
        setModal({ addOpen: false })
    }

    function handleEdit(id) {
        setModal({ addOpen: open, id })
    }

    function handleDelete(deleteId) {
        setModal({ deleteOpen: open, deleteId })
    }

    function handleCloseDeleteModal() {
        setModal({ deleteOpen: false })
    }

    const debouncedSearch = useCallback(
        debounce((trimmed) => {
            setRequestParams({ ...requestParams, page: 0, search: trimmed })
            appendParams({ ...requestParams, page: 0, search: trimmed })
        }),
        []
    )

    function handleSearch(e) {
        e.preventDefault()
        setSearch(e.target.value)
        const trimmed = e.target.value.trim()
        debouncedSearch(trimmed)
    }

    function changePage(page) {
        setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
        appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
    }

    function changePageSize(pageSize) {
        setRequestParams({ ...requestParams, page: 0, limit: pageSize })
        appendParams({ ...requestParams, page: 0, limit: pageSize })
    }

    function getParams() {
        return {
            page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
            limit: Number(parsedData?.limit) || 10,
            search: parsedData?.search || '',
            sort: parsedData.sort || '',
            order: parsedData.order || '',
        }
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

    return (
        <>
            <Wrapper>

                <PageTitle
                    title={'Designation'}
                    BtnText={isGranted(permissions.CREATE) ? 'Add Designation' : null}
                    handleButtonEvent={handleAddData}
                    add
                />

                <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
                    <div className="d-flex align-items-center gap-2">
                        <Search
                            startIcon={<SearchIcon className="mb-1" />}
                            style={{ width: '250px', height: '40px' }}
                            placeholder="Search Designation"
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <Divider width={'155%'} height="1px" />


                <DataTable
                    columns={columns}
                    totalData={data?.aDesignationList?.length}
                    isLoading={isLoading}
                >
                    {
                        data?.aDesignationList?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{cell(requestParams.page + (index + 1))}</td>
                                    <td>{cell(item?.sTitle)}</td>
                                    <ActionColumn
                                        permissions={permissions}
                                        handleEdit={() => handleEdit(item._id)}
                                        handleDelete={() => handleDelete(item._id)}
                                    />
                                </tr>
                            )
                        })
                    }
                </DataTable>
            </Wrapper>

            <Wrapper transparent>
                <TablePagination
                    currentPage={Number(requestParams?.page)}
                    totalCount={data?.count || 0}
                    pageSize={requestParams?.limit || 5}
                    onPageChange={(page) => changePage(page)}
                    onLimitChange={(limit) => changePageSize(limit)}
                />
            </Wrapper>

            <AddDesignation
                modal={modal}
                control={control}
                setError={setError}
                handleClose={handleAddClose}
                handleSubmit={handleSubmit}
                designationByIdLoading={designationByIdLoading}
            />

            <ConfirmationModal
                open={modal.deleteOpen}
                title="Are you sure"
                handleClose={handleCloseDeleteModal}
                handleCancel={handleCloseDeleteModal}
                isLoading={deleteMutation?.isLoading}
                handleConfirm={() => deleteMutation.mutate(modal?.deleteId)}
            >
                <h6>Are you sure you want to delete?</h6>
            </ConfirmationModal>


        </>
    )
}

export default Designation