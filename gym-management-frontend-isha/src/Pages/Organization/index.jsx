import React, { useMemo, useState } from 'react'
import ActionColumn from 'Components/ActionColumn'
import Button from 'Components/Button'
import DataTable from 'Components/DataTable'
import Divider from 'Components/Divider'
import CustomModal from 'Components/Modal'
import PageTitle from 'Components/Page-Title'
import TablePagination from 'Components/Table-pagination'
import Wrapper from 'Components/wrapper'
import { appendParams, cell, isGranted, parseParams, toaster } from 'helpers'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getOrganizationList } from 'Query/Organization/organization.query'
import { deleteOrganization } from 'Query/Organization/organization.mutation'
import { useNavigate } from 'react-router-dom'
import { route } from 'Routes/route'
import './_organization.scss'

function OrganizationList () {
  const queryClient = useQueryClient()
  const parsedData = parseParams(location.search)
  const [modal, setModal] = useState({ open: false })

  function getParams () {
    return {
      page: Number(parsedData?.page) * Number(parsedData?.limit) || 0,
      limit: Number(parsedData?.limit) || 10,
      search: parsedData?.search || '',
      sort: parsedData.sort || '',
      order: parsedData.order || '',
    }
  }
  const [requestParams, setRequestParams] = useState(getParams())

  const { isLoading, isFetching, data } = useQuery(['organizations', requestParams], () => getOrganizationList(requestParams), {
    select: (data) => data.data.data,
    staleTime: 240000,
  })

  const mutation = useMutation(deleteOrganization, {
    onSuccess: (data) => {
      toaster(data.data.message)
      queryClient.invalidateQueries('organizations')
      queryClient.invalidateQueries('subscription')
      queryClient.invalidateQueries('subscriptionDetails')
      queryClient.invalidateQueries('trainer')
      queryClient.invalidateQueries('employees')
      queryClient.invalidateQueries(['trainersDetails', data])
      queryClient.invalidateQueries(['employeesDetails', data])
      queryClient.invalidateQueries('batchschedules')
      queryClient.invalidateQueries(['batchschedulesDetails', data])
      queryClient.invalidateQueries('inquiry')
      queryClient.invalidateQueries(['inquiryDetails', data])
      setModal({ open: false })
    },
  })

  const columns = useMemo(() =>
    [
      { name: '#', connectionName: 'id', isSorting: false, sort: 0 },
      { name: 'Name', connectionName: 'sName', isSorting: false, sort: 0 },
      { name: 'Location', connectionName: 'sLocation', isSorting: false, sort: 0 },
      { name: 'Contact Number', connectionName: 'sMobile', isSorting: false, sort: 0 },
      { name: 'Email ID', connectionName: 'sEmail', isSorting: false, sort: 0 },
      { name: 'Main Branch', connectionName: 'isBranch', isSorting: false, sort: 0 },
    ],
    []
  )

  const navigate = useNavigate()

  function gotoAddOrganization () {
    navigate(route.organizationsAddViewEdit('add'))
  }

  function gotoEdit (id) {
    navigate(route.organizationsAddViewEdit('edit', id))
  }

  function onDelete (id) {
    setModal({ open: true, id })
  }

  function changePage (page) {
    setRequestParams({ ...requestParams, page, limit: requestParams?.limit || 10 })
    appendParams({ ...requestParams, page: page / requestParams?.limit, limit: requestParams?.limit || 10 })
    // setSelectedRows([{ changingPage: true }])
  }

  function changePageSize (pageSize) {
    setRequestParams({ ...requestParams, page: 0, limit: pageSize })
    appendParams({ ...requestParams, page: 0, limit: pageSize })
    // setSelectedRows([{ changingPage: true }])
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
        <PageTitle
          title="Organizations List"
          BtnText={isGranted(permissions.CREATE) ? 'Add Organization' : null}
          handleButtonEvent={gotoAddOrganization}
          add
        />
        <Divider className='mt-3' width={'155%'} height="1px" />

        <DataTable
          columns={columns}
          align="left"
          totalData={data?.aOrganizationList?.length}
          isLoading={isLoading || mutation.isLoading || isFetching}
          // disableActions={!isGranted(permissions.ALL)}
        >
          {data?.aOrganizationList?.map((item, i) => {
            return (
              <tr key={i}>
                <td>{cell(requestParams.page + (i + 1))}</td>
                <td>{cell(item.sName)}</td>
                <td>{cell(item.sLocation)}</td>
                <td>{cell(item.sMobile)}</td>
                <td>{cell(item.sEmail)}</td>
                <td className='status'>{item.isBranch === false ? <span className='active'>Yes</span> : <span className='inactive'>No</span>}</td>
                <ActionColumn
                  permissions={permissions}
                  handleEdit={() => gotoEdit(item._id)}
                  handleDelete={() => item?.isBranch === false ? toaster('You cannot delete the Main branch.', 'error') : onDelete(item._id)}
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
            Deleting this Organization will result in the removal of all associated data.
          </p>
          Are you sure you want to delete this Organization?
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

export default OrganizationList 
