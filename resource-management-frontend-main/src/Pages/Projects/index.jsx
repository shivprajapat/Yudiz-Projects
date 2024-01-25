/* eslint-disable react/prop-types */
import React, { useCallback, useState, useEffect } from 'react'

// component
import PermissionProvider from 'Components/PermissionProvider'
import ProjectStatusInfo from 'Components/ProjectStatusInfo'
import ConfirmationModal from 'Components/ConfirmationModal'
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import AlertModal from 'Components/Alert'
import Wrapper from 'Components/wrapper'
import Search from 'Components/Search'
import Button from 'Components/Button'

// query
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { downloadCsv } from 'Query/Employee/employee.mutation'
import { deleteProject } from 'Query/Project/project.mutation'
import { getProjectList } from 'Query/Project/project.query'

// icons
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'

// helper
import {
  appendParams,
  cell,
  ExcelModules,
  formatDate,
  getSortedColumns,
  isGranted,
  mapFilter,
  parseParams,
  permissionsName,
  projectStatusColorCode,
  projectStatusLabel,
  toaster,
} from 'helpers'

// hooks
import { debounce } from 'Hooks/debounce'
import { route } from 'Routes/route'

import { Tabs, Tab, OverlayTrigger, Popover, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './_project.scss'

export default function Projects() {
  const parsedData = parseParams(location.search)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [requestParams, setRequestParams] = useState(getParams())
  const [search, setSearch] = useState(parsedData?.search)
  const [ExcelFields, setExcelFields] = useState([])
  const [modal, setModal] = useState({ open: false })
  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Project Name', connectionName: 'sName', isSorting: true, sort: 0 },
        { name: 'Client Name', connectionName: 'client', isSorting: false, sort: 0 },
        {
          name: 'Completion Date',
          connectionName: 'dEndDate',
          isSorting: true,
          sort: 0,
          hide: requestParams?.eProjectType === 'Dedicated',
        },
        { name: 'Technology', connectionName: 'technology', isSorting: false, sort: 0 },
        { name: 'Project Tag', connectionName: 'projectTag', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )

  // get Projects
  const { data, isLoading, isFetching } = useQuery(['projects', requestParams], () => getProjectList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 10000,
  })

  // delete projects 
  const mutation = useMutation(deleteProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
      setModal({ open: false })
      toaster('Project deleted successfully')
    },
    onError: () => {
      setModal({ open: false })
    },
  })

  // excel 
  const ExcelMutation = useMutation(downloadCsv, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ Excel: false })
    },
  })



  function gotoAddEmployee() {
    navigate(route.projectAdd)
  }

  function gotoDetail(id) {
    navigate(route.projectDetail(id))
  }

  function gotoEdit(id) {
    navigate(route.projectEdit(id, 'edit'))
  }

  function onDelete(id) {
    const ProjectStatus = data?.projects.find((item) => item._id === id)
    setModal({
      open: true,
      id,
      ProjectStatus: ProjectStatus.eProjectStatus,
    })
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

  function changeTab(e) {
    if (requestParams.eProjectType === e) return
    setRequestParams({ ...requestParams, page: 0, eProjectType: e })
    appendParams({ ...requestParams, page: 0, eProjectType: e })
    if (e === 'Dedicated') {
      setColumns((columns) => columns.map((col, i) => (i === 3 ? { ...col, hide: true } : col)))
    } else {
      setColumns((columns) => columns.map((col, i) => (i === 3 ? { ...col, hide: false } : col)))
    }
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 5 })
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

  function handleDeleteClose() {
    setModal({ open: false })
  }

  function handleDeleteMutation() {
    mutation.mutate(modal.id)
  }

  function handleDownloadExcel() {
    ExcelMutation.mutate({
      sModule: 'Project',
      requiredFields: mapFilter(
        ExcelFields,
        (f) => f.value,
        (f) => f.isSelected
      ),
      query: mapFilter(requestParams, null, (data) => data !== ''),
    })
  }

  function handleDownloadExcelOpen() {
    setModal({ Excel: true })
    setExcelFields(ExcelModules.Project)
  }
  function handleDownloadExcelClose() {
    setModal({ Excel: false })
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
          trigger={['hover', 'hover']}
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
      limit: parsedData?.limit === 'all' ? 'all' : Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData?.sort || '',
      order: parsedData?.order || '',
      eProjectType: parsedData?.eProjectType || 'Fixed',
    }
  }

  const permissions = {
    CREATE: permissionsName.CREATE_PROJECT,
    READ: permissionsName.VIEW_PROJECT,
    UPDATE: permissionsName.UPDATE_PROJECT,
    DELETE: permissionsName.DELETE_PROJECT,
    EXCEL: permissionsName.DOWNLOAD_PROJECT_EXCEL,
    VIEW: permissionsName.VIEW_COST,
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE, this.VIEW]
    },
  }


  useEffect(() => {
    queryClient.invalidateQueries('projects')
  }, [])

  return (
    <section className="project-section">
      <Wrapper className="project-sec">
        <PageTitle
          title="Projects"
          BtnText={isGranted(permissions.CREATE) ? 'Add Project' : null}
          handleExcelEvent={isGranted(permissions.EXCEL) ? handleDownloadExcelOpen : null}
          handleButtonEvent={gotoAddEmployee}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <Search
            startIcon={<SearchIcon className="mb-1" />}
            style={{ width: '250px', height: '40px' }}
            placeholder="Search Project"
            value={search}
            onChange={handleSearch}
          />
        </div>
        <Tabs className="project-tabs" style={{ width: 'fit-content' }} activeKey={requestParams?.eProjectType} onSelect={(k) => changeTab(k)}>
          <Tab eventKey="Fixed" title="Fixed Cost"></Tab>
          <Tab eventKey="Dedicated" title="Dedicated"></Tab>
        </Tabs>
        <DataTable
          columns={columns}
          disableActions={!isGranted(permissions.ALL)}
          totalData={data?.projects?.length}
          isLoading={isLoading || isFetching || mutation.isLoading}
          handleSorting={(data) => handleSorting(data)}
        >
          {data?.projects?.map((item, i) => (
            <tr key={i + item?._id}>
              <td>{cell(requestParams.page + (i + 1))}</td>

              <td className="d-flex">
                <div className="d-flex align-items-center me-3">
                  <div className="status-dot" style={{ backgroundColor: projectStatusColorCode(item.eProjectStatus) }}></div>
                </div>
                {item?.sName}
              </td>
              <td>{MapData({ array: item?.client, property: 'sClientName', split: ', ', show: 2 })}</td>
              {requestParams?.eProjectType === 'Dedicated' ? null : <td>{formatDate(item?.dEndDate)}</td>}
              <td>{MapData({ array: item?.technology, property: 'sTechnologyName', split: ', ', show: 1 })}</td>
              <td className="table-btn">{MapData({ array: item?.projecttag, split: '', show: 1, tag: true })}</td>
              <PermissionProvider allowed={permissions.ALL}>
                <ActionColumn
                  permissions={permissions}
                  handleView={() => gotoDetail(item._id)}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                  isVisibleCost={isGranted(permissions.VIEW) ? true : false}
                />
              </PermissionProvider>
            </tr>
          ))}
        </DataTable>
      </Wrapper>
      <ProjectStatusInfo />

      <Wrapper
        className={'py-2'}
      >
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 10}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      {modal?.ProjectStatus === projectStatusLabel.pending ? (
        <ConfirmationModal
          open={modal.open}
          title="are you sure?"
          handleClose={handleDeleteClose}
          handleCancel={handleDeleteClose}
          handleConfirm={handleDeleteMutation}
        >
          <h6>Are you sure you want to delete?</h6>
        </ConfirmationModal>
      ) : (
        <AlertModal open={modal.open} title="Alert" handleClose={handleDeleteClose} handleCancel={handleDeleteClose}>
          <h6>{`You can not delete, currently project status is "${modal?.ProjectStatus}"`}</h6>
        </AlertModal>
      )}

      <CustomModal modalBodyClassName="p-0 py-2" open={modal.Excel} handleClose={handleDownloadExcelClose} title="Download Excel">
        <DataTable
          columns={[
            { name: 'Fields', connectionName: 'sName' },
            { name: ' ', connectionName: '' },
          ]}
          disableActions
          totalData={ExcelFields.length}
        >
          {ExcelFields.map((field, i) => (
            <tr key={i}>
              <td>{field?.label}</td>
              <td>
                <Form.Check
                  className="form-check"
                  onChange={({ target }) => {
                    setExcelFields((fields) =>
                      fields.map((field, fIndex) => (i === fIndex ? { ...field, isSelected: target.checked } : field))
                    )
                  }}
                  checked={field.isSelected}
                />
              </td>
            </tr>
          ))}
        </DataTable>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={handleDownloadExcelClose}>
              Cancel
            </Button>
            <Button onClick={handleDownloadExcel} loading={ExcelMutation.isLoading}>
              Send
            </Button>
          </div>
        </div>
      </CustomModal>
    </section>
  )
}
