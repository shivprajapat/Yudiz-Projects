/* eslint-disable react/prop-types */
import React, { useState } from 'react'

//component
import WorklogModalContent from 'Components/Modals/WorklogModalContent'
import TablePagination from 'Components/Table-pagination'
import CalendarInput from 'Components/Calendar-Input'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Select from 'Components/Select'
import Button from 'Components/Button'

//query
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { downloadCsv } from 'Query/Employee/employee.mutation'
import { deleteWorklog } from 'Query/Worklog/worklog.mutation'
import { getWorklogList } from 'Query/Worklog/worklog.query'

//helper
import {
  appendParams,
  cell,
  convertMinutesToTime,
  ExcelModules,
  formatDate,
  getSortedColumns,
  isGranted,
  mapFilter,
  parseParams,
  permissionsName,
  toaster,
} from 'helpers'


import { Form, OverlayTrigger, Popover } from 'react-bootstrap'
import useResourceDetails from 'Hooks/useResourceDetails'

export default function WorkLog() {
  const parsedData = parseParams(location.search)
  const queryClient = useQueryClient()

  const { resourceDetail, handleScroll, handleSearch: handleSearchDetail, data: d } = useResourceDetails(['projectOfUserLoggedIn'])

  const userFilter = [
    { _id: 'me', sName: 'Just my logs' },
    { _id: 'all', sName: 'All logs' },
  ]

  const [modal, setModal] = useState({ deleteOpen: false, editOpen: false, addOpen: false })
  const [requestParams, setRequestParams] = useState(getParams())
  const [ExcelFields, setExcelFields] = useState([])
  const [filters, setFilters] = useState({
    project: parsedData['project']
      ? { _id: parsedData['project'], sName: parsedData['projectLabel'] || 'All projects' }
      : { _id: 'all', sName: 'All projects' },
    person: parsedData['person']
      ? { _id: parsedData['person'], sName: parsedData['personLabel'] || 'All logs' }
      : { _id: 'all', sName: 'All logs' },
    date: parsedData['date'] ? { _id: parsedData['date'], sName: parsedData['dateLabel'] } : { _id: '', sName: '' },
  })
  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Project', connectionName: 'sProjectName', isSorting: false, sort: 0 },
        { name: 'Employee', connectionName: 'sEmployeeName', isSorting: false, sort: 0 },
        { name: 'Tags', connectionName: 'aTaskTag', isSorting: false, sort: 0 },
        { name: 'Date', connectionName: 'sDescription', isSorting: false, sort: 0 },
        { name: 'Work Hours', connectionName: 'sDescription', isSorting: false, sort: 0 },
      ],
      parsedData
    )
  )


  //get work-log
  const { data, isLoading, isFetching } = useQuery(['worklogs', requestParams], () => getWorklogList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 10000,
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


  function getDetail(property) {
    return { ...d[property], data: resourceDetail?.[property] }
  }

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

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 5 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 5 })
  }

  function handleFilter(e, fName, opt) {
    if (opt?.action === 'clear') {
      setFilters({ ...filters, [fName]: null })
      setRequestParams({ ...requestParams, page: 0, [fName]: '' })
      appendParams({ ...requestParams, page: 0, [fName]: '' })
    }
    setFilters({ ...filters, [fName]: e })
    setRequestParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
    appendParams({ ...requestParams, page: 0, [fName]: e._id, [fName + 'Label']: e.sName })
  }

  const filterProjects = getDetail('projectOfUserLoggedIn')?.data || []


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

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: parsedData?.limit === 'all' ? 'all' : (Number(parsedData?.limit) || 20),
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      date: parsedData.date || '',
      person: parsedData['person'] || 'all',
      personLabel: parsedData['personLabel'] || 'All logs',
      project: parsedData['project'] || 'all',
      projectLabel: parsedData['projectLabel'] || 'All projects',
    }
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

  // excel
  const ExcelMutation = useMutation(downloadCsv, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ Excel: false })
    },
  })

  function handleDownloadExcel() {
    ExcelMutation.mutate({
      sModule: 'WorkLogs',
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
    setExcelFields(ExcelModules.WorkLogs)
  }

  function handleDownloadExcelClose() {
    setModal({ Excel: false })
  }


  return (
    <>
      <Wrapper>
        <PageTitle
          title="Work Log"
          BtnText={isGranted(permissions.CREATE) ? 'Add Work-Log' : null}
          handleExcelEvent={isGranted(permissions.EXCEL) ? handleDownloadExcelOpen : null}
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
            <Select
              placeholder={'Project'}
              value={filters['project']}
              tooltip={(v) => v?.sName}
              width={190}
              getOptionLabel={(option) => option.sName}
              getOptionValue={(option) => option._id}
              errorDisable
              options={[{ _id: 'all', sName: 'All projects' }, ...filterProjects]}
              isLoading={getDetail('projectOfUserLoggedIn')?.isLoading}
              fetchMoreData={() => handleScroll('projectOfUserLoggedIn')}
              onInputChange={(s) => handleSearchDetail('projectOfUserLoggedIn', s)}
              onChange={(e, options) => handleFilter(e, 'project', options)}
            />{' '}
            <div style={{ width: 180 }}>
              <CalendarInput
                value={filters['date']?._id || null}
                disableError
                onChange={(e) => handleFilter({ _id: e.target.value, sName: e.target.value }, 'date')}
              />
            </div>
          </div>
        </div>
        <Divider width={'155%'} height="1px" />
        <DataTable
          columns={columns}
          align="left"
          totalData={data?.worklogs?.length}
          isLoading={isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
          actionPadding="25px"
        >
          {data?.worklogs?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
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
          })}
        </DataTable>
      </Wrapper>

      <Wrapper
        className={'py-2'}
      >
        <TablePagination
          currentPage={requestParams?.page || 0}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 20}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      <CustomModal
        modalBodyClassName="p-0 py-2"
        open={modal?.deleteOpen}
        handleClose={() => setModal({ deleteOpen: false })}
        title="Are you Sure?"
      >
        <h6>Are you sure you want to delete?</h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ ...modal, deleteOpen: false })}>
              Cancel
            </Button>
            <Button className="bg-danger" onClick={() => deleteMutation.mutate(modal.id)} loading={deleteMutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>

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

      <WorklogModalContent modal={modal} handleAddModalClose={handleAddModalClose} />
    </>
  )
}
