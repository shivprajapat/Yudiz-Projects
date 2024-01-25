import React, { useState } from 'react'

//component
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'

//query
import { getFreeResource } from 'Query/Dashboard/dashboard.query'

//hooks
import useResourceDetails from 'Hooks/useResourceDetails'
import useInfiniteScroll from 'Hooks/useInfiniteScroll'

//helper
import { bottomReached, isGranted, parseParams, permissionsName } from 'helpers'


function DashboardFreeResources() {

    const parsedData = parseParams(location.search)

    const [filters, setFilters] = useState({
        iDepartmentId: parsedData['iDepartmentId'] ? { _id: parsedData['iDepartmentId'], sName: parsedData['iDepartmentIdLabel'] } : null,
    })
    const [dataParams, setDataParams] = useState(
        {
            page: 0,
            limit: 15,
            next: false,
            search: '',
        }
    )

    // get department
    const { resourceDetail, data, handleScroll, handleSearch: handleSearchDetail } = useResourceDetails(['department'])

    // get freeResources
    const {
        data: freeResources = [],
        handleScroll: handleScrollResources,
        reset: resetApi
    } = useInfiniteScroll(['freeResourceData', dataParams.limit, dataParams.page, filters?.iDepartmentId?._id], () => getFreeResource(dataParams), {
        enabled: isGranted(permissionsName.VIEW_DASHBOARD_FREE_RESOURCES),
        select: (data) => data.data.data.freeResource.freeResourceEmployee,
        requestParams: dataParams,
        updater: setDataParams,
    })

    function getDetail(property) {
        return { ...data[property], data: resourceDetail?.[property] }
    }

    function handleScrollFetch(e) {
        bottomReached(e) && handleScrollResources()
    }

    function handleFilterResourceDetail(e, fName, opt) {
        if (opt.action === 'clear') {
            setFilters((f) => ({ ...f, [fName]: null }))
            resetApi({})
        } else {
            setFilters((f) => ({ ...f, [fName]: e }))
            resetApi({ [fName]: e._id })
        }
    }


    return (
        <Wrapper
            isLoading={freeResources?.isLoading}
            className="m-0 px-0"
        >
            <div
                className='d-flex justify-content-between'
                style={{ position: 'sticky', zIndex: 999, width: '100%', background: 'white' }}
            >
                <PageTitle
                    className=" ps-3 py-3 bg-white"
                    title="Free Resources"
                />

                <Select
                    placeholder={'Department'}
                    value={filters['iDepartmentId']}
                    tooltip={(v) => v?.sName}
                    options={getDetail('department')?.data}
                    isLoading={getDetail('department')?.isLoading}
                    getOptionLabel={(option) => option.sName}
                    getOptionValue={(option) => option._id}
                    fetchMoreData={() => handleScroll('department')}
                    onInputChange={(s) => handleSearchDetail('department', s)}
                    isClearable
                    errorDisable
                    onChange={(e, options) => handleFilterResourceDetail(e, 'iDepartmentId', options)}
                    className={'me-4 mt-2'}

                />
            </div>

            <Wrapper
                transparent
                className="m-0 p-0"
                style={{ height: '440px', overflow: 'auto' }}
                onScroll={handleScrollFetch}
                isLoading={freeResources?.isLoading}
            >
                <DataTable
                    columns={[
                        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
                        { name: 'Employee Id', connectionName: 'sId', isSorting: false, sort: 0 },
                        { name: 'Employee Name', connectionName: 'sName', isSorting: false, sort: 0 },
                        { name: 'Department', connectionName: 'sDepartment', isSorting: false, sort: 0 },
                        { name: 'Availability Hours', connectionName: 'sAvailability', isSorting: false, sort: 0 },
                    ]}
                    disableActions
                    align="left"
                    totalData={freeResources?.length}
                >
                    {freeResources?.map((d, i) => (
                        <tr key={d.sEmpid + d.sName + i}>
                            <td>{i + 1}</td>
                            <td>{d?.sEmpId}</td>
                            <td>{d?.sName}</td>
                            <td>{d?.sDepartment}</td>
                            <td>{d?.nAvailabilityHours ? d?.nAvailabilityHours + (d?.nAvailabilityHours > 1 ? ' hrs' : ' hr') : 'no data'}</td>
                        </tr>
                    ))}

                </DataTable>
            </Wrapper>


        </Wrapper>
    )
}

export default DashboardFreeResources