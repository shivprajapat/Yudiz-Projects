import React, { useCallback, useMemo, useState } from 'react'
import ActionColumn from 'Components/ActionColumn'
import Button from 'Components/Button'
import DataTable from 'Components/DataTable'
import Divider from 'Components/Divider'
import CustomModal from 'Components/Modal'
import PageTitle from 'Components/Page-Title'
import Search from 'Components/Search'
import TablePagination from 'Components/Table-pagination'
import Wrapper from 'Components/wrapper'
import { appendParams, cell, parseParams, toaster } from 'helpers'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getMealPlanList } from 'Query/MealPlan/mealplan.query'
import { deleteMealPlan } from 'Query/MealPlan/mealplan.mutation'
import { ReactComponent as SearchIcon } from 'Assets/Icons/search.svg'
import { useNavigate } from 'react-router-dom'
import { route } from 'Routes/route'
import { debounce } from 'Hooks/debounce'
import './_mealPlan.scss'

function MealPlanList() {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const [modal, setModal] = useState({ open: false })

  const [search, setSearch] = useState(parsedData?.search)

  function getParams() {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData?.sort || '',
      order: parsedData.order || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching, data } = useQuery(['mealPlans', requestParams], () => getMealPlanList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  const mutation = useMutation(deleteMealPlan, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('mealPlans')
      setModal({ open: false })
    },
  })

  const columns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Title', connectionName: 'sTitle', isSorting: false, sort: 0 },
      { name: 'Description', connectionName: 'sDescription', isSorting: false, sort: 0 },
    ],
    []
  )

  const navigate = useNavigate()

  function handleAddMeal() {
    navigate(route?.mealPlansAddViewEdit('add'))
  }

  function gotoEdit(id) {
    // const customerId = data?.aPlanList?.find(item => item?._id === id)?.iCustomerId
    navigate(route?.mealPlansAddViewEdit('edit', id))
  }

  // function gotoDetail(id) {
  //   navigate(route.customersAddViewEdit('view', id))
  // }

  function onDelete(id) {
    setModal({ open: true, id })
  }

  const debouncedSearch = useCallback(
    debounce((trimmed) => {
      setRequestParams({ ...requestParams, page: 0, search: trimmed })
      appendParams({ ...requestParams, page: 0, search: trimmed })
    }),
    []
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearch(e.target.value)
    const trimmed = e.target.value.trim()
    debouncedSearch(trimmed)
  }

  function changePage(page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
  }

  function changePageSize(pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
  }

  const permissions = {
    CREATE: 'noRole',
    READ: 'noRole',
    UPDATE: 'noRole',
    DELETE: 'noRole',
    EXCEL: 'noRole',
    get ALL() {
      return [this.READ, this.UPDATE, this.DELETE]
    },
  }

  return (
    <>
      <Wrapper>
        <PageTitle
          title='Meal Plans List'
          BtnText={'Add Meal'}
          handleButtonEvent={handleAddMeal}
          add
        />
        <div className="w-100 d-flex justify-content-between flex-wrap gap-2 mt-4">
          <div className="d-flex align-items-center">
            <Search
              startIcon={<SearchIcon className="mb-1" />}
              style={{ width: '250px', height: '40px' }}
              placeholder="Search Meal Plan"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <Divider width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aPlanList?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
        // disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aPlanList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td className='d-flex flex-column column-design'>
                  <span>{cell(item?.sTitle)}</span> <span className='display'>Customer: {cell(item.oCustomer?.sName)}</span>
                </td>
                <td className="text-truncate">{cell(item.sDescription)}</td>
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
        <h6>Are you sure you want to delete this Meal Plan?</h6>
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

export default MealPlanList 
