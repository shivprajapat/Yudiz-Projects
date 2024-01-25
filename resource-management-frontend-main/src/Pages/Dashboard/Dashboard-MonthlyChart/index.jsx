import React, { useState } from 'react'

// component
import LineChart from 'Components/Chart/LineChart'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'

// query
import { getMonthlyProjects, getYear } from 'Query/Dashboard/dashboard.query'
import { useQuery } from 'react-query'

// helper
import { isGranted, parseParams, permissionsName } from 'helpers'

function DashboardMonthlyChart() {
    const parsedData = parseParams(location.search)

    const ShowAllProjects = [
        { sName: 'ALL', _id: 'ALL' },
        { sName: 'OWN', _id: 'OWN' }
    ]
    const [requestParams, setRequestParams] = useState(getParams())
    const [filters, setFilters] = useState({
        eShow: parsedData['eShow'] ? { sName: parsedData['eShow'], _id: parsedData['eShow'] } : { _id: "ALL", sName: 'ALL' },
        year: parsedData['year'] ? { sName: parsedData['year'], _id: parsedData['year'] } : { _id: new Date().getFullYear(), sName: new Date().getFullYear() },
    })

    const { data: monthlyProjects, isLoading } = useQuery({
        queryKey: ['latestProjects', requestParams],
        queryFn: () => getMonthlyProjects(requestParams),
        select: (data) => data?.data?.data,
        staleTime: 10000,
        enabled: isGranted(permissionsName.VIEW_DASHBOARD_MONTHLY_CHART),
    })

    // get Year for monthly project
    const { data: year } = useQuery({
        queryKey: ['nYear'],
        queryFn: () => getYear(),
        select: (data) => data.data.data,
        staleTime: 10000,
        enabled: isGranted(permissionsName.VIEW_DASHBOARD_MONTHLY_CHART)
    })

    const yearData = year?.map((yearItem) => {
        return {
            sName: yearItem,
            _id: yearItem,
        }
    })
    function handleFilter(e, fName, opt) {
        if (opt.action === 'clear') {
            setFilters((f) => ({ ...f, [fName]: null }))
            setRequestParams({ ...requestParams, page: 0, [fName]: null })
            // appendParams({ ...requestParams, page: 0, [fName]: null, [fName + 'Label']: '' })
        } else {
            setFilters((f) => ({ ...f, [fName]: e }))
            setRequestParams({ ...requestParams, page: 0, [fName]: e._id })
            // appendParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
        }
    }

    function getParams() {
        return {
            eShow: parsedData.eShow || null,
            year: parsedData.year || null
        }
    }
    return (
        <Wrapper
            isLoading={isLoading}
            className="chart m-0 d-flex flex-column"
            style={{ height: 'auto' }}>

            <div
                className='d-flex justify-content-between'
                style={{ position: 'sticky', zIndex: 999, width: '100%', background: 'white' }}
            >
                <PageTitle
                    className="bg-white"
                    title="Monthly Projects"
                />
                <div className='d-flex'>
                    <Select
                        placeholder={'Year'}
                        value={filters['year']}
                        options={yearData}
                        getOptionLabel={(option) => option.sName}
                        getOptionValue={(option) => option._id}
                        errorDisable
                        onChange={(e, options) => handleFilter(e, 'year', options)}
                        className={'me-4 mt-2'}
                    />
                    {
                        monthlyProjects?.eShowAllProjects === 'ALL' ?

                            <Select
                                placeholder={'Select an Option'}
                                value={filters['eShow']}
                                options={ShowAllProjects}
                                defaultValue={ShowAllProjects[0]}
                                getOptionLabel={(option) => option.sName}
                                getOptionValue={(option) => option._id}
                                errorDisable
                                onChange={(e, options) => handleFilter(e, 'eShow', options)}
                                className={'me-4 mt-2'}
                            />
                            : null
                    }
                </div>
            </div>
            {monthlyProjects?.data?.monthlyProjects ? (
                <div style={{ height: 445 }}>
                    <LineChart chartData={monthlyProjects?.data?.monthlyProjects} />
                </div>
            ) : (
                <div className="w-100 d-flex justify-content-center">
                    <h3 className="mt-2 w-100 fs-6 d-flex justify-content-center">No Records Found</h3>
                </div>
            )}
        </Wrapper>
    )
}

export default DashboardMonthlyChart