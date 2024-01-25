import React, { useCallback, useState } from 'react'

// component
import ConfirmationModal from 'Components/ConfirmationModal'
import TablePagination from 'Components/Table-pagination'
import ActionColumn from 'Components/ActionColumn'
import PageTitle from 'Components/Page-Title'
import DataTable from 'Components/DataTable'
import CustomModal from 'Components/Modal'
import Divider from 'Components/Divider'
import Wrapper from 'Components/wrapper'
import Search from 'Components/Search'
import Button from 'Components/Button'
import Input from 'Components/Input'

// query
import { addSkill, deleteSkill, updateSkill } from 'Query/Skill/skill.mutation'
import { getSkillById, getSkillList } from 'Query/Skill/skill.query'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { downloadCsv } from 'Query/Employee/employee.mutation'

//helper
import { appendParams, cell, ExcelModules, getSortedColumns, isGranted, mapFilter, parseParams, permissionsName, toaster } from 'helpers'

import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { Controller, useForm } from 'react-hook-form'
import { debounce } from 'Hooks/debounce'
import { Form } from 'react-bootstrap'

export default function SkillManagement() {
  const parsedData = parseParams(location.search)
  const queryClient = useQueryClient()

  const { control, handleSubmit, reset } = useForm()

  const rules = {
    global: (value = 'This field is Required') => ({ required: value }),
  }

  const [requestParams, setRequestParams] = useState(getParams())
  const [search, setSearch] = useState(parsedData?.search)
  const [modal, setModal] = useState({ open: false })
  const [ExcelFields, setExcelFields] = useState([])
  const [columns, setColumns] = useState(
    getSortedColumns(
      [
        { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
        { name: 'Skills', connectionName: 'sName', isSorting: true, sort: 0 },
      ],
      parsedData
    )
  )


  // get Skill
  const { isLoading, isFetching, data } = useQuery(['skills', requestParams], () => getSkillList(requestParams), {
    select: (data) => data?.data?.data,
    staleTime: 10000,
  })

  // get Skill By id
  const { isFetching: skillFetchingById } = useQuery({
    queryKey: ['skillById', modal?.id],
    queryFn: () => getSkillById(modal?.id),
    enabled: !!modal?.id,
    select: (data) => data?.data?.data,
    onSuccess: (data) => {
      reset({
        sName: data?.sName
      })
    }
  })


  // post Skill
  const addMutation = useMutation(addSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries('skills')
      handleClose()
      toaster('Skill Added successfully')
    },
  })

  // update Skill
  const editMutation = useMutation(updateSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries('skills')
      handleClose()
      toaster('Skill Updated Successfully')
      // reset({})
    },
  })

  // delete Skill
  const deleteMutation = useMutation(deleteSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries('skills')
      setModal({ deleteOpen: false })
      toaster('Skill deleted successfully')
    },
  })

  function handleClose() {
    setModal({ open: false })
    setTimeout(() => {
      reset({})
    }, 300)
  }

  function onEdit(id) {
    setModal({ open: true, id })
  }

  function onDelete(id) {
    setModal({ deleteOpen: true, deleteId: id })
  }

  function handleDeleteMutation(id) {
    deleteMutation.mutate(id)
  }

  function handleDeleteClose() {
    setModal({ deleteOpen: false })
  }

  function OnSubmit(e) {
    const { sName } = e

    const data = {
      sName
    }
    if (modal?.id) {
      editMutation.mutate({
        id: modal.id,
        data
      })
    }
    else {
      addMutation.mutate(data)
    }
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



  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }
  const ExcelMutation = useMutation(downloadCsv, {
    onSuccess: (data) => {
      toaster(data.data.message)
      setModal({ Excel: false })
    },
  })

  function handleDownloadExcel() {
    ExcelMutation.mutate({
      sModule: 'Skill',
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
    setExcelFields(ExcelModules.Skill)
  }
  function handleDownloadExcelClose() {
    setModal({ Excel: false })
  }

  const permissions = {
    CREATE: permissionsName.CREATE_SKILL,
    READ: permissionsName.VIEW_SKILL,
    UPDATE: permissionsName.UPDATE_SKILL,
    DELETE: permissionsName.DELETE_SKILL,
    EXCEL: permissionsName.DOWNLOAD_SKILL_EXCEL,
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
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
          title="Skill Management"
          BtnText={isGranted(permissions.CREATE) ? 'Add New Skill' : null}
          handleExcelEvent={isGranted(permissions.EXCEL) ? handleDownloadExcelOpen : null}
          handleButtonEvent={() => setModal({ open: true })}
          add
        />
        <div className="w-100 d-flex justify-content-between align-items-center mt-3">
          <div className="d-flex flex-end">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Skills"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider />

        <DataTable
          columns={columns}
          align="left"
          disableActions={!isGranted(permissions.UPDATE || permissions.DELETE)}
          totalData={data?.skills?.length}
          isLoading={isLoading || isFetching}
          handleSorting={(data) => handleSorting(data)}
          actionPadding="25px"
        >
          {data?.skills?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{item.sName}</td>

                <ActionColumn
                  permissions={permissions}
                  handleEdit={() => onEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
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
          pageSize={requestParams?.limit || 10}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>

      <CustomModal
        modalBodyClassName="p-0 py-2"
        open={modal?.open}
        handleClose={handleClose}
        title={(modal?.id) ? 'Edit Skill' : 'Add Skill'}
        isLoading={skillFetchingById || addMutation?.isLoading || editMutation?.isLoading}
      >
        <Controller
          name='sName'
          control={control}
          rules={rules.global()}
          render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
            <Input
              onChange={onChange}
              value={value || ''}
              ref={ref}
              labelText={'Skill'}
              id={'sName'}
              errorMessage={error?.message}
            />
          )}
        />

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
        title='Are you sure?'
        handleClose={() => handleDeleteClose()}
        handleCancel={() => handleDeleteClose()}
        handleConfirm={() => handleDeleteMutation(modal?.deleteId)}
      >
        <h6>Are you sure you want to delete?</h6>
      </ConfirmationModal>





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

    </>
  )
}
