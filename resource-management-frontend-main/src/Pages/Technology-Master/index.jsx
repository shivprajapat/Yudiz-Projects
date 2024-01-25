import React, { useCallback, useState } from 'react'

//component
import ConfirmationModal from 'Components/ConfirmationModal'
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Wrapper from 'Components/wrapper'
import Search from 'Components/Search'
import Button from 'Components/Button'
import Input from 'Components/Input'

//query
import { addTechnology, deleteTechnology, updateTechnology } from 'Query/Technology/technology.mutation'
import { getTechnologyByID, getTechnologyList } from 'Query/Technology/technology.query'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from 'queryClient'

//helper
import { appendParams, getSortedColumns, handleErrors, isGranted, parseParams, permissionsName, toaster } from 'helpers'

//hook
import { debounce } from 'Hooks/debounce'
import { Controller, useForm } from 'react-hook-form'

import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import userIcon from 'Assets/Icons/altImage.svg'
import cameraIcon from 'Assets/Icons/camara.svg'
import './_technology.scss'

function TechnologyMaster() {
    const parsedData = parseParams(location.search)

    const { control, handleSubmit, reset, setError } = useForm()

    const rules = {
        global: (value = 'This field is Required') => ({ required: value }),
    }

    const [modal, setModal] = useState({ open: false, deleteOpen: false })
    const [requestParams, setRequestParams] = useState(getParams())
    const [search, setSearch] = useState(parsedData?.search)
    const [projectImage, setProjectImage] = useState(null)
    const [sLogo, setLogo] = useState()
    const [column] = useState(
        getSortedColumns(
            [
                { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
                { name: 'Technology', connectionName: 'sName', isSorting: false, sort: 0 },
            ]
        )
    )

    //get technology
    const { data } = useQuery({
        queryKey: ['getTechnology', requestParams],
        queryFn: () => getTechnologyList(requestParams),
        select: (data) => data?.data?.data
    })

    //get Technology-Profile By Id
    useQuery({
        queryKey: ['getTechnologyById', modal?.id],
        queryFn: () => getTechnologyByID(modal.id),
        enabled: !!modal.id,
        select: (data) => data?.data?.data?.technology,
        onSuccess: (d) => {
            reset({
                sName: d?.sName,
            })
            setProjectImage('https://jr-web-developer.s3.ap-south-1.amazonaws.com/' + d?.sLogo)
        }
    })

    //post Technology
    const addTechnologyMutation = useMutation(addTechnology, {
        onSuccess: () => {
            toaster('Technology Added Successfully')
            queryClient.invalidateQueries('getTechnology').then(() => {
                const timeout = setTimeout(() => {
                    setModal({ open: false })
                    clearTimeout(timeout)
                }, 100)
            })
            reset()
            setProjectImage(null)
        },
        onError: (error) => {
            handleErrors(error.response.data.errors, setError)
        }
    })

    //upadte Technology
    const updateTechnologyMutation = useMutation(updateTechnology, {
        onSuccess: () => {
            toaster('Technology Updated Successfully')
            queryClient.invalidateQueries('getTechnology').then(() => {
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

    //Delete Technology
    const deleteTechnologyMutation = useMutation(deleteTechnology, {
        onSuccess: (data) => {
            toaster(data.data.message)
            queryClient.invalidateQueries('getTechnology').then(() => {
                const timeout = setTimeout(() => {
                    setModal({ open: false })
                    clearTimeout(timeout)
                }, 100)
            })
        }
    })

    function handleClose() {
        setModal({ open: false })
        reset({ control })
        setProjectImage(null)
    }

    function handleImageChange(e) {
        setLogo(e.target.files[0])
        const reader = new FileReader()
        reader.onload = () => {
            if (reader.readyState === 2) {
                setProjectImage(reader.result)
            }
        }
        reader?.readAsDataURL(e.target.files[0])
    }

    function OnSubmit(e) {

        const { sName } = e
        const data = {
            sName,
            sLogo: sLogo || projectImage?.replace('https://jr-web-developer.s3.ap-south-1.amazonaws.com/', ''),
        }
        if (modal.id) {
            updateTechnologyMutation.mutate({
                id: modal.id,
                data
            })
        }
        else {
            addTechnologyMutation.mutate(data)
        }

    }
    function onEdit(id) {
        setModal({ open: true, id })
    }

    function onDelete(id) {
        setModal({ deleteOpen: true, deleteId: id })
    }

    function handleDeleteModalClose() {
        setModal({ deleteOpen: false })
    }

    function handleDeleteModalConfirm() {
        setModal({ deleteOpen: false })
        deleteTechnologyMutation.mutate(modal?.deleteId)
    }

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

    const permissions = {
        CREATE: permissionsName.CREATE_TECHNOLOGY,
        DELETE: permissionsName.DELETE_TECHNOLOGY,
        UPDATE: permissionsName.UPDATE_TECHNOLOGY,
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
            <Wrapper>
                <PageTitle
                    title={'Technology'}
                    BtnText={isGranted(permissions.CREATE) ? 'Add Technology' : null}
                    handleButtonEvent={() => setModal({ open: true })}
                />
                <div>
                    <Search
                        startIcon={<SearchIcon className="mb-1" />}
                        style={{ width: '250px', height: '40px' }}
                        placeholder="Search Technology"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <DataTable
                    columns={column}
                    disableActions={!isGranted(permissions.ALL)}
                    totalData={data?.technology?.length}
                >
                    {
                        data?.technology?.map((element, index) => {
                            return (
                                <tr key={index}>
                                    <td>{requestParams.page + (index + 1)}</td>
                                    <td>{element.sName}</td>

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
                    totalCount={data?.count || 0}
                    pageSize={requestParams?.limit || 10}
                    onPageChange={(page) => changePage(page)}
                    onLimitChange={(limit) => changePageSize(limit)}
                />
            </Wrapper>

            <CustomModal
                open={modal?.open}
                handleClose={handleClose}
                title={modal.id ? 'Edit Technology Profile' : 'Add Technology Profile'}
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
                            labelText={'Technology Title*'}
                            placeholder={'Add Technology Title'}
                            id={'sName'}
                            errorMessage={error?.message}
                        />
                    )}
                />

                <div className="user-profile">
                    <label className='technology-label'>Technology Logo</label>
                    <div className="profile">
                        <div className="profile-img">
                            <img src={projectImage || userIcon} alt="user" className="img-fluid" />
                        </div>
                    </div>
                    <div className="icon" style={{ cursor: 'pointer !important' }}>
                        <img style={{ cursor: 'pointer !important' }} src={cameraIcon} alt="camara" className="camera-icon" />
                        <input type="file" id="file" value={[]} onChange={handleImageChange} accept=".png, .jpg, .jpeg" />
                    </div>
                </div>

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

export default TechnologyMaster