import React, { useState } from 'react'

//component
import AlterImage from 'Components/AlterImage'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'

//query
import { getDeadlineProject } from 'Query/Dashboard/dashboard.query'
import { useQuery } from 'react-query'

//helper
import { formatDate, handleAlterImage, imageAppendUrl, isGranted, parseParams, permissionsName } from 'helpers'

//router
import { useNavigate } from 'react-router-dom'

import iconLogo from 'Assets/Icons/logo.svg'

function DashboardDueDate() {
    const navigate = useNavigate()
    const parsedData = parseParams(location.search)

    const isViewProjectPermission = isGranted(permissionsName.VIEW_PROJECT)

    const [requestParams, setRequestParams] = useState(getParams())
    const [filters, setFilters] = useState({
        eShow: parsedData['eShow'] ? { value: parsedData['eShow'], label: parsedData['eShow'] } : { _id: "ALL", sName: 'ALL' },
    })

    const ShowAllProjects = [
        { sName: 'ALL', _id: 'ALL' },
        { sName: 'OWN', _id: 'OWN' }
    ]

    // get dueDate project
    const { data: deadLineProjectsDetails, isLoading } = useQuery({
        queryKey: ['deadLineProjectsetails', requestParams],
        queryFn: () => getDeadlineProject(requestParams),
        select: (data) => data.data.data,
        staleTime: 10000,
        enabled: isGranted(permissionsName.VIEW_DASHBOARD_PROJECT_LINE)
    })

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

    function getParams() {
        return {
            eShow: parsedData.eShow || null,
        }
    }

    return (
        <Wrapper
            isLoading={isLoading}
            className={'mx-0'}
        >
            <div className='d-flex justify-content-between'>

                <PageTitle
                    title={'Due Date Project'}
                />

                {
                    deadLineProjectsDetails?.eShowAllProjects === 'ALL' ?
                        <Select
                            placeholder={'Select an Option'}
                            value={filters['eShow']}
                            width={'200px'}
                            options={ShowAllProjects}
                            defaultValue={ShowAllProjects[0]}
                            getOptionLabel={(option) => option.sName}
                            getOptionValue={(option) => option._id}
                            errorDisable
                            onChange={(e, options) => handleFilter(e, 'eShow', options)}
                        />
                        : null
                }



            </div>
            <DataTable
                columns={[
                    { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
                    { name: 'Logo', connectionName: 'id', isSorting: false, sort: 0 },
                    { name: 'Project Name', connectionName: 'sId', isSorting: false, sort: 0 },
                    { name: 'Type', connectionName: 'sName', isSorting: false, sort: 0 },
                    { name: 'End Date', connectionName: 'sDepartment', isSorting: false, sort: 0 },
                ]}
                disableActions
                totalData={deadLineProjectsDetails?.data?.length}
            >
                {
                    deadLineProjectsDetails?.data?.map((d, index) => {
                        return (
                            <tr key={index}
                                className={isViewProjectPermission ? 'cursor-pointer' : ''}
                                onClick={() => {
                                    if (isViewProjectPermission) {
                                        navigate(`/projects/detail/${d?._id}`)
                                    }
                                }}
                            >
                                <td>{index + 1}</td>
                                <td>
                                    <div className="project-table-td">
                                        <div className="img-box">
                                            {d?.sLogo ? (
                                                <img
                                                    src={imageAppendUrl(d?.sLogo)}
                                                    alt={d.sName}
                                                    onError={(e) => handleAlterImage(e, iconLogo)}
                                                    className="img-fluid"
                                                />
                                            ) : (
                                                <AlterImage text={d?.sName} />
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>{d.sName} </td>
                                <td>{d?.eProjectType}</td>
                                <td>{formatDate(d?.dEndDate)}</td>
                            </tr>
                        )
                    })
                }
            </DataTable>
        </Wrapper>
    )
}

export default DashboardDueDate