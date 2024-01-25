/* eslint-disable react/prop-types */
import React, { useState } from 'react'

//component
import WorklogModalContent from 'Components/Modals/WorklogModalContent'
import ConfirmationModal from 'Components/ConfirmationModal'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'

//query
import { deleteWorklog } from 'Query/Worklog/worklog.mutation'
import { getWorklogList } from 'Query/Worklog/worklog.query'
import { useMutation, useQuery } from 'react-query'
import { queryClient } from 'queryClient'

//helper
import { cell, convertMinutesToTime, formatDate, isGranted, parseParams, permissionsName, toaster } from 'helpers'

import { OverlayTrigger, Popover } from 'react-bootstrap'

function DashboardWorklog() {
    const parsedData = parseParams(location.search)

    const userFilter = [
        { _id: 'me', sName: 'OWN' },
        { _id: 'all', sName: 'ALL' },
    ]

    const [modal, setModal] = useState({ deleteOpen: false, editOpen: false, addOpen: false })
    const [requestParams, setRequestParams] = useState(getParams())
    const [filters, setFilters] = useState({
        person: parsedData['person'] ? { _id: parsedData['person'], sName: parsedData['personLabel'] } : { _id: 'all', sName: 'ALL' },
    })

    // get Worklog
    const { data: worklog, isLoading } = useQuery({
        queryKey: ['worklogs', requestParams],
        queryFn: () => getWorklogList(requestParams),
        select: (data) => data?.data?.data,
        enabled: isGranted(permissionsName?.VIEW_DASHBOARD_WORKLOGS)
    })

    //delete work-log
    const deleteMutation = useMutation(deleteWorklog, {
        onSuccess: () => {
            queryClient.invalidateQueries('worklogs')
            toaster('Work Log delete successfully')
            setModal({ deleteOpen: false })
        },
        onError: () => {
            setModal({ deleteOpen: false })
        }
    })

    function handleAddModalClose() {
        setModal({ addOpen: false, editOpen: false, mode: modal.id && !modal.viewOnly ? 'edit' : '' })
    }

    function onDelete(id) {
        setModal({ deleteOpen: true, id })
    }

    function onEdit(id) {
        setModal({ editOpen: true, id })
    }

    function onView(id) {
        setModal({ addOpen: true, id, viewOnly: true, mode: '' })
    }

    function handleFilter(e, fName, opt) {
        if (opt.action === 'clear') {
            setFilters((f) => ({ ...f, [fName]: null }))
            setRequestParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
            // appendParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
        } else {
            setFilters((f) => ({ ...f, [fName]: e }))
            setRequestParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
            // appendParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
        }
    }


    function MapData({ array, split, property, start = 0, show = 2, end, withoutAdd, tag }) {
        show = show > array?.length ? array?.length : show
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
    const permissions = {
        CREATE: permissionsName.CREATE_WORKLOGS,
        READ: permissionsName.VIEW_WORKLOGS,
        DELETE: permissionsName.DELETE_WORKLOGS,
        UPDATE: permissionsName.CREATE_WORKLOGS, // [TODO] : change permission name once we get from backend 
        EXCEL: permissionsName.DOWNLOAD_WORKLOGS_EXCEL,
        get ALL() {
            return [this.READ, this.UPDATE, this.DELETE]
        },
    }

    function getParams() {
        return {
            person: parsedData['person'] || 'all',
        }
    }
    return (
        <>
            <Wrapper
                isLoading={isLoading}
            >
                <PageTitle
                    title={'Work Log'}
                    BtnText={isGranted(permissions.CREATE) ? 'Add Work-Log' : null}
                    handleButtonEvent={() => setModal({ addOpen: true, mode: '' })}
                    add
                />

                <div className="w-100 d-flex justify-content-between my-2 mt-4">
                    <div className="d-flex flex-start flex-wrap gap-3 ">
                        <Select
                            placeholder={'person'}
                            value={filters['person']}
                            tooltip={(v) => v?.sName}
                            width={180}
                            options={userFilter}
                            getOptionLabel={(option) => option.sName}
                            getOptionValue={(option) => option._id}
                            errorDisable
                            onChange={(e, options) => handleFilter(e, 'person', options)}
                        />
                    </div>
                </div>
                <DataTable
                    columns={[
                        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
                        { name: 'Project', connectionName: 'sProjectName', isSorting: false, sort: 0 },
                        { name: 'Employee', connectionName: 'sEmployeeName', isSorting: false, sort: 0 },
                        { name: 'Tags', connectionName: 'aTaskTag', isSorting: false, sort: 0 },
                        { name: 'Date', connectionName: 'sDescription', isSorting: false, sort: 0 },
                        { name: 'Work Hours', connectionName: 'sDescription', isSorting: false, sort: 0 },
                    ]}
                    totalData={worklog?.count}
                    actionPadding="25px"
                    align="left"
                >
                    {
                        worklog?.worklogs?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{cell(index + 1)}</td>
                                    <td>{cell(item.sProjectName)}</td>
                                    <td>{cell(item?.sEmployeeName)}</td>
                                    <td>{MapData({ array: item.aTaskTag, property: 'sName', split: ', ', show: 1 })}</td>
                                    <td style={{ letterSpacing: '1px' }}> {cell(formatDate(item.dCreatedAt, '/'))}</td>
                                    <td>{cell(item.nMinutes && convertMinutesToTime(item.nMinutes), '0h 0m')}</td>
                                    <ActionColumn
                                        permissions={permissions}
                                        handleView={() => onView(item._id)}
                                        handleDelete={() => onDelete(item._id)}
                                        handleEdit={() => onEdit(item._id)}
                                    />
                                </tr>
                            )
                        })
                    }

                </DataTable>
            </Wrapper>


            <WorklogModalContent modal={modal} handleAddModalClose={handleAddModalClose} />
            <ConfirmationModal
                open={modal?.deleteOpen}
                title='Are You Sure?'
                handleClose={() => setModal({ deleteOpen: false })}
                handleCancel={() => setModal({ deleteOpen: false })}
                handleConfirm={() => deleteMutation.mutate(modal.id)}
            >
                <h6>Are you sure you want to delete?</h6>
            </ConfirmationModal>

        </>
    )
}

export default DashboardWorklog