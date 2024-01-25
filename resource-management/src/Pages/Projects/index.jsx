/* eslint-disable react/prop-types */
import './_project.scss'
import PageTitle from 'Components/Page-Title'
import Wrapper from 'Components/wrapper'
import React, { useState } from 'react'
import Select from 'Components/Select'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query'
import { departmentList } from '../../Query/Employee/employee.query'
import { useNavigate } from 'react-router-dom'
import TablePagination from 'Components/Table-pagination'
import CustomModal from 'Components/Modal'
import DataTable from 'Components/DataTable'
import Search from 'Components/Search'
import { deleteEmployee } from 'Query/Employee/employee.mutation'
import { Tabs, Tab, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { getProjectList } from 'Query/Project/project.query'
import { appendParams, formatDate, getSortedColumns, parseParams } from 'helpers/helper'
import ActionColumn from 'Components/ActionColumn'

export default function Projects() {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const [search, setSearch] = useState(parsedData?.search)
  const [data, setData] = useState([])
  const [filters, setFilters] = useState({
    iDepartmentId: parsedData['iDepartmentId']
      ? { value: parsedData['iDepartmentId'], label: parsedData['iDepartmentIdLabel']?.replace('+', ' ') }
      : null,
    eAvailabilityStatus: parsedData['eAvailabilityStatus']
      ? { label: parsedData['eAvailabilityStatus']?.replace('+', ' '), value: parsedData['eAvailabilityStatus']?.replace('+', ' ') }
      : null,
  })
  const [modal, setModal] = useState({ open: false })
  const [requestParams, setRequestParams] = useState(getParams())
  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Project Name', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Client Name', connectionName: 'client', isSorting: false, sort: 0 },
        { name: 'Completion Date', connectionName: 'dEndDate', isSorting: true, sort: 0 },
        { name: 'Technology', connectionName: 'technology', isSorting: false, sort: 0 },
        { name: 'Project Tag', connectionName: 'projectTag', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )

  function getParams() {
    return {
      page: Number(parsedData?.page) || 0,
      limit: Number(parsedData?.limit) || 5,
      search: parsedData?.search || '',
      sort: parsedData?.sort || '',
      order: parsedData?.order || '',
      eProjectType: parsedData?.eProjectType || 'Fixed',
    }
  }

  const filterValues = useQueries([{ queryKey: 'empDepartment', queryFn: departmentList }])

  const departmentArray = filterValues[0]?.data?.data?.data?.departments?.map((data) => {
    return {
      value: data._id,
      label: data.sName,
    }
  })

  const navigate = useNavigate()
  function gotoAddEmployee() {
    navigate('/projects/add')
  }
  function gotoDetail(id) {
    navigate('/projects/details/' + id)
  }

  const mutation = useMutation(deleteEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        'projects' + requestParams?.sort + requestParams?.order + requestParams?.page + requestParams?.limit + requestParams?.search
      )
      setModal({ open: false })
    },
  })

  const { isLoading, isFetching } = useQuery(
    [
      'projects' +
        requestParams?.sort +
        requestParams?.order +
        requestParams?.page +
        requestParams?.limit +
        requestParams?.search +
        requestParams.eProjectType,
      requestParams,
    ],
    () => getProjectList(requestParams),
    {
      onSuccess: (data) => {
        setData(data.data.data)
      },
      staleTime: 1000 * 30,
      refetchInterval: (data) => {
        setData(data?.data.data)
      },
    }
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const TimeOut = setTimeout(function fetchFilteredData() {
      setRequestParams({ ...requestParams, page: 0, search: e.target.value })
      appendParams({ ...requestParams, page: 0, search: e.target.value })
    }, 2000)
    return () => clearTimeout(TimeOut)
  }

  function handleFilter(e, fName, opt) {
    if (opt.action === 'clear') {
      setFilters({ ...filters, [fName]: null })
      setRequestParams({ ...requestParams, page: 0, [fName]: '' })
      appendParams({ ...requestParams, page: 0, [fName]: '' })
    }
    setFilters({ ...filters, [fName]: e })
    setRequestParams({ ...requestParams, page: 0, [fName]: e.value })
    appendParams({ ...requestParams, page: 0, [fName]: e.value, [fName + 'Label']: e.label })
  }

  function changeTab(e) {
    setRequestParams({ ...requestParams, eProjectType: e })
    appendParams({ ...requestParams, eProjectType: e })
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
    appendParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  function handleSorting(name) {
    let selectedFilter
    const filter = columns.map((data) => {
      if (data.connectionName === name) {
        data.sort = data.sort === 1 ? -1 : data.sort === -1 ? 0 : 1
        selectedFilter = data
      } else {
        data.sort = 0
      }
      return data
    })
    setColumns(filter)
    const params = {
      ...requestParams,
      page: 0,
      sort: selectedFilter.sort !== 0 ? selectedFilter.connectionName : '',
      order: selectedFilter.sort === 1 ? 'asc' : selectedFilter.sort === -1 ? 'desc' : '',
    }
    setRequestParams(params)
    appendParams(params)
  }

  function MapData({ array, split, property, start = 0, show = 2, end, withoutAdd, tag }) {
    return tag ? (
      <>
        {array?.slice(start, show)?.map(({ sTextColor, sBackGroundColor, sProjectTagName, _id }) => (
          <span key={_id} style={{ color: sTextColor, backgroundColor: sBackGroundColor }} className="light-blue">
            {sProjectTagName}
          </span>
        ))}
        {ExtraData({ array: array?.slice(show), split, property: 'sProjectTagName', start, show, withoutAdd })}
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
    const data = array.map((item) => item[property] + '\n')

    return (
      length > 0 && (
        <OverlayTrigger trigger={'hover'} body placement="right" overlay={<Tooltip id={data[0]}>{data}</Tooltip>}>
          <span className="badge bg-secondary text-dark">{` +${length} More`}</span>
        </OverlayTrigger>
      )
    )
  }

  return (
    <section className="project-section">
      <Wrapper className="project-sec">
        <PageTitle title="Fixed Cost Project" BtnText="Add Project" handleButtonEvent={gotoAddEmployee} add />
        <div className="w-100 d-flex justify-content-between mt-4">
          <div className="d-flex flex-start ">
            <Select
              className="me-4"
              placeholder={'Department'}
              value={'123'}
              options={departmentArray}
              isClearable
              errorDisable
              onChange={(e, options) => handleFilter(e, 'iDepartmentId', options)}
            />
          </div>
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Project"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Tabs className="project-tabs" activeKey={requestParams?.eProjectType} onSelect={(k) => changeTab(k)}>
          <Tab eventKey="Fixed" title="Fixed Cost"></Tab>
          <Tab eventKey="Dedicated" title="Dedicated"></Tab>
        </Tabs>
        <DataTable
          handleSearch={handleFilter}
          columns={columns}
          totalData={data?.projects?.length}
          isLoading={isLoading || isFetching || mutation.isLoading}
          handleSorting={(data) => handleSorting(data)}
        >
          {data?.projects?.map((item, i) => (
            <tr key={i + item?._id}>
              <td>{requestParams?.limit * requestParams.page + (i + 1)}</td>
              <td>{item?.sName}</td>
              <td>{MapData({ array: item?.client, property: 'sClientName', split: ', ', show: 2 })}</td>
              <td>{formatDate(item?.dEndDate)}</td>
              <td>{MapData({ array: item?.technology, property: 'sTechnologyName', split: ', ', show: 1 })}</td>
              <td className="table-btn">{MapData({ array: item?.projecttag, split: '', show: 2, tag: true })}</td>
              <ActionColumn
                view
                handleView={() => gotoDetail(item._id)}
                // handleEdit={() => gotoEdit(item._id)}
                // handleDelete={() => onDelete(item._id)}
              />
            </tr>
          ))}
        </DataTable>
      </Wrapper>
      <Wrapper transparent className="mt-0 pt-1">
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>
      <CustomModal open={modal.open} handleClose={() => setModal({ open: false })} actionButton={() => mutation.mutate(modal.id)} />
    </section>
  )
}

// <tr>
// <td>2</td>
// <td>Rockford</td>
// <td>Bessie Cooper</td>
// <td>16/08/2019</td>
// <td>Unity</td>
// <td className="table-btn">
//   <span className="light-green me-2">Environment</span>
//   <span className="light-ola">NFT</span>
// </td>
// <td className="text-center">
//   <span className="mx-3 cursor-pointer" onClick={() => gotoProjectDetail()}>
//     <Eye />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Edit fill="#B2BFD2" />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Delete fill="#B2BFD2" />
//   </span>
// </td>
// </tr>
// <tr>
// <td>3</td>
// <td>Rockford</td>
// <td>Bessie Cooper</td>
// <td>16/08/2019</td>
// <td>Flutter, PHP</td>
// <td className="table-btn">
//   <span className="light-red me-2">Corporate</span>
//   <span className="light-blue">Education</span>
// </td>
// <td className="text-center">
//   <span className="mx-3 cursor-pointer" onClick={() => gotoProjectDetail()}>
//     <Eye />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Edit fill="#B2BFD2" />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Delete fill="#B2BFD2" />
//   </span>
// </td>
// </tr>
// <tr>
// <td>4</td>
// <td>Rockford</td>
// <td>Bessie Cooper</td>
// <td>16/08/2019</td>
// <td>Unity</td>
// <td className="table-btn">
//   <span className="light-green me-2">Corporate</span>
// </td>
// <td className="text-center">
//   <span className="mx-3 cursor-pointer" onClick={() => gotoProjectDetail()}>
//     <Eye />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Edit fill="#B2BFD2" />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Delete fill="#B2BFD2" />
//   </span>
// </td>
// </tr>
// <tr>
// <td>5</td>
// <td>Rockford</td>
// <td>Bessie Cooper</td>
// <td>16/08/2019</td>
// <td>Unity</td>
// <td className="table-btn">
//   <span className="light-red me-2">Corporate</span>
//   <span className="light-yellow">Health</span>
// </td>
// <td className="text-center">
//   <span className="mx-3 cursor-pointer" onClick={() => gotoProjectDetail()}>
//     <Eye />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Edit fill="#B2BFD2" />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Delete fill="#B2BFD2" />
//   </span>
// </td>
// </tr>
// <tr>
// <td>6</td>
// <td>Rockford</td>
// <td>Bessie Cooper</td>
// <td>16/08/2019</td>
// <td>Unity</td>
// <td className="table-btn">
//   <span className="light-blue me-2">Health</span>
//   <span className="light-green">Environment</span>
// </td>
// <td className="text-center">
//   <span className="mx-3 cursor-pointer" onClick={() => gotoProjectDetail()}>
//     <Eye />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Edit fill="#B2BFD2" />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Delete fill="#B2BFD2" />
//   </span>
// </td>
// </tr>
// <tr>
// <td>7</td>
// <td>Rockford</td>
// <td>Bessie Cooper</td>
// <td>16/08/2019</td>
// <td>Unity</td>
// <td className="table-btn">
//   <span className="light-blue me-2">Education</span>
//   <span className="light-yellow">Health</span>
// </td>
// <td className="text-center">
//   <span className="mx-3 cursor-pointer" onClick={() => gotoProjectDetail()}>
//     <Eye />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Edit fill="#B2BFD2" />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Delete fill="#B2BFD2" />
//   </span>
// </td>
// </tr>
// <tr>
// <td>8</td>
// <td>Rockford</td>
// <td>Bessie Cooper</td>
// <td>16/08/2019</td>
// <td>Unity</td>
// <td className="table-btn">
//   <span className="light-red me-2">Corporate</span>
//   <span className="light-blue">Education</span>
// </td>
// <td className="text-center">
//   <span className="mx-3 cursor-pointer" onClick={() => gotoProjectDetail()}>
//     <Eye />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Edit fill="#B2BFD2" />
//   </span>
//   <span className="mx-3 cursor-pointer">
//     <Delete fill="#B2BFD2" />
//   </span>
// </td>
// </tr>
