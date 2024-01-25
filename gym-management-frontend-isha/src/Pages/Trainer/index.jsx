import React, { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { deleteTrainer } from 'Query/Trainer/trainer.mutation'
import { getTrainerList } from 'Query/Trainer/trainer.query'
import Wrapper from 'Components/wrapper'
import PageTitle from 'Components/Page-Title'
import TablePagination from 'Components/Table-pagination'
import CustomModal from 'Components/Modal'
import Divider from 'Components/Divider'
import Button from 'Components/Button'
import DataTable from 'Components/DataTable'
import Search from 'Components/Search'
import ActionColumn from 'Components/ActionColumn'
import { debounce } from 'Hooks/debounce'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { appendParams, cell, isGranted, parseParams, toaster } from 'helpers'
import { route } from 'Routes/route'
import './_trainer.scss'
import { ReactComponent as FilledStar } from 'Assets/Icons/filled-star.svg'

function TrainerList () {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const [modal, setModal] = useState({ open: false })

  const [search, setSearch] = useState(parsedData?.search)

  function getParams () {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
      eUserType: 'T'
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching, data } = useQuery(['trainer', requestParams], () => getTrainerList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })
  const mutation = useMutation(deleteTrainer, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('trainer')
      queryClient.invalidateQueries('subscription')
      queryClient.invalidateQueries('subscriptionDetails')
      toaster(res.data.message)
      setModal({ open: false })
    },
  })

  const columns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Name', connectionName: 'sName', isSorting: false, sort: 0 },
      { name: 'Address', connectionName: 'sAddress', isSorting: false, sort: 0 },
      { name: 'Contact Number', connectionName: 'sMobile', isSorting: false, sort: 0 },
      { name: 'Email ID', connectionName: 'sEmail', isSorting: false, sort: 0 },
      { name: 'Expert Level', connectionName: 'nExpertLevel', isSorting: false, sort: 0 },
      { name: 'Experience', connectionName: 'sExperience', isSorting: false, sort: 0 },
      { name: 'Trainer Type', connectionName: 'eType', isSorting: false, sort: 0 },
    ],
    []
  )

  const navigate = useNavigate()

  function gotoAdd () {
    navigate(route.trainersAddViewEdit('add'))
  }

  function gotoEdit (id) {
    navigate(route.trainersAddViewEdit('edit', id))
  }

  function onDelete (id) {
    setModal({ open: true, id })
  }

  const debouncedSearch = useCallback(
    debounce((trimmed) => {
      setRequestParams({ ...requestParams, page: 0, search: trimmed })
      appendParams({ ...requestParams, page: 0, search: trimmed })
    }),
    []
  )

  function handleSearch (e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed)
  }

  function changePage (page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
  }

  function changePageSize (pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  const permissions = {
    CREATE: 'noRole',
    READ: 'noRole',
    UPDATE: 'noRole',
    DELETE: 'noRole',
    EXCEL: 'noRole',
    get ALL () {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  return (
    <>
      <Wrapper>
        <PageTitle title="Trainers List" BtnText={isGranted(permissions.CREATE) ? 'Add Trainer' : null} handleButtonEvent={gotoAdd} add />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Trainer"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aEmployeeList?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aEmployeeList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item?.sName)}</td>
                <td>{cell(item?.sAddress)}</td>
                <td>{cell(item?.sMobile)}</td>
                <td>{cell(item?.sEmail)}</td>
                <td className='text-center'>{cell(item?.nExpertLevel)} <span className='expert-level'><FilledStar /></span></td>
                <td className='experience'>{cell(item?.sExperience)}</td>
                <td className='type'>{item?.eType === 'Personal' ? <span className='personal'>{cell(item?.eType)}</span> : <span className='general'>{cell(item?.eType)}</span>}</td>
                <ActionColumn
                  permissions={permissions}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => onDelete(item._id)}
                />
              </tr>
            )
          })}
        </DataTable>
      </Wrapper>
      <Wrapper transparent>
        <TablePagination
          currentPage={Number(requestParams?.page)}
          totalCount={data?.count || 0}
          pageSize={requestParams?.limit || 5}
          onPageChange={(page) => changePage(page)}
          onLimitChange={(limit) => changePageSize(limit)}
        />
      </Wrapper>
      <CustomModal modalBodyClassName="p-0 py-2" open={modal.open} handleClose={() => setModal({ open: false })} title="Are you Sure?">
        <h6>
          <p className='delete-info'>
            Deleting this Trainer will result in the removal of all associated data.
          </p>
          Are you sure you want to delete this Trainer?
        </h6>
        <div className="d-flex justify-content-between">
          <div></div>
          <div className="mt-4">
            <Button className="bg-secondary bg-lighten-xl me-2 text-muted" onClick={() => setModal({ open: false })}>
              Cancel
            </Button>
            <Button className='bg-danger' onClick={() => mutation.mutate(modal.id)} loading={mutation.isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  )
}

export default TrainerList
