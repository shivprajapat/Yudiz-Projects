/* eslint-disable react/prop-types */
import React, { useCallback, useState } from 'react'

//component
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import Wrapper from 'Components/wrapper'
import Search from 'Components/Search'
import Button from 'Components/Button'

//query
import { updateStatusClosedToProgress } from 'Query/ClosedProject/closedProject.mutation'
import { getClosedStatusProject } from 'Query/ClosedProject/closedProject.query'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from 'queryClient'

//helper
import { appendParams, getSortedColumns, parseParams, permissionsName, projectStatusLabel, toaster } from 'helpers'

//route
import { useNavigate } from 'react-router-dom'
import { route } from 'Routes/route'

import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { debounce } from 'Hooks/debounce'
import './_closedProject.scss'
import ConfirmationModal from 'Components/ConfirmationModal'

function ClosedProject() {
    const parsedData = parseParams(location.search)
    const navigate = useNavigate()

    const [requestParams, setRequestParams] = useState(getParams())
    const [search, setSearch] = useState(parsedData?.search)
    const [modal, setModal] = useState({ open: false })
    const [columns] = useState(
        getSortedColumns(
            [
                { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
                { name: 'Project Name', connectionName: 'sName', isSorting: false, sort: 0 },
                { name: 'Project Type', connectionName: 'eProjectType', isSorting: false, sort: 0, },
                { name: 'Client Name', connectionName: 'client', isSorting: false, sort: 0 },
                { name: 'Technology', connectionName: 'technology', isSorting: false, sort: 0 },
                { name: 'Project Tag', connectionName: 'projectTag', isSorting: false, sort: 0 },
                { name: 'Change Status', connectionName: 'eProjectStatus', isSorting: false, sort: 0 },

            ],
        )
    )

    //get Closed-Project
    const { data } = useQuery({
        queryKey: ['closedProject', requestParams],
        queryFn: () => getClosedStatusProject(requestParams),
        select: (data) => data?.data?.data,
    })

    //update closed to progress
    const UpdateStatusClosedToProgressMutation = useMutation(updateStatusClosedToProgress, {
        onSuccess: () => {
            toaster(`Project Status Changed ${projectStatusLabel.inProgress} successfully`)
            queryClient.invalidateQueries('closedProject')
            navigate(route.projects)
        }
    })


    function handleModalOpen(id) {
        setModal({ open: true, id })

    }

    function handleModalClose() {
        setModal({ open: false })
    }

    function handleConfirm(id) {
        UpdateStatusClosedToProgressMutation.mutate(id)
    }

    function onView(id) {
        navigate(route.closedProjectDetail(id))
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

    function changePage(page) {
        setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
        appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 5 })
    }

    function changePageSize(pageSize) {
        setRequestParams({ ...requestParams, page: 0, limit: pageSize })
        appendParams({ ...requestParams, page: 0, limit: pageSize })
    }

    function MapData({ array, split, property, start = 0, show = 2, end, withoutAdd, tag }) {
        if (!array.length) return '-'
        show = show > array.length ? array.length : show
        return tag ? (
            <>
                {array?.slice(start, show)?.map(({ sTextColor, sBackGroundColor, sProjectTagName }, i) => (
                    <span key={i} style={{ color: sTextColor, backgroundColor: sBackGroundColor }} className="light-blue">
                        {sProjectTagName}
                    </span>
                ))}
                {ExtraData({ array: array?.slice(show), split, property: 'sProjectTagName', start, show, withoutAdd, tag })}
            </>
        ) : (
            <div>
                <span>{array?.slice(start, show)?.map((data, i) => (i === (end || show - 1) ? data[property] : data[property] + split))} </span>
                {ExtraData({ array: array?.slice(show), split, property, start, show, withoutAdd })}
            </div>
        )
    }

    function ExtraData({ array, property }) {
        const length = array.length
        return (
            length > 0 && (
                <OverlayTrigger
                    trigger={["hover", "hover"]}
                    body
                    placement="top-end"
                    overlay={
                        <Popover style={{ borderRadius: '10px' }} id="popover-basic">
                            <div className="d-flex flex-wrap p-1 m-1 px-2" style={{ borderRadius: '10px', border: '0px' }}>
                                {array?.map((item, i) => {
                                    return (
                                        <span
                                            key={i}
                                            style={{ color: item.sTextColor || '', backgroundColor: item.sBackGroundColor || '', margin: '4px' }}
                                            className="light-blue50"
                                        >
                                            {item[property]}
                                        </span>
                                    )
                                })}
                            </div>
                        </Popover>
                    }
                >
                    <span className="badge bg-secondary text-dark cursor-pointer">{` +${length} More`}</span>
                </OverlayTrigger>
            )
        )
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

    const permissions = {
        READ: permissionsName.VIEW_PROJECT,
        get ALL() {
            return [this.READ]
        },
    }

    return (
        <>
            <Wrapper>
                <PageTitle title={'Closed Project'} />

                <div className='mt-2'>
                    <Search
                        startIcon={<SearchIcon className="mb-1" />}
                        style={{ width: '250px', height: '40px' }}
                        placeholder="Search Closed Project"
                        value={search}
                        onChange={handleSearch}
                    />
                </div>

                <DataTable
                    columns={columns}
                    totalData={data?.count}
                    actionPadding={'0'}
                >
                    {
                        data?.projects?.map((element, index) => {
                            return (
                                <tr key={index}>
                                    <td>{requestParams.page + (index + 1)}</td>
                                    <td>{element?.sName}</td>
                                    <td>{element?.eProjectType}</td>
                                    <td>{MapData({ array: element?.client, property: 'sClientName', split: ', ', show: 2 })}</td>
                                    <td>{MapData({ array: element?.technology, property: 'sTechnologyName', split: ', ', show: 1 })}</td>
                                    <td className="table-btn">{MapData({ array: element?.projecttag, split: '', show: 1, tag: true })}</td>
                                    <td><Button className='in-Progress-btn' onClick={() => handleModalOpen(element?._id)}>{projectStatusLabel.inProgress}</Button></td>

                                    <ActionColumn
                                        permissions={permissions}
                                        handleView={() => onView(element?._id)}
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

            <ConfirmationModal
                open={modal?.open}
                title='Are you sure?'
                handleClose={handleModalClose}
                handleCancel={handleModalClose}
                handleConfirm={() => handleConfirm(modal?.id)}
                btnCancel='No'
                btnDelete='Yes'
            >
                <h6>{`Are you sure you want to change Project status ${projectStatusLabel.closed} to ${projectStatusLabel.inProgress} ?`}</h6>
            </ConfirmationModal>
        </>
    )
}

export default ClosedProject