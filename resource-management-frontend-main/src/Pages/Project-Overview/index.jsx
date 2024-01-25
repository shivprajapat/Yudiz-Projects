import React, { useCallback, useState } from 'react'

//component
import WorklogModalContent from 'Components/Modals/WorklogModalContent'
import ProjectOverviewChart from 'Components/ProjectOverviewChart'
import TablePagination from 'Components/Table-pagination'
import Wrapper from 'Components/wrapper'
import Search from 'Components/Search'
import Select from 'Components/Select'

//query
import { getProjectDashboard } from 'Query/Dashboard/dashboard.query'
import { useQuery } from 'react-query'

//icons
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

//helper
import { appendParams, parseParams, projectStatusLabel } from 'helpers'

//hooks
import useResourceDetails from 'Hooks/useResourceDetails'
import { debounce } from 'Hooks/debounce'

import { useNavigate } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'

export default function ProjectOverview() {
  const parsedData = parseParams(location.search)
  const navigate = useNavigate()

  const [search, setSearch] = useState(parsedData?.search)
  const [modal, setModal] = useState({ addOpen: false })
  const [requestParams, setRequestParams] = useState({
    page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
    limit: parsedData?.limit === 'all' ? 'all' : (Number(parsedData?.limit) || 6),
    eProjectType: parsedData.eProjectType || null,
    search: parsedData?.search || '',
    iProjectManagerId: parsedData['iProjectManagerId'] || null,
    iBDId: parsedData['iBDId'] || null,
    eProjectStatus: parsedData['eProjectStatus'] || null,
  })
  const [filters, setFilters] = useState({
    eProjectType: parsedData['eProjectType'] ? { _id: parsedData['eProjectType'], sName: parsedData['eProjectType'] } : null,
    eProjectStatus: parsedData['eProjectStatus'] ? { _id: parsedData['eProjectStatus'], sName: parsedData['eProjectStatus'] } : null,
    iProjectManagerId: parsedData['iProjectManagerId']
      ? { _id: parsedData['iProjectManagerId'], sName: parsedData['iProjectManagerIdLabel'] }
      : null,
    iBDId: parsedData['iBDId'] ? { _id: parsedData['iBDId'], sName: parsedData['iBDIdLabel'] } : null,
  })


  //get project dashboard
  const { data, isLoading, isLoadingError } = useQuery(['projectDashboard', requestParams], () => getProjectDashboard(requestParams), {
    select: (data) => data.data.data,
  })

  const {
    resourceDetail,
    handleScroll,
    data: resourceData,
    handleSearch: handleResourceSearch,
  } = useResourceDetails(['projectManager', 'bde'])
  function getDetail(property) {
    return { ...resourceData[property], data: resourceDetail?.[property] }
  }

  function handleAddModalClose() {
    setModal({ addOpen: false })
  }
  function handleAddModalOpen(defaultProject) {
    setModal({ addOpen: true, defaultProject })
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
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 6 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 6 })
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  function handleFilter(e, fName, opt) {
    if (opt.action === 'clear') {
      setFilters({ ...filters, [fName]: null })
      setRequestParams({ ...requestParams, page: 0, [fName]: '' })
      appendParams({ ...requestParams, page: 0, [fName]: '' })
    }
    setFilters({ ...filters, [fName]: e })
    setRequestParams({ ...requestParams, page: 0, [fName]: e?._id, [fName + 'Label']: e?.sName })
    appendParams({ ...requestParams, page: 0, [fName]: e?._id, [fName + 'Label']: e?.sName })
  }

  const projectTypes = [
    { sName: 'Fixed', _id: 'Fixed' },
    { sName: 'Dedicated', _id: 'Dedicated' },
  ]
  const projectStatus = [
    { sName: projectStatusLabel.pending, _id: projectStatusLabel.pending },
    { sName: projectStatusLabel.inProgress, _id: projectStatusLabel.inProgress },
    { sName: projectStatusLabel.onHold, _id: projectStatusLabel.onHold },
    { sName: projectStatusLabel.completed, _id: projectStatusLabel.completed },
    { sName: projectStatusLabel.closed, _id: projectStatusLabel.closed },
  ]

  function gotoProjectDetails(id) {
    navigate(`/projects/detail/${id}`)
  }

  return (
    <div>
      <Wrapper transparent>
        <div className="w-100 d-flex  flex-wrap justify-content-between mt-4">
          <div className="d-flex flex-start flex-wrap gap-2 ">
            <div>
              <Select
                placeholder="Project Type"
                value={filters['eProjectType']}
                options={projectTypes}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                isClearable
                errorDisable
                onChange={(e, options) => handleFilter(e, 'eProjectType', options)}
              />
            </div>
            <div>
              <Select
                placeholder="Project Status"
                value={filters['eProjectStatus']}
                options={projectStatus}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                isClearable
                errorDisable
                onChange={(e, options) => handleFilter(e, 'eProjectStatus', options)}
              />
            </div>
            <div>
              <Select
                placeholder="PM"
                value={filters['iProjectManagerId']}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                isClearable
                errorDisable
                onChange={(e, options) => handleFilter(e, 'iProjectManagerId', options)}
                onInputChange={(s) => handleResourceSearch('projectManager', s)}
                fetchMoreData={() => handleScroll('projectManager')}
                isLoading={getDetail('projectManager')?.isLoading}
                options={getDetail('projectManager').data}
              />
            </div>
            <div>
              <Select
                placeholder="BDE"
                value={filters['iBDId']}
                getOptionLabel={(option) => option.sName}
                getOptionValue={(option) => option._id}
                isClearable
                errorDisable
                onChange={(e, options) => handleFilter(e, 'iBDId', options)}
                onInputChange={(s) => handleResourceSearch('bde', s)}
                fetchMoreData={() => handleScroll('bde')}
                isLoading={getDetail('bde')?.isLoading}
                options={getDetail('bde').data}
              />
            </div>
          </div>
          <div>
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Project"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
      </Wrapper>
      <Wrapper className={'m-0'} transparent={!isLoading} isLoading={isLoading && !isLoadingError}>
        {!data?.all?.length && !isLoading && <Wrapper>No Results Found</Wrapper>}
        <Row>
          {data?.all?.map((p, i) => (
            <Col xxl={4} lg={6} md={12} key={i}>
              <ProjectOverviewChart gotoProjectDetails={gotoProjectDetails} addWorkLogModalOpen={handleAddModalOpen} data={p} />
            </Col>
          ))}
        </Row>
      </Wrapper>

      <Wrapper
        className={'py-2'}
      >
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 6}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
          rowsOptions={[6, 12, 18, 24, 30, 36]}
        />
      </Wrapper>

      <WorklogModalContent modal={modal} handleAddModalClose={handleAddModalClose} />
    </div>
  )
}
